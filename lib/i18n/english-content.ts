type ContentMap = Record<string, string>;

let CONTENT_MAP: ContentMap = {};
let CONTENT_ENTRIES: Array<[string, string]> = [];
let PARTIAL_ENTRIES: Array<[string, string]> = [];
let TEMPLATE_PATTERNS: Array<{ pattern: RegExp; placeholders: string[]; english: string }> = [];

let contentLoad: Promise<void> | null = null;

/** Load the large, pretranslated reading catalogue only when an English feature is opened. */
export function loadEnglishContent(): Promise<void> {
  if (CONTENT_ENTRIES.length > 0) return Promise.resolve();
  if (!contentLoad) {
    contentLoad = import("@/data/en/content-map.json").then((module) => {
      CONTENT_MAP = module.default as ContentMap;
      CONTENT_ENTRIES = Object.entries(CONTENT_MAP).sort(([a], [b]) => b.length - a.length);
      PARTIAL_ENTRIES = CONTENT_ENTRIES.filter(([korean]) =>
        [...korean].filter((character) => /[가-힣]/.test(character)).length >= 6 && !korean.includes("{"),
      );
      TEMPLATE_PATTERNS = CONTENT_ENTRIES
        .filter(([korean]) => korean.includes("{"))
        .map(([korean, english]) => {
          const placeholders: string[] = [];
          const pattern = new RegExp(
            `^${korean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\{([^{}]+)\\\}/g, (_match, name: string) => {
              placeholders.push(name);
              return "([\\s\\S]*?)";
            })}$`,
          );
          return { pattern, placeholders, english };
        });
    }).catch((error) => {
      contentLoad = null;
      throw error;
    });
  }
  return contentLoad;
}

