import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { GoogleSignInButton } from "@/components/GoogleSignInButton"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900 p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-slate-300 bg-gradient-to-b from-white pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-slate-100 lg:p-4">
            SiteGenerator SaaS &nbsp;
            <code className="font-mono font-bold">v0.1.0</code>
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center text-center mt-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-slate-900 mb-8">
          Bienvenue sur le SaaS
        </h1>

        {session ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-2">Connecté avec succès</h2>
            <p className="text-slate-600 mb-6">Bonjour {session.user?.name}</p>
            
            <div className="space-y-4">
              <Link href="/dashboard" className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-center">
                Aller au Dashboard
              </Link>
              <a href="/api/auth/signout" className="block w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors text-center">
                Se déconnecter
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-2">Accès membre</h2>
            <p className="text-slate-600 mb-6">Connectez-vous pour gérer vos sites web.</p>
            
            <GoogleSignInButton />
          </div>
        )}
      </div>
    </main>
  )
}
