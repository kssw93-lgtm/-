import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/constants/site";
import { calculators } from "@/lib/constants/calculatorMetadata";

const staticPaths = [
  "",
  "/finance",
  "/property-tax",
  "/guides",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/guides/loan-interest-guide",
  "/guides/severance-pay-guide",
  "/guides/home-acquisition-tax-guide",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));

  const calculatorEntries: MetadataRoute.Sitemap = calculators.map((item) => ({
    url: `${siteUrl}${item.href}`,
    lastModified: now,
  }));

  return [...staticEntries, ...calculatorEntries];
}
