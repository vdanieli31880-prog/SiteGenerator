
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
    </div>
  )
}
