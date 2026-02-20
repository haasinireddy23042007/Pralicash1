import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Card, Btn } from '../components/ui';
import { formatINR } from '../utils';
import { PackageSearch } from 'lucide-react';

export default function BuyerDemandsPage({ setPage }) {
  const { db, setDb, currentUser, tt } = useApp();
  const myDemands = db.demands.filter(d => d.buyer_user_id === currentUser.id);

  const cancelDemand = (id) => {
    setDb(prev => ({ ...prev, demands: prev.demands.map(d => d.id === id ? { ...d, status: "CANCELLED" } : d) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{tt("myDemands")}</h1>
        <Btn onClick={() => setPage("createDemand")}>+ {tt("createDemand")}</Btn>
      </div>
      
      {myDemands.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 dark:border-zinc-800">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <PackageSearch size={40} className="text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-gray-500 dark:text-zinc-400 font-medium mb-1">{tt("noDemands")}</p>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mb-6">Create a demand to let farmers know what you need.</p>
          <Btn onClick={() => setPage("createDemand")}>{tt("createDemand")}</Btn>
        </Card>
      ) : (
        <div className="space-y-3">
          {myDemands.map(d => (
            <Card key={d.id}>
              <div className="p-5 flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-zinc-100 text-lg">{d.location_text}</span>
                    <StatusBadge status={d.status} />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-zinc-400">
                    <b className="text-gray-900 dark:text-zinc-200">{d.required_tonnes}t</b> needed · <span className="text-emerald-600 dark:text-emerald-400 font-medium">{formatINR(d.price_per_tonne)}/t</span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-zinc-500">Pickup: {d.earliest_pickup} → {d.latest_pickup}</div>
                </div>
                {d.status === "OPEN" && <Btn size="sm" color="ghost" onClick={() => cancelDemand(d.id)}>{tt("cancel")}</Btn>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
