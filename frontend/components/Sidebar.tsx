"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CopySlash as LayoutDashboard, Presentation, FileText, Bookmark, BarChart3, User, Settings, LogOut, MessageSquare, Upload, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Upload", icon: Upload, href: "/upload" },
    { label: "Chatbot", icon: MessageSquare, href: "/chat" },
    { label: "Summary", icon: FileText, href: "/summary" },
    { label: "Quizzes", icon: Bookmark, href: "/quiz" },
    { label: "Study History", icon: Clock, href: "/history" },
  ];

  const settingsItems = [
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const renderLinks = (items: typeof menuItems) => {
    return items.map((item) => {
      const isActive = pathname === item.href;
      const Icon = item.icon;
      return (
        <Link
          key={item.label}
          href={item.href}
          className={`flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
            isActive
              ? "bg-themePurple-50 dark:bg-themePurple-900/30 text-themePurple-600 dark:text-themePurple-400"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Icon className={`w-5 h-5 ${isActive ? "text-themePurple-600 dark:text-themePurple-400" : "text-slate-400"}`} />
          <span>{item.label}</span>
        </Link>
      );
    });
  };

  return (
    <>
      <aside className="w-64 h-screen bg-white dark:bg-slate-900 hidden lg:flex flex-col border-r border-themePurple-100 dark:border-slate-800 flex-shrink-0 shadow-sm transition-colors duration-300 z-20 relative">
        <div className="p-8">
          <Link href="/" className="font-bold text-2xl tracking-tight text-themePurple-600 dark:text-themePurple-400 group">
            AiStudy<span className="text-slate-800 dark:text-slate-200 group-hover:text-themePurple-700 dark:group-hover:text-themePurple-300 transition-colors">.io</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col justify-between pb-8">
          <div className="flex flex-col gap-8">
            <div>
              <p className="px-4 text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">Home Page</p>
              <div className="space-y-1">
                {renderLinks(menuItems)}
              </div>
            </div>

            <div>
              <p className="px-4 text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">Settings</p>
              <div className="space-y-1">
                {renderLinks(settingsItems)}
                
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-200 font-medium text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-500"
                >
                  <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-500" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2 text-slate-800 dark:text-slate-100">Ready to leave?</h3>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
              Are you sure you want to log out of your AI Study Assistant?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
