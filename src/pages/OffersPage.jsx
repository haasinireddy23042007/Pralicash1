import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Card } from '../components/ui';
import { formatINR } from '../utils';
import { Handshake, Volume2, Leaf, Lightbulb } from 'lucide-react';

export default function OffersPage() {
  const { db, currentUser, tt, speak, lang } = useApp();
  const myListingIds = db.listings.filter(l => l.farmer_user_id === currentUser.id).map(l => l.id);
  const myClusters = db.clusters.filter(c => c.member_listing_ids.some(id => myListingIds.includes(id)));
  const myMatches = db.matches.filter(m => myClusters.map(c => c.id).includes(m.cluster_id));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
        <Handshake size={28} className="text-blue-500" /> {tt("myOffers")}
      </h1>
      
      {myMatches.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 dark:border-zinc-800">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <Handshake size={40} className="text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-gray-500 dark:text-zinc-400 font-medium">{tt("noMatches")}</p>
        </Card>
      ) : myMatches.map(m => {
        const demand = db.demands.find(d => d.id === m.demand_id);
        const cluster = db.clusters.find(c => c.id === m.cluster_id);
        const impact = { 
          co2: (cluster?.total_tonnes * 1.53).toFixed(1), 
          pm25: (cluster?.total_tonnes * 3.2).toFixed(1), 
          earnings: cluster?.total_tonnes * m.offered_price 
        };
        
        return (
          <Card key={m.id}>
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-lg text-gray-900 dark:text-zinc-100">{cluster?.cluster_name}</div>
                    <button 
                      onClick={() => speak(`${cluster?.cluster_name}. Offer from ${demand?.company_name}. Price ${formatINR(m.offered_price)} per tonne. Pickup date ${m.pickup_date}`, lang)} 
                      className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                      title="Read Aloud"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-zinc-400 mt-1">
                    {demand?.company_name} <span className="mx-1">·</span> {demand?.location_text}
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3 border border-emerald-100 dark:border-emerald-500/20">
                  <div className="font-black text-emerald-700 dark:text-emerald-400 text-lg">{formatINR(m.offered_price)}</div>
                  <div className="text-xs text-emerald-600/70 dark:text-emerald-500/70 font-semibold uppercase tracking-wider mt-0.5">per tonne</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3 border border-blue-100 dark:border-blue-500/20">
                  <div className="font-black text-blue-700 dark:text-blue-400 text-lg">{m.distance_km}km</div>
                  <div className="text-xs text-blue-600/70 dark:text-blue-500/70 font-semibold uppercase tracking-wider mt-0.5">distance</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-500/10 rounded-xl p-3 border border-purple-100 dark:border-purple-500/20">
                  <div className="font-black text-purple-700 dark:text-purple-400 text-lg">{m.pickup_date}</div>
                  <div className="text-xs text-purple-600/70 dark:text-purple-500/70 font-semibold uppercase tracking-wider mt-0.5">pickup date</div>
                </div>
              </div>
              
              <div className="bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800 rounded-xl p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-2 flex items-center gap-1.5">
                  <Leaf size={14} /> {tt("envImpact")} (est.)
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-zinc-400">
                  <span>CO₂ avoided: <b className="text-gray-900 dark:text-zinc-200">{impact.co2}t</b></span>
                  <span>PM2.5: <b className="text-gray-900 dark:text-zinc-200">{impact.pm25}kg</b></span>
                  <span>Earnings: <b className="text-gray-900 dark:text-zinc-200">{formatINR(impact.earnings)}</b></span>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <Lightbulb size={16} /> {tt("matchReason")}
                </div>
                {m.match_reason}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

