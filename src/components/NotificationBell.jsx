import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function NotificationBell() {
  const { db, currentUser, tt, markAllRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const notifs = (db?.notifications || []).filter(n => n.user_id === currentUser?.id);
  const unread = notifs.filter(n => !n.read).length;
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
        <span className="text-lg">🔔</span>
        {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-700">
            <span className="font-semibold text-gray-800 dark:text-zinc-200">{tt("notifications")}</span>
            {unread > 0 && <button onClick={markAllRead} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">{tt("markRead")}</button>}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifs.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-zinc-500 text-center py-6">{tt("noNotifications")}</p>
            ) : notifs.slice().reverse().map(n => (
              <div key={n.id} className={`px-4 py-3 border-b border-gray-50 dark:border-zinc-700 text-sm ${n.read ? "text-gray-500 dark:text-zinc-400" : "text-gray-800 dark:text-zinc-100 bg-emerald-50/30 dark:bg-emerald-500/10"}`}>
                <p>{n.msg}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">{n.ts}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

