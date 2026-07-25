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

var WRITE_EXT = ['html', 'htm', 'css', 'js', 'json', 'svg', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'ico', 'txt', 'md'];
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
    if (!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(p)) return { error: '경로에 허용되지 않는 문자가 있습니다: ' + p };
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
      res.status(200).json({ ok: true, branch: GH_BRANCH, basePath: BASE, headSha: h0.sha });
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
        res.status(409).json({
          conflict: true, headSha: h2.sha,
          error: '다른 사람이 먼저 게시했습니다. 최신본을 확인한 뒤 다시 시도하세요.'
        });
        return;
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
