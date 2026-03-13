import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ siteId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const resolvedParams = await params;
    const siteId = resolvedParams.siteId;

    const body = await req.json();
    const { config } = body;

    // Vérifier que le site appartient bien à l'utilisateur
    const existingSite = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!existingSite || existingSite.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        config: config,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur de mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
