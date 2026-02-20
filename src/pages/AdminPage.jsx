import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, Card, Btn } from '../components/ui';
import { Settings, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  const { db, setDb, tt } = useApp();
  const [config, setConfig] = useState({ ...db.config });
  const [activeTab, setActiveTab] = useState("config");

  const saveConfig = () => {
    setDb(prev => ({ ...prev, config: { ...config } }));
    alert("Configuration saved!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
        <Settings size={28} className="text-emerald-600 dark:text-emerald-500" /> {tt("adminPanel")}
      </h1>
      
      <div className="flex flex-wrap gap-2">
        {["config", "listings", "clusters", "audit"].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab 
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" 
                : "bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-700/50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "config" && (
        <Card>
          <div className="p-6">
            <h2 className="font-semibold text-gray-800 dark:text-zinc-200 mb-5">{tt("configConstants")}</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { key: "tonnes_per_acre", label: tt("tonnesPerAcre"), step: "0.1" },
                { key: "min_cluster_tonnes", label: tt("minClusterTonnes"), step: "5" },
                { key: "distance_threshold_km", label: tt("distanceThreshold"), step: "1" },
                { key: "price_weight", label: "Price Weight (0-1)", step: "0.1" },
                { key: "distance_weight", label: "Distance Weight (0-1)", step: "0.1" },
                { key: "transport_cost_per_km_tonne", label: "Transport Cost ₹/km/t", step: "0.5" },
              ].map(({ key, label, step }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">{label}</label>
                  <input 
                    type="number" 
                    step={step} 
                    value={config[key]}
                    onChange={e => setConfig({ ...config, [key]: +e.target.value })}
                    className="w-full border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-100 transition-colors" 
                  />
                </div>
              ))}
            </div>
            <div className="mt-6"><Btn onClick={saveConfig}>{tt("saveConfig")}</Btn></div>
          </div>
        </Card>
      )}

      {activeTab === "listings" && (
        <Card>
          <div className="p-5 border-b border-gray-50 dark:border-zinc-800 font-semibold text-gray-800 dark:text-zinc-200">
            All Listings ({db.listings.length})
          </div>
          <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {db.listings.map(l => (
              <div key={l.id} className="px-5 py-4 flex flex-wrap gap-2 items-center justify-between text-sm hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-zinc-200">{l.village_name}</span>
                  <div className="text-gray-500 dark:text-zinc-400 mt-0.5 text-xs">
                    Farmer #{l.farmer_user_id} · {l.acres} acres · <span className="font-medium text-emerald-600 dark:text-emerald-400">{l.estimated_tonnes}t</span>
                  </div>
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "clusters" && (
        <Card>
          <div className="p-5 border-b border-gray-50 dark:border-zinc-800 font-semibold text-gray-800 dark:text-zinc-200">
            All Clusters ({db.clusters.length})
          </div>
          <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {db.clusters.map(c => (
              <div key={c.id} className="px-5 py-4 flex flex-wrap gap-2 items-center justify-between text-sm hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-zinc-200">{c.cluster_name}</span>
                  <div className="text-gray-500 dark:text-zinc-400 mt-0.5 text-xs">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{c.total_tonnes}t</span> · {c.member_listing_ids.length} members
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "audit" && (
        <Card>
          <div className="p-5 border-b border-gray-50 dark:border-zinc-800 font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" /> {tt("auditLog")} ({db.auditLogs.length})
          </div>
          <div className="divide-y divide-gray-50 dark:divide-zinc-800/50 max-h-96 overflow-y-auto custom-scrollbar">
            {db.auditLogs.slice().reverse().map(log => (
              <div key={log.id} className="px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex items-start gap-4">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold shrink-0 ${
                  log.event === "LOGIN_SUCCESS" ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : 
                  log.event === "OTP_SENT" ? "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" : 
                  "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                }`}>
                  {log.event}
                </span>
                <span className="text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">{log.detail}</span>
                <span className="text-gray-400 dark:text-zinc-500 ml-auto shrink-0 text-xs whitespace-nowrap pt-0.5">{log.ts}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
