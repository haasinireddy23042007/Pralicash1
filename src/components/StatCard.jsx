import React from 'react';

export default function StatCard({ icon: Icon, label, value, color = "emerald", sub }) {
  const colors = {
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
    amber: "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-700 dark:text-amber-400",
    blue: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400",
    purple: "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20 text-purple-700 dark:text-purple-400",
  };
  return (
    <div className={`border rounded-2xl p-5 ${colors[color]}`}>
      <div className="text-2xl mb-2">{Icon && <Icon size={24} />}</div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-sm font-medium mt-0.5">{label}</div>
      {sub && <div className="text-xs opacity-70 mt-1">{sub}</div>}
    </div>
  );
}

