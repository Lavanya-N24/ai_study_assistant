"use client";

import Link from 'next/link';
import { Upload, FileText, CheckCircle, Brain, Target, TrendingUp, Clock, BookOpen, ChevronRight, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { historyService, Activity } from '../../services/historyService';

const TYPE_ICONS = {
  quiz: CheckCircle,
  upload: Upload,
  chat: MessageSquare,
  summary: FileText,
};

export default function DashboardOverview() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ avgScore: 0, notesAnalyzed: 0, totalChat: 0 });
  const [weeklyData, setWeeklyData] = useState<number[]>([10, 10, 10, 10, 10, 10, 10]);
  const [mastery, setMastery] = useState<{name: string, percent: number, color: string}[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const allActivities = await historyService.getActivities();
      setActivities(allActivities.slice(0, 4));
      setStats(historyService.getStats(allActivities));
      setWeeklyData(historyService.getWeeklyData(allActivities));
      setMastery(historyService.getSubjectMastery(allActivities));
    };

    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('study-activity-added', loadData);

    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('study-activity-added', loadData);
    };
  }, []);

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      {/* Hero Banner */}
      <div className="bg-themePurple-600 rounded-[32px] p-10 flex text-white relative overflow-hidden shadow-lg shadow-themePurple-600/20">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
            <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
                <circle cx="200" cy="200" r="150" fill="none" stroke="white" strokeWidth="40" />
                <circle cx="250" cy="150" r="100" fill="none" stroke="white" strokeWidth="20" />
            </svg>
        </div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">Ready to boost your<br />learning speed?</h2>
          <p className="text-white/90 mb-8 leading-relaxed">
            Upload your lesson materials, chat with our advanced AI, and take automatically generated quizzes to solidify your knowledge immediately.
          </p>
          <Link href="/upload" className="inline-flex items-center gap-2 bg-white text-themePurple-600 px-6 py-3 rounded-xl font-bold hover:bg-themePurple-50 transition-colors shadow-sm">
            Explore Features
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Actions & Recent */}
        <div className="space-y-8 lg:col-span-1">
          <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <Link href="/upload" className="dashboard-panel p-5 hover:border-themePurple-600/30 transition-colors group flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-themePurple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-themePurple-600" />
               </div>
               <div>
                 <h4 className="font-bold text-slate-800">Upload Note</h4>
                 <p className="text-xs text-slate-500">PDF to Knowledge</p>
               </div>
            </Link>

            <Link href="/summary" className="dashboard-panel p-5 hover:border-themePurple-600/30 transition-colors group flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-themePurple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-themePurple-600" />
               </div>
               <div>
                 <h4 className="font-bold text-slate-800">Summarize</h4>
                 <p className="text-xs text-slate-500">Read faster</p>
               </div>
            </Link>
          </div>

          <div className="dashboard-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Clock className="w-5 h-5 text-themePurple-500"/> Study History</h3>
              <Link href="/history" className="text-xs font-bold text-themePurple-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {activities.length > 0 ? activities.map((activity) => {
                const Icon = TYPE_ICONS[activity.type] || MessageSquare;
                return (
                  <div key={activity.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`p-2 rounded-lg shrink-0 ${
                         activity.type === 'quiz' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                         activity.type === 'upload' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                         activity.type === 'summary' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                         'bg-themePurple-100 text-themePurple-600 dark:bg-themePurple-500/20 dark:text-themePurple-400'
                      }`}>
                         <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{activity.title}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{activity.date.split(',')[0]}</span>
                      </div>
                    </div>
                    <div className="font-bold text-xs text-themePurple-600 dark:text-themePurple-400 bg-themePurple-50 dark:bg-themePurple-900/30 px-2 py-1 rounded">
                      {activity.score}
                    </div>
                  </div>
                )
              }) : (
                 <div className="py-8 text-center text-slate-400 text-sm">
                   No recent activity recorded yet.
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Progress Dashboard */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-xl font-bold text-slate-800">Exam Progress & Mastery</h3>
          
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="dashboard-panel p-6 flex flex-col justify-center">
              <Target className="w-8 h-8 text-rose-500 mb-3" />
              <p className="text-sm font-medium text-slate-500">Average Score</p>
              <p className="text-3xl font-extrabold text-slate-800">{stats.avgScore}%</p>
            </div>
            <div className="dashboard-panel p-6 flex flex-col justify-center">
              <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
              <p className="text-sm font-medium text-slate-500">Chats Completed</p>
              <p className="text-3xl font-extrabold text-slate-800">{stats.totalChat}</p>
            </div>
            <div className="dashboard-panel p-6 flex flex-col justify-center">
              <BookOpen className="w-8 h-8 text-themePurple-500 mb-3" />
              <p className="text-sm font-medium text-slate-500">Notes Analyzed</p>
              <p className="text-3xl font-extrabold text-slate-800">{stats.notesAnalyzed}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="dashboard-panel p-8 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Weekly Activity</h3>
                  <span className="text-xs font-bold text-themePurple-600 bg-themePurple-50 px-2 py-1 rounded-full">Intensity</span>
              </div>
              <div className="flex-1 flex items-end justify-between gap-2 h-40 pt-4 border-b border-slate-100 pb-2">
                {weeklyData.map((height, i) => (
                  <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                     <div 
                       className="w-full bg-themePurple-500 rounded-t-md hover:bg-themePurple-400 transition-colors cursor-pointer"
                       style={{ height: `${height}%` }}
                     ></div>
                     <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-400 font-medium">
                       {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                     </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-panel p-8 flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Mastery</h3>
              <div className="flex-1 space-y-6">
                {mastery.length > 0 ? (
                  mastery.map((subject, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-slate-700">{subject.name}</span>
                        <span className="text-slate-500">{subject.percent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${subject.color} rounded-full transition-all duration-1000`} 
                          style={{ width: `${subject.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                   <div className="py-8 text-center text-slate-400 text-sm">
                     Upload specialized notes or take quizzes to track your subject mastery!
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
