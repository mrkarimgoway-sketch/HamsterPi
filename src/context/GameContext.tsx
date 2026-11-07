import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Achievement,
  EnergyState,
  HamsterSkin,
  Language,
  LeaderboardEntry,
  Mission,
  PaymentTransactionRecord,
  PlayerBalance,
  PlayerProfile,
  PlayerStats,
  ReferralFriend,
  TapFloatingText,
  UpgradeItem,
} from '../types/game';
import {
  DAILY_LOGIN_REWARDS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_MISSIONS,
  INITIAL_UPGRADES,
} from '../data/initialData';
import { PiProduct } from '../data/piProducts';
import { sounds } from '../services/sound';
import { piNetwork, PaymentCompletionResult } from '../services/piNetwork';
import { dbService } from '../services/supabaseClient';

interface OfflineEarnings {
  points: number;
  seconds: number;
}

interface AdminSettings {
  tapMultiplier: number;
  passiveMultiplier: number;
  broadcastNotice: string;
}

interface PaymentStatusState {
  isProcessing: boolean;
  step: 'idle' | 'approving' | 'awaiting_signature' | 'completing' | 'success' | 'cancelled' | 'error';
  message?: string;
  error?: string;
  lastTxid?: string;
}

interface GameContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isMuted: boolean;
  toggleSound: () => void;
  hapticEnabled: boolean;
  toggleHaptic: () => void;

  profile: PlayerProfile;
  stats: PlayerStats;
  balance: PlayerBalance;
  energy: EnergyState;
  upgrades: UpgradeItem[];
  missions: Mission[];
  achievements: Achievement[];
  referrals: ReferralFriend[];
  leaderboard: LeaderboardEntry[];
  floatingTexts: TapFloatingText[];

  activeSkin: HamsterSkin;
  setSkin: (skin: HamsterSkin) => void;

  handleHamsterTap: (event: React.MouseEvent | React.TouchEvent) => void;
  buyUpgrade: (upgradeId: string) => boolean;
  claimMissionReward: (missionId: string) => void;
  claimDailyLogin: () => void;
  submitMiniGameResult: (gameKey: string, score: number, rewardPoints: number) => void;
  
  // Real Pi Network Authentication & Status
  isPiBrowser: boolean;
  isPiConnected: boolean;
  isPiSdkReady: boolean;
  piAuthError: string | null;
  connectPiAccount: () => Promise<{ success: boolean; error?: string }>;
  disconnectPiAccount: () => void;

  // Real Pi Network Payments & Purchases
  paymentStatus: PaymentStatusState;
  purchasePiProduct: (product: PiProduct) => Promise<{ success: boolean; error?: string; txid?: string }>;
  paymentHistory: PaymentTransactionRecord[];
  refreshPaymentHistory: () => Promise<void>;

  copyReferralLink: () => Promise<boolean>;

  offlineEarnings: OfflineEarnings | null;
  dismissOfflineEarnings: () => void;

  adminSettings: AdminSettings;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'hamsterpi_save_v2';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('hamsterpi_lang') as Language) || 'en';
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.isMuted);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(() => {
    const val = localStorage.getItem('hamsterpi_haptic');
    return val !== null ? val === 'true' : true;
  });

  const [floatingTexts, setFloatingTexts] = useState<TapFloatingText[]>([]);
  const [offlineEarnings, setOfflineEarnings] = useState<OfflineEarnings | null>(null);

  // Pi Network state
  const [isPiBrowser, setIsPiBrowser] = useState<boolean>(() => piNetwork.isPiBrowser());
  const [isPiSdkReady, setIsPiSdkReady] = useState<boolean>(false);
  const [piAuthError, setPiAuthError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusState>({
    isProcessing: false,
    step: 'idle',
  });
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransactionRecord[]>([]);

  // Core Game State
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    const cachedUser = piNetwork.getCurrentUser();
    return {
      id: 'pioneer_' + Math.random().toString(36).substring(2, 9),
      username: cachedUser ? cachedUser.username : 'Pioneer_Guest',
      displayName: cachedUser ? cachedUser.username : 'Pioneer Guest',
      avatarUrl: '/src/assets/images/hamster_mascot_default_1793717666154.jpg',
      currentSkin: 'default',
      role: 'pioneer',
      referralCode: 'PIHAMSTER' + Math.floor(1000 + Math.random() * 9000),
      isPiConnected: Boolean(cachedUser),
      piUid: cachedUser ? cachedUser.uid : undefined,
    };
  });

  const [balance, setBalance] = useState<PlayerBalance>(() => ({
    points: 1250,
    lifetimePoints: 1250,
    goldenSeeds: 5,
  }));

  const [stats, setStats] = useState<PlayerStats>(() => ({
    level: 1,
    levelTitle: 'Bronze Hamster',
    totalTaps: 0,
    tapPower: 2,
    passiveRatePerSec: 0,
    passiveRatePerHour: 0,
    criticalChance: 0.05,
    criticalMultiplier: 2.0,
    loginStreak: 1,
    lastLoginDate: new Date().toISOString().split('T')[0],
    minigamesPlayed: 0,
    highestMinigameScore: 0,
    referralCount: 2,
    activeBoosterMultiplier: 1.0,
    activeBoosterExpiresAt: 0,
  }));

  const [energy, setEnergy] = useState<EnergyState>(() => ({
    current: 1000,
    max: 1000,
    regenRatePerSec: 3,
  }));

  const [upgrades, setUpgrades] = useState<UpgradeItem[]>(INITIAL_UPGRADES);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  const [referrals, setReferrals] = useState<ReferralFriend[]>([
    { id: 'ref_1', username: 'CryptoPioneer99', joinedAt: '2 days ago', rewardClaimed: 5000, activeLevel: 3 },
    { id: 'ref_2', username: 'PiMinerHammy', joinedAt: '5 hours ago', rewardClaimed: 5000, activeLevel: 2 },
  ]);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    tapMultiplier: 1.0,
    passiveMultiplier: 1.0,
    broadcastNotice: '🎉 HamsterPi Pi Network Ecosystem: Official authentication and payments active!',
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, username: 'PiOverlord_77', levelTitle: 'Pi Sovereign', points: 4892000, skin: 'king' },
    { rank: 2, username: 'CyberHamsterX', levelTitle: 'Diamond CEO', points: 3120400, skin: 'cyber' },
    { rank: 3, username: 'StarMiner_Pi', levelTitle: 'Gold Pioneer', points: 1985000, skin: 'default' },
    { rank: 4, username: 'HamsterWhale', levelTitle: 'Silver Forager', points: 840500, skin: 'king' },
    { rank: 5, username: profile.username, levelTitle: 'Bronze Hamster', points: 1250, skin: 'default', isCurrentPlayer: true },
    { rank: 6, username: 'QuantumPiGamer', levelTitle: 'Bronze Hamster', points: 950, skin: 'default' },
  ]);

  // Initialize Pi SDK on mount
  useEffect(() => {
    setIsPiBrowser(piNetwork.isPiBrowser());
    piNetwork.init().then((ready) => {
      setIsPiSdkReady(ready);
      if (ready && piNetwork.getCurrentUser()) {
        const u = piNetwork.getCurrentUser()!;
        setProfile((prev) => ({
          ...prev,
          username: u.username,
          displayName: u.username,
          piUid: u.uid,
          isPiConnected: true,
        }));
      }
    });
  }, []);

  // Load from LocalStorage on mount & compute offline earnings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.profile) {
          setProfile((prev) => ({
            ...prev,
            ...saved.profile,
            // Keep Pi connection state aligned with Pi client token
            isPiConnected: Boolean(piNetwork.getCurrentUser()) || saved.profile.isPiConnected,
            username: piNetwork.getCurrentUser()?.username || saved.profile.username,
          }));
        }
        if (saved.balance) setBalance(saved.balance);
        if (saved.stats) setStats(saved.stats);
        if (saved.energy) setEnergy(saved.energy);
        if (saved.upgrades && Array.isArray(saved.upgrades)) {
          const levelMap = new Map<string, number>();
          // Map of legacy IDs to modern upgrade IDs
          const legacyIdMap: Record<string, string> = {
            upg_tap_gloves: 'tap_paws_1',
            upg_paw_guard: 'tap_bionic_paws',
            upg_gold_paw: 'tap_kinetic_claws',
            upg_bionic_wheel: 'pass_hamster_wheel',
            upg_solar_cage: 'pass_seed_press',
            upg_fusion_core: 'pass_quantum_treadmill',
            upg_cyber_server: 'pass_crypto_node',
            upg_energy_battery: 'nrg_battery_pack',
            upg_speedy_drink: 'rec_sunflower_espresso',
            upg_royal_crown: 'special_royal_crown',
            upg_cyber_visor: 'special_cyber_visor',
          };
          saved.upgrades.forEach((u: UpgradeItem) => {
            if (u && typeof u.currentLevel === 'number') {
              const targetId = legacyIdMap[u.id] || u.id;
              const lvl = Math.min(30, Math.max(0, u.currentLevel));
              levelMap.set(targetId, Math.max(levelMap.get(targetId) || 0, lvl));
            }
          });
          const merged = INITIAL_UPGRADES.map((master) => ({
            ...master,
            maxLevel: 30,
            currentLevel: levelMap.has(master.id) ? levelMap.get(master.id)! : master.currentLevel,
          }));
          setUpgrades(merged);
        } else {
          setUpgrades(INITIAL_UPGRADES);
        }
        if (saved.missions) setMissions(saved.missions);
        if (saved.achievements) setAchievements(saved.achievements);
        if (saved.adminSettings) setAdminSettings(saved.adminSettings);

        // Calculate offline passive income
        if (saved.lastSavedAt && saved.stats?.passiveRatePerSec > 0) {
          const now = Date.now();
          const elapsedSec = Math.min(Math.floor((now - saved.lastSavedAt) / 1000), 86400 * 3);
          if (elapsedSec > 10) {
            const earned = Math.floor(elapsedSec * saved.stats.passiveRatePerSec);
            if (earned > 0) {
              setOfflineEarnings({ points: earned, seconds: elapsedSec });
            }
          }
        }
      }
    } catch (e) {
      console.warn('Could not restore game state:', e);
    }
  }, []);

  // Sync to HTML dir and lang
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('hamsterpi_lang', language);
  }, [language]);

  // Auto-save state to LocalStorage periodically
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const toSave = {
          profile,
          balance,
          stats,
          energy,
          upgrades,
          missions,
          achievements,
          adminSettings,
          lastSavedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (err) {
        console.warn('Storage save error:', err);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [profile, balance, stats, energy, upgrades, missions, achievements, adminSettings]);

  // Sync Leaderboard player entry when balance changes
  useEffect(() => {
    setLeaderboard((prev) =>
      prev.map((entry) =>
        entry.isCurrentPlayer
          ? {
              ...entry,
              username: profile.username,
              points: Math.floor(balance.points),
              levelTitle: stats.levelTitle,
              skin: profile.currentSkin,
            }
          : entry
      )
    );
  }, [balance.points, stats.levelTitle, profile.currentSkin, profile.username]);

  // Real-time Game Loop: Passive Points & Energy Regen
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Regenerate Energy
      setEnergy((prev) => {
        if (prev.current >= prev.max) return prev;
        const next = Math.min(prev.max, prev.current + prev.regenRatePerSec);
        return { ...prev, current: next };
      });

      // 2. Active Pi Booster check
      const isBoosterActive = Boolean(
        stats.activeBoosterExpiresAt && Date.now() < stats.activeBoosterExpiresAt
      );
      const boosterMultiplier = isBoosterActive ? stats.activeBoosterMultiplier || 1.0 : 1.0;

      // 3. Passive Points Tick
      if (stats.passiveRatePerSec > 0) {
        const delta = stats.passiveRatePerSec * adminSettings.passiveMultiplier * boosterMultiplier;
        setBalance((prev) => ({
          ...prev,
          points: prev.points + delta,
          lifetimePoints: prev.lifetimePoints + delta,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    stats.passiveRatePerSec,
    stats.activeBoosterExpiresAt,
    stats.activeBoosterMultiplier,
    adminSettings.passiveMultiplier,
  ]);

  // Recalculate Level progression based on Lifetime Points
  useEffect(() => {
    const pts = balance.lifetimePoints;
    let lvl = 1;
    let title = 'Bronze Hamster';

    if (pts >= 10000000) {
      lvl = 10;
      title = 'Pi Sovereign';
    } else if (pts >= 3000000) {
      lvl = 9;
      title = 'Diamond CEO';
    } else if (pts >= 1000000) {
      lvl = 8;
      title = 'Master Strategist';
    } else if (pts >= 350000) {
      lvl = 7;
      title = 'Galactic Pioneer';
    } else if (pts >= 120000) {
      lvl = 6;
      title = 'Gold Pioneer';
    } else if (pts >= 45000) {
      lvl = 5;
      title = 'Silver Forager';
    } else if (pts >= 15000) {
      lvl = 4;
      title = 'Acorn Baron';
    } else if (pts >= 5000) {
      lvl = 3;
      title = 'Wheel Enthusiast';
    } else if (pts >= 1500) {
      lvl = 2;
      title = 'Junior Hamster';
    }

    if (lvl !== stats.level || title !== stats.levelTitle) {
      setStats((prev) => ({ ...prev, level: lvl, levelTitle: title }));
    }
  }, [balance.lifetimePoints, stats.level, stats.levelTitle]);

  // Fetch payment history
  const refreshPaymentHistory = useCallback(async () => {
    if (!profile.piUid) return;
    try {
      const res = await fetch(`/api/pi/payments/history?uid=${profile.piUid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.history) setPaymentHistory(data.history);
      }
    } catch {
      // ignore history fetch error
    }
  }, [profile.piUid]);

  useEffect(() => {
    if (profile.piUid) {
      refreshPaymentHistory();
    }
  }, [profile.piUid, refreshPaymentHistory]);

  // Sound & Haptic Toggles
  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const toggleHaptic = () => {
    setHapticEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('hamsterpi_haptic', String(next));
      return next;
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Hamster Tap Handler
  const tapBatchRef = useRef({ count: 0, points: 0, startTime: Date.now() });

  const handleHamsterTap = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (energy.current < 1) {
        sounds.playError();
        return;
      }

      setEnergy((prev) => ({ ...prev, current: Math.max(0, prev.current - 1) }));

      const isBoosterActive = Boolean(
        stats.activeBoosterExpiresAt && Date.now() < stats.activeBoosterExpiresAt
      );
      const boosterMultiplier = isBoosterActive ? stats.activeBoosterMultiplier || 1.0 : 1.0;

      const isCrit = Math.random() < stats.criticalChance;
      const baseEarn = stats.tapPower * adminSettings.tapMultiplier * boosterMultiplier;
      const earned = Math.round(isCrit ? baseEarn * stats.criticalMultiplier : baseEarn);

      sounds.playTap(isCrit);
      if (hapticEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(isCrit ? [25, 30, 25] : 12);
      }

      setBalance((prev) => ({
        ...prev,
        points: prev.points + earned,
        lifetimePoints: prev.lifetimePoints + earned,
      }));

      setStats((prev) => ({
        ...prev,
        totalTaps: prev.totalTaps + 1,
      }));

      tapBatchRef.current.count += 1;
      tapBatchRef.current.points += earned;
      if (tapBatchRef.current.count >= 20) {
        const batch = { ...tapBatchRef.current };
        tapBatchRef.current = { count: 0, points: 0, startTime: Date.now() };
        dbService.syncTapBatch(profile.id, batch.count, Date.now() - batch.startTime, batch.points, batch.count);
      }

      setMissions((prev) =>
        prev.map((m) => {
          if (m.targetAction === 'tap' && !m.isCompleted) {
            const newProg = m.currentProgress + 1;
            return {
              ...m,
              currentProgress: newProg,
              isCompleted: newProg >= m.targetCount,
            };
          }
          return m;
        })
      );

      setAchievements((prev) =>
        prev.map((ach) => {
          if (ach.id === 'ach_first_tap' && !ach.unlocked) {
            return { ...ach, unlocked: true, progress: 1 };
          }
          if (ach.id === 'ach_1k_taps' && !ach.unlocked) {
            const nextP = ach.progress + 1;
            return { ...ach, progress: nextP, unlocked: nextP >= ach.maxProgress };
          }
          return ach;
        })
      );

      let clientX = window.innerWidth / 2;
      let clientY = window.innerHeight / 2;

      if ('touches' in event && event.touches && event.touches[0]) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ('clientX' in event) {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      clientX += (Math.random() - 0.5) * 40;
      clientY += (Math.random() - 0.5) * 20;

      const floatItem: TapFloatingText = {
        id: Math.random().toString(36).substring(2, 9),
        text: `+${earned}`,
        x: clientX,
        y: clientY,
        isCrit,
      };

      setFloatingTexts((prev) => [...prev.slice(-15), floatItem]);
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((item) => item.id !== floatItem.id));
      }, 900);
    },
    [energy.current, stats, adminSettings.tapMultiplier, hapticEnabled, profile.id]
  );

  // Buy or Level-up Upgrade
  const buyUpgrade = useCallback(
    (upgradeId: string): boolean => {
      const upgrade = upgrades.find((u) => u.id === upgradeId);
      if (!upgrade) return false;

      const currentCost = Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel));

      if (upgrade.maxLevel && upgrade.currentLevel >= upgrade.maxLevel) {
        sounds.playError();
        return false;
      }

      if (balance.points < currentCost) {
        sounds.playError();
        return false;
      }

      if (stats.level < upgrade.minPlayerLevel) {
        sounds.playError();
        return false;
      }

      const newBalance = balance.points - currentCost;
      setBalance((prev) => ({
        ...prev,
        points: newBalance,
      }));

      const nextLevel = upgrade.currentLevel + 1;

      setUpgrades((prev) =>
        prev.map((u) => (u.id === upgradeId ? { ...u, currentLevel: nextLevel } : u))
      );

      if (upgrade.benefitType === 'tap_power') {
        setStats((prev) => ({ ...prev, tapPower: prev.tapPower + upgrade.baseBenefit }));
      } else if (upgrade.benefitType === 'passive_per_sec') {
        setStats((prev) => {
          const nextRate = prev.passiveRatePerSec + upgrade.baseBenefit;
          return {
            ...prev,
            passiveRatePerSec: nextRate,
            passiveRatePerHour: Math.round(nextRate * 3600),
          };
        });
      } else if (upgrade.benefitType === 'max_energy') {
        setEnergy((prev) => ({
          ...prev,
          max: prev.max + upgrade.baseBenefit,
          current: prev.current + upgrade.baseBenefit,
        }));
      } else if (upgrade.benefitType === 'regen_rate') {
        setEnergy((prev) => ({
          ...prev,
          regenRatePerSec: prev.regenRatePerSec + upgrade.baseBenefit,
        }));
      } else if (upgrade.benefitType === 'crit_chance') {
        setStats((prev) => ({
          ...prev,
          criticalChance: Math.min(0.5, prev.criticalChance + upgrade.baseBenefit / 100),
        }));
      } else if (upgrade.benefitType === 'crit_multiplier') {
        setStats((prev) => ({
          ...prev,
          criticalMultiplier: prev.criticalMultiplier + upgrade.baseBenefit,
        }));
      } else if (upgrade.benefitType === 'production_efficiency') {
        setStats((prev) => {
          const multipliedRate = prev.passiveRatePerSec * (1 + upgrade.baseBenefit);
          return {
            ...prev,
            passiveRatePerSec: multipliedRate,
            passiveRatePerHour: Math.round(multipliedRate * 3600),
          };
        });
      } else if (upgrade.benefitType === 'seed_harvest_rate') {
        setBalance((prev) => ({ ...prev, goldenSeeds: prev.goldenSeeds + 2 }));
      }

      if (upgrade.unlockedSkin) {
        setProfile((prev) => ({ ...prev, currentSkin: upgrade.unlockedSkin! }));
      }

      sounds.playUpgrade();

      dbService.recordTransaction({
        playerId: profile.id,
        amount: -currentCost,
        balanceAfter: newBalance,
        category: 'upgrade_purchase',
        description: `Upgraded ${upgrade.name} to level ${nextLevel}`,
        metadata: { upgradeId, nextLevel },
      });

      setMissions((prev) =>
        prev.map((m) => {
          if (m.targetAction === 'upgrade' && !m.isCompleted) {
            const prog = m.currentProgress + 1;
            return { ...m, currentProgress: prog, isCompleted: prog >= m.targetCount };
          }
          return m;
        })
      );

      setAchievements((prev) =>
        prev.map((ach) => {
          if (ach.id === 'ach_5_upgrades' && !ach.unlocked) {
            const totalUpgradesCount = upgrades.reduce(
              (sum, u) => sum + (u.id === upgradeId ? nextLevel : u.currentLevel),
              0
            );
            return {
              ...ach,
              progress: totalUpgradesCount,
              unlocked: totalUpgradesCount >= ach.maxProgress,
            };
          }
          return ach;
        })
      );

      return true;
    },
    [upgrades, balance.points, stats.level, profile.id]
  );

  // Claim Mission Reward
  const claimMissionReward = useCallback(
    (missionId: string) => {
      const mission = missions.find((m) => m.id === missionId);
      if (!mission || !mission.isCompleted || mission.isClaimed) return;

      sounds.playFanfare();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      setBalance((prev) => ({
        ...prev,
        points: prev.points + mission.rewardPoints,
        lifetimePoints: prev.lifetimePoints + mission.rewardPoints,
        goldenSeeds: prev.goldenSeeds + mission.rewardSeeds,
      }));

      setMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, isClaimed: true } : m))
      );

      dbService.recordTransaction({
        playerId: profile.id,
        amount: mission.rewardPoints,
        balanceAfter: balance.points + mission.rewardPoints,
        category: 'mission_reward',
        description: `Claimed reward for mission: ${mission.title}`,
        metadata: { missionId },
      });
    },
    [missions, balance.points, profile.id]
  );

  // Claim Daily Login Reward
  const claimDailyLogin = useCallback(() => {
    const todayReward = DAILY_LOGIN_REWARDS[(stats.loginStreak - 1) % DAILY_LOGIN_REWARDS.length];
    if (!todayReward) return;

    sounds.playFanfare();
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.5 },
    });

    setBalance((prev) => ({
      ...prev,
      points: prev.points + todayReward.points,
      lifetimePoints: prev.lifetimePoints + todayReward.points,
      goldenSeeds: prev.goldenSeeds + todayReward.seeds,
    }));

    setStats((prev) => ({
      ...prev,
      loginStreak: prev.loginStreak + 1,
    }));

    dbService.recordTransaction({
      playerId: profile.id,
      amount: todayReward.points,
      balanceAfter: balance.points + todayReward.points,
      category: 'daily_reward',
      description: `Claimed Day ${todayReward.day} daily login streak reward`,
    });
  }, [stats.loginStreak, balance.points, profile.id]);

  // Submit Mini Game Result
  const submitMiniGameResult = useCallback(
    (gameKey: string, score: number, rewardPoints: number) => {
      if (rewardPoints > 0) {
        sounds.playCoin();
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
        });

        setBalance((prev) => ({
          ...prev,
          points: prev.points + rewardPoints,
          lifetimePoints: prev.lifetimePoints + rewardPoints,
        }));

        dbService.recordMiniGameResult(profile.id, gameKey, score, rewardPoints);
        dbService.recordTransaction({
          playerId: profile.id,
          amount: rewardPoints,
          balanceAfter: balance.points + rewardPoints,
          category: 'minigame_reward',
          description: `Reward for ${gameKey} (Score: ${score})`,
          metadata: { gameKey, score },
        });
      }

      setStats((prev) => ({
        ...prev,
        minigamesPlayed: prev.minigamesPlayed + 1,
        highestMinigameScore: Math.max(prev.highestMinigameScore, score),
      }));

      setMissions((prev) =>
        prev.map((m) => {
          if (m.targetAction === 'play_minigame' && !m.isCompleted) {
            const prog = m.currentProgress + 1;
            return { ...m, currentProgress: prog, isCompleted: prog >= m.targetCount };
          }
          if (m.targetAction === 'rush_score' && gameKey === 'rush' && score >= m.targetCount) {
            return { ...m, currentProgress: score, isCompleted: true };
          }
          return m;
        })
      );
    },
    [balance.points, profile.id]
  );

  // Authenticate Pi Network Account
  const connectPiAccount = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setPiAuthError(null);

    if (!piNetwork.isPiBrowser()) {
      const err = 'Authentication requires opening HamsterPi in the official Pi Browser mobile app.';
      setPiAuthError(err);
      sounds.playError();
      return { success: false, error: err };
    }

    try {
      const res = await piNetwork.authenticate();
      if (res && res.verified && res.user) {
        sounds.playFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
        });

        setProfile((prev) => ({
          ...prev,
          username: res.user.username,
          displayName: res.user.username,
          piUid: res.user.uid,
          isPiConnected: true,
        }));

        refreshPaymentHistory();
        return { success: true };
      }
      const err = res.error || 'Pi authentication could not be completed.';
      setPiAuthError(err);
      return { success: false, error: err };
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Pi Authentication failed';
      console.warn('[Pi Auth] Failed:', message);
      setPiAuthError(message);
      sounds.playError();
      return { success: false, error: message };
    }
  }, [refreshPaymentHistory]);

  const disconnectPiAccount = useCallback(() => {
    piNetwork.signOut();
    setProfile((prev) => ({
      ...prev,
      username: 'Pioneer_Guest',
      displayName: 'Pioneer Guest',
      piUid: undefined,
      isPiConnected: false,
    }));
    setPaymentHistory([]);
  }, []);

  // Purchase Pi Product via Official Pi Payment Lifecycle
  const purchasePiProduct = useCallback(
    (product: PiProduct): Promise<{ success: boolean; error?: string; txid?: string }> => {
      return new Promise((resolve) => {
        if (!profile.isPiConnected) {
          const err = 'Please authenticate with your Pi account before making a purchase.';
          setPaymentStatus({ isProcessing: false, step: 'error', error: err });
          sounds.playError();
          resolve({ success: false, error: err });
          return;
        }

        setPaymentStatus({
          isProcessing: true,
          step: 'approving',
          message: 'Initializing payment with Pi Network...',
        });

        piNetwork.createPayment(product, {
          onProgress: (step) => {
            setPaymentStatus((prev) => ({
              ...prev,
              step,
              message:
                step === 'approving'
                  ? 'Requesting server payment approval...'
                  : step === 'awaiting_signature'
                  ? 'Awaiting transaction signature in your Pi Wallet...'
                  : 'Verifying on-chain transaction & finalizing rewards...',
            }));
          },

          onSuccess: (result: PaymentCompletionResult) => {
            sounds.playFanfare();
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
            });

            // Apply product rewards immediately
            const p = product.rewardPayload;
            if (p.points) {
              setBalance((prev) => ({
                ...prev,
                points: prev.points + p.points!,
                lifetimePoints: prev.lifetimePoints + p.points!,
              }));
            }
            if (p.seeds) {
              setBalance((prev) => ({
                ...prev,
                goldenSeeds: prev.goldenSeeds + p.seeds!,
              }));
            }
            if (p.skin) {
              setProfile((prev) => ({ ...prev, currentSkin: p.skin! }));
            }
            if (p.multiplier && p.durationHours) {
              setStats((prev) => ({
                ...prev,
                activeBoosterMultiplier: p.multiplier,
                activeBoosterExpiresAt: Date.now() + p.durationHours! * 3600 * 1000,
              }));
            }

            setPaymentStatus({
              isProcessing: false,
              step: 'success',
              lastTxid: result.txid,
              message: `Payment successful! TxID: ${result.txid?.substring(0, 10)}...`,
            });

            refreshPaymentHistory();
            resolve({ success: true, txid: result.txid });
          },

          onCancel: (paymentId) => {
            setPaymentStatus({
              isProcessing: false,
              step: 'cancelled',
              message: `Payment ${paymentId.substring(0, 8)}... was cancelled.`,
            });
            sounds.playError();
            resolve({ success: false, error: 'PAYMENT_CANCELLED' });
          },

          onError: (error) => {
            const msg = error.message || 'Payment processing encountered an error.';
            setPaymentStatus({
              isProcessing: false,
              step: 'error',
              error: msg,
              message: msg,
            });
            sounds.playError();
            resolve({ success: false, error: msg });
          },
        });
      });
    },
    [profile.isPiConnected, refreshPaymentHistory]
  );

  // Copy Referral Link
  const copyReferralLink = useCallback(async (): Promise<boolean> => {
    const link = `https://hamsterpi.app/?ref=${profile.referralCode}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(link);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [profile.referralCode]);

  const dismissOfflineEarnings = () => {
    if (offlineEarnings) {
      sounds.playCoin();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      setBalance((prev) => ({
        ...prev,
        points: prev.points + offlineEarnings.points,
        lifetimePoints: prev.lifetimePoints + offlineEarnings.points,
      }));
      setOfflineEarnings(null);
    }
  };

  const setSkin = (skin: HamsterSkin) => {
    setProfile((prev) => ({ ...prev, currentSkin: skin }));
    sounds.playTap();
  };

  const updateAdminSettings = (settings: Partial<AdminSettings>) => {
    setAdminSettings((prev) => ({ ...prev, ...settings }));
  };

  return (
    <GameContext.Provider
      value={{
        language,
        setLanguage,
        isMuted,
        toggleSound,
        hapticEnabled,
        toggleHaptic,
        profile,
        stats,
        balance,
        energy,
        upgrades,
        missions,
        achievements,
        referrals,
        leaderboard,
        floatingTexts,
        activeSkin: profile.currentSkin,
        setSkin,
        handleHamsterTap,
        buyUpgrade,
        claimMissionReward,
        claimDailyLogin,
        submitMiniGameResult,
        
        isPiBrowser,
        isPiConnected: profile.isPiConnected,
        isPiSdkReady,
        piAuthError,
        connectPiAccount,
        disconnectPiAccount,

        paymentStatus,
        purchasePiProduct,
        paymentHistory,
        refreshPaymentHistory,

        copyReferralLink,
        offlineEarnings,
        dismissOfflineEarnings,
        adminSettings,
        updateAdminSettings,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
