"""스튜디오 자동 검증용 로컬 서버.

design-candidates 를 정적으로 서빙하면서 `/hang` 엔드포인트로 load 이벤트를 붙잡아 둔다.
헤드리스 Chrome 의 --dump-dom 은 load 시점에 DOM 을 덤프하므로, 검사 페이지가
<img src="/hang"> 로 load 를 막아 두고 비동기 검사가 끝나면 그 img 를 제거해 load 를 발화시킨다.
(이 기법 없이는 "실행 중…" 상태의 DOM 만 덤프된다.)

사용법:
    python _studio/tools/testserver.py .            # design-candidates 에서 실행, 기본 8124 포트
    python _studio/tools/testserver.py . 8130       # 포트 지정

    chrome --headless --disable-gpu --dump-dom http://127.0.0.1:8124/_studio/selftest.html
    chrome --headless --disable-gpu --dump-dom http://127.0.0.1:8124/_studio/inttest.html

배포되지 않는다(.vercelignore 가 _studio 를 제외한다).
"""
import os
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8124


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def do_GET(self):
        if self.path.startswith('/hang'):
            time.sleep(60)          # 검사가 끝나면 img 가 제거되어 이 응답은 버려진다
            self.send_response(204)
            self.end_headers()
            return
        return super().do_GET()

    def log_message(self, *a):
        pass                        # 검사 출력이 묻히지 않게 접근 로그를 끈다


if __name__ == '__main__':
    print('serving %s at http://127.0.0.1:%d  (Ctrl+C 로 종료)' % (ROOT, PORT))
    ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
