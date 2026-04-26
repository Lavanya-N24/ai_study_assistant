"use client";

import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { api } from "../../services/api";
import { historyService } from "../../services/historyService";

export default function SummaryPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getSummary();
      setSummary(res.summary);
      await historyService.addActivity({
          title: `Summarized: ${res.summary.substring(0, 30)}...`,
          type: 'summary',
          score: 'Read'
      });
    } catch (err: any) {
      setError(err?.message || "Failed to fetch summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Document Summary</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Get a quick, comprehensive overview of your uploaded PDF.
        </p>
      </div>

      <div className="dashboard-panel p-8 min-h-[400px]">
        {!summary && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <p className="text-slate-500">No summary generated yet.</p>
            <button 
              onClick={handleGenerate}
              className="bg-themePurple-600 px-6 py-2 text-white rounded-lg font-medium hover:bg-themePurple-700 transition-colors"
            >
              Generate Summary
            </button>
          </div>
        )}

        {loading && <Loader text="Analyzing document and generating summary..." />}

        {error && (
          <div className="text-center text-red-500 py-8">
            <p>{error}</p>
            <button 
              onClick={handleGenerate} 
              className="mt-4 px-4 py-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {summary && !loading && (
          <div className="prose prose-invert max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {summary}
          </div>
        )}
      </div>
    </div>
  );
}
