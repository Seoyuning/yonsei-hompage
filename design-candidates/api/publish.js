/* Vercel 서버리스 함수 — YSME In-Place Studio 파일 백엔드.

   GitHub 쓰기 토큰을 서버(env)에만 두고, 편집자는 공용 암호 + 본인 이름만으로
   읽고 쓴다. 브라우저엔 토큰이 절대 내려가지 않는다.
   이 함수는 사이트와 **같은 오리진**에서만 호출된다 — CORS 헤더를 주지 않는다.

   필요한 환경변수 (Vercel Project Settings → Environment Variables):
     GH_TOKEN         fine-grained PAT (이 저장소 Contents: read/write 만)
     GH_OWNER         예: todo0157
     GH_REPO          예: yonsei-me-homepage-competition
     GH_BRANCH        예: main (기본 main)
     GH_BASEPATH      예: design-candidates (저장소 기준 사이트 폴더)
     PUBLISH_PASSCODE 편집자 공용 암호
     GH_AUTHOR_EMAIL  (선택) 커밋에 쓸 공용 이메일

   요청 (POST JSON) — 자세한 계약은 ../STUDIO_SPEC.md 2절:
     { passcode, action, … }
       auth        → { ok, branch, headSha }
       list        → { pages, assets, headSha }
       read        { path, ref? }                     → { content, blobSha, ref }
       commit      { message, files[], deletions?, author, baseSha? }
                                                      → { commit:{sha,html_url}, headSha }  (충돌 409)
       history     { path?, limit? }                  → { commits[] }
       checkpoints                                    → { items[] }

   commit 은 Git Trees API 로 **여러 파일을 커밋 1개**에 담는다(원자적 게시).
   Vercel 요청 본문 상한(약 4.5MB) 때문에 큰 바이너리는 한 번에 여러 개 올리지 않는다.
*/

