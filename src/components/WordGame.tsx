import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Trophy, Star, Sparkles, Wand2 } from 'lucide-react';

const WORDS = [
  { word: 'APPLE', clue: '🍎 A common red or green fruit' },
  { word: 'SUNNY', clue: '☀️ When the sun is shining' },
  { word: 'HAPPY', clue: '😊 The opposite of sad' },
  { word: 'PANDA', clue: '🐼 A black and white bear' },
  { word: 'OCEAN', clue: '🌊 Large body of salt water' },
  { word: 'SPACE', clue: '🚀 Where stars and planets are' },
  { word: 'ROBOT', clue: '🤖 A mechanical friend' },
  { word: 'DREAM', clue: '🌙 What you do while sleeping' },
  { word: 'GUITAR', clue: '🎸 A musical instrument with strings' },
  { word: 'PIZZA', clue: '🍕 A round Italian food with cheese' },
  { word: 'JUNGLE', clue: '🌿 A thick forest with many animals' },
  { word: 'CACTUS', clue: '🌵 A prickly plant found in deserts' },
  { word: 'WIZARD', clue: '🧙 A magical person who casts spells' },
  { word: 'BICYCLE', clue: '🚲 A vehicle with two wheels you pedal' },
  { word: 'DRAGON', clue: '🐲 A mythical fire-breathing lizard' },
  { word: 'ROCKET', clue: '🚀 It flies to the moon!' },
  { word: 'TIGER', clue: '🐯 A large cat with orange and black stripes' },
  { word: 'KITTEN', clue: '🐱 A baby cat' },
  { word: 'BANANA', clue: '🍌 A long yellow fruit' },
  { word: 'FARMER', clue: '👩‍🌾 Someone who grows crops' },
  { word: 'BRIDGE', clue: '🌉 A path over water' },
  { word: 'CAMERA', clue: '📷 Used to take photos' },
  { word: 'DESERT', clue: '🏜️ A very dry, sandy place' },
  { word: 'FRIEND', clue: '🤝 Someone you like to play with' },
  { word: 'GHOST', clue: '👻 Boo! A spooky spirit' },
  { word: 'HAMMER', clue: '🔨 A tool for nails' },
  { word: 'ISLAND', clue: '🏝️ Land surrounded by water' },
  { word: 'JACKET', clue: '🧥 What you wear when it is cold' },
  { word: 'KOALA', clue: '🐨 A fuzzy Aussie animal' },
  { word: 'LANTERN', clue: '🏮 A light you can carry' },
  { word: 'MONKEY', clue: '🐒 An animal that likes bananas' },
  { word: 'OCEAN', clue: '🌊 Where sharks and whales live' },
  { word: 'PILLOW', clue: '🛌 What you rest your head on' },
  { word: 'QUEEN', clue: '👑 A royal lady' },
  { word: 'SNAKE', clue: '🐍 A slithering reptile' },
  { word: 'TURTLE', clue: '🐢 An animal with a shell' },
  { word: 'VOLCANO', clue: '🌋 A mountain that erupts' },
  { word: 'WHEEL', clue: '🎡 It goes round and round' },
  { word: 'ZEBRA', clue: '🦓 An animal with black and white stripes' },
];

