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
   "ko": "역학·소재",
   "en": "Mechanics & Materials",
   "count": 6,
   "desc": "금속·복합재·연성재료가 힘을 받아 어떻게 변형하고 파손되는지 실험과 시뮬레이션으로 규명합니다.",
   "intro": "역학·소재 분야는 금속·복합재·연성재료가 힘을 받을 때 어떻게 변형하고 파손되는지를 전산 시뮬레이션과 정밀 실험으로 규명합니다. 마찰과 마모(트라이볼로지), 파손, 마이크로 스케일의 응력까지 함께 다뤄, 더 가볍고 튼튼하며 오래가는 부품과 구조를 설계합니다.",
   "theme": "mechanics"
  },
  {
   "id": "thermal",
   "ko": "에너지·열유체",
   "en": "Energy / Thermal-Fluid Systems",
   "count": 7,
   "desc": "난류·미세유동과 연소·열전달을 해석해 연료전지·수소·배터리처럼 에너지를 다루는 기술을 연구합니다.",
   "intro": "에너지·열유체 분야는 난류와 미세유동의 물리를 전산유체역학(CFD)과 정밀 실험으로 해석합니다. 연소·청정에너지, 열전달, 연료전지·수소·배터리 같은 에너지 변환 기술을 연구하며, 자동차부터 발전과 친환경 모빌리티까지 에너지를 더 효율적으로 다루는 과제를 풉니다.",
   "theme": "thermofluid"
  },
  {
   "id": "dynamics",
   "ko": "로보틱스·제어",
   "en": "Robotics & Intelligent Control",
   "count": 4,
   "desc": "로봇과 자율 시스템이 스스로 감지하고 정밀하게 움직이도록 제어와 메카트로닉스를 연구합니다.",
   "intro": "로보틱스·제어 분야는 정밀 서보 제어와 광메카트로닉스, 인간 중심 로보틱스, 기계학습 기반 제어를 연구합니다. 기계가 스스로 감지하고 판단하며 정밀하게 움직이도록 만드는 것이 목표로, 로봇과 자율 시스템, 초정밀 구동기, 진동·소음 제어가 핵심 주제입니다.",
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
  { "ko": "김천욱", "en": "KIM, Cheon Uk", "rank": "명예교수", "field": "고체역학", "term": "1963–2002" },
  { "ko": "민옥기", "en": "MIN, Ok Gi", "rank": "명예교수", "field": "응용역학", "term": "1983–2013" },
  { "ko": "박영필", "en": "PARK, Yeong Pil", "rank": "명예교수", "field": "동역학 · 기계진동 · 진동제어", "term": "1977–2013" },
  { "ko": "백윤수", "en": "BAEK, Yun Su", "rank": "명예교수", "field": "", "term": "" },
  { "ko": "이강용", "en": "LEE, Gang Yong", "rank": "명예교수", "field": "파괴역학", "term": "1980–2012" },
  { "ko": "이상조", "en": "LEE, Sang Jo", "rank": "명예교수", "field": "생산공학", "term": "1986–2019" },
  { "ko": "이수홍", "en": "LEE, Soo Hong", "rank": "명예교수", "field": "AI CAD/CAM 동시공학설계", "term": "1994–2024" },
  { "ko": "이진호", "en": "LEE, Jin Ho", "rank": "명예교수", "field": "AI CAD/CAM 동시공학설계 · 열공학", "term": "1983–2018" },
  { "ko": "임윤철", "en": "LIM, Yun Cheol", "rank": "명예교수", "field": "AI CAD/CAM 동시공학설계", "term": "" },
  { "ko": "전광민", "en": "JEON, Gwang Min", "rank": "명예교수", "field": "", "term": "" },
  { "ko": "조강래", "en": "CHO, Gang Rae", "rank": "명예교수", "field": "유체역학", "term": "1971–2002" },
  { "ko": "조형희", "en": "CHO, Hyeong Hee", "rank": "명예교수", "field": "", "term": "" },
  { "ko": "주원구", "en": "JOO, Won Gu", "rank": "명예교수", "field": "", "term": "" },
  { "ko": "차성운", "en": "CAH, Seong Un", "rank": "명예교수", "field": "", "term": "" },
  { "ko": "최용제", "en": "CHOI, Yong Je", "rank": "명예교수", "field": "", "term": "" },
  { "ko": "한재원", "en": "HAHN, Jae Won", "rank": "명예교수", "field": "", "term": "" },
  { "ko": "황정호", "en": "HWANG, Jeong Ho", "rank": "명예교수", "field": "", "term": "" }
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
    "en": "Energy / Thermal-Fluid Systems"
   },
   {
    "ko": "로보틱스 · 제어",
    "en": "Robotics & Intelligent Control"
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
   "title": "2026학년도 2학기 재입학 전형 안내문",
   "date": "2026.05.29",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=471922&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "공지",
   "title": "2026 공과대학 'ZERO to AI Challenge' 공모 안내",
   "date": "2026.05.11",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=470673&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "공지",
   "title": "[필독] 교과목 수강 및 졸업 관련 주요 문의 사항에 대한 답변",
   "date": "2023.02.13",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=159666&article.offset=0&articleLimit=10",
   "att": false
  },
  {
   "no": "722",
   "title": "2026학년도 2학기 학생설계전공 제도 시행 안내",
   "date": "2026.05.12",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=470828&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "721",
   "title": "[항공우주전략연구원] 2026년 연세 우주항공 주간 개최 안내",
   "date": "2026.05.08",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=470620&article.offset=0&articleLimit=10",
   "att": false
  },
  {
   "no": "720",
   "title": "2026 공과대학 외국인 격려행사(Global Day in College of Engineering) 안내",
   "date": "2026.04.14",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=469038&article.offset=0&articleLimit=10",
   "att": false
  },
  {
   "no": "719",
   "title": "2026학년도 2학기 캠퍼스내 소속변경 전형 안내",
   "date": "2026.04.08",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=468472&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "718",
   "title": "2026학년도 여름학기 미주개발은행 인턴십 프로그램 안내",
   "date": "2026.04.08",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=468471&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "717",
   "title": "2026학년도 1학기 졸업앨범 사진촬영 관련 안내",
   "date": "2026.04.07",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=468326&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "716",
   "title": "2026학년도 1학기 학부 수강과목 철회 안내 (Course Withdrawal)",
   "date": "2026.03.27",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=467481&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "715",
   "title": "AI캠퍼스 구축을 위한 \"라이너 프로\" 무상 지원 관련 안내",
   "date": "2026.03.25",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=467259&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "714",
   "title": "국제캠퍼스 도서관 신분증·학생증 발급 창구 운영 종료 안내",
   "date": "2026.03.19",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=466874&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "713",
   "title": "2026학년도 1학기 수림재단 신규 장학생 선발 안내",
   "date": "2026.03.17",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=466611&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "공지",
   "title": "2026학년도 2학기 재입학 전형 안내문",
   "date": "2026.05.29",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=471922&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "공지",
   "title": "2026 공과대학 'ZERO to AI Challenge' 공모 안내",
   "date": "2026.05.11",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=470673&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "공지",
   "title": "[필독] 교과목 수강 및 졸업 관련 주요 문의 사항에 대한 답변",
   "date": "2023.02.13",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=159666&article.offset=10&articleLimit=10",
   "att": false
  },
  {
   "no": "712",
   "title": "제3기 차세대 공학(연구)자 신청 안내",
   "date": "2026.03.10",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=466071&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "711",
   "title": "2026-1학기 학부연구(1) 연구참여 신청서 제출 안내 (신청서 제출마감: 3.13.(금) 17:00까지)",
   "date": "2026.03.10",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=466066&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "710",
   "title": "[학부] 수강신청 증원 교과목 안내 (개강 이후 증원 과목, 수시 업데이트 예정)",
   "date": "2026.03.05",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=465521&article.offset=10&articleLimit=10",
   "att": false
  },
  {
   "no": "709",
   "title": "신촌캠퍼스 전체 정전안내(전기시설물의 법정 점검 및 보완공사)",
   "date": "2026.02.19",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=464412&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "708",
   "title": "[학부] 수강신청 증원 교과목 안내 (수시 업데이트 예정)",
   "date": "2026.02.12",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=464239&article.offset=10&articleLimit=10",
   "att": false
  },
  {
   "no": "707",
   "title": "[학부] 2026년 2월 졸업자 학위수여식 및 학위가운 대여 안내",
   "date": "2026.02.10",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=464123&article.offset=10&articleLimit=10",
   "att": false
  },
  {
   "no": "706",
   "title": "진리자유학부 및 소속변경학생 대상 수·과학 교양교과목 대체인정 기준 안내",
   "date": "2026.02.09",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=464019&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "705",
   "title": "[필독] 2026학년도 1학기 학부 수강신청 안내",
   "date": "2026.01.30",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=463508&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "704",
   "title": "[공사 안내] 제4공학관 데이터센터 구축공사",
   "date": "2026.01.14",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=462655&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "703",
   "title": "기계공학과 2025 겨울학기 해외집중강의 시리즈 수강생 모집 안내(~1/15(목) 13시까지)",
   "date": "2026.01.09",
   "url": "https://me.yonsei.ac.kr/me/community/notice.do?mode=view&articleNo=462408&article.offset=10&articleLimit=10",
   "att": true
  }
 ],
 "noticesGrad": [
  {
   "no": "공지",
   "title": "[대학원] 대학원 학사요람 (2025.08.개정)",
   "date": "2024.05.29",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=190313&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "608",
   "title": "2026학년도 박사우수장학금(이공계) 및 석사우수장학금(이공계) 신규 장학생 신청 안내",
   "date": "2026.05.29",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=471936&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "607",
   "title": "2026-1학기 학위논문 본심사 및 졸업 관련 안내",
   "date": "2026.05.20",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=471444&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "606",
   "title": "2026학년도 후기 「대학원 연세우수학생장학금 II」신청 안내",
   "date": "2026.05.16",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=471122&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "605",
   "title": "[대학원] 2026-1학기 K-STAR 비자트랙 프로그램 신청 안내 (외국인 대상)",
   "date": "2026.05.14",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=470996&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "604",
   "title": "2026학년도 1학기 연세대학교 K-STAT 비자트랙 안내 및 설명회 개최 안내",
   "date": "2026.05.12",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=470795&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "603",
   "title": "2026년 전기 전문연구요원 편입대상자 선발 공고",
   "date": "2026.05.11",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=470758&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "602",
   "title": "[항공우주전략연구원] 2026년 연세 우주항공 주간 개최 안내",
   "date": "2026.05.08",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=470621&article.offset=0&articleLimit=10",
   "att": false
  },
  {
   "no": "601",
   "title": "2026년 대학원 대통령과학장학금 신규장학생 선발 안내",
   "date": "2026.04.17",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=469264&article.offset=0&articleLimit=10",
   "att": false
  },
  {
   "no": "600",
   "title": "2026 공과대학 외국인 격려행사(Global Day in College of Engineering) 안내",
   "date": "2026.04.14",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=469037&article.offset=0&articleLimit=10",
   "att": false
  },
  {
   "no": "599",
   "title": "2026학년도 신동욱 해외연수 장학생 신청 안내",
   "date": "2026.04.10",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=468687&article.offset=0&articleLimit=10",
   "att": true
  },
  {
   "no": "공지",
   "title": "[대학원] 대학원 학사요람 (2025.08.개정)",
   "date": "2024.05.29",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=190313&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "598",
   "title": "2026학년도 1학기 대학원 학사 지도 체계화를 위한 APR 시스템 활용 안내",
   "date": "2026.04.08",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=468513&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "597",
   "title": "2026학년도 학문후속세대 국제공동연구사업 I 홍보",
   "date": "2026.04.07",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=468329&article.offset=10&articleLimit=10",
   "att": false
  },
  {
   "no": "596",
   "title": "일반대학원 학위논문 양식 개편 안내",
   "date": "2026.03.30",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=467645&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "595",
   "title": "2026학년도 1학기 가계 곤란 장학금(Need-based Fellowship) 시행 안내",
   "date": "2026.03.26",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=467339&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "594",
   "title": "[재단법인 이재운장학회] 2026학년도 장학생 추천 요청",
   "date": "2026.03.24",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=467173&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "593",
   "title": "2026년 8월 졸업예정자 학술활동 증빙자료 제출 안내",
   "date": "2026.03.23",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=467146&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "592",
   "title": "2026-1학기 대학원혁신 우수논문상 신청 안내",
   "date": "2026.03.23",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=467137&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "591",
   "title": "2026-1학기 대학원 학위논문 심사지침 안내 (대면심사 원칙)",
   "date": "2026.03.20",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=466999&article.offset=10&articleLimit=10",
   "att": true
  },
  {
   "no": "590",
   "title": "일반대학원] 2026-1학기 수강철회 안내",
   "date": "2026.03.13",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=466348&article.offset=10&articleLimit=10",
   "att": false
  },
  {
   "no": "589",
   "title": "2026-1학기 재학생 외국어 성적 제출 안내",
   "date": "2026.03.13",
   "url": "https://me.yonsei.ac.kr/me/community/notice2.do?mode=view&articleNo=466340&article.offset=10&articleLimit=10",
   "att": true
  }
 ],
 "newsList": [
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
   "no": "370",
   "title": "[학부 세미나] 5/29(금) 임근배 교수(포항공과대학교 기계공학과) \"Mechanics for Biomedical Engineering\"",
   "date": "2026.05.28",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=471882&article.offset=0&articleLimit=10"
  },
  {
   "no": "369",
   "title": "[대학원 세미나] 5/29(금) 정성남 교수(건국대학교 항공우주·모빌리티공학과) \"Overall Rotorcraft Aeromechanics Research Activities at KonkukUniversity\"",
   "date": "2026.05.28",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=471863&article.offset=0&articleLimit=10"
  },
  {
   "no": "368",
   "title": "[BK세미나] 6/1(월) 강용태 교수(고려대학교 기계공학과) \"솝션열배터리 및 액상 쌍극자 칼로릭 냉장 사이클\"",
   "date": "2026.05.22",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=471574&article.offset=0&articleLimit=10"
  },
  {
   "no": "367",
   "title": "[학부 세미나] 5/22(금) 김원정 교수(연세대학교 기계공학부) \"미세유체역학 이해 및 연구 사례 소개\"",
   "date": "2026.05.19",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=471248&article.offset=0&articleLimit=10"
  },
  {
   "no": "366",
   "title": "[대학원 세미나] 5/22(금) 강구민 박사(한국과학기술연구원) \"Nanophotonic Structures for Spectral Tailoring: From Transparent Photovoltaics to",
   "date": "2026.05.19",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=471247&article.offset=0&articleLimit=10"
  },
  {
   "no": "365",
   "title": "[BK세미나] 5/21(목) Prof. Albert Kim(University of South Florida) \"Acousto-Bioelectronics\"",
   "date": "2026.05.13",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=470874&article.offset=0&articleLimit=10"
  },
  {
   "no": "364",
   "title": "[학부 세미나] 5/15(금) 유준호(연세대학교 기계공학부) \"AI 시대 무엇을 준비해야 하는가\"",
   "date": "2026.05.13",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=470870&article.offset=0&articleLimit=10"
  },
  {
   "no": "363",
   "title": "[대학원 세미나] 5/15(금) 이성희 박사(한국생산기술연구원) \"폴리머부품 대량제조에서 디지털엔지니어링 기술\"",
   "date": "2026.05.13",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=470869&article.offset=0&articleLimit=10"
  },
  {
   "no": "362",
   "title": "[학부 세미나]5/8(금) 심상준(연세대학교 기계공학부) \"유연 촉각 피드백 장치\"",
   "date": "2026.05.06",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=470425&article.offset=0&articleLimit=10"
  },
  {
   "no": "361",
   "title": "[대학원 세미나] 5/8(금) 차성운 교수(연세대학교 기계공학부) \"슈뢰딩거의 고양이와 노벨상\"",
   "date": "2026.05.06",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=470424&article.offset=0&articleLimit=10"
  },
  {
   "no": "360",
   "title": "[학부 세미나] 4/17(금) 홍종섭 교수(연세대학교 기계공학부) \"전기화학 에너지 시스템의 열공학적 연구\"",
   "date": "2026.04.14",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=469026&article.offset=10&articleLimit=10"
  },
  {
   "no": "359",
   "title": "[대학원 세미나] 4/17(금) 표동범 박사(한국생산기술연구원) \"Sim-to-Real for Robot Manipulation: 가상에서 학습한 지능의 현실 전이\"",
   "date": "2026.04.14",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=469025&article.offset=10&articleLimit=10"
  },
  {
   "no": "358",
   "title": "[BK세미나] 4/16(목) 김문일 교수(가천대학교) \"Active site engineering of nanozymes for advanced point-of-care biosensing and beyond\"",
   "date": "2026.04.09",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=468575&article.offset=10&articleLimit=10"
  },
  {
   "no": "357",
   "title": "[학부 세미나] 4/10(금) 이호성 교수(Western Michigan University) \"About Heat Energy in terms of Thermodynamics, Heat Transfer, and \"",
   "date": "2026.04.07",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=468408&article.offset=10&articleLimit=10"
  },
  {
   "no": "356",
   "title": "[대학원 세미나] 4/10(금) 이은호 박사(고려대학교 경제기술안보연구원) \"AI 시대에서 대만의 호황과 그 배경 - 21세기 초반의 침체에서 재도약한 비결\"",
   "date": "2026.04.07",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=468405&article.offset=10&articleLimit=10"
  },
  {
   "no": "355",
   "title": "[학부 세미나] 4/3(금) 민경민 교수(연세대학교 기계공학부) \"AI 기반 멀티스케일 시뮬레이션의 혁신\"",
   "date": "2026.04.01",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=467768&article.offset=10&articleLimit=10"
  },
  {
   "no": "354",
   "title": "[대학원 세미나] 4/3(금) 소병식 부사장(삼성물산) \"미래 인재상에 필요한 기계공학도가 가져야 할 의식 수준\"",
   "date": "2026.04.01",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=467764&article.offset=10&articleLimit=10"
  },
  {
   "no": "353",
   "title": "[BK세미나] 4/2(목) Dr. Michael Tanksalvala(NIST) \"EUV Ptychographic reflectometry for measuring nanoscale structure and tran",
   "date": "2026.04.01",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=467763&article.offset=10&articleLimit=10"
  },
  {
   "no": "352",
   "title": "[학부 세미나] 3/27(금) 이종학 소장(LIG넥스원 C5ISR기계융합연구소) \"현대전과 무기체계의 발전 그리고 기계공학\"",
   "date": "2026.03.24",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=467168&article.offset=10&articleLimit=10"
  },
  {
   "no": "351",
   "title": "[대학원 세미나] 3/27(금) 유만선 관장(서울시립과학관) \"과학관에 간 공학자\"",
   "date": "2026.03.24",
   "url": "https://me.yonsei.ac.kr/me/community/seminar.do?mode=view&articleNo=467167&article.offset=10&articleLimit=10"
  }
 ],
 "events": [
  {
   "no": "37",
   "title": "[4/13(월)] Nature Forum: The Future of Sensing Technologies",
   "date": "2026.04.13",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=468907&article.offset=0&articleLimit=10"
  },
  {
   "no": "36",
   "title": "[2/12(목)] BK21 연구클러스터 시리즈 워크숍(바이오헬스 및 정밀의료기술)",
   "date": "2026.02.03",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=463709&article.offset=0&articleLimit=10"
  },
  {
   "no": "35",
   "title": "[1/26~1/30] 기계공학과 2025 겨울학기 해외집중강의 시리즈",
   "date": "2026.01.07",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=462248&article.offset=0&articleLimit=10"
  },
  {
   "no": "34",
   "title": "[1/7(수)] 2026 연세대 기계공학부 Industry Insight Forum",
   "date": "2025.12.10",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=461018&article.offset=0&articleLimit=10"
  },
  {
   "no": "33",
   "title": "[11/6(목)] 한국 근대의학의 과거와 미래를 잇다",
   "date": "2025.10.22",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=457796&article.offset=0&articleLimit=10"
  },
  {
   "no": "32",
   "title": "[11/6(목)] 대학원생 대상 교육 프로그램 CANoe workshop 참여 안내",
   "date": "2025.10.17",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=457505&article.offset=0&articleLimit=10"
  },
  {
   "no": "31",
   "title": "[7/1~7/29] 기계공학과 2025 여름학기 글로벌 인사이트 강연 시리즈",
   "date": "2025.06.18",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=449012&article.offset=0&articleLimit=10"
  },
  {
   "no": "30",
   "title": "[7/7~7/9] 기계공학과 2025 여름학기 해외집중강의 시리즈",
   "date": "2025.06.16",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=448814&article.offset=0&articleLimit=10"
  },
  {
   "no": "29",
   "title": "[6/4(수)] AI융합심화전공 프로그램 설명회",
   "date": "2025.05.26",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=447510&article.offset=0&articleLimit=10"
  },
  {
   "no": "28",
   "title": "[6/4(수)] 한국수력원자력 CEO 초청 특별 강연",
   "date": "2025.05.19",
   "url": "https://me.yonsei.ac.kr/me/community/seminar_graduate1.do?mode=view&articleNo=447034&article.offset=0&articleLimit=10"
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
 ]
};
