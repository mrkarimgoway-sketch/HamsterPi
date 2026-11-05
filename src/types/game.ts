export type Language = 'en' | 'ar';

export type HamsterSkin = 'default' | 'king' | 'cyber';

export interface PiUser {
  uid: string;
  username: string;
  accessToken?: string;
  verified: boolean;
  isSandbox?: boolean;
}

export interface PlayerProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  currentSkin: HamsterSkin;
  role: 'pioneer' | 'admin';
  referralCode: string;
  referredBy?: string;
  isPiConnected: boolean;
  piUid?: string;
}

export interface PlayerStats {
  level: number;
  levelTitle: string;
  totalTaps: number;
  tapPower: number;
  passiveRatePerSec: number;
  passiveRatePerHour: number;
  criticalChance: number;
  criticalMultiplier: number;
  loginStreak: number;
  lastLoginDate: string;
  minigamesPlayed: number;
  highestMinigameScore: number;
  referralCount: number;
}

export interface PlayerBalance {
  points: number;
  lifetimePoints: number;
  goldenSeeds: number;
}

export interface EnergyState {
  current: number;
  max: number;
  regenRatePerSec: number;
}

export interface UpgradeItem {
  id: string;
  category: 'hamster' | 'business' | 'special';
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  baseCost: number;
  costMultiplier: number;
  baseBenefit: number;
  benefitType: 'tap_power' | 'passive_per_sec' | 'max_energy' | 'regen_rate' | 'crit_chance';
  currentLevel: number;
  minPlayerLevel: number;
  unlockedSkin?: HamsterSkin;
}

export interface Mission {
  id: string;
  frequency: 'daily' | 'weekly';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  targetAction: 'tap' | 'play_minigame' | 'upgrade' | 'rush_score' | 'referral';
  targetCount: number;
  currentProgress: number;
  rewardPoints: number;
  rewardSeeds: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardPoints: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  levelTitle: string;
  points: number;
  skin: HamsterSkin;
  isCurrentPlayer?: boolean;
}

export interface ReferralFriend {
  id: string;
  username: string;
  joinedAt: string;
  rewardClaimed: number;
  activeLevel: number;
}

export interface TapFloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  isCrit?: boolean;
}
