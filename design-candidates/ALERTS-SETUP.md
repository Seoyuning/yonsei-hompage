# 공지 메일 알림 — 서버 준비 절차

소식 › 학사 일정의 QR → `subscribe.html` 구독 → 스튜디오에서 공지 「게시」 →
구독자 전원에게 메일. 코드는 전부 들어 있고(`api/alerts.js`), 아래 **환경변수만
채우면 켜진다.** 채우기 전에는 신청 화면이 "서버 설정이 아직 완료되지 않았습니다"를
정중히 안내할 뿐, 사이트의 다른 기능에는 아무 영향이 없다.

## 1) 구독자 저장소 — Upstash Redis (필수, 무료)

Vercel 대시보드 → 프로젝트 `yonsei-me-homepage` → **Storage → Upstash Redis** 생성·연결.
(또는 `vercel integration add upstash`) 연결하면 아래 두 변수가 **자동으로** 들어온다.

| 변수 | 값 |
|---|---|
| `UPSTASH_REDIS_REST_URL` | 자동 |
| `UPSTASH_REDIS_REST_TOKEN` | 자동 |

`KV_REST_API_URL`/`KV_REST_API_TOKEN` 이름으로 들어와도 코드가 인식한다.

## 2) 메일 발송 — 둘 중 하나 (데모는 B 추천)

**A. Resend (Vercel Marketplace)** — `vercel integration add resend` 로 `RESEND_API_KEY` 자동.
단, **도메인을 인증하기 전에는 본인 계정 이메일로만 발송**되므로 교수님들께
실제 메일이 가는 데모에는 못 쓴다. 학부 도메인이 생기면 이쪽이 정식 경로:
`ALERTS_FROM` 에 `기계공학부 <alerts@도메인>` 을 넣는다.

**B. Gmail SMTP (데모 추천)** — 팀 Gmail 로 아무 주소에나 발송된다.
Google 계정 → 보안 → **2단계 인증 켬 → 앱 비밀번호** 발급(16자리) 후:

| 변수 | 값 |
|---|---|
| `SMTP_USER` | 팀 Gmail 주소 |
| `SMTP_PASS` | 앱 비밀번호 16자리 (계정 비밀번호 아님) |

`SMTP_HOST`/`SMTP_PORT` 는 비우면 smtp.gmail.com:465. Gmail 무료 한도는 하루 약 500통.

## 3) 서명 키 (권장)

| 변수 | 값 |
|---|---|
| `ALERTS_SECRET` | 아무 긴 무작위 문자열 (`openssl rand -hex 24` 등) |

비우면 `PUBLISH_PASSCODE` 를 대신 쓰지만, 구독 링크 서명은 따로 두는 편이 안전하다.
`PUBLISH_PASSCODE`(이미 있음)는 발송(notify) 인증에 그대로 쓰인다.

## 4) 확인

환경변수 저장 → 재배포 → 순서대로:

1. `https://yonsei-me-homepage.vercel.app/subscribe.html` 에서 본인 메일로 신청
2. 받은 메일의 「구독 시작하기」 클릭 → `state=done` 화면
3. 스튜디오(`?studio=1`)에서 학부 공지 1건 등록 → 「게시」
4. 게시 완료 토스트에 이어 "메일 알림 — 구독자 1명에게…" 토스트, 메일 도착 확인
5. 메일 하단 「수신 해지」 → `state=bye` 화면

## 로컬 검사 (서버·키 없이)

```
node _studio/tools/t-alerts-api.mjs        # 서버 로직 24검사 (가짜 Redis·SMTP)
python3 _studio/tools/testserver.py . 8124 # 후 브라우저로
#   /_studio/t-alerts.html                 # 스튜디오 연동 9검사
```

## 안전장치 (구현되어 있음)

- 이중 확인(더블 옵트인) — 확인 링크를 누른 주소만 저장된다
- 링크는 `HMAC(ALERTS_SECRET, email)` 서명 — 위조 불가, 서버에 토큰 저장 없음
- IP 당 1분 5회 · 같은 주소 5분 쿨다운 · notify 1회 500명 상한
- notify 는 게시 공용 암호 검증(상수시간 비교) — 스튜디오만 부를 수 있다
- 메일 본문의 공지 제목은 HTML 이스케이프 — 스크립트 주입 불가
- 모든 비밀은 서버 환경변수에만 있고 브라우저에는 내려가지 않는다
