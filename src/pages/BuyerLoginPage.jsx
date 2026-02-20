import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Btn, Input } from '../components/ui';
import { formatINR, maskEmail, sendOtpEmail, sendResetEmail } from '../utils';
import { Mail, Factory, ArrowLeft } from 'lucide-react';
import LanguagePicker from '../components/LanguagePicker';

export default function BuyerLoginPage({ setPage }) {
  const { db, setDb, setCurrentUser, tt } = useApp();
  const [view, setView] = useState("login"); // login | signup | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [sending, setSending] = useState(false);
  const otpRefs = useRef([]);

  const handlePasswordLogin = async () => {
    if (!email.includes("@")) { setError("Enter valid email"); return; }
    const buyer = db?.buyers?.find(b => b.email === email);
    if (buyer && buyer.password === password) {
      setCurrentUser(buyer);
      setPage("dashboard");
    } else {
      setError("Invalid credentials. Reset email sent.");
      await sendResetEmail(email, buyer?.buyer_name || email);
    }
  };

  useEffect(() => {
    if (view !== "otp") return;
    setCountdown(300);
    const timer = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [view]);

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleSendOtp = async () => {
    if (!email.includes("@")) { setError("Enter valid email"); return; }
    setSending(true);
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtp = { email, otp_hash: generatedOtp, expires_at: Date.now() + 300000, attempts: 0, is_used: false };

    await sendOtpEmail(email, generatedOtp);

    setDb(prev => ({ ...prev, otps: [...prev.otps.filter(o => o.email !== email), newOtp] }));
    setSending(false);
    setError("");
    setView("otp");
  };

  const handleOtpChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleVerifyOtp = () => {
    const entered = otp.join("");
    const record = db?.otps?.find(o => o.email === email);
    if (!record) { setError("No OTP found. Request again."); return; }
    if (Date.now() > record.expires_at) { setError(tt("otpExpired")); return; }
    if (entered !== record.otp_hash) { setError(tt("otpInvalid")); return; }

    const user = db?.buyers?.find(b => b.email === email);
    setDb(prev => {
      let nextDb = { ...prev };
      let currentUserObj = user;

      if (!user) {
        currentUserObj = { id: prev.nextIds.buyer, role: "BUYER", email, buyer_name: email.split("@")[0], company_name: "New Enterprise", is_active: true };
        nextDb.buyers = [...prev.buyers, currentUserObj];
        nextDb.nextIds.buyer = prev.nextIds.buyer + 1;
      }

      nextDb.otps = prev.otps.map(o => o.email === email ? { ...o, is_used: true } : o);
      nextDb.auditLogs = [...prev.auditLogs, { id: prev.nextIds.audit, event: "LOGIN_SUCCESS", detail: `Buyer ${maskEmail(email)} logged in via OTP`, ts: new Date().toLocaleString() }];
      nextDb.nextIds.audit = prev.nextIds.audit + 1;

      setCurrentUser(currentUserObj);
      return nextDb;
    });
    setPage("dashboard");
  };

  if (view === "otp") return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 z-50">
        <LanguagePicker />
      </div>
      <Card className="max-w-sm w-full z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border border-gray-100 dark:border-zinc-800 shadow-lg shadow-emerald-100/60 dark:shadow-none">
        <div className="p-8">
          <button 
            onClick={() => setView("login")} 
            className="text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 flex items-center gap-1.5 mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> {tt("back")}
          </button>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{tt("otpTitle")}</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{tt("otpSent")} <b className="text-gray-900 dark:text-zinc-200">{email}</b></p>
          </div>
          <div className="flex gap-2 justify-center mb-4">
            {otp.map((d, i) => (
              <input key={i} ref={el => otpRefs.current[i] = el} type="text" inputMode="numeric"
                maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)}
                className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-200 dark:border-zinc-700 bg-transparent text-gray-900 dark:text-white rounded-xl focus:border-amber-500 dark:focus:border-amber-500 focus:outline-none transition-colors" />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-zinc-500 mb-4">
            {countdown > 0 ? <>{tt("otpExpires")} <span className="font-bold text-amber-600 dark:text-amber-500">{formatTime(countdown)}</span></> : <span className="text-red-500 dark:text-red-400">{tt("otpExpired")}</span>}
          </p>
          {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
          <Btn onClick={handleVerifyOtp} fullWidth size="lg" color="amber">{tt("verifyOtp")}</Btn>
          <button onClick={handleSendOtp} className="w-full text-center text-sm text-amber-600 dark:text-amber-500 hover:underline mt-4 transition-colors">{tt("resendOtp")}</button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 z-50">
        <LanguagePicker />
      </div>
      <Card className="max-w-sm w-full z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border border-gray-100 dark:border-zinc-800 shadow-lg shadow-emerald-100/60 dark:shadow-none">
        <div className="p-8">
          <button 
            onClick={() => setPage("roleSelect")} 
            className="text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 flex items-center gap-1.5 mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> {tt("back")}
          </button>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Factory size={32} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{view === "login" ? tt("buyerLogin") : tt("signup")}</h2>
          </div>
          <div className="space-y-4">
            {view === "signup" && <>
              <Input label={tt("buyerName")} value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Your full name" />
              <Input label={tt("companyName")} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="GreenBio Industries" />
              <Input label={tt("phone")} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            </>}
            <Input label={tt("email")} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="haasinireddy2304@gmail.com" />
            {view === "login" && <Input label={tt("password")} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />}
            {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
            {view === "login" ? (
              <Btn onClick={handlePasswordLogin} fullWidth size="lg" color="amber">{tt("login")}</Btn>
            ) : (
              <Btn onClick={handleSendOtp} fullWidth size="lg" color="amber" disabled={sending}>{sending ? "Sending..." : tt("sendOtp")}</Btn>
            )}
            {view === "login" && (
              <div className="flex items-center gap-2 py-2">
                <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800"></div>
                <span className="text-[10px] text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-wider">OR SIGN IN WITH OTP</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800"></div>
              </div>
            )}
            {view === "login" && <Btn onClick={handleSendOtp} fullWidth variant="outline" size="lg" color="ghost" disabled={sending}>{sending ? "Sending..." : tt("sendOtp")}</Btn>}
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-zinc-500 mt-6">
            {view === "login" ? <>{tt("noAccount")} <button onClick={() => setView("signup")} className="text-amber-600 dark:text-amber-500 font-semibold hover:underline">{tt("signupLink")}</button></> : <>{tt("haveAccount")} <button onClick={() => setView("login")} className="text-amber-600 dark:text-amber-500 font-semibold hover:underline">{tt("loginLink")}</button></>}
          </p>
          {view === "login" && <div className="mt-4 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl text-xs text-gray-500 dark:text-zinc-400 text-center border border-gray-100 dark:border-zinc-800"><b>Demo:</b> turupubhavya@gmail.com → OTP: 482719</div>}
        </div>
      </Card>
    </div>
  );
}
