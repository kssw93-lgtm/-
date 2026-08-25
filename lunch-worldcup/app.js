// 점심 월드컵 - 메뉴 데이터
const MENUS = [
  { id: "kimchijjigae", name: "김치찌개", tag: "한식", emoji: "🍲" },
  { id: "sushi", name: "초밥", tag: "일식", emoji: "🍣" },
  { id: "pizza", name: "피자", tag: "양식", emoji: "🍕" },
  { id: "burger", name: "햄버거", tag: "양식", emoji: "🍔" },
  { id: "fried-chicken", name: "후라이드치킨", tag: "분식", emoji: "🍗" },
  { id: "malatang", name: "마라탕", tag: "매운맛", emoji: "🌶️" },
  { id: "jjamppong", name: "짬뽕", tag: "중식", emoji: "🍜" },
  { id: "jjajangmyeon", name: "짜장면", tag: "중식", emoji: "🥟" },
  { id: "donkatsu", name: "돈까스", tag: "일식", emoji: "🍱" },
  { id: "salad", name: "샐러드", tag: "건강식", emoji: "🥗" },
  { id: "pasta", name: "파스타", tag: "양식", emoji: "🍝" },
  { id: "jeyuk", name: "제육볶음", tag: "매운맛", emoji: "🍚" },
  { id: "naengmyeon", name: "냉면", tag: "한식", emoji: "🥶" },
  { id: "curry", name: "카레라이스", tag: "일식", emoji: "🍛" },
  { id: "burrito", name: "부리또", tag: "멕시칸", emoji: "🌮" },
  { id: "samgyeopsal", name: "삼겹살", tag: "한식", emoji: "🍖" },
];

// 근처 배달 할인 쿠폰 CTA용 더미 링크 (실서비스 연동 시 실제 제휴 링크로 교체)
const COUPON_URL = "https://example.com/coupon";

const root = document.getElementById("screen-root");

/** @type {{bracket: object[], round: object[], next: object[], matchIndex: number, showInterstitial: boolean, winner: object|null}} */
let state = null;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame(size) {
  const pool = shuffle(MENUS).slice(0, size);
  state = {
    round: pool,
    next: [],
    matchIndex: 0,
    showInterstitial: false,
    winner: null,
  };
  render();
}

function roundLabel(count) {
  if (count === 2) return "결승";
  if (count === 4) return "4강";
  return `${count}강`;
}

function pick(chosen) {
  state.next.push(chosen);
  state.matchIndex += 1;

  if (state.matchIndex >= state.round.length / 2) {
    if (state.next.length === 1) {
      // 우승자 확정 -> 인터스티셜(전면광고 placeholder) 노출 후 결과 화면
      state.winner = state.next[0];
      state.showInterstitial = true;
    } else {
      state.round = state.next;
      state.next = [];
      state.matchIndex = 0;
    }
  }
  render();
}

function continueFromInterstitial() {
  state.showInterstitial = false;
  render();
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function renderIntro() {
  const wrap = el(`
    <div class="intro">
      <div class="emoji-hero">🍽️</div>
      <h1>오늘 점심 뭐 먹지?</h1>
      <p>매일 반복되는 점심 고민,<br/>점심 월드컵으로 10초 만에 끝내보세요!</p>
      <div class="size-select">
        <button class="size-btn active" data-size="8">8강</button>
        <button class="size-btn" data-size="16">16강</button>
      </div>
      <button class="primary-btn" id="start-btn">점심 월드컵 시작하기</button>
    </div>
  `);

  let selectedSize = 8;
  wrap.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = Number(btn.dataset.size);
    });
  });
  wrap.querySelector("#start-btn").addEventListener("click", () => startGame(selectedSize));

  return wrap;
}

function renderBattle() {
  const total = state.round.length;
  const a = state.round[state.matchIndex * 2];
  const b = state.round[state.matchIndex * 2 + 1];
  const matchesInRound = total / 2;

  const wrap = el(`
    <div class="battle">
      <div class="round-info">
        <span class="round-pill">${roundLabel(total)}</span>
        <span class="progress-text">${state.matchIndex + 1} / ${matchesInRound}</span>
      </div>
      <div class="match">
        <div class="vs-wrap stack">
          <button class="card-item" data-side="a">
            <span class="card-emoji">${a.emoji}</span>
            <span class="card-name">${a.name}</span>
            <span class="card-tag">${a.tag}</span>
          </button>
          <span class="vs-badge">VS</span>
          <button class="card-item" data-side="b">
            <span class="card-emoji">${b.emoji}</span>
            <span class="card-name">${b.name}</span>
            <span class="card-tag">${b.tag}</span>
          </button>
        </div>
      </div>
    </div>
  `);

  wrap.querySelector('[data-side="a"]').addEventListener("click", () => pick(a));
  wrap.querySelector('[data-side="b"]').addEventListener("click", () => pick(b));

  return wrap;
}

function renderInterstitial() {
  const wrap = el(`
    <div class="interstitial">
      <div class="ad-box">
        <span class="ad-label">AD</span>
        <span>전면 광고 영역</span>
      </div>
      <button class="primary-btn" id="continue-btn">결과 보기</button>
    </div>
  `);
  wrap.querySelector("#continue-btn").addEventListener("click", continueFromInterstitial);
  return wrap;
}

function renderResult() {
  const w = state.winner;
  const wrap = el(`
    <div class="result">
      <span class="kicker">오늘의 점심은 바로</span>
      <div class="winner-emoji">${w.emoji}</div>
      <div class="winner-name">${w.name}</div>
      <div class="winner-tag">${w.tag}</div>
      <div class="result-actions">
        <button class="coupon-btn" id="coupon-btn">🎟️ 이 근처 배달 할인 쿠폰 받기</button>
        <button class="share-btn" id="share-btn">📤 결과 공유하기</button>
        <button class="retry-btn" id="retry-btn">다시 하기</button>
      </div>
    </div>
  `);

  wrap.querySelector("#coupon-btn").addEventListener("click", () => {
    window.open(COUPON_URL, "_blank", "noopener");
  });

  wrap.querySelector("#share-btn").addEventListener("click", async () => {
    const text = `오늘 점심은 "${w.name}"으로 정했어요! 점심 월드컵으로 골라보세요 🍽️`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (_) {
        /* 사용자가 공유 취소한 경우 무시 */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      alert("결과가 클립보드에 복사되었어요!");
    }
  });

  wrap.querySelector("#retry-btn").addEventListener("click", () => {
    state = null;
    render();
  });

  return wrap;
}

function render() {
  root.innerHTML = "";
  if (!state) {
    root.appendChild(renderIntro());
  } else if (state.showInterstitial) {
    root.appendChild(renderInterstitial());
  } else if (state.winner) {
    root.appendChild(renderResult());
  } else {
    root.appendChild(renderBattle());
  }
}

render();
