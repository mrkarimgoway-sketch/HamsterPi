import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Gamepad2,
  Trophy,
  ArrowLeft,
  RotateCcw,
  Clock,
  Sparkles,
  Zap,
  CheckCircle,
  XCircle,
  HelpCircle,
  Play,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { QUIZ_QUESTIONS } from '../../data/initialData';
import { sounds } from '../../services/sound';

type ActiveGameKey = 'none' | 'rush' | 'memory' | 'puzzle' | 'jump' | 'quiz';

export const GamesScreen: React.FC = () => {
  const { language, submitMiniGameResult, stats } = useGame();
  const t = translations[language];

  const [activeGame, setActiveGame] = useState<ActiveGameKey>('none');

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] px-4 py-3 pb-24 max-w-md mx-auto">
      {activeGame === 'none' ? (
        <GamesHub onSelectGame={(key) => setActiveGame(key)} />
      ) : activeGame === 'rush' ? (
        <HamsterRushGame onBack={() => setActiveGame('none')} />
      ) : activeGame === 'memory' ? (
        <MemoryMatchGame onBack={() => setActiveGame('none')} />
      ) : activeGame === 'puzzle' ? (
        <PiPuzzleGame onBack={() => setActiveGame('none')} />
      ) : activeGame === 'jump' ? (
        <HamsterJumpGame onBack={() => setActiveGame('none')} />
      ) : (
        <DailyQuizGame onBack={() => setActiveGame('none')} />
      )}
    </div>
  );
};

/* =========================================================================
   GAMES HUB (Menu)
   ========================================================================= */
