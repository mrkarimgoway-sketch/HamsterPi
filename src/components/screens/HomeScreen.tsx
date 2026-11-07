import React, { useState } from 'react';
import { Zap, Sparkles, Trophy, ChevronRight, Gift, Flame } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { HAMSTER_SKINS } from '../../data/initialData';
import { TabType } from '../Navigation';

interface HomeScreenProps {
  onNavigate: (tab: TabType) => void;
  onOpenLeaderboard: () => void;
  onOpenDailyModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenLeaderboard,
  onOpenDailyModal,
}) => {
  const {
    language,
    profile,
    balance,
    stats,
    energy,
    floatingTexts,
    handleHamsterTap,
    activeSkin,
    adminSettings,
  } = useGame();

  const t = translations[language];
  const skin = HAMSTER_SKINS[activeSkin] || HAMSTER_SKINS.default;

  const [isTapped, setIsTapped] = useState(false);
  const [combo, setCombo] = useState(0);
  const comboTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 90);

    // Increase combo
    setCombo((c) => Math.min(c + 1, 50));
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = setTimeout(() => {
      setCombo(0);
    }, 1200);

    handleHamsterTap(e);
  };

  const energyPercent = Math.min(100, Math.max(0, (energy.current / energy.max) * 100));

  // Calculate Next Level Target
  const levelThresholds = [
    0, 1500, 5000, 15000, 45000, 120000, 350000, 1000000, 3000000, 10000000,
  ];
  const currentThreshold = levelThresholds[stats.level - 1] || 0;
  const nextThreshold = levelThresholds[stats.level] || levelThresholds[levelThresholds.length - 1];
  const levelProgress = Math.min(
    100,
    Math.max(
      0,
      ((balance.lifetimePoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    )
  );

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[calc(100vh-130px)] px-4 py-2 pb-24 max-w-md mx-auto select-none">
      {/* Broadcast Announcement Bar */}
      {adminSettings.broadcastNotice && (
        <div className="w-full mb-3 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between text-xs text-purple-200">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-amber-400">📢</span>
            <span className="truncate">{adminSettings.broadcastNotice}</span>
          </div>
          <button
            onClick={() => onNavigate('missions')}
            className="text-[10px] text-amber-300 font-bold shrink-0 hover:underline"
          >
            {t.missions.claim} →
          </button>
        </div>
      )}

      {/* Top Status & Level Card */}
      <div className="w-full glass-panel rounded-2xl p-3 border border-slate-800/80 mb-2">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{stats.levelTitle}</span>
            <span className="text-[11px] text-slate-400 font-normal">
              · {t.game.level} {stats.level}
            </span>
          </div>
          <button
            onClick={onOpenLeaderboard}
            className="text-[11px] text-amber-400/90 font-medium hover:text-amber-300 flex items-center gap-0.5"
          >
            <span>Rank #5</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Level XP Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-300 shadow-sm shadow-amber-500/50"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
          <span>{Math.floor(balance.lifetimePoints).toLocaleString()} pts</span>
          <span>Next: {nextThreshold.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Quick Action Badges */}
      <div className="w-full grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={onOpenDailyModal}
          className="glass-panel-gold rounded-xl p-2.5 flex items-center justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200">{t.missions.dailyLogin}</div>
              <div className="text-[10px] text-amber-400/80 font-medium">
                Day {stats.loginStreak} Streak
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-300">Claim</span>
        </button>

        <button
          onClick={() => onNavigate('games')}
          className="glass-panel-purple rounded-xl p-2.5 flex items-center justify-between text-left hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-200">{t.miniGames.title}</div>
              <div className="text-[10px] text-purple-400/80 font-medium">5 Games</div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-purple-300">Play</span>
        </button>
      </div>

      {/* Active Booster Indicator */}
      {stats.activeBoosterExpiresAt && Date.now() < stats.activeBoosterExpiresAt && (
        <div className="w-full mb-2.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-amber-500/20 border border-amber-400/50 flex items-center justify-between text-xs font-bold text-amber-300 animate-pulse">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>{stats.activeBoosterMultiplier}x Hyper Booster Active!</span>
          </div>
          <span className="text-[10px] font-mono text-purple-200">
            {Math.max(1, Math.round((stats.activeBoosterExpiresAt - Date.now()) / (1000 * 60)))}m left
          </span>
        </div>
      )}

      {/* Main Interactive Hamster Character */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-auto py-2 w-full">
        {/* Combo Indicator */}
        {combo > 3 && (
          <div className="absolute top-0 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider animate-bounce shadow-lg shadow-amber-500/40 z-20">
            {combo}x Combo! 🔥
          </div>
        )}

        {/* Ambient Halo Glow */}
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-amber-500/15 via-purple-600/15 to-transparent blur-3xl pointer-events-none animate-aura" />

        {/* Outer Circular Aura Border */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-b from-amber-500/40 via-purple-600/30 to-amber-500/10 shadow-2xl flex items-center justify-center">
          {/* Inner Clickable Hamster Disc */}
          <button
            onClick={handleTap}
            onTouchStart={handleTap}
            disabled={energy.current <= 0}
            className={`group relative w-full h-full rounded-full overflow-hidden border-4 border-amber-400/50 shadow-inner focus:outline-none transition-transform duration-75 select-none ${
              isTapped ? 'scale-90 rotate-1' : 'hover:scale-[1.02]'
            } ${energy.current <= 0 ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer active:scale-90'}`}
          >
            <img
              src={skin.image}
              alt={skin.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />

            {/* Subtle Gradient Ring Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-white/10 pointer-events-none" />

            {/* Energy Empty Warning */}
            {energy.current <= 0 && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                <Zap className="w-8 h-8 text-amber-500 mb-1 animate-pulse" />
                <span className="text-xs font-bold text-amber-300">{t.game.recharging}</span>
              </div>
            )}
          </button>
        </div>

        {/* Floating Tap Text Pops */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className={`fixed pointer-events-none z-50 font-black tracking-tight drop-shadow-md select-none transition-all duration-700 ease-out ${
              ft.isCrit
                ? 'text-yellow-300 text-2xl font-mono'
                : 'text-amber-400 text-xl font-mono'
            }`}
            style={{
              left: `${ft.x}px`,
              top: `${ft.y}px`,
              transform: 'translate(-50%, -100%)',
              animation: 'floatUp 0.9s forwards',
            }}
          >
            {ft.text}
            {ft.isCrit && (
              <span className="text-[10px] text-rose-400 block -mt-1 font-sans">
                {t.game.criticalHit}
              </span>
            )}
          </div>
        ))}

        {/* Tap Helper Hint */}
        <div className="mt-4 text-xs font-medium text-slate-400 text-center flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>+{stats.tapPower} per tap · {t.game.tapToEarn}</span>
        </div>
      </div>

      {/* Bottom Energy Meter Bar */}
      <div className="w-full glass-panel rounded-2xl p-3 border border-slate-800/80 mt-auto">
        <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{t.game.energy}</span>
          </div>
          <div className="text-slate-300 font-mono">
            {Math.floor(energy.current)} / {energy.max}
            <span className="text-[10px] text-emerald-400 ml-1.5 font-sans">
              (+{energy.regenRatePerSec}/s)
            </span>
          </div>
        </div>

        {/* Energy Bar Fill */}
        <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 rounded-full transition-all duration-150"
            style={{ width: `${energyPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
