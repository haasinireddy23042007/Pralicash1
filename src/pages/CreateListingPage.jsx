import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Btn, Input } from '../components/ui';
import { ArrowLeft } from 'lucide-react';

export default function CreateListingPage({ setPage }) {
  const { db, setDb, currentUser, tt } = useApp();
  const profile = db.farmerProfiles.find(f => f.user_id === currentUser.id);
  const [form, setForm] = useState({ village_name: profile?.village_name || "", acres: "", harvest_start: "", harvest_end: "" });
  const config = db.config;
  const estimatedTonnes = form.acres ? +(parseFloat(form.acres) * config.tonnes_per_acre).toFixed(1) : 0;

  const handleSubmit = async () => {
    if (!form.village_name || !form.acres || !form.harvest_start || !form.harvest_end) return alert("Please fill all fields");
    const payload = {
      farmer_user_id: currentUser.id, village_name: form.village_name, acres: +form.acres,
      harvest_start: form.harvest_start, harvest_end: form.harvest_end,
      estimated_tonnes: estimatedTonnes, geo_lat: (profile?.geo_lat || 30.8) + (Math.random() - 0.5) * 0.5,
      geo_lng: (profile?.geo_lng || 75.8) + (Math.random() - 0.5) * 0.5,
      status: "OPEN"
    };
    try {
      let newListing;
      try {
        const res = await fetch("/api/listings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Backend Error");
        newListing = await res.json();
      } catch (err) {
        console.warn("Using offline fallback for listing", err);
        newListing = { ...payload, id: Date.now() };
      }
      setDb(prev => ({
        ...prev, listings: [...prev.listings, newListing],
        notifications: [...prev.notifications, { id: Date.now(), user_id: currentUser.id, msg: `Listing created: ${form.village_name} (${estimatedTonnes}t)`, read: false, ts: new Date().toLocaleString() }]
      }));
      setPage("farmerListings");
    } catch (err) { console.error(err); alert("Error saving listing"); }
  };

  return (
    <div className="max-w-lg space-y-6 mx-auto">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setPage("farmerListings")} 
          className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{tt("createListing")}</h1>
      </div>
      <Card>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label={tt("villageName")} value={form.village_name} onChange={e => setForm({ ...form, village_name: e.target.value })} placeholder="Enter village name" />
            </div>
            <div className="col-span-2">
              <Input label={tt("acres")} type="number" min="0" step="0.5" value={form.acres} onChange={e => setForm({ ...form, acres: e.target.value })} placeholder="e.g. 8" />
            </div>
            <Input label={tt("harvestStart")} type="date" value={form.harvest_start} onChange={e => setForm({ ...form, harvest_start: e.target.value })} />
            <Input label={tt("harvestEnd")} type="date" value={form.harvest_end} onChange={e => setForm({ ...form, harvest_end: e.target.value })} />
          </div>
          {estimatedTonnes > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4">
              <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{tt("estimatedTonnes")}</div>
              <div className="text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-1">{estimatedTonnes} <span className="text-lg font-normal">tonnes</span></div>
              <div className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">{form.acres} acres × {config.tonnes_per_acre} t/acre</div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Btn onClick={handleSubmit} fullWidth size="lg">{tt("submit")}</Btn>
            <Btn onClick={() => setPage("farmerListings")} color="ghost" size="lg">{tt("cancel")}</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}