const GamesHub: React.FC<{ onSelectGame: (key: ActiveGameKey) => void }> = ({ onSelectGame }) => {
  const { language, stats } = useGame();
  const t = translations[language];

  const games = [
    {
      key: 'rush' as ActiveGameKey,
      title: t.miniGames.rush.title,
      desc: t.miniGames.rush.desc,
      icon: '⚡',
      color: 'from-amber-600 to-yellow-500',
      badge: 'Reaction Arcade',
      rewardRate: 'Up to 5,000 π',
    },
    {
      key: 'jump' as ActiveGameKey,
      title: t.miniGames.jump.title,
      desc: t.miniGames.jump.desc,
      icon: '🚀',
      color: 'from-purple-600 to-indigo-500',
      badge: 'Endless Jumper',
      rewardRate: 'Up to 6,000 π',
    },
    {
      key: 'memory' as ActiveGameKey,
      title: t.miniGames.memory.title,
      desc: t.miniGames.memory.desc,
      icon: '🧠',
      color: 'from-emerald-600 to-teal-500',
      badge: 'Brain Challenge',
      rewardRate: 'Up to 4,500 π',
    },
    {
      key: 'puzzle' as ActiveGameKey,
      title: t.miniGames.puzzle.title,
      desc: t.miniGames.puzzle.desc,
      icon: '🧩',
      color: 'from-blue-600 to-cyan-500',
      badge: '3x3 Sliding Puzzle',
      rewardRate: 'Up to 3,500 π',
    },
    {
      key: 'quiz' as ActiveGameKey,
      title: t.miniGames.quiz.title,
      desc: t.miniGames.quiz.desc,
      icon: '🎓',
      color: 'from-rose-600 to-pink-500',
      badge: 'Pi Trivia',
      rewardRate: '2,500 π Streak',
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-100">{t.miniGames.title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{t.miniGames.subtitle}</p>
      </div>

      {/* High score banner */}
      <div className="glass-panel-gold rounded-2xl p-3.5 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-amber-400 font-medium">{t.miniGames.highScore}</div>
            <div className="text-base font-bold text-slate-100 font-mono">
              {stats.highestMinigameScore.toLocaleString()} pts
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400">Total Played</div>
          <div className="text-sm font-bold text-slate-200">{stats.minigamesPlayed} sessions</div>
        </div>
      </div>

      {/* Game Cards */}
      <div className="flex flex-col gap-3">
        {games.map((game) => (
          <div
            key={game.key}
            onClick={() => onSelectGame(game.key)}
            className="group glass-panel rounded-2xl p-4 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-2xl shadow-md shrink-0`}
                >
                  {game.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                      {game.title}
                    </h3>
                    <span className="text-[10px] font-semibold text-purple-300 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-800/40">
                      {game.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{game.desc}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-900 text-xs">
              <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{game.rewardRate}</span>
              </span>

              <button className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm group-hover:brightness-110">
                <span>{t.miniGames.playNow}</span>
                <Play className="w-3 h-3 fill-slate-950" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 1: HAMSTER RUSH (Whack-a-mole reaction tapping)
   ========================================================================= */
interface RushItem {
  id: number;
  type: 'coin' | 'seed' | 'bomb';
  points: number;
}

const HamsterRushGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language, submitMiniGameResult } = useGame();
  const t = translations[language];

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState<(RushItem | null)[]>(Array(9).fill(null));

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Spawner loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const emptySlots = grid
        .map((val, idx) => (val === null ? idx : null))
        .filter((val): val is number => val !== null);

      if (emptySlots.length > 0) {
        const slot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
        const rand = Math.random();
        const itemType: 'coin' | 'seed' | 'bomb' =
          rand < 0.5 ? 'coin' : rand < 0.8 ? 'seed' : 'bomb';
        const points = itemType === 'coin' ? 15 : itemType === 'seed' ? 30 : -20;

        setGrid((prev) => {
          const next = [...prev];
          next[slot] = { id: Date.now() + Math.random(), type: itemType, points };
          return next;
        });

        // Disappear after lifetime
        setTimeout(() => {
          setGrid((prev) => {
            const next = [...prev];
            next[slot] = null;
            return next;
          });
        }, 1100 + Math.random() * 400);
      }
    }, 600);

    return () => clearInterval(spawnInterval);
  }, [gameState, grid]);

  // When gameover, submit points
  useEffect(() => {
    if (gameState === 'gameover') {
      const rewardPoints = Math.max(0, score * 8);
      submitMiniGameResult('rush', score, rewardPoints);
    }
  }, [gameState, score, submitMiniGameResult]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGrid(Array(9).fill(null));
    setGameState('playing');
  };

  const handleSlotClick = (index: number) => {
    if (gameState !== 'playing') return;
    const item = grid[index];
    if (!item) return;

    if (item.type === 'bomb') {
      sounds.playError();
      setScore((s) => Math.max(0, s - 20));
    } else {
      sounds.playCoin();
      setScore((s) => s + item.points);
    }

    setGrid((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.miniGames.backToArcade}</span>
        </button>
        <div className="text-sm font-bold text-amber-400">{t.miniGames.rush.title}</div>
      </div>

      {gameState === 'ready' && (
        <div className="w-full glass-panel rounded-2xl p-6 text-center border border-slate-800">
          <div className="text-4xl mb-3">⚡</div>
          <h2 className="text-lg font-bold text-slate-100">{t.miniGames.rush.title}</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
            {t.miniGames.rush.instructions}
          </p>
          <div className="flex justify-center gap-4 my-4 text-xs font-semibold">
            <span className="text-amber-400">🪙 Coin: +15</span>
            <span className="text-yellow-300">🌰 Seed: +30</span>
            <span className="text-rose-400">💣 Bomb: -20</span>
          </div>
          <button
            onClick={startGame}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            {t.miniGames.playNow}
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="w-full">
          {/* HUD */}
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
              <Clock className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
            <div className="text-base font-mono font-bold text-slate-100">
              Score: <span className="text-amber-400">{score}</span>
            </div>
          </div>

          {/* 3x3 Arena Grid */}
          <div className="grid grid-cols-3 gap-3 w-full aspect-square p-2 bg-slate-900/80 rounded-2xl border border-slate-800">
            {grid.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSlotClick(idx)}
                className="relative rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-center text-3xl overflow-hidden active:scale-90 transition-transform select-none"
              >
                {item ? (
                  <span className="animate-bounce">
                    {item.type === 'coin' ? '🪙' : item.type === 'seed' ? '🌰' : '💣'}
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-900/60" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="w-full glass-panel-gold rounded-2xl p-6 text-center border border-amber-500/40">
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-lg font-bold text-amber-300">{t.miniGames.gameOver}</h2>
          <div className="text-2xl font-mono font-bold text-slate-100 my-2">{score} pts</div>
          <div className="text-xs text-emerald-400 font-bold mb-4">
            +{Math.max(0, score * 8).toLocaleString()} Hamster Points Claimed!
          </div>
          <div className="flex gap-2">
            <button
              onClick={startGame}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              {t.miniGames.playAgain}
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 font-bold text-xs"
            >
              {t.miniGames.backToArcade}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 2: MEMORY MATCH (Card matching puzzle)
   ========================================================================= */
const MEMORY_ICONS = ['🪙', '🌰', '👑', '⚡', '🚀', '🌟', '💎', '🛡️', '🏆', '🍕'];

const MemoryMatchGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language, submitMiniGameResult } = useGame();
  const t = translations[language];

  const [cards, setCards] = useState<{ id: number; icon: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [numPairs, setNumPairs] = useState(6); // 6 pairs = 12 cards

  const initGame = useCallback((pairsCount: number) => {
    const selectedIcons = MEMORY_ICONS.slice(0, pairsCount);
    const deck = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({
        id,
        icon,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initGame(numPairs);
  }, [numPairs, initGame]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    sounds.playTap();
    const nextFlipped = [...flippedIndices, index];

    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      if (cards[firstIdx].icon === cards[secondIdx].icon) {
        sounds.playCoin();
        setCards((prev) =>
          prev.map((c, i) =>
            i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
          )
        );
        setFlippedIndices([]);

        // Check if all matched
        setTimeout(() => {
          setCards((curr) => {
            const allMatched = curr.every((c) => c.isMatched || c.id === firstIdx || c.id === secondIdx);
            if (allMatched) {
              sounds.playFanfare();
              setIsWon(true);
              const points = Math.max(500, (numPairs * 500) - moves * 20);
              submitMiniGameResult('memory', points, points);
            }
            return curr;
          });
        }, 300);
      } else {
        // Mismatch flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.miniGames.backToArcade}</span>
        </button>
        <div className="text-sm font-bold text-emerald-400">{t.miniGames.memory.title}</div>
      </div>

      {/* Difficulty selector & HUD */}
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <div className="flex gap-1">
          {[6, 8].map((pairs) => (
            <button
              key={pairs}
              onClick={() => {
                setNumPairs(pairs);
                initGame(pairs);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold ${
                numPairs === pairs
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {pairs * 2} Cards
            </button>
          ))}
        </div>
        <div className="font-mono text-slate-200 font-bold">
          {t.miniGames.memory.moves}: <span className="text-emerald-400">{moves}</span>
        </div>
      </div>

      {/* Memory Grid */}
      <div
        className={`grid gap-2 w-full p-2 bg-slate-900/80 rounded-2xl border border-slate-800 ${
          numPairs === 6 ? 'grid-cols-4 aspect-4/3' : 'grid-cols-4 aspect-1/1'
        }`}
      >
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`rounded-xl flex items-center justify-center text-2xl transition-all duration-300 border select-none ${
              card.isMatched
                ? 'bg-emerald-950/60 border-emerald-500/50 opacity-80'
                : card.isFlipped
                ? 'bg-slate-800 border-amber-400/80 shadow-md rotate-y-180'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            {card.isFlipped || card.isMatched ? card.icon : '❓'}
          </button>
        ))}
      </div>

      {isWon && (
        <div className="w-full glass-panel-gold rounded-2xl p-4 mt-4 text-center border border-amber-500/40">
          <h3 className="text-sm font-bold text-amber-300">🎉 Memory Solved!</h3>
          <p className="text-xs text-emerald-400 font-bold mt-1">
            +{(numPairs * 500).toLocaleString()} Points Awarded!
          </p>
          <button
            onClick={() => initGame(numPairs)}
            className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            {t.miniGames.playAgain}
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 3: PI PUZZLE (3x3 Sliding numbers puzzle)
   ========================================================================= */
const PiPuzzleGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language, submitMiniGameResult } = useGame();
  const t = translations[language];

  // Solved state is [1, 2, 3, 4, 5, 6, 7, 8, 0] (0 is empty)
  const [board, setBoard] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const shuffle = () => {
    // Generate valid solvable state by making 40 random moves from solved
    let current = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    for (let step = 0; step < 40; step++) {
      const zeroIdx = current.indexOf(0);
      const validSwaps: number[] = [];
      const row = Math.floor(zeroIdx / 3);
      const col = zeroIdx % 3;

      if (row > 0) validSwaps.push(zeroIdx - 3);
      if (row < 2) validSwaps.push(zeroIdx + 3);
      if (col > 0) validSwaps.push(zeroIdx - 1);
      if (col < 2) validSwaps.push(zeroIdx + 1);

      const swapIdx = validSwaps[Math.floor(Math.random() * validSwaps.length)];
      const temp = current[zeroIdx];
      current[zeroIdx] = current[swapIdx];
      current[swapIdx] = temp;
    }
    setBoard(current);
    setMoves(0);
    setIsSolved(false);
  };

  useEffect(() => {
    shuffle();
  }, []);

  const handleTileClick = (index: number) => {
    if (isSolved) return;
    const zeroIdx = board.indexOf(0);

    const row = Math.floor(index / 3);
    const col = index % 3;
    const zeroRow = Math.floor(zeroIdx / 3);
    const zeroCol = zeroIdx % 3;

    // Check adjacency
    const isAdjacent =
      (Math.abs(row - zeroRow) === 1 && col === zeroCol) ||
      (Math.abs(col - zeroCol) === 1 && row === zeroRow);

    if (isAdjacent) {
      sounds.playTap();
      const nextBoard = [...board];
      nextBoard[zeroIdx] = board[index];
      nextBoard[index] = 0;
      setBoard(nextBoard);
      setMoves((m) => m + 1);

      // Check win condition
      const checkWin = nextBoard.slice(0, 8).every((val, i) => val === i + 1);
      if (checkWin) {
        sounds.playFanfare();
        setIsSolved(true);
        submitMiniGameResult('puzzle', 2000, 2000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.miniGames.backToArcade}</span>
        </button>
        <div className="text-sm font-bold text-blue-400">{t.miniGames.puzzle.title}</div>
      </div>

      <div className="w-full flex justify-between items-center mb-3 text-xs">
        <span className="font-mono text-slate-200">
          {t.miniGames.puzzle.moves}: <strong className="text-blue-400">{moves}</strong>
        </span>
        <button
          onClick={shuffle}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold hover:text-white"
        >
          {t.miniGames.puzzle.shuffle}
        </button>
      </div>

      {/* 3x3 Sliding Grid */}
      <div className="grid grid-cols-3 gap-2.5 w-full aspect-square p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
        {board.map((num, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(idx)}
            disabled={num === 0}
            className={`rounded-xl flex items-center justify-center font-mono text-2xl font-black transition-all ${
              num === 0
                ? 'bg-slate-950/40 border border-dashed border-slate-800 cursor-default'
                : 'bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700/80 text-amber-300 shadow-md active:scale-95'
            }`}
          >
            {num !== 0 ? num : ''}
          </button>
        ))}
      </div>

      {isSolved && (
        <div className="w-full glass-panel-gold rounded-2xl p-4 mt-4 text-center border border-amber-500/40">
          <h3 className="text-sm font-bold text-amber-300">🎉 {t.miniGames.puzzle.solvedTitle}</h3>
          <p className="text-xs text-emerald-400 font-bold mt-1">+2,000 Points Earned!</p>
          <button
            onClick={shuffle}
            className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            {t.miniGames.playAgain}
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 4: HAMSTER JUMP (Vertical platform jumper with canvas)
   ========================================================================= */
const HamsterJumpGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language, submitMiniGameResult } = useGame();
  const t = translations[language];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let playerX = canvas.width / 2;
    let playerY = canvas.height - 100;
    let vy = -8;
    const gravity = 0.28;
    let currentAltitude = 0;

    // Initial platforms
    const platforms: { x: number; y: number; width: number; hasCoin?: boolean }[] = [
      { x: canvas.width / 2 - 30, y: canvas.height - 40, width: 70 },
    ];
    for (let i = 1; i < 7; i++) {
      platforms.push({
        x: Math.random() * (canvas.width - 60),
        y: canvas.height - 40 - i * 75,
        width: 60,
        hasCoin: Math.random() > 0.5,
      });
    }

    const loop = () => {
      // Input
      if (keysRef.current.left) playerX -= 4.5;
      if (keysRef.current.right) playerX += 4.5;

      // Wrap around
      if (playerX < -15) playerX = canvas.width + 15;
      if (playerX > canvas.width + 15) playerX = -15;

      // Physics
      vy += gravity;
      playerY += vy;

      // Camera scroll when player moves above middle
      if (playerY < canvas.height / 2 && vy < 0) {
        const delta = -vy;
        playerY += delta;
        currentAltitude += Math.round(delta);
        setScore(currentAltitude);

        platforms.forEach((p) => {
          p.y += delta;
        });
      }

      // Remove platforms below & add on top
      for (let i = platforms.length - 1; i >= 0; i--) {
        if (platforms[i].y > canvas.height) {
          platforms.splice(i, 1);
          const topY = Math.min(...platforms.map((p) => p.y));
          platforms.push({
            x: Math.random() * (canvas.width - 65),
            y: topY - 75 - Math.random() * 20,
            width: 55 + Math.random() * 15,
            hasCoin: Math.random() > 0.4,
          });
        }
      }

      // Platform bounce collision (only falling downwards)
      if (vy > 0) {
        platforms.forEach((p) => {
          if (
            playerX + 12 > p.x &&
            playerX - 12 < p.x + p.width &&
            playerY + 16 >= p.y &&
            playerY + 16 <= p.y + 12
          ) {
            vy = -9.5;
            sounds.playTap();
          }
        });
      }

      // Check Fall Death
      if (playerY > canvas.height + 30) {
        setGameOver(true);
        setIsPlaying(false);
        sounds.playError();
        const earned = Math.floor(currentAltitude * 1.5);
        submitMiniGameResult('jump', currentAltitude, earned);
        return;
      }

      // Render
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background stars
      ctx.fillStyle = '#0a0d1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw platforms
      platforms.forEach((p) => {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.width, 10, 5);
        ctx.fill();

        if (p.hasCoin) {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(p.x + p.width / 2, p.y - 10, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Hamster Hero
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(playerX, playerY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Ears & Eyes
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(playerX - 9, playerY - 12, 5, 0, Math.PI * 2);
      ctx.arc(playerX + 9, playerY - 12, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(playerX - 4, playerY - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(playerX + 4, playerY - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, submitMiniGameResult]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.miniGames.backToArcade}</span>
        </button>
        <div className="text-sm font-bold text-purple-400">{t.miniGames.jump.title}</div>
      </div>

      {!isPlaying && !gameOver && (
        <div className="w-full glass-panel rounded-2xl p-6 text-center border border-slate-800">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-lg font-bold text-slate-100">{t.miniGames.jump.title}</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
            {t.miniGames.jump.instructions}
          </p>
          <button
            onClick={startGame}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            {t.miniGames.playNow}
          </button>
        </div>
      )}

      {/* Canvas Viewport */}
      {(isPlaying || gameOver) && (
        <div className="relative w-full flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2 px-2 text-xs font-mono font-bold text-slate-200">
            <span>Altitude: {score}m</span>
            <span className="text-amber-400">+{Math.floor(score * 1.5)} π</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <canvas ref={canvasRef} width={320} height={420} className="w-full block" />

            {gameOver && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                <h3 className="text-base font-bold text-rose-400">{t.miniGames.gameOver}</h3>
                <div className="text-xl font-bold font-mono text-slate-100 my-1">{score}m</div>
                <div className="text-xs text-emerald-400 font-bold mb-3">
                  +{Math.floor(score * 1.5).toLocaleString()} Points Earned!
                </div>
                <button
                  onClick={startGame}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  {t.miniGames.playAgain}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Touch Controls for Steering */}
          <div className="w-full max-w-[320px] grid grid-cols-2 gap-3 mt-3">
            <button
              onMouseDown={() => (keysRef.current.left = true)}
              onMouseUp={() => (keysRef.current.left = false)}
              onTouchStart={() => (keysRef.current.left = true)}
              onTouchEnd={() => (keysRef.current.left = false)}
              className="py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm active:bg-purple-900/60"
            >
              ← Left
            </button>
            <button
              onMouseDown={() => (keysRef.current.right = true)}
              onMouseUp={() => (keysRef.current.right = false)}
              onTouchStart={() => (keysRef.current.right = true)}
              onTouchEnd={() => (keysRef.current.right = false)}
              className="py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm active:bg-purple-900/60"
            >
              Right →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 5: DAILY PI QUIZ
   ========================================================================= */
const DailyQuizGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language, submitMiniGameResult } = useGame();
  const t = translations[language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentIndex];
  const qText = language === 'ar' ? question.questionAr : question.questionEn;
  const options = language === 'ar' ? question.optionsAr : question.optionsEn;
  const explanation = language === 'ar' ? question.explanationAr : question.explanationEn;

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === question.correctIndex) {
      sounds.playCoin();
      setCorrectCount((c) => c + 1);
    } else {
      sounds.playError();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((c) => c + 1);
      setSelectedOption(null);
    } else {
      sounds.playFanfare();
      setIsFinished(true);
      const points = correctCount * 500;
      submitMiniGameResult('quiz', correctCount, points);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.miniGames.backToArcade}</span>
        </button>
        <div className="text-sm font-bold text-rose-400">{t.miniGames.quiz.title}</div>
      </div>

      {!isFinished ? (
        <div className="w-full glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-3 font-semibold">
            <span>
              {t.miniGames.quiz.question} {currentIndex + 1} / {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-amber-400">{correctCount} Correct</span>
          </div>

          <h3 className="text-sm font-bold text-slate-100 leading-snug mb-4">{qText}</h3>

          <div className="flex flex-col gap-2">
            {options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = idx === question.correctIndex;
              let style = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';

              if (selectedOption !== null) {
                if (isCorrect) style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                else if (isChosen) style = 'bg-rose-950/80 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`p-3 rounded-xl border text-xs text-left font-medium transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {selectedOption !== null && isChosen && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <p className="text-xs text-slate-400 mb-3">{explanation}</p>
              <button
                onClick={handleNext}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                {t.miniGames.quiz.nextQuestion}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full glass-panel-gold rounded-2xl p-6 text-center border border-amber-500/40">
          <div className="text-4xl mb-2">🎓</div>
          <h2 className="text-lg font-bold text-amber-300">Quiz Completed!</h2>
          <div className="text-xl font-bold font-mono text-slate-100 my-2">
            {correctCount} / {QUIZ_QUESTIONS.length}
          </div>
          <div className="text-xs text-emerald-400 font-bold mb-4">
            +{(correctCount * 500).toLocaleString()} Points Claimed!
          </div>
          <button
            onClick={onBack}
            className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            {t.miniGames.backToArcade}
          </button>
        </div>
      )}
    </div>
  );
};
