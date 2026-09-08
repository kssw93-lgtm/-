export const metadata = { title: "개인정보처리방침 | 펫푸드 체커" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-md px-5 py-8 text-sm leading-relaxed text-gray-700">
      <h1 className="mb-4 text-lg font-bold text-gray-900">
        개인정보처리방침
      </h1>
      <p className="mb-3">
        펫푸드 체커(이하 &apos;서비스&apos;)는 이용자의 개인정보를 중요하게
        생각하며, 관련 법령을 준수합니다. 본 서비스는 강아지 음식 안전 정보를
        검색하는 기능만을 제공하며, 이용자의 회원가입이나 별도의 개인정보
        입력 없이 이용할 수 있습니다.
      </p>
      <h2 className="mb-2 mt-4 font-semibold text-gray-900">
        1. 수집하는 정보
      </h2>
      <p className="mb-3">
        서비스는 이름, 연락처 등 개인을 식별할 수 있는 정보를 직접 수집하지
        않습니다. 다만 서비스 이용 과정에서 접속 기기 정보, 서비스 이용
        기록(검색어, 방문 일시 등) 등이 통계 및 서비스 개선 목적으로 자동
        수집될 수 있습니다.
      </p>
      <h2 className="mb-2 mt-4 font-semibold text-gray-900">
        2. 정보의 이용 및 보관
      </h2>
      <p className="mb-3">
        수집된 정보는 서비스 품질 개선, 통계 분석 목적 이외에는 사용되지
        않으며, 관련 법령에 따른 보관 기간이 없는 한 즉시 파기합니다. 앱은
        오프라인 이용을 위해 음식 데이터를 이용자 기기 내에 저장(캐싱)할 수
        있으며, 이는 서버로 전송되지 않습니다.
      </p>
      <h2 className="mb-2 mt-4 font-semibold text-gray-900">
        3. 제3자 제공 및 광고
      </h2>
      <p className="mb-3">
        서비스는 법령에 근거하지 않는 한 이용자의 정보를 제3자에게 제공하지
        않습니다. 향후 광고 또는 제휴 서비스가 추가될 경우 관련 내용을 본
        방침에 반영하여 사전 고지합니다.
      </p>
      <h2 className="mb-2 mt-4 font-semibold text-gray-900">
        4. 문의처
      </h2>
      <p className="mb-3">
        개인정보 관련 문의사항은 아래 이메일로 연락해 주세요.
        <br />
        이메일: kssw93@gmail.com
      </p>
      <p className="text-xs text-gray-400">시행일: 2026년 9월 8일</p>
    </main>
  );
}
