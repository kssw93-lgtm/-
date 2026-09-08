# 펫푸드 체커 (Pet Food Checker)

강아지·고양이가 먹어도 되는 음식인지 바로 검색할 수 있는 Toss 미니앱(PWA)입니다.

## 주요 기능
- 음식 이름 검색 (110개 데이터)
- 🐶 강아지 / 🐱 고양이 종 선택 — 같은 음식이라도 종별로 다른 위험도·정보 표시
- 치명적 · 위험 · 주의 · 안전 4단계 안전도 표시 + 필터링
- 카드 탭 시 위험 성분 · 증상 · 대처법 · 적정량 · 영양 효능 상세 정보 확인
- 수의학 문헌 근거 체구별(소형/중형/대형견) 위험 섭취량 참고치 (초콜릿·자일리톨·양파·마늘·마카다미아·포도)
- PWA 지원 (오프라인 캐시, 홈 화면 추가)

## 기술 스택
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- next-pwa

## 개발 시작하기
```bash
npm install
npm run dev
```
`http://localhost:3000` 에서 확인할 수 있습니다.

## 빌드 (정적 export)
`next.config.js`에서 `output: "export"`를 사용해 완전한 정적 사이트로
빌드합니다. 별도 서버 없이 Cloudflare Pages 등 정적 호스팅에 바로 올릴 수
있습니다.
```bash
npm run build   # → out/ 디렉토리 생성
npm run start   # out/ 을 로컬에서 정적 서버로 미리보기
```

## Cloudflare Pages 배포
`docs/TOSS_SUBMISSION_CHECKLIST.md`의 "Cloudflare Pages 배포 가이드" 참고.
요약: Build command `npm run build`, Output directory `out`.

## 프로젝트 구조
```
pet-food-checker/
├── app/            # 라우트 (홈, 개인정보처리방침, 이용약관)
├── components/     # SearchBar, Filter, SpeciesToggle, FoodCard
├── data/foods.json # 음식 안전 정보 110건 (강아지/고양이 이중 구조)
├── scripts/        # 데이터 마이그레이션·보강 스크립트
├── public/         # PWA manifest, 아이콘
├── docs/           # 스크린샷 가이드, Toss 제출 체크리스트, 데이터 출처
└── types/food.ts   # FoodItem 타입 정의
```

## 데이터 스키마
각 음식은 `dog`·`cat` 각각의 안전 정보를 따로 가집니다(같은 음식이라도
종에 따라 위험도가 다를 수 있음 — 예: 자일리톨은 개가, 감귤류 정유 성분은
고양이가 더 위험).

```json
{
  "id": 1,
  "name": "초콜릿 (다크/베이킹)",
  "category": "간식",
  "dog": {
    "safety": "치명적",
    "toxic_component": "테오브로민, 카페인",
    "symptoms": "구토, 설사, 과호흡, 심장박동 증가",
    "emergency": "섭취 즉시 병원 방문",
    "safe_amount": null,
    "notes": "다크초콜릿, 베이킹초콜릿일수록 위험합니다.",
    "benefits": null,
    "dose_by_size": {
      "small": "테오브로민 약 100mg부터 경미한 증상 (소형견 ~5kg 기준)",
      "medium": "테오브로민 약 300mg부터 경미한 증상 (중형견 ~15kg 기준)",
      "large": "테오브로민 약 600mg부터 경미한 증상 (대형견 ~30kg 기준)"
    }
  },
  "cat": { "...": "동일 구조" }
}
```

- `benefits`: `safety`가 "안전"인 항목의 영양·건강 효능 (그 외는 `null`)
- `dose_by_size`: 수의학 문헌에서 체중당(mg/kg 등) 수치가 확인된 항목에만
  존재 (개 기준). 대표 체중 소형견 ~5kg · 중형견 ~15kg · 대형견 ~30kg으로
  환산한 근사치이며, 정확한 진단은 반드시 동물병원에 문의해야 합니다.

## 데이터 출처 (팩트체크 근거)
`docs/SOURCES.md` 참고 — Merck Veterinary Manual, ASPCA Animal Poison
Control, Cornell Feline Health Center, JAVMA 2021 포도 독성 연구 등을
근거로 작성했습니다.

## 제출 전 체크리스트
`docs/TOSS_SUBMISSION_CHECKLIST.md` 참고

## 데이터 확장 로드맵
- 1차: 강아지 전용 100개 (`scripts/add-species-data.js`로 dog/cat 이중
  구조로 마이그레이션)
- 2차(현재): 영양 효능(benefits) + 체구별 위험 섭취량(dose_by_size) 보강,
  신규 10개 추가 → 총 110개 (`scripts/enrich-facts-and-nutrition.js`)
- 다음 단계: 정량 수치가 확인된 항목을 더 늘리고, 500개 목표까지 항목 수
  확장 (치명적 50 / 위험 100 / 주의 150 / 안전 200 목표 분포)

## 면책 고지
본 서비스는 참고용 정보이며 수의학적 진단을 대체하지 않습니다. 응급 상황
시 반드시 동물병원에 문의하세요.
