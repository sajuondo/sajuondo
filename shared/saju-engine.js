/* ============================================================
 * 사주온도 (Saju Ondo) — 공유 만세력 엔진 + DB
 * 모든 페이지(index, salon, report)에서 import해서 사용
 * 원본: A 파일 (검증된 점신 방식 만세력)
 * 검증 기준: 양력 1981.12.13 오시 = 신유년 경자월 을축일 임오시
 * ============================================================ */

// ━━━━ DB (원본 A 전체) ━━━━
const DB = {
  stems: {
    甲:{name:"갑",element:"wood",yin:false,meaning:"직진하는 리더십, 사회적 선구자",social:"도전과 개척을 보여주는 외형",color:"#8b6914"},
    乙:{name:"을",element:"wood",yin:true,meaning:"유연한 적응력, 내면의 끈기",social:"부드럽고 세심한 사회적 인상",color:"#a07820"},
    丙:{name:"병",element:"fire",yin:false,meaning:"밝고 화려한 표현력, 사교성",social:"존재감 있는 리더, 주목받는 외형",color:"#b85c38"},
    丁:{name:"정",element:"fire",yin:true,meaning:"정밀한 집중력, 내면의 불꽃",social:"전문성과 섬세함을 드러내는 인상",color:"#c46940"},
    戊:{name:"무",element:"earth",yin:false,meaning:"안정과 포용, 중재자 기질",social:"듬직하고 신뢰감 있는 사회적 모습",color:"#c4a35a"},
    己:{name:"기",element:"earth",yin:true,meaning:"세심한 배려, 실용적 지혜",social:"친근하고 실속 있는 인상",color:"#b8924a"},
    庚:{name:"경",element:"metal",yin:false,meaning:"강직한 의지, 원칙주의",social:"카리스마 있는 결단력의 외형",color:"#7a8490"},
    辛:{name:"신",element:"metal",yin:true,meaning:"예민한 미감, 완성도 추구",social:"세련되고 정제된 사회적 이미지",color:"#8a9099"},
    壬:{name:"임",element:"water",yin:false,meaning:"포용적 지혜, 전략적 사고",social:"깊이 있고 유연한 리더십의 외형",color:"#4a6274"},
    癸:{name:"계",element:"water",yin:true,meaning:"섬세한 감성, 내면적 통찰",social:"신중하고 지적인 사회적 인상",color:"#5a7284"},
  },
  branches: {
    子:{name:"자",element:"water",yin:true,season:"겨울",animal:"쥐",monthBranch:11,meaning:"지혜와 생명의 씨앗, 잠재된 에너지"},
    丑:{name:"축",element:"earth",yin:true,season:"겨울→봄",animal:"소",monthBranch:12,meaning:"인내와 축적, 묵묵한 성취"},
    寅:{name:"인",element:"wood",yin:false,season:"봄",animal:"호랑이",monthBranch:1,meaning:"새로운 시작, 강한 의지와 활기"},
    卯:{name:"묘",element:"wood",yin:true,season:"봄",animal:"토끼",monthBranch:2,meaning:"부드러운 성장, 예술적 감성"},
    辰:{name:"진",element:"earth",yin:false,season:"봄→여름",animal:"용",monthBranch:3,meaning:"변화와 전환, 용의 기운"},
    巳:{name:"사",element:"fire",yin:true,season:"여름",animal:"뱀",monthBranch:4,meaning:"지적 탐구, 정밀한 집중력"},
    午:{name:"오",element:"fire",yin:false,season:"여름",animal:"말",monthBranch:5,meaning:"열정과 표현, 절정의 에너지"},
    未:{name:"미",element:"earth",yin:true,season:"여름→가을",animal:"양",monthBranch:6,meaning:"온화한 조화, 예술적 감성"},
    申:{name:"신",element:"metal",yin:false,season:"가을",animal:"원숭이",monthBranch:7,meaning:"날카로운 분석력, 변화 추구"},
    酉:{name:"유",element:"metal",yin:true,season:"가을",animal:"닭",monthBranch:8,meaning:"정밀한 완성, 미적 감각"},
    戌:{name:"술",element:"earth",yin:false,season:"가을→겨울",animal:"개",monthBranch:9,meaning:"충성과 헌신, 수호의 기운"},
    亥:{name:"해",element:"water",yin:false,season:"겨울",animal:"돼지",monthBranch:10,meaning:"포용과 지혜, 내면의 풍요"},
  },
  jiazi:["甲子","乙丑","丙寅","丁卯","戊辰","己巳","庚午","辛未","壬申","癸酉","甲戌","乙亥","丙子","丁丑","戊寅","己卯","庚辰","辛巳","壬午","癸未","甲申","乙酉","丙戌","丁亥","戊子","己丑","庚寅","辛卯","壬辰","癸巳","甲午","乙未","丙申","丁酉","戊戌","己亥","庚子","辛丑","壬寅","癸卯","甲辰","乙巳","丙午","丁未","戊申","己酉","庚戌","辛亥","壬子","癸丑","甲寅","乙卯","丙辰","丁巳","戊午","己未","庚申","辛酉","壬戌","癸亥"],
  relations:{wood:{sheng:"fire",ke:"earth"},fire:{sheng:"earth",ke:"metal"},earth:{sheng:"metal",ke:"water"},metal:{sheng:"water",ke:"wood"},water:{sheng:"wood",ke:"fire"}},
  wolji:{
    子:{title:"子月生 — 겨울의 씨앗",climate:"한냉",desc:"가장 추운 겨울에 태어난 자월생은 표면적으로 고요하지만 내면에 방대한 잠재력을 품습니다. 직장 환경은 냉철하고 지적인 분위기로, 감정보다 논리가 우선되는 곳에서 능력을 발휘합니다.",keyword:"잠재력 · 냉철 · 내면의 깊이"},
    丑:{title:"丑月生 — 동토의 인내",climate:"한냉",desc:"겨울과 봄 사이, 얼어붙은 땅에서 태어난 축월생은 남다른 인내력과 축적의 힘을 가집니다.",keyword:"인내 · 축적 · 안정 지향"},
    寅:{title:"寅月生 — 봄의 선봉장",climate:"온난",desc:"겨울을 깨고 나오는 봄의 첫 기운, 인월생은 강한 추진력과 개척 정신을 타고납니다.",keyword:"개척 · 추진력 · 봄의 에너지"},
    卯:{title:"卯月生 — 꽃피는 목기",climate:"온난",desc:"목기가 가장 왕성한 묘월에 태어난 사람은 예술적 감성과 부드러운 성장력을 가집니다.",keyword:"성장 · 예술성 · 인간관계"},
    辰:{title:"辰月生 — 변환의 용",climate:"온화",desc:"목에서 화로 넘어가는 전환점, 진월생은 변화와 혁신의 에너지를 가집니다.",keyword:"변화 · 적응 · 혁신"},
    巳:{title:"巳月生 — 화(火)의 집중",climate:"온열",desc:"여름의 초입, 조용하지만 강렬한 화(火)의 계절입니다. 집중력과 깊이 있는 탐구가 강점입니다.",keyword:"집중 · 전문성 · 내면의 불꽃"},
    午:{title:"午月生 — 화기의 절정",climate:"염열",desc:"가장 뜨거운 여름의 한가운데, 오월생은 사회적 표현력과 존재감이 압도적입니다.",keyword:"열정 · 표현력 · 존재감"},
    未:{title:"未月生 — 여름의 여운",climate:"염열",desc:"여름에서 가을로 넘어가는 미월생은 따뜻함과 예술적 감성을 겸비합니다.",keyword:"조화 · 예술 · 따뜻함"},
    申:{title:"申月生 — 금기의 시작",climate:"서늘",desc:"가을의 기운이 시작되는 신월, 날카로운 분석력과 변화 추구의 성향을 가집니다.",keyword:"분석 · 효율 · 결단력"},
    酉:{title:"酉月生 — 음금의 정밀",climate:"서늘",desc:"금기가 가장 정제된 유월생은 심미안과 완성도에 대한 추구가 강합니다.",keyword:"정밀 · 심미안 · 완성도"},
    戌:{title:"戌月生 — 충성의 수호자",climate:"서늘",desc:"가을이 저무는 술월생은 강한 신념과 충성심, 책임감을 가집니다.",keyword:"충성 · 헌신 · 책임감"},
    亥:{title:"亥月生 — 겨울의 포용",climate:"한냉",desc:"겨울이 시작되는 해월생은 넓은 포용력과 지혜로운 직관을 가집니다.",keyword:"포용 · 지혜 · 국제적 감각"},
  },
  geukguk:{
    寅:{name:"건록격",keyword:"자수성가",johu:"봄의 선두",mulsung:"이른 봄 숲을 가르는 큰 나무",job:"창업·개척·리더십·스포츠·군사"},
    卯:{name:"건록격",keyword:"창의 성장",johu:"따뜻하고 습윤",mulsung:"봄비 맞은 대나무 숲",job:"예술·디자인·상담·교육·미디어"},
    巳:{name:"식신격",keyword:"풍요 재능",johu:"뜨거움이 시작",mulsung:"연기 없이 타는 촛불",job:"전문직·요식업·연구·기술·콘텐츠"},
    午:{name:"양인격",keyword:"강한 의지",johu:"가장 뜨거운 환경",mulsung:"한낮의 태양, 그늘 없는 대지",job:"의사·군인·운동선수·법조인·영업"},
    申:{name:"편재격",keyword:"역동 재물",johu:"서늘하고 건조",mulsung:"가을 산의 날선 바위",job:"금융·투자·무역·IT·영업관리"},
    亥:{name:"편인격",keyword:"직관 연구",johu:"차갑고 깊은 환경",mulsung:"겨울 밤 깊은 호수",job:"연구·학술·종교·철학·심리·작가"},
    子:{name:"정관격",keyword:"명예 원칙",johu:"한냉하고 고요",mulsung:"얼어붙은 강물 아래 흐르는 물",job:"공무원·법조인·교육·행정·금융"},
    丑:{name:"정인격",keyword:"학문 안정",johu:"동토의 환경",mulsung:"눈 덮인 밭, 봄을 기다리는 씨앗",job:"학자·교사·의료·복지·문서·행정"},
    辰:{name:"식신격",keyword:"풍요 창조",johu:"온화한 변화",mulsung:"용이 잠든 깊은 연못",job:"기획·컨설팅·예술·다양한 분야"},
    酉:{name:"상관격",keyword:"탁월 표현",johu:"서늘하고 정제된 환경",mulsung:"가을 달빛 아래 보석",job:"예술·작가·강사·평론·디자인"},
    戌:{name:"정관격",keyword:"충성 헌신",johu:"서늘하고 건조",mulsung:"황혼의 언덕을 지키는 불꽃",job:"군인·경찰·종교·복지·건설"},
    未:{name:"편재격",keyword:"예술 재물",johu:"뜨겁고 건조한 환경",mulsung:"여름 들판의 양 떼",job:"예술·요식·인테리어·서비스·부동산"},
  },
  ilju:{
    "甲子":{image:"겨울 강변의 큰 소나무",keyword:"고독한 선구자",desc:"차갑고 깊은 겨울 수(水) 위에 홀로 서 있는 갑목. 고독함 속에서도 꺾이지 않는 의지를 타고났습니다.",color:"#4a6274"},
    "甲寅":{image:"봄 숲의 선두 나무",keyword:"개척하는 리더",desc:"목기가 왕성한 환경의 갑목. 새로운 길을 만들고 앞장서는 것이 본능입니다.",color:"#8b6914"},
    "甲辰":{image:"용이 잠든 숲의 대목",keyword:"잠재된 권위",desc:"깊은 뿌리를 내리는 갑목. 대기만성형으로 중년 이후 사회적 영향력이 커집니다.",color:"#c4a35a"},
    "甲午":{image:"한여름 정오의 나무",keyword:"빛나는 존재감",desc:"뜨거운 화(火) 위의 갑목. 사회적 표현력과 존재감이 강합니다.",color:"#b85c38"},
    "甲申":{image:"가을 산의 강인한 소나무",keyword:"원칙 있는 승부사",desc:"금(金)이 극하는 환경. 강한 압박 속에서 더 단단해집니다.",color:"#8a9099"},
    "甲戌":{image:"황혼의 언덕 위 고목",keyword:"신념의 수호자",desc:"내면에 강렬한 열정과 신념을 감추고 있습니다.",color:"#c4a35a"},
    "乙丑":{image:"눈밭에서 피어난 작은 꽃",keyword:"인내하는 생명력",desc:"척박한 환경에서 살아남는 강인한 생존력.",color:"#8b6914"},
    "乙卯":{image:"봄비 속 싱그러운 새싹",keyword:"감성적 성장",desc:"감성과 창의력이 가장 풍부한 일주.",color:"#8b6914"},
    "乙巳":{image:"촛불 옆의 덩굴식물",keyword:"섬세한 열정",desc:"집중력과 섬세한 표현력이 강점.",color:"#b85c38"},
    "乙未":{image:"여름 정원의 화려한 꽃",keyword:"풍요로운 감성",desc:"예술적 재능과 따뜻한 관계력의 조화.",color:"#c4a35a"},
    "乙酉":{image:"가을 정원의 마지막 꽃",keyword:"완성을 추구하는 미감",desc:"날카로운 심미안과 완벽주의적 기질.",color:"#8a9099"},
    "乙亥":{image:"깊은 호수 위를 덮은 수초",keyword:"직관적 감성가",desc:"풍부한 감성과 깊은 직관.",color:"#4a6274"},
    "丙子":{image:"겨울 밤 모닥불",keyword:"고독 속 빛",desc:"어두운 환경에서 오히려 빛이 더 강해지는 구조.",color:"#4a6274"},
    "丙寅":{image:"이른 봄의 떠오르는 해",keyword:"새벽을 여는 태양",desc:"목(木)이 화를 생하는 최적 환경.",color:"#8b6914"},
    "丙辰":{image:"봄 안개 속 태양",keyword:"온화한 카리스마",desc:"유연하고 포용적인 리더십.",color:"#c4a35a"},
    "丙午":{image:"한낮의 작열하는 태양",keyword:"절정의 존재감",desc:"화기 최강의 환경. 수의 조절이 필요.",color:"#b85c38"},
    "丙申":{image:"가을 하늘의 석양",keyword:"날카로운 통찰력",desc:"외부 압박이 강하지만 빛을 잃지 않음.",color:"#8a9099"},
    "丙戌":{image:"황혼의 잔불",keyword:"끝까지 타는 신념",desc:"강한 신념과 열정이 말년까지 지속.",color:"#c4a35a"},
    "丁丑":{image:"눈보라 속의 촛불",keyword:"척박함 속 집중",desc:"어려운 환경에서 더욱 집중하는 힘.",color:"#4a6274"},
    "丁卯":{image:"봄날 서재의 촛불",keyword:"섬세한 창조자",desc:"감성적이고 창의적인 표현이 강함.",color:"#8b6914"},
    "丁巳":{image:"화로 속 정제된 불꽃",keyword:"전문적 집중력",desc:"뜨겁고 정밀한 집중력, 전문 분야에서 빛남.",color:"#b85c38"},
    "丁未":{image:"여름 저녁의 등불",keyword:"따뜻한 예술혼",desc:"따뜻하고 예술적인 감성.",color:"#c4a35a"},
    "丁酉":{image:"달빛 아래 은은한 촛불",keyword:"정밀한 완성미",desc:"예민한 심미안과 완성도 집착.",color:"#8a9099"},
    "丁亥":{image:"겨울 바다 위의 등대",keyword:"어둠을 밝히는 빛",desc:"위기 상황에서 진가를 발휘.",color:"#4a6274"},
    "戊子":{image:"겨울 강변의 넓은 평야",keyword:"차분한 포용력",desc:"냉정하고 넓은 포용력.",color:"#4a6274"},
    "戊寅":{image:"봄 산의 넓은 고원",keyword:"활기찬 개척자",desc:"외부 자극에 활발하게 반응.",color:"#8b6914"},
    "戊辰":{image:"봄비 내리는 넓은 들판",keyword:"변화를 품은 안정",desc:"풍요롭고 변화를 수용하는 넓은 기반.",color:"#c4a35a"},
    "戊午":{image:"한여름 드넓은 사막",keyword:"강렬한 존재감",desc:"강한 카리스마, 수의 조절이 필요.",color:"#b85c38"},
    "戊申":{image:"가을 고원의 넓은 바위",keyword:"단단한 결단력",desc:"안정 속에서 결단력이 빛남.",color:"#8a9099"},
    "戊戌":{image:"황혼의 넓은 황무지",keyword:"신념의 대지",desc:"강한 고집과 불굴의 의지.",color:"#c4a35a"},
    "己丑":{image:"겨울 논밭의 기름진 흙",keyword:"묵묵한 축적",desc:"인내심이 강하고 꾸준한 노력으로 성과.",color:"#4a6274"},
    "己卯":{image:"봄 화단의 부드러운 흙",keyword:"세심한 돌봄",desc:"섬세하고 관계 지향적.",color:"#8b6914"},
    "己巳":{image:"여름 화단의 따뜻한 흙",keyword:"실용적 전문가",desc:"실용적이고 전문적인 능력.",color:"#b85c38"},
    "己未":{image:"여름 들판의 부드러운 흙",keyword:"풍요로운 조화",desc:"따뜻한 관계, 풍요로운 감성.",color:"#c4a35a"},
    "己酉":{image:"가을 수확 후의 밭",keyword:"정밀한 실용가",desc:"실용적이고 정밀하며 완성도가 높음.",color:"#8a9099"},
    "己亥":{image:"겨울 강변의 부드러운 흙",keyword:"깊이 있는 포용",desc:"깊은 감성과 포용력.",color:"#4a6274"},
    "庚子":{image:"겨울 강의 날선 얼음",keyword:"냉철한 결단",desc:"냉정하고 날카로운 판단력.",color:"#4a6274"},
    "庚寅":{image:"봄 숲의 날선 도끼",keyword:"강한 개척자",desc:"강한 압박 속에서 더욱 빛나는 결단력.",color:"#8b6914"},
    "庚辰":{image:"봄비 맞은 철광석",keyword:"변화 속 강인함",desc:"변화에 유연하면서도 원칙을 고수.",color:"#c4a35a"},
    "庚午":{image:"한여름 용광로의 쇳물",keyword:"강렬한 카리스마",desc:"강한 압박 속 거대한 에너지.",color:"#b85c38"},
    "庚申":{image:"가을 산의 날선 바위",keyword:"날카로운 원칙주의",desc:"강직하고 날카로운 원칙주의.",color:"#8a9099"},
    "庚戌":{image:"황혼의 단단한 쇠",keyword:"불굴의 신념",desc:"강인한 의지와 불굴의 정신.",color:"#c4a35a"},
    "辛丑":{image:"눈밭에 묻힌 보석",keyword:"숨겨진 완성미",desc:"겉은 조용하지만 내면에 탁월한 능력.",color:"#4a6274"},
    "辛卯":{image:"봄 정원의 가위",keyword:"섬세한 창작자",desc:"예민하지만 창의적인 능력이 강함.",color:"#8b6914"},
    "辛巳":{image:"화로에서 정제된 보석",keyword:"전문적 완성도",desc:"극심한 압박에서 정제된 능력.",color:"#b85c38"},
    "辛未":{image:"여름 정원의 은빛 장식",keyword:"감성적 완성미",desc:"예술적 완성도와 따뜻한 감성.",color:"#c4a35a"},
    "辛酉":{image:"가을 달빛의 보석",keyword:"극도의 심미안",desc:"완벽주의적 심미안, 날카로운 비평 능력.",color:"#8a9099"},
    "辛亥":{image:"겨울 바다의 진주",keyword:"깊이 있는 완성",desc:"깊고 세련된 감성과 직관.",color:"#4a6274"},
    "壬子":{image:"겨울 깊은 바다",keyword:"포용적 지혜",desc:"깊고 광대한 지혜와 포용력.",color:"#4a6274"},
    "壬寅":{image:"봄 강의 힘찬 물줄기",keyword:"전략적 개척자",desc:"전략적 사고와 추진력의 결합.",color:"#8b6914"},
    "壬辰":{image:"봄비 가득한 저수지",keyword:"풍요로운 전략가",desc:"다양한 지식을 종합하는 창의적 해결사.",color:"#c4a35a"},
    "壬午":{image:"한여름 한강의 흐름",keyword:"열정을 식히는 지혜",desc:"뜨거운 환경에서 냉철함을 유지.",color:"#b85c38"},
    "壬申":{image:"가을 산 계곡의 물",keyword:"날카로운 전략",desc:"날카롭고 정밀한 전략적 사고.",color:"#8a9099"},
    "壬戌":{image:"황혼의 넓은 호수",keyword:"깊은 신념의 전략가",desc:"넓은 시야와 깊은 통찰력.",color:"#c4a35a"},
    "癸丑":{image:"눈 속에 흐르는 지하수",keyword:"조용한 축적",desc:"조용히 흐르며 쌓이는 잠재력.",color:"#4a6274"},
    "癸卯":{image:"봄비",keyword:"섬세한 감성가",desc:"봄비처럼 부드럽고 촉촉한 따뜻한 감성.",color:"#8b6914"},
    "癸巳":{image:"여름 안개",keyword:"신비로운 통찰",desc:"날카로운 통찰력과 신비로운 매력.",color:"#b85c38"},
    "癸未":{image:"여름 이슬",keyword:"따뜻한 감성",desc:"따뜻하고 섬세한 감성.",color:"#c4a35a"},
    "癸酉":{image:"가을 이른 서리",keyword:"냉철한 감성",desc:"냉정한 판단력과 섬세한 감성의 조화.",color:"#8a9099"},
    "癸亥":{image:"겨울 깊은 호수",keyword:"내면의 깊이",desc:"깊은 내면세계와 직관적 통찰력.",color:"#4a6274"},
  },
  johu:{
    "子-丙":"겨울 밤을 밝히는 불꽃. 차가운 환경이 오히려 당신의 빛을 돋보이게 합니다.",
    "子-丁":"어둠 속 촛불. 고독한 환경에서 내면의 집중력이 강해집니다.",
    "子-壬":"겨울 바다. 깊고 고요하지만 방향을 잃기 쉬운 구조.",
    "子-癸":"겨울 지하수. 조용히 흐르며 쌓이는 잠재력.",
    "子-甲":"겨울 강변의 소나무. 차가운 환경을 버티는 강인함.",
    "子-乙":"눈밭의 새싹. 척박한 환경에서 살아남는 생명력.",
    "丑-丙":"동토를 녹이는 햇살. 환경의 장벽을 넘는 따뜻한 의지.",
    "丑-丁":"얼어붙은 땅 위의 촛불. 인내와 집중이 강점.",
    "亥-丙":"겨울 바다의 등대. 어두운 환경에서 방향을 제시.",
    "亥-壬":"겨울 깊은 바다. 광대한 내면, 방향성 확보가 중요.",
    "寅-甲":"봄 숲의 선두 나무. 에너지가 넘치지만 독주 경향.",
    "寅-丙":"이른 봄의 떠오르는 태양. 최고의 발현 구조.",
    "卯-乙":"봄비 속 새싹. 감성과 성장이 자연스럽게 흐릅니다.",
    "卯-丁":"봄날 서재의 촛불. 창의적이고 섬세한 집중력.",
    "辰-壬":"봄비 가득한 저수지. 풍요롭지만 과잉되지 않는 구조.",
    "巳-壬":"타오르는 화로 옆의 강. 뜨거운 환경을 냉정하게 다스림.",
    "巳-癸":"여름 안개. 열기를 식히는 섬세한 감성.",
    "午-壬":"한여름 한강. 강렬한 환경에서 냉철함을 유지.",
    "午-丙":"작열하는 태양 아래의 태양. 존재감 최강이나 과부하 주의.",
    "未-乙":"여름 정원의 꽃. 따뜻한 환경에서 풍요로운 감성이 꽃핍니다.",
    "未-丁":"여름 저녁의 등불. 따뜻하고 예술적인 감성.",
    "申-丙":"가을 하늘의 석양. 서늘한 환경에서 따뜻함으로 균형.",
    "申-甲":"가을 산의 소나무. 압박 속에서 더 단단해지는 성격.",
    "酉-丁":"달빛 아래 촛불. 정제된 감성과 완성미.",
    "酉-壬":"가을 강. 서늘하고 맑은 환경에서 전략적 사고가 빛남.",
    "戌-丙":"황혼의 잔불. 끝까지 타는 열정과 신념.",
    "戌-甲":"황혼의 고목. 강한 신념과 불굴의 의지.",
  },
  sinsal:{
    "子":["戌","亥","子","丑","寅","卯","辰","巳","午","未","申","酉"],
    "丑":["酉","戌","亥","子","丑","寅","卯","辰","巳","午","未","申"],
    "寅":["未","申","酉","戌","亥","子","丑","寅","卯","辰","巳","午"],
    "卯":["午","未","申","酉","戌","亥","子","丑","寅","卯","辰","巳"],
    "辰":["巳","午","未","申","酉","戌","亥","子","丑","寅","卯","辰"],
    "巳":["辰","巳","午","未","申","酉","戌","亥","子","丑","寅","卯"],
    "午":["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"],
    "未":["丑","寅","卯","辰","巳","午","未","申","酉","戌","亥","子"],
    "申":["亥","子","丑","寅","卯","辰","巳","午","未","申","酉","戌"],
    "酉":["戌","亥","子","丑","寅","卯","辰","巳","午","未","申","酉"],
    "戌":["酉","戌","亥","子","丑","寅","卯","辰","巳","午","未","申"],
    "亥":["未","申","酉","戌","亥","子","丑","寅","卯","辰","巳","午"],
  },
  sinsalInfo:{
    겁살:{icon:"⚡",name:"겁살(劫殺)",short:"돌발 변화",desc:"예기치 못한 사건이나 충격적 변화가 따르지만, 이를 통해 오히려 도약하는 기운."},
    재살:{icon:"⚔️",name:"재살(災殺)",short:"위기 돌파",desc:"어려운 상황과 맞닥뜨리는 기운. 위기 속에서 진가가 드러나는 타입."},
    천살:{icon:"🌩",name:"천살(天殺)",short:"하늘의 시험",desc:"때때로 통제할 수 없는 상황이 찾아옴. 수용과 인내가 열쇠."},
    지살:{icon:"🚗",name:"지살(地殺)",short:"이동 변화",desc:"이사, 직장 이동 등 환경 변화가 잦음."},
    년살:{icon:"🌸",name:"년살(年殺)",short:"도화 인기",desc:"매력과 인기운이 강함. 이성과 대중으로부터 관심을 받는 기운."},
    월살:{icon:"🌙",name:"월살(月殺)",short:"고립 주의",desc:"고독하거나 소외되는 시기가 옴. 내면을 다지는 시간으로 활용 가능."},
    망신:{icon:"😓",name:"망신살(亡身)",short:"실수 주의",desc:"말이나 행동으로 체면을 잃는 상황이 생길 수 있음."},
    장성:{icon:"🛡",name:"장성살(將星)",short:"지도력",desc:"강한 추진력과 지도력이 있음."},
    반안:{icon:"🎯",name:"반안살(攀鞍)",short:"안정 기반",desc:"안정적인 기반을 쌓는 기운."},
    역마:{icon:"✈️",name:"역마살(驛馬)",short:"이동 해외",desc:"활동 반경이 넓고 이동이 잦음. 해외 인연에서 기회가 옴."},
    육해:{icon:"🌊",name:"육해살(六害)",short:"관계 주의",desc:"주변과의 관계에서 오해나 갈등이 생기기 쉬움."},
    화개:{icon:"🎨",name:"화개살(華蓋)",short:"예술 종교",desc:"예술·철학·종교적 기질이 강함."},
  },
};

