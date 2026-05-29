"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartPulse, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`https://crm-files.onrender.com/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Save token (mock or real) and user data
      localStorage.setItem('crm_token', data.accessToken);
      if (data.user) {
        localStorage.setItem('crm_user', JSON.stringify(data.user));
        
        // Role-based redirection
        if (data.user.role === 'AGENT') {
          router.push('/agent/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#050505] border border-[#222] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-[#222]">
            <div className="mx-auto w-12 h-12 bg-[#111] border border-[#333] rounded-xl flex items-center justify-center mb-4 shadow-inner">
              <HeartPulse className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">ElderCare CRM</h1>
            <p className="text-slate-400 text-sm">Sign in to the Enterprise Command Center</p>
          </div>

          {/* Form */}
          <div className="p-8 pt-6 bg-[#0a0a0a]">
            {error && (
              <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-400 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] focus:border-primary rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] focus:border-primary rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-orange-600 text-white font-bold rounded-lg py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_20px_rgba(234,88,12,0.5)]"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-[#111] border-t border-[#222] py-4 text-center">
            <p className="text-xs text-slate-500">Secure Enterprise Portal • v2.4.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
