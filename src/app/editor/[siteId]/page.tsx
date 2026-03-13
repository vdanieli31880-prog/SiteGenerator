import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { EditorClient } from "@/components/EditorClient";

export default async function EditorPage({ params }: { params: Promise<{ siteId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const resolvedParams = await params;
  const siteId = resolvedParams.siteId;

  if (!siteId) {
    redirect("/dashboard");
  }

  const site = await prisma.site.findUnique({
    where: {
      id: siteId,
    },
  });

  if (!site || site.userId !== (session.user as any).id) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-3 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au Dashboard
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <h1 className="font-semibold text-slate-900">{site.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href={site.subdomain ? `/site/${site.subdomain}` : `/preview/${site.id}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
            Voir le site en plein écran
          </a>
          {/* Note: Save button moved to the client component sidebar for direct access to state */}
        </div>
      </header>

      {/* The main editor layout with sidebar and iframe is now a Client Component to manage state */}
      <EditorClient site={site} />
    </div>
  );
}
