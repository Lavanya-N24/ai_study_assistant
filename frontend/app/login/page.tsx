"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f0fa] via-white to-[#f0e6fa] dark:from-slate-950 dark:via-slate-900 dark:to-[#1a0a2e] relative overflow-hidden px-4">
      {/* Decorative blurs */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-themePurple-200/40 dark:bg-themePurple-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-100/50 dark:bg-fuchsia-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[30%] left-[10%] w-[300px] h-[300px] bg-themePurple-100/30 dark:bg-themePurple-800/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-3xl font-extrabold tracking-tight text-themePurple-600 dark:text-themePurple-400 hover:opacity-90 transition"
          >
            <Sparkles className="w-8 h-8" />
            AiStudy<span className="text-slate-800 dark:text-slate-200">.io</span>
          </Link>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
            Welcome back! Sign in to continue learning.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-2xl shadow-themePurple-600/5 dark:shadow-themePurple-500/5 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            Sign In
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Enter your credentials to access your account
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-themePurple-500/40 focus:border-themePurple-500 outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-themePurple-500/40 focus:border-themePurple-500 outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-themePurple-600 to-themePurple-500 hover:from-themePurple-700 hover:to-themePurple-600 text-white font-bold rounded-xl shadow-lg shadow-themePurple-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-4">
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">OR</span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  setError("");
                  setLoading(true);
                  try {
                    await googleLogin(credentialResponse.credential);
                  } catch (err: any) {
                    setError(err?.response?.data?.detail || "Google Login failed.");
                    setLoading(false);
                  }
                }
              }}
              onError={() => {
                setError("Google Login was unsuccessful.");
              }}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

        </div>

        {/* Footer link */}
        <p className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-themePurple-600 dark:text-themePurple-400 font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
