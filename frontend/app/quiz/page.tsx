"use client";

import { useState } from "react";
import Loader from "../../components/Loader";
import { api } from "../../services/api";
import { historyService } from "../../services/historyService";

type QuizOption = {
  label: string;
  text: string;
};

type QuizQuestion = {
  question: string;
  options: QuizOption[];
  answer: string; // e.g. "A", "B", "C", "D"
  explanation: string;
};

export default function QuizPage() {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setSelectedAnswers({});
    setShowResults(false);
    try {
      const res = await api.getQuiz();
      setQuiz(res.questions);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch quiz. Please check backend response.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex: number, label: string) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: label }));
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let score = 0;
    quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) score++;
    });
    return score;
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-12 animate-fade-in mb-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-slate-800">Interactive Quiz</h1>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
          Test your understanding with AI-generated questions based on your material.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-themePurple-100 p-6 sm:p-8">
        {!quiz && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <button 
              onClick={handleGenerate}
              className="px-8 py-3 bg-themePurple-600 text-white rounded-xl font-bold hover:bg-themePurple-700 transition-all shadow-md shadow-themePurple-600/20"
            >
              Generate AI Quiz
            </button>
          </div>
        )}

        {loading && <div className="py-12"><Loader text="Crafting custom questions..." /></div>}
        
        {error && <div className="text-red-500 py-8 text-center bg-red-50 rounded-xl border border-red-100">{error}</div>}

        {quiz && !loading && (
          <div className="space-y-8">
            {quiz.map((q, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">{i + 1}. {q.question}</h3>
                <div className="space-y-3">
                  {q.options.map((opt, j) => {
                    const isSelected = selectedAnswers[i] === opt.label;
                    const isCorrect = showResults && opt.label === q.answer;
                    const isWrong = showResults && isSelected && !isCorrect;

                    let bgClass = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300";
                    if (isSelected) bgClass = "bg-themePurple-50 border-themePurple-500 text-themePurple-700 font-medium scale-[1.01] shadow-sm";
                    if (isCorrect) bgClass = "bg-green-50 border-green-500 text-green-700 font-bold scale-[1.01] shadow-sm";
                    if (isWrong) bgClass = "bg-red-50 border-red-500 text-red-700 font-bold scale-[1.01] shadow-sm";

                    return (
                      <button
                        key={j}
                        onClick={() => handleSelect(i, opt.label)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex gap-3 ${bgClass}`}
                      >
                        <span className="font-bold">{opt.label}:</span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
                {showResults && (
                   <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm italic text-slate-600">
                     <span className="font-bold not-italic text-slate-800">Explanation:</span> {q.explanation}
                   </div>
                )}
              </div>
            ))}

            {!showResults ? (
              <div className="pt-8 mt-8 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={async () => {
                    setShowResults(true);
                    const score = calculateScore();
                    await historyService.addActivity({
                        title: `Completed Quiz: ${quiz[0]?.question.substring(0, 20)}...`,
                        type: 'quiz',
                        score: `${Math.round((score / quiz.length) * 100)}%`
                    });
                  }}
                  disabled={Object.keys(selectedAnswers).length < quiz.length}
                  className="px-8 py-3 bg-themePurple-600 text-white rounded-xl font-bold hover:bg-themePurple-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-md shadow-themePurple-600/20"
                >
                  Submit Answers
                </button>
              </div>
            ) : (
              <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex flex-col">
                  <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-themePurple-600 to-fuchsia-500">
                    Score: {calculateScore()} / {quiz.length}
                  </p>
                  <p className="text-sm text-slate-500">Well done! Keep studying.</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setShowResults(false);
                      setSelectedAnswers({});
                    }}
                    className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm text-sm"
                  >
                    Retake Quiz
                  </button>
                  <button 
                    onClick={handleGenerate}
                    className="px-6 py-3 bg-themePurple-600 text-white rounded-xl font-bold hover:bg-themePurple-700 transition-all shadow-md shadow-themePurple-600/20 text-sm"
                  >
                    Generate New Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
