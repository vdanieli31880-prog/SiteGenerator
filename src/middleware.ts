import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Récupérer le hostname (ex: localhost:3000, sitegenerator-production.up.railway.app, pizza.sitegenerator.app)
  const hostname = req.headers.get("host") || "";

  // Définir les domaines principaux (ton SaaS)
  // En dev: localhost:3000
  // En prod: sitegenerator-production.up.railway.app (et plus tard ton vrai domaine)
  const mainDomains = [
    "localhost:8080",
    "localhost:3000",
    "sitegenerator-production.up.railway.app",
    "sitegenerator.app" // Ton futur vrai nom de domaine
  ];

  // Si on est sur une route interne de l'app SaaS (dashboard, editor, preview), on laisse passer normalement
  if (mainDomains.includes(hostname)) {
    return NextResponse.next();
  }

  // Si on arrive ici, c'est qu'on est sur un sous-domaine (ex: pizza-pedro.sitegenerator.app) 
  // ou un domaine custom (ex: www.pizzapedro.fr)
  
  // On extrait le sous-domaine si c'est un .sitegenerator.app
  // Sinon on garde le hostname complet (pour les custom domains)
  let currentHost = hostname;
  if (hostname.includes(".sitegenerator.app")) {
    currentHost = hostname.replace(".sitegenerator.app", "");
  } else if (hostname.includes(".up.railway.app")) {
    // Cas spécial pour les tests si tu crées un sous-domaine via railway
    currentHost = hostname.replace(".up.railway.app", "");
  }

  // Réécriture invisible (Rewrite) vers notre dossier dynamique /[domain]
  return NextResponse.rewrite(new URL(`/${currentHost}${url.pathname}`, req.url));
}
