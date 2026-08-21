━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
인터랙티브 명리·운세 사이트
개발 지시서 v1.0 (Codex / Claude Code 전달용)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

이 문서를 그대로 Codex 또는 Claude Code에 붙여넣어 개발을 시작할 수 있다.


---

00. 프로젝트 한 줄 요약

생년월일시를 입력하면 사주를 계산하고, 연애운·직업운을 미리 작성된 템플릿 텍스트로 즉시 보여주는 무료 웹사이트. 실시간 AI 호출 없음. 애드센스 광고 수익 모델.


---

01. 참조 문서 (이 지시서와 함께 반드시 제공)

아래 4개 문서를 프로젝트 루트의 /docs 폴더에 그대로 넣고 개발을 시작한다. 이 문서들의 규칙은 코드보다 우선한다 — 코드가 문서와 다르면 문서가 맞다.

/docs/01-calculation-rules-v2.0.md   ← 사주 계산 규칙서 v2.0
/docs/02-data-table-v1.1.md          ← 사주 계산 데이터 테이블 v1.1
/docs/03-interpretation-mapping-v1.1.md ← 해석 템플릿 매핑 규칙서 v1.1
/docs/04-screen-flow-v1.0.md         ← 화면 흐름 설계서 v1.0

AI(Codex/Claude Code)는 이 문서들에 명시된 고정 데이터·계산 규칙을 임의로 바꾸지 않는다. 특히 계산 규칙서 62번("계산 결과 수정 금지")과 데이터 테이블 59번("AI가 수정해서는 안 되는 데이터")은 개발 중에도 그대로 적용된다.


---

02. 기술 스택 (무료 우선 원칙)

프레임워크: Next.js (React 기반, 정적/서버리스 배포 용이)
호스팅: Vercel 또는 Cloudflare Pages 무료 티어
계산 엔진: 순수 TypeScript 함수. 서버 API 호출 없이 브라우저(클라이언트)에서 직접 실행 가능하게 작성. 서버 비용 발생 최소화.
스타일링: Tailwind CSS
애니메이션(캐릭터/로딩): Lottie 또는 CSS 기반 모션 (구체적 에셋은 별도 디자인 단계에서 결정, 지금은 컴포넌트 인터페이스만 마련)
데이터 저장: 없음 (72번 원칙 — 입력값은 계산 후 폐기, 서버에 남기지 않음)
광고: Google AdSense(디스플레이) + 리워드 광고 단위(PDF/공유 잠금 해제용)

이유: 계산 자체가 무겁지 않고(단순 조회+연산 수준) 서버 상태 저장이 필요 없으므로, 서버리스/클라이언트 계산으로 운영비를 0에 가깝게 유지할 수 있다.


---

03. 디렉토리 구조

/docs
    01-calculation-rules-v2.0.md
    02-data-table-v1.1.md
    03-interpretation-mapping-v1.1.md
    04-screen-flow-v1.0.md

/data
    stems.json
    branches.json
    sexagenary-cycle.json
    hidden-stems.json
    five-elements.json
    stem-relations.json
    branch-relations.json
    kst-history.json              ← 표준시 이력 (데이터테이블 82번)
    solar-terms/                  ← ⚠ 아직 비어있음. 04번 참조
    lunar-calendar/                ← ⚠ 아직 비어있음. 04번 참조
    day-pillars/                   ← ⚠ 아직 비어있음. 04번 참조
    interpretation-templates/
        intro.json
        love.json
        career.json

/lib
    /calc
        input-validation.ts
        calendar-convert.ts        ← 양력/음력 변환 (역법 데이터 소스 인터페이스 사용)
        timezone-normalize.ts      ← kst-history.json 사용, 82번 규칙 구현
        year-pillar.ts
        month-pillar.ts
        day-pillar.ts
        hour-pillar.ts
        elements-yinyang.ts
        hidden-stems.ts
        ten-gods.ts
        relations.ts                ← 합충형파해원진
        rootedness.ts
        void-branches.ts            ← 공망
        daeun.ts
        saeun.ts
        wolun.ts
        index.ts                    ← 위 전체를 순서대로 실행하는 계산 엔진 진입점
    /interpretation
        feature-extract.ts          ← 매핑규칙서 01, 01-1번: 특징값(패턴 ID) 추출
        strength-score.ts           ← 매핑규칙서 01번 축2: 신강/신약 점수제
        template-select.ts          ← 매핑규칙서 04번: 버전 선택(해시 기반)
        variable-substitute.ts      ← 매핑규칙서 05번: {이름} 등 치환

/components
    IntroScreen.tsx                 ← S1
    CategorySelect.tsx              ← S2
    BirthInfoForm.tsx               ← S3
    CalculatingLoader.tsx           ← S4
    ResultScreen.tsx                ← S5
    UnlockScreen.tsx                ← S6