const EDITORIAL_OVERRIDES: Record<string, string> = {
  "일간 총평 (나의 뿌리)": "Your Day Master and root support",
  "기본 성향": "Core traits",
  "주도": "Initiative",
  "합": "Harmony", "충": "Clash", "형": "Punishment", "파": "Break", "해": "Harm",
  "목요일": "Thursday", "화요일": "Tuesday", "수요일": "Wednesday", "금요일": "Friday", "토요일": "Saturday",
  "공원·숲·캠퍼스처럼 초록빛이 있는 곳": "A green setting such as a park, woodland, or campus",
  "라이브 공연장·페스티벌·트렌디한 카페처럼 활기찬 곳": "A lively venue such as a concert, festival, or café",
  "전통찻집·소규모 모임·익숙한 동네처럼 아늑한 곳": "A cozy setting such as a tea house, small gathering, or familiar neighborhood",
  "갤러리·전시회·서점처럼 정돈되고 세련된 곳": "A calm, well-designed space such as a gallery, exhibition, or bookstore",
  "강변·바닷가·조용한 재즈바처럼 물이 보이는 곳": "A peaceful place near water, such as a riverside, beach, or quiet jazz bar",
  "목(木) 기운을 보완해주는 요일이에요. 새로운 사람을 만나거나 관계를 한 걸음 넓혀보기 좋은 날이에요.": "Thursday supports your Wood element. It may be a good day to meet someone new or take a small step toward expanding your social circle.",
  "화(火) 기운을 보완해주는 요일이에요. 밝고 적극적인 에너지가 필요할 때 좋은 날이에요.": "Tuesday supports your Fire element. It may suit a day when you want to bring more warmth and initiative to an interaction.",
  "토(土) 기운을 보완해주는 요일이에요. 안정적이고 편안한 분위기 속에서 관계를 다지기 좋은 날이에요.": "Saturday supports your Earth element. A relaxed, steady atmosphere may help you strengthen a connection.",
  "금(金) 기운을 보완해주는 요일이에요. 마음을 정리하고 결정을 내리기 좋은 날이에요.": "Friday supports your Metal element. It may be a good day to clarify your thoughts and make a decision.",
  "수(水) 기운을 보완해주는 요일이에요. 차분하게 진심을 전하기 좋은 날이에요.": "Wednesday supports your Water element. Its calmer pace may make it easier to express what you really mean.",
  "목(木) 기운을 보완해주는 장소예요. 편안하게 걸으며 대화하기 좋은 분위기가 관계를 부드럽게 열어줘요.": "This setting supports your Wood element. A relaxed walk and conversation may help the connection unfold naturally.",
  "화(火) 기운을 보완해주는 장소예요. 밝은 에너지가 있는 곳에서 매력이 더 잘 드러나요.": "This setting supports your Fire element. Your warmth and enthusiasm may come through more easily in a lively place.",
  "토(土) 기운을 보완해주는 장소예요. 편안하고 안정적인 분위기가 진솔한 대화를 이끌어내요.": "This setting supports your Earth element. A comfortable, familiar atmosphere may make honest conversation easier.",
  "금(金) 기운을 보완해주는 장소예요. 차분하고 감각적인 공간이 좋은 인상을 남겨요.": "This setting supports your Metal element. A calm, thoughtfully arranged space may help you make a clear impression.",
  "수(水) 기운을 보완해주는 장소예요. 차분한 분위기가 마음을 여는 데 도움이 돼요.": "This setting supports your Water element. A quiet atmosphere may make it easier to open up.",
  "부딪히거나 서먹해지기 쉬운 조합이지만, 서로 다름을 이해하려는 노력이 있으면 오히려 자극이 되는 관계예요": "This pairing may bring friction or awkward moments, but an effort to understand your differences can turn them into a source of growth.",
  "같은 원소라 감정의 결이 비슷해서 편하게 통하는 편이에요": "You share an element, so your emotional rhythms may feel familiar and easy to understand.",
  "서로 다른 매력에 자연스럽게 이끌리며 보완이 되는 조합이에요": "Your differences can create a natural attraction and help balance one another.",
  "정반대 성향이라 부딪히기 쉽지만, 그만큼 서로에게 강하게 끌리는 조합으로도 알려져 있어요": "Opposite temperaments can create friction, but they can also bring a strong mutual attraction.",
  "봄에 태어난 사주예요. 계절 기운(조후) 자체의 치우침은 크지 않은 편이에요.": "You were born in spring. The seasonal balance in your chart is relatively even.",
  "여름에 태어난 사주예요. 계절 기운(조후) 자체의 치우침은 크지 않은 편이에요.": "You were born in summer. The seasonal balance in your chart is relatively even.",
  "가을에 태어난 사주예요. 계절 기운(조후) 자체의 치우침은 크지 않은 편이에요.": "You were born in autumn. The seasonal balance in your chart is relatively even.",
  "겨울에 태어난 사주예요. 계절 기운(조후) 자체의 치우침은 크지 않은 편이에요.": "You were born in winter. The seasonal balance in your chart is relatively even.",
  "결단력": "Decisiveness", "독립심": "Independence", "추진력": "Initiative", "고집": "Stubbornness", "직설적인 표현": "Blunt communication", "독립": "Independence", "도전": "Challenge",
  "표현력": "Expressiveness", "창의력": "Creativity", "순발력": "Quick thinking", "산만함": "Scattered focus", "즉흥적인 결정": "Impulsive decisions", "표현": "Expression", "창의": "Creativity", "확장": "Expansion",
  "실행력": "Execution", "현실 감각": "Practical judgment", "목표 지향": "Goal orientation", "조급함": "Impatience", "일 중심으로 치우침": "Overfocus on work", "성취": "Achievement", "실리": "Practicality", "추진": "Drive",
  "책임감": "Responsibility", "신뢰": "Trustworthiness", "리더십": "Leadership", "경직됨": "Rigidity", "완벽주의": "Perfectionism", "책임": "Responsibility", "성장": "Growth",
  "통찰력": "Insight", "학습력": "Learning ability", "안정감": "Stability", "결정을 미루는 습관": "Tendency to delay decisions", "의존적인 성향": "Dependence", "배움": "Learning", "안정": "Stability", "성찰": "Reflection",
  "건강운": "Well-being", "인생 전체를 관통하는 흐름": "Patterns across your life",
  "정리하자면, 당신은 책임감과 원칙이 삶의 중심을 잡아주는 사주예요. 다만 스스로에게 너무 엄격해지지 않도록, 유연함을 함께 챙기는 것이 인생을 더 편안하게 만들어줘요.": "In summary, responsibility and a strong sense of principle help you stay grounded. Give yourself room to adapt, too; being less demanding of yourself can make life feel easier.",
  "정리하자면, 당신은 스스로 개척하는 힘이 강한 사주예요. 남에게 기대기보다 직접 부딪히고 결정하는 삶의 방식이 당신에게 가장 잘 맞고, 그 과정에서 진짜 자신감이 쌓여가요.": "In summary, self-direction is one of your chart's defining strengths. You may gain confidence by making your own choices and learning through direct experience.",
  "정리하자면, 당신은 표현하고 나누는 데서 에너지를 얻는 사주예요. 정해진 틀보다 자유롭게 펼칠 수 있는 환경에서 삶의 만족도가 훨씬 높아져요.": "In summary, expression and sharing can be important sources of energy for you. You may feel more fulfilled in settings that leave room for creativity and independence.",
  "정리하자면, 당신은 현실적인 감각과 꾸준함이 강점인 사주예요. 화려한 성과보다 차근차근 쌓아가는 노력이 결국 가장 단단한 결실로 돌아와요.": "In summary, practical judgment and consistency are among your strengths. Steady progress may bring more lasting results than chasing quick recognition.",
  "정리하자면, 당신은 배우고 채우는 과정 자체를 소중히 여기는 사주예요. 조급함보다 천천히 쌓아가는 태도가 결국 가장 깊은 성장으로 이어질 거예요.": "In summary, you value learning and continued growth. Taking time to build your skills may lead to deeper, more lasting progress than rushing.",
  "초년기부터 현실 감각이 남다른 편이에요. 용돈 관리나 계획적인 행동에서 또래보다 야무진 모습을 보이고, 갖고 싶은 게 있으면 스스로 방법을 찾아 얻어내려는 실행력이 있어요. 다만 너무 일찍 철이 드는 만큼, 마음껏 어린아이답게 지낼 여유도 필요해요.": "You may have shown practical judgment from an early age. You are resourceful with money and planning, and tend to find ways to work toward what you want. Because you may have had to grow up quickly, it is also important to leave room for the carefree parts of childhood.",
  "이 대운에는 맡는 자리와 무게가 눈에 띄게 커져요. 결혼, 승진, 새로운 책임처럼 인생의 다음 단계로 넘어가는 시기예요. 모든 걸 원칙대로만 처리하기보다 유연한 대응도 함께 필요해요.": "You may take on a more prominent role and greater responsibility during this major luck cycle. It can mark a transition into a new stage of life through marriage, promotion, or other commitments. Alongside your principles, a flexible response to changing circumstances will help.",
  "당신은 재성(財星)의 기운이 약한 신약 사주예요. 크게 베팅하기보다 안정적으로 하나씩 쌓아가는 방식이 훨씬 잘 맞는 타입이에요. 성실함과 관리 능력이 강점이지만, 신중함이 지나쳐 좋은 기회 앞에서도 한 발 물러서는 습관은 아쉬운 지점이 될 수 있어요. 꾸준함이 쌓이면 누구보다 단단한 결과를 만들어내는 스타일이에요. 관계에서는 손익을 따지기보다 마음으로 다가가는 편이라, 계산 없이 곁을 내주는 사람으로 신뢰를 얻어요. 큰 결정 앞에서 확신이 서지 않아 미루는 습관이 있으니, 작은 결정부터 스스로 내려보는 연습이 자신감을 키우는 데 도움이 돼요. 단기 성과보다 장기적으로 신뢰를 쌓는 구조의 일과 관계에서 훨씬 오래, 훨씬 잘 풀리는 타입이에요.": "A relatively weak Wealth Star influence in your chart may make a steady, step-by-step approach more comfortable than taking big risks. Diligence and sound management are strengths, though caution may sometimes lead you to step back from good opportunities. Consistency can help you build lasting results. In relationships, you tend to lead with care rather than calculations, which helps you earn trust. If uncertainty makes you put off major choices, practicing with smaller decisions can build confidence. You may do especially well in work and relationships that reward long-term trust over short-term results.",
  "당신은 재성(財星)의 기운이 약한 신약 사주로, 성실하게 쌓아온 것들이 결국 인생의 자산이 되는 타입이에요. 크게 베팅하기보다 안정적으로 하나씩 쌓아가는 방식이 훨씬 잘 맞고, 그렇게 쌓은 것들은 쉽게 무너지지 않는 단단함을 가져요. 인생의 큰 전환점은 대체로 조급하게 뛰어든 순간보다, 충분히 준비한 뒤 움직인 순간에 찾아왔을 가능성이 커요. 관계에서도 손익을 따지기보다 마음으로 다가가는 편이라, 계산 없이 곁을 내주는 사람으로 신뢰를 얻는 경우가 많아요. 다만 신중함이 지나쳐 좋은 기회 앞에서도 자꾸 물러서는 습관은 인생 전체를 놓고 보면 아쉬운 지점이 될 수 있으니, 작은 결정부터 스스로 내려보는 연습이 자신감을 키우는 데 도움이 돼요. 단기 성과보다 장기적으로 신뢰를 쌓는 구조의 삶에서 훨씬 오래, 훨씬 잘 풀리는 사주예요.": "Your chart suggests that steady, diligent effort can become a lasting asset. You may feel more at home building security step by step than taking a big gamble, and what you build this way can be resilient. Major turning points may have come when you moved after preparing carefully rather than rushing in. In relationships, you tend to lead with sincerity instead of weighing every advantage, which can earn lasting trust. Still, too much caution may cause you to step back from promising opportunities. Practicing with small decisions can strengthen your confidence. Over time, you may find more lasting success in work and relationships built on trust than in short-term wins.",
  "판단이 빠르고 맺고 끊는 게 확실해서 결단력 있는 사람으로 보이지만, 그만큼 말이나 태도가 날카로워져 상대에게 차갑다는 인상을 줄 수 있어요. 원칙과 기준을 앞세우다 보니 융통성이 부족해 보일 때가 있고, 관계에서도 감정보다 옳고 그름을 먼저 따지다 서운함을 주는 경우가 생겨요. 완벽주의 성향이 강해 스스로를 몰아붙이기 쉬우니, 기준을 조금 느슨하게 풀어주는 여유가 필요해요.": "You may come across as decisive because you assess situations quickly and are clear about where you stand. At times, that directness can make your words or manner seem sharp. Your strong principles can also make you appear inflexible, or lead you to focus on what is right before considering someone's feelings. Since perfectionism may cause you to put too much pressure on yourself, try allowing a little more room for imperfection.",
  "표현력과 열정이 넘쳐서 사람들 앞에서 밝고 적극적인 인상을 주는 편이에요. 다만 감정이 오르내리는 폭이 크고 순간적으로 욱하는 성급함이 나올 때가 있어서, 관계에서 상대가 부담을 느끼거나 다투게 되는 경우도 생겨요. 관심이 이곳저곳으로 빨리 옮겨가다 보니 한 가지에 진득하게 집중하기 어려울 수 있고, 감정 기복이 심한 날은 몸도 같이 지치기 쉬우니 흥분한 감정을 가라앉히는 나만의 방법을 만들어두면 좋아요.": "You may make a lively, enthusiastic impression and bring strong expressive energy to a group. Your emotions can also shift quickly, and an impulsive reaction may sometimes create tension in a relationship. Because your attention moves quickly between interests, sustained focus may take effort. A personal routine for calming down can help you manage both emotional and physical fatigue.",
  "차근차근 신뢰를 재산으로 만드는 사람": "Someone who builds lasting security through steady effort and trust",
  "청장년기는 경제적 기반을 실질적으로 쌓아가는 핵심 시기예요. 결혼, 내 집 마련, 자산 형성처럼 현실적인 목표들이 이 시기에 집중되고, 노력한 만큼 눈에 보이는 결과로 이어지는 경향이 강해요. 일과 가정을 동시에 챙기느라 바빠지지만, 그만큼 삶의 기반이 단단해지는 시기예요.": "Young and middle adulthood is a key period for building a practical foundation. Goals such as marriage, buying a home, and growing your assets may take priority, and steady effort can bring visible results. You may be busy balancing work and family, while also strengthening the foundations of your life.",
  "말년에도 여전히 활동적이고 독립적인 삶을 지향하는 편이에요. 자식이나 후배에게 기대기보다 스스로 삶을 꾸려가는 걸 편안해하고, 나이가 들어서도 새로운 일을 시작할 힘이 남아있는 경우가 많아요. 다만 혼자 모든 걸 짊어지려는 습관은 이 시기에는 조금 내려놓는 연습이 필요해요.": "You may continue to value an active, independent life as you grow older. You may feel more comfortable managing your own life than relying on your children or younger people, and still have the energy to begin something new. It can help to let go of the habit of carrying everything alone.",
  "확장기": "Expansion phase", "결실기": "Results phase", "책임기": "Responsibility phase", "정비기": "Consolidation phase", "결단기": "Decisive action phase",
  "년지": "Year Branch", "월지": "Month Branch", "일지": "Day Branch", "시지": "Hour Branch",
  "천을귀인": "Heavenly Nobleman Star", "역마살": "Traveling Horse Star", "도화살": "Peach Blossom Star", "양인살": "Yang Blade Star", "화개살": "Canopy Star", "문창귀인": "Literary Star",
  "겁살": "Robbery Star", "재살": "Calamity Star", "천살": "Heavenly Calamity Star", "지살": "Earthly Movement Star", "월살": "Moon Obstruction Star", "망신살": "Reputation Star",
  "장성살": "General Star", "반안살": "Saddle Star", "육해살": "Six Harms Star", "괴강살": "Commanding Star", "백호살": "White Tiger Star",
  "하늘이 내린 귀인의 별이에요. 어려운 순간에 뜻밖의 도움을 주는 사람이 나타나고, 위기를 수월하게 넘기는 복이 따른다고 봐요.": "Traditionally associated with timely support and helpful people. When challenges arise, an unexpected ally or useful advice may help you find a way through.",
  "이동과 변화의 별이에요. 한곳에 머물기보다 움직일 때 기회가 열리는 편이라, 여행·이사·해외 등 활동 반경이 넓은 삶과 잘 맞아요.": "Associated with movement and change. Opportunities may open when you explore new places, travel, relocate, or work across regions.",
  "인기와 매력의 별이에요. 사람들의 시선을 끌고 호감을 사는 힘이 있어서, 대인관계나 표현이 중요한 분야에서 강점으로 작용해요.": "Associated with charm, popularity, and social appeal. This can be a strength in people-facing or expressive work; clear boundaries help keep your attention from spreading too thin.",
  "칼날처럼 날카롭고 강한 기운의 별이에요. 추진력과 결단력이 남다르고 승부욕이 강하지만, 그만큼 과감하고 극단으로 치우치지 않게 스스로 조절하는 힘도 필요해요.": "Associated with sharp drive, decisiveness, and a competitive edge. Channel that intensity deliberately, and leave room to pause before reacting.",
  "화려함을 감싸는 별이라는 뜻으로, 예술·학문·종교처럼 깊이 파고드는 분야에 재능이 있어요. 혼자만의 시간에서 힘을 얻는 편이라, 고독을 즐길 줄 아는 게 강점이 돼요.": "Associated with deep focus, art, study, and spiritual interests. Solitude can restore you, while balance helps prevent isolation.",
  "글과 학문의 기운을 타고난 별이에요. 이해력과 습득력이 빨라 공부나 시험에서 두각을 나타내기 쉽고, 글쓰기·연구·기획처럼 머리를 쓰는 일에서 재능이 돋보여요.": "Associated with learning, writing, and quick understanding. These qualities may support study, exams, research, planning, and other knowledge-based work.",
  "예상 밖의 변화가 갑작스레 찾아오는 별이에요. 준비 없이 상황이 바뀔 때가 있으니, 중요한 결정 앞에서는 여유 있게 대비책을 마련해두는 습관이 도움이 돼요.": "Associated with sudden changes or unexpected developments. Keeping a backup plan and allowing time before major decisions may help you adapt.",
  "외부 압박이나 다툼에 휘말리기 쉬운 별이에요. 남의 일에 얽히기보다 내 페이스를 지키는 게 중요하고, 시비가 붙을 상황은 미리 피하는 지혜가 필요해요.": "Associated with outside pressure and conflict. Staying focused on your priorities and avoiding unnecessary disputes may help.",
  "내 힘으로 어쩔 수 없는 큰 흐름을 마주하는 별이에요. 애써도 안 되는 일에 매달리기보다, 흐름을 받아들이고 다음 기회를 준비하는 유연함이 강점이 돼요.": "Associated with larger circumstances beyond your control. Flexibility can help you respond to what cannot be forced and prepare for the next opportunity.",
  "낯선 곳에서 오히려 편안함을 느끼는 별이에요. 타지 생활, 출장, 유학처럼 익숙한 터전을 벗어나는 경험이 스스로를 성장시키는 기회가 돼요.": "Associated with unfamiliar places and movement. Travel, relocation, or new environments may give you room to grow.",
  "에너지가 잠시 고이는 정체의 별이에요. 무리하게 밀어붙이기보다 숨 고르며 내실을 다지는 시기로 삼으면, 다음 도약을 위한 힘을 충분히 비축할 수 있어요.": "Associated with delays or a pause in momentum. This can be a useful period to rest, review plans, and strengthen your foundation.",
  "체면이나 평판에 예민해지는 별이에요. 말과 행동에서 실수가 도드라져 보일 수 있으니, 중요한 자리일수록 한 번 더 점검하는 신중함이 방패가 돼요.": "Associated with heightened sensitivity around reputation or embarrassment. Reviewing your words and actions can help prevent avoidable misunderstandings.",
  "장수의 별이라 불릴 만큼 강한 리더십과 카리스마를 지녔어요. 조직을 이끌거나 책임을 맡는 자리에서 진가를 발휘하고, 위기 앞에서 더 단단해지는 힘이 있어요.": "Associated with leadership and responsibility. You may do well when guiding a team or taking ownership, especially under pressure.",
  "말안장 위에 편안히 오른다는 뜻의 별로, 승진이나 지위 상승과 잘 어울려요. 그동안 쌓아온 노력이 안정적인 성과와 인정으로 이어지기 쉬운 흐름이에요.": "Associated with gradual advancement and recognition. Consistent effort may lead to promotion or a more stable position.",
  "몸과 마음의 피로가 잘 쌓이는 별이에요. 건강 관리와 가까운 사람과의 관계에 평소보다 조금 더 신경 쓰면, 큰 탈 없이 이 시기를 잘 넘길 수 있어요.": "Associated with accumulated fatigue or subtle tension in close relationships. Looking after your well-being and staying attentive to people close to you may help.",
  "별들의 우두머리라 불릴 만큼 카리스마와 결단력이 강한 별이에요. 극단으로 치우치면 크게 오르내리는 굴곡이 생길 수 있지만, 스스로를 잘 다스리면 남다른 추진력으로 큰 성취를 이루는 힘이 돼요.": "Associated with a strong presence and decisiveness. Used with balance, this intensity can support major achievements; excess may bring sharper ups and downs.",
  "호랑이처럼 강렬하고 예측하기 어려운 에너지를 지닌 별이에요. 급격한 변화나 예상치 못한 상황에 놓이기 쉽다고 보기도 하지만, 그만큼 위기 앞에서 발휘되는 용맹함과 대처 능력이 남다르다고 봐요. 평소 침착함을 유지하는 습관을 들이면 강한 추진력으로 잘 활용할 수 있어요.": "Associated with intense, unpredictable energy and quick responses in a crisis. Staying calm and attentive to safety can help you channel this strength constructively.",
  "장생": "Growth", "목욕": "Bath", "관대": "Crowning", "건록": "Prosperity", "제왕": "Peak", "쇠": "Decline", "병": "Sickness", "사": "Death", "묘": "Storage", "절": "Extinction", "태": "Conception", "양": "Nurturing",
  "일간이 원국 어디에도 뿌리를 내리지 못했어요. 기세가 가볍게 흘러가는 편이라, 대운이나 주변 환경의 영향을 비교적 크게 받는 구조예요.": "Your Day Master has no roots in the natal chart. Your energy may shift more easily, making you more responsive to major luck cycles and your surroundings.",
  "일간이 한 곳에 뿌리를 내렸어요. 완전히 흔들리는 구조는 아니지만, 큰 충격이 오면 다소 휘청일 수 있어요.": "Your Day Master has one root in the chart. This gives you some stability, though a major disruption may still unsettle you.",
  "일간이 원국 전체에 뿌리를 단단히 내렸어요. 기반이 튼튼해서 어지간한 충극이 와도 크게 흔들리지 않는 안정적인 구조예요.": "Your Day Master is firmly rooted throughout the chart. This provides a solid foundation that can help you stay steady through many challenges.",
  "일간이 여러 곳에 뿌리를 내렸어요. 어느 정도 안정된 기반이 있어서, 웬만한 변화에는 쉽게 흔들리지 않는 편이에요.": "Your Day Master has roots in several parts of the chart. This gives you a stable foundation, so ordinary changes are less likely to throw you off balance.",
  "새로 태어나 자라나는 기운이에요. 시작하고 성장하는 힘이 좋고, 주변의 보살핌과 기회가 따르는 시기예요.": "This phase represents birth and growth. It is associated with fresh starts, development, and support from people or opportunities around you.",
  "몸을 씻듯 변화와 방황이 함께하는 기운이에요. 감수성이 예민해지고, 시행착오를 겪으며 다듬어지는 시기예요.": "This phase represents change and exploration. Sensitivity may increase, and experience can help you refine your direction.",
  "관과 띠를 갖춰 입듯 스스로 틀을 갖춰가는 기운이에요. 자립심이 강해지고, 사회로 나설 준비를 하는 시기예요.": "This phase represents gaining confidence and structure. Independence grows as you prepare to take your place in the wider world.",
  "가장 안정적으로 힘을 쓸 수 있는 기운이에요. 실력이 무르익어 스스로 벌어들이고 성과를 만드는 시기예요.": "This phase represents steady, capable effort. Skills mature, making it easier to earn through your own work and produce results.",
  "기운이 최고조에 이른 왕성한 시기예요. 추진력과 자신감이 강하지만, 그만큼 고집도 세지기 쉬워요.": "This phase represents peak energy and confidence. Drive is strong, though it can help to stay open to other perspectives.",
  "정점을 지나 서서히 내려오는 기운이에요. 무리한 확장보다 지금까지 쌓은 걸 다지고 관리하기 좋은 시기예요.": "This phase represents a gradual shift after a peak. It favors consolidating and managing what you have built over pushing for rapid expansion.",
  "기운이 약해지며 쉼이 필요한 시기예요. 몸과 마음의 컨디션을 세심하게 챙기는 게 중요해요.": "This phase represents lower energy and a need for rest. Paying attention to your physical and emotional well-being is helpful.",
  "기운이 멈추고 정리되는 시기예요. 겉으로는 조용하지만, 내면을 돌아보고 정리하기에 좋은 시기예요.": "This phase represents pause and closure. It can be a quiet time to reflect and put matters in order.",
  "곳간에 갈무리하듯 기운을 저장하는 시기예요. 드러내기보다 안으로 축적하는 흐름이 강해요.": "This phase represents storing energy and resources. Progress may be quieter and more focused on building from within.",
  "기운이 완전히 끊어졌다 다시 이어지기 직전의 시기예요. 변화의 폭이 크고, 새로운 국면으로 넘어가는 전환점이에요.": "This phase represents a turning point between endings and renewal. Changes may be significant as one chapter gives way to another.",
  "새 생명이 잉태되듯 다음 기운이 움트는 시기예요. 아직 드러나지 않지만 가능성이 자라나고 있어요.": "This phase represents conception and emerging potential. What is developing may not be visible yet, but it is beginning to take shape.",
  "태 안에서 자라나며 다음 장생을 준비하는 시기예요. 조용히 힘을 기르고 준비하는 흐름이에요.": "This phase represents nurturing and preparation. It is a quieter period for gathering strength before the next beginning.",
  "귀한 자리에 오른다": "You rise to a distinguished position", "존귀함이 따라붙는다": "Respect and recognition follow", "여유와 품격을 아는 삶": "A life with ease and refinement", "실력으로 인정받는다": "Your skills earn recognition", "성실함이 곧 재산": "Steady effort becomes an asset", "묵묵함이 결실을 맺는다": "Quiet persistence bears fruit", "정착보다 자유로운 삶": "Freedom matters more than settling down",
  "쥐띠는 영리하고 순발력이 뛰어나요. 상황 판단이 빠르고 눈치가 좋아서 어떤 환경에서도 빠르게 적응하고 기회를 놓치지 않는 편이에요. 부지런하고 현실 감각이 뛰어난 게 강점이지만, 너무 계산적으로 움직인다는 인상을 줄 때도 있어요. 변화가 많은 환경에서 특유의 순발력이 빛을 발하는 타입이에요.": "If you were born in the Year of the Rat, you may be quick-minded and observant. You read situations well, adapt to new settings, and often spot opportunities early. Your diligence and practical judgment are strengths, though you may sometimes seem overly calculating. You tend to thrive in changing environments where quick thinking matters.",
  "소띠는 성실하고 인내심이 강해요. 묵묵히 자기 몫을 해내는 뚝심이 있고, 한번 맡은 일은 끝까지 책임지려는 태도가 몸에 배어 있어요. 신뢰감 있고 꾸준한 게 강점이지만, 고집이 세고 변화에 유연하게 대응하는 게 서툰 편이에요. 시간을 두고 성과를 쌓아가는 일에서 진가를 발휘하는 타입이에요.": "If you were born in the Year of the Ox, you may be steady, diligent, and patient. You have the persistence to do your share quietly and tend to see commitments through. Reliability is a strength, though you may find it hard to change course. You often do your best work when results are built over time.",
  "호랑이띠는 추진력과 리더십이 강해요. 목표가 생기면 망설이지 않고 밀고 나가는 힘이 있고, 어려운 상황에서도 물러서지 않는 배짱이 있어요. 당당하고 도전적인 게 강점이지만, 성격이 급하고 규칙에 얽매이는 걸 답답해할 때가 있어요. 스스로 주도권을 쥘 수 있는 환경에서 능력이 극대화되는 타입이에요.": "If you were born in the Year of the Tiger, you may have strong drive and leadership instincts. Once you set a goal, you can move decisively and stay bold through challenges. Confidence and courage are strengths, though impatience or rigid rules may frustrate you. You tend to thrive when you have room to take the lead.",
  "토끼띠는 온화하고 섬세한 감각을 지녔어요. 사람과의 관계에서 세심하게 배려할 줄 알고, 부드러운 태도로 주변을 편안하게 만드는 재주가 있어요. 따뜻하고 눈치 빠른 게 강점이지만, 갈등을 피하려다 하고 싶은 말을 삼키는 습관은 아쉬운 지점이에요. 안정적이고 평화로운 분위기 속에서 능력이 잘 드러나는 타입이에요.": "If you were born in the Year of the Rabbit, you may be gentle, perceptive, and considerate. You notice what others need and can put people at ease with a warm manner. Sensitivity is a strength, though avoiding conflict may lead you to hold back what you want to say. You tend to feel at your best in calm, stable surroundings.",
  "용띠는 자신감과 포부가 큰 편이에요. 큰 그림을 그리는 걸 좋아하고, 남들이 주저하는 일에도 과감하게 뛰어드는 배포가 있어요. 카리스마 있고 진취적인 게 강점이지만, 자존심이 강해 작은 지적에도 예민하게 반응할 수 있어요. 스스로의 역량을 마음껏 펼칠 수 있는 큰 무대에서 빛나는 타입이에요.": "If you were born in the Year of the Dragon, you may be ambitious and confident. You enjoy thinking big and may be willing to take on challenges others hesitate to try. Charisma and initiative are strengths, though pride can make criticism sting. You tend to shine when you have room to use your abilities fully.",
  "뱀띠는 침착하고 통찰력이 뛰어나요. 겉으로는 조용해 보여도 속으로는 상황을 예리하게 분석하고, 한번 판단하면 흔들리지 않는 신중함이 있어요. 지혜롭고 집중력이 강한 게 강점이지만, 속마음을 잘 드러내지 않아 오해를 사기도 해요. 깊이 있는 사고가 필요한 일에서 실력을 제대로 발휘하는 타입이에요.": "If you were born in the Year of the Snake, you may be calm, perceptive, and thoughtful. You can analyze a situation carefully and stay focused once you have reached a decision. Insight and concentration are strengths, though keeping your feelings private may lead to misunderstandings. You often excel at work that calls for depth and careful thought.",
  "말띠는 활동적이고 에너지가 넘쳐요. 한자리에 머무르기보다 계속 움직이고 새로운 것을 시도하는 걸 즐기며, 사람들 사이에서 밝은 분위기를 이끄는 편이에요. 열정적이고 사교적인 게 강점이지만, 싫증을 빨리 느끼고 꾸준함이 부족할 때가 있어요. 자유롭게 움직일 수 있는 활동적인 환경에서 매력이 극대화되는 타입이에요.": "If you were born in the Year of the Horse, you may be energetic, sociable, and drawn to new experiences. You enjoy staying active and often bring a lively mood to a group. Enthusiasm is a strength, though you may lose interest when routines feel repetitive. You tend to flourish in active settings with room to move.",
  "양띠는 따뜻하고 배려심이 깊어요. 주변 사람의 감정을 세심하게 살피고, 온화한 태도로 관계를 부드럽게 만드는 재능이 있어요. 다정하고 예술적 감각이 뛰어난 게 강점이지만, 마음이 여려 작은 말에도 쉽게 상처받는 편이에요. 편안하고 따뜻한 관계 안에서 진짜 재능이 드러나는 타입이에요.": "If you were born in the Year of the Goat, you may be warm, considerate, and sensitive to the feelings of others. Your gentle manner can help relationships feel more comfortable. Kindness and artistic instincts are strengths, though small remarks may affect you deeply. You tend to show your best qualities in supportive relationships.",
  "원숭이띠는 재치 있고 창의적이에요. 문제를 새로운 방식으로 풀어내는 걸 좋아하고, 어떤 상황에서도 유연하게 대처하는 순발력이 있어요. 영리하고 다재다능한 게 강점이지만, 한 가지에 진득하게 집중하는 걸 지루해하기도 해요. 다양한 자극과 변화가 있는 환경에서 능력이 잘 드러나는 타입이에요.": "If you were born in the Year of the Monkey, you may be witty, inventive, and adaptable. You enjoy finding new ways to solve problems and can respond quickly when circumstances change. Versatility is a strength, though staying focused on one thing for a long time may feel dull. You often thrive where there is variety and room to experiment.",
  "닭띠는 꼼꼼하고 자기관리에 철저해요. 계획을 세우고 그대로 실행해가는 성실함이 있고, 맡은 일을 정확하게 해내려는 책임감이 강해요. 신뢰감 있고 완성도 높은 결과물을 만드는 게 강점이지만, 완벽을 추구하다 스스로를 몰아붙이는 경향이 있어요. 체계적으로 인정받을 수 있는 환경에서 진가를 발휘하는 타입이에요.": "If you were born in the Year of the Rooster, you may be meticulous and disciplined. You are good at making plans and following through, and you take responsibility for doing your work accurately. Reliability and attention to quality are strengths, though perfectionism can make you put too much pressure on yourself. You tend to shine in organized settings where good work is recognized.",
  "개띠는 의리 있고 정직해요. 한번 신뢰를 준 사람에게는 끝까지 곁을 지키는 우직함이 있고, 옳고 그름에 대한 기준이 분명한 편이에요. 믿음직하고 책임감 있는 게 강점이지만, 낯선 관계에는 경계심이 강해 마음을 여는 데 시간이 걸려요. 신뢰가 바탕이 된 관계 안에서 가장 큰 힘을 발휘하는 타입이에요.": "If you were born in the Year of the Dog, you may value loyalty and honesty. Once you trust someone, you tend to stand by them, guided by a clear sense of right and wrong. Dependability is a strength, though it may take time to feel comfortable with new people. You often feel most at ease in relationships built on trust.",
  "돼지띠는 너그럽고 낙천적이에요. 사람을 있는 그대로 받아들이는 포용력이 있고, 베푸는 것을 아까워하지 않는 넉넉한 마음을 지녔어요. 따뜻하고 솔직한 게 강점이지만, 너무 쉽게 마음을 내어주다 손해를 보기도 해요. 편안하고 여유로운 분위기 속에서 매력이 가장 잘 드러나는 타입이에요.": "If you were born in the Year of the Pig, you may be generous, open-minded, and optimistic. You tend to accept people as they are and enjoy sharing what you have. Warmth and sincerity are strengths, though trusting too quickly may leave you overextended. Your best qualities often come through in relaxed, welcoming settings.",
  "양자리는 시작하는 힘이 강한 별자리예요. 망설임보다 행동이 먼저인 편이라 새로운 일 앞에서 누구보다 빠르게 움직이고, 그 추진력이 주변에 활기를 불어넣어요. 솔직하고 직설적인 태도가 매력이지만, 성급하게 결론을 내리거나 쉽게 흥미를 잃는 점은 스스로 다독일 필요가 있어요. 경쟁이 있는 환경, 목표가 뚜렷한 상황에서 유독 빛나는 타입이에요.": "Aries is associated with initiative and a readiness to act. You may move quickly when something new comes along and bring energy to the people around you. Honesty and directness can be appealing, while pausing before a quick conclusion may help you stay on track. You often shine when goals are clear and a challenge is involved.",
  "황소자리는 안정과 지속을 중요하게 여기는 별자리예요. 한번 정한 방향은 꾸준히 밀고 나가는 뚝심이 있고, 감각적이고 편안한 것을 즐길 줄 아는 여유도 있어요. 신뢰감 있고 현실적인 태도가 강점이지만, 변화를 받아들이는 데 시간이 걸리고 고집이 세다는 인상을 줄 수 있어요. 급한 변화보다는 차근차근 쌓아가는 관계와 환경에서 진가를 발휘해요.": "Taurus is associated with steadiness, comfort, and persistence. You may stay committed to a direction once you choose it and appreciate sensory pleasures and familiar routines. Reliability and practicality are strengths, though you may need time to adjust to change. You often do well in relationships and environments that grow gradually.",
  "쌍둥이자리는 호기심과 순발력이 뛰어난 별자리예요. 다양한 주제에 관심이 많고 사람들과의 대화에서 재치를 발휘하며, 상황에 맞게 빠르게 적응하는 유연함이 있어요. 다재다능하고 소통 능력이 뛰어나지만, 한 가지에 오래 집중하기 어렵고 마음이 자주 바뀐다는 평을 듣기도 해요. 자극이 있고 새로움이 끊이지 않는 환경에서 에너지가 넘쳐요.": "Gemini is associated with curiosity, quick thinking, and communication. You may enjoy exploring different subjects, bringing wit to conversation, and adapting to new situations. Versatility is a strength, though your interests may shift and sustained focus can take effort. You often feel energized by variety and fresh ideas.",
  "게자리는 감수성이 풍부하고 정이 깊은 별자리예요. 가까운 사람을 세심하게 챙기고, 편안하고 안전한 울타리를 만드는 데 재능이 있어요. 따뜻하고 보호본능이 강한 게 강점이지만, 감정 기복이 크고 마음을 다치면 오래 담아두는 편이에요. 신뢰가 쌓인 가족 같은 관계 안에서 가장 편안함을 느끼는 타입이에요.": "Cancer is associated with sensitivity, care, and emotional depth. You may look after people close to you and create a sense of safety and belonging. Warmth and protectiveness are strengths, though emotions can run deep and hurt may linger. You often feel most at ease in close relationships built on trust.",
  "사자자리는 존재감과 자신감이 넘치는 별자리예요. 무대의 중심에 서는 걸 두려워하지 않고, 주변 사람들을 이끄는 리더십과 따뜻한 관대함을 함께 지녔어요. 당당하고 표현력이 풍부한 게 강점이지만, 자존심이 강해 인정받지 못하면 크게 상처받기도 해요. 능력을 마음껏 드러낼 수 있는 무대가 주어질 때 가장 크게 성장하는 타입이에요.": "Leo is associated with confidence, warmth, and a strong presence. You may enjoy taking center stage and encouraging others with generous leadership. Expressiveness is a strength, though a lack of recognition can feel personal. You often grow when you have room to share your talents.",
  "처녀자리는 세심함과 분석력이 뛰어난 별자리예요. 작은 디테일도 놓치지 않고 완성도를 높이려는 태도가 있어서, 맡은 일을 꼼꼼하고 정확하게 해내요. 성실하고 신뢰할 수 있는 게 강점이지만, 스스로에게도 기준이 높아 완벽주의로 지치기 쉬워요. 체계가 있고 노력이 정당하게 평가받는 환경에서 실력을 제대로 인정받는 타입이에요.": "Virgo is associated with attention to detail and analytical thinking. You may notice small things others miss and take care to do your work accurately. Diligence and reliability are strengths, though high standards can lead to perfectionism and fatigue. You often do well in organized settings where effort is recognized fairly.",
  "천칭자리는 균형과 조화를 중요하게 여기는 별자리예요. 사람과 사람 사이의 미묘한 온도를 잘 읽고, 어느 한쪽으로 치우치지 않으려 노력하는 공정한 태도를 지녔어요. 세련되고 사교적인 게 강점이지만, 결정을 내릴 때 양쪽을 너무 재다가 타이밍을 놓치기도 해요. 협업과 관계 안에서 조율하는 역할을 맡을 때 능력이 잘 드러나는 타입이에요.": "Libra is associated with balance, fairness, and connection. You may be skilled at reading a room and considering different viewpoints before acting. Diplomacy and sociability are strengths, though weighing every option can make decisions harder. You often shine when helping people collaborate or find common ground.",
  "전갈자리는 몰입과 통찰이 깊은 별자리예요. 겉으로 드러내는 감정은 절제돼 있지만, 마음을 준 대상에게는 누구보다 진하고 변함없는 애정을 쏟아요. 집중력과 직관력이 강점이지만, 한번 믿음이 깨지면 관계를 정리하는 것도 단호한 편이에요. 깊이 있는 신뢰를 바탕으로 한 관계에서 가장 큰 힘을 발휘하는 타입이에요.": "Scorpio is associated with focus, intuition, and emotional depth. You may be private with your feelings but deeply committed once you trust someone. Concentration and insight are strengths, though broken trust may be difficult to repair. You often thrive in relationships grounded in honesty and depth.",
  "사수자리는 자유와 확장을 추구하는 별자리예요. 낙천적이고 모험을 즐기며, 넓은 세상과 새로운 경험을 향한 호기심이 끊이지 않아요. 긍정적이고 솔직한 태도가 강점이지만, 틀에 얽매이는 걸 답답해해서 약속이나 세부사항을 소홀히 하기도 해요. 스스로 선택하고 움직일 수 있는 자유로운 환경에서 매력이 극대화되는 타입이에요.": "Sagittarius is associated with curiosity, optimism, and a love of freedom. You may enjoy adventure and seek out new experiences. Honesty and enthusiasm are strengths, though details and commitments can be easy to overlook when you feel constrained. You often flourish when you can choose your direction and keep exploring.",
  "염소자리는 목표 지향적이고 인내심이 강한 별자리예요. 눈앞의 즐거움보다 장기적인 성취를 우선시하며, 한 걸음씩 착실하게 쌓아 올리는 힘이 있어요. 책임감 있고 현실적인 판단력이 강점이지만, 스스로에게 엄격한 나머지 여유를 갖는 법을 잊기 쉬워요. 명확한 목표와 성과가 존재하는 환경에서 꾸준히 두각을 나타내는 타입이에요.": "Capricorn is associated with patience, responsibility, and long-term goals. You may prefer steady progress and lasting achievements over quick rewards. Practical judgment and commitment are strengths, though you can be hard on yourself and forget to rest. You often stand out when goals and expectations are clear.",
  "물병자리는 독창적이고 자유로운 사고를 지닌 별자리예요. 관습보다 자신만의 기준을 따르고, 남들과 다른 시각으로 문제를 바라보는 걸 즐겨요. 개성 있고 열린 사고가 강점이지만, 감정 표현에 서툴러 거리감이 느껴진다는 이야기를 듣기도 해요. 정해진 틀보다 자유롭게 아이디어를 펼칠 수 있는 환경에서 진짜 실력이 드러나는 타입이에요.": "Aquarius is associated with originality and independent thinking. You may prefer your own principles and enjoy approaching problems from a different angle. Open-mindedness is a strength, though others may sometimes find you hard to read emotionally. You often do your best work when you have freedom to develop your ideas.",
  "물고기자리는 상상력과 공감 능력이 뛰어난 별자리예요. 다른 사람의 감정을 자기 일처럼 느끼고, 예술적이고 감성적인 영역에서 특별한 재능을 보여요. 다정하고 포용력 있는 태도가 강점이지만, 현실과 감정 사이에서 쉽게 휩쓸리고 거절을 잘 못하는 편이에요. 따뜻하게 이해받는 관계 안에서 마음이 가장 편안해지는 타입이에요.": "Pisces is associated with imagination, empathy, and sensitivity. You may connect deeply with other people's feelings and bring creativity to artistic or emotional pursuits. Compassion is a strength, though it can be hard to set boundaries or separate your feelings from others'. You often feel most at ease when you are understood and supported.",
};

