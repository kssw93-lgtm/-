import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { ENGLISH_GUIDES, getEnglishGuide } from "@/lib/i18n/english-guides";
import { englishPageMetadata } from "@/lib/i18n/english-metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return ENGLISH_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const guide = getEnglishGuide(params.slug);
  if (!guide) return {};
  return englishPageMetadata({
    title: `${guide.title} | Saju Dalyeok`,
    description: guide.description,
    path: `/en/learn/${guide.slug}`,
    koreanPath: guide.koreanPath,
    type: "article",
  });
}

export default function EnglishLearnArticlePage({ params }: Props) {
  const guide = getEnglishGuide(params.slug);
  if (!guide) notFound();

  const path = `/en/learn/${guide.slug}`;
  return (
    <main className="flex flex-1 flex-col gap-5 px-5 py-8 sm:px-6">
      <JsonLd data={articleJsonLd({
        headline: guide.title,
        description: guide.description,
        path,
        datePublished: "2026-11-10",
        dateModified: "2026-11-10",
        inLanguage: "en",
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/en" },
        { name: "Learn Saju", path: "/en/learn" },
        { name: guide.title, path },
      ])} />

      <div>
        <Link href="/en/learn" className="text-xs text-[color:var(--color-gold-light)]/70 hover:underline">← Learn Saju</Link>
        <h1 className="font-brand mt-3 text-2xl font-bold leading-snug text-[color:var(--color-gold-light)] sm:text-3xl">{guide.title}</h1>
        <p className="mt-2 text-sm leading-6 text-white/55">{guide.description}</p>
        <p className="mt-2 text-[11px] text-white/35">{guide.readingMinutes} min read · Cultural reference</p>
      </div>

      <article className="flex flex-col gap-5 rounded-2xl border border-[color:var(--color-gold)]/20 bg-white/[0.035] p-5 sm:p-6">
        <p className="text-[15px] leading-7 text-white/80">{guide.intro}</p>
        {guide.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="font-brand text-lg font-bold text-[color:var(--color-gold-light)]">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-[15px] leading-7 text-white/75">{paragraph}</p>
            ))}
          </section>
        ))}
        <p className="border-t border-white/10 pt-4 text-xs leading-5 text-white/45">
          Saju is a traditional interpretive practice, not a scientifically established way to predict events. Use this guide for cultural context and reflection, not as a substitute for professional advice.
        </p>
      </article>

      <section aria-labelledby="more-guides" className="rounded-2xl border border-white/10 bg-black/15 p-5">
        <h2 id="more-guides" className="text-sm font-bold text-white/85">Explore more Saju guides</h2>
        <div className="mt-3 grid gap-2">
          {ENGLISH_GUIDES.filter((item) => item.slug !== guide.slug).slice(0, 3).map((item) => (
            <Link key={item.slug} href={`/en/learn/${item.slug}`} className="text-sm text-[color:var(--color-gold-light)]/80 hover:underline">{item.title} →</Link>
          ))}
          <Link href="/en/what-is-saju" className="text-sm text-[color:var(--color-gold-light)]/80 hover:underline">What Is Korean Saju? →</Link>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/en" className="rounded-xl bg-[color:var(--color-gold)] px-4 py-3 text-center text-xs font-bold text-[#241a08]">Try a Saju reading</Link>
        <Link href="/en/tarot" className="rounded-xl border border-white/15 px-4 py-3 text-center text-xs font-semibold text-white/75">Explore Tarot</Link>
      </div>
    </main>
  );
}
