import React from 'react';
import { useApp } from '../context/AppContext';
import { Btn } from '../components/ui';
import LanguagePicker from '../components/LanguagePicker';
import NotificationBell from '../components/NotificationBell';
import { Wheat, VolumeX, Moon, Sun, Monitor, LogOut, Tractor, Factory, UserCog } from 'lucide-react';

export default function Header({ setPage }) {
  const { currentUser, setCurrentUser, setRole, tt, speaking, stopSpeak, theme, setTheme } = useApp();

  const RoleIcon = currentUser?.role === "FARMER" ? Tractor : currentUser?.role === "ADMIN" ? UserCog : Factory;

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-40 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <button onClick={() => setPage("dashboard")} className="flex items-center gap-2.5 hover:opacity-80 transition group">
          <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-200 dark:shadow-none group-hover:bg-emerald-600 transition-colors">
            <Wheat size={18} className="text-white" />
          </div>
          <div className="text-left">
            <span className="font-bold text-gray-900 dark:text-zinc-100 text-base leading-none block">PraliCash</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium leading-none">Stubble Money</span>
          </div>
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          {speaking && (
            <button 
              onClick={stopSpeak} 
              className="animate-pulse bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 p-2 rounded-xl hover:bg-red-200 dark:hover:bg-red-500/30 transition" 
              title="Stop Voice"
            >
              <VolumeX size={16} />
            </button>
          )}

          <LanguagePicker />
          
          <button 
            onClick={cycleTheme} 
            className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-gray-50 hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors"
            title="Toggle Theme"
          >
            <ThemeIcon size={18} />
          </button>

          {currentUser && <NotificationBell />}
          
          {currentUser && (
            <div className="flex items-center gap-3 ml-1 pl-3 border-l border-gray-200 dark:border-zinc-700">
              <span className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300 font-medium">
                <RoleIcon size={16} className="text-gray-400 dark:text-zinc-500" />
                {currentUser.farmer_name || currentUser.buyer_name || currentUser.username}
              </span>
              <button 
                onClick={() => { setCurrentUser(null); setRole(null); setPage("roleSelect"); }}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                title={tt("logout")}
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
