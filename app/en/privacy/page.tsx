import type { Metadata } from "next";
import Link from "next/link";
import ClearSavedData from "@/components/ClearSavedData";

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
        <p className="mt-3 text-xs text-white/40">Effective August 22, 2026 · Updated November 10, 2026</p>

        <section className="mt-6 space-y-2">
          <h2 className="text-base font-bold">1. Birth details and reading results</h2>
          <p className="text-sm leading-6 text-white/60">Saju Dalyeok is a web service that does not require an account. Your optional name, date of birth, solar or lunar calendar choice, leap-month selection, birth time (or unknown-time choice), and gender are used for calculations in your browser. These details are not sent to a calculation server or stored in an account. A partner's details and relationship status are used for the current compatibility reading.</p>
          <p className="text-sm leading-6 text-white/60">If you save or share a result image, it may include the name and reading shown in that image. Review it before sharing and do not share another person's information without permission.</p>
        </section>

        <section className="mt-5 space-y-2">
          <h2 className="text-base font-bold">2. Browser storage and deletion</h2>
          <p className="text-sm leading-6 text-white/60">Your birth details are kept in this browser's local storage so you do not have to enter them again on a later visit. They do not have an automatic expiration and may remain until you delete them or your browser clears this site's data. Your selected reading style is kept in session storage; how long it remains depends on your browser's tab and session behavior. If browser storage is blocked, the details may not be restored on a later visit.</p>
          <p className="text-sm leading-6 text-white/60">Choose “Read for someone else” in a result to clear the saved birth details. The button below removes the birth details and reading-style values used by this site. Downloaded images, data stored on another device, and advertising cookies must be removed separately.</p>
          <ClearSavedData />
        </section>

        <section className="mt-5 space-y-2">
          <h2 className="text-base font-bold">3. Google advertising and third-party cookies</h2>
          <p className="text-sm leading-6 text-white/60">The site may use Google AdSense for display ads and Google Ad Manager rewarded ads to unlock readings. Whether an ad is served depends on Google's review, ad availability, your environment, and ad-unit settings. On pages where ads appear, Google and its advertising partners may store or read cookies and use web beacons to collect, use, or share visit- and device-related information. The presence of ad code does not mean an account has been approved or that every visitor will see an ad.</p>
          <p className="text-sm leading-6 text-white/60">Read <a href="https://policies.google.com/technologies/partner-sites?hl=en" className="text-[color:var(--color-gold-light)] underline">How Google uses information from sites or apps that use its services</a> and <a href="https://policies.google.com/technologies/ads?hl=en" className="text-[color:var(--color-gold-light)] underline">Google advertising technologies</a>. You can manage personalized-ad settings in <a href="https://myadcenter.google.com/" className="text-[color:var(--color-gold-light)] underline">My Ad Center</a>. Turning off personalized ads is different from deleting all cookies.</p>
          <p className="text-sm leading-6 text-white/60">Display ads may appear on reading results and selected public content pages; they are not requested on the birth-details form or error screens. When a rewarded-ad unit is enabled, you may be asked to watch an ad before opening a new reading. If an ad cannot be loaded, the reading remains available. Where Google consent messages are available, use their choices to manage consent. You can also block or delete cookies in your browser.</p>
        </section>

        <section className="mt-5 space-y-2">
          <h2 className="text-base font-bold">4. Visit statistics, connection data, and external services</h2>
          <p className="text-sm leading-6 text-white/60">The production site uses Naver Analytics to understand visits, referral sources, and page usage. When the script loads or the site is accessed, technical connection details such as your IP address, browser and device information, requested page, and access time may be shared with service providers. Birth details are not sent as analytics events or included in page URLs.</p>
          <p className="text-sm leading-6 text-white/60">See <a href="https://analytics.naver.com/" className="text-[color:var(--color-gold-light)] underline">Naver Analytics</a> and <a href="https://policy.naver.com/policy/privacy.html" className="text-[color:var(--color-gold-light)] underline">Naver's privacy policy</a>. Hosting, CDN, and other infrastructure providers may also process connection logs to operate and secure the service. Not sending birth details to a calculation server does not mean there are no connection logs or third-party cookies.</p>
        </section>

        <section className="mt-5 space-y-2">
          <h2 className="text-base font-bold">5. External links and retention scope</h2>
          <p className="text-sm leading-6 text-white/60">When you follow a link to another site, that site's privacy policy applies. Deleting data from this site does not remove cookies or access logs held by external services. Check each service's notice for its retention periods and ways to exercise your rights.</p>
        </section>

        <section className="mt-5 space-y-2">
          <h2 className="text-base font-bold">6. Changes to this notice</h2>
          <p className="text-sm leading-6 text-white/60">If storage practices or external services change, this page and its revision date will be updated. Notices and consent requirements for new advertising or analytics flows should be reviewed against the services actually provided.</p>
        </section>
      </article>
      <Link href="/en" className="text-center text-sm text-[color:var(--color-gold-light)] underline underline-offset-4">Back to Saju Dalyeok</Link>
    </main>
  );
}
