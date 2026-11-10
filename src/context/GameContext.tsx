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
  HAMSTER_SKINS,
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
  isDailyRewardClaimable: boolean;
  claimDailyLogin: () => boolean;
  submitMiniGameResult: (gameKey: string, score: number, rewardPoints: number) => void;
  
  // Real Pi Network Authentication & Status
  isPiBrowser: boolean;
  isPiConnected: boolean;
  isPiSdkReady: boolean;
  piAuthError: string | null;
  connectPiAccount: () => Promise<{ success: boolean; error?: string }>;
  disconnectPiAccount: () => void;
  updatePioneerUsername: (name: string) => void;
  // Pi Ads Network (3-Hour Rewarded Ad Task)
  isAdWatching: boolean;
  adCooldownRemainingMs: number;
  watchRewardedAd: () => Promise<{ success: boolean; error?: string }>;

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

const getTodayDateString = (): string => new Date().toISOString().split('T')[0];
const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

interface SavedGameData {
  profile?: PlayerProfile;
  balance?: PlayerBalance;
  stats?: PlayerStats;
  energy?: EnergyState;
  upgrades?: UpgradeItem[];
  missions?: Mission[];
  achievements?: Achievement[];
  adminSettings?: AdminSettings;
  lastSavedAt?: number;
}

const loadSavedGameData = (): SavedGameData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse saved game data:', err);
    return null;
  }
};

