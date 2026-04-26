"use client";

import { Bell, CheckCircle, Upload, MessageSquare, FileText, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Link from "next/link";

export default function Header() {
  const { user } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recentHistory = [
    { title: "Completed Quiz: Cell Biology", date: "2 mins ago", type: "quiz", icon: CheckCircle },
    { title: "Uploaded Note: Machine Learning", date: "1 hour ago", type: "upload", icon: Upload },
    { title: "AI Chat: World History 101", date: "Today", type: "chat", icon: MessageSquare },
  ];

  return (
    <header className="h-20 w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 border-b border-transparent transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Welcome back <span className="text-2xl">👋</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl transition-all ${
                showNotifications ? "bg-themePurple-50 dark:bg-themePurple-900/30 text-themePurple-600" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 animate-fade-in overflow-hidden">
               <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 italic">Recent Activity</h3>
                  <Link href="/history" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-themePurple-600 hover:underline">View all</Link>
               </div>
               <div className="max-h-[300px] overflow-y-auto">
                  {recentHistory.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
                            <div className="flex gap-3">
                                <div className={`p-2 rounded-lg h-fit ${
                                    item.type === 'quiz' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                                    item.type === 'upload' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                                    'bg-themePurple-100 text-themePurple-600 dark:bg-themePurple-500/20 dark:text-themePurple-400'
                                }`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{item.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.date}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 mt-1" />
                            </div>
                        </div>
                    )
                  })}
               </div>
               <Link 
                  href="/history" 
                  onClick={() => setShowNotifications(false)}
                  className="block p-3 text-center text-xs font-bold text-slate-400 hover:text-themePurple-600 bg-slate-50/50 dark:bg-slate-900/50 transition-colors"
               >
                  See complete learning history
               </Link>
            </div>
          )}
        </div>

        <Link href="/profile" className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-themePurple-600 overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center text-white font-bold uppercase text-sm">
            {user.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{user.fullName}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Pro Account</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