// ━━━━ 음력→양력 DB ━━━━
const LUNAR_DB=[[1930,6,0x04AE53,1,30],[1931,0,0x0A5748,2,17],[1932,4,0x5526BD,2,6],[1933,0,0x0D2650,1,26],[1934,0,0x0D9544,2,14],[1935,2,0x46AA59,2,4],[1936,0,0x056ABA,1,24],[1937,0,0x09AD50,2,11],[1938,5,0x24AEB4,1,31],[1939,0,0x04AE50,2,19],[1940,0,0x6AA550,2,8],[1941,0,0x056A50,1,27],[1942,3,0x047B55,2,15],[1943,0,0x0AD550,2,5],[1944,7,0x056D43,1,25],[1945,0,0x033D50,2,13],[1946,0,0x049BA5,2,2],[1947,0,0x096D50,1,22],[1948,4,0x54AEBB,2,10],[1949,0,0x04AD50,1,29],[1950,0,0x0A4D50,2,17],[1951,2,0x35AAD5,2,6],[1952,0,0x056A50,1,27],[1953,7,0x096D50,2,14],[1954,0,0x04AEB5,2,3],[1955,0,0x032AD0,1,24],[1956,3,0x4726B3,2,12],[1957,0,0x06A530,1,31],[1958,0,0x0AA550,2,18],[1959,1,0x1CAA95,2,8],[1960,0,0x056AD0,1,28],[1961,0,0x09AD50,2,15],[1962,5,0x2C4AE4,2,5],[1963,0,0x0A4D50,1,25],[1964,0,0x6D25B0,2,13],[1965,3,0x056D52,2,2],[1966,0,0x0B6540,1,21],[1967,0,0x0AEA55,2,9],[1968,8,0x056AA0,1,30],[1969,0,0x096AD0,2,17],[1970,0,0x04AEB0,2,6],[1971,5,0x14AE52,1,27],[1972,0,0x0A6D50,2,15],[1973,0,0x6ADC50,2,3],[1974,4,0x0A2D52,1,23],[1975,0,0x095B50,2,11],[1976,0,0x049752,1,31],[1977,2,0x344F55,2,18],[1978,0,0x0A4B50,2,7],[1979,7,0x6AA550,1,28],[1980,0,0x0554B5,2,16],[1981,0,0x056A50,2,5],[1982,5,0x096D50,1,25],[1983,0,0x049BB3,2,13],[1984,4,0x04AE53,2,2],[1985,0,0x0A4EB0,2,20],[1986,0,0x0AD5B0,2,9],[1987,2,0x14D6A5,1,29],[1988,0,0x056D50,2,17],[1989,7,0x09ADB5,2,6],[1990,0,0x025D50,1,27],[1991,0,0x092D50,2,15],[1992,5,0x5C95D3,2,4],[1993,0,0x0A954F,1,23],[1994,0,0x0B4A50,2,10],[1995,3,0x474A55,1,31],[1996,0,0x0A5550,2,19],[1997,8,0x54D5A0,2,7],[1998,0,0x056AD0,1,28],[1999,0,0x09ADB0,2,16],[2000,4,0x14AEB5,2,5],[2001,0,0x04AEB0,1,24],[2002,0,0x0A5B50,2,12],[2003,1,0x1556D5,2,1],[2004,0,0x056A50,1,22],[2005,3,0x047AB3,2,9],[2006,0,0x0B4B50,1,29],[2007,6,0x6EA4B0,2,18],[2008,0,0x0A4550,2,7],[2009,0,0x0AAD50,1,26],[2010,5,0x56D2B5,2,14],[2011,0,0x0ADA50,2,3],[2012,4,0x055B52,1,23],[2013,0,0x056D70,2,10],[2014,9,0x4EABF5,1,31],[2015,0,0x0A5B50,2,19],[2016,0,0x096D50,2,8],[2017,6,0x5ADAB0,1,28],[2018,0,0x056D50,2,16],[2019,0,0x04AEB0,2,5],[2020,4,0x14AEB5,1,25],[2021,0,0x0A4EB0,2,12],[2022,3,0x5B55D5,2,1],[2023,0,0x0AB550,1,22],[2024,0,0x0B6540,2,10],[2025,6,0x0ADAB0,1,29],[2026,0,0x054B50,2,17],[2027,0,0x094B50,2,6],[2028,5,0x5AA4B5,1,26],[2029,0,0x0A4D50,2,13],[2030,0,0x06AA50,2,3]];