const TERMINOLOGY: Array<[string, string]> = [
  ["종합사주", "Full Saju reading"],
  ["이번달", "This month's"],
  ["이번 달", "This month's"],
  ["오늘의", "Today's"],
  ["올해", "This year's"],
  ["핵심 특징", "core traits"],
  ["오행 균형", "Five Elements balance"],
  ["월지", "Month Branch"],
  ["목(木)", "Wood"],
  ["화(火)", "Fire"],
  ["토(土)", "Earth"],
  ["금(金)", "Metal"],
  ["수(水)", "Water"],
  ["정재격", "Direct Wealth chart pattern"],
  ["편재격", "Indirect Wealth chart pattern"],
  ["정관격", "Direct Officer chart pattern"],
  ["편관격", "Seven Killings chart pattern"],
  ["식신격", "Eating God chart pattern"],
  ["상관격", "Hurting Officer chart pattern"],
  ["정인격", "Direct Resource chart pattern"],
  ["편인격", "Indirect Resource chart pattern"],
  ["비견격", "Friend chart pattern"],
  ["겁재격", "Rob Wealth chart pattern"],
  ["양인격", "Yang Blade chart pattern"],
  ["천간합", "Heavenly Stem combination"],
  ["건강운", "well-being reading"],
  ["총평", "Summary"],
  ["초년운", "Early-life cycle"], ["중년운", "Midlife cycle"], ["말년운", "Later-life cycle"],
  ["일간총평", "Core Day Master profile"], ["기본 성향", "Basic temperament"],
  ["봄", "Spring"], ["여름", "Summer"], ["가을", "Autumn"], ["겨울", "Winter"],
  ["쥐띠", "Rat"], ["소띠", "Ox"], ["호랑이띠", "Tiger"], ["토끼띠", "Rabbit"],
  ["용띠", "Dragon"], ["뱀띠", "Snake"], ["말띠", "Horse"], ["양띠", "Goat"],
  ["원숭이띠", "Monkey"], ["닭띠", "Rooster"], ["개띠", "Dog"], ["돼지띠", "Pig"],
  ["양자리", "Aries"], ["황소자리", "Taurus"], ["쌍둥이자리", "Gemini"], ["게자리", "Cancer"],
  ["사자자리", "Leo"], ["처녀자리", "Virgo"], ["천칭자리", "Libra"], ["전갈자리", "Scorpio"],
  ["사수자리", "Sagittarius"], ["염소자리", "Capricorn"], ["물병자리", "Aquarius"], ["물고기자리", "Pisces"],
  ["목요일", "Thursday"], ["화요일", "Tuesday"], ["수요일", "Wednesday"], ["금요일", "Friday"], ["토요일", "Saturday"],
  ["공원·숲·캠퍼스처럼 초록빛이 있는 곳", "A green setting such as a park, woodland, or campus"],
  ["기운", "energy"],
  ["기운", "energy"],
  ["사주팔자", "Four Pillars of Destiny"],
  ["신강", "strong Day Master"],
  ["신약", "weak Day Master"],
  ["비겁", "Peer Star"],
  ["식상", "Output Star"],
  ["재성", "Wealth Star"],
  ["관성", "Authority Star"],
  ["인성", "Resource Star"],
  ["십신", "Ten Gods"],
  ["일간", "Day Master"],
  ["원국", "natal chart"],
  ["격국", "chart structure"],
  ["천간", "Heavenly Stem"],
  ["지지", "Earthly Branch"],
  ["년주", "Year Pillar"],
  ["월주", "Month Pillar"],
  ["일주", "Day Pillar"],
  ["시주", "Hour Pillar"],
  ["대운", "major luck cycle"],
  ["세운", "annual cycle"],
  ["월운", "monthly cycle"],
  ["오행", "Five Elements"],
  ["신살", "special star"],
  ["만세력", "Saju calendar"],
  ["사주", "Saju"],
  ["연애운", "love reading"],
  ["재물운", "wealth reading"],
  ["직업운", "career reading"],
  ["재회운", "reunion reading"],
  ["띠", "zodiac animal sign"],
  ["별자리", "zodiac sign"],
  ["타로", "Tarot"],
  ["오늘의 운세", "today's reading"],
  ["궁합", "compatibility reading"],
  ["성격", "personality"],
  ["건강", "well-being"],
  ["직장", "workplace"],
  ["배우자궁", "spouse palace"],
  ["천을귀인", "Cheoneul Gwiin (Heavenly Nobleman)"],
  ["도화살", "Dohwa Sal (peach blossom star)"],
  ["양인살", "Yangin Sal"],
  ["장성살", "Jangseong Sal"],
  ["갑목", "Jia Wood"],
  ["을목", "Yi Wood"],
  ["병화", "Bing Fire"],
  ["정화", "Ding Fire"],
  ["무토", "Wu Earth"],
  ["기토", "Ji Earth"],
  ["경금", "Geng Metal"],
  ["신금", "Xin Metal"],
  ["임수", "Ren Water"],
  ["계수", "Gui Water"],
];

