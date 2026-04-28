import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Star, 
  Brain, 
  Gamepad2, 
  Library, 
  Settings, 
  User, 
  Sparkles,
  Calculator,
  Grid3X3,
  Languages,
  Lightbulb,
  Heart,
  Zap
} from 'lucide-react';

// Games
import MathGame from './components/MathGame';
import MemoryGame from './components/MemoryGame';
import WordGame from './components/WordGame';
import PatternGame from './components/PatternGame';

// --- Types ---
type GameType = 'math' | 'memory' | 'vocabulary' | 'logic' | null;
type ViewType = 'home' | 'games' | 'awards' | 'settings';

interface UserStats {
  points: number;
  stars: number;
  gamesPlayed: number;
  badges: string[];
}

// --- Components ---

const BadgeNotification = ({ name, onClose }: { name: string; onClose: () => void }) => (
  <motion.div 
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-black text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]"
  >
    <div className="bg-yellow-400 p-2 rounded-xl">
      <Trophy className="text-black" />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-sm">New Badge Earned!</h4>
      <p className="text-xs text-white/70">{name}</p>
    </div>
    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">×</button>
  </motion.div>
);

const Badge = ({ name, icon: Icon, color, locked = false }: { name: string; icon: any; color: string; locked?: boolean }) => (
  <motion.div 
    whileHover={!locked ? { scale: 1.1, rotate: 5 } : {}}
    className={`${locked ? 'bg-slate-200 grayscale opacity-50' : color} p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg min-w-[110px] border-b-4 border-black/10 transition-all`}
  >
    {locked ? <Library className="w-8 h-8 text-slate-400" /> : <Icon className="w-8 h-8 text-black/60" />}
    <span className="text-[10px] font-bold uppercase tracking-wider text-center">{locked ? 'Locked' : name}</span>
  </motion.div>
);

const GameCard = ({ title, description, icon: Icon, color, onClick }: { 
  title: string; 
  description: string; 
  icon: any; 
  color: string;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.05, translateY: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`${color} group relative overflow-hidden p-6 rounded-3xl shadow-xl flex flex-col items-start gap-3 text-left border-b-8 border-black/10 min-h-[190px] w-full`}
  >
    <div className="bg-white/40 p-3 rounded-2xl">
      <Icon className="w-8 h-8 text-black/60" />
    </div>
    <div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm opacity-80 leading-tight pr-8">{description}</p>
    </div>
    <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-25 transition-opacity">
      <Icon className="w-32 h-32 rotate-12" />
    </div>
  </motion.button>
);

