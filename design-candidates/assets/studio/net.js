/* YSME In-Place Studio — API 클라이언트
   /api/publish (파일 I/O·커밋·이력·체크포인트) 와 /api/ai (AI 프록시) 호출.
   계약은 ../../STUDIO_SPEC.md 2·3절. 암호는 세션에서 자동으로 붙는다. */
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.net) return;

  function post(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'omit',
      cache: 'no-store'
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (r.ok) return d;
        var err = new Error((d && d.error) || ('요청 실패 (' + r.status + ')'));
        err.status = r.status;
        err.data = d || {};
        if (r.status === 401) Y.bus.emit('session:invalid', err);
        throw err;
      });
    }, function () {
      var err = new Error('서버에 연결할 수 없습니다. 네트워크를 확인하세요.');
      err.status = 0;
      throw err;
    });
  }

  var net = Y.net = {
    /* 저수준 — passcode 를 자동 첨부 */
    call: function (action, payload, passcode) {
      var body = Object.assign({}, payload || {});
      body.action = action;
      body.passcode = passcode || Y.session.passcode();
      return post(Y.config.api + '/publish', body);
    },

    /* 암호·이름 검증 (게이트에서 세션 없이 호출) */
    auth: function (passcode) { return net.call('auth', {}, passcode); },

    list: function () { return net.call('list', {}); },

    read: function (path, ref) { return net.call('read', { path: path, ref: ref || undefined }); },

    /* files: [{path, content, encoding?}] · deletions: [path] */
    commit: function (opts) {
      return net.call('commit', {
        message: opts.message,
        files: opts.files || [],
        deletions: opts.deletions || [],
        author: opts.author || Y.session.author(),
        baseSha: opts.baseSha || undefined
      });
    },

    history: function (path, limit) { return net.call('history', { path: path || undefined, limit: limit || 30 }); },

    checkpoints: function () { return net.call('checkpoints', {}); },

    /* AI 프록시 — key 는 브라우저가 보관, 서버는 중계만 한다 */
    ai: function (opts) {
      return post(Y.config.api + '/ai', {
        passcode: Y.session.passcode(),
        provider: opts.provider || 'gemini',
        model: opts.model,
        apiKey: opts.apiKey,
        system: opts.system || undefined,
        messages: opts.messages || [],
        json: !!opts.json,
        schema: opts.schema || undefined,
        temperature: opts.temperature,
        maxOutputTokens: opts.maxOutputTokens
      });
    }
  };
})();
