# Toss 미니앱 제출 체크리스트

## 필수 항목
- [ ] `public/manifest.json` (PWA 매니페스트) — 완료
- [ ] 개인정보처리방침 URL — `/privacy` — 완료
- [ ] 이용약관 URL — `/terms` — 완료
- [ ] 스크린샷 5장 (1080x1920) — `docs/SCREENSHOT_GUIDE.md` 참고, 촬영 필요
- [ ] 아이콘 (1024x1024, PNG) — `public/icons/icon-512.png`를 1024로 리사이즈 필요
- [ ] 카테고리: 생활/건강
- [ ] 연령등급: 전체이용가
- [ ] 개발자 이메일: kssw93@gmail.com

## 심사 항목 자체 점검
- [ ] 로딩 3초 이내 — 정적 JSON 110건 기반이라 매우 빠름 (실기기 확인 필요)
- [ ] 광고 없음 (초기 버전은 광고 미탑재)
- [x] 데이터 100개 이상 — `data/foods.json` 110건 (강아지/고양이 이중 구조, 영양 효능/체구별 섭취량 보강 완료, 출처는 `docs/SOURCES.md`)
- [x] 모바일 최적화 — `max-w-md` 기반 모바일 우선 레이아웃
- [x] 개인정보 처리 명시 — `/privacy` 페이지

## 거절 사유 방지 체크
- [x] 외부 결제 유도 없음
- [x] 광고 과다 없음 (광고 미탑재)
- [x] 데이터 50개 미만 아님 (110개)
- [ ] 로딩 속도 실기기 측정 (배포 후 확인)
- [x] 개인정보방침 존재

## 배포 전 남은 작업
1. `npm install` 후 `npm run build`로 프로덕션 빌드 검증
2. Cloudflare Pages에 배포하여 실제 URL 확보 (아래 가이드 참고)
3. 배포된 URL 기준으로 스크린샷 5장 촬영 (`docs/SCREENSHOT_GUIDE.md`)
4. 아이콘 1024x1024 버전 추가 생성
5. Toss 미니앱 개발자 콘솔에서 제출 양식 작성 및 업로드

## Cloudflare Pages 배포 가이드

이 프로젝트는 서버 API·이미지 최적화 없이 전부 정적 페이지로 구성되어 있어
`next.config.js`에 `output: "export"`를 적용해 완전한 정적 사이트(HTML/CSS/JS)로
빌드합니다. Cloudflare Pages Functions나 `@cloudflare/next-on-pages` 같은
어댑터 없이 표준 정적 호스팅으로 바로 배포할 수 있습니다.

**Cloudflare Pages 대시보드에서 연결하는 경우**
1. GitHub 저장소 연결 → 이 저장소 선택
2. Framework preset: `Next.js (Static HTML Export)`
3. Build command: `npm run build`
4. Build output directory: `out`
5. Root directory: `pet-food-checker` (모노레포이므로 반드시 지정)

**Wrangler CLI로 배포하는 경우**
```bash
cd pet-food-checker
npm install
npm run build
npx wrangler pages deploy out --project-name=pet-food-checker
```

**주의사항**
- next-pwa가 빌드 시 `public/sw.js`, `public/workbox-*.js`를 생성하고
  `output: "export"` 빌드가 이를 `out/`에 그대로 복사합니다. 서비스워커가
  정적 호스팅에서도 정상 등록되는지 배포 후 실기기에서 확인하세요.
- 저장소 루트가 아니라 `pet-food-checker/` 하위 프로젝트이므로 Cloudflare
  Pages 설정에서 Root directory를 반드시 `pet-food-checker`로 지정해야
  기존 사주 사이트와 섞이지 않습니다.
