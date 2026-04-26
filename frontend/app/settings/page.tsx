"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { 
  Monitor, Moon, Sun, Brain, Languages, 
  Settings2, ShieldCheck, Database, Sliders,
  MessageSquare, FileText, CheckCircle
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Local state for settings mockups
  const [settings, setSettings] = useState({
    autoSummarize: true,
    aiTone: "Concise",
    quizCount: 5,
    language: "English (US)",
    privateMode: false,
    analytics: true
  });

  useEffect(() => {
    setMounted(true);
    // Load settings from local storage if available
    const saved = localStorage.getItem("ai-study-settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const updateSetting = (key: keyof typeof settings, value: any) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem("ai-study-settings", JSON.stringify(next));
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 animate-fade-in pb-24 text-slate-800 dark:text-slate-100">
      <h1 className="text-4xl font-extrabold mb-1">Settings</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium italic">Configure your personalized AI learning environment</p>

      <div className="space-y-10">
        
        {/* Appearance Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-2xl bg-themePurple-50 dark:bg-themePurple-900/30 text-themePurple-600 dark:text-themePurple-400">
                <Sun className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Interface Appearance</h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                Personalize your workspace visual style. Dark mode is optimized for late-night study sessions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'midnight', label: 'Dark (Midnight)', icon: Moon },
                { id: 'dark', label: 'Dark (Standard)', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor }
              ].map((mode) => {
                const Icon = mode.icon;
                const isActive = theme === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setTheme(mode.id)}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all duration-300 ${
                      isActive 
                        ? 'border-themePurple-500 bg-themePurple-50 dark:bg-themePurple-900/30 text-themePurple-700 dark:text-themePurple-300 scale-[1.02] shadow-sm'
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${isActive && mode.id === 'midnight' ? 'text-themePurple-500' : ''}`} />
                    <span className="font-bold">{mode.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* AI Learning Preferences */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                <Brain className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">AI Learning Engine</h2>
          </div>

          <div className="space-y-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-slate-50 dark:border-slate-800">
                <div>
                   <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Auto-Summarization</h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400">Instantly generate a summary when you upload a PDF.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.autoSummarize} onChange={(e) => updateSetting('autoSummarize', e.target.checked)} />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-themePurple-600"></div>
                </label>
             </div>

             <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-3">
                   <h3 className="font-bold text-slate-800 dark:text-slate-100 italic flex items-center gap-2">
                       <MessageSquare className="w-4 h-4 text-themePurple-500" /> AI Tone
                   </h3>
                   <div className="flex gap-2">
                      {['Precise', 'Concise', 'Creative'].map(t => (
                        <button 
                            key={t}
                            onClick={() => updateSetting('aiTone', t)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                                settings.aiTone === t 
                                ? 'border-themePurple-500 bg-themePurple-50 dark:bg-themePurple-900/30 text-themePurple-600'
                                : 'border-slate-100 dark:border-slate-800 text-slate-400'
                            }`}
                        >
                            {t}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="flex-1 space-y-3">
                   <h3 className="font-bold text-slate-800 dark:text-slate-100 italic flex items-center gap-2">
                       <CheckCircle className="w-4 h-4 text-themePurple-500" /> Default Quiz Depth
                   </h3>
                   <div className="flex items-center gap-4">
                       <input 
                        type="range" min="3" max="15" value={settings.quizCount} 
                        onChange={(e) => updateSetting('quizCount', parseInt(e.target.value))}
                        className="flex-1 accent-themePurple-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                       />
                       <span className="font-bold text-themePurple-600 w-12 text-center bg-themePurple-50 dark:bg-themePurple-900/30 py-1 rounded-lg">{settings.quizCount} Q</span>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* System & Localization */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-colors duration-300">
           <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                <Languages className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Regional & Language</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">App Language</label>
                <select 
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-themePurple-500/50 outline-none transition-all dark:text-slate-200 font-semibold"
                >
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Hindi (हिन्दी)</option>
                    <option>Tamil (தமிழ்)</option>
                    <option>Telugu (తెలుగు)</option>
                    <option>Kannada (ಕನ್ನಡ)</option>
                    <option>Malayalam (മലയാളം)</option>
                    <option>Marathi (मराठी)</option>
                    <option>Bengali (বাংলা)</option>
                    <option>Gujarati (ગુજરાતી)</option>
                    <option>Spanish (ES)</option>
                    <option>French (FR)</option>
                </select>
             </div>

             <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Data & Sync</h3>
                <button className="w-full p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-themePurple-500 transition-all group">
                   <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-slate-400 group-hover:text-themePurple-600" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">Export All Data</span>
                   </div>
                   <Sliders className="w-4 h-4 text-slate-400" />
                </button>
             </div>
          </div>
        </section>

        {/* Security & Privacy */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-colors duration-300 opacity-90">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600">
                <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Privacy & Security</h2>
          </div>

          <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-rose-500 rounded-full"></div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">Private Study Session</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">History will not be recorded during this session.</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => updateSetting('privateMode', !settings.privateMode)}
                  className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${
                    settings.privateMode ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                 >
                   {settings.privateMode ? "ON" : "OFF"}
                 </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-green-500 rounded-full"></div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">Study Analytics</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Improve AI responses by sharing anonymous usage data.</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => updateSetting('analytics', !settings.analytics)}
                   className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${
                    settings.analytics ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                   }`}
                 >
                    {settings.analytics ? "ENABLED" : "DISABLED"}
                 </button>
              </div>
          </div>
        </section>

      </div>
    </div>
  );
}
