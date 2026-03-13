
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PreviewPage({ params }: { params: Promise<{ siteId: string }> }) {
  const resolvedParams = await params;
  const site = await prisma.site.findUnique({ where: { id: resolvedParams.siteId } });
  if (!site) return notFound();

  const config = site.config as any;
  const color = config?.theme?.primaryColor || 'orange';

  // Mapping standard tailwind colors for safe dynamic usage
  const bgMap: Record<string, string> = {
    orange: 'bg-orange-600',
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    rose: 'bg-rose-600'
  };
  const textMap: Record<string, string> = {
    orange: 'text-orange-600',
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    rose: 'text-rose-600'
  };
  const lightBgMap: Record<string, string> = {
    orange: 'bg-orange-50',
    indigo: 'bg-indigo-50',
    emerald: 'bg-emerald-50',
    rose: 'bg-rose-50'
  };

  const primaryBg = bgMap[color] || bgMap.orange;
  const primaryText = textMap[color] || textMap.orange;
  const primaryLightBg = lightBgMap[color] || lightBgMap.orange;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-200">
       <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
         <div className="text-xl font-bold tracking-tight">{site.name}</div>
         <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <span className="cursor-pointer hover:text-slate-900 transition-colors">La Carte</span>
            <span className="cursor-pointer hover:text-slate-900 transition-colors">Le Chef</span>
            <span className="cursor-pointer hover:text-slate-900 transition-colors">Avis</span>
         </nav>
         <button className={`${primaryBg} text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition-opacity`}>
            Réserver
         </button>
       </header>
       
       <section className="py-24 px-4 text-center max-w-4xl mx-auto relative">
          <div className="absolute inset-0 pointer-events-none -z-10 flex justify-center">
            <div className={`w-96 h-96 ${primaryLightBg} rounded-full blur-[100px] opacity-60`}></div>
          </div>
          <span className={`inline-flex items-center gap-2 py-1 px-4 rounded-full text-xs font-semibold mb-8 border border-slate-200 bg-slate-50 uppercase tracking-widest text-slate-600`}>
            <span className={`w-2 h-2 rounded-full ${primaryBg}`}></span>
            {config?.hero?.badge || "Nouveau site"}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 leading-tight">
            {config?.hero?.title || "Bienvenue sur " + site.name}
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            {config?.hero?.description || "Votre description apparaîtra ici."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button className={`${primaryBg} text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:opacity-90 transition-opacity`}>
                {config?.hero?.ctaPrimary || "Action Principale"}
             </button>
             <button className="bg-white border border-slate-300 text-slate-900 px-8 py-4 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors">
                {config?.hero?.ctaSecondary || "En savoir plus"}
             </button>
          </div>
       </section>
    
       {/* Valeurs / Features */}
       <section className="py-20 bg-slate-50" id="valeurs">
         <div className="max-w-6xl mx-auto px-4 space-y-12">
           <div className="max-w-2xl">
             <p className={`text-sm font-semibold uppercase tracking-[0.35em] ${primaryText}`}>Notre Philosophie</p>
             <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">L'amour du bon produit.</h2>
           </div>
           <div className="grid gap-6 md:grid-cols-3">
             {[1, 2, 3].map((i) => (
               <div key={i} className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm">
                 <div className={`w-12 h-12 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center ${primaryText} mb-4`}>
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                 </div>
                 <h3 className="text-xl font-semibold text-slate-900 mb-2">Engagement n°{i}</h3>
                 <p className="text-slate-600">Texte d'exemple pour montrer comment s'affichent les valeurs de votre établissement.</p>
               </div>
             ))}
           </div>
         </div>
       </section>

       {/* Le Chef */}
       <section className="py-20 bg-white" id="chef">
         <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
           <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
             <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80" alt="Chef" className="w-full h-full object-cover" />
           </div>
           <div className="space-y-6">
             <p className={`text-sm font-semibold uppercase tracking-[0.35em] ${primaryText}`}>L'Équipe</p>
             <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Rencontrez notre Chef.</h2>
             <p className="text-lg text-slate-600">Passé par les plus grandes cuisines étoilées de la capitale, notre Chef a décidé de revenir à l'essentiel : une cuisine de bistrot, généreuse et sans artifices.</p>
             <div className="pt-4 flex items-center gap-4">
               <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=200&q=80" alt="Plat" className="w-20 h-20 rounded-full object-cover shadow-md" />
               <p className="text-sm text-slate-500 font-medium italic">Le plat signature : Daurade rôtie et ses légumes</p>
             </div>
           </div>
         </div>
       </section>

       {/* Footer CTA */}
       <section className="py-24 bg-slate-900 text-center px-4" id="reservation">
         <div className="max-w-4xl mx-auto space-y-8">
           <p className="text-sm uppercase tracking-[0.4em] text-slate-400">L'expérience vous tente ?</p>
           <h2 className="text-3xl font-semibold text-white sm:text-4xl">Réservez votre table</h2>
           <button className={`${primaryBg} text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:opacity-90 transition-opacity mt-8`}>
             Réserver en ligne
           </button>
         </div>
       </section>
    </div>
  )
}
