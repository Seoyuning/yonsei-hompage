/* ═══════════════════════════════════════════════════════════════════
   YSME DATA — 단일 진실원천 (Single Source of Truth)
   「機制 · Mechanism in Motion」 v2
   ---------------------------------------------------------------------
   · 모든 수치·명단은 me.yonsei.ac.kr 공식 페이지 실측 수집(2026-06-30).
   · placeholder 0건 원칙: 미확인 데이터는 필드 자체를 넣지 않는다.
     (예: 랩 URL은 기획문서에서 검증된 2곳만 보유 — optomecha, cleanenergy)
   · 클러스터 매핑: 실측 택소노미는 8개 클러스터이나, 디자인 시스템
     (부록A §1.1)은 6색 토큰. 아래와 같이 8→6 병합해 사용한다.
       1 설계·고체역학·구조        → solid   (--c-solid)   7 labs
       2 열·유체·에너지            → thermal (--c-thermal) 7 labs
       3 제조·생산·트라이볼로지    → manuf   (--c-manuf)   4 labs
       4 로보틱스·제어  ┐
       8 계산·AI        ┴──────────→ dyn     (--c-dyn)     5 labs
       5 마이크로·나노·MEMS ┐
       7 바이오·메디컬      ┴──────→ nanobio (--c-bio)     6 labs
       6 광학·이미징·센싱          → optics  (--c-optics)  4 labs
     합계 33 labs = 33 professors (1 PI : 1 lab).
   ═══════════════════════════════════════════════════════════════════ */
