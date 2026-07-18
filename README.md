# 연세대 기계공학부 사이트 공모전 — 팀 DATUM

연세대학교 기계공학부 홈페이지 경진대회 출품 프로젝트.
이 문서 하나로 **다른 PC에서 이전 대화·작업 내역 없이 바로 이어서 작업**할 수 있도록
전체 구조·실행법·개발 규칙·현재 상태를 정리한다.

## 전략 (2축)

OT 청취 결과 "수정·보수 관리가 용이한가"가 핵심 심사 기준이라고 판단, 두 축으로 진행한다.

| 축 | 내용 | 상태 |
|---|---|---|
| 1축 | 웹사이트 디자인 & 사이트 설계 (`prototype-v3/`) | v3 완성, 추가 개선 예정 |
| 2축 | Admin 계정의 사이트 수정·관리 도구 (`admin/`) | 4기능 완료, 이후 게시·보드·편집 UX 추가 |

## 폴더 구조

```
연세대_사이트 공모전/
├─ 가이드라인/        대회 안내문·참가신청서 원본·OT 정리
├─ 기획_전략/         마스터플레이북·컨셉·레드팀 분석 등 기획 문서 (00_INDEX.md부터 볼 것)
├─ prototype/         1차 시안 (참고용, 더 이상 수정하지 않음)
├─ prototype-v2/      2차 시안 (참고용, 더 이상 수정하지 않음)
├─ prototype-v3/      ★ 최신 사이트 본체 — 편집 대상은 항상 이 폴더
├─ admin/             ★ YSME Admin Studio — 관리자 편집 콘솔 (2축 산출물)
└─ preview_admin/     Admin Studio 스크린샷 (로그인·워크스페이스)
```

## 다른 PC에서 시작하기

1. 저장소 클론: `git clone https://github.com/todo0157/Contest_build.git`
   (이 폴더는 저장소 내 `연세대_사이트 공모전/`에 있다.)
   - 이미 클론된 PC라면 **저장소 루트의 `CLAUDE.md`(멀티 PC git 규칙)** 절차대로
     `git fetch` → ff-merge로 먼저 최신화한다. 커밋은 반드시 이 폴더만
     pathspec으로 지정한다 — 루트에서 `git add -A` 금지.
2. 필요 프로그램: **Chrome 또는 Edge(데스크톱)** 만 있으면 된다. 빌드 도구·npm 불필요.
   폴더 픽커가 안 열리는 환경에서만 Python 3 필요(아래 serve.py).
