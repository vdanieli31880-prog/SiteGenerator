"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteSiteButton({ siteId, siteName }: { siteId: string, siteName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement le site "${siteName}" ? Cette action est irréversible.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        console.error("Erreur suppression");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      title="Supprimer ce site"
      className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}