function lunarToSolar(ly,lm,ld,isLeap=false){
  const row=LUNAR_DB.find(r=>r[0]===ly);
  if(!row)return null;
  const[year,leapMonth,hex,jan1m,jan1d]=row;
  const rawDays=[];
  for(let i=12;i>=0;i--)rawDays.push(((hex>>i)&1)?30:29);
  let offset=0;
  if(isLeap&&leapMonth===lm){for(let i=0;i<lm;i++)offset+=rawDays[i];offset+=ld-1;}
  else{for(let i=0;i<lm-1;i++)offset+=rawDays[i];offset+=ld-1;}
  const jan1=new Date(ly,jan1m-1,jan1d);
  const solar=new Date(jan1.getTime()+offset*86400000);
  return{y:solar.getFullYear(),m:solar.getMonth()+1,d:solar.getDate()};
}

function checkLeapMonth(){
  document.getElementById('f-leap-group').style.display='none';
}

// ━━━━ 만세력 엔진 ━━━━
const _천간=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const _지지=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const _JEOLGI=[6,4,6,5,6,6,7,7,8,8,7,7];
const _MONTH_BRANCH={1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,11:11,12:0};

function _jd(y,m,d){if(m<=2){y-=1;m+=12;}const A=Math.floor(y/100);const B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524;}
function calcYearPillar(y,m,d){let yr=y;if(m<2||(m===2&&d<4))yr--;const idx=(((yr-4)%10)+10)%10;const brx=(((yr-4)%12)+12)%12;return{stem:_천간[idx],branch:_지지[brx]};}
function calcMonthPillar(y,m,d){let cm=m,cy=y;if(d<_JEOLGI[m-1]){cm=m===1?12:m-1;if(cm===12)cy=y-1;}const branchIdx=_MONTH_BRANCH[cm];const yp=calcYearPillar(cy,cm,15);const yi=_천간.indexOf(yp.stem);const starts=[2,4,6,8,0];const start=starts[yi%5];const offset=(branchIdx-2+12)%12;const stemIdx=(start+offset)%10;return{stem:_천간[stemIdx],branch:_지지[branchIdx]};}
function calcDayPillar(y,m,d){const idx=(_jd(y,m,d)+49)%60;return{stem:_천간[idx%10],branch:_지지[idx%12]};}
function calcHourPillar(dayPillarStem,hourVal){if(!hourVal)return null;const h=parseInt(hourVal);let sj;if(h===23||h===0){sj=0;}else{sj=Math.floor((h+1)/2)%12;}const di=_천간.indexOf(dayPillarStem);const starts=[0,2,4,6,8];const stemIdx=(starts[di%5]+sj)%10;return{stem:_천간[stemIdx],branch:_지지[sj]};}