/app (또는 /pages, Next.js 버전에 따라)
    라우팅은 화면 흐름 설계서 01번의 S1~S6 순서를 그대로 따른다.

/tests
    calc/                          ← 계산 규칙서 63~66번 기준 테스트
    interpretation/


---

04. KASI API 실제 응답 구조 (확보 완료, 2026-08-21 테스트 기준)

두 API 모두 자동승인·정상 응답 확인됨. 아래 매핑을 그대로 구현에 사용한다.

── 24절기 API (SpcdeInfoService/get24DivisionsInfo) ──

응답 필드: dateName(절기명), locdate(YYYYMMDD), kst(HHMM, 분단위 시각), isHoliday, seq
연도별 1회 호출로 24절기 전체 반환(totalCount=24).

interface SolarTermSource {
  getSolarTerm(year: number, termName: string): { locdate: string; kst: string }; // kst="0502" → 05:02
}

주의: kst는 초 단위가 아니라 분 단위까지만 제공한다. 데이터 테이블 32번 timestamp 구조의 초 단위 필드는 "00"으로 고정하거나 분 단위임을 명시적으로 표시한다. 연도가 바뀌는 절입(예: 입춘이 1월 말/2월 초) 부근에서는 전년도와 해당년도 두 번 호출해서 경계값을 모두 확보한다.

── 음양력 API (LrsrCldInfoService/getLunCalInfo) ──

응답 필드: lunYear/lunMonth/lunDay, lunIljin(일진, 한글+한자), lunLeapmonth(평/윤), lunSecha(세차), lunWolgeon(월건), solLeapyear(윤년여부), solWeek, solJd

⚠ 중요 — 필드별 사용 가능 여부가 다르다:

사용 가능:
- lunIljin → 일진(day_pillar) 검증 데이터로 그대로 사용. 일진은 절기·음력 체계와 무관한 60갑자 순환이라 안전하다.
- lunLeapmonth → is_leap_month(윤달 여부)로 그대로 매핑.
- lunYear/lunMonth/lunDay → 음양력 변환 데이터로 사용.

사용 금지:
- lunSecha(세차), lunWolgeon(월건) → 절대 year_pillar/month_pillar로 사용하지 않는다. 이 값은 음력(설날) 기준으로 계산된 간지이며, 계산 규칙서 11~17번이 요구하는 입춘·절기 기준 년주/월주와 경계가 다르다(같은 결과가 나오는 시기도 있지만, 입춘~설날 사이 태어난 경우 등에서 어긋난다). year_pillar/month_pillar는 반드시 위 24절기 API의 실제 절입 시각을 계산 규칙서 11~17번 로직에 직접 대입해서 별도로 산출한다.

interface LunarCalendarSource {
  solarToLunar(date: string): {
    lunarYear: number; lunarMonth: number; lunarDay: number; isLeapMonth: boolean;
    dayPillarRef: string; // lunIljin, 일진 교차검증용으로만 사용
  };
}

DATA-002(데이터 테이블 76번): 목 데이터를 절대 Production으로 착각해 배포하지 않는다. 목 데이터는 /data/mock/ 하위에 명확히 분리하고, 실제 데이터로 교체 전에는 배포 금지 플래그를 코드에 남긴다(예: `if (usingMockData) console.warn(...)`).

개발 초기 단계에서는 여전히 1900~2100년 전 구간을 로컬 JSON으로 캐싱해서 쓰는 것을 권장한다(API 호출은 개발계정 일 1만 건 제한이 있고, 매 요청마다 외부 호출하면 응답 속도도 느려짐). 즉:

1차: 위 두 API를 배치로 호출해서 필요한 연도 범위(예: 1900~2100)의 절기·음양력·일진 데이터를 로컬 JSON으로 미리 수집
2차: 계산 엔진은 이 로컬 JSON을 읽어서 계산 (런타임에 API를 직접 호출하지 않음, 69번 "외부 데이터 직접 의존 금지" 원칙)
3차: 수집 스크립트 자체는 /scripts/fetch-kasi-data.ts 등으로 별도 보관, 데이터 갱신 시 재실행 가능하게 유지


---

05. 계산 엔진 구현 순서

계산 규칙서 73번(최종 구조)을 그대로 함수 호출 순서로 옮긴다.

