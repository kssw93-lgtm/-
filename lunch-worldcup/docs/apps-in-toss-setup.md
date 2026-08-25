# 점심 월드컵 — 앱인토스(Apps in Toss) 연동 개발 지시서

## 0. 이 문서의 성격

이 저장소가 실행되는 샌드박스 환경은 `apps-in-toss.toss.im`, `developers-apps-in-toss.toss.im` 두 도메인에 대한 네트워크 접근이 막혀 있어, 이 세션 안에서 `ait build` / `ait deploy`를 직접 실행할 수 없습니다. 그래서 이 문서는 "실행 로그"가 아니라, **네트워크 제약이 없는 환경(개발자 PC, CI 등)에서 그대로 따라 하면 되는 지시서**로 작성했습니다.

내용의 근거는 문서 사이트가 아니라, npm에 공개된 실제 패키지 소스입니다 (`@apps-in-toss/web-framework@3.1.1`, `@apps-in-toss/cli@3.1.1`의 `dist/*.d.ts`, `dist/index.js`를 직접 내려받아 확인). 콘솔 UI 화면 자체는 접근하지 못했으므로, 콘솔 화면 상의 정확한 메뉴 위치 등은 실제 진행하면서 다를 수 있습니다.

## 1. 사전 준비물

- Node.js 18+
- 앱인토스 콘솔(https://apps-in-toss.toss.im/)에 이미 등록된 미니앱 — **appName(케밥-케이스 식별자)** 을 정확히 알고 있어야 함
- 배포용 API 키 (이번에 전달받은 키) — 콘솔에서 발급되는 것으로, appName 1개에 종속됩니다
- mTLS 인증서는 결제/로그인 등 별도 서버-투-서버 연동에만 필요하고, 이번 "배포" 작업에는 불필요합니다

## 2. 프로젝트를 앱인토스 SDK 규격으로 준비

### 2-1. 새 프로젝트로 초기화 (권장)

```bash
npm install -g @apps-in-toss/web-framework   # ait CLI가 함께 설치됨
ait init --app-name <콘솔에-등록된-appName>
```

`ait init`은 대화형으로 템플릿을 내려받아 `apps-in-toss.config.ts`, `package.json`(dev/build 스크립트 포함) 등을 자동 생성합니다. `--app-name`은 케밥-케이스여야 하고, 콘솔에 등록된 appName과 정확히 일치해야 배포가 됩니다.

### 2-2. 기존 lunch-worldcup 화면 이식

현재 이 저장소의 `lunch-worldcup/`(`index.html`, `style.css`, `app.js`)은 앱인토스 SDK 없이 순수 정적 웹으로 만든 프로토타입입니다. 토너먼트 진행 로직, 결과 화면 등은 프레임워크와 무관하므로 그대로 재사용하면 되고, 아래 3~6번에서 다루는 설정/광고/공유 부분만 실제 SDK 호출로 교체하면 됩니다.

## 3. `apps-in-toss.config.ts` 작성

실제 패키지의 타입 정의(`@apps-in-toss/web-framework/config`)에서 확인한 설정 스키마입니다.

```ts
import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "<콘솔에-등록된-appName>",
  brand: {
    primaryColor: "#FF6B35", // 현재 프로토타입의 --accent 색상
  },
  permissions: [
    // 이 앱은 결과 공유 시 클립보드 복사 정도만 필요합니다.
    { name: "clipboard", access: "write" },
  ],
  navigationBar: {
    withBackButton: true,
    withTitle: false,
    transparentBackground: false,
    theme: "light",
  },
  webView: {
    pullToRefreshEnabled: false, // 게임 중 실수로 새로고침되는 것 방지
    bounces: false,
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite dev",   // 실제 채택하는 빌드 도구에 맞게 수정
      build: "vite build",
    },
  },
  outdir: "dist",
});
```

`permissions`에 쓸 수 있는 값은 `clipboard` / `geolocation` / `contacts` / `photos` / `camera` / `microphone` 뿐이며, 필요 없는 권한은 넣지 않는 것을 권장합니다(심사 시 불필요한 권한 요청은 감점 요인이 될 수 있음).

## 4. 배포 API 키 관리 (절대 커밋 금지)

```bash
ait token add            # 대화형으로 키 입력 (profile 이름 생략 시 default)
# 또는
ait token add dev --api-key <키값>
```

- 키는 프로젝트 폴더가 아니라 `~/.ait/credentials`에 프로필 단위로 저장됩니다. 코드나 커밋에 직접 넣지 마세요.
- 이번에 전달받은 키는 이 저장소의 `lunch-worldcup/.env.local`에 임시로만 넣어뒀고, 루트 `.gitignore`의 `.env*.local` 규칙으로 커밋 대상에서 제외되어 있습니다. 실제 사용 시에는 `.env.local`이 아니라 위 `ait token add`로 옮겨 관리하는 것을 권장합니다 — CLI가 표준으로 기대하는 저장 위치가 `~/.ait/credentials`이기 때문입니다.

## 5. 빌드 & 배포

```bash
ait build
ait deploy --profile dev            # 4에서 등록한 프로필 이름
# 또는 프로필 없이: ait deploy --api-key <키>
```

- `ait deploy`는 `apps-in-toss.toss.im/console`의 업로드 API를 순서대로 호출합니다: 업로드 시작 → 파일 업로드 → 업로드 완료 → 빌드 상태 폴링(`BUILDING`/`PREPARE`면 자동 재시도, `BUILD_FAILED`면 에러).
- 실행 결과로 `intoss-private://{appName}?_deploymentId=...` 형태의 딥링크가 출력됩니다. 이걸 QR로 만들어 토스 앱에서 스캔하면 실제 기기(콘솔 QR 테스트 환경)에서 확인할 수 있습니다.

## 6. 광고 SDK 연동 (현재 프로토타입의 자리표시자 교체)

현재 `lunch-worldcup/app.js`에는 두 곳이 자리표시자(placeholder)로 되어 있습니다: 상시 배너(`#ad-banner`)와 결과 확정 직전 전면 광고(`renderInterstitial()`). 실제 SDK 호출로 교체하는 예시입니다.

**배너**
```ts
import { TossAds } from "@apps-in-toss/web-framework";

TossAds.initialize({ /* 콘솔에서 발급된 광고 설정값 */ });
TossAds.attachBanner(adGroupId, "#ad-banner", { /* 옵션 */ });
```

**전면 광고** (`renderInterstitial()`에서 "결과 보기"를 누르기 전에 load → show)
```ts
import { loadFullScreenAd, showFullScreenAd } from "@apps-in-toss/web-framework";

loadFullScreenAd({
  onEvent: () => {
    showFullScreenAd({
      onEvent: () => { /* 노출/클릭/닫힘 이벤트 처리 후 결과 화면으로 전환 */ },
      onError: () => { /* 실패 시 광고 없이 바로 결과 화면으로 전환 */ },
    });
  },
  onError: () => { /* 로드 실패 시 광고 없이 바로 결과 화면으로 전환 */ },
});
```

**공유하기** (`#share-btn`, 현재 Web Share API 사용 중인 부분 교체)
```ts
import { Share } from "@apps-in-toss/web-framework";

await Share.sendMessage({ message: `오늘 점심은 "${winner.name}"으로 정했어요!` });
```
`share()` 단독 함수는 deprecated이므로 `Share.sendMessage`를 사용합니다.

각 API의 `isSupported()`로 토스 앱 웹뷰가 아닌 일반 브라우저에서 열렸는지 감지해, 미지원 환경에서는 현재처럼 Web Share API/클립보드 복사로 자연스럽게 폴백하도록 유지하는 것을 권장합니다.

## 7. v2 → v3 마이그레이션 참고

과거 `granite.config.ts`를 쓰던 v2 SDK에서 넘어오는 경우 `ait migrate` 명령으로 `apps-in-toss.config.ts`로 자동 전환할 수 있습니다. v3부터 CORS 정책이 바뀌어, 아래 오리진을 (백엔드 API를 별도로 두는 경우) 허용 목록에 등록해야 합니다.
- `https://{appName}.web.tossmini.com` (실서비스)
- `https://{appName}.private-web.tossmini.com` (콘솔 QR 테스트)

## 8. 진행 전 채워야 할 값

- [ ] 콘솔에 등록된 정확한 appName
- [ ] 배너 광고 `adGroupId` 등 광고 관련 콘솔 설정값
- [ ] 최종 앱 이름/아이콘/컬러 확정본 (README의 후보 3안 중 선택)

## 9. 참고 링크

- 앱인토스 개발자센터: https://developers-apps-in-toss.toss.im/
- 앱인토스 콘솔: https://apps-in-toss.toss.im/
- npm 패키지: `@apps-in-toss/web-framework`, `@apps-in-toss/cli`
