"use client";

import { usePathname } from "next/navigation";

export type SiteLocale = "ko" | "en";

export function getSiteLocale(pathname: string | null | undefined): SiteLocale {
  return pathname === "/en" || pathname?.startsWith("/en/") ? "en" : "ko";
}

export function useSiteLocale(): SiteLocale {
  return getSiteLocale(usePathname());
}

export function localizedPath(pathname: string, locale: SiteLocale): string {
  const koreanPath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  if (locale === "ko") return koreanPath;
  return koreanPath === "/" ? "/en" : `/en${koreanPath}`;
}

export function localizedText(locale: SiteLocale, korean: string, english: string): string {
  return locale === "en" ? english : korean;
}
