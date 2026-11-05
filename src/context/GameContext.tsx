import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Achievement,
  EnergyState,
  HamsterSkin,
  Language,
  LeaderboardEntry,
  Mission,
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
import { sounds } from '../services/sound';
import { piNetwork } from '../services/piNetwork';
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
  connectPiAccount: () => Promise<boolean>;
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

  // Core Game State
  const [profile, setProfile] = useState<PlayerProfile>(() => ({
    id: 'pioneer_' + Math.random().toString(36).substring(2, 9),
    username: 'Pioneer_Chief',
    displayName: 'Hamster Pioneer',
    avatarUrl: '/src/assets/images/hamster_mascot_default_1793717666154.jpg',
    currentSkin: 'default',
    role: 'pioneer',
    referralCode: 'PIHAMSTER' + Math.floor(1000 + Math.random() * 9000),
    isPiConnected: false,
  }));

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
    broadcastNotice: '🎉 Welcome to HamsterPi! Official Pi Network testnet integration active. Tap to earn!',
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, username: 'PiOverlord_77', levelTitle: 'Pi Sovereign', points: 4892000, skin: 'king' },
    { rank: 2, username: 'CyberHamsterX', levelTitle: 'Diamond CEO', points: 3120400, skin: 'cyber' },
    { rank: 3, username: 'StarMiner_Pi', levelTitle: 'Gold Pioneer', points: 1985000, skin: 'default' },
    { rank: 4, username: 'HamsterWhale', levelTitle: 'Silver Forager', points: 840500, skin: 'king' },
    { rank: 5, username: 'Pioneer_Chief', levelTitle: 'Bronze Hamster', points: 1250, skin: 'default', isCurrentPlayer: true },
    { rank: 6, username: 'QuantumPiGamer', levelTitle: 'Bronze Hamster', points: 950, skin: 'default' },
  ]);

  // Load from LocalStorage on mount & compute offline earnings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.profile) setProfile((prev) => ({ ...prev, ...saved.profile }));
        if (saved.balance) setBalance(saved.balance);
        if (saved.stats) setStats(saved.stats);
        if (saved.energy) setEnergy(saved.energy);
        if (saved.upgrades) setUpgrades(saved.upgrades);
        if (saved.missions) setMissions(saved.missions);
        if (saved.achievements) setAchievements(saved.achievements);
        if (saved.adminSettings) setAdminSettings(saved.adminSettings);

        // Calculate offline passive income
        if (saved.lastSavedAt && saved.stats?.passiveRatePerSec > 0) {
          const now = Date.now();
          const elapsedSec = Math.min(Math.floor((now - saved.lastSavedAt) / 1000), 86400 * 3); // cap at 3 days
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
              points: Math.floor(balance.points),
              levelTitle: stats.levelTitle,
              skin: profile.currentSkin,
            }
          : entry
      )
    );
  }, [balance.points, stats.levelTitle, profile.currentSkin]);

  // Real-time Game Loop: Passive Points & Energy Regen
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Regenerate Energy
      setEnergy((prev) => {
        if (prev.current >= prev.max) return prev;
        const next = Math.min(prev.max, prev.current + prev.regenRatePerSec);
        return { ...prev, current: next };
      });

      // 2. Passive Points Tick
      if (stats.passiveRatePerSec > 0) {
        const delta = stats.passiveRatePerSec * adminSettings.passiveMultiplier;
        setBalance((prev) => ({
          ...prev,
          points: prev.points + delta,
          lifetimePoints: prev.lifetimePoints + delta,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stats.passiveRatePerSec, adminSettings.passiveMultiplier]);

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
      // Check energy
      if (energy.current < 1) {
        sounds.playError();
        return;
      }

      // Decrement energy
      setEnergy((prev) => ({ ...prev, current: Math.max(0, prev.current - 1) }));

      // Check Critical strike
      const isCrit = Math.random() < stats.criticalChance;
      const baseEarn = stats.tapPower * adminSettings.tapMultiplier;
      const earned = Math.round(isCrit ? baseEarn * stats.criticalMultiplier : baseEarn);

      // Play audio & haptics
      sounds.playTap(isCrit);
      if (hapticEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(isCrit ? [25, 30, 25] : 12);
      }

      // Add points
      setBalance((prev) => ({
        ...prev,
        points: prev.points + earned,
        lifetimePoints: prev.lifetimePoints + earned,
      }));

      // Update tap stats
      setStats((prev) => ({
        ...prev,
        totalTaps: prev.totalTaps + 1,
      }));

      // Accumulate tap batch for DB synchronization
      tapBatchRef.current.count += 1;
      tapBatchRef.current.points += earned;
      if (tapBatchRef.current.count >= 20) {
        const batch = { ...tapBatchRef.current };
        tapBatchRef.current = { count: 0, points: 0, startTime: Date.now() };
        dbService.syncTapBatch(profile.id, batch.count, Date.now() - batch.startTime, batch.points, batch.count);
      }

      // Update Mission progress for 'tap'
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

      // Update Achievement: First Tap & 1k Taps
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

      // Determine click coordinate for floating pop text
      let clientX = window.innerWidth / 2;
      let clientY = window.innerHeight / 2;

      if ('touches' in event && event.touches && event.touches[0]) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ('clientX' in event) {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      // Jitter
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

      // Calculate current cost: baseCost * (costMultiplier ^ currentLevel)
      const currentCost = Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel));

      if (balance.points < currentCost) {
        sounds.playError();
        return false;
      }

      // Check level requirement
      if (stats.level < upgrade.minPlayerLevel) {
        sounds.playError();
        return false;
      }

      // Deduct points
      const newBalance = balance.points - currentCost;
      setBalance((prev) => ({
        ...prev,
        points: newBalance,
      }));

      // Apply Upgrade Benefit
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
      }

      // Unlock skin if special upgrade
      if (upgrade.unlockedSkin) {
        setProfile((prev) => ({ ...prev, currentSkin: upgrade.unlockedSkin! }));
      }

      sounds.playUpgrade();

      // Record transaction
      dbService.recordTransaction({
        playerId: profile.id,
        amount: -currentCost,
        balanceAfter: newBalance,
        category: 'upgrade_purchase',
        description: `Upgraded ${upgrade.name} to level ${nextLevel}`,
        metadata: { upgradeId, nextLevel },
      });

      // Update Mission: buy_upgrade
      setMissions((prev) =>
        prev.map((m) => {
          if (m.targetAction === 'upgrade' && !m.isCompleted) {
            const prog = m.currentProgress + 1;
            return { ...m, currentProgress: prog, isCompleted: prog >= m.targetCount };
          }
          return m;
        })
      );

      // Check achievement: 5 upgrades
      setAchievements((prev) =>
        prev.map((ach) => {
          if (ach.id === 'ach_5_upgrades' && !ach.unlocked) {
            const totalUpgradesCount = upgrades.reduce((sum, u) => sum + (u.id === upgradeId ? nextLevel : u.currentLevel), 0);
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

      // Update missions for mini-game
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
  const connectPiAccount = useCallback(async (): Promise<boolean> => {
    try {
      const res = await piNetwork.authenticate();
      if (res && res.user) {
        sounds.playFanfare();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 },
        });

        setProfile((prev) => ({
          ...prev,
          username: res.user.username,
          displayName: res.user.username,
          piUid: res.user.uid,
          isPiConnected: true,
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Pi Auth error:', err);
      return false;
    }
  }, []);

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
        connectPiAccount,
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
