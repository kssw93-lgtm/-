# 계산한눈에 (calc-haneye)

대출 이자, 퇴직금, 주택 취득세를 로그인 없이 빠르게 계산해 볼 수 있는 무료
생활 금융 계산기 웹사이트입니다. 모든 계산은 브라우저(클라이언트)에서
처리되며, 입력값은 서버나 데이터베이스에 저장되지 않습니다.

> 모든 계산 결과는 **참고용 예상 계산**이며, 금융·세무·법률 자문이 아닙니다.
> 실제 의사결정 전에는 금융기관, 고용노동부, 위택스, 관할 지방자치단체,
> 세무·노무 전문가의 최신 안내를 확인하세요.

## 기술 스택

- Next.js (App Router, TypeScript strict mode)
- Tailwind CSS
- React Hook Form + Zod
- Vitest
- Lucide React 아이콘

별도의 백엔드/API Route/데이터베이스는 사용하지 않으며, 모든 계산 로직은
`lib/calculators`에서 클라이언트 사이드로 실행됩니다.

## 로컬 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다.

## 환경변수 설정

`.env.example`을 참고해 `.env.local` 파일을 생성하세요.

```bash
cp .env.example .env.local
```

| 변수명 | 설명 | 기본값 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | canonical/sitemap/OG URL의 기준 도메인 | `https://calc-haneye.vercel.app` |
| `NEXT_PUBLIC_ENABLE_ADS` | 광고 슬롯 노출 여부(`"true"`가 아니면 항상 미노출) | `false` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 문의 페이지·Footer에 노출되는 이메일 | `contact@example.com` |

## 테스트

계산 로직(`lib/calculators/*`)에 대한 Vitest 단위 테스트가
`tests/calculators`에 있습니다.

```bash
npm run test
```

## 빌드

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Vercel 배포 방법

1. GitHub 저장소를 Vercel에 Import합니다(Next.js 프로젝트로 자동 감지됩니다).
   - 모노레포 구조라면 **Root Directory**를 이 프로젝트 폴더(`calc-haneye`)로
     지정해야 합니다.
2. Vercel 프로젝트 설정의 Environment Variables에 아래 3개를 등록합니다.
   ```
   NEXT_PUBLIC_SITE_URL=https://실제-프로젝트명.vercel.app
   NEXT_PUBLIC_ENABLE_ADS=false
   NEXT_PUBLIC_CONTACT_EMAIL=contact@example.com
   ```
3. 배포 후 실제 Vercel URL로 홈, 계산기 3종, 정책 페이지가 정상 동작하는지
   확인합니다.

## 도메인 연결 전/후 NEXT_PUBLIC_SITE_URL 변경 방법

1. 도메인 구매 및 Vercel 프로젝트에 도메인을 연결합니다.
2. Vercel 환경변수 `NEXT_PUBLIC_SITE_URL`을 새 도메인(`https://...`)으로
   변경합니다.
3. 재배포하면 canonical, `sitemap.xml`, `robots.txt`, Open Graph URL이 모두
   새 도메인 기준으로 자동 반영됩니다(도메인이 여러 파일에 하드코딩되어
   있지 않고 `lib/constants/site.ts`에서만 관리됩니다).
4. 필요 시 검색 콘솔에 새 sitemap을 재제출하세요.

## 1차 계산기별 지원 범위

- **대출 이자 계산기**: 원리금균등상환·원금균등상환·만기일시상환 3가지
  방식만 지원합니다. 거치기간, 변동금리, 우대금리, 중도상환수수료, 인지세,
  보증료, DSR·LTV, 실제 대출 가능 여부는 포함하지 않습니다.
- **퇴직금 계산기**: 입력한 날짜와 임금 정보를 바탕으로 한 단순 참고
  계산만 제공합니다. 휴직·결근, 중간정산, 퇴직연금, 실제 법정 평균임금
  산정의 세부 규정은 반영하지 않습니다.
- **주택 취득세 계산기**: 개인·유상취득·일반 1주택·감면 미적용 조건의
  기본 취득세만 계산합니다. 다주택, 법인 취득, 각종 감면, 상속·증여,
  공동취득·지분취득, 오피스텔·토지·상가, 지방교육세·농어촌특별세는
  1차 지원 범위 밖입니다.

## 세율·법령 재검토 필요 사항

`lib/constants/taxRates.ts`의 `HOME_ACQUISITION_TAX_REFERENCE`에 기준일
(`effectiveDate`), 최종 검토일(`lastReviewedAt`), 출처(`sourceName`,
`sourceUrl`)가 명시되어 있습니다. **배포 직전 반드시 국가법령정보센터,
위택스, 행정안전부 등의 최신 공식 자료와 세율·기준을 재대조해야 합니다.**
제도는 예고 없이 개정될 수 있습니다.

## 광고(애드센스)

`components/ads/AdSlot.tsx`는 향후 애드센스 연동을 위한 자리 컴포넌트입니다.
현재 `NEXT_PUBLIC_ENABLE_ADS=false`이며, 어떤 광고 스크립트나 퍼블리셔 ID도
포함되어 있지 않습니다. `AdSlot`은 `adsEnabled`가 `false`일 때 아무 것도
렌더링하지 않고(`null` 반환) 화면 공간을 차지하지 않습니다.
