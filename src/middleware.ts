import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // ----- FEATURE DE TEST SANS DNS -----
  // Si l'utilisateur accède à /site/pizza-de-la-mama
  // on fait comme si le Hostname était pizza-de-la-mama
  if (url.pathname.startsWith('/site/')) {
    const fakeDomain = url.pathname.split('/')[2]; // récupère "pizza-de-la-mama"
    // On réécrit vers notre dossier /[domain] en gardant le reste du chemin
    return NextResponse.rewrite(new URL(`/${fakeDomain}`, req.url));
  }
  // ------------------------------------

  const mainDomains = [
    "localhost:8080",
    "localhost:3000",
    "sitegenerator-production.up.railway.app",
    "sitegenerator.app"
  ];

  if (mainDomains.includes(hostname)) {
    return NextResponse.next();
  }

  let currentHost = hostname;
  if (hostname.includes(".sitegenerator.app")) {
    currentHost = hostname.replace(".sitegenerator.app", "");
  }

  return NextResponse.rewrite(new URL(`/${currentHost}${url.pathname}`, req.url));
}
