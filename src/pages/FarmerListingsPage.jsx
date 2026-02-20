import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Card, Btn } from '../components/ui';
import { Sprout, Volume2, Package } from 'lucide-react';

export default function FarmerListingsPage({ setPage }) {
  const { db, setDb, currentUser, tt, speak, lang } = useApp();
  const myListings = db.listings.filter(l => l.farmer_user_id === currentUser.id);

  const cancelListing = (id) => {
    setDb(prev => ({ ...prev, listings: prev.listings.map(l => l.id === id ? { ...l, status: "CANCELLED" } : l) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{tt("myListings")}</h1>
        <Btn onClick={() => setPage("createListing")}>+ {tt("createListing")}</Btn>
      </div>
      
      {myListings.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 dark:border-zinc-800">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
            <Sprout size={40} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="text-gray-500 dark:text-zinc-400 font-medium mb-1">{tt("noListings")}</p>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mb-6">List your stubble to connect with buyers.</p>
          <Btn onClick={() => setPage("createListing")}>{tt("createListing")}</Btn>
        </Card>
      ) : (
        <div className="space-y-3">
          {myListings.map(l => {
            const cluster = l.cluster_id ? db.clusters.find(c => c.id === l.cluster_id) : null;
            return (
              <Card key={l.id}>
                <div className="p-5 flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-zinc-100 text-lg">{l.village_name}</span>
                      <StatusBadge status={l.status} />
                      <button 
                        onClick={() => speak(`${l.village_name}. ${l.acres} acres. ${l.estimated_tonnes} tonnes. ${l.status}`, lang)} 
                        className="text-blue-500 dark:text-blue-400 p-1 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Read Aloud"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-zinc-400">
                      {l.acres} acres · <b className="text-gray-900 dark:text-zinc-200">{l.estimated_tonnes}t</b> estimated · {l.harvest_start} → {l.harvest_end}
                    </div>
                    {cluster && (
                      <div className="text-xs text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-1.5">
                        <Package size={14} /> Part of {cluster.cluster_name} ({cluster.total_tonnes}t total)
                      </div>
                    )}
                  </div>
                  {l.status === "OPEN" && (
                    <Btn size="sm" color="ghost" onClick={() => cancelListing(l.id)}>{tt("cancel")}</Btn>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

