import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  BatteryCharging,
  Award,
  Cpu,
  Activity,
  Sun,
  Server,
  Atom,
  Crown,
  Eye,
  Lock,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { UpgradeItem } from '../../types/game';

export const UpgradesScreen: React.FC = () => {
  const { language, balance, stats, upgrades, buyUpgrade } = useGame();
  const t = translations[language];

  const [activeCategory, setActiveCategory] = useState<'hamster' | 'business' | 'special'>('hamster');

  const filteredUpgrades = upgrades.filter((u) => u.category === activeCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-5 h-5 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-purple-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-orange-400" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-300" />;
      case 'Server':
        return <Server className="w-5 h-5 text-indigo-400" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-fuchsia-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-300" />;
      case 'Eye':
        return <Eye className="w-5 h-5 text-cyan-300" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  const getBenefitLabel = (upgrade: UpgradeItem) => {
    switch (upgrade.benefitType) {
      case 'tap_power':
        return t.upgrades.benefitTap.replace('{value}', String(upgrade.baseBenefit));
      case 'passive_per_sec':
        return t.upgrades.benefitPassive.replace('{value}', String(upgrade.baseBenefit));
      case 'max_energy':
        return t.upgrades.benefitEnergy.replace('{value}', String(upgrade.baseBenefit));
      case 'regen_rate':
        return t.upgrades.benefitRegen.replace('{value}', String(upgrade.baseBenefit));
      case 'crit_chance':
        return t.upgrades.benefitCrit.replace('{value}', String(upgrade.baseBenefit));
      default:
        return `+${upgrade.baseBenefit}`;
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] px-4 py-3 pb-24 max-w-md mx-auto">
      {/* Title Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-100">{t.upgrades.title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{t.upgrades.subtitle}</p>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-4">
        <button
          onClick={() => setActiveCategory('hamster')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeCategory === 'hamster'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.upgrades.tabHamster}
        </button>
        <button
          onClick={() => setActiveCategory('business')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeCategory === 'business'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.upgrades.tabBusiness}
        </button>
        <button
          onClick={() => setActiveCategory('special')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeCategory === 'special'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.upgrades.tabSpecial}
        </button>
      </div>

      {/* Upgrades List */}
      <div className="flex flex-col gap-3">
        {filteredUpgrades.map((upgrade) => {
          const cost = Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel));
          const canAfford = balance.points >= cost;
          const isLevelLocked = stats.level < upgrade.minPlayerLevel;
          const isMaxed = upgrade.category === 'special' && upgrade.currentLevel >= 1;

          const title = language === 'ar' ? upgrade.nameAr : upgrade.name;
          const desc = language === 'ar' ? upgrade.descriptionAr : upgrade.description;

          return (
            <div
              key={upgrade.id}
              className={`glass-panel rounded-2xl p-3.5 border transition-all ${
                isLevelLocked
                  ? 'border-slate-800/40 opacity-70'
                  : canAfford
                  ? 'border-slate-700/80 hover:border-amber-500/40'
                  : 'border-slate-800/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Icon & Details */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                    {getIcon(upgrade.icon)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-100 truncate">{title}</h3>
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-800/40 shrink-0">
                        {t.upgrades.level} {upgrade.currentLevel}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{desc}</p>

                    <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                      <span className="text-emerald-400 font-bold">
                        {getBenefitLabel(upgrade)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buy Action Button */}
                <div className="shrink-0 flex flex-col items-end">
                  {isMaxed ? (
                    <span className="px-3 py-1.5 text-xs font-bold text-slate-400 bg-slate-900 rounded-xl border border-slate-800">
                      {t.upgrades.maxed}
                    </span>
                  ) : isLevelLocked ? (
                    <div className="flex items-center gap-1 text-[10px] text-rose-400 font-semibold bg-rose-950/30 px-2 py-1 rounded-lg border border-rose-900/40">
                      <Lock className="w-3 h-3" />
                      <span>
                        {t.upgrades.reqLevel} {upgrade.minPlayerLevel}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => buyUpgrade(upgrade.id)}
                      disabled={!canAfford}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 active:scale-95 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      <span>{t.upgrades.buy}</span>
                      <span className="text-[10px] font-mono tracking-tight font-black">
                        {cost.toLocaleString()} π
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
