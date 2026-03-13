import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function EditorPage({ params }: { params: Promise<{ siteId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  // Next.js 15: `params` is a Promise that resolves to the actual params object
  const resolvedParams = await params;
  const siteId = resolvedParams.siteId;

  if (!siteId) {
    redirect("/dashboard");
  }

  // Vérification que le site existe et appartient à l'utilisateur
  const site = await prisma.site.findUnique({
    where: {
      id: siteId,
    },
  });

  // Pour débugger, si ça fail ici, ça redirige au dashboard.
  if (!site) {
    console.error("Site introuvable:", siteId);
    redirect("/dashboard");
  }

  if (site.userId !== (session.user as any).id) {
    console.error("L'utilisateur", (session.user as any).id, "n'est pas proprio du site", site.userId);
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
          <a href={`/preview/${site.id}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
            Voir le site en plein écran
          </a>
          <button className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg shadow-sm shadow-indigo-500/30 hover:bg-indigo-700 transition-colors">
            Publier les modifications
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Configuration */}
        <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto shrink-0 flex flex-col">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Configuration du Site</h2>
          </div>
          <div className="p-5 flex-1">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom du site</label>
                <input 
                  type="text" 
                  defaultValue={site.name}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Couleur Principale</label>
                <div className="flex gap-2">
                  {[
                    { name: 'orange', class: 'bg-orange-500' },
                    { name: 'indigo', class: 'bg-indigo-500' },
                    { name: 'emerald', class: 'bg-emerald-500' },
                    { name: 'rose', class: 'bg-rose-500' }
                  ].map(color => (
                    <button key={color.name} className={`w-8 h-8 rounded-full border-2 border-white shadow-sm ring-2 ${color.name === 'orange' ? 'ring-slate-300 ' + color.class : 'ring-transparent ' + color.class}`} title={color.name}></button>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-medium text-slate-900 mb-4">Contenu du Hero</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Titre principal</label>
                    <textarea 
                      defaultValue={(site.config as any)?.hero?.title || ""}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-20 resize-none text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Bouton Primaire</label>
                    <input 
                      type="text" 
                      defaultValue={(site.config as any)?.hero?.ctaPrimary || ""}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Iframe Preview Area */}
        <main className="flex-1 bg-slate-100 p-8 overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-[1200px] bg-white rounded-2xl shadow-xl border border-slate-200 h-full flex flex-col overflow-hidden relative">
            <div className="h-10 border-b border-slate-100 bg-slate-50 flex items-center px-4 gap-2 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>
              <div className="ml-4 px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-400 font-mono w-64 flex-1 max-w-sm truncate">
                {site.subdomain ? `${site.subdomain}.sitegenerator.app` : 'brouillon.sitegenerator.app'}
              </div>
            </div>
            <div className="flex-1 bg-white relative">
        <iframe 
          src={`/preview/${site.id}`} 
          className="absolute inset-0 w-full h-full border-0"
          title="Aperçu du site"
        />
      </div>
          </div>
        </main>
      </div>
    </div>
  );
}
