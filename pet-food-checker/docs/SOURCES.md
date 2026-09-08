# 데이터 출처 (팩트체크 근거)

`data/foods.json`의 위험도·성분·체구별 섭취량 정보는 아래 수의학 문헌과
전문기관 자료를 근거로 작성했습니다. 국내 자료보다 해외(특히 미국) 수의독성학
자료가 정량 데이터(mg/kg 등)를 훨씬 풍부하게 공개하고 있어 주로 해외 1차
출처를 인용하고, 한국어로 번역·재구성했습니다.

## 핵심 출처

- **Merck Veterinary Manual** (수의사·수의대생이 표준적으로 참고하는 임상
  매뉴얼)
  - [Chocolate Toxicosis in Animals](https://www.merckvetmanual.com/toxicology/food-hazards/chocolate-toxicosis-in-animals) — 테오브로민 체중당 독성 역치(20/40–50/60/100–200 mg/kg)
  - [Xylitol Toxicosis in Dogs](https://www.merckvetmanual.com/toxicology/food-hazards/xylitol-toxicosis-in-dogs) — 저혈당(약 100mg/kg)·간부전(약 500mg/kg) 역치
  - [Garlic and Onion (Allium spp) Toxicosis in Animals](https://www.merckvetmanual.com/toxicology/food-hazards/garlic-and-onion-allium-spp-toxicosis-in-animals) — 마늘 약 5g/kg, 양파 약 15–30g/kg
  - [Macadamia Nut Toxicosis in Dogs](https://www.merckvetmanual.com/toxicology/food-hazards/macadamia-nut-toxicosis-in-dogs) — 약 0.7–2g/kg부터 증상
  - [Tremorgenic Neuromycotoxicosis in Dogs](https://www.merckvetmanual.com/toxicology/mycotoxicoses/tremorgenic-neuromycotoxicosis-in-dogs) — 곰팡이 핀 호두 등 진전유발성 곰팡이독소

- **ASPCA Animal Poison Control**
  - [People Foods to Avoid Feeding Your Pets](https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets)
  - [Macadamia Nuts are Toxic to Dogs](https://www.aspca.org/news/animal-poison-control-alert-macadamia-nuts-are-toxic-dogs)
  - [Toxic Component in Grapes and Raisins Identified](https://www.aspcapro.org/resource/toxic-component-grapes-and-raisins-identified) — 2021년 JAVMA 레터, 주석산(타르타르산)을 포도·건포도 독성 원인 물질로 제안

- **Cornell University College of Veterinary Medicine**
  - [Cornell Feline Health Center – Poisons](https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/poisons)
  - [Riney Canine Health Center – Xylitol toxicities](https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-topics/xylitol-toxicities)
  - [Riney Canine Health Center – Grape and raisin toxicity](https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-information/grape-and-raisin-toxicity)

- **VCA Animal Hospitals** (수의사 검수 대중 자료)
  - [Xylitol Poisoning in Dogs](https://vcahospitals.com/know-your-pet/xylitol-toxicity-in-dogs)
  - [Macadamia Nut Poisoning](https://vcahospitals.com/know-your-pet/macadamia-nut-poisoning)

- **기타**
  - FDA – [Paws Off Xylitol; It's Dangerous for Dogs](https://www.fda.gov/consumers/consumer-updates/paws-xylitol-its-dangerous-dogs)
  - Pet Poison Helpline (자일리톨 중독 사례 증가 통계, 2020년 대비 2025년 약 75% 증가)

## 체구별(소형/중형/대형견) 섭취량 참고치 산출 방식

Merck Veterinary Manual 등에서 확인한 **체중당(mg/kg, g/kg) 독성 역치**에,
아래 대표 체중을 곱해 절대량으로 환산했습니다.

| 구분 | 대표 체중 (예시) |
|---|---|
| 소형견 | 약 5kg (10kg 이하) |
| 중형견 | 약 15kg (10~25kg) |
| 대형견 | 약 30kg (25kg 초과) |

초콜릿의 경우 제품별 테오브로민 함량 편차가 커(다크 초콜릿 기준 g당 약
4.6~16mg, 이 앱에서는 중간값인 약 5.5mg/g을 사용) **참고용 근사치**이며,
정확한 진단·처치는 반드시 동물병원 또는 반려동물 중독관리 상담(Pet Poison
Helpline, ASPCA Animal Poison Control 등)을 통해야 합니다.

포도·건포도는 2021년 JAVMA 연구에서도 "품종·개체별 편차가 커 예측이
불가능하다"는 결론이었기 때문에, 체구와 무관하게 **안전 섭취량 없음**으로
표기했습니다.

## 영양·효능(benefits) 정보

"안전" 등급 음식의 영양 효능은 개별 논문을 인용하기보다, 수의영양학에서
널리 합의된 기초 사실(오메가3=EPA/DHA=항염, 베타카로틴=비타민A 전구체,
프로바이오틱스=장내 미생물 균형, 타우린=고양이 필수 아미노산 등)을
근거로 작성했습니다. 특정 브랜드·제품에 대한 효능 주장은 포함하지 않았습니다.

## 한계 및 향후 계획

- 이번 보강에서 정확한 체중당 수치를 확보한 항목은 초콜릿·자일리톨·양파·
  마늘·마카다미아·포도(안전량 없음) 6종입니다. 나머지 위험/주의 등급
  항목은 기존처럼 정성적 설명(정확한 mg/kg 수치 없이 "다량 섭취 시" 등)에
  머물러 있습니다 — 신뢰할 수 있는 정량 자료가 있는 항목만 수치를 표기해,
  근거 없는 숫자를 지어내지 않기 위함입니다.
- 총 데이터는 100개(1차) + 10개(2차 보강) = 110개입니다. "500개" 목표
  로드맵(README 참고)의 나머지 항목은 후속 작업이 필요합니다.
- 고양이 관련 수의학 자료는 개보다 상대적으로 적어(예: 자일리톨의 고양이
  독성 역치는 공식적으로 확립되지 않음), 일부 항목은 "개 자료 대비 사례가
  적음/불확실함"으로 보수적으로 표기했습니다.
