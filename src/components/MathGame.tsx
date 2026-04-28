import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Trophy, Star, Target, Sparkles } from 'lucide-react';

export default function MathGame({ onComplete, onExit }: { onComplete: (p: number) => void; onExit: () => void }) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<'+' | '-'>('+');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userInput, setUserInput] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    generateProblem();
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateProblem = () => {
    const op = Math.random() > 0.5 ? '+' : '-';
    let n1 = Math.floor(Math.random() * 15) + 5;
    let n2 = Math.floor(Math.random() * 10) + 1;
    
    if (op === '-' && n1 < n2) {
      [n1, n2] = [n2, n1];
    }
    
    setNum1(n1);
    setNum2(n2);
    setOperator(op);
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = operator === '+' ? num1 + num2 : num1 - num2;
    
    if (parseInt(userInput) === answer) {
      setScore(s => s + 10);
      setFeedback('correct');
      // Bonus time!
      setTimeLeft(prev => Math.min(prev + 3, 60));
      
      setTimeout(() => {
        setFeedback(null);
        generateProblem();
        setUserInput('');
      }, 400);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 500);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 flex flex-col items-center gap-12">
      <header className="w-full flex justify-between items-center bg-white/50 p-6 rounded-[2rem] border-2 border-editorial-amber shadow-sm backdrop-blur-sm">
        <button onClick={onExit} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:scale-105 active:scale-95 transition-all text-2xl">➔</button>
        <div className="flex gap-6">
          <div className="flex items-center gap-2 font-black text-rose-500 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-100">
            <Target className="w-5 h-5" /> {timeLeft}s
          </div>
          <div className="flex items-center gap-2 font-black text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
            <Trophy className="w-5 h-5" /> {score}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!isGameOver ? (
          <motion.div 
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center gap-12"
          >
            <motion.div 
              animate={feedback === 'correct' ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : feedback === 'wrong' ? { x: [-10, 10, -10, 10, 0] } : {}}
              className="w-full bg-white p-16 rounded-[4rem] shadow-2xl text-center border-b-[16px] border-slate-100 relative overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-10 transition-colors duration-300 ${feedback === 'correct' ? 'bg-emerald-500' : feedback === 'wrong' ? 'bg-rose-500' : ''}`} />
              <div className="relative z-10">
                <span className="text-9xl font-black text-editorial-ink tabular-nums leading-none tracking-tighter">
                  {num1}{operator}{num2}
                </span>
                <div className="mt-8 text-slate-300 font-black tracking-[0.4em] text-xs uppercase">Calculation Mind</div>
              </div>
            </motion.div>

            <form onSubmit={checkAnswer} className="w-full space-y-6">
              <input 
                autoFocus
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="?"
                className="w-full text-center text-6xl p-10 rounded-[3rem] border-4 border-slate-100 bg-white focus:outline-none focus:ring-[12px] focus:ring-editorial-coral/10 shadow-inner font-black"
              />
              <button className="w-full bg-editorial-coral text-white font-black text-3xl py-8 rounded-[3rem] shadow-xl border-b-[12px] border-red-800/20 active:border-b-0 active:translate-y-2 transition-all">
                SUBMIT
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-12 rounded-[4rem] text-center shadow-[0_30px_60px_rgba(0,0,0,0.1)] border-2 border-slate-100 max-w-sm w-full"
          >
            <div className="w-24 h-24 bg-editorial-amber rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Trophy className="w-12 h-12 text-amber-600" />
            </div>
            <h2 className="text-5xl font-black mb-4 leading-none tracking-tight">Well Done!</h2>
            <p className="text-lg text-slate-400 font-bold mb-10">You earned {score} points and a new step towards mastery.</p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { setIsGameOver(false); setTimeLeft(30); setScore(0); generateProblem(); }}
                className="w-full bg-editorial-coral text-white font-black py-5 rounded-3xl shadow-lg border-b-6 border-red-800/20 active:translate-y-1 active:border-b-0 transition-all text-xl"
              >
                Go Again
              </button>
              <button 
                onClick={() => onComplete(score)}
                className="w-full bg-slate-50 text-slate-400 font-black py-5 rounded-3xl transition-all border border-slate-100"
              >
                Claim Rewards
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
