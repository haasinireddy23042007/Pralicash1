import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, StatusBadge, Card, Btn, Input, Select } from '../components/ui';
import { formatINR, haversine, maskEmail, sendOtpEmail, sendResetEmail } from '../utils';
import { LANGUAGES, translations } from '../i18n';

// For simplicity in this automated script, we might import things that are not used, 
// but it's better than missing them. 

export default function NotificationBell() {
  const { db, currentUser, tt } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const notifs = db.notifications.filter(n => n.user_id === currentUser?.id);
  const unread = notifs.filter(n => !n.read).length;
  const { markAllRead } = useApp();
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition">
        <span className="text-lg">🔔</span>
        {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-800">{tt("notifications")}</span>
            {unread > 0 && <button onClick={markAllRead} className="text-xs text-emerald-600 hover:underline">{tt("markRead")}</button>}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">{tt("noNotifications")}</p>
            ) : notifs.slice().reverse().map(n => (
              <div key={n.id} className={`px-4 py-3 border-b border-gray-50 text-sm ${n.read ? "text-gray-500" : "text-gray-800 bg-emerald-50/30"}`}>
                <p>{n.msg}</p>
                <p className="text-xs text-gray-400 mt-1">{n.ts}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