1. input-validation.ts — 03번(사용자 입력) 검증. 시간 미상 시 hour는 null로 유지.
2. calendar-convert.ts — 06, 07번(양력/음력, 윤달)
3. timezone-normalize.ts — 09, 10번(표준시, 진태양시) + 데이터테이블 82번(표준시 이력)
4. year-pillar.ts — 11~13번(입춘 기준)
5. month-pillar.ts — 14~17번(절기 월지, 오호둔월법)
6. day-pillar.ts — 18~20번(기준일 기반 일주). REFERENCE_DATE=2024-01-01, REFERENCE_DAY_PILLAR=甲子(규칙서 v2.1 19번 확정값)를 상수로 사용. (date - REFERENCE_DATE의 날짜 차이) mod 60 으로 60갑자 index 산출.
7. hour-pillar.ts — 22~24번(자시 처리, 오자둔시법). hour가 null이면 시주 필드도 null로 반환.
8. elements-yinyang.ts, hidden-stems.ts — 26~28번
9. ten-gods.ts — 31, 32번(십신, 지장간 십신)
10. relations.ts — 33~41번(합충형파해원진)
11. rootedness.ts — 43번(통근)
12. void-branches.ts — 42번(공망)
13. daeun.ts, saeun.ts, wolun.ts — 49~54번

각 함수는 계산 규칙서 61번의 결과 객체 스키마를 따라 최종적으로 하나의 SajuResult 객체로 합쳐진다.

금지: 위 함수 중 어느 것도 LLM/AI API를 호출하지 않는다. 계산은 결정론적 순수 함수여야 한다(동일 입력 → 동일 출력, 규칙서 74번 16항).


---

06. 해석·템플릿 매핑 구현

매핑 규칙서 v1.1을 그대로 코드로 옮긴다.

feature-extract.ts: SajuResult → 십신 강세 유형(5종) 판정. hour_pillar가 null이면 01-1번 예외 규칙 적용(시주 제외 집계).
strength-score.ts: 매핑 규칙서 01번 축2 점수제 그대로 구현(득령30+득지20+득세, hour 유무에 따라 배점 분기).
template-select.ts: pattern_id + category + hash(생년월일시) → 버전 선택(04번).
variable-substitute.ts: {이름} 등 치환(05번). 이름 미입력 시 "당신"으로 대체.

출력: category + pattern_id + 최종 텍스트. 이 값을 ResultScreen.tsx에 전달.


---

07. 화면 컴포넌트 구현

화면 흐름 설계서 v1.0의 S1~S6을 각각 컴포넌트로 구현한다. 화면 간 상태 전달은 세션 스토리지 또는 React Context로 처리(서버 저장 없음, 08번 세션 유지 원칙).

S3(정보 입력) 필수 검증: 생년월일, 양력/음력, 성별 미입력 시 [결과 보기] 버튼 비활성화.
S5(결과): hour_pillar가 null인 경우 "출생시간을 몰라 시주는 제외하고 계산했어요" 문구 조건부 렌더링.
S6(잠금 화면): 광고 시청 완료 콜백 이후에만 PDF 생성/공유 로직 실행. 광고 SDK 연동은 실제 광고 네트워크 계정 준비 후 별도 작업.


---

08. 테스트 (KASI 데이터 확보 전까지는 목 데이터 기준으로 작성)

계산 규칙서 63번의 경계값을 목 데이터 범위 안에서 최대한 재현한다.

- 입춘 직전/직후 1건
- 절기 직전/직후 1건
- 자시 22:59 / 23:00 / 23:59 / 00:00 / 00:59 / 01:00 각 1건
- 음력·윤달 1건
- 시간 미상 1건
- 1961-08-10 이전 출생(표준시 이력 적용 케이스) 1건 ← 데이터테이블 82번

실제 KASI 데이터로 교체된 뒤에는 이 테스트를 반드시 재실행하고, 목 데이터 기준 결과와 달라지는 부분이 없는지 확인한다(목 데이터 구간은 실제 데이터와 값이 같도록 미리 맞춰서 만들 것 — 즉 "가짜 절기 시각"이 아니라 "실제로 검증된 절기 시각 중 일부만 미리 가져와 쓰는 것"으로 목 데이터를 구성하는 걸 권장).


---

09. 완료 기준 (Definition of Done, 이번 단계)

□ 계산 엔진이 목 데이터 기준으로 08번 테스트 전부 통과
□ 연애운·직업운 각각 10패턴 × 2버전 결과가 모두 정상 출력됨
□ S1~S6 화면이 흐름대로 연결되고, 세션 값이 카테고리 전환 시 유지됨
□ 시간 미상 케이스에서 시주 제외 처리 및 안내 문구 정상 동작
□ 데이터 소스가 인터페이스로 분리되어, /data/solar-terms 등이 실제 KASI 데이터로 교체돼도 /lib/calc 코드 수정이 필요 없음
□ 목 데이터 사용 여부가 콘솔 경고로 명확히 표시됨 (실수로 목 데이터인 채 배포하는 것 방지)

이 기준을 통과하면, KASI API 신청이 완료되는 대로 /data/solar-terms, /data/lunar-calendar, /data/day-pillars만 실제 데이터로 교체하고 08번 테스트를 재실행하는 것으로 다음 단계(실서비스 데이터 검증)를 진행할 수 있다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF DEVELOPMENT BRIEF v1.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