// 십신/격국
const WOLJI_JURIGAN={子:'癸',丑:'己',寅:'甲',卯:'乙',辰:'戊',巳:'丙',午:'丁',未:'己',申:'庚',酉:'辛',戌:'戊',亥:'壬'};
const _오행G={甲:'목',乙:'목',丙:'화',丁:'화',戊:'토',己:'토',庚:'금',辛:'금',壬:'수',癸:'수'};
const _음양G={甲:0,乙:1,丙:0,丁:1,戊:0,己:1,庚:0,辛:1,壬:0,癸:1};
const _지오G={子:'수',丑:'토',寅:'목',卯:'목',辰:'토',巳:'화',午:'화',未:'토',申:'금',酉:'금',戌:'토',亥:'수'};
const _SH={목:'화',화:'토',토:'금',금:'수',수:'목'};
const _KE2={목:'토',토:'수',수:'화',화:'금',금:'목'};
const _지지본기={子:'癸',丑:'己',寅:'甲',卯:'乙',辰:'戊',巳:'丙',午:'丁',未:'己',申:'庚',酉:'辛',戌:'戊',亥:'壬'};

function calcSipshin(ilgan,target,isBranch=false){
  if(!ilgan||!target)return'';
  const iO=_오행G[ilgan];
  const tO=isBranch?_지오G[target]:_오행G[target];
  if(!iO||!tO)return'';
  const tYin=isBranch?_음양G[_지지본기[target]]:_음양G[target];
  const same=_음양G[ilgan]===tYin;
  if(iO===tO)return same?'비견':'겁재';
  if(_SH[iO]===tO)return same?'식신':'상관';
  if(_KE2[iO]===tO)return same?'편재':'정재';
  if(_KE2[tO]===iO)return same?'편관':'정관';
  if(_SH[tO]===iO)return same?'편인':'정인';
  return'';
}

