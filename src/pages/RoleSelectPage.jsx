import React from 'react';
import { useApp } from '../context/AppContext';
import { Tractor, Factory, ChevronRight, Sprout } from 'lucide-react';
import LanguagePicker from '../components/LanguagePicker';

export default function RoleSelectPage({ setPage, setRole }) {
  const { tt } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col items-center justify-center p-4">
      
      <div className="absolute top-4 right-4 z-50">
        <LanguagePicker />
      </div>

      <div className="max-w-lg w-full z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200 dark:shadow-none transition-transform hover:scale-105">
            <Sprout size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">PraliCash</h1>
          <p className="text-lg text-emerald-700 dark:text-emerald-400 font-medium mt-1">Stubble Money — सतत विकास</p>
          <p className="text-gray-500 dark:text-zinc-400 mt-3 text-sm max-w-sm mx-auto">{tt("selectRole")}</p>
        </div>
        
        <div className="space-y-4">
          <button onClick={() => { setRole("FARMER"); setPage("farmerLogin"); }}
            className="w-full p-6 bg-white dark:bg-zinc-800/80 border-2 border-transparent hover:border-emerald-400 dark:hover:border-emerald-500 rounded-2xl text-left flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/30 transition-colors">
              <Tractor size={28} className="text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-zinc-100 text-lg">{tt("asFarmer")}</div>
              <div className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">{tt("farmerDesc")}</div>
            </div>
            <ChevronRight size={20} className="text-gray-300 dark:text-zinc-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 ml-auto transition-colors" />
          </button>
          
          <button onClick={() => { setRole("BUYER"); setPage("buyerLogin"); }}
            className="w-full p-6 bg-white dark:bg-zinc-800/80 border-2 border-transparent hover:border-amber-400 dark:hover:border-amber-500 rounded-2xl text-left flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-amber-200 dark:group-hover:bg-amber-500/30 transition-colors">
              <Factory size={28} className="text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-zinc-100 text-lg">{tt("asBuyer")}</div>
              <div className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">{tt("buyerDesc")}</div>
            </div>
            <ChevronRight size={20} className="text-gray-300 dark:text-zinc-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 ml-auto transition-colors" />
          </button>
        </div>
        
        <p className="text-center text-xs text-gray-400 dark:text-zinc-600 mt-8">🌿 Reducing stubble burning across India — one match at a time</p>
      </div>
    </div>
  );
}
