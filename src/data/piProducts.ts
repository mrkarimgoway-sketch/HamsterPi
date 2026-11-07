export interface PiProduct {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  pricePi: number;
  icon: string;
  badge?: string;
  rewardType: 'points_bundle' | 'multiplier_boost' | 'skin_unlock';
  rewardPayload: {
    points?: number;
    seeds?: number;
    multiplier?: number;
    durationHours?: number;
    skin?: 'king' | 'cyber';
    passiveBonus?: number;
    tapBonus?: number;
  };
}

export const PI_PRODUCTS: PiProduct[] = [
  {
    id: 'pi_pack_starter',
    name: 'Pioneer Starter Cache',
    nameAr: 'حزمة الرائد المبتدئ',
    description: 'Boost your empire with 50,000 Hamster Points and 10 Golden Seeds.',
    descriptionAr: 'عزز إمبراطوريتك بـ 50,000 نقطة هامستر و 10 بذور ذهبية.',
    pricePi: 0.5,
    icon: 'Sparkles',
    badge: 'Popular',
    rewardType: 'points_bundle',
    rewardPayload: {
      points: 50000,
      seeds: 10,
    },
  },
  {
    id: 'pi_pack_booster',
    name: 'Hyper Turbo 3X Booster',
    nameAr: 'مضاعف التوربو الفائق 3X',
    description: 'Triple your tap power and passive point yield for 24 hours + 150,000 bonus points.',
    descriptionAr: 'مضاعفة قوة النقر والأرباح التلقائية 3 أضعاف لمدة 24 ساعة + 150,000 نقطة إضافية.',
    pricePi: 1.0,
    icon: 'Zap',
    badge: 'Best Value',
    rewardType: 'multiplier_boost',
    rewardPayload: {
      multiplier: 3.0,
      durationHours: 24,
      points: 150000,
    },
  },
  {
    id: 'pi_pack_king_skin',
    name: 'Royal Sovereign Outfit',
    nameAr: 'زي الملك المتوج الفاخر',
    description: 'Unlock the Pi Sovereign King skin immediately with a permanent +15% yield and 500,000 points.',
    descriptionAr: 'افتح مظهر ملك باي المتوج فوراً مع +15% إنتاج دائم و 500,000 نقطة.',
    pricePi: 2.5,
    icon: 'Crown',
    badge: 'Cosmetic + Boost',
    rewardType: 'skin_unlock',
    rewardPayload: {
      skin: 'king',
      points: 500000,
      passiveBonus: 0.15,
    },
  },
  {
    id: 'pi_pack_cyber_skin',
    name: 'Cyberpunk Nexus Armor',
    nameAr: 'درع سايبربانك المستقبلي',
    description: 'Unlock the Cyberpunk Visor & Skin with +25 tap power and 750,000 bonus points.',
    descriptionAr: 'افتح نظارة ومظهر سايبربانك مع +25 قوة نقر إضافية و 750,000 نقطة.',
    pricePi: 3.0,
    icon: 'Eye',
    badge: 'Exclusive',
    rewardType: 'skin_unlock',
    rewardPayload: {
      skin: 'cyber',
      points: 750000,
      tapBonus: 25,
    },
  },
  {
    id: 'pi_pack_whale',
    name: 'Galactic Pioneer Vault',
    nameAr: 'خزينة الرواد المجرية',
    description: 'Massive treasury of 2,500,000 Hamster Points and 100 Golden Seeds for true tycoon masters.',
    descriptionAr: 'خزينة عملاقة تحتوي على 2,500,000 نقطة هامستر و 100 بذرة ذهبية لرواد القمة.',
    pricePi: 5.0,
    icon: 'Coins',
    badge: 'Mega Tier',
    rewardType: 'points_bundle',
    rewardPayload: {
      points: 2500000,
      seeds: 100,
    },
  },
];
