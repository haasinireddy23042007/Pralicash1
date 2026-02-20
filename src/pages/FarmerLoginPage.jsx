import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Btn, Input } from '../components/ui';
import { Tractor, ArrowLeft } from 'lucide-react';
import LanguagePicker from '../components/LanguagePicker';

export default function FarmerLoginPage({ setPage }) {
  const { db, setCurrentUser, tt } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = db?.users?.find(u => u.role === "FARMER" && u.username === username && u.password === password);
    if (user) { setCurrentUser(user); setPage("dashboard"); }
    else setError(tt("invalidCredentials"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
      <Card className="max-w-sm w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur border border-gray-100 dark:border-zinc-800 shadow-lg shadow-emerald-100/60 dark:shadow-none">
        <div className="p-8">
          <button 
            onClick={() => setPage("roleSelect")} 
            className="text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 flex items-center gap-1.5 mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> {tt("back")}
          </button>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tractor size={32} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{tt("farmerLogin")}</h2>
          </div>
          <div className="space-y-4">
            <Input 
              label={tt("username")} 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="bhavya_13" 
              onKeyDown={e => e.key === "Enter" && handleLogin()} 
            />
            <Input 
              label={tt("password")} 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              onKeyDown={e => e.key === "Enter" && handleLogin()} 
            />
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <Btn onClick={handleLogin} fullWidth color="green" size="lg">{tt("login")}</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}
