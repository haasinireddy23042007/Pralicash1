import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Card, Btn } from '../components/ui';
import { formatINR } from '../utils';
import StatCard from '../components/StatCard';
import { Volume2, ClipboardList, Link2, Wheat, IndianRupee, Store, CheckSquare, Square } from 'lucide-react';
import AiAssistant from '../components/AiAssistant';

export default function FarmerDashboard({ setPage }) {
  const { db, setDb, currentUser, tt, speak, lang, speaking } = useApp();
  const listings = db?.listings || [];
  const clusters = db?.clusters || [];
  const demands = db?.demands || [];
  const matches = db?.matches || [];

  const setPaymentStatus = (id, pStatus) => {
    setDb(prev => ({ ...prev, listings: prev.listings.map(l => l.id === id ? { ...l, payment_status: pStatus } : l) }));
  };

  const myListings = currentUser ? listings.filter(l => l.farmer_user_id === currentUser.id) : [];
  const myListingIds = myListings.map(l => l.id);
  // Backend clusters don’t include member_listing_ids; derive membership via listing.cluster_id
  const myClusters = clusters.filter(c => myListings.some(l => l.cluster_id === c.id));
  const myClusterIds = myClusters.map(c => c.id);
  const myMatches = matches.filter(m => myClusterIds.includes(m.cluster_id));
  const totalTonnes = myListings.reduce((a, l) => a + (l.estimated_tonnes || 0), 0);
  const earnings = myMatches.filter(m => m.status === "ACCEPTED").reduce((a, m) => {
    const cluster = clusters.find(c => c.id === m.cluster_id);
    return a + (cluster?.total_tonnes || 0) * (m.offered_price || 0);
  }, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{tt("welcomeFarmer")}</h1>
            <p className="text-gray-500 dark:text-zinc-400 text-sm mt-0.5">
              {currentUser?.farmer_name || currentUser?.username} — {db?.farmerProfiles?.find?.(f => f.user_id === currentUser?.id)?.district || ""}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => speak(`${tt("welcomeFarmer")}. ${currentUser.farmer_name}. ${tt("tonnes")}: ${totalTonnes}. ${tt("earnings")}: ${earnings}`, lang)}
              className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
              title={tt("readAloud")}
            >
              <Volume2 size={20} />
            </button>
            <Btn onClick={() => setPage("createListing")} size="md">+ {tt("createListing")}</Btn>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ClipboardList} label={tt("myListings")} value={myListings.length} color="blue" />
          <StatCard icon={Link2} label={tt("clustered")} value={myClusters.length} color="amber" />
          <StatCard icon={Wheat} label={tt("tonnes")} value={`${totalTonnes}t`} color="emerald" />
          <StatCard icon={IndianRupee} label={tt("earnings")} value={formatINR(earnings)} color="purple" sub="from accepted matches" />
        </div>

        <Card>
          <div className="p-5 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2">
                <Store size={18} className="text-emerald-600 dark:text-emerald-500" />
                {tt("availableRequirements")}
              </h2>
              <button
                onClick={() => speak(`${tt("availableRequirements")}. ${demands.filter(d => d.status === "OPEN").map(d => `${d.company_name}, ${d.required_tonnes} tonnes in ${d.location_text}`).join(". ")}`, lang)}
                className="text-blue-500 dark:text-blue-400 hover:scale-110 transition-transform"
                title={tt("readAloud")}
              >
                <Volume2 size={16} />
              </button>
            </div>
            <span className="text-xs text-gray-400 dark:text-zinc-500">Companies looking for stubble</span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-zinc-800">
            {demands.filter(d => d.status === "OPEN").map(d => (
              <div key={d.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div>
                  <div className="font-medium text-gray-800 dark:text-zinc-200">{d.company_name}</div>
                  <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    {d.location_text} · {d.required_tonnes}t needed · <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatINR(d.price_per_tonne)}/t</span>
                  </div>
                </div>
                <Btn size="sm" color="outline" onClick={() => setPage("createListing")}>I Have Stubble</Btn>
              </div>
            ))}
            {demands.filter(d => d.status === "OPEN").length === 0 && <p className="p-6 text-center text-gray-400 dark:text-zinc-500 text-sm">No open requirements found at the moment.</p>}
          </div>
        </Card>

        <Card>
          <div className="p-5 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 dark:text-zinc-200">{tt("myListings")}</h2>
            <Btn size="sm" color="ghost" onClick={() => setPage("farmerListings")}>View All</Btn>
          </div>
          {myListings.length === 0 ? <p className="p-6 text-center text-gray-400 dark:text-zinc-500 text-sm">{tt("noListings")}</p> : (
            <div className="divide-y divide-gray-50 dark:divide-zinc-800">
              {myListings.map(l => {
                const isFinished = l.status !== "OPEN" && l.status !== "CANCELLED";

                return (
                  <div key={l.id} className="p-5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div
                          className={`font-medium cursor-pointer transition-colors ${speaking ? 'text-blue-500 animate-pulse' : 'text-gray-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400'}`}
                          onClick={(e) => { e.stopPropagation(); speak(l.village_name, lang); }}
                          title={tt("readAloud")}
                        >
                          {l.village_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                          <span
                            className={`cursor-pointer transition-colors font-medium ${speaking ? 'text-blue-500 animate-pulse' : 'text-gray-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400'}`}
                            onClick={(e) => { e.stopPropagation(); speak(`${l.acres} ${tt("acres")}`, lang); }}
                            title={tt("readAloud")}
                          >
                            {l.acres} acres
                          </span>
                          {' '}·{' '}
                          <span
                            className={`cursor-pointer transition-colors font-bold ${speaking ? 'text-blue-500 animate-pulse' : 'text-gray-900 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400'}`}
                            onClick={(e) => { e.stopPropagation(); speak(`${l.estimated_tonnes} ${tt("tonnes")}`, lang); }}
                            title={tt("readAloud")}
                          >
                            {l.estimated_tonnes}t
                          </span>
                          {' '}· {l.harvest_start}
                        </div>
                      </div>
                      <StatusBadge status={l.status} />
                    </div>

                    {isFinished && (
                      <div className="pt-3 mt-3 border-t border-gray-100 dark:border-zinc-800">
                        <div className="font-semibold text-xs text-gray-700 dark:text-zinc-300 mb-2">{tt("paymentVerification")}</div>
                        <div className="flex flex-col gap-2">
                          <div
                            onClick={(e) => { e.stopPropagation(); setPaymentStatus(l.id, l.payment_status === "RECEIVED" ? null : "RECEIVED"); }}
                            className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all border ${l.payment_status === "RECEIVED"
                              ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30"
                              : "bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 hover:border-green-200"
                              }`}
                          >
                            {l.payment_status === "RECEIVED"
                              ? <CheckSquare size={16} className="text-green-600 dark:text-green-500" />
                              : <Square size={16} className="text-gray-400 dark:text-zinc-600" />
                            }
                            <span
                              className={`text-xs font-medium transition-colors ${l.payment_status === "RECEIVED" ? "text-green-800 dark:text-green-300" : "text-gray-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400"}`}
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
                              ? <CheckSquare size={16} className="text-red-500" />
                              : <Square size={16} className="text-gray-400 dark:text-zinc-600" />
                            }
                            <span
                              className={`text-xs font-medium transition-colors ${l.payment_status === "UNPAID_TAKEN" ? "text-red-800 dark:text-red-300" : "text-gray-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400"}`}
                              onClick={(e) => { e.stopPropagation(); speak(tt("unpaidTaken"), lang); }}
                            >
                              {tt("unpaidTaken")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {myMatches.length > 0 && (
          <Card>
            <div className="p-5 border-b border-gray-50 dark:border-zinc-800"><h2 className="font-semibold text-gray-800 dark:text-zinc-200">{tt("myOffers")}</h2></div>
            {myMatches.map(m => {
              const demand = demands.find(d => d.id === m.demand_id);
              const cluster = clusters.find(c => c.id === m.cluster_id);
              return (
                <div key={m.id} className="px-5 py-4 flex items-center justify-between border-b border-gray-50 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-zinc-200">{cluster?.cluster_name}</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">{demand?.company_name} · {formatINR(m.offered_price)}/t · {m.pickup_date}</div>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              );
            })}
          </Card>
        )}
      </div>

      <div className="w-full lg:w-96 lg:sticky lg:top-8 self-start">
        <AiAssistant
          speak={speak}
          dashboardData={{
            name: currentUser?.farmer_name || currentUser?.username,
            listingsCount: myListings.length,
            totalTonnes: totalTonnes,
            earnings: earnings
          }}
        />
      </div>
    </div>
  );
}