function formatDynamicKorean(text: string): string {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return text
    .replace(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/g, (_match, year: string, month: string, day: string) => `${months[Number(month) - 1] ?? `Month ${month}`} ${day}, ${year}`)
    .replace(/(\d+)세~(\d+)세/g, "Ages $1–$2")
    .replace(/(\d+)~(\d+)세/g, "Ages $1–$2")
    .replace(/(\d+)세~/g, "Age $1+")
    .replace(/(\d{1,2})월/g, "Month $1")
    .replace(/\bMonth (\d{1,2}) (\d{1,2})일/g, (_match, month: string, day: string) => `${months[Number(month) - 1] ?? `Month ${month}`} ${day}`)
    .replace(/(\d+)세/g, "Age $1")
    .replace(/신강 사주/g, "strong Day Master chart")
    .replace(/신약 사주/g, "weak Day Master chart");
}

const ELEMENT_NAMES: Record<string, string> = { 목: "Wood", 화: "Fire", 토: "Earth", 금: "Metal", 수: "Water" };
const BRANCH_NAMES_BY_HANJA: Record<string, string> = {
  子: "Rat", 丑: "Ox", 寅: "Tiger", 卯: "Rabbit", 辰: "Dragon", 巳: "Snake",
  午: "Horse", 未: "Goat", 申: "Monkey", 酉: "Rooster", 戌: "Dog", 亥: "Pig",
};
const BRANCH_RELATIONS: Record<string, string> = { 합: "harmony", 충: "clash", 형: "punishment", 파: "break", 해: "harm" };
const STEM_NAMES_BY_HANJA: Record<string, string> = {
  甲: "Jia Wood", 乙: "Yi Wood", 丙: "Bing Fire", 丁: "Ding Fire", 戊: "Wu Earth",
  己: "Ji Earth", 庚: "Geng Metal", 辛: "Xin Metal", 壬: "Ren Water", 癸: "Gui Water",
};