function calcGeukgukNew(ilgan,wolji){
  const jurigan=WOLJI_JURIGAN[wolji];
  if(!jurigan)return{name:'잡기격',keyword:'다양한 재능',sipshin:'',jurigan:''};
  const sipshin=calcSipshin(ilgan,jurigan);
  const map={비견:{name:'건록격',keyword:'자수성가 · 독립',job:'창업·스포츠·군사·영업'},겁재:{name:'양인격',keyword:'강한 의지 · 승부',job:'군인·의사·운동선수·법조인'},식신:{name:'식신격',keyword:'풍요 · 재능',job:'요식업·예술·연구·콘텐츠·전문직'},상관:{name:'상관격',keyword:'탁월한 표현 · 예술',job:'예술·작가·강사·디자인·평론'},편재:{name:'편재격',keyword:'역동적 재물 · 활동',job:'금융·투자·무역·영업·IT'},정재:{name:'정재격',keyword:'안정적 재물 · 성실',job:'회계·금융·부동산·관리직'},편관:{name:'편관격',keyword:'도전 · 무관 기질',job:'군인·경찰·스포츠·법조인'},정관:{name:'정관격',keyword:'명예 · 원칙',job:'공무원·교육·법조·행정·금융'},편인:{name:'편인격',keyword:'직관 · 연구',job:'연구·학술·종교·철학·심리·작가'},정인:{name:'정인격',keyword:'학문 · 안정',job:'교사·학자·의료·복지·문서'},};
  return{...(map[sipshin]||{name:'잡기격',keyword:'다양한 재능',job:''}),sipshin,jurigan};
}

