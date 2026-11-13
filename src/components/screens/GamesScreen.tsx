import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trophy,
  ArrowLeft,
  Clock,
  Sparkles,
  Play,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { sounds } from '../../services/sound';

type ActiveGameKey = 'none' | 'rush' | 'memory' | 'puzzle' | 'jump' | 'subway';

export const GamesScreen: React.FC = () => {
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
        <SubwayRunnerGame onBack={() => setActiveGame('none')} />
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
      key: 'subway' as ActiveGameKey,
      title: t.miniGames.subway.title,
      desc: t.miniGames.subway.desc,
      icon: '🚇',
      color: 'from-cyan-600 to-purple-600',
      badge: 'Metro Runner',
      rewardRate: 'Up to 8,000 π',
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
   GAME 5: HAMSTER METRO DASH (Mini 3-lane Subway Runner with Time Pickups)
   ========================================================================= */
interface SubwayEntity {
  id: number;
  lane: 0 | 1 | 2;
  depth: number; // 0 (horizon) -> 1.15 (past player)
  type: 'coin' | 'seed' | 'clock' | 'hurdle' | 'train';
  collected?: boolean;
}

interface SubwayPop {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number; // 1 -> 0
}

const SubwayRunnerGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language, submitMiniGameResult } = useGame();
  const t = translations[language];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [clocksGrabbed, setClocksGrabbed] = useState(0);
  const [timeFlash, setTimeFlash] = useState<'none' | 'boost' | 'hit'>('none');

  // Mutable simulation refs for 60fps loop
  const targetLaneRef = useRef<0 | 1 | 2>(1);
  const currentLaneRef = useRef<number>(1);
  const jumpHeightRef = useRef<number>(0);
  const jumpVelRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const submitGuardRef = useRef<boolean>(false);

  const moveLane = useCallback((dir: -1 | 1) => {
    targetLaneRef.current = Math.max(0, Math.min(2, targetLaneRef.current + dir)) as 0 | 1 | 2;
    sounds.playTap();
  }, []);

  const triggerJump = useCallback(() => {
    if (jumpHeightRef.current <= 0.03) {
      jumpVelRef.current = 0.115;
      sounds.playTap(true);
    }
  }, []);

  const startGame = () => {
    targetLaneRef.current = 1;
    currentLaneRef.current = 1;
    jumpHeightRef.current = 0;
    jumpVelRef.current = 0;
    submitGuardRef.current = false;
    setScore(0);
    setTimeLeft(30);
    setClocksGrabbed(0);
    setTimeFlash('none');
    setGameState('playing');
  };

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveLane(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveLane(1);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, moveLane, triggerJump]);

  // Main 60fps canvas loop
  useEffect(() => {
    if (gameState !== 'playing' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const horizonY = 66;
    const playerY = 330;
    const topHalfW = 46;
    const bottomHalfW = 144;

    const project = (laneFloat: number, depth: number) => {
      const eased = Math.pow(Math.max(0, depth), 1.45);
      const y = horizonY + eased * (playerY - horizonY);
      const trackHalfW = topHalfW + (bottomHalfW - topHalfW) * Math.pow(Math.max(0, depth), 1.35);
      const x = W / 2 + (laneFloat - 1) * (trackHalfW * 0.66);
      const scale = 0.24 + 0.88 * Math.pow(Math.max(0, depth), 1.2);
      return { x, y, scale, trackHalfW };
    };

    let animId = 0;
    let lastTs = performance.now();
    let timerSec = 30.0;
    let currentScore = 0;
    let distanceAcc = 0;
    let clocksCount = 0;
    let speed = 0.42; // depth units per sec
    let spawnCooldown = 0.55;
    let trackPhase = 0;
    let invuln = 0;
    let shake = 0;
    let entityIdSeq = 1;
    let popIdSeq = 1;
    const entities: SubwayEntity[] = [];
    const pops: SubwayPop[] = [];

    const addPop = (x: number, y: number, text: string, color: string) => {
      pops.push({ id: popIdSeq++, x, y, text, color, life: 1 });
    };

    const spawnWave = () => {
      const lanes: (0 | 1 | 2)[] = [0, 1, 2];
      // Shuffle lanes
      for (let i = lanes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lanes[i], lanes[j]] = [lanes[j], lanes[i]];
      }

      const roll = Math.random();
      const obstacleCount = roll < 0.35 ? 0 : roll < 0.78 ? 1 : 2;
      const blockedLanes = new Set<number>();

      for (let i = 0; i < obstacleCount; i++) {
        const lane = lanes[i];
        blockedLanes.add(lane);
        const obsType: 'hurdle' | 'train' = Math.random() < 0.55 ? 'hurdle' : 'train';
        entities.push({ id: entityIdSeq++, lane, depth: 0.02, type: obsType });
      }

      // Spawn pickup in an open lane (higher clock chance when time < 12s)
      const openLanes = ([0, 1, 2] as (0 | 1 | 2)[]).filter((l) => !blockedLanes.has(l));
      if (openLanes.length > 0) {
        const pickupLane = openLanes[Math.floor(Math.random() * openLanes.length)];
        const clockProb = timerSec < 12 ? 0.36 : 0.22;
        const pRoll = Math.random();
        const pickupType: 'clock' | 'seed' | 'coin' =
          pRoll < clockProb ? 'clock' : pRoll < clockProb + 0.24 ? 'seed' : 'coin';
        entities.push({ id: entityIdSeq++, lane: pickupLane, depth: 0.02, type: pickupType });
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;

      // Update countdown & speed ramp
      timerSec = Math.max(0, timerSec - dt);
      speed = Math.min(0.88, speed + dt * 0.0095);
      trackPhase = (trackPhase + dt * speed * 9) % 1;
      if (invuln > 0) invuln = Math.max(0, invuln - dt);
      if (shake > 0) shake = Math.max(0, shake - dt * 18);

      // Distance points
      distanceAcc += dt * speed * 55;
      if (distanceAcc >= 1) {
        const pts = Math.floor(distanceAcc);
        distanceAcc -= pts;
        currentScore += pts;
      }

      // Smooth lane lerp & jump arc
      currentLaneRef.current += (targetLaneRef.current - currentLaneRef.current) * Math.min(1, dt * 15);
      if (jumpHeightRef.current > 0 || jumpVelRef.current > 0) {
        jumpHeightRef.current += jumpVelRef.current * (dt * 60);
        jumpVelRef.current -= 0.0068 * (dt * 60);
        if (jumpHeightRef.current <= 0) {
          jumpHeightRef.current = 0;
          jumpVelRef.current = 0;
        }
      }

      // Spawn waves
      spawnCooldown -= dt;
      if (spawnCooldown <= 0) {
        spawnWave();
        spawnCooldown = Math.max(0.42, 0.92 - (speed - 0.42) * 0.8);
      }

      // Advance entities & check collisions near player depth (0.88 .. 1.02)
      const playerProj = project(currentLaneRef.current, 0.95);
      for (let i = entities.length - 1; i >= 0; i--) {
        const ent = entities[i];
        ent.depth += dt * speed;

        if (!ent.collected && ent.depth >= 0.87 && ent.depth <= 1.03) {
          const laneDist = Math.abs(ent.lane - currentLaneRef.current);
          if (laneDist < 0.45) {
            if (ent.type === 'coin' || ent.type === 'seed' || ent.type === 'clock') {
              ent.collected = true;
              if (ent.type === 'coin') {
                currentScore += 15;
                sounds.playCoin();
                addPop(playerProj.x, playerProj.y - 46, '+15', '#fbbf24');
              } else if (ent.type === 'seed') {
                currentScore += 35;
                sounds.playCoin();
                addPop(playerProj.x, playerProj.y - 46, '+35', '#fde047');
              } else {
                timerSec += 4.0;
                clocksCount += 1;
                setClocksGrabbed(clocksCount);
                sounds.playUpgrade();
                setTimeFlash('boost');
                setTimeout(() => setTimeFlash('none'), 450);
                addPop(playerProj.x, playerProj.y - 54, '+4s ⏱️', '#34d399');
              }
            } else if (ent.type === 'hurdle') {
              // Jump over hurdle if high enough
              if (jumpHeightRef.current < 0.36 && invuln <= 0) {
                ent.collected = true;
                timerSec = Math.max(0, timerSec - 5.0);
                invuln = 0.85;
                shake = 6;
                sounds.playError();
                setTimeFlash('hit');
                setTimeout(() => setTimeFlash('none'), 450);
                addPop(playerProj.x, playerProj.y - 50, '-5s!', '#fb7185');
              }
            } else if (ent.type === 'train') {
              if (invuln <= 0) {
                ent.collected = true;
                timerSec = Math.max(0, timerSec - 6.0);
                invuln = 1.0;
                shake = 8;
                sounds.playError();
                setTimeFlash('hit');
                setTimeout(() => setTimeFlash('none'), 450);
                addPop(playerProj.x, playerProj.y - 52, '-6s!', '#f43f5e');
              }
            }
          }
        }

        if (ent.depth > 1.18 || ent.collected) {
          entities.splice(i, 1);
        }
      }

      // Update floating pops
      for (let i = pops.length - 1; i >= 0; i--) {
        pops[i].y -= dt * 38;
        pops[i].life -= dt * 1.6;
        if (pops[i].life <= 0) pops.splice(i, 1);
      }

      setScore(currentScore);
      setTimeLeft(Number(timerSec.toFixed(1)));

      // Check countdown end
      if (timerSec <= 0) {
        if (!submitGuardRef.current) {
          submitGuardRef.current = true;
          const reward = Math.max(150, Math.floor(currentScore * 4));
          submitMiniGameResult('subway', currentScore, reward);
          sounds.playFanfare();
        }
        setGameState('gameover');
        return;
      }

      // ==================== RENDER ====================
      ctx.save();
      if (shake > 0) {
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      }

      // 1. Cyber Metro Sky / Tunnel Backdrop
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#070514');
      skyGrad.addColorStop(0.22, '#1e103d');
      skyGrad.addColorStop(1, '#090d1e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Tunnel arches
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(W / 2, horizonY + 8, 52, Math.PI, 0);
      ctx.stroke();

      // 2. Track Surface Trapezoid
      ctx.fillStyle = '#0f162b';
      ctx.beginPath();
      ctx.moveTo(W / 2 - topHalfW, horizonY);
      ctx.lineTo(W / 2 + topHalfW, horizonY);
      ctx.lineTo(W / 2 + bottomHalfW, H);
      ctx.lineTo(W / 2 - bottomHalfW, H);
      ctx.closePath();
      ctx.fill();

      // Glowing Side Rails
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(W / 2 - topHalfW, horizonY);
      ctx.lineTo(W / 2 - bottomHalfW, H);
      ctx.moveTo(W / 2 + topHalfW, horizonY);
      ctx.lineTo(W / 2 + bottomHalfW, H);
      ctx.stroke();

      // Lane Dividers (2 inner lines separating 3 lanes)
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.lineWidth = 1.5;
      [-0.33, 0.33].forEach((offsetRatio) => {
        ctx.beginPath();
        ctx.moveTo(W / 2 + topHalfW * offsetRatio, horizonY);
        ctx.lineTo(W / 2 + bottomHalfW * offsetRatio, H);
        ctx.stroke();
      });

      // Scrolling Horizontal Railway Sleepers
      for (let i = 0; i < 9; i++) {
        const d = ((i + trackPhase) / 9);
        const eased = Math.pow(d, 1.45);
        const ry = horizonY + eased * (H - horizonY);
        const hw = topHalfW + (bottomHalfW - topHalfW) * Math.pow(d, 1.35);
        ctx.strokeStyle = `rgba(148, 163, 184, ${0.08 + d * 0.22})`;
        ctx.lineWidth = 1 + d * 2;
        ctx.beginPath();
        ctx.moveTo(W / 2 - hw + 4, ry);
        ctx.lineTo(W / 2 + hw - 4, ry);
        ctx.stroke();
      }

      // 3. Draw Entities back-to-front (far -> near)
      const sorted = [...entities].sort((a, b) => a.depth - b.depth);
      for (const ent of sorted) {
        const p = project(ent.lane, ent.depth);
        const s = p.scale;

        if (ent.type === 'coin') {
          const r = 13 * s;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(p.x, p.y - r, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2 * s;
          ctx.stroke();
          ctx.fillStyle = '#0f172a';
          ctx.font = `bold ${Math.max(8, Math.round(13 * s))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('π', p.x, p.y - r + 1);
        } else if (ent.type === 'seed') {
          const r = 14 * s;
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.ellipse(p.x, p.y - r, r * 0.85, r * 1.1, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(p.x, p.y - r * 1.65, r * 0.72, Math.PI, 0);
          ctx.fill();
        } else if (ent.type === 'clock') {
          const r = 16 * s;
          // Outer time aura
          ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
          ctx.beginPath();
          ctx.arc(p.x, p.y - r - 2, r * 1.45, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(p.x, p.y - r - 2, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#a7f3d0';
          ctx.lineWidth = 2.2 * s;
          ctx.stroke();

          ctx.fillStyle = '#022c22';
          ctx.font = `bold ${Math.max(8, Math.round(11 * s))}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('+4s', p.x, p.y - r - 1);
        } else if (ent.type === 'hurdle') {
          const w = 48 * s;
          const h = 20 * s;
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.roundRect(p.x - w / 2, p.y - h, w, h, 4 * s);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(p.x - w * 0.36, p.y - h * 0.65, w * 0.22, h * 0.3);
          ctx.fillRect(p.x + w * 0.14, p.y - h * 0.65, w * 0.22, h * 0.3);
        } else if (ent.type === 'train') {
          const w = 54 * s;
          const h = 64 * s;
          // Train body
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.roundRect(p.x - w / 2, p.y - h, w, h, 8 * s);
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2 * s;
          ctx.stroke();
          // Windshield
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.roundRect(p.x - w * 0.36, p.y - h * 0.84, w * 0.72, h * 0.32, 4 * s);
          ctx.fill();
          // Headlights
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(p.x - w * 0.24, p.y - h * 0.24, 4.5 * s, 0, Math.PI * 2);
          ctx.arc(p.x + w * 0.24, p.y - h * 0.24, 4.5 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Draw Hamster Runner Hero
      const jumpPx = jumpHeightRef.current * 58;
      // Ground shadow
      const shadowScale = Math.max(0.45, 1 - jumpHeightRef.current * 0.45);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(playerProj.x, playerProj.y + 4, 20 * shadowScale, 7 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Blink if invulnerable
      const showHamster = invuln <= 0 || Math.floor(invuln * 16) % 2 === 0;
      if (showHamster) {
        const hy = playerProj.y - 22 - jumpPx;
        // Purple cape
        ctx.fillStyle = '#9333ea';
        ctx.beginPath();
        ctx.moveTo(playerProj.x - 14, hy - 2);
        ctx.lineTo(playerProj.x + 14, hy - 2);
        ctx.lineTo(playerProj.x + 20, hy + 20);
        ctx.lineTo(playerProj.x - 20, hy + 20);
        ctx.closePath();
        ctx.fill();

        // Ears
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(playerProj.x - 12, hy - 14, 6, 0, Math.PI * 2);
        ctx.arc(playerProj.x + 12, hy - 14, 6, 0, Math.PI * 2);
        ctx.fill();

        // Head/Body
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(playerProj.x, hy, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Eyes & Cheeks
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(playerProj.x - 6, hy - 3, 2.8, 0, Math.PI * 2);
        ctx.arc(playerProj.x + 6, hy - 3, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Floating Score / Time Pops
      for (const pop of pops) {
        ctx.globalAlpha = Math.max(0, pop.life);
        ctx.fillStyle = pop.color;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(pop.text, pop.x, pop.y);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, submitMiniGameResult]);

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!touchStartRef.current || gameState !== 'playing') return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 22) {
      moveLane(dx < 0 ? -1 : 1);
    } else if (dy < -22) {
      triggerJump();
    }
  };

  const estimatedReward = Math.max(150, Math.floor(score * 4));

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.miniGames.backToArcade}</span>
        </button>
        <div className="text-sm font-bold text-cyan-300">{t.miniGames.subway.title}</div>
      </div>

      {gameState === 'ready' && (
        <div className="w-full glass-panel rounded-2xl p-6 text-center border border-slate-800">
          <div className="text-4xl mb-3">🚇</div>
          <h2 className="text-lg font-bold text-slate-100">{t.miniGames.subway.title}</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
            {t.miniGames.subway.instructions}
          </p>
          <div className="grid grid-cols-3 gap-2 my-4 text-[11px] font-semibold">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-emerald-300">
              ⏱️ +4s Time
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-amber-300">
              🪙 +15 / 🌰 +35
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-rose-300">
              🚆 Dodge / Jump
            </div>
          </div>
          <button
            onClick={startGame}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            {t.miniGames.playNow}
          </button>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'gameover') && (
        <div className="w-full flex flex-col items-center">
          {/* Top HUD */}
          <div className="w-full flex items-center justify-between mb-2 px-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-xs font-black tabular-nums transition-colors ${
                timeFlash === 'boost'
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                  : timeFlash === 'hit'
                  ? 'bg-rose-500/25 border-rose-400 text-rose-300'
                  : timeLeft <= 7
                  ? 'bg-rose-950/70 border-rose-500/60 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-cyan-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft.toFixed(1)}s</span>
            </div>

            <div className="font-mono text-sm font-bold text-slate-100 tabular-nums">
              {t.miniGames.score}: <span className="text-amber-400">{score}</span>
            </div>

            <div className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
              +{estimatedReward.toLocaleString()} π
            </div>
          </div>

          {/* Canvas Track */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl w-full max-w-[320px]">
            <canvas
              ref={canvasRef}
              width={320}
              height={390}
              onTouchStart={handleCanvasTouchStart}
              onTouchEnd={handleCanvasTouchEnd}
              style={{ touchAction: 'none' }}
              className="w-full block select-none"
            />

            {gameState === 'gameover' && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center">
                <div className="text-3xl mb-1">🚇</div>
                <h3 className="text-lg font-bold text-amber-300">{t.miniGames.gameOver}</h3>
                <div className="text-2xl font-mono font-black text-slate-100 my-1">
                  {score.toLocaleString()} pts
                </div>
                <div className="text-[11px] text-cyan-300 font-semibold mb-1">
                  ⏱️ +{clocksGrabbed * 4}s Extended ({clocksGrabbed} clocks)
                </div>
                <div className="text-xs text-emerald-400 font-bold mb-4">
                  +{estimatedReward.toLocaleString()} Hamster Points Claimed!
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={startGame}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    {t.miniGames.playAgain}
                  </button>
                  <button
                    onClick={onBack}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 font-bold text-xs"
                  >
                    {t.miniGames.backToArcade}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Thumb Controls (Left / Jump / Right) */}
          <div className="w-full max-w-[320px] grid grid-cols-3 gap-2.5 mt-3">
            <button
              type="button"
              onClick={() => moveLane(-1)}
              className="min-h-[48px] rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 active:bg-cyan-950/60 active:scale-95 text-slate-100 font-bold text-xs flex items-center justify-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'ar' ? 'يسار' : 'Left'}</span>
            </button>

            <button
              type="button"
              onClick={triggerJump}
              className="min-h-[48px] rounded-xl bg-gradient-to-r from-purple-700 to-cyan-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-all"
            >
              <ArrowUp className="w-4 h-4" />
              <span>{language === 'ar' ? 'قفز' : 'Jump'}</span>
            </button>

            <button
              type="button"
              onClick={() => moveLane(1)}
              className="min-h-[48px] rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 active:bg-cyan-950/60 active:scale-95 text-slate-100 font-bold text-xs flex items-center justify-center gap-1 transition-all"
            >
              <span>{language === 'ar' ? 'يمين' : 'Right'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5">{t.miniGames.subway.dodgeHint}</div>
        </div>
      )}
    </div>
  );
};

