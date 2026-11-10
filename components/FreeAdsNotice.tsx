"use client";

import { useSiteLocale } from "@/lib/i18n/site-locale";
import { t } from "@/lib/i18n/messages";

export default function FreeAdsNotice() {
  const locale = useSiteLocale();
  return (
    <p className="no-print rounded-full bg-white/5 px-4 py-2 text-center text-[11px] text-white/40">
      🎁 {t(locale, "무료 서비스예요 · 일부 해설 페이지에는 광고가 표시될 수 있어요")}
    </p>
  );
}
