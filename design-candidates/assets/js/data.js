/* 연세대학교 기계공학부 — 단일 데이터 소스 (window.YSME)
   교수님 시안 데이터셋 통합본: 교수·연구실·교과(학부/대학원)·이수체계·공지·뉴스·세미나·행사·취업·장학·인스타·메타.
   연구분야 6개 = 교수님 시안 taxonomy(이메일 큐레이션 매핑). file:// 직접 동작. */
window.YSME = {
 "site": {
  "nameKo": "연세대학교 기계공학부",
  "nameEn": "School of Mechanical Engineering, Yonsei University",
  "concept": "機制 · Mechanism in Motion",
  "version": "v2.0",
  "updated": "2026-07-03",
  "address": "(03722) 서울특별시 서대문구 연세로 50 연세대학교 공과대학 기계공학부",
  "tel": {
   "ug": "02-2123-4426",
   "grad": "02-2123-2810",
   "bk21": "02-2123-7817"
  },
  "source": "me.yonsei.ac.kr/me/index.do",
  "verifiedAt": "2026-06-30"
 },
 "datums": [
  {
   "key": "professors",
   "num": 33,
   "label": "전임 교수",
   "source": "faculty_list.do",
   "verifiedAt": "2026-06-30"
  },
  {
   "key": "labs",
   "num": 33,
   "label": "연구실",
   "source": "lab2.do",
   "verifiedAt": "2026-06-30"
  },
  {
   "key": "clusters",
   "num": 6,
   "label": "연구 클러스터",
   "source": "연구실 명칭 기반 자체 분류(8→6 병합)",
   "verifiedAt": "2026-06-30"
  },
  {
   "key": "credits",
   "num": 130,
   "label": "졸업 학점",
   "source": "graduation.do",
   "verifiedAt": "2026-06-30"
  },
  {
   "key": "since",
   "num": 1962,
   "label": "Since",
   "source": "history.do — 1962.12 기계공학과 분리",
   "verifiedAt": "2026-06-30"
  }
 ],
 "clusters": [
  {
   "id": "solid",
   "ko": "역학·재료",
   "en": "Mechanics & Materials",
   "count": 6,
   "desc": "금속·복합재·연성재료가 힘을 받아 어떻게 변형하고 파손되는지 실험과 시뮬레이션으로 규명합니다.",
   "intro": "역학·재료 분야는 금속·복합재·연성재료가 힘을 받을 때 어떻게 변형하고 파손되는지를 전산 시뮬레이션과 정밀 실험으로 규명합니다. 마찰과 마모(트라이볼로지), 파손, 마이크로 스케일의 응력까지 함께 다뤄, 더 가볍고 튼튼하며 오래가는 부품과 구조를 설계합니다.",
   "theme": "mechanics"
  },
  {
   "id": "thermal",
   "ko": "열·유체",
   "en": "Thermal & Fluid Systems",
   "count": 7,
   "desc": "난류·미세유동과 연소·열전달을 해석해 연료전지·수소·배터리처럼 에너지를 다루는 기술을 연구합니다.",
   "intro": "열·유체 분야는 난류와 미세유동의 물리를 전산유체역학(CFD)과 정밀 실험으로 해석합니다. 연소·청정에너지, 열전달, 연료전지·수소·배터리 같은 에너지 변환 기술을 연구하며, 자동차부터 발전과 친환경 모빌리티까지 에너지를 더 효율적으로 다루는 과제를 풉니다.",
   "theme": "thermofluid"
  },
  {
   "id": "dynamics",
   "ko": "동역학·제어",
   "en": "Dynamics & Control",
   "count": 4,
   "desc": "로봇과 자율 시스템이 스스로 감지하고 정밀하게 움직이도록 제어와 메카트로닉스를 연구합니다.",
   "intro": "동역학·제어 분야는 정밀 서보 제어와 광메카트로닉스, 인간 중심 로보틱스, 기계학습 기반 제어를 연구합니다. 기계가 스스로 감지하고 판단하며 정밀하게 움직이도록 만드는 것이 목표로, 로봇과 자율 시스템, 초정밀 구동기, 진동·소음 제어가 핵심 주제입니다.",
   "theme": "control"
  },
  {
   "id": "manufacturing",
   "ko": "설계·제조",
   "en": "Design & Smart Manufacturing",
   "count": 6,
   "desc": "전산 최적설계로 형상을 찾고 정밀·극한 가공으로 구현합니다. 반도체 장비·전기차 같은 첨단 제조를 다룹니다.",
   "intro": "설계·제조 분야는 전산 최적설계로 가장 효율적인 형상을 찾고, 극한·정밀 제조와 생산 메카트로닉스, 지능형 측정·공정으로 이를 정확하게 구현합니다. 반도체 장비, 전기차, 정밀 가공 등 첨단 제조 현장의 기술을 연구합니다.",
   "theme": "design"
  },
  {
   "id": "micro",
   "ko": "마이크로·나노",
   "en": "Micro / Nano Systems",
   "count": 5,
   "desc": "MEMS와 박막·미세가공, 나노 소자·센서로 눈에 보이지 않는 스케일의 구조와 현상을 다룹니다.",
   "intro": "마이크로·나노 분야는 MEMS와 박막·미세가공, 나노 소자·센서 기술로 눈에 보이지 않는 영역의 구조와 현상을 다룹니다. 초정밀 센서와 반도체, 차세대 소자의 토대가 되는 핵심 기술을 연구합니다.",
   "theme": "nano"
  },
  {
   "id": "optics",
   "ko": "바이오·포토닉스",
   "en": "Bio & Photonics",
   "count": 5,
   "desc": "광학·이미징과 바이오칩, 생체역학을 결합해 질병 진단과 의료 광학·바이오 센싱을 연구합니다.",
   "intro": "바이오·포토닉스 분야는 광학·이미징과 분광, 바이오칩과 생체역학, 연성재료 기술을 결합합니다. 질병의 조기 진단과 인체 건강에 기여하는 융합 기술을 연구하며, 의료 광학과 바이오 센싱이 핵심 주제입니다.",
   "theme": "bio"
  }
 ],
 "professors": [
  {
   "id": "kang-keonwook",
   "ko": "강건욱",
   "en": "Keonwook Kang",
   "rank": "부교수",
   "cluster": "solid",
   "labId": "cmm",
   "initial": "강",
   "email": "kwkang75@yonsei.ac.kr",
   "office": "Engineering Building #1, Room 589",
   "phone": "02)2123-2825",
   "titleEn": "Associate Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=H6IAceQ75BsxdEuXLJXMoA%3D%3D&sosokcd=0000405"
  },
  {
   "id": "kang-shinill",
   "ko": "강신일",
   "en": "Shinill Kang",
   "rank": "교수",
   "cluster": "manufacturing",
   "labId": "nanofab",
   "initial": "강",
   "featured": true,
   "email": "snlkang@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C324",
   "phone": "02)2123-2829",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=b1GY5tMdKXn9pcopgnOXuA%3D%3D&sosokcd="
  },
  {
   "id": "kim-kyoungsik",
   "ko": "김경식",
   "en": "Kyoungsik Kim",
   "rank": "교수",
   "cluster": "micro",
   "labId": "optiq",
   "initial": "김",
   "email": "kks@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C317",
   "phone": "02)2123-5815",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=vf2yly2lcmm7EMPsUS2Fvw%3D%3D&sosokcd="
  },
  {
   "id": "kim-daeeun",
   "ko": "김대은",
   "en": "Dae Eun Kim",
   "rank": "교수",
   "cluster": "solid",
   "labId": "tribo",
   "initial": "김",
   "featured": true,
   "email": "kimde@yonsei.ac.kr",
   "office": "Engineering Building #1, Room N202",
   "phone": "02)2123-2822",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=Oc%2BnXOyFIPnaS%2F2tcn0VsQ%3D%3D&sosokcd="
  },
  {
   "id": "kim-seok",
   "ko": "김석",
   "en": "Seok Kim",
   "rank": "부교수",
   "cluster": "manufacturing",
   "labId": "max",
   "initial": "김",
   "email": "seokkim@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C314",
   "phone": "02)2123-4463",
   "titleEn": "Associate Professor",
   "detail": ""
  },
  {
   "id": "kim-youngjoo",
   "ko": "김영주",
   "en": "Young-Joo Kim",
   "rank": "교수",
   "cluster": "optics",
   "labId": "noel",
   "initial": "김",
   "email": "yjkim40@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C316",
   "phone": "02)2123-6852",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=M%2FhpSLUqHMFmyYRpueciEw%3D%3D&sosokcd="
  },
  {
   "id": "kim-yongjun",
   "ko": "김용준",
   "en": "Yong-Jun Kim",
   "rank": "교수",
   "cluster": "micro",
   "labId": "mems",
   "initial": "김",
   "email": "yjk@yonsei.ac.kr",
   "office": "Engineering Building #1, Room A585",
   "phone": "02)2123-2844",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=rF3EfB2KwpYgW%2F3mA9hWYQ%3D%3D&sosokcd="
  },
  {
   "id": "kim-woochul",
   "ko": "김우철",
   "en": "Woochul Kim",
   "rank": "교수",
   "role": "학부장",
   "cluster": "thermal",
   "labId": "atel",
   "initial": "김",
   "featured": true,
   "email": "woochul@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C428",
   "phone": "02)2123-5816",
   "titleEn": "Professor / 학부장",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=MS4QfqRPzaZ5YDrwsETFUA%3D%3D&sosokcd="
  },
  {
   "id": "kim-wonjung",
   "ko": "김원정",
   "en": "Wonjung Kim",
   "rank": "부교수",
   "role": "학부주임교수",
   "cluster": "thermal",
   "labId": "ssfl",
   "initial": "김",
   "email": "wjk@yonsei.ac.kr",
   "office": "",
   "phone": "02)2123-4471",
   "titleEn": "Associate Professor / 학부주임교수",
   "detail": ""
  },
  {
   "id": "kim-jongbaeg",
   "ko": "김종백",
   "en": "Jongbaeg Kim",
   "rank": "교수",
   "cluster": "micro",
   "labId": "nanotrans",
   "initial": "김",
   "email": "kimjb@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C427",
   "phone": "02)2123-2812",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=1RE2La5mkxWHrR7NkNGulA%3D%3D&sosokcd=0000405"
  },
  {
   "id": "kim-haejin",
   "ko": "김해진",
   "en": "Hae-Jin Kim",
   "rank": "부교수",
   "cluster": "micro",
   "labId": "idml",
   "initial": "김",
   "email": "hjk@yonsei.ac.kr",
   "office": "Engineering Building #1, Room N206",
   "phone": "02)2123-2819",
   "titleEn": "Associate Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=pAo4Dx2KA2dkOviAVvwsLQ%3D%3D&sosokcd=0000405"
  },
  {
   "id": "ryu-wonhyoung",
   "ko": "류원형",
   "en": "WonHyoung Ryu",
   "rank": "교수",
   "cluster": "optics",
   "labId": "bes",
   "initial": "류",
   "email": "whryu@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C326",
   "phone": "02)2123-5821",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=FbTFwqvmJtakGUouowJkLQ%3D%3D&sosokcd="
  },
  {
   "id": "min-kyoungmin",
   "ko": "민경민",
   "en": "Kyoungmin Min",
   "rank": "부교수",
   "cluster": "solid",
   "labId": "csai",
   "initial": "민",
   "email": "kmin.min@yonsei.ac.kr",
   "office": "Engineering Building #1, Room N201",
   "phone": "02)2123-4464",
   "titleEn": "Associate Professor",
   "detail": ""
  },
  {
   "id": "min-byungkwon",
   "ko": "민병권",
   "en": "Byung-Kwon Min",
   "rank": "교수",
   "cluster": "manufacturing",
   "labId": "mfgmech",
   "initial": "민",
   "email": "bkmin@yonsei.ac.kr",
   "office": "",
   "phone": "02)2123-5813",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=epVKuTRkwjej3W7%2F8Ob6lA%3D%3D&sosokcd=0000405"
  },
  {
   "id": "park-nocheol",
   "ko": "박노철",
   "en": "No-Cheol Park",
   "rank": "교수",
   "cluster": "dynamics",
   "labId": "optomecha",
   "initial": "박",
   "featured": true,
   "storyPage": "professor.html?id=park-nocheol",
   "email": "pnch@yonsei.ac.kr",
   "office": "Engineering Building #1, Room N311",
   "phone": "02)2123-4530",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=0fw0kb%2Brd1T%2BAnxOWIWCMg%3D%3D&sosokcd="
  },
  {
   "id": "song-soonho",
   "ko": "송순호",
   "en": "Soonho Song",
   "rank": "교수",
   "cluster": "thermal",
   "labId": "ice",
   "initial": "송",
   "email": "soonhosong@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C318",
   "phone": "02)2123-2811",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=EMeDFsg7ezICnj1V655kTw%3D%3D&sosokcd="
  },
  {
   "id": "shin-dongjun",
   "ko": "신동준",
   "en": "Dongjun Shin",
   "rank": "교수",
   "cluster": "dynamics",
   "labId": "hcair",
   "initial": "신",
   "email": "dj.shin@yonsei.ac.kr",
   "office": "Engineering Building #3, Room 426",
   "phone": "02)2123-2826",
   "titleEn": "Professor",
   "detail": ""
  },
  {
   "id": "yang-hyunseok",
   "ko": "양현석",
   "en": "Hyunseok Yang",
   "rank": "교수",
   "cluster": "dynamics",
   "labId": "mss",
   "initial": "양",
   "email": "hsyang@yonsei.ac.kr",
   "office": "Engineering Building#1,Room A584",
   "phone": "02)2123-2824",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=unA5vq9t8ID%2BONEoTLKWKQ%3D%3D&sosokcd=0000405"
  },
  {
   "id": "yoo-jeonghoon",
   "ko": "유정훈",
   "en": "Jeonghoon Yoo",
   "rank": "교수",
   "cluster": "manufacturing",
   "labId": "ssd",
   "initial": "유",
   "email": "yoojh@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C322",
   "phone": "02)2123-2859",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=J7LH67wjoKs7HqFmJNWRwg%3D%3D&sosokcd="
  },
  {
   "id": "yoon-junyoung",
   "ko": "윤준영",
   "en": "Junyoung Yoon",
   "rank": "부교수",
   "cluster": "manufacturing",
   "labId": "mfgmecha",
   "initial": "윤",
   "email": "junyoung.yoon@yonsei.ac.kr",
   "office": "Engineering Building #1, Room N205",
   "phone": "02)2123-2817",
   "titleEn": "Associate Professor",
   "detail": ""
  },
  {
   "id": "lee-namkyu",
   "ko": "이남규",
   "en": "NamKyu Lee",
   "rank": "조교수",
   "cluster": "thermal",
   "labId": "httd",
   "initial": "이",
   "email": "nk.lee@yonsei.ac.kr",
   "office": "Engineering Building #1, Room N207",
   "phone": "",
   "titleEn": "Assistant Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=wLefcjV8lUCv2Zzs9J5RAQ%3D%3D&sosokcd=0000405"
  },
  {
   "id": "lee-jongsoo",
   "ko": "이종수",
   "en": "Jongsoo Lee",
   "rank": "교수",
   "cluster": "manufacturing",
   "labId": "mpdo",
   "initial": "이",
   "email": "jleej@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C323",
   "phone": "02)2123-4474",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=AXk7pPArre7tC15Fk0psVg%3D%3D&sosokcd="
  },
  {
   "id": "lee-joonsang",
   "ko": "이준상",
   "en": "Joon Sang Lee",
   "rank": "교수",
   "cluster": "thermal",
   "labId": "msfd",
   "initial": "이",
   "email": "joonlee@yonsei.ac.kr",
   "office": "Eng 3, 327. 3공학관 327호",
   "phone": "02)2123-5820",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=b2q9%2FrsniLTpqoJPWYQWVA%3D%3D&sosokcd="
  },
  {
   "id": "lee-changhoon",
   "ko": "이창훈",
   "en": "Changhoon Lee",
   "rank": "교수",
   "cluster": "thermal",
   "labId": "turb",
   "initial": "이",
   "email": "clee@yonsei.ac.kr",
   "office": "",
   "phone": "02)2123-2846",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=DRg2MLLATF8Kat2jhI9Ziw%3D%3D&sosokcd=0000405"
  },
  {
   "id": "lee-hyungsuk",
   "ko": "이형석",
   "en": "Hyung-Suk Lee",
   "rank": "교수",
   "cluster": "solid",
   "labId": "biomech",
   "initial": "이",
   "email": "hyungsuk@yonsei.ac.kr",
   "office": "Engineering Building #1, Room A588",
   "phone": "02)2123-5824",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=bk0aGPYdMJPO%2FVyfZRhrHg%3D%3D&sosokcd=0000405"
  },
  {
   "id": "jang-yonghoon",
   "ko": "장용훈",
   "en": "Yong Hoon Jang",
   "rank": "교수",
   "cluster": "solid",
   "labId": "micromech",
   "initial": "장",
   "email": "jyh@yonsei.ac.kr",
   "office": "Engineering Building #1, Room A591",
   "phone": "02)2123-5812, 032)749-3122",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=DotpS%2BViSxK%2FWL4BBUofsA%3D%3D&sosokcd="
  },
  {
   "id": "jun-seongchan",
   "ko": "전성찬",
   "en": "Seong Chan Jun",
   "rank": "교수",
   "cluster": "micro",
   "labId": "nemd",
   "initial": "전",
   "email": "scj@yonsei.ac.kr",
   "office": "Engineering Building #1, Room A587",
   "phone": "02)2123-5817",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=wTKcmb%2F8b6Ols1dO%2B8bByg%3D%3D&sosokcd="
  },
  {
   "id": "chun-heoungjae",
   "ko": "전흥재",
   "en": "Heoung Jae Chun",
   "rank": "교수",
   "cluster": "solid",
   "labId": "isid",
   "initial": "전",
   "featured": true,
   "email": "hjchun@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C325",
   "phone": "02)2123-4827",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=e5X28rITIomg0i%2BF34C3pg%3D%3D&sosokcd="
  },
  {
   "id": "jung-hyoil",
   "ko": "정효일",
   "en": "Hyo-il Jung",
   "rank": "교수",
   "cluster": "optics",
   "labId": "biochip",
   "initial": "정",
   "email": "uridle7@yonsei.ac.kr",
   "office": "Engineering Building #1, Room A592",
   "phone": "02)2123-5814",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=eIbW20vagt1HuZYo4nBWjg%3D%3D&sosokcd="
  },
  {
   "id": "joo-chulmin",
   "ko": "주철민",
   "en": "Chulmin Joo",
   "rank": "교수",
   "cluster": "optics",
   "labId": "cii",
   "initial": "주",
   "featured": true,
   "email": "cjoo@yonsei.ac.kr",
   "office": "Engineering Building C 328",
   "phone": "02)2123-5822",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=bhaCBRF5otdK3WVWoRHYiw%3D%3D&sosokcd=0000405"
  },
  {
   "id": "choi-jongeun",
   "ko": "최종은",
   "en": "Jongeun Choi",
   "rank": "교수",
   "cluster": "dynamics",
   "labId": "mlcs",
   "initial": "최",
   "email": "jongeunchoi@yonsei.ac.kr",
   "office": "",
   "phone": "",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=i8y28rIy7%2Fvf1sq15evoBw%3D%3D&sosokcd=0000405"
  },
  {
   "id": "hyun-jaesang",
   "ko": "현재상",
   "en": "Jae-Sang Hyun",
   "rank": "조교수",
   "cluster": "optics",
   "labId": "hais",
   "initial": "현",
   "email": "hyun.jaesang@yonsei.ac.kr",
   "office": "Engineering Building #3, Room C315",
   "phone": "02)2123-2818",
   "titleEn": "Assistant Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=foH0i4BlWWcsEx6j%2B0Dwqg%3D%3D&sosokcd=0000405"
  },
  {
   "id": "hong-jongsup",
   "ko": "홍종섭",
   "en": "Jongsup Hong",
   "rank": "교수",
   "cluster": "thermal",
   "labId": "sep",
   "initial": "홍",
   "email": "jongsup.hong@yonsei.ac.kr",
   "office": "",
   "phone": "02)2123-4465",
   "titleEn": "Professor",
   "detail": "https://me.yonsei.ac.kr/faculty/name_search.do?mode=view&userId=OqCjCitbqY9SNaY%2FMELsJg%3D%3D&sosokcd=0000405"
  }
 ],
 "professorsSource": {
  "source": "faculty_list.do",
  "verifiedAt": "2026-06-30"
 },
 "professorsEmeritus": [
  {
   "ko": "김천욱",
   "en": "KIM, Cheon Uk",
   "rank": "명예교수",
   "field": "고체역학",
   "term": "1963–2002"
  },
  {
   "ko": "민옥기",
   "en": "MIN, Ok Gi",
   "rank": "명예교수",
   "field": "응용역학",
   "term": "1983–2013"
  },
  {
   "ko": "박영필",
   "en": "PARK, Yeong Pil",
   "rank": "명예교수",
   "field": "동역학 · 기계진동 · 진동제어",
   "term": "1977–2013"
  },
  {
   "ko": "백윤수",
   "en": "BAEK, Yun Su",
   "rank": "명예교수",
   "field": "",
   "term": ""
  },
  {
   "ko": "이강용",
   "en": "LEE, Gang Yong",
   "rank": "명예교수",
   "field": "파괴역학",
   "term": "1980–2012"
  },
  {
   "ko": "이상조",
   "en": "LEE, Sang Jo",
   "rank": "명예교수",
   "field": "생산공학",
   "term": "1986–2019"
  },
  {
   "ko": "이수홍",
   "en": "LEE, Soo Hong",
   "rank": "명예교수",
   "field": "AI CAD/CAM 동시공학설계",
   "term": "1994–2024"
  },
  {
   "ko": "이진호",
   "en": "LEE, Jin Ho",
   "rank": "명예교수",
   "field": "AI CAD/CAM 동시공학설계 · 열공학",
   "term": "1983–2018"
  },
  {
   "ko": "임윤철",
   "en": "LIM, Yun Cheol",
   "rank": "명예교수",
   "field": "AI CAD/CAM 동시공학설계",
   "term": ""
  },
  {
   "ko": "전광민",
   "en": "JEON, Gwang Min",
   "rank": "명예교수",
   "field": "",
   "term": ""
  },
  {
   "ko": "조강래",
   "en": "CHO, Gang Rae",
   "rank": "명예교수",
   "field": "유체역학",
   "term": "1971–2002"
  },
  {
   "ko": "조형희",
   "en": "CHO, Hyeong Hee",
   "rank": "명예교수",
   "field": "",
   "term": ""
  },
  {
   "ko": "주원구",
   "en": "JOO, Won Gu",
   "rank": "명예교수",
   "field": "",
   "term": ""
  },
  {
   "ko": "차성운",
   "en": "CAH, Seong Un",
   "rank": "명예교수",
   "field": "",
   "term": ""
  },
  {
   "ko": "최용제",
   "en": "CHOI, Yong Je",
   "rank": "명예교수",
   "field": "",
   "term": ""
  },
  {
   "ko": "한재원",
   "en": "HAHN, Jae Won",
   "rank": "명예교수",
   "field": "",
   "term": ""
  },
  {
   "ko": "황정호",
   "en": "HWANG, Jeong Ho",
   "rank": "명예교수",
   "field": "",
   "term": ""
  }
 ],
 "professorsEmeritusSource": {
  "source": "professor_list.do?srCategoryId1=958 (국문) · 1185 (영문)",
  "verifiedAt": "2026-07-27",
  "note": "17명 전원. 재직기간·전공이 빈 항목은 공식 사이트에 게재되어 있지 않아 비워 둔다(추정 금지). 전임 33 + 명예·퇴임 17 = 전체 50 으로 건수 검증됨."
 },
 "labs": [
  {
   "id": "cmm",
   "ko": "전산재료역학",
   "en": "Computational Mechanics of Materials",
   "pi": "강건욱",
   "cluster": "solid",
   "loc": "공학관 N204",
   "site": "https://sites.google.com/site/kwkanglab/",
   "video": "https://drive.google.com/file/d/1wPuVgLQfQ6rUszJtn4loqx9ZC7x3-jKN/preview",
   "area": "재료 역학, 분자동역학",
   "areaDetail": "dislocation Dynamics\nmolecular Dynamics of (crystalline) Materials\ncomputational Modeling of Materials\ncomputer-aided material Design\nMulti-scale simulation of crystal plasticity",
   "labLoc": "공학관 N204",
   "labPhone": "02-2123-7426",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/18.png",
   "intern": "O명",
   "internTarget": "재료 역학 분야 연구에 관심이 있고 대학원 수준의 연구 경험을 쌓고 싶은 학부생",
   "internBenefit": "연구 참여 및 멘토링",
   "labName": "Computational Mechanics of Materials Lab.",
   "email": "kwkang75@yonsei.ac.kr",
   "phone": "02-2123-2825"
  },
  {
   "id": "nanofab",
   "ko": "마이크로 나노 응용",
   "en": "Nano Fabrication / Micro Optics",
   "pi": "강신일",
   "cluster": "manufacturing",
   "loc": "공학관 C330",
   "site": "http://nanofab.yonsei.ac.kr/",
   "video": "https://youtu.be/t4BxyHiDGiY",
   "area": "성형가공",
   "areaDetail": "나노생산공학 (Nano Imprinting Lithography, Nano Lithography)\nNano Bio Photonics 응용 기술(Protein Chip, Bio-Medical imaging)\nMicro Optics, Optical MEMS",
   "labLoc": "공학관 C330",
   "labPhone": "02-2123- 2829",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/30.png",
   "intern": "O명",
   "internTarget": "기본적인 반도체 공정을 활용한 나노 및 마이크로 제작 공정 및 설계에 관심이 있는 학부생",
   "internBenefit": "대학원 수준의 연구 경험 및 자체 연구실 공정 경험, 학회 참석 지원, 인턴비 지급",
   "internArea": "1) 자동차, 선박, 항공기에 적용 가능한 나노/마이크로 기능성 표면 연구\n 2) 나노 성형 제작 공정 및 Device design 연구\n 3) 광학 기반 나노 바이오 센서 개발 연구\n 4) 마이크로 옵틱스 및 나노 포토닉스 연구",
   "labName": "Nano Fabrication/Micro Optics Lab.",
   "email": "snlkang@yonsei.ac.kr",
   "phone": "02-2123-2829"
  },
  {
   "id": "optiq",
   "ko": "광학 양자",
   "en": "Optics Quantum",
   "pi": "김경식",
   "cluster": "micro",
   "loc": "공학관 A534",
   "site": "http://opticsme.yonsei.ac.kr/",
   "area": "광학, 메타물질",
   "areaDetail": "Negative refractive-index metamaterials (음굴절률 메타물질)\nSuperresolution photolithography (수퍼분해능 광리소그래피)\nOptical Cloaking (광학 스텔스, 투명망토 기술)\nHigh Precision Optical sensor (광학 초정밀 센서)",
   "labLoc": "공학관 A534",
   "labPhone": "02-2123-7725",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/33.png",
   "intern": "O명",
   "internTarget": "광학 분야 연구에 관심이 있고 대학원 수준의 연구 경험을 쌓고 싶은 학부생",
   "internBenefit": "연구 참여 및 멘토링",
   "labName": "Optics and Metamaterials Lab.",
   "email": "kks@yonsei.ac.kr",
   "phone": "02-2123-5815"
  },
  {
   "id": "tribo",
   "ko": "트라이볼로지",
   "en": "Tribology Research",
   "pi": "김대은",
   "cluster": "solid",
   "loc": "공학관 A491",
   "site": "http://trl.yonsei.ac.kr/",
   "video": "https://youtu.be/rL0kVSdlyHY",
   "area": "마찰역학, Tribology",
   "areaDetail": "Nano/Bio-Tribology\nMicro-Machining\nSurface coatings\nReliability of Precision components",
   "labLoc": "공학관 A491",
   "labPhone": "02-2123-7424",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/32.png",
   "intern": "O명",
   "internTarget": "마찰/마모 기술, 표면공학 관련 연구에 관심 있는 학부생",
   "internArea": "1) 정밀 기계부품의 마찰/마모 거동에 관한 연구\n 2) 기계부품의 표면 특성 고찰에 관한 연구",
   "labName": "Tribology Research Lab",
   "email": "kimde@yonsei.ac.kr",
   "phone": "02-2123-2822"
  },
  {
   "id": "max",
   "ko": "멀티스케일구조설계·극한제조",
   "en": "MAX — Multiscale Architecture & eXtreme Manufacturing",
   "pi": "김석",
   "cluster": "manufacturing",
   "loc": "공학관 C314",
   "site": "https://sites.google.com/view/seoklab/max",
   "intern": "O명",
   "internTarget": "연구 분야 연구에 관심이 있고 대학원 수준의 연구 경험을 쌓고 싶은 학부생",
   "internBenefit": "연구 참여 및 멘토링",
   "labName": "멀티스케일구조설계 및 극한제조연구실",
   "email": "seokkim@yonsei.ac.kr",
   "phone": "02-2123-4463"
  },
  {
   "id": "noel",
   "ko": "나노광전자시스템",
   "en": "Nano-Optoelectronics System",
   "pi": "김영주",
   "cluster": "optics",
   "loc": "공학원 D332",
   "site": "http://nos.yonsei.ac.kr/",
   "area": "나노광소재",
   "areaDetail": "Near-field Optical Application\nHigh Density Information Storages\nSurface Plasmon Phenomena\nNano-Fabrication\nNano Device and Materials",
   "labLoc": "공학원 332D",
   "labPhone": "02-2123-7211",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/31.png",
   "labName": "Nano Optoelectronics System",
   "email": "yjkim40@yonsei.ac.kr",
   "phone": "02-2123-6852"
  },
  {
   "id": "mems",
   "ko": "마이크로시스템",
   "en": "MEMS",
   "pi": "김용준",
   "cluster": "micro",
   "loc": "공학관 A583",
   "site": "http://mems.yonsei.ac.kr/",
   "video": "https://drive.google.com/file/d/1-E4zgeYdmcRBtxDaFRELuveaBp6Q5L5M/preview",
   "area": "MEMS,Packaging",
   "areaDetail": "Micro Sensors and Actuators\nGeneral MEMS/Micromachining\nElectronic Packaging Technology",
   "labLoc": "공학관 A583",
   "labPhone": "02-2123-7212",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/23.png",
   "intern": "3명",
   "internTarget": "반도체 제작 공정 기반의 MEMS(Microelectromechanical systems) 기술로 다양한 센서 제작에 관심이 있고 대학원 수준의 연구 경험을 쌓고 싶은 학부생",
   "internBenefit": "대학원 수준의 연구 경험, 학회 참석 지원",
   "internArea": "1) Environmental monitoring - MEMS 기술을 이용한 대기 중 나노/마이크로 크기 미세먼지 분석 소자 개발\n 2) Microfluidics & Biomedical applications – 미세유체채널 기반의 세포 분류 기술 및 유해 미생물 감지 기술 개발\n 3) Energy harvesting – 인체에서 발생하는 진동 및 열에너지 등 을 전기적 에너지로 변환하여 축척하는 기술 개발\n 4) AI (Artificial Intelligence) – 차세대 센서을 위한 인공지능 기반 지능형 알고리즘 개발",
   "labName": "MEMS Lab.",
   "email": "yjk@yonsei.ac.kr",
   "phone": "02-2123-2844"
  },
  {
   "id": "atel",
   "ko": "어드밴스드 열공학",
   "en": "Advanced ThermoEngineering",
   "pi": "김우철",
   "cluster": "thermal",
   "loc": "공학관 A310",
   "site": "http://atel.yonsei.ac.kr/",
   "video": "https://drive.google.com/file/d/1X3AUNfLahaoD3fixMtU-KpYU77s1HiCN/preview",
   "area": "나노열전달",
   "areaDetail": "Nanoscale Thermal Energy Transport\nNanostructured Thermoelectric Energy Conversion\nOrganic Solar Cells",
   "labLoc": "공학관 A310",
   "labPhone": "02-2123-7849",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/9.png",
   "labName": "어드밴스드 열공학 연구실",
   "email": "woochul@yonsei.ac.kr",
   "phone": "02-2123-5816"
  },
  {
   "id": "ssfl",
   "ko": "미소유체",
   "en": "Small-Scale Fluids",
   "pi": "김원정",
   "cluster": "thermal",
   "loc": "공학관 A386",
   "site": "https://ssfl.yonsei.ac.kr/",
   "labName": "미소유체연구실(Small Scale Fluids Lab.)",
   "email": "wjk@yonsei.ac.kr",
   "phone": "02-2123-4471"
  },
  {
   "id": "nanotrans",
   "ko": "나노기전시스템",
   "en": "Nano Transducers",
   "pi": "김종백",
   "cluster": "micro",
   "loc": "산학협동관 520",
   "site": "http://ntl.yonsei.ac.kr/",
   "video": "https://youtu.be/dCRkFroCc74",
   "area": "MEMS, 나노기전",
   "areaDetail": "Micro Mechatronic systems\nNanoscience\nBio/Optical MEMS\nsystem Dynamics\nMicro/Nano scale Machining",
   "labLoc": "산학협동관 520호",
   "labPhone": "02-2123-7895",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/3.png",
   "intern": "O명",
   "internTarget": "나노/마이크로 기술을 활용한 센서와 액츄에이터의 작동 원리와 설계에 관심이 있고 나아가 실제로 소자를 제작, 분석하는 과정을 경험하고 싶은 학부생",
   "internBenefit": "대학원 수준의 연구 경험, 실험실 환경 활용",
   "internArea": "1) MEMS 의 내구성 향상을 위한 나노소재 응용 기술 \n 2) 다중모드 햅틱 인터페이스 \n 3) 다양한 구조와 메커니즘의 마이크로 시스템 및 유연소자 (flexible device): 가스 센서, 촉각 센서 어레이, 인공방광, 뉴럴 프로브, 삽관압력센서 등",
   "labName": "나노기전시스템 연구실 (Nano Transducers Lab)",
   "email": "kimjb@yonsei.ac.kr",
   "phone": "02-2123-2812"
  },
  {
   "id": "idml",
   "ko": "지능소자공정",
   "en": "Intelligent Device & Manufacturing",
   "pi": "김해진",
   "cluster": "micro",
   "loc": "공학관 N206",
   "site": "https://yslidm.com/",
   "labName": "지능소자공정연구실(Laboratory for Intelligent Device & Manufacturing)",
   "email": "hjk@yonsei.ac.kr",
   "phone": "02-2123-2819"
  },
  {
   "id": "bes",
   "ko": "바이오메디컬·에너지 시스템",
   "en": "Biomedical and Energy System",
   "pi": "류원형",
   "cluster": "optics",
   "loc": "공학관 N105",
   "site": "https://sites.google.com/a/bmesyonsei.com/bmeslab/",
   "video": "https://youtu.be/DmrV8KGZz9U",
   "area": "나노제작기술, 의료기기, 에너지 변환",
   "areaDetail": "Nano-structuring of Biomaterials and Energy Materials\nMicro/Nano-scale Design and Fabrication for Biomedical and Energy applications\nNano-Manufacturing\nMicro-fluidic Drug Delivery, MEMS Tissue Engineering, Bioenergy, hydrogen Devices",
   "labLoc": "공학관 N105",
   "labPhone": "02-2123-7437",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/16.png",
   "labName": "Biomedical and Energy System Lab.",
   "email": "whryu@yonsei.ac.kr",
   "phone": "02-2123-5821"
  },
  {
   "id": "csai",
   "ko": "계산과학–인공지능",
   "en": "Computational Science–AI",
   "pi": "민경민",
   "cluster": "solid",
   "loc": "공학관 N201",
   "site": "https://csailabyonsei.quv.kr/",
   "labName": "계산과학-인공지능 연구실(Computational Science - Artificial Intelligence Lab)",
   "email": "kmin.min@yonsei.ac.kr",
   "phone": "02-2123-4464"
  },
  {
   "id": "mfgmech",
   "ko": "생산·메카트로닉스",
   "en": "Manufacturing & Mechatronics",
   "pi": "민병권",
   "cluster": "manufacturing",
   "loc": "산학협동관 308",
   "site": "http://minlab.yonsei.ac.kr/",
   "area": "생산시스템",
   "areaDetail": "Micro-Nano mechatronics\nMicro-Nano Fabrication and material processing simulation\nReconfigurable Micro systems and Control",
   "labLoc": "산학협동관 308호",
   "labPhone": "02-2123-6611",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/22.png",
   "labName": "Manufacturing & Mechatronics Lab.",
   "email": "bkmin@yonsei.ac.kr",
   "phone": "02-2123-5813"
  },
  {
   "id": "optomecha",
   "ko": "진동·광메카트로닉스",
   "en": "Vibration and Opto-Mechatronics",
   "pi": "박노철",
   "cluster": "dynamics",
   "loc": "공학원 332D",
   "url": "http://optomecha.yonsei.ac.kr",
   "site": "http://optomecha.yonsei.ac.kr/",
   "video": "https://youtu.be/Vi5OucBLUH8",
   "area": "동력학/진동, 광학",
   "areaDetail": "Opto-mechatronics (Nano optical imaging system, Holography)\nVibration and Dynamics (Nuclear power reactor, Information processing devices & components)\nHigh power/High precision actuators",
   "labLoc": "공학원 332D",
   "labPhone": "02-2123-4677",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/14.png",
   "intern": "O명",
   "internTarget": "진동 및 광메카트로닉스 기술에 관심이 있고 대학원 수준의 연구 경험을 쌓고 싶은 학부생",
   "internBenefit": "대학원 수준의 연구 경험, 학회 참석 지원, 인턴비 지급",
   "internArea": "1) Shock and Vibration of Mechanical Structures\n 2) Haptic Feedback Display\n 3) Actuator Design and Control\n 4) Color and Surface Measurement",
   "labName": "진동 및 광메카트로닉스 연구실 (Vibration and Opto-Mechatronics Lab)",
   "email": "pnch@yonsei.ac.kr",
   "phone": "02-2123-4530"
  },
  {
   "id": "ice",
   "ko": "내연기관·청정에너지",
   "en": "ICE & Clean Energy",
   "pi": "송순호",
   "cluster": "thermal",
   "loc": "공학관 A180",
   "url": "http://cleanenergy.yonsei.ac.kr",
   "site": "http://cleanenergy.yonsei.ac.kr/",
   "area": "자동차 배기/에너지",
   "areaDetail": "Automotive Engine Emission Control\nGas Engine for electric power generation\nProduction and applications of hydrogen\nOptical diagnostics",
   "labLoc": "공학관 A180",
   "labPhone": "02-2123-7221",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/4.png",
   "labName": "청정 에너지 연구실",
   "email": "soonhosong@yonsei.ac.kr",
   "phone": "02-2123-2811"
  },
  {
   "id": "hcair",
   "ko": "인간중심AI로보틱스",
   "en": "Human-Centered AI Robotics",
   "pi": "신동준",
   "cluster": "dynamics",
   "loc": "공학관 C426",
   "site": "http://hcr.yonsei.ac.kr/",
   "labLoc": "공학관 C426",
   "labPhone": "02-2123-2826",
   "labName": "Human-Centered Robotics Lab.",
   "email": "dj.shin@yonsei.ac.kr",
   "phone": "02-2123-2826"
  },
  {
   "id": "mss",
   "ko": "정밀제어시스템",
   "en": "Micro Servo System",
   "pi": "양현석",
   "cluster": "dynamics",
   "loc": "공학관 A283",
   "site": "http://mservo.yonsei.ac.kr/",
   "area": "자동제어, 로봇공학",
   "areaDetail": "Precision Servo Control for Information Storage Devices and Mechanical systems\nRobotics Position/Force Control\nMedical Application Robot",
   "labLoc": "공학관 A283",
   "labPhone": "02-2123-7214",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/24.png",
   "labName": "Micro servo system Lab.",
   "email": "hsyang@yonsei.ac.kr",
   "phone": "02-2123-2824"
  },
  {
   "id": "ssd",
   "ko": "전산구조설계",
   "en": "Systematic Structure Design",
   "pi": "유정훈",
   "cluster": "manufacturing",
   "loc": "공학관 C334",
   "site": "http://ssd.yonsei.ac.kr/",
   "video": "https://youtu.be/Y3TfPB8vGow",
   "area": "전산최적설계",
   "areaDetail": "Numerical Analysis and Design in Electromagnetic Fields and Hypervelocity Impact Problems\nStructural Design and Evaluation in Infra-Red Frequency Range",
   "labLoc": "공학관 C334",
   "labPhone": "02-2123-2859",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/12.png",
   "labName": "전산구조설계 연구실",
   "email": "yoojh@yonsei.ac.kr",
   "phone": "02-2123-2859"
  },
  {
   "id": "mfgmecha",
   "ko": "정밀 생산 메카트로닉스",
   "en": "Manufacturing Mechatronics",
   "pi": "윤준영",
   "cluster": "manufacturing",
   "loc": "공학관 A190",
   "video": "https://drive.google.com/file/d/1tZEQSZ6khHt5pT3p8upwsaXvU-3bdt_z/preview",
   "area": "정밀 생산 메카트로닉스",
   "areaDetail": "Intelligent Manufacturing mechatronics and Robotics system Design\nNovel motor Design and fault-Control for electric cars & Intelligent Robots\nmechatronics platform Design and Manufacturing for organ-on-a-Chip\nPrecision system Design and Control",
   "labLoc": "공학관 A190",
   "labPhone": "02-2123-7445",
   "intern": "O명",
   "internTarget": "정밀 생산 메카트로닉스 관련 분야 연구에 관심이 있고 대학원 수준의 연구 경험을 쌓고 싶은 학부생",
   "internBenefit": "대학원 수준의 연구 경험, 학회 참석 지원, 인턴비 지급",
   "internArea": "1) 정밀 생산 메카트로닉스 시스템 설계 기술 개발\n 2) 전자기 구동기(e.g. 모터) 설계 및 제어 기술 개발\n 3) Magnetic Levitation 시스템 설계 및 제어 기술 개발\n 4) 정밀 제어 기술 개발\n 5) 대표적인 적용 분야: 반도체 생산장비, 전기 자동차, Future Transportation, 정밀 생산 제조 장비, Logistics 자동화 시스템 등",
   "labName": "정밀 생산 메카트로닉스 연구실",
   "email": "junyoung.yoon@yonsei.ac.kr",
   "phone": "02-2123-2817"
  },
  {
   "id": "httd",
   "ko": "열전달·열설계",
   "en": "Heat Transfer & Thermal Design",
   "pi": "이남규",
   "cluster": "thermal",
   "loc": "공학관 N207"
  },
  {
   "id": "mpdo",
   "ko": "멀티피직스 최적설계·PHM",
   "en": "Multi-Physics Design Optimization & PHM",
   "pi": "이종수",
   "cluster": "manufacturing",
   "loc": "공학관 A286/C323",
   "site": "http://web.yonsei.ac.kr/medesign",
   "video": "https://drive.google.com/file/d/1jYJr4n2BbGoDcmpRbAv8pbY5ITF_oU8I/preview",
   "area": "최적설계공학",
   "areaDetail": "Design Optimization of Multi-Physics Mechanical systems\nQuality Engineering Design\nFluid-Structure Interactions: Noise, Vibration and Aerodynamics",
   "labLoc": "공학관 C316",
   "labPhone": "02-2123-4474",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/6.png",
   "labName": "최적설계공학 연구실",
   "email": "jleej@yonsei.ac.kr",
   "phone": "02-2123-4474"
  },
  {
   "id": "msfd",
   "ko": "멀티스케일 유체역학",
   "en": "Multi-scale Fluid Dynamics",
   "pi": "이준상",
   "cluster": "thermal",
   "loc": "공학관 A277/N204",
   "site": "https://mfdl.yonsei.ac.kr/",
   "video": "https://youtu.be/39VE42jtsR8",
   "area": "전산유체",
   "areaDetail": "Rheological behavior of colloidal suspension\nMicro/Nano fluidics\nRed blood cell deformation and the development of arterial disease diagnostic method\nDirect Numerical simulation and large eddy simulation",
   "labLoc": "공학관 N204, A277",
   "labPhone": "02-2123-7217",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/28.png",
   "labName": "Multi-scale Fluid Dynamics Lab.",
   "email": "joonlee@yonsei.ac.kr",
   "phone": "02-2123-5820"
  },
  {
   "id": "turb",
   "ko": "난류",
   "en": "Turbulence",
   "pi": "이창훈",
   "cluster": "thermal",
   "loc": "공학관 A178",
   "site": "http://euler.yonsei.ac.kr/",
   "area": "유체역학및난류",
   "areaDetail": "Turbulence\ncomputational Physics\nAir Pollution Modeling",
   "labLoc": "공학관 A178",
   "labPhone": "-",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/34.png",
   "labName": "Turbulence& Environmental Flow Physics Lab.",
   "email": "clee@yonsei.ac.kr",
   "phone": "02-2123-2846"
  },
  {
   "id": "biomech",
   "ko": "생체역학·연성재료",
   "en": "Biomechanics & Soft Materials",
   "pi": "이형석",
   "cluster": "solid",
   "loc": "공학관 A581/N104",
   "site": "http://leelab.yonsei.ac.kr/",
   "video": "https://youtu.be/9PtwLfg8ReE",
   "area": "생체역학",
   "areaDetail": "Mechanical properties of soft Materials\nViscoelasticity of biological Materials\nTissue, cellular, and molecular Engineering\ninstrumentation for biological applications\nMechanotransduction",
   "labLoc": "공학관 A581, N104",
   "labPhone": "02-2123-4624",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/15.png",
   "intern": "O명",
   "internTarget": "융합적 기계공학 기술을 활용한 연성재료 또는 생체시스템 연구에 관심이 있고 대학원 수준의 연구 경험을 쌓고 싶은 학부생",
   "internBenefit": "대학원 수준의 연구 경험, 학회 참석 지원, 인턴비 지급",
   "internArea": "1) 음향유체를 이용한 선택적 입자 조작 실험과 시뮬레이션\n 2) 반도체와 디스플레이 기기에서의 비접촉 버블 제거\n 3) 표면탄성파를 이용한 생체 조직 프린팅 기술 \n 4) 근육 모사 소프트 액츄에이터 \n 5) 생체 조직 모사칩 개발",
   "labName": "Biomechanics and Soft Material Lab.",
   "email": "hyungsuk@yonsei.ac.kr",
   "phone": "02-2123-5824"
  },
  {
   "id": "micromech",
   "ko": "마이크로역학",
   "en": "Micro Mechanics",
   "pi": "장용훈",
   "cluster": "solid",
   "loc": "공학관 A110",
   "site": "https://web.yonsei.ac.kr/mcmclab2/index1.htm",
   "video": "https://youtu.be/huwuonYI8wY",
   "area": "마이크로역학",
   "areaDetail": "Ultrasonic welding for battery cell electrodes\nElectrical contact resistance in fuel cell stack\nElectrical and Thermal Contacts\nInstabilities in brake/clutch systems\nDesign of transmission components",
   "labLoc": "공학관 A110",
   "labPhone": "02-2123-7220",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/5.png",
   "labName": "마이크로역학 연구실 (MicroMechanics Lab.)",
   "email": "jyh@yonsei.ac.kr",
   "phone": "02-2123-5812"
  },
  {
   "id": "nemd",
   "ko": "나노 융합 소자",
   "en": "NEMD",
   "pi": "전성찬",
   "cluster": "micro",
   "loc": "공학관 N204",
   "site": "http://nemd.yonsei.ac.kr/",
   "video": "https://youtu.be/d1NR13s6doc",
   "area": "나노디바이스",
   "areaDetail": "Nano Electronics & Optics\nCarbon (CNT, Graphene) Electronics  \nEnergy Devices\nNano Gas, Mass, and Bio sensors\nNano Resonator & Nano Machining & Manufacturing",
   "labLoc": "공학관 N204",
   "labPhone": "02-2123-7888",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/29.png",
   "labName": "Nano Electromechancal Device Lab.",
   "email": "scj@yonsei.ac.kr",
   "phone": "02-2123-5817"
  },
  {
   "id": "isid",
   "ko": "지능형 구조·통합설계",
   "en": "Intelligent Structures & Integrated Design",
   "pi": "전흥재",
   "cluster": "solid",
   "loc": "공학관 C332",
   "site": "http://isid.yonsei.ac.kr/",
   "area": "복합재료",
   "areaDetail": "Analysis and Integrated Design of Intelligent and Micro Structures and composite Materials\nTheoretical and Experimental Analysis of Nondestructive Evaluations",
   "labLoc": "공학관 C332",
   "labPhone": "02-2123-7222",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/20.png",
   "labName": "Intelligent Structuresand Integrated Design Lab.",
   "email": "hjchun@yonsei.ac.kr",
   "phone": "02-2123-4827"
  },
  {
   "id": "biochip",
   "ko": "바이오칩",
   "en": "Biochip Technology",
   "pi": "정효일",
   "cluster": "optics",
   "loc": "공학관 A108",
   "site": "http://nanobio.yonsei.ac.kr/",
   "video": "https://youtu.be/GdIw_G1UX-k",
   "area": "생체공학",
   "areaDetail": "체외진단 시스템\n바이오 미세유체역학",
   "labLoc": "공학관 A108",
   "labPhone": "02-2123-7767",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/7.png",
   "labName": "바이오칩 연구실 (Biochip Technology Lab.)",
   "email": "uridle7@yonsei.ac.kr",
   "phone": "02-2123-5814"
  },
  {
   "id": "cii",
   "ko": "산술 광학 영상",
   "en": "Computational Imaging & Instrumentation",
   "pi": "주철민",
   "cluster": "optics",
   "loc": "공학관 N104",
   "site": "http://boilab.wordpress.com/",
   "video": "https://youtu.be/6ykXbisx7g0",
   "area": "바이오/의료 광학, 의료기기",
   "areaDetail": "Biomedical Optics and instrumentation\nAdvanced Optical imaging technologies\nBiosensors\nOptical manupulation of biological systems\nOptical Fabrication and metrology",
   "labLoc": "공학관 N104",
   "labPhone": "02-2123-7706",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/17.png",
   "intern": "O명",
   "internTarget": "광학 기술을 이용한 의료기기 개발 연구에 관심이 있고 대학원 수준의 연구 경험을 쌓고 싶은 학부생",
   "internBenefit": "대학원 수준의 연구 경험, 학회 참석 지원, 인턴비 지급",
   "internArea": "1) 산술 편광 현미경 기술 개발\n 2) Deep learning 기반 초해상도 생체 영상 기술 개발\n 3) 선택적 망막상피세포 치료 모니터링 기술 개발\n 4) 광학적 용혈 감지 기술 개발",
   "labName": "Biomedical Optics & Instrumentation Laboratory",
   "email": "cjoo@yonsei.ac.kr",
   "phone": "02-2123-5822"
  },
  {
   "id": "mlcs",
   "ko": "기계학습·제어 시스템",
   "en": "Machine Learning and Control Systems",
   "pi": "최종은",
   "cluster": "dynamics",
   "loc": "공학관 N206",
   "site": "https://mlcs.yonsei.ac.kr/",
   "video": "https://youtu.be/RBKoYopm2C8",
   "area": "기계학습 및 제어 시스템",
   "areaDetail": "systems and control, system identification, machine learning and Bayesian methods, with applications to autonomous systems, mobile robotic sensors, environmental adaptive sampling, human motor control, and biomedical problems",
   "labLoc": "공학관 N206",
   "labPhone": "02-2123-7271",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/21.png",
   "labName": "Machine Learning and Control Systems Lab.",
   "email": "jongeunchoi@yonsei.ac.kr",
   "phone": "02-2123-2813"
  },
  {
   "id": "hais",
   "ko": "정밀 측정·지능형 센싱",
   "en": "High-Dim. Accurate Measurement & Intelligent Sensing",
   "pi": "현재상",
   "cluster": "optics",
   "loc": "공학관 C315",
   "site": "https://sites.google.com/view/damislab",
   "labName": "정밀 측정 및 지능형 센싱 연구실",
   "email": "hyun.jaesang@yonsei.ac.kr",
   "phone": "02-2123-2818"
  },
  {
   "id": "sep",
   "ko": "지속가능 에너지 플랫폼",
   "en": "Multiphysics Energy System",
   "pi": "홍종섭",
   "cluster": "thermal",
   "loc": "공학관 A288",
   "site": "http://mes.yonsei.ac.kr/",
   "video": "https://youtu.be/QyO40rVVPg0",
   "area": "열 및 물질전달, 반응공학",
   "areaDetail": "Novel & renewable Energy system techno-economic Analysis\nThermo-electrochemical Energy Conversion Device Design\nHeat & Mass Transport management\nEnvironmentally-benign fuel utilization & process Optimization",
   "labLoc": "공학관 A288",
   "labPhone": "-",
   "promo": "https://me.yonsei.ac.kr/_res/me/img/research/27.png",
   "intern": "O명",
   "internTarget": "수소에너지 기술 및 친환경 차량용 연료전지/배터리 기술을 대학원생들과 열정을 갖고 연구할 학부 연구생",
   "internBenefit": "정부/산업체 연구개발과제 참여, 대학원 수준의 연구 경험, 학회 참석 지원, 인턴비 지급",
   "internArea": "1) 수전해 기반 수소 생산 촉매/반응기 기술 개발\n 2) 이산화탄소 저감/전환을 위한 촉매/반응기 기술 개발\n 3) 수소연료전지 스택 해석 및 디자인 창출\n 4) 배터리 안정성 향상을 위한 성능/내구 예측 기술 개발\n 5) 친환경 차량 통합 열관리 기술 개발",
   "labName": "Multiphysics Energy System Lab.",
   "email": "jongsup.hong@yonsei.ac.kr",
   "phone": "02-2123-4465"
  }
 ],
 "gradGraduation": {
  "sections": [
   {
    "title": "지도교수배정",
    "paras": [
     "석사과정, 석·박사 통합과정 및 박사과정 신입생은 입학시 학과에서 정한 기간 내에 지도교수를 정해야 한다.",
     "각 신입생은 교수와의 개별적 접촉과 면담을 통하여 지도교수를 정하며 이의 확인을 위하여 학과의 소정양식에 지도교수 승인을 득하고 이를 주임교수에게 제출하여 최종 승인을 받아야 한다."
    ],
    "tables": []
   },
   {
    "title": "수업 (이수학점)",
    "paras": [
     "모든 대학원생들은 학위취득에 필요한 학점을 지도교수의 승인하에 취득하여야 한다.",
     "학위 취득을 위한 최소 수강 학점",
     "상기 학위 과정 이수에 필요한 최소 졸업학점을 만족하고, 총 평량 평균이 3.0/4.3 이상이어야 한다. 2026년 1학기 혹은 이후 입학자의 경우, 학위논문연구과목의 이수학점을 최소 졸업 학점에 포함할 수 없다.",
     "2025년 2학기 및 그 이후 입학자의 경우, 석사과정 및 박사과정은 12학점, 통합과정은 18학점 이상의 “기계공학과 개설 강의과목”을 반드시 이수해야 한다. 단, 석사학위를 본교 기계공학과에서 취득한 후 박사과정에 입학한 학생의 경우, 통합과정의 기준을 준용하고 석사과정시 이수한 과목을 인정한다.\n※ “기계공학과 개설 강의과목”: 전공강의 과목을 의미하며 기계공학세미나, 대학원에서의 연구 및 학위논문연구과목 제외",
     "타 전공 입학생에 대한 보충과목 이수에 대해서는 주임교수가 지도교수와 협의하여 정한다.",
     "석사 또는 박사과정 학생의 경우 세미나 과목은 2강좌까지 수강할 수 있다.",
     "통합과정 학생의 경우 세미나 과목은 3강좌까지 수강할 수 있다.",
     "학위과정의 수료에 필요한 총평량평균은 3.0 이상이어야 한다.",
     "아래 필수 교과목은 반드시 수강하여야 한다."
    ],
    "tables": [
     {
      "caption": "학위 과정별 최소 졸업 학점",
      "head": [
       "학위 과정",
       "최소 졸업 학점"
      ],
      "rows": [
       [
        "석사 과정",
        "27\n30 (26년이전 입학자)"
       ],
       [
        "박사 과정",
        "27\n30 (26년이전 입학자)"
       ],
       [
        "석·박사 통합과정",
        "48\n54 (26년이전 입학자)"
       ]
      ]
     },
     {
      "caption": "필수 교과목",
      "head": [
       "학정번호",
       "과목명",
       "학점",
       "개설전공",
       "비고"
      ],
      "rows": [
       [
        "MEU5055",
        "대학원에서의연구",
        "1",
        "기계공학과",
        "2021-1학기 입학생부터 필수, 매년 1학기 개설"
       ],
       [
        "YSG6003\n(또는 YSG6004)",
        "연구윤리",
        "0",
        "일반대학원 공통",
        "기계공학과 전체 대학원생 필수,\n본교 석사 졸업 후 박사 진학자도 수강 필수\n(2021-2학기 이전 입학자의 경우 공과대학에서 개설한 공학윤리와연구방법론(ENG6060) 또는 연구윤리(ENG6100) 과목도 인정됨)"
       ]
      ]
     }
    ]
   },
   {
    "title": "종합시험",
    "paras": [
     "석·박사 통합과정 학생은 학위논문 예비심사 이전에 학과에서 주관하는 종합시험을 합격해야 한다. 석·박사 통합과정의 경우 석사과정 종합시험을 거치지 않고 박사과정의 규정을 따른다.",
     "석사과정의 경우 2학기 종료시점 이내에 첫 종합시험을 응시해야 한다. 종합시험의 구성 및 채점기준은 별도의 규정에 따른다.",
     "박사과정의 경우 석사학위가 있는 박사과정 학생은 3학기 종료시점에, 석·박사 통합과정 학생은 5학기 종료시점 이내에 첫 종합시험을 응시할 것을 권장한다. 종합시험의 구성 및 채점기준은 별도의 규정에 따른다.",
     "종합시험은 학과에서 주관하며 학사 일정을 고려하여 한 학기에 1회 개최한다. 학위과정 중 3회 이상 불합격할 경우 논문예비심사를 받을 수 없으므로, 학위과정에서 제적된다."
    ],
    "tables": []
   },
   {
    "title": "학위논문 예비심사",
    "paras": [
     "자격시험(종합시험 및 외국어시험)에 합격하였으며 학위논문 연구계획서를 승인받은 학생은 학위논문 예비심사를 받을 자격이 주어진다. 석사과정 학생의 경우 논문 예비심사는 논문연구계획서를 승인 받은 학기에 받을 수 있다. 박사과정 학생의 경우 논문 예비심사는 논문연구계획서를 승인받은 학기로부터 최소한 한 학기 후에 받을 수 있다.",
     "예비심사는 학생의 학위논문에 대한 구두발표로 이루어지며 예비심사 위원회가 합격여부를 결정한다.",
     "예비심사 위원회는 주임교수와 지도교수가 협의하여 석사학위 논문의 경우 3인, 박사학위 논문의 경우 5인으로 구성한다. 석사학위 심사위원 중 1인, 박사학위 심사위원 중 2인까지는 외부인사로 할 수 있다.",
     "박사(통합)과정의 예비심사 구두발표는 공개적으로 실시되며 발표심사 일정에 대하여 사전에 공지하여야 한다.",
     "박사과정 또는 석·박사 통합과정 학생의 경우에는 예비심사와 본심사를 동일한 학기에 실시할 수 없다."
    ],
    "tables": []
   },
   {
    "title": "학위논문 본심사",
    "paras": [
     "예비심사에 합격하고 학위논문을 충실히 수정보완한 학생으로서 학술활동 졸업요건을 충족한 학생은 학위논문 본심사를 받을 자격이 주어진다.",
     "본심사는 학생의 학위논문에 대한 구두발표로 이루어진다.",
     "본심사 위원회는 석사학위 논문의 경우 3인, 박사학위 논문의 경우 5인으로 하며, 논문 지도교수는 자동적으로 심사위원이 된다. 석사학위 심사위원 중 1인, 박사학위 심사위원 중 2인까지는 외부인사로 할 수 있다.",
     "본심사 평가는 100점 만점으로 하여 석사학위논문에 있어서는 심사위원 2인 이상이 80점 이상으로 평가할 경우 합격으로 간주하며, 박사학위논문에 있어서는 심사위원 4인 이상이 80점 이상으로 평가할 경우 합격으로 간주한다.",
     "본심사에 불합격한 논문제출자는 1학기 이상 경과한 후 다시 작성하여 심사 받을 수 있다. 재심사에서 불합격한 경우에는 더 이상 논문심사를 받을 수 없으며 수료생으로 학위과정을 마쳐야 한다.",
     "학위논문은 석사학과정에는 학생의 입학일로부터 4년 이내에, 박사학위과정은 7년 이내에, 통합과정에서는 8년 이내에 그 심사에 합격하여야 한다.",
     "각 학위과정의 학생으로 수료요건이 충족된 자에 한하여 합당한 사유가 있는 경우 대학원장의 재가를 얻어 2년 연장할 수 있다. 단, 이 기간에는 휴학할 수 없다."
    ],
    "tables": []
   },
   {
    "title": "영어시험 졸업요건",
    "paras": [
     "석사과정, 박사과정 및 석·박사 통합과정 학생은 졸업요건으로 공인영어시험성적을 제출하여야 하며, 졸업가능 최저점수는 아래의 표에 제시된 바와 같다.",
     "※ 공인성적의 유효기간과 대학원 재학기간이 일치하여야 한다.",
     "본교 출신 석사가 (상기의 박사졸업 기준을 만족한 경우) 박사 진학 시, 학부과정을 영어권에서 이수한 입학자의 경우에는 외국어 시험을 면제한다. (입학 후 관련 증빙 제출 필수)"
    ],
    "tables": [
     {
      "caption": "영어시험 졸업요건",
      "head": [
       "",
       "TOEFL (PBT)",
       "TOEFL (CBT)",
       "TOEFL (iBT)",
       "TOEIC",
       "TEPS\n(NEW TEPS)",
       "IELTS"
      ],
      "rows": [
       [
        "석사\n(2014년 이후 입학)",
        "510",
        "200",
        "75",
        "650",
        "540\n(291)",
        "6.0"
       ],
       [
        "석·박사 통합 및 박사\n(2014년 이후 입학)",
        "560",
        "220",
        "83",
        "720",
        "600\n(327)",
        "6.4"
       ]
      ]
     }
    ]
   },
   {
    "title": "학술활동 졸업요건",
    "paras": [
     "석사과정, 박사과정 및 석·박사 통합과정 학생은 졸업요건으로 대학원에서 인정하는 국내외 학술지와 학술대회를 통해 학술활동을 해야 한다.",
     "석사학위 및 박사학위 논문 제출을 위해서는 학과에서 정한 학술활동 요건을 만족해야 한다."
    ],
    "tables": []
   },
   {
    "title": "기타",
    "paras": [
     "군위탁 및 기타 정원외로 입학한 대학원생에 대해서도 같은 요건을 적용함을 원칙으로 한다.",
     "기계공학과 대학원 세부운영내규에 명시되지 않은 사항들은 대학원 학칙 및 내규를 따른다.",
     "기타 자세한 사항은 홈페이지 대학원 공지사항 학사요람 참조."
    ],
    "tables": []
   }
  ]
 },
 "gradGraduationSource": {
  "source": "https://me.yonsei.ac.kr/me/graduate/graduation.do",
  "label": "연세대학교 기계공학부 대학원 졸업요건",
  "note": "graduate/graduation.do 원문 전량(표 3개 포함). 표현·오탈자까지 원문 그대로 보존.",
  "verifiedAt": "2026-07-28"
 },
 "clubsInfo": {
  "clubs": [
   {
    "key": "drone",
    "name": "연세드론",
    "paras": [
     "연세드론은 무인비행체(드론, 고정익, VTOL 등)를 직접 제작하고 비행하는 동아리로, 기체를 제작하는 하드웨어팀과 자율비행 알고리즘을 개발하는 소프트웨어팀으로 나뉘어 활동하고 있습니다. 매년 한국로봇항공기 경연대회 본선에 진출하고 있으며, 이외에도 국내 동아리 최초 End-to-End 실내 자율비행, 탄소섬유 복합재(Carbon Fiber Reinforced Plastic) 제작, 자작 카본 글라이더 개발 등 다양한 프로젝트를 수행하면서 동아리의 역량을 확장해 나가고 있습니다.",
     "[소프트웨어팀]",
     "- 인지, 판단, 제어 등 자율비행 알고리즘 개발",
     "- 주 소프트웨어 스택: ROS2, PX4 Autopilot",
     "- 주 사용 언어: C++, Python",
     "- 이전 프로젝트: Stereo Vision Collision Avoidance, Precision Landing using Reinforcement Learning, End-to-End Autonomous Flight using an RGB Camera 등",
     "- 이외에도 통신 프로토콜 개발, 비행 제어기 개발 (STM32), 등 하고 싶은 프로젝트 진행",
     "[하드웨어팀]",
     "- 기체 설계, 해석, 제작",
     "- 탄소섬유, 3D 프린팅 등 첨단 복합소재 및 제조 공정 활용",
     "- 동체, 모터, GPS, LiDAR 센서 등 전자장비 배선 및 하드웨어 통합",
     "- 비행 테스트를 통한 성능 검증 및 개선",
     "[주요 성과 및 수상실적]",
     "- 제 21·22·23 회 한국로봇항공기 경연대회 본선 진출 (제 21 회 2 등 수상)",
     "- 2024 현대모비스 모빌리티 SW 해커톤 1 위 (대상, 상금 1,000 만원)",
     "- 2025 전국 대학(원)생 우주항공 Makerthon 경진대회 수직이착륙기(VTOL) 부문 대상 (상금 200 만원)",
     "- 2024 서울특별시 드론 활용 경진대회 우수상 (서울특별시장상)",
     "- 2024 도심항공모빌리티(AAM) 디지털 설계 경진대회 2 위 (금상, 국민대학교 총장상 및 부상)",
     "- 2024 AI Drone Challenge 1 위 (대상, 인투스카이 대표상)",
     "● Instagram: @yonsei_drone",
     "● YouTube: youtube.com/@yonseidrone",
     "● Notion: yonseidrone.com/recruit"
    ],
    "image": "assets/clubs/drone.jpg",
    "imageAlt": "연세드론 소개 포스터"
   },
   {
    "key": "mecar",
    "name": "메카 (MECar)",
    "paras": [
     "● 연세대학교 유일의 자작 자동차 동아리, MECar ●",
     "MECar는 차량 설계부터 부품 발주, 제작까지 차량을 제작하는 동아리입니다.",
     "4개의 팀(기계팀, 전기팀, 기계설계팀, 마케팅팀)으로 구성되어 있으며, 매년 KSAE 대학생 자작자동차 대회 오프로드 E-BAJA 부문과 EV 영광대회를 목표로 활동하고 있습니다.",
     "[기계팀]: 구조해석에 따른 설계 및 제작",
     "-차체 강도를 유지하며 경량화하는 설계와 재료 가공",
     "-성공적인 주행 성능과 내구성 확보를 위한 다양한 실험과 테스트 진행",
     "-ANSYS 활용한 구조적 안전성과 성능 검증",
     "[전기팀]: 전자 제어 시스템과 전원 관리 담당",
     "-배터리, 컨트롤러, LV&HV 시스템 제작",
     "-차량의 센서 네트워크를 설계하고, 데이터 수집 및 분석을 통해 최적의 차량 성능을 지원",
     "[설계팀]: 차량의 전체 구조 설계와 3D 모델링 담당",
     "-CAD 모델링을 통한 효율적이고 안정적인 차량 설계",
     "-제작에 필요한 설계 도면을 제작",
     "[마케팅팀]: 동아리의 대외 홍보와 프로젝트 관리 담당",
     "-후원사 모집 및 관리",
     "-콘텐츠 제작 및 홍보 전략 기획, SNS 운영",
     "[주요 성과 및 수상실적]",
     "2020 KSAE BAJA 부문 장려상 & 베스트 팀워크상 수상",
     "2024 KSAE BAJA 내구력 경기 완주",
     "2024 대학생 스마트 e모빌리티 경진대회 EV 부문 연합 출전 & 베스트 활동상 수상",
     "● Instagram: @yonseimecar",
     "● Notion: mecar.notion.site/about-"
    ],
    "image": "assets/clubs/mecar.jpg",
    "imageAlt": "메카 (MECar) 소개 포스터"
   },
   {
    "key": "roboin",
    "name": "로보인",
    "paras": [
     "- 기계공학과 로봇 학술 동아리",
     "- 주요활동 로봇을 배우고 싶은 사람을 위한 '로보인 커리큘럼' 프로그램",
     ": 코로나 시국에 대비한 온라인 세미나와 소규모 미션을 진행하며 배우는 로봇 관련 지식",
     ": 아두이노, 라즈베리 파이, 3D 캐드, AI 활용 등 자양한 주제의 세미나와 실습 프로그램 준비",
     "- 직접 로봇을 만들어보는 제작 프로젝트 : 로봇팔, 드론, 4족보행 로봇, IoT 기기, 자율주행 자동차 등 원하는 주제의 프로젝트 가능",
     "- 동아리 내 팀 빌딩 및 외부 대회 참가 : 에디슨 전산설계 대회, KU 메디컬 해커톤, 로보마스터 대회 등 다수 대회 수상",
     "- 기업 / 대학원 연계 대외 활동 : 외부 기업과 연계한 IT/로봇 관련 유튜브 영상 촬영 대외활동 : 연구실 의뢰 연구참여 및 대학원 세미나 참여",
     "● Naver Cafe: cafe.naver.com/yonseiunivroboin",
     "● YouTube: youtu.be/caPJby-NVIEn",
     "● Facebook: facebook.com/roboinrecruit"
    ],
    "image": "assets/clubs/roboin.jpg",
    "imageAlt": "로보인 소개 포스터"
   },
   {
    "key": "spacey",
    "name": "SPACE Y",
    "paras": [
     "- 연세대학교 유일 항공우주동아리 <SPACE Y>는 로켓, 인공위성, 항공, 컨버전스 4개 팀으로 구성되어 있으며, 대한민국 항공우주산업에 기여하기 위해 다양한 도전을 하고 있습니다. 로켓팀은 발사체 설계와 연료 실험, 인공위성팀은 캔 위성 제작 및 대회 참가, 항공팀은 항공기 모델 설계 및 제작, 컨버전스팀은 항공우주 관련 세미나와 카드뉴스 제작을 통해 대중과 소통합니다. NASA 현직자 초청 세미나 등 활발한 활동을 통해 항공우주에 대한 이해를 넓히고 있습니다.",
     "- 2024년 11월부터 상시모집을 진행하고 있으니 많은 관심부탁드립니다. 인스타그램 링크트리를 통해 지원서 폼에 접근할 수 있습니다.",
     "[로켓팀]",
     "- 발사체부",
     ": 로켓의 하드웨어 구조 전반 설계 및 해석, Open Rocket을 이용하여 구조와 안정성 테스트, 부품 CAD 설계 및 3D 프린팅(Autodesk Fusion, ANSYS 등 사용)",
     "- 추진부",
     ": 요구도에 적합한 로켓의 노즐과 챔버 제원 설계/ 고체연료(KNSB) 제작 및 연소 실험을 통한 추력 테스트/연료 내부(Grain) 형상에 따른 다양한 연소 양상을 분석하고, 이에 적합한 최적화된 노즐을 설계",
     "- 항공전자부",
     ": 지상국과 로켓과의 통신, 낙하산 사출/연료 점화/로켓 자세 제어 코딩, 로켓의 비행시간, 고도, 속도 등 발사 이후 데이터 처리 및 분석, GUI 및 전자보드 설계",
     "- 각 부서별 세미나 진행",
     "- 전국대학교로켓연합회(NURA) 가입, NURA 학술대회 및 발사대회 참여",
     "-수상내역:",
     "2023 NURA 학술대회 5등 (장려상) 수상",
     "2024 NURA 학술대회 2등 (금상, 항우연원장상) 수상",
     "[인공위성팀]",
     "- CDHS(명령 및 데이터 처리계), SMS(구조계), COMS(통신계) 3개의 세부 부서로 구성",
     "- 캔 위성 제작 및 논문 작성",
     "- 국내 및 국제 캔위성 대회에 참가하여 임무 설계와 캔위성을 제작",
     "- 수상내역:",
     "RPG 캔위성(Skycrane 구조를 이용한 연착륙): 2023 국내 캔위성 경연 대회(과학기술정보통신부 주최) 2등 (우수상, KAIST 총장상) 수상",
     "Aquamarine 캔위성(Payload를 안전히 보호): 2023 국외 캔위성 대회(미국천문학회(AAS) 및 NASA 주최) 본선 진출, 최종 31등",
     "HaNaDulSat 캔위성(전개장치가 탑재된 편광 광학 캔위성을 이용한 물성 차이 식별): 2024 국내 캔위성 대회 (우주항공청 주최) 2등 (우수상, KAIST 총장상) 수상",
     "[항공팀]",
     "- 항공기 모델을 직접 설계 및 제작(Cessna 172, RQ2 등)",
     "- 경상국립대학교 자작모형항공기 경진대회 등 RC 비행기 제작 대회 참가",
     "- Autodesk Fusion(기체 모델링), 3D프린팅/MDF/발사나무(제작), ANSYS(기체 분석)",
     "- 항공 분야 관련 스터디(제어, 메카니즘)",
     "- 공군사관학교 미래 항공우주 학술대회 참여",
     "- 한국로봇항공기 경연대회(AAM Tech Challenge) 참가(예정)",
     "[컨버전스팀]",
     "- 항공우주라는 분야를 대중에게 친숙하게 전달하기 위한 정기 간행물 제작 (카드뉴스)",
     "ex. 아르테미스 미션, 비행에 쓰인 인공지능 알고리즘, 우주투자 등",
     "- 세미나 진행 등으로 토론의 장 마련",
     "'Space Why': NASA 현직자 초청 세미나 :",
     "1) NASA JPL navigation engineer 이주림 연사님: '화성으로의 여정'",
     "2)  NASA JPL/Caltech research scientist 성기윤 박사님: '우주임무 설계를 위한 분자광공학'",
     "- 공군사관학교 항공우주 학술대회 항공우주정책 분과 참가",
     "- 분기별 학회지 제작 및 내부 학술 세미나",
     "● Instagram: @yonsei_space"
    ],
    "image": "assets/clubs/spacey.jpg",
    "imageAlt": "SPACE Y 소개 포스터"
   }
  ]
 },
 "clubsInfoSource": {
  "source": "https://me.yonsei.ac.kr/me/community/circles.do",
  "label": "연세대학교 기계공학부 동아리 소개",
  "verifiedAt": "2026-07-28",
  "note": "본문 문단·SNS 표기는 원문 그대로(오탈자 포함). 포스터 이미지는 원본을 폭 1400px 로 줄여 실었다."
 },
 "labsSource": {
  "source": "lab2.do",
  "verifiedAt": "2026-06-30"
 },
 "courses": [
  {
   "code": "MEU2600",
   "ko": "고체역학",
   "type": "전공필수",
   "year": 2,
   "credits": 3,
   "prereq": [],
   "desc": "재료가 하중을 받을 때의 응력·변형률과 파괴를 다룬다. 구조 해석과 기계 설계의 출발점."
  },
  {
   "code": "MEU2610",
   "ko": "열역학",
   "type": "전공필수",
   "year": 2,
   "credits": 3,
   "prereq": [],
   "desc": "에너지와 열·일의 변환 법칙을 배운다. 열기관·냉동·발전 등 에너지 시스템의 기반."
  },
  {
   "code": "MEU2640",
   "ko": "유체역학",
   "type": "전공필수",
   "year": 2,
   "credits": 3,
   "prereq": [],
   "desc": "유체의 흐름과 압력·유동을 해석한다. 유체기계·유동 설계의 토대."
  },
  {
   "code": "MEU2650",
   "ko": "동역학",
   "type": "전공필수",
   "year": 2,
   "credits": 3,
   "prereq": [],
   "desc": "물체의 운동과 힘의 관계를 다룬다. 진동·제어·로보틱스로 이어지는 역학."
  },
  {
   "code": "MEU2104",
   "ko": "기계공학실험1",
   "type": "전공필수",
   "year": 2,
   "credits": 2,
   "prereq": [],
   "desc": "4대 역학의 원리를 실험으로 확인하고 계측·데이터 분석을 익힌다."
  },
  {
   "code": "MEU3005",
   "ko": "기계공학실험2",
   "type": "전공필수",
   "year": 3,
   "credits": 2,
   "prereq": [
    "MEU2104"
   ],
   "desc": "심화 실험. 설계-제작-계측을 종합적으로 수행한다."
  },
  {
   "code": "MEU4300",
   "ko": "창의제품설계",
   "type": "전공필수",
   "year": 4,
   "credits": 3,
   "prereq": [
    "MEU2600",
    "MEU2610",
    "MEU2640",
    "MEU2650"
   ],
   "desc": "팀 단위로 실제 제품을 기획·설계·제작하는 종합 설계 과목."
  },
  {
   "code": "MEU4400",
   "ko": "학사논문",
   "type": "전공필수",
   "year": 4,
   "credits": 3,
   "prereq": [
    "MEU4300"
   ],
   "desc": "지도교수와 함께 연구 주제를 탐구해 논문으로 완성한다."
  }
 ],
 "coursesSource": {
  "source": "me.yonsei.ac.kr 교과과정",
  "verifiedAt": "2026-06-30"
 },
 "posts": [
  {
   "cat": "학부",
   "title": "기계공학부「홈페이지 구축 경진대회」안내",
   "date": "2026-06-23",
   "pinned": true,
   "source": "community/notice.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "학부",
   "title": "2026-여름계절학기 학부연구(3) 연구참여 신청서 제출 안내",
   "date": "2026-06-29",
   "source": "community/notice.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "학부",
   "title": "VAR 2026 여름학기 모집 안내",
   "date": "2026-06-24",
   "source": "community/notice.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "학부",
   "title": "일몰된 교과목(기계공학수학)에 대한 재수강처리 요청서 제출 안내",
   "date": "2026-06-18",
   "source": "community/notice.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "학부",
   "title": "기계공학과 2026 여름학기 해외집중강의 시리즈 수강생 모집 안내",
   "date": "2026-06-11",
   "source": "community/notice.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "학부",
   "title": "2026학년도 2학기 재입학 전형 안내문",
   "date": "2026-05-29",
   "source": "community/notice.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "학부",
   "title": "2026학년도 2학기 학생설계전공 제도 시행 안내",
   "date": "2026-05-12",
   "source": "community/notice.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "학부",
   "title": "2026 공과대학 'ZERO to AI Challenge' 공모 안내",
   "date": "2026-05-11",
   "source": "community/notice.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "학부",
   "title": "[항공우주전략연구원] 2026년 연세 우주항공 주간 개최 안내",
   "date": "2026-05-08",
   "source": "community/notice.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "학부",
   "title": "공과대학 Global Day 행사 안내",
   "date": "2026-04-14",
   "source": "community/notice.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "대학원",
   "title": "2026학년도 2학기 대학원 휴학·복학 신청 안내",
   "date": "2026-07-02",
   "source": "index.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "대학원",
   "title": "8월 졸업예정자 학위논문 제출 안내",
   "date": "2026-06-19",
   "source": "index.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "대학원",
   "title": "1학기 APR 계획서 작성 마감일 안내",
   "date": "2026-06-16",
   "source": "index.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "대학원",
   "title": "2학기 학위과정 변경 신청 안내",
   "date": "2026-06-09",
   "source": "index.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "대학원",
   "title": "박사우수장학금 및 석사우수장학금 신청 안내",
   "date": "2026-05-29",
   "source": "index.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "대학원",
   "title": "K-STAR 비자트랙 프로그램 신청 안내",
   "date": "2026-05-14",
   "source": "index.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "뉴스",
   "title": "비압전성 폴리머 필름을 이용한 유연한 음향파 발생장치 개발과 생체조직 분야로의 응용",
   "date": "2026-05-18",
   "source": "community/news.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "뉴스",
   "title": "리소그래피 공정 없이 제작 가능한 대기전력이 없는 수소 감지 스위치 개발",
   "date": "2026-05-18",
   "source": "community/news.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "뉴스",
   "title": "리튬이온전지 열폭주 초기 SEI 분해 반응의 반응속도론적 모델링",
   "date": "2026-05-18",
   "source": "community/news.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "뉴스",
   "title": "중온 직접 암모니아 SOFC 성능·내구성 향상을 위한 Co–GDC 나노촉매 연료극 개발",
   "date": "2026-05-18",
   "source": "community/news.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "뉴스",
   "title": "부분 매립형 수직 정렬 탄소나노튜브 기반 고해상도 유연 촉각 센서 어레이 개발",
   "date": "2026-05-18",
   "source": "community/news.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "뉴스",
   "title": "Nature Forum: The Future of Sensing Technologies 성황리 개최",
   "date": "2026-04-21",
   "source": "community/news.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "뉴스",
   "title": "연세대 기계공학부, 일본 게이오대·도쿄대와 글로벌 학술·산업 교류 프로그램 성황리 개최",
   "date": "2026-03-11",
   "source": "community/news.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "뉴스",
   "title": "고체산화물연료전지 공기 공급 중단 조건에서의 공기극 분해 메커니즘 규명",
   "date": "2026-03-11",
   "source": "community/news.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "뉴스",
   "title": "전흥재 교수 한국복합재료학회 KAL-KSCM상 수상",
   "date": "2026-03-11",
   "source": "community/news.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "뉴스",
   "title": "바이오헬스 및 정밀의료기술 심포지움 개최",
   "date": "2026-02-19",
   "source": "community/news.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "세미나",
   "title": "Prof. Dvir Yelin (Technion) — Imaging tympanic membrane vibration",
   "date": "2026-06-04",
   "source": "community/seminar.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "세미나",
   "title": "김석 교수 — Programmable Mechanical Matter",
   "date": "2026-06-04",
   "source": "community/seminar.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "세미나",
   "title": "나성수 교수 — From Conventional Dynamics",
   "date": "2026-06-04",
   "source": "community/seminar.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "세미나",
   "title": "임근배 교수 — Mechanics for Biomedical Engineering",
   "date": "2026-05-28",
   "source": "community/seminar.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "세미나",
   "title": "정성남 교수 — Overall Rotorcraft Aeromechanics",
   "date": "2026-05-28",
   "source": "community/seminar.do",
   "verifiedAt": "2026-07-02"
  },
  {
   "cat": "세미나",
   "title": "김원정 교수 — 미세유체역학 이해 및 연구 사례 소개",
   "date": "2026-05-19",
   "source": "community/seminar.do",
   "verifiedAt": "2026-07-02"
  }
 ],
 "history": [
  {
   "date": "1958.12",
   "text": "이공대학 건설공학과 신설"
  },
  {
   "date": "1960.03",
   "text": "이공대학 건설공학과 첫 신입생 입학"
  },
  {
   "date": "1962.12",
   "text": "이공대학 공학부 기계공학과로 분리",
   "highlight": true
  },
  {
   "date": "1963.02",
   "text": "이공대학 공학부 기계공학과 첫 신입생 입학"
  },
  {
   "date": "1964.02",
   "text": "이공대학 공학부 기계공학과 첫 졸업생 졸업"
  },
  {
   "date": "1971.03",
   "text": "본과 대학원 석사과정 신설"
  },
  {
   "date": "1972.01",
   "text": "산업대학원에 산업기계 전공 신설"
  },
  {
   "date": "1972.03",
   "text": "본과 대학원 박사과정 신설"
  },
  {
   "date": "1974.01",
   "text": "산업대학원에 산업기계 전공 신설"
  },
  {
   "date": "1980.03",
   "text": "산업대학원 산업기계전공이 기계공학 전공으로 전공명칭 변경"
  },
  {
   "date": "1996.03",
   "text": "기전 공학부로 통합"
  },
  {
   "date": "1999.03",
   "text": "기계공학과와 기계설계학과를 기계공학전공으로 통합"
  },
  {
   "date": "2002.03",
   "text": "기계전자공학부에서 기계공학부로 분리 독립 (현 입학정원 180명)",
   "highlight": true
  },
  {
   "date": "2003.03",
   "text": "ABEEK 인증 프로그램 가입"
  },
  {
   "date": "2010.11",
   "text": "기계공학과 창립 50주년",
   "highlight": true
  },
  {
   "date": "2016.03",
   "text": "3단계 BK21 플러스 사업단 협약 체결"
  },
  {
   "date": "2020.08",
   "text": "4단계 BK21 사업 선정",
   "highlight": true
  }
 ],
 "historySource": {
  "source": "faculty/history.do",
  "verifiedAt": "2026-07-29"
 },
 "pages": [
  {
   "href": "index.html",
   "title": "홈",
   "desc": "機制 · Mechanism in Motion"
  },
  {
   "href": "about.html",
   "title": "학부 소개",
   "desc": "소개 · 비전 · 교육목표"
  },
  {
   "href": "history.html",
   "title": "연혁",
   "desc": "Since 1962 — 학부 마일스톤"
  },
  {
   "href": "academics.html",
   "title": "교육과정",
   "desc": "이수체계 · 전공필수 · ABEEK"
  },
  {
   "href": "research.html",
   "title": "연구실",
   "desc": "33개 연구실 · 6 클러스터"
  },
  {
   "href": "people.html",
   "title": "교수진",
   "desc": "전임 교수 33명 디렉터리"
  },
  {
   "href": "professor.html?id=park-nocheol",
   "title": "교수 스토리 — 박노철",
   "desc": "진동·광메카트로닉스"
  },
  {
   "href": "news.html",
   "title": "소식",
   "desc": "공지 · 뉴스 · 세미나"
  },
  {
   "href": "admissions.html",
   "title": "입학·진로",
   "desc": "학부 · 대학원 · 취업 · 동문"
  },
  {
   "href": "contact.html",
   "title": "오시는 길",
   "desc": "주소 · 연락처 · 캠퍼스 지도"
  },
  {
   "href": "engineering.html",
   "title": "공학 사양서 /engineering",
   "desc": "성능 · 접근성 실측 공개"
  },
  {
   "href": "accessibility.html",
   "title": "접근성 선언",
   "desc": "WCAG 2.2 AA 자가적합성"
  },
  {
   "href": "privacy.html",
   "title": "개인정보처리방침",
   "desc": ""
  },
  {
   "href": "terms.html",
   "title": "이용약관",
   "desc": ""
  }
 ],
 "meta": {
  "name_ko": "연세대학교 기계공학부",
  "name_en": "Yonsei University Department of Mechanical Engineering",
  "since": 1958,
  "address": "서울특별시 서대문구 연세로 50 (03722)",
  "phone_grad": "02-2123-2810",
  "phone_ug": "02-2123-4426",
  "phone_bk21": "02-2123-7817",
  "email": "mech@yonsei.ac.kr",
  "stats": {
   "faculty": 33,
   "labs": 32,
   "grad_courses": 183,
   "ug_courses": 40
  },
  "research_areas": [
   {
    "ko": "역학 · 소재",
    "en": "Mechanics & Materials"
   },
   {
    "ko": "에너지 · 열유체",
    "en": "Thermal & Fluid Systems"
   },
   {
    "ko": "로보틱스 · 제어",
    "en": "Dynamics & Control"
   },
   {
    "ko": "설계 · 제조",
    "en": "Design & Smart Manufacturing"
   },
   {
    "ko": "마이크로 · 나노",
    "en": "Micro / Nano Systems"
   },
   {
    "ko": "바이오 · 포토닉스",
    "en": "Bio & Photonics"
   }
  ]
 },
 "reels": {
  "handle": "yonsei_mech",
  "profile": "https://www.instagram.com/yonsei_mech/",
  "note": "reels 배열의 공개 릴스 URL이 팔로우 배너 아래에 인스타그램 공식 임베드로 표시됩니다.",
  "reels": [
   "https://www.instagram.com/reel/DYw5QYTBARf/",
   "https://www.instagram.com/reel/DYkHGXiBpu0/",
   "https://www.instagram.com/reel/DYheXVhBD5b/",
   "https://www.instagram.com/reel/DW34mrHgfL0/",
   "https://www.instagram.com/reel/DWRVdiaASYk/"
  ]
 },
 "coursesUG": [
  {
   "code": "MEU2104",
   "ko": "기계공학실험(1)",
   "en": "Mechanical Engineering Laboratory I",
   "type": "전공필수",
   "credits": "",
   "desc": "실험과 실습을 통하여 기계공학에 대한 깊이 있는 지식을 갖추며, 공학적인 문제의 정의, 실험의 수행 계획, 장비의 활용방법 및 실험 기술, 결과의 해석 및 보고서의 작성을 경험하는 것을 목표로 함. 실험 및 실습 주제에 대한 이론 강의와 학생이 직접 수행하는 실험 및 실습으로 이루어져 있음. 주제는 고체역학, 열역학, 생산공학 및 기초전자회로임."
  },
  {
   "code": "MEU2300",
   "ko": "기계공학창의설계",
   "en": "Creative Thinking in Mechanical Engineering",
   "type": "전공필수",
   "credits": "",
   "desc": "창의적 공학설계를 통하여 기계공학의 근본이 되는 힘, 운동 및 에너지에 대하여 이해한다. 이와 관련된 대표적인 기술 및 응용사례에 대하여 알아본다. 개인별 또는 팀별 프로젝트 수행을 통하여 창의적 사고와 설계 능력을 배양한다."
  },
  {
   "code": "MEU2600",
   "ko": "고체역학",
   "en": "Mechanics of Materials",
   "type": "전공필수",
   "credits": "",
   "desc": "고체역학에 필요한 정력학 개념(힘과 모멘트의 평형), 부정정 구조물 해석. 응력과 변형률, 여러 하중(축하중, 비틀림, 굽힘)에 따른 응력 및 변형률, 재료의 강도 및 이에 따른 설계, 보의 처짐을 다룬다."
  },
  {
   "code": "MEU2610",
   "ko": "열역학",
   "en": "Thermodynamics",
   "type": "전공필수",
   "credits": "",
   "desc": "에너지 기본개념, 상태방정식과 순수물질의 성지, 밀폐시스템에서의 열역학 제1법칙 및 제2법칙, 개방시스템 에서의 열역학 제1법칙 및 제2법칙, 증기동력사이클, 기체동력사이클을 다룬다."
  },
  {
   "code": "MEU2640",
   "ko": "유체역학",
   "en": "Fluid Mechanics",
   "type": "전공필수",
   "credits": "",
   "desc": "유체의 정의, 정수력학, Bernoulli 식, 유체운동의 특성, 유한검사체적을 사용하는 적분형 유동방정식, Navier-Stokes방정식 등 미분해석, 차원해석 등을 다룬다."
  },
  {
   "code": "MEU2650",
   "ko": "동역학",
   "en": "Dynamics",
   "type": "전공필수",
   "credits": "",
   "desc": "질점의 운동학, 질점의 동역학, 질점계의 운동학, 질점계의 동역학, 강체의 운동학 및 동역학, 에너지, 운동량 등을 배운다."
  },
  {
   "code": "MEU3005",
   "ko": "기계공학실험(2)",
   "en": "Mechanical Engineering Laboratory II",
   "type": "전공필수",
   "credits": "",
   "desc": "실험과 실습을 통하여 기계공학에 대한 깊이 있는 지식을 갖추며, 공학적인 문제의 정의, 실험의 수행 계획, 장비의 활용방법 및 실험 기술, 결과의 해석 및 보고서의 작성을 경험하는 것을 목표로 함. 실험 및 실습 주제에 대한 이론 강의와 학생이 직접 수행하는 실험 및 실습으로 이루어져 있음. 주제는 유체역학, 동역학, 열전달 및 기계진동학임."
  },
  {
   "code": "MEU4300",
   "ko": "창의제품설계",
   "en": "Creative Product Design",
   "type": "전공필수",
   "credits": "",
   "desc": "제품개발을 위한 설계 및 기반 지식에 초점을 두며 팀 프로젝트를 통하여 경쟁력 있는 공학적 제품을 설계하고 시작품을 제작한다. 본 과목의 주요 내용은 제품개발과정, 고급설계기법, 프로젝트 경영, 마케팅 전략, 지적재산권, 제품홍보, 제품개발 case study 등이다."
  },
  {
   "code": "MEU4400",
   "ko": "연구논문",
   "en": "Undergraduate Thesis",
   "type": "전공필수",
   "credits": "",
   "desc": "기계공학 주제에 대하여 학생 스스로 문제를 정의하고 분석하여 종합된 보고서(논문)를 작성하고 발표하는 능력을 배양한다."
  },
  {
   "code": "MEU2620",
   "ko": "컴퓨터응용기계설계",
   "en": "Computer-aided Mechanical Engineering Design",
   "type": "전공선택",
   "credits": "",
   "desc": "설계공학의 개요, CAD 및 3차원 솔리드모델링을 통한 도면작성, 공학제도의 방법, 정투상, 부투상, 단면법, 3차원 투영방법, 도면분석 및 관리, 공차해석, 기하공차, 형상공차, 시스템설계, 파라미터설계, 공차설계, CAD/CAM의 기초 등을 배운다."
  },
  {
   "code": "MEU3001",
   "ko": "환경기계공학",
   "en": "",
   "type": "전공선택",
   "credits": "",
   "desc": "수송기관, 발전소 및 산업체 등 에서 배출되거나 실내 공간에 부유하는 가스상/입자상 유해물질의 종류를 살펴보고 이들에 대한 환경규제 및 인체에 미치는 영향을 공부한다. 그리고 이들 유해물질의 측정기기 및 저감기기의 작동 원리를 공부하고 이들 기기의 설계 이론을 습득한다."
  },
  {
   "code": "MEU3002",
   "ko": "메카니즘설계",
   "en": "Mechanism Design",
   "type": "전공선택",
   "credits": "",
   "desc": "좌표계, 속도해석, 가속도해석, 운동의 정의, 연쇄기구의 운동해석, 캠, 치차 및 치차열의 해석, 링크의 해석 및 합성을 다룬다."
  },
  {
   "code": "MEU3004",
   "ko": "바이오의료기계",
   "en": "Biomedical Mechanical Engineering",
   "type": "전공선택",
   "credits": "",
   "desc": "기계공학의 기초 지식과 이론을 바탕으로 유전자, 단백질, 세포 등의 생체 시스템을 이해하고 기계공학을 기반으로 한 의료용 진단 및 치료 기기 등의 원리에 대해 학습한다."
  },
  {
   "code": "MEU3006",
   "ko": "학부연구(1)",
   "en": "Undergraduate Independent Study I",
   "type": "전공선택",
   "credits": "",
   "desc": "교수 지도하에 기계공학 최신 주제 연구에 참여하여 전공에 대한 다양한 경험을 쌓고 심화된 기계공학 지식을 습득한다."
  },
  {
   "code": "MEU3007",
   "ko": "학부연구(2)",
   "en": "Undergraduate Independent Study II",
   "type": "전공선택",
   "credits": "",
   "desc": "교수 지도하에 기계공학 최신 주제 연구에 참여하여 전공에 대한 다양한 경험을 쌓고 심화된 기계공학 지식을 습득한다."
  },
  {
   "code": "MEU3008",
   "ko": "학부연구(3)",
   "en": "Undergraduate Independent Study III",
   "type": "전공선택",
   "credits": "",
   "desc": "교수 지도하에 기계공학 최신 주제 연구에 참여하여 전공에 대한 다양한 경험을 쌓고 심화된 기계공학 지식을 습득한다."
  },
  {
   "code": "MEU3009",
   "ko": "학부연구(4)",
   "en": "Undergraduate Independent Study IV",
   "type": "전공선택",
   "credits": "",
   "desc": "교수 지도하에 기계공학 최신 주제 연구에 참여하여 전공에 대한 다양한 경험을 쌓고 심화된 기계공학 지식을 습득한다."
  },
  {
   "code": "MEU3010",
   "ko": "마이크로기계시스템",
   "en": "Microsystems for Mechanical Engineering",
   "type": "전공선택",
   "credits": "",
   "desc": "마이크로 크기의 소자 제작 및 시스템에 대한 기초적 지식과 그 응용을 공부한다. 마이크로 스케일 구조의 가공방법, 마이크로 역학 및 그 응용에 관한 지식을 배운다."
  },
  {
   "code": "MEU3011",
   "ko": "에너지동력공학",
   "en": "Energy and Power Engineering",
   "type": "전공선택",
   "credits": "",
   "desc": "내연기관의 구조, 내연기관 관련 용어, 스파크점화기관과 압축점화기관의 비교, 흡기와 배기, 연료와 공기의 혼합, 점화와 연소, 배기가스 공해물질 배출, 열전달과 윤활, 진동, 내연기관 설계 및 열‧유체역학 요약, 가스터빈 사이클, 원심‧축류 압축기, 연소기 원심‧축류터빈, 터빈요소 성능 해석 및 시스템 구성을 배운다."
  },
  {
   "code": "MEU3012",
   "ko": "광공학",
   "en": "Optical Engineering",
   "type": "전공선택",
   "credits": "",
   "desc": "광학에 대한 기본 이론을 익히고, 기계공학응용을 위한 광학계 이론, 광학장치에 대해서 공부한다. 레이저에 대한 이론 및 종류, 그리고, 광공학과 첨단기술이 결합한 응용분야를 배운다."
  },
  {
   "code": "MEU3013",
   "ko": "정형생산시스템",
   "en": "Net-Shaped Manufacturing System",
   "type": "전공선택",
   "credits": "",
   "desc": "한번의 공정으로 원하는 형상이 제품을 가공하는 가공방법 및 가공시스템에 대해 강의하며, 구체적으로 금형설계 및 가공방법, 다이캐스팅공정, 초정밀 금속성형, 폴리머 성형, 쾌속조형(RP)등의 공정에 관련된 이론, 3D공정시뮬레이션, 공정실습 및 현장견학 등을 병행한다."
  },
  {
   "code": "MEU3014",
   "ko": "메카트로닉스",
   "en": "Mechatronics",
   "type": "전공선택",
   "credits": "",
   "desc": "메카트로닉스 시스템의 개요, 구성 요소 및 설계에 대해서 배운다. 센서의 원리 및 사용, 아날로그 디지털 변환회로 원리와 응용, 컴퓨터와의 인터페이싱 기법 등을 강의하며, DC모터의 제어를 포함한 실습을 수행한다."
  },
  {
   "code": "MEU3015",
   "ko": "전자기학및응용",
   "en": "Electromagnetics and Applications",
   "type": "전공선택",
   "credits": "",
   "desc": "기계공학도를 위한 전자기학의 물리적인 기본원리와 기계시스템 응용 지식을 학습한다. 본 강의 내용은 전자기학의 기본 물리이론, 전자기 응용으로 전기모터와 플라즈마 추진, 그리고 계산 전자기학의 기본 기술을 학습한다."
  },
  {
   "code": "MEU3301",
   "ko": "재료거동학",
   "en": "Mechanical Behaviors of Materials",
   "type": "전공선택",
   "credits": "",
   "desc": "응력 및 변형률 관계식, 재료거동에 대한 유변학 모델, 항복 및 파괴기준식, 파괴역학, 피로, 크립 등을 다룬다."
  },
  {
   "code": "MEU3600",
   "ko": "응용고체역학",
   "en": "Advanced Mechanics of Materials",
   "type": "전공선택",
   "credits": "",
   "desc": "고체역학에서 기본 개념을 확장하여 보에 대한 응용이론 (비대칭 굽힘, 박판 보의 전단응력, 곡선보 등), 셀 구조이론(얇은 막 응력, 실린더 셀의 축대칭 굽힘), 두꺼운 실린더 및 디스크의 응력 및 변형, 탄성안정론 을 다룬다."
  },
  {
   "code": "MEU3610",
   "ko": "응용열역학",
   "en": "Applied Thermodynamics",
   "type": "전공선택",
   "credits": "",
   "desc": "에너지 변환 동력기기와 공기조화 냉동기기에 대한 구체적인 작동 원리 및 이론에 초점을 맞춘다. 이를 위해 열역학 관계식, 혼합기체의 성질, 온도 및 습도조절, 응축 및 이슬점, 화학반응과 연소, 열역학적 발란스, 화학평형, 상평형 등을 공부한다."
  },
  {
   "code": "MEU3620",
   "ko": "생산공학",
   "en": "Manufacturing Process",
   "type": "전공선택",
   "credits": "",
   "desc": "기계적인 제품생산의 기초가 되는 주조, 성형, 절삭, 특수가공, 접합, 3D 프린팅 등 생산공정의 원리를 이해하고, 생산시스템 및 가공의 자동화, 생산의 경제학에 대한 개념을 학습함."
  },
  {
   "code": "MEU3630",
   "ko": "기계요소설계",
   "en": "Design of Machine Element",
   "type": "전공선택",
   "credits": "",
   "desc": "기계공학전공 학생들에게 역학적 지식을 활용하여 기계부품과 이들로 구성된 시스템에 대해 문제를 정의하고 설계하는 과정을 습득할 수 있는 기회를 제공한다. 본 과목은 기존의 이론을 바탕으로 하는 축, 베어링, 나사, 기어 등의 기계부품의 해석 및 설계를 중심으로 이루어지며 동시에 새로이 대두되고 있는 설계 방법을 소개한다."
  },
  {
   "code": "MEU3640",
   "ko": "응용유체역학",
   "en": "Applied Fluid Mechanics",
   "type": "전공선택",
   "credits": "",
   "desc": "관로유동, 외부유동, 포텐셜 유동, Open Channel 유동, 압축성 유동, 유체기계 및 전산유체역학에 대한 소개 등을 다룬다."
  },
  {
   "code": "MEU3650",
   "ko": "열전달",
   "en": "Heat Transfer",
   "type": "전공선택",
   "credits": "",
   "desc": "기계, 에너지, 전자 및 가전시스템의 설계/제작/운전/효율향상에 필요한 열전달에 대한 기본 원리 및 응용 방법(열전도, 휜 해석, 비정상 열전도, 열전달 수치해석, 강제대류, 자연대류, 복사, 응축, 증발 및 비등 열전달, 열교환기, 전자장비/나노/바이오 열전달 등)을 강의/토론/PBL 방식으로 배운다."
  },
  {
   "code": "MEU3660",
   "ko": "공학재료",
   "en": "Engineering Materials",
   "type": "전공선택",
   "credits": "",
   "desc": "소재의 물리적, 화학적 기본원리를 공부하고 금속, 세라믹, 고분자, 반도체, 복합재료의 격자구조, 결함, 평형상태도, 철-탄소계 합금의 성질 및 공학재료의 기계적, 전기적, 광학적 특성, 나노/바이오 응용 및 신소재 응용에서의 재료 선택과 설계방법을 습득한다."
  },
  {
   "code": "MEU3670",
   "ko": "기계진동",
   "en": "Mechanical Vibration",
   "type": "전공선택",
   "credits": "",
   "desc": "진동이라는 물리적 현상을 이해하고 동역학의 법칙을 활용하여 진동현상을 모델링하고 해석하는 방법을 배운다. 기계시스템의 진동의 분석과 이를 제어할 수 있는 방법을 배우고 기계설계에 어떻게 반영하는가를 학습한다."
  },
  {
   "code": "MEU3680",
   "ko": "기계시스템제어",
   "en": "Mechanical System Control",
   "type": "전공선택",
   "credits": "",
   "desc": "제어계의 개요. 모델링기법, 전달함수. 선형 시스템의 시간영역 및 주파수영역특성, 상태방정식, 안정도 판별법, 신호 흐름도 , 정상상태오차해석, 근궤적설계, 궤한제어, 제어계의 설계를 배운다."
  },
  {
   "code": "MEU3700",
   "ko": "생체역학",
   "en": "Biomechanics",
   "type": "전공선택",
   "credits": "",
   "desc": "기계공학의 역학이론을 바탕으로 하여 생체시스템의 작동 원리를 이해하고 기계공학적 해석 방법을 배운다. 세포역학, 혈류역학, 순환기 시스템, 호흡기 시스템, 근골격 시스템 등의 생체 조직 및 시스템에 대한 이해와 역학적 분석 방법을 습득하고 이를 바탕으로 조직 공학 및 생체모방 공학과 같은 최신 응용 기술을 배운다."
  },
  {
   "code": "MEU3710",
   "ko": "나노기계공학",
   "en": "Nano Mechanical Engineering",
   "type": "전공선택",
   "credits": "",
   "desc": "나노기술의 기본원리인 양자역학의 슈뢰딩거 운동방정식, 터널링, 불확정성 원리, 고체의 밴드 및 밴드갭 이론, 나노 열특성, 에너지 변환, 반도체 등에 대한 개념을 습득하고, 이를 이용한 측정 및 공정기술 등 기계공학에의 응용에 대해서 학습한다."
  },
  {
   "code": "MEU3801",
   "ko": "컴퓨터해석기반설계",
   "en": "Computational Analysis Based Design",
   "type": "전공선택",
   "credits": "",
   "desc": "기계공학 영역에서 컴퓨터의 응용 및 활용 능력 강화를 위한 전산해석기반설계 과목으로 다양한 기계 분야에 적용 가능한 FEM/CFD 등의 해석 기술과 함께 기본적인 설계 이론을 학습한다."
  },
  {
   "code": "MEU4001",
   "ko": "기계공학세미나(1)",
   "en": "Mechanical Engineering Seminar I",
   "type": "전공선택",
   "credits": "",
   "desc": "학생들로 하여금 기계공학도로서 필요한 교양, 직업윤리 의식, 공학 디자인, 공학 경영, 법률 및 특허 등을 세미나를 통하여 교육하고자 한다."
  },
  {
   "code": "MEU4002",
   "ko": "기계공학세미나(2)",
   "en": "Mechanical Engineering Seminar II",
   "type": "전공선택",
   "credits": "",
   "desc": "학생들로 하여금 기계공학도로서 필요한 교양, 직업윤리 의식, 공학 디자인, 공학 경영, 법률 및 특허 등을 세미나를 통하여 교육하고자 한다."
  },
  {
   "code": "MEU3003",
   "ko": "공학수치해석",
   "en": "Engineering Numerical Analysis",
   "type": "전공선택",
   "credits": "",
   "desc": "공학문제의 수치적 해결방법으로 여러 가지 수치기법, 알고리즘 등을 다룬다. 컴퓨터의 수치계산 오차, 대수방정식의 근 구하는 방법, 선형대수방정식의 해법, 최적화 방법, 커브피팅, 수치 미분/적분, 상미분 방정식, 편미분 방정식의 수치해석방법 등을 다룬다."
  },
  {
   "code": "MAT2013",
   "ko": "확률통계",
   "en": "Probability and Statistics",
   "type": "전공선택",
   "credits": "",
   "desc": "불확실한 현상을 모형화하기 위해 이산형 및 연속형 확률 변수들의 특성을 다루며 실험데이터를 이용한 모형의 분석을 위해 기초적인 통계기법과 가설의 검증 및 단순 회귀분석 기법 등을 다룬다."
  }
 ],
 "coursesGrad": [
  {
   "code": "MEU5001",
   "ko": "품질공학설계",
   "en": "Quality Engineering Design",
   "credits": "3"
  },
  {
   "code": "MEU5002",
   "ko": "분자열역학",
   "en": "Molecular Thermodynamics",
   "credits": "3"
  },
  {
   "code": "MEU5003",
   "ko": "복사열전달",
   "en": "Radiation Heat Transfer",
   "credits": "3"
  },
  {
   "code": "MEU5004",
   "ko": "나노기전소자",
   "en": "Nano Electro-Mechanical Devices",
   "credits": "3"
  },
  {
   "code": "MEU5005",
   "ko": "음향학 I",
   "en": "Accoustics I",
   "credits": "3"
  },
  {
   "code": "MEU5006",
   "ko": "음향학 II",
   "en": "Accoustics II",
   "credits": "3"
  },
  {
   "code": "MEU5007",
   "ko": "고급나노생산송정",
   "en": "Advanced Topics in Nano Devices",
   "credits": "3"
  },
  {
   "code": "MEU5008",
   "ko": "로보트공학",
   "en": "Robotics",
   "credits": "3"
  },
  {
   "code": "MEU5009",
   "ko": "공학도를위한심리음향학",
   "en": "Psychoacoustics for Engineers",
   "credits": "3"
  },
  {
   "code": "MEU5010",
   "ko": "비선형 음향학",
   "en": "Nonlinear Accoustics",
   "credits": "3"
  },
  {
   "code": "MEU5011",
   "ko": "극초단동역학",
   "en": "Ultrafast Dynamics",
   "credits": "3"
  },
  {
   "code": "MEU5012",
   "ko": "생체공학용재료 특론",
   "en": "Advanced Materials for Bio-Engineering",
   "credits": "3"
  },
  {
   "code": "MEU5013",
   "ko": "나노소자의 기본원리",
   "en": "Fundamentals for Nano Devices",
   "credits": "3"
  },
  {
   "code": "MEU5014",
   "ko": "바이오전산유체역학",
   "en": "Introduction to Computational Biofluidics",
   "credits": "3"
  },
  {
   "code": "MEU5015",
   "ko": "의생물학용 마이크로시스템의 설계 및 제조",
   "en": "Design and Fabrication for Biomedical Microdevices",
   "credits": "3"
  },
  {
   "code": "MEU5016",
   "ko": "나노전자기학개론",
   "en": "Fundamentals of Nanoelectronics",
   "credits": "3"
  },
  {
   "code": "MEU5017",
   "ko": "반도체소자이론",
   "en": "Principle of Semiconductor",
   "credits": "3"
  },
  {
   "code": "MEU5018",
   "ko": "기전설계",
   "en": "Electromechanical Design",
   "credits": "3"
  },
  {
   "code": "MEU5019",
   "ko": "위상최적설계이론",
   "en": "Theoretical Topology Optimization",
   "credits": "3"
  },
  {
   "code": "MEU5020",
   "ko": "고급열역학",
   "en": "Advanced Thermodynamics",
   "credits": "3"
  },
  {
   "code": "MEU5021",
   "ko": "바이오메디칼 광학 이미징",
   "en": "Biomedical Optical Imaging",
   "credits": "3"
  },
  {
   "code": "MEU5022",
   "ko": "기계공학에서의 광학기술 응용",
   "en": "Optics in Mechanical Engineering",
   "credits": "3"
  },
  {
   "code": "MEU5023",
   "ko": "생체 시스템의 기계적 거동",
   "en": "Mechanics in Biological System",
   "credits": "3"
  },
  {
   "code": "MEU5024",
   "ko": "비등열전달",
   "en": "Boiling Heat Transfer",
   "credits": "3"
  },
  {
   "code": "MEU5025",
   "ko": "생체물리학",
   "en": "Biopyhsics",
   "credits": "3"
  },
  {
   "code": "MEU5026",
   "ko": "응용동역학",
   "en": "Applied Dynamics",
   "credits": "3"
  },
  {
   "code": "MEU5027",
   "ko": "유체윤할",
   "en": "Fluid Film Lubrication",
   "credits": "3"
  },
  {
   "code": "MEU5028",
   "ko": "재료의 원자모사 방법론",
   "en": "Atomistic Simulation of Materials",
   "credits": "3"
  },
  {
   "code": "MEU5029",
   "ko": "실험모우드해석",
   "en": "Experimental Modal Analysis",
   "credits": "3"
  },
  {
   "code": "MEU5030",
   "ko": "연속체 역학",
   "en": "Continuum Mechanics",
   "credits": "3"
  },
  {
   "code": "MEU5031",
   "ko": "기구합성론",
   "en": "Planar Mechanism Design",
   "credits": "3"
  },
  {
   "code": "MEU5032",
   "ko": "마이크로 바이오 메카트로닉스",
   "en": "Microbiomechatronics",
   "credits": "3"
  },
  {
   "code": "MEU5033",
   "ko": "코팅의 물리 및 기계적 특성",
   "en": "Physics and Mechanics of Coatings",
   "credits": "3"
  },
  {
   "code": "MEU5034",
   "ko": "첨단응용소재",
   "en": "State-of-the-art Materials",
   "credits": "3"
  },
  {
   "code": "MEU5035",
   "ko": "나노테크날러지",
   "en": "Nanotechnology",
   "credits": "3"
  },
  {
   "code": "MEU5036",
   "ko": "기계가공의역학",
   "en": "Mechanics and Dynamics of Machining",
   "credits": "3"
  },
  {
   "code": "MEU5037",
   "ko": "공학응용수학",
   "en": "Applied Mathematics for Engineering",
   "credits": "3"
  },
  {
   "code": "MEU5038",
   "ko": "터보기계",
   "en": "Turbomachinery",
   "credits": "3"
  },
  {
   "code": "MEU5039",
   "ko": "장치설계",
   "en": "Thermal and Rotating Equipment Design",
   "credits": "3"
  },
  {
   "code": "MEU5040",
   "ko": "비점성유체역학",
   "en": "Inviscid Flow Theory",
   "credits": "3"
  },
  {
   "code": "MEU5041",
   "ko": "역학및전자기학응용해석",
   "en": "Applied Engineering in Mechanics and Electromagnetics",
   "credits": "3"
  },
  {
   "code": "MEU5042",
   "ko": "재료및구조역학",
   "en": "Material and Structure Mechanics",
   "credits": "3"
  },
  {
   "code": "MEU5043",
   "ko": "시스템 다이나믹스",
   "en": "System Dynamics",
   "credits": "3"
  },
  {
   "code": "MEU5044",
   "ko": "첨단 나노제작 기술",
   "en": "Advanced Nanofabrication Technologies",
   "credits": "3"
  },
  {
   "code": "MEU5045",
   "ko": "매개변수추정",
   "en": "Parameter Estimation",
   "credits": "3"
  },
  {
   "code": "MEU5046",
   "ko": "에너지변환시스템의 통합적해석",
   "en": "Integrative analysis of Energy Conversion System",
   "credits": "3"
  },
  {
   "code": "MEU5060",
   "ko": "나노광자공학특론",
   "en": "Advanced Nano Photonics",
   "credits": "3"
  },
  {
   "code": "MEU5080",
   "ko": "선형탄성파괴역학",
   "en": "Linear Elastic Fracture Mechanics",
   "credits": "3"
  },
  {
   "code": "MEU5090",
   "ko": "나노과학개론",
   "en": "Principles Of Nanoscience",
   "credits": "3"
  },
  {
   "code": "MEU5100",
   "ko": "전산유체특론",
   "en": "Special Topic in Computational Fluid Dynamics",
   "credits": "3"
  },
  {
   "code": "MEU5110",
   "ko": "바이오산업창업과경영",
   "en": "Bio-Industry and Management",
   "credits": "3"
  },
  {
   "code": "MEU5120",
   "ko": "기계금속학",
   "en": "Mechanical Metallurgy",
   "credits": "3"
  },
  {
   "code": "MEU5130",
   "ko": "기계기구학특론",
   "en": "Advanced Kinematics of Machines",
   "credits": "3"
  },
  {
   "code": "MEU5150",
   "ko": "내연기관이론 및 실험",
   "en": "Internal Combustion Engine Theory and Experiment",
   "credits": "3"
  },
  {
   "code": "MEU5210",
   "ko": "통계열역학",
   "en": "Statistical Thermodynamics",
   "credits": "3"
  },
  {
   "code": "MEU5230",
   "ko": "터보기계특론",
   "en": "Special Topics in Turbomachinery",
   "credits": "3"
  },
  {
   "code": "MEU5241",
   "ko": "응용수치해석",
   "en": "Applied Numerical Analysis",
   "credits": "3"
  },
  {
   "code": "MEU5310",
   "ko": "기계진동학특론",
   "en": "Advanced Mechanical Vibration",
   "credits": "3"
  },
  {
   "code": "MEU5320",
   "ko": "시스템설계",
   "en": "System Design",
   "credits": "3"
  },
  {
   "code": "MEU5370",
   "ko": "유한요소법",
   "en": "Finite Element Method",
   "credits": "3"
  },
  {
   "code": "MEU5410",
   "ko": "동시공학설계",
   "en": "Concurrent Engineering Design",
   "credits": "3"
  },
  {
   "code": "MEU5420",
   "ko": "공정계획설계",
   "en": "Process Planning Design",
   "credits": "3"
  },
  {
   "code": "MEU5430",
   "ko": "제품개발및설계",
   "en": "Product Development and Design",
   "credits": "3"
  },
  {
   "code": "MEU5450",
   "ko": "마이크로시스템 설계",
   "en": "Microsystem Design",
   "credits": "3"
  },
  {
   "code": "MEU5460",
   "ko": "연소화학개론",
   "en": "Introduction to Combustion Chemistry",
   "credits": "3"
  },
  {
   "code": "MEU5480",
   "ko": "생체분석시스템",
   "en": "Bio-Analytical Systems",
   "credits": "3"
  },
  {
   "code": "MEU5630",
   "ko": "창의적문제해결방법론의 개요",
   "en": "Introduction to TRIZ",
   "credits": "3"
  },
  {
   "code": "MEU6000",
   "ko": "동역학특론",
   "en": "Advanced Dynamics",
   "credits": "3"
  },
  {
   "code": "MEU6001",
   "ko": "전자기학개론",
   "en": "Instroduction to Electrodynamics",
   "credits": "3"
  },
  {
   "code": "MEU6002",
   "ko": "세포역학",
   "en": "Mechanical of the Cells",
   "credits": "3"
  },
  {
   "code": "MEU6003",
   "ko": "제품개발론",
   "en": "Product Planning And Development",
   "credits": "3"
  },
  {
   "code": "MEU6004",
   "ko": "박막플라즈마공정",
   "en": "Processing of Thin Film and Plasma",
   "credits": "3"
  },
  {
   "code": "MEU6005",
   "ko": "고급극초단동역학",
   "en": "Advanced Ultrafast Dynamics",
   "credits": "3"
  },
  {
   "code": "MEU6006",
   "ko": "마이크로옵틱스설계제조",
   "en": "Design and Fabrication of Micro-Optics",
   "credits": "3"
  },
  {
   "code": "MEU6010",
   "ko": "나노스케일에너지전달",
   "en": "Micro/Nanoscale Energy Transport",
   "credits": "3"
  },
  {
   "code": "MEU6011",
   "ko": "컴퓨터해석기구학특론",
   "en": "Computer Aided Mechanism Analysis",
   "credits": "3"
  },
  {
   "code": "MEU6020",
   "ko": "탄소성파괴역학",
   "en": "Elastic-Plastic Fracture Mechanics",
   "credits": "3"
  },
  {
   "code": "MEU6041",
   "ko": "최적설계공학",
   "en": "Engineering Design Optimization",
   "credits": "3"
  },
  {
   "code": "MEU6050",
   "ko": "기계금속학특론",
   "en": "Special Topics of Mechanical Metallurgy",
   "credits": "3"
  },
  {
   "code": "MEU6060",
   "ko": "분자기체역학",
   "en": "Molecular Gas Dynamics",
   "credits": "3"
  },
  {
   "code": "MEU6070",
   "ko": "포토닉스",
   "en": "Photonics",
   "credits": "3"
  },
  {
   "code": "MEU6071",
   "ko": "소프트컴퓨팅응용시스템설계",
   "en": "Soft Computing in Intelligent System Design",
   "credits": "3"
  },
  {
   "code": "MEU6080",
   "ko": "마이크로시스템역학",
   "en": "Mechanics of Microsystems",
   "credits": "3"
  },
  {
   "code": "MEU6090",
   "ko": "세포칩 특론",
   "en": "Special Topics on Cell Chip",
   "credits": "3"
  },
  {
   "code": "MEU6101",
   "ko": "기계-전자기기설계",
   "en": "Mechanical-Electric Device Design",
   "credits": "3"
  },
  {
   "code": "MEU6111",
   "ko": "구조최적설계",
   "en": "Structural Optimal Design",
   "credits": "3"
  },
  {
   "code": "MEU6130",
   "ko": "용접공학특론",
   "en": "Advanced Welding Engineering",
   "credits": "3"
  },
  {
   "code": "MEU6140",
   "ko": "특수가공법",
   "en": "Special Topics in Contact Manufacturing Process",
   "credits": "3"
  },
  {
   "code": "MEU6160",
   "ko": "기계역학특론",
   "en": "Advanced Dynamics of Machinery",
   "credits": "3"
  },
  {
   "code": "MEU6170",
   "ko": "첨단레이져광공학",
   "en": "Advanced Laser and Optical Engineering",
   "credits": "3"
  },
  {
   "code": "MEU6180",
   "ko": "신뢰성공학",
   "en": "Engineering Reliability",
   "credits": "3"
  },
  {
   "code": "MEU6190",
   "ko": "접촉역학",
   "en": "Contact Mechanics",
   "credits": "3"
  },
  {
   "code": "MEU6200",
   "ko": "공리설계론",
   "en": "Axiomatic Design",
   "credits": "3"
  },
  {
   "code": "MEU6210",
   "ko": "전도열전달",
   "en": "Conduction Heat Transfer",
   "credits": "3"
  },
  {
   "code": "MEU6230",
   "ko": "점성유체역학",
   "en": "Viscous Fluid Dynamics",
   "credits": "3"
  },
  {
   "code": "MEU6240",
   "ko": "연소공학",
   "en": "Combustion Engineering",
   "credits": "3"
  },
  {
   "code": "MEU6241",
   "ko": "실험역학",
   "en": "Experimental Mechanics",
   "credits": "3"
  },
  {
   "code": "MEU6250",
   "ko": "열시스템설계",
   "en": "Design of Thermal System",
   "credits": "3"
  },
  {
   "code": "MEU6260",
   "ko": "전산유체역학",
   "en": "Computational Fluid Dynamics",
   "credits": "3"
  },
  {
   "code": "MEU6261",
   "ko": "복합재료역학",
   "en": "Engineering Mechanics of Composite Materials",
   "credits": "3"
  },
  {
   "code": "MEU6270",
   "ko": "고급윤활공학",
   "en": "Advanced Triboligy",
   "credits": "3"
  },
  {
   "code": "MEU6290",
   "ko": "입자공학",
   "en": "Particle Engineering",
   "credits": "3"
  },
  {
   "code": "MEU6340",
   "ko": "자동제어론",
   "en": "Theory of Automatic Control",
   "credits": "3"
  },
  {
   "code": "MEU6350",
   "ko": "전기부품신뢰성설계",
   "en": "Reliability Design For Electric Parts",
   "credits": "3"
  },
  {
   "code": "MEU6360",
   "ko": "설계최적화특론",
   "en": "Advanced Optimal Design",
   "credits": "3"
  },
  {
   "code": "MEU6411",
   "ko": "마이크로광부품제조특론",
   "en": "Micro-Optics Fabrication",
   "credits": "3"
  },
  {
   "code": "MEU6420",
   "ko": "전산난류특론",
   "en": "Special Topics in Computational Turbulence",
   "credits": "3"
  },
  {
   "code": "MEU6430",
   "ko": "마이크로 및 나노 성형공정",
   "en": "Micro and Nano Molding Process",
   "credits": "3"
  },
  {
   "code": "MEU6440",
   "ko": "플라즈마공학",
   "en": "Plasma Engineering",
   "credits": "3"
  },
  {
   "code": "MEU6450",
   "ko": "접촉역학특론",
   "en": "Special Topics in Contact Mechanics",
   "credits": "3"
  },
  {
   "code": "MEU6460",
   "ko": "기계공학을위한센서기술",
   "en": "Sensor Technology Applied To Mechanical Engineering",
   "credits": "3"
  },
  {
   "code": "MEU6470",
   "ko": "응력해석과파손설계",
   "en": "Stress Analysis and Failure",
   "credits": "3"
  },
  {
   "code": "MEU6500",
   "ko": "센서공학",
   "en": "Sensors",
   "credits": "3"
  },
  {
   "code": "MEU6510",
   "ko": "추진공학",
   "en": "Propulsion Engineering",
   "credits": "3"
  },
  {
   "code": "MEU6520",
   "ko": "대류열전달",
   "en": "Convective Heat Transfer",
   "credits": "3"
  },
  {
   "code": "MEU6530",
   "ko": "가스터빈특론",
   "en": "Advanced Gas Turbines",
   "credits": "3"
  },
  {
   "code": "MEU6540",
   "ko": "열/유체실험공학",
   "en": "Experimental Method in Heat Transfer",
   "credits": "3"
  },
  {
   "code": "MEU6560",
   "ko": "열환경공학",
   "en": "Thermal Environmental Engineering",
   "credits": "3"
  },
  {
   "code": "MEU6600",
   "ko": "MEMS특론",
   "en": "MEMS",
   "credits": "3"
  },
  {
   "code": "MEU6610",
   "ko": "마찰및마멸",
   "en": "Friction and Wear",
   "credits": "3"
  },
  {
   "code": "MEU6620",
   "ko": "바이오엔지니어링특론",
   "en": "Special Topics in Bioengineering",
   "credits": "3"
  },
  {
   "code": "MEU6630",
   "ko": "나노트라이볼로지",
   "en": "Nanotribology",
   "credits": "3"
  },
  {
   "code": "MEU6640",
   "ko": "바이오엔지니어링특론II",
   "en": "Special Topics in Bioengineering II",
   "credits": "3"
  },
  {
   "code": "MEU6641",
   "ko": "로봇운동학",
   "en": "Kinematics and Dynamics of Robots",
   "credits": "3"
  },
  {
   "code": "MEU6671",
   "ko": "운동기하학",
   "en": "Kinematic Geometry",
   "credits": "3"
  },
  {
   "code": "MEU6810",
   "ko": "기계공학세미나1",
   "en": "Seminar in Mechanical Science I",
   "credits": "3"
  },
  {
   "code": "MEU6820",
   "ko": "기계공학세미나2",
   "en": "Seminar in Mechanical Science II",
   "credits": "3"
  },
  {
   "code": "MEU6900",
   "ko": "창의설계특론",
   "en": "Special Topics in Creative Design",
   "credits": "3"
  },
  {
   "code": "MEU7001",
   "ko": "입자공학특론",
   "en": "Advanced Particle Engineering",
   "credits": "3"
  },
  {
   "code": "MEU7002",
   "ko": "연소공학특론",
   "en": "Special Topics in Combustion Engineering",
   "credits": "3"
  },
  {
   "code": "MEU7003",
   "ko": "파손설계특론",
   "en": "Special Topics on Failure Design",
   "credits": "3"
  },
  {
   "code": "MEU7004",
   "ko": "열환경공학특론",
   "en": "Advanced Thermal Environmental Engineering",
   "credits": "3"
  },
  {
   "code": "MEU7005",
   "ko": "응력재료설계특론",
   "en": "Special Topics of Design of Stress and Materials",
   "credits": "3"
  },
  {
   "code": "MEU7006",
   "ko": "기계와 금속공학의 융합기술",
   "en": "Fusion Technology of Mechanical and Material Engineering",
   "credits": "3"
  },
  {
   "code": "MEU7007",
   "ko": "기계금속해석특론",
   "en": "Special Topics on Mechanical and Metallugical Analysis",
   "credits": "3"
  },
  {
   "code": "MEU7008",
   "ko": "양자론과 양자역학개론",
   "en": "Introduction to Quantum Theory and Mechanics",
   "credits": "3"
  },
  {
   "code": "MEU7009",
   "ko": "위상최적설계이론",
   "en": "Theoretical Topology Optimization",
   "credits": "3"
  },
  {
   "code": "MEU7010",
   "ko": "에어로졸응용공학",
   "en": "Application of Aerosol Science and Technology",
   "credits": "3"
  },
  {
   "code": "MEU7011",
   "ko": "응력해석",
   "en": "Stress Analysis",
   "credits": "3"
  },
  {
   "code": "MEU7012",
   "ko": "내부유동",
   "en": "Internal Flow",
   "credits": "3"
  },
  {
   "code": "MEU7013",
   "ko": "응용전산유체역학",
   "en": "Applied Device Design and Development",
   "credits": "3"
  },
  {
   "code": "MEU7014",
   "ko": "메디칼디바이스 설계 및 개발",
   "en": "Medical Device Design and Development",
   "credits": "3"
  },
  {
   "code": "MEU7015",
   "ko": "분자및세포역학",
   "en": "Molecular and Cell Biomechanics",
   "credits": "3"
  },
  {
   "code": "MEU7016",
   "ko": "전기화학 에너지 시스템",
   "en": "Electrochemical Energy Systems",
   "credits": "3"
  },
  {
   "code": "MEU7017",
   "ko": "터보기계 실험공학",
   "en": "Experimental Methods for Turbomachinery",
   "credits": "3"
  },
  {
   "code": "MEU7018",
   "ko": "전산 나노 과학",
   "en": "Computational Nanotechnology",
   "credits": "3"
  },
  {
   "code": "MEU7030",
   "ko": "탄성이론",
   "en": "Theory of Elasticity",
   "credits": "3"
  },
  {
   "code": "MEU7060",
   "ko": "기체운동론",
   "en": "Kinetic Theory of Gas",
   "credits": "3"
  },
  {
   "code": "MEU7070",
   "ko": "나선이론",
   "en": "Screw Theory",
   "credits": "3"
  },
  {
   "code": "MEU7110",
   "ko": "모우드해석",
   "en": "Modal Analysis",
   "credits": "3"
  },
  {
   "code": "MEU7120",
   "ko": "진동제어",
   "en": "Vibration Control",
   "credits": "3"
  },
  {
   "code": "MEU7130",
   "ko": "컴퓨터통합생산시스템특론",
   "en": "Computer Integrated Manufacturing",
   "credits": "3"
  },
  {
   "code": "MEU7140",
   "ko": "메카트로닉스응용",
   "en": "Application of Mechatronics",
   "credits": "3"
  },
  {
   "code": "MEU7160",
   "ko": "광공학특론",
   "en": "Advanced Optical Engineering",
   "credits": "3"
  },
  {
   "code": "MEU7170",
   "ko": "생산시스템제어공학",
   "en": "Control of Manufacturing System and Processes",
   "credits": "3"
  },
  {
   "code": "MEU7250",
   "ko": "전달현상특론",
   "en": "Advanced Transport Phenomena",
   "credits": "3"
  },
  {
   "code": "MEU7260",
   "ko": "유동안정성이론",
   "en": "Theory of Hydrodynamic Stability",
   "credits": "3"
  },
  {
   "code": "MEU7270",
   "ko": "근사해법",
   "en": "Pertubation Method",
   "credits": "3"
  },
  {
   "code": "MEU7300",
   "ko": "난류이론",
   "en": "Theory of Turbulent Flow",
   "credits": "3"
  },
  {
   "code": "MEU7310",
   "ko": "판의이론",
   "en": "Theory of Plates",
   "credits": "3"
  },
  {
   "code": "MEU7330",
   "ko": "구조진동학특론",
   "en": "Advanced Method in Structural Vibration",
   "credits": "3"
  },
  {
   "code": "MEU7350",
   "ko": "복합재료역학",
   "en": "Mechanics of Composite Materials",
   "credits": "3"
  },
  {
   "code": "MEU7370",
   "ko": "자동제어특론",
   "en": "Advanced Theory of Automatic Control",
   "credits": "3"
  },
  {
   "code": "MEU7410",
   "ko": "유체기계특론",
   "en": "Special Topics in Fluid Machinery",
   "credits": "3"
  },
  {
   "code": "MEU7450",
   "ko": "윤활특론",
   "en": "Special Topics in Tribology",
   "credits": "3"
  },
  {
   "code": "MEU7460",
   "ko": "난류특론",
   "en": "Special Topics in Turbulence",
   "credits": "3"
  },
  {
   "code": "MEU7470",
   "ko": "패키징공학",
   "en": "Electronic Packaging",
   "credits": "3"
  },
  {
   "code": "MEU7610",
   "ko": "마찰학응용",
   "en": "Applications in Tribology",
   "credits": "3"
  },
  {
   "code": "MEU7630",
   "ko": "공기조화및냉동공학특론",
   "en": "Special Topics in HVAC",
   "credits": "3"
  },
  {
   "code": "MEU7910",
   "ko": "기계공학세미나3",
   "en": "Seminar in Mechanical Science 3",
   "credits": "3"
  },
  {
   "code": "MEU7920",
   "ko": "기계공학세미나4",
   "en": "Seminar in Mechanical Science 4",
   "credits": "3"
  },
  {
   "code": "MEU7930",
   "ko": "압축성유체역학",
   "en": "Compressible Fluid Dynamics",
   "credits": "3"
  },
  {
   "code": "MEU7999",
   "ko": "연구지도1",
   "en": "Directed Research 1",
   "credits": "0"
  },
  {
   "code": "MEU8120",
   "ko": "정밀가공이론",
   "en": "Theory of Precision Machining",
   "credits": "3"
  },
  {
   "code": "MEU8130",
   "ko": "제조공정특강",
   "en": "Special Topics in Manufacturing Processes",
   "credits": "3"
  },
  {
   "code": "MEU8210",
   "ko": "내연기관특론",
   "en": "Advanced Internal Combustion Engines",
   "credits": "3"
  },
  {
   "code": "MEU8230",
   "ko": "방전가공특론",
   "en": "Special Topics in Electrical Discharge Machining",
   "credits": "3"
  },
  {
   "code": "MEU8250",
   "ko": "열전달특론",
   "en": "Special Topics in Heat Transfer",
   "credits": "3"
  },
  {
   "code": "MEU8260",
   "ko": "공작기계설계특론",
   "en": "Design of Precision Machine Tool System",
   "credits": "3"
  },
  {
   "code": "MEU8350",
   "ko": "비선형제어",
   "en": "Nonlinear Control",
   "credits": "3"
  },
  {
   "code": "MEU8400",
   "ko": "재료거동학특론",
   "en": "Special Topics in Mechanical Behavior of Materials",
   "credits": "3"
  },
  {
   "code": "MEU8770",
   "ko": "고분자가공특론",
   "en": "Special Topics in Polymer Processing",
   "credits": "3"
  },
  {
   "code": "MEU9999",
   "ko": "연구지도2",
   "en": "Directed Research 2",
   "credits": "0"
  }
 ],
 "curriculum": [
  {
   "year": "1",
   "sem": "1",
   "type": "대교",
   "code": "MAT1011",
   "ko": "공학수학(1)",
   "credits": "3",
   "hours": "3(1)"
  },
  {
   "year": "1",
   "sem": "1",
   "type": "대교",
   "code": "PHY1011",
   "ko": "공학물리학및실험(1)",
   "credits": "3",
   "hours": "2(2)"
  },
  {
   "year": "1",
   "sem": "1",
   "type": "대교",
   "code": "CHE1011",
   "ko": "공학화학및실험(1)",
   "credits": "3",
   "hours": "2(2)"
  },
  {
   "year": "1",
   "sem": "1",
   "type": "전필",
   "code": "MEU2300",
   "ko": "기계공학창의설계",
   "credits": "3",
   "hours": "2(2)"
  },
  {
   "year": "1",
   "sem": "2",
   "type": "대교",
   "code": "MAT1012",
   "ko": "공학수학(2)",
   "credits": "3",
   "hours": "3(1)"
  },
  {
   "year": "1",
   "sem": "2",
   "type": "대교",
   "code": "PHY1012",
   "ko": "공학물리학및실험(2)",
   "credits": "3",
   "hours": "2(2)"
  },
  {
   "year": "1",
   "sem": "2",
   "type": "대교",
   "code": "CHE1012",
   "ko": "공학화학및실험(2)",
   "credits": "3",
   "hours": "2(2)"
  },
  {
   "year": "2",
   "sem": "1",
   "type": "대교",
   "code": "ENG1108",
   "ko": "공학정보처리",
   "credits": "3",
   "hours": "2(2)"
  },
  {
   "year": "2",
   "sem": "1",
   "type": "대교",
   "code": "MAT2016",
   "ko": "공학수학(3)",
   "credits": "3",
   "hours": "3(1)"
  },
  {
   "year": "2",
   "sem": "1",
   "type": "전필",
   "code": "MEU2600",
   "ko": "고체역학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "2",
   "sem": "1",
   "type": "전필",
   "code": "MEU2610",
   "ko": "열역학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "2",
   "sem": "1",
   "type": "전선",
   "code": "MEU2620",
   "ko": "컴퓨터응용기계설계",
   "credits": "3",
   "hours": "2(2)"
  },
  {
   "year": "2",
   "sem": "2",
   "type": "대교",
   "code": "MAT2017",
   "ko": "공학수학(4)",
   "credits": "3",
   "hours": "3(1)"
  },
  {
   "year": "2",
   "sem": "2",
   "type": "전필",
   "code": "MEU2640",
   "ko": "유체역학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "2",
   "sem": "2",
   "type": "전필",
   "code": "MEU2650",
   "ko": "동역학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "2",
   "sem": "2",
   "type": "전필",
   "code": "MEU2104",
   "ko": "기계공학실험(1)",
   "credits": "3",
   "hours": "1(2)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3003",
   "ko": "공학수치해석",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MAT2013",
   "ko": "확률통계",
   "credits": "3",
   "hours": "3(1)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전필",
   "code": "MEU3005",
   "ko": "기계공학실험(2)",
   "credits": "3",
   "hours": "1(2)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3670",
   "ko": "기계진동",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3650",
   "ko": "열전달",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3620",
   "ko": "생산공학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3002",
   "ko": "메카니즘설계",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3004",
   "ko": "바이오의료기계",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3010",
   "ko": "마이크로기계시스템",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3640",
   "ko": "응용유체역학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3301",
   "ko": "재료거동학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3015",
   "ko": "전자기학및응용",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3001",
   "ko": "환경기계공학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "1",
   "type": "전선",
   "code": "MEU3006",
   "ko": "학부연구(1)",
   "credits": "1",
   "hours": "1(1)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3630",
   "ko": "기계요소설계",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3600",
   "ko": "응용고체역학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3610",
   "ko": "응용열역학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3690",
   "ko": "메카트로닉스",
   "credits": "3",
   "hours": "3(1)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3680",
   "ko": "기계시스템제어",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3700",
   "ko": "생체역학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3600",
   "ko": "공학재료",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3012",
   "ko": "광공학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3013",
   "ko": "정형생산시스템",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3011",
   "ko": "에너지동력공학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3710",
   "ko": "나노기계공학",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3801",
   "ko": "컴퓨터해석기반설계",
   "credits": "3",
   "hours": "2(2)"
  },
  {
   "year": "3 & 4",
   "sem": "2",
   "type": "전선",
   "code": "MEU3007",
   "ko": "학부연구(2)",
   "credits": "1",
   "hours": "1(1)"
  },
  {
   "year": "4",
   "sem": "1",
   "type": "전필",
   "code": "MEU4300",
   "ko": "창의제품설계",
   "credits": "3",
   "hours": "4(2)"
  },
  {
   "year": "4",
   "sem": "1",
   "type": "전필",
   "code": "MEU4400",
   "ko": "연구논문",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "4",
   "sem": "1",
   "type": "전선",
   "code": "MEU4001",
   "ko": "기계공학세미나(1)",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "4",
   "sem": "2",
   "type": "전필",
   "code": "MEU4300",
   "ko": "창의제품설계",
   "credits": "3",
   "hours": "4(2)"
  },
  {
   "year": "4",
   "sem": "2",
   "type": "전필",
   "code": "MEU4400",
   "ko": "연구논문",
   "credits": "3",
   "hours": "3(0)"
  },
  {
   "year": "4",
   "sem": "2",
   "type": "전선",
   "code": "MEU4002",
   "ko": "기계공학세미나(2)",
   "credits": "3",
   "hours": "3(0)"
  }
 ],
 "curriculumTree": {
  "note": "학번마다 교과목 체계가 다르니, 상세 정보를 위해 각 학번의 졸업 요건을 확인하시기 바랍니다.",
  "semesters": [
   "1-1",
   "1-2",
   "2-1",
   "2-2",
   "3-1",
   "3-2",
   "4-1",
   "4-2"
  ],
  "rows": [
   {
    "id": "msc",
    "label": "MSC",
    "cells": [
     {
      "at": "1-1",
      "courses": [
       {
        "ko": "공학수학 1"
       },
       {
        "ko": "공학물리학 및 실험 1"
       },
       {
        "ko": "공학화학 및 실험 1"
       }
      ]
     },
     {
      "at": "1-2",
      "courses": [
       {
        "ko": "공학수학 2"
       },
       {
        "ko": "공학물리학 및 실험 2"
       },
       {
        "ko": "공학화학 및 실험 2"
       }
      ]
     },
     {
      "at": "2-1",
      "courses": [
       {
        "ko": "공학수학 3"
       },
       {
        "ko": "공학정보처리"
       }
      ]
     },
     {
      "at": "2-2",
      "courses": [
       {
        "ko": "공학수학 4"
       }
      ]
     }
    ],
    "choose": {
     "label": "1과목 선택",
     "courses": [
      {
       "ko": "공학수치해석",
       "code": "MEU3003"
      },
      {
       "ko": "확률통계",
       "code": "MAT2013"
      }
     ]
    }
   },
   {
    "id": "major",
    "label": "전공",
    "cells": [
     {
      "at": "2-1",
      "courses": [
       {
        "ko": "고체역학",
        "code": "MEU2600",
        "req": true
       },
       {
        "ko": "열역학",
        "code": "MEU2610",
        "req": true
       },
       {
        "ko": "컴퓨터 응용 기계 설계",
        "code": "MEU2620"
       }
      ]
     },
     {
      "at": "2-2",
      "courses": [
       {
        "ko": "유체역학",
        "code": "MEU2640",
        "req": true
       },
       {
        "ko": "동역학",
        "code": "MEU2650",
        "req": true
       },
       {
        "ko": "기계공학실험(1)",
        "code": "MEU2104",
        "req": true
       }
      ]
     }
    ],
    "upper": {
     "label": "3-4학년",
     "terms": [
      {
       "label": "1학기",
       "courses": [
        {
         "ko": "재료거동학"
        },
        {
         "ko": "열전달"
        },
        {
         "ko": "환경기계공학"
        },
        {
         "ko": "생산공학"
        },
        {
         "ko": "마이크로기계시스템"
        },
        {
         "ko": "응용유체역학"
        },
        {
         "ko": "전자기학및응용"
        },
        {
         "ko": "기계진동"
        },
        {
         "ko": "메카니즘설계"
        },
        {
         "ko": "기계공학실험(2)",
         "req": true
        },
        {
         "ko": "바이오의료기계"
        },
        {
         "ko": "학부연구(1)"
        }
       ]
      },
      {
       "label": "2학기",
       "courses": [
        {
         "ko": "응용고체역학"
        },
        {
         "ko": "공학재료"
        },
        {
         "ko": "응용열역학"
        },
        {
         "ko": "나노기계공학"
        },
        {
         "ko": "정형생산시스템"
        },
        {
         "ko": "광공학"
        },
        {
         "ko": "에너지동력공학"
        },
        {
         "ko": "기계요소설계"
        },
        {
         "ko": "기계시스템제어"
        },
        {
         "ko": "생체역학"
        },
        {
         "ko": "메카트로닉스"
        },
        {
         "ko": "컴퓨터해석기반설계"
        },
        {
         "ko": "학부연구(2)"
        }
       ]
      }
     ],
     "special": {
      "ko": "스페셜 토픽"
     }
    },
    "capstone": [
     {
      "ko": "창의제품설계",
      "code": "MEU4300",
      "req": true
     },
     {
      "ko": "연구논문",
      "code": "MEU4400",
      "req": true
     },
     {
      "ko": "기계공학세미나(1)",
      "code": "MEU4001"
     },
     {
      "ko": "기계공학세미나(2)",
      "code": "MEU4002"
     }
    ]
   }
  ],
  "prereq": [
   {
    "from": "공학수학 2",
    "toRow": "major",
    "gateAt": "2-1",
    "label": "2학년 전공 진입"
   },
   {
    "from": "공학수학 4",
    "toRow": "major",
    "gateAt": "3-1",
    "label": "3학년 전공 진입"
   }
  ],
  "liberal": {
   "label": "교양",
   "common": [
    "글쓰기",
    "기독교의 이해 영역 중 1과목",
    "대학영어 Ⅰ, 대학영어 Ⅱ (혹은 고급대학영어 Ⅰ, 대학영어 Ⅱ)"
   ],
   "tech": [
    "과학기술과 사회",
    "기술창조와 특허",
    "테크노리더십",
    "창업 103:21C 기술 경영",
    "경제성 공학"
   ],
   "areas": [
    {
     "label": "21학번 포함 이전",
     "fields": "문학과예술, 인간과역사, 언어와표현, 가치와윤리, 국가와사회, 지역과세계, 정보와기술의 7개 영역 중",
     "rule": "5개 영역에서 각 1과목씩 이수 필수"
    },
    {
     "label": "22학번 포함 이후",
     "fields": "문학과예술, 인간과역사, 언어와표현, 가치와윤리, 국가와사회, 지역과세계의 6개 영역 중",
     "rule": "4개 영역에서 각 1과목씩 이수 필수"
    }
   ]
  },
  "tracks": [
   {
    "id": "basic",
    "label": "기초·공통",
    "courses": [
     {
      "ko": "공학수학 1",
      "at": "1-1"
     },
     {
      "ko": "공학물리학 및 실험 1",
      "at": "1-1"
     },
     {
      "ko": "공학화학 및 실험 1",
      "at": "1-1"
     },
     {
      "ko": "공학수학 2",
      "at": "1-2"
     },
     {
      "ko": "공학물리학 및 실험 2",
      "at": "1-2"
     },
     {
      "ko": "공학화학 및 실험 2",
      "at": "1-2"
     },
     {
      "ko": "공학수학 3",
      "at": "2-1"
     },
     {
      "ko": "공학정보처리",
      "at": "2-1"
     },
     {
      "ko": "공학수학 4",
      "at": "2-2"
     },
     {
      "ko": "공학수치해석",
      "at": "3-1",
      "code": "MEU3003"
     },
     {
      "ko": "확률통계",
      "at": "3-1",
      "code": "MAT2013"
     },
     {
      "ko": "컴퓨터 응용 기계 설계",
      "at": "2-1",
      "code": "MEU2620"
     },
     {
      "ko": "컴퓨터해석기반설계",
      "at": "3-2"
     }
    ]
   },
   {
    "id": "solid",
    "label": "역학·재료",
    "courses": [
     {
      "ko": "고체역학",
      "at": "2-1",
      "code": "MEU2600",
      "req": true
     },
     {
      "ko": "재료거동학",
      "at": "3-1"
     },
     {
      "ko": "응용고체역학",
      "at": "3-2"
     },
     {
      "ko": "공학재료",
      "at": "3-2"
     }
    ]
   },
   {
    "id": "thermal",
    "label": "열·유체",
    "courses": [
     {
      "ko": "열역학",
      "at": "2-1",
      "code": "MEU2610",
      "req": true
     },
     {
      "ko": "유체역학",
      "at": "2-2",
      "code": "MEU2640",
      "req": true
     },
     {
      "ko": "열전달",
      "at": "3-1"
     },
     {
      "ko": "환경기계공학",
      "at": "3-1"
     },
     {
      "ko": "응용유체역학",
      "at": "3-1"
     },
     {
      "ko": "응용열역학",
      "at": "3-2"
     },
     {
      "ko": "에너지동력공학",
      "at": "3-2"
     }
    ]
   },
   {
    "id": "dynamics",
    "label": "동역학·제어",
    "courses": [
     {
      "ko": "동역학",
      "at": "2-2",
      "code": "MEU2650",
      "req": true
     },
     {
      "ko": "전자기학및응용",
      "at": "3-1"
     },
     {
      "ko": "기계진동",
      "at": "3-1"
     },
     {
      "ko": "기계시스템제어",
      "at": "3-2"
     },
     {
      "ko": "메카트로닉스",
      "at": "3-2"
     }
    ]
   },
   {
    "id": "manufacturing",
    "label": "설계·제조",
    "courses": [
     {
      "ko": "생산공학",
      "at": "3-1"
     },
     {
      "ko": "메카니즘설계",
      "at": "3-1"
     },
     {
      "ko": "정형생산시스템",
      "at": "3-2"
     },
     {
      "ko": "기계요소설계",
      "at": "3-2"
     }
    ]
   },
   {
    "id": "micro",
    "label": "마이크로·나노",
    "courses": [
     {
      "ko": "마이크로기계시스템",
      "at": "3-1"
     },
     {
      "ko": "나노기계공학",
      "at": "3-2"
     }
    ]
   },
   {
    "id": "optics",
    "label": "바이오·포토닉스",
    "courses": [
     {
      "ko": "바이오의료기계",
      "at": "3-1"
     },
     {
      "ko": "광공학",
      "at": "3-2"
     },
     {
      "ko": "생체역학",
      "at": "3-2"
     }
    ]
   },
   {
    "id": "lab",
    "label": "실험·연구",
    "courses": [
     {
      "ko": "기계공학실험(1)",
      "at": "2-2",
      "code": "MEU2104",
      "req": true
     },
     {
      "ko": "기계공학실험(2)",
      "at": "3-1",
      "req": true
     },
     {
      "ko": "학부연구(1)",
      "at": "3-1"
     },
     {
      "ko": "학부연구(2)",
      "at": "3-2"
     },
     {
      "ko": "창의제품설계",
      "at": "4-1",
      "code": "MEU4300",
      "req": true
     },
     {
      "ko": "연구논문",
      "at": "4-1",
      "code": "MEU4400",
      "req": true
     },
     {
      "ko": "기계공학세미나(1)",
      "at": "4-2",
      "code": "MEU4001"
     },
     {
      "ko": "기계공학세미나(2)",
      "at": "4-2",
      "code": "MEU4002"
     }
    ]
   }
  ],
  "tracksSource": {
   "source": "학부 공식 「기계공학부 교과목 트리」의 과목을 과목명 기준으로 여섯 연구 분야 + 기초·공통 + 실험·연구로 나눈 것",
   "note": "분야 구분은 우리 정보구조다 — 공식 트리에는 MSC·전공·교양 구분만 있다."
  }
 },
 "curriculumTreeSource": {
  "source": "기계공학-교과목이수체계(국문).jpg — 학부 공식 배포 「기계공학부 교과목 트리」",
  "verifiedAt": "2026-07-28",
  "note": "이미지에 실린 항목만 옮겼다. 이미지에 없는 과목(예: 기계공학창의설계 MEU2300)은 트리에 넣지 않는다 — 실재하는 과목이지만 이 트리에는 표기되어 있지 않다."
 },
 "graduation": {
  "note": "졸업이수요건표는 학번별로 확인해 주시기 바랍니다.",
  "summaryTitle": "25학번 졸업요건",
  "summary": [
   [
    "전공구분",
    "교양",
    "교양",
    "교양",
    "교양",
    "교양",
    "전공",
    "전공",
    "전공",
    "전공",
    "총 이수학점",
    "3~4천 단위"
   ],
   [
    "전공구분",
    "교양기초",
    "대학교양(선택)",
    "대학교양(필수)",
    "기초교육",
    "교양소계",
    "전공기초",
    "전공필수",
    "전공선택",
    "전공소계",
    "총 이수학점",
    "3~4천 단위"
   ],
   [
    "교양기초",
    "단일전공",
    "8",
    "12",
    "27",
    "2",
    "49",
    "-",
    "24",
    "36",
    "60",
    "130",
    "45"
   ],
   [
    "학사편입",
    "1",
    "-",
    "27",
    "-",
    "28",
    "-",
    "24",
    "36",
    "60",
    "88",
    "-"
   ],
   [
    "졸업예정자 복수전공",
    "-",
    "-",
    "21",
    "-",
    "21",
    "-",
    "24",
    "36",
    "60",
    "81",
    "-"
   ]
  ],
  "doubleMinorTitle": "복수전공(이중전공: 기계공학) 및 부전공",
  "doubleMinor": [
   [
    "구분",
    "구분",
    "복수전공",
    "복수전공",
    "부전공"
   ],
   [
    "구분",
    "구분",
    "06~09 학번",
    "10학번 이후",
    "06 학번 이후"
   ],
   [
    "전공",
    "전공필수",
    "9",
    "9",
    "9"
   ],
   [
    "전공",
    "전공선택",
    "31",
    "27",
    "12"
   ],
   [
    "졸업학점",
    "졸업학점",
    "40",
    "36",
    "21"
   ]
  ],
  "years": [
   "03~05",
   "06~09",
   "10~12",
   "13~14",
   "15~17",
   "18",
   "19",
   "20",
   "21",
   "22",
   "23",
   "24",
   "25"
  ],
  "byYear": {
   "03~05": {
    "header": [
     "인증분류",
     "종별",
     "필수 / 선택",
     "교과목(학점:설계학점)"
    ],
    "rows": [
     {
      "cat": "MSC",
      "catCredits": "33",
      "kind": "계열기초",
      "kindCredits": "18",
      "courses": "필수 (6) 공학수학1(3), 공학수학2(3)",
      "sameCat": false
     },
     {
      "cat": "MSC",
      "catCredits": "33",
      "kind": "계열기초",
      "kindCredits": "18",
      "courses": "선택 (12) 물리계열: 공학물리학및실험1(3), 공학물리학및실험2(3) 화학계열: 공학화학및실험1(3), 공학화학및실험2(3) 생물계열: 공학생물학및실험1(3), 공학생물학및실험2(3) 중 2개 계열 선택 (총 4과목)",
      "sameCat": true
     },
     {
      "cat": "MSC",
      "catCredits": "33",
      "kind": "전공기초",
      "kindCredits": "15",
      "courses": "필수 (12) 공학전자계산(3), 공학수치해석(3), 기계공학수학1(3), 기계공학수학2(3)",
      "sameCat": true
     },
     {
      "cat": "전공기초",
      "catCredits": "15",
      "kind": "선택",
      "kindCredits": "3",
      "courses": "확률통계(3), 현대물리학1(3), 양자역학1(3), Bio-Tech.개론(3) 중 1과목 선택",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "54",
      "kind": "필수",
      "kindCredits": "12",
      "courses": "설계 (18) 창의설계프로젝트1(3:3), 창의설계프로젝트2(3:3), 창의설계프로젝트3(종합설계)(3:3), 연구논문(3:1.5)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "54",
      "kind": "선택",
      "kindCredits": "42",
      "courses": "설계 (18) 고체역학및실험1(3:0.6), 고체역학및실험2(3:0.6), 공기조화및환경(3:0.5), 공학재료와거동학(3:0.5), 광공학(3:0.9), 기계요소설계(3:1), 기계진동및실험(3:1.2), 동역학및응용(3:1.2), 메카니즘설계(3:0.6), 메카트로닉스(3:1.5), 설계및생산공학1(3:1.2), 설계및생산공학2(3:0.6), 에너지동력공학(3:0.7), 열전달및실험(3:0.9), 유체역학및실험(3:1), 응용열역학및실험(3:0.7), 응용유체역학(3:0.5), 정형생산시스템(3:0.9), 컴퓨터응용생산공학(3:0.6), 회로와전자기응용(3:0.5), 기계시스템제어(3), 나노물리개론(3), 마이크로시스템(3), 바이오테크놀러지개론(3), 생체공학(3), 열역학(3), 학부세미나1(2), 학부세미나2(2), 주니어세미나(1)",
      "sameCat": true
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "학부기초",
      "kindCredits": "10",
      "courses": "필수 (8) 글쓰기(3), 기독교의 이해(3), 실용영어회화(2)",
      "sameCat": false
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "학부기초",
      "kindCredits": "10",
      "courses": "선택 (2) 영어강독(2), 실용영작문(2) 중 1과목 선택",
      "sameCat": true
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "공학소양",
      "kindCredits": "9",
      "courses": "공학소양 (9) 경제성공학(3)[기존:공학과경제(3)], 공학시사경제와기술경영(3), 공학회계(3), 과학기술과사회(3), 기술및제품마케팅(3)[기존:공학과마케팅(3)], 기술인전자원관리(3)[기존:공학과조직인사론(3)], 기술창조와특허(3), 미래사회와표준(3), 창의적사고훈련(3), 테크노리더십(3), 21C기술경영(3), 기술,지식과공공정책의이해(3), 공학투자분석(3), 전지구적기후변화와대응전략(3) 중 3과목 선택",
      "sameCat": true
     },
     {
      "cat": "학부필수",
      "catCredits": "12",
      "kind": "학부필수",
      "kindCredits": "12",
      "courses": "학부필수 (12) 인간의이해영역(3), 사회의이해영역(3), 문화의이해영역(3), 세계의이해영역(3) 중 각 영역에서 1과목 선택",
      "sameCat": false
     },
     {
      "cat": "자유선택",
      "catCredits": "23",
      "kind": "자유선택",
      "kindCredits": "23",
      "courses": "자유선택 (23)",
      "sameCat": false
     }
    ],
    "total": "132학점"
   },
   "06~09": {
    "header": [
     "인증분류",
     "종별",
     "필수/선택",
     "교과목(학점:설계학점)",
     "교과목(학점:설계학점)"
    ],
    "rows": [
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "계열기초",
      "kindCredits": "18",
      "courses": "필수 (6) 공학수학1(3), 공학수학2(3) 공학수학1(3), 공학수학2(3)",
      "sameCat": false
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "계열기초",
      "kindCredits": "18",
      "courses": "선택 (12) 물리계열 : 공학물리학및실험1(3), 공학물리학및실험2(3) / 화학계열 : 공학화학및실험1(3), 공학화학및실험2(3) / 생물계열 : 공학생물학및실험1(3), 공학생물학및실험2(3) 중 1개 계열은 필수, 나머지 과목에서 2과목 선택(총 4과목) 물리계열 : 공학물리학및실험1(3), 공학물리학및실험2(3) / 화학계열 : 공학화학및실험1(3), 공학화학및실험2(3) / 생물계열 : 공학생물학및실험1(3), 공학생물학및실험2(3) 중 1개 계열은 필수, 나머지 과목에서 2과목 선택(총 4과목)",
      "sameCat": true
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "전공기초",
      "kindCredits": "12",
      "courses": "필수 (9) 06~08학번 공학전자계산(3), 기계공학수학1(3), 기계공학수학2(3)",
      "sameCat": true
     },
     {
      "cat": "전공기초",
      "catCredits": "12",
      "kind": "09학번 이후",
      "kindCredits": "",
      "courses": "필수 (9) 공학정보처리(3), 기계공학수학1(3), 기계공학수학2(3)",
      "sameCat": false
     },
     {
      "cat": "전공기초",
      "catCredits": "12",
      "kind": "선택",
      "kindCredits": "3",
      "courses": "공학수치해석(3), 현대물리학1(3), 확률통계(3) 중 1과목 선택 공학수치해석(3), 현대물리학1(3), 확률통계(3) 중 1과목 선택",
      "sameCat": true
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "12",
      "courses": "설계 (18) 창의설계프로젝트1(3:3), 창의설계프로젝트2(3:3), 창의설계프로젝트3(종합설계)(3:3), 연구논문(3:1.5) 창의설계프로젝트1(3:3), 창의설계프로젝트2(3:3), 창의설계프로젝트3(종합설계)(3:3), 연구논문(3:1.5)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "48",
      "courses": "설계 (18) 고체역학및실험1(3:0.6), 고체역학및실험2(3:0.6), 공기조화및환경(3:0.5), 공학재료와거동학(3:0.5), 광공학(3:0.9), 기계요소설계(3:1), 기계진동및실험(3:1.2), 동역학및응용(3:1.2), 메카니즘설계(3:0.6), 메카트로닉스(3:1.5), 설계및생산공학1(3:1.2), 설계및생산공학2(3:0.6), 에너지동력공학(3:0.7), 열전달및실험(3:0.9), 유체역학및실험(3:1), 응용열역학및실험(3:0.7), 응용유체역학(3:0.5), 정형생산시스템(3:0.9), 컴퓨터응용생산공학(3:0.6), 회로와전자기응용(3:0.5), 기계시스템제어(3), 나노물리개론(3), 마이크로시스템(3), 생체공학(3), 열역학(3), 학부세미나1(2), 학부세미나2(2), 주니어세미나(1) 고체역학및실험1(3:0.6), 고체역학및실험2(3:0.6), 공기조화및환경(3:0.5), 공학재료와거동학(3:0.5), 광공학(3:0.9), 기계요소설계(3:1), 기계진동및실험(3:1.2), 동역학및응용(3:1.2), 메카니즘설계(3:0.6), 메카트로닉스(3:1.5), 설계및생산공학1(3:1.2), 설계및생산공학2(3:0.6), 에너지동력공학(3:0.7), 열전달및실험(3:0.9), 유체역학및실험(3:1), 응용열역학및실험(3:0.7), 응용유체역학(3:0.5), 정형생산시스템(3:0.9), 컴퓨터응용생산공학(3:0.6), 회로와전자기응용(3:0.5), 기계시스템제어(3), 나노물리개론(3), 마이크로시스템(3), 생체공학(3), 열역학(3), 학부세미나1(2), 학부세미나2(2), 주니어세미나(1)",
      "sameCat": true
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "학부기초",
      "kindCredits": "10",
      "courses": "필수 (10) 06~07학번 글쓰기(3), 기독교의 이해(3) 영역 중 1과목, 실용영어회화(2)+실용영작문(2) 혹은 영어강독(2) {또는 대학영어(1)+대학영어(2)}",
      "sameCat": false
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "학부기초",
      "kindCredits": "10",
      "courses": "필수 (10) 08~09학번 글쓰기(3), 기독교의 이해(3) 영역 중 1과목, 대학영어Ⅰ(2), 대학영어Ⅱ(2) {또는 고급대학영어Ⅰ,Ⅱ 또는 대학기본영어Ⅰ,Ⅱ}",
      "sameCat": true
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "공학소양",
      "kindCredits": "9",
      "courses": "공학소양 (9) 경제성공학(3)[기존:공학과경제(3)], 공학시사경제와기술경영(3), 공학회계(3), 과학기술과사회(3), 기술및제품마케팅(3)[기존:공학과마케팅(3)], 기술인적자원관리(3)[기존:공학과 조직인사론(3)], 기술창조와특허(3), 미래사회와표준(3),창의적사고훈련(3), 테크로리더십(3), 21C기술경영(3), 기술,지식과공공정책의이해(3), 공학투자분석(3), 전지구적기후변화와대응전략(3) 중 3과목 선택 경제성공학(3)[기존:공학과경제(3)], 공학시사경제와기술경영(3), 공학회계(3), 과학기술과사회(3), 기술및제품마케팅(3)[기존:공학과마케팅(3)], 기술인적자원관리(3)[기존:공학과 조직인사론(3)], 기술창조와특허(3), 미래사회와표준(3),창의적사고훈련(3), 테크로리더십(3), 21C기술경영(3), 기술,지식과공공정책의이해(3), 공학투자분석(3), 전지구적기후변화와대응전략(3) 중 3과목 선택",
      "sameCat": true
     },
     {
      "cat": "학부필수",
      "catCredits": "12",
      "kind": "학부필수",
      "kindCredits": "12",
      "courses": "학부필수 (12) 인간의이해영역(3), 사회의이해영역(3), 문화의이해영역(3), 세계의이해영역(3) 중 각 영역에서 1과목 선택 인간의이해영역(3), 사회의이해영역(3), 문화의이해영역(3), 세계의이해영역(3) 중 각 영역에서 1과목 선택",
      "sameCat": false
     },
     {
      "cat": "자유선택",
      "catCredits": "19",
      "kind": "자유선택",
      "kindCredits": "19",
      "courses": "자유선택 (19)",
      "sameCat": false
     }
    ],
    "total": "140학점"
   },
   "10~12": {
    "header": [
     "인증분류",
     "종별",
     "영역",
     "필수/선택",
     "교과목(학점:설계학점)"
    ],
    "rows": [
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "논리와 수리 필수 (9) 공학수학1(3), 공학수학2(3),공학정보처리(3)",
      "sameCat": false
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "자연과 우주 필수 (6) 공학물리학및실험1(3), 공학물리학및실험2(3)",
      "sameCat": true
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "생명과 환경 필수 (6) 화학계열 : 공학화학및실험1(3), 공학화학및실험2(3) 생물계열 : 공학생물학및실험1(3), 공학생물학및실험2(3) 중 2과목 선택",
      "sameCat": true
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "전공기초",
      "kindCredits": "9",
      "courses": "- 필수 (6) 기계공학수학1(3), 기계공학수학2(3)",
      "sameCat": true
     },
     {
      "cat": "전공기초",
      "catCredits": "9",
      "kind": "선택",
      "kindCredits": "3",
      "courses": "- 공학수치해석(3), 현대물리학1(3), 확률통계(3) 중 1과목 선택",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "12",
      "courses": "- 설계 (18) 창의설계프로젝트1(3:3), 창의설계프로젝트2(3:3), 창의설계프로젝트3(종합설계)(3:3), 연구논문(3:1.5)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "48",
      "courses": "- 설계 (18) 고체역학및실험1(3:0.6), 고체역학및실험2(3:0.6), 공기조화및환경(3:0.5), 공학재료와거동학(3:0.5), 광공학(3:0.9), 기계요소설계(3:1), 기계진동및실험(3:1.2), 동역학및응용(3:1.2), 메카니즘설계(3:0.6), 메카트로닉스(3:1.5), 설계및생산공학1(3:1.2), 설계및생산공학2(3:0.6), 에너지동력공학(3:0.7), 열전달및실험(3:0.9), 유체역학및실험(3:1), 응용열역학및실험(3:0.7), 응용유체역학(3:0.5), 정형생산시스템(3:0.9), 컴퓨터응용생산공학(3:0.6), 회로와전자기응용(3:0.5), 기계시스템제어(3), 나노물리개론(3), 마이크로시스템(3), 바이오테크놀러지개론(3), 생체공학(3), 열역학(3), 학부세미나1(2), 학부세미나2(2), 주니어세미나(1)",
      "sameCat": true
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "공통기초",
      "kindCredits": "10",
      "courses": "- 필수 글쓰기(3), 기독교의 이해(3) 영역 중 1과목, 대학영어Ⅰ(2), 대학영어Ⅱ(2) {또는 고급대학영어Ⅰ,Ⅱ 또는 대학기본영어Ⅰ,Ⅱ}",
      "sameCat": false
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "필수교양 (6~9)",
      "kindCredits": "",
      "courses": "국가와 사회공동체 선택 (3~6) 과학기술과사회(3), 기술및제품마케팅(3), 기술인적자원관리(3), 기술,지식과공공정책의이해(3), 기술창조와특허(3), 테크노리더십(3) 중 1과목 이상 선택",
      "sameCat": true
     },
     {
      "cat": "필수교양 (6~9)",
      "catCredits": "",
      "kind": "지역사회와 세계",
      "kindCredits": "",
      "courses": "선택 (3~6) 21C기술경영(3), 경제성공학(3), 공학시사경제와기술경영(3), 공학투자분석(3), 미래사회와표준(3), 전지구적기후변화와대응전략(3) 중 1과목 이상 선택",
      "sameCat": false
     },
     {
      "cat": "공과대학 공통 (0~3)",
      "catCredits": "",
      "kind": "-",
      "kindCredits": "",
      "courses": "선택 (0~3) 공학회계(3), 창의적사고훈련(3), 기업과기업가정신(3)",
      "sameCat": false
     },
     {
      "cat": "필수교양",
      "catCredits": "9",
      "kind": "필수교양",
      "kindCredits": "9",
      "courses": "문학과 예술 인간과 역사 언어와 표현 가치와 윤리 소프트웨어 문학과 예술 인간과 역사 언어와 표현 가치와 윤리 소프트웨어 3개 영역 이상 이수",
      "sameCat": false
     },
     {
      "cat": "자유선택",
      "catCredits": "22",
      "kind": "자유선택",
      "kindCredits": "22",
      "courses": "자유선택 (22) 자유선택 (22)",
      "sameCat": false
     }
    ],
    "total": "140학점"
   },
   "13~14": {
    "header": [
     "인증분류",
     "종 별",
     "영역",
     "필수/선택",
     "교과목(학점:설계학점)"
    ],
    "rows": [
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "논리와 수리 필수 (9) 공학수학1(3), 공학수학2(3),공학정보처리(3)",
      "sameCat": false
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "자연과 우주 필수 (6) 공학물리학및실험1(3), 공학물리학및실험2(3)",
      "sameCat": true
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "생명과 환경 필수 (6) 화학계열 : 공학화학및실험1(3), 공학화학및실험2(3) 생물계열 : 공학생물학및실험1(3), 공학생물학및실험2(3) 중 2 과목 선택",
      "sameCat": true
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "전공기초",
      "kindCredits": "9",
      "courses": "- 필수 (6) 기계공학수학1(3), 기계공학수학2(3)",
      "sameCat": true
     },
     {
      "cat": "전공기초",
      "catCredits": "9",
      "kind": "선택",
      "kindCredits": "3",
      "courses": "- 공학수치해석(3), 현대물리학1(3), 확률통계(3) 중 1과목 선택",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "12",
      "courses": "- 설계 (12) 창의설계프로젝트1(3:3), 창의설계프로젝트2(3:3), 창의설계프로젝트3(종합설계)(3:3), 연구논문(3:1.5)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "48",
      "courses": "- 설계 (12) 고체역학및실험1(3:0.6), 동역학및응용(3:1.2), 유체역학및실험(3:1), 열역학(3) : 필수이수 고체역학및실험2(3:0.6), 공기조화및환경(3:0.5), 공학재료와거동학(3:0.5), 광공학(3:0.9), 기계요소설계(3:1), 기계진동및실험(3:1.2), 메카니즘설계(3:0.6), 메카트로닉스(3:1.5), 설계및생산공학1(3:1.2), 설계및생산공학2(3:0.6), 에너지동력공학(3:0.7), 열전달및실험(3:0.9), 응용열역학및실험(3:0.7), 응용유체역학(3:0.5), 정형생산시스템(3:0.9), 컴퓨터응용생산공학(3:0.6), 회로와전자기응용(3:0.5), 기계시스템제어(3), 나노물리개론(3), 마이크로시스템(3), 바이오테크놀러지개론(3), 생체공학(3), 학부세미나1(3), 학부세미나2(3), 주니어세미나(1)",
      "sameCat": true
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "공통기초",
      "kindCredits": "10",
      "courses": "- 필수 글쓰기(3), 기독교의 이해(3) 영역 중 1과목, 대학영어Ⅰ(2), 대학영어Ⅱ(2) {또는 고급대학영어Ⅰ,Ⅱ 또는 대학기본영어Ⅰ,Ⅱ}",
      "sameCat": false
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "필수교양 (6~9)",
      "kindCredits": "",
      "courses": "국가와 사회공동체 선택 (3~6) 과학기술과사회(3), 기술및제품마케팅(3), 기술인적자원관리(3), 기술,지식과공공정책의이해(3), 기술창조와특허(3), 테크노리더십(3), 중 1과목 이상 선택",
      "sameCat": true
     },
     {
      "cat": "필수교양 (6~9)",
      "catCredits": "",
      "kind": "지역사회와 세계",
      "kindCredits": "",
      "courses": "선택 (3~6) 21C기술경영(3), 경제성공학(3), 공학시사경제와기술경영(3), 공학투자분석(3), 미래사회와표준(3), 전지구적기후변화와대응전략(3) 중 1과목 이상 선택",
      "sameCat": false
     },
     {
      "cat": "공과대학 공통 (0~3)",
      "catCredits": "",
      "kind": "-",
      "kindCredits": "",
      "courses": "선택 (0~3) 공학회계(3), 창의적사고훈련(3), 기업과기업가정신(3)",
      "sameCat": false
     },
     {
      "cat": "필수교양",
      "catCredits": "9",
      "kind": "필수교양",
      "kindCredits": "9",
      "courses": "문학과 예술 인간과 역사 언어와 표현 가치와 윤리 소프트웨어 문학과 예술 인간과 역사 언어와 표현 가치와 윤리 소프트웨어 3개 영역 이상 이수",
      "sameCat": false
     },
     {
      "cat": "RC필수",
      "catCredits": "3",
      "kind": "RC필수",
      "kindCredits": "3",
      "courses": "RC필수 (3) RC필수 (3) Holistic Education(1),(2),(3) 중 2과목, RC세미나(1)",
      "sameCat": false
     },
     {
      "cat": "자유선택",
      "catCredits": "19",
      "kind": "자유선택",
      "kindCredits": "19",
      "courses": "자유선택 (19) 자유선택 (19)",
      "sameCat": false
     }
    ],
    "total": "140학점"
   },
   "15~17": {
    "header": [
     "인증분류",
     "종 별",
     "영역",
     "필수/선택",
     "교과목(학점:설계학점)"
    ],
    "rows": [
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "논리와 수리 필수 (9) 공학수학1(3), 공학수학2(3), 공학정보처리(3)",
      "sameCat": false
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "자연과 우주 필수 (6) 공학물리학및실험1(3), 공학물리학및실험2(3)",
      "sameCat": true
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "생명과 환경 필수 (6) 화학계열 : 공학화학및실험1(3), 공학화학및실험2(3) 생물계열 : 공학생물학및실험1(3), 공학생물학및실험2(3) 중 2과목 선택",
      "sameCat": true
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "전공기초",
      "kindCredits": "9",
      "courses": "- 필수 (6) 기계공학수학1(3), 기계공학수학2(3)",
      "sameCat": true
     },
     {
      "cat": "전공기초",
      "catCredits": "9",
      "kind": "선택",
      "kindCredits": "3",
      "courses": "- 공학수치해석(3), 현대물리학1(3), 확률통계(3) 중 1과목 선택",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "12",
      "courses": "- 설계 (12) 창의설계프로젝트1(3:3), 창의설계프로젝트2(3:3), 창의설계프로젝트3(종합설계)(3:3), 연구논문(3:1.5)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "48",
      "courses": "- 설계 (12) 고체역학및실험1(3:0.6), 동역학및응용(3:1.2), 유체역학및실험(3:1), 열역학(3) : 필수이수 고체역학및실험2(3:0.6), 공기조화및환경(3:0.5), 공학재료와거동학(3:0.5), 광공학(3:0.9), 기계요소설계(3:1), 기계진동및실험(3:1.2), 메카니즘설계(3:0.6), 메카트로닉스(3:1.5), 설계및생산공학1(3:1.2), 설계및생산공학2(3:0.6), 에너지동력공학(3:0.7), 열전달및실험(3:0.9), 응용열역학및실험(3:0.7), 응용유체역학(3:0.5), 정형생산시스템(3:0.9), 컴퓨터응용생산공학(3:0.6), 회로와전자기응용(3:0.5), 기계시스템제어(3), 나노물리개론(3), 마이크로시스템(3), 바이오테크놀러지개론(3), 생체공학(3), 학부세미나1(3), 학부세미나2(3), 주니어세미나(1)",
      "sameCat": true
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "공통기초",
      "kindCredits": "10",
      "courses": "- 필수 글쓰기(3), 기독교의 이해(3) 영역 중 1과목, 대학영어Ⅰ(2), 대학영어Ⅱ(2) {또는 고급대학영어Ⅰ,Ⅱ 또는 대학기본영어Ⅰ,Ⅱ}",
      "sameCat": false
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "필수교양 (6~9)",
      "kindCredits": "",
      "courses": "국가와 사회공동체 선택 (3~6) 과학기술과사회(3), 기술및제품마케팅(3), 기술인적자원관리(3), 기술,지식과공공정책의이해(3), 기술창조와특허(3), 테크노리더십(3), 중 1과목 이상 선택",
      "sameCat": true
     },
     {
      "cat": "필수교양 (6~9)",
      "catCredits": "",
      "kind": "지역사회와 세계",
      "kindCredits": "",
      "courses": "선택 (3~6) 21C기술경영(3), 경제성공학(3), 공학시사경제와기술경영(3), 공학투자분석(3), 미래사회와표준(3), 기후변화대응:소셜실체와아이디어(3) 중 1과목 이상 선택",
      "sameCat": false
     },
     {
      "cat": "공과대학 공통 (0~3)",
      "catCredits": "",
      "kind": "-",
      "kindCredits": "",
      "courses": "선택 (0~3) 공학회계(3), 지역사회를위한창의적문제해결(3), 기업과기업가정신(3)",
      "sameCat": false
     },
     {
      "cat": "필수교양",
      "catCredits": "9",
      "kind": "필수교양",
      "kindCredits": "9",
      "courses": "문학과 예술 인간과 역사 언어와 표현 가치와 윤리 소프트웨어 문학과 예술 인간과 역사 언어와 표현 가치와 윤리 소프트웨어 3개 영역 이상 이수",
      "sameCat": false
     },
     {
      "cat": "RC필수",
      "catCredits": "3",
      "kind": "RC필수",
      "kindCredits": "3",
      "courses": "RC필수 (3) RC필수 (3) Holistic Education(1),(2),(3) 중 2과목, RC세미나(1)",
      "sameCat": false
     },
     {
      "cat": "채플",
      "catCredits": "2",
      "kind": "채플",
      "kindCredits": "2",
      "courses": "채플 (2) 채플 (2) 4P",
      "sameCat": false
     },
     {
      "cat": "자유선택",
      "catCredits": "17",
      "kind": "자유선택",
      "kindCredits": "17",
      "courses": "자유선택 (17) 자유선택 (17)",
      "sameCat": false
     }
    ],
    "total": "140학점"
   },
   "18": {
    "header": [
     "인증분류",
     "종 별",
     "영역",
     "필수/선택",
     "교과목(학점:설계학점)"
    ],
    "rows": [
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "논리와 수리 필수 (9) 공학수학1(3), 공학수학2(3),공학정보처리(3)",
      "sameCat": false
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "자연과 우주 필수 (6) 물리계열 : 공학물리학및실험1(3), 공학물리학및실험2(3)",
      "sameCat": true
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "필수교양",
      "kindCredits": "21",
      "courses": "생명과 환경 필수 (6) 화학계열 : 공학화학및실험1(3), 공학화학및실험2(3) 생물계열 : 공학생물학및실험1(3), 공학생물학및실험2(3) 중 2과목 선택",
      "sameCat": true
     },
     {
      "cat": "MSC",
      "catCredits": "30",
      "kind": "전공기초",
      "kindCredits": "9",
      "courses": "- 필수 (6) 기계공학수학1(3), 기계공학수학2(3)",
      "sameCat": true
     },
     {
      "cat": "전공기초",
      "catCredits": "9",
      "kind": "선택",
      "kindCredits": "3",
      "courses": "- 공학수치해석(3), 현대물리학1(3), 확률통계(3) 중 1과목 선택",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "12",
      "courses": "- 설계 (12) 창의설계프로젝트1(3:3), 창의설계프로젝트2(3:3), 창의설계프로젝트3(종합설계)(3:3), 연구논문(3:1.5)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "48",
      "courses": "- 설계 (12) 고체역학및실험1(3:0.6), 동역학및응용(3:1.2), 유체역학및실험(3:1), 열역학(3) : 필수이수 고체역학및실험2(3:0.6), 공기조화및환경(3:0.5), 공학재료와거동학(3:0.5), 광공학(3:0.9), 기계요소설계(3:1), 기계진동및실험(3:1.2), 메카니즘설계(3:0.6), 메카트로닉스(3:1.5), 설계및생산공학1(3:1.2), 설계및생산공학2(3:0.6), 에너지동력공학(3:0.7), 열전달및실험(3:0.9), 응용열역학및실험(3:0.7), 응용유체역학(3:0.5), 정형생산시스템(3:0.9), 컴퓨터응용생산공학(3:0.6), 회로와전자기응용(3:0.5), 기계시스템제어(3), 나노물리개론(3), 마이크로시스템(3), 바이오테크놀러지개론(3), 생체공학(3), 학부세미나1(3), 학부세미나2(3), 주니어세미나(1)",
      "sameCat": true
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "공통기초",
      "kindCredits": "10",
      "courses": "- 필수 글쓰기(3), 기독교의 이해(3) 영역 중 1과목, 대학영어Ⅰ(2), 대학영어Ⅱ(2) {또는 고급대학영어Ⅰ,Ⅱ 또는 대학기본영어Ⅰ,Ⅱ}",
      "sameCat": false
     },
     {
      "cat": "전문교양",
      "catCredits": "19",
      "kind": "필수교양 (6~9)",
      "kindCredits": "",
      "courses": "국가와 사회공동체 선택 (3~6) 과학기술과사회(3), 기술및제품마케팅(3), 기술인적자원관리(3), 기술,지식과공공정책의이해(3), 기술창조와특허(3), 테크노리더십(3), 중 1과목 이상 선택",
      "sameCat": true
     },
     {
      "cat": "필수교양 (6~9)",
      "catCredits": "",
      "kind": "지역사회와 세계",
      "kindCredits": "",
      "courses": "선택 (3~6) 21C기술경영(3), 경제성공학(3), 공학시사경제와기술경영(3), 공학투자분석(3), 미래사회와표준(3), 기후변화대응:소셜실체와아이디어(3) 중 1과목 이상 선택",
      "sameCat": false
     },
     {
      "cat": "공과대학 공통 (0~3)",
      "catCredits": "",
      "kind": "-",
      "kindCredits": "",
      "courses": "선택 (0~3) 공학회계(3), 지역사회를위한창의적문제해결(3), 기업과기업가정신(3)",
      "sameCat": false
     },
     {
      "cat": "필수교양",
      "catCredits": "9",
      "kind": "필수교양",
      "kindCredits": "9",
      "courses": "문학과 예술 인간과 역사 언어와 표현 가치와 윤리 소프트웨어 문학과 예술 인간과 역사 언어와 표현 가치와 윤리 소프트웨어 3개 영역 이상 이수",
      "sameCat": false
     },
     {
      "cat": "RC필수",
      "catCredits": "2",
      "kind": "RC필수",
      "kindCredits": "2",
      "courses": "RC필수 (2) RC필수 (2) 사회참여(1), Yonsei RC101(1)",
      "sameCat": false
     },
     {
      "cat": "채플",
      "catCredits": "2",
      "kind": "채플",
      "kindCredits": "2",
      "courses": "채플 (2) 채플 (2) 4P",
      "sameCat": false
     },
     {
      "cat": "일반선택",
      "catCredits": "18",
      "kind": "일반선택",
      "kindCredits": "18",
      "courses": "일반선택 (18) 일반선택 (18)",
      "sameCat": false
     }
    ],
    "total": "140학점"
   },
   "19": {
    "header": [
     "종별",
     "필수/선택",
     "교과목(학점)"
    ],
    "rows": [
     {
      "cat": "계열기초",
      "catCredits": "21",
      "kind": "필수",
      "kindCredits": "21",
      "courses": "공학수학1(3), 공학수학2(3),공학정보처리(3) 공학물리학및실험1(3), 공학물리학및실험2(3) 공학화학및실험1(3), 공학화학및실험2(3) *‘논리와수리’, ‘자연과우주’, ‘생명과환경’ 영역에서 이수",
      "sameCat": false
     },
     {
      "cat": "전공기초",
      "catCredits": "9",
      "kind": "필수",
      "kindCredits": "6",
      "courses": "공학수학3(3), 공학수학4(3)",
      "sameCat": false
     },
     {
      "cat": "전공기초",
      "catCredits": "9",
      "kind": "선택",
      "kindCredits": "3",
      "courses": "공학수치해석(3), 확률통계(3) 중 1과목 선택",
      "sameCat": true
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "27",
      "courses": "기계공학창의설계(3), 고체역학(3), 열역학(3), 동역학(3), 유체역학(3), 기계공학실험1(3), 기계공학실험2(3), 창의제품설계(3), 연구논문(3)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "33",
      "courses": "응용고체역학(3), 환경기계공학(3), 공학재료(3) 재료거동학(3), 광공학(3), 기계요소설계(3), 기계진동(3), 메카니즘설계(3), 메카트로닉스(3), 컴퓨터응용기계설계(3), 생산공학(3), 에너지동력공학(3), 열전달(3), 응용열역학(3), 응용유체역학(3), 정형생산시스템(3), 전자기학및응용(3), 기계시스템제어(3), 나노기계공학(3), 마이크로기계시스템(3), 바이오의료기계(3), 생체역학(3), 기계공학세미나(3), 주니어세미나(1), 학부연구1(1), 학부연구2(1), 학부연구3(1), 학부연구4(1) 중 선택",
      "sameCat": true
     },
     {
      "cat": "교양기초",
      "catCredits": "12",
      "kind": "필수",
      "kindCredits": "",
      "courses": "채플(2학점, 4학기) 글쓰기(3), 기독교의 이해(3), 대학영어Ⅰ(2), 대학영어Ⅱ(2) {또는 고급대학영어Ⅰ,Ⅱ 또는 대학기본영어Ⅰ,Ⅱ}",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "15",
      "kind": "대학교양",
      "kindCredits": "15",
      "courses": "‘문학과예술, 인간과역사, 언어와표현, 가치와윤리, 국가와사회, 지역과세계, 정보와기술’ 영역 중 5개 영역 필수 이수",
      "sameCat": false
     },
     {
      "cat": "기초교육",
      "catCredits": "2",
      "kind": "기초교육",
      "kindCredits": "2",
      "courses": "사회참여(1), Yonsei RC101(1)",
      "sameCat": false
     },
     {
      "cat": "일반선택",
      "catCredits": "21",
      "kind": "일반선택",
      "kindCredits": "21",
      "courses": "",
      "sameCat": false
     }
    ],
    "total": "140학점"
   },
   "20": {
    "header": [
     "종별",
     "필수/선택",
     "교과목(학점)"
    ],
    "rows": [
     {
      "cat": "계열기초",
      "catCredits": "21",
      "kind": "필수",
      "kindCredits": "21",
      "courses": "공학수학1(3), 공학수학2(3),공학정보처리(3) 공학물리학및실험1(3), 공학물리학및실험2(3) 공학화학및실험1(3), 공학화학및실험2(3) *‘논리와수리’, ‘자연과우주’, ‘생명과환경’ 영역에서 이수",
      "sameCat": false
     },
     {
      "cat": "전공기초",
      "catCredits": "9",
      "kind": "필수",
      "kindCredits": "6",
      "courses": "공학수학3(3), 공학수학4(3)",
      "sameCat": false
     },
     {
      "cat": "전공기초",
      "catCredits": "9",
      "kind": "선택",
      "kindCredits": "3",
      "courses": "공학수치해석(3), 확률통계(3) 중 1과목 선택",
      "sameCat": true
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "27",
      "courses": "기계공학창의설계(3), 고체역학(3), 열역학(3), 동역학(3), 유체역학(3), 기계공학실험1(3), 기계공학실험2(3), 창의제품설계(3), 연구논문(3)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "33",
      "courses": "응용고체역학(3), 환경기계공학(3), 공학재료(3) 재료거동학(3), 광공학(3), 기계요소설계(3), 기계진동(3), 메카니즘설계(3), 메카트로닉스(3), 컴퓨터응용기계설계(3), 생산공학(3), 에너지동력공학(3), 열전달(3), 응용열역학(3), 응용유체역학(3), 정형생산시스템(3), 전자기학및응용(3), 기계시스템제어(3), 나노기계공학(3), 마이크로기계시스템(3), 바이오의료기계(3), 생체역학(3), 기계공학세미나(3), 주니어세미나(1), 학부연구1(1), 학부연구2(1), 학부연구3(1), 학부연구4(1) 중 선택",
      "sameCat": true
     },
     {
      "cat": "교양기초",
      "catCredits": "8",
      "kind": "필수",
      "kindCredits": "",
      "courses": "채플(2학점, 4학기) 글쓰기(3), 기독교의 이해(3)",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "15",
      "kind": "대학교양",
      "kindCredits": "15",
      "courses": "‘문학과예술, 인간과역사, 언어와표현, 가치와윤리, 국가와사회, 지역과세계, 정보와기술’ 영역 중 5개 영역 필수 이수",
      "sameCat": false
     },
     {
      "cat": "기초교육",
      "catCredits": "1",
      "kind": "기초교육",
      "kindCredits": "1",
      "courses": "Yonsei RC101(1)",
      "sameCat": false
     },
     {
      "cat": "일반선택",
      "catCredits": "26",
      "kind": "일반선택",
      "kindCredits": "26",
      "courses": "",
      "sameCat": false
     }
    ],
    "total": "140학점"
   },
   "21": {
    "header": [
     "종별",
     "필수/선택",
     "교과목(학점)"
    ],
    "rows": [
     {
      "cat": "교양기초",
      "catCredits": "8",
      "kind": "필수",
      "kindCredits": "8",
      "courses": "채플(2학점, 4학기) 글쓰기(3), 기독교의 이해(3)",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "36",
      "kind": "선택",
      "kindCredits": "15",
      "courses": "‘문학과예술, 인간과역사, 언어와표현, 가치와윤리, 국가와사회, 지역과세계, 정보와기술’ 영역 중 5개 영역 필수 이수",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "36",
      "kind": "필수",
      "kindCredits": "21",
      "courses": "공학수학1(3), 공학수학2(3),공학정보처리(3) 공학물리학및실험1(3), 공학물리학및실험2(3) 공학화학및실험1(3), 공학화학및실험2(3) *‘논리와수리’, ‘자연과우주’, ‘생명과환경’ 영역에서 이수",
      "sameCat": true
     },
     {
      "cat": "기초교육",
      "catCredits": "1",
      "kind": "필수",
      "kindCredits": "1",
      "courses": "Yonsei RC101(1)",
      "sameCat": false
     },
     {
      "cat": "전공기초",
      "catCredits": "9",
      "kind": "필수",
      "kindCredits": "6",
      "courses": "공학수학3(3), 공학수학4(3)",
      "sameCat": false
     },
     {
      "cat": "전공기초",
      "catCredits": "9",
      "kind": "선택",
      "kindCredits": "3",
      "courses": "공학수치해석(3), 확률통계(3) 중 1과목 선택",
      "sameCat": true
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "27",
      "courses": "기계공학창의설계(3), 고체역학(3), 열역학(3), 동역학(3), 유체역학(3), 기계공학실험1(3), 기계공학실험2(3), 창의제품설계(3), 연구논문(3)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "33",
      "courses": "응용고체역학(3), 환경기계공학(3), 공학재료(3) 재료거동학(3), 광공학(3), 기계요소설계(3), 기계진동(3), 메카니즘설계(3), 메카트로닉스(3), 컴퓨터응용기계설계(3), 생산공학(3), 에너지동력공학(3), 열전달(3), 응용열역학(3), 응용유체역학(3), 정형생산시스템(3), 전자기학및응용(3), 기계시스템제어(3), 나노기계공학(3), 마이크로기계시스템(3), 바이오의료기계(3), 생체역학(3), 기계공학세미나(3), 주니어세미나(1), 학부연구1(1), 학부연구2(1), 학부연구3(1), 학부연구4(1) 중 선택",
      "sameCat": true
     },
     {
      "cat": "일반선택",
      "catCredits": "26",
      "kind": "일반선택",
      "kindCredits": "26",
      "courses": "",
      "sameCat": false
     }
    ],
    "total": "140학점"
   },
   "22": {
    "header": [
     "종별",
     "필수/선택",
     "교과목(학점)"
    ],
    "rows": [
     {
      "cat": "교양기초",
      "catCredits": "8",
      "kind": "필수",
      "kindCredits": "8",
      "courses": "채플(2학점, 4학기) 글쓰기(3), 기독교의 이해(3)",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "39",
      "kind": "선택",
      "kindCredits": "12",
      "courses": "‘문학과예술, 인간과역사, 언어와표현, 가치와윤리, 국가와사회, 지역과세계’ 영역 중 4개 영역 필수 이수",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "39",
      "kind": "필수",
      "kindCredits": "27",
      "courses": "공학수학1(3), 공학수학2(3), 공학수학3(3), 공학수학4(3), 공학정보처리(3) 공학물리학및실험1(3), 공학물리학및실험2(3) 공학화학및실험1(3), 공학화학및실험2(3) *‘논리와수리’, ‘자연과우주’, ‘생명과환경’, ‘정보와기술’ 영역 이수 처리",
      "sameCat": true
     },
     {
      "cat": "기초교육",
      "catCredits": "1",
      "kind": "필수",
      "kindCredits": "1",
      "courses": "Yonsei RC101(1)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "27",
      "courses": "기계공학창의설계(3), 고체역학(3), 열역학(3), 동역학(3), 유체역학(3), 기계공학실험1(3), 기계공학실험2(3), 창의제품설계(3), 연구논문(3)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "33",
      "courses": "응용고체역학(3), 환경기계공학(3), 공학재료(3) 재료거동학(3), 광공학(3), 기계요소설계(3), 기계진동(3), 메카니즘설계(3), 메카트로닉스(3), 컴퓨터응용기계설계(3), 생산공학(3), 에너지동력공학(3), 열전달(3), 응용열역학(3), 응용유체역학(3), 정형생산시스템(3), 전자기학및응용(3), 기계시스템제어(3), 나노기계공학(3), 마이크로기계시스템(3), 바이오의료기계(3), 생체역학(3), 기계공학세미나(3), 주니어세미나(1), 학부연구1(1), 학부연구2(1), 학부연구3(1), 학부연구4(1), 공학수치해석(3), 확률통계(3) 중 선택",
      "sameCat": true
     },
     {
      "cat": "일반선택",
      "catCredits": "22",
      "kind": "일반선택",
      "kindCredits": "22",
      "courses": "",
      "sameCat": false
     }
    ],
    "total": "130학점"
   },
   "23": {
    "header": [
     "종별",
     "필수/선택",
     "교과목(학점)"
    ],
    "rows": [
     {
      "cat": "교양기초",
      "catCredits": "8",
      "kind": "필수",
      "kindCredits": "8",
      "courses": "채플(2학점, 4학기) 글쓰기(3), 기독교의 이해(3)",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "39",
      "kind": "선택",
      "kindCredits": "12",
      "courses": "‘문학과예술, 인간과역사, 언어와표현, 가치와윤리, 국가와사회, 지역과세계’ 영역 중 4개 영역 필수 이수",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "39",
      "kind": "필수",
      "kindCredits": "27",
      "courses": "공학수학1(3), 공학수학2(3), 공학수학3(3), 공학수학4(3), 공학정보처리(3) 공학물리학및실험1(3), 공학물리학및실험2(3) 공학화학및실험1(3), 공학화학및실험2(3) *‘논리와수리’, ‘자연과우주’, ‘생명과환경’, ‘정보와기술’ 영역 이수 처리",
      "sameCat": true
     },
     {
      "cat": "기초교육",
      "catCredits": "2",
      "kind": "필수",
      "kindCredits": "2",
      "courses": "Yonsei RC101(1), 사회 참여(1)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "27",
      "courses": "기계공학창의설계(3), 고체역학(3), 열역학(3), 동역학(3), 유체역학(3), 기계공학실험1(3), 기계공학실험2(3), 창의제품설계(3), 연구논문(3)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "33",
      "courses": "응용고체역학(3), 환경기계공학(3), 공학재료(3) 재료거동학(3), 광공학(3), 기계요소설계(3), 기계진동(3), 메카니즘설계(3), 메카트로닉스(3), 컴퓨터응용기계설계(3), 생산공학(3), 에너지동력공학(3), 열전달(3), 응용열역학(3), 응용유체역학(3), 정형생산시스템(3), 전자기학및응용(3), 기계시스템제어(3), 나노기계공학(3), 마이크로기계시스템(3), 바이오의료기계(3), 생체역학(3), 기계공학세미나(3), 스페셜 토픽(1), 학부연구1(1), 학부연구2(1), 학부연구3(1), 학부연구4(1), 공학수치해석(3), 확률통계(3) 중 선택",
      "sameCat": true
     },
     {
      "cat": "일반선택",
      "catCredits": "21",
      "kind": "일반선택",
      "kindCredits": "21",
      "courses": "",
      "sameCat": false
     }
    ],
    "total": "130학점"
   },
   "24": {
    "header": [
     "종별",
     "필수/선택",
     "교과목(학점)"
    ],
    "rows": [
     {
      "cat": "교양기초",
      "catCredits": "8",
      "kind": "필수",
      "kindCredits": "8",
      "courses": "채플(2학점, 4학기) 글쓰기(3), 기독교의 이해(3)",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "39",
      "kind": "선택",
      "kindCredits": "12",
      "courses": "‘문학과예술, 인간과역사, 언어와표현, 가치와윤리, 국가와사회, 지역과세계’ 영역 중 4개 영역 필수 이수",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "39",
      "kind": "필수",
      "kindCredits": "27",
      "courses": "공학수학1(3), 공학수학2(3), 공학수학3(3), 공학수학4(3), 공학정보처리(3) 공학물리학및실험1(3), 공학물리학및실험2(3) 공학화학및실험1(3), 공학화학및실험2(3) *‘논리와수리’, ‘자연과우주’, ‘생명과환경’, ‘정보와기술’ 영역 이수 처리",
      "sameCat": true
     },
     {
      "cat": "기초교육",
      "catCredits": "2",
      "kind": "필수",
      "kindCredits": "2",
      "courses": "Yonsei RC101(1), 사회 참여(1)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "24",
      "courses": "고체역학(3), 열역학(3), 동역학(3), 유체역학(3), 기계공학실험1(3), 기계공학실험2(3), 창의제품설계(3), 연구논문(3)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "36",
      "courses": "응용고체역학(3), 환경기계공학(3), 공학재료(3) 재료거동학(3), 광공학(3), 기계요소설계(3), 기계진동(3), 메카니즘설계(3), 메카트로닉스(3), 컴퓨터응용기계설계(3), 생산공학(3), 에너지동력공학(3), 열전달(3), 응용열역학(3), 응용유체역학(3), 정형생산시스템(3), 전자기학및응용(3), 기계시스템제어(3), 나노기계공학(3), 마이크로기계시스템(3), 바이오의료기계(3), 생체역학(3), 컴퓨터해석기반설계(3), 기계공학세미나(3), 스페셜 토픽(1), 학부연구1(1), 학부연구2(1), 학부연구3(1), 학부연구4(1), 공학수치해석(3), 확률통계(3) 중 선택",
      "sameCat": true
     },
     {
      "cat": "일반선택",
      "catCredits": "21",
      "kind": "일반선택",
      "kindCredits": "21",
      "courses": "",
      "sameCat": false
     }
    ],
    "total": "130학점"
   },
   "25": {
    "header": [
     "종별",
     "필수/선택",
     "교과목(학점)"
    ],
    "rows": [
     {
      "cat": "교양기초",
      "catCredits": "8",
      "kind": "필수",
      "kindCredits": "8",
      "courses": "채플(2학점, 4학기) 글쓰기(3), 기독교의 이해(3)",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "39",
      "kind": "선택",
      "kindCredits": "12",
      "courses": "‘문학과예술, 인간과역사, 언어와표현, 가치와윤리, 국가와사회, 지역과세계’ 영역 중 4개 영역 필수 이수",
      "sameCat": false
     },
     {
      "cat": "대학교양",
      "catCredits": "39",
      "kind": "필수",
      "kindCredits": "27",
      "courses": "공학수학1(3), 공학수학2(3), 공학수학3(3), 공학수학4(3), 공학정보처리(3) 공학물리학및실험1(3), 공학물리학및실험2(3) 공학화학및실험1(3), 공학화학및실험2(3) *‘논리와수리’, ‘자연과우주’, ‘생명과환경’, ‘정보와기술’ 영역 이수 처리",
      "sameCat": true
     },
     {
      "cat": "기초교육",
      "catCredits": "2",
      "kind": "필수",
      "kindCredits": "2",
      "courses": "Yonsei RC101(1), 사회 참여(1)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "필수",
      "kindCredits": "24",
      "courses": "고체역학(3), 열역학(3), 동역학(3), 유체역학(3), 기계공학실험1(3), 기계공학실험2(3), 창의제품설계(3), 연구논문(3)",
      "sameCat": false
     },
     {
      "cat": "전공",
      "catCredits": "60",
      "kind": "선택",
      "kindCredits": "36",
      "courses": "응용고체역학(3), 환경기계공학(3), 공학재료(3) 재료거동학(3), 광공학(3), 기계요소설계(3), 기계진동(3), 메카니즘설계(3), 메카트로닉스(3), 컴퓨터응용기계설계(3), 생산공학(3), 에너지동력공학(3), 열전달(3), 응용열역학(3), 응용유체역학(3), 정형생산시스템(3), 전자기학및응용(3), 기계시스템제어(3), 나노기계공학(3), 마이크로기계시스템(3), 바이오의료기계(3), 생체역학(3), 컴퓨터해석기반설계(3), 기계공학세미나(3), 스페셜 토픽(1), 학부연구1(1), 학부연구2(1), 학부연구3(1), 학부연구4(1), 공학수치해석(3), 확률통계(3) 중 선택",
      "sameCat": true
     },
     {
      "cat": "일반선택",
      "catCredits": "21",
      "kind": "일반선택",
      "kindCredits": "21",
      "courses": "",
      "sameCat": false
     }
    ],
    "total": "130학점"
   }
  }
 },
 "graduationSource": {
  "source": "me.yonsei.ac.kr/me/faculty/graduation.do — 학부 공식 졸업 요건",
  "verifiedAt": "2026-07-28",
  "note": "13개 학번 탭(03~05 … 25)의 표를 rowspan 을 펼쳐 그대로 옮겼다. 수치·과목명은 원문 그대로이며 가공하지 않았다."
 },
 "noticesUG": [
  {
   "no": "공지",
   "title": "기계공학창의설계(MEU2300) 대체과목 선정",
   "date": "2026.07.29",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=475698&article.offset=0&articleLimit=10",
   "att": false,
   "body": "23학번까지 필수이수인 기계공학창의설계(MEU2300)는 메커니즘설계(MEU3002)으로 대체 인정\n\n- 아직 기계공학창의설계(MEU2300)를 미이수한 학생에 한하여 메커니즘설계(MEU3002)로 대체인정\n- 기계공학창의설계(MEU2300)를 이수한 학생은 메커니즘설계(MEU3002)을 재수강으로 인정받을 수 없음",
   "bodyKind": "text"
  },
  {
   "no": "공지",
   "title": "2026학년도 2학기 재입학 전형 안내문",
   "date": "2026.05.29",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=471922&article.offset=0&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "2026학년도 2학기 재입학 전형 안내문pdf.pdf"
  },
  {
   "no": "공지",
   "title": "2026 공과대학 'ZERO to AI Challenge' 공모 안내",
   "date": "2026.05.11",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=470673&article.offset=0&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "1. 'ZERO to AI Challenge' 안내문 및 양식.zip, 2. ZERO to AI Challenge 포스터.png"
  },
  {
   "no": "공지",
   "title": "[필독] 교과목 수강 및 졸업 관련 주요 문의 사항에 대한 답변",
   "date": "2023.02.13",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=159666&article.offset=0&articleLimit=10",
   "att": false,
   "body": "안녕하세요? 기계공학과 사무실입니다.\n학생들로부터 같은 문의가 반복적으로 오고, 학과 사무실에서는 똑같이 답변하고 있으나,\n학생들 사이에서 의견이 분분하여, 주요 문의사항에 대해 명확히 답변하기 위하여 공지를 올립니다.\n\n1. ‘일반선택’은 채워야 하는 학점이 아닙니다.\n졸업을 위해 채워야 하는 총 취득학점에서, 필수 요건들을 제외한 잔여 학점을 ‘일반선택’이라 명명한 것이므로,\n다른 종별(필교, 전필, 전선 등)에서 학점을 채워도 상관없는 학점입니다.\n\n2. 기계공학세미나 (1),(2) 둘 다 수강 시, ‘전공선택’ 인정 관련\n- 원칙 : 둘 다 수강 불가, 한 과목만 전공선택 인정\n- 18학번 포함 이전 학번 : 권장사항은 아니나, 둘 다 전선으로 인정되긴 합니다.\n- 19학번 포함 이후 학번 : 공식적으로 금지하며, 전선으로 하나만 인정되고,\n그럼에도 불구하고 두 과목 모두 들을 경우에는 나머지 하나는 일반선택으로 인정됩니다. (총 학점에는 포함됨)\n\n3. ABEEK 취소에 따라, 공학소양 이수 요건 삭제\n공학소양 이수 요건(필교 영역 중 국가와사회공동체, 지역사회와세계 필수)은 삭제되었으므로,\n필수교양 총 10개 영역 중 8개 영역을 이수하는 것만 관리하시면 됩니다. 해당 영역 삭제로 인해 남는 학점은 일반 선택으로 합산됩니다.\n\n4. 포털에 졸업 불가라고 뜨는 문제\n- 학사포털이 2022년 11월 개편됨에 따라, 시스템이 아직 불안정하고 오류가 많습니다. 본인 졸업요건에 따라 스스로 검토하시면 됩니다.\n- 졸업사정 할 때 학과에서 수기로 대체 처리 하는 과목들이 있습니다. 그런 과목들은 시스템에 반영 되어있지 않습니다.\n(** 기계공학수학1,2→공학수학3,4 대체 인정의 경우, 졸업시점까지 시스템에 반영되지 않으며, 졸업사정 시점에 학과에서 수기로 반영합니다.\n스스로 검토하여 졸업요건 충족 여부를 확인하셔야 합니다. 20학번까지는 전공기초로 인정되는 것이 맞습니다.\n** 대학원 교과목 전공선택 인정도 마찬가지로, 시스템에는 일반선택으로 분류되어 있으나, 졸업 시점에 수기로 전공선택으로 반영합니다.\n참고해주시기 바랍니다.)\n\n5. 졸업 전 학점취득현황 검토 요청 (전공만 검토함)\n4학년 졸업예정자에 한하여, skyice@yonsei.ac.kr 메일로 검토해드리고 있습니다.\n‘학사포탈-학점취득현황-자가진단 버튼 클릭 후-성적표출력 클릭-pdf 다운‘ 하셔서, 메일로 제출해주시면 검토해드리고 있습니다.\n현재 상황에서 스스로 검토하여 어떤 과목을 얼마나 더 들을건지 말씀해주셔야 검토가 가능합니다.\n그러나 메일로 회신 드리는 사항은 공식 사정 결과는 아니므로, 참고용으로만 알고 계시면 되겠습니다.\n\n6. UT세미나, 스페셜토픽, 기계공학세미나는 각각 다른 전공선택 교과목입니다.\nUT세미나와 스페셜토픽은 총 3학점(3회 수강)까지만 전공선택으로 인정됩니다.\n기계공학세미나는 총 3학점(1회 수강)까지만 전공선택으로 인정됩니다. (안내문 2번 참고)\n\n7. 공학수학, 공학정보처리 교과목은 공과대학에서 관리하는 교과목입니다.\n관련 문의 사항은 공과대학(T.5734)로 문의하시기 바랍니다.\n\n8. 기계공학과 학부생이 대학원 과목을 전공선택 과목으로 인정받으려면 학정번호가 MEU로 시작되는 과목을 들으시면 되며,\n수강신청 시 ‘학사포탈-학사행정-수업-대학원교과목수강신청’에서 신청하시면 됩니다. (자세한 사항은 학교 공지사항 참고)\n\n9.\n공학수치해석, 확률통계 교과목 종별\n22학번부터 공학수치해석, 확률통계의 종별이 전공기초 -> 전공선택으로 변경되었습니다.\n21학번까지는 기존과 동일하게 전공기초로 인정되는 점 참고 부탁드립니다. (전공선택으로 인정받을 수 없음)\n학정번호 | 교과목명 | 교과목 종별\n21학번 까지 | 22학번 이후\nMEU3003 | 공학수치해석 | 전공기초 | 전공선택\nMAT2013 | 확률통계 | 전공기초 | 전공선택\n\n10. 학부연구, 연구논문 동일 학기 수강 불가\n2025학년도 1학기부터 학부연구와 연구논문은 동일 학기 수강이 불가합니다.\n한 학기에 두 과목을 동시 수강할 경우 한 과목에 대해서만 성적 부여 가능하며(나머지 과목은 F 혹은 NP 처리됨),\n졸업 심사 시에 이를 감안하게 되는 점 참고하여 주시기 바랍니다.\n\n감사합니다.",
   "bodyKind": "text"
  },
  {
   "no": "730",
   "title": "2026학년도 2학기 ME Graduate Fellowship(MGF) 장학생 모집",
   "date": "2026.07.15",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=474974&article.offset=0&articleLimit=10",
   "att": true,
   "body": "ME Graduate Fellowship(MGF)은 우수한 대학원생을 선발하여 장학금과 다양한 혜택을 제공함으로써 수상자의 자긍심을 함양하고,\n대학원 진학을 희망하는 우수 인재의 학업 및 연구 의욕을 고취하고자 합니다.\n이에 아래와 같이 장학생을 모집하오니 많은 지원 바랍니다.\n\n1. 지원자격\n- 석·박사 통합과정생에 한함\n- 2026학년도 2학기 기준 대학원 입학 예정자 또는 2학기 등록 예정자\n- 학부 성적 기준 평균평점 3.7/4.3 이상 또는 4.0/4.5 이상\n\n2. 선발인원\n- 예산 범위 내 선발\n\n3. 장학금 및 혜택\n- 장학금: 1년 간 총 1,200만원(학기당 600만원씩 지급)\n- (BK 사업 참여 시) 장기 해외연수 및 국제학술대회 참가 기회 우선 제공\n- 장학증서 수여\n- 학과 홈페이지를 통한 장학생 소개\n※ 장학금 지급 신청 시점 기준으로 재학 중이 아니거나 석·박사 통합과정 이외의 과정으로 전환한 경우 장학금 지급 대상에서 제외됨\n\n4. 제출서류\n- 지원신청서(2페이지 이내 작성) 1부\n- 성적증명서 1부\n\n5. 진행일정\n- 지원서 접수: 2026년 7월 15일 ~ 8월 5일\n- 합격자 발표: 2026년 8월 중\n- 장학금 지급: 2026년 2학기 중(2027년 1~2월 예상)\n※ 상기 일정은 사정에 따라 변경될 수 있음\n\n6. 접수방법\n- 이메일 제출: mech_bk21_ley@yonsei.ac.kr\n\n7. 문의처\n- 전화: 02-2123-7817\n- 이메일: mech_bk21_ley@yonsei.ac.kr",
   "bodyKind": "text",
   "attName": "2026-2학기_기계공학부_ME_Graduate_Fellowship_장학생_선발_공고.hwpx"
  },
  {
   "no": "729",
   "title": "2026-여름계절학기 학부연구(3) 연구참여 신청서 제출 안내 (신청서 제출마감: 7.3.(금) 17:00) (update)",
   "date": "2026.06.29",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=474118&article.offset=0&articleLimit=10",
   "att": true,
   "body": "2026-여름계절학기 학부연구(3) 연구참여 프로그램 안내\n\n기계공학부에서는 2018년부터 1~4학년 학생들이 방학 기간을 이용하여 수업에서 다루지 못한 재미있고 깊이 있는 기계공학 지식을 공부할 수 있는 다양한 연구참여 및 교육 프로그램을 실시하고 있습니다. 이 프로그램이 전공 분야에 대한 자신의 적성을 발견하고, 가치 있는 미래를 꿈꿀 수 있는 기회가 되기를 바랍니다. 특히, 2019학년도 교과과정 개편 이후 학부생이 연구참여를 통해서 방학 또는 정규학기에 1학점을 취득할 수 있는 학부연구(MEU3006 ~ 3009)과목이 신설되었습니다.\n\n[참여 방법]\n\n* 참여대상자: 2026학년도 여름계절학기 개설과목인 MEU3008 학부연구(3)를 수강신청한 기계공학부 학부생 (복수전공자 수강 가능)\n\n* 첨부2의 연구주제를 참고하여 관심 있는 주제의 교수님께 이메일 등으로 연락을 드려 허락을 받은 후, 신청서 양식을 연구 시작과 동시에 2026. 7. 3.(금) 17:00 까지 LearnUs 연구신청서 제출함에 업로드합니다.\n(※ 신청서 제출 및 지도교수님의 승인은 이메일 승인으로 대체가능하며, 신청서 양식을 제출하지 않으면 학부연구 과목의 학점을 인정받을 수 없습니다.)\n\n* 교수님과 상의드려 학기 중 최소 32시간 이상을 학과 실험실 등에서 연구에 참여한 후 소정의 보고서를 제출하면 평가하여 학부연구 교과목의 학점(Pass)이 부여됩니다.\n\n* 구체적인 연구 참여 방법 및 참여 기간은 담당교수님과 상의하여 결정해주시기 바랍니다.\n\n[제출 기한]\n\n1. 학부연구 신청서 제출: 2026. 7. 3.(금) 17:00 까지 LearnUs 연구신청서 제출함으로 제출\n※ 문의: 학과 사무실 (메일: skyice@yonsei.ac.kr/ 전화: 02-2123-4426)\n\n2. 최종보고서 제출: 2026. 7. 17.(금) 23:59 까지\n\n[유의사항]\n\n* 학부연구 신청서 및 보고서 양식: LearnUs에서 다운로드\n\n* 첨부파일에 없는 실험실의 경우에도, 지도교수님의 승인을 받으면 연구참여 가능합니다.\n\n* 학점을 인정받기 위해서는 반드시 2026학년도 여름계절학기 MEU3008 학부연구(3) 과목을 수강신청해야 합니다.\n\n* 한 학기에 한 교수님의 연구실에서 수행한 연구 결과물로 학부연구와 연구논문 두 개 교과목에서 학점을 이수하는 것은 인정하지 않습니다.\n(2025-1학기부터 동일학기에 두 과목 동시 수강 불가/ 동시 수강할 시 한 과목은 F처리 됩니다.)\n\n* 6.29.(월) 첫 수업에는 대면 OT가 진행될 예정입니다.\n- 장소: 제1공학관 A690호\n- 시간: 8, 9교시\n\n* 연구실 참여정보는 7. 1. (수)에 업데이트 될 예정입니다.",
   "bodyKind": "text",
   "attName": "2026 여름계절학기 학부연구 신청서.hwp, 2026-여름계절학기 학부연구생 참여 연구실 정보.pdf"
  },
  {
   "no": "728",
   "title": "VAR 2026 여름학기 모집 안내",
   "date": "2026.06.24",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=473905&article.offset=0&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "VAR 2026 여름학기 모집 포스터.pdf"
  },
  {
   "no": "727",
   "title": "기계공학부「홈페이지 구축 경진대회」안내",
   "date": "2026.06.23",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=473812&article.offset=0&articleLimit=10",
   "att": true,
   "body": "여러분이 직접 만든 홈페이지가 우리 학부의 공식 홈페이지가 됩니다.\n\n기계공학부가 학생 주도의 「홈페이지 구축 경진대회」를 개최합니다. 단순한 공모전이 아니라, 우수 작품은 실제 학부 공식 홈페이지(리뉴얼)의 기반으로채택·발전됩니다. 직접 만든 웹사이트를 실제 서비스로 구현하고, 포트폴리오로도남길 수 있는 기회입니다.\n\n■ 시상(총 6팀 · 290만원)\n- 1등 100만원/ 2등 각 50만원(2팀)/ 3등 각 30만원(3팀)\n\n■ 참가 대상\n- 기계공학부 학부생·대학원생 누구나 (팀당 1~4명)\n\n■ 주요 일정(상황에 따라 변동될 수 있음)\n- 신청 마감: 2026. 7. 3.(금)\n- 제작 기간: 7. 7.(화) ~ 7. 31.(금)\n- 심사·시상: 8월 첫째~둘째 주\n\n생성형AI 도구 활용이 허용되므로, 코딩이 익숙하지 않더라도 아이디어와 기획력이 있다면충분히 도전할 수 있습니다.\n\n■ 신청 방법\n- 첨부된 참가 신청서를 작성하여 민경민 교수(kmin.min@yonsei.ac.kr)에게 이메일로 제출 (팀명·팀원 정보·기획 의도 기재)\n\n자세한 공모 요건과 심사 기준은 첨부 안내문을 확인해 주세요. 여러분의 많은 도전을 기다립니다.",
   "bodyKind": "text",
   "attName": "기계공학부_홈페이지_경진대회_안내문_참가신청서_Final.docx, 기계공학부_홈페이지_경진대회_안내문_참가신청서_Final.pdf"
  },
  {
   "no": "726",
   "title": "일몰된 교과목(기계공학수학)에 대한 재수강처리 요청서 제출 안내",
   "date": "2026.06.18",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=473501&article.offset=0&articleLimit=10",
   "att": true,
   "body": "일몰된 교과목(기계공학수학)에 대한 재수강처리 요청서 제출 안내\n\n2019년 1학기부터 기계공학부 교과목 개편 시행에 따라 기계공학수학 1,2는 수학과 강의인 공학수학3,4로 대체되었습니다.\n\n* 대체과목\n\n변경 전 | 변경 후\n기계공학수학(1) | 공학수학(3)\n기계공학수학(2) | 공학수학(4)\n\n따라서, 기존에 '기계공학수학'을 수강하셨던 학생 중 이번 여름계절학기에 재수강을 원하시는 학생께서는\n공학수학 3,4 수강신청한 후, 재수강처리 요청서(첨부파일)를 제출해주시기 바랍니다.\n\n신청서를 제출해야 재수강 처리가 가능하므로 반드시 기간 내에 제출을 완료하셔서 졸업 시 불이익이 없도록 해주시기 바랍니다.\n\n- 제출기한: 2026. 6. 22.(월)까지\n- 제출방법: 이메일 제출 skyice@yonsei.ac.kr (서명란 반드시 기재 후 제출)\n- 문의: 기계공학부 사무실 02-2123-4426",
   "bodyKind": "text",
   "attName": "일몰된 교과목(기계공학수학)에 대한 재수강처리 요청서(2026_여름계절학기).pdf, 일몰된 교과목(기계공학수학)에 대한 재수강처리 요청서(2026_여름계절학기).hwp"
  },
  {
   "no": "725",
   "title": "기계공학과 2026 여름학기 해외집중강의 시리즈 수강생 모집 안내",
   "date": "2026.06.11",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=473051&article.offset=0&articleLimit=10",
   "att": true,
   "body": "기계공학부에서 아래와 같이 해외집중강의 시리즈를 진행하오니 많은 관심과 참석 부탁드립니다.\n\n※신청 링크 바로가기: https://forms.gle/K3T7oDmsZggtmkqg7",
   "bodyKind": "text",
   "attName": "RLAI_Yonsei_Syllabus.pdf"
  },
  {
   "no": "722",
   "title": "2026학년도 2학기 학생설계전공 제도 시행 안내",
   "date": "2026.05.12",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=470828&article.offset=0&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "2026학년도 2학기 학생설계전공 홍보물.pdf"
  },
  {
   "no": "721",
   "title": "[항공우주전략연구원] 2026년 연세 우주항공 주간 개최 안내",
   "date": "2026.05.08",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=470620&article.offset=0&articleLimit=10",
   "att": false,
   "bodyKind": "file"
  },
  {
   "no": "720",
   "title": "2026 공과대학 외국인 격려행사(Global Day in College of Engineering) 안내",
   "date": "2026.04.14",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=469038&article.offset=0&articleLimit=10",
   "att": false,
   "bodyKind": "file"
  },
  {
   "no": "719",
   "title": "2026학년도 2학기 캠퍼스내 소속변경 전형 안내",
   "date": "2026.04.08",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=468472&article.offset=0&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "1. 2026-2학기 캠퍼스내 소속변경 전형 안내문(최종).pdf, 2. 2026-2학기 소속변경 지원 가능 현황표.pdf"
  },
  {
   "no": "718",
   "title": "2026학년도 여름학기 미주개발은행 인턴십 프로그램 안내",
   "date": "2026.04.08",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=468471&article.offset=0&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "2026 여름학기 국제처 해외파견프로그램 초과학기 등록 서약서.docx, IDB Internship Application and Consent Form l 미주개발은행 인턴십 지원서 및 서약서.docx, [직무기술서2] IDB_Korean Content & Digital Communications Intern.docx, 2026학년도 여름학기 미주개발은행 인턴십 모집 공고문.pdf, 2026학년도 여름학기 미주개발은행 인턴십 모집 포스터.png, 2026학년도 여름학기 미주개발은행 인턴십 프로그램 홍보 요청.pdf"
  },
  {
   "no": "717",
   "title": "2026학년도 1학기 졸업앨범 사진촬영 관련 안내",
   "date": "2026.04.07",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=468326&article.offset=0&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "2026-1학기 연세대학교 졸업앨범 촬영일정 안내.hwp"
  },
  {
   "no": "716",
   "title": "2026학년도 1학기 학부 수강과목 철회 안내 (Course Withdrawal)",
   "date": "2026.03.27",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=467481&article.offset=0&articleLimit=10",
   "att": true,
   "body": "2026학년도 1학기 학부 수강과목 철회 안내\n\n2026학년도 1학기 수강신청 과목 중 부득이한 사유로 계속 수강할 수 없는 경우는 다음의 안내에 따라 지정된 기간에 철회하시기 바랍니다.\n\n1. 수강철회 기간 : 2026. 4. 14.(화) 09:00 ~ 4. 16.(목) 23:59\n※ 중간고사 기간 이전에 실시하므로 유의 요망. 기간 종료 후에는 철회신청내역 변경 불가\n2. 수강철회 방법 : 연세포탈서비스(학사정보시스템 → 학사행정 → 수업 → 학생 → 수강철회신청)에서 학생이 직접 온라인으로 철회 신청\n\n3. 유의 사항\n1) 수강과목 철회 후 다른 과목으로 대체 수강신청할 수 없으며, 수강과목 철회 후에도 신청과목이 최소 1과목 이상이 되어야 합니다.\n2) 철회한 과목은 성적평가에서 제외되며, 성적증명서에 기재되지 않습니다.\n3) 수강과목을 철회한 학생은 학칙 제43조 2항에 의하여 학점초과 신청이나 우등생(최우등생, 우등생, 우수생) 및 최우등졸업생, 우등졸업생 대상에서 제외됩니다.\n4) 수강철회 후 학사포탈 내 개인시간표에서는 과목이 삭제되지 않으니, 반드시 수강신청 내역 메뉴에서 철회 반영여부를 확인하여야 합니다.\n: 수강철회 신청 후 연세포탈서비스(학사정보시스템 → 학사행정 → 수업 → 학생 → 수강신청내역)에서 철회 열에 “Y“표시가 있는 것을 확인)\n5) 2013학번 이후 학생이 재수강 횟수를 사용하여 수강신청한 과목을 철회하는 경우, 재수강 횟수는 차감되지 않습니다.\n6) 기타 철회 관련 문의는 학사지원팀(02-2123-2090)으로 연락하시기 바랍니다.\n7) 철회에 따른 장학금 관련 문의는 학생지원팀(02-2123-8191)으로 문의하시기 바랍니다.",
   "bodyKind": "text",
   "attName": "[붙임1-1] 2026-1 수강철회 안내문.pdf, [붙임1-2] Course Withdrawal for Spring Semester 2026.pdf"
  },
  {
   "no": "715",
   "title": "AI캠퍼스 구축을 위한 \"라이너 프로\" 무상 지원 관련 안내",
   "date": "2026.03.25",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=467259&article.offset=0&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "홍보포스터_라이너x연세대.pdf, 안내문_학술 AI 서비스 '라이너' 연세대 전 구성원 1년 무료.docx"
  },
  {
   "no": "714",
   "title": "국제캠퍼스 도서관 신분증·학생증 발급 창구 운영 종료 안내",
   "date": "2026.03.19",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=466874&article.offset=0&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "국제캠퍼스 도서관 신분증 발급 서비스 중단 안내문(영문).pdf, 국제캠퍼스 도서관 신분증 발급 서비스 중단 안내문(국문).pdf"
  },
  {
   "no": "713",
   "title": "2026학년도 1학기 수림재단 신규 장학생 선발 안내",
   "date": "2026.03.17",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=466611&article.offset=0&articleLimit=10",
   "att": true,
   "body": "[수림재단 신규 장학생 선발 안내]\n\n가. 추천 대상: 이과대학 1명, 공과대학 1명\n\n나. 추천 조건\n1) 2학년 재학생\n2) 소득분위 8분위 이하\n3) 전체 백분위 평균 점수 85점 이상\n4) 2026학년도 1학기 12학점 이상 이수, 1학년 재학 시 총 24학점 이상 이수\n\n다. 장학금액: 생활비성 장학금 480만원\n*해외역사문화탐방 기회 제공(중국, 일본)\n\n라. 제출서류:\n1) 지원신청서(붙임파일 1)\n2) 지원양식 모음(붙임파일 2)\n3) 학자금 지원구간 통지서\n4) 성적증명서, 수강신청 내역서\n5) 고등학교 학교생활기록부(직인 포함)\n6) 대학수학능력시험 성적표(시험 응시자에 한함)\n7) 재학증명서\n8) 주민등록등본\n\n마. 제출기한 및 방법: 2026. 4. 16.(목)\n\n바. 제출 방법: shin.hj@yonsei.ac.kr로 PDF 합본을 제출",
   "bodyKind": "text",
   "attName": "2026년도 신규장학생 선발안내_260304.hwp, 장학생 지원신청서(양식)_260227.hwp, 개인정보 수집 및 활용에 관한 동의서,자기소개서, 추천서(양식)_260227.hwp"
  },
  {
   "no": "712",
   "title": "제3기 차세대 공학(연구)자 신청 안내",
   "date": "2026.03.10",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=466071&article.offset=10&articleLimit=10",
   "att": true,
   "body": "한국이공학진흥원(Institute for promotion of Engineering and Science of Korea, 에서는 공학계열 단과대학의 발전과 대한민국의 미래를 선도할 공학(연구)자를\n\n양성하기 위해「글로벌 연구중심대학」에 재학 중인 우수한 학생을 추천받아 「IPESK 차세대 공학(연구)자」로 인증하고, 다양한 혜택을 제공하고자 합니다.\n\n가. 개요\n| 차세대 공학자\n대상자 | - 학부생 - 휴학생 및 수료생 제외\n추천요건 | - 학장의 추천을 받은 자로서 - 학부 3학년 또는 4학년 재학생으로 - 성적이 4.5 만점에 3.5 이상인 학생 (또는 4.3 만점에 3.3 이상인 학생)\n인증혜택 | - 차세대 공학자 디지털 배지 발급 - 차세대 공학자 양성사업 참여 우대 - 포럼 등 각종 행사 초대권 증정 - 차세대 공학자상 수상 자격 부여\n\n나. 추천서류\n구분 | 제출서류명 | 제출부수 | 비고\n차세대 공학자 | [붙임4] 제3기 차세대 공학자 개인정보 수집 및 이용 동의서 | 학과별 1부 | PDF 제출\n성적증명서 | 학과별 1부 | PDF 제출\n\n다. 제출 방법 : 2026.3.23(월) 까지, 이메일접수(skyice@yonsei.ac.kr)\n\n자세한 내용은 첨부파일을 참고 바랍니다.",
   "bodyKind": "text",
   "attName": "[붙임1] 제3기 차세대 공학(연구)자 추천 안내.pdf, 제3기 차세대 공학(연구)자 추천 안내.pdf, [붙임4] 제3기 차세대 공학자 개인정보 수집 및 이용 동의서(서식).hwp"
  },
  {
   "no": "711",
   "title": "2026-1학기 학부연구(1) 연구참여 신청서 제출 안내 (신청서 제출마감: 3.13.(금) 17:00까지)",
   "date": "2026.03.10",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=466066&article.offset=10&articleLimit=10",
   "att": true,
   "body": "2026-1학기 학부연구(1) 연구참여 프로그램 안내\n\n기계공학부에서는 2018년부터 1~4학년 학생들이 방학 기간을 이용하여 수업에서 다루지 못한 재미있고 깊이 있는 기계공학 지식을 공부할 수 있는 다양한 연구참여 및 교육 프로그램을 실시하고 있습니다. 이 프로그램이 전공 분야에 대한 자신의 적성을 발견하고, 가치 있는 미래를 꿈꿀 수 있는 기회가 되기를 바랍니다. 특히, 2019학년도 교과과정 개편 이후 학부생이 연구참여를 통해서 방학 또는 정규학기에 1학점을 취득할 수 있는 학부연구(MEU3006 ~ 3009)과목이 신설되었습니다.\n\n[참여 방법]\n\n* 참여대상자: 2026학년도 1학기 개설과목인 MEU3006 학부연구(1)를 수강신청한 기계공학부 학부생 (복수전공자 수강 가능)\n\n* 첨부2의 연구주제를 참고하여 관심 있는 주제의 교수님께 이메일 등으로 연락을 드려 허락을 받은 후, 신청서 양식을 연구 시작과 동시에 2026. 3. 13.(금) 17:00 까지 LearnUs 연구신청서 제출함에 업로드합니다.\n(※ 신청서 제출 및 지도교수님의 승인은 이메일 승인으로 대체가능하며, 신청서 양식을 제출하지 않으면 학부연구 과목의 학점을 인정받을 수 없습니다.)\n\n* 교수님과 상의드려 학기 중 최소 32시간 이상을 학과 실험실 등에서 연구에 참여한 후 소정의 보고서를 제출하면 평가하여 학부연구 교과목의 학점(Pass)이 부여됩니다.\n\n* 구체적인 연구 참여 방법 및 참여 기간은 담당교수님과 상의하여 결정해주시기 바랍니다.\n\n[제출 기한]\n\n1. 학부연구 신청서 제출: 2026. 3. 13.(금) 17:00 까지 LearnUs 연구신청서 제출함으로 제출\n※ 문의: 학과 사무실 정나경 선생님 (메일: skyice@yonsei.ac.kr/ 전화: 02-2123-4426)\n\n2. 최종보고서 제출: 추후 안내\n\n[유의사항]\n\n* 학부연구 신청서 및 보고서 양식: LearnUs에서 다운로드\n\n* 첨부파일에 없는 실험실의 경우에도, 지도교수님의 승인을 받으면 연구참여 가능합니다.\n\n* 학점을 인정받기 위해서는 반드시 2026학년도 1학기 MEU3006 학부연구(1) 과목을 수강신청해야 합니다.\n\n* 한 학기에 한 교수님의 연구실에서 수행한 연구 결과물로 학부연구와 연구논문 두 개 교과목에서 학점을 이수하는 것은 인정하지 않습니다.\n(2025-1학기부터 동일학기에 두 과목 동시 수강 불가/ 동시 수강할 시 한 과목은 F처리 됩니다.)\n\n* 3.6.(금) 첫 수업에는 대면 OT가 진행될 예정입니다.\n- 장소: 제4공학관 D402호\n- 시간: 4, 5교시\n\n[첨부파일]\n\n1. 2026-1학기 학부연구 신청서\n2. 2026-1학기 학부연구생 참여 연구실 정보(업데이트 예정)",
   "bodyKind": "text",
   "attName": "2026-1학기_학부연구_신청서.hwp, 2026-1학기 학부연구생 참여 연구실 정보.pdf"
  },
  {
   "no": "710",
   "title": "[학부] 수강신청 증원 교과목 안내 (개강 이후 증원 과목, 수시 업데이트 예정)",
   "date": "2026.03.05",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=465521&article.offset=10&articleLimit=10",
   "att": false,
   "body": "기계공학과 사무실에서 학부 수강신청 증원 교과목을 다음과 같이 안내드립니다.\n+\n졸업예정자임에도 연구논문, 창의제품설계 수강신청에 실패한 학부생이 있다면 학과 사무실로 연락 바랍니다.\n\n1. 3/5(목) 16:00 반영 예정\n학정번호 | 분반 | 교과목명 | 기본정원 | 담당 교수\n정원 | 현인원 | 증원 인원\nMEU2610 | 02 | 열역학 | 120 | 120 | 10 | 이남규\n\n2. 3/5(목) 17:30 반영 예정\n학정번호 | 분반 | 교과목명 | 기본정원 | 담당 교수\n정원 | 현인원 | 증원 인원\nMEU3005 | 01-04 | 기계공학실험(2) | 30 | - | 분반별로 3명씩 | 최종은, 이준상, 윤준영, 이남규\n\n3. 3/6(금) 15:30 반영 예정\n학정번호 | 분반 | 교과목명 | 기본정원 | 담당 교수\n정원 | 현인원 | 증원 인원\nMEU3620 | 01 | 생산공학 | 95 | 95 | 2 | 민병권",
   "bodyKind": "text"
  },
  {
   "no": "709",
   "title": "신촌캠퍼스 전체 정전안내(전기시설물의 법정 점검 및 보완공사)",
   "date": "2026.02.19",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=464412&article.offset=10&articleLimit=10",
   "att": true,
   "body": "신촌캠퍼스 전체 정전안내(전기시설물의 법정 점검 및 보완공사)\n\n가. 정전일시 : 2026. 2. 20.(금) 22:00 ~ 2. 21.(토) 04:00 (6시간)\n나. 정전대상 : 신촌캠퍼스 내 건물 전체\n다. 작 업 자 : 한국전기안전공사, 시공사, 설비팀 전기실\n라. 협조의뢰 사항\n1) 정전시간은 상황에 따라 다소 연장 될 수도 있습니다.\n2) 정전시간에는 조명, 콘센트, 승강기 등 모든 전기시설물의 사용이 불가합니다.\n3) 정전시간에는 모든 인터넷 서비스 및 전화사용도 불가합니다.\n4) 정전시간에는 승강기 사용을 중지하여 주시기 바랍니다.\n5) 소속기관에서는 실험실, 연구실, 컴퓨터실, 서버실 등 중요장소에 사전 안내하여 정전으로 인한 피해가 발생하지 않도록 대비하여 주시기 바랍니다.\n6) 정전시간에는 무인방범시설도 정지되므로 총무팀에서는 건물관리 및 방호업무에 각별히 신경 써 주시기 바랍니다.\n7) 서버를 사용하는 기관에서는 사전에 관련장비를 SHUT DOWN 조치하여 주시기 바랍니다.",
   "bodyKind": "text",
   "attName": "신촌캠퍼스 전체 정전안내(전기시설물의 법정 점검 및 보완공사).pdf, 1. 전기안전관리법 시행규칙 개정 주요내용 안내(23.12.20) (1).hwp, 2. 고압이상 구내배전설비, 전기자동차 충전설비 정기검사 시행계획 (1).hwp"
  },
  {
   "no": "708",
   "title": "[학부] 수강신청 증원 교과목 안내 (수시 업데이트 예정)",
   "date": "2026.02.12",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=464239&article.offset=10&articleLimit=10",
   "att": false,
   "body": "게시글 내용\n기계공학과 사무실에서 학부 수강신청 증원 교과목을 다음과 같이 안내드립니다.\n+\n졸업예정자임에도 연구논문, 창의제품설계 수강신청에 실패한 학부생이 있다면 학과 사무실로 연락 바랍니다.\n\n1. 2/12(목) 14:00 반영 예정\n학정번호 | 분반 | 교과목명 | 기본정원 | 담당 교수\n정원 | 현인원 | 증원 인원\nMEU3620 | 01 | 생산공학 | 80 | 80 | 10 | 민병권\nMEU3015 | 01 | *전자기학및응용 | 60 | 60 | 4 | 전성찬\n\n2. 2/12(목) 15:00 반영 예정\n학정번호 | 분반 | 교과목명 | 기본정원 | 담당 교수\n정원 | 현인원 | 증원 인원\nMEU2610 | 02 | *열역학 | 100 | 100 | 20 | 이남규\n\n3. 2/12(목) 17:00 반영 예정\n학정번호 | 분반 | 교과목명 | 기본정원 | 담당 교수\n정원 | 현인원 | 증원 인원\nMEU3640 | 02 | *응용유체역학 | 50 | 50 | 20 | 김원정\n\n4. 2/13(금) 10:50 반영\n학정번호 | 분반 | 교과목명 | 기본정원 | 담당 교수\n정원 | 현인원 | 증원 인원\nMEU2620 | 02 | 컴퓨터응용기계설계 | 30 | 30 | 10 | 유정훈\n\n5. 2/13(금) 11:30 반영 예정\n학정번호 | 분반 | 교과목명 | 기본정원 | 담당 교수\n정원 | 현인원 | 증원 인원\nMEU2600 | 03 | *고체역학 | 70 | 70 | 10 (교환학생 5, 본교학생 5) | 강건욱\n\n6. 2/13(금) 14:00 반영 예정\n학정번호 | 분반 | 교과목명 | 기본정원 | 담당 교수\n정원 | 현인원 | 증원 인원\nMEU3620 | 01 | 생산공학 | 90 | 90 | 5 | 민병권\nMEU3002 | 02 | *메카니즘설계 | 70 | 70 | 11 | 김종백\n\n7. 2/13(금) 15:30 반영 예정\n학정번호 | 분반 | 교과목명 | 기본정원 | 담당 교수\n정원 | 현인원 | 증원 인원\nMEU2620 | 01 | 컴퓨터응용기계설계 | 30 | 30 | 10 | 이종수\nMEU2620 | 03 | 컴퓨터응용기계설계 | 30 | 30 | 10 | 민경민\nMEU3002 | 02 | *메카니즘설계 | 81 | 81 | 2 | 김종백\n\n8. 3/5(목) 11:00 반영 예정\n\n학정번호 | 분반 | 교과목명 | 기본정원 | 담당교수\n정원 | 현인원 | 증원 인원\nMEU3002 | 01 | 메카니즘설계 | 70 | 70 | 10 | 양현석\n\n-----------------------------------------------\n아래 수업은 증원 계획이 없음을 공지합니다.\nMEU2610-01 열역학\nMEU3004-01 바이오의료기계",
   "bodyKind": "text"
  },
  {
   "no": "707",
   "title": "[학부] 2026년 2월 졸업자 학위수여식 및 학위가운 대여 안내",
   "date": "2026.02.10",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=464123&article.offset=10&articleLimit=10",
   "att": false,
   "body": "2026년 2월 학위수여식 및 학위가운 대여 안내\n\n졸업을 진심으로 축하드립니다. 학위수여식과 관련된 사항을 다음과 같이 안내하오니 참고하여 주시고, 학위수여식에 참석하시어 자리를 빛내 주시기 바랍니다.\n\n▣ 학위수여식 : 2026. 2. 23.(월) 오전 10시 30분, 노천극장\n\n▣ 학부생 가운,학위모 배부\n가. 2.12(목), 13(금), 19(목), 20(금), 23(월) 5일간 배부하오니, 신분증을 제시하고 교부받으시기 바랍니다. 대리인이 오는 경우 졸업생의 신분증을 지참해야 합니다.\n\n￭ 배부 및 반납 시간\n2.12(목)~2.23.(월) : 오전 9시30분 ~ 오후 4시30분 (점심시간 12시~1시 제외)\n(단, 2.23.(월) 가운 배부는 오후 2시에 종료되며, 반납은 당일 오후 4시까지 완료)\n배부 및 반납 장소 | 학과별 문의처\n4공학관 D404호 | 화공생명공학(02-2123-7779) 건축공학/건축학(02-2123-2780) 토목환경공학/건설환경공학(02-2123-2795) 신소재공학(02-2123-5832) 시스템반도체공학(02-2123-3323) | 전기전자공학(02-2123-5876) 도시공학(02-2123-4010) 기계공학(02-2123-4426) 정보산업공학/산업공학(02-2123-4010)\n\n나. 학위가운 세탁·보관료 : 공과대학에서 일괄 지원하므로 공과대학 학부 졸업생은 납부할 필요 없음\n다. 도서미납자는 학술정보원에 미납도서를 반납한 후 도서완납증명서를 받아야 해당 대학에서 가운과 학위모를 받을 수 있습니다.\n\n▣ 졸업앨범 배부\n학생회관 204호에서 20(금), 23(월), 24(화) 3일간 오전 9시30분부터 오후 4시30분까지배부하오니, 이를 수령할 때 신분증을 제시해야 하며, 대리인이 오는 경우 졸업생의 신분증을 지참해야 합니다.\n\n▣ 학위수여식 입장\n졸업생은 학위수여식 당일 행사시작 10분전까지 노천극장 앞에서 교직원의 안내를 받아 입장하여 좌석에 착석하여 주시기 바랍니다.\n\n▣ 학위수여 방법 [학사]\n가. 학위 수여 대표자가 연단으로 올라가면 해당 학위 졸업생은 모두 기립합니다.\n나. 대표자가 총장으로부터 학위증을 수여 받고 뒤로 돌아서서 학위모의 술을 우에서 좌로 옮길 때 졸업생은 대표자와 동시에 학사모의 술을 옮깁니다.\n다. 대표자가 연단에서 내려가면 착석합니다.\n\n▣ 가운, 학위모 반납 및 졸업증서 배부\n가. 2026.2.23.(월) 오후 4시까지 가운 및 학위모를 반납장소(D404)에 반납하고 「졸업증서」를 받으시기 바랍니다.\n나. 가운 및 학위모를 반납하지 않을 경우 증명서 발급이 중단되오니 착오 없으시기 바랍니다.\n\n▣ 기타사항\n가. 학위수여식 당일에는 신촌지역 및 교내 교통이 매우 혼잡하오니 대중교통을 이용하여 주시기 바랍니다.\n나. 학사 학위가운 타인 및 외부 스튜디오에 판매, 대여 불가. 해당 사항 위반시 디자인보호법 위반, 부정경쟁방지 및 영업비밀보호에 관한 법률('부정경쟁방지법') 위반, 민법 제750조의 불법행위에 해당하며, 이에 따른 민,형사상의 법적 책임이 발생할 수 있음.",
   "bodyKind": "text"
  },
  {
   "no": "706",
   "title": "진리자유학부 및 소속변경학생 대상 수·과학 교양교과목 대체인정 기준 안내",
   "date": "2026.02.09",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=464019&article.offset=10&articleLimit=10",
   "att": true,
   "body": "진리자유학부 및 소속변경학생 대상 수·과학 교양교과목 대체인정 기준 안내\n\n가. 적용대상\n1) 2026학번 이후 진리자유학부 입학생\n2) 캠퍼스 내 소속변경학생 (학번 및 소속변경시점 무관 소급 적용)\n\n나. 졸업요건 대체인정 과목 목록\n\n졸업 이수요건 | | 대체가능 과목\nMAT1001 | 미분적분학과벡터해석(1) | 　 | MAT1011 | 공학수학(1) | MAT1016 | 미분적분학과벡터해석(1)(심화)\nMAT1002 | 미분적분학과벡터해석(2) | 　 | MAT1012 | 공학수학(2) | MAT1017 | 미분적분학과벡터해석(2)(심화)\nMAT1016 | 미분적분학과벡터해석(1)(심화) | ← | MAT1001 | 미분적분학과벡터해석(1) | MAT1011 | 공학수학(1)\nMAT1017 | 미분적분학과벡터해석(2)(심화) | 　 | MAT1002 | 미분적분학과벡터해석(2) | MAT1012 | 공학수학(2)\nPHY1001 | 일반물리학및실험(1) | 　 | PHY1011 | 공학물리학및실험(1) | 　 |\nPHY1002 | 일반물리학및실험(2) | 　 | PHY1012 | 공학물리학및실험(2) | 　 |\nCHE1001 | 일반화학및실험(1) | 　 | CHE1011 | 공학화학및실험(1) | 　 |\nCHE1002 | 일반화학및실험(2) | ← | CHE1012 | 공학화학및실험(2) | 　 |\nBIO1001 | 일반생물학및실험(1) | 　 | BIO1011 | 공학생물학및실험(1) | BIO1008 | 일반생물학및실험(1)(심화)\nBIO1002 | 일반생물학및실험(2) | 　 | BIO1012 | 공학생물학및실험(2) | BIO1009 | 일반생물학및실험(2)(심화)\nBIO1008 | 일반생물학및실험(1)(심화) | 　 | 　 | 대체불가 | 　 |\nBIO1009 | 일반생물학및실험(2)(심화) | 　 | 　 | 대체불가 | 　 |\nMAT1011 | 공학수학(1) | ← | MAT1001 | 미분적분학과벡터해석(1) | MAT1016 | 미분적분학과벡터해석(1)(심화)\nMAT1012 | 공학수학(2) | 　 | MAT1002 | 미분적분학과벡터해석(2) | MAT1017 | 미분적분학과벡터해석(2)(심화)\nPHY1011 | 공학물리학및실험(1) | 　 | PHY1001 | 일반물리학및실험(1) | 　 |\nPHY1012 | 공학물리학및실험(2) | 　 | PHY1002 | 일반물리학및실험(2) | 　 |\nCHE1011 | 공학화학및실험(1) | 　 | CHE1001 | 일반화학및실험(1) | 　 |\nCHE1012 | 공학화학및실험(2) | ← | CHE1002 | 일반화학및실험(2) | 　 |\nBIO1011 | 공학생물학및실험(1) | 　 | BIO1001 | 일반생물학및실험(1) | BIO1008 | 일반생물학및실험(1)(심화)\nBIO1012 | 공학생물학및실험(2) | 　 | BIO1002 | 일반생물학및실험(2) | BIO1009 | 일반생물학및실험(2)(심화)\n위의 교과목을 졸업이수요건으로 하는 학과로 ①소속변경한 학생이나 ②진리자유학부 입학생으로서 전공진입한 학생은 | | 위의 교과목을 이수하여도 졸업요건을 충족한 것으로 대체 인정함",
   "bodyKind": "text",
   "attName": "진리자유학부 및 소속변경생 수물화생 대체인정기준(260203).xlsx"
  },
  {
   "no": "705",
   "title": "[필독] 2026학년도 1학기 학부 수강신청 안내",
   "date": "2026.01.30",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=463508&article.offset=10&articleLimit=10",
   "att": true,
   "body": "2026학년도 1학기 학부 수강신청 안내\n\n★ 기계공학창의설계(MEU2300) 폐지 예고 ★\n2026-1학기를 마지막으로 MEU2300 기계공학창의설계는 더이상 개설되지 않을 예정입니다.\n위 수업이 졸업요건 전공필수로 지정되어있는 23학번 이전 학번(제1전공생, 편입학생, 소속변경생, 재수강생)은 반드시 이번 학기에 수업을 수강 하시기 바랍니다.\n\n1. 학부연구, 연구논문 동일 학기 수강 불가\n2025학년도 1학기부터 학부연구와 연구논문은 동일 학기 수강이 불가합니다.\n한 학기에 두 과목을 동시 수강할 경우 한 과목에 대해서만 성적 부여 가능합니다. (나머지 과목은 F 혹은 NP 처리됨)\n\n2. 기계공학세미나(MEU4001, MEU4002) 관련 공지\n1) 둘 다 수강 시, ‘전공선택’ 인정 관련\n- 원칙: 둘 다 수강 불가, 한 과목만 전공선택 인정\n- 18학번 포함 이전 학번: 권장사항은 아니나, 둘 다 전선으로 인정되긴 합니다.\n- 19학번 포함 이후 학번: 공식적으로 금지하며, 전선으로는 3학점만 인정됩니다.\n그럼에도 불구하고 두 과목 모두 들을 경우에는 나머지 한과목은 일반선택으로 인정됩니다. (총 취득학점에는 포함됨)\n\n2) MEU4001 기계공학세미나(1) 폐지 안내\n2025-1학기를 마지막으로 MEU4001 기계공학세미나(1)은 더이상 개설되지 않으며, 2025-2학기부터 MEU4002 기계공학세미나(2)의 교과목명이 \"기계공학세미나\"로 변경된 후 매학기마다 개설됩니다. MEU4001을 기수강했던 학생이 MEU4002를 추가수강할 경우 둘 중 한 과목만 전공선택으로 인정된다는 요건은 유효합니다.\n- (변경 전): 1학기에 MEU4001 기계공학세미나(1) 개설, 2학기에 MEU4002 기계공학세미나(2) 개설\n- (변경 후): 1,2학기에 MEU4002 기계공학세미나 개설\n\n3. MEU3300 창의설계프로젝트(2) 폐강에 따른 대체과목 안내\n창의설계프로젝트(2)가 폐강됨에 따라 해당 교과목은 컴퓨터해석기반설계로 대체되었습니다.\n따라서 전공필수로 지정된 창의설계프로젝트(2)를 수강하지 못한 18학번 이전 학생들은 컴퓨터해석기반설계를 수강해주시기 바랍니다.\n이전 교과목 | 대체 과목\n학정번호 | 교과목명 | 학정번호 | 교과목명\nMEU3300 | 창의설계프로젝트(2) | MEU3801 | 컴퓨터해석기반설계\n\n4. 기계공학수학(1), (2) 재수강 신청 안내\n기계공학부 교과목 개편 시행에 따라 2019년 1학기부터 기계공학수학 1,2는 수학과 강의인 공학수학3,4로 대체되었습니다.\n따라서, 기존에 '기계공학수학'을 수강하셨던 학생 중 26-1학기에 재수강을 원하시는 학생께서는 공학수학(3), (4) 수강신청 후, 재수강처리 요청서(첨부파일)를 제출해주시기 바랍니다.\n이전 교과목 | 대체 과목\n학정번호 | 교과목명 | 학정번호 | 교과목명\nMEU2101 | 기계공학수학(1) | MAT2016 | 공학수학(3)\nMEU2102 | 기계공학수학(2) | MAT2017 | 공학수학(4)\n\n신청서를 제출해야 재수강 처리가 가능하므로 반드시 기간 내에 제출을 완료하셔서 졸업 시 불이익이 없도록 해주시기 바랍니다.\n- 제출기한: 2026. 3. 6.(금) 오후 5시까지\n- 제출방법: 이메일 제출 skyice@yonsei.ac.kr (서명란 반드시 기재 후 제출)\n- 문의: 기계공학부 사무실 02-2123-4426\n\n5. 공학수치해석, 확률통계 교과목 종별 변경\n22학번부터 공학수치해석, 확률통계의 종별이 전공기초 -> 전공선택으로 변경되었습니다.\n21학번까지는 기존과 동일하게 전공기초로 인정됩니다.\n학정번호 | 교과목명 | 교과목 종별\n21학번 까지 | 22학번 이후\nMEU3003 | 공학수치해석 | 전공기초 | 전공선택\nMAT2013 | 확률통계 | 전공기초 | 전공선택\n\n6. MAX 마일리지 조정\n전공과목 max 마일리지가 36→18로 조정되어 22-2학기 수강신청부터 적용되었습니다.\n*기계공학과 전공교과목 MAX마일리지: 18마일리지(공학수학(3),(4), 공학정보처리 제외)\n\n7. 학번별 졸업요건 확인\n'학부' > '졸업요건' > 학번별 확인\n*복수전공, 부전공 이수요건: ‘기계공학부졸업요건’ 탭 확인\n*학사편입, 졸업예정자 복수전공 졸업요건은 수정내용이 있으므로 학과사무실에 개별연락 바람\n\n8. 교과목 수강 및 졸업 관련 FAQ\n첨부링크 참고: https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=159666&article.offset=0&articleLimit=10\n\n[붙임]\n1. 일몰된 교과목 재수강처리 요청서 (2026-1학기)\n\n※문의: 02-2123-4426/ skyice@yonsei.ac.kr",
   "bodyKind": "text",
   "attName": "일몰된_교과목(기계공학수학)에_대한_재수강처리_요청서(2026-1학기).hwp"
  },
  {
   "no": "704",
   "title": "[공사 안내] 제4공학관 데이터센터 구축공사",
   "date": "2026.01.14",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=462655&article.offset=10&articleLimit=10",
   "att": true,
   "body": "1. 공사명: 제4공학관 데이터센터 구축공사\n\n2. 작업일시: 1월 18일 일요일 06:00~10:00\n\n3. 작업차량: 50TON 크레인 1대, 5TON트럭 1대 등\n\n4. 작업내용\n1) 공사자재 옥상(4공학관) 양중\n2) 작업지휘자, 관리감독자를 배치하여 안전구획 설정 및 보행자 이동안내\n\n5. 공사담당자: 서우시스템즈 서장원 차장 010-9471-0816\n\n6. 작업위치: 첨부파일 참조",
   "bodyKind": "text",
   "attName": "[공사 협조 안내] 제4공학관 D016~D022호 데이터센터 구축공사.pdf, 양중위치.pdf"
  },
  {
   "no": "703",
   "title": "기계공학과 2025 겨울학기 해외집중강의 시리즈 수강생 모집 안내(~1/15(목) 13시까지)",
   "date": "2026.01.09",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=462408&article.offset=10&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "강의계획서.pdf"
  }
 ],
 "noticesGrad": [
  {
   "no": "공지",
   "title": "[대학원] 대학원 학사요람 (2025.08.개정)",
   "date": "2024.05.29",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=190313&article.offset=0&articleLimit=10",
   "att": true,
   "body": "2025년 8월 개정된 기계공학과 대학원 학사요람을 첨부와 같이 안내하여 드리오니,\n\n개정된 학사요람을 확인하시기 바랍니다.\n\n* 주요개정사항\n\n1. 학위 취득을 위한 최소 수강 학점\n학위 과정 | 최소 졸업 학점\n석사 과정 | 27 30 (26년 이전 입학자)\n박사 과정 | 27 30 (26년 이전 입학자)\n석박사 통합 과정 | 48 54 (26년 이전 입학자)\n\n* 상기 학위 과정 이수에 필요한 최소 졸업학점을 만족하고, 총 평량 평균이 3.0/4.3 이상이어야 한다.\n2026년 1학기 혹은 이후 입학자의 경우, 학위논문연구과목의 이수학점을 최소 졸업 학점에 포함할 수 없다.\n** 2025년 2학기 및 그 이후 입학자의 경우, 석사과정은 12학점, 통합과정은 18학점, 박사과정은 12학점 이상의 “기계공학과 개설 강의과목”을 반드시 이수해야한다. 단, 석사학위를 본교 기계공학과에서 취득한 후 박사과정에 입학한 학생의 경우, 통합과정의 기준을 준용하고 석사과정시 이수한 과목을 인정한다.\n“기계공학과 개설 강의과목”: 전공강의 과목을 의미하며 세미나, 대학원에서의 연구 및 학위논문연구과목 제외",
   "bodyKind": "text",
   "attName": "대학원 학사요람(2025.08.개정).pdf"
  },
  {
   "no": "617",
   "title": "2026학년도 2학기 ME Graduate Fellowship(MGF) 장학생 모집",
   "date": "2026.07.15",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=474975&article.offset=0&articleLimit=10",
   "att": true,
   "body": "ME Graduate Fellowship(MGF)은 우수한 대학원생을 선발하여 장학금과 다양한 혜택을 제공함으로써 수상자의 자긍심을 함양하고,\n대학원 진학을 희망하는 우수 인재의 학업 및 연구 의욕을 고취하고자 합니다.\n이에 아래와 같이 장학생을 모집하오니 많은 지원 바랍니다.\n\n1. 지원자격\n- 석·박사 통합과정생에 한함\n- 2026학년도 2학기 기준 대학원 입학 예정자 또는 2학기 등록 예정자\n- 학부 성적 기준 평균평점 3.7/4.3 이상 또는 4.0/4.5 이상\n\n2. 선발인원\n- 예산 범위 내 선발\n\n3. 장학금 및 혜택\n- 장학금: 1년 간 총 1,200만원(학기당 600만원씩 지급)\n- (BK 사업 참여 시) 장기 해외연수 및 국제학술대회 참가 기회 우선 제공\n- 장학증서 수여\n- 학과 홈페이지를 통한 장학생 소개\n※ 장학금 지급 신청 시점 기준으로 재학 중이 아니거나 석·박사 통합과정 이외의 과정으로 전환한 경우 장학금 지급 대상에서 제외됨\n\n4. 제출서류\n- 지원신청서(2페이지 이내 작성) 1부\n- 성적증명서 1부\n\n5. 진행일정\n- 지원서 접수: 2026년 7월 15일 ~ 8월 5일\n- 합격자 발표: 2026년 8월 중\n- 장학금 지급: 2026년 2학기 중(2027년 1~2월 예상)\n※ 상기 일정은 사정에 따라 변경될 수 있음\n\n6. 접수방법\n- 이메일 제출: mech_bk21_ley@yonsei.ac.kr\n\n7. 문의처\n- 전화: 02-2123-7817\n- 이메일: mech_bk21_ley@yonsei.ac.kr",
   "bodyKind": "text",
   "attName": "2026-2학기_기계공학부_ME_Graduate_Fellowship_장학생_선발_공고.hwpx"
  },
  {
   "no": "616",
   "title": "2026학년도 2학기 연구원·연구보조원 임용 신청 안내 (공학연구원)",
   "date": "2026.07.09",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=474717&article.offset=0&articleLimit=10",
   "att": true,
   "body": "공학연구원에서 연구원 및 연구보조원을 다음과 같이 모집합니다.\n\n가. 모집 대상 및 지원서류\n\n구분 | 자격요건 | 제출서류\n연구원 | 대학원 재학생 (박사 과정,통합 과정) | 공통서류 ①,②,③,④\n산학협력단과 근로계약을 체결하여 연구과제에 참여 중인 졸업생(석사 학위 이상의 소지자) | 공통서류 ①,②,③,④ 외 ⑤석사학위증명서⑥산학협력단 근로계약서 사본⑦과제 책임교수 추천서(자유양식)\n연구 보조원 | 대학원 재학생 (석사 과정) | 공통서류 ①,②,③,④\n산학협력단과 근로계약을 체결하여 연구과제에 참여 중인 졸업생(학사 학위 이상의 소지자) | 공통서류 ①,②,③,④ 외 ⑤학사학위증명서⑥산학협력단 근로계약서 사본⑦과제 책임교수 추천서(자유양식)\n\n1) 유의사항: 2026학년도 2학기 기준 휴학생, 제적생은 신청 불가\n2) 공통서류(첨부파일 활용)\n①연구원·연구보조원 등록 신청서\n②개인정보 서약서·동의서 및 지도교수 확인서\n③특수관계 확인서\n④특수관계인 공개신고서(특수관계인이 없다면 생략)\n\n나. 임용기간: 2026학년도 2학기(2026.9.1.~ 2027.2.28.)\n단, 졸업생으로서 산학협력단과 근로계약을 체결한 신청자의 경우, 학기 중에 과제가 종료된다면 과제종료일까지를 임용기간으로 함.\n다. 신청방법: 전자우편(yier@yonsei.ac.kr)으로 2026.7.6.(월)~2026.9.4.(금)까지 신청\n\n라. 비고\n1) 임용신청 후 부적격자의 경우 임용이 취소될 수 있음\n2) 공식 신청기간 내에 신청하지 못할 경우 재직증명서 발급 절대 불가능\n3) 신규 등록자의 경우 임용일 이전에 연구관리시스템에 최초 로그인 이력 필요\n4) 재직증명서는 2026.9.16.(수)부터 발급 가능",
   "bodyKind": "text",
   "attName": "26-2 연구원·연구보조원 임용 서류.zip"
  },
  {
   "no": "615",
   "title": "기계공학과 2026 여름학기 해외집중강의 시리즈(2차) 수강생 모집(~7/12(일)까지)",
   "date": "2026.07.07",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=474632&article.offset=0&articleLimit=10",
   "att": true,
   "body": "기계공학부 구성원 여러분들의 많은 관심과 참여 바랍니다.\n\n*상세 내용 및 강의계획서는 첨부파일 확인 요망\n(신청 링크 바로가기: https://docs.google.com/forms/d/e/1FAIpQLSdGHeD1JDgCgvmpXusNhTDjDEqT99Shh2pFsUX6w5gy5JSvkQ/viewform?usp=dialog)",
   "bodyKind": "text",
   "attName": "mechanics_meets_genomics_syllabus.pdf"
  },
  {
   "no": "614",
   "title": "2026학년도 2학기 대학원 휴학·복학 신청 및 학적 관련 안내",
   "date": "2026.07.02",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=474359&article.offset=0&articleLimit=10",
   "att": true,
   "body": "2026-2학기 대학원 휴학·복학 신청 및 학적과 관련하여 다음과 같이 안내드립니다.\n\n가. 신청 및 승인 기간\n\n구분 | 학생 신청기간 | 학과 승인기간 | 신청 및 승인 절차\n휴학 | 미등록자 | 8. 1.(토) 00:00 ~ 9. 14.(월) 23:59 | 신청기간 동안 수시 승인 | 학생신청(학사정보시스템)학과승인대학원승인\n등록자 | 8. 1.(토) 00:00 ~ 11. 13.(금) 23:59*질병, 육아사유는 12. 1.(화)까지 신청 가능\n복학 | 1차 | 7. 13.(월) 00:00 ~ 8. 9.(일) 23:59 | 8. 10.(월)까지 수시 승인 | 일부 경우를 제외하고, 복학 신청은 별도 절차 없이 자동으로 승인 (붙임 1 참고)\n2차 | 8. 10.(월) 00:00 ~ 8. 24.(월) 23:59 | 8. 25.(화)까지 수시 승인\n3차 | 8. 26.(화) 00:00 ~ 9. 2.(수) 23:59 | 9. 3.(목)까지 수시 승인\n\n* (중요)외국인 학생 비자 발급을 위한 표준입학허가서는 1차 및 2차 복학 신청 기간 내에 복학 신청을 해야 발급 가능",
   "bodyKind": "text",
   "attName": "붙임 1. 2026-2 휴학 복학 신청 및 학적 관련 안내(Guidance on Leave of Absence, Reinstatement and other Academic Records)(외5).zip"
  },
  {
   "no": "613",
   "title": "기계공학부「홈페이지 구축 경진대회」안내",
   "date": "2026.06.23",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=473813&article.offset=0&articleLimit=10",
   "att": true,
   "body": "여러분이 직접 만든 홈페이지가 우리 학부의 공식 홈페이지가 됩니다.\n\n기계공학부가 학생 주도의 「홈페이지 구축 경진대회」를 개최합니다. 단순한 공모전이 아니라, 우수 작품은 실제 학부 공식 홈페이지(리뉴얼)의 기반으로채택·발전됩니다. 직접 만든 웹사이트를 실제 서비스로 구현하고, 포트폴리오로도남길 수 있는 기회입니다.\n\n■ 시상(총 6팀 · 290만원)\n- 1등 100만원/ 2등 각 50만원(2팀)/ 3등 각 30만원(3팀)\n\n■ 참가 대상\n- 기계공학부 학부생·대학원생 누구나 (팀당 1~4명)\n\n■ 주요 일정(상황에 따라 변동될 수 있음)\n- 신청 마감: 2026. 7. 3.(금)\n- 제작 기간: 7. 7.(화) ~ 7. 31.(금)\n- 심사·시상: 8월 첫째~둘째 주\n\n생성형AI 도구 활용이 허용되므로, 코딩이 익숙하지 않더라도 아이디어와 기획력이 있다면충분히 도전할 수 있습니다.\n\n■ 신청 방법\n- 첨부된 참가 신청서를 작성하여 민경민 교수(kmin.min@yonsei.ac.kr)에게 이메일로 제출 (팀명·팀원 정보·기획 의도 기재)\n\n자세한 공모 요건과 심사 기준은 첨부 안내문을 확인해 주세요. 여러분의 많은 도전을 기다립니다.",
   "bodyKind": "text",
   "attName": "기계공학부_홈페이지_경진대회_안내문_참가신청서_Final.pdf, 기계공학부_홈페이지_경진대회_안내문_참가신청서_Final.docx"
  },
  {
   "no": "612",
   "title": "2026학년도 8월 졸업예정자 학위논문 제출 및 인준 관련 안내",
   "date": "2026.06.19",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=473603&article.offset=0&articleLimit=10",
   "att": true,
   "body": "2026학년도 8월 졸업예정자의 학위논문 제출 및 인준 관련 사항을 안내드립니다.\n\n가. 학위논문 작성지침\n학위논문은 연세대학교 출판부 발행 「새논문작성법」및 「대학원 학위논문에 관한 내규」에 따라 양식, 규격, 체재 등의 오류가 없도록 유의하여 작성\n※ 대학원 홈페이지 참고(바로가기 클릭)\n\n나. 학위논문 제출\n온라인 논문(PDF)파일 제출(책자 논문 제출 전면 폐지)\n1) 제출기간: 2026.7.2.(목) 09:00 ~ 7.10.(금) 16:00(기간 중 24시간 상시 가능)\n2) 제출대상: 2026년 8월 졸업예정자(학과졸업요건 미충족으로 졸업 불가한 학생은 미해당)\n3) 제출방법: 도서관 학위논문 제출 시스템 (바로가기 클릭) 접속 및 제출\n4) 제출서류(아래 (1),(2) 2가지 서류 모두 준비 및 온라인 제출)\n가) 논문전체파일 PDF 1부\n나) 원본 인준서 스캔파일 PDF 1부\n※ 논문전체파일에 포함된 인준서 페이지는 심사위원의 \"성명\"만 기재\n※ 심사위원의 서명이 완료된 인준서 스캔본은 별도 제출(스캔파일: 도서관 온라인 제출, 원본: 학위논문 제출확인서와 함께 학과 직접 제출)\n5) 유의사항\n가) 논문제출자 필독 사항: 붙임의 '온라인 학위논문 제출안내 및 FAQ' 필수 숙지\n나) 온라인 제출 완료 후 논문 수정이 필요한 경우\n(1) 제출기간 내\n(가) 제출 건 승인되기 전('논문제출 접수완료' 상태): PDF파일, 메타데이터 자유롭게 수정가능\n(나) 제출 건 반송되었을 때('반송' 상태): 수정 진행 후 재제출\n(다) 제출 건 승인된 이후('논문제출 처리완료' 상태): 재제출요청 및 제출처에서 반송 이후 수정본 재제출\n※ 제출 건 승인된 이후 메타데이터 수정은 도서관 구글폼으로 요청(도서관 홈페이지 공지사항 내 링크 참고)\n(2) 제출기간 이후: 명백한 오탈자, 편집상 오류에 한하여 교체(도서관 디지털미디어서비스팀에 공문으로 요청. 학위수여식 전날(2026.8.27.)까지 공문 도착 필수, 제출자가 수정한 논문 파일 공문 첨부 및 공문 내 수정사항 기재)\n※ 학위수여식 이후 교체 불가함을 유의\n다) 기타 유의사항: 도서관 홈페이지 공지사항 필독(바로가기 클릭)\n6) 제출 문의(도서관): 02-2123-4643~4, thesis@yonsei.ac.kr\n\n다. 학위논문 인준\n1) 학위논문 인준 지침: 대면(서면) 인준 원칙\n\n방법 | 내용\n대면(서면) 인준※ 원칙 | 인준서에 직접 서명을 원칙으로 하나 도장 날인도 허용\n학사정보시스템(온라인) 인준※ 선택 | 1. (학생/심사위원)학사포털 인준 (신청)기간: 2026.7.2.(목) ~ 7.10.(금) 2. 신청요건: 도서관에 온라인 논문 제출 이후 학사정보시스템 논문정보와 도서관 제출 정보가 일치한 경우에만 학사정보시스템 인준신청 가능3. 인준절차 (학생) 도서관 온라인 논문 제출 후 학사정보시스템 논문정 보 검증 → (학생) 학사정보시스템 인준 신청 → (심 사위원) 학사정보시스템 인준 체크 → (학생) 학사정 보시스템 인준서 출력하여 도서관과 학과 제출 ※ 학사정보시스템 인준 이후, 도서관에서 온라인 논문 교체를 허용한 경우 1회에 한 해 학사정보시스템 재인준 가능하며, 재인준 시 기존 내역은 초기화 및 재인준 일시로 최종 인준 일 적용됨\n비대면(이메일) 인준※ 선택 | 심사위원이 직접 서명한 서명 스캔본과 인준 사실을 심사위원장에게 메일로 제출 → 심사위원장 붙임의 '학위논문 인준사실 확인서' 학과 제출\n※ 심사위원이 해외체류 등 불가피한 사유가 있는 경우 학사정보시스템(온라인), 비대면(이메일) 인준 허용\n2) 인준서 양식: 대학원 홈페이지 각종 양식 내 논문양식 참고자료 활용(클릭)\n3) 인준 방법 및 절차\n\n※ 한 가지 인준방식이 아닌, 여러 인준방식이 혼합될 경우 원본 확보를 위해 아래 우선 순위에 따라 인준을 시행하되 최종본은 1장으로 구성\n※ 우선 순위: 학사정보시스템 → 비대면 → 대면\n예시1) 비대면과 대면 인준 혼합 시, 비대면 인준 우선 시행 후 해당 스캔 출력본에 최종 대면 인준\n예시2) 학사정보시스템과 대면 인준 혼합 시, 학사정보시스템 인준 우선 시행 후 해당 인준서 출력본에 최종 대면 인준\n4) 2026학년도 8월 졸업예정자 제출서 및 인준서 일정 표기 관련 안내\n가) 학위논문 제목 및 심사위원장이 표기된 인준서 양식인 경우, 구양식과 신양식 모두 제출 가능\n나) 제출서 및 인준서의 표기 날짜는 2026년 8월로 기재하여 제출해야 함(2026년 8월로 기재되지 않은 경우 학위논문 접수 불가 및 재인준 필수)\n\n붙임 1. 2026학년도 1학기 학위논문제출 안내 1부.\n2. 온라인 학위논문 제출안내 및 FAQ(한글) 1부.\n3. 온라인 학위논문 제출안내 및 FAQ(영문) 1부.\n4. 학위논문 인준절차 및 관련 자료 압축파일 1부. 끝.",
   "bodyKind": "text",
   "attName": "붙임1. 2026학년도 1학기 학위논문제출 안내.hwp, 붙임2. 온라인 학위논문 제출안내 및 FAQ.pdf, 붙임3. Dissertation and Thesis Submission Guidelines & FAQ.pdf, 붙임4. 학위논문 인준절차 및 관련 자료.zip"
  },
  {
   "no": "611",
   "title": "2026학년도 1학기 대학원 학사 지도 체계화를 위한 APR 계획서 작성 마감일 안내",
   "date": "2026.06.16",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=473347&article.offset=0&articleLimit=10",
   "att": true,
   "body": "2026학년도 1학기 대학원 학사 지도 체계화를 위한 APR 계획서 작성 마감일 안내\n\n가. APR 시스템은 대학원생의 학업 및 연구 전반을 체계적으로 관리하기 위한 시스템으로, 기한 내 계획서 작성바랍니다.\n나. 학생 계획서 작성 기간: ~ 2026. 7. 3.(금)\n다. 지도교수 피드백 확인 가능 기간: ~ 2026. 7. 24.(금)\n라. 유의사항\n- 최종 제출 완료 후에는 제출 내역이 확정되므로, 작성 전 반드시 확인 바랍니다.\n- 지도교수님의 피드백 결과가 ‘보완필요’인 경우, 학생의 수정제출 가능합니다.",
   "bodyKind": "text",
   "attName": "붙임2. APR 사용 매뉴얼(학생용).pdf"
  },
  {
   "no": "610",
   "title": "기계공학과 2026 여름학기 해외집중강의 시리즈 수강생 모집 안내",
   "date": "2026.06.11",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=473052&article.offset=0&articleLimit=10",
   "att": true,
   "body": "기계공학부에서 아래와 같이 해외집중강의 시리즈를 진행하오니 많은 관심과 참석 부탁드립니다.\n\n※신청 링크 바로가기: https://forms.gle/K3T7oDmsZggtmkqg7",
   "bodyKind": "text",
   "attName": "RLAI_Yonsei_Syllabus.pdf"
  },
  {
   "no": "609",
   "title": "2026학년도 2학기 학위과정 변경 신청 안내",
   "date": "2026.06.09",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=472801&article.offset=0&articleLimit=10",
   "att": true,
   "body": "2026학년도 2학기 학위과정 변경을 다음과 같이 안내드립니다.\n\n1. 일정\n\n구 분 | 일 정 | 비 고\n학생 신청 기간 | 석사→ 통합 | 2026학년도 1학기 성적 등재 ~2026. 7. 12.(일) 23:59 | 붙임 2 참고, 학사정보시스템을 통해서 신청\n통합→ 석사 | 2026. 6. 15.(월) 09:00 ~2026. 7. 12.(일) 23:59\n승인자 확인 | 2026. 7. 24.(금) 예정 | 학사정보시스템을 통해 결과 확인\n\n2. 신청 자격요건: 붙임 1의 제3조(학위과정 변경절차 및 신청자격) 참조\n\n1) 석사학위과정에서 통합과정으로 변경\n가) 석사학위과정 2학기부터 3학기까지 재학 중 대학원이 지정한 기간에 신청 가능함(4학기 진입 시 신청 불가)\n나) 석사학위과정 2학기 재학 중 신청한 경우는 18학점 이상, 석사학위과정 3학기 재학 중 신청한 경우는 27학점 이상을 취득해야 하며,\n학업성적이 평량평균 3.3/4.3 이상이어야 함\n2) 통합과정 중단\n가) 통합과정 3학기부터 7학기까지 재학 중 대학원이 지정한 기간에 신청 가능함(8학기 진입 시 신청 불가)\n\n3. 기타 유의사항\n가. 학사정보시스템에는 2026년 6월 15일부터 신청 메뉴가 활성화 되나, 통합으로의 과정 변경은 학점 요건이 있어 성적이 등재되는 시점부터 신청이 가능합니다\n(성적 등재는 성적 정정 등의 학사 일정에 따라 변동되는 경우가 많아 정확한 기간을 명시하기가 어려우며, 대략 2026년 7월 초에 등재됨.\n실제 신청 기간은 약 1주가 안되는 기간이기에 반드시 성적 등재 이후 기간 내 신청)\n나. 학연산 과정 학생의 경우, 소속 학과에 변경을 희망하는 과정이 개설되어 있는 것과 동시에 해당 과정이 학연산 협약 대상이어야 하며,\n학연산 과정으로 재직 중인 기관에서 변경에 대한 승인(또는 확인) 공문을 대학원으로 송부해야만 신청이 가능합니다.\n다. 군위탁 또는 계약학과 학생의 경우 또한 변경하고자 하는 과정이 협약 대상인 경우만 신청 가능하며, 본인 소속 부대 또는 기관으로부터 학위과정 변경에 대한 승인(또는 확인)에 대한 자료를 추가로 제출해야 합니다.\n\n붙임1. 학위과정 변경에 관한 내규\n붙임2. 과정변경(중단) 학생 신청 메뉴얼",
   "bodyKind": "text",
   "attName": "붙임1.학위과정 변경에 관한 내규.pdf, 붙임2.과정변경(중단) 학생 신청 매뉴얼.pdf"
  },
  {
   "no": "608",
   "title": "2026학년도 박사우수장학금(이공계) 및 석사우수장학금(이공계) 신규 장학생 신청 안내",
   "date": "2026.05.29",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=471936&article.offset=0&articleLimit=10",
   "att": true,
   "body": "2026학년도 박사우수장학금(이공계) 및 석사우수장학금(이공계) 신규 장학생 신청 안내\n\n2026학년도 1학기부터 한국장학재단이 주관하는 \"박사 및 석사 우수장학금(이공계)\" 사업이 시행됨에 따라, 관련 내용을 다음과 같이 안내드립니다.\n\n<박사과정>\n1. 장학 금액: 375만원/학기\n2. 지원 기간: 최대 8학기 내 정규학기까지\n3. 추천대상 (2026학년도 1학기 기준)\n- 신입유형: 자연과학/공학계열 박사 1학기과정 및 통합 5학기 과정 대한민국 국적 재학생\n- 재학유형: 자연과학/공학계열 박사(2-4학기) 및 통합 6학기 과정 대한민국 국적 재학생\n5. 제출 서류 및 접수방법 : 신청서(붙임2) 및 성적증명서(석사 지원자는 학부 및 대학원 성적 증명서/박사 지원자는 석사 및 박사 대학원 성적 증명서)\n6/4(목) 13:00까지 1공학관 N601호 직접 방문 제출, 담당:홍가인 선생님(내선 2734)\n6. 유의사항:\n- 생활비성 장학금으로 타 장학금, R&D 참여 인건비 등 정부·민간 지원과 중복수혜 가능하나 대통령과학장학금과 석사우수장학금(이공계)과는 중복 수혜 불가\n- 계약학과 제외, 협동과정 포함\n\n<석사과정>\n1. 장학 금액: 250만원/학기\n2. 지원 기간: 최대 4학기까지 정규학기 이내\n3. 대상: 계약학과 제외, 협동과정 포함\n4. 추천대상 (2026학년도 1학기 기준)\n- 자연과학/공학계열 석사 및 통합과정 1~4학기 대한민국 국적 재학생\n5. 제출 기한 및 접수처 : 붙임2 신청서 양식 작성 후 6/4(목) 13:00까지 1공학관 N601호 직접 방문 제출, 담당:홍가인 선생님(내선 2734)\n6. 유의사항:\n- 생활비성 장학금으로 타 장학금, R&D 참여 인건비 등 정부·민간 지원과 중복수혜 가능하나 대통령과학장학금과 박사우수장학금(이공계)과는 중복 수혜 불가\n\n[붙임2] 장학금 신청 양식",
   "bodyKind": "text",
   "attName": "2. 신청 양식_연세대학교 대학원.hwp"
  },
  {
   "no": "607",
   "title": "2026-1학기 학위논문 본심사 및 졸업 관련 안내",
   "date": "2026.05.20",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=471444&article.offset=0&articleLimit=10",
   "att": true,
   "body": "2026-1학기 학위논문 본심사 및 졸업 관련 안내 사항을 다음과 같이 안내드립니다.\n\n1. 본심사 안내\n\n가. 일정 : 2026. 5. 22.(금) ~ 6.19.(금) 17:00까지\n나. 본심사 시행 원칙 : 대면심사 원칙\n1) 대면-비대면 논문심사 허용 조건: 아래 사유에 해당하는 경우만 비대면 심사 허용\n\n학과 승인(혼합 : 대면+비대면) * 해당 심사위원만 비대면 심사 허용 | 대학원 승인(100% 비대면) * 심사위원 전원\n1) 심사위원이 해외 체류로 인해 대면 심사가 불가능한 경우 2) 심사위원이 불가피한 사유(질병, COVID-19 격리 등)로 인해 대면 심사가 불가능한 경우) | 1) 논문심사 대상자가 공동연구를 위해 해 외 체류가 불가피한 경우 2) 논문심사 대상자가 비자 발급 문제로 국내 입국이 불가한 경우(단, 개인적인 사정으로 단순 해외 체류는 승인 불가) 3) 심사위원(외부)의 소속기관의 소재지 또는 거주자가 국내 수도권(서울, 경기, 인천광영식) 외 지역이면서 불가피한 사유로 대면 심사가 불가능한 경우\n\n2) 비대면 심사 전 제출 서류 : 2026. 5. 22.(금) 15:00까지\n- ‘학위논문 비대면 논문심사 승인요청서(붙임1, 해당되는 양식 사용) 학과 이메일(nmh@yonsie.ac.kr)로 제출\n\n3) 비대면 심사 시행 후 제출 서류 : 2026. 6. 19.(금) 15:00까지\n- 비대면 심사위원의 심사 결과(본심 보고서에 심사 의견, 점수를 기재하고 서명한 스캔본을 심사위원에게 이메일로 제출 --> 이메일 캡쳐본 및 본심보고서 사본\n- 비대면 논문심사 증빙 (붙임1 해당되는 양식 사용): 심사위원의 이메일, 화상 심사(줌) 화면 캡쳐 등\n- 비대면 심사현황 보고서 (붙임1 해당되는 양식 사용)\n\n2. 본심사 보고서 수령 안내\n\n가. 본심사 보고서 수령 기간 : 2026. 5.26.(화)~ 5.29.(금)\n나. 학부사무실(4공학관 D301호) 직접 방문하여 수령 (대리수령 가능)\n다. 수령 후 본심사 당일 심사위원 교수님께 배부\n\n3. 학위논문 표절검사 결과 확인서 제출 : 붙임2 참조\n\n가. 제출 대상 : 2026년 8월 석·박사 학위논문 제출 예정자 제출 필수\n나. 제출 방법 : 학사포탈 로그인 & 졸업& 학생& 표절검사결과 제출 (학위논문 표절검사 결과 확인서 작성 후 학사포탈 업로드)\n다. 마감 기한 : 2026.7.3.(금)까지\n라. 유의 사항\n1) 학과규정: 표절율 수치 30% 이내\n2) 학사포탈에 업로드 시 한개의 PDF 파일로 업로드\n\n4. 학술활동 증빙자료 제출: 대학원 공지 사항 바로가기\n\n5. 학위논문 심사 대상 학생 논문 가제본 제출 : 박사(통합)만 해당\n\n가. 박사(통합) 학생은 학위논문 초안을 직접 인쇄한 후 (박사5부)\n나. 학과 도장을 근무일 기준 심사 3일전까지 받아서 (예& 월요일 심사이면 전주 수요일까지 . 4공학관 D301호 방문)\n다. 본심사 당일 심사위원에게 제출\n\n6. 학위논문 제출 안내\n\n가. 학사정보시스템과 도서관 논문제출정보(논문 제목 및 논문 작성 언어) 확인\n1) 논문 제목은 증명서에 표시되는 사항이므로 논문 제목이 변경되었을 경우, 반드시 학사정보시스템에서 변경해야 함\n2) 본심 합격자는 도서관에 논문을 온라인으로 제출 후, 학사정보시스템과 도서관에 제출된 논문 제목, 학위논문작성언어 일치 여부 검증 가능 → 정보 일치 시, 학사정보시스템에서 학위논문 인준 신청 가능\n3) 학위논문 제목 수정 가능 기간: 2026. 6. 26.(금) 23:59까지\n- 학사정보시스템에서 학생이 신청하고 학과에서 승인(필수)\n- 학사정보시스템 메뉴: 학사행정 → 졸업 → 졸업논문 → 논문제목변경신청승인\n4) 논문작성언어 정보 불일치 시 사유 기재하여 공문으로 요청\n\n나. 학위논문 완성본 제출\n1) 제출일정: 2026.7.2.(목) ~ 2026.7.10.(금)(제출기한 엄수)\n2) 제출서류 및 제출처\n\n구분 | 제출서류 | 제출처\n도서관 (온라인) | 1. 논문 전체 원문 PDF (심사위원 성함만 기재한 인준서 페이지를 포함한 논문원문제출, 심사위원 서명본 첨부 불가 유의) 2. 인준 완료된 인준서 서명 PDF (인준서 1장으로 업로드) | 도서관 온라인 학위논문 제출시스템 (참고 링크) ※ 논문 제출 시, 도서관 논문제출 공지사항 숙지\n학과 | 1. 학위논문제출확인서 (미제출시 졸업 불가) 2. 인준서 서명 원본 (인준서 원본은 1장으로 작성) | 소속학과 사무실 (4공학관 D301호) (학생이 학과 졸업사정기간까지 소속학과 사무실에 직접 제출)\n\n※ 2025학년도 1학기부터 책자논문 제출 전면 폐지, 온라인 논문만 제출\n※ 온라인 제출 완료 후, 학과에 인준서 원본 및 학위논문제출확인서 제출\n※ 인준 관련 사항은 6월 중 별도 공문 안내 예정\n\n7. 학위논문 양식 개편 안내 : 대학원 공지사항 바로가기",
   "bodyKind": "text",
   "attName": "[붙임1] 비대면심사.zip, [붙임2] 표절검사.zip"
  },
  {
   "no": "606",
   "title": "2026학년도 후기 「대학원 연세우수학생장학금 II」신청 안내",
   "date": "2026.05.16",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=471122&article.offset=0&articleLimit=10",
   "att": true,
   "body": "일반대학원에서는 2026학년도 후기 「대학원 연세우수학생장학금 II」 장학생을 선발할 예정입니다.\n\n가. 추천 대상(다음 항목 모두 충족)\n1) 현재 신분이 중앙부처 공무원(사무관급 이상) 및 이에 준하는 자\n2) 2026학년도 후기 일반대학원 박사과정(석·박사통합과정 포함) 신입생\n3) 지도교수 또는 주임교수 및 학장의 추천을 받은 자\n나. 추천 기한: 2026. 6. 4.(목) 11:00\n다. 지원 범위: 대학원 입학금 및 정규등록학기 등록금 전액\n(단, 선발된 학생은 장학금 수혜 기간 중, 매 학기 성적 3.4/4.3 이상 유지 필수)\n※ 교내·외 장학금 중복수혜 및 학자금 대출 불가\n※ 장학 기간 내, 매 학기 재직증명서 제출 필수(재직 확인 불가 시, 장학생 자격 박탈)\n라. 제출 서류\n1) 장학금 지원서 및 추천서 1부\n2) 이력서 및 연구계획서(입학 지원 시 제출서류) 각 1부\n3) 전학년 성적증명서(학부 및 석사과정) 각 1부\n4) 재직증명서(최근 3개월 이내 발급분) 1부\n마. 기타\n1) 국가고시 합격자일 경우 고시일과 합격일 기재\n2) 추천자가 다수일 경우 순위 기재\n3) 대학원생 폭력예방교육 이수 필수\n(입학 후 반드시 폭력예방교육 이수 완료 이수증 제출 확인)\n바. 비고: 심사 결과에 따라 선발하지 않을 수 있음\n\n붙임 장학금 지원서 및 추천서 1부",
   "bodyKind": "text",
   "attName": "연세우수II_지원서_및_추천서_양식 (1).hwp"
  },
  {
   "no": "605",
   "title": "[대학원] 2026-1학기 K-STAR 비자트랙 프로그램 신청 안내 (외국인 대상)",
   "date": "2026.05.14",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=470996&article.offset=0&articleLimit=10",
   "att": true,
   "body": "게시글 내용\nK-STAR 비자트랙(K-STAR 거주(F-2-7S) 체류 자격) 프로그램 신청을 아래와 같이 안내하오니,\n신청을 희망하는 학생은 기한 내에 서류를 제출하여 주시기 바랍니다.\n\n1. 신청 대상: 아래 요건을 모두 충족하는 자\n가. 연세대학교 대학원 전기전자공학과 석·박사 취득(예정)자\n나. 아래 중 하나에 해당하는 자\n- 석사 학위 취득 예정자 또는 취득 후 1년 이내인 자\n- 박사 학위과정 재학생 또는 박사학위 취득 후 1년 이내인 자\n(석·박사 통합과정생의 경우 석사과정 수준의 교육과정을 수료하고 박사과정에 해당하는 교육과정에 재학 중인 경우 인정)\n- 박사 학위 취득 후 연세대학교 ‘박사후연구원(Postdoc)’ 자격으로 과학기술분야 연구에 참여 중인 자\n\n2. 제출 서류\n- 지원서 (붙임 1 서식)\n- 추천서 2부: 지도교수 1부, 연구실 동료 1부 (붙임 2 서식)\n- 성적증명서 1부\n- 학위(취득 예정)증명서 1부(박사 재학생인 경우 재학증명서 1부로 대체 가능)\n- 지원서에 기재한 수상경력, 한국어능력시험, 교내외활동사항에 대한 증빙 서류와 연구활동 목록에 기재한 내용 관련 증빙 서류\n\n3. 서류 제출 마감: 2026년 5월 26일(화)\n\n4. 제출 방법: 학과 이메일로 해당 서류를 스캔하여 PDF 파일로 제출(모든 서류를 하나의 PDF 파일로 만들어서 제출)\n메일 제목: [K-STAR 신청] 학번_이름\n\n5. 유의사항\n- 서류 제출 마감 기한을 반드시 지켜주시기 바랍니다.\n- 모든 지원서는 한국어로 작성해야 합니다.\n- 첨부된 붙임 파일의 양식을 사용해야 하며, 서류 양식을 임의로 변경하는 것은 허가되지 않습니다.\n- 지원서에 작성된 내용과 관련하여 모든 증빙 서류를 제출해야 합니다.\n- 신청자는 필요시 추가 서류 제출을 요청받을 수 있으며, 서류 미비 시에는 심사 대상에서 제외될 수 있습니다.\n- 지원서와 증빙 서류에 허위 혹은 과장으로 기재된 내용, 사실과 다른 내용이 있거나 결격 사유가 확인되는 경우에는 추천이 취소되거나 불이익이 발생할 수 있습니다.\n- 학과 심사 후 학과 추천이 결정될 경우 제출한 PDF 파일의 원본 제출을 요청할 수 있습니다.\n- 서류심사 합격 대상자는 6월 중 면접심사를 진행합니다.(대상자에게 개별 안내 예정)\n\n6. 문의: 학과사무실(nmh@yonsei.ac.kr, 02-2123-2810)",
   "bodyKind": "text",
   "attName": "1._연세대학교_K-STAR_비자트랙_제출서류_서식(지원자용).hwp, 2._연세대학교_K-STAR_비자트랙_추천서_서식(지도교수,_동료용).hwp"
  },
  {
   "no": "604",
   "title": "2026학년도 1학기 연세대학교 K-STAT 비자트랙 안내 및 설명회 개최 안내",
   "date": "2026.05.12",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=470795&article.offset=0&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "K-STAR 비자트랙 설명회 개최 안내문.jpg"
  },
  {
   "no": "603",
   "title": "2026년 전기 전문연구요원 편입대상자 선발 공고",
   "date": "2026.05.11",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=470758&article.offset=0&articleLimit=10",
   "att": true,
   "bodyKind": "file",
   "attName": "20260511_161221.zip"
  },
  {
   "no": "602",
   "title": "[항공우주전략연구원] 2026년 연세 우주항공 주간 개최 안내",
   "date": "2026.05.08",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=470621&article.offset=0&articleLimit=10",
   "att": false,
   "bodyKind": "file"
  },
  {
   "no": "601",
   "title": "2026년 대학원 대통령과학장학금 신규장학생 선발 안내",
   "date": "2026.04.17",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=469264&article.offset=0&articleLimit=10",
   "att": false,
   "bodyKind": "file"
  },
  {
   "no": "600",
   "title": "2026 공과대학 외국인 격려행사(Global Day in College of Engineering) 안내",
   "date": "2026.04.14",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=469037&article.offset=0&articleLimit=10",
   "att": false,
   "bodyKind": "file"
  },
  {
   "no": "599",
   "title": "2026학년도 신동욱 해외연수 장학생 신청 안내",
   "date": "2026.04.10",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=468687&article.offset=0&articleLimit=10",
   "att": true,
   "body": "2026학년도 신동욱 해외연수 장학생 추천과 관련하여 안내드립니다.\n\n□ 제출방법: 2026.4.28.(화) 17:20 까지 원본서류 공과대학 행정1팀(1공학관 N601호, 담당자: 홍가인 선생님)으로 제출\n\n가. 선발대상: 박사과정 연구등록학기에 있는 재학생 중 해외 소재 대학 및 연구기관에서 1년 이상의 연구를 진행하고자 하는 자\n나. 선발인원: 1명\n다. 지원규모: 연간 1,000만원 (2026. 8월, 2027. 2월에 나누어 지급)\n라. 제출서류\n1) 지원(이력)서(붙임 2)\n2) 지도교수 추천서(붙임 3)\n3) 자기소개서(붙임 4)\n4) 연구계획서 및 해외연구기관 동의확인서(자유 양식)\n5) 대학 및 대학원 성적증명서, 석사학위논문\n6) 각종 입상실적 및 연구실적을 증명할 수 있는 증빙서류",
   "bodyKind": "text",
   "attName": "붙임1.신동욱해외연수장학생_선발요강(외3).zip"
  },
  {
   "no": "598",
   "title": "2026학년도 1학기 대학원 학사 지도 체계화를 위한 APR 시스템 활용 안내",
   "date": "2026.04.08",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=468513&article.offset=10&articleLimit=10",
   "att": true,
   "body": "대학원에서는 대학원 혁신사업의 일환으로, 입학에서 졸업까지 대학원생의 학업 전주기 학사관리 시행을 위해 학사정보스시템 내 APR시스템을 구축하여 다음과 같이 안내드립니다.\n\n1. APR이란? APR은 Annual Progress Report의 약자로 학생이 작성한 연구 및 학업 전반에 대한 리포트에 대해 지도 교수님과의 면담 및 피드백 진행을 보조하는 시스템\n\n2. 추진 목적\n가. APR을 통해 학생과 지도교수 간 학업계획 및 현황을 점검하고 필요한 연구 및 교육 경력을 체계적으로 지원\n나. 학사포탈시스템에 학생이 제출한 APR 보고서를 지도교수가 검토 후 승인, 보완요청, 코멘트하여, 학생들의 학업 전반을 지도교수가 주기적으로 확인할 수 있도록 지원\n다. 지도교수 뿐만 아니라 학생 스스로 학업 전반 현황을 수시로 확인하고, 이력을 관리할 수 있게 하여, 성공적으로 졸업할 수 있도록 지원\n\n3. APR 시스템 활용 안내\n가. APR 시스템은 대학원생의 학업 및 연구 전반을 체계적으로 관리하기 위한 시스템으로, 기한 내 계획서 작성 및 지도교수 피드백이 이루어질 수 있도록 협조하여 주시기 바랍니다.\n나. 대학원생 계획서 작성 기간: ~ 2026. 7. 3.(금)\n다. 지도교수 피드백 확인 가능 기간: ~ 2026. 7. 24.(금)\n\n4. 유의사항\n가. 최종 제출 완료 후에는 제출 내역이 확정되므로, 작성 전 반드시 확인 바랍니다.\n나. 지도교수님의 피드백 결과가 ‘보완필요’인 경우, 학생의 수정제출 가능합니다.",
   "bodyKind": "text",
   "attName": "APR 사용 매뉴얼(학생용).pdf"
  },
  {
   "no": "597",
   "title": "2026학년도 학문후속세대 국제공동연구사업 I 홍보",
   "date": "2026.04.07",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=468329&article.offset=10&articleLimit=10",
   "att": false,
   "body": "1. 사업 개요\n\n가. 사업명: 학문후속세대 국제공동연구사업 I\n나. 목적\n1) 학문후속세대 연구자에게 최신 연구동향 경험의 기회를 제공하여 국제적 연구 역량을 함양하고 국제 공동연구 네트워크 구축 지원\n2) 신진 연구자가 분석한 국내외 최신 R&D 동향 정보를 공유하여 연세 연구 활성화 및 연세 연구의 가치 제고\n다. 지원대상: 다음 각호의 조건을 모주 충족하는 연구자\n1) 연세대학교(신촌, 국제캠퍼스) 소속 박사후연구원(Post-doc), 연구교수, 박사수료생, 박사과정생으로서\n2) 2026. 4. 2.(목) ~ 12. 11. 기간 내 해외 연구기관 방문 또는 학회 참석 후\n3) 관련 최신 R&D동향 분석 보고서 제출 완료가 가능한 연구자\n라. 지원내용: 원고료 지급 (1매 당 최대 3만원(국문), 5만원(영문), 1인 최대 1백만원)\n※ 우수 보고서 선정 시 별도 포상 진행\n마. 신청제한\n1) 다른 교내·외 연구비, 각종 사업비 및 외부기관 등에서 동일 항목 중복 지원 불가\n2) 연간 1인 각 1회로 제한하며 예산 소진 시까지 지원\n3) 무단 복사, 표절 등은 실격 처리\n2. 신청방법\n가. 신청기간: 2026.4.2.(목) ~ 12.11.(금) 17:00까지\n나. 신청방법: 연구처 연구전략팀 공용메일(yresearch@yonsei.ac.kr)로 신청 서류 제출\n3. 문의처: 연구처 연구전략팀\n(담당자: 이주미, 02-2123-6435, jumi.lee@yonsei.ac.kr)\n\n자세한 사항은 사업공고 링크를 참고하시기 바랍니다.\n\n사업공고 링크 바로가기",
   "bodyKind": "text"
  },
  {
   "no": "596",
   "title": "일반대학원 학위논문 양식 개편 안내",
   "date": "2026.03.30",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=467645&article.offset=10&articleLimit=10",
   "att": true,
   "body": "일반대학원 학위논문 양식이 개편됨에 따라 개편사항을 다음과 같이 안내드립니다.\n\n■ 주요 개편사항\n\n가. 석,박사 학위논문 국문 양식\n\n구분 | 기존 | 개편\n제출서 및 인준서 제출월 표기 | 12월~1월(2월 졸업), 6월~7월(8월 졸업) | 2월(2월 졸업), 8월(8월 졸업)\n제목 번호 표기 예시 | 2. / 2.1. / 2.1.1. | 2. / 2.1 / 2.1.1 (마지막 마침표 삭제)\n영문요약 페이지 제목 예시 | ABSTRACT (전체 대문자) | Abstract (대소문자 혼용 표기)\n영문요약 페이지 키워드 표기 | Key words (띄어쓰기) | Keywords (붙여쓰기)\n\n나. 석,박사 학위논문 영문 양식\n\n구분 | 기존 | 개편\n심사위원 성함 표기법 | Hong, Gildong (성, 이름 고정) | Hong, Gildong / Gildong, Hong 등 표기 방식 자유 (단, 영문 양식에 한함)\nTitle Page | ① Advisor | ① Advisor :(: 추가)\n② …Committee on Graduate School… | ② …Committee of the Graduate School…\n③ December~January(2월 졸업), June~July(8월 졸업) | ③ February(2월 졸업), August(8월 졸업)\nSignature Page | ① 심사위원 성함만 표기 | ① 심사위원 성함 외 직함 표기 희망 시 Prof. 또는 Dr.로 통일하여 기재 (Prof. & Dr. 혼용 불가 / Prof. 및 Dr. 외 표현 불가) ※ 학사정보시스템 활용한 비대면 인준은 기존과 동일 (심사위원 성함만 표기)\n② December~January(2월 졸업), June~July(8월 졸업) | ② February(2월 졸업), August(8월 졸업)\n③ This Certifies that the [Dissertation / Master's Thesis] … is Approved | ③ This certifies that the [dissertation / master's thesis] … is approved. (대소문자 변경 및 마침표 추가)\nTable of Contents | ① 모두 대문자 표기 (LIST OF FIGURES, LIST OF TABLES, …) | ① 대소문자 혼용 표기 (List of Figures, List of Tables, …)\n② ABSTRACT IN ENGLISH | ② Abstract (대소문자 혼용 표기 및 in English 삭제)\n③ 2. / 2.1. / 2.1.1. | ③ 2. / 2.1 / 2.1.1 (제목 번호 표기 예시 변경)\n④ Key words(띄어쓰기) | ④ Keywords(붙여쓰기)",
   "bodyKind": "text",
   "attName": "석사학위 논문양식_2026.zip, 박사학위 논문양식_2026.zip"
  },
  {
   "no": "595",
   "title": "2026학년도 1학기 가계 곤란 장학금(Need-based Fellowship) 시행 안내",
   "date": "2026.03.26",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=467339&article.offset=10&articleLimit=10",
   "att": true,
   "body": "2026학년도 1학기 가계 곤란 장학금(Need-based Fellowship)을 시행하오니 소속 학생들에게 안내해 주시기 바랍니다.\n\n1. 장학금 개요\n가. 장학금명: 가계 곤란 장학금(Need-based Fellowship)\n나. 대상자: 내국인 재학생 중 기초생활수급자\n* 의과대학/치과대학/간호대학/계약학과/전문연구요원/휴학생 제외\n다. 지원내역: 1인당 3백만 원\n* 해당 장학금은 Fellowship 장학금으로 기타 장학금과 별도로 지원\n* 단과대학 주관 가계곤란장학금은 미선발\n라. 지원기간: 해당 학기(1개 학기)\n\n2. 장학금 신청 절차 및 선발 기준\n가. 신청 절차: 학생 본인이 제출 서류 첨부하여 대학원 이메일(cye@yonsei.ac.kr)로 신청\n나. 제출 서류\n1) 장학금 신청서 1부\n2) 기초생활수급자 인터넷 증명서 원본 1부(2026년도 3월 이후 인터넷 발급분(정부24이용))\n3) 가족관계증명서 원본 1부(본인이 수급자가 아닌 경우)\n* 수급자 증명서 명의가 본인이 아닌 직계존속 명의일 경우, 가족관계증명서 1부 추가 제출\n* 제출 서류에 주민등록번호가 있는 경우, 뒷자리는 ***로 발급받거나, 반드시 뒷자리를 지우고 제출\n다. 선발 기준\n1) 대상자 조건(기초생활수급자 등) 및 서류 진위 여부 검토 후 선발\n2) 선발 가능 인원 초과시 대학원 심사를 거쳐 최종 선발\n\n3. 선발 일정\n\n구분 | 2026학년도 1학기\n장학금 신청 안내(대학원 → 학생) * 대학원 홈페이지 및 대량 메일 발송 | 2026. 3월 말\n장학금 신청 접수(학생 → 대학원) | 2026. 3월 말 ~ 4월 초\n장학생 선발 | 2026. 4월 중\n선발 결과 안내(대학원 → 학생) * 선발자 개별 이메일 개별 안내 | 2026. 4월 말\n장학금 지급 | 2026. 5월 초",
   "bodyKind": "text",
   "attName": "가계곤란장학금(Need-based Fellowship) 신청서.hwpx"
  },
  {
   "no": "594",
   "title": "[재단법인 이재운장학회] 2026학년도 장학생 추천 요청",
   "date": "2026.03.24",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=467173&article.offset=10&articleLimit=10",
   "att": true,
   "body": "2026학년도 재단법인 이재운장학회 장학생 추천을 다음과 같이 의뢰드리니, 기한 내 제출하여 주시기 바랍니다.\n\n가. 추천대상: 이공계 대학원생으로 직전학기 성적이 4.0/4.5 이상인 재학생\n나. 추천 및 제출 기한: 2026. 3. 27.(금)까지 17시까지\n공과대학 행정1팀(제1공학관 N601호, 내선 2734) 장학 담당자(홍가인)에게 원본 서류 직접 제출\n다. 장학금액: 1인당 2백만원(학술연구비)\n라. 제출서류(각 1부씩)\n1) 학술연구비 지원 신청서(재단 양식)\n2) 자기소개서(재단 양식)\n3) 대학장 추천서(자유양식, 공과대학 이충용 학장님의 직인 필요)\n4) 성적증명서\n5) 학술연구비 지원 연구과제 수행계획서(재단양식)\n6) 주민등록등본\n\n붙임 재단법인 이재운장학회 제출 서류 양식 1부.",
   "bodyKind": "text",
   "attName": "재단법인 이재운장학회 제출서류.pdf"
  },
  {
   "no": "593",
   "title": "2026년 8월 졸업예정자 학술활동 증빙자료 제출 안내",
   "date": "2026.03.23",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=467146&article.offset=10&articleLimit=10",
   "att": true,
   "body": "2026년 8월 대학원 졸업예정자의 학술활동 증빙자료 제출 관련하여 다음과 같이 안내드립니다.\n\n1. 제출기한: 2026. 6. 8.(월) ~ 6. 9.(화) 17:00 (마감일까지 미제출 시 졸업불가)\n\n2. 제출자료\n\n가. 졸업요건 증빙 자료: 학과사무실(4공학관 D301호)로 직접 제출\n1) (붙임1)(붙임2) : 졸업요건 증빙서류 양식\n2) 실적 증빙 (붙임1 학술실적 통계에 기재한 숫자의 모든 증빙)\n- 논문, 학술대회, 특허 관련 증빙 (논문 첫 쪽 , 학술대회 포스터, 특허증 등 순서대로)\n3) 수행보고서 (붙임3): 2021년 3월 이후 입학생만 제출\n4) 제출된 저널(학술지) SCI(E) 등재 여부 증빙 (붙임4): 검색싸이트(JCR 등)에서 확인 후 인터넷 화면 캡쳐, SCI(E) 저널 등재 학생만 제출\n- 2) 실적 증빙과 별도로 제출해야합니다.\n\n나. 졸업예정자 명단 (붙임5) : 전자우편(nmh@yonsei.ac.kr)으로 제출\n\n3. 유의사항\n\n가. 기한내 미제출시 본심사 응시 및 2026년 8월 졸업 불가\n나. Accept 경우에는 acceptance letter 첨부 요망\n다. 투고 중인 논문의 편수는 괄호로 표시하고 투고 증명 서류 제출 요망\n라. 증빙이 없는 실적은 통계에 기재하지 마십시오.",
   "bodyKind": "text",
   "attName": "(학생공지) 26년 8월 졸업예정자 학술업적.zip"
  },
  {
   "no": "592",
   "title": "2026-1학기 대학원혁신 우수논문상 신청 안내",
   "date": "2026.03.23",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=467137&article.offset=10&articleLimit=10",
   "att": true,
   "body": "2026-1학기 연세대학교 대학원혁신 우수논문상 신청 안내\n\n1. 응모 자격\n가. 학술논문 – 2026-1학기 일반대학원 재학생\n나. 학위논문 - 일반대학원 졸업생(2025년 8월 및 2026년 2월 졸업에 한함)\n\n2. 심사 대상\n\n가. 학술논문(재학생 대상) : 최근 1년 이내에 발표된 논문(2025.3.1. ~ 2026.2.28.)\n※ 홈페이지 캡쳐 등 해당 논문의 게재 연월일 증빙을 추가로 제출 요망\n※ 2026.3.1. 이후 게재 논문 지원 불가 (2025.3.1. 이후 발표된 논문은 2026-2학기에 지원 바랍니다)\n※ 온라인 게재일도 승인(단, 심사 중이거나 게재예정일 경우 지원 불가)\n※ 현재 재학중인 학위과정 내 해당 논문을 게재한 경우에만 해당\n※ 연세대학교 대학원혁신 우수논문 수상 경력이 있는 학생의 동일 논문 지원 불가 (학술논문으로 수상 후, 동일 논문을 학위논문으로 지원 불가)\n※ 지원학생이 단독1저자로 참여한 논문\n\n■ 단독1저자란, 논문에서 ‘제1저자(주저자, 1st Author)가 2인 이상이 아닌 단독 1인임을 의미 ※ 제1저자를 제외한 공동저자(제2저자, 제3저자 등) 혹은 교신저자가 포함되면 안된다는 의미가 아님 - 논문에서 저자가 지원 학생 1명이어야 한다 (X) - 논문에서 제1저자(주저자, 1st Author) 외 공동저자(제2저자, 제3저자 등)와 교신저자가 포함되어도 되지만, 제1저자(주저자, 1st Author)는 지원 학생 1명이어야 한다 (O)\n\n※ 신청 학생은 제출 논문에 기재된 소속이 연세대학교인 경우에 한하여 신청가능\n※ CS 분야의 경우, 한국연구재단에서 인정하는 우수 국제학술대회 목록 내 IF 4 이상의 논문도 인정 가능 (해당 논문에 대한 소명자료를 증빙 서류로 제출 필요)\n\n나. 학위논문(졸업생 대상) : 2025년 8월 및 2026년 2월 졸업 시 제출한 학위논문\n※ 학생의 전공분야와 관련되는 학술논문에 한함\n※ 심사대상 요건에 부합하지 않은 논문 추천 시 최종 승인이 거절될 수 있으니 반드시 위의 심사 대상 해당 여부를 확인하시어 추천 요망\n※ 연세대학교 대학원혁신 우수논문 수상 경력이 있는 학생의 동일 논문 지원 불가 (학위논문으로 수상 후, 동일 논문을 학위논문으로 지원 불가)\n\n3. 선정부문: ① 단과대학 최우수논문상 ② 학과 우수논문상 ③ 장려상\n\n4. 선정방법: 학과 및 단과대학 심사위원회에서 심의 선정\n\n5. 수상자 선정 : 2026년 6월말 ~ 7월 중순에 최종 선정\n\n6. 시상: 2026년 8월 초\n▶ 단과대 최우수논문상 및 학과 우수논문상 - 상장 및 상금 수여, 학사포탈 등재\n▶ 장려상 – 상장 수여\n\n7. 접수기간 및 방법: 2026년 4월 3일(금) 15:00까지 학과 담당자 이메일 제출(nmh@yonsei.ac.kr)\n\n8. 신청서류\n\n아래의 가~다 3개 서류를 <작성가이드> 참고하여 2개의 PDF 파일과 1개의 엑셀파일로 이메일 제출.\n가. [붙임1] 대학원혁신 우수논문 지원서식 --> PDF 1부 (파일명 예: 학과평가서_2022313999_김연세.pdf)\n나. 논문 (1)~(4) --> PDF 1부 (파일명 예: 논문_2022313999_김연세.pdf)\n다. [붙임2] 학과신청양식--> 엑셀파일 1부 (파일명 예: 김연세.xlsx)\n\n<작성가이드>\n가.[붙임1] 대학원혁신 우수논문 지원서식\nI. 우수논문 학과자체평가(개요) |\n(학위논문) II-a 및 II-c 우수논문 추천 심사보고서 *우수논문상,장려상 둘 다 작성 | - '평가' 및 '평가총평'은 지도교수가 작성. - 위원장: '홍종섭' 기재(단,지도교수가 홍종섭 교수님인 경우 '송순호' 기재), 직인 생략\n(학술논문) II-b 및 II-d 우수논문 추천 심사보고서 *우수논문상,장려상 둘 다 작성 | - '평가' 및 '평가총평'은 지도교수가 작성. - 위원장: '홍종섭' 기재(단,지도교수가 홍종섭 교수님인 경우 '송순호' 기재), 직인 생략\nIII. 우수논문 지도교수 추천서 | - 지도교수 평가 내용 작성 및 지도교수 서명\nIV. 피추천자 연구 업적 내용 | - 업적에 심사받을 논문은 제외하고 기재\nV. 피추천자 연구 업적 통계 |\n\n--> 위 I~V 서류를 순서대로 병합하여 1개의 PDF 파일로 제출\n*파일명 예: 학과평가서_2022313999_김연세.pdf\n나. 논문\n1) 논문표절 검사 결과지: 카피킬러(CopyKiller) 등의 표절검사 프로그램을 통한 논문표절 검사 후 기본보기 및 요약보기 전체본\n※ 표절률 10% 초과 소명서 및 증빙 제출 (붙임1 서식Ⅵ)\n※ 표절검사 설정\n① 인용/출처 포함 문장(포함), ② 법령/경전 포함 문장(제외), ③ 목차/참고문헌(제외) ④ GPT 킬러(포함)\n※ 논문표절 문제의 심각성이 부각되어 논문표절 검사 결과지에 대한 추가 안내는 다음과 같으며 참고하시기 바랍니다.\n- 표절률은 10% 이하를 원칙으로 하며, 10%를 초과할 경우 1) 소명서와 2) 소명 증빙 서류를 함께 제출해 주시기 바랍니다.\n- 제출한 소명서 및 증빙 서류로 소명이 부족할 경우, 해당 사업에 선정되지 않을 수 있습니다.\n※ 검사 시 심사대상인 해당 논문만 제외하여 검사를 진행\n※ 재학생의 경우, 논문표절 검사 결과지 내 학번을 일치하게 해주시고 일치하지 않는다면 해당 사유에 대해 간략히 작성하여 제출해주시기 바랍니다.\n※ 졸업생의 경우, 학술정보원 연구지원 프로그램 서비스 이용은 불가하며 학위논문 제출 시 제출하였던 검사 결과지로 대체가 가능합니다.\n2) 논문요약 1부 (A4 1페이지 분량): 지정된 서식 없음\n3) 논문 1부\n4) 홈페이지 캡쳐 등 해당 논문의 게재 연월일 증빙 1부\n--> 위 (1)~(4)번 서류를 순서대로 병합하여 1개의 PDF 파일로 제출\n*파일명 예: 논문_2022313999_김연세.pdf\n\n다. (붙임2) 학과신청양식\n국문, 영문 제목을 정확히 기재하여야 심사에 불이익 없음\n--> 1개의 엑셀파일로 제출\n*파일명 예: 김연세.xlsx",
   "bodyKind": "text",
   "attName": "(학생공지) 261 우수논문.zip"
  },
  {
   "no": "591",
   "title": "2026-1학기 대학원 학위논문 심사지침 안내 (대면심사 원칙)",
   "date": "2026.03.20",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=466999&article.offset=10&articleLimit=10",
   "att": true,
   "body": "1. 대학원 학위수여를 위한 학위논문 심사는 대면심사가 원칙이나, 학위논문의 질적 향상과 심사의 수월성 제고를 위해 학위논문 지침을 다음과 같이 안내합니다.\n\n가. 대면심사 원칙\n나. 대면-비대면 논문심사 허용 조건: 아래 사유에 해당하는 경우만 비대면 심사 허용\n\n학과 승인(혼합 : 대면+비대면) * 해당 심사위원만 비대면 심사 허용 | 대학원 승인(100% 비대면) * 1), 2) : 100% 비대면 허용 3) : 해당 심사위원(외부)만 비대면 허용\n1) 심사위원이 해외 체류로 인해 대면 심사가 불가능한 경우 2) 심사위원이 불가피한 사유(질병, COVID-19 격리 등)로 인해 대면 심사가 불가능한 경우) | 1) 논문심사 대상자가 공동연구를 위해 해외 체류가 불가피한 경우 2) 논문심사 대상자가 비자 발급 문제로 국내 입국이 불가한 경우(단, 개인적인 사정으로 단순 해외 체류는 승인 불가) 3) 심사위원(외부)의 소속기관의 소재지 또는 거주자가 국내 수도권(서울, 경기, 인천광영식) 외 지역이면서 불가피한 사유로 대면 심사가 불가능한 경우\n\n다. 비대면 심사 전 제출 서류 안내\n1) 예비심사: 2026. 3. 24.(화) 15:00까지\n2) 본 심 사 : 2026. 5. 22.(금) 15:00까지\n- ‘학위논문 비대면 논문심사 승인요청서(붙임1 또는 붙임2, 해당되는 양식 사용) 학과 이메일(nmh@yonsie.ac.kr)로 제출\n\n라. 비대면 심사 시행 후 제출 서류 안내\n1) 예비심사: 2026. 4. 24.(금) 15:00까지\n2) 본 심 사 : 2026. 6. 19.(금) 15:00까지\n- 비대면 심사위원의 심사 의견(합격, 불합격)을 이메일에 명시하여 심사위원장에게 발송된 이메일 사본\n- 비대면 논문심사 증빙 (붙임3): 심사위원의 이메일, 화상 심사(줌) 화면 캡쳐 등\n- 비대면 심사현황 보고서(붙임4)",
   "bodyKind": "text",
   "attName": "(학생공지) 261 논문심사.zip"
  },
  {
   "no": "590",
   "title": "일반대학원] 2026-1학기 수강철회 안내",
   "date": "2026.03.13",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=466348&article.offset=10&articleLimit=10",
   "att": false,
   "body": "1. 2026학년도 1학기 일반대학원 수강철회를 안내드립니다.\n\n2. 주요사항\n가. 신청: 학생이 직접 연세포털서비스에서 학사정보시스템을 통한 온라인 신청\n나. 기간: 2026. 3. 17.(화) 10:00 ~ 3. 19.(목) 23:59\n다. 유의\n1) 수강철회 일정이 기존과 다르게 개강 후 3주차로 변경됨\n2) 대학∙학과에서는 일반대학원 소속 학생들에게 수강철회 일정을 정확히 안내 요망\n\n3. 세부사항\n가. 대상: 2026학년도 1학기 교과목 수강철회를 희망하는 일반대학원 학생\n나. 방법: 연세포털서비스에서 학생이 직접 온라인으로 철회 신청 (학사정보시스템 → 학사행정 → 수업 → 수강철회신청)\n다. 수강철회 시 유의사항\n1) 수강과목 철회 후 다른 과목으로 대체 수강신청 할 수 없으며, 철회 후 수강신청 과목이 최소 1과목 이상 남아 있어야 함\n2) 철회한 과목은 성적평가 및 취득학점에서 제외되며, 성적증명서에 ＂W＂(Withdraw) 기재됨\n3) 철회한 교과목을 재수강하더라도 기록은 삭제되지 않음\n4) 수강을 철회한 교과목에 대한 등록금은 반환되지 않음\n5) 학부보충과목의 수강철회도 일반대학원 수강철회 기간 중에만 가능\n\n4. 행정 안내사항\n가. 학생 수강철회 시 해당 교과목 담당교수 확인(결재) 절차 생략\n나. 수강철회 종료 후 잔여 수강인원이 폐강 기준(3명 미만)에 해당하는 경우\n1) 잔여 수강인원 1 ~ 2명: 교과목 개설 유지\n2) 잔여 수강인원 0명: 폐강(담당교수 강의시간, 강의료는 실제 수업 진행 주차까지만 인정).",
   "bodyKind": "text"
  },
  {
   "no": "589",
   "title": "2026-1학기 재학생 외국어 성적 제출 안내",
   "date": "2026.03.13",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=466340&article.offset=10&articleLimit=10",
   "att": true,
   "body": "대학원 재학생 외국어 성적 제출 관련하여 다음과 같이 안내드리오니 확인부탁드립니다.\n\n자격시험(종합시험 및 외국어)을 합격한 자에 한하여 연구계획서 제출이 가능합니다.\n\n가. 접수기간: 2026.6.22.(월) ~ 6.29.(월)\n\n나. 접수방법: 학사포탈 로그인 후 업로드 (붙임 메뉴얼 참조)\n원본조회(문서확인번호 조회) 가능한 온라인 출력본을 PDF 파일로 업로드\n\n다. 유의사항\n\n1) 대학원 입학전형 제출 시 제출된 영어 성적은 자동 반영되지 않습니다.(추가 제출 필수)\n2) 공인성적의 유효기간과 대학원 재학기간 일치하여야 함.\n3) 종합시험 서류평가 시 외국어 성적이 반영되므로, 종합시험 응시 전에 제출 권장\n(연구계획서 제출 한 학기 전까지 반드시 제출, 예; 2026-1학기 연구계획서 제출 예정인 경우 2025. 12.29.까지 외국어 성적 제출 필수)\n4) 재학연한 마지막학기(석사8, 박사14, 통합16)까지 외국어 및 종합시험 합격이 안될 경우, 학기연장불가 및 제적\n5) 학부과정을 영어권에서 이수한 입학자의 경우 학부 졸업증명서 제출\n6) 본교 출신 석사가 (아래의 박사졸업 기준을 만족한 경우만 해당) 박사 진한 한 경우 석사 졸업증명서 및 외국어성적 사본 제출\n7) 외국어시험 합격여부 확인: 학사포탈 로그인 후 외국어 합격일자 유무(합격일자가 있는 학생은 추가 제출안하셔도 됩니다)\n\n*학과 졸업기준 점수는 아래와 같습니다.\n\n| TOEFL | TOEFL | TOEFL | TOEIC | TEPS (New TEPS)\n(PBT) | (CBT) | (iBT)\n석사 | 510 | 200 | 75 | 650 | 540 (291)\n통합 또는 박사 | 560 | 220 | 83 | 720 | 600 (327)",
   "bodyKind": "text",
   "attName": "[붙임]외국어시험_관련_학사포털_매뉴얼_학생.pdf"
  }
 ],
 "newsList": [
  {
   "title": "'2026 인공지능 여름학교' 연세대학교에서 성황리 개최",
   "date": "2026.07.15",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=475405&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/07/thumb_nBrlOayzKZHEZGUhMIyS0.jpg"
  },
  {
   "title": "연세대학교 기계공학부, 2026 여름학기 해외집중 강의 시리즈 개최 (2026.07.01~03)",
   "date": "2026.07.22",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=475404&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/07/thumb_enXYiiGZOzifGPHUwqYn0.JPG"
  },
  {
   "title": "Lattice Boltzmann Methodology for Single-Phase and Multiphase Nanoparticle Modeling, Springer, 도서 출간",
   "date": "2026.06.01",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=475403&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/07/thumb_eRdjpjFFqzOyQJWAaiaZ0.png"
  },
  {
   "title": "다층 그래핀 프레넬 렌즈와 딥러닝을 활용한 비접촉식 에탄올 분자 센싱 기술 개발",
   "date": "2026.06.01",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=475402&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/07/thumb_hkBewdsWcxjuKVrFLUib0.JPG"
  },
  {
   "title": "질량전달 제어로 SOEC 스택 내구성 한계 극복",
   "date": "2026.05.21",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=475401&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/07/thumb_XwIDNEHsHRRTrMsYJDYp0.JPG"
  },
  {
   "title": "정교한 촉감각 전달을 위한 액체-기체 상변화 액추에이터 및 유연 촉각 디스플레이 개발",
   "date": "2026.05.19",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=475400&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/07/thumb_RPGutxQuPxFZjXKEckNo0.JPG"
  },
  {
   "title": "불규칙한 기계적 움직임을 일정한 진동으로 변환하는 범용 자가발전 마찰전기 센서 플랫폼",
   "date": "2026.05.12",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=475398&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/07/thumb_ZmLHxPBYtyqiAAcftZaA0.JPG"
  },
  {
   "title": "연료 및 시스템 구성 변화에 따른 SOFC 열역학적 성능 분석",
   "date": "2026.05.01",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=475396&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/07/thumb_svGNdEnGadkLkPIdtxko0.JPG"
  },
  {
   "title": "비압전성 폴리머 필름을 이용한 유연한 음향파 발생장치 개발과 생체조직 분야로의 응용",
   "date": "2026.04.15",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=471181&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/05/thumb_IZtvRBaWTZYnLcJSHbdF0.JPG"
  },
  {
   "title": "리소그래피 공정 없이 제작 가능한 대기전력이 없는 수소 감지 스위치 개발",
   "date": "2026.04.08",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=471179&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/05/thumb_xecNqOVXinVGOHEcXTJN0.JPG"
  },
  {
   "title": "리튬이온전지 열폭주 초기 SEI 분해 반응의 반응속도론적 모델링",
   "date": "2026.04.01",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=471177&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/05/thumb_dPKVugDLYnxNjrXxUdEj0.JPG"
  },
  {
   "title": "중온 직접 암모니아 SOFC 성능·내구성 향상을 위한 Co–GDC 나노촉매 연료극 개발",
   "date": "2026.04.01",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=471176&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/05/thumb_yeUaUZygdTzTMcSwPbos0.JPG"
  },
  {
   "title": "부분 매립형 수직 정렬 탄소나노튜브 기반 고해상도 유연 촉각 센서 어레이 개발",
   "date": "2026.03.17",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=471175&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/05/thumb_DdUqPRsRiLfJJxBIDrot0.JPG"
  },
  {
   "title": "Nature Forum: The Future of Sensing Technologies 성황리 개최",
   "date": "2026.04.13",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=469473&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/04/thumb_PCeqIeCwQjijhiqpzKlK0.JPG"
  },
  {
   "title": "고체산화물연료전지 공기 공급 중단 조건에서의 공기극 분해 메커니즘 규명",
   "date": "2026.01.14",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=466121&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/03/thumb_bJJqHTqPpoTvYcYSZihk0.JPG"
  },
  {
   "title": "전흥재 교수 한국복합재료학회 KAL-KSCM상 수상",
   "date": "2025.11.19",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=466119&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/03/thumb_IKrrttlTaLwoRRoTCcsJ0.png"
  },
  {
   "title": "바이오헬스 및 정밀의료기술 심포지움 개최",
   "date": "2026.02.12",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=464422&article.offset=0&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/02/thumb_CXrEtragFoWYTcVVuqLz0.png"
  },
  {
   "title": "2026 연세대 기계공학부 여자 대학원생 선배와의 멘토링 행사 진행",
   "date": "2026.01.15",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=463097&article.offset=10&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/01/thumb_UUkodWKcDnaWcomCqhkg0.jpg"
  },
  {
   "title": "인도네시아 국립대 방문 성료",
   "date": "2026.01.07",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=463087&article.offset=10&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/01/thumb_zfJzlbqmtNPYTBfSsgrS0.JPG"
  },
  {
   "title": "2026 연세대 기계공학부 Industry Insight Forum",
   "date": "2026.01.07",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=463084&article.offset=10&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/01/thumb_hlapkjWkPmtCowKYjHZl0.JPG"
  },
  {
   "title": "고장진단을 위한 물리가이드 기반 자기지도학습 알고리즘 개발",
   "date": "2026.01.01",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=463083&article.offset=10&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/01/thumb_cHhzXtAmViInMikhLdVE0.JPG"
  },
  {
   "title": "접촉각 제어로 액체금속 산화막의 ‘잔여물 없는 박리’ 메커니즘 개발",
   "date": "2025.12.01",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=463082&article.offset=10&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/01/thumb_lQfqhDWcRPmZNCbnWdNQ0.JPG"
  },
  {
   "title": "요로 리포아라비노만난을 이용한 결핵 실시간 검출용 카트리지형 진단 시스템 개발",
   "date": "2025.11.21",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=463080&article.offset=10&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/01/thumb_xxkfqMRiLwRfrsCUoGqe0.JPG"
  },
  {
   "title": "리튬 금속 배터리의 덴드라이트 형성 메커니즘 규명 및 예측을 위한 물리 기반 AI 기술 개발",
   "date": "2025.11.18",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=463079&article.offset=10&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/01/thumb_YSCalstlXStQAZOpEQRx0.JPG"
  },
  {
   "title": "웨어러블 헬스케어 및 햅틱 인터페이스를 위한 인장 둔감형 히터 개발",
   "date": "2025.11.11",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=463076&article.offset=10&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/01/thumb_CgQDheTFeilxFLWQzBos0.JPG"
  },
  {
   "title": "루테늄 산화물 나노시트 기반 초정밀 에탄올 가스 센서 및 실시간 음주 측정 시스템 개발",
   "date": "2025.11.07",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=463073&article.offset=10&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/01/thumb_icgEWQPtEuDljrDpxPGI0.JPG"
  },
  {
   "title": "표면 사진 한 장으로 마찰·접촉 완벽 예측: 딥러닝 기반 접촉해석 기술 개발",
   "date": "2025.07.17",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=463070&article.offset=20&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2026/01/thumb_PIQHABhTqppJtyTYuxKF0.JPG"
  },
  {
   "title": "연세대–대만국립대 기계공학부 공동 워크숍 개최",
   "date": "2025.12.23",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=461794&article.offset=20&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2025/12/thumb_MDoHuawxQJaBJzkvJBXz0.JPG"
  },
  {
   "title": "여학생 간담회 개최",
   "date": "2025.12.05",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=460906&article.offset=20&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2025/12/thumb_JvCYdWHVzjygTzbHTIPU0.jpg"
  },
  {
   "title": "2025 공대-심혈관병원 공동 심포지엄",
   "date": "2025.11.26",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=460215&article.offset=20&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2025/11/thumb_NeEuebyVgCrrPBjwsLXD0.JPG"
  },
  {
   "title": "네덜란드 TU Delft 방문단, 연세대학교 기계공학부와 교류 행사 진행",
   "date": "2025.11.13",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=459658&article.offset=20&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2025/11/thumb_OVOQjJFHoxKyZGFyAAJA0.JPG"
  },
  {
   "title": "벡터 코리아, 연세대학교 방문 및 기계공학부 대상 CANoe 소프트웨어 워크샵 진행",
   "date": "2025.11.06",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=459657&article.offset=20&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2025/11/thumb_RBIlOFrXeAwnnqYOiRbf0.JPG"
  },
  {
   "title": "미세유체 기술 기반 차세대 치료제 엑소좀 모사 나노입자의 연속 생산 기술 개발",
   "date": "2025.10.23",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=459654&article.offset=20&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2025/11/thumb_TnwmLsWRrHgSJHmSHeIC0.JPG"
  },
  {
   "title": "2025 연세대학교 ME DAY",
   "date": "2025.10.17",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=459650&article.offset=20&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2025/11/thumb_krcMPuawjnQBZSpMLRZL0.JPG"
  },
  {
   "title": "금 나노입자-탄소나노튜브 기반 고감도 유연 촉각 센서 개발",
   "date": "2025.10.13",
   "url": "https://me.yonsei.ac.kr/me/community/news.do?mode=view&articleNo=459645&article.offset=20&articleLimit=10",
   "thumb": "https://me.yonsei.ac.kr/_attach/image/2025/11/thumb_gOwVmxqxDGeelokjvaDs0.JPG"
  }
 ],
 "seminars": [
  {
   "no": "378",
   "title": "[BK세미나] 7/31(금) Prof. Yoshikazu Hirai (Kyoto University) \"Wafer-Level Microfabrication Technologies for Alkali Vapor Cel",
   "date": "2026.07.22",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=475433&article.offset=0&articleLimit=10",
   "meta": "▣ 주 제: Wafer-Level Microfabrication Technologies for Alkali Vapor Cells Toward MEMS Atomic Clocks\n▣ 연 사: Prof. Yoshikazu Hirai\n▣ 소 속: Kyoto University\n▣ 일 시: 2026. 7. 31.(금) 17:00\n▣ 장 소: 제4공학관 D601호\n▣ 초 청: 김종백 교수",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nMicrofabricated alkali vapor cells are essential components of coherent population trapping (CPT) atomic clocks and play a central role in achieving miniaturized timing devices. In this seminar, I will present our recent progress in wafer-level microfabrication technologies for alkali vapor cells, with a particular focus on improving both manufacturability and device performance. The first topic is an integrated vapor-cell structure that combines a CPT optical cavity with Si three-dimensional microstructures [1, 2]. This structure was designed to facilitate the low-temperature thermal decomposition of RbN3, allowing efficient Rb generation under a reduced thermal budget. As a result, the Rb sourcing process inside the cell can be significantly shortened while maintaining stable Rb generation. The second topic is wafer-level, cell-by-cell control of N2 buffer-gas pressure in microfabricated vapor cells [3]. RbN3 was patterned by inkjet deposition and decomposed after wafer-level sealing using laser irradiation, generating both Rb vapor and N₂ buffer gas inside each cell. The generated N₂ pressure exhibited a linear relationship with the deposited RbN₃ amount, with a coefficient of variation (CV) of 5.0%. CPT characterization showed that, in the low-pressure regime below approximately 5 kPa, CPT-based laser stabilization can enhance the CPT resonance amplitude by improving spectral selectivity. Overall, these wafer-level approaches provide practical routes toward scalable fabrication and performance optimization of alkali vapor cells, which are critical for future MEMS atomic clocks and high-precision timing devices.",
   "bodyKind": "text",
   "attName": "20260731_hirai.jpg",
   "att": true
  },
  {
   "no": "377",
   "title": "[BK세미나] 7/28(화) 김종성 교수(세종대학교 양자원자력공학과) \"Trends and Prospects of SMR Development Globally and Domestically: Strategies fo",
   "date": "2026.07.20",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=475236&article.offset=0&articleLimit=10",
   "meta": "▣ 주 제: Trends and Prospects of SMR Development Globally and Domestically: Strategies for Development in Korea\n▣ 연 사: 김종성 교수\n▣ 소 속: 세종대학교 양자원자력공학과\n▣ 일 시: 2026. 7. 28.(화) 16:00\n▣ 장 소: 제4공학관 D604호\n▣ 초 청: 박노철 교수",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nIn recent years, the global energy landscape has been undergoing a significant transformation, driven by the urgent need to reduce carbon emissions and transition towards sustainable energy solutions. Amidst this shift, nuclear energy has resurfaced as a viable option, notably with advancements in reactor technology aimed at addressing past challenges related to safety, waste management, and cost. The development of Small Modular Reactors (SMRs) is at the forefront of this nuclear renaissance, offering a flexible, scalable, and potentially more economical alternative to traditional large-scale nuclear power plants. SMRs are perceived as pivotal in enhancing energy security and providing clean and reliable energy, thus playing a crucial role in meeting future energy demands and environmental goals.\nAs one of the emerging game-changers in the nuclear industry, Small Modular Reactors (SMRs) have garnered significant attention worldwide. Before delving into an in-depth discussion about SMRs, this seminar will provide a foundational overview of nuclear energy, setting the stage for a comprehensive exploration of SMRs.\nThe session will begin by defining SMRs, highlighting their unique characteristics that distinguish them from conventional nuclear reactors. Following this, a detailed examination of both domestic and international SMR development will be conducted, showcasing the operational features and deployment status of these advanced nuclear systems.\nFurthermore, the seminar aims to outline the strategic approach and ongoing R&D initiatives within the South Korean nuclear sector, which are pivotal for advancing the development of SMRs. By analyzing these strategies and projects, we will assess the potential for commercialization of SMRs both in South Korea and globally.\nThis presentation seeks to provide participants with insights into the transformative potential of SMRs, equipping them with a better understanding of how these innovative systems can shape the future of nuclear energy, both locally and worldwide.",
   "bodyKind": "text",
   "attName": "20260728_김종성.jpg",
   "att": true
  },
  {
   "no": "376",
   "title": "[BK세미나] 7/21(화) Prof. Reza Talemi(KU Leuven) \"Tribo-Fatigue Fracture Response of Additively Manufactured Metallic Alloys",
   "date": "2026.07.13",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=474858&article.offset=0&articleLimit=10",
   "meta": "▣ 주 제: Tribo-Fatigue Fracture Response of Additively Manufactured Metallic Alloys\n▣ 연 사: Prof. Reza Talemi\n▣ 소 속: KU Leuven\n▣ 일 시: 2026. 7. 21.(화) 13:00\n▣ 장 소: 제1공학관 A442호\n▣ 초 청: 김대은 교수",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nAdditive Manufacturing (AM) has revolutionized the production of complex and customized components, offering unprecedented design flexibility. However, the tribo-mechanical response of AM materials, covering their wear, friction, and mechanical performance under various loading conditions, remains a critical challenge. This seminar will explore the unique microstructural features of AM materials and their impact on tribological and mechanical properties. Emphasis will be placed on fatigue and fretting fatigue behaviours, with insights from advanced experimental techniques and numerical simulations. The talk will also address ongoing challenges, including anisotropy, surface features, and surface/subsurface defects, while proposing strategies for optimizing material performance for industrial applications.",
   "bodyKind": "text",
   "attName": "20260721_Reza Talemi.jpg",
   "att": true
  },
  {
   "no": "375",
   "title": "[BK세미나] 7/15(수) Prof. Robert G. Landers(University of Notre Dame) \"Off-Line and On-Line Volumetric Error Compensation of",
   "date": "2026.07.08",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=474695&article.offset=0&articleLimit=10",
   "meta": "▣ 주 제: Off-Line and On-Line Volumetric Error Compensation of Machine Tools and IndustrialRobots\n▣ 연 사: Prof. Robert G. Landers\n▣ 소 속: University of Notre Dame\n▣ 일 시: 2026. 7. 15.(수) 10:30\n▣ 장 소: 제1공학관 A205호\n▣ 초 청: 민병권 교수",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nDue to inaccuracies in component fabrication and assembly, machine tools and industrial robots have geometric errors (i.e., difference between nominal and actual kinematic motions), which greatly contribute to the errors in parts fabricated on these machines, as well as unduly long process certification times. To compensate for machine tool geometric errors, the standard practice is to directly measure each error individually and, from these measurements, directly populate compensation tables found in the machine tool controller. The drawback to this method is that it is extremely slow due to long instrument set up times and does not capture the complexity (e.g., sagging, twisting) of large machine tools. To compensate for industrial robot geometric errors, circle point analysis is used where the errors of each joint are measured independently. While this method is fast, it still does not capture the complexity of robot kinematic errors. In addition, machine tools and industrial robots suffer from thermal deformations due to changes in ambient temperature and heat sources on the machine, and deflections between the tool and part due to processing forces. These error sources are very difficult to model and, thus, are typically ignored.\nThis talk will discuss recent work on the volumetric error compensation of large machine tools and industrial robots used for manufacturing tasks A laser tracker is used to measure the machine tool and robot geometric errors over the entire visible joint space. A 6 Degree of Freedom geometric error model is constructed for every joint. Translational and rotational errors for each joint are described by a set of joint-position dependent basis functions and probability-based estimators are employed to identify the geometric error model coefficients. Based on this model, an optimization algorithm is used to populate compensation tables for machine tools, or the inverse Jacobian method is used to modify the joint commands for robots. In this talk we will discuss the details of the new volumetric error compensation methodology and provide several examples of machine tools and robots we have modeled and compensated for a variety of industrial partners. Also, we will discuss our most recent work in on-line compensation of industrial robots where errors are directly measured and compensated for during the operation.",
   "bodyKind": "text",
   "attName": "20260715_Landers.jpg",
   "att": true
  },
  {
   "no": "374",
   "title": "[BK세미나] 7/14(화) Prof. Jihyun Lee(University of Calgary, Canada) \"Robotic Machining and Mechatronics for Intelligent Manu",
   "date": "2026.07.08",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=474694&article.offset=0&articleLimit=10",
   "meta": "▣ 주 제: Robotic Machining and Mechatronics for Intelligent Manufacturing\n▣ 연 사: Prof. Jihyun Lee\n▣ 소 속: University of Calgary, Canada\n▣ 일 시: 2026. 7. 14.(화) 11:00\n▣ 장 소: 제1공학관 A205호\n▣ 초 청: 민병권 교수",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nIndustrial robots are widely used in manufacturing for tasks such as loading and unloading,assembly, welding, and cutting, due to their flexibility, long reach, multiple degrees of freedom,and ability to perform repetitive tasks efficiently at low cost. However, their application is still limited to low-load, low-contact-force operations because of their low structural rigidity. Thislimitation often results in vibrations during high-speed movement or heavy cutting, which increases processing time and reduces the surface finish quality. If effective hardware andsoftware solutions can be developed to allow robots to withstand larger contact forces, thepotential applications could greatly expand to include humanoid robots capable of machining and heavy-duty factory automation systems.This seminar introduces several research efforts aimed at addressing these challenges. First, anovel parallel-serial robotic architecture, called a \"cable-assisted robotic system\", has been developed to improve structural rigidity. Second, new methods have been proposed to predict cutting forces and compensate for static deflection in robotic milling operations. Third, aninnovative fast-chirp centrifugal force excitation technique enables the identification of jointdynamic parameters during robot motion. Finally, Dr. Lee will present collaborative projects with manufacturing industries that applies mechatronics for process automation. Together, theseefforts highlight a comprehensive approach to enhancing the performance and applicability ofindustrial robots in advanced manufacturing.",
   "bodyKind": "text",
   "attName": "20260714_이지현.jpg",
   "att": true
  },
  {
   "no": "373",
   "title": "[BK세미나] 6/11(목) Prof. Dvir Yelin(Technion–Israel Institute of Technology) \"Imaging tympanic membrane vibrations\"",
   "date": "2026.06.04",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=472474&article.offset=0&articleLimit=10",
   "meta": "▣ 주 제: Imaging tympanic membrane vibrations\n▣ 연 사: Prof. Dvir Yelin\n▣ 소 속: Technion–Israel Institute of Technology\n▣ 일 시: 2026. 6. 11.(목) 13:00\n▣ 장 소: 제4공학관 D601호\n▣ 초 청: 주철민 교수",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nImaging the function and dynamics of the human ear is an extremely challenging task due to its minute anatomical structures and nanometric-scale movements in response to sound. By combining spectrally encoded endoscopy with phase-sensitive, spectral-domain interferometry, we demonstrate effective, noninvasive in vivo functional imaging of the vibrating human tympanic membrane. Our system attains high-speed and high-resolution imaging through a compact handheld probe, allowing to measure the amplitude and phase of the vibrational patterns generated within the tympanic membrane in response to a wide range of acoustic frequencies. The unique physiological data captured by the system allows measuring a wide range of clinically relevant parameters, offering a powerful experimental platform for studying middle and inner ear physiology.",
   "bodyKind": "text",
   "attName": "20260611_Dvir Yelin.jpg",
   "att": true
  },
  {
   "no": "372",
   "title": "[학부 세미나] 6/5(금) 김석 교수(연세대학교 기계공학과) \"Programmable Mechanical Matter: 구조로 기능을 코딩하는 기계물질 설계\"",
   "date": "2026.06.04",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=472463&article.offset=0&articleLimit=10",
   "meta": "▣ 제 목: Programmable Mechanical Matter: 구조로 기능을 코딩하는 기계물질 설계\n▣ 연 사: 김석 교수\n▣ 소 속: 연세대학교 기계공학과\n▣ 일 시: 2026. 6. 5.(Fri) 16:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n자연은 수억 년의 진화를 통해 놀라운 공학적 해답을 물질의 구조 속에 새겨두었다. 뼈, 나무, 조개껍데기, 곤충의 외골격은 모두 나노미터에서 센티미터에 이르는 다중 스케일의 셀룰러(cellular) 계층 구조로 이루어져 있으며, 이 구조 덕분에 최소한의 질량으로 높은 강성·인성·다기능성을 동시에 구현한다. 핵심은 재료 자체의 조성이 아니라, 구조의 형상·기공성·연결성·주기성이라는 설계 변수를 통해 물성이'프로그래밍'된다는 점이다.\n본 세미나는 이러한 자연의 원리를 공학적으로 구현하는Programmable Mechanical Matter (구조 설계를 통해 기계적·물리적 기능을 능동적으로 제어하는 물질 시스템)를 주제로 한다. 특히 적층제조 고려 설계(Design for Additive Manufacturing, DfAM)를 핵심 제작 수단으로 삼아, 전통적인 절삭·금형 공정으로는 구현할 수 없었던 복잡한 멀티스케일 구조체를 어떻게 실현하는지를 구체적인 연구 사례와 함께 소개한다.\n본 세미나에서 다루는 내용은 크게 세 가지 부분으로 구성된다. 첫째, 발수·발액·입자 포집 등 생체모방 기능성 표면 미세구조 설계 및 대면적 제조 기술이다. 둘째, 비주기 격자 등 기계적 메타물질 설계를 통한 강성·에너지 흡수 특성의 능동적 제어이다. 셋째, 물 반응형4D 프린팅을 활용한 형상 변환 구조 및 다공성 구조체 기반의 물질 변환 사례이다. 이를 통해 구조-재료-제조의 삼각 축을 유기적으로 연결함으로써, 경량 고강성 구조, 에너지 효율화 촉매 반응기, 다기능성 표면 시스템 등 다양한 응용 가능성을 논의한다.\n기계공학의 고전적 설계 관점이 어떻게 재료과학·제조공학·물리학과 융합되어 새로운 패러다임으로 진화하고 있는지, 그리고 이 분야에 어떻게 진입할 수 있는지를 함께 모색하는 자리가 되길 기대한다.",
   "bodyKind": "text",
   "attName": "20260605_학부_김석 교수.jpg",
   "att": true
  },
  {
   "no": "371",
   "title": "[대학원 세미나] 6/5(금) 나성수 교수(고려대학교 기계공학부) \"From Conventional Dynamics to Multiscale Dynamics\"",
   "date": "2026.06.04",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=472461&article.offset=0&articleLimit=10",
   "meta": "▣ 제 목: From Conventional Dynamics to Multiscale Dynamics\n▣ 연 사: 나성수 교수\n▣ 소 속: 고려대학교 기계공학부\n▣ 일 시: 2026. 6. 5.(Fri) 13:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n(1) Conventional dynamics: Structural dynamics and vibration의 연구내용으로써 복합재로 구성된 비행체 날개구조물의 진동제어와 공탄성제어기법을 소개한다.\n(2) Protein dynamics : Structural dynamics와 protein dynamics 연구의 상관성과 연구의 확장성에 대해서 소개하고 아밀로이드 파이버의 물성연구와 질환의 상관성 연구\n(3) 나노독성물질 계측기술에 관해서 진동센서로써 마이크로 캔틸레버를 이용한 resonator를 사용하여 CNT/ ZnO NW/ Silver Ion 등 나노물질의 센싱기법에 대해서 소개함.\n(4) 혈중순환 종양 DNA의 초민감 검출기법에 대해서 소개함\n(5) 실크재료의 물성치 연구로써 다음의 주제에 대해서 발표함\n- Mechanical properties of silk depend on amino acid sequence: spider silk vs. silkworm silk\n-실크섬유의 나노그물망 강화 메커니즘\n(6) Multiscale QM-MD-ENM analysis of EUV-induced Mechanical response in Silk-based Photoresists.",
   "bodyKind": "text",
   "attName": "20260605_대학원_나성수.jpg",
   "att": true
  },
  {
   "no": "370",
   "title": "[학부 세미나] 5/29(금) 임근배 교수(포항공과대학교 기계공학과) \"Mechanics for Biomedical Engineering\"",
   "date": "2026.05.28",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=471882&article.offset=0&articleLimit=10",
   "meta": "▣ 제 목: Mechanics for Biomedical Engineering\n▣ 연 사: 임근배 교수\n▣ 소 속: 포항공과대학교 기계공학과\n▣ 일 시: 2026. 5. 29.(Fri) 16:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n반도체 기술이 발전함에 따라 새로운 응용분야인 MEMS(Micro Electro Mechanical System) 분야가 90년초반부터 각광을 받았다.\n원리적인 측면으로 보면 소자/시스템이 작아질수록 성능이 개선되는 물리적 특성을 이용하는 경우가 많아서, MEMS는 새로운 학문분야로 까지 자리매김을 하게 되었다.\n반면, 소자 하나하나의 공통점 (Hardware Platform)이 크지 않아 R&D 비용/기간 대비 기업의 수익성이 높지를 못하여 제품화까지 발전한 예는 매우 적으며 Bio 관련 분야에 국한적으로 사용이 되어 졌다.\nMEMS 기술의 바이오 분야 적용은 점점 넓어지고 있으며, 기술적 필요에 의해 2000년 초반 부터는 Nano기술을 접목 본격적으로 접목하기 시작하였다.\nNano분야는 마이크로 와는 또 다른 물리적 특성을 나타내며 이러한 특성을 이용하면 기존의 마크로-세계에서는 전혀 불가능하였던 여러가지 원리추구 및 제품개발이 가능하다.\n제작시간 및 원가도 줄일 수 있는 경우가 많아 새로운 시장의 가능성도 보여주고 있다.\n본 발표에서는 이러한 원리 및 특성을 추구하기 위하여 시도된 Nano-Fabrication 의 예를 소개하고 타 기술과의 접목 나아가 현재 첨단 제품에 있어서의 문제점 해결에 대하여 토론할 예정이다.",
   "bodyKind": "text",
   "attName": "20260529_학부_임근배 교수.jpg",
   "att": true
  },
  {
   "no": "369",
   "title": "[대학원 세미나] 5/29(금) 정성남 교수(건국대학교 항공우주·모빌리티공학과) \"Overall Rotorcraft Aeromechanics Research Activities at KonkukUniversity\"",
   "date": "2026.05.28",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=471863&article.offset=0&articleLimit=10",
   "meta": "▣ 제 목: Overall Rotorcraft Aeromechanics Research Activities at KonkukUniversity\n▣ 연 사: 정성남 교수\n▣ 소 속: 건국대학교 항공우주·모빌리티공학과\n▣ 일 시: 2026. 5. 29.(Fri) 13:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nAeromechanics is a branch of applied mechanics that studiesequilibrium, motion, and control of an elastic body in flight under the influence of air. In this seminar, the overall rotorcraft aeromechanics research activitiesconducted at Intelligent Rotorcraft Structures laboratory in Konkuk University, Seoul, for the last 20+ years will be briefed. The subjects will cover validation of HART (Higher-harmonic Aeroacoustic Rotor Test) I/II rotors, measurementsof HART I/II blade structural properties, development of rotorcraft aeromechanics analysis system, and vibration control of lift-offset coaxial rotorcrafts. International collaborative research called STAR (Smart TwistingActive Rotor) will also be introduced.",
   "bodyKind": "text",
   "attName": "20260529_대학원_정성남.jpg",
   "att": true
  },
  {
   "no": "368",
   "title": "[BK세미나] 6/1(월) 강용태 교수(고려대학교 기계공학과) \"솝션열배터리 및 액상 쌍극자 칼로릭 냉장 사이클\"",
   "date": "2026.05.22",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=471574&article.offset=0&articleLimit=10",
   "meta": "▣ 주 제: 솝션열배터리 및 액상 쌍극자 칼로릭 냉장 사이클\n▣ 연 사: 강용태 교수\n▣ 소 속: 고려대학교 기계공학과\n▣ 일 시: 2026. 6. 1.(월) 17:00\n▣ 장 소: 제1공학관 A205호\n▣ 초 청: 김우철 교수",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nThe need for alternative cooling technologies is growing because vapor-compression refrigeration requires high power consumption and relies on refrigerants with environmental concerns. In this study, we propose a liquid-state dipolarcaloric refrigeration cycle (DCE) using nitrate-based aqueous electrolytes as the working fluid. The concept is based on the idea that the dipolar alignment of water molecules, or solvation structure, varies with salt concentration and electric-field conditions. The proposed cycle achieves compressor-free refrigeration by regenerating concentration states through electrodialysis (ED), using entropy changes associated with water-ion interactions and dipolar alignment as the thermodynamic driving force, and repeatedly absorbing and rejecting heat through heat exchangers. A thermodynamic model was developed based on concentration-dependent chemical potential and entropy changes, and the system-level energy balance was evaluated by incorporating irreversible losses in the ED unit, including membrane resistance, current density, water transport, and ion transport. Sensitivity analysis was conducted to examine the effects of concentration swing, ED power input, heat exchanger effectiveness, and internal heat recovery on cooling capacity and COP. The results highlight the potential of ED-regenerated nitrate-based DCE systems for low-GWP, low-noise, and modular refrigeration.",
   "bodyKind": "text",
   "attName": "20260601_강용태 교수.jpg",
   "att": true
  },
  {
   "no": "367",
   "title": "[학부 세미나] 5/22(금) 김원정 교수(연세대학교 기계공학부) \"미세유체역학 이해 및 연구 사례 소개\"",
   "date": "2026.05.19",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=471248&article.offset=0&articleLimit=10",
   "meta": "▣ 제 목: 미세유체역학 이해 및 연구 사례 소개\n▣ 연 사: 김원정 교수\n▣ 소 속: 연세대학교 기계공학부\n▣ 일 시: 2026. 5. 22.(Fri) 16:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n미소스케일 유체역학은 주로 작은 규모의 유동에 대한 해석을 다루는 학문 분야이다. 유동 해석에서 중요하게 이용되는 Navier-Stokes equation은 유체입자의 관성이 입자에 가해지는 압력, 점성력, 중력에 따라 어떻게 변하는지 설명한다. 그런데 해석하고자 하는 유동의 규모가 작은 경우에는 종종 관성의 변화는 상대적으로 작아서, 유체 입자의 관성을 무시하고 해석할 수 있는 특징이 있다. 대신 시스템 크기가 작은 경우 종종 유체와 기체의 계면에서 작용하는 표면장력이 중요한 역할을 하기도 한다. 이 발표에서는 미소스케일 유체역학 해석에서 중요한 물리적 원리를 설명하고, 미소스케일 유체역학 해석을 통해 이해할 수 있는 다양한 시스템과 관련된 응용기술을 개발한 연구 사례를 소개한다.",
   "bodyKind": "text",
   "attName": "20260522_학부_김원정 교수.jpg",
   "att": true
  },
  {
   "no": "366",
   "title": "[대학원 세미나] 5/22(금) 강구민 박사(한국과학기술연구원) \"Nanophotonic Structures for Spectral Tailoring: From Transparent Photovoltaics to",
   "date": "2026.05.19",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=471247&article.offset=0&articleLimit=10",
   "meta": "▣ 제 목: Nanophotonic Structures for Spectral Tailoring: From Transparent Photovoltaics to Radiative Cooling\n▣ 연 사: 강구민 박사\n▣ 소 속: 한국과학기술연구원\n▣ 일 시: 2026. 5. 22.(Fri) 13:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nBuildings consume a large fraction of global energy, motivating materials that can simultaneously harvest solar energy and reject unwanted heat. This seminar presents two complementary nanophotonic strategies that share a common principle: wavelength-selective control of light.\nThe first study introduces a hybrid solar window combining bifacial silicon solar cells with an optimized distributed Bragg reflector (DBR). The DBR selectively reflects NIR light (750–1,150 nm) onto the solar cells while transmitting visible light with minimal color distortion, achieving a PCE of 8.29%, AVT of 75.6%, CRI of 93.8, and a record light-utilization efficiency (LUE) of 6.27% — exceeding the theoretical limit of conventional transparent photovoltaics (Y. Kim et al., Joule 2025).\nThe second study develops a CYTOP-based passive daytime radiative cooling (PDRC) paint. CYTOP's C–F and C–O–C-only structure minimizes solar absorption while enabling selective thermal emission within the atmospheric window (8–13 µm). Combined with a nanovoid–Al2O3 dual-scatter nanostructure, the paint achieves Rsolar = 98.2% and εATW = 96.4% at just 80 µm thickness, delivering 5.4 °C subambient surface cooling with outstanding UV and soiling resistance (H. Park et al., J. Mater. Chem. A 2025).\nTogether, these works demonstrate that precision spectral engineering — harvesting invisible infrared light for power generation or radiating it for cooling — offers a unified pathway toward energy-efficient, sustainable buildings.",
   "bodyKind": "text",
   "attName": "20260522_대학원_강구민.jpg",
   "att": true
  },
  {
   "no": "365",
   "title": "[BK세미나] 5/21(목) Prof. Albert Kim(University of South Florida) \"Acousto-Bioelectronics\"",
   "date": "2026.05.13",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=470874&article.offset=0&articleLimit=10",
   "meta": "▣ 주 제: Acousto-Bioelectronics\n▣ 연 사: Prof. Albert Kim\n▣ 소 속: Medical Engineering, University of South Florida\n▣ 일 시: 2026. 5. 21.(목) 17:00\n▣ 장 소: 제4공학관 D603호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nThis talk is a part of a global effort to conquer cancer, the second leading cause of death worldwide and responsible for more than 600,000 deaths in the United States in 2020. Despite enormous investments in research, development, and workforce, there has been only limited clinical success as a viable cancer therapy. More recently, cancer therapy has seen the evolution of implantable medical devices (IMDs) into viable therapies due to its ability to localize the treatments, albeit limited in numbers. However, the current IMDs-mediated cancer therapies are usually limited to a single, non-replenishable administration per treatment. These limitations, coupled with several complications, such as painful surgery, infection risk in the catheter, device failure, etc., have largely hampered the usage of IMDs for cancer treatment. More importantly, cancer cannot be easily controlled by one type of treatment modality alone due to its complex, diverse, and heterogeneous nature. In this talk, therefore, I discuss a versatile engineering solution in the form of an acoustically powered implantable microsystem that delivers a single or combination of multimodal cancer therapeutics: oxygen (a precursor of oxygenating hypoxia tumor as well as cytotoxic reactive oxygen species, ROS), cisplatin (platinum-based chemotherapy agent), light (a modulator for ROS generation), and electric field (as a tumor-treating field). Combined, the proposed research will establish the field of ‘Acousto-Bioelectronics’ that will spur new theory and understanding for the next generation of implantable biomedical systems.",
   "bodyKind": "text",
   "attName": "20260521_알버트김 교수.jpg",
   "att": true
  },
  {
   "no": "364",
   "title": "[학부 세미나] 5/15(금) 유준호(연세대학교 기계공학부) \"AI 시대 무엇을 준비해야 하는가\"",
   "date": "2026.05.13",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=470870&article.offset=0&articleLimit=10",
   "meta": "▣ 제 목: AI 시대 무엇을 준비해야 하는가\n▣ 연 사: 유준호 방문교수\n▣ 소 속: 연세대학교 기계공학부\n▣ 일 시: 2026. 5. 15.(Fri) 16:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n[Session 1] AI시대 기업은 어떻게 변화하고 있을까?\n효율성메나 매달리는 기업은 도태된다.\nAI시대, 왜 현장을 먼저 정의하는 자가 승리하는가?\n\n[Session 2] 글로벌 비즈니스 현장 및 시사점\n거대 시장의 생산 방식 변화와 기계공학 전공자의 새로운 포지셔닝\n글로벌 무대에서 엔지니어가 갖춰야 할 대체 불가능한 경쟁력\n\n[Session 3] 중국의 대변혁과 우리의 생존 전략\n가장 빠르고 파괴적으로 변하는 중국 현장.\n중국 제조/IT 현장의 급격한 변화와 전략적 시사점\n\n[Session 4] 현장 선배들과의 실전 질의응답(10m)",
   "bodyKind": "text",
   "attName": "20260515_학부_유준호.jpg",
   "att": true
  },
  {
   "no": "363",
   "title": "[대학원 세미나] 5/15(금) 이성희 박사(한국생산기술연구원) \"폴리머부품 대량제조에서 디지털엔지니어링 기술\"",
   "date": "2026.05.13",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=470869&article.offset=0&articleLimit=10",
   "meta": "▣ 제 목: 폴리머부품 대량제조에서 디지털엔지니어링 기술\n▣ 연 사: 이성희 박사\n▣ 소 속: 한국생산기술연구원\n▣ 일 시: 2026. 5. 15.(Fri) 13:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n본 세미나에서는 국내주력제조산업의 플라스틱 부품 대량생산제조를 위한 사출금형성형산업에서 디지털엔지니어링 기술을 소개한다. 이를 위해 제조산업의 근간이 되는 뿌리산업, 플라스틱 폴리머, 복잡한 형상의 플라스틱 부품을 대량제조할 수 있는 사출금형 및 사출성형공정을 간단히 소개한다. 그리고 사출성형과정에서 발생되는 다양한 성형트러블에 대한 기본적인 내용을 설명하고, 이러한 성형불량 해결을 위한 디지털엔지니어링 기술의 필요성, 역할 및 중요성에 대해 설명한다. 또한 폴리머부품 대량제조에서 디지털엔지니어링 기술이 적용된 초발수 부품 대량 제조를 위한 첨단사출금형기술, 스마트미터 신제품개발을 위한 사출금형기술, XR-DNA 융합서비스 사출금형기술 및 고강도 경량 복합재료 부품 사출성형을 위한 인몰드웹 특수사출금형기술에 대해 간단한 소개를 통해 디지털엔지니어링 기술의 중요성을 언급한다. 마지막으로 향후 진행될 폴리머부품 대량제조를 위한 전공정 사출성형에 대한 인공지능과 연계된 디지털엔지니어링 기술의 개념을 설명한다.",
   "bodyKind": "text",
   "attName": "20260515_대학원_이성희.jpg",
   "att": true
  },
  {
   "no": "362",
   "title": "[학부 세미나]5/8(금) 심상준(연세대학교 기계공학부) \"유연 촉각 피드백 장치\"",
   "date": "2026.05.06",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=470425&article.offset=0&articleLimit=10",
   "meta": "▣ 제 목: 유연 촉각 피드백 장치\n▣ 연 사: 심상준 연구교수\n▣ 소 속: 연세대학교 기계공학부\n▣ 일 시: 2026. 5. 8.(Fri) 16:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n최근가상현실(VR), 증강현실(AR), 로봇원격조작 등 인간–기계 인터페이스 기술의 발전과 함께, 시각과 청각을 넘어 촉각 정보를 전달할 수 있는 인터페이스의 중요성이 크게 증가하고 있습니다. 특히 피부에 직접 작용하는 촉각 디스플레이는 사용자 몰입도와 직관적 상호작용을 향상시키는 핵심기술로 주목받고 있으나, 높은 공간 해상도와 충분한 변위 및 힘을 동시에 구현하는데에는 여전히 기술적 한계가 존재합니다. 이를 해결하기 위한 접근으로, 본 강연에서는 액체–기체상 변화를 이용한 phase-change actuator 기반의 유연 촉각 디스플레이 기술을소개합니다. 상변화에 따른 체적팽창을 활용하는 이 메커니즘은 단순한 구조에도 불구하고 높은 에너지 밀도를 제공하며, 효과적인 기계적 변위를 생성할 수 있는 장점을 갖습니다. 또한 촉각디스플레이 설계에 있어 단일 스케일의 최적화가 아닌, 해상도와 출력 간의 트레이드오프를 고려한 다중스케일 설계 전략의 중요성을 제시합니다. 더 나아가, 상변화기반구동과 연성구조설계를 결합함으로써 열–기계적 거동과 구조 변형을 통합적으로 고려한 새로운 설계 패러다임을 제안합니다. 마지막으로, 이러한 연구 흐름을 바탕으로 차세대 촉각인터페이스 구현을 위한 설계방향과 제조전략을 논의하고, 인간–로봇 상호 작용 및 웨어러블시스템으로의 확장 가능성을 제시하고자 합니다.",
   "bodyKind": "text",
   "attName": "20260508_학부_심상준.jpg",
   "att": true
  },
  {
   "no": "361",
   "title": "[대학원 세미나] 5/8(금) 차성운 교수(연세대학교 기계공학부) \"슈뢰딩거의 고양이와 노벨상\"",
   "date": "2026.05.06",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=470424&article.offset=0&articleLimit=10",
   "meta": "▣ 제 목: 슈뢰딩거의 고양이와 노벨상\n▣ 연 사: 차성운 교수\n▣ 소 속: 연세대학교 기계공학부\n▣ 일 시: 2026. 5. 8.(Fri) 13:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n슈뢰딩거의 고양이는 양자역학의 가장 유명한 사고실험 중 하나로, 미시 세계에서 나타나는 양자 중첩의 개념을 거시적 세계의 직관과 연결하여 보여준다. 상자 속 고양이가 관측되기 전까지 ‘살아 있음’과 ‘죽어 있음’의 상태가 동시에 존재할 수 있다는 설정은 양자역학이 고전역학적 상식과 얼마나 다른 방식으로 자연을 설명하는지를 잘 드러낸다. 본 강연은 슈뢰딩거의 고양이 사고실험을 출발점으로 하여, 양자역학의 핵심 개념과 그것이 현대 과학기술 및 노벨상 수상 연구로 어떻게 이어져 왔는지를 살펴보는 것을 목표로 한다.\n먼저 양자 중첩, 관측, 파동함수의 붕괴, 확률적 해석 등 슈뢰딩거의 고양이에 담긴 물리적 의미를 직관적인 예시를 통해 설명한다. 이어서 이러한 개념이 단순한 철학적 논의에 머무르지 않고, 양자 얽힘, 양자 정보, 양자 컴퓨터, 양자 센서, 양자 통신과 같은 현대 기술의 기반으로 확장되어 온 과정을 소개한다. 특히 양자역학의 발전 과정에서 노벨상을 수상한 주요 연구들을 함께 다루며, 기초과학의 개념이 어떻게 새로운 기술 패러다임으로 연결되는지 살펴본다.",
   "bodyKind": "text",
   "attName": "20260508_대학원_차성운.jpg",
   "att": true
  },
  {
   "no": "360",
   "title": "[학부 세미나] 4/17(금) 홍종섭 교수(연세대학교 기계공학부) \"전기화학 에너지 시스템의 열공학적 연구\"",
   "date": "2026.04.14",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=469026&article.offset=10&articleLimit=10",
   "meta": "▣ 제 목: 전기화학 에너지 시스템의 열공학적 연구\n▣ 연 사: 홍종섭 교수\n▣ 소 속: 연세대학교 기계공학부\n▣ 일 시: 2026. 4. 17.(Fri) 16:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n에너지 자원과 환경 문제로 인해 기존 화석연료 중심의 사회, 산업 구조가 점차 친환경 에너지원 중심으로 변화하고 있다. 최근 국내외적으로 친환경 에너지원 기반 사회로의 대전환이 가속화되고 있으며, 태양광, 풍력, 연료전지, 이차전지 등의 다양한 친환경 기술이 급부상하고 있다. 이 중에서도 연료전지와 이차전지가 최근 비약적인 기술 발전과 상용화를 이루었으며, 우리나라 산업에서도 매우 중요한 위치를 차지하고 있다. 수소차, 전기차, 분산형 발전원, AI 데이터센터용 전력 공급/저장, 대용량 에너지 저장 시스템(ESS) 등 다양한 분야에서 연료전지와 이차전지가 활용되고 있으며, 적용분야가 점차 늘어나고 있다.\n연료전지와 이차전지는 모두 전기화학 에너지 시스템으로 기계공학 분야에는 생소할 수 있으나, 핵심적인 기술 개발에는 기계공학적 전문성과 역량이 매우 큰 역할을 하고 있다. 소재/소자 개발부터 디바이스 설계, 통합 시스템 구축 및 운용에 이르기까지 광범위한 영역에서 기계공학 엔지니어들이 주요하게 활동하고 있다. 이런 배경 아래, 본 발표에서는 연료전지 및 이차전지와 같은 전기화학 에너지 시스템 기술 개발에 있어 열공학적 연구가 어떠한 형태로 진행되고 있는지 논하고, 기계공학 전공자들에게 해당 분야 연구에 대한 동기 부여를 하고자 한다.",
   "bodyKind": "text",
   "attName": "20260417_학부_홍종섭 교수.jpg",
   "att": true
  },
  {
   "no": "359",
   "title": "[대학원 세미나] 4/17(금) 표동범 박사(한국생산기술연구원) \"Sim-to-Real for Robot Manipulation: 가상에서 학습한 지능의 현실 전이\"",
   "date": "2026.04.14",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=469025&article.offset=10&articleLimit=10",
   "meta": "▣ 제 목: Sim-to-Real for Robot Manipulation: 가상에서 학습한 지능의 현실 전이\n▣ 연 사: 표동범 박사\n▣ 소 속: 한국생산기술연구원 인간중심로봇연구부문\n▣ 일 시: 2026. 4. 17.(Fri) 13:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n본 세미나는 기계공학 및 로봇 제어 분야의 오랜 난제인 '비정형 환경에서의 로봇 매니퓰레이션(Robot Manipulation)' 문제를 중심으로 인공지능(AI)과 가상-현실 전이(Sim-to-Real) 기술로 어떻게 극복하고 있는지 조망한다. 전통적인 수동 프로그래밍 및 기구학 기반 제어는 통제된 환경에서 밀리미터 단위의 높은 정밀도를 달성할 수 있으나, 작업 조건이 지속적으로 변화하는 비정형 환경과 다양한 작업 요구에 대해 유연하게 대응하기에는 근본적인 한계를 가진다. 이러한 한계를 극복하기 위해 최근 로봇 공학은 모방학습(Learning from Demonstration), 강화학습(Reinforcement Learning), 그리고 시각-언어-행동 모델(Vision-Language-Action, VLA)을 기반으로, 로봇이 데이터로부터 물리적 상호작용을 학습하는 데이터 기반 제어 패러다임으로 빠르게 전환되고 있다. 그러나 이러한 접근은 대규모 시행착오 데이터에 의존하며, 이를 실제 로봇 시스템에서 직접 수집하는 것은 시간, 비용, 안전성 측면에서 사실상 불가능에 가깝다. 이에 대한 핵심 해결책으로, 고정밀 물리 시뮬레이터 상에서 방대한 상호작용 데이터를 빠르게 생성하고 학습한 뒤, 이를 실제 환경으로 효과적으로 이전하는 Sim-to-Real 기술이 주목받고 있다. 본 발표에서는 제조환경의 조립 공정, 고자유도 다지형 손 제어, 그리고 휴머노이드 로봇 사례를 통해 학습 기반 제어 정책이 어떻게 현실 세계로 전이되고 있는지 살펴보고, 향후 로봇 매니퓰레이션 기술의 발전 방향을 논의한다.",
   "bodyKind": "text",
   "attName": "20260417_대학원_표동범.jpg",
   "att": true
  },
  {
   "no": "358",
   "title": "[BK세미나] 4/16(목) 김문일 교수(가천대학교) \"Active site engineering of nanozymes for advanced point-of-care biosensing and beyond\"",
   "date": "2026.04.09",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=468575&article.offset=10&articleLimit=10",
   "meta": "▣ 주 제: Active site engineering of nanozymes for advanced point-of-care biosensing and beyond\n▣ 연 사: 김문일 교수\n▣ 소 속: 가천대학교 바이오나노학과\n▣ 일 시: 2026. 4. 16.(목) 17:00\n▣ 장 소: 제4공학관 D603호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nNanozymes have emerged as robust and cost-effective alternatives to natural enzymes, offering high stability and tunable catalytic properties. In this presentation, I will discuss recent advances in active-site engineering of nanozymes, focusing on the regulation of catalytic activity and reaction selectivity for advanced point-of-care (POC) biosensing applications. First, I will introduce cobalt-doped mesoporous cerium oxide (Co-m-ceria), which exhibits exceptionally high peroxidase-like activity while suppressing oxidase-like activity under near-neutral pH, achieving nearly 600-fold higher catalytic efficiency than pristine ceria through dopant engineering guided by density functional theory. This platform further enables multiplexed biomarker detection via enzyme immobilization within mesoporous structures and integration into paper-based microfluidic devices. Next, I will present nanoflower-type hybrid nanozymes, including DNA–copper, manganese–copper, and cysteine–histidine–copper systems, which exhibit laccase-like activity and enable efficient colorimetric detection of phenolic targets. I will then highlight our recent work on single-atom nanozymes, particularly Cu–N/O coordinated aerogel nanozymes with dual enzymatic activities, enabling simultaneous detection of multiple neurotransmitters in POC platforms, as well as emerging strategies such as out-of-plane ligand coordination in Ru-based single-atom nanozymes, which allows selective catalytic pathways by suppressing competing reactions under near-neutral conditions. Finally, I will present paper-based microfluidic systems incorporating these nanozymes for rapid and visual detection in resource-limited environments, demonstrating that precise control of active sites and catalytic microenvironments is a key strategy for advancing nanozyme-based biosensing and expanding their applications beyond diagnostics.",
   "bodyKind": "text",
   "attName": "20260416_김문일 교수.jpg",
   "att": true
  },
  {
   "no": "357",
   "title": "[학부 세미나] 4/10(금) 이호성 교수(Western Michigan University) \"About Heat Energy in terms of Thermodynamics, Heat Transfer, and \"",
   "date": "2026.04.07",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=468408&article.offset=10&articleLimit=10",
   "meta": "▣ 제 목: About Heat Energy in terms of Thermodynamics, Heat Transfer, and Thermoelectrics\n▣ 연 사: 이호성 교수\n▣ 소 속: Western Michigan University\n▣ 일 시: 2026. 4. 10.(Fri) 16:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nHeat energy is one of many forms of internal energy, also often called to be thermal energy. Based on my teaching and research experience during thirty years, I am going to present a collection of my learning about the heat energy usually not clearly stated in typical textbooks. This presentation will walk over several fields of study such as thermodynamics, heat transfer, and thermoelectrics by using easy words. Thermodynamics includes the first and second laws of thermodynamics, entropy, and Carnot cycle. Heat transfer includes conduction, convection, and radiation. Lastly, thermoelectrics includes fundamental physics such as the Seebeck coefficient, Peltier cooling, Thomson effect and Ohm’s law along with some application.",
   "bodyKind": "text",
   "attName": "20260410_학부_이호성 교수.jpg",
   "att": true
  },
  {
   "no": "356",
   "title": "[대학원 세미나] 4/10(금) 이은호 박사(고려대학교 경제기술안보연구원) \"AI 시대에서 대만의 호황과 그 배경 - 21세기 초반의 침체에서 재도약한 비결\"",
   "date": "2026.04.07",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=468405&article.offset=10&articleLimit=10",
   "meta": "▣ 제 목: AI 시대에서 대만의 호황과 그 배경 - 21세기 초반의 침체에서 재도약한 비결\n▣ 연 사: 이은호 박사\n▣ 소 속: 고려대학교 경제기술안보연구원 경제안보연구센터장\n▣ 일 시: 2026. 4. 10.(Fri) 13:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nAI 시대에 대만이 맞이한 호황은 단순한 우연이 아니라 오랜 시간 축적된 전략과 문화, 그리고 사회적 개혁의 결과로 드러난 흐름이다.\n대만은 21세기 초반 경제 침체를 겪었지만, 이후 개혁과 산업 전략을 통해 재도약에 성공했다. 최근 몇 년간 대만의 GDP 성장률은 주요국을 압도했고, 그 중심에는 TSMC를 비롯한 반도체 산업이 있었다. AI 칩뿐만 아니라 AI 서버 생산을 사실상 독점했으며 칩 설계·생산·패키징에서 서버 제조·클라우드까지 이어지는 완전한 공급망을 자국 기업만으로 구축하여 글로벌 AI 생태계의 핵심으로 자리 잡았다.\n반도체 산업 발전사는 대만 경제사의 핵심 축이다. 1960년대 외국 기업을 유치하며 기술 기반을 마련했고, 1970년대 ITRI (공업기술연구원) 설립으로 첨단 기술 육성을 시작했다. 1980년대 신주 과학단지와 UMC, ACER의 성장으로 IT 산업 기반을 확립했고, 1987년 모리스 창이 TSMC를 세우며 세계 최초의 순수 파운드리 모델을 제시했다. 이 모델은 글로벌 반도체 생태계를 바꾸었고, 대만을 세계 반도체 중심지로 만들었다.\n2000년대 침체 이후 대만은 사회적 개혁으로 돌파구를 마련했다. 상속세·증여세 인하, 이민 정책 개혁, 생활여건 개선 같은 제도적 변화가 있었고, IT 산업단지와 반도체 과학단지를 확장하며 산업 기반을 강화했다. ‘해바라기 운동’을 계기로 중국 의존을 줄이고 신남향정책을 추진하면서 국제적 입지를 넓혔다. 기업들은 스마트폰과 AI 칩 시장의 변화를 빠르게 포착했고, TSMC는 애플 AP 단독 수주와 첨단 미세공정 기술, 독자 패키징 기술(CoWoS, SoIC, InFO 등)로 세계적 경쟁력을 확보했다.\n대만의 성공 배경에는 강한 창업 문화, 부모 세대의 적극적 지원, 정부의 인프라 및 자금 지원, 전문가 존중 문화가 있다. TSMC의 영향력은 부정할 수 없다. 세계 산업에서는 이전까지는 존재하지 않던 팹리스 기업과 IP 라이선싱 산업을 발전시켜 IDM 중심이던 글로벌 반도체 생태계를 바꾸었다. 대만 내에서는 모든 일을 혼자서 하려 하지 않고 팹리스, 패키징 등에서 주변 기업들의 발전을 적극 후원했으며, 이는 다시 TSMC의 경쟁력을 강화하는 선순환으로 연결되었다.\n결론적으로 대만의 사례는 2000년대 이후 성장의 침체가 계속되고 있는 한국에 중요한 시사점을 던진다. 한국이 19세기적 오만을 반복하지 않으려면 대만의 사례를 겸허히 참고할 필요가 있다.",
   "bodyKind": "text",
   "attName": "20260410_대학원_이은호.jpg",
   "att": true
  },
  {
   "no": "355",
   "title": "[학부 세미나] 4/3(금) 민경민 교수(연세대학교 기계공학부) \"AI 기반 멀티스케일 시뮬레이션의 혁신\"",
   "date": "2026.04.01",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=467768&article.offset=10&articleLimit=10",
   "meta": "▣ 제 목: AI 기반 멀티스케일 시뮬레이션의 혁신\n▣ 연 사: 민경민 교수\n▣ 소 속: 연세대학교 기계공학부\n▣ 일 시: 2026. 4. 3.(Fri) 16:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n현대 재료설계는 빅데이터와 인공지능이 주도하는 '제4 패러다임' 시대로 진입하고 있습니다. 본 강연에서는 밀도범함수이론(DFT)부터 분자동역학(MD), 유한요소법(FEM)에 이르는 멀티스케일 시뮬레이션에 AI를 접목하여 차세대 에너지·반도체 소재를 설계하는 연구 방법론을 소개합니다.\n강연은 크게 다음의 네 가지 주제로 구성됩니다. 먼저 Materials Project, AFLOW, OQMD 등 주요 재료 데이터베이스를 활용한 고품질 학습 데이터 구축 전략을 다루고, Ni-rich 양극재 도펀트 탐색 사례를 통해 실제 적용 결과를 소개합니다. 다음으로 화학·구조·전자적 표현자(descriptor)를 결합한 Feature Engineering과, 베이지안 최적화 기반의 능동학습(active learning)을 통해 적은 수의 고비용 시뮬레이션으로 최적 후보 물질을 효율적으로 탐색하는 전략을 설명합니다. 또한 머신러닝 원자간 포텐셜(MLIP)의 원리와 최신 리더보드 동향을 살펴보고, Matini-Net 프레임워크를 비롯한 파운데이션 모델 기반의 재료 특성 예측 연구를 소개합니다. 마지막으로 LLM 에이전트와 자율 실험실로 대표되는 자율설계 시스템 등 향후 연구 방향을 소개합니다.",
   "bodyKind": "text",
   "attName": "20260403_학부_민경민 교수.jpg",
   "att": true
  },
  {
   "no": "354",
   "title": "[대학원 세미나] 4/3(금) 소병식 부사장(삼성물산) \"미래 인재상에 필요한 기계공학도가 가져야 할 의식 수준\"",
   "date": "2026.04.01",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=467764&article.offset=10&articleLimit=10",
   "meta": "▣ 제 목: 미래 인재상에 필요한 기계공학도가 가져야 할 의식 수준\n▣ 연 사: 소병식 부사장\n▣ 소 속: 삼성물산\n▣ 일 시: 2026. 4. 3.(Fri) 13:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n4차 산업혁명과 DX(디지털 전환) 가속화로 인해 기계공학의 영역은 더 이상 단순한 하드웨어 설계를 넘어 지능형 시스템과 인간 중심의 서비스로 확장되고 있습니다. 이러한 변화 속에서 미래의 기계공학도는 기술적 숙련도를 넘어선 고차원적인 ‘의식 수준’을 갖추어야 합니다.\n본 발표에서는 미래 인재로서 기계공학도가 지향해야 할 세 가지 핵심 의식을 제시합니다. 첫째, 기술이 사회와 환경에 미치는 영향을 깊이 통찰하는 ‘지속가능한 가치 창출 의식’입니다. 둘째, AI 및 데이터 과학과의 융합을 유연하게 수용하는 ‘초융합적 사고방식’입니다. 셋째, 자율주행이나 로봇 공학 등 인간의 안전과 직결된 분야에서 요구되는 ‘기술 윤리적 책임 의식’입니다.\n결론적으로, 미래의 기계공학도는 단순한 ‘Maker’를 넘어, 기술과 인류의 공존을 설계하는 ‘Social Architect’로서의 의식을 체득해야 함을 강조하며, 이를 위한 실천적 태도를 제안하고자 합니다.\n또한, 삼성물산이 지향하고 있는 기술에 대한 설명을 기반으로 건설과 기계공학과의 연결성과 역할이 무엇인지 강의하고자 합니다.",
   "bodyKind": "text",
   "attName": "20260403_대학원_소병식.jpg",
   "att": true
  },
  {
   "no": "353",
   "title": "[BK세미나] 4/2(목) Dr. Michael Tanksalvala(NIST) \"EUV Ptychographic reflectometry for measuring nanoscale structure and tran",
   "date": "2026.04.01",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=467763&article.offset=10&articleLimit=10",
   "meta": "▣ 주 제: EUV Ptychographic reflectometry for measuring nanoscale structure and transport\n▣ 연 사: Dr. Michael Tanksalvala\n▣ 소 속: Spin Electronics Group, NIST\n▣ 일 시: 2026. 4. 2.(목) 13:30\n▣ 장 소: 제4공학관 D408호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\nA general trend throughout science and technology is that as devices get smaller and more complex, their performance becomes dominated by transport across interfaces. Simultaneously, probing the structure and transport characteristics of these devices becomes challenging, even using destructive methods such as transmission electron microscopy (TEM). A new class of metrology is being developed that uses extreme ultraviolet light (EUV, ~10nm-100nm) to probe the structure of nanoscale devices with high temporal resolution. For instance, one emerging technique called ptychographic reflectometry combines ptychographic coherent diffractive imaging (CDI) with EUV reflectometry, thus providing 2+1 dimensional reconstructions of atomic composition and state. We are developing one such instrument that can, in conjunction, excite samples electrically with frequencies ranging from 3kHz to 100GHz, to probe the response in thermal, spin, or other transport in active devices such as transistors or MRAM bits. Our instrument can also excite samples with ultrafast optical pulses, for studies of fundamental transport mechanisms.",
   "bodyKind": "text",
   "attName": "20260402_Dr. Michael Tanksalvala.JPG",
   "att": true
  },
  {
   "no": "352",
   "title": "[학부 세미나] 3/27(금) 이종학 소장(LIG넥스원 C5ISR기계융합연구소) \"현대전과 무기체계의 발전 그리고 기계공학\"",
   "date": "2026.03.24",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=467168&article.offset=10&articleLimit=10",
   "meta": "▣ 제 목: 현대전과 무기체계의 발전 그리고 기계공학\n▣ 연 사: 이종학 소장\n▣ 소 속: LIG넥스원 C5ISR기계융합연구소\n▣ 일 시: 2026. 3. 27.(Fri) 16:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n본 강연은 거북선에서 현대의 천궁-II에 이르기까지 전쟁과 무기체계의 발전 과정을 통해 기계공학의 핵심적 역할을 조명한다.\n산업화 이후 전쟁은 기계, 정보, 네트워크 중심으로 진화해왔으며, 현대와 미래전에서는 무인화·지능화가 핵심으로 부상하고 있다.\n실제 무기체계 개발 사례를 바탕으로 구조·유체·열·진동 등 기계공학이 어떻게 적용되는지를 설명하고, 미래 전장에서 공학자의 역할과 책임을 제시한다.",
   "bodyKind": "text",
   "attName": "20260327_학부_이종학.jpg",
   "att": true
  },
  {
   "no": "351",
   "title": "[대학원 세미나] 3/27(금) 유만선 관장(서울시립과학관) \"과학관에 간 공학자\"",
   "date": "2026.03.24",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=467167&article.offset=10&articleLimit=10",
   "meta": "▣ 제 목: 과학관에 간 공학자\n▣ 연 사: 유만선 관장\n▣ 소 속: 서울시립과학관\n▣ 일 시: 2026. 3. 27.(Fri) 13:00\n▣ 장 소: 제2공학관 B040호",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n▣ 초 록\n연세대학교 기계공학과 열전달 연구실에서 박사학위를 취득한 공학자가 ‘과학문화’를 하는 ‘공무원’의 세계로 들어간 경험을 공유하고, 공학을 전공했기에 또 다른 세계에서 도전해 볼 수 있었던 점들에 대해서 이야기하려 합니다.\n기계공학에서 해석하기 어렵다고 알려진 열유체 분야에서 공부했던 경험, 특히 ‘실험’을 주로 진행해야 했기에 겪었던 이론과 실제의 차이, 실험장치를 구성하며 만났던 기술자, 정해진 기한 내에 과제를 끝내야 했던 (과학자들과는 다른?) 경험 등 공학, 특히 기계공학을 하며 경험했던 일들을 정리해 봅니다.\n이후, 사회에서 R&D와는 전혀 다른 ‘과학문화’ 분야로 또, ‘공무원’으로 변신하여 생활하면서 느꼈던 점들을 공유합니다. 과학기술분야를 조사하며 만났던 과학자, 공학자들, 과학정책을 하는 공무원들에 대한 이야기와 ‘메이커 운동’을 하며 느꼈던 점, 정부출연연구소와 대기업 연구개발 성과를 조사하며 느꼈던 점도 공유합니다.\n연구개발 분야에 계신 후배분들이 몰입 중인 연구분야에서 잠시 빠져나와 다른 관점으로 ‘공학을 한다는 것’에 대해 생각해 볼 시간이 되었으면 합니다.",
   "bodyKind": "text",
   "attName": "20260327_대학원_유만선.jpg",
   "att": true
  }
 ],
 "events": [
  {
   "no": "39",
   "title": "[7/20~7/24] 기계공학과 2026 여름학기 해외집중강의 시리즈(2차)",
   "date": "2026.07.07",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=474630&article.offset=0&articleLimit=10",
   "body": "기계공학부 구성원 여러분들의 많은 관심과 참여 바랍니다.\n\n*상세 내용 및 강의계획서는 첨부파일 확인 요망\n(신청 링크 바로가기: https://docs.google.com/forms/d/e/1FAIpQLSdGHeD1JDgCgvmpXusNhTDjDEqT99Shh2pFsUX6w5gy5JSvkQ/viewform?usp=dialog)",
   "bodyKind": "text",
   "attName": "mechanics_meets_genomics_syllabus.pdf",
   "att": true
  },
  {
   "no": "38",
   "title": "[7/1~7/3] 기계공학과 2026 여름학기 해외집중강의 시리즈",
   "date": "2026.06.11",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=473049&article.offset=0&articleLimit=10",
   "body": "기계공학부 구성원 여러분들의 많은 관심과 참석 부탁드립니다.\n※신청 링크 바로가기: https://forms.gle/K3T7oDmsZggtmkqg7",
   "bodyKind": "text",
   "attName": "RLAI_Yonsei_Syllabus.pdf",
   "att": true
  },
  {
   "no": "37",
   "title": "[4/13(월)] Nature Forum: The Future of Sensing Technologies",
   "date": "2026.04.13",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=468907&article.offset=0&articleLimit=10",
   "body": "기계공학부 구성원들의 많은 관심과 참여 부탁드립니다.\n\n[행사 홈페이지 링크]\nhttps://natureconferences.streamgo.live/sensing-technologies/lobby",
   "bodyKind": "text",
   "attName": "Nature Forum_A4 booklet.pdf",
   "att": true
  },
  {
   "no": "36",
   "title": "[2/12(목)] BK21 연구클러스터 시리즈 워크숍(바이오헬스 및 정밀의료기술)",
   "date": "2026.02.03",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=463709&article.offset=0&articleLimit=10",
   "bodyKind": "file",
   "attName": "20260212_연구클러스터 시리즈 워크숍 포스터.pdf",
   "att": true
  },
  {
   "no": "35",
   "title": "[1/26~1/30] 기계공학과 2025 겨울학기 해외집중강의 시리즈",
   "date": "2026.01.07",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=462248&article.offset=0&articleLimit=10",
   "bodyKind": "file",
   "attName": "강의계획서.pdf",
   "att": true
  },
  {
   "no": "34",
   "title": "[1/7(수)] 2026 연세대 기계공학부 Industry Insight Forum",
   "date": "2025.12.10",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=461018&article.offset=0&articleLimit=10",
   "bodyKind": "file",
   "attName": "연세대_기계공학과_포스터수정_20251210_1.jpg",
   "att": true
  },
  {
   "no": "33",
   "title": "[11/6(목)] 한국 근대의학의 과거와 미래를 잇다",
   "date": "2025.10.22",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=457796&article.offset=0&articleLimit=10",
   "bodyKind": "file"
  },
  {
   "no": "32",
   "title": "[11/6(목)] 대학원생 대상 교육 프로그램 CANoe workshop 참여 안내",
   "date": "2025.10.17",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=457505&article.offset=0&articleLimit=10",
   "body": "기계공학부 대학원생을 대상으로 제어 통신 프로그램인 Canoe 교육을 진행하고자 합니다.\nCanoe는 차량용 제어 통신 프로그램으로 현대차에서 활용하고 있으며, 이외에도 일반적인 제어 목적으로 많이 활용되고 있습니다.\n해당 교육에 관심이 있는 기계공학부 대학원생들의 많은 관심과 참여 부탁드립니다.\n\n- 일시: 2025.11.6.(목) 9:30~17:30\n- 장소: 제1공학관 A579호\n\n※해당 교육 참여 시 개인 노트북 준비 필요",
   "bodyKind": "text"
  },
  {
   "no": "31",
   "title": "[7/1~7/29] 기계공학과 2025 여름학기 글로벌 인사이트 강연 시리즈",
   "date": "2025.06.18",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=449012&article.offset=0&articleLimit=10",
   "bodyKind": "file",
   "attName": "2025 여름학기 글로벌 인사이트 강연 시리즈 포스터(확정).pdf",
   "att": true
  },
  {
   "no": "30",
   "title": "[7/7~7/9] 기계공학과 2025 여름학기 해외집중강의 시리즈",
   "date": "2025.06.16",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=448814&article.offset=0&articleLimit=10",
   "body": "기계공학과 구성원 여러분들의 많은 관심과 참석 부탁드립니다.\n\n※ 수강신청 마감 후 수강 확정 인원에게 안내 메일 발송 예정(이메일 주소 정확히 기재)\n※ 전체 출석 및 수업 프로젝트 참가자에게 수료증 발급 예정",
   "bodyKind": "text",
   "attName": "2025 여름학기 해외집중강의 시리즈 포스터(확정).pdf, PADL_Yonsei_Syllabus.pdf",
   "att": true
  },
  {
   "no": "29",
   "title": "[6/4(수)] AI융합심화전공 프로그램 설명회",
   "date": "2025.05.26",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=447510&article.offset=0&articleLimit=10",
   "body": "<연세대학교 AI융합심화전공 프로그램 설명회>\n\n1. 일시: 2025.6.4.(수) 18:00\n2. 장소: 백양관 대강당\n3. 순서\n1) AI융합심화전공 프로그램 소개 (차호정 학장)\n2) AI융합심화 코어과목 안내 (교과목 강의 교수)\n3) 질의 응답\n4. 신청기간: 6.2.(월) 17:00까지\n5. 주최: 인공지능융합대학/ 교무처 학사지원팀\n\nAI융합심화전공에 관심 있는 학생의 많은 참여 바랍니다.",
   "bodyKind": "text",
   "attName": "4-웹포스터-AI융합심화전공_프로그램_설명회-최종-QR.jpg",
   "att": true
  },
  {
   "no": "28",
   "title": "[6/4(수)] 한국수력원자력 CEO 초청 특별 강연",
   "date": "2025.05.19",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=447034&article.offset=0&articleLimit=10",
   "body": "한국수력원자력 CEO 초청 특별강연이 아래와 같이 진행될 예정이므로, 관심이 있으신 학부생 및 대학원생께서는 많은 참여 바랍니다.\n\n1. 일시: 6.4.(수) 14:50-16:00\n2. 장소: 공학원 대강당 B106호\n3. 참석 대상: 공과대학교 소속 학부생 및 대학원생\n4. 강의 내용: CEO특강 (60분), Q&A (10분)\n5. 참여 신청 및 문의: 054-704-1745/1747",
   "bodyKind": "text"
  }
 ],
 "thesisReviewSource": "community/degree_thesis_review.do — 총 150건 중 최근 10건, 2026-07-27 확인(개별 글 URL 미확인 → 게시판 링크)",
 "thesisReview": [
  {
   "no": "150",
   "title": "[260424] 가태권",
   "date": "2026.04.22",
   "url": "https://me.yonsei.ac.kr/me/community/degree_thesis_review.do"
  },
  {
   "no": "149",
   "title": "[260422] 홍수근",
   "date": "2026.04.22",
   "url": "https://me.yonsei.ac.kr/me/community/degree_thesis_review.do"
  },
  {
   "no": "148",
   "title": "[260423] 김재증",
   "date": "2026.04.16",
   "url": "https://me.yonsei.ac.kr/me/community/degree_thesis_review.do"
  },
  {
   "no": "147",
   "title": "[260422] 윤성섭",
   "date": "2026.04.15",
   "url": "https://me.yonsei.ac.kr/me/community/degree_thesis_review.do"
  },
  {
   "no": "146",
   "title": "[260424] 서보경",
   "date": "2026.04.15",
   "url": "https://me.yonsei.ac.kr/me/community/degree_thesis_review.do"
  },
  {
   "no": "145",
   "title": "[260423] 김보경",
   "date": "2026.04.14",
   "url": "https://me.yonsei.ac.kr/me/community/degree_thesis_review.do"
  },
  {
   "no": "144",
   "title": "[260422] 강준구",
   "date": "2026.04.13",
   "url": "https://me.yonsei.ac.kr/me/community/degree_thesis_review.do"
  },
  {
   "no": "143",
   "title": "[260422] 정승민",
   "date": "2026.04.13",
   "url": "https://me.yonsei.ac.kr/me/community/degree_thesis_review.do"
  },
  {
   "no": "142",
   "title": "[260421] 홍태화",
   "date": "2026.04.13",
   "url": "https://me.yonsei.ac.kr/me/community/degree_thesis_review.do"
  },
  {
   "no": "141",
   "title": "[260422] 김세영",
   "date": "2026.04.13",
   "url": "https://me.yonsei.ac.kr/me/community/degree_thesis_review.do"
  }
 ],
 "archiveSource": "community/information.do — 총 7건 전체, 2026-07-27 확인",
 "archive": [
  {
   "no": "7",
   "title": "출석인정 신청서",
   "date": "2026.03.10",
   "att": true,
   "url": "https://me.yonsei.ac.kr/me/community/information.do?mode=view&articleNo=466087&article.offset=0&articleLimit=10"
  },
  {
   "no": "6",
   "title": "출입권한 부여 절차 안내",
   "date": "2024.09.05",
   "att": true,
   "url": "https://me.yonsei.ac.kr/me/community/information.do?mode=view&articleNo=210349&article.offset=0&articleLimit=10"
  },
  {
   "no": "5",
   "title": "[BK21] 학술활동지원비 신청 서식 안내",
   "date": "2022.09.15",
   "att": true,
   "url": "https://me.yonsei.ac.kr/me/community/information.do?mode=view&articleNo=149048&article.offset=0&articleLimit=10"
  },
  {
   "no": "4",
   "title": "[학부] 일몰된 교과목(기계공학수학)에 대한 재수강처리 요청서 양식",
   "date": "2021.04.06",
   "att": true,
   "url": "https://me.yonsei.ac.kr/me/community/information.do?mode=view&articleNo=116196&article.offset=0&articleLimit=10"
  },
  {
   "no": "3",
   "title": "시설 및 비품관련 양식(시설수리, 불용품 처리)",
   "date": "2021.04.06",
   "att": true,
   "url": "https://me.yonsei.ac.kr/me/community/information.do?mode=view&articleNo=116195&article.offset=0&articleLimit=10"
  },
  {
   "no": "2",
   "title": "[대학원]투트랙 및 이중지도 교수제 신청서 양식",
   "date": "2021.04.06",
   "att": true,
   "url": "https://me.yonsei.ac.kr/me/community/information.do?mode=view&articleNo=116194&article.offset=0&articleLimit=10"
  },
  {
   "no": "1",
   "title": "[학부] ABEEK 인증(예정) 증명서 발급 관련 안내",
   "date": "2021.04.06",
   "att": true,
   "url": "https://me.yonsei.ac.kr/me/community/information.do?mode=view&articleNo=116192&article.offset=0&articleLimit=10"
  }
 ],
 "jobs": [
  {
   "no": "934",
   "title": "연세대학교 기계공학부 2026학년도 2학기 비전임교원 2차 채용공고",
   "date": "2026.05.07",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=470472&article.offset=0&articleLimit=10"
  },
  {
   "no": "933",
   "title": "연세대학교 기계공학부 2026학년도 2학기 비전임교원 채용공고",
   "date": "2026.04.23",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=469684&article.offset=0&articleLimit=10"
  },
  {
   "no": "932",
   "title": "[DN솔루션즈] 전문연구요원 채용",
   "date": "2026.01.27",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=463238&article.offset=0&articleLimit=10"
  },
  {
   "no": "931",
   "title": "4단계 BK21사업 신진연구인력 채용 공고",
   "date": "2026.01.05",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=462141&article.offset=0&articleLimit=10"
  },
  {
   "no": "930",
   "title": "[한국기계연구원] 2025년 3차 연수직(박사후연구원) 채용 공고",
   "date": "2025.11.10",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=458944&article.offset=0&articleLimit=10"
  },
  {
   "no": "929",
   "title": "2026학년도 연세대학교 기계공학과 강사(학문후속세대) 채용 공고",
   "date": "2025.11.05",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=458686&article.offset=0&articleLimit=10"
  },
  {
   "no": "928",
   "title": "연세대학교 기계공학부 2026학년도 1학기 비전임교원 채용공고",
   "date": "2025.10.20",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=457639&article.offset=0&articleLimit=10"
  },
  {
   "no": "927",
   "title": "연세대학교 기계공학부 학술연구교수 채용공고",
   "date": "2025.10.15",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=457263&article.offset=0&articleLimit=10"
  },
  {
   "no": "926",
   "title": "삼성디스플레이 '25.下 박사채용/박사장학생 공고",
   "date": "2025.09.05",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=454471&article.offset=0&articleLimit=10"
  },
  {
   "no": "925",
   "title": "보잉한국기술연구소(BKETC) 인턴채용 안내",
   "date": "2025.08.21",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=453105&article.offset=0&articleLimit=10"
  },
  {
   "no": "924",
   "title": "[한화에어로스페이스] R&D 석/박사 산학장학생 채용설명회 안내",
   "date": "2025.07.21",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=451234&article.offset=10&articleLimit=10"
  },
  {
   "no": "923",
   "title": "[삼성전자 DS부문] 7. 18(금) 연세대학교 T&C Forum 행사 홍보",
   "date": "2025.07.15",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=450931&article.offset=10&articleLimit=10"
  },
  {
   "no": "922",
   "title": "4단계 BK21사업 신진연구인력 채용 공고",
   "date": "2025.07.10",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=450710&article.offset=10&articleLimit=10"
  },
  {
   "no": "921",
   "title": "[교육부 주관]「2025년 인공지능(AI) 분야 첨단산업 인재양성 부트캠프 사업」공고 안내",
   "date": "2025.07.10",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=450708&article.offset=10&articleLimit=10"
  },
  {
   "no": "920",
   "title": "[삼성전자 DS부문] 샤이닝스타 7기 모집",
   "date": "2025.06.23",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=449212&article.offset=10&articleLimit=10"
  },
  {
   "no": "919",
   "title": "[인턴직무 추가] [HD현대] 25년 2학기 현장실습학기제 (구글폼 접수: ~6.27.(금) 15:00)",
   "date": "2025.06.23",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=449184&article.offset=10&articleLimit=10"
  },
  {
   "no": "918",
   "title": "[정보통신산업진흥원 : NIPA] 2025년 3D프린팅 전문인력 양성교육 교육생 모집",
   "date": "2025.06.13",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=448757&article.offset=10&articleLimit=10"
  },
  {
   "no": "917",
   "title": "[한국원자력협력재단] 2025년 하반기 국내 원자력 시설견학 프로그램 참여 신청",
   "date": "2025.06.12",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=448677&article.offset=10&articleLimit=10"
  },
  {
   "no": "916",
   "title": "WISET 과학기술 역량 강화 온라인 교육생 모집",
   "date": "2025.06.04",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=448104&article.offset=10&articleLimit=10"
  },
  {
   "no": "915",
   "title": "제 4회 미래 자동차산업 아이디어 공모전 안내",
   "date": "2025.06.04",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=448103&article.offset=10&articleLimit=10"
  },
  {
   "no": "914",
   "title": "HL FMA(Future Mobility Award) 2025 자율주행 경진대회 모집 안내 (참가접수: ~6.30.(월))",
   "date": "2025.05.26",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=447512&article.offset=20&articleLimit=10"
  },
  {
   "no": "913",
   "title": "[두산로보틱스] “AI・로봇 엔지니어 양성과정(초급)” - 5기 모집",
   "date": "2025.05.23",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=447475&article.offset=20&articleLimit=10"
  },
  {
   "no": "912",
   "title": "[두산에너빌리티] 2025 두산에너빌리티 채용연계형 인턴십 채용공고 및 채용상담",
   "date": "2025.05.20",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=447153&article.offset=20&articleLimit=10"
  },
  {
   "no": "911",
   "title": "[추가모집: ~6/15까지][국토교통부산하기관] 건설산업교육원 국가교육안내",
   "date": "2025.05.19",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=447018&article.offset=20&articleLimit=10"
  },
  {
   "no": "910",
   "title": "[한국표준과학연구원] 2025년 1차 정규직 공개 채용",
   "date": "2025.05.13",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=446671&article.offset=20&articleLimit=10"
  },
  {
   "no": "909",
   "title": "연세대학교 기계공학부 2025학년도 2학기 비전임교원 채용공고 (28일까지 신청 연장)",
   "date": "2025.04.16",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=445286&article.offset=20&articleLimit=10"
  },
  {
   "no": "908",
   "title": "로봇팔 구동 관련 모집 공고",
   "date": "2025.04.03",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=322812&article.offset=20&articleLimit=10"
  },
  {
   "no": "907",
   "title": "월계고등학교 강사 채용 안내",
   "date": "2025.03.21",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=230557&article.offset=20&articleLimit=10"
  },
  {
   "no": "906",
   "title": "[한화오션] `25년 상반기 신입사원 채용 모집/ 회사초청 설명회 안내",
   "date": "2025.03.13",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=222473&article.offset=20&articleLimit=10"
  },
  {
   "no": "905",
   "title": "2025년도 ITER기구 인턴십 안내",
   "date": "2025.01.13",
   "url": "https://me.yonsei.ac.kr/me/community/job.do?mode=view&articleNo=218588&article.offset=20&articleLimit=10"
  }
 ],
 "scholarshipsInternal": [
  {
   "name": "대학배정장학금 (진리/자유장학금)",
   "detail": "· 직전학기 이수학점이 12학점 이상, 평량평균 2.50 이상인 신청자중 성적이 우수한 학생에게 진리장학금을, 가정형편이 곤란한 학생에게 자유장학금을 지급 / · 신청시기 : 6월/12월 중순부터 약 한달"
  },
  {
   "name": "연세장학금",
   "detail": "·매 학기 한국장학재단 국가장학금을 신청한 학생으로 소득 분위에 따라 국가장학금Ⅰ,Ⅱ유형을 포함하여 지원규모별 등록금차액 지원 / ·2020학년도 지원규모* / 0-3분위: 등록금 전액 4-5분위: 등록금2/3 / 6분위: 등록금 1/2 7분위: 등록금1/3 / 8분위: 100만원 / ※지원규모는 매학기 변경가능 / ·12학점 이상 이수(철회과목제외), 평량평균 2.4 이상"
  },
  {
   "name": "교내근로장학금",
   "detail": "· 직전학기 평량평균 1.4이상인 재적생으로서 교내부서에서 근로진행 / · 장학금 지급시기: 근로 후 60시간 완료 또는 월별 지급"
  },
  {
   "name": "연세특별장학금 (입학성적우수장학금)",
   "detail": "· 매학년도 신입생 모집요강에 공표된 기준에 따라 대상자 선정 및 지급 / · 계속 지원 조건: 직전학기 15학점 이상 이수, 평량 평균 3.5 이상"
  },
  {
   "name": "연세우수학생 프로그램 장학금",
   "detail": "· 매학년도 신입생 모집요강에 공표된 기준에 따라 대상자 선정 및 지급 / · 계속 지원 조건: 직전학기 평량 평균 3.5이상, 총 3회 미달시 장학금 지급 종료"
  },
  {
   "name": "연세한마음장학금",
   "detail": "· 연세한마음 전형으로 입학한 학생. 등록금 전액과 매 학기 교재비 120만원 지원 / · 계속 지원 조건: 소득분위 1분위 이내로 유지(국가장학금 신청결과로 확인) 직전학기 12학점 이상 이수, 평량평균 1.75 이상. 누적 3회 이수학점 및 학업성적 미달시 장학금 지급 종료"
  },
  {
   "name": "국가고시장학금",
   "detail": "· 재학 중 사법, 행정, 외무, 기술고등고시 또는 이에 준하는 시험의 1차 합격자와 공인회계사, 변리사 최종 합격자에게 국가고시장학금(100만원)을 지급. 재학 중 1회 지원하며 휴학자나 학기초과자는 수혜불가. / · 신청시기: 당월 9일까지 합격증 사본을 국가고시지원센터에 접수한 경우 해당 월 20일 이내 지급"
  },
  {
   "name": "VSP 장학금",
   "detail": "· Visiting Student Program에 선발되어 해외대학에 파견되는 학생 중 국제처장이 추천하는 학생에게 등록금의 80% 금액을 지급 / · 파견시기 2학기 이전에 신청 공지되며, 최종합격여부는 파견 1개월이전 확정 / · 자세한 사항은 국제처 홈페이지(oia.yonsei.ac.kr) 공지사항 참조"
  },
  {
   "name": "봉사장학금",
   "detail": "· 총학생회 및 학생자치기구에서 봉사활동을 통해 학교발전(학생활동)에 기여하는 학생중에서 학생복지처장이 추천하고  ‘봉사장학금 업무처리 지침’에 따라 선정 및 지급"
  },
  {
   "name": "평화장학금",
   "detail": "· 대학언론사(연세춘추, 연세애널스, 연세교육방송국)에서 활동하는 학생중 신문방송편집인이 추천하는 학생으로서 직전학기 2.0이상인 자에게 편집인이 지정한 금액을 지급"
  },
  {
   "name": "국가유공장학금",
   "detail": "·국가유공자 등 예우 및 지원에 관한 법률이 규정하는 요건충족자에게 등록금 전액지급 / ·등록기간 전 대학 수업료 면제대상자 증명서 원본을 학생지원팀 장학파트로 제출한 경우, 제출학기부터 수혜가능횟수 이내 지원"
  },
  {
   "name": "북한이탈주민 장학금",
   "detail": "·북한이탈주민의 보호 및 정착지원에 관한 법률이 규정하는 요건충족자에게 전액지급 / ·등록기간 전 교육지원 대상자 증명서 원본을 학생지원팀 장학파트로 제출한 경우, 제출학기부터 수혜가능횟수 이내 지원"
  }
 ],
 "scholarshipsExternal": [
  {
   "name": "박정옥 장학생",
   "fields": {
    "추천기준": "대학배정 장학금을 신청한 학생으로 품행이 단정하고 가정형편 어려운 학생 (교내장학금 지급기준 참고)",
    "선발인원": "공과대학 1명",
    "장학금액": "2,000,000원",
    "선발시기": "1월 또는 8월 (연 1회)"
   }
  },
  {
   "name": "현송교육문화재단 장학생",
   "fields": {
    "추천기준": "선발학기 기준 기계공학, 신소재공학 학부 2학년 재학생으로 성적이 평점 3.3/4.3이상인 자로서 학비조달에 어려움을 겪는 학생을 우선으로 하여(소득분위 3분위이내) 주임교수 추천을 받은 학생",
    "선발인원": "기계공학 1명",
    "장학금액": "4,000,000원(학기당, 성적기준충족시) 생활비지원 장학금으로 국가장학금과 이중수혜가 가능함",
    "선발시기": "1월 말 (연1회)"
   }
  },
  {
   "name": "김순전 장학생",
   "fields": {
    "추천기준": "1) 경제적으로 형편이 어려운 학생 2) 직전학기 12학점 이수하고 평량평균 2.5이상인 학생",
    "선발인원": "공과대학 2명",
    "장학금액": "1,500,000원",
    "선발시기": "1월 말, 7월 말 (연 2회)"
   }
  },
  {
   "name": "삼송장학회",
   "fields": {
    "추천기준": "1) 전기전자공학, 기계공학과 2020학년도 정규학기 재학예정생 2) 품행이 방정하고 근면, 성실한 학생 3) 직전학기(19년 2학기)성적 B학점(3.0) 이상, 과목중 F학점이 없는 자 4) 학업성적, 가정형편, 학기 계속 등록자(직전학기 휴학자 제외)를 우선으로 추천",
    "선발인원": "2명 (성적우수 장학생)",
    "장학금액": "년간 400만원(학기별 200만원), 등록금지원",
    "선발시기": "1월 중순 (연 1회)"
   }
  },
  {
   "name": "대상문화재단 장학생",
   "fields": {
    "추천기준": "1) 경영학과, 기계공학과 2학년 진급예정자 2) 1학년 평점평균 3.83/4.3(4.0/4.5) 이상으로 재단에서 주관하는 행사에 적극적으로 참여가능하며 학교, 사회단체, 기업, 정부 등으로부터 장학금을 지원받지 않는 자",
    "선발인원": "기계공학과 2명 추천 (최종 선발 학과별 각1명)",
    "장학금액": "년간 900만원 계속수혜조건 만족시 3년 지원(4학년 졸업시까지 6학기)",
    "선발시기": "1월 초 (연 1회)"
   }
  },
  {
   "name": "양영재단 장학생",
   "fields": {
    "추천기준": "1) 선발학기 기준 3학년 1학기 진급예정자 2) 직전 2개 학기 평량평균이 우수(전체평점 최소 3.5) 하고 가정형편이 어려운 자",
    "장학금액": "공학계열 900만원(연간)",
    "선발시기": "1월 초 (연 1회)"
   }
  },
  {
   "name": "서봉 이충곤 장학기금",
   "fields": {
    "추천기준": "1) 연세대학교 재학생으로서 올바른 품행을 지닌 자 2) 투철한 국가관과 이웃을 위해 봉사할 의지와 소양을 가진 자 3) 가계곤란으로 인행 학업 수행이 어려운자",
    "선발인원": "기계공학 5명 내외",
    "장학금액": "심사 후 결정",
    "선발시기": "2월 초, 8월 초 (연 2회)"
   }
  },
  {
   "name": "KT 미래창조인재 장학생",
   "fields": {
    "추천기준": "정규 학기 재학생 중 다음 각 호 중 1에 해당하는 자 - ICT 관련 학과 재학생 - ICT 관련 활동 경력자(동아리구성, 공모전수상, 관련봉사활동 경력 등) - 사회활동 우수자 및 봉사정신이 투철한 자 ※ 기초생활수급자, 차상위계층 우선 순위 ※ 최소 성적 기준: 2.0/4.5 이상",
    "선발인원": "2명",
    "장학금액": "2명 합계 최대 4,000,000원 - 등록금 목적의 장학금으로, 등록금 범위내에서 지급가능하며, 1회성으로 지급되는 장학금임 - 1인당 장학금액은 등록금의 50% 이내",
    "선발시기": "6월, 9월 (연 2회)"
   }
  },
  {
   "name": "성련장학재단 장학생",
   "fields": {
    "추천기준": "1) 선발학기 기준 2~3학년 학생 2) 선발학기 등록예정 학생으로 전체학기 성적이 3.30/4.30 이상인 자 3) 부/모 연간 소득 합산 60,000,000원 이하/ 월 건강보험료 합산 160,000원 이하/ 연간 순 재산세 합산 450,000원 이하",
    "선발인원": "공과대학 2명 추천",
    "장학금액": "한학기 등록금 전액 (등록금 범위내 지급)",
    "선발시기": "7월 중순, 1월 중순 (연 2회)"
   }
  },
  {
   "name": "염곡문화재단 장학생",
   "fields": {
    "추천기준": "1)직전학기 15학점 이상이며, 평량평균 3.75/4.5 이상인 자 2)교내외장학금을 수혜받지 못해 경제적 도움이 필요한 자",
    "선발인원": "공과대학 1명",
    "장학금액": "등록금 전액 (졸업 시까지 지급)",
    "선발시기": "8월 초"
   }
  },
  {
   "name": "송원김영환장학재단",
   "fields": {
    "추천기준": "1) 소득분위 0~3분위 2) 선발학기 기준 2,3학년 진급 예정 재학생 3) 전체 학기 성적 평점이 3.0이상인 재학생",
    "선발인원": "공과대학 1명(변동 가능)",
    "장학금액": "학기당 500만원 - 국가장학금1유형 외 다른 장학금 수혜불가, 등록금 초과수혜 부분은 생활비로 지급함(근로장학금은 수혜가능) - 정규학기 졸업시까지 지원",
    "선발시기": "11월 (연 1회)"
   }
  },
  {
   "name": "정봉숙장학금",
   "fields": {
    "추천기준": "1) 본교에 재학 중인 정규학기 학부생 2) 경제적으로 형편이 어려운 학생으로서 직전학기 12학점 이상을 이수하여야 하며 평량평균이 2.5 이상인 자​",
    "선발인원": "공과대학 2명",
    "장학금액": "1인당 1,000,000원 (등록금 또는 생활비 지원 가능)",
    "선발시기": "11월 말"
   }
  },
  {
   "name": "KC 미래장학재단",
   "fields": {
    "추천기준": "우수 인재로서 장학금 지원이 필요한 반도체, 디스플레이 산업 관련 학과 2,3학년 재학생",
    "선발인원": "학교당 2명 내외(변동 가능)",
    "장학금액": "매학기 등록금 실비 지원 - 매 학기 일정한 평가를 거쳐 졸업 시까지 지급(전체 8학기 졸업기준) - 타 장학금 수혜 시 중복지원은 불가능 (단, 감면금액의 일정비율로 교재비 지원)",
    "선발시기": "11월 말 (연 1회)"
   }
  },
  {
   "name": "삼화지봉장학재단",
   "fields": {
    "추천기준": "1) 2학년 이상의 학생(선발 직전학기 재학중인 자) 2) 타 재단 또는 장학회의 장학금 혜택을 받고 있지 아니한 자 3) 선발 직전학기의 학업성적이 B학점(3.0) 이상인 자 4) 학업성적은 양호하나 가정생계가 곤란한 자(특히 가장역을 겸하여 면학하는 자)",
    "선발인원": "공과대학 5명 (최종 재단 선발 3명)",
    "장학금액": "200만원(등록금성 장학금)",
    "선발시기": "12월 말 (연 1회)"
   }
  },
  {
   "name": "박영필장학금",
   "fields": {
    "추천기준": "기계공학부 재학생으로 다음 각 호 중 1에 해당하는 자 ① 재능은 있으나 가정 형편이 어려워 학자금 보조를 필요로 하는 학생 중에 해당학기에 12학점이상을 이수함을 원칙으로 하고, 직전학기 평량평균 2.5이상인 학생 ② 또는 학업성적이 매우 우수한 학생 ③ 뛰어난 아이디어를 가지고 창업을 준비하는 학생 ④ 그 외 학교 장학금 지급 기준에 맞는 학생",
    "선발인원": "1명",
    "장학금액": "1,2학기 등록금 전액",
    "선발시기": "1월 (연 1회)"
   }
  },
  {
   "name": "DCT장학금",
   "fields": {
    "추천기준": "① 기계공학부 재학생 중 지방출신으로 국가장학금을 지급받으며, 직전 학년 2학기 평량평균 3.0/4.3 이상인 자 ② 선발학기 기준으로 2학년 1학기 진급예정자",
    "선발인원": "1명",
    "장학금액": "학기당 250만원 지급(정규학기 졸업시까지) 타 장학금 중복 수혜 가능",
    "선발시기": "1월 (연 1회)"
   }
  },
  {
   "name": "이슬비장학재단",
   "fields": {
    "추천기준": "기계공학부 재학생으로 선발학기 기준으로 2학년 1학기가 되는 학생 ① 성적이 우수하고 인성과 품성이 반듯하며 장래성이 크나 가정 형편이 어려운 학생 - 2020년 3월에 2학년 1학기가 되는 학생 - 학업성적 평점 3.3/4.3 이상 - 졸업시까지 계속해서 장학금 수혜가 가능한 학생(휴학없이 정규학기 졸업예정인 자) - 교내, 국가장학금 및 타 기관 장학금 수혜 대상이 아닌 학생 - 봉사활동에 열심히 활동하는 학생 우대 ② 재단이 판단하여, 장학금을 지급해주면 도움이 될 수 있는 학생",
    "선발인원": "1명",
    "장학금액": "등록금 전액 혹은 1/2에 준하는 금액",
    "선발시기": "1월 (연 1회)"
   }
  },
  {
   "name": "연어장학금",
   "fields": {
    "추천기준": "기계공학부 재학생으로 경제적으로 형편이 어렵거나 도움이 필요한 학생 (1년에 1회 선발) ① 성적무관, ② 장학금을 지급해주면 도움이 될 수 있는 학생",
    "선발인원": "2명",
    "장학금액": "600만원",
    "선발시기": "1~2월"
   }
  },
  {
   "name": "오스템임플란트장학금",
   "fields": {
    "추천기준": "연세대학교 기계공학부 재학생으로서 경제적 형편 등으로 인해 학업에 어려움을 겪어 학업성취도가 높지 않았으나 발전 가능성이 있는 학생 (직전 학기에 학사경고를 받지 않았어야 함)",
    "선발인원": "1명",
    "장학금액": "250만원",
    "선발시기": "1 ~ 2월"
   }
  }
 ],

 /* 학사일정 — 연세대학교 공식 학사일정을 그대로 옮겼다.
    2026학년도 1학기(2026.02~08) · 2학기(2026.08~2027.02) 전체.
    달을 넘는 구간은 원문에서 앞뒤 달에 한 번씩 나오지만 여기서는 한 번만 적는다.
    k — acad 학사일정 · exam 시험 · holiday 휴일·기념일 */
 "academicCalendarSource": {
  "label": "연세대학교 학사지원 › 학사일정",
  "url": "https://www.yonsei.ac.kr/sc/373/subview.do",
  "terms": "2026학년도 1학기 · 2학기",
  "verifiedAt": "2026-07-31"
 },
 "academicCalendar": [
   { "s": "2026-02-02", "e": "2026-02-02", "k": "acad", "t": "휴학 접수 시작" },
   { "s": "2026-02-09", "e": "2026-02-13", "k": "acad", "t": "2026-1학기 수강신청" },
   { "s": "2026-02-16", "e": "2026-02-18", "k": "holiday", "t": "설연휴" },
   { "s": "2026-02-22", "e": "2026-02-22", "k": "holiday", "t": "졸업예배" },
   { "s": "2026-02-23", "e": "2026-02-27", "k": "acad", "t": "2026-1학기 등록" },
   { "s": "2026-02-23", "e": "2026-02-23", "k": "acad", "t": "학위수여식, 복학 접수 마감" },
   { "s": "2026-02-24", "e": "2026-02-24", "k": "acad", "t": "2026-1학기 신입생 수강신청" },
   { "s": "2026-02-26", "e": "2026-02-26", "k": "acad", "t": "2026-1학기 2차 복학생 수강신청" },
   { "s": "2026-03-01", "e": "2026-03-01", "k": "holiday", "t": "삼일절" },
   { "s": "2026-03-02", "e": "2026-03-02", "k": "holiday", "t": "대체 휴일" },
   { "s": "2026-03-03", "e": "2026-03-03", "k": "acad", "t": "개강" },
   { "s": "2026-03-05", "e": "2026-03-05", "k": "acad", "t": "교무위원회" },
   { "s": "2026-03-05", "e": "2026-03-09", "k": "acad", "t": "수강신청 확인 및 변경" },
   { "s": "2026-03-12", "e": "2026-03-16", "k": "acad", "t": "2026-1학기 추가등록" },
   { "s": "2026-03-16", "e": "2026-03-16", "k": "acad", "t": "미등록자 일반휴학 접수 마감" },
   { "s": "2026-03-16", "e": "2026-03-20", "k": "acad", "t": "조기졸업 신청" },
   { "s": "2026-03-30", "e": "2026-04-04", "k": "holiday", "t": "고난주간" },
   { "s": "2026-04-02", "e": "2026-04-02", "k": "acad", "t": "교무위원회" },
   { "s": "2026-04-05", "e": "2026-04-05", "k": "holiday", "t": "부활절" },
   { "s": "2026-04-08", "e": "2026-04-08", "k": "acad", "t": "학기 1/3선" },
   { "s": "2026-04-14", "e": "2026-04-16", "k": "acad", "t": "수강철회" },
   { "s": "2026-04-21", "e": "2026-04-27", "k": "exam", "t": "중간시험" },
   { "s": "2026-04-28", "e": "2026-05-04", "k": "acad", "t": "2026-2학기 캠퍼스내 소속변경 신청" },
   { "s": "2026-04-28", "e": "2026-04-30", "k": "acad", "t": "S/U평가 신청" },
   { "s": "2026-05-01", "e": "2026-05-01", "k": "holiday", "t": "노동절" },
   { "s": "2026-05-05", "e": "2026-05-05", "k": "holiday", "t": "어린이날" },
   { "s": "2026-05-06", "e": "2026-05-06", "k": "holiday", "t": "은퇴교수의날" },
   { "s": "2026-05-07", "e": "2026-05-07", "k": "acad", "t": "교무위원회" },
   { "s": "2026-05-09", "e": "2026-05-09", "k": "holiday", "t": "창립기념일" },
   { "s": "2026-05-15", "e": "2026-05-15", "k": "acad", "t": "학기 2/3선, 일반휴학 접수 마감" },
   { "s": "2026-05-18", "e": "2026-05-18", "k": "acad", "t": "질병휴학 접수시작" },
   { "s": "2026-05-24", "e": "2026-05-24", "k": "holiday", "t": "부처님 오신 날, 성령강림절" },
   { "s": "2026-05-25", "e": "2026-05-25", "k": "holiday", "t": "대체 휴일" },
   { "s": "2026-05-26", "e": "2026-06-08", "k": "acad", "t": "2026-2학기 재입학 신청" },
   { "s": "2026-06-03", "e": "2026-06-03", "k": "holiday", "t": "2026 지방선거" },
   { "s": "2026-06-04", "e": "2026-06-04", "k": "acad", "t": "교무위원회" },
   { "s": "2026-06-06", "e": "2026-06-06", "k": "holiday", "t": "현충일" },
   { "s": "2026-06-09", "e": "2026-06-15", "k": "acad", "t": "자율학습 및 보충수업 기간" },
   { "s": "2026-06-16", "e": "2026-06-22", "k": "exam", "t": "학기말 시험" },
   { "s": "2026-06-23", "e": "2026-06-29", "k": "acad", "t": "2026-2학기 캠퍼스내 복수전공·융복합전공·융합심화전공 신청" },
   { "s": "2026-06-23", "e": "2026-06-23", "k": "acad", "t": "여름방학 시작" },
   { "s": "2026-06-29", "e": "2026-06-29", "k": "acad", "t": "여름계절제 수업시작, 2026-1학기 성적제출 마감" },
   { "s": "2026-07-13", "e": "2026-07-13", "k": "acad", "t": "2026-2학기 복학 접수 시작" },
   { "s": "2026-07-17", "e": "2026-07-17", "k": "holiday", "t": "제헌절" },
   { "s": "2026-07-21", "e": "2026-07-21", "k": "acad", "t": "여름계절제 수업 종료" },
   { "s": "2026-08-03", "e": "2026-08-03", "k": "acad", "t": "2026-2학기 휴학 접수 시작" },
   { "s": "2026-08-10", "e": "2026-08-14", "k": "acad", "t": "2026-2학기 수강신청" },
   { "s": "2026-08-15", "e": "2026-08-15", "k": "holiday", "t": "광복절" },
   { "s": "2026-08-17", "e": "2026-08-17", "k": "holiday", "t": "대체 휴일" },
   { "s": "2026-08-21", "e": "2026-08-27", "k": "acad", "t": "2026-2학기 등록" },
   { "s": "2026-08-24", "e": "2026-08-24", "k": "acad", "t": "2026-2학기 복학 접수 마감" },
   { "s": "2026-08-25", "e": "2026-08-25", "k": "acad", "t": "2026-2학기 신입생 수강신청" },
   { "s": "2026-08-27", "e": "2026-08-27", "k": "acad", "t": "2026-2학기 2차 복학생 수강신청" },
   { "s": "2026-08-28", "e": "2026-08-28", "k": "acad", "t": "학위수여식" },
   { "s": "2026-09-01", "e": "2026-09-01", "k": "acad", "t": "개강" },
   { "s": "2026-09-03", "e": "2026-09-03", "k": "acad", "t": "교무위원회" },
   { "s": "2026-09-03", "e": "2026-09-07", "k": "acad", "t": "수강신청 확인 및 변경" },
   { "s": "2026-09-10", "e": "2026-09-14", "k": "acad", "t": "2026-2학기 추가등록" },
   { "s": "2026-09-14", "e": "2026-09-14", "k": "acad", "t": "미등록자 일반휴학 접수 마감" },
   { "s": "2026-09-14", "e": "2026-09-18", "k": "acad", "t": "조기졸업 신청" },
   { "s": "2026-09-24", "e": "2026-09-26", "k": "holiday", "t": "추석 연휴" },
   { "s": "2026-10-01", "e": "2026-10-01", "k": "acad", "t": "교무위원회" },
   { "s": "2026-10-03", "e": "2026-10-03", "k": "holiday", "t": "개천절" },
   { "s": "2026-10-05", "e": "2026-10-05", "k": "holiday", "t": "대체 휴일" },
   { "s": "2026-10-07", "e": "2026-10-07", "k": "acad", "t": "학기 1/3선" },
   { "s": "2026-10-09", "e": "2026-10-09", "k": "holiday", "t": "한글날" },
   { "s": "2026-10-13", "e": "2026-10-15", "k": "acad", "t": "수강철회" },
   { "s": "2026-10-20", "e": "2026-10-26", "k": "exam", "t": "중간시험" },
   { "s": "2026-10-27", "e": "2026-11-02", "k": "acad", "t": "2027-1학기 캠퍼스내 소속변경 신청" },
   { "s": "2026-10-27", "e": "2026-10-29", "k": "acad", "t": "S/U평가 신청" },
   { "s": "2026-11-05", "e": "2026-11-05", "k": "acad", "t": "교무위원회" },
   { "s": "2026-11-13", "e": "2026-11-13", "k": "acad", "t": "학기 2/3선, 일반휴학 접수 마감" },
   { "s": "2026-11-15", "e": "2026-11-15", "k": "holiday", "t": "추수감사절" },
   { "s": "2026-11-16", "e": "2026-11-16", "k": "acad", "t": "질병휴학 접수시작" },
   { "s": "2026-11-23", "e": "2026-12-04", "k": "acad", "t": "2027-1학기 재입학 신청" },
   { "s": "2026-11-24", "e": "2026-11-30", "k": "acad", "t": "2027학년도 캠퍼스간 소속변경 신청" },
   { "s": "2026-12-03", "e": "2026-12-03", "k": "holiday", "t": "교무위원회, 성탄절 예배" },
   { "s": "2026-12-08", "e": "2026-12-14", "k": "acad", "t": "자율학습 및 보충수업 기간" },
   { "s": "2026-12-15", "e": "2026-12-21", "k": "exam", "t": "학기말 시험" },
   { "s": "2026-12-22", "e": "2026-12-28", "k": "acad", "t": "2027-1학기 캠퍼스내 복수전공·융복합전공·융합심화전공 신청" },
   { "s": "2026-12-22", "e": "2026-12-22", "k": "acad", "t": "겨울방학시작" },
   { "s": "2026-12-25", "e": "2026-12-25", "k": "holiday", "t": "성탄절" },
   { "s": "2026-12-28", "e": "2026-12-28", "k": "acad", "t": "겨울계절제 수업 시작, 2026-2학기 성적제출 마감" },
   { "s": "2027-01-01", "e": "2027-01-01", "k": "holiday", "t": "신정" },
   { "s": "2027-01-11", "e": "2027-01-11", "k": "acad", "t": "2027-1학기 복학 접수 시작" },
   { "s": "2027-01-19", "e": "2027-01-19", "k": "acad", "t": "겨울계절제 수업 종료" },
   { "s": "2027-02-01", "e": "2027-02-01", "k": "acad", "t": "2027-1학기 휴학 접수 시작" },
   { "s": "2027-02-06", "e": "2027-02-08", "k": "holiday", "t": "설 연휴" },
   { "s": "2027-02-09", "e": "2027-02-09", "k": "holiday", "t": "대체 휴일" },
   { "s": "2027-02-15", "e": "2027-02-19", "k": "acad", "t": "2027-1학기 수강신청" },
   { "s": "2027-02-21", "e": "2027-02-21", "k": "holiday", "t": "졸업예배" },
   { "s": "2027-02-22", "e": "2027-02-22", "k": "acad", "t": "학위수여식, 2027-1학기 복학 접수 마감" },
   { "s": "2027-02-23", "e": "2027-02-23", "k": "acad", "t": "2027-1학기 신입생 수강신청" },
   { "s": "2027-02-25", "e": "2027-02-25", "k": "acad", "t": "2027-1학기 2차 복학생 수강신청" }
 ]

};
