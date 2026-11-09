import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Trophy, Crown, Medal, Zap, Search, ArrowUp, RefreshCw, Users } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { HAMSTER_SKINS } from '../../data/initialData';
import { MinerLeaderboardEntry } from '../../types/game';
import { dbService } from '../../services/supabaseClient';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const { language, profile, stats, balance } = useGame();
  const t = translations[language];

  // Primary Ranking Mode: Mining Rate (/hr) vs Points Balance
  const [rankingMode, setRankingMode] = useState<'mining_rate' | 'total_points'>('mining_rate');
  const [filterTier, setFilterTier] = useState<'all' | 'top10' | 'top50'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [realMiners, setRealMiners] = useState<MinerLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const playerCardRef = useRef<HTMLDivElement | null>(null);

  // Fetch genuine Pioneers from Supabase
  const loadRealLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await dbService.fetchTopMinersLeaderboard();
      setRealMiners(data as MinerLeaderboardEntry[]);
    } catch (err) {
      console.warn('Error loading real leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRealLeaderboard();
  }, []);

  // Compute live ranking combining real database records with current player
  const { rankedMiners, currentPlayerRank } = useMemo(() => {
    const playerPerHour = stats.passiveRatePerHour || 0;
    const playerPerSec = stats.passiveRatePerSec || (playerPerHour / 3600);
    const pUsername = profile.username || 'You';

    // Remove current player from database list if already present to avoid duplication
    const otherMiners = realMiners.filter(
      (m) => m.username.toLowerCase() !== pUsername.toLowerCase()
    );

    // Current player's genuine live entry
    const playerEntry: MinerLeaderboardEntry = {
      rank: 0,
      username: pUsername,
      level: stats.level,
      levelTitle: stats.levelTitle,
      miningRatePerHour: playerPerHour,
      miningRatePerSec: Math.round(playerPerSec * 10) / 10,
      totalPoints: Math.floor(balance.points),
      skin: profile.currentSkin || 'default',
      isCurrentPlayer: true,
    };

    // Sort genuine players strictly by chosen metric (mining rate or points)
    const combined = [...otherMiners, playerEntry].sort((a, b) => {
      if (rankingMode === 'mining_rate') {
        return b.miningRatePerHour - a.miningRatePerHour;
      }
      return b.totalPoints - a.totalPoints;
    });

    let pRank = 1;
    const assignedRanks = combined.map((item, idx) => {
      const rank = idx + 1;
      if (item.isCurrentPlayer) {
        pRank = rank;
      }
      return { ...item, rank };
    });

    return {
      rankedMiners: assignedRanks,
      currentPlayerRank: pRank,
    };
  }, [realMiners, profile.username, profile.currentSkin, stats.passiveRatePerHour, stats.passiveRatePerSec, stats.level, stats.levelTitle, balance.points, rankingMode]);

  // Apply filters and search
  const displayedMiners = useMemo(() => {
    let list = rankedMiners.slice(0, 100);

    if (filterTier === 'top10') {
      list = list.slice(0, 10);
    } else if (filterTier === 'top50') {
      list = list.slice(0, 50);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.username.toLowerCase().includes(q) ||
          m.levelTitle.toLowerCase().includes(q) ||
          m.rank.toString() === q
      );
    }

    return list;
  }, [rankedMiners, filterTier, searchQuery]);

  const topThree = displayedMiners.slice(0, 3);
  const remainingMiners = displayedMiners.slice(3);

  const handleJumpToPlayer = () => {
    if (playerCardRef.current) {
      playerCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden pb-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span>{t.leaderboard.title}</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.5 rounded-full border border-emerald-800/50">
                  REAL PIONEERS
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">
                {language === 'ar'
                  ? 'لوحة الصدارة الحقيقية لرواد شبكة باي'
                  : 'Live real ranking for verified Pi Network Pioneers'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={loadRealLeaderboard}
              disabled={isLoading}
              title="Refresh Leaderboard"
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Toggle: Mining Rate vs Points */}
        <div className="px-4 pt-3 pb-2 border-b border-slate-900 bg-slate-950">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setRankingMode('mining_rate')}
              className={`py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                rankingMode === 'mining_rate'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t.leaderboard.tabMiningRate}</span>
            </button>
            <button
              onClick={() => setRankingMode('total_points')}
              className={`py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                rankingMode === 'total_points'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{t.leaderboard.tabPoints}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Strip */}
        <div className="px-4 pt-2.5 pb-2 bg-slate-950/80 border-b border-slate-900 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.leaderboard.searchMiners}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setFilterTier('all')}
                className={`px-2 py-1 rounded transition-all ${
                  filterTier === 'all'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.leaderboard.top100}
              </button>
              <button
                onClick={() => setFilterTier('top50')}
                className={`px-2 py-1 rounded transition-all ${
                  filterTier === 'top50'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                50
              </button>
              <button
                onClick={() => setFilterTier('top10')}
                className={`px-2 py-1 rounded transition-all ${
                  filterTier === 'top10'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                10
              </button>
            </div>
          </div>

          {/* Quick Player Status Strip */}
          <div className="flex items-center justify-between text-[11px] bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{t.leaderboard.yourRank}:</span>
              <span className="font-mono font-black text-amber-400">
                #{currentPlayerRank}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-purple-300 font-mono font-bold">
                {rankingMode === 'mining_rate'
                  ? `⚡ +${stats.passiveRatePerHour.toLocaleString()}/hr`
                  : `🏆 ${Math.floor(balance.points).toLocaleString()} π`}
              </span>
            </div>

            <button
              onClick={handleJumpToPlayer}
              className="flex items-center gap-1 text-[10px] text-amber-400 font-bold hover:underline"
            >
              <ArrowUp className="w-3 h-3" />
              <span>{t.leaderboard.jumpToMyRank}</span>
            </button>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {/* Top 3 Podium (Only shown if at least 2 real miners exist and no search filter) */}
          {!searchQuery && filterTier === 'all' && topThree.length >= 2 && (
            <div className="flex items-end justify-center gap-2 pt-5 pb-5 mb-3 border-b border-slate-900 bg-gradient-to-b from-purple-950/20 to-transparent rounded-2xl">
              {/* #2 Silver */}
              {topThree[1] && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-1.5">
                    <img
                      src={HAMSTER_SKINS[topThree[1].skin]?.image || '/images/hamster_mascot_default_1793717666154.jpg'}
                      alt={topThree[1].username}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border-2 border-slate-300 object-cover shadow-md"
                    />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Medal className="w-5 h-5 text-slate-300 drop-shadow" />
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-slate-200 truncate max-w-[85px] text-center">
                    {topThree[1].username}
                  </div>
                  <div className="text-[10px] font-mono text-purple-300 font-bold mt-0.5">
                    {rankingMode === 'mining_rate'
                      ? `⚡ +${topThree[1].miningRatePerHour.toLocaleString()}/hr`
                      : `${topThree[1].totalPoints.toLocaleString()} π`}
                  </div>
                  <div className="w-20 h-14 mt-1.5 rounded-t-xl bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-300 flex items-center justify-center font-black text-slate-300 text-sm shadow">
                    #2
                  </div>
                </div>
              )}

              {/* #1 Gold */}
              {topThree[0] && (
                <div className="flex flex-col items-center -mt-4">
                  <div className="relative mb-2">
                    <img
                      src={HAMSTER_SKINS[topThree[0].skin]?.image || '/images/hamster_mascot_king_1793717667076.jpg'}
                      alt={topThree[0].username}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/30"
                    />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-300 animate-bounce">
                      <Crown className="w-6 h-6 fill-amber-400 text-amber-300" />
                    </div>
                  </div>
                  <div className="text-xs font-black text-amber-300 truncate max-w-[95px] text-center">
                    {topThree[0].username}
                  </div>
                  <div className="text-[10px] font-mono text-amber-300 font-bold mt-0.5 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-700/50">
                    {rankingMode === 'mining_rate'
                      ? `⚡ +${topThree[0].miningRatePerHour.toLocaleString()}/hr`
                      : `${topThree[0].totalPoints.toLocaleString()} π`}
                  </div>
                  <div className="w-24 h-20 mt-1.5 rounded-t-xl bg-gradient-to-t from-amber-950/70 to-amber-600/30 border-t-2 border-amber-400 flex items-center justify-center font-black text-amber-300 text-base shadow-lg">
                    #1
                  </div>
                </div>
              )}

              {/* #3 Bronze */}
              {topThree[2] && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-1.5">
                    <img
                      src={HAMSTER_SKINS[topThree[2].skin]?.image || '/images/hamster_mascot_default_1793717666154.jpg'}
                      alt={topThree[2].username}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border-2 border-amber-700 object-cover shadow-md"
                    />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Medal className="w-5 h-5 text-amber-700 drop-shadow" />
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-slate-200 truncate max-w-[85px] text-center">
                    {topThree[2].username}
                  </div>
                  <div className="text-[10px] font-mono text-amber-500 font-bold mt-0.5">
                    {rankingMode === 'mining_rate'
                      ? `⚡ +${topThree[2].miningRatePerHour.toLocaleString()}/hr`
                      : `${topThree[2].totalPoints.toLocaleString()} π`}
                  </div>
                  <div className="w-20 h-11 mt-1.5 rounded-t-xl bg-gradient-to-t from-slate-900 to-amber-950/50 border-t border-amber-700 flex items-center justify-center font-black text-amber-600 text-sm shadow">
                    #3
                  </div>
                </div>
              )}
            </div>
          )}

          {/* List of Real Miners */}
          <div className="flex flex-col gap-1.5">
            {displayedMiners.map((miner) => {
              const isCurrent = miner.isCurrentPlayer;
              const isTopTen = miner.rank <= 10;

              return (
                <div
                  key={miner.rank + miner.username}
                  ref={isCurrent ? playerCardRef : undefined}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isCurrent
                      ? 'glass-panel-gold border-amber-400 shadow-md shadow-amber-500/20 scale-[1.01] ring-1 ring-amber-400/60'
                      : isTopTen
                      ? 'bg-slate-900/80 border-purple-800/40'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Left: Rank & Avatar & User Info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 text-center font-mono font-black text-xs shrink-0 ${
                        miner.rank === 1
                          ? 'text-amber-300'
                          : miner.rank === 2
                          ? 'text-slate-300'
                          : miner.rank === 3
                          ? 'text-amber-600'
                          : isTopTen
                          ? 'text-purple-300'
                          : 'text-slate-400'
                      }`}
                    >
                      #{miner.rank}
                    </div>

                    <div className="relative shrink-0">
                      <img
                        src={HAMSTER_SKINS[miner.skin]?.image || '/images/hamster_mascot_default_1793717666154.jpg'}
                        alt={miner.username}
                        referrerPolicy="no-referrer"
                        className={`w-8 h-8 rounded-full object-cover border ${
                          isCurrent
                            ? 'border-amber-400 ring-1 ring-amber-400/50'
                            : isTopTen
                            ? 'border-purple-500/60'
                            : 'border-slate-700'
                        }`}
                      />
                      {isCurrent && (
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-slate-950 font-black rounded-full flex items-center justify-center text-[8px]">
                          ★
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-100 truncate max-w-[120px]">
                          {miner.username}
                        </span>
                        {isCurrent && (
                          <span className="text-[8px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded shrink-0">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Lvl {miner.level} · {miner.levelTitle}
                      </div>
                    </div>
                  </div>

                  {/* Right: Real Metrics */}
                  <div className="text-right shrink-0">
                    {rankingMode === 'mining_rate' ? (
                      <>
                        <div className="font-mono font-black text-amber-400 text-xs flex items-center justify-end gap-1">
                          <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>+{miner.miningRatePerHour.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 font-normal">/hr</span>
                        </div>
                        <div className="text-[10px] font-mono text-purple-300">
                          +{miner.miningRatePerSec.toFixed(1)} /s
                        </div>
                      </>
                    ) : (
                      <div className="font-mono font-black text-amber-400 text-xs">
                        {miner.totalPoints.toLocaleString()} π
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {displayedMiners.length <= 1 && (
              <div className="text-center py-6 px-4 glass-panel rounded-2xl border border-slate-800/80 mt-2">
                <Users className="w-8 h-8 text-amber-400/80 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-slate-200">
                  {language === 'ar' ? 'أنت في الصدارة!' : 'You are in the Lead!'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  {language === 'ar'
                    ? 'هذه اللوحة حقيقية 100% ولا تحتوي على مستخدمين وهميين. مع انضمام المزيد من الرواد الحقيقيين سيتنافسون معك هنا!'
                    : 'This leaderboard displays 100% genuine Pioneers with zero fake bots. As real players join via Pi Browser, they will appear here in real time!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pinned Bottom Status Bar for Current Player */}
        <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">
              {t.leaderboard.yourRank}: <strong className="text-amber-400 font-mono">#{currentPlayerRank}</strong>
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-300 font-mono font-bold">
              ⚡ +{stats.passiveRatePerHour.toLocaleString()}/hr
            </span>
          </div>

          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            Real Pi Leaderboard ✓
          </span>
        </div>
      </div>
    </div>
  );
};
