import { createContext, useContext } from 'react';

// Translation helper for static dictionary keys
export function t(translations, lang, key) {
  const dict = translations[lang] || translations.en;
  const fallback = translations.en || {};
  return (dict && dict[key]) || fallback[key] || key;
}

// Dynamic Translation API helper
export async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  try {
    const res = await fetch('http://localhost:3001/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang })
    });
    if (!res.ok) throw new Error("Translation failed");
    const data = await res.json();
    return data.translatedText;
  } catch (err) {
    console.error("Cloud Translation Error:", err);
    return text; // Fallback to original text
  }
}

// Local fallback data so the app can function even if the backend is offline.
export const INITIAL_DB = {
  users: [
    { id: 1, role: 'FARMER', username: 'bhavya_13', password: 'bhavya@13@', email: 'haasinireddy2304@gmail.com', farmer_name: 'Bhavya Singh' },
    { id: 2, role: 'FARMER', username: 'haasini_13', password: 'haasini@13@', email: 'haasini@example.com', farmer_name: 'Haasini Kaur' },
    { id: 3, role: 'ADMIN', username: 'admin', password: 'admin123', email: 'admin@pralicash.com' },
    { id: 4, role: 'FARMER', username: 'ram_prasad', password: 'password123', email: 'ram@example.com', farmer_name: 'Ram Prasad' },
  ],
  farmerProfiles: [
    { user_id: 1, full_name: 'Bhavya Singh', village_name: 'Raikot', district: 'Ludhiana', state: 'Punjab', geo_lat: 30.6432, geo_lng: 75.6022 },
    { user_id: 2, full_name: 'Haasini Kaur', village_name: 'Ajnala', district: 'Amritsar', state: 'Punjab', geo_lat: 31.8399, geo_lng: 74.7603 },
    { user_id: 4, full_name: 'Ram Prasad', village_name: 'Samrala', district: 'Ludhiana', state: 'Punjab', geo_lat: 30.8422, geo_lng: 76.1873 },
  ],
  listings: [
    { id: 1, farmer_user_id: 1, village_name: 'Raikot', acres: 12, harvest_start: '2024-10-15', harvest_end: '2024-11-01', estimated_tonnes: 30, geo_lat: 30.6432, geo_lng: 75.6022, status: 'CLUSTERED', cluster_id: 1 },
    { id: 2, farmer_user_id: 2, village_name: 'Ajnala', acres: 8, harvest_start: '2024-10-20', harvest_end: '2024-11-05', estimated_tonnes: 20, geo_lat: 31.8399, geo_lng: 74.7603, status: 'CLUSTERED', cluster_id: 1 },
    { id: 3, farmer_user_id: 1, village_name: 'Sahnewal', acres: 15, harvest_start: '2024-10-18', harvest_end: '2024-11-10', estimated_tonnes: 37.5, geo_lat: 30.8481, geo_lng: 75.9089, status: 'OPEN' },
    { id: 4, farmer_user_id: 2, village_name: 'Doraha', acres: 10, harvest_start: '2024-10-25', harvest_end: '2024-11-15', estimated_tonnes: 25, geo_lat: 30.7956, geo_lng: 76.0282, status: 'OPEN' },
    { id: 5, farmer_user_id: 4, village_name: 'Samrala', acres: 14, harvest_start: '2024-10-22', harvest_end: '2024-11-08', estimated_tonnes: 35, geo_lat: 30.8422, geo_lng: 76.1873, status: 'OPEN' },
  ],
  buyers: [
    { id: 10, role: 'BUYER', email: 'haasinireddy2304@gmail.com', password: 'password123', buyer_name: 'Turupu Bhavya', company_name: 'GreenBio Industries Pvt. Ltd.', is_active: true },
    { id: 11, role: 'BUYER', email: 'anuj@biomass.co', password: 'password123', buyer_name: 'Anuj Sharma', company_name: 'AgriEnergy Solutions', is_active: true },
  ],
  demands: [
    { id: 1, buyer_user_id: 10, buyer_name: 'Turupu Bhavya', company_name: 'GreenBio Industries', required_tonnes: 45, location_text: 'Chandigarh Industrial Area', price_per_tonne: 2200, earliest_pickup: '2024-11-01', latest_pickup: '2024-11-30', geo_lat: 30.7046, geo_lng: 76.7179, status: 'MATCHED' },
    { id: 2, buyer_user_id: 11, buyer_name: 'Anuj Sharma', company_name: 'AgriEnergy Solutions', required_tonnes: 60, location_text: 'Ludhiana Biomass Plant', price_per_tonne: 2050, earliest_pickup: '2024-11-10', latest_pickup: '2024-12-15', geo_lat: 30.901, geo_lng: 75.8573, status: 'OPEN' },
    { id: 3, buyer_user_id: 10, buyer_name: 'Turupu Bhavya', company_name: 'GreenBio Industries', required_tonnes: 35, location_text: 'Amritsar Collection Center', price_per_tonne: 2150, earliest_pickup: '2024-11-05', latest_pickup: '2024-11-25', geo_lat: 31.634, geo_lng: 74.8723, status: 'OPEN' },
    { id: 4, buyer_user_id: 11, buyer_name: 'Anuj Sharma', company_name: 'AgriEnergy Solutions', required_tonnes: 50, location_text: 'Jalandhar Depot', price_per_tonne: 2100, earliest_pickup: '2024-11-12', latest_pickup: '2024-11-28', geo_lat: 31.326, geo_lng: 75.5762, status: 'OPEN' },
  ],
  clusters: [
    { id: 1, cluster_name: 'CLUSTER-PB-001', total_tonnes: 50, centroid_lat: 31.2416, centroid_lng: 75.1817, member_listing_ids: [1, 2], status: 'MATCHED' },
  ],
  matches: [
    { id: 1, cluster_id: 1, demand_id: 1, distance_km: 68.4, offered_price: 2200, transport_cost: 37939, net_score: 0.742, pickup_date: '2024-11-05', status: 'ACCEPTED', match_reason: 'Best price (₹2200/t, rank 1/2) with acceptable distance 68.4km. Transport cost ₹37,939.' },
  ],
  notifications: [],
  otps: [],
  auditLogs: [],
  config: {
    tonnes_per_acre: 2.5,
    min_cluster_tonnes: 50,
    distance_threshold_km: 15,
    price_weight: 0.6,
    distance_weight: 0.4,
    transport_cost_per_km_tonne: 8,
  },
  nextIds: { listing: 6, demand: 5, buyer: 12, cluster: 2, match: 2, notification: 1, audit: 1 },
};

export const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);
