"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { api } from "../services/api";
import { historyService } from "../services/historyService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-1", role: "assistant", content: "Hello! I am your AI Study Assistant. I've processed your uploads. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    
    // Optimistic UI
    const newMessage: Message = { id: Date.now().toString(), role: "user", content: userText };
    setMessages(prev => [...prev, newMessage]);
    
    // Only record the first message of a session as a history entry to avoid clutter
    if (messages.length === 1) {
      await historyService.addActivity({
          title: `AI Chat: ${userText.substring(0, 30)}${userText.length > 30 ? '...' : ''}`,
          type: 'chat',
          score: '1 msg'
      });
    }
    
    setIsLoading(true);

    try {
      const data = await api.sendMessage(userText);
      const reply = data.answer || data.response || data.reply || "I received your message, but the format was unexpected.";
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I encountered an error connecting to the backend. Is it running?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full -mt-4 md:-mt-8 -mx-4 md:-mx-8">
      {/* Scrollable Message History */}
      <div className="flex-1 overflow-y-auto pb-48 w-full">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isLoading && (
          <div className="w-full py-6 bg-slate-50 border-b border-slate-100">
             <div className="max-w-4xl mx-auto flex gap-6 px-4">
                <div className="w-8 h-8 rounded-md bg-[#10a37f] text-white flex items-center justify-center shrink-0 mt-1">
                   <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="flex flex-1 items-center gap-1 mt-2">
                   <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                   <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                   <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
             </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Floating Pinned Input Area */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white/95 to-transparent pt-12 pb-6 px-4 md:px-8">
        <div className="max-w-3xl mx-auto relative relative">
          <form 
            onSubmit={handleSubmit} 
            className="relative flex items-end shadow-lg shadow-slate-200 border border-slate-300 bg-white rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-themePurple-600 transition-all"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Message AI Assistant..."
              className="w-full max-h-[200px] py-4 pl-4 pr-14 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-slate-800 text-[15px]"
              rows={1}
            />
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bottom-3 p-1.5 bg-themePurple-600 text-white rounded-lg hover:bg-themePurple-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[11px] text-center text-slate-400 mt-2">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
