"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditorClient({ site }: { site: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState(site.config || {});
  
  // Fonction pour rafraîchir l'iframe (on lui rajoute un timestamp pour forcer le rechargement)
  const [previewKey, setPreviewKey] = useState(Date.now());

  const handleConfigChange = (section: string, field: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/sites/${site.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });

      if (res.ok) {
        // Force refresh de l'iframe après sauvegarde
        setPreviewKey(Date.now());
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
    setIsSaving(false);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar Configuration */}
      <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto shrink-0 flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Configuration</h2>
          <button 
            onClick={saveChanges}
            disabled={isSaving}
            className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Sauvegarde..." : "Appliquer"}
          </button>
        </div>
        
        <div className="p-5 flex-1">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Couleur Principale</label>
              <div className="flex gap-2">
                {[
                  { name: 'orange', class: 'bg-orange-500' },
                  { name: 'indigo', class: 'bg-indigo-500' },
                  { name: 'emerald', class: 'bg-emerald-500' },
                  { name: 'rose', class: 'bg-rose-500' }
                ].map(color => (
                  <button 
                    key={color.name} 
                    onClick={() => handleConfigChange('theme', 'primaryColor', color.name)}
                    className={`w-8 h-8 rounded-full border-2 border-white shadow-sm ring-2 transition-all ${config?.theme?.primaryColor === color.name ? 'ring-slate-400 scale-110 ' + color.class : 'ring-transparent opacity-70 hover:opacity-100 ' + color.class}`} 
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-medium text-slate-900 mb-4">En-tête (Hero)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Badge / Slogan</label>
                  <input 
                    type="text" 
                    value={config?.hero?.badge || ""}
                    onChange={(e) => handleConfigChange('hero', 'badge', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Titre principal</label>
                  <textarea 
                    value={config?.hero?.title || ""}
                    onChange={(e) => handleConfigChange('hero', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-20 resize-none text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Description courte</label>
                  <textarea 
                    value={config?.hero?.description || ""}
                    onChange={(e) => handleConfigChange('hero', 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-24 resize-none text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Bouton Primaire</label>
                  <input 
                    type="text" 
                    value={config?.hero?.ctaPrimary || ""}
                    onChange={(e) => handleConfigChange('hero', 'ctaPrimary', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Iframe Preview Area */}
      <main className="flex-1 bg-slate-100 p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-[1200px] bg-white rounded-2xl shadow-xl border border-slate-200 h-full flex flex-col overflow-hidden relative">
          <div className="h-10 border-b border-slate-100 bg-slate-50 flex items-center px-4 gap-2 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            </div>
            <a href={`/preview/${site.id}`} target="_blank" rel="noopener noreferrer" className="ml-4 px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-mono flex-1 max-w-sm truncate transition-colors flex items-center justify-between group">
              <span>{site.subdomain ? `${site.subdomain}.sitegenerator.app` : `https://sitegenerator.../preview/${site.id.slice(0,8)}...`}</span>
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
          <div className="flex-1 bg-white relative h-full">
            <iframe 
              key={previewKey}
              src={`/preview/${site.id}`} 
              className="absolute inset-0 w-full h-full border-0"
              title="Aperçu du site"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
