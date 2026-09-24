import Link from "next/link";
import type { Metadata } from "next";
import ClearSavedData from "@/components/ClearSavedData";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 사주달력",
  description: "사주 입력값의 브라우저 저장, 광고·방문 통계의 데이터 처리, 저장 정보 삭제 방법을 안내해요.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="font-brand text-2xl font-bold text-[color:var(--color-gold-light)]">개인정보처리방침</h1>
      <p className="text-xs text-white/50">최초 시행: 2026년 8월 22일 · 내용 수정: 2026년 9월 22일</p>
      <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-[15px] leading-relaxed text-white/85">
        <section className="space-y-2">
          <h2 className="font-bold">1. 사주 입력과 결과 처리</h2>
          <p>사주달력은 회원가입 없이 사용하는 웹 서비스예요. 이름(선택), 생년월일, 양력·음력과 윤달 여부, 출생시간 또는 시간 미상, 성별을 브라우저에서 계산에 사용해요. 사주 입력값을 별도 계산 서버에 보내거나 계정에 저장하는 기능은 없어요. 궁합의 상대방 입력과 관계 상태도 현재 화면의 계산에 사용해요.</p>
          <p>결과 이미지를 저장하거나 공유하면 이미지에 표시된 이름과 풀이도 파일에 포함될 수 있어요. 공유 전 내용을 확인하고 다른 사람의 정보를 허락 없이 전달하지 않도록 주의해 주세요.</p>
        </section>
        <section className="space-y-2">
          <h2 className="font-bold">2. 이 브라우저에 남는 정보와 삭제</h2>
          <p>다음 방문의 재입력을 줄이기 위해 자신의 출생 입력을 로컬 저장소에 보관해요. 자동 만료를 설정하지 않아 직접 삭제하거나 브라우저가 사이트 데이터를 지울 때까지 남을 수 있어요. 선택한 말투는 세션 저장소에 보관하며, 브라우저의 탭·세션 처리 방식에 따라 유지 기간이 달라질 수 있어요. 저장이 차단된 환경에서는 재방문 시 입력이 복원되지 않을 수 있어요.</p>
          <p>결과 화면의 ‘다른 사람 정보로 보기’는 저장된 출생 입력을 지워요. 아래 버튼은 이 사이트가 사용하는 출생 입력과 말투 저장값을 함께 삭제해요. 이미 내려받은 이미지, 다른 기기의 저장값과 광고 쿠키는 별도로 삭제해야 해요.</p>
          <ClearSavedData />
        </section>
        <section className="space-y-2">
          <h2 className="font-bold">3. Google 광고와 제3자 쿠키</h2>
          <p>사이트에는 Google AdSense 연결과 광고 요청 코드가 있어요. 실제 광고 게재 여부는 Google의 검토·광고 공급·이용 환경에 따라 달라져요. 광고가 게재되는 페이지에서 Google과 광고 파트너는 쿠키를 저장하거나 읽고 웹 비콘 등을 사용해 방문·기기 관련 정보를 수집·이용·공유할 수 있어요. 현재의 광고 코드 존재를 계정 승인 완료나 모든 방문자에 대한 광고 노출을 뜻하는 것으로 보지는 않아요.</p>
          <p><a href="https://policies.google.com/technologies/partner-sites?hl=ko" className="text-[color:var(--color-gold-light)] underline">Google 파트너 사이트에서의 데이터 사용 방식</a>과 <a href="https://policies.google.com/technologies/ads?hl=ko" className="text-[color:var(--color-gold-light)] underline">광고 기술 안내</a>에서 처리 방식을 확인할 수 있어요. <a href="https://myadcenter.google.com/" className="text-[color:var(--color-gold-light)] underline">Google 내 광고 센터</a>에서는 맞춤 광고 설정을 관리할 수 있어요. 맞춤 광고 해제와 모든 쿠키 삭제는 같은 기능이 아니에요.</p>
          <p>사주 입력·개인 결과·오류 화면에는 광고를 요청하지 않도록 구성해요. 광고 동의 메시지가 제공되는 지역과 환경에서는 해당 메시지의 선택 기능을 이용해 주세요. 브라우저에서도 쿠키를 차단하거나 삭제할 수 있어요.</p>
        </section>
        <section className="space-y-2">
          <h2 className="font-bold">4. 방문 통계·접속 정보·외부 서비스</h2>
          <p>운영 사이트는 네이버 애널리틱스 스크립트를 사용해 방문 및 유입 경로, 페이지 이용 현황을 파악해요. 스크립트를 불러오거나 사이트에 접속할 때 IP 주소, 브라우저·기기 정보, 요청 페이지와 접속 시각 같은 통신 정보가 서비스 제공자에게 전달될 수 있어요. 사주 입력 필드를 방문 통계의 별도 이벤트나 URL에 담아 전송하는 기능은 구현하지 않았어요.</p>
          <p><a href="https://analytics.naver.com/" className="text-[color:var(--color-gold-light)] underline">네이버 애널리틱스 안내</a> 및 <a href="https://policy.naver.com/policy/privacy.html" className="text-[color:var(--color-gold-light)] underline">네이버 개인정보처리방침</a>을 함께 참고해 주세요. 호스팅·CDN 등 기반 서비스에서도 요청 처리와 보안을 위한 접속 기록이 발생할 수 있어요. ‘사주 정보를 계산 서버에 저장하지 않는다’는 안내가 모든 접속 기록이나 제3자 쿠키가 없다는 뜻은 아니에요.</p>
        </section>
        <section className="space-y-2">
          <h2 className="font-bold">5. 외부 링크와 보관 범위</h2>
          <p>다른 사이트로 연결되는 링크를 열면 해당 사이트의 데이터 처리방침이 적용돼요. 이 사이트에서 지우는 저장값으로 외부 서비스의 쿠키나 접속 기록까지 삭제되지는 않아요. 제3자 기록의 보관 기간과 권리 행사 방법은 각 서비스의 안내를 확인해 주세요.</p>
        </section>
        <section className="space-y-2">
          <h2 className="font-bold">6. 안내의 변경</h2>
          <p>수집·저장 방식이나 외부 서비스가 바뀌면 이 페이지의 내용과 수정일을 갱신해요. 새로운 광고·분석 흐름에 필요한 고지와 동의 요건은 실제 제공 범위에 맞춰 확인해야 해요.</p>
        </section>
      </div>
      <Link href="/about" className="text-sm text-[color:var(--color-gold-light)] underline">사이트 소개와 콘텐츠 제작 방식</Link>
      <Link href="/" className="rounded-full bg-[color:var(--color-gold)] px-6 py-3 text-center font-bold text-[#241a08]">사주달력으로 돌아가기</Link>
    </main>
  );
}
