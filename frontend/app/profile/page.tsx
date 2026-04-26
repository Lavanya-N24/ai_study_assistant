"use client";

import { UserSquare2, SlidersHorizontal, BookOpen, Bell, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";

export default function ProfilePage() {
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState("General");
  const [difficulty, setDifficulty] = useState("Intermediate");
  
  // Local form state
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    university: user.university
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      fullName: user.fullName,
      university: user.university
    });
  }, [user]);

  const handleSave = () => {
    updateUser(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs = [
    { name: "General", icon: User },
    { name: "Study Preferences", icon: SlidersHorizontal },
    { name: "Academic Stats", icon: BookOpen },
    { name: "Notifications", icon: Bell },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto pt-6 animate-fade-in pb-24 text-slate-800 dark:text-slate-100">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Student Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your learning identity and AI study settings</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
             <div className="w-12 h-12 rounded-full bg-themePurple-600 flex items-center justify-center text-white font-bold text-xl uppercase">
               {user.fullName.split(' ').map(n => n[0]).join('')}
             </div>
             <div>
               <p className="text-sm font-bold leading-tight">{user.fullName}</p>
               <p className="text-xs text-themePurple-600 dark:text-themePurple-400 font-medium">Pro Explorer</p>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                isActive 
                  ? "border border-themePurple-200 bg-themePurple-50 dark:bg-themePurple-900/30 text-themePurple-700 dark:text-themePurple-300 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          )
        })}
      </div>

      {/* Main Form Content */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12 transition-colors duration-300 relative overflow-hidden">
        
        {showSuccess && (
            <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-bold animate-slide-up">
                Changes saved successfully!
            </div>
        )}

        {activeTab === "General" && (
            <div className="max-w-2xl space-y-6 animate-fade-in">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                        <input 
                            type="text" 
                            value={formData.fullName} 
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-themePurple-500/50 outline-none transition-all dark:text-slate-200"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">School / University</label>
                    <input 
                        type="text" 
                        value={formData.university} 
                        onChange={(e) => setFormData({...formData, university: e.target.value})}
                        className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-themePurple-500/50 outline-none transition-all dark:text-slate-200"
                    />
                </div>

                <div className="space-y-2 pb-6">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Authentication Email</label>
                    <input 
                        type="email" 
                        value={user.email} 
                        disabled
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl cursor-not-allowed outline-none"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span>
                        Email is linked to your core AI Study account.
                    </p>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                        onClick={handleSave}
                        type="button" 
                        className="px-8 py-3 bg-themePurple-600 dark:bg-themePurple-700 hover:bg-themePurple-700 dark:hover:bg-themePurple-800 text-white rounded-xl font-bold shadow-md shadow-themePurple-600/20 transition-all"
                    >
                        Commit Changes
                    </button>
                </div>
            </div>
        )}

        {activeTab === "Study Preferences" && (
            <div className="max-w-2xl space-y-8 animate-fade-in">
                <div>
                   <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">AI Teaching Style</h3>
                   <select className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-themePurple-500/50 outline-none dark:text-slate-200">
                      <option>Socratic (Asks questions, guides finding the answer)</option>
                      <option>Direct Explanation (Clear, concise answers)</option>
                      <option>ELI5 (Explain like I&apos;m 5 years old)</option>
                      <option>Academic (Formal, detailed, peer-reviewed tone)</option>
                   </select>
                </div>

                <div>
                   <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">Default Quiz Difficulty</h3>
                   <div className="flex flex-col sm:flex-row gap-4">
                       {['Beginner', 'Intermediate', 'Advanced'].map(level => {
                          const isActive = difficulty === level;
                          return (
                            <button 
                              key={level}
                              onClick={() => setDifficulty(level)}
                              className={`flex-1 py-3 border-2 rounded-xl font-bold transition-all ${
                                isActive 
                                  ? "border-themePurple-500 bg-themePurple-50 dark:bg-themePurple-900/30 text-themePurple-700 dark:text-themePurple-300"
                                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-themePurple-500 hover:text-themePurple-600 dark:hover:text-themePurple-400"
                              }`}
                            >
                              {level}
                            </button>
                          );
                       })}
                   </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" className="px-8 py-3 bg-themePurple-600 dark:bg-themePurple-700 hover:bg-themePurple-700 dark:hover:bg-themePurple-800 text-white rounded-xl font-bold shadow-md shadow-themePurple-600/20 transition-all">
                        Save Preferences
                    </button>
                </div>
            </div>
        )}

        {activeTab === "Academic Stats" && (
            <div className="max-w-2xl animate-fade-in space-y-6">
                 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Your Academic Footprint</h2>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                         <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Hours Studied</p>
                         <p className="text-4xl font-extrabold text-themePurple-600 dark:text-themePurple-400 mt-2">124<span className="text-lg text-slate-400 font-medium ml-1">hrs</span></p>
                     </div>
                     <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                         <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Quizzes Taken</p>
                         <p className="text-4xl font-extrabold text-themePurple-600 dark:text-themePurple-400 mt-2">38</p>
                     </div>
                     <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                         <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Notes Analyzed</p>
                         <p className="text-4xl font-extrabold text-themePurple-600 dark:text-themePurple-400 mt-2">52</p>
                     </div>
                     <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                         <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">AI Interactions</p>
                         <p className="text-4xl font-extrabold text-themePurple-600 dark:text-themePurple-400 mt-2">412</p>
                     </div>
                 </div>
            </div>
        )}

        {activeTab === "Notifications" && (
            <div className="max-w-2xl space-y-6 animate-fade-in">
                 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Email & Alerts</h2>
                 
                 <div className="space-y-4">
                     {["Weekly Study Summary", "Exam Reminders", "New Feature Announcements", "Daily Quiz Prompts"].map((item, i) => (
                         <div key={i} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                             <div>
                                 <h4 className="font-bold text-slate-800 dark:text-slate-200">{item}</h4>
                                 <p className="text-sm text-slate-500 dark:text-slate-400">Receive an email regarding {item.toLowerCase()}.</p>
                             </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                 <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                                 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-themePurple-600"></div>
                             </label>
                         </div>
                     ))}
                 </div>
            </div>
        )}

      </div>
    </div>
  );
}
