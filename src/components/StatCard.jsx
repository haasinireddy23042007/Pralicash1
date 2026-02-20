import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, StatusBadge, Card, Btn, Input, Select } from '../components/ui';
import { formatINR, haversine, maskEmail, sendOtpEmail, sendResetEmail } from '../utils';
import { LANGUAGES, translations } from '../i18n';

// For simplicity in this automated script, we might import things that are not used, 
// but it's better than missing them. 

export default function StatCard({ icon, label, value, color = "emerald", sub }) {
  const colors = {
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    purple: "bg-purple-50 border-purple-100 text-purple-700",
  };
  return (
    <div className={`border rounded-2xl p-5 ${colors[color]}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-sm font-medium mt-0.5">{label}</div>
      {sub && <div className="text-xs opacity-70 mt-1">{sub}</div>}
    </div>
  );
}

