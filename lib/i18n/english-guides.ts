export interface EnglishGuideSection {
  heading: string;
  paragraphs: string[];
}

export interface EnglishGuide {
  slug: string;
  title: string;
  description: string;
  koreanPath: string;
  readingMinutes: number;
  intro: string;
  sections: EnglishGuideSection[];
}

export const ENGLISH_GUIDES: EnglishGuide[] = [
  {
    slug: "heavenly-stems-earthly-branches",
    title: "Heavenly Stems and Earthly Branches in Saju",
    description: "Understand the ten Heavenly Stems, twelve Earthly Branches, and the symbols that make up a Korean Saju chart.",
    koreanPath: "/learn/cheongan-jiji",
    readingMinutes: 5,
    intro: "A Saju chart is written with two repeating sets of symbols: ten Heavenly Stems and twelve Earthly Branches. Learning what each set does makes the Four Pillars easier to follow.",
    sections: [
      {
        heading: "Two cycles form each pillar",
        paragraphs: [
          "The Heavenly Stems are Jia, Yi, Bing, Ding, Wu, Ji, Geng, Xin, Ren, and Gui. The Earthly Branches are Zi, Chou, Yin, Mao, Chen, Si, Wu, Wei, Shen, You, Xu, and Hai. A pillar pairs one stem with one branch, and the year, month, day, and hour pillars together form the chart.",
          "The stems are associated with the Five Elements and Yin or Yang qualities. The branches are also associated with the twelve zodiac animals, seasons, and elements. In Saju they are first of all calendar symbols; an animal label alone does not explain a whole chart.",
        ],
      },
      {
        heading: "Visible symbols and hidden stems",
        paragraphs: [
          "The eight symbols shown in the four pillars are the visible layer. Traditional Saju also assigns hidden stems to each Earthly Branch. Those hidden stems add detail to an interpretation, which is one reason a simple count of visible Wood, Fire, Earth, Metal, and Water cannot describe the whole chart.",
          "Readers may also look at how stems and branches interact through combinations, clashes, and other relationships. These are relationships among chart symbols, not guaranteed events in a person's life.",
        ],
      },
      {
        heading: "How to use the terminology",
        paragraphs: [
          "When viewing a chart, start by identifying the four pillars and the Day Master—the stem in the Day Pillar. Then look at the elements and relationships in context. Different schools may explain some symbols differently, so treat English translations as helpful labels rather than exact substitutes for every Korean or Classical Chinese term.",
        ],
      },
    ],
  },
  {
    slug: "five-elements",
    title: "The Five Elements in Saju: Wood, Fire, Earth, Metal, and Water",
    description: "Learn how the Five Elements are used in Saju, including the generating and controlling cycles and the limits of element counts.",
    koreanPath: "/learn/ohaeng",
    readingMinutes: 4,
    intro: "Wood, Fire, Earth, Metal, and Water are a traditional way to describe relationships and change. In Saju, the elements are read as part of a chart rather than as a personality test on their own.",
    sections: [
      {
        heading: "A model of relationships",
        paragraphs: [
          "The Five Elements—Wood, Fire, Earth, Metal, and Water—are not literal materials or measured quantities. They are categories in a traditional model used to describe how parts of a chart support, express, or check one another. Many popular summaries attach images such as growth to Wood or warmth to Fire, but those associations are starting points, not complete readings.",
          "In the generating cycle, Wood supports Fire, Fire produces Earth, Earth bears Metal, Metal is associated with Water, and Water nourishes Wood. In the controlling cycle, Wood restrains Earth, Earth contains Water, Water controls Fire, Fire melts Metal, and Metal cuts Wood. The cycles describe different kinds of relationships; neither cycle is simply good or bad.",
        ],
      },
      {
        heading: "Why a chart's element count is only a first look",
        paragraphs: [
          "A chart can show how many visible stems and branches are associated with each element. That count is useful for orientation, but it leaves out hidden stems and does not by itself measure strength. Season, position, and the way symbols relate to each other also matter in traditional analysis.",
          "For that reason, a chart with no visible Water does not automatically mean that Water is absent from every interpretive layer, and a high count does not prove that an element is beneficial. The meaning depends on the full chart and the interpretive method being used.",
        ],
      },
      {
        heading: "Use the Five Elements as a map, not a verdict",
        paragraphs: [
          "The element display on Saju Dalyeok shows the visible positions and labels what it includes. It is a compact introduction to the chart, not a diagnosis or a scientific measurement. Read it alongside the pillars and the written explanation, and keep the traditional framework in perspective.",
        ],
      },
    ],
  },
  {
    slug: "ten-gods",
    title: "The Ten Gods in Saju: A Guide to the Relationship Labels",
    description: "See how the Ten Gods are named from the Day Master and why they describe chart relationships rather than literal deities.",
    koreanPath: "/learn/sipsin",
    readingMinutes: 5,
    intro: "The Ten Gods, also called the Ten Spirits in some English translations, are labels for how other stems relate to the Day Master. The name sounds supernatural, but the categories are part of Saju's symbolic vocabulary.",
    sections: [
      {
        heading: "The Day Master is the reference point",
        paragraphs: [
          "The Day Master is the Heavenly Stem in the Day Pillar. Traditional readers compare the other stems with it by element relationship and Yin or Yang polarity. That comparison assigns one of ten labels, grouped into five paired relationships.",
          "Common English labels include Peer and Rob Wealth, Eating God and Hurting Officer, Direct and Indirect Wealth, Direct Officer and Seven Killings, and Direct and Indirect Resource. Translations differ across books and schools, so the English name should be read as a conventional label, not as a literal description of a person.",
        ],
      },
      {
        heading: "What these labels can and cannot tell you",
        paragraphs: [
          "The categories are used to organize themes such as expression, resources, responsibility, and material activity in a chart. They are not ten independent personality types. A label's role depends on where it appears, how often it appears, the season, and its relationship with the rest of the chart.",
          "The name Seven Killings, for example, is a traditional translation of a technical category; it does not mean that a person is dangerous or destined for harm. Likewise, a Wealth label is not a promise of income. Context matters, and interpretations remain part of a cultural system rather than scientifically verified predictions.",
        ],
      },
      {
        heading: "Read the whole pattern",
        paragraphs: [
          "A useful reading asks how the labels work together with the Five Elements, branches, hidden stems, and chart strength. Looking at one Ten Gods label in isolation can make a nuanced system sound more absolute than it is.",
        ],
      },
    ],
  },
  {
    slug: "luck-cycles",
    title: "Saju Luck Cycles: Daeun and Annual Fortune",
    description: "Learn what Daeun and annual cycles mean in traditional Saju and how to read them without treating them as guarantees.",
    koreanPath: "/learn/daeun-saeun",
    readingMinutes: 5,
    intro: "A Saju chart is fixed to a birth moment, while traditional readings also compare it with later cycles. Daeun and annual fortune are two common ways of describing those changing time frames.",
    sections: [
      {
        heading: "Daeun: a longer cycle",
        paragraphs: [
          "Daeun (大運) is commonly translated as a major or decade luck cycle. In many Saju methods, a sequence of pillars is calculated from the birth chart, with each phase commonly treated as roughly ten years. The starting age and direction are calculated from the person's birth data and the method being followed.",
          "A Daeun pillar does not replace the birth chart. It is interpreted in relation to the original pillars, and different schools may use different assumptions or calculations. A displayed age is therefore a result within a particular convention, not a universal clock shared by every Saju reader.",
        ],
      },
      {
        heading: "Annual cycles: a shorter view",
        paragraphs: [
          "Saeun (歲運), or annual fortune, refers to the pillar associated with a particular year. Readers compare it with the birth chart and the current Daeun to discuss themes for that period. Some services also show month or day cycles for a more immediate view.",
          "A cycle can be used as a prompt to reflect on timing and priorities, but it cannot establish that a specific event will happen. It should not replace practical planning or professional advice about health, money, work, or relationships.",
        ],
      },
      {
        heading: "Check the calendar convention",
        paragraphs: [
          "Saju years and months may follow solar-term boundaries rather than the first day of a Gregorian month. Near a boundary, different date, time-zone, or school conventions can produce different readings. Saju Dalyeok uses its published Korean calendar conventions and displays calculated cycles as a traditional reference.",
        ],
      },
    ],
  },
  {
    slug: "saju-compatibility",
    title: "Saju Compatibility: Comparing Two Birth Charts",
    description: "Learn what a Saju compatibility reading compares, why it is not a relationship verdict, and how to use it thoughtfully.",
    koreanPath: "/learn/gunghap-basics",
    readingMinutes: 4,
    intro: "A Saju compatibility reading compares two birth charts through a traditional framework. It can offer a vocabulary for discussing differences, but it cannot decide whether a relationship will succeed.",
    sections: [
      {
        heading: "What a two-person reading compares",
        paragraphs: [
          "A Saju compatibility reading first calculates each person's chart, then compares chart features such as stems, branches, element relationships, and the Day Masters. Depending on the method, a reader may discuss support, tension, attraction, communication styles, or differences in pace.",
          "The comparison is not simply a score of matching zodiac animals. Each person's full birth data creates a more detailed chart, and a single symbolic relationship does not determine the quality of the relationship as a whole.",
        ],
      },
      {
        heading: "What compatibility cannot decide",
        paragraphs: [
          "No chart can know how two people treat one another, whether they communicate honestly, or what choices they will make. A positive reading is not proof that a relationship is safe or sustainable, and a difficult reading is not a reason by itself to end one.",
          "Use the reading as a conversation prompt: What feels familiar? Where do you have different expectations? Which parts match your real experience, and which do not? Mutual respect, consent, trust, and everyday behavior matter more than a symbolic score.",
        ],
      },
      {
        heading: "Make sure both birth times use the right place",
        paragraphs: [
          "When entering birth details from different countries, select the time zone where each recorded time belongs. The English calculator applies that region's time-zone rules and converts each moment to Korea Standard Time for the chart. It does not apply local solar-time corrections based on longitude.",
        ],
      },
    ],
  },
  {
    slug: "saju-vs-tarot",
    title: "Saju and Tarot: Two Different Ways to Reflect",
    description: "Compare Korean Saju birth-chart readings with Tarot card readings and see when each traditional practice may be useful.",
    koreanPath: "/learn/tarot-vs-saju",
    readingMinutes: 3,
    intro: "Saju and Tarot are often grouped together as fortune-telling, but they use different traditions, inputs, and reading methods. Knowing the difference helps set reasonable expectations.",
    sections: [
      {
        heading: "Saju starts with birth details",
        paragraphs: [
          "Korean Saju uses a person's birth year, month, day, and time to calculate four pillars made from Heavenly Stems and Earthly Branches. A reading interprets those chart symbols through concepts such as the Five Elements, the Day Master, and relationships among the pillars.",
          "Because the birth moment is the input, the chart does not change from one reading to the next. The selected topic or interpretive text may differ, but the calculated birth chart remains tied to the same date, time, and calendar convention.",
        ],
      },
      {
        heading: "Tarot starts with a card draw",
        paragraphs: [
          "Tarot uses a deck of 78 cards: 22 Major Arcana and 56 Minor Arcana. A reader considers the cards, their positions in a spread, and the question being explored. A three-card reading is one simple layout; it can be used to reflect on a situation without claiming that a card proves what will happen.",
          "Saju offers a structured view based on birth data, while Tarot offers a prompt based on card symbolism. Neither is a scientifically established method for predicting events. Both are best treated as cultural or reflective practices rather than substitutes for evidence or professional advice.",
        ],
      },
      {
        heading: "Choose the question that fits",
        paragraphs: [
          "A Saju chart may help you explore long-term patterns within a traditional framework. Tarot may help you pause and consider a current question from another angle. You can use one, the other, or neither; a reading should leave room for your own judgment and choices.",
        ],
      },
    ],
  },
];

export function getEnglishGuide(slug: string): EnglishGuide | undefined {
  return ENGLISH_GUIDES.find((guide) => guide.slug === slug);
}

export function getEnglishGuidePathForKoreanArticle(slug: string): string | undefined {
  return ENGLISH_GUIDES.find((guide) => guide.koreanPath === `/learn/${slug}`)?.slug;
}
