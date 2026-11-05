import React from 'react';
import {
  Shield,
  ShieldCheck,
  Trophy,
  Zap,
  MousePointerClick,
  Sparkles,
  TrendingUp,
  Gamepad2,
  Coins,
  Crown,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { HAMSTER_SKINS } from '../../data/initialData';
import { HamsterSkin } from '../../types/game';

interface ProfileScreenProps {
  onOpenAdmin: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenAdmin }) => {
  const {
    language,
    profile,
    stats,
    balance,
    achievements,
    activeSkin,
    setSkin,
    connectPiAccount,
    upgrades,
  } = useGame();

  const t = translations[language];

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'MousePointerClick':
        return <MousePointerClick className="w-5 h-5 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'Coins':
        return <Coins className="w-5 h-5 text-amber-300" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-yellow-300" />;
      default:
        return <Trophy className="w-5 h-5 text-amber-400" />;
    }
  };

  // Check which skins are unlocked
  const hasKingSkin = (upgrades.find((u) => u.id === 'royal_crown')?.currentLevel || 0) >= 1;
  const hasCyberSkin = (upgrades.find((u) => u.id === 'cyber_visor')?.currentLevel || 0) >= 1;

  const skinUnlocked: Record<HamsterSkin, boolean> = {
    default: true,
    king: hasKingSkin,
    cyber: hasCyberSkin,
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] px-4 py-3 pb-24 max-w-md mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">{t.profile.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{profile.displayName}</p>
        </div>

        {/* Secret Admin Entry Button (Accessible to Pioneer testing) */}
        <button
          onClick={onOpenAdmin}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          {t.nav.admin}
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={HAMSTER_SKINS[activeSkin].image}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full border-2 border-amber-500/80 object-cover shadow-lg shadow-amber-500/20"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 rounded-full border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-amber-300">
              π
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-slate-100 truncate">{profile.username}</h2>
              {profile.isPiConnected && (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </div>

            <div className="text-xs text-amber-400 font-semibold mt-0.5">
              {stats.levelTitle} · Level {stats.level}
            </div>

            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Ref Code:</span>
              <strong className="font-mono text-slate-200">{profile.referralCode}</strong>
            </div>
          </div>
        </div>

        {/* Pi Network Verification Banner / Button */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          {profile.isPiConnected ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs">
              <div className="flex items-center gap-2 text-purple-200">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>{t.profile.piConnected}</span>
              </div>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          ) : (
            <button
              onClick={connectPiAccount}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-900/30 active:scale-98 transition-all"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>{t.profile.connectPi}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Costume / Skin Selector */}
      <div className="mb-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          {t.profile.switchSkin}
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {(Object.keys(HAMSTER_SKINS) as HamsterSkin[]).map((skinKey) => {
            const skinItem = HAMSTER_SKINS[skinKey];
            const isUnlocked = skinUnlocked[skinKey];
            const isSelected = activeSkin === skinKey;

            return (
              <button
                key={skinKey}
                onClick={() => {
                  if (isUnlocked) setSkin(skinKey);
                }}
                disabled={!isUnlocked}
                className={`group relative rounded-2xl p-2.5 flex flex-col items-center border transition-all text-center select-none ${
                  isSelected
                    ? 'glass-panel-gold border-amber-400 shadow-md shadow-amber-500/20'
                    : isUnlocked
                    ? 'glass-panel border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/80 border-slate-900 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden mb-1.5 border border-slate-700 shadow-inner">
                  <img
                    src={skinItem.image}
                    alt={skinItem.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                      <span className="text-xs">🔒</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-bold text-slate-200 truncate w-full">
                  {language === 'ar' ? skinItem.nameAr : skinItem.name}
                </div>

                <div className="text-[9px] text-slate-400 mt-0.5">
                  {isSelected ? (
                    <span className="text-amber-400 font-bold">Active</span>
                  ) : isUnlocked ? (
                    <span>Equip</span>
                  ) : (
                    <span>Locked</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Player Statistics Grid */}
      <div className="mb-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          {t.profile.statsOverview}
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div className="glass-panel rounded-xl p-3 border border-slate-800">
            <div className="text-[11px] text-slate-400">{t.profile.totalTaps}</div>
            <div className="text-base font-bold font-mono text-slate-100 mt-0.5">
              {stats.totalTaps.toLocaleString()}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-3 border border-slate-800">
            <div className="text-[11px] text-slate-400">{t.profile.tapPower}</div>
            <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
              +{stats.tapPower} / tap
            </div>
          </div>

          <div className="glass-panel rounded-xl p-3 border border-slate-800">
            <div className="text-[11px] text-slate-400">{t.profile.passiveSec}</div>
            <div className="text-base font-bold font-mono text-purple-300 mt-0.5">
              +{stats.passiveRatePerSec.toFixed(1)} /s
            </div>
          </div>

          <div className="glass-panel rounded-xl p-3 border border-slate-800">
            <div className="text-[11px] text-slate-400">{t.profile.critChance}</div>
            <div className="text-base font-bold font-mono text-yellow-300 mt-0.5">
              {Math.round(stats.criticalChance * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          {t.profile.achievements}
        </h3>

        <div className="flex flex-col gap-2">
          {achievements.map((ach) => {
            const title = language === 'ar' ? ach.titleAr : ach.title;
            const desc = language === 'ar' ? ach.descriptionAr : ach.description;
            const progPercent = Math.min(
              100,
              Math.round((ach.progress / ach.maxProgress) * 100)
            );

            return (
              <div
                key={ach.id}
                className={`glass-panel rounded-xl p-3 border transition-all ${
                  ach.unlocked
                    ? 'border-amber-500/40 bg-amber-950/10'
                    : 'border-slate-800/80 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      {getAchievementIcon(ach.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-100">{title}</h4>
                        {ach.unlocked && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono font-bold text-amber-400">
                      +{ach.rewardPoints.toLocaleString()} π
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
