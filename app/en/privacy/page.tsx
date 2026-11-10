import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy | Saju Dalyeok",
  description: "How Saju Dalyeok handles birth details, browser storage, advertising, and visit statistics.",
  alternates: { canonical: "/en/privacy" },
};

export default function EnglishPrivacyPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 px-5 py-8 sm:px-6">
      <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[color:var(--color-gold-light)]/75">YOUR PRIVACY</p>
        <h1 className="font-brand mt-2 text-2xl font-bold">Privacy at Saju Dalyeok</h1>
        <p className="mt-3 text-xs text-white/40">Summary of the Korean privacy notice, updated September 22, 2026.</p>

        <section className="mt-6 space-y-2">
          <h2 className="text-base font-bold">Birth details and chart calculation</h2>
          <p className="text-sm leading-6 text-white/60">The English chart preview calculates your date and time in your browser. It does not send these birth details to our calculation server or save them. Other features on the Korean site may store birth details in your browser's local storage to make later visits easier; you can clear that data in your browser or from the Korean result flow.</p>
        </section>

        <section className="mt-5 space-y-2">
          <h2 className="text-base font-bold">Advertising and visit statistics</h2>
          <p className="text-sm leading-6 text-white/60">The site includes Google AdSense integration and ad-request code. Whether an ad is served depends on Google’s review, available ads, your region, and service settings. On pages where ads are shown, Google and its advertising partners may use cookies or web beacons to process and share visit- and device-related information. The presence of ad code does not mean the account is approved or that every visitor will see an ad. No ad requests are made on screens for entering birth details, viewing personal results, or displaying errors.</p>
          <p className="text-sm leading-6 text-white/60">The site also uses Naver Analytics to understand visits and referral sources. When analytics loads or a page is accessed, technical connection details such as your IP address, browser and device information, requested page, and access time may be processed. Birth details are not sent as analytics events or included in page URLs. See <a href="https://policies.google.com/technologies/partner-sites?hl=en" className="text-[color:var(--color-gold-light)] underline">Google’s information for users of partner sites</a>, <a href="https://policies.google.com/technologies/ads?hl=en" className="text-[color:var(--color-gold-light)] underline">Google’s advertising technologies</a>, and <a href="https://policy.naver.com/policy/privacy.html" className="text-[color:var(--color-gold-light)] underline">Naver’s privacy policy</a> for details.</p>
        </section>

        <section className="mt-5 space-y-2">
          <h2 className="text-base font-bold">Full policy</h2>
          <p className="text-sm leading-6 text-white/60">This English page is a summary. The full privacy notice is currently available in Korean and contains additional details about browser storage, third-party services, and data deletion.</p>
          <Link href="/privacy" lang="ko" className="inline-flex text-sm font-semibold text-[color:var(--color-gold-light)] underline underline-offset-4">Read the full Korean privacy notice →</Link>
        </section>
      </article>
      <Link href="/en" className="text-center text-sm text-[color:var(--color-gold-light)] underline underline-offset-4">Back to the English Saju calculator</Link>
    </main>
  );
}
