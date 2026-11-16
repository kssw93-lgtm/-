const COPY = {
  ko: {
    label: "처음 읽는 분을 위한 안내",
    title: "타로를 읽는 다섯 가지 기초",
    deck: "이 백과사전은 라이더–웨이트–스미스(RWS) 계열의 78장 구성을 중심으로 정리했어요. 메이저 22장과 마이너 56장으로 나뉘며, 다른 덱과 전통에서는 그림과 대응 체계가 달라질 수 있어요.",
    majors: "메이저 아르카나는 큰 주제나 삶의 전환을, 마이너 아르카나는 일상에서 마주하는 감정·행동·생각·현실 문제를 살펴볼 때 참고해요. 이는 흔히 쓰이는 읽기 관점이지, 카드의 중요도를 점수처럼 나누는 규칙은 아니에요.",
    suits: "수트는 완드(시도와 행동), 컵(감정과 관계), 소드(생각과 대화), 펜타클(현실의 자원과 꾸준한 일)을 중심으로 읽어요. 불·물·공기·흙의 대응은 널리 쓰이는 상징 체계이며 모든 타로 덱이 똑같이 따르지는 않아요.",
    reversals: "역방향은 정방향의 단순한 반대나 나쁜 결과로 고정하지 않아요. 카드와 질문에 따라 의미가 막히거나 지나치거나, 안으로 향하거나, 다른 방식으로 나타나는 관점 중 하나로 살펴볼 수 있어요.",
    synthesis: "세 장을 함께 볼 때는 먼저 각 자리의 질문을 확인하고, 그림과 키워드를 읽은 뒤 반복되는 수트·메이저 카드·역방향을 살펴보세요. 마지막에는 예언을 확정하기보다 현실에서 확인하거나 실천할 한 가지를 정리해요.",
    care: "상대의 속마음, 합격 여부, 투자 수익, 건강 상태를 카드로 확인하거나 진단할 수는 없어요. 중요한 결정은 당사자와 대화하고 검증 가능한 정보 및 해당 분야 전문가의 도움을 기준으로 해주세요.",
    sources: "참고 자료",
    museum: "V&A 타로 카드 역사와 수트 상징 안내",
    waite: "A. E. Waite, The Pictorial Key to the Tarot (1911)",
  },
  en: {
    label: "A guide for first-time readers",
    title: "Five foundations for reading Tarot",
    deck: "This guide focuses on the 78-card Rider–Waite–Smith (RWS) tradition: 22 Major Arcana and 56 Minor Arcana. Other decks and traditions may use different artwork and correspondences.",
    majors: "The Major Arcana are often used to reflect on broad themes or transitions; the Minor Arcana can bring attention to everyday feelings, actions, thoughts, and practical matters. This is a common reading lens, not a rule that scores one card as more important.",
    suits: "The suits are commonly read through Wands (initiative and action), Cups (feelings and relationships), Swords (thought and communication), and Pentacles (practical resources and steady work). Fire, water, air, and earth are widely used symbolic associations, but not every Tarot system applies them in the same way.",
    reversals: "A reversed card is not simply the opposite of an upright card or a bad result. Depending on the card and question, it may suggest a blocked, excessive, inward, or otherwise different expression of its theme.",
    synthesis: "To read three cards together, begin with each position's question, then consider the images and keywords before looking for repeated suits, Major Arcana, or reversals. End with one practical point to verify or act on instead of treating the spread as a fixed prediction.",
    care: "Cards cannot establish another person's private thoughts, determine an exam result, forecast investment returns, or diagnose a health condition. For consequential decisions, use direct communication, verifiable information, and qualified professional advice.",
    sources: "References",
    museum: "V&A: A history of Tarot cards and suit symbolism",
    waite: "A. E. Waite, The Pictorial Key to the Tarot (1911)",
  },
} as const;

export default function TarotReadingBasics({ locale }: { locale: "ko" | "en" }) {
  const copy = COPY[locale];
  return (
    <section className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/[0.035] p-4">
      <details>
        <summary className="cursor-pointer list-none text-sm font-semibold text-[color:var(--color-gold-light)]">
          <span className="mr-2 text-[10px] tracking-wider text-white/40">{copy.label}</span>
          {copy.title}
        </summary>
        <div className="mt-4 space-y-3 text-xs leading-relaxed text-white/70">
          <p><strong className="text-white/85">{locale === "ko" ? "덱의 기준" : "Deck tradition"}</strong> · {copy.deck}</p>
          <p><strong className="text-white/85">{locale === "ko" ? "메이저와 마이너" : "Major and Minor Arcana"}</strong> · {copy.majors}</p>
          <p><strong className="text-white/85">{locale === "ko" ? "네 가지 수트" : "The four suits"}</strong> · {copy.suits}</p>
          <p><strong className="text-white/85">{locale === "ko" ? "역방향" : "Reversals"}</strong> · {copy.reversals}</p>
          <p><strong className="text-white/85">{locale === "ko" ? "카드 조합" : "Reading cards together"}</strong> · {copy.synthesis}</p>
          <p className="rounded-lg bg-black/20 p-3">{copy.care}</p>
          <div className="border-t border-white/10 pt-3">
            <p className="mb-1 font-semibold text-white/80">{copy.sources}</p>
            <ul className="space-y-1">
              <li><a className="underline decoration-white/25 underline-offset-2 hover:text-white" href="https://www.vam.ac.uk/articles/tarot-cards" target="_blank" rel="noreferrer">{copy.museum}</a></li>
              <li><a className="underline decoration-white/25 underline-offset-2 hover:text-white" href="https://rider-waite.com/symbolism/pictorial-key-1-1/" target="_blank" rel="noreferrer">{copy.waite}</a></li>
            </ul>
          </div>
        </div>
      </details>
    </section>
  );
}
