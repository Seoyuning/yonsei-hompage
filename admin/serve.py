#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
YSME Admin Studio 로컬 서버 (표준 라이브러리 전용)

file:// 로 admin/index.html 을 열면 브라우저 보안 정책 때문에 폴더 선택
(File System Access API)이나 fetch 가 막히는 경우가 있다. 이 스크립트는
프로젝트 루트를 http://localhost:8787 로 서빙하고 관리자 콘솔을 자동으로 연다.

실행:  python admin/serve.py   (또는 admin 폴더 안에서  python serve.py)
종료:  터미널에서 Ctrl+C
"""

import http.server
import os
import socketserver
import sys
import webbrowser

PORT = 8787
# 스크립트는 admin/ 안에 있으므로, 부모 폴더(프로젝트 루트)를 서빙한다.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# 콘솔 진입 경로(프로젝트 루트 기준 admin/index.html)
OPEN_PATH = "/admin/index.html"


class Handler(http.server.SimpleHTTPRequestHandler):
    """프로젝트 루트를 문서 루트로 고정하고 로그를 간결하게 출력한다."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, fmt, *args):
        sys.stdout.write("  %s\n" % (fmt % args))


def main():
    # 포트 재사용 허용(직전 종료 후 곧바로 재실행해도 바인딩 실패 방지)
    socketserver.TCPServer.allow_reuse_address = True

    url = "http://localhost:%d%s" % (PORT, OPEN_PATH)

    try:
        with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
            print("=" * 56)
            print(" YSME Admin Studio 로컬 서버")
            print("=" * 56)
            print(" 서빙 폴더 : %s" % ROOT)
            print(" 주소      : %s" % url)
            print(" 종료      : Ctrl+C")
            print("-" * 56)
            print(" 브라우저가 자동으로 열리지 않으면 위 주소를 Chrome 또는")
            print(" Edge 주소창에 직접 붙여넣으세요.")
            print("=" * 56)

            # 기본 브라우저로 관리자 콘솔 열기
            try:
                webbrowser.open(url)
            except Exception:
                pass

            httpd.serve_forever()
    except OSError as exc:
        # 대개 포트가 이미 사용 중인 경우
        print("서버를 시작할 수 없습니다: %s" % exc)
        print("%d번 포트가 이미 사용 중이라면 기존 서버를 종료한 뒤 다시 실행하세요." % PORT)
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n서버를 종료했습니다.")


if __name__ == "__main__":
    main()