var WRITE_EXT = ['html', 'htm', 'css', 'js', 'json', 'svg', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'ico', 'txt', 'md',
  // 공지 첨부 파일 — posts 패널이 assets/files/ 아래로 올린다
  'pdf', 'hwp', 'hwpx', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip'];
var CHECKPOINT_PATH = '_studio/checkpoints.json';

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST 요청만 허용됩니다.' }); return; }

  var env = process.env;
  var GH_TOKEN = env.GH_TOKEN, GH_OWNER = env.GH_OWNER, GH_REPO = env.GH_REPO;
  var GH_BRANCH = env.GH_BRANCH || 'main';
  var BASE = String(env.GH_BASEPATH || '').replace(/^\/+|\/+$/g, '');
  var PASSCODE = env.PUBLISH_PASSCODE;
  var AUTHOR_EMAIL = env.GH_AUTHOR_EMAIL || 'ysme-admin@users.noreply.github.com';

  if (!GH_TOKEN || !GH_OWNER || !GH_REPO || !PASSCODE) {
    res.status(500).json({ error: '서버 설정이 완료되지 않았습니다(GH_TOKEN·GH_OWNER·GH_REPO·PUBLISH_PASSCODE).' });
    return;
  }

  var body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  // ── 공용 암호 검증(상수시간 + 실패 지연) ──
  if (!body.passcode || !safeEqual(String(body.passcode), String(PASSCODE))) {
    await sleep(400);
    res.status(401).json({ error: '공용 암호가 올바르지 않습니다.' });
    return;
  }

  /* ── 깃헙 연결 덮어쓰기 ──
     인수인계 뒤 학부가 자기 저장소로 게시하도록, 관리 화면(ghset)에서 정한
     연결을 Redis 에 두고 환경변수보다 먼저 쓴다. Redis 가 없으면 env 그대로. */
  var R_URL = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL || '';
  var R_TOK = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN || '';
  var GHCFG_KEY = 'ysme:ghcfg';
  async function redis(cmd) {
    if (!R_URL || !R_TOK) return null;
    try {
      var r = await fetch(R_URL, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + R_TOK, 'Content-Type': 'application/json' },
        body: JSON.stringify(cmd)
      });
      var d = await r.json().catch(function () { return null; });
      return r.ok ? d : null;
    } catch (e) { return null; }
  }
  var GHC = null;
  if (R_URL && R_TOK) {
    var rawCfg = await redis(['GET', GHCFG_KEY]);
    if (rawCfg && typeof rawCfg.result === 'string') {
      try { GHC = JSON.parse(rawCfg.result); } catch (e) { GHC = null; }
    }
  }
  if (GHC && GHC.owner && GHC.repo) {
    GH_OWNER = String(GHC.owner);
    GH_REPO = String(GHC.repo);
    GH_BRANCH = String(GHC.branch || 'main');
    if (GHC.base != null) BASE = String(GHC.base).replace(/^\/+|\/+$/g, '');
    if (GHC.token) GH_TOKEN = String(GHC.token);
  }
  var GH_SOURCE = (GHC && GHC.owner && GHC.repo) ? 'custom' : 'env';

  var REPO = '/repos/' + GH_OWNER + '/' + GH_REPO;

  function gh(p, opts) {
    opts = opts || {};
    var headers = Object.assign({
      'Authorization': 'Bearer ' + GH_TOKEN,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'ysme-studio'
    }, opts.headers || {});
    return fetch('https://api.github.com' + p, { method: opts.method || 'GET', headers: headers, body: opts.body });
  }
  async function ghJson(p, opts) {
    var r = await gh(p, opts);
    var d = null;
    try { d = await r.json(); } catch (e) { d = null; }
    return { ok: r.ok, status: r.status, data: d };
  }
  function repoPathOf(sitePath) { return (BASE ? BASE + '/' : '') + sitePath; }
  function encodePath(p) { return p.split('/').map(encodeURIComponent).join('/'); }

  // 사이트 폴더 기준 상대경로 검증 — 탈출·이상 문자·확장자
  function normPath(raw, needExt) {
    var p = String(raw == null ? '' : raw).replace(/^\/+/, '').trim();
    if (!p) return { error: 'path가 필요합니다.' };
    if (p.length > 240) return { error: '경로가 너무 깁니다.' };
    if (/(^|\/)\.\.(\/|$)/.test(p) || /\/\//.test(p) || /\/$/.test(p)) return { error: '경로가 올바르지 않습니다.' };
    // 선행 '_' 를 허용한다 — 체크포인트 매니페스트가 _studio/checkpoints.json 이다.
    if (!/^[A-Za-z0-9_][A-Za-z0-9._/-]*$/.test(p)) return { error: '경로에 허용되지 않는 문자가 있습니다: ' + p };
    if (needExt) {
      var ext = (p.split('.').pop() || '').toLowerCase();
      if (WRITE_EXT.indexOf(ext) < 0) return { error: '쓰기가 허용되지 않는 확장자입니다: .' + ext };
    }
    return { path: p };
  }

  async function headSha() {
    var r = await ghJson(REPO + '/git/ref/heads/' + encodeURIComponent(GH_BRANCH));
    if (!r.ok) return { error: '브랜치 조회 실패 (' + r.status + ')', status: r.status };
    return { sha: r.data && r.data.object && r.data.object.sha };
  }

  /* base..head 사이가 전부 자동배포 트리거 커밋(빈 커밋)인가 —
     하나라도 확인이 안 되면 false 로 두어 정상 충돌 처리로 물러난다. */
  async function onlyTriggerCommits(base, head) {
    if (!/^[0-9a-f]{7,40}$/i.test(base)) return false;
    var r = await ghJson(REPO + '/compare/' + encodeURIComponent(base) + '...' + encodeURIComponent(head));
    if (!r.ok || !r.data || r.data.status !== 'ahead') return false;
    var cs = r.data.commits || [];
    if (!cs.length || cs.length > 20) return false;
    for (var i = 0; i < cs.length; i++) {
      var m = (cs[i] && cs[i].commit && cs[i].commit.message) || '';
      if (m.indexOf('[auto-deploy-trigger]') < 0) return false;
    }
    return true;
  }

  async function readFileAt(sitePath, ref) {
    var enc = encodePath(repoPathOf(sitePath));
    var r = await ghJson(REPO + '/contents/' + enc + '?ref=' + encodeURIComponent(ref));
    if (r.status === 404) return { notFound: true };
    if (!r.ok) return { error: '파일 읽기 실패 (' + r.status + ')', status: r.status };
    var d = r.data || {};
    if (d.encoding === 'base64' && typeof d.content === 'string') {
      return { content: Buffer.from(d.content, 'base64').toString('utf8'), blobSha: d.sha };
    }
    // 1MB 초과 → Blob API 로 우회
    if (d.sha) {
      var br = await gh(REPO + '/git/blobs/' + d.sha, { headers: { 'Accept': 'application/vnd.github.raw' } });
      if (!br.ok) return { error: '큰 파일 읽기 실패 (' + br.status + ')', status: br.status };
      return { content: await br.text(), blobSha: d.sha };
    }
    return { error: '파일 내용을 해석할 수 없습니다.' };
  }

  try {
    var action = String(body.action || 'auth');

    /* ── auth : 암호 확인만 ── */
    if (action === 'auth') {
      var h0 = await headSha();
      if (h0.error) { res.status(h0.status || 502).json({ error: h0.error }); return; }
      res.status(200).json({
        ok: true, branch: GH_BRANCH, basePath: BASE, headSha: h0.sha,
        // 깃헙 관리 패널이 「어디에 커밋되는가」를 보여 주는 데 쓴다 — 토큰은 내려가지 않는다
        repo: GH_OWNER + '/' + GH_REPO,
        repoUrl: 'https://github.com/' + GH_OWNER + '/' + GH_REPO,
        source: GH_SOURCE,                     // env = 환경변수 · custom = 관리 화면에서 설정
        canStore: !!(R_URL && R_TOK),          // 화면에서 연결을 바꿀 수 있는가(Redis 유무)
        tokenSet: !!(GHC && GHC.token)         // 직접 설정에 자체 토큰이 있는가
      });
      return;
    }

    /* ── ghset / ghreset : 게시가 커밋될 깃헙 연결을 화면에서 바꾼다 ──
       검증(저장소 존재·push 권한·브랜치 존재)에 성공해야만 저장한다.
       토큰을 비우면 기존 토큰(직접 설정분 또는 환경변수)을 그대로 쓴다.
       응답에 토큰은 절대 싣지 않는다. */
    if (action === 'ghset' || action === 'ghreset') {
      if (!R_URL || !R_TOK) {
        res.status(400).json({ error: '서버에 설정 저장소(Upstash Redis)가 연결되어 있지 않아 화면에서는 바꿀 수 없습니다. Vercel 환경변수(GH_OWNER·GH_REPO·GH_BRANCH·GH_TOKEN)로 변경하세요.' });
        return;
      }
      if (action === 'ghreset') {
        await redis(['DEL', GHCFG_KEY]);
        res.status(200).json({
          ok: true, source: 'env',
          repo: env.GH_OWNER + '/' + env.GH_REPO,
          repoUrl: 'https://github.com/' + env.GH_OWNER + '/' + env.GH_REPO,
          branch: env.GH_BRANCH || 'main',
          basePath: String(env.GH_BASEPATH || '').replace(/^\/+|\/+$/g, '')
        });
        return;
      }
      var nOwner = String(body.owner || '').trim();
      var nRepo = String(body.repo || '').trim();
      var nBranch = String(body.branch || 'main').trim();
      var nBase = String(body.basePath == null ? BASE : body.basePath).trim().replace(/^\/+|\/+$/g, '');
      var nToken = String(body.token || '').trim();
      if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(nOwner)) { res.status(400).json({ error: '소유자(owner) 이름이 올바르지 않습니다.' }); return; }
      if (!/^[A-Za-z0-9._-]{1,100}$/.test(nRepo)) { res.status(400).json({ error: '저장소 이름이 올바르지 않습니다.' }); return; }
      if (!/^[A-Za-z0-9._/-]{1,80}$/.test(nBranch) || /\.\./.test(nBranch)) { res.status(400).json({ error: '브랜치 이름이 올바르지 않습니다.' }); return; }
      if (nBase && (!/^[A-Za-z0-9._/-]{1,120}$/.test(nBase) || /\.\./.test(nBase))) { res.status(400).json({ error: '사이트 폴더 경로가 올바르지 않습니다.' }); return; }
      if (nToken && !/^[A-Za-z0-9_]{20,255}$/.test(nToken)) { res.status(400).json({ error: '토큰 형식이 올바르지 않습니다.' }); return; }
      var useToken = nToken || (GHC && GHC.token) || env.GH_TOKEN;
      function ghAs(p) {
        return fetch('https://api.github.com' + p, {
          headers: {
            'Authorization': 'Bearer ' + useToken,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'ysme-studio'
          }
        });
      }
      var vr = await ghAs('/repos/' + nOwner + '/' + nRepo);
      if (!vr.ok) {
        res.status(400).json({ error: '저장소를 찾을 수 없거나 이 토큰으로 접근할 수 없습니다 (' + vr.status + '). 소유자·저장소 이름과 토큰 권한을 확인하세요.' });
        return;
      }
      var vd = await vr.json().catch(function () { return {}; });
      if (!vd.permissions || !vd.permissions.push) {
        res.status(400).json({ error: '이 토큰에는 해당 저장소 쓰기(push) 권한이 없습니다. Contents: Read/Write 권한의 토큰을 쓰세요.' });
        return;
      }
      var br0 = await ghAs('/repos/' + nOwner + '/' + nRepo + '/git/ref/heads/' + encodeURIComponent(nBranch));
      if (!br0.ok) {
        res.status(400).json({ error: '브랜치를 찾을 수 없습니다: ' + nBranch });
        return;
      }
      var bd0 = await br0.json().catch(function () { return {}; });
      var saved = {
        owner: nOwner, repo: nRepo, branch: nBranch, base: nBase,
        token: nToken || (GHC && GHC.token) || ''
      };
      var sr = await redis(['SET', GHCFG_KEY, JSON.stringify(saved)]);
      if (!sr) { res.status(502).json({ error: '설정을 저장하지 못했습니다. 잠시 후 다시 시도하세요.' }); return; }
      res.status(200).json({
        ok: true, source: 'custom',
        repo: nOwner + '/' + nRepo,
        repoUrl: 'https://github.com/' + nOwner + '/' + nRepo,
        branch: nBranch, basePath: nBase,
        headSha: bd0 && bd0.object && bd0.object.sha,
        tokenSet: !!saved.token
      });
      return;
    }

    /* ── read : 특정 시점(ref) 파일 읽기 ── */
    if (action === 'read') {
      var np = normPath(body.path, false);
      if (np.error) { res.status(400).json({ error: np.error }); return; }
      var ref = body.ref ? String(body.ref) : GH_BRANCH;
      if (!/^[A-Za-z0-9._\/-]{1,80}$/.test(ref)) { res.status(400).json({ error: 'ref가 올바르지 않습니다.' }); return; }
      var rf = await readFileAt(np.path, ref);
      if (rf.notFound) { res.status(404).json({ error: '파일을 찾을 수 없습니다: ' + np.path }); return; }
      if (rf.error) { res.status(rf.status || 502).json({ error: rf.error }); return; }
      res.status(200).json({ content: rf.content, blobSha: rf.blobSha, ref: ref });
      return;
    }

    /* ── list : 사이트 폴더의 페이지·자산 목록 ── */
    if (action === 'list') {
      var h1 = await headSha();
      if (h1.error) { res.status(h1.status || 502).json({ error: h1.error }); return; }
      var lr = await ghJson(REPO + '/git/trees/' + encodeURIComponent(h1.sha) + '?recursive=1');
      if (!lr.ok) { res.status(lr.status).json({ error: '파일 목록 조회 실패 (' + lr.status + ')' }); return; }
      var tree = (lr.data && lr.data.tree) || [];
      var prefix = BASE ? BASE + '/' : '';
      var pages = [], assets = [];
      for (var i = 0; i < tree.length; i++) {
        var it = tree[i];
        if (!it || it.type !== 'blob' || !it.path) continue;
        if (prefix && it.path.indexOf(prefix) !== 0) continue;
        var rel = prefix ? it.path.slice(prefix.length) : it.path;
        if (!rel || rel.indexOf('_studio/') === 0 || rel.indexOf('api/') === 0 || rel.indexOf('assets/studio/') === 0) continue;
        if (rel.indexOf('/') === -1 && /\.html?$/i.test(rel)) {
          pages.push({ path: rel, name: rel, size: it.size || 0 });
        } else if (/^assets\//.test(rel) && /\.(css|js|json|svg|png|jpe?g|webp|avif|ico)$/i.test(rel)) {
          assets.push({ path: rel, name: rel.split('/').pop(), size: it.size || 0 });
        }
      }
      pages.sort(function (a, b) {
        if (a.name === 'index.html') return -1;
        if (b.name === 'index.html') return 1;
        return a.name.localeCompare(b.name);
      });
      assets.sort(function (a, b) { return a.path.localeCompare(b.path); });
      res.status(200).json({ pages: pages, assets: assets, headSha: h1.sha, truncated: !!(lr.data && lr.data.truncated) });
      return;
    }

    /* ── revert : 게시 취소 — 커밋 하나가 바꾼 파일을 직전 상태로 되돌리는 새 커밋 ──
       직전(부모) 시점의 blob sha 를 그대로 새 tree 에 가리킨다. 내용을 오가지 않으니
       이미지·PDF 같은 바이너리도 안전하다. 원 커밋은 이력에 남는다(강제 되감기 아님). */
    if (action === 'revert') {
      var rvSha = String(body.sha || '').trim();
      if (!/^[0-9a-f]{7,40}$/i.test(rvSha)) { res.status(400).json({ error: '되돌릴 커밋이 올바르지 않습니다.' }); return; }
      var ci = await ghJson(REPO + '/commits/' + rvSha);
      if (!ci.ok) { res.status(ci.status).json({ error: '커밋을 찾을 수 없습니다 (' + ci.status + ')' }); return; }
      var cd2 = ci.data || {};
      if (!cd2.parents || cd2.parents.length !== 1) { res.status(400).json({ error: '병합 커밋은 여기서 되돌릴 수 없습니다.' }); return; }
      var parentSha = cd2.parents[0].sha;
      var changed = cd2.files || [];
      if (!changed.length) { res.status(400).json({ error: '이 커밋에는 되돌릴 파일 변경이 없습니다.' }); return; }
      if (changed.length > 60) { res.status(400).json({ error: '바꾼 파일이 60개를 넘어 화면에서 되돌릴 수 없습니다.' }); return; }
      var prefix2 = BASE ? BASE + '/' : '';
      var items2 = [], names2 = [];
      for (var ri = 0; ri < changed.length; ri++) {
        var cf = changed[ri] || {};
        var fp2 = String(cf.filename || '');
        if (prefix2 && fp2.indexOf(prefix2) !== 0) {
          res.status(400).json({ error: '사이트 폴더 밖 파일을 바꾼 커밋이라 여기서 되돌릴 수 없습니다: ' + fp2 });
          return;
        }
        var pc = await ghJson(REPO + '/contents/' + encodePath(fp2) + '?ref=' + encodeURIComponent(parentSha));
        if (pc.status === 404) {
          items2.push({ path: fp2, mode: '100644', type: 'blob', sha: null });   // 그 게시가 새로 만든 파일 → 지운다
        } else if (pc.ok && pc.data && pc.data.sha) {
          items2.push({ path: fp2, mode: '100644', type: 'blob', sha: pc.data.sha });
        } else {
          res.status(pc.status || 502).json({ error: '직전 상태를 읽지 못했습니다: ' + fp2 });
          return;
        }
        names2.push(prefix2 ? fp2.slice(prefix2.length) : fp2);
      }
      var h3 = await headSha();
      if (h3.error) { res.status(h3.status || 502).json({ error: h3.error }); return; }
      if (body.baseSha && String(body.baseSha) !== h3.sha) {
        var benign2 = await onlyTriggerCommits(String(body.baseSha), h3.sha);
        if (!benign2) {
          res.status(409).json({ conflict: true, headSha: h3.sha, error: '다른 사람이 먼저 게시했습니다. 새로고침 후 다시 시도하세요.' });
          return;
        }
      }
      var cr2 = await ghJson(REPO + '/git/commits/' + h3.sha);
      if (!cr2.ok) { res.status(cr2.status).json({ error: '기준 커밋 조회 실패 (' + cr2.status + ')' }); return; }
      var baseTree2 = cr2.data && cr2.data.tree && cr2.data.tree.sha;
      var tr2 = await ghJson(REPO + '/git/trees', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base_tree: baseTree2, tree: items2 })
      });
      if (!tr2.ok) { res.status(tr2.status).json({ error: 'tree 생성 실패 (' + tr2.status + ')' }); return; }
      var rvAuthor = String(body.author == null ? '' : body.author).trim() || '편집자';
      var rvFirst = String((cd2.commit && cd2.commit.message) || '').split('\n')[0].slice(0, 80);
      var ident2 = { name: rvAuthor, email: AUTHOR_EMAIL };
      var mk2 = await ghJson(REPO + '/git/commits', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '게시 취소: ' + rvFirst + ' (' + rvSha.slice(0, 7) + ', ' + rvAuthor + ')',
          tree: tr2.data.sha, parents: [h3.sha], author: ident2, committer: ident2
        })
      });
      if (!mk2.ok) { res.status(mk2.status).json({ error: '커밋 생성 실패 (' + mk2.status + ')' }); return; }
      var up2 = await ghJson(REPO + '/git/refs/heads/' + encodeURIComponent(GH_BRANCH), {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sha: mk2.data.sha, force: false })
      });
      if (!up2.ok) {
        if (up2.status === 422) res.status(409).json({ conflict: true, error: '그 사이 다른 커밋이 올라왔습니다. 다시 시도하세요.' });
        else res.status(up2.status).json({ error: '브랜치 갱신 실패 (' + up2.status + ')' });
        return;
      }
      res.status(200).json({
        ok: true,
        commit: { sha: mk2.data.sha, html_url: 'https://github.com/' + GH_OWNER + '/' + GH_REPO + '/commit/' + mk2.data.sha },
        headSha: mk2.data.sha,
        files: names2
      });
      return;
    }

    /* ── history : 커밋 이력(경로 지정 시 그 파일만) ── */
    if (action === 'history') {
      var q = '?sha=' + encodeURIComponent(GH_BRANCH) + '&per_page=' + clampInt(body.limit, 1, 100, 30);
      if (body.path) {
        var hp = normPath(body.path, false);
        if (hp.error) { res.status(400).json({ error: hp.error }); return; }
        q += '&path=' + encodeURIComponent(repoPathOf(hp.path));
      } else if (BASE) {
        q += '&path=' + encodeURIComponent(BASE);
      }
      var hr = await ghJson(REPO + '/commits' + q);
      if (!hr.ok) { res.status(hr.status).json({ error: '이력 조회 실패 (' + hr.status + ')' }); return; }
      res.status(200).json({
        commits: (hr.data || []).map(function (c) {
          return {
            sha: c.sha,
            message: (c.commit && c.commit.message) || '',
            author: (c.commit && c.commit.author && c.commit.author.name) || (c.author && c.author.login) || '',
            date: c.commit && c.commit.author && c.commit.author.date,
            html_url: c.html_url
          };
        })
      });
      return;
    }

    /* ── checkpoints : 이름 붙인 시점 매니페스트 ── */
    if (action === 'checkpoints') {
      var cf = await readFileAt(CHECKPOINT_PATH, GH_BRANCH);
      if (cf.notFound) { res.status(200).json({ items: [] }); return; }
      if (cf.error) { res.status(cf.status || 502).json({ error: cf.error }); return; }
      var items = [];
      try { var parsed = JSON.parse(cf.content); items = Array.isArray(parsed) ? parsed : (parsed.items || []); }
      catch (e) { items = []; }
      res.status(200).json({ items: items, blobSha: cf.blobSha });
      return;
    }

    /* ── commit : 여러 파일을 커밋 1개로 (원자적 게시) ── */
    if (action === 'commit' || action === 'publish') {
      var author = String(body.author == null ? '' : body.author).trim();
      if (!author) { res.status(400).json({ error: '편집자 이름이 필요합니다.' }); return; }
      if (author.length > 60) { res.status(400).json({ error: '편집자 이름이 너무 깁니다.' }); return; }

      // publish(구버전 단일 파일) 요청도 files 형태로 정규화
      var files = Array.isArray(body.files) ? body.files : (body.path != null && body.content != null
        ? [{ path: body.path, content: body.content, encoding: body.encoding }] : []);
      var deletions = Array.isArray(body.deletions) ? body.deletions : [];
      if (!files.length && !deletions.length) { res.status(400).json({ error: '변경할 파일이 없습니다.' }); return; }
      if (files.length + deletions.length > 60) { res.status(400).json({ error: '한 번에 커밋할 파일이 너무 많습니다(최대 60).' }); return; }

      var entries = [], j;
      for (j = 0; j < files.length; j++) {
        var f = files[j] || {};
        var fp = normPath(f.path, true);
        if (fp.error) { res.status(400).json({ error: fp.error }); return; }
        if (typeof f.content !== 'string') { res.status(400).json({ error: 'content가 필요합니다: ' + fp.path }); return; }
        entries.push({ path: fp.path, content: f.content, base64: f.encoding === 'base64' });
      }
      for (j = 0; j < deletions.length; j++) {
        var dp = normPath(deletions[j], true);
        if (dp.error) { res.status(400).json({ error: dp.error }); return; }
        entries.push({ path: dp.path, del: true });
      }

      // 1) HEAD 확인 + 낙관적 충돌 검사
      var h2 = await headSha();
      if (h2.error) { res.status(h2.status || 502).json({ error: h2.error }); return; }
      if (body.baseSha && String(body.baseSha) !== h2.sha) {
        /* 자동배포 워크플로가 얹는 빈 [auto-deploy-trigger] 커밋만 끼어 있으면
           실제 파일 변경은 없다 — 사람 커밋이 하나라도 섞였을 때만 충돌로 세운다. */
        var benign = await onlyTriggerCommits(String(body.baseSha), h2.sha);
        if (!benign) {
          res.status(409).json({
            conflict: true, headSha: h2.sha,
            error: '다른 사람이 먼저 게시했습니다. 최신본을 확인한 뒤 다시 시도하세요.'
          });
          return;
        }
      }

      // 2) 기준 커밋의 tree
      var cr = await ghJson(REPO + '/git/commits/' + h2.sha);
      if (!cr.ok) { res.status(cr.status).json({ error: '기준 커밋 조회 실패 (' + cr.status + ')' }); return; }
      var baseTree = cr.data && cr.data.tree && cr.data.tree.sha;
      if (!baseTree) { res.status(502).json({ error: '기준 트리를 찾을 수 없습니다.' }); return; }

      // 3) blob 생성 → tree 항목 구성
      var treeItems = [];
      for (j = 0; j < entries.length; j++) {
        var e = entries[j];
        if (e.del) {
          treeItems.push({ path: repoPathOf(e.path), mode: '100644', type: 'blob', sha: null });
          continue;
        }
        var br2 = await ghJson(REPO + '/git/blobs', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(e.base64
            ? { content: String(e.content).replace(/\s/g, ''), encoding: 'base64' }
            : { content: e.content, encoding: 'utf-8' })
        });
        if (!br2.ok) { res.status(br2.status).json({ error: 'blob 생성 실패 (' + br2.status + ') — ' + e.path }); return; }
        treeItems.push({ path: repoPathOf(e.path), mode: '100644', type: 'blob', sha: br2.data.sha });
      }

      // 4) tree → 5) commit → 6) ref 갱신
      var tr = await ghJson(REPO + '/git/trees', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base_tree: baseTree, tree: treeItems })
      });
      if (!tr.ok) { res.status(tr.status).json({ error: 'tree 생성 실패 (' + tr.status + ')' }); return; }

      var msg = String(body.message || '').trim();
      if (!msg) {
        var names = entries.slice(0, 3).map(function (x) { return x.path; }).join(', ');
        msg = 'YSME 게시: ' + names + (entries.length > 3 ? ' 외 ' + (entries.length - 3) + '건' : '') + ' (' + author + ')';
      }
      if (msg.length > 400) msg = msg.slice(0, 400);

      var ident = { name: author, email: AUTHOR_EMAIL };
      var mk = await ghJson(REPO + '/git/commits', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, tree: tr.data.sha, parents: [h2.sha], author: ident, committer: ident })
      });
      if (!mk.ok) { res.status(mk.status).json({ error: '커밋 생성 실패 (' + mk.status + ')' }); return; }

      var up = await ghJson(REPO + '/git/refs/heads/' + encodeURIComponent(GH_BRANCH), {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sha: mk.data.sha, force: false })
      });
      if (!up.ok) {
        if (up.status === 422) {
          res.status(409).json({ conflict: true, error: '그 사이 다른 커밋이 올라왔습니다. 다시 시도하세요.' });
        } else {
          res.status(up.status).json({ error: '브랜치 갱신 실패 (' + up.status + ')' });
        }
        return;
      }

      res.status(200).json({
        ok: true,
        commit: { sha: mk.data.sha, html_url: 'https://github.com/' + GH_OWNER + '/' + GH_REPO + '/commit/' + mk.data.sha },
        headSha: mk.data.sha,
        files: entries.map(function (x) { return x.path; })
      });
      return;
    }

    res.status(400).json({ error: '알 수 없는 action: ' + action });
  } catch (err) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

function clampInt(v, lo, hi, dflt) {
  var n = parseInt(v, 10);
  if (!isFinite(n)) return dflt;
  return Math.max(lo, Math.min(hi, n));
}
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
// 상수시간 비교(길이 노출 최소화)
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  var d = 0;
  for (var i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
