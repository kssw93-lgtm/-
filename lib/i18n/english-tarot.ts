import type { TarotTopic } from "@/lib/content/tarot-topics";

const COPY: Record<TarotTopic["slug"], Omit<TarotTopic, "slug" | "emoji" | "readingKey">> = {
  love: {
    label: "Love",
    description: "Explore your current feelings, the other person's perspective, and where the relationship may be heading.",
    positions: [
      { label: "Your feelings", field: "core" },
      { label: "Their perspective", field: "note" },
      { label: "The relationship ahead", field: "core" },
    ],
    guide: {
      intro: "This three-card spread looks at your feelings, the other person's perspective, and the pattern between you. It can be useful whether you are seeing someone or reflecting on how you approach relationships while single.",
      positionNotes: [
        "Your current feelings and attitude toward this relationship—or toward dating in general.",
        "A symbolic hint about how the other person may be experiencing the connection. This is a reflective reading, not a way to know someone's private thoughts.",
        "The direction the relationship may take if the current pattern continues.",
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
      { label: "The other person", field: "note" },
      { label: "Your dynamic", field: "core" },
    ],
    guide: {
      intro: "This spread uses three cards to reflect on you, the other person, and the dynamic you create together. It is a light check-in for a new connection, a relationship, or someone you have feelings for. Unlike Saju compatibility, it draws on card symbolism rather than birth details.",
      positionNotes: [
        "Your current role and attitude in the connection.",
        "A symbolic hint about the other person's experience of the relationship, not a claim to know their private thoughts.",
        "The atmosphere and points of connection that may emerge when you are together.",
      ],
      tips: [
        "Use compatibility as a way to notice what feels easy and what may need communication, rather than labeling a pair simply good or bad.",
        "For a reading based on both birth charts, try the Saju compatibility reading on the home screen.",
      ],
    },
  },
  exam: {
    label: "Exams and goals",
    description: "Think through preparation, obstacles, and next steps before an exam, interview, certification, or major goal.",
    positions: [
      { label: "Your preparation", field: "core" },
      { label: "What may get in the way", field: "core" },
      { label: "Outcome and advice", field: "core" },
    ],
    guide: {
      intro: "This spread looks at your preparation, possible distractions, and advice for the next stage before an exam, interview, certification, or competition. Use it to organize your effort, not to predict whether you will pass.",
      positionNotes: [
        "A reflection on your preparation and current condition.",
        "A habit or mindset that may make the challenge harder.",
        "An attitude or practical focus to consider for the time ahead.",
      ],
      tips: [
        "A positive card cannot replace preparation. Treat it as encouragement for your final review.",
        "When anxiety grows, use the cards to choose one useful task you can do today instead of worrying about the outcome.",
      ],
    },
  },
  career: {
    label: "Career and job changes",
    description: "Explore your current career direction, timing for action, and what to keep in mind as you consider a new step.",
    positions: [
      { label: "Your current direction", field: "core" },
      { label: "When to take action", field: "note" },
      { label: "What to watch for", field: "core" },
    ],
    guide: {
      intro: "This spread looks at your current career pattern, a possible time to act, and something to keep in mind. Use it to organize your thinking about a job search, a move, or starting a business.",
      positionNotes: [
        "The pattern surrounding your work or career right now.",
        "A symbolic hint about when to prepare or take a step; it is not a fixed forecast.",
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
        "A reflection on the direction your finances may take.",
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
