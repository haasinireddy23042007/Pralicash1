import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Store, ClipboardList, Handshake, Map, Leaf, PackageSearch, Link } from 'lucide-react';

export default function MobileNav({ page, setPage, role }) {
  const { tt } = useApp();
  const farmerLinks = [
    { key: "dashboard", icon: Home, label: tt("dashboard") },
    { key: "marketplace", icon: Store, label: tt("marketplace") },
    { key: "farmerListings", icon: ClipboardList, label: "Listings" },
    { key: "offers", icon: Handshake, label: "Offers" },
    { key: "mapView", icon: Map, label: "Map" },
    { key: "impact", icon: Leaf, label: "Impact" },
  ];
  const buyerLinks = [
    { key: "dashboard", icon: Home, label: tt("dashboard") },
    { key: "buyerDemands", icon: PackageSearch, label: "Demands" },
    { key: "matches", icon: Link, label: "Matches" },
    { key: "mapView", icon: Map, label: "Map" },
    { key: "impact", icon: Leaf, label: "Impact" },
  ];
  const links = role === "FARMER" ? farmerLinks : buyerLinks;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 z-30 flex pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]">
      {links.map(l => (
        <button 
          key={l.key} 
          onClick={() => setPage(l.key)}
          className={`flex-1 flex flex-col items-center justify-center py-2 h-14 text-[10px] sm:text-xs font-medium transition-colors ${
            page === l.key 
              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10" 
              : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
          }`}
        >
          <l.icon size={20} className={`mb-1 ${page === l.key ? 'scale-110 transition-transform' : ''}`} />
          <span className="truncate w-full px-1">{l.label}</span>
        </button>
      ))}
    </nav>
  );
}
