import { useState, useEffect } from 'react';
import { Save, KeyRound } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Field, Input, Select } from '../../components/common/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { SettingsSkeleton } from '../../components/common/Skeleton';
import { setDragLock } from 'framer-motion';
import { useAsyncError } from 'react-router-dom';
const CURRENCIES = ['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)', 'PHP (₱)'];
const TIMEZONES = [
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Asia/Manila',
  'Asia/Tokyo',
];

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    businessName: user?.business ?? 'Rivera Enterprises',
    ownerName: user?.name ?? '',
    email: user?.email ?? '',
    plan: 'Professional',
    currency: 'USD ($)',
    timezone: 'America/New_York',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedPw, setSavedPw] = useState(false);
  const [pwError, setPwError] = useState('');

  const [toggles, setToggles] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    dailyReports: false,
    twoFactor: false,
  });

  const setP = (k) => (e) => setProfile((f) => ({ ...f, [k]: e.target.value }));
  const setPw = (k) => (e) =>
    setPasswords((f) => ({ ...f, [k]: e.target.value }));

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2000);
  };

  const handleChangePw = (e) => {
    e.preventDefault();
    setPwError('');
    if (passwords.next !== passwords.confirm) {
      setPwError('Passwords do not match.');
      return;
    }
    if (passwords.next.length < 6) {
      setPwError('Password must be at least 6 characters.');
      return;
    }
    setSavedPw(true);
    setPasswords({ current: '', next: '', confirm: '' });
    setTimeout(() => setSavedPw(false), 2000);
  };
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);
  if (loading) return <SettingsSkeleton />;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Business configuration and preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Business Profile */}
        <GlassCard delay={0.1} className="p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-4">
            Business Profile
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Field label="Business Name">
              <Input
                value={profile.businessName}
                onChange={setP('businessName')}
                placeholder="My Business"
              />
            </Field>
            <Field label="Owner Name">
              <Input
                value={profile.ownerName}
                onChange={setP('ownerName')}
                placeholder="Your name"
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={profile.email}
                onChange={setP('email')}
                placeholder="owner@business.com"
              />
            </Field>
            <Field label="Currency">
              <Select value={profile.currency} onChange={setP('currency')}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Timezone">
              <Select value={profile.timezone} onChange={setP('timezone')}>
                {TIMEZONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Plan">
              <Input
                value={profile.plan}
                disabled
                className="opacity-50 cursor-not-allowed"
              />
            </Field>
            <Button type="submit" size="sm">
              <Save className="w-3.5 h-3.5" />
              {savedProfile ? 'Saved!' : 'Save Profile'}
            </Button>
          </form>
        </GlassCard>

        <div className="space-y-5">
          {/* Password Change */}
          <GlassCard delay={0.15} className="p-5">
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-white/40" />
              Change Password
            </h3>
            <form onSubmit={handleChangePw} className="space-y-4">
              <Field label="Current Password">
                <Input
                  type="password"
                  value={passwords.current}
                  onChange={setPw('current')}
                  placeholder="••••••••"
                />
              </Field>
              <Field label="New Password">
                <Input
                  type="password"
                  value={passwords.next}
                  onChange={setPw('next')}
                  placeholder="••••••••"
                />
              </Field>
              <Field label="Confirm New Password" error={pwError}>
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={setPw('confirm')}
                  placeholder="••••••••"
                />
              </Field>
              <Button type="submit" size="sm" variant="secondary">
                {savedPw ? 'Password Updated!' : 'Update Password'}
              </Button>
            </form>
          </GlassCard>

          {/* Notification Toggles */}
          <GlassCard delay={0.2} className="p-5">
            <h3 className="text-sm font-semibold text-white/80 mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {Object.entries({
                emailNotifications: 'Email notifications',
                lowStockAlerts: 'Low stock alerts',
                dailyReports: 'Daily report emails',
                twoFactor: 'Two-factor authentication',
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-white/65">{label}</span>
                  <button
                    onClick={() =>
                      setToggles((t) => ({ ...t, [key]: !t[key] }))
                    }
                    className={`w-9 h-5 rounded-full relative transition-colors ${toggles[key] ? 'bg-indigo-600' : 'bg-white/15'}`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${toggles[key] ? 'translate-x-4' : 'translate-x-0.5'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
