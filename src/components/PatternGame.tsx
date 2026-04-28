import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Zap, Eye } from 'lucide-react';

export default function PatternGame({ onComplete, onExit }: { onComplete: (p: number) => void; onExit: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'start' | 'watch' | 'play' | 'over'>('start');
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [level, setLevel] = useState(1);

  const colors = [
    { id: 0, color: 'bg-editorial-coral', border: 'border-red-600', shadow: 'shadow-red-200' },
    { id: 1, color: 'bg-editorial-teal', border: 'border-teal-600', shadow: 'shadow-teal-200' },
    { id: 2, color: 'bg-editorial-amber', border: 'border-amber-600', shadow: 'shadow-amber-200' },
    { id: 3, color: 'bg-purple-500', border: 'border-purple-600', shadow: 'shadow-purple-200' }
  ];

  const startGame = () => {
    const firstMove = Math.floor(Math.random() * 4);
    setSequence([firstMove]);
    setUserSequence([]);
    setGameState('watch');
    setLevel(1);
    playSequence([firstMove]);
  };

  const playSequence = async (seq: number[]) => {
    setGameState('watch');
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveButton(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveButton(null);
    }
    setGameState('play');
  };

  const handleButtonClick = (id: number) => {
    if (gameState !== 'play') return;
    
    setActiveButton(id);
    setTimeout(() => setActiveButton(null), 200);

    const newUserSeq = [...userSequence, id];
    setUserSequence(newUserSeq);

    if (id !== sequence[userSequence.length]) {
      setGameState('over');
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setUserSequence([]);
      const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(nextSeq);
      setLevel(prev => prev + 1);
      setTimeout(() => playSequence(nextSeq), 1000);
    }
  };

  const score = (level - 1) * 25;

  return (
    <div className="max-w-md mx-auto py-10 px-4 flex flex-col items-center gap-12">
      <header className="w-full flex justify-between items-center bg-white/50 p-6 rounded-[2rem] border-2 border-editorial-amber shadow-sm backdrop-blur-sm">
        <button onClick={onExit} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:scale-105 active:scale-95 transition-all text-2xl">➔</button>
        <div className="flex gap-6">
          <div className="flex items-center gap-2 font-black text-emerald-500 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
            <Zap className="w-4 h-4" /> LVL {level}
          </div>
          <div className="flex items-center gap-2 font-black text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
            <Trophy className="w-4 h-4" /> {score}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6 w-full max-w-[320px] aspect-square">
        {colors.map((c) => (
          <motion.button
            key={c.id}
            whileHover={gameState === 'play' ? { scale: 1.05 } : {}}
            whileTap={gameState === 'play' ? { scale: 0.95 } : {}}
            onClick={() => handleButtonClick(c.id)}
            className={`rounded-[2.5rem] border-b-8 shadow-xl transition-all relative overflow-hidden ${c.color} ${c.border} ${activeButton === c.id ? 'brightness-125 scale-105 border-b-0 translate-y-2' : 'brightness-100 opacity-80'}`}
          >
            {activeButton === c.id && (
              <motion.div 
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 3, opacity: 0 }}
                className="absolute inset-0 bg-white rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <button 
              onClick={startGame}
              className="bg-editorial-ink text-white font-black text-2xl px-12 py-6 rounded-[2.5rem] shadow-2xl border-b-8 border-black/50 active:translate-y-2 active:border-b-0 transition-all"
            >
              INITIALIZE LOGIC
            </button>
            <p className="mt-6 text-slate-400 font-bold">Watch the pattern closely!</p>
          </motion.div>
        )}

        {gameState === 'watch' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
            <Eye className="w-10 h-10 text-editorial-coral animate-pulse" />
            <span className="text-xl font-black tracking-widest text-editorial-coral">WATCHING...</span>
          </motion.div>
        )}

        {gameState === 'play' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 text-emerald-500">
            <Zap className="w-10 h-10 animate-bounce" />
            <span className="text-xl font-black tracking-widest">YOUR TURN!</span>
          </motion.div>
        )}

        {gameState === 'over' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-12 rounded-[4rem] text-center shadow-[0_30px_60px_rgba(0,0,0,0.1)] border-2 border-slate-100 mt-8"
          >
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-4xl font-black mb-2 leading-none">Logic Error</h2>
            <p className="text-slate-400 font-bold mb-10">Sequence interrupted at Level {level}.</p>
            <div className="flex flex-col gap-4">
              <button onClick={startGame} className="w-full bg-editorial-coral text-white font-black py-5 rounded-3xl shadow-lg border-b-6 border-red-800/20 active:translate-y-1 active:border-b-0 transition-all">Retry Logic</button>
              <button onClick={() => onComplete(score)} className="w-full bg-slate-50 text-slate-400 font-black py-5 rounded-3xl border border-slate-100">End Session</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
