import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../i18n';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguagePicker() {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang);
  const ref = useRef();
  
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-sm font-medium bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 transition-all">
        <Globe size={16} className="text-emerald-600 dark:text-emerald-400" />
        <span className="hidden sm:inline">{current?.native || "English"}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl shadow-xl z-50 max-h-72 overflow-y-auto">
          <div className="p-2 grid grid-cols-1 gap-1">
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm rounded-xl flex items-center justify-between transition-colors ${
                  lang === l.code 
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-semibold" 
                    : "hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
                }`}>
                <span>{l.native}</span>
                <span className="text-xs text-gray-400 dark:text-zinc-500">{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
