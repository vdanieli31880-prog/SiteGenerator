import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Le nom du site est requis" }, { status: 400 });
    }

    // La configuration par défaut de notre template "Bistrot Lumière"
    const defaultConfig = {
      theme: {
        primaryColor: "orange",
      },
      hero: {
        badge: "Bistronomie de Terroir",
        title: "Une cuisine sincère, de saison, au cœur de la ville.",
        description: "Le Bistrot Lumière vous accueille tous les jours pour partager des plats généreux, préparés avec les meilleurs produits de nos producteurs locaux.",
        ctaPrimary: "Réserver une table",
        ctaSecondary: "Voir la carte",
      }
    };

    
    // Générer un sous-domaine basique (ex: "Le Petit Bouchon" -> "le-petit-bouchon-randomID")
    const baseDomain = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const subdomain = `${baseDomain}-${randomSuffix}`;

    const site = await prisma.site.create({
      data: {
        name: name.trim(),
        subdomain: subdomain,
        userId: (session.user as any).id,
        config: defaultConfig,
      },
    });

    return NextResponse.json({ siteId: site.id }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du site:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
