import React, { useState, useEffect, useCallback } from 'react';
import { AppCtx, INITIAL_DB, t } from './context/AppContext';
import { Btn } from './components/ui';
import { LANGUAGES, translations } from './i18n';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

import RoleSelectPage from './pages/RoleSelectPage';
import FarmerLoginPage from './pages/FarmerLoginPage';
import BuyerLoginPage from './pages/BuyerLoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import CreateListingPage from './pages/CreateListingPage';
import CreateDemandPage from './pages/CreateDemandPage';
import FarmerListingsPage from './pages/FarmerListingsPage';
import OffersPage from './pages/OffersPage';
import BuyerDemandsPage from './pages/BuyerDemandsPage';
import MatchesPage from './pages/MatchesPage';
import MapViewPage from './pages/MapViewPage';
import ImpactDashboard from './pages/ImpactDashboard';
import CalculatorPage from './pages/CalculatorPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("pralicash-lang");
    if (saved) return saved;
    const browserLang = navigator.language ? navigator.language.split('-')[0] : "en";
    return LANGUAGES.find(l => l.code === browserLang) ? browserLang : "en";
  });
  const [theme, setTheme] = useState(() => localStorage.getItem("pralicash-theme") || "system");
  const [db, setDb] = useState(INITIAL_DB);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("pralicash-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem("pralicash-role") || null);
  const [page, setPage] = useState(() => localStorage.getItem("pralicash-page") || "roleSelect");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => { localStorage.setItem("pralicash-lang", lang); }, [lang]);

  useEffect(() => {
    localStorage.setItem("pralicash-theme", theme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Listen to system theme changes if set to system
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    if (currentUser) localStorage.setItem("pralicash-user", JSON.stringify(currentUser));
    else localStorage.removeItem("pralicash-user");
  }, [currentUser]);

  useEffect(() => {
    if (role) localStorage.setItem("pralicash-role", role);
    else localStorage.removeItem("pralicash-role");
  }, [role]);

  useEffect(() => { localStorage.setItem("pralicash-page", page); }, [page]);

  useEffect(() => {
    fetch("/api/db")
      .then(res => res.json())
      .then(data => setDb(prev => ({ ...prev, ...data })))
      .catch(err => console.error("Failed to load DB:", err));
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { hi: "hi-IN", pa: "pa-IN", te: "te-IN", ta: "ta-IN", mr: "mr-IN", gu: "gu-IN", bn: "bn-IN", kn: "kn-IN", ml: "ml-IN" };
    utterance.lang = langMap[lang] || lang;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeak = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const tt = useCallback((key) => t(translations, lang, key), [lang]);

  const markAllRead = useCallback(() => {
    if (!currentUser) return;
    setDb(prev => ({ ...prev, notifications: prev.notifications.map(n => n.user_id === currentUser.id ? { ...n, read: true } : n) }));
  }, [currentUser]);

  const ctx = { lang, setLang, theme, setTheme, db, setDb, currentUser, setCurrentUser, role, setRole, tt, markAllRead, speaking, speak, stopSpeak };

  const renderPage = () => {
    const params = new URLSearchParams(window.location.search);
    const resetUser = params.get("reset");

    if (resetUser) return <ResetPasswordPage username={resetUser} setPage={setPage} />;

    if (!currentUser) {
      if (page === "roleSelect") return <RoleSelectPage setPage={setPage} setRole={setRole} />;
      if (page === "farmerLogin") return <FarmerLoginPage setPage={setPage} />;
      if (page === "buyerLogin") return <BuyerLoginPage setPage={setPage} />;
      return <RoleSelectPage setPage={setPage} setRole={setRole} />;
    }

    const userRole = currentUser.role;

    const dashMap = {
      FARMER: <FarmerDashboard setPage={setPage} />,
      BUYER: <BuyerDashboard setPage={setPage} />,
      ADMIN: <AdminPage />,
    };

    const pageMap = {
      dashboard: dashMap[userRole] || dashMap["FARMER"],
      marketplace: <FarmerDashboard setPage={setPage} />,
      farmerListings: <FarmerListingsPage setPage={setPage} />,
      createListing: <CreateListingPage setPage={setPage} />,
      offers: <OffersPage />,
      buyerDemands: <BuyerDemandsPage setPage={setPage} />,
      createDemand: <CreateDemandPage setPage={setPage} />,
      matches: <MatchesPage />,
      mapView: <MapViewPage />,
      impact: <ImpactDashboard />,
      calculator: <CalculatorPage />,
      admin: <AdminPage />,
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-8">
        <Sidebar page={page} setPage={setPage} role={userRole} />
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          {pageMap[page] || dashMap[userRole]}
        </main>
      </div>
    );
  };

  const showHeader = page !== "roleSelect" && page !== "farmerLogin" && page !== "buyerLogin";

  return (
    <AppCtx.Provider value={ctx}>
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');
          * { box-sizing: border-box; }
          body { margin: 0; }
          ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
          input:focus, select:focus { outline: none; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
          .fade-in { animation: fadeIn 0.2s ease-out; }
        `}</style>
        {showHeader && <Header setPage={setPage} />}
        <div className="fade-in">{renderPage()}</div>
        {currentUser && currentUser.role !== "ADMIN" && <MobileNav page={page} setPage={setPage} role={currentUser.role} />}
      </div>
    </AppCtx.Provider>
  );
}
