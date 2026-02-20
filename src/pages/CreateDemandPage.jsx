import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Btn, Input } from '../components/ui';
import { ArrowLeft } from 'lucide-react';

export default function CreateDemandPage({ setPage }) {
  const { setDb, currentUser, tt } = useApp();
  const [form, setForm] = useState({ required_tonnes: "", location_text: "", price_per_tonne: "", earliest_pickup: "", latest_pickup: "" });
  const cityCoords = { "Chandigarh": [30.7046, 76.7179], "Ludhiana": [30.9010, 75.8573], "Amritsar": [31.6340, 74.8723], "Delhi": [28.6139, 77.2090], "Jalandhar": [31.3260, 75.5762] };

  const handleSubmit = async () => {
    if (!form.required_tonnes || !form.location_text || !form.price_per_tonne) return alert("Fill all required fields");
    const coords = cityCoords[form.location_text] || [30.7 + Math.random(), 75.8 + Math.random()];
    const payload = {
      buyer_user_id: currentUser.id, buyer_name: currentUser.buyer_name,
      company_name: currentUser.company_name, required_tonnes: +form.required_tonnes,
      location_text: form.location_text, price_per_tonne: +form.price_per_tonne,
      earliest_pickup: form.earliest_pickup, latest_pickup: form.latest_pickup,
      geo_lat: coords[0], geo_lng: coords[1], status: "OPEN"
    };
    try {
      let newDemand;
      try {
        const res = await fetch("/api/demands", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Backend Error");
        newDemand = await res.json();
      } catch (err) {
        console.warn("Using offline fallback for demand", err);
        newDemand = { ...payload, id: Date.now() };
      }
      setDb(prev => ({ ...prev, demands: [...prev.demands, newDemand] }));
      setPage("buyerDemands");
    } catch (err) { console.error(err); alert("Error saving demand"); }
  };

  return (
    <div className="max-w-lg space-y-6 mx-auto">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setPage("buyerDemands")} 
          className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{tt("createDemand")}</h1>
      </div>
      <Card>
        <div className="p-6 space-y-4">
          <Input label={tt("requiredTonnes")} type="number" value={form.required_tonnes} onChange={e => setForm({ ...form, required_tonnes: e.target.value })} placeholder="e.g. 80" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">{tt("locationText")}</label>
            <select 
              className="w-full border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-100 transition-colors" 
              value={form.location_text} 
              onChange={e => setForm({ ...form, location_text: e.target.value })}
            >
              <option value="" className="dark:bg-zinc-800">Select city...</option>
              {Object.keys(cityCoords).map(c => <option key={c} className="dark:bg-zinc-800">{c}</option>)}
            </select>
          </div>
          <Input label={`${tt("price")} (₹)`} type="number" value={form.price_per_tonne} onChange={e => setForm({ ...form, price_per_tonne: e.target.value })} placeholder="e.g. 2200" />
          <div className="grid grid-cols-2 gap-4">
            <Input label={tt("earliestPickup")} type="date" value={form.earliest_pickup} onChange={e => setForm({ ...form, earliest_pickup: e.target.value })} />
            <Input label={tt("latestPickup")} type="date" value={form.latest_pickup} onChange={e => setForm({ ...form, latest_pickup: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Btn onClick={handleSubmit} fullWidth size="lg">{tt("submit")}</Btn>
            <Btn onClick={() => setPage("buyerDemands")} color="ghost" size="lg">{tt("cancel")}</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}
