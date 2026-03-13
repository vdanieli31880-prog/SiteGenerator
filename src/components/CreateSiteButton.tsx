"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateSiteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/editor/${data.siteId}`);
      } else {
        console.error("Erreur création:", await res.text());
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm shadow-indigo-500/30 transition-all flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Créer un nouveau site
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Nom de votre site</h3>
              <button 
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 p-1"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="siteName" className="block text-sm font-medium text-slate-700 mb-2">
                  Comment s'appelle votre établissement ?
                </label>
                <input
                  id="siteName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Le Petit Bouchon"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900"
                  autoFocus
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || isLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Création...
                    </>
                  ) : "Créer et Éditer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