function translateElementRelation(source: string): string | null {
  const label = (element: string) => ELEMENT_NAMES[element] ?? element;
  let match = source.match(/^두 사람의 일간은 같은 ([목화토금수])\([木火土金水]\) 기운이에요\./);
  if (match) {
    const element = label(match[1]);
    return `Your Day Masters share the ${element} element. You may understand one another easily because your emotional rhythms are similar. Since you may also share some blind spots, outside interests and supportive people can help keep the relationship balanced.`;
  }
  if (!match) match = source.match(/^([목화토금수])\([木火土金水]\) 기운이 ([목화토금수])\([木火土金水]\) 기운을 북돋아주는 상생\(相生\) 관계예요\./);
  if (match) {
    return `In the Five Elements cycle, ${label(match[1])} nourishes ${label(match[2])}. This pairing can feel supportive and growth-oriented, with each person naturally encouraging the other.`;
  }
  match = source.match(/^([목화토금수])\([木火土金水]\)와\(과\) ([목화토금수])\([木火土金水]\)은\(는\) 서로 견제하는 상극\(相剋\) 관계예요\./);
  if (match) {
    return `In the Five Elements cycle, ${label(match[1])} and ${label(match[2])} check one another. This can bring friction, but a moderate challenge may help both people stay engaged and grow. A relationship can strengthen when you acknowledge and work with your differences.`;
  }
  match = source.match(/^([목화토금수])\([木火土金水]\)와\(과\) ([목화토금수])\([木火土金水]\)은\(는\) 직접적인 생·극 관계는 없지만/);
  if (match) {
    return `${label(match[1])} and ${label(match[2])} do not have a direct generating or controlling relationship in this pairing. You may get along comfortably when you respect each other's distinct qualities.`;
  }
  return null;
}

