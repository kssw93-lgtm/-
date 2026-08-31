export const siteName = "계산한눈에";

export const siteDescription =
  "대출 이자, 퇴직금, 주택 취득세를 쉽고 빠르게 계산하는 생활 금융 계산기";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://calc-haneye.vercel.app";

export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@example.com";

export const adsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

export const siteConfig = {
  siteName,
  siteDescription,
  siteUrl,
  contactEmail,
  adsEnabled,
} as const;