window.YSME = {

  site: {
    nameKo: '연세대학교 기계공학부',
    nameEn: 'School of Mechanical Engineering, Yonsei University',
    concept: '機制 · Mechanism in Motion',
    version: 'v2.0',
    updated: '2026-07-03',
    address: '(03722) 서울특별시 서대문구 연세로 50 연세대학교 공과대학 기계공학부',
    tel: { ug: '02-2123-4426', grad: '02-2123-2810', bk21: '02-2123-7817' },
    source: 'me.yonsei.ac.kr/me/index.do', verifiedAt: '2026-06-30'
  },

  /* 히어로·통계밴드 datum 5종 — 각 수치의 출처 스탬프 원본 */
  datums: [
    { key: 'professors', num: 33,   label: '전임 교수',   source: 'faculty_list.do', verifiedAt: '2026-06-30' },
    { key: 'labs',       num: 33,   label: '연구실',      source: 'lab2.do',         verifiedAt: '2026-06-30' },
    { key: 'clusters',   num: 6,    label: '연구 클러스터', source: '연구실 명칭 기반 자체 분류(8→6 병합)', verifiedAt: '2026-06-30' },
    { key: 'credits',    num: 130,  label: '졸업 학점',   source: 'graduation.do',   verifiedAt: '2026-06-30' },
    { key: 'since',      num: 1962, label: 'Since',       source: 'history.do — 1962.12 기계공학과 분리', verifiedAt: '2026-06-30' }
  ],

  clusters: [
    { id: 'solid',   ko: '고체·구조·재료역학',   en: 'Solid Mechanics & Design',   count: 7 },
    { id: 'thermal', ko: '열·유체·에너지',       en: 'Thermal / Fluids / Energy',  count: 7 },
    { id: 'manuf',   ko: '생산·정밀제조',        en: 'Manufacturing & Tribology',  count: 4 },
    { id: 'nanobio', ko: '마이크로·나노·바이오', en: 'Micro / Nano / Bio',         count: 6 },
    { id: 'optics',  ko: '광학·이미징·계측',     en: 'Optics / Imaging / Sensing', count: 4 },
    { id: 'dyn',     ko: '동역학·제어·로보·AI',  en: 'Dynamics / Control / Robotics / AI', count: 5 }
  ],

  /* 교수 33명 — 출처: faculty_list.do · 최종확인 2026-06-30
     rank: 교수|부교수|조교수, role: 보직(있을 때만), labId: labs[].id 참조 */
  professors: [
    { id: 'kang-keonwook',  ko: '강건욱', en: 'Keonwook Kang',   rank: '부교수', cluster: 'solid',   labId: 'cmm',      initial: '강' },
    { id: 'kang-shinill',   ko: '강신일', en: 'Shinill Kang',    rank: '교수',   cluster: 'nanobio', labId: 'nanofab',  initial: '강', featured: true },
    { id: 'kim-kyoungsik',  ko: '김경식', en: 'Kyoungsik Kim',   rank: '교수',   cluster: 'optics',  labId: 'optiq',    initial: '김' },
    { id: 'kim-daeeun',     ko: '김대은', en: 'Dae Eun Kim',     rank: '교수',   cluster: 'manuf',   labId: 'tribo',    initial: '김', featured: true },
    { id: 'kim-seok',       ko: '김석',   en: 'Seok Kim',        rank: '부교수', cluster: 'solid',   labId: 'max',      initial: '김' },
    { id: 'kim-youngjoo',   ko: '김영주', en: 'Young-Joo Kim',   rank: '교수',   cluster: 'optics',  labId: 'noel',     initial: '김' },
    { id: 'kim-yongjun',    ko: '김용준', en: 'Yong-Jun Kim',    rank: '교수',   cluster: 'nanobio', labId: 'mems',     initial: '김' },
    { id: 'kim-woochul',    ko: '김우철', en: 'Woochul Kim',     rank: '교수',   role: '학과장', cluster: 'thermal', labId: 'atel', initial: '김', featured: true },
    { id: 'kim-wonjung',    ko: '김원정', en: 'Wonjung Kim',     rank: '부교수', role: '학부지도교수', cluster: 'thermal', labId: 'ssfl', initial: '김' },
    { id: 'kim-jongbaeg',   ko: '김종백', en: 'Jongbaeg Kim',    rank: '교수',   cluster: 'nanobio', labId: 'nanotrans', initial: '김' },
    { id: 'kim-haejin',     ko: '김해진', en: 'Hae-Jin Kim',     rank: '부교수', cluster: 'manuf',   labId: 'idml',     initial: '김' },
    { id: 'ryu-wonhyoung',  ko: '류원형', en: 'WonHyoung Ryu',   rank: '교수',   cluster: 'nanobio', labId: 'bes',      initial: '류' },
    { id: 'min-kyoungmin',  ko: '민경민', en: 'Kyoungmin Min',   rank: '부교수', role: '대회 담당', cluster: 'dyn', labId: 'csai', initial: '민' },
    { id: 'min-byungkwon',  ko: '민병권', en: 'Byung-Kwon Min',  rank: '교수',   cluster: 'manuf',   labId: 'mfgmech',  initial: '민' },
    { id: 'park-nocheol',   ko: '박노철', en: 'No-Cheol Park',   rank: '교수',   cluster: 'dyn',     labId: 'optomecha', initial: '박', featured: true, storyPage: 'professor.html?id=park-nocheol' },
    { id: 'song-soonho',    ko: '송순호', en: 'Soonho Song',     rank: '교수',   cluster: 'thermal', labId: 'ice',      initial: '송' },
    { id: 'shin-dongjun',   ko: '신동준', en: 'Dongjun Shin',    rank: '교수',   cluster: 'dyn',     labId: 'hcair',    initial: '신' },
    { id: 'yang-hyunseok',  ko: '양현석', en: 'Hyunseok Yang',   rank: '교수',   cluster: 'dyn',     labId: 'mss',      initial: '양' },
    { id: 'yoo-jeonghoon',  ko: '유정훈', en: 'Jeonghoon Yoo',   rank: '교수',   cluster: 'solid',   labId: 'ssd',      initial: '유' },
    { id: 'yoon-junyoung',  ko: '윤준영', en: 'Junyoung Yoon',   rank: '부교수', cluster: 'manuf',   labId: 'mfgmecha', initial: '윤' },
    { id: 'lee-namkyu',     ko: '이남규', en: 'NamKyu Lee',      rank: '조교수', cluster: 'thermal', labId: 'httd',     initial: '이' },
    { id: 'lee-jongsoo',    ko: '이종수', en: 'Jongsoo Lee',     rank: '교수',   cluster: 'solid',   labId: 'mpdo',     initial: '이' },
    { id: 'lee-joonsang',   ko: '이준상', en: 'Joon Sang Lee',   rank: '교수',   cluster: 'thermal', labId: 'msfd',     initial: '이' },
    { id: 'lee-changhoon',  ko: '이창훈', en: 'Changhoon Lee',   rank: '교수',   cluster: 'thermal', labId: 'turb',     initial: '이' },
    { id: 'lee-hyungsuk',   ko: '이형석', en: 'Hyung-Suk Lee',   rank: '교수',   cluster: 'solid',   labId: 'biomech',  initial: '이' },
    { id: 'jang-yonghoon',  ko: '장용훈', en: 'Yong Hoon Jang',  rank: '교수',   cluster: 'solid',   labId: 'micromech', initial: '장' },
    { id: 'jun-seongchan',  ko: '전성찬', en: 'Seong Chan Jun',  rank: '교수',   cluster: 'nanobio', labId: 'nemd',     initial: '전' },
    { id: 'chun-heoungjae', ko: '전흥재', en: 'Heoung Jae Chun', rank: '교수',   cluster: 'solid',   labId: 'isid',     initial: '전', featured: true },
    { id: 'jung-hyoil',     ko: '정효일', en: 'Hyo-il Jung',     rank: '교수',   cluster: 'nanobio', labId: 'biochip',  initial: '정' },
    { id: 'joo-chulmin',    ko: '주철민', en: 'Chulmin Joo',     rank: '교수',   cluster: 'optics',  labId: 'cii',      initial: '주', featured: true },
    { id: 'choi-jongeun',   ko: '최종은', en: 'Jongeun Choi',    rank: '교수',   cluster: 'dyn',     labId: 'mlcs',     initial: '최' },
    { id: 'hyun-jaesang',   ko: '현재상', en: 'Jae-Sang Hyun',   rank: '조교수', cluster: 'optics',  labId: 'hais',     initial: '현' },
    { id: 'hong-jongsup',   ko: '홍종섭', en: 'Jongsup Hong',    rank: '교수',   cluster: 'thermal', labId: 'sep',      initial: '홍' }
  ],
  professorsSource: { source: 'faculty_list.do', verifiedAt: '2026-06-30' },

  /* 연구실 33개 — 출처: lab2.do · 최종확인 2026-06-30
     url: 기획문서에서 검증 완료된 곳만 (그 외는 미확인 → 미게시) */
  labs: [
    { id: 'cmm',       ko: '전산재료역학',            en: 'Computational Mechanics of Materials', pi: '강건욱', cluster: 'solid',   loc: '공학관 N204' },
    { id: 'nanofab',   ko: '마이크로 나노 응용',      en: 'Nano Fabrication / Micro Optics',      pi: '강신일', cluster: 'nanobio', loc: '공학관 C330' },
    { id: 'optiq',     ko: '광학 양자',               en: 'Optics Quantum',                        pi: '김경식', cluster: 'optics',  loc: '공학관 A534' },
    { id: 'tribo',     ko: '트라이볼로지',            en: 'Tribology Research',                    pi: '김대은', cluster: 'manuf',   loc: '공학관 A491' },
    { id: 'max',       ko: '멀티스케일구조설계·극한제조', en: 'MAX — Multiscale Architecture & eXtreme Manufacturing', pi: '김석', cluster: 'solid', loc: '공학관 C314' },
    { id: 'noel',      ko: '나노광전자시스템',        en: 'Nano-Optoelectronics System',           pi: '김영주', cluster: 'optics',  loc: '공학원 D332' },
    { id: 'mems',      ko: '마이크로시스템',          en: 'MEMS',                                  pi: '김용준', cluster: 'nanobio', loc: '공학관 A583' },
    { id: 'atel',      ko: '어드밴스드 열공학',       en: 'Advanced ThermoEngineering',            pi: '김우철', cluster: 'thermal', loc: '공학관 A310' },
    { id: 'ssfl',      ko: '미소유체',                en: 'Small-Scale Fluids',                    pi: '김원정', cluster: 'thermal', loc: '공학관 A386' },
    { id: 'nanotrans', ko: '나노기전시스템',          en: 'Nano Transducers',                      pi: '김종백', cluster: 'nanobio', loc: '산학협동관 520' },
    { id: 'idml',      ko: '지능소자공정',            en: 'Intelligent Device & Manufacturing',    pi: '김해진', cluster: 'manuf',   loc: '공학관 N206' },
    { id: 'bes',       ko: '바이오메디컬·에너지 시스템', en: 'Biomedical and Energy System',       pi: '류원형', cluster: 'nanobio', loc: '공학관 N105' },
    { id: 'csai',      ko: '계산과학–인공지능',       en: 'Computational Science–AI',              pi: '민경민', cluster: 'dyn',     loc: '공학관 N201' },
    { id: 'mfgmech',   ko: '생산·메카트로닉스',       en: 'Manufacturing & Mechatronics',          pi: '민병권', cluster: 'manuf',   loc: '산학협동관 308' },
    { id: 'optomecha', ko: '진동·광메카트로닉스',     en: 'Vibration and Opto-Mechatronics',       pi: '박노철', cluster: 'dyn',     loc: '공학원 332D', url: 'http://optomecha.yonsei.ac.kr' },
    { id: 'ice',       ko: '내연기관·청정에너지',     en: 'ICE & Clean Energy',                    pi: '송순호', cluster: 'thermal', loc: '공학관 A180', url: 'http://cleanenergy.yonsei.ac.kr' },
    { id: 'hcair',     ko: '인간중심AI로보틱스',      en: 'Human-Centered AI Robotics',            pi: '신동준', cluster: 'dyn',     loc: '공학관 C426' },
    { id: 'mss',       ko: '정밀제어시스템',          en: 'Micro Servo System',                    pi: '양현석', cluster: 'dyn',     loc: '공학관 A283' },
    { id: 'ssd',       ko: '전산구조설계',            en: 'Systematic Structure Design',           pi: '유정훈', cluster: 'solid',   loc: '공학관 C334' },
    { id: 'mfgmecha',  ko: '정밀 생산 메카트로닉스',  en: 'Manufacturing Mechatronics',            pi: '윤준영', cluster: 'manuf',   loc: '공학관 A190' },
    { id: 'httd',      ko: '열전달·열설계',           en: 'Heat Transfer & Thermal Design',        pi: '이남규', cluster: 'thermal', loc: '공학관 N207' },
    { id: 'mpdo',      ko: '멀티피직스 최적설계·PHM', en: 'Multi-Physics Design Optimization & PHM', pi: '이종수', cluster: 'solid', loc: '공학관 A286/C323' },
    { id: 'msfd',      ko: '멀티스케일 유체역학',     en: 'Multi-scale Fluid Dynamics',            pi: '이준상', cluster: 'thermal', loc: '공학관 A277/N204' },
    { id: 'turb',      ko: '난류',                    en: 'Turbulence',                            pi: '이창훈', cluster: 'thermal', loc: '공학관 A178' },
    { id: 'biomech',   ko: '생체역학·연성재료',       en: 'Biomechanics & Soft Materials',         pi: '이형석', cluster: 'solid',   loc: '공학관 A581/N104' },
    { id: 'micromech', ko: '마이크로역학',            en: 'Micro Mechanics',                       pi: '장용훈', cluster: 'solid',   loc: '공학관 A110' },
    { id: 'nemd',      ko: '나노 융합 소자',          en: 'NEMD',                                  pi: '전성찬', cluster: 'nanobio', loc: '공학관 N204' },
    { id: 'isid',      ko: '지능형 구조·통합설계',    en: 'Intelligent Structures & Integrated Design', pi: '전흥재', cluster: 'solid', loc: '공학관 C332' },
    { id: 'biochip',   ko: '바이오칩',                en: 'Biochip Technology',                    pi: '정효일', cluster: 'nanobio', loc: '공학관 A108' },
    { id: 'cii',       ko: '산술 광학 영상',          en: 'Computational Imaging & Instrumentation', pi: '주철민', cluster: 'optics', loc: '공학관 N104' },
    { id: 'mlcs',      ko: '기계학습·제어 시스템',    en: 'Machine Learning and Control Systems',  pi: '최종은', cluster: 'dyn',     loc: '공학관 N206' },
    { id: 'hais',      ko: '정밀 측정·지능형 센싱',   en: 'High-Dim. Accurate Measurement & Intelligent Sensing', pi: '현재상', cluster: 'optics', loc: '공학관 C315' },
    { id: 'sep',       ko: '지속가능 에너지 플랫폼',  en: 'Multiphysics Energy System',            pi: '홍종섭', cluster: 'thermal', loc: '공학관 A288' }
  ],
  labsSource: { source: 'lab2.do', verifiedAt: '2026-06-30' },

  /* 전공필수 교과목 8과목 — 출처: 부록B 리서치 §졸업요건 (교과목 체계 실측, 각 3학점=24) */
  courses: [
    { code: 'MEU2600', ko: '고체역학',      type: '전공필수' },
    { code: 'MEU2610', ko: '열역학',        type: '전공필수' },
    { code: 'MEU2640', ko: '유체역학',      type: '전공필수' },
    { code: 'MEU2650', ko: '동역학',        type: '전공필수' },
    { code: 'MEU2104', ko: '기계공학실험1', type: '전공필수' },
    { code: 'MEU3005', ko: '기계공학실험2', type: '전공필수' },
    { code: 'MEU4300', ko: '창의제품설계',  type: '전공필수' },
    { code: 'MEU4400', ko: '학사논문',      type: '전공필수' }
  ],
  coursesSource: { source: 'me.yonsei.ac.kr 교과과정', verifiedAt: '2026-06-30' },

  /* 공지·뉴스·세미나 시드 — 실제 제목 그대로 (현행 사이트 수집 2026-07-02) */
  posts: [
    /* 학부 공지 — notice.do */
    { cat: '학부', title: '기계공학부「홈페이지 구축 경진대회」안내', date: '2026-06-23', pinned: true, source: 'community/notice.do', verifiedAt: '2026-07-02' },
    { cat: '학부', title: '2026-여름계절학기 학부연구(3) 연구참여 신청서 제출 안내', date: '2026-06-29', source: 'community/notice.do', verifiedAt: '2026-07-02' },
    { cat: '학부', title: 'VAR 2026 여름학기 모집 안내', date: '2026-06-24', source: 'community/notice.do', verifiedAt: '2026-07-02' },
    { cat: '학부', title: '일몰된 교과목(기계공학수학)에 대한 재수강처리 요청서 제출 안내', date: '2026-06-18', source: 'community/notice.do', verifiedAt: '2026-07-02' },
    { cat: '학부', title: '기계공학과 2026 여름학기 해외집중강의 시리즈 수강생 모집 안내', date: '2026-06-11', source: 'community/notice.do', verifiedAt: '2026-07-02' },
    { cat: '학부', title: '2026학년도 2학기 재입학 전형 안내문', date: '2026-05-29', source: 'community/notice.do', verifiedAt: '2026-07-02' },
    { cat: '학부', title: '2026학년도 2학기 학생설계전공 제도 시행 안내', date: '2026-05-12', source: 'community/notice.do', verifiedAt: '2026-07-02' },
    { cat: '학부', title: "2026 공과대학 'ZERO to AI Challenge' 공모 안내", date: '2026-05-11', source: 'community/notice.do', verifiedAt: '2026-07-02' },
    { cat: '학부', title: '[항공우주전략연구원] 2026년 연세 우주항공 주간 개최 안내', date: '2026-05-08', source: 'community/notice.do', verifiedAt: '2026-07-02' },
    { cat: '학부', title: '공과대학 Global Day 행사 안내', date: '2026-04-14', source: 'community/notice.do', verifiedAt: '2026-07-02' },
    /* 대학원 공지 — index.do */
    { cat: '대학원', title: '2026학년도 2학기 대학원 휴학·복학 신청 안내', date: '2026-07-02', source: 'index.do', verifiedAt: '2026-07-02' },
    { cat: '대학원', title: '8월 졸업예정자 학위논문 제출 안내', date: '2026-06-19', source: 'index.do', verifiedAt: '2026-07-02' },
    { cat: '대학원', title: '1학기 APR 계획서 작성 마감일 안내', date: '2026-06-16', source: 'index.do', verifiedAt: '2026-07-02' },
    { cat: '대학원', title: '2학기 학위과정 변경 신청 안내', date: '2026-06-09', source: 'index.do', verifiedAt: '2026-07-02' },
    { cat: '대학원', title: '박사우수장학금 및 석사우수장학금 신청 안내', date: '2026-05-29', source: 'index.do', verifiedAt: '2026-07-02' },
    { cat: '대학원', title: 'K-STAR 비자트랙 프로그램 신청 안내', date: '2026-05-14', source: 'index.do', verifiedAt: '2026-07-02' },
    /* 뉴스 — news.do */
    { cat: '뉴스', title: '비압전성 폴리머 필름을 이용한 유연한 음향파 발생장치 개발과 생체조직 분야로의 응용', date: '2026-05-18', source: 'community/news.do', verifiedAt: '2026-07-02' },
    { cat: '뉴스', title: '리소그래피 공정 없이 제작 가능한 대기전력이 없는 수소 감지 스위치 개발', date: '2026-05-18', source: 'community/news.do', verifiedAt: '2026-07-02' },
    { cat: '뉴스', title: '리튬이온전지 열폭주 초기 SEI 분해 반응의 반응속도론적 모델링', date: '2026-05-18', source: 'community/news.do', verifiedAt: '2026-07-02' },
    { cat: '뉴스', title: '중온 직접 암모니아 SOFC 성능·내구성 향상을 위한 Co–GDC 나노촉매 연료극 개발', date: '2026-05-18', source: 'community/news.do', verifiedAt: '2026-07-02' },
    { cat: '뉴스', title: '부분 매립형 수직 정렬 탄소나노튜브 기반 고해상도 유연 촉각 센서 어레이 개발', date: '2026-05-18', source: 'community/news.do', verifiedAt: '2026-07-02' },
    { cat: '뉴스', title: 'Nature Forum: The Future of Sensing Technologies 성황리 개최', date: '2026-04-21', source: 'community/news.do', verifiedAt: '2026-07-02' },
    { cat: '뉴스', title: '연세대 기계공학부, 일본 게이오대·도쿄대와 글로벌 학술·산업 교류 프로그램 성황리 개최', date: '2026-03-11', source: 'community/news.do', verifiedAt: '2026-07-02' },
    { cat: '뉴스', title: '고체산화물연료전지 공기 공급 중단 조건에서의 공기극 분해 메커니즘 규명', date: '2026-03-11', source: 'community/news.do', verifiedAt: '2026-07-02' },
    { cat: '뉴스', title: '전흥재 교수 한국복합재료학회 KAL-KSCM상 수상', date: '2026-03-11', source: 'community/news.do', verifiedAt: '2026-07-02' },
    { cat: '뉴스', title: '바이오헬스 및 정밀의료기술 심포지움 개최', date: '2026-02-19', source: 'community/news.do', verifiedAt: '2026-07-02' },
    /* 세미나 — seminar.do */
    { cat: '세미나', title: 'Prof. Dvir Yelin (Technion) — Imaging tympanic membrane vibration', date: '2026-06-04', source: 'community/seminar.do', verifiedAt: '2026-07-02' },
    { cat: '세미나', title: '김석 교수 — Programmable Mechanical Matter', date: '2026-06-04', source: 'community/seminar.do', verifiedAt: '2026-07-02' },
    { cat: '세미나', title: '나성수 교수 — From Conventional Dynamics', date: '2026-06-04', source: 'community/seminar.do', verifiedAt: '2026-07-02' },
    { cat: '세미나', title: '임근배 교수 — Mechanics for Biomedical Engineering', date: '2026-05-28', source: 'community/seminar.do', verifiedAt: '2026-07-02' },
    { cat: '세미나', title: '정성남 교수 — Overall Rotorcraft Aeromechanics', date: '2026-05-28', source: 'community/seminar.do', verifiedAt: '2026-07-02' },
    { cat: '세미나', title: '김원정 교수 — 미세유체역학 이해 및 연구 사례 소개', date: '2026-05-19', source: 'community/seminar.do', verifiedAt: '2026-07-02' }
  ],

  /* 연혁 마일스톤 — 출처: faculty/history.do · 최종확인 2026-07-02 */
  history: [
    { date: '1958.12', text: '이공대학 건설공학과 신설' },
    { date: '1960.03', text: '첫 신입생 입학' },
    { date: '1962.12', text: '기계공학과로 분리', highlight: true },
    { date: '1963.02', text: '기계공학과 첫 신입생 입학' },
    { date: '1964.02', text: '첫 졸업생 배출' },
    { date: '1971.03', text: '대학원 석사과정 신설' },
    { date: '1972.03', text: '대학원 박사과정 신설' },
    { date: '1996.03', text: '기전공학부로 통합' },
    { date: '1999.03', text: '기계공학·기계설계학과 → 기계공학전공 통합' },
    { date: '2002.03', text: '기계공학부로 분리 독립 (입학정원 180명)', highlight: true },
    { date: '2003.03', text: 'ABEEK 공학교육인증 프로그램 가입' },
    { date: '2010.11', text: '창립 50주년', highlight: true },
    { date: '2016.03', text: '3단계 BK21 플러스 사업단 협약' },
    { date: '2020.08', text: '4단계 BK21 사업 선정', highlight: true }
  ],
  historySource: { source: 'faculty/history.do', verifiedAt: '2026-07-02' },

  /* 검색 모달용 페이지 인덱스 */
  pages: [
    { href: 'index.html',          title: '홈',              desc: '機制 · Mechanism in Motion' },
    { href: 'about.html',          title: '학과장 인사말',   desc: '소개 · 비전 · 교육목표' },
    { href: 'history.html',        title: '연혁',            desc: 'Since 1962 — 학부 마일스톤' },
    { href: 'academics.html',      title: '교육과정',        desc: '이수체계 · 전공필수 · ABEEK' },
    { href: 'research.html',           title: '연구실',          desc: '33개 연구실 · 6 클러스터' },
    { href: 'people.html',         title: '교수진',          desc: '전임 교수 33명 디렉터리' },
    { href: 'professor.html?id=park-nocheol', title: '교수 스토리 — 박노철', desc: '진동·광메카트로닉스' },
    { href: 'news.html',           title: '소식',            desc: '공지 · 뉴스 · 세미나' },
    { href: 'admissions.html',     title: '입학·진로',       desc: '학부 · 대학원 · 취업 · 동문' },
    { href: 'contact.html',        title: '오시는 길',       desc: '주소 · 연락처 · 캠퍼스 지도' },
    { href: 'engineering.html',    title: '공학 사양서 /engineering', desc: '성능 · 접근성 실측 공개' },
    { href: 'accessibility.html',  title: '접근성 선언',     desc: 'WCAG 2.2 AA 자가적합성' },
    { href: 'privacy.html',        title: '개인정보처리방침', desc: '' },
    { href: 'terms.html',          title: '이용약관',        desc: '' }
  ]
};