function getRelation(elem1,elem2){
  if(elem1===elem2)return"비화";
  if(DB.relations[elem1]?.sheng===elem2)return"생";
  if(DB.relations[elem1]?.ke===elem2)return"극";
  if(DB.relations[elem2]?.sheng===elem1)return"피생";
  if(DB.relations[elem2]?.ke===elem1)return"피극";
  return"무관";
}
function getSipshin(ilgan,target){const ss=calcSipshin(ilgan,target);return{name:ss||'기타',meaning:ss||''};}
function analyzeYongsin(pillars,ilgan){
  const elems={wood:0,fire:0,earth:0,metal:0,water:0};
  pillars.forEach(p=>{if(p){if(DB.stems[p.stem]?.element)elems[DB.stems[p.stem].element]++;if(DB.branches[p.branch]?.element)elems[DB.branches[p.branch].element]++;}});
  const sorted=Object.entries(elems).sort((a,b)=>b[1]-a[1]);
  const strongest=sorted[0][0];
  const ilElem=DB.stems[ilgan]?.element;
  const needsElem=DB.relations[strongest]?.ke===ilElem?DB.relations[ilElem]?.sheng:DB.relations[strongest]?.ke;
  return{distribution:elems,strongest,weakest:sorted[sorted.length-1][0],yongsin:needsElem};
}
function analyzeSaenggeuk(pillars){
  const results=[];
  const chars=pillars.filter(Boolean).flatMap(p=>[{char:p.stem,elem:DB.stems[p.stem]?.element,type:"stem"},{char:p.branch,elem:DB.branches[p.branch]?.element,type:"branch"}]);
  for(let i=0;i<chars.length-1;i++){const a=chars[i],b=chars[i+1];if(!a.elem||!b.elem)continue;const rel=getRelation(a.elem,b.elem);results.push({from:a.char,to:b.char,rel,fromElem:a.elem,toElem:b.elem});}
  return results;
}
function calcSinsal(yearBranch,branches){
  const table=DB.sinsal[yearBranch];if(!table)return[];
  const sinsalNames=['겁살','재살','천살','지살','년살','월살','망신','장성','반안','역마','육해','화개'];
  const branchToSinsal={};table.forEach((br,i)=>{branchToSinsal[br]=sinsalNames[i];});
  return branches.map(b=>({branch:b,sinsal:branchToSinsal[b]||null,info:branchToSinsal[b]?DB.sinsalInfo[branchToSinsal[b]]:null})).filter(r=>r.sinsal);
}