3. 사이트 확인: `prototype-v3/index.html`을 브라우저로 연다. 끝.
4. Admin Studio 실행: `admin/index.html`을 Chrome/Edge로 연다.
   - 최초 실행 시 관리자 계정 생성 → 「사이트 폴더 열기」→ `prototype-v3` 선택.
   - AI 초안 기능은 [aistudio.google.com](https://aistudio.google.com)에서 무료 API 키
     발급 후 「AI 어시스턴트」 탭에 입력 (키는 코드·저장소에 절대 커밋하지 않는다).
   - 안 열리면: `python admin/serve.py` → http://localhost:8787 자동 오픈.
   - 상세 사용법: **`admin/README.md`**

> **기기 간 데이터 주의**: Admin Studio의 계정·버전 스냅샷·감사 기록·API 키는
> 브라우저 로컬(IndexedDB)에만 저장된다. 다른 PC에서는 계정을 새로 만들고 키를
> 다시 입력해야 하며, 버전 이력은 넘어가지 않는다(감사 기록은 JSON 내보내기로
> 백업 가능). **사이트 파일 자체의 이력은 git이 진실**이므로, 작업 후 커밋·푸시하면
> 어느 PC에서든 동일하게 이어진다.

## 개발 규칙 (반드시 읽을 문서 2개)

1. **`prototype-v3/TEMPLATE.md`** — 사이트 본체 제약. 요지:
   - 순수 HTML + CSS + Vanilla JS. ES 모듈·빌드 도구 금지, `file://`로 직접 열려야 함.
   - 콘텐츠 데이터는 `assets/js/data.js`(`window.YSME`)가 단일 원천(SSOT).
   - 스타일은 디자인 토큰만 사용: 연세 네이비 `#001a38/#002a5c/#003876/#1a5bb0`,
     골드 `#c9a227`, Pretendard + IBM Plex Mono. 이모지 금지, 좌측 정렬.
2. **`admin/ADMIN_SPEC.md`** — Admin Studio 모듈 계약(파일 배치, 로드 순서,
   `Admin.*` API 시그니처, 버스 이벤트, DOM id 목록). admin 코드를 고칠 때 기준.

## Admin Studio 아키텍처 요약 (admin/ 수정 시 필독)

- 서버 없는 정적 SPA. File System Access API(Chrome/Edge)로 사이트 폴더를 직접 읽고 쓴다.
- 계정(PBKDF2-SHA256 15만회)·버전·감사 기록은 IndexedDB `ysme-admin`에 저장.
- **핵심 원리**: "라이브 DOM은 화면, 원본(pristine) DOM이 진실."
  페이지를 열면 모든 요소에 `data-eid`를 부여해 iframe(srcdoc)에 렌더하고,
  편집은 eid로 원본 DOM에 미러링, 저장 시 eid를 제거한 원본을 파일에 쓴다.
  사이트 JS가 런타임에 넣는 상태(`.reveal.in`, `--reveal-delay`, i18n 텍스트,
  aria 토글)는 저장본에 새지 않도록 스크럽한다 — 이 불변식을 깨면 안 된다.
- 보안: AI 초안·버전 미리보기는 `sandbox="allow-scripts"`(null origin) 프레임 렌더,
  콘솔 전체에 meta CSP로 외부 유출 차단. API 키는 로그·버전·감사 기록에 절대 남기지 않는다.
  단 **보드 프레임은 sandbox를 붙이지 않는다** — 편집 캔버스와 같은 신뢰 수준(내 사이트 파일)
  이고, sandbox를 붙이면 부모가 만든 blob: 자산을 못 읽어 빈 화면이 된다.
- 보드 모드(`board.js`): 모든 페이지를 실제 렌더된 iframe 프레임으로 무한 캔버스에 펼치고
  팬·줌으로 훑다가 더블클릭하면 그 페이지를 편집 모드로 연다. 15개를 동시에 렌더하면 브라우저가
  멈추므로 IntersectionObserver로 화면 근처 프레임만 동시 2개까지 순차 렌더한다.
- 모듈(로드 순서): core → store → auth → audit → fs → versions → editor → ai → board →
  github → app → layout. 전부 classic `<script defer>`, 전역 네임스페이스 `Admin.*`.

## 검증 방법 (수정 후 회귀 확인)

- 문법: `node --check admin/js/*.js`
- E2E: headless Chrome `--dump-dom`은 load 직후 덤프되므로, 테스트 페이지에
  `<img src="/hang">`(30초 지연 응답 엔드포인트) 블로커를 두고 테스트 완료 시
  `blocker.remove()`로 load를 발화시키는 기법을 쓴다. 마지막 회귀 23/23 통과
  (sandbox 격리, aria 복원, prototype-v3/index.html 라운드트립 무결성 포함).

## 현재 상태 & 다음 할 일

- [x] 2축 기본: Admin Studio 4기능(비주얼 편집 / Gemini AI 초안 / 버전 롤백 / 계정·감사 기록)
      구현·적대 리뷰 4건 수정·E2E 검증 완료 (2026-07-10, 23/23).
- [x] 2축 확장: GitHub 게시(공동 게시 암호 방식 / 개인 토큰 방식)와 게시 기록 패널,
      패널 폭 조절·접기.
- [x] 2축 확장: 보드 모드(전 페이지 캔버스 개요)와 편집 UX 개선(요소 태그 칩,
      클릭 가능한 요소 경로 브레드크럼, 단축키 세트 + 도움말 모달, 페이지 검색).
- [ ] 2축 확장분 회귀 검증 — 위 4기능 E2E(23/23) 이후 추가된 기능들은 아직 같은 수준의
      E2E 회귀를 돌리지 않았다. 저장본 무결성(data-eid·런타임 클래스 스크럽) 회귀부터 확인할 것.
- [ ] 1축: prototype-v3 디자인·설계 추가 개선.
- [ ] 심사용 데모 시나리오(Admin Studio 시연 동선) 정리.
- [ ] 최종 제출물 패키징.
