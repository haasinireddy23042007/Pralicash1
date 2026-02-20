import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, StatusBadge, Card, Btn, Input, Select } from '../components/ui';
import { formatINR, haversine, maskEmail, sendOtpEmail, sendResetEmail } from '../utils';
import { LANGUAGES, translations } from '../i18n';

// For simplicity in this automated script, we might import things that are not used, 
// but it's better than missing them. 

export default function ResetPasswordPage({ username, setPage }) {
  const { db, setDb, tt } = useApp();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    if (newPassword.length < 6) return setError("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");

    setDb(prev => {
      const exists = prev.buyers.find(b => b.email === username);
      const newBuyers = exists
        ? prev.buyers.map(b => b.email === username ? { ...b, password: newPassword } : b)
        : [...prev.buyers, { id: prev.nextIds.buyer, role: "BUYER", email: username, password: newPassword, buyer_name: username.split("@")[0], company_name: "New Enterprise", is_active: true }];

      return {
        ...prev,
        users: prev.users.map(u => u.username === username || u.email === username ? { ...u, password: newPassword } : u),
        buyers: newBuyers,
        nextIds: { ...prev.nextIds, buyer: exists ? prev.nextIds.buyer : prev.nextIds.buyer + 1, audit: prev.nextIds.audit + 1 },
        auditLogs: [...prev.auditLogs, { id: prev.nextIds.audit, event: "PASSWORD_RESET", detail: `Password reset for ${username}`, ts: new Date().toLocaleString() }]
      };
    });
    setSuccess(true);
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-sm w-full text-center p-8">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
        <p className="text-gray-500 mb-6">Your password has been updated successfully.</p>
        <Btn onClick={() => { window.location.search = ""; setPage("roleSelect"); }} fullWidth>Back to Login</Btn>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-sm w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">Enter a new password for <b>{username}</b></p>
        <div className="space-y-4">
          <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
          <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
          <Btn onClick={handleReset} fullWidth size="lg">Update Password</Btn>
        </div>
      </Card>
    </div>
  );
}

