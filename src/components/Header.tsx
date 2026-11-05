import React from 'react';
import { Volume2, VolumeX, Shield, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { translations } from '../services/i18n';
import { HAMSTER_SKINS } from '../data/initialData';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
  onOpenReferrals: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenLeaderboard,
  onOpenReferrals,
}) => {
  const { language, profile, balance, stats, isMuted, toggleSound } = useGame();
  const t = translations[language];
  const skinInfo = HAMSTER_SKINS[profile.currentSkin] || HAMSTER_SKINS.default;

  const formattedPoints = Math.floor(balance.points).toLocaleString();
  const formattedPerHour = stats.passiveRatePerHour.toLocaleString();

  return (
    <header className="sticky top-0 z-30 w-full px-4 py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Pioneer Info & Avatar */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={skinInfo.image}
              alt="Hamster Avatar"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full border-2 border-amber-500/60 object-cover shadow-sm shadow-amber-500/20"
            />
            {profile.isPiConnected && (
              <span
                title="Verified Pi Pioneer"
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold text-amber-300"
              >
                π
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-100 truncate max-w-[110px]">
                {profile.username}
              </span>
              {profile.isPiConnected && (
                <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              )}
            </div>
            <div className="text-[11px] text-amber-400/90 font-medium tracking-tight truncate">
              {stats.levelTitle} · Lvl {stats.level}
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Rank Button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-xs font-semibold text-slate-200 transition-colors"
            title={t.nav.leaderboard}
          >
            <span className="text-amber-400">🏆</span>
            <span className="hidden sm:inline">{t.nav.leaderboard}</span>
          </button>

          {/* Quick Invite Button */}
          <button
            onClick={onOpenReferrals}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-950/40 border border-purple-800/50 hover:border-purple-500 text-xs font-semibold text-purple-200 transition-colors"
            title={t.nav.referrals}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">+{stats.referralCount}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
            aria-label={t.settings.title}
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Game Metric Bar */}
      <div className="max-w-md mx-auto mt-2.5 pt-2 border-t border-slate-900/60 flex items-center justify-between text-xs">
        {/* Total Points */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-[11px] shadow-sm shadow-amber-500/50">
            π
          </div>
          <div>
            <span className="font-mono text-base font-bold text-amber-300 tracking-tight">
              {formattedPoints}
            </span>
          </div>
        </div>

        {/* Passive Rate Per Hour */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span className="text-purple-400 font-medium">⚡ +{formattedPerHour}</span>
          <span>/ hr</span>
        </div>

        {/* Golden Seeds */}
        <div className="flex items-center gap-1 text-[11px] text-amber-200 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/40 font-semibold">
          <span>🌰</span>
          <span>{balance.goldenSeeds}</span>
        </div>
      </div>
    </header>
  );
};