export default function WordGame({ onComplete, onExit }: { onComplete: (p: number) => void; onExit: () => void }) {
  const [gameWords, setGameWords] = useState<{word: string, clue: string}[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completedWords, setCompletedWords] = useState(0);

  useEffect(() => {
    // Pick 10 random words for the session
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5).slice(0, 10);
    setGameWords(shuffled);
  }, []);

  useEffect(() => {
    if (gameWords.length > 0) {
      scrambleWord(gameWords[currentWordIndex].word);
    }
  }, [currentWordIndex, gameWords]);

  const scrambleWord = (word: string) => {
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    if (scrambled === word) return scrambleWord(word); 
    setScrambledWord(scrambled);
  };

  const handleCheck = () => {
    if (userInput.toUpperCase() === gameWords[currentWordIndex].word) {
      setIsCorrect(true);
      setScore(s => s + 20);
      setCompletedWords(c => c + 1);
      
      setTimeout(() => {
        // Move to next word indefinitely
        if (currentWordIndex + 1 < gameWords.length) {
          setCurrentWordIndex(prev => prev + 1);
        } else {
          // Reshuffle if we run out of words in the session
          const reshuffled = [...WORDS].sort(() => Math.random() - 0.5).slice(0, 10);
          setGameWords(reshuffled);
          setCurrentWordIndex(0);
        }
        setUserInput('');
        setIsCorrect(false);
      }, 1500);
    }
  };

  const isGameDone = false; // Never implicitly done
  const currentClue = gameWords.length > 0 ? gameWords[currentWordIndex].word === undefined ? '' : gameWords[currentWordIndex].clue : '';

  return (
    <div className="max-w-md mx-auto py-10 px-4 flex flex-col items-center gap-12">
      <header className="w-full flex justify-between items-center bg-white/50 p-6 rounded-[2rem] border-2 border-editorial-amber shadow-sm backdrop-blur-sm">
        <button onClick={() => onComplete(score)} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:scale-105 active:scale-95 transition-all text-2xl">➔</button>
        <div className="flex gap-6">
          <div className="flex items-center gap-2 font-black text-editorial-coral bg-rose-50 px-4 py-2 rounded-2xl border border-rose-100">
            <Wand2 className="w-4 h-4" /> {completedWords + 1}
          </div>
          <div className="flex items-center gap-2 font-black text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
            <Trophy className="w-4 h-4" /> {score}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!isGameDone ? (
          <motion.div 
            key={currentWordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="w-full space-y-10"
          >
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl text-center border-b-[16px] border-slate-100 relative">
              <div className="absolute -top-4 -right-4 bg-editorial-lavender p-4 rounded-[2rem] shadow-lg border-2 border-white rotate-6">
                <Sparkles className="text-purple-600 w-6 h-6" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6">De-scramble</p>
              <h2 className="text-7xl font-black text-editorial-ink tracking-[0.1em] mb-8 leading-none">{scrambledWord}</h2>
              <div className="bg-editorial-sky/50 p-5 rounded-3xl text-blue-800 font-bold border border-blue-100/50">
                {currentClue}
              </div>
            </div>

            <div className="space-y-6">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                placeholder="TYPE HERE"
                className={`w-full text-center text-4xl p-8 rounded-[3rem] border-4 outline-none transition-all font-black ${
                  isCorrect ? 'border-editorial-teal bg-emerald-50' : 'border-slate-100 focus:border-editorial-teal focus:ring-[12px] focus:ring-editorial-teal/10 bg-white'
                }`}
              />
              <button 
                onClick={handleCheck}
                disabled={isCorrect}
                className="w-full bg-editorial-teal text-white font-black text-2xl py-8 rounded-[3rem] shadow-xl border-b-[10px] border-black/10 active:border-b-0 active:translate-y-2 transition-all disabled:opacity-50"
              >
                {isCorrect ? 'PERFECT! ✨' : 'VALIDATE WORD'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-12 rounded-[4rem] text-center shadow-[0_30px_60px_rgba(0,0,0,0.1)] border-2 border-slate-100 max-w-sm w-full"
          >
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-5xl font-black mb-4 tracking-tight">Word Wizard!</h2>
            <p className="text-lg text-slate-400 font-bold mb-10">You've unlocked the secrets of vocabulary.</p>
            <button 
              onClick={() => onComplete(score)}
              className="w-full bg-editorial-coral text-white font-black text-xl py-5 rounded-3xl shadow-lg border-b-6 border-red-800/20 active:translate-y-1 active:border-b-0 transition-all"
            >
              Finish & Claim
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
