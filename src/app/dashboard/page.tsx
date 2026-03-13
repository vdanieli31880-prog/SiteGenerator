import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/")
  }

  // On récupère les sites de l'utilisateur connecté
  const userSites = await prisma.site.findMany({
    where: {
      userId: (session.user as any).id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 text-white font-bold p-2 rounded-lg text-xl leading-none">SG</div>
          <h1 className="text-xl font-semibold tracking-tight hidden sm:block">SiteGenerator</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {session.user.image ? (
              <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200" />
            )}
            <span className="text-sm font-medium hidden sm:block">{session.user.name}</span>
          </div>
          <a href="/api/auth/signout" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Déconnexion
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Vos Sites</h2>
            <p className="text-slate-600 mt-1">Gérez vos landing pages et leurs configurations.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm shadow-indigo-500/30 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Créer un nouveau site
          </button>
        </div>

        {userSites.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center shadow-sm">
            <div className="bg-indigo-50 text-indigo-600 p-4 rounded-full mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun site pour le moment</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Vous n'avez pas encore généré de landing page. Cliquez sur le bouton ci-dessus pour démarrer à partir de notre template premium.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSites.map((site) => (
              <div key={site.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-32 bg-slate-100 border-b border-slate-100 flex items-center justify-center relative">
                  <span className="text-slate-400 font-medium">Aperçu indisponible</span>
                  <div className="absolute inset-0 bg-indigo-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <button className="bg-white text-indigo-600 font-medium px-4 py-2 rounded-lg shadow-sm">Éditer le site</button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 truncate pr-4">{site.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">Publié</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{site.subdomain ? `${site.subdomain}.sitegenerator.app` : 'Non configuré'}</p>
                  <div className="flex justify-between items-center text-sm text-slate-500 border-t border-slate-100 pt-4">
                    <span>Mis à jour le {new Date(site.updatedAt).toLocaleDateString()}</span>
                    <button className="hover:text-indigo-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
