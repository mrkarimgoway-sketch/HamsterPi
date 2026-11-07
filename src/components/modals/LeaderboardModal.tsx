import React, { useState } from 'react';
import { X, Trophy, Crown, Medal, User } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { HAMSTER_SKINS } from '../../data/initialData';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const { language, leaderboard, profile } = useGame();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'global' | 'daily' | 'friends'>('global');

  const topThree = leaderboard.slice(0, 3);
  const remainingPlayers = leaderboard.slice(3);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden pb-safe">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-slate-100">{t.leaderboard.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-5 pt-3">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('global')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'global'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.leaderboard.tabGlobal}
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'daily'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.leaderboard.tabDaily}
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'friends'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.leaderboard.tabFriends}
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Animated Top 3 Podium */}
          <div className="flex items-end justify-center gap-3 pt-6 pb-6 mb-4 border-b border-slate-900">
            {/* 2nd Place (Silver) */}
            {topThree[1] && (
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <img
                    src={HAMSTER_SKINS[topThree[1].skin]?.image || '/images/hamster_mascot_default_1793717666154.jpg'}
                    alt={topThree[1].username}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.includes('/images/')) {
                        target.src = '/images/hamster_mascot_default_1793717666154.jpg';
                      }
                    }}
                    className="w-12 h-12 rounded-full border-2 border-slate-400 object-cover shadow-md"
                  />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-slate-300">
                    <Medal className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
                <div className="text-[11px] font-bold text-slate-200 truncate max-w-[80px] text-center">
                  {topThree[1].username}
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-semibold">
                  {topThree[1].points.toLocaleString()}
                </div>
                <div className="w-20 h-16 mt-2 rounded-t-xl bg-gradient-to-t from-slate-900 to-slate-800/80 border-t border-slate-400 flex items-center justify-center font-bold text-slate-300 text-sm">
                  #2
                </div>
              </div>
            )}

            {/* 1st Place (Gold) */}
            {topThree[0] && (
              <div className="flex flex-col items-center -mt-4">
                <div className="relative mb-2">
                  <img
                    src={HAMSTER_SKINS[topThree[0].skin]?.image || '/images/hamster_mascot_king_1793717667076.jpg'}
                    alt={topThree[0].username}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.includes('/images/')) {
                        target.src = '/images/hamster_mascot_king_1793717667076.jpg';
                      }
                    }}
                    className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover shadow-lg shadow-amber-500/30"
                  />
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-300 animate-bounce">
                    <Crown className="w-6 h-6 fill-amber-400 text-amber-300" />
                  </div>
                </div>
                <div className="text-xs font-bold text-amber-300 truncate max-w-[90px] text-center">
                  {topThree[0].username}
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-bold">
                  {topThree[0].points.toLocaleString()}
                </div>
                <div className="w-24 h-22 mt-2 rounded-t-xl bg-gradient-to-t from-amber-950/60 to-amber-600/30 border-t-2 border-amber-400 flex items-center justify-center font-black text-amber-300 text-lg shadow-lg">
                  #1
                </div>
              </div>
            )}

            {/* 3rd Place (Bronze) */}
            {topThree[2] && (
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <img
                    src={HAMSTER_SKINS[topThree[2].skin]?.image || '/images/hamster_mascot_default_1793717666154.jpg'}
                    alt={topThree[2].username}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.includes('/images/')) {
                        target.src = '/images/hamster_mascot_default_1793717666154.jpg';
                      }
                    }}
                    className="w-12 h-12 rounded-full border-2 border-amber-700 object-cover shadow-md"
                  />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-700">
                    <Medal className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <div className="text-[11px] font-bold text-slate-200 truncate max-w-[80px] text-center">
                  {topThree[2].username}
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-semibold">
                  {topThree[2].points.toLocaleString()}
                </div>
                <div className="w-20 h-12 mt-2 rounded-t-xl bg-gradient-to-t from-slate-900 to-amber-950/40 border-t border-amber-700 flex items-center justify-center font-bold text-amber-600 text-sm">
                  #3
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="flex flex-col gap-2">
            {remainingPlayers.map((item) => (
              <div
                key={item.rank}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  item.isCurrentPlayer
                    ? 'glass-panel-gold border-amber-500/80 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-400 w-6 text-center">
                    #{item.rank}
                  </span>
                  <div className="flex items-center gap-2">
                    <img
                      src={HAMSTER_SKINS[item.skin]?.image || '/images/hamster_mascot_default_1793717666154.jpg'}
                      alt={item.username}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.src.includes('/images/')) {
                          target.src = '/images/hamster_mascot_default_1793717666154.jpg';
                        }
                      }}
                      className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span>{item.username}</span>
                        {item.isCurrentPlayer && (
                          <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.levelTitle}</div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-amber-400">
                    {item.points.toLocaleString()} π
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
