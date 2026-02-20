import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Store, ClipboardList, Handshake, Map, Leaf, Calculator, PackageSearch, Link, Settings } from 'lucide-react';

// For simplicity in this automated script, we might import things that are not used, 
// but it's better than missing them. 

export default function Sidebar({ page, setPage, role }) {
  const { tt } = useApp();
  const farmerLinks = [
    { key: "dashboard", icon: Home, label: tt("dashboard") },
    { key: "marketplace", icon: Store, label: tt("marketplace") },
    { key: "farmerListings", icon: ClipboardList, label: tt("myListings") },
    { key: "offers", icon: Handshake, label: tt("myOffers") },
    { key: "mapView", icon: Map, label: tt("mapView") },
    { key: "impact", icon: Leaf, label: tt("impactDashboard") },
    { key: "calculator", icon: Calculator, label: tt("calculator") },
  ];
  const buyerLinks = [
    { key: "dashboard", icon: Home, label: tt("dashboard") },
    { key: "buyerDemands", icon: PackageSearch, label: tt("myDemands") },
    { key: "matches", icon: Link, label: tt("matches") },
    { key: "mapView", icon: Map, label: tt("mapView") },
    { key: "impact", icon: Leaf, label: tt("impactDashboard") },
    { key: "calculator", icon: Calculator, label: tt("calculator") },
  ];
  const adminLinks = [
    { key: "dashboard", icon: Home, label: tt("dashboard") },
    { key: "admin", icon: Settings, label: tt("adminPanel") },
    { key: "mapView", icon: Map, label: tt("mapView") },
    { key: "impact", icon: Leaf, label: tt("impactDashboard") },
  ];
  const links = role === "FARMER" ? farmerLinks : role === "BUYER" ? buyerLinks : adminLinks;
  return (
    <nav className="w-52 shrink-0 hidden lg:block">
      <div className="space-y-1">
        {links.map(l => (
          <button 
            key={l.key} 
            onClick={() => setPage(l.key)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              page === l.key 
                ? "bg-emerald-600 dark:bg-emerald-500 text-white dark:text-zinc-900 shadow-sm shadow-emerald-600/20" 
                : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-200"
            }`}
          >
            <l.icon size={18} className={page === l.key ? "text-emerald-100 dark:text-emerald-900" : "text-gray-400 dark:text-zinc-500"} />
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
