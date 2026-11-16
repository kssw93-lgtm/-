import type { TarotTopic } from "@/lib/content/tarot-topics";

const COPY: Record<TarotTopic["slug"], Omit<TarotTopic, "slug" | "emoji" | "readingKey">> = {
  love: {
    label: "Love",
    description: "Reflect on your approach to dating, your connection with another person, and the relationship's current pattern.",
    positions: [
      { label: "Your feelings", field: "core" },
      { label: "Your connection and what to clarify", field: "note" },
      { label: "The relationship ahead", field: "core" },
    ],
    guide: {
      intro: "This three-card spread helps you reflect on your feelings, your interactions with another person, and the pattern between you. It cannot reveal someone's private thoughts; use it to consider your own approach and what you may want to clarify through conversation.",
      positionNotes: [
        "Your current feelings and attitude toward this relationship—or toward dating in general.",
        "A prompt to reflect on what you would like to clarify in the relationship, rather than assume what the other person feels.",
        "Reflect on the current relationship pattern and the direction you would like to choose.",
      ],
      tips: [
        "Instead of asking only whether someone likes you, ask what you can do to make this connection healthier or clearer.",
        "Cards offer a snapshot for reflection. If a result feels uncomfortable, consider the advice rather than repeatedly drawing for the same question.",
      ],
    },
  },
  compat: {
    label: "Compatibility",
    description: "Reflect on the dynamic between you and a partner, someone you are dating, or someone on your mind.",
    positions: [
      { label: "You", field: "core" },
      { label: "Your connection with the other person", field: "note" },
      { label: "Your dynamic", field: "core" },
    ],
    guide: {
      intro: "This spread uses three cards to reflect on you, the relationship, and the dynamic you may create together. It is a light check-in for a new connection or an existing relationship. It cannot reveal another person's private thoughts. Unlike Saju compatibility, it draws on card symbolism rather than birth details.",
      positionNotes: [
        "Your current role and attitude in the connection.",
        "A prompt to consider what you may want to ask or clarify, not a claim about the other person's feelings.",
        "Consider what feels comfortable together and what may need adjustment.",
      ],
      tips: [
        "Use compatibility as a way to notice what feels easy and what may need communication, rather than labeling a pair simply good or bad.",
        "For a reading based on both birth charts, try the Saju compatibility reading on the home screen.",
      ],
    },
  },
  exam: {
    label: "Exam and goal check-in",
    description: "Think through preparation, obstacles, and next steps before an exam, interview, certification, or major goal.",
    positions: [
      { label: "Your preparation", field: "core" },
      { label: "What may get in the way", field: "core" },
      { label: "Your next preparation step", field: "core" },
    ],
    guide: {
      intro: "This spread looks at your preparation, possible distractions, and next steps before an exam, interview, certification, or competition. Use it to organize your effort, not to predict an outcome.",
      positionNotes: [
        "A reflection on your preparation and current condition.",
        "A habit or mindset that may make the challenge harder.",
        "A next step to prepare for, rather than a prediction of the result.",
      ],
      tips: [
        "A positive card cannot replace preparation. Treat it as encouragement for your final review.",
        "When anxiety grows, use the cards to choose one useful task you can do today instead of worrying about the outcome.",
      ],
    },
  },
  career: {
    label: "Career and job changes",
    description: "Explore your current career direction, practical conditions to review, and what to consider before a new step.",
    positions: [
      { label: "Your current direction", field: "core" },
      { label: "What to check before acting", field: "note" },
      { label: "What to watch for", field: "core" },
    ],
    guide: {
      intro: "This spread looks at your current career pattern, practical conditions to review, and something to keep in mind. Use it to organize your thinking about a job search, a move, or starting a business; the cards cannot identify a best time to act.",
      positionNotes: [
        "The pattern surrounding your work or career right now.",
        "A prompt to review your readiness and practical conditions before taking a step, not a forecast of timing.",
        "Something practical to review before you move forward.",
      ],
      tips: [
        "Rather than asking whether you will get a specific job, ask what would make you better prepared for the next opportunity.",
        "Make major decisions using real factors such as pay, responsibilities, and working conditions alongside this reflection.",
      ],
    },
  },
  money: {
    label: "Money",
    description: "Reflect on your current money habits, a practical step, and the direction of your finances.",
    positions: [
      { label: "Your current money pattern", field: "core" },
      { label: "A practical step", field: "note" },
      { label: "The pattern ahead", field: "core" },
    ],
    guide: {
      intro: "This spread reflects on your current money pattern, one practical step, and what may deserve attention next. Use it to review spending or clarify your thinking about a purchase or investment.",
      positionNotes: [
        "A symbolic look at your current relationship with money and spending.",
        "One action you may be able to put into practice now.",
        "A prompt to review practical factors that may affect your finances.",
      ],
      tips: [
        "Tarot cannot identify investments or promise returns. Base major financial decisions on verified information and qualified advice.",
        "This reading is most useful as a prompt to review your spending habits and priorities.",
      ],
    },
  },
};

export function englishTarotTopic(topic: TarotTopic): TarotTopic {
  const copy = COPY[topic.slug];
  return copy ? { ...topic, ...copy } : topic;
}
