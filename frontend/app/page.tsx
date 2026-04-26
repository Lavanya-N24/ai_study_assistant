import Link from "next/link";
import { ArrowRight, Brain, Upload, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-16 text-center animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm text-themePurple-600 rounded-full bg-themePurple-50 border border-themePurple-100 shadow-sm font-semibold">
        <Zap className="w-4 h-4" />
        <span>Supercharge your studying with AI</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-800 leading-tight">
        Learn Faster with <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-themePurple-600 to-fuchsia-500">
          AI Study Assistant
        </span>
      </h1>
      
      <p className="max-w-2xl text-lg text-slate-500 mb-12 leading-relaxed">
        Upload your textbooks, slides, or notes. Our advanced RAG system reads the material and provides instant answers, summaries, and personalized quizzes.
      </p>

      <div className="flex sm:flex-row flex-col gap-4 w-full justify-center max-w-sm sm:max-w-none mb-24">
        <Link href="/login" className="px-10 py-4 bg-themePurple-600 text-white rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-themePurple-700 shadow-lg shadow-themePurple-600/20 transition-all hover:-translate-y-0.5">
          Get Started
          <ArrowRight className="w-5 h-5 ml-1" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
        {[
           { title: "RAG Powered Chat", desc: "Ask direct questions about your document and get cited answers instantly without hallucinations.", icon: Brain },
           { title: "Smart Summaries", desc: "Too long to read? Get concise, formatted summaries out of massive PDFs.", icon: ArrowRight },
           { title: "Interactive Quizzes", desc: "Test your knowledge with auto-generated quizzes based on your material.", icon: Zap },
        ].map((feature, i) => {
           const Icon = feature.icon;
           return (
             <div key={i} className="dashboard-panel p-8 hover:border-themePurple-500/30 transition-colors group">
               <div className="w-14 h-14 bg-themePurple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Icon className="w-7 h-7 text-themePurple-600" />
               </div>
               <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
               <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
             </div>
           )
        })}
      </div>
    </div>
  );
}
