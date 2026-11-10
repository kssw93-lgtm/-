import Link from "next/link";
import { englishPageMetadata } from "@/lib/i18n/english-metadata";

export const metadata = englishPageMetadata({
  title: "About Saju Dalyeok | Korean Saju Readings",
  description: "Learn how Saju Dalyeok calculates birth charts, prepares interpretations, and supports its free service.",
  path: "/en/about",
  koreanPath: "/about",
});

export default function EnglishAboutPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 px-5 py-8 sm:px-6">
      <article className="rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/5 p-5 text-[15px] leading-7 text-white/80 sm:p-6">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[color:var(--color-gold-light)]/75">ABOUT</p>
        <h1 className="font-brand mt-2 text-2xl font-bold text-[color:var(--color-gold-light)]">About Saju Dalyeok</h1>
        <div className="mt-5 space-y-5">
          <p>Saju Dalyeok is a free Korean Saju service. Enter birth details to calculate a Four Pillars chart and explore readings on relationships, career, money, life patterns, compatibility, and more.</p>
          <p>The service began under the name <strong className="text-[color:var(--color-gold-light)]">Cheongi Nuseol</strong>. Because that name overlaps with a long-running broadcast program and could cause confusion, Saju Dalyeok is now the main name. Cheongi Nuseol remains as a subtitle that reflects the history of the service.</p>
          <p><strong className="text-[color:var(--color-gold-light)]">Chart calculations follow defined calendrical and astronomical rules.</strong> Solar-term times used to determine the month pillar are calculated with the VSOP87 astronomical algorithm. The year, month, day, and hour are then used to calculate the Heavenly Stems, Earthly Branches, Five Elements, Ten Gods, chart structure, special stars, and luck cycles. Prepared interpretation text is selected to match those calculated values, so the same birth details and topic produce the same result or result category.</p>
          <p><strong className="text-[color:var(--color-gold-light)]">No account is required.</strong> Birth details, including the selected birth time zone, are calculated in your browser and saved locally there to make return visits easier. They are not stored by a Saju calculation server. For the chart, the recorded local time is converted to Korea Standard Time using the selected region’s time-zone rules. Local solar-time adjustments based on longitude are not applied.</p>
          <p><strong className="text-[color:var(--color-gold-light)]">The service is free and may include advertising.</strong> Display ads may appear on result and content pages. A rewarded ad may be offered before some full readings; if an ad cannot be served, the reading can still open.</p>
          <p>Some Korean-language screens offer classic, casual, or Joseon-era wording. These options change the tone of an explanation, not the underlying Saju interpretation.</p>
          <p>Explanations and educational guides use AI writing assistance and describe the calculation conventions used by this site. They may contain errors; checking a chart against those rules does not verify or predict a person's experience or future. The service does not present readings as expert consultation or personalized advice from a Saju professional.</p>
          <p className="text-sm text-white/50">Readings are cultural and entertainment content based on traditional Saju theory. They do not replace medical, legal, financial, or other professional advice. Consult a qualified professional when making important decisions.</p>
        </div>
      </article>
      <div className="flex gap-4 text-xs text-white/45">
        <Link href="/en/what-is-saju" className="hover:text-white/75 hover:underline">Saju basics</Link>
        <Link href="/en/privacy" className="hover:text-white/75 hover:underline">Privacy</Link>
        <Link href="/en/faq" className="hover:text-white/75 hover:underline">FAQ</Link>
      </div>
      <Link href="/en" className="rounded-full bg-gradient-to-r from-[color:var(--color-gold)] to-[color:var(--color-gold-light)] px-8 py-4 text-center text-base font-bold text-[#241a08] transition hover:brightness-110">Start a free Saju reading</Link>
    </main>
  );
}