function translateEmbeddedSajuPhrases(source: string): string {
  const elementRelation = translateElementRelation(source);
  if (elementRelation) return elementRelation;
  return source
    .replace(/([목화토금수])\([木火土金水]\) 기운이 원국에 (\d+)개로 많은 편이에요\./g, (_match, element: string, count: string) =>
      `The ${ELEMENT_NAMES[element]} element appears ${count} times in your birth chart and is relatively prominent.`,
    )
    .replace(/([목화토금수])\([木火土金水]\) 기운은 원국에 하나도 없어요\./g, (_match, element: string) =>
      `The ${ELEMENT_NAMES[element]} element is absent from your birth chart.`,
    )
    .replace(/겨울\(해자축월\)에 태어났는데 원국에 화\(火\) 기운이 전혀 없어요\./g, "You were born in winter, and your chart has no Fire element.")
    .replace(/여름\(사오미월\)에 태어났는데 원국에 수\(水\) 기운이 전혀 없어요\./g, "You were born in summer, and your chart has no Water element.")
    .replace(/명리학에서는 이런 경우를 (?:사주|Saju)가 '뜨겁다'고 봐요\./g, "In traditional Saju, this is considered an overly warm chart.")
    .replace(/차분하고 유연한 환경, 휴식을 의식적으로 챙기면 균형을 잡는 데 도움이 될 수 있어요\./g, "A calm, flexible environment and intentional rest can help restore balance.")
    .replace(/당신의 원국에는 다음과 같은 관계가 눈에 띄어요\./g, "The following relationship stands out in your birth chart:")
    .replace(/이번 원국에는 뚜렷하게 강한 합충 관계가 나타나지 않아요\./g, "No pronounced combinations or clashes stand out in your birth chart.")
    .replace(/([子丑寅卯辰巳午未申酉戌亥]{3})\s*방합(?:이|가)? 있어요\./g, (_match, branches: string) =>
      `${[...branches].map((branch) => BRANCH_NAMES_BY_HANJA[branch]).join(", ").replace(/, ([^,]+)$/, ", and $1")} form a directional harmony.`,
    )
    .replace(/같은 계절(?:의)? 기운이 모여 (?:하나의 )?방향으로 힘을 모아줘요?\./g, "The branches gather the energy of the same season and channel it in one direction.")
    .replace(/([甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥])[-–]([甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥])\s*(천간합|육합|삼합|방합|원진|자형|합|충|형|파|해)(?:이|가)? 있어요\.?/g, (_match, first: string, second: string, relation: string) => {
      const firstName = STEM_NAMES_BY_HANJA[first] ?? BRANCH_NAMES_BY_HANJA[first];
      const secondName = STEM_NAMES_BY_HANJA[second] ?? BRANCH_NAMES_BY_HANJA[second];
      if (relation === "천간합") return `${firstName} and ${secondName} form a Heavenly Stem combination.`;
      if (relation === "육합") return `${firstName} and ${secondName} form a six-branch harmony.`;
      if (relation === "삼합") return `${firstName} and ${secondName} form a three-branch harmony.`;
      if (relation === "방합") return `${firstName} and ${secondName} form a directional harmony.`;
      if (relation === "원진") return `${firstName} and ${secondName} form a resentment pairing.`;
      if (relation === "자형") return `${firstName} and ${secondName} have a self-punishment relation.`;
      if (relation === "합" && STEM_NAMES_BY_HANJA[first] && STEM_NAMES_BY_HANJA[second]) return `${firstName} and ${secondName} form a Heavenly Stem combination.`;
      return `The ${firstName} and ${secondName} branches show a ${BRANCH_RELATIONS[relation]} relation.`;
    },
    )
    .replace(/당신은 일간\(日干\) ([甲乙丙丁戊己庚辛壬癸])의 사람이고, 월지 격국\(格局\)은 '([^']+)' — ([\s\S]+?)이에요\. 이 기운이 기본 성향과 사회적 태도의 중심을 이뤄요\./g, (_match, dayStem: string, pattern: string, subtitle: string) =>
      `Your Day Master is ${STEM_NAMES_BY_HANJA[dayStem] ?? dayStem}. Your Month Branch forms the ${localizeEnglishText(pattern)} pattern, associated with ${localizeEnglishText(subtitle).replace(/^(?:A person|Someone) who\b/i, "someone who").replace(/\.$/, "")}. This combination shapes your basic temperament and social style.`,
    );
}

function finishEnglish(source: string, translated: string): string {
  let result = formatDynamicKorean(translated);
  for (const [korean, english] of TERMINOLOGY) result = result.replaceAll(korean, english);
  return polishEnglish(source, result);
}

/** Google-based source translations often switch into first-person narration or
 * mistranslate the technical term 신강 as the place name Xinjiang. Reading copy
 * addresses the visitor directly, so normalize those recurring errors centrally. */
