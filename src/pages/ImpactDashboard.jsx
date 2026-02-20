import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Card } from '../components/ui';
import { formatINR } from '../utils';
import StatCard from '../components/StatCard';
import { Leaf, Sprout, Cloud, Wind, Factory, Users, IndianRupee, BarChart2 } from 'lucide-react';

export default function ImpactDashboard() {
  const { db, tt } = useApp();
  const completedMatches = db.matches.filter(m => m.status === "ACCEPTED" || m.status === "COMPLETED");
  const totalTonnes = completedMatches.reduce((a, m) => { const c = db.clusters.find(cl => cl.id === m.cluster_id); return a + (c?.total_tonnes || 0); }, 0);
  const totalCO2 = (totalTonnes * 1.53).toFixed(1);
  const totalPM25 = (totalTonnes * 3.2).toFixed(1);
  const totalCoal = (totalTonnes * 0.45).toFixed(1);
  const totalEarnings = completedMatches.reduce((a, m) => { const c = db.clusters.find(cl => cl.id === m.cluster_id); return a + (c?.total_tonnes || 0) * m.offered_price; }, 0);
  const farmersHelped = new Set(db.listings.filter(l => l.status === "CLUSTERED" || l.status === "PICKED_UP").map(l => l.farmer_user_id)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
          <Leaf size={28} className="text-emerald-500" /> {tt("impactDashboard")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{tt("disclaimer")}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Sprout} label={tt("totalSaved")} value={`${totalTonnes}t`} color="emerald" sub="stubble diverted from burning" />
        <StatCard icon={Cloud} label={`${tt("co2Avoided")} (est.)`} value={`${totalCO2}t`} color="blue" sub="CO₂ equivalent" />
        <StatCard icon={Wind} label="PM2.5 Avoided (est.)" value={`${totalPM25}kg`} color="purple" sub="fine particulate matter" />
        <StatCard icon={Factory} label="Coal Replaced (est.)" value={`${totalCoal}t`} color="amber" sub="energy equivalent" />
        <StatCard icon={Users} label={tt("farmersHelped")} value={farmersHelped} color="emerald" sub="farmers in active clusters" />
        <StatCard icon={IndianRupee} label={tt("earnings")} value={formatINR(totalEarnings)} color="amber" sub="total farmer earnings" />
      </div>

      <Card>
        <div className="p-6">
          <h2 className="font-semibold text-gray-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
            <BarChart2 size={18} className="text-emerald-600 dark:text-emerald-500" /> Match Impact Breakdown
          </h2>
          <div className="space-y-4">
            {completedMatches.map(m => {
              const cluster = db.clusters.find(c => c.id === m.cluster_id);
              const demand = db.demands.find(d => d.id === m.demand_id);
              const tonnes = cluster?.total_tonnes || 0;
              return (
                <div key={m.id} className="border border-gray-100 dark:border-zinc-800/60 rounded-xl p-4 transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-medium text-gray-800 dark:text-zinc-200">
                      {cluster?.cluster_name} <span className="text-gray-400 mx-1">→</span> {demand?.company_name}
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center text-sm">
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3">
                      <div className="font-black text-emerald-700 dark:text-emerald-400">{tonnes}t</div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-medium">Saved</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3">
                      <div className="font-black text-blue-700 dark:text-blue-400">{(tonnes * 1.53).toFixed(1)}t</div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-medium">CO₂</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-500/10 rounded-xl p-3">
                      <div className="font-black text-purple-700 dark:text-purple-400">{(tonnes * 3.2).toFixed(0)}kg</div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-medium">PM2.5</div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3">
                      <div className="font-black text-amber-700 dark:text-amber-400">{formatINR(tonnes * m.offered_price)}</div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-medium">Earned</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {completedMatches.length === 0 && (
              <p className="text-center text-gray-400 dark:text-zinc-500 py-8 bg-gray-50/50 dark:bg-zinc-800/20 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
                Accept matches to see detailed impact breakdown here.
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-6">
        <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">
          <BarChart2 size={18} /> Estimation Methodology
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-emerald-700 dark:text-emerald-300/80 font-medium">
          <p>• <strong className="text-emerald-900 dark:text-emerald-200">CO₂e:</strong> 1.53 tCO₂ per tonne burned (IPCC)</p>
          <p>• <strong className="text-emerald-900 dark:text-emerald-200">PM2.5:</strong> 3.2 kg per tonne burned (CPCB)</p>
          <p>• <strong className="text-emerald-900 dark:text-emerald-200">Coal equiv:</strong> 0.45 tonne coal per tonne stubble</p>
          <p>• <strong className="text-emerald-900 dark:text-emerald-200">Yield:</strong> 2.5 tonnes stubble per acre (ICAR)</p>
        </div>
        <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70 mt-4 italic font-medium">
          Note: All figures are broad estimates for informational purposes only and may vary by specific yield and composition.
        </p>
      </div>
    </div>
  );
}
