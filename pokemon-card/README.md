# 포켓몬 카드 도감 (pokemon-card)

포켓몬 카드를 검색하고, 마음에 드는 카드를 나만의 컬렉션에 저장할 수 있는 Next.js 웹앱입니다.

## 주요 기능

- [Pokémon TCG API](https://pokemontcg.io)를 이용한 카드 이름 검색
- 검색 결과 카드 그리드로 확인 (세트, 레어도 표시)
- 브라우저 `localStorage` 기반 "내 컬렉션" 저장/제거
- 컬렉션 페이지에서 저장한 카드 목록 확인

## 시작하기

```bash
cd pokemon-card
npm install
npm run dev
```

기본 포트는 `3100`입니다: http://localhost:3100

## 폴더 구조

```
pokemon-card/
├── app/                # Next.js App Router 페이지
│   ├── page.tsx        # 카드 검색 페이지
│   └── collection/     # 내 컬렉션 페이지
├── components/         # UI 컴포넌트
├── lib/                # API 클라이언트, 컬렉션 저장 로직
└── types/               # 타입 정의
```

## 향후 개선 아이디어

- 타입/세트별 필터
- 카드 상세 페이지 (가격 정보 포함)
- 로그인 기반 컬렉션 동기화
