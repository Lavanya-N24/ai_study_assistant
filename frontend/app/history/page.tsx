"use client";

import { Clock, CheckCircle, Upload, MessageSquare, FileText, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { historyService, Activity } from "../../services/historyService";

const TYPE_ICONS = {
  quiz: CheckCircle,
  upload: Upload,
  chat: MessageSquare,
  summary: FileText,
};

export default function HistoryPage() {
  const [filter, setFilter] = useState("all");
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const loadActivities = async () => {
      const data = await historyService.getActivities();
      setActivities(data);
    };

    loadActivities();

    // Listen for changes in localStorage from other tabs/components
    window.addEventListener('storage', loadActivities);
    // Listen for custom event from same tab
    window.addEventListener('study-activity-added', loadActivities);

    return () => {
      window.removeEventListener('storage', loadActivities);
      window.removeEventListener('study-activity-added', loadActivities);
    };
  }, []);

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(a => a.type === filter);

  return (
    <div className="w-full max-w-5xl mx-auto pt-6 animate-fade-in pb-24 text-slate-800 dark:text-slate-100">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Study History</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track all your recent learning activities and progress</p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {['all', 'quiz', 'upload', 'chat', 'summary'].map(t => (
                <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                        filter === t 
                        ? "bg-themePurple-600 text-white shadow-md shadow-themePurple-600/20" 
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                >
                    {t}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Activity</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Outcome</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredActivities.map((activity) => {
                const Icon = TYPE_ICONS[activity.type] || MessageSquare;
                return (
                  <tr key={activity.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${
                          activity.type === 'quiz' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                          activity.type === 'upload' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                          activity.type === 'summary' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                          'bg-themePurple-100 text-themePurple-600 dark:bg-themePurple-500/20 dark:text-themePurple-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{activity.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {activity.date}
                    </td>
                    <td className="px-8 py-5 text-sm">
                       <span className={`font-bold px-3 py-1 rounded-full ${
                           activity.type === 'quiz' ? 'text-green-600 bg-green-50' : 'text-themePurple-600 bg-themePurple-50'
                       } dark:bg-themePurple-900/30 dark:text-themePurple-400`}>
                         {activity.score}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <button className="text-slate-400 hover:text-themePurple-600 transition-colors">
                        <Search className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {filteredActivities.length === 0 && (
          <div className="py-20 text-center">
            <Clock className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No activities found for this filter.</p>
          </div>
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="mt-8 flex justify-end">
           <button 
             onClick={() => {
                 if(confirm('Clear all study history?')) historyService.clearHistory();
             }}
             className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1"
           >
              Clear Everything
           </button>
        </div>
      )}
    </div>
  );
}
