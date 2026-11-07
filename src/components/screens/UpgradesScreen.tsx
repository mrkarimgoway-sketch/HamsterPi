import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  BatteryCharging,
  Battery,
  Award,
  Cpu,
  Activity,
  Sun,
  Server,
  Atom,
  Crown,
  Eye,
  Lock,
  Target,
  Crosshair,
  Factory,
  Flame,
  Gauge,
  TrendingUp,
  Compass,
  Shield,
  ShieldAlert,
  Dices,
  ChevronRight,
  Sparkle,
  Globe,
  Coins,
  Gamepad2,
  MousePointerClick,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { UpgradeItem, UpgradeCategory } from '../../types/game';

interface UpgradesScreenProps {
  onOpenPiStore?: () => void;
}

type CategoryGroup = 'all' | 'combat' | 'passive' | 'energy' | 'lab';

export const UpgradesScreen: React.FC<UpgradesScreenProps> = ({ onOpenPiStore }) => {
  const { language, balance, stats, upgrades, buyUpgrade } = useGame();
  const t = translations[language];
  const isAr = language === 'ar';

  const [activeGroup, setActiveGroup] = useState<CategoryGroup>('all');
  const [purchasedId, setPurchasedId] = useState<string | null>(null);

  const filterCategory = (upgrade: UpgradeItem): boolean => {
    if (activeGroup === 'all') return true;
    if (activeGroup === 'combat') {
      return ['tap_power', 'critical_tap', 'combo_mastery', 'golden_touch', 'hamster'].includes(upgrade.category);
    }
    if (activeGroup === 'passive') {
      return ['passive_income', 'production_machines', 'auto_collector', 'power_core', 'business'].includes(upgrade.category);
    }
    if (activeGroup === 'energy') {
      return ['energy_capacity', 'energy_recovery', 'turbo_boost'].includes(upgrade.category);
    }
    if (activeGroup === 'lab') {
      return ['special_lab', 'golden_seeds', 'lucky_reactor', 'special'].includes(upgrade.category);
    }
    return true;
  };

  const filteredUpgrades = upgrades.filter(filterCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-5 h-5 text-emerald-400" />;
      case 'Battery':
        return <Battery className="w-5 h-5 text-emerald-300" />;
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
      case 'Crosshair':
        return <Crosshair className="w-5 h-5 text-red-400" />;
      case 'Target':
        return <Target className="w-5 h-5 text-rose-400" />;
      case 'Factory':
        return <Factory className="w-5 h-5 text-amber-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Gauge':
        return <Gauge className="w-5 h-5 text-yellow-300" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-blue-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-indigo-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-purple-300" />;
      case 'Dices':
        return <Dices className="w-5 h-5 text-pink-400" />;
      case 'Sparkle':
        return <Sparkle className="w-5 h-5 text-yellow-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'Coins':
        return <Coins className="w-5 h-5 text-amber-300" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'MousePointerClick':
        return <MousePointerClick className="w-5 h-5 text-emerald-400" />;
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
      case 'crit_multiplier':
        return `+${upgrade.baseBenefit}x Critical Mult`;
      case 'production_efficiency':
        return `+${Math.round(upgrade.baseBenefit * 100)}% Global Yield`;
      case 'seed_harvest_rate':
        return `+${upgrade.baseBenefit} Golden Harvest`;
      case 'combo_yield_multiplier':
        return `+${Math.round(upgrade.baseBenefit * 100)}% Combo Boost`;
      case 'lucky_bonus_chance':
        return `+${upgrade.baseBenefit}% Lucky Reactor`;
      default:
        return `+${upgrade.baseBenefit}`;
    }
  };

  const handleBuy = (id: string) => {
    const success = buyUpgrade(id);
    if (success) {
      setPurchasedId(id);
      setTimeout(() => setPurchasedId(null), 800);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] px-4 py-3 pb-24 max-w-md mx-auto animate-in fade-in">
      {/* Title Header */}
      <div className="mb-3">
        <h1 className="text-xl font-black text-slate-100 tracking-tight">{t.upgrades.title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{t.upgrades.subtitle}</p>
      </div>

      {/* Official Pi Store Quick Banner */}
      {onOpenPiStore && (
        <div
          onClick={onOpenPiStore}
          className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-purple-950/70 via-purple-900/50 to-slate-900 border border-purple-500/50 flex items-center justify-between cursor-pointer hover:border-purple-400 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-black text-amber-300 text-sm">
              π
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                {t.piStore.title}
              </div>
              <div className="text-[10px] text-purple-300 font-medium">
                Priced in official Pi · Instant 3X multipliers & skins
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-300 font-mono bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-800/60">
            Open Shop →
          </span>
        </div>
      )}

      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
        {[
          { id: 'all', label: isAr ? 'الكل' : 'All Upgrades', count: upgrades.length },
          {
            id: 'combat',
            label: isAr ? 'النقر والقتال' : 'Tap & Combat',
            count: upgrades.filter((u) => ['tap_power', 'critical_tap', 'combo_mastery', 'golden_touch', 'hamster'].includes(u.category)).length,
          },
          {
            id: 'passive',
            label: isAr ? 'الإنتاج والآلات' : 'Production',
            count: upgrades.filter((u) => ['passive_income', 'production_machines', 'auto_collector', 'power_core', 'business'].includes(u.category)).length,
          },
          {
            id: 'energy',
            label: isAr ? 'الطاقة والتعافي' : 'Energy & Turbo',
            count: upgrades.filter((u) => ['energy_capacity', 'energy_recovery', 'turbo_boost'].includes(u.category)).length,
          },
          {
            id: 'lab',
            label: isAr ? 'المختبر والفريد' : 'Special Lab',
            count: upgrades.filter((u) => ['special_lab', 'golden_seeds', 'lucky_reactor', 'special'].includes(u.category)).length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveGroup(tab.id as CategoryGroup)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all border flex items-center gap-1.5 ${
              activeGroup === tab.id
                ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-sm shadow-amber-500/30'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-black ${
                activeGroup === tab.id
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Upgrades List */}
      <div className="flex flex-col gap-3">
        {filteredUpgrades.map((upgrade) => {
          const cost = Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel));
          const nextCost = Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel + 1));
          const canAfford = balance.points >= cost;
          const isLevelLocked = stats.level < upgrade.minPlayerLevel;
          const isMaxed = upgrade.maxLevel ? upgrade.currentLevel >= upgrade.maxLevel : (upgrade.category === 'special' && upgrade.currentLevel >= 1);

          const maxLvl = upgrade.maxLevel || 30;
          const progressPercent = Math.min(100, Math.round((upgrade.currentLevel / maxLvl) * 100));

          const title = language === 'ar' ? upgrade.nameAr : upgrade.name;
          const desc = language === 'ar' ? upgrade.descriptionAr : upgrade.description;
          const isJustBought = purchasedId === upgrade.id;

          return (
            <div
              key={upgrade.id}
              className={`glass-panel rounded-2xl p-3.5 border transition-all relative overflow-hidden ${
                isJustBought
                  ? 'border-emerald-500 bg-emerald-950/20 scale-[1.01]'
                  : isLevelLocked
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

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-100 truncate">{title}</h3>
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-800/40 shrink-0">
                        {t.upgrades.level} {upgrade.currentLevel}
                        {upgrade.maxLevel && `/${upgrade.maxLevel}`}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{desc}</p>

                    <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                      <span className="text-emerald-400 font-bold">
                        {getBenefitLabel(upgrade)}
                      </span>

                      {!isMaxed && !isLevelLocked && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Next: {nextCost.toLocaleString()} π
                        </span>
                      )}
                    </div>

                    {/* Level Progress Bar */}
                    {upgrade.maxLevel && (
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2 border border-slate-800/60">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}
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
                      onClick={() => handleBuy(upgrade.id)}
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
