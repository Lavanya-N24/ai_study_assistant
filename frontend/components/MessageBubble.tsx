"use client";

import { useState } from "react";
import { User, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full py-6 ${isUser ? "bg-white" : "bg-slate-50"} border-b border-slate-100`}>
      <div className="max-w-4xl mx-auto flex gap-6 px-4">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-1 ${
            isUser ? "bg-slate-200 text-slate-500" : "bg-[#10a37f] text-white"
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5" />
          ) : (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 w-full min-w-0">
          <div className="text-[15px] leading-relaxed text-slate-800 break-words">
            {isUser ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : (
              <div className="prose prose-slate max-w-none prose-pre:bg-slate-800 prose-pre:text-slate-100">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Actions */}
          {!isUser && (
            <div className="flex gap-2 mt-4 text-slate-400">
              <button 
                onClick={handleCopy}
                className="p-1 hover:bg-slate-200 rounded transition text-xs flex items-center gap-1"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
