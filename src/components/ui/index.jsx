import React from 'react';
import { useApp } from '../../context/AppContext';

function Badge({ children, color = "green" }) {
  const colors = {
    green: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    amber: "bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    blue: "bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    red: "bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400 border-red-200 dark:border-red-500/20",
    purple: "bg-purple-100 dark:bg-purple-500/10 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
    gray: "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color] || colors.green}`}>{children}</span>;
}

function StatusBadge({ status }) {
  const map = {
    OPEN: ["Open", "blue"], CLUSTERED: ["Clustered", "amber"], PICKED_UP: ["Picked Up", "green"], CANCELLED: ["Cancelled", "red"],
    READY: ["Ready", "blue"], MATCHED: ["Matched", "amber"], IN_TRANSIT: ["In Transit", "purple"], DONE: ["Done", "green"],
    PROPOSED: ["Proposed", "blue"], ACCEPTED: ["Accepted", "green"], REJECTED: ["Rejected", "red"], COMPLETED: ["Completed", "green"],
    FULFILLED: ["Fulfilled", "green"],
  };
  const [label, color] = map[status] || [status, "gray"];
  return <Badge color={color}>{label}</Badge>;
}

function Card({ children, className = "" }) {
  return <div className={`bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden ${className}`}>{children}</div>;
}

function Btn({ children, onClick, color = "green", size = "md", disabled = false, fullWidth = false, type = "button" }) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-zinc-900";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const colors = {
    green: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-emerald-300 dark:disabled:bg-emerald-800",
    amber: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400 disabled:bg-amber-300 dark:disabled:bg-amber-800",
    red: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    ghost: "bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 focus:ring-gray-300 dark:focus:ring-zinc-600",
    outline: "bg-transparent text-emerald-700 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 focus:ring-emerald-400",
    dark: "bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-white focus:ring-gray-700 dark:focus:ring-zinc-300",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${colors[color]} ${fullWidth ? "w-full" : ""} ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}>
      {children}
    </button>
  );
}

function Input({ label, ...props }) {
  const { speak, lang, speaking } = useApp() || {};
  return (
    <div>
      {label && (
        <label
          className={`block text-sm font-medium mb-1.5 cursor-pointer transition-colors ${speaking ? 'text-blue-500 animate-pulse' : 'text-gray-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
          onClick={() => speak && speak(label, lang)}
          title="Read Aloud"
        >
          {label}
        </label>
      )}
      <input
        className="w-full border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 transition-colors"
        {...props}
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  const { speak, lang, speaking } = useApp() || {};
  return (
    <div>
      {label && (
        <label
          className={`block text-sm font-medium mb-1.5 cursor-pointer transition-colors ${speaking ? 'text-blue-500 animate-pulse' : 'text-gray-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
          onClick={() => speak && speak(label, lang)}
          title="Read Aloud"
        >
          {label}
        </label>
      )}
      <select
        className="w-full border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-100 transition-colors"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}


export { Badge, StatusBadge, Card, Btn, Input, Select };
