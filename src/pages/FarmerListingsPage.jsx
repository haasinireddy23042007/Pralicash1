import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Card, Btn } from '../components/ui';
import { Sprout, Volume2, Package, CheckSquare, Square } from 'lucide-react';

export default function FarmerListingsPage({ setPage }) {
  const { db, setDb, currentUser, tt, speak, lang } = useApp();
  const myListings = db.listings.filter(l => l.farmer_user_id === currentUser.id);

  const cancelListing = (id) => {
    setDb(prev => ({ ...prev, listings: prev.listings.map(l => l.id === id ? { ...l, status: "CANCELLED" } : l) }));
  };

  const setPaymentStatus = (id, pStatus) => {
    setDb(prev => ({ ...prev, listings: prev.listings.map(l => l.id === id ? { ...l, payment_status: pStatus } : l) }));
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
            const isFinished = l.status !== "OPEN" && l.status !== "CANCELLED";

            return (
              <Card key={l.id}>
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="font-semibold text-gray-900 dark:text-zinc-100 text-lg cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={(e) => { e.stopPropagation(); speak(l.village_name, lang); }}
                          title={tt("readAloud")}
                        >
                          {l.village_name}
                        </span>
                        <StatusBadge status={l.status} />
                      </div>
                      <div className="text-sm text-gray-500 dark:text-zinc-400">
                        <span
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-gray-800 dark:text-zinc-200"
                          onClick={(e) => { e.stopPropagation(); speak(`${l.acres} ${tt("acres")}`, lang); }}
                          title={tt("readAloud")}
                        >
                          {l.acres} acres
                        </span>
                        {' '}·{' '}
                        <span
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold text-gray-900 dark:text-zinc-200"
                          onClick={(e) => { e.stopPropagation(); speak(`${l.estimated_tonnes} ${tt("tonnes")}`, lang); }}
                          title={tt("readAloud")}
                        >
                          {l.estimated_tonnes}t
                        </span>
                        {' '}estimated · {l.harvest_start} → {l.harvest_end}
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

                  {isFinished && (
                    <div className="pt-3 mt-1 border-t border-gray-100 dark:border-zinc-800">
                      <div className="font-semibold text-sm text-gray-700 dark:text-zinc-300 mb-2">{tt("paymentVerification")}</div>
                      <div className="flex flex-col gap-2">
                        <div
                          onClick={(e) => { e.stopPropagation(); setPaymentStatus(l.id, l.payment_status === "RECEIVED" ? null : "RECEIVED"); }}
                          className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all border ${l.payment_status === "RECEIVED"
                            ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30"
                            : "bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 hover:border-green-200"
                            }`}
                        >
                          {l.payment_status === "RECEIVED"
                            ? <CheckSquare size={18} className="text-green-600 dark:text-green-500" />
                            : <Square size={18} className="text-gray-400 dark:text-zinc-600" />
                          }
                          <span
                            className={`text-sm font-medium transition-colors ${l.payment_status === "RECEIVED" ? "text-green-800 dark:text-green-300" : "text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400"}`}
                            onClick={(e) => { e.stopPropagation(); speak(tt("receivedMoney"), lang); }}
                          >
                            {tt("receivedMoney")}
                          </span>
                        </div>

                        <div
                          onClick={(e) => { e.stopPropagation(); setPaymentStatus(l.id, l.payment_status === "UNPAID_TAKEN" ? null : "UNPAID_TAKEN"); }}
                          className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all border ${l.payment_status === "UNPAID_TAKEN"
                            ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30"
                            : "bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 hover:border-red-200"
                            }`}
                        >
                          {l.payment_status === "UNPAID_TAKEN"
                            ? <CheckSquare size={18} className="text-red-500" />
                            : <Square size={18} className="text-gray-400 dark:text-zinc-600" />
                          }
                          <span
                            className={`text-sm font-medium transition-colors ${l.payment_status === "UNPAID_TAKEN" ? "text-red-800 dark:text-red-300" : "text-gray-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400"}`}
                            onClick={(e) => { e.stopPropagation(); speak(tt("unpaidTaken"), lang); }}
                          >
                            {tt("unpaidTaken")}
                          </span>
                        </div>
                      </div>
                    </div>
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

