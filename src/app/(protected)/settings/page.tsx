'use client';

import { useSession } from 'next-auth/react';
import { User, Shield, Moon, Monitor, Trash2, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0B1120]">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <header className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-[#8B93A7] hover:text-white transition-colors text-sm">&larr; Back to Dashboard</Link>
          <h1 className="text-3xl font-bold">Settings</h1>
        </header>

        {/* PROFILE */}
        <section className="bg-[#121A2B] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/[0.06] flex items-center gap-3">
            <User className="w-5 h-5 text-[#8B93A7]" />
            <h2 className="text-lg font-bold">Profile</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#182238] flex items-center justify-center text-xl font-bold border border-white/[0.06]">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <button className="px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm hover:bg-white/[0.06] transition-colors">
                  Change Avatar
                </button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-[#8B93A7] mb-1.5">Name</label>
                <input 
                  type="text" 
                  defaultValue={session?.user?.name || ''}
                  className="w-full bg-[#0B1120] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8823D] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8B93A7] mb-1.5">Email (read-only)</label>
                <input 
                  type="email" 
                  defaultValue={session?.user?.email || ''}
                  disabled
                  className="w-full bg-[#0B1120]/50 border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-[#8B93A7] cursor-not-allowed"
                />
              </div>
            </div>
            <button className="px-4 py-2 bg-[#E8823D] hover:bg-[#d97230] text-white rounded-lg text-sm font-medium transition-colors">
              Save Changes
            </button>
          </div>
        </section>

        {/* SECURITY */}
        <section className="bg-[#121A2B] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/[0.06] flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#8B93A7]" />
            <h2 className="text-lg font-bold">Security</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium text-sm">Password</h3>
                <p className="text-xs text-[#8B93A7] mt-1">Change your account password.</p>
              </div>
              <button className="px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm hover:bg-white/[0.06] transition-colors">
                Change Password
              </button>
            </div>
            <div className="h-px w-full bg-white/[0.06]"></div>
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium text-sm">Two-Factor Authentication</h3>
                <p className="text-xs text-[#8B93A7] mt-1">Add an extra layer of security to your account.</p>
              </div>
              <button 
                onClick={async () => {
                  try {
                    await fetch('/api/auth/2fa/setup', { method: 'POST' });
                  } catch (e) {}
                }}
                className="px-4 py-2 bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20 rounded-lg text-sm hover:bg-[#34D399]/20 transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="bg-[#121A2B] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/[0.06] flex items-center gap-3">
            <Monitor className="w-5 h-5 text-[#8B93A7]" />
            <h2 className="text-lg font-bold">Preferences</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm text-[#8B93A7] mb-1.5">Theme</label>
                <select className="w-full bg-[#0B1120] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8823D] transition-colors text-white appearance-none">
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#8B93A7] mb-1.5">Currency</label>
                <select className="w-full bg-[#0B1120] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8823D] transition-colors text-white appearance-none">
                  <option value="INR">₹ INR (Indian Rupee)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* SESSIONS */}
        <section className="bg-[#121A2B] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/[0.06] flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-[#8B93A7]" />
            <h2 className="text-lg font-bold">Active Sessions</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-medium">Current Session</div>
                <div className="text-xs text-[#8B93A7] mt-1">Windows • Chrome</div>
              </div>
              <div className="text-xs text-[#34D399] bg-[#34D399]/10 px-2 py-1 rounded">Active now</div>
            </div>
            <button className="text-sm text-[#8B93A7] hover:text-white transition-colors">
              Sign out from all other devices
            </button>
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="bg-red-900/10 border border-red-500/20 rounded-xl overflow-hidden mt-12">
          <div className="p-6 border-b border-red-500/20 flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-[#F2645A]" />
            <h2 className="text-lg font-bold text-[#F2645A]">Danger Zone</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-[#8B93A7] mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-4 py-2 bg-[#F2645A] hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors">
              Delete Account
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