export default function App() {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('brainy_playground_settings');
    return saved ? JSON.parse(saved) : { animations: true, sound: true };
  });

  useEffect(() => {
    localStorage.setItem('brainy_playground_settings', JSON.stringify(settings));
  }, [settings]);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('brainy_playground_stats');
    return saved ? JSON.parse(saved) : {
      points: 0,
      stars: 0,
      gamesPlayed: 0,
      badges: ['New Explorer']
    };
  });

  useEffect(() => {
    localStorage.setItem('brainy_playground_stats', JSON.stringify(stats));
  }, [stats]);

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all your hard-earned points and badges?')) {
      const initial = {
        points: 0,
        stars: 0,
        gamesPlayed: 0,
        badges: ['New Explorer']
      };
      setStats(initial);
      localStorage.setItem('brainy_playground_stats', JSON.stringify(initial));
    }
  };

  const handleGameComplete = (newPoints: number) => {
    const freshBadges: string[] = [];
    const newGamesCount = stats.gamesPlayed + 1;
    
    if (newGamesCount === 1) freshBadges.push('First Win');
    if (newGamesCount === 5) freshBadges.push('Consistent Learner');
    if (newGamesCount === 10) freshBadges.push('Tenth Dimension');
    if (newGamesCount === 25) freshBadges.push('Game Architect');
    if (newGamesCount === 50) freshBadges.push('Legendary Player');
    if (stats.points + newPoints >= 500 && !stats.badges.includes('Point Master')) freshBadges.push('Point Master');
    if (stats.points + newPoints >= 1000 && !stats.badges.includes('Brainy Genius')) freshBadges.push('Brainy Genius');
    if (stats.points + newPoints >= 5000 && !stats.badges.includes('Omniscient')) freshBadges.push('Omniscient');

    setStats(prev => ({
      ...prev,
      points: prev.points + newPoints,
      stars: prev.stars + Math.floor(newPoints / 25),
      gamesPlayed: newGamesCount,
      badges: [...new Set([...prev.badges, ...freshBadges])]
    }));

    if (freshBadges.length > 0) {
      setNewBadge(freshBadges[0]);
    }
    
    setActiveGame(null);
    setCurrentView('home');
  };

  const renderHome = () => (
    <main className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-32">
      {/* Sidebar: Progress & Missions */}
      <aside className="md:col-span-3 flex flex-col gap-6">
        <div className="bg-editorial-mint rounded-[40px] p-8 border-2 border-emerald-100 flex-1 shadow-sm">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <Sparkles className="text-emerald-500" /> Missions
          </h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-white/80 rounded-2xl border border-white shadow-sm">
              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 mr-3 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
              </div>
              <span className="text-sm font-bold opacity-80">Solve 10 Puzzles</span>
            </div>
            <div className="flex items-center p-4 bg-white/40 rounded-2xl border border-white/50">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 mr-3"></div>
              <span className="text-sm font-bold text-slate-400">Word Master</span>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-4 opacity-50">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {stats.badges.slice(0, 4).map((b, i) => (
                <div key={i} className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-emerald-100 shadow-sm text-lg" title={b}>
                  {b === 'New Explorer' ? '🚲' : b === 'First Win' ? '🏆' : b === 'Consistent Learner' ? '🎓' : '🌟'}
                </div>
              ))}
              {stats.badges.length > 4 && <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-100 text-[10px] font-black">+{stats.badges.length - 4}</div>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-8 border-2 border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Level Mastery</p>
          <div className="flex items-end justify-between mb-4">
            <span className="text-5xl font-black">{Math.floor(stats.points / 100) + 1}</span>
            <span className="text-xs font-black text-slate-400 pb-1">{stats.points % 100}%</span>
          </div>
          <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-[2px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.points % 100}%` }}
              className="h-full bg-gradient-to-r from-editorial-teal to-blue-400 rounded-full" 
            />
          </div>
        </div>
      </aside>

      {/* Main Content Grid */}
      <section className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 bg-editorial-pink rounded-[48px] p-8 md:p-12 border-2 border-rose-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group">
          <div className="flex-1 z-10 text-center md:text-left">
            <span className="bg-rose-200 text-rose-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter">Weekly Special</span>
            <h3 className="text-5xl md:text-6xl font-black mt-6 mb-4 leading-[0.9] text-editorial-ink">Pattern <br/>Proficiency</h3>
            <p className="text-rose-900/40 font-bold mb-8 max-w-[300px] mx-auto md:mx-0">Master the logic of colors in the Logic Loft!</p>
            <button 
              onClick={() => setActiveGame('logic')}
              className="bg-editorial-coral text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-xl border-b-6 border-red-800/20 active:translate-y-1 active:border-b-0 transition-all"
            >
              Play Now
            </button>
          </div>
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
            <motion.span 
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-[120px] drop-shadow-2xl z-10"
            >
              🚀
            </motion.span>
          </div>
        </div>

        <div className="bg-editorial-sky rounded-[48px] p-8 border-2 border-blue-100 flex flex-col justify-between min-h-[300px] shadow-sm hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => setActiveGame('math')}>
          <div className="flex flex-col gap-6">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-4xl shadow-md border-b-4 border-blue-50">🧮</div>
            <div>
              <h4 className="text-3xl font-black">Math Marvel</h4>
              <p className="text-blue-900/30 font-bold mt-1">Arithmetic adventures</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-8">
            <span className="text-xs font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Easy</span>
            <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-blue-100 text-2xl shadow-sm">➔</button>
          </div>
        </div>

        <div className="bg-editorial-lavender rounded-[48px] p-8 border-2 border-purple-100 flex flex-col justify-between min-h-[300px] shadow-sm hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => setActiveGame('vocabulary')}>
          <div className="flex flex-col gap-6">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-4xl shadow-md border-b-4 border-purple-50">🎨</div>
            <div>
              <h4 className="text-3xl font-black">Word Sketch</h4>
              <p className="text-purple-900/30 font-bold mt-1">Vocabulary fun</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-8">
            <span className="text-xs font-black text-purple-500 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">Medium</span>
            <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-purple-100 text-2xl shadow-sm">➔</button>
          </div>
        </div>
      </section>
    </main>
  );

  const renderGames = () => (
    <div className="pb-32">
      <div className="mb-12">
        <h2 className="text-5xl font-black tracking-tight mb-4">Arcade <span className="text-editorial-coral">Zone</span></h2>
        <p className="text-slate-400 font-bold">Pick a challenge to sharpen your skills and earn points.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <GameCard 
          title="Math Marvel" 
          description="Fast-paced arithmetic for agile young minds."
          icon={Calculator}
          color="bg-editorial-amber/40"
          onClick={() => setActiveGame('math')}
        />
        <GameCard 
          title="Memory Meadow" 
          description="Boost recall with matching pairs."
          icon={Grid3X3}
          color="bg-editorial-sky"
          onClick={() => setActiveGame('memory')}
        />
        <GameCard 
          title="Word Wizard" 
          description="Expand vocabulary by unscrambling."
          icon={Languages}
          color="bg-editorial-lavender"
          onClick={() => setActiveGame('vocabulary')}
        />
        <GameCard 
          title="Logic Loft" 
          description="Pattern matching to sharpen focus."
          icon={Brain}
          color="bg-editorial-mint"
          onClick={() => setActiveGame('logic')}
        />
      </div>
    </div>
  );

  const renderAwards = () => (
    <div className="pb-32">
      <div className="mb-12">
        <h2 className="text-5xl font-black tracking-tight mb-4">Hall of <span className="text-editorial-teal">Fame</span></h2>
        <p className="text-slate-400 font-bold">Your achievements and special milestones earned.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <Badge name="Explorer" icon={User} color="bg-orange-200" />
        <Badge name="First Win" icon={Trophy} color="bg-yellow-200" locked={!stats.badges.includes('First Win')} />
        <Badge name="Learner" icon={Heart} color="bg-rose-200" locked={!stats.badges.includes('Consistent Learner')} />
        <Badge name="Point Master" icon={Sparkles} color="bg-blue-200" locked={!stats.badges.includes('Point Master')} />
        <Badge name="Tenth Dim" icon={Zap} color="bg-purple-200" locked={!stats.badges.includes('Tenth Dimension')} />
        <Badge name="Brainy Genius" icon={Lightbulb} color="bg-emerald-200" locked={!stats.badges.includes('Brainy Genius')} />
        <Badge name="Architect" icon={Gamepad2} color="bg-indigo-200" locked={!stats.badges.includes('Game Architect')} />
        <Badge name="Legend" icon={Trophy} color="bg-amber-200" locked={!stats.badges.includes('Legendary Player')} />
        <Badge name="Omniscient" icon={Star} color="bg-rose-500 text-white" locked={!stats.badges.includes('Omniscient')} />
      </div>

      <div className="mt-20 p-12 bg-white rounded-[4rem] border-2 border-slate-100 text-center">
        <div className="text-6xl mb-6">🏔️</div>
        <h3 className="text-3xl font-black mb-4">The Road Ahead</h3>
        <p className="text-slate-400 max-w-md mx-auto font-bold mb-8">Keep playing to unlock legendary status! Each game adds to your legacy.</p>
        <div className="flex justify-center gap-4">
          <div className="px-6 py-3 bg-slate-50 rounded-full font-black text-xs text-slate-500">{stats.gamesPlayed} GAMES COMPLETED</div>
          <div className="px-6 py-3 bg-slate-50 rounded-full font-black text-xs text-slate-500">{stats.stars} STARS COLLECTED</div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="pb-32 max-w-2xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-black tracking-tight mb-4">Preferences</h2>
        <p className="text-slate-400 font-bold">Customize your playground experience.</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-editorial-teal/20 rounded-2xl flex items-center justify-center text-editorial-teal">
              <Sparkles />
            </div>
            <div>
              <h4 className="font-black text-lg">Animations</h4>
              <p className="text-xs text-slate-400 font-bold">Show smooth transitions</p>
            </div>
          </div>
          <div 
            onClick={() => setSettings({ ...settings, animations: !settings.animations })}
            className={`w-16 h-8 rounded-full p-1 flex items-center cursor-pointer transition-colors ${settings.animations ? 'bg-editorial-teal justify-end' : 'bg-slate-200 justify-start'}`}
          >
            <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-editorial-amber/20 rounded-2xl flex items-center justify-center text-editorial-amber">
              <Star />
            </div>
            <div>
              <h4 className="font-black text-lg">Sound Effects</h4>
              <p className="text-xs text-slate-400 font-bold">Play happy noises on win</p>
            </div>
          </div>
          <div 
            onClick={() => setSettings({ ...settings, sound: !settings.sound })}
            className={`w-16 h-8 rounded-full p-1 flex items-center cursor-pointer transition-colors ${settings.sound ? 'bg-editorial-amber justify-end' : 'bg-slate-200 justify-start'}`}
          >
            <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
          </div>
        </div>

        <div className="pt-12">
          <button 
            onClick={resetProgress}
            className="w-full bg-rose-50 text-rose-600 border-2 border-rose-100 py-6 rounded-[2.5rem] font-black text-lg hover:bg-rose-100 transition-colors"
          >
            Reset All Progress
          </button>
          <p className="text-center text-[10px] text-rose-300 font-black uppercase tracking-widest mt-4">Warning: This action cannot be undone</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-ink selection:bg-editorial-coral selection:text-white p-4 md:p-8">
      <AnimatePresence>
        {newBadge && <BadgeNotification name={newBadge} onClose={() => setNewBadge(null)} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeGame ? (
          <motion.div
            key="game-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl mx-auto"
          >
            {activeGame === 'math' && <MathGame onComplete={handleGameComplete} onExit={() => setActiveGame(null)} />}
            {activeGame === 'memory' && <MemoryGame onComplete={handleGameComplete} onExit={() => setActiveGame(null)} />}
            {activeGame === 'vocabulary' && <WordGame onComplete={handleGameComplete} onExit={() => setActiveGame(null)} />}
            {activeGame === 'logic' && <PatternGame onComplete={handleGameComplete} onExit={() => setActiveGame(null)} />}
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto flex flex-col gap-8 h-full"
          >
            {/* Editorial Top Bar */}
            <header className="flex items-center justify-between p-6 bg-white/60 backdrop-blur-md rounded-[2.5rem] border-2 border-editorial-amber shadow-sm">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('home')}>
                <div className="w-14 h-14 bg-editorial-coral rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 border-b-4 border-red-700/20">
                  <span className="text-white text-3xl font-black">B</span>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-800">Brainy <span className="text-editorial-coral">Playground</span></h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Level {Math.floor(stats.points / 100) + 1} Architect</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center bg-white px-5 py-2 rounded-full border-2 border-yellow-400 shadow-sm gap-2">
                  <Star className="text-yellow-500 w-5 h-5 fill-yellow-500" />
                  <span className="font-black text-amber-600 text-sm">{stats.points} POINTS</span>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-editorial-teal overflow-hidden bg-white shadow-md">
                  <div className="w-full h-full bg-editorial-mint flex items-center justify-center text-2xl">🦊</div>
                </div>
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentView === 'home' && renderHome()}
                {currentView === 'games' && renderGames()}
                {currentView === 'awards' && renderAwards()}
                {currentView === 'settings' && renderSettings()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Bottom Navigation */}
      {!activeGame && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl px-12 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-2 border-white flex items-center gap-12 sm:gap-16 z-50">
          <div 
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center cursor-pointer group transition-all ${currentView === 'home' ? 'text-editorial-coral scale-110' : 'opacity-40 hover:opacity-100'}`}
          >
            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-200">🏠</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase mt-1">Home</span>
          </div>
          <div 
            onClick={() => setCurrentView('games')}
            className={`flex flex-col items-center cursor-pointer group transition-all ${currentView === 'games' ? 'text-blue-500 scale-110' : 'opacity-40 hover:opacity-100'}`}
          >
            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">🎮</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase mt-1">Games</span>
          </div>
          <div 
            onClick={() => setCurrentView('awards')}
            className={`flex flex-col items-center cursor-pointer group transition-all ${currentView === 'awards' ? 'text-editorial-teal scale-110' : 'opacity-40 hover:opacity-100'}`}
          >
            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">🏆</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase mt-1">Awards</span>
          </div>
          <div 
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center cursor-pointer group transition-all ${currentView === 'settings' ? 'text-slate-800 scale-110' : 'opacity-40 hover:opacity-100'}`}
          >
            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">⚙️</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase mt-1">Settings</span>
          </div>
        </nav>
      )}
    </div>
  );
}
