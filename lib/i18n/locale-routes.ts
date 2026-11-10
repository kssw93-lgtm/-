const ENGLISH_TO_KOREAN: Record<string, string> = {
  "/en": "/",
  "/en/what-is-saju": "/learn/saju-basics",
  "/en/learn": "/learn",
  "/en/learn/heavenly-stems-earthly-branches": "/learn/cheongan-jiji",
  "/en/learn/five-elements": "/learn/ohaeng",
  "/en/learn/ten-gods": "/learn/sipsin",
  "/en/learn/luck-cycles": "/learn/daeun-saeun",
  "/en/learn/saju-compatibility": "/learn/gunghap-basics",
  "/en/learn/saju-vs-tarot": "/learn/tarot-vs-saju",
  "/en/about": "/about",
  "/en/faq": "/faq",
  "/en/privacy": "/privacy",
  "/en/tarot": "/tarot",
};

const KOREAN_TO_ENGLISH = Object.fromEntries(
  Object.entries(ENGLISH_TO_KOREAN).map(([english, korean]) => [korean, english])
) as Record<string, string>;

function normalizedPath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname || "/";
}

/** Keep the language switch on the matching page where an equivalent route exists. */
export function languageSwitchPath(pathname: string): string {
  const path = normalizedPath(pathname);
  const koreanPath = ENGLISH_TO_KOREAN[path];
  if (koreanPath) return koreanPath;

  if (path.startsWith("/en/tarot/")) return path.replace(/^\/en/, "");
  if (path.startsWith("/tarot/")) return `/en${path}`;

  if (path.startsWith("/en/learn/")) return ENGLISH_TO_KOREAN[path] ?? "/learn";
  if (path.startsWith("/learn/")) return KOREAN_TO_ENGLISH[path] ?? "/en/learn";

  return "/en";
}
