import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, StatusBadge, Card, Btn, Input, Select } from '../components/ui';
import { formatINR, haversine, maskEmail, sendOtpEmail, sendResetEmail } from '../utils';
import { LANGUAGES, translations } from '../i18n';

// For simplicity in this automated script, we might import things that are not used, 
// but it's better than missing them. 

export default function MapViewPage() {
  const { db, tt } = useApp();
  const [tooltip, setTooltip] = useState(null);

  // Simple lat/lng to SVG coord mapping (Punjab region)
  const toXY = (lat, lng) => {
    const x = ((lng - 74.0) / 4.0) * 700 + 50;
    const y = ((32.5 - lat) / 3.0) * 400 + 50;
    return [Math.max(20, Math.min(730, x)), Math.max(20, Math.min(430, y))];
  };

  const openListings = db.listings.filter(l => l.status === "OPEN");
  const clusteredListings = db.listings.filter(l => l.status === "CLUSTERED");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">🗺️ {tt("mapView")}</h1>
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Open Farmer Listings</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Clusters</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Buyer Locations</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-amber-400 rounded-full inline-block"></span> Cluster Radius</span>
      </div>
      <Card>
        <div className="relative w-full" style={{ height: 500 }}>
          <svg width="100%" height="100%" viewBox="0 0 780 500" className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
            {/* Grid lines */}
            {[0.5, 1, 1.5, 2, 2.5, 3].map(i => <line key={i} x1={0} y1={50 + i * 130} x2={780} y2={50 + i * 130} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />)}
            {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(i => <line key={i} x1={50 + i * 170} y1={0} x2={50 + i * 170} y2={500} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />)}
            {/* India state outline rough */}
            <text x="20" y="20" fontSize="12" fill="#9ca3af">Punjab Region (Mock Map)</text>

            {/* Cluster radii */}
            {db.clusters.map(c => {
              const [x, y] = toXY(c.centroid_lat, c.centroid_lng);
              return <circle key={`r${c.id}`} cx={x} cy={y} r={60} fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6" />;
            })}

            {/* Match lines */}
            {db.matches.filter(m => m.status === "ACCEPTED" || m.status === "PROPOSED").map(m => {
              const cluster = db.clusters.find(c => c.id === m.cluster_id);
              const demand = db.demands.find(d => d.id === m.demand_id);
              if (!cluster || !demand) return null;
              const [x1, y1] = toXY(cluster.centroid_lat, cluster.centroid_lng);
              const [x2, y2] = toXY(demand.geo_lat, demand.geo_lng);
              return <line key={`ml${m.id}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10b981" strokeWidth="2" strokeDasharray="8" opacity="0.6" />;
            })}

            {/* Open listings */}
            {openListings.map(l => {
              const [x, y] = toXY(l.geo_lat, l.geo_lng);
              return (
                <g key={`l${l.id}`} onMouseEnter={() => setTooltip({ type: "listing", data: l, x, y })} onMouseLeave={() => setTooltip(null)} className="cursor-pointer">
                  <circle cx={x} cy={y} r={10} fill="#10b981" opacity="0.9" />
                  <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="white">🌾</text>
                </g>
              );
            })}

            {/* Clusters */}
            {db.clusters.filter(c => c.status !== "DONE").map(c => {
              const [x, y] = toXY(c.centroid_lat, c.centroid_lng);
              return (
                <g key={`c${c.id}`} onMouseEnter={() => setTooltip({ type: "cluster", data: c, x, y })} onMouseLeave={() => setTooltip(null)} className="cursor-pointer">
                  <circle cx={x} cy={y} r={20} fill="#f59e0b" opacity="0.95" stroke="white" strokeWidth="2" />
                  <text x={x} y={y - 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{c.total_tonnes}t</text>
                  <text x={x} y={y + 7} textAnchor="middle" fontSize="8" fill="white">🔗</text>
                </g>
              );
            })}

            {/* Buyers */}
            {db.demands.filter(d => d.status !== "CANCELLED").map(d => {
              const [x, y] = toXY(d.geo_lat, d.geo_lng);
              return (
                <g key={`d${d.id}`} onMouseEnter={() => setTooltip({ type: "demand", data: d, x, y })} onMouseLeave={() => setTooltip(null)} className="cursor-pointer">
                  <rect x={x - 14} y={y - 14} width={28} height={28} rx={6} fill="#3b82f6" opacity="0.9" stroke="white" strokeWidth="2" />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize="13">🏭</text>
                </g>
              );
            })}

            {/* Tooltip */}
            {tooltip && (() => {
              const { type, data, x, y } = tooltip;
              const tx = Math.min(x + 10, 600), ty = Math.max(y - 80, 10);
              return (
                <g>
                  <rect x={tx} y={ty} width={180} height={type === "cluster" ? 80 : 65} rx={8} fill="white" stroke="#e5e7eb" strokeWidth="1" filter="url(#shadow)" />
                  {type === "listing" && <>
                    <text x={tx + 10} y={ty + 18} fontSize="11" fontWeight="bold" fill="#111">{data.village_name}</text>
                    <text x={tx + 10} y={ty + 34} fontSize="10" fill="#666">{data.acres} acres · {data.estimated_tonnes}t</text>
                    <text x={tx + 10} y={ty + 50} fontSize="10" fill="#666">Status: {data.status}</text>
                  </>}
                  {type === "cluster" && <>
                    <text x={tx + 10} y={ty + 18} fontSize="11" fontWeight="bold" fill="#111">{data.cluster_name}</text>
                    <text x={tx + 10} y={ty + 34} fontSize="10" fill="#666">Total: {data.total_tonnes}t</text>
                    <text x={tx + 10} y={ty + 50} fontSize="10" fill="#666">Members: {data.member_listing_ids.length} farmers</text>
                    <text x={tx + 10} y={ty + 66} fontSize="10" fill="#666">Status: {data.status}</text>
                  </>}
                  {type === "demand" && <>
                    <text x={tx + 10} y={ty + 18} fontSize="11" fontWeight="bold" fill="#111">{data.company_name}</text>
                    <text x={tx + 10} y={ty + 34} fontSize="10" fill="#666">Needs: {data.required_tonnes}t</text>
                    <text x={tx + 10} y={ty + 50} fontSize="10" fill="#666">Price: ₹{data.price_per_tonne}/t</text>
                  </>}
                </g>
              );
            })()}
          </svg>
        </div>
      </Card>
    </div>
  );
}

