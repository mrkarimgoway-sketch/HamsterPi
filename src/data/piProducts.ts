export type AvatarFrameId =
  | 'none'
  | 'pioneer_spark'
  | 'gold_sovereign'
  | 'cyber_prism'
  | 'celestial_pi';

export interface AvatarFrameConfig {
  id: AvatarFrameId;
  name: string;
  nameAr: string;
  ringClass: string;
  discBorderClass: string;
  auraClass: string;
  badgeText?: string;
}

export const AVATAR_FRAMES: Record<AvatarFrameId, AvatarFrameConfig> = {
  none: {
    id: 'none',
    name: 'Classic Ring',
    nameAr: 'الإطار الكلاسيكي',
    ringClass: 'ring-2 ring-amber-500/60 shadow-sm shadow-amber-500/20',
    discBorderClass: 'border-4 border-amber-400/50',
    auraClass: 'from-amber-500/40 via-purple-600/30 to-amber-500/10',
  },
  pioneer_spark: {
    id: 'pioneer_spark',
    name: 'Pioneer Spark',
    nameAr: 'شرارة الرائد',
    ringClass:
      'ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.65)]',
    discBorderClass: 'border-4 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.4)]',
    auraClass: 'from-cyan-400/70 via-purple-500/60 to-cyan-400/30',
    badgeText: '⚡',
  },
  gold_sovereign: {
    id: 'gold_sovereign',
    name: 'Golden Sovereign',
    nameAr: 'الإطار الملكي الذهبي',
    ringClass:
      'ring-[3px] ring-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.75)]',
    discBorderClass: 'border-4 border-amber-300 shadow-[0_0_28px_rgba(251,191,36,0.5)]',
    auraClass: 'from-amber-300/80 via-yellow-500/60 to-orange-500/40',
    badgeText: '👑',
  },
  cyber_prism: {
    id: 'cyber_prism',
    name: 'Cyber Prism',
    nameAr: 'منشور السايبربانك',
    ringClass:
      'ring-[3px] ring-fuchsia-400 shadow-[0_0_16px_rgba(232,121,249,0.75)]',
    discBorderClass: 'border-4 border-fuchsia-400 shadow-[0_0_30px_rgba(232,121,249,0.5)]',
    auraClass: 'from-fuchsia-500/80 via-cyan-400/70 to-indigo-500/60',
    badgeText: '💎',
  },
  celestial_pi: {
    id: 'celestial_pi',
    name: 'Celestial Pi Aura',
    nameAr: 'هالة باي السماوية',
    ringClass:
      'ring-[3px] ring-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.85)]',
    discBorderClass: 'border-4 border-emerald-300 shadow-[0_0_36px_rgba(110,231,183,0.6)]',
    auraClass: 'from-emerald-300/85 via-amber-300/75 to-purple-500/75',
    badgeText: 'π',
  },
};

export const getAvatarFrameConfig = (frameId?: string): AvatarFrameConfig => {
  if (frameId && frameId in AVATAR_FRAMES) {
    return AVATAR_FRAMES[frameId as AvatarFrameId];
  }
  return AVATAR_FRAMES.none;
};

export const formatPiPrice = (price: number): string => {
  if (price >= 1) return price.toFixed(1);
  return Number(price.toFixed(3)).toString();
};

export interface PiProduct {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  pricePi: number;
  icon: string;
  badge?: string;
  badgeAr?: string;
  tab?: 'boosters' | 'exclusives';
  oneTimeOnly?: boolean;
  itemType?: 'bundle' | 'frame' | 'perk' | 'skin';
  rewardType:
    | 'points_bundle'
    | 'multiplier_boost'
    | 'skin_unlock'
    | 'frame_unlock'
    | 'permanent_perk';
  rewardPayload: {
    points?: number;
    seeds?: number;
    multiplier?: number;
    durationHours?: number;
    skin?: 'king' | 'cyber';
    frameId?: AvatarFrameId;
    passiveBonus?: number;
    passivePerHourBonus?: number;
    tapBonus?: number;
    maxEnergyBonus?: number;
    energyRefill?: boolean;
  };
}

