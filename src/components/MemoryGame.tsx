import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Trophy, Star, RefreshCcw } from 'lucide-react';

const CARD_ICONS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame({ onComplete, onExit }: { onComplete: (p: number) => void; onExit: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck: Card[] = [...CARD_ICONS, ...CARD_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlipped;

      if (cards[firstId].emoji === cards[secondId].emoji) {
        setMatches(m => m + 1);
        newCards[firstId].isMatched = true;
        newCards[secondId].isMatched = true;
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          newCards[firstId].isFlipped = false;
          newCards[secondId].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const score = Math.max(100 - moves * 2, 20);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 flex flex-col items-center gap-12">
      <header className="w-full flex justify-between items-center bg-white/50 p-6 rounded-[2rem] border-2 border-editorial-amber shadow-sm backdrop-blur-sm">
        <button onClick={onExit} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:scale-105 active:scale-95 transition-all text-2xl">➔</button>
        <div className="flex gap-6">
          <div className="flex items-center gap-2 font-black text-blue-500 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
            <RefreshCcw onClick={initializeGame} className="w-5 h-5 cursor-pointer hover:rotate-180 transition-transform" /> {moves}
          </div>
          <div className="flex items-center gap-2 font-black text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
            <Star className="w-5 h-5" /> {matches}/{CARD_ICONS.length}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4 w-full">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-[2rem] text-5xl flex items-center justify-center shadow-lg transition-all border-b-[8px] ${
              card.isFlipped || card.isMatched 
              ? 'bg-white border-slate-100 scale-100' 
              : 'bg-editorial-sky border-blue-200'
            }`}
          >
            {(card.isFlipped || card.isMatched) ? (
              <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}>{card.emoji}</motion.span>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-dashed border-blue-300" />
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {matches === CARD_ICONS.length && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-12 rounded-[4rem] text-center shadow-[0_30px_60px_rgba(0,0,0,0.1)] border-2 border-slate-100 max-w-sm w-full"
          >
            <div className="w-24 h-24 bg-editorial-teal/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Trophy className="w-12 h-12 text-editorial-teal" />
            </div>
            <h2 className="text-4xl font-black mb-2 tracking-tight">Memory Master!</h2>
            <p className="text-slate-400 font-bold mb-10">Flawless identification. You earned {score} points.</p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={initializeGame} 
                className="w-full bg-editorial-teal text-white font-black py-4 rounded-3xl shadow-lg border-b-6 border-teal-800/20 active:translate-y-1 active:border-b-0 transition-all font-black"
              >
                Stay in Zone
              </button>
              <button 
                onClick={() => onComplete(score)} 
                className="w-full bg-slate-100 text-slate-400 font-black py-4 rounded-3xl"
              >
                Claim Points & Exit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
