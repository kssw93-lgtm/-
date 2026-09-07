import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 구글 등 검색엔진이 vercel.app 주소와 커스텀 도메인을 서로 다른 사이트(중복 콘텐츠)로
 * 보지 않도록, 옛 vercel.app 주소로 들어오면 새 도메인으로 영구 리다이렉트한다.
 * canonical 태그만으로는 이미 색인된 페이지가 정리되기까지 오래 걸리므로, 실제 리다이렉트로
 * 확실히 하나의 사이트로 합친다. www 없는 apex(sajudalyeok.co.kr)는 Vercel 도메인 설정에서
 * 이미 www로 308 리다이렉트되고 있어 여기서는 건드리지 않는다.
 */
const CANONICAL_HOST = "www.sajudalyeok.co.kr";
const OLD_HOSTS = new Set([
  "cheongi-nuseol.vercel.app",
  "cheongi-nuseol-kssw93-6048s-projects.vercel.app",
  "cheongi-nuseol-git-master-kssw93-6048s-projects.vercel.app",
]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (OLD_HOSTS.has(host)) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * _next/static, _next/image, favicon.ico 등 정적 자산 경로는 리다이렉트 대상에서 제외해
     * 불필요한 처리를 피한다.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
