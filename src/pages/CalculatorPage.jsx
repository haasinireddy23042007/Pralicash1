import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui';
import { formatINR } from '../utils';
import { Calculator, Volume2, Flame, IndianRupee, Leaf } from 'lucide-react';

export default function CalculatorPage() {
  const { db, tt, speak, lang } = useApp();
  const [acres, setAcres] = useState("");
  const [pricePerTonne, setPricePerTonne] = useState(2000);
  const tpa = db.config.tonnes_per_acre;
  const totalTonnes = parseFloat(acres || 0) * tpa;
  const sellEarnings = totalTonnes * pricePerTonne;
  const burnCost = parseFloat(acres || 0) * 300;
  const soilLoss = totalTonnes * 150;
  const totalBurnLoss = burnCost + soilLoss;
  const netBenefit = sellEarnings + totalBurnLoss;
  const co2 = (totalTonnes * 1.53).toFixed(1);
  const pm25 = (totalTonnes * 3.2).toFixed(1);

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
          <Calculator size={28} className="text-emerald-500" /> {tt("burnVsSell")}
        </h1>
        <button 
          onClick={() => speak(`${tt("burnVsSell")}. ${tt("netBenefit")}: ${formatINR(netBenefit)}`, lang)}
          className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
          title="Read Aloud"
        >
          <Volume2 size={20} />
        </button>
      </div>
      
      <Card>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">{tt("yourAcres")}</label>
              <input 
                type="number" min="0" step="0.5" value={acres} onChange={e => setAcres(e.target.value)}
                className="w-full border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-100 transition-colors"
                placeholder="e.g. 10" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">Market Price (₹/t)</label>
              <input 
                type="number" min="0" step="100" value={pricePerTonne} onChange={e => setPricePerTonne(+e.target.value)}
                className="w-full border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-100 transition-colors" 
              />
            </div>
          </div>

          {totalTonnes > 0 && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 rounded-xl p-4 text-sm text-gray-600 dark:text-zinc-400">
                {acres} acres × {tpa} t/acre = <b className="text-gray-900 dark:text-zinc-200">{totalTonnes.toFixed(1)} tonnes</b> of stubble
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4">
                  <div className="text-sm font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-1.5">
                    <Flame size={16} /> {tt("ifYouBurn")}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-zinc-400">Fine risk</span><span className="text-red-600 dark:text-red-400 font-medium">-{formatINR(burnCost)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-zinc-400">Soil loss</span><span className="text-red-600 dark:text-red-400 font-medium">-{formatINR(soilLoss)}</span></div>
                    <div className="border-t border-red-200 dark:border-red-500/20 pt-2 flex justify-between font-bold"><span>Total loss</span><span className="text-red-700 dark:text-red-400">-{formatINR(totalBurnLoss)}</span></div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4">
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                    <IndianRupee size={16} /> {tt("ifYouSell")}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-zinc-400">{totalTonnes.toFixed(1)}t × ₹{pricePerTonne}</span><span className="text-emerald-600 dark:text-emerald-400 font-medium">+{formatINR(sellEarnings)}</span></div>
                    <div className="border-t border-emerald-200 dark:border-emerald-500/20 pt-2 flex justify-between font-bold"><span className="text-gray-800 dark:text-zinc-200">Earnings</span><span className="text-emerald-700 dark:text-emerald-400">+{formatINR(sellEarnings)}</span></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-400 dark:bg-amber-500 rounded-2xl p-6 text-center shadow-sm">
                <div className="text-sm font-bold tracking-wide uppercase text-amber-900 dark:text-amber-950 mb-1">{tt("netBenefit")} of Selling vs Burning</div>
                <div className="text-4xl font-black text-white">{formatINR(netBenefit)}</div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-4">
                <div className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                  <Leaf size={16} /> Environmental Benefit (estimated)
                </div>
                <div className="flex justify-between text-sm text-gray-700 dark:text-zinc-300">
                  <span>CO₂ avoided: <b className="text-blue-800 dark:text-blue-300">{co2}t</b></span>
                  <span>PM2.5 avoided: <b className="text-blue-800 dark:text-blue-300">{pm25}kg</b></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