function polishEnglish(source: string, translated: string): string {
  let result = translated;
  if (source.includes("신강") && /xinjiang/i.test(result)) result = result.replace(/xinjiang(?: saju)?/gi, "strong Day Master");
  if (source.includes("신약")) {
    result = result.replace(/weak saju|new drug|new medicine/gi, "weak Day Master");
    result = result.replace(/\bYou are (?:a )?birth chart,?[^.]*\bweak(?: weak)? Day Master[^.]*\bfrom ([A-Za-z ]+Stars?)\.?/gi, "Your chart indicates a weak Day Master with a weaker influence from $1.");
  }

  result = result
    .replace(/\bYou are (?:a )?birth chart\b/gi, "Your chart suggests")
    .replace(/\bYour natal chart에는\b/gi, "Your birth chart contains")
    .replace(/\byour natal chart에는\b/gi, "your birth chart contains")
    .replace(/\bYour natal chart에\b/gi, "In your birth chart")
    .replace(/\byour natal chart에\b/gi, "in your birth chart")
    .replace(/\bnatal chart에는\b/gi, "your birth chart contains")
    .replace(/\bnatal chart에\b/gi, "in your birth chart")
    .replace(/\bnatal chart에서\b/gi, "in your birth chart")
    .replace(/\bYou are a strong Day Master chart\b/gi, "Your chart indicates a strong Day Master")
    .replace(/\bYou are a weak Day Master chart\b/gi, "Your chart indicates a weak Day Master")
    .replace(/\bYou are on the strong Day Master chart, where the energy of ([A-Za-z ]+Stars?)(?:\s*\([^)]*\))? is prominent\.?/gi, "Your chart has a strong Day Master, with $1 playing a prominent role.")
    .replace(/\bThis is a Saju chart that shows the energy of\b/gi, "Your chart carries the energy of")
    .replace(/\bAlthough they are soft and adaptable\b/gi, "Although you are gentle and adaptable")
    .replace(/\bthey tend to grow stably\b/gi, "you tend to grow steadily")
    .replace(/\bFor this land to be fertile for a long time, we need a balance of consciously taking time and rewards for ourselves as much as we take care of others\.?/gi, "To sustain this nurturing energy, make time to care for yourself and recognize your own effort as generously as you care for others.")
    .replace(/\bYour chart indicates a (strong|weak) Day Master with a prominent energy of ([^,.]+)(?: \([^)]*\))?/gi, "Your chart indicates a $1 Day Master with a strong $2 influence")
    .replace(/\bYou are a Xinjiang Saju chart\b/gi, "Your chart indicates a strong Day Master")
    .replace(/\bYou are a Saju chart with (?:a )?strong power to\b/gi, "Your chart points to a strong ability to")
    .replace(/\bYou are a Saju chart who\b/gi, "Your chart suggests you are someone who")
    .replace(/\bYou are a Saju chart whose strengths are\b/gi, "Your chart points to strengths in")
    .replace(/\bYou are a Saju chart\b/gi, "Your chart suggests that you")
    .replace(/\bYou are the type of Saju chart\b/gi, "Your chart suggests that you are the type of person")
    .replace(/\bThis is a Saju chart that\b/gi, "Your chart suggests that you")
    .replace(/\bIt is a Saju chart that\b/gi, "Your chart suggests that you")
    .replace(/\bThe Saju chart shows that\b/gi, "Your chart suggests that")
    .replace(/\bSaju chart\b/gi, "birth chart")
    .replace(/\bprominent energy of ([^,.]+)(?: \([^)]*\))?/gi, "strong influence from $1")
    .replace(/\bweak energy of ([^,.]+)(?: \([^)]*\))?/gi, "weaker influence from $1")
    .replace(/\bstrong power to\b/gi, "strong ability to")
    .replace(/\ba strong power to\b/gi, "a strong ability to")
    .replace(/\bstrong power of\b/gi, "strong ability for")
    .replace(/\bYour chart suggests that you with a (strong|weaker) influence from\b/gi, "Your chart shows a $1 influence from")
    .replace(/\bYour chart suggests that you where\b/gi, "Your chart suggests that")
    .replace(/\bYour chart (?:suggests|indicates),?\s+(?:a )?weak Day Master from ([^.]+)/gi, "Your chart indicates a weak Day Master with a weaker influence from $1")
    .replace(/\byour birth chart suggests that you are a birth chart\b/gi, "your chart suggests that you")
    .replace(/\bYour chart suggests that you with\b/gi, "Your chart suggests")
    .replace(/\bYour chart suggests that you whose\b/gi, "Your chart suggests")
    .replace(/\bMoon Ji\b/gi, "Month Branch")
    .replace(/\bPeer Stars? \(Bi-gyeop\)/gi, "Peer Stars")
    .replace(/\bOutput Stars? \(Siksang\)/gi, "Output Stars")
    .replace(/\bWealth Stars? \(Jaeseong\)/gi, "Wealth Stars")
    .replace(/\bAuthority Stars? \(Gwanseong\)/gi, "Authority Stars")
    .replace(/\bResource Stars? \(Inseong\)/gi, "Resource Stars")
    .replace(/\bFive Elements that the Day Master exudes\b/gi, "element controlled by the Day Master")
    .replace(/\bFive Elements produced by the Day Master\b/gi, "element generated by the Day Master")
    .replace(/\bdifferent in yin and yang\b/gi, "with the opposite yin–yang polarity")
    .replace(/\bhas the same yin and yang\b/gi, "has the same yin–yang polarity")
    .replace(/\bThis year is the year when\b/gi, "This is a year when")
    .replace(/\bthe other person's speed\b/gi, "the other person's pace")
    .replace(/\byou are a birth chart\b/gi, "your chart suggests")
    .replace(/\bgo to the Earthly Branch\b/gi, "become more comfortable")
    .replace(/\bbranch into earthly branches\b/gi, "become more resilient")
    .replace(/\bI was born with\b/gi, "your chart carries")
    .replace(/\bI am the type of person who\b/gi, "you are someone who")
    .replace(/\bI am the type\b/gi, "you are the type")
    .replace(/\bI am\b/gi, "you are")
    .replace(/\bI'm\b/gi, "you're")
    .replace(/\b(he|she) isn't\b/gi, "you aren't")
    .replace(/\b(he|she) wasn't\b/gi, "you weren't")
    .replace(/\b(he|she) doesn't\b/gi, "you don't")
    .replace(/\b(he|she) hasn't\b/gi, "you haven't")
    .replace(/\b(he|she) didn't\b/gi, "you didn't")
    .replace(/\b(he|she)'s been\b/gi, "you've been")
    .replace(/\bI've\b/gi, "you've")
    .replace(/\bI tend to\b/gi, "you tend to")
    .replace(/\bI have\b/gi, "you have")
    .replace(/\bI lack\b/gi, "you may lack")
    .replace(/\bI often\b/gi, "you often")
    .replace(/\bI sometimes\b/gi, "you may sometimes")
    .replace(/\bI feel\b/gi, "you may feel")
    .replace(/\bI need\b/gi, "you may need")
    .replace(/\bI want\b/gi, "you may want")
    .replace(/\bI tend\b/gi, "you tend")
    .replace(/\bI\b/g, "you")
    .replace(/\bmy\b/gi, "your")
    .replace(/\bme\b/gi, "you")
    .replace(/\b(he|she)'s\b/gi, "you are")
    .replace(/\b(he|she)\s+([a-z]+)\b/gi, (_match, _pronoun: string, verb: string) => {
      const lower = verb.toLowerCase();
      const irregular: Record<string, string> = { is: "are", was: "were", has: "have", does: "do", goes: "go", says: "say", tries: "try", studies: "study" };
      if (irregular[lower]) return `you ${irregular[lower]}`;
      if (lower.endsWith("ies")) return `you ${lower.slice(0, -3)}y`;
      if (/(ches|shes|xes|zes|sses|oes)$/.test(lower)) return `you ${lower.slice(0, -2)}`;
      if (lower.endsWith("s") && !lower.endsWith("ss")) return `you ${lower.slice(0, -1)}`;
      return `you ${lower}`;
    })
    .replace(/\b(he|she)\b/gi, "you")
    .replace(/\bhis\b/gi, "your")
    .replace(/\bher\b/gi, "your")
    .replace(/\bhim\b/gi, "you")
    .replace(/\byou was\b/gi, "you were")
    .replace(/\byou am\b/gi, "you are")
    .replace(/\byou is\b/gi, "you are")
    .replace(/\byou has\b/gi, "you have")
    .replace(/\byou tends\b/gi, "you tend")
    .replace(/\byou does\b/gi, "you do")
    .replace(/\byou appears\b/gi, "you appear")
    .replace(/\bthe Earthly Branch around you\b/gi, "support from people around you")
    .replace(/\bEarthly Branches to roll up\b/gi, "support to lean on")
    .replace(/\binto the Earthly Branch\b/gi, "further")
    .replace(/\bto branch out earthly\b/gi, "to support you")
    .replace(/\bbranch out earthly\b/gi, "support")
    .replace(/\bearthly branches\b/gi, "support")
    .replace(/\bchicken zodiac animal sign\b/gi, "Rooster sign")
    .replace(/\bchickenzodiac animal sign\b/gi, "Rooster sign")
    .replace(/\b(Rat|Ox|Tiger|Rabbit|Dragon|Snake|Horse|Goat|Monkey|Rooster|Dog|Pig)zodiac animal sign\b/gi, "$1 sign")
    .replace(/\bversatile and has excellent\b/gi, "versatile and have excellent")
    .replace(/\byou are birth chart,?\b/gi, "Your chart indicates")
    .replace(/\bpush myself\b/gi, "push yourself")
    .replace(/\bwe put principles and standards first\b/gi, "you tend to put principles and standards first")
    .replace(/\byou works\b/gi, "you work")
    .replace(/\byou thrives\b/gi, "you thrive")
    .replace(/\byou excels\b/gi, "you excel")
    .replace(/\byou struggles\b/gi, "you struggle")
    .replace(/\byou values\b/gi, "you value")
    .replace(/\byou feels\b/gi, "you feel")
    .replace(/\byou has\b/gi, "you have")
    .replace(/\byou is\b/gi, "you are")
    .replace(/\bDirect Officer status\b/gi, "Direct Officer chart pattern")
    .replace(/\bDirect Wealth status\b/gi, "Direct Wealth chart pattern")
    .replace(/\bIndirect Wealth status\b/gi, "Indirect Wealth chart pattern")
    .replace(/\bThis is a place where subtle conflicts that are not apparent on the surface can be latent\.?/gi, "Subtle tension may be present even when it is not obvious at first.")
    .replace(/\bThe two support can work in harmony and act as a stabilizing force in relationships\.?/gi, "This combination can bring harmony and stability to a relationship.")
    .replace(/\bThere are energies colliding in opposite directions, so changes or movements in that area can be noticeable\.?/gi, "These energies pull in different directions, so changes or movement may be more noticeable.")
    .replace(/\bYou see it as a place where it is easy to become awkward or misunderstanding for no reason\.?/gi, "This pairing can feel awkward at times, and misunderstandings may arise without a clear reason.")
    .replace(/\bIt means that different energies have the power to naturally blend together\.?/gi, "This pairing brings together energies that can blend naturally.")
    .replace(/\bIt is a place where relationships or plans may turn out differently than expected\.?/gi, "Relationships or plans may unfold differently than expected in this pairing.")
    .replace(/\bcreate a strong Earthly Branch for yourself to climb on\b/gi, "build reliable support you can lean on")
    .replace(/\bYou are birth chart,?\b/gi, "Your chart indicates")
    .replace(/\bweaker weak Day Master\b/gi, "weak Day Master")
    .replace(/\bweak weak Day Master\b/gi, "weak Day Master")
    .replace(/\bmyself\b/gi, "yourself")
    .replace(/\bthey have a strong desire for stability\b/gi, "you have a strong desire for stability")
    .replace(/\bthey tend to stick to a set method\b/gi, "you may prefer familiar methods")
    .replace(/\bwe seem to lack flexibility\b/gi, "you may seem less flexible")
    .replace(/\.\./g, ".")
    .replace(/\byou looks\b/gi, "you look")
    .replace(/\byou seems\b/gi, "you seem")
    .replace(/\byou feels\b/gi, "you feel")
    .replace(/\byou becomes\b/gi, "you become")
    .replace(/\byou tends\b/gi, "you tend")
    .replace(/\byou goes\b/gi, "you go")
    .replace(/\byou does\b/gi, "you do");

  result = result.replace(/(^|[.!?]\s+)(you|your|you've|you're)\b/g, (_match, prefix: string, word: string) =>
    `${prefix}${word[0].toUpperCase()}${word.slice(1)}`,
  );
  result = result.replace(/([,;:]\s+)(You|Your|You've|You're|This|It)\b/g, (_match, prefix: string, word: string) => `${prefix}${word.toLowerCase()}`);

  // Final pass after generic phrase replacements, which can otherwise recreate
  // these known grammar issues after an earlier, more specific rule has run.
  result = result
    .replace(/\bThis is a Saju chart that shows the energy of\b/gi, "Your chart carries the energy of")
    .replace(/\bYour chart suggests that you shows the energy of\b/gi, "Your chart carries the energy of")
    .replace(/\bYour chart indicates,\s*a weak Day Master(?: with weak energy)? from ([A-Za-z ]+Stars?)\.?/gi, "Your chart indicates a weak Day Master, with less influence from $1.")
    .replace(/\bYou are on the strong Day Master chart, where the energy of ([A-Za-z ]+Stars?)(?:\s*\([^)]*\))? is prominent\.?/gi, "Your chart has a strong Day Master, with $1 playing a prominent role.")
    .replace(/Although they are soft and adaptable/gi, "Although you are gentle and adaptable")
    .replace(/they tend to grow stably/gi, "you tend to grow steadily")
    .replace(/they have a place to lean on/gi, "you have reliable support to lean on")
    .replace(/In this major luck cycle, the position and weight of the person in charge increases noticeably\.?/gi, "You may take on a more prominent role and greater responsibility during this major luck cycle.")
    .replace(/which can cause the other person to feel burdened or fight in a relationship/gi, "which may sometimes make relationships feel tense")
    .replace(/you are quick to make decisions and are sure to make or break decisions/gi, "you make decisions quickly and tend to stand by your choices")
    .replace(/being too cautious and having the habit of taking a step back even in the face of good opportunities can be a disappointing point/gi, "excessive caution can make you hesitate even when good opportunities arise")
    .replace(/it is much better to build up the stakes one by one in a stable manner/gi, "a steady, step-by-step approach may suit you better than taking big risks")
    .replace(/thrives much longer and much better in work and relationships based on long-term trust rather than short-term results/gi, "may do especially well in work and relationships built on long-term trust")
    .replace(/In this major luck cycle, what has been accumulated so far takes place in practical form\.?/gi, "The effort and experience you have built up can begin to show in practical results.")
    .replace(/There needs to be a balance that also takes care of your relationships and health during the process\.?/gi, "Make room to care for your relationships and health, too.")
    .replace(/Rather than just handling everything according to principles, you also need a flexible response\.?/gi, "Alongside your usual principles, a flexible approach may serve you well.")
    .replace(/It's a good flow to implement independent decisions that you've been hesitating to make\.?/gi, "This can be a good time to act on an independent decision you've been putting off.")
    .replace(/This year is a year where the power to make decisions and push yourself stands out\.?/gi, "This year may bring your decisiveness and drive to the fore.")
    .replace(/The more proactive you are, the clearer the direction of your life will be/gi, "Taking initiative may help clarify your direction")
    .replace(/When you move forward with confidence rather than being swayed by the opinions of others, good results follow\.?/gi, "Moving forward with confidence, while considering advice without being ruled by it, may lead to better results.")
    .replace(/rather than finding their own way/gi, "rather than trying to manage everything alone")
    .replace(/명리학에서는 이런 경우를 (?:사주|Saju)가 '뜨겁다'고 봐요\./g, "In traditional Saju, this is considered an overly warm chart.")
    .replace(/This is a combination that feels comfortable understanding and learning from each other\.?/gi, "You and your partner can feel at ease together and learn from one another.")
    .replace(/This is a place where relationships or plans may turn out differently than expected\.?/gi, "Relationships or plans may unfold differently than expected in this pairing.")
    .replace(/it's easy to become a habit of trying to accommodate the other person/gi, "you may fall into the habit of accommodating the other person")
    .replace(/it's good to fill things out thoroughly on your own/gi, "you do well when you can handle work carefully on your own")
    .replace(/when you have someone or an environment to block the wind/gi, "with reliable support around you")
    .replace(/you can maintain completeness much more stably/gi, "you can work more consistently and see things through")
    .replace(/Even if you have faith on the inside, it takes time to show it on the outside\.?/gi, "Even when you feel sure inside, it may take time to show it openly.")
    .replace(/you gain trust by being a person who gives your side without calculation/gi, "you build trust by giving generously without keeping score")
    .replace(/It is a style that produces stronger results than anyone else if consistency builds up\.?/gi, "Consistency helps you build stronger results over time.")
    .replace(/\bYou are the type that has the ability to\b/gi, "You are someone who can")
    .replace(/\bA person who\b/g, "Someone who");

  const twoPersonReading = /두 사람|두 분|서로|상대방|우리 둘|궁합/.test(source);
  const pluralSubject = twoPersonReading ? "you and your partner" : "you";
  result = result
    .replace(/\bwe're\b/gi, (word) => `${word[0] === "W" ? "Y" : "y"}${pluralSubject.slice(1)} are`)
    .replace(/\bwe've\b/gi, (word) => `${word[0] === "W" ? "Y" : "y"}${pluralSubject.slice(1)} have`)
    .replace(/\bwe'll\b/gi, (word) => `${word[0] === "W" ? "Y" : "y"}${pluralSubject.slice(1)} will`)
    .replace(/\bwe'd\b/gi, (word) => `${word[0] === "W" ? "Y" : "y"}${pluralSubject.slice(1)} would`);
  result = result.replace(/\bwe\b/gi, (word) => {
    return word[0] === word[0].toUpperCase() ? `${pluralSubject[0].toUpperCase()}${pluralSubject.slice(1)}` : pluralSubject;
  });
  result = result.replace(/\bour\b/gi, "your");
  const directReader = /당신|본인|스스로|자신|나를|내가|내\s|제\s/.test(source) && !twoPersonReading;
  if (directReader) {
    result = result
      .replace(/\bthey (are|were|have|do|can|could|may|might|must|will|would|should|feel|tend to|seem|look|need|want|often|sometimes|still|usually)\b/gi, (_match, verb: string) => `you ${verb.toLowerCase()}`)
      .replace(/\bthey\b/gi, (word) => (word[0] === "T" ? "You" : "you"))
      .replace(/\btheir\b/gi, "your")
      .replace(/\btheirs\b/gi, "yours")
      .replace(/\bthemselves\b/gi, "yourself");
    result = result.replace(/(^|[.!?]\s+)you\b/g, (_match, prefix: string) => `${prefix}You`);
  }

  result = result
    .replace(/Rather than just handling everything according to principles, you also need a flexible response\.?/gi, "Alongside your usual principles, a flexible approach may serve you well.")
    .replace(/It['’]s a good flow to implement independent decisions that you['’]ve been hesitating to make\.?/gi, "This can be a good time to act on an independent decision you've been putting off.");

  return result;
}

/** Translate static JSON content and assembled reading text without making a request at runtime. */
export function localizeEnglishText(source: string): string {
  if (EDITORIAL_OVERRIDES[source]) return EDITORIAL_OVERRIDES[source];
  let embedded = translateEmbeddedSajuPhrases(source);
  if (embedded !== source) {
    for (const [korean, english] of PARTIAL_ENTRIES) {
      if (embedded.includes(korean)) embedded = embedded.replaceAll(korean, CONTENT_MAP[korean] ?? english);
    }
    return finishEnglish(source, embedded);
  }
  const exact = CONTENT_MAP[source];
  if (exact) return finishEnglish(source, exact);

  for (const entry of TEMPLATE_PATTERNS) {
    const match = source.match(entry.pattern);
    if (!match) continue;
    let result = entry.english;
    entry.placeholders.forEach((name, index) => {
      result = result.replaceAll(`{${name}}`, match[index + 1]);
    });
    return finishEnglish(source, result);
  }

  let result = source;
  for (const [korean, english] of PARTIAL_ENTRIES) {
    if (result.includes(korean)) result = result.replaceAll(korean, CONTENT_MAP[korean] ?? english);
  }
  return finishEnglish(source, result);
}

/** Localize string values while preserving the shape and non-string values of calculated results. */
export function localizeEnglishContent<T>(value: T): T {
  if (typeof value === "string") return localizeEnglishText(value) as T;
  if (Array.isArray(value)) return value.map((item) => localizeEnglishContent(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        localizeEnglishContent(item),
      ]),
    ) as T;
  }
  return value;
}

export function findUntranslatedKorean(value: unknown, path = ""): string[] {
  if (typeof value === "string") return /[가-힣]/.test(value) ? [`${path}: ${value}`] : [];
  if (Array.isArray(value)) return value.flatMap((item, index) => findUntranslatedKorean(item, `${path}[${index}]`));
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, item]) =>
      findUntranslatedKorean(item, path ? `${path}.${key}` : key),
    );
  }
  return [];
}
