# 펫푸드 체커 (Pet Food Checker)

강아지가 먹어도 되는 음식인지 바로 검색할 수 있는 Toss 미니앱(PWA)입니다.

## 주요 기능
- 음식 이름 검색 (100개 데이터)
- 치명적 · 위험 · 주의 · 안전 4단계 안전도 표시
- 4단계 필터링
- 카드 탭 시 위험 성분 · 증상 · 대처법 · 적정량 상세 정보 확인
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

## 빌드
```bash
npm run build
npm run start
```

## 프로젝트 구조
```
pet-food-checker/
├── app/            # 라우트 (홈, 개인정보처리방침, 이용약관)
├── components/     # SearchBar, Filter, FoodCard
├── data/foods.json # 음식 안전 정보 100건
├── public/         # PWA manifest, 아이콘
├── docs/           # 스크린샷 가이드, Toss 제출 체크리스트
└── types/food.ts   # FoodItem 타입 정의
```

## 데이터 스키마
```json
{
  "id": 1,
  "name": "초콜릿 (다크/베이킹)",
  "category": "간식",
  "safety": "치명적",
  "toxic_component": "테오브로민, 카페인",
  "symptoms": "구토, 설사, 과호흡, 심장박동 증가",
  "emergency": "섭취 즉시 병원 방문",
  "safe_amount": null,
  "notes": "다크초콜릿일수록 위험합니다."
}
```

## 제출 전 체크리스트
`docs/TOSS_SUBMISSION_CHECKLIST.md` 참고

## 데이터 확장 로드맵
- 1개월 내 300개 → 500개로 확장 (치명적 50 / 위험 100 / 주의 150 / 안전 200)
- 출처: ASPCA Poison Control, 수의사 검증 자료 기반 (직접 작성 및 재검증 필요)

## 면책 고지
본 서비스는 참고용 정보이며 수의학적 진단을 대체하지 않습니다. 응급 상황
시 반드시 동물병원에 문의하세요.