const saveGameDataImmediate = (data: SavedGameData): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to write save data to localStorage:', err);
  }
};

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

  // =========================================================================
  // CORE GAME STATE: SYNCHRONOUSLY RESTORED FROM LOCALSTORAGE (NEVER WIPED)
  // =========================================================================
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    const saved = loadSavedGameData();
    const cachedUser = piNetwork.getCurrentUser();

    if (saved?.profile) {
      const skin = (saved.profile.currentSkin && HAMSTER_SKINS[saved.profile.currentSkin as HamsterSkin])
        ? (saved.profile.currentSkin as HamsterSkin)
        : 'default';
      const validImg = HAMSTER_SKINS[skin]?.image || HAMSTER_SKINS.default.image;
      const verifiedUsername = cachedUser?.username || saved.profile.username || 'Pioneer_Guest';

      return {
        ...saved.profile,
        username: verifiedUsername,
        displayName: cachedUser?.username || saved.profile.displayName || verifiedUsername,
        avatarUrl: validImg,
        currentSkin: skin,
        role: saved.profile.role || 'pioneer',
        referralCode: saved.profile.referralCode || ('PIHAMSTER' + Math.floor(1000 + Math.random() * 9000)),
        isPiConnected: Boolean(cachedUser) || Boolean(saved.profile.isPiConnected),
        piUid: cachedUser?.uid || saved.profile.piUid,
      };
    }

    return {
      id: 'pioneer_' + Math.random().toString(36).substring(2, 9),
      username: cachedUser ? cachedUser.username : 'Pioneer_Guest',
      displayName: cachedUser ? cachedUser.username : 'Pioneer Guest',
      avatarUrl: HAMSTER_SKINS.default.image,
      currentSkin: 'default',
      role: 'pioneer',
      referralCode: 'PIHAMSTER' + Math.floor(1000 + Math.random() * 9000),
      isPiConnected: Boolean(cachedUser),
      piUid: cachedUser ? cachedUser.uid : undefined,
    };
  });

  const [balance, setBalance] = useState<PlayerBalance>(() => {
    const saved = loadSavedGameData();
    if (saved?.balance && typeof saved.balance.points === 'number' && !isNaN(saved.balance.points)) {
      return saved.balance;
    }
    return {
      points: 1250,
      lifetimePoints: 1250,
      goldenSeeds: 5,
    };
  });

  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = loadSavedGameData();
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    if (saved?.stats) {
      let streak = saved.stats.loginStreak || 1;
      const lastClaim = saved.stats.lastDailyClaimDate;
      if (lastClaim && lastClaim !== today && lastClaim !== yesterday) {
        streak = 1;
      }
      return {
        ...saved.stats,
        loginStreak: streak,
        lastLoginDate: today,
        lastDailyClaimDate: lastClaim,
      };
    }

    return {
      level: 1,
      levelTitle: 'Bronze Hamster',
      totalTaps: 0,
      tapPower: 2,
      passiveRatePerSec: 0,
      passiveRatePerHour: 0,
      criticalChance: 0.05,
      criticalMultiplier: 2.0,
      loginStreak: 1,
      lastLoginDate: today,
      lastDailyClaimDate: undefined,
      minigamesPlayed: 0,
      highestMinigameScore: 0,
      referralCount: 2,
      activeBoosterMultiplier: 1.0,
      activeBoosterExpiresAt: 0,
    };
  });

  const [energy, setEnergy] = useState<EnergyState>(() => {
    const saved = loadSavedGameData();
    if (saved?.energy) {
      let current = saved.energy.current;
      if (saved.lastSavedAt && saved.energy.regenRatePerSec) {
        const elapsedSec = Math.floor((Date.now() - saved.lastSavedAt) / 1000);
        if (elapsedSec > 0) {
          current = Math.min(saved.energy.max, current + elapsedSec * saved.energy.regenRatePerSec);
        }
      }
      return {
        ...saved.energy,
        current,
      };
    }
    return {
      current: 1000,
      max: 1000,
      regenRatePerSec: 3,
    };
  });

  const [upgrades, setUpgrades] = useState<UpgradeItem[]>(() => {
    const saved = loadSavedGameData();
    if (saved?.upgrades && Array.isArray(saved.upgrades)) {
      const levelMap = new Map<string, number>();
      saved.upgrades.forEach((u: UpgradeItem) => {
        if (u && typeof u.currentLevel === 'number') {
          levelMap.set(u.id, Math.min(30, Math.max(0, u.currentLevel)));
        }
      });
      return INITIAL_UPGRADES.map((master) => ({
        ...master,
        maxLevel: 30,
        currentLevel: levelMap.has(master.id) ? levelMap.get(master.id)! : master.currentLevel,
      }));
    }
    return INITIAL_UPGRADES;
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = loadSavedGameData();
    if (saved?.missions && Array.isArray(saved.missions)) {
      return saved.missions;
    }
    return INITIAL_MISSIONS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = loadSavedGameData();
    if (saved?.achievements && Array.isArray(saved.achievements)) {
      return saved.achievements;
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [referrals, setReferrals] = useState<ReferralFriend[]>([
    { id: 'ref_1', username: 'CryptoPioneer99', joinedAt: '2 days ago', rewardClaimed: 5000, activeLevel: 3 },
    { id: 'ref_2', username: 'PiMinerHammy', joinedAt: '5 hours ago', rewardClaimed: 5000, activeLevel: 2 },
  ]);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = loadSavedGameData();
    if (saved?.adminSettings) {
      return saved.adminSettings;
    }
    return {
      tapMultiplier: 1.0,
      passiveMultiplier: 1.0,
      broadcastNotice: '🎉 HamsterPi Pi Network Ecosystem: Official authentication and payments active!',
    };
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, username: 'PiOverlord_77', levelTitle: 'Pi Sovereign', points: 4892000, skin: 'king' },
    { rank: 2, username: 'CyberHamsterX', levelTitle: 'Diamond CEO', points: 3120400, skin: 'cyber' },
    { rank: 3, username: 'StarMiner_Pi', levelTitle: 'Gold Pioneer', points: 1985000, skin: 'default' },
    { rank: 4, username: 'HamsterWhale', levelTitle: 'Silver Forager', points: 840500, skin: 'king' },
    { rank: 5, username: profile.username, levelTitle: 'Bronze Hamster', points: 1250, skin: 'default', isCurrentPlayer: true },
    { rank: 6, username: 'QuantumPiGamer', levelTitle: 'Bronze Hamster', points: 950, skin: 'default' },
  ]);

  // Ref tracking latest state for instant atomic save
  const latestStateRef = useRef({
    profile,
    balance,
    stats,
    energy,
    upgrades,
    missions,
    achievements,
    adminSettings,
  });

  // Keep latestStateRef updated on every render
  useEffect(() => {
    latestStateRef.current = {
      profile,
      balance,
      stats,
      energy,
      upgrades,
      missions,
      achievements,
      adminSettings,
    };
  });

  // Instant atomic save function to guarantee zero data loss on refresh or close
  const saveGameStateNow = useCallback(() => {
    if (latestStateRef.current) {
      saveGameDataImmediate({
        ...latestStateRef.current,
        lastSavedAt: Date.now(),
      });
    }
  }, []);

  // Compute offline earnings on mount from saved timestamp
  useEffect(() => {
    const saved = loadSavedGameData();
    if (saved?.lastSavedAt && saved.stats?.passiveRatePerSec && saved.stats.passiveRatePerSec > 0) {
      const elapsedSec = Math.min(Math.floor((Date.now() - saved.lastSavedAt) / 1000), 86400 * 3);
      if (elapsedSec > 10) {
        const earned = Math.floor(elapsedSec * saved.stats.passiveRatePerSec);
        if (earned > 0) {
          setOfflineEarnings({ points: earned, seconds: elapsedSec });
        }
      }
    }
  }, []);

  // Guarantee persistence before page unload, refresh, or hide
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGameStateNow();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        saveGameStateNow();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      saveGameStateNow();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [saveGameStateNow]);

  // Periodic safety auto-save
  useEffect(() => {
    const timer = setInterval(() => {
      saveGameStateNow();
    }, 3000);
    return () => clearInterval(timer);
  }, [saveGameStateNow]);


  // Sync to HTML dir and lang
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('hamsterpi_lang', language);
  }, [language]);

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

  // Automatically sync genuine player mining stats to Supabase (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile.username) {
        dbService.syncPlayerMiningStats({
          piUid: profile.piUid || `pioneer_${profile.username}`,
          username: profile.username,
          passiveRatePerHour: stats.passiveRatePerHour,
          passiveRatePerSec: stats.passiveRatePerSec,
          points: Math.floor(balance.points),
          level: stats.level,
          levelTitle: stats.levelTitle,
          skin: profile.currentSkin,
        });
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [profile.piUid, profile.username, profile.currentSkin, stats.passiveRatePerHour, stats.passiveRatePerSec, stats.level, stats.levelTitle, balance.points]);

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
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
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
      if (tapBatchRef.current.count % 10 === 0) {
        saveGameStateNow();
      }
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
    [energy.current, stats, adminSettings.tapMultiplier, hapticEnabled, profile.id, saveGameStateNow]
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
      } else if (upgrade.benefitType === 'passive_per_hour') {
        setStats((prev) => {
          const nextPerHour = prev.passiveRatePerHour + upgrade.baseBenefit;
          const nextPerSec = nextPerHour / 3600;
          return {
            ...prev,
            passiveRatePerHour: nextPerHour,
            passiveRatePerSec: nextPerSec,
          };
        });
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
          const nextPerHour = Math.round(prev.passiveRatePerHour * (1 + upgrade.baseBenefit));
          const nextPerSec = nextPerHour / 3600;
          return {
            ...prev,
            passiveRatePerHour: nextPerHour,
            passiveRatePerSec: nextPerSec,
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

      // Save state immediately
      setTimeout(() => {
        saveGameStateNow();
      }, 50);

      return true;
    },
    [upgrades, balance.points, stats.level, profile.id, saveGameStateNow]
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

      setTimeout(() => {
        saveGameStateNow();
      }, 50);
    },
    [missions, balance.points, profile.id, saveGameStateNow]
  );

  // Daily login claim eligibility (strictly once per calendar day)
  const isDailyRewardClaimable = stats.lastDailyClaimDate !== getTodayDateString();

  // Claim Daily Login Reward (strictly once per calendar day)
  const claimDailyLogin = useCallback((): boolean => {
    const todayStr = getTodayDateString();

    // Prevent duplicate claim on the same day
    if (stats.lastDailyClaimDate === todayStr) {
      sounds.playError();
      return false;
    }

    const yesterdayStr = getYesterdayDateString();
    let currentStreak = stats.loginStreak || 1;

    // Reset streak if more than 1 day skipped
    if (stats.lastDailyClaimDate && stats.lastDailyClaimDate !== yesterdayStr && stats.lastDailyClaimDate !== todayStr) {
      currentStreak = 1;
    }

    const rewardIndex = ((currentStreak - 1) % DAILY_LOGIN_REWARDS.length);
    const todayReward = DAILY_LOGIN_REWARDS[rewardIndex];
    if (!todayReward) return false;

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

    // Advance to next streak day (1 -> 2 -> ... -> 7 -> 1)
    const nextStreak = (currentStreak % 7) + 1;

    setStats((prev) => ({
      ...prev,
      loginStreak: nextStreak,
      lastDailyClaimDate: todayStr,
      lastLoginDate: todayStr,
    }));

    dbService.recordTransaction({
      playerId: profile.id,
      amount: todayReward.points,
      balanceAfter: balance.points + todayReward.points,
      category: 'daily_reward',
      description: `Claimed Day ${todayReward.day} daily login streak reward`,
    });

    setTimeout(() => {
      saveGameStateNow();
    }, 50);

    return true;
  }, [stats.loginStreak, stats.lastDailyClaimDate, balance.points, profile.id, saveGameStateNow]);

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

      setTimeout(() => {
        saveGameStateNow();
      }, 50);
    },
    [balance.points, profile.id, saveGameStateNow]
  );

  // ============================================================================
  // PI ADS NETWORK (3-HOUR REWARDED TASK)
  // ============================================================================

  const AD_COOLDOWN_MS = 3 * 60 * 60 * 1000; // 3 hours (10,800,000 ms)
  const [isAdWatching, setIsAdWatching] = useState<boolean>(false);
  const [adCooldownRemainingMs, setAdCooldownRemainingMs] = useState<number>(0);

  // Live timer for 3-hour cooldown
  useEffect(() => {
    const updateCooldown = () => {
      const lastWatch = stats.lastAdWatchTime || 0;
      const elapsed = Date.now() - lastWatch;
      const remaining = Math.max(0, AD_COOLDOWN_MS - elapsed);
      setAdCooldownRemainingMs(remaining);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [stats.lastAdWatchTime]);

  const watchRewardedAd = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    return {
      success: false,
      error: 'The Pi Ad Network integration is currently in review by the Pi Core Team. Video rewards will activate upon approval.',
    };
  }, []);

  // Update custom Pioneer username (for web & pioneer profile customization)
  const updatePioneerUsername = useCallback(
    (name: string) => {
      const clean = name.trim().replace(/^@/, '');
      if (!clean) return;
      setProfile((prev) => {
        const next = {
          ...prev,
          username: clean,
          displayName: clean,
        };
        try {
          const saved = loadSavedGameData() || {};
          saveGameDataImmediate({ ...saved, profile: next, lastSavedAt: Date.now() });
        } catch {}
        return next;
      });

      dbService
        .syncPlayerMiningStats({
          piUid: profile.piUid || `pioneer_${clean}`,
          username: clean,
          passiveRatePerHour: stats.passiveRatePerHour,
          passiveRatePerSec: stats.passiveRatePerSec,
          points: Math.floor(balance.points),
          level: stats.level,
          levelTitle: stats.levelTitle,
          skin: profile.currentSkin,
        })
        .catch(() => {});
    },
    [profile.piUid, profile.currentSkin, stats, balance.points]
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

        const updatedProfile: PlayerProfile = {
          ...profile,
          username: res.user.username,
          displayName: res.user.username,
          piUid: res.user.uid,
          isPiConnected: true,
        };

        setProfile(updatedProfile);

        saveGameDataImmediate({
          ...latestStateRef.current,
          profile: updatedProfile,
          lastSavedAt: Date.now(),
        });

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
  }, [profile, refreshPaymentHistory]);

  const disconnectPiAccount = useCallback(() => {
    piNetwork.signOut();
    const guestProfile: PlayerProfile = {
      ...profile,
      username: 'Pioneer_Guest',
      displayName: 'Pioneer Guest',
      piUid: undefined,
      isPiConnected: false,
    };
    setProfile(guestProfile);
    saveGameDataImmediate({
      ...latestStateRef.current,
      profile: guestProfile,
      lastSavedAt: Date.now(),
    });
    setPaymentHistory([]);
  }, [profile]);

  // Initialize Pi SDK on mount & auto-connect inside Pi Browser
  useEffect(() => {
    setIsPiBrowser(piNetwork.isPiBrowser());
    piNetwork.init().then((ready) => {
      setIsPiSdkReady(ready);
      if (ready) {
        if (piNetwork.getCurrentUser()) {
          const u = piNetwork.getCurrentUser()!;
          setProfile((prev) => ({
            ...prev,
            username: u.username,
            displayName: u.username,
            piUid: u.uid,
            isPiConnected: true,
          }));
        } else if (piNetwork.isPiBrowser()) {
          connectPiAccount().catch((err) => {
            console.info('[Pi SDK Auto-Auth] Prompting login inside Pi Browser:', err);
          });
        }
      }
    });
  }, [connectPiAccount]);

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
        isDailyRewardClaimable,
        claimDailyLogin,
        submitMiniGameResult,
        
        isPiBrowser,
        isPiConnected: profile.isPiConnected,
        isPiSdkReady,
        piAuthError,
        connectPiAccount,
        disconnectPiAccount,
        updatePioneerUsername,

        // Pi Ads Network
        isAdWatching,
        adCooldownRemainingMs,
        watchRewardedAd,

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
