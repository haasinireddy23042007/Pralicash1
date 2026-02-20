import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Card, Btn } from '../components/ui';
import { formatINR } from '../utils';
import { Link2 } from 'lucide-react';

export default function MatchesPage() {
  const { db, setDb, currentUser, tt } = useApp();
  const myDemandIds = db.demands.filter(d => d.buyer_user_id === currentUser.id).map(d => d.id);
  const myMatches = db.matches.filter(m => myDemandIds.includes(m.demand_id));

  const handleAction = (matchId, action) => {
    setDb(prev => ({
      ...prev,
      matches: prev.matches.map(m => m.id === matchId ? { ...m, status: action === "accept" ? "ACCEPTED" : "REJECTED" } : m),
      clusters: prev.clusters.map(c => {
        const match = prev.matches.find(m => m.id === matchId);
        if (match && c.id === match.cluster_id) return { ...c, status: action === "accept" ? "IN_TRANSIT" : "READY" };
        return c;
      })
    }));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
        <Link2 size={28} className="text-blue-500" /> {tt("matches")}
      </h1>
      
      {myMatches.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 dark:border-zinc-800">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <Link2 size={40} className="text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-gray-500 dark:text-zinc-400 font-medium">{tt("noMatches")}</p>
        </Card>
      ) : myMatches.map(m => {
        const cluster = db.clusters.find(c => c.id === m.cluster_id);
        const demand = db.demands.find(d => d.id === m.demand_id);
        const members = cluster?.member_listing_ids.map(id => db.listings.find(l => l.id === id)).filter(Boolean) || [];
        
        return (
          <Card key={m.id}>
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-lg text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                    {cluster?.cluster_name} <span className="text-gray-400 font-normal">→</span> {demand?.location_text}
                  </div>
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                    Score: {m.net_score} <span className="text-gray-300 dark:text-zinc-600 mx-1">|</span> {m.pickup_date}
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>

              <div className="grid grid-cols-4 gap-3 text-center text-sm">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3 border border-emerald-100 dark:border-emerald-500/20">
                  <div className="font-black text-emerald-700 dark:text-emerald-400 text-lg">{cluster?.total_tonnes}t</div>
                  <div className="text-xs text-emerald-600/70 dark:text-emerald-500/70 font-semibold uppercase tracking-wider mt-0.5">Total</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3 border border-blue-100 dark:border-blue-500/20">
                  <div className="font-black text-blue-700 dark:text-blue-400 text-lg">{m.distance_km}km</div>
                  <div className="text-xs text-blue-600/70 dark:text-blue-500/70 font-semibold uppercase tracking-wider mt-0.5">Distance</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-500/10 rounded-xl p-3 border border-purple-100 dark:border-purple-500/20">
                  <div className="font-black text-purple-700 dark:text-purple-400 text-lg">{formatINR(m.offered_price)}</div>
                  <div className="text-xs text-purple-600/70 dark:text-purple-500/70 font-semibold uppercase tracking-wider mt-0.5">Per Tonne</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3 border border-amber-100 dark:border-amber-500/20">
                  <div className="font-black text-amber-700 dark:text-amber-400 text-lg">{formatINR(m.transport_cost)}</div>
                  <div className="text-xs text-amber-600/70 dark:text-amber-500/70 font-semibold uppercase tracking-wider mt-0.5">Transport</div>
                </div>
              </div>

              <div className="bg-gray-50/50 dark:bg-zinc-800/30 rounded-xl p-4 border border-gray-100 dark:border-zinc-800">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-3">Cluster Members</div>
                <div className="flex flex-wrap gap-2">
                  {members.map(l => (
                    <span key={l.id} className="text-sm font-medium bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg shadow-sm">
                      {l.village_name} <span className="text-gray-400 dark:text-zinc-500 ml-1">({l.estimated_tonnes}t)</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl p-3 text-sm font-medium text-amber-800 dark:text-amber-400 text-center">
                ✨ {m.match_reason}
              </div>

              {m.status === "PROPOSED" && (
                <div className="flex gap-3 pt-2">
                  <Btn onClick={() => handleAction(m.id, "accept")} fullWidth className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20">{tt("accept")}</Btn>
                  <Btn onClick={() => handleAction(m.id, "reject")} fullWidth className="bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20">{tt("reject")}</Btn>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
