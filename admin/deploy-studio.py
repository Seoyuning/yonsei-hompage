#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
admin/deploy-studio.py — 온라인 스튜디오 배포본 생성기 (표준 라이브러리 전용)

admin/(로컬 스튜디오 원본)을 prototype-v3/studio/(온라인 배포본)으로 복사한다.
 · js/*.js, css/*.css 를 그대로 복사
 · index.html 은 <head> 에 online 플래그(window.YSME_ONLINE)와 noindex 를 주입
   → studio 는 계정 대신 공용 암호로 접속하고, 파일을 서버(/api/publish)로 읽고 쓴다.

로컬 admin/ 을 수정한 뒤 이 스크립트를 다시 실행하면 studio/ 가 동기화된다.
prototype-v3/studio/ 외의 파일은 절대 건드리지 않는다.

실행:  python admin/deploy-studio.py
"""

import os
import shutil

ADMIN = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(ADMIN)
SRC_HTML = os.path.join(ADMIN, "index.html")
DST = os.path.join(ROOT, "prototype-v3", "studio")
# 배포 경로. 상대 asset 경로(css/·js/)를 이 절대경로로 바꿔, /studio 를 트레일링
# 슬래시 없이 열어도(브라우저가 base 를 루트로 잡아도) 스타일·스크립트가 안 깨지게 한다.
STUDIO_BASE = "/studio/"

# 배포본 index.html 의 <head> 바로 뒤에 주입할 내용.
# defer 모듈 스크립트보다 먼저 실행되어 remotefs.js/online.js 가 온라인으로 동작한다.
ONLINE_HEAD = (
    "\n<!-- ⚠ 생성 파일: admin/deploy-studio.py 로 만들어짐. 직접 수정하지 말 것 -->\n"
    "<meta name=\"robots\" content=\"noindex,nofollow\" />\n"
    "<script>window.YSME_ONLINE={endpoint:'/api/publish',siteBase:'/',"
    "siteName:'온라인 · prototype-v3'};</script>\n"
)


def reset_dir(path):
    if os.path.isdir(path):
        shutil.rmtree(path)
    os.makedirs(path)


def copy_files(sub, exts):
    src = os.path.join(ADMIN, sub)
    dst = os.path.join(DST, sub)
    os.makedirs(dst, exist_ok=True)
    count = 0
    for name in sorted(os.listdir(src)):
        sp = os.path.join(src, name)
        if os.path.isfile(sp) and name.lower().endswith(exts):
            shutil.copy2(sp, os.path.join(dst, name))
            count += 1
    return count


def build_html():
    with open(SRC_HTML, "r", encoding="utf-8") as f:
        html = f.read()
    if "YSME_ONLINE" not in html:
        # <head> 는 파일에 정확히 한 번 등장 → 그 바로 뒤에 주입
        html = html.replace("<head>", "<head>" + ONLINE_HEAD, 1)
    # 상대 asset 경로 → 절대(/studio/…). '/studio'(슬래시 없음)로 접속해도 안 깨진다.
    html = html.replace('href="css/', 'href="' + STUDIO_BASE + 'css/')
    html = html.replace('src="js/', 'src="' + STUDIO_BASE + 'js/')
    with open(os.path.join(DST, "index.html"), "w", encoding="utf-8", newline="\n") as f:
        f.write(html)


def main():
    reset_dir(DST)
    njs = copy_files("js", (".js",))
    ncss = copy_files("css", (".css",))
    build_html()
    print("=" * 56)
    print(" 온라인 스튜디오 배포본 생성 완료")
    print("=" * 56)
    print(" 대상 : %s" % DST)
    print(" js   : %d개" % njs)
    print(" css  : %d개" % ncss)
    print(" html : index.html (online 플래그 · noindex 주입)")
    print("-" * 56)
    print(" prototype-v3/studio/ 를 커밋·배포하면 …/studio 로 열립니다.")
    print(" admin/ 수정 후에는 이 스크립트를 다시 실행해 동기화하세요.")
    print("=" * 56)


if __name__ == "__main__":
    main()
