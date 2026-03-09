import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Card, Btn } from '../components/ui';
import { formatINR, haversine } from '../utils';
import StatCard from '../components/StatCard';
import { PackageSearch, Link2, Wheat, CheckCircle, Settings, Zap, Target, BarChart, AlertTriangle } from 'lucide-react';

export default function BuyerDashboard({ setPage }) {
  const { db, setDb, currentUser, tt } = useApp();
  const demands = db?.demands || [];
  const matches = db?.matches || [];
  const clusters = db?.clusters || [];
  const listings = db?.listings || [];

  const myDemands = demands.filter(d => d.buyer_user_id === currentUser.id);
  const myMatches = matches.filter(m => myDemands.map(d => d.id).includes(m.demand_id));
  const totalRequired = myDemands.reduce((a, d) => a + d.required_tonnes, 0);

  // Find unpaid listings from accepted matches
  const unpaidListings = [];
  myMatches.forEach(match => {
    // We only care if stubble is taken (ACCEPTED) but money isn't paid
    if (match.status === "ACCEPTED" && match.payment_status !== "PAID") {
      const cluster = clusters.find(c => c.id === match.cluster_id);
      if (cluster) {
        cluster.member_listing_ids.forEach(lid => {
          const listing = listings.find(l => l.id === lid);
          if (listing && listing.payment_status !== "PAID") {
            const farmerProfile = db?.farmerProfiles?.find(fp => fp.user_id === listing.farmer_user_id);
            unpaidListings.push({
              matchId: match.id,
              listingId: listing.id,
              farmerName: farmerProfile ? farmerProfile.full_name : "Farmer",
              village: listing.village_name,
              tonnes: listing.estimated_tonnes
            });
          }
        });
      }
    }
  });

  const runClustering = () => {
    const openListings = listings.filter(l => l.status === "OPEN");
    if (openListings.length < 2) return alert("Not enough open listings to cluster.");
    let visited = new Set(), newClusters = [...clusters];
    let clusterCounter = db?.nextIds?.cluster || 1;
    let newListings = [...listings];
    openListings.forEach(seed => {
      if (visited.has(seed.id)) return;
      const group = [seed];
      let groupTonnes = seed.estimated_tonnes;
      visited.add(seed.id);
      openListings.forEach(c => {
        if (visited.has(c.id)) return;
        const dist = haversine(seed.geo_lat, seed.geo_lng, c.geo_lat, c.geo_lng);
        if (dist <= db.config.distance_threshold_km) {
          group.push(c); groupTonnes += c.estimated_tonnes; visited.add(c.id);
        }
      });
      if (groupTonnes >= db.config.min_cluster_tonnes) {
        const centLat = group.reduce((a, l) => a + l.geo_lat, 0) / group.length;
        const centLng = group.reduce((a, l) => a + l.geo_lng, 0) / group.length;
        const cluster = { id: clusterCounter, cluster_name: `CLUSTER-PB-${String(clusterCounter).padStart(3, "0")}`, total_tonnes: groupTonnes, centroid_lat: centLat, centroid_lng: centLng, member_listing_ids: group.map(l => l.id), status: "READY" };
        newClusters.push(cluster);
        newListings = newListings.map(l => group.find(g => g.id === l.id) ? { ...l, status: "CLUSTERED", cluster_id: clusterCounter } : l);
        clusterCounter++;
      }
    });
    setDb(prev => ({ ...prev, clusters: newClusters, listings: newListings, nextIds: { ...prev.nextIds, cluster: clusterCounter } }));
    alert(`Clustering complete! ${clusterCounter - db.nextIds.cluster} new cluster(s) formed.`);
  };

  const runMatching = () => {
    const readyClusters = clusters.filter(c => c.status === "READY");
    const openDemands = demands.filter(d => d.status === "OPEN");
    if (!readyClusters.length || !openDemands.length) return alert("Need READY clusters and OPEN demands.");
    let newMatches = [...matches], newDemands = [...demands], newClusters = [...clusters], newNotifications = [...(db?.notifications || [])];
    let matchCounter = db?.nextIds?.match || 1, notifCounter = db?.nextIds?.notification || 1;
    const prices = openDemands.map(d => d.price_per_tonne);
    const minP = Math.min(...prices), maxP = Math.max(...prices);
    const usedC = new Set(), usedD = new Set();
    const pairs = [];
    readyClusters.forEach(cluster => openDemands.forEach(demand => {
      const dist = haversine(cluster.centroid_lat, cluster.centroid_lng, demand.geo_lat, demand.geo_lng);
      const normP = maxP === minP ? 1 : (demand.price_per_tonne - minP) / (maxP - minP);
      const normD = dist / 200;
      const score = db.config.price_weight * normP - db.config.distance_weight * normD;
      pairs.push({ cluster, demand, dist, score });
    }));
    pairs.sort((a, b) => b.score - a.score);
    pairs.forEach(({ cluster, demand, dist, score }) => {
      if (usedC.has(cluster.id) || usedD.has(demand.id)) return;
      const transportCost = dist * cluster.total_tonnes * db.config.transport_cost_per_km_tonne;
      const match = { id: matchCounter, cluster_id: cluster.id, demand_id: demand.id, distance_km: +dist.toFixed(1), offered_price: demand.price_per_tonne, transport_cost: +transportCost.toFixed(0), net_score: +score.toFixed(3), pickup_date: demand.earliest_pickup, status: "PROPOSED", match_reason: `Best score ${score.toFixed(3)}: price ${formatINR(demand.price_per_tonne)}/t, distance ${dist.toFixed(1)}km, transport ${formatINR(transportCost)}` };
      newMatches.push(match);
      newClusters = newClusters.map(c => c.id === cluster.id ? { ...c, status: "MATCHED" } : c);
      newDemands = newDemands.map(d => d.id === demand.id ? { ...d, status: "MATCHED" } : d);
      newNotifications.push({ id: notifCounter++, user_id: demand.buyer_user_id, msg: `Match proposed: ${cluster.cluster_name} → ${demand.company_name}`, read: false, ts: new Date().toLocaleString() });
      usedC.add(cluster.id); usedD.add(demand.id); matchCounter++;
    });
    setDb(prev => ({ ...prev, matches: newMatches, demands: newDemands, clusters: newClusters, notifications: newNotifications, nextIds: { ...prev.nextIds, match: matchCounter, notification: notifCounter } }));
    alert(`Matching complete! ${matchCounter - db.nextIds.match} new match(es) created.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{tt("welcomeBuyer")}</h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">{currentUser.company_name}</p>
        </div>
        <Btn onClick={() => setPage("createDemand")}>+ {tt("createDemand")}</Btn>
      </div>

      {unpaidListings.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50">
          <h3 className="text-red-800 dark:text-red-400 font-bold mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> Payment Pending Alerts
          </h3>
          <div className="space-y-2">
            {unpaidListings.map((ul, idx) => (
              <div key={idx} className="bg-white dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30 text-sm flex items-center justify-between">
                <div>
                  Stubble collected from <span className="font-bold">{ul.farmerName}</span> in <span className="font-bold">{ul.village}</span> ({ul.tonnes} tonnes).
                </div>
                <span className="text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                  Unpaid
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={PackageSearch} label={tt("myDemands")} value={myDemands.length} color="blue" />
        <StatCard icon={Link2} label={tt("matches")} value={myMatches.length} color="amber" />
        <StatCard icon={Wheat} label={tt("requiredTonnes")} value={`${totalRequired}t`} color="emerald" />
        <StatCard icon={CheckCircle} label="Accepted" value={myMatches.filter(m => m.status === "ACCEPTED").length} color="purple" />
      </div>

      {currentUser.role === "ADMIN" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="font-semibold text-gray-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <Settings size={18} className="text-gray-500 dark:text-zinc-400" /> Engine Controls
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">Group nearby farmer listings into supply clusters</p>
                <button onClick={runClustering} className="w-full py-2.5 px-4 rounded-xl border-2 border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 font-semibold transition-colors flex justify-center items-center gap-2">
                  <Zap size={16} /> {tt("runClustering")}
                </button>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">Match READY clusters to OPEN buyer demands</p>
                <button onClick={runMatching} className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center transition-colors gap-2">
                  <Target size={16} /> {tt("runMatching")}
                </button>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-gray-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <BarChart size={18} className="text-gray-500 dark:text-zinc-400" /> Cluster Overview
            </h3>
            <div className="space-y-2">
              {clusters.map(c => (
                <div key={c.id} className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-700 dark:text-zinc-300 font-medium">{c.cluster_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-zinc-400">{c.total_tonnes}t</span>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
              {clusters.length === 0 && <p className="text-gray-400 dark:text-zinc-500 text-sm mt-4">No clusters yet. Run clustering!</p>}
            </div>
          </Card>
        </div>
      )}

      <Card>
        <div className="p-5 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 dark:text-zinc-200">{tt("myDemands")}</h2>
          <Btn size="sm" color="ghost" onClick={() => setPage("buyerDemands")}>View All</Btn>
        </div>
        {myDemands.length === 0 ? <p className="p-6 text-center text-gray-400 dark:text-zinc-500 text-sm">{tt("noDemands")}</p> : (
          <div className="divide-y divide-gray-50 dark:divide-zinc-800">
            {myDemands.map(d => (
              <div key={d.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div>
                  <div className="font-medium text-gray-800 dark:text-zinc-200">{d.location_text}</div>
                  <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{d.required_tonnes}t needed · <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatINR(d.price_per_tonne)}/t</span> · pickup {d.earliest_pickup}</div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
