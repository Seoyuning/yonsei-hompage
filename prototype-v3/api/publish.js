/* Vercel 서버리스 함수 — YSME 공동 게시 프록시.
   GitHub 쓰기 토큰을 서버(env)에만 보관하고, 관리자는 공용 암호 + 본인 이름만으로
   게시한다. 브라우저엔 토큰이 절대 내려가지 않는다.

   필요한 환경변수(Vercel Project Settings → Environment Variables):
     GH_TOKEN         GitHub fine-grained PAT (Contents: read/write, 해당 저장소)
     GH_OWNER         예: todo0157
     GH_REPO          예: yonsei-me-homepage-competition
     GH_BRANCH        예: main (기본 main)
     GH_BASEPATH      예: prototype-v3 (저장소 기준 사이트 폴더)
     PUBLISH_PASSCODE 관리자 공용 암호
     GH_AUTHOR_EMAIL  (선택) 커밋에 쓸 공용 이메일 (기본 noreply)

   요청(POST JSON):
     { passcode, action: "publish"|"history", path, content, author }
*/
module.exports = async (req, res) => {
  // ── CORS (Admin Studio는 localhost/file 등 다른 오리진에서 호출) ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST 요청만 허용됩니다.' }); return; }

  var env = process.env;
  var GH_TOKEN = env.GH_TOKEN, GH_OWNER = env.GH_OWNER, GH_REPO = env.GH_REPO;
  var GH_BRANCH = env.GH_BRANCH || 'main';
  var GH_BASEPATH = env.GH_BASEPATH || '';
  var PASSCODE = env.PUBLISH_PASSCODE;
  var AUTHOR_EMAIL = env.GH_AUTHOR_EMAIL || 'ysme-admin@users.noreply.github.com';

  if (!GH_TOKEN || !GH_OWNER || !GH_REPO || !PASSCODE) {
    res.status(500).json({ error: '서버 설정이 완료되지 않았습니다. 관리자에게 env 설정을 요청하세요.' });
    return;
  }

  var body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  // ── 공용 암호 검증(상수시간) ──
  if (!body.passcode || !safeEqual(String(body.passcode), String(PASSCODE))) {
    res.status(401).json({ error: '공용 암호가 올바르지 않습니다.' });
    return;
  }

  var action = body.action || 'publish';
  var sitePath = String(body.path == null ? '' : body.path).replace(/^\/+/, '');
  var repoPath = (GH_BASEPATH ? GH_BASEPATH.replace(/^\/+|\/+$/g, '') + '/' : '') + sitePath;
  var encPath = repoPath.split('/').map(encodeURIComponent).join('/');

  function gh(p, opts) {
    opts = opts || {};
    var headers = Object.assign({
      'Authorization': 'Bearer ' + GH_TOKEN,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }, opts.headers || {});
    return fetch('https://api.github.com' + p, { method: opts.method || 'GET', headers: headers, body: opts.body });
  }

  try {
    // ── 게시 기록 ──
    if (action === 'history') {
      var hr = await gh('/repos/' + GH_OWNER + '/' + GH_REPO + '/commits?sha=' +
        encodeURIComponent(GH_BRANCH) + '&path=' + encodeURIComponent(repoPath) + '&per_page=20');
      if (!hr.ok) { res.status(hr.status).json({ error: '게시 기록 조회 실패 (' + hr.status + ')' }); return; }
      var commits = await hr.json();
      res.status(200).json({
        commits: (commits || []).map(function (c) {
          return {
            sha: c.sha,
            message: c.commit && c.commit.message,
            author: (c.commit && c.commit.author && c.commit.author.name) || (c.author && c.author.login) || '',
            date: c.commit && c.commit.author && c.commit.author.date,
            html_url: c.html_url
          };
        })
      });
      return;
    }

    // ── 게시(커밋) ──
    if (!sitePath || body.content == null) { res.status(400).json({ error: 'path·content가 필요합니다.' }); return; }
    var author = String(body.author == null ? '' : body.author).trim();
    if (!author) { res.status(400).json({ error: '게시자 이름을 입력하세요.' }); return; }

    // 현재 sha
    var sha = null;
    var cr = await gh('/repos/' + GH_OWNER + '/' + GH_REPO + '/contents/' + encPath + '?ref=' + encodeURIComponent(GH_BRANCH));
    if (cr.ok) { var cd = await cr.json(); sha = (cd && cd.sha) || null; }
    else if (cr.status !== 404) { res.status(cr.status).json({ error: '파일 상태 조회 실패 (' + cr.status + ')' }); return; }

    var putBody = {
      message: 'YSME 게시: ' + sitePath + ' (' + author + ')',
      content: Buffer.from(String(body.content), 'utf8').toString('base64'),
      branch: GH_BRANCH,
      author: { name: author, email: AUTHOR_EMAIL },
      committer: { name: author, email: AUTHOR_EMAIL }
    };
    if (sha) putBody.sha = sha;

    var pr = await gh('/repos/' + GH_OWNER + '/' + GH_REPO + '/contents/' + encPath, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(putBody)
    });
    if (!pr.ok) {
      var e = await pr.json().catch(function () { return {}; });
      var msg = pr.status === 409
        ? '충돌: 다른 사람이 먼저 게시했습니다. 최신본을 확인한 뒤 다시 시도하세요.'
        : ('게시 실패 (' + pr.status + ')' + (e && e.message ? ' — ' + e.message : ''));
      res.status(pr.status).json({ error: msg });
      return;
    }
    var out = await pr.json();
    res.status(200).json({ ok: true, commit: out.commit ? { sha: out.commit.sha, html_url: out.commit.html_url } : null });
  } catch (err) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 상수시간 비교(길이 노출 최소화)
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  var d = 0;
  for (var i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
