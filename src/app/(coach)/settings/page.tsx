'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Save, LogOut, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Gift, Copy } from 'lucide-react';
import { showToast } from '@/components/Toast';

type NotifState = Record<string, boolean>;

interface ReferralStats {
  total: number;
  converted: number;
  pending: number;
  rewardMonths: number;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [profile, setProfile] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({ full_name: '', bio: '', phone: '', certifications: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [notifications, setNotifications] = useState<NotifState>({
    workoutComplete: true,
    messages: true,
    planExpiry: true,
    weeklyReport: false,
    marketing: false,
  });
  const [notifSaving, setNotifSaving] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('zh-CN');

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referralLoading, setReferralLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [appliedCode, setAppliedCode] = useState('');

  useEffect(() => { fetchProfile(); }, []);

  useEffect(() => {
    if (activeTab === 'referral') {
      loadReferralData();
    }
  }, [activeTab]);

  const loadReferralData = async () => {
    setReferralLoading(true);
    try {
      const [codeRes, statsRes] = await Promise.all([
        fetch('/api/referral/code'),
        fetch('/api/referral/stats'),
      ]);
      if (codeRes.ok) {
        const codeData = await codeRes.json();
        setReferralCode(codeData.code);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setReferralStats(statsData);
      }
    } catch (e: any) {
      console.error('Failed to load referral data:', e);
    } finally {
      setReferralLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        setProfileForm({
          full_name: data.profile.full_name || '',
          bio: data.profile.bio || '',
          phone: data.profile.phone || '',
          certifications: data.profile.certifications || '',
        });
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.full_name.trim()) {
      showToast('error', 'Full Name');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', 'Save failed: ' + (data.error || 'Unknown error'));
      } else {
        showToast('success', 'Profile updated');
      }
    } catch (e: any) {
      showToast('error', 'Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('error', 'Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return;
    }
    if (!passwordForm.currentPassword) {
      showToast('error', 'Current Password');
      return;
    }
    setPasswordSaving(true);
    setError('');
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', 'Update failed: ' + (data.error || ''));
      } else {
        showToast('success', 'Password updated');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPassword(false);
      }
    } catch (e: any) {
      showToast('error', ': ' + e.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setNotifSaving(true);
    try {
      localStorage.setItem('fitness-notifications', JSON.stringify(notifications));
      showToast('success', 'Notification settings saved');
    } catch (e: any) {
      showToast('error', ': ' + e.message);
    } finally {
      setNotifSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    // Clear ALL cache and storage
    localStorage.clear();
    sessionStorage.clear();
    // Clear service workers
    if ('serviceWorker' in navigator) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) await r.unregister();
      } catch (e) {}
    }
    // Clear all cookies
    document.cookie.split(';').forEach(c => {
      const name = c.split('=')[0].trim();
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname;
    });
    // Force reload from server
    window.location.href = '/login?' + Date.now();
  };

  const handleCopyReferral = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      showToast('success', 'Referral code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('error', 'Copy failed, please copy manually');
    }
  };

  const handleApplyReferral = async () => {
    if (!appliedCode.trim()) {
      showToast('error', 'Please enter referral code');
      return;
    }
    try {
      const res = await fetch('/api/referral/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: appliedCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.message || 'Apply failed');
      } else {
        showToast('success', data.message);
        setAppliedCode('');
        await loadReferralData();
      }
    } catch (e: any) {
      showToast('error', 'Application failed: ' + e.message);
    }
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'appearance', label: 'Appearance', icon: Globe },
    { key: 'referral', label: 'Referral', icon: Gift },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences</p>
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4" />Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition flex items-center gap-2"
                >
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Profile</>}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <>
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Shield className="w-4 h-4" />Change Password
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="At least 6 characters"
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter new password again"
                      minLength={6}
                    />
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => setShowPassword(!showPassword)} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={passwordSaving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition flex items-center gap-2"
                  >
                    {passwordSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Updating...</> : 'Change Password'}
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h3 className="font-medium text-gray-900">Sign Out</h3>
                <p className="text-sm text-gray-500">You need to sign in again after signing out to access your account</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition text-sm"
                >
                  <LogOut className="w-4 h-4" />Sign Out
                </button>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Bell className="w-4 h-4" />Notification Preferences
              </h3>
              {[
                { key: 'workoutComplete', label: 'Client workout completion', desc: 'Get notified when a client completes a workout' },
                { key: 'messages', label: 'Client message notifications', desc: 'Get notified when a client sends a message' },
                { key: 'planExpiry', label: 'Plan expiry reminders', desc: 'Get reminded when plans are about to expire' },
                { key: 'weeklyReport', label: 'Weekly progress reports', desc: 'Receive weekly summary of client progress' },
                { key: 'marketing', label: 'Marketing emails', desc: 'Receive product updates and promotional offers' },
              ].map((item: any) => (
                <label key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[item.key] || false}
                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked } as NotifState)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </label>
              ))}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveNotifications}
                  disabled={notifSaving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition flex items-center gap-2"
                >
                  {notifSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Save Settings'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Theme</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={
                      'flex-1 p-4 rounded-lg text-center transition ' +
                      (theme === 'light' ? 'border-2 border-blue-500 bg-blue-50' : 'border-2 border-gray-200 hover:border-gray-300')
                    }
                  >
                    <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-2" />
                    <p className="text-sm font-medium">Light Mode</p>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={
                      'flex-1 p-4 rounded-lg text-center transition ' +
                      (theme === 'dark' ? 'border-2 border-blue-500 bg-blue-50' : 'border-2 border-gray-200 hover:border-gray-300')
                    }
                  >
                    <div className="w-8 h-8 bg-gray-900 rounded-lg mx-auto mb-2" />
                    <p className="text-sm font-medium">Dark Mode</p>
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Language</h3>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                >
                  <option value="zh-CN">Simplified Chinese</option>
                  <option value="en-US">English</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'referral' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Gift className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Invite Friends, Share Benefits</h2>
                </div>
                <p className="text-blue-100">Share your referral code. You and your friend both get 1 month of Pro membership free.</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">My Referral Code</h3>
                {referralLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-gray-500 text-sm">Loading...</span>
                  </div>
                ) : referralCode ? (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-lg font-mono font-bold text-gray-900">
                      {referralCode}
                    </div>
                    <button
                      onClick={handleCopyReferral}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 whitespace-nowrap"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No referral code available</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{referralLoading ? '...' : referralStats?.total ?? 0}</p>
                  <p className="text-sm text-gray-500">Total Referrals</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{referralLoading ? '...' : referralStats?.converted ?? 0}</p>
                  <p className="text-sm text-gray-500">Successful Referrals</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{referralLoading ? '...' : referralStats?.rewardMonths ?? 0}</p>
                  <p className="text-sm text-gray-500">Months Earned</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium text-gray-900">Share Referral Code</p>
                      <p className="text-sm text-gray-500">Share your referral code via email, chat, or social media with friends.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium text-gray-900">Friend Signs Up</p>
                      <p className="text-sm text-gray-500">They use your referral code to create their account.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium text-gray-900">Both Get 1 Month Free</p>
                      <p className="text-sm text-gray-500">You and your referred friend each get 1 month free on any plan.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">I Have a Referral Code</h3>
                <p className="text-sm text-gray-500 mb-4">If you were referred by a friend, enter their code here.</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={appliedCode}
                    onChange={(e) => setAppliedCode(e.target.value.toUpperCase())}
                    placeholder="Enter referral code (e.g.: FIT-ABC123)"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                  <button
                    onClick={handleApplyReferral}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