/* ============================================================
 * 통합 분석 함수 (페이지에서 호출하는 메인 엔트리)
 * ============================================================ */
function analyzeSaju(input) {
  // input: { year, month, day, hour, calType, isLeap, gender }
  let { year, month, day, hour, calType = 'solar', isLeap = false, gender = 'M' } = input;

  // 음력 → 양력
  if (calType === 'lunar' || calType === 'lunar-leap') {
    const converted = lunarToSolar(year, month, day, calType === 'lunar-leap');
    if (!converted) return { error: `음력 ${year}년은 DB 범위(1930~2030)를 벗어났습니다.` };
    year = converted.y; month = converted.m; day = converted.d;
  }

  const yp = calcYearPillar(year, month, day);
  const mp = calcMonthPillar(year, month, day);
  const dp = calcDayPillar(year, month, day);
  const hp = hour != null ? calcHourPillar(dp.stem, String(hour)) : null;

  const pillars = [yp, mp, dp, hp].filter(Boolean);
  const ilgan = dp.stem;
  const wolji = mp.branch;
  const ilji = dp.branch;

  const yongsin = analyzeYongsin(pillars, ilgan);
  const saenggeuk = analyzeSaenggeuk(pillars);
  const sinsal = calcSinsal(yp.branch, pillars.map(p => p.branch));
  const geukguk = calcGeukgukNew(ilgan, wolji);

  // 온도 계산 (오행 분포 기반)
  const elemTempMap = { wood: 15, fire: 40, earth: 3, metal: -12, water: -28 };
  let temp = 0, total = 0;
  Object.entries(yongsin.distribution).forEach(([e, v]) => {
    temp += elemTempMap[e] * v; total += v;
  });
  temp = total > 0 ? Math.round((temp / total) * 10) / 10 : 0;

  return {
    pillars: { year: yp, month: mp, day: dp, hour: hp },
    ilgan, wolji, ilji,
    ilju: `${ilgan}${ilji}`,       // 일주 (예: 乙丑)
    iljuKr: getIljuKr(ilgan, ilji), // 한글 일주 (예: 을축)
    temperature: temp,
    distribution: yongsin.distribution,
    yongsin: yongsin.yongsin,
    strongest: yongsin.strongest,
    geukguk,
    sinsal,
    saenggeuk,
    input: { year, month, day, hour, gender }
  };
}

function getIljuKr(stem, branch) {
  const stemKr = { 甲:'갑',乙:'을',丙:'병',丁:'정',戊:'무',己:'기',庚:'경',辛:'신',壬:'임',癸:'계' };
  const branchKr = { 子:'자',丑:'축',寅:'인',卯:'묘',辰:'진',巳:'사',午:'오',未:'미',申:'신',酉:'유',戌:'술',亥:'해' };
  return (stemKr[stem] || '') + (branchKr[branch] || '');
}

// 온도 → 살롱 방 분류
function getTempRoom(temp) {
  if (temp <= -10) return { code: 'cool', name: '冷 · 차가운 방', desc: '깊이있는 사람들' };
  if (temp <= 15)  return { code: 'mild', name: '溫 · 따뜻한 방', desc: '균형잡힌 사람들' };
  return { code: 'hot', name: '炎 · 뜨거운 방', desc: '열정적인 사람들' };
}

// 전역 노출
window.DB = DB;
window.analyzeSaju = analyzeSaju;
window.getIljuKr = getIljuKr;
window.getTempRoom = getTempRoom;
window.lunarToSolar = lunarToSolar;