export const PI_PRODUCTS: PiProduct[] = [
  // =========================================================================
  // TAB 1: BOOSTERS & PACKS (Repeatable packs, 0.001 π to 1.0 π)
  // =========================================================================
  {
    id: 'pi_pack_starter',
    name: 'Pioneer Starter Cache',
    nameAr: 'حزمة الرائد المبتدئ',
    description: 'Boost your empire with 50,000 Hamster Points and 10 Golden Seeds.',
    descriptionAr: 'عزز إمبراطوريتك بـ 50,000 نقطة هامستر و 10 بذور ذهبية.',
    pricePi: 0.001,
    icon: 'Sparkles',
    badge: 'Min 0.001 π',
    badgeAr: 'أقل سعر 0.001 π',
    tab: 'boosters',
    itemType: 'bundle',
    rewardType: 'points_bundle',
    rewardPayload: {
      points: 50000,
      seeds: 10,
    },
  },
  {
    id: 'pi_pack_energy',
    name: 'Surge Energy & Seed Pack',
    nameAr: 'حزمة الطاقة والبذور الذهبية',
    description: 'Instantly refill 100% energy plus 100,000 Hamster Points and 20 Golden Seeds.',
    descriptionAr: 'شحن كامل للطاقة فوراً مع 100,000 نقطة هامستر و 20 بذرة ذهبية.',
    pricePi: 0.025,
    icon: 'BatteryCharging',
    badge: 'Popular',
    badgeAr: 'الأكثر طلباً',
    tab: 'boosters',
    itemType: 'bundle',
    rewardType: 'points_bundle',
    rewardPayload: {
      points: 100000,
      seeds: 20,
      energyRefill: true,
    },
  },
  {
    id: 'pi_pack_booster',
    name: 'Hyper Turbo 3X Booster',
    nameAr: 'مضاعف التوربو الفائق 3X',
    description: 'Triple your tap power and passive point yield for 24 hours + 150,000 bonus points.',
    descriptionAr: 'مضاعفة قوة النقر والأرباح التلقائية 3 أضعاف لمدة 24 ساعة + 150,000 نقطة إضافية.',
    pricePi: 0.15,
    icon: 'Zap',
    badge: 'Best Value',
    badgeAr: 'أفضل قيمة',
    tab: 'boosters',
    itemType: 'bundle',
    rewardType: 'multiplier_boost',
    rewardPayload: {
      multiplier: 3.0,
      durationHours: 24,
      points: 150000,
    },
  },
  {
    id: 'pi_pack_whale',
    name: 'Galactic Pioneer Vault',
    nameAr: 'خزينة الرواد المجرية',
    description: 'Massive treasury of 2,500,000 Hamster Points and 100 Golden Seeds for true tycoon masters.',
    descriptionAr: 'خزينة عملاقة تحتوي على 2,500,000 نقطة هامستر و 100 بذرة ذهبية لرواد القمة.',
    pricePi: 1.0,
    icon: 'Coins',
    badge: 'Mega Tier',
    badgeAr: 'الفئة الكبرى',
    tab: 'boosters',
    itemType: 'bundle',
    rewardType: 'points_bundle',
    rewardPayload: {
      points: 2500000,
      seeds: 100,
    },
  },

  // =========================================================================
  // TAB 2: FRAMES & EXCLUSIVES (Strictly One-Time Purchase Only, 0.001 π - 1.0 π)
  // =========================================================================
  {
    id: 'pi_frame_pioneer_spark',
    name: 'Pioneer Spark Frame',
    nameAr: 'إطار شرارة الرائد',
    description: 'Equip an electric cyan avatar frame across your profile & tap arena + 5,000 bonus points.',
    descriptionAr: 'إطار سماوي متوهج لصورتك وساحة النقر + 5,000 نقطة هدية (شراء لمرة واحدة).',
    pricePi: 0.001,
    icon: 'Frame',
    badge: '1x Exclusive',
    badgeAr: 'لمرة واحدة',
    tab: 'exclusives',
    oneTimeOnly: true,
    itemType: 'frame',
    rewardType: 'frame_unlock',
    rewardPayload: {
      frameId: 'pioneer_spark',
      points: 5000,
    },
  },
  {
    id: 'pi_perk_overdrive_core',
    name: 'Lifetime Overdrive Core',
    nameAr: 'نواة الطاقة الدائمة',
    description: 'Permanent +15 Tap Power and +500 Max Energy capacity added forever to your pioneer.',
    descriptionAr: 'زيادة دائمة +15 لقوة النقر و +500 لسعة الطاقة القصوى مدى الحياة.',
    pricePi: 0.05,
    icon: 'Cpu',
    badge: '1x Permanent',
    badgeAr: 'ترقية دائمة',
    tab: 'exclusives',
    oneTimeOnly: true,
    itemType: 'perk',
    rewardType: 'permanent_perk',
    rewardPayload: {
      tapBonus: 15,
      maxEnergyBonus: 500,
    },
  },
  {
    id: 'pi_frame_gold_sovereign',
    name: 'Golden Sovereign Frame',
    nameAr: 'الإطار الملكي الذهبي',
    description: 'Radiant royal gold avatar frame with a permanent +10 Tap Power boost.',
    descriptionAr: 'إطار ذهبي ملكي فاخر لصورتك مع زيادة دائمة +10 لقوة النقر.',
    pricePi: 0.15,
    icon: 'Frame',
    badge: '1x Exclusive',
    badgeAr: 'لمرة واحدة',
    tab: 'exclusives',
    oneTimeOnly: true,
    itemType: 'frame',
    rewardType: 'frame_unlock',
    rewardPayload: {
      frameId: 'gold_sovereign',
      tapBonus: 10,
    },
  },
  {
    id: 'pi_pack_king_skin',
    name: 'Royal Sovereign Outfit',
    nameAr: 'زي الملك المتوج الفاخر',
    description: 'Unlock the Pi Sovereign King skin immediately with a permanent +15% passive yield and 500,000 points.',
    descriptionAr: 'افتح مظهر ملك باي المتوج فوراً مع +15% إنتاج دائم و 500,000 نقطة.',
    pricePi: 0.35,
    icon: 'Crown',
    badge: '1x Outfit',
    badgeAr: 'زي حصري',
    tab: 'exclusives',
    oneTimeOnly: true,
    itemType: 'skin',
    rewardType: 'skin_unlock',
    rewardPayload: {
      skin: 'king',
      points: 500000,
      passiveBonus: 0.15,
    },
  },
  {
    id: 'pi_frame_cyber_prism',
    name: 'Cyber Prism Frame',
    nameAr: 'إطار منشور السايبربانك',
    description: 'Holographic neon avatar frame with a permanent +15% passive mining yield boost.',
    descriptionAr: 'إطار نيون هولوغرافي لصورتك مع زيادة دائمة +15% للإنتاج التلقائي.',
    pricePi: 0.45,
    icon: 'Frame',
    badge: '1x Exclusive',
    badgeAr: 'لمرة واحدة',
    tab: 'exclusives',
    oneTimeOnly: true,
    itemType: 'frame',
    rewardType: 'frame_unlock',
    rewardPayload: {
      frameId: 'cyber_prism',
      passiveBonus: 0.15,
    },
  },
  {
    id: 'pi_pack_cyber_skin',
    name: 'Cyberpunk Nexus Armor',
    nameAr: 'درع سايبربانك المستقبلي',
    description: 'Unlock the Cyberpunk Visor & Skin with permanent +25 tap power and 750,000 bonus points.',
    descriptionAr: 'افتح نظارة ومظهر سايبربانك مع +25 قوة نقر دائمة و 750,000 نقطة.',
    pricePi: 0.65,
    icon: 'Eye',
    badge: '1x Outfit',
    badgeAr: 'زي حصري',
    tab: 'exclusives',
    oneTimeOnly: true,
    itemType: 'skin',
    rewardType: 'skin_unlock',
    rewardPayload: {
      skin: 'cyber',
      points: 750000,
      tapBonus: 25,
    },
  },
  {
    id: 'pi_perk_quantum_reactor',
    name: 'Pioneer Genesis Reactor',
    nameAr: 'مفاعل باي الجيني الدائم',
    description: 'Permanent +10,000/hr passive mining yield and 50 Golden Seeds.',
    descriptionAr: 'مكسب دائم +10,000 نقطة/ساعة في التعدين التلقائي و 50 بذرة ذهبية.',
    pricePi: 0.85,
    icon: 'Atom',
    badge: '1x Permanent',
    badgeAr: 'ترقية دائمة',
    tab: 'exclusives',
    oneTimeOnly: true,
    itemType: 'perk',
    rewardType: 'permanent_perk',
    rewardPayload: {
      passivePerHourBonus: 10000,
      seeds: 50,
    },
  },
  {
    id: 'pi_frame_celestial_pi',
    name: 'Celestial Pi Aura Frame',
    nameAr: 'إطار هالة باي السماوية',
    description: 'Legendary emerald-cosmic avatar frame +25 permanent Tap Power & 250,000 bonus points.',
    descriptionAr: 'إطار أسطوري بهالة باي السماوية مع +25 قوة نقر دائمة و 250,000 نقطة.',
    pricePi: 1.0,
    icon: 'Frame',
    badge: '1x Legendary',
    badgeAr: 'إطار أسطوري',
    tab: 'exclusives',
    oneTimeOnly: true,
    itemType: 'frame',
    rewardType: 'frame_unlock',
    rewardPayload: {
      frameId: 'celestial_pi',
      tapBonus: 25,
      points: 250000,
    },
  },
];
