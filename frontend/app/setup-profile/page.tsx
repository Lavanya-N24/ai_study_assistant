"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import {
  Sparkles,
  User,
  GraduationCap,
  ArrowRight,
  BookOpen,
  Brain,
  Zap,
} from "lucide-react";

export default function SetupProfilePage() {
  const router = useRouter();
  const { userEmail } = useAuth();
  const { isProfileComplete, completeProfile } = useUser();

  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = form, 2 = success animation

  // If profile is already complete, skip straight to dashboard
  useEffect(() => {
    if (isProfileComplete) {
      router.replace("/dashboard");
    }
  }, [isProfileComplete, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setLoading(true);

    // Brief pause for save animation
    await new Promise((r) => setTimeout(r, 600));

    completeProfile({
      fullName: fullName.trim(),
      university: university.trim(),
    });

    setStep(2);

    // Success celebration, then redirect
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  // Don't render until we know the profile status (prevents flash)
  if (isProfileComplete) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f0fa] via-white to-[#f0e6fa] dark:from-slate-950 dark:via-slate-900 dark:to-[#1a0a2e] relative overflow-hidden px-4">
      {/* Decorative blurs */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-themePurple-200/40 dark:bg-themePurple-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-100/50 dark:bg-fuchsia-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] left-[5%] w-[300px] h-[300px] bg-themePurple-100/30 dark:bg-themePurple-800/10 rounded-full blur-[100px] pointer-events-none" />

      {step === 1 && (
        <div className="w-full max-w-lg relative z-10 animate-fade-in">
          {/* Logo & Welcome */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-3xl font-extrabold tracking-tight text-themePurple-600 dark:text-themePurple-400 mb-4">
              <Sparkles className="w-8 h-8" />
              AiStudy<span className="text-slate-800 dark:text-slate-200">.io</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">
              Welcome aboard! 🎉
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              Let&apos;s personalize your experience. Just a couple of quick details and you&apos;re all set.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-2xl shadow-themePurple-600/5 dark:shadow-themePurple-500/5 p-8 sm:p-10">
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-8 h-1.5 rounded-full bg-themePurple-500" />
              <div className="w-8 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Email badge */}
            <div className="flex items-center gap-2 mb-8 p-3 rounded-xl bg-themePurple-50 dark:bg-themePurple-900/20 border border-themePurple-100 dark:border-themePurple-800/30">
              <div className="w-8 h-8 rounded-full bg-themePurple-600 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-themePurple-700 dark:text-themePurple-300">
                  {userEmail}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  What should we call you? *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="setup-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Prapthi S"
                    autoFocus
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-themePurple-500/40 focus:border-themePurple-500 outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition text-lg"
                  />
                </div>
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  School / University
                  <span className="text-slate-400 font-normal ml-1">(optional)</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="setup-university"
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. MIT, Stanford, IIT..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-themePurple-500/40 focus:border-themePurple-500 outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition"
                  />
                </div>
              </div>

              {/* Feature Preview */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Brain, label: "AI Chat", color: "text-violet-500" },
                  { icon: BookOpen, label: "Smart Notes", color: "text-blue-500" },
                  { icon: Zap, label: "Auto Quiz", color: "text-amber-500" },
                ].map((feat) => (
                  <div
                    key={feat.label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50"
                  >
                    <feat.icon className={`w-5 h-5 ${feat.color}`} />
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {feat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button
                id="setup-submit"
                type="submit"
                disabled={loading || !fullName.trim()}
                className="w-full py-4 bg-gradient-to-r from-themePurple-600 to-themePurple-500 hover:from-themePurple-700 hover:to-themePurple-600 text-white font-bold rounded-xl shadow-lg shadow-themePurple-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Continue to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Step 2: Success animation */}
      {step === 2 && (
        <div className="text-center animate-fade-in relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-themePurple-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-themePurple-600/30 animate-bounce">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">
            You&apos;re all set, {fullName.split(" ")[0]}! 🚀
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Taking you to your dashboard…
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-themePurple-500 to-fuchsia-500 rounded-full animate-progress" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
