import {
  Achievement,
  HamsterSkin,
  Language,
  Mission,
  SocialTask,
  UpgradeItem,
} from '../types/game';
import { AvatarFrameConfig, PiProduct } from '../data/piProducts';
import { PiEcosystemProject } from '../data/piProjects';

type NonEnArLang = 'vi' | 'id' | 'zh' | 'th' | 'tr' | 'ru';

// ============================================================================
// 1. LEVEL TITLES
// ============================================================================
const LEVEL_TITLE_TRANSLATIONS: Record<string, Record<Exclude<Language, 'en'>, string>> = {
  'Bronze Hamster': {
    ar: 'هامستر برونزي',
    vi: 'Hamster Đồng',
    id: 'Hamster Perunggu',
    zh: '青铜仓鼠',
    th: 'แฮมสเตอร์ทองแดง',
    tr: 'Bronz Hamster',
    ru: 'Бронзовый хомяк',
  },
  'Junior Hamster': {
    ar: 'هامستر مبتدئ',
    vi: 'Hamster Tập Sự',
    id: 'Hamster Junior',
    zh: '初级仓鼠',
    th: 'แฮมสเตอร์ฝึกหัด',
    tr: 'Genç Hamster',
    ru: 'Младший хомяк',
  },
  'Wheel Enthusiast': {
    ar: 'عاشق العجلة',
    vi: 'Tín Đồ Bánh Xe',
    id: 'Penggemar Roda',
    zh: '滚轮达人',
    th: 'นักปั่นวงล้อ',
    tr: 'Çark Tutkunu',
    ru: 'Любитель колеса',
  },
  'Acorn Baron': {
    ar: 'بارون البلوط',
    vi: 'Nam Tước Hạt Dẻ',
    id: 'Baron Biji Ek',
    zh: '橡果男爵',
    th: 'บารอนลูกโอ๊ก',
    tr: 'Meşe Palamudu Baronu',
    ru: 'Барон желудей',
  },
  'Silver Forager': {
    ar: 'الجامع الفضي',
    vi: 'Thợ Săn Bạc',
    id: 'Pengumpul Perak',
    zh: '白银觅食者',
    th: 'นักหาอาหารเงิน',
    tr: 'Gümüş Toplayıcı',
    ru: 'Серебряный собиратель',
  },
  'Gold Pioneer': {
    ar: 'الرائد الذهبي',
    vi: 'Tiên Phong Vàng',
    id: 'Perintis Emas',
    zh: '黄金先锋',
    th: 'ผู้บุกเบิกทองคำ',
    tr: 'Altın Öncü',
    ru: 'Золотой пионер',
  },
  'Galactic Pioneer': {
    ar: 'رائد المجرة',
    vi: 'Tiên Phong Thiên Hà',
    id: 'Perintis Galaksi',
    zh: '银河先锋',
    th: 'ผู้บุกเบิกกาแล็กซี',
    tr: 'Galaktik Öncü',
    ru: 'Галактический пионер',
  },
  'Master Strategist': {
    ar: 'كبير الاستراتيجيين',
    vi: 'Bậc Thầy Chiến Lược',
    id: 'Ahli Strategi',
    zh: '战略大师',
    th: 'ปรมาจารย์กลยุทธ์',
    tr: 'Usta Stratejist',
    ru: 'Мастер стратегии',
  },
  'Diamond CEO': {
    ar: 'المدير الماسي',
    vi: 'CEO Kim Cương',
    id: 'CEO Berlian',
    zh: '钻石总裁',
    th: 'ซีอีโอเพชร',
    tr: 'Elmas CEO',
    ru: 'Алмазный CEO',
  },
  'Pi Sovereign': {
    ar: 'سيد باي المتوج',
    vi: 'Quân Vương Pi',
    id: 'Penguasa Pi',
    zh: 'Pi 至尊君主',
    th: 'ราชาผู้ครอง Pi',
    tr: 'Pi Hükümdarı',
    ru: 'Владыка Pi',
  },
};

export const translateLevelTitle = (title: string, language: Language): string => {
  if (language === 'en') return title;
  return LEVEL_TITLE_TRANSLATIONS[title]?.[language] || title;
};

// ============================================================================
// 2. HAMSTER SKINS
// ============================================================================
const SKIN_TRANSLATIONS: Record<
  HamsterSkin,
  Record<Exclude<Language, 'en'>, { name: string; description: string; reqTitle: string }>
> = {
  default: {
    ar: {
      name: 'رائد مبتدئ',
      description: 'الهامستر الأيقوني النشيط المرتدي لقلادة باي الذهبية.',
      reqTitle: 'مفتوح افتراضياً',
    },
    vi: {
      name: 'Tân Binh Tiên Phong',
      description: 'Chú Hamster năng động đeo dây chuyền Pi vàng biểu tượng.',
      reqTitle: 'Mở khóa mặc định',
    },
    id: {
      name: 'Kadet Perintis',
      description: 'Hamster ikonik penuh energi dengan liontin Pi emas.',
      reqTitle: 'Terbuka secara default',
    },
    zh: {
      name: '先锋学员',
      description: '佩戴金色 Pi 吊坠的经典活力仓鼠。',
      reqTitle: '默认解锁',
    },
    th: {
      name: 'ผู้บุกเบิกฝึกหัด',
      description: 'แฮมสเตอร์สุดคึกคักสวมจี้ทอง Pi อันเป็นเอกลักษณ์',
      reqTitle: 'ปลดล็อกเริ่มต้น',
    },
    tr: {
      name: 'Öncü Adayı',
      description: 'Altın Pi kolyesi takan ikonik enerjik Hamster.',
      reqTitle: 'Varsayılan olarak açık',
    },
    ru: {
      name: 'Кадет-пионер',
      description: 'Культовый энергичный хомяк с золотым кулоном Pi.',
      reqTitle: 'Открыто по умолчанию',
    },
  },
  king: {
    ar: {
      name: 'ملك باي المتوج',
      description: 'تاج ذهبي ملكي وعباءة فاخرة. +15% إنتاج تلقائي للنقاط.',
      reqTitle: 'افتح ترقية تاج باي الملكي',
    },
    vi: {
      name: 'Vua Tối Cao Pi',
      description: 'Vương miện vàng hoàng gia và áo choàng. +15% điểm thụ động.',
      reqTitle: 'Mở khóa nâng cấp Vương Miện Pi Hoàng Gia',
    },
    id: {
      name: 'Raja Berdaulat Pi',
      description: 'Mahkota emas kerajaan dan jubah mewah. +15% hasil pasif.',
      reqTitle: 'Buka upgrade Mahkota Kerajaan Pi',
    },
    zh: {
      name: 'Pi 至尊国王',
      description: '皇室金冠与王者披风。+15% 被动积分产出。',
      reqTitle: '解锁皇家 Pi 王冠升级',
    },
    th: {
      name: 'ราชาผู้ยิ่งใหญ่แห่ง Pi',
      description: 'มงกุฎทองคำและผ้าคลุมราชวงศ์ +15% รายได้อัตโนมัติ',
      reqTitle: 'ปลดล็อกอัปเกรดมงกุฎ Pi แห่งราชวงศ์',
    },
    tr: {
      name: 'Pi Hükümdar Kral',
      description: 'Kraliyet altın tacı ve pelerini. +%15 pasif puan geliri.',
      reqTitle: 'Kraliyet Pi Tacı yükseltmesini açın',
    },
    ru: {
      name: 'Король Pi',
      description: 'Королевская золотая корона и мантия. +15% к пассивному доходу.',
      reqTitle: 'Откройте улучшение Королевская корона Pi',
    },
  },
  cyber: {
    ar: {
      name: 'سايبربانك المستقبلي',
      description: 'نظارة هولوغرافية مستقبلية ودوائر إلكترونية. +20 قوة نقر.',
      reqTitle: 'افتح ترقية نظارة سايبربانك',
    },
    vi: {
      name: 'Tiên Phong Cyberpunk',
      description: 'Kính thực tế ảo tương lai và mạch điện tử. +20 sức chạm.',
      reqTitle: 'Mở khóa nâng cấp Kính Cyberpunk',
    },
    id: {
      name: 'Perintis Cyberpunk',
      description: 'Visor holografik futuristik dan sirkuit sibernetik. +20 kekuatan tap.',
      reqTitle: 'Buka upgrade Visor Cyberpunk',
    },
    zh: {
      name: '赛博朋克先锋',
      description: '未来全息护目镜与赛博机械电路。+20 点击威力。',
      reqTitle: '解锁赛博朋克护目镜升级',
    },
    th: {
      name: 'ผู้บุกเบิกไซเบอร์พังก์',
      description: 'แว่นโฮโลแกรมอนาคตและวงจรไซเบอร์ +20 พลังแตะ',
      reqTitle: 'ปลดล็อกอัปเกรดแว่นไซเบอร์พังก์',
    },
    tr: {
      name: 'Siberpunk Öncü',
      description: 'Fütüristik holografik vizör ve sibernetik devreler. +20 dokunuş gücü.',
      reqTitle: 'Siberpunk Vizörü yükseltmesini açın',
    },
    ru: {
      name: 'Киберпанк-пионер',
      description: 'Футуристический голографический визор и киберсхемы. +20 к силе клика.',
      reqTitle: 'Откройте улучшение Киберпанк-визор',
    },
  },
};

export const getLocalizedSkin = (
  skinKey: HamsterSkin,
  skin: { name: string; nameAr: string; description: string; reqTitle: string },
  language: Language
) => {
  if (language === 'en') {
    return { name: skin.name, description: skin.description, reqTitle: skin.reqTitle };
  }
  const entry = SKIN_TRANSLATIONS[skinKey]?.[language];
  return {
    name: language === 'ar' ? skin.nameAr : entry?.name || skin.name,
    description: entry?.description || skin.description,
    reqTitle: entry?.reqTitle || skin.reqTitle,
  };
};

// ============================================================================
// 3. AVATAR FRAMES
// ============================================================================
const FRAME_TRANSLATIONS: Record<string, Record<NonEnArLang, { name: string; shortName: string }>> = {
  none: {
    vi: { name: 'Vòng Cổ Điển', shortName: 'Cổ điển' },
    id: { name: 'Cincin Klasik', shortName: 'Klasik' },
    zh: { name: '经典圆环', shortName: '经典' },
    th: { name: 'วงแหวนคลาสสิก', shortName: 'คลาสสิก' },
    tr: { name: 'Klasik Halka', shortName: 'Klasik' },
    ru: { name: 'Классика', shortName: 'Классика' },
  },
  pioneer_spark: {
    vi: { name: 'Tia Lửa Tiên Phong', shortName: 'Tia Lửa' },
    id: { name: 'Percikan Perintis', shortName: 'Percikan' },
    zh: { name: '先锋电光', shortName: '电光' },
    th: { name: 'ประกายผู้บุกเบิก', shortName: 'ประกาย' },
    tr: { name: 'Öncü Kıvılcımı', shortName: 'Kıvılcım' },
    ru: { name: 'Искра пионера', shortName: 'Искра' },
  },
  gold_sovereign: {
    vi: { name: 'Hoàng Kim Tối Cao', shortName: 'Hoàng Kim' },
    id: { name: 'Emas Berdaulat', shortName: 'Emas' },
    zh: { name: '黄金君主', shortName: '黄金' },
    th: { name: 'ทองคำราชวงศ์', shortName: 'ทองคำ' },
    tr: { name: 'Altın Hükümdar', shortName: 'Altın' },
    ru: { name: 'Золотой монарх', shortName: 'Золотой' },
  },
  cyber_prism: {
    vi: { name: 'Lăng Kính Cyber', shortName: 'Lăng Kính' },
    id: { name: 'Prisma Siber', shortName: 'Prisma' },
    zh: { name: '赛博棱镜', shortName: '棱镜' },
    th: { name: 'ปริซึมไซเบอร์', shortName: 'ปริซึม' },
    tr: { name: 'Siber Prizma', shortName: 'Prizma' },
    ru: { name: 'Кибер-призма', shortName: 'Призма' },
  },
  celestial_pi: {
    vi: { name: 'Hào Quang Thiên Thể Pi', shortName: 'Thiên Thể' },
    id: { name: 'Aura Pi Surgawi', shortName: 'Surgawi' },
    zh: { name: '天界 Pi 光环', shortName: '天界' },
    th: { name: 'ออร่า Pi สวรรค์', shortName: 'สวรรค์' },
    tr: { name: 'Göksel Pi Aurası', shortName: 'Göksel' },
    ru: { name: 'Небесная аура Pi', shortName: 'Небеса' },
  },
};

export const getLocalizedFrame = (frame: AvatarFrameConfig, language: Language) => {
  if (language === 'en') {
    return { name: frame.name, shortName: frame.name.split(' ')[0] };
  }
  if (language === 'ar') {
    return { name: frame.nameAr, shortName: frame.nameAr.split(' ')[0] };
  }
  const entry = FRAME_TRANSLATIONS[frame.id]?.[language];
  return {
    name: entry?.name || frame.name,
    shortName: entry?.shortName || frame.name.split(' ')[0],
  };
};

// ============================================================================
// 4. SOCIAL TASKS
// ============================================================================
const SOCIAL_TASK_TRANSLATIONS: Record<
  string,
  Record<NonEnArLang, { title: string; description: string; actionLabel: string }>
> = {
  social_telegram: {
    vi: {
      title: 'Telegram: Tin Tức Mới Nhất',
      description: 'Mở kênh Telegram chính thức để xem thông báo và cập nhật mới nhất.',
      actionLabel: 'Xem Tin Mới Nhất',
    },
    id: {
      title: 'Telegram: Berita Ekosistem Terbaru',
      description: 'Buka saluran Telegram resmi kami untuk melihat pengumuman & pembaruan terbaru.',
      actionLabel: 'Lihat Berita Terbaru',
    },
    zh: {
      title: 'Telegram：最新生态动态',
      description: '打开我们的官方 Telegram 频道，查看最新公告和更新。',
      actionLabel: '查看最新资讯',
    },
    th: {
      title: 'Telegram: ข่าวสารระบบนิเวศล่าสุด',
      description: 'เปิดช่อง Telegram อย่างเป็นทางการของเราเพื่อดูประกาศและการอัปเดตล่าสุด',
      actionLabel: 'ดูข่าวล่าสุด',
    },
    tr: {
      title: 'Telegram: En Son Ekosistem Haberleri',
      description: 'En son duyuruları ve güncellemeleri görmek için resmi Telegram kanalımızı açın.',
      actionLabel: 'Son Haberleri Gör',
    },
    ru: {
      title: 'Telegram: Последние новости',
      description: 'Откройте наш официальный канал Telegram, чтобы узнать свежие новости и обновления.',
      actionLabel: 'Читать новости',
    },
  },
  social_youtube: {
    vi: {
      title: 'YouTube: Xem Video Mới',
      description: 'Truy cập kênh YouTube chính thức của HamsterPi và xem video mới nhất.',
      actionLabel: 'Xem Video',
    },
    id: {
      title: 'YouTube: Tonton Video Baru',
      description: 'Kunjungi saluran YouTube resmi HamsterPi dan tonton video terbaru kami.',
      actionLabel: 'Tonton Video',
    },
    zh: {
      title: 'YouTube：观看新视频',
      description: '访问 HamsterPi 官方 YouTube 频道并观看我们的最新视频。',
      actionLabel: '观看视频',
    },
    th: {
      title: 'YouTube: ชมวิดีโอใหม่',
      description: 'เยี่ยมชมช่อง YouTube อย่างเป็นทางการของ HamsterPi และชมวิดีโอล่าสุดของเรา',
      actionLabel: 'ชมวิดีโอ',
    },
    tr: {
      title: 'YouTube: Yeni Videoyu İzle',
      description: 'Resmi HamsterPi YouTube kanalını ziyaret edin ve en yeni videomuzu izleyin.',
      actionLabel: 'Videoyu İzle',
    },
    ru: {
      title: 'YouTube: Смотрите новое видео',
      description: 'Перейдите на официальный канал HamsterPi на YouTube и посмотрите новый ролик.',
      actionLabel: 'Смотреть видео',
    },
  },
  social_x: {
    vi: {
      title: 'X (Twitter): Đọc Bài Đăng Mới',
      description: 'Xem chuỗi bài viết cộng đồng và tin tức nóng hổi trên tài khoản X của chúng tôi.',
      actionLabel: 'Xem Bài Mới Nhất',
    },
    id: {
      title: 'X (Twitter): Baca Postingan Terbaru',
      description: 'Cek utas komunitas terbaru dan berita hangat di akun X kami.',
      actionLabel: 'Lihat Postingan',
    },
    zh: {
      title: 'X (Twitter)：阅读最新推文',
      description: '查看我们 X 账号上的最新社区讨论和突发动态。',
      actionLabel: '查看最新推文',
    },
    th: {
      title: 'X (Twitter): อ่านโพสต์ล่าสุด',
      description: 'ติดตามเธรดชุมชนและข่าวด่วนล่าสุดบนบัญชี X ของเรา',
      actionLabel: 'ดูโพสต์ล่าสุด',
    },
    tr: {
      title: 'X (Twitter): Son Gönderiyi Oku',
      description: 'X hesabımızdaki en yeni topluluk paylaşımlarını ve son dakika gönderilerini inceleyin.',
      actionLabel: 'Son Gönderiyi Gör',
    },
    ru: {
      title: 'X (Twitter): Читайте новый пост',
      description: 'Ознакомьтесь с последними публикациями и новостями сообщества в нашем аккаунте X.',
      actionLabel: 'Открыть пост',
    },
  },
  social_facebook: {
    vi: {
      title: 'Facebook: Tiêu Điểm Cộng Đồng',
      description: 'Đọc bản cập nhật nổi bật hôm nay và tin tức cộng đồng trên Facebook.',
      actionLabel: 'Xem Cập Nhật',
    },
    id: {
      title: 'Facebook: Sorotan Komunitas',
      description: 'Baca pembaruan unggulan hari ini dan sorotan komunitas di Facebook.',
      actionLabel: 'Lihat Pembaruan',
    },
    zh: {
      title: 'Facebook：社区焦点动态',
      description: '在 Facebook 上阅读今日精选更新与社区亮点。',
      actionLabel: '查看更新',
    },
    th: {
      title: 'Facebook: ไฮไลต์ชุมชน',
      description: 'อ่านอัปเดตเด่นประจำวันและเรื่องราวน่าสนใจของชุมชนบน Facebook',
      actionLabel: 'ดูอัปเดต',
    },
    tr: {
      title: 'Facebook: Topluluk Gündemi',
      description: 'Facebook sayfamızdaki bugünkü öne çıkan güncellemeyi ve topluluk özetini okuyun.',
      actionLabel: 'Güncellemeyi Gör',
    },
    ru: {
      title: 'Facebook: Новости сообщества',
      description: 'Прочитайте сегодняшнее важное обновление и новости сообщества на Facebook.',
      actionLabel: 'Открыть пост',
    },
  },
  social_instagram: {
    vi: {
      title: 'Instagram: Story & Khoảnh Khắc',
      description: 'Khám phá hình ảnh, thước phim ngắn và thông báo mới nhất trên Instagram.',
      actionLabel: 'Xem Instagram',
    },
    id: {
      title: 'Instagram: Story & Sorotan',
      description: 'Jelajahi visual, reels, dan pengumuman HamsterPi terbaru di Instagram.',
      actionLabel: 'Lihat Instagram',
    },
    zh: {
      title: 'Instagram：快拍与精选',
      description: '在 Instagram 上探索 HamsterPi 的最新视觉图集、短视频与公告。',
      actionLabel: '浏览 Instagram',
    },
    th: {
      title: 'Instagram: สตอรี่และไฮไลต์',
      description: 'สำรวจภาพ คลิป Reels และประกาศล่าสุดของ HamsterPi บน Instagram',
      actionLabel: 'ดู Instagram',
    },
    tr: {
      title: 'Instagram: Hikayeler ve Öne Çıkanlar',
      description: 'Instagram hesabımızda en yeni HamsterPi görsellerini, reels videolarını ve duyuruları keşfedin.',
      actionLabel: "Instagram'ı Aç",
    },
    ru: {
      title: 'Instagram: Истории и публикации',
      description: 'Смотрите свежие фото, ролики Reels и анонсы HamsterPi в Instagram.',
      actionLabel: 'Открыть Instagram',
    },
  },
  social_tiktok: {
    vi: {
      title: 'TikTok: Xem Clip Ngắn Mới',
      description: 'Xem clip HamsterPi mới nhất và các xu hướng nổi bật trên TikTok.',
      actionLabel: 'Xem Clip',
    },
    id: {
      title: 'TikTok: Tonton Klip Singkat Baru',
      description: 'Tonton klip terbaru HamsterPi dan tren seru di TikTok.',
      actionLabel: 'Tonton Klip',
    },
    zh: {
      title: 'TikTok：观看新短视频',
      description: '在 TikTok 上观看我们最新的 HamsterPi 短视频与热门动态。',
      actionLabel: '观看短视频',
    },
    th: {
      title: 'TikTok: ชมคลิปสั้นใหม่',
      description: 'รับชมคลิปสั้นล่าสุดของ HamsterPi และเทรนด์ใหม่ๆ บน TikTok',
      actionLabel: 'ชมคลิป',
    },
    tr: {
      title: 'TikTok: Yeni Kısa Klibi İzle',
      description: 'TikTok üzerindeki en yeni HamsterPi klibimizi ve trendleri izleyin.',
      actionLabel: 'Klibi İzle',
    },
    ru: {
      title: 'TikTok: Смотрите новый ролик',
      description: 'Посмотрите новейший короткий ролик и тренды HamsterPi в TikTok.',
      actionLabel: 'Смотреть ролик',
    },
  },
};

export const getLocalizedSocialTask = (task: SocialTask, language: Language) => {
  if (language === 'en') {
    return { title: task.title, description: task.description, actionLabel: task.actionLabel };
  }
  if (language === 'ar') {
    return { title: task.titleAr, description: task.descriptionAr, actionLabel: task.actionLabelAr };
  }
  const entry = SOCIAL_TASK_TRANSLATIONS[task.id]?.[language];
  return {
    title: entry?.title || task.title,
    description: entry?.description || task.description,
    actionLabel: entry?.actionLabel || task.actionLabel,
  };
};

// ============================================================================
// 5. MISSIONS
// ============================================================================
const MISSION_TRANSLATIONS: Record<string, Record<NonEnArLang, { title: string; description: string }>> = {
  m_tap_100: {
    vi: { title: 'Nạp Năng Lượng Bánh Xe', description: 'Chạm vào Hamster 200 lần trong hôm nay' },
    id: { title: 'Isi Energi Roda', description: 'Ketuk Hamster 200 kali hari ini' },
    zh: { title: '激活滚轮能量', description: '今天点击仓鼠 200 次' },
    th: { title: 'ชาร์จพลังวงล้อ', description: 'แตะแฮมสเตอร์ 200 ครั้งในวันนี้' },
    tr: { title: 'Çarka Enerji Ver', description: 'Bugün Hamster’a 200 kez dokun' },
    ru: { title: 'Заряди колесо', description: 'Нажмите на хомяка 200 раз сегодня' },
  },
  m_play_games: {
    vi: { title: 'Nhà Thám Hiểm Arcade', description: 'Chơi 2 mini-game bất kỳ trong Pi Arcade' },
    id: { title: 'Penjelajah Arkade', description: 'Mainkan 2 mini-game apa saja di Pi Arkade' },
    zh: { title: '街机探索者', description: '在 Pi 街机中游玩任意 2 款小游戏' },
    th: { title: 'นักสำรวจอาร์เคด', description: 'เล่นมินิเกมใดก็ได้ 2 เกมใน Pi อาร์เคด' },
    tr: { title: 'Atari Kaşifi', description: 'Pi Atari salonunda herhangi 2 mini oyun oyna' },
    ru: { title: 'Исследователь аркад', description: 'Сыграйте в любые 2 мини-игры в Pi Аркаде' },
  },
  m_buy_upgrade: {
    vi: { title: 'Mở Rộng Tiên Phong', description: 'Mua hoặc nâng cấp 1 mục nâng cấp' },
    id: { title: 'Ekspansi Perintis', description: 'Beli atau naikkan level 1 item upgrade' },
    zh: { title: '先锋扩张', description: '购买或升级 1 项升级项目' },
    th: { title: 'ขยายอาณาจักรผู้บุกเบิก', description: 'ซื้อหรืออัปเกรดไอเทม 1 รายการ' },
    tr: { title: 'Öncü Genişlemesi', description: '1 yükseltme öğesi satın al veya seviye atlat' },
    ru: { title: 'Расширение пионера', description: 'Купите или улучшите 1 апгрейд' },
  },
  m_rush_high: {
    vi: { title: 'Chuyên Gia Tốc Độ', description: 'Đạt ít nhất 150 điểm trong Hamster Rush' },
    id: { title: 'Spesialis Rush', description: 'Raih minimal 150 poin di Hamster Rush' },
    zh: { title: '极速专家', description: '在仓鼠冲刺中至少获得 150 分' },
    th: { title: 'ผู้เชี่ยวชาญความเร็ว', description: 'ทำคะแนนอย่างน้อย 150 คะแนนในแฮมสเตอร์รัช' },
    tr: { title: 'Hız Uzmanı', description: 'Hamster Hücumu oyununda en az 150 puan yap' },
    ru: { title: 'Мастер скорости', description: 'Наберите не менее 150 очков в Рывке хомяка' },
  },
  m_invite_friend: {
    vi: { title: 'Đại Sứ Tiên Phong', description: 'Mời 1 người bạn mới bằng mã giới thiệu của bạn' },
    id: { title: 'Duta Perintis', description: 'Undang 1 teman baru dengan kode referalmu' },
    zh: { title: '先锋大使', description: '使用你的邀请码邀请 1 位新朋友' },
    th: { title: 'ทูตผู้บุกเบิก', description: 'เชิญเพื่อนใหม่ 1 คนด้วยรหัสแนะนำของคุณ' },
    tr: { title: 'Öncü Elçisi', description: 'Davet kodunla 1 yeni arkadaş davet et' },
    ru: { title: 'Посол пионеров', description: 'Пригласите 1 нового друга по реферальному коду' },
  },
};

export const getLocalizedMission = (mission: Mission, language: Language) => {
  if (language === 'en') {
    return { title: mission.title, description: mission.description };
  }
  if (language === 'ar') {
    return { title: mission.titleAr, description: mission.descriptionAr };
  }
  const entry = MISSION_TRANSLATIONS[mission.id]?.[language];
  return {
    title: entry?.title || mission.title,
    description: entry?.description || mission.description,
  };
};

// ============================================================================
// 6. ACHIEVEMENTS
// ============================================================================
const ACHIEVEMENT_TRANSLATIONS: Record<string, Record<NonEnArLang, { title: string; description: string }>> = {
  ach_first_tap: {
    vi: { title: 'Bước Đầu Tiên', description: 'Thực hiện lần chạm đầu tiên vào Hamster' },
    id: { title: 'Langkah Pertama', description: 'Lakukan ketukan pertamamu pada Hamster' },
    zh: { title: '第一步', description: '完成你对仓鼠的第一次点击' },
    th: { title: 'ก้าวแรก', description: 'แตะแฮมสเตอร์เป็นครั้งแรกของคุณ' },
    tr: { title: 'İlk Adım', description: 'Hamster’a ilk dokunuşunu yap' },
    ru: { title: 'Первый шаг', description: 'Сделайте свой самый первый клик по хомяку' },
  },
  ach_1k_taps: {
    vi: { title: 'Động Cơ Hamster', description: 'Đạt tổng cộng 1.000 lần chạm' },
    id: { title: 'Dinamo Hamster', description: 'Capai 1.000 total ketukan seumur hidup' },
    zh: { title: '仓鼠发电机', description: '累计点击达到 1,000 次' },
    th: { title: 'ไดนาโมแฮมสเตอร์', description: 'แตะสะสมครบ 1,000 ครั้ง' },
    tr: { title: 'Hamster Dinamosu', description: 'Toplam 1.000 dokunuşa ulaş' },
    ru: { title: 'Хомяк-динамо', description: 'Наберите 1 000 нажатий за всё время' },
  },
  ach_5_upgrades: {
    vi: { title: 'Kiến Tạo Đế Chế', description: 'Sở hữu ít nhất 5 cấp nâng cấp đang hoạt động' },
    id: { title: 'Pembangun Taipan', description: 'Miliki setidaknya 5 level upgrade aktif' },
    zh: { title: '大亨建造师', description: '拥有至少 5 个已激活的升级等级' },
    th: { title: 'ผู้สร้างอาณาจักร', description: 'มีระดับอัปเกรดที่ใช้งานอยู่อย่างน้อย 5 ระดับ' },
    tr: { title: 'İmparatorluk Kurucusu', description: 'En az 5 aktif yükseltme seviyesine sahip ol' },
    ru: { title: 'Строитель империи', description: 'Получите не менее 5 активных уровней улучшений' },
  },
  ach_arcade_master: {
    vi: { title: 'Huyền Thoại Arcade', description: 'Chơi 10 lượt mini-game' },
    id: { title: 'Legenda Arkade', description: 'Mainkan 10 mini-game' },
    zh: { title: '街机传奇', description: '游玩 10 次小游戏' },
    th: { title: 'ตำนานอาร์เคด', description: 'เล่นมินิเกมครบ 10 ครั้ง' },
    tr: { title: 'Atari Efsanesi', description: '10 mini oyun oyna' },
    ru: { title: 'Легенда аркад', description: 'Сыграйте 10 раз в мини-игры' },
  },
  ach_rich_pioneer: {
    vi: { title: 'Kho Báu Pi', description: 'Tích lũy 100.000 Điểm Hamster' },
    id: { title: 'Brankas Pi', description: 'Kumpulkan 100.000 Poin Hamster' },
    zh: { title: 'Pi 金库', description: '累计获得 100,000 仓鼠积分' },
    th: { title: 'คลังสมบัติ Pi', description: 'สะสมคะแนนแฮมสเตอร์ครบ 100,000' },
    tr: { title: 'Pi Kasası', description: '100.000 Hamster Puanı biriktir' },
    ru: { title: 'Сокровищница Pi', description: 'Накопите 100 000 очков хомяка' },
  },
  ach_royal_status: {
    vi: { title: 'Đăng Quang Hoàng Gia', description: 'Trang bị trang phục Vua Tối Cao Pi' },
    id: { title: 'Tahta Kerajaan', description: 'Gunakan kostum Raja Berdaulat Hamster' },
    zh: { title: '皇家登基', description: '装备至尊国王仓鼠外观' },
    th: { title: 'ขึ้นครองราชย์', description: 'สวมใส่สกินราชาผู้ยิ่งใหญ่' },
    tr: { title: 'Kraliyet Yükselişi', description: 'Hükümdar Kral Hamster kostümünü kuşan' },
    ru: { title: 'Королевское восхождение', description: 'Наденьте образ Короля Pi' },
  },
};

export const getLocalizedAchievement = (ach: Achievement, language: Language) => {
  if (language === 'en') {
    return { title: ach.title, description: ach.description };
  }
  if (language === 'ar') {
    return { title: ach.titleAr, description: ach.descriptionAr };
  }
  const entry = ACHIEVEMENT_TRANSLATIONS[ach.id]?.[language];
  return {
    title: entry?.title || ach.title,
    description: entry?.description || ach.description,
  };
};

// ============================================================================
// 7. PI STORE PRODUCTS
// ============================================================================
const PI_PRODUCT_TRANSLATIONS: Record<
  string,
  Record<NonEnArLang, { name: string; description: string; badge?: string }>
> = {
  pi_pack_starter: {
    vi: {
      name: 'Kho Tân Binh Tiên Phong',
      description: 'Tăng tốc đế chế với 50.000 Điểm Hamster và 10 Hạt Vàng.',
      badge: 'Tối thiểu 0.001 π',
    },
    id: {
      name: 'Paket Awal Perintis',
      description: 'Dorong kerajaanmu dengan 50.000 Poin Hamster dan 10 Biji Emas.',
      badge: 'Min 0.001 π',
    },
    zh: {
      name: '先锋新手礼包',
      description: '获得 50,000 仓鼠积分与 10 颗金种子，加速壮大帝国。',
      badge: '最低 0.001 π',
    },
    th: {
      name: 'ชุดเริ่มต้นผู้บุกเบิก',
      description: 'เสริมพลังอาณาจักรด้วย 50,000 คะแนนแฮมสเตอร์ และ 10 เมล็ดทองคำ',
      badge: 'ขั้นต่ำ 0.001 π',
    },
    tr: {
      name: 'Öncü Başlangıç Paketi',
      description: 'İmparatorluğunu 50.000 Hamster Puanı ve 10 Altın Tohum ile güçlendir.',
      badge: 'Min 0.001 π',
    },
    ru: {
      name: 'Стартовый набор пионера',
      description: 'Ускорьте империю: 50 000 очков хомяка и 10 золотых семян.',
      badge: 'Мин. 0.001 π',
    },
  },
  pi_pack_energy: {
    vi: {
      name: 'Gói Năng Lượng & Hạt Vàng',
      description: 'Hồi đầy 100% năng lượng ngay lập tức kèm 100.000 Điểm Hamster và 20 Hạt Vàng.',
      badge: 'Phổ biến',
    },
    id: {
      name: 'Paket Energi & Biji Emas',
      description: 'Isi ulang 100% energi seketika plus 100.000 Poin Hamster dan 20 Biji Emas.',
      badge: 'Populer',
    },
    zh: {
      name: '极速能量与金种子包',
      description: '立即充满 100% 能量，附赠 100,000 仓鼠积分与 20 颗金种子。',
      badge: '热门',
    },
    th: {
      name: 'แพ็กพลังและเมล็ดทองคำ',
      description: 'เติมพลังงานเต็ม 100% ทันที พร้อม 100,000 คะแนนแฮมสเตอร์และ 20 เมล็ดทองคำ',
      badge: 'ยอดนิยม',
    },
    tr: {
      name: 'Enerji ve Tohum Paketi',
      description: 'Anında %100 enerji doldurma, 100.000 Hamster Puanı ve 20 Altın Tohum.',
      badge: 'Popüler',
    },
    ru: {
      name: 'Набор энергии и семян',
      description: 'Мгновенно восполняет 100% энергии + 100 000 очков хомяка и 20 золотых семян.',
      badge: 'Популярное',
    },
  },
  pi_pack_booster: {
    vi: {
      name: 'Siêu Tăng Tốc Turbo 3X',
      description: 'Nhân 3 sức chạm và sản lượng điểm thụ động trong 24 giờ + 150.000 điểm thưởng.',
      badge: 'Giá trị nhất',
    },
    id: {
      name: 'Booster Turbo Hiper 3X',
      description: 'Lipat tigakan kekuatan tap dan hasil pasif selama 24 jam + 150.000 poin bonus.',
      badge: 'Nilai Terbaik',
    },
    zh: {
      name: '超级涡轮 3 倍加速器',
      description: '点击威力与被动收益翻 3 倍，持续 24 小时 + 150,000 额外积分。',
      badge: '超值推荐',
    },
    th: {
      name: 'ตัวเร่งเทอร์โบ 3X สุดแรง',
      description: 'คูณ 3 พลังแตะและรายได้อัตโนมัติเป็นเวลา 24 ชั่วโมง + โบนัส 150,000 คะแนน',
      badge: 'คุ้มค่าที่สุด',
    },
    tr: {
      name: 'Hiper Turbo 3X Güçlendirici',
      description: '24 saat boyunca dokunuş gücünü ve pasif geliri 3 katına çıkar + 150.000 bonus puan.',
      badge: 'En İyi Değer',
    },
    ru: {
      name: 'Гипер-турбо 3X бустер',
      description: 'Утройте силу клика и пассивный доход на 24 часа + 150 000 бонусных очков.',
      badge: 'Лучшая цена',
    },
  },
  pi_pack_whale: {
    vi: {
      name: 'Kho Báu Tiên Phong Thiên Hà',
      description: 'Kho báu khổng lồ gồm 2.500.000 Điểm Hamster và 100 Hạt Vàng cho bậc thầy tài phiệt.',
      badge: 'Siêu Cấp',
    },
    id: {
      name: 'Brankas Perintis Galaksi',
      description: 'Harta besar berisi 2.500.000 Poin Hamster dan 100 Biji Emas untuk para master.',
      badge: 'Tingkat Mega',
    },
    zh: {
      name: '银河先锋金库',
      description: '包含 2,500,000 仓鼠积分与 100 颗金种子的巨型宝库，专为顶级大亨打造。',
      badge: '超级档位',
    },
    th: {
      name: 'คลังมหาสมบัติผู้บุกเบิกกาแล็กซี',
      description: 'คลังสมบัติขนาดมหึมา 2,500,000 คะแนนแฮมสเตอร์ และ 100 เมล็ดทองคำสำหรับผู้เชี่ยวชาญ',
      badge: 'ระดับเมกะ',
    },
    tr: {
      name: 'Galaktik Öncü Kasası',
      description: 'Gerçek ustalar için 2.500.000 Hamster Puanı ve 100 Altın Tohumluk dev hazine.',
      badge: 'Mega Seviye',
    },
    ru: {
      name: 'Галактическое хранилище',
      description: 'Огромная казна: 2 500 000 очков хомяка и 100 золотых семян для настоящих магнатов.',
      badge: 'Мега-уровень',
    },
  },
  pi_frame_pioneer_spark: {
    vi: {
      name: 'Khung Tia Lửa Tiên Phong',
      description: 'Trang bị khung đại diện xanh neon rực rỡ trên hồ sơ & đấu trường + 5.000 điểm thưởng.',
      badge: '1x Độc quyền',
    },
    id: {
      name: 'Bingkai Percikan Perintis',
      description: 'Pasang bingkai avatar sian elektrik di profil & arena tap + 5.000 poin bonus.',
      badge: '1x Eksklusif',
    },
    zh: {
      name: '先锋电光头像框',
      description: '在个人资料和点击竞技场装备炫酷青色电光头像框 + 5,000 奖励积分。',
      badge: '限购一次',
    },
    th: {
      name: 'กรอบอวตารประกายผู้บุกเบิก',
      description: 'สวมใส่กรอบอวตารสีฟ้าเรืองแสงบนโปรไฟล์และลานแตะ + โบนัส 5,000 คะแนน',
      badge: '1x พิเศษ',
    },
    tr: {
      name: 'Öncü Kıvılcımı Çerçevesi',
      description: 'Profilinde ve dokunuş arenasında elektrik mavisi avatar çerçevesi kuşan + 5.000 bonus puan.',
      badge: '1x Özel',
    },
    ru: {
      name: 'Рамка «Искра пионера»',
      description: 'Электрическая неоновая рамка для профиля и арены + 5 000 бонусных очков.',
      badge: '1x Эксклюзив',
    },
  },
  pi_perk_overdrive_core: {
    vi: {
      name: 'Lõi Quá Tải Vĩnh Viễn',
      description: 'Cộng vĩnh viễn +15 Sức Chạm và +500 Năng Lượng Tối Đa mãi mãi cho tài khoản.',
      badge: '1x Vĩnh viễn',
    },
    id: {
      name: 'Inti Overdrive Permanen',
      description: 'Tambahan permanen +15 Kekuatan Tap dan +500 Kapasitas Energi Maks selamanya.',
      badge: '1x Permanen',
    },
    zh: {
      name: '永久超频核心',
      description: '为你的先锋账号永久增加 +15 点击威力与 +500 最大能量上限。',
      badge: '1x 永久',
    },
    th: {
      name: 'แกนโอเวอร์ไดรฟ์ถาวร',
      description: 'เพิ่ม +15 พลังแตะ และ +500 พลังงานสูงสุดแบบถาวรตลอดชีพ',
      badge: '1x ถาวร',
    },
    tr: {
      name: 'Kalıcı Aşırı Yük Çekirdeği',
      description: 'Öncü hesabına sonsuza dek kalıcı +15 Dokunuş Gücü ve +500 Maks Enerji ekler.',
      badge: '1x Kalıcı',
    },
    ru: {
      name: 'Ядро вечного овердрайва',
      description: 'Навсегда добавляет +15 к силе клика и +500 к макс. запасу энергии.',
      badge: '1x Навсегда',
    },
  },
  pi_frame_gold_sovereign: {
    vi: {
      name: 'Khung Hoàng Kim Tối Cao',
      description: 'Khung đại diện vàng hoàng gia rực rỡ kèm tăng vĩnh viễn +10 Sức Chạm.',
      badge: '1x Độc quyền',
    },
    id: {
      name: 'Bingkai Emas Berdaulat',
      description: 'Bingkai avatar emas kerajaan bercahaya dengan bonus permanen +10 Kekuatan Tap.',
      badge: '1x Eksklusif',
    },
    zh: {
      name: '黄金君主头像框',
      description: '璀璨皇家金色头像框，附带永久 +10 点击威力加成。',
      badge: '限购一次',
    },
    th: {
      name: 'กรอบทองคำราชวงศ์',
      description: 'กรอบอวตารทองคำราชวงศ์อันสง่างาม พร้อมโบนัสถาวร +10 พลังแตะ',
      badge: '1x พิเศษ',
    },
    tr: {
      name: 'Altın Hükümdar Çerçevesi',
      description: 'Kalıcı +10 Dokunuş Gücü artışı sağlayan görkemli kraliyet altını avatar çerçevesi.',
      badge: '1x Özel',
    },
    ru: {
      name: 'Рамка «Золотой монарх»',
      description: 'Сияющая королевская золотая рамка с постоянным бонусом +10 к силе клика.',
      badge: '1x Эксклюзив',
    },
  },
  pi_pack_king_skin: {
    vi: {
      name: 'Trang Phục Hoàng Gia Tối Cao',
      description: 'Mở khóa ngay trang phục Vua Tối Cao Pi với +15% sản lượng thụ động vĩnh viễn và 500.000 điểm.',
      badge: '1x Trang phục',
    },
    id: {
      name: 'Kostum Raja Berdaulat',
      description: 'Buka skin Raja Berdaulat Pi segera dengan +15% hasil pasif permanen dan 500.000 poin.',
      badge: '1x Kostum',
    },
    zh: {
      name: '皇家至尊服饰',
      description: '立即解锁 Pi 至尊国王外观，附带永久 +15% 被动收益与 500,000 积分。',
      badge: '1x 专属外观',
    },
    th: {
      name: 'ชุดราชาผู้ยิ่งใหญ่',
      description: 'ปลดล็อกสกินราชา Pi ทันที พร้อมรายได้อัตโนมัติถาวร +15% และ 500,000 คะแนน',
      badge: '1x ชุดพิเศษ',
    },
    tr: {
      name: 'Kraliyet Hükümdar Kostümü',
      description: 'Kalıcı +%15 pasif gelir ve 500.000 puan ile Pi Hükümdar Kral kostümünü hemen aç.',
      badge: '1x Kostüm',
    },
    ru: {
      name: 'Королевский наряд монарха',
      description: 'Мгновенно открывает скин Короля Pi с постоянным +15% к доходу и 500 000 очками.',
      badge: '1x Образ',
    },
  },
  pi_frame_cyber_prism: {
    vi: {
      name: 'Khung Lăng Kính Cyber',
      description: 'Khung đại diện neon ba chiều với mức tăng vĩnh viễn +15% sản lượng khai thác thụ động.',
      badge: '1x Độc quyền',
    },
    id: {
      name: 'Bingkai Prisma Siber',
      description: 'Bingkai avatar neon holografik dengan peningkatan permanen +15% hasil tambang pasif.',
      badge: '1x Eksklusif',
    },
    zh: {
      name: '赛博棱镜头像框',
      description: '全息霓虹头像框，提供永久 +15% 被动挖矿产出加成。',
      badge: '限购一次',
    },
    th: {
      name: 'กรอบปริซึมไซเบอร์',
      description: 'กรอบอวตารนีออนโฮโลแกรม พร้อมโบนัสถาวร +15% รายได้ขุดอัตโนมัติ',
      badge: '1x พิเศษ',
    },
    tr: {
      name: 'Siber Prizma Çerçevesi',
      description: 'Kalıcı +%15 pasif madencilik geliri sağlayan holografik neon avatar çerçevesi.',
      badge: '1x Özel',
    },
    ru: {
      name: 'Рамка «Кибер-призма»',
      description: 'Голографическая неоновая рамка с постоянным бонусом +15% к пассивной добыче.',
      badge: '1x Эксклюзив',
    },
  },
  pi_pack_cyber_skin: {
    vi: {
      name: 'Giáp Kết Nối Cyberpunk',
      description: 'Mở khóa Kính & Trang phục Cyberpunk kèm +25 sức chạm vĩnh viễn và 750.000 điểm thưởng.',
      badge: '1x Trang phục',
    },
    id: {
      name: 'Zirah Nexus Cyberpunk',
      description: 'Buka Visor & Skin Cyberpunk dengan +25 kekuatan tap permanen dan 750.000 poin bonus.',
      badge: '1x Kostum',
    },
    zh: {
      name: '赛博朋克枢纽战甲',
      description: '解锁赛博朋克护目镜与外观，附带永久 +25 点击威力与 750,000 奖励积分。',
      badge: '1x 专属外观',
    },
    th: {
      name: 'เกราะเน็กซัสไซเบอร์พังก์',
      description: 'ปลดล็อกแว่นและสกินไซเบอร์พังก์ พร้อม +25 พลังแตะถาวร และโบนัส 750,000 คะแนน',
      badge: '1x ชุดพิเศษ',
    },
    tr: {
      name: 'Siberpunk Nexus Zırhı',
      description: 'Kalıcı +25 dokunuş gücü ve 750.000 bonus puan ile Siberpunk Vizör ve Kostümü aç.',
      badge: '1x Kostüm',
    },
    ru: {
      name: 'Броня Киберпанк Нексус',
      description: 'Открывает кибер-визор и скин с постоянным +25 к клику и 750 000 очками.',
      badge: '1x Образ',
    },
  },
  pi_perk_quantum_reactor: {
    vi: {
      name: 'Lò Phản Ứng Khởi Nguyên Pi',
      description: 'Tăng vĩnh viễn +10.000/giờ sản lượng khai thác thụ động và tặng 50 Hạt Vàng.',
      badge: '1x Vĩnh viễn',
    },
    id: {
      name: 'Reaktor Genesis Perintis',
      description: 'Tambahan permanen +10.000/jam hasil tambang pasif dan 50 Biji Emas.',
      badge: '1x Permanen',
    },
    zh: {
      name: '先锋创世反应堆',
      description: '永久增加 +10,000/小时 被动挖矿产出并赠送 50 颗金种子。',
      badge: '1x 永久',
    },
    th: {
      name: 'เตาปฏิกรณ์ปฐมกาลผู้บุกเบิก',
      description: 'เพิ่มรายได้ขุดอัตโนมัติถาวร +10,000/ชม. และรับ 50 เมล็ดทองคำ',
      badge: '1x ถาวร',
    },
    tr: {
      name: 'Öncü Genesis Reaktörü',
      description: 'Kalıcı +10.000/sa pasif madencilik geliri ve 50 Altın Tohum.',
      badge: '1x Kalıcı',
    },
    ru: {
      name: 'Реактор Генезис пионера',
      description: 'Навсегда добавляет +10 000/час пассивной добычи и 50 золотых семян.',
      badge: '1x Навсегда',
    },
  },
  pi_frame_celestial_pi: {
    vi: {
      name: 'Khung Hào Quang Thiên Thể Pi',
      description: 'Khung đại diện ngọc lục bảo vũ trụ huyền thoại +25 Sức Chạm vĩnh viễn & 250.000 điểm thưởng.',
      badge: '1x Huyền thoại',
    },
    id: {
      name: 'Bingkai Aura Pi Surgawi',
      description: 'Bingkai avatar zamrud kosmik legendaris +25 Kekuatan Tap permanen & 250.000 poin bonus.',
      badge: '1x Legendaris',
    },
    zh: {
      name: '天界 Pi 光环头像框',
      description: '传奇翡翠宇宙头像框，附带永久 +25 点击威力与 250,000 奖励积分。',
      badge: '1x 传奇',
    },
    th: {
      name: 'กรอบอวตารออร่า Pi สวรรค์',
      description: 'กรอบอวตารมรกตจักรวาลระดับตำนาน +25 พลังแตะถาวร และโบนัส 250,000 คะแนน',
      badge: '1x ตำนาน',
    },
    tr: {
      name: 'Göksel Pi Aurası Çerçevesi',
      description: 'Efsanevi zümrüt kozmik avatar çerçevesi, +25 kalıcı Dokunuş Gücü ve 250.000 bonus puan.',
      badge: '1x Efsanevi',
    },
    ru: {
      name: 'Рамка «Небесная аура Pi»',
      description: 'Легендарная изумрудная космическая рамка: +25 к клику навсегда и 250 000 очков.',
      badge: '1x Легенда',
    },
  },
};

export const getLocalizedProduct = (product: PiProduct, language: Language) => {
  if (language === 'en') {
    return { name: product.name, description: product.description, badge: product.badge };
  }
  if (language === 'ar') {
    return {
      name: product.nameAr,
      description: product.descriptionAr,
      badge: product.badgeAr || product.badge,
    };
  }
  const entry = PI_PRODUCT_TRANSLATIONS[product.id]?.[language];
  return {
    name: entry?.name || product.name,
    description: entry?.description || product.description,
    badge: entry?.badge || product.badge,
  };
};

// ============================================================================
// 8. PI ECOSYSTEM PROJECTS
// ============================================================================
interface LocalizedProjectText {
  name: string;
  tagline: string;
  concept: string;
  description: string;
  plannedFeatures: { title: string; description: string }[];
  communityBenefits: { title: string; description: string }[];
  milestones: { phase: string; title: string; description: string }[];
}

const PROJECT_TRANSLATIONS: Record<string, Record<NonEnArLang, LocalizedProjectText>> = {
  pimind_ai: {
    vi: {
      name: 'PiMind AI',
      tagline: 'Nền Tảng Hội Thoại & Năng Suất Thông Minh Thế Hệ Mới',
      concept: 'Trợ lý AI đa ngôn ngữ tiên tiến và nền tảng năng suất lấy cảm hứng từ hệ thống AI hội thoại hiện đại, được kiến tạo gốc cho hệ sinh thái Pi toàn cầu.',
      description: 'PiMind AI kết nối trí tuệ hội thoại tiên tiến với tiện ích Pi liền mạch. Được xây dựng để trao quyền cho hàng trăm triệu Pioneer tại hơn 230 quốc gia với khả năng hiểu ngữ cảnh đa ngôn ngữ, hỗ trợ lập trình thông minh, tóm tắt nghiên cứu và phân tích tài liệu tự động — tất cả gói cao cấp đều mở khóa độc quyền bằng tiền mã hóa Pi.',
      plannedFeatures: [
        { title: 'Trợ Lý Hội Thoại Thông Minh', description: 'Suy luận đa lượt, ghi nhớ ngữ cảnh linh hoạt và giải quyết vấn đề trong kỹ thuật, sáng tạo và thương mại.' },
        { title: 'Dịch Thuật & Bản Địa Hóa Đa Ngôn Ngữ Sâu', description: 'Hiểu bản địa hơn 95 ngôn ngữ, thích ứng phương ngữ và giữ trọn sắc thái văn hóa cho Pioneer quốc tế.' },
        { title: 'Phân Tích Tài Liệu & Nghiên Cứu', description: 'Tải lên PDF, DOCX, CSV hoặc sách trắng để phân tích tức thì, hỏi đáp theo ngữ cảnh và tổng hợp báo cáo.' },
        { title: 'Bộ Công Cụ Viết & Sáng Tạo', description: 'Hỗ trợ soạn thảo tài liệu kỹ thuật, bài nghiên cứu, nội dung tiếp thị và xuất bản đa định dạng.' },
        { title: 'Trợ Lý Lập Trình & Gỡ Lỗi Cho Pioneer', description: 'Sinh mã, kiểm tra logic và tạo khung API cho Python, JavaScript, Rust, Solidity và phát triển Pi SDK.' },
        { title: 'Gói Đăng Ký Vi Mô Độc Quyền Bằng Pi', description: 'Không rào cản tiền pháp định. Pioneer mở khóa mô hình suy luận tốc độ cao bằng thanh toán vi mô trực tiếp bằng Pi.' },
        { title: 'Hạ Tầng Phân Tán Có Khả Năng Mở Rộng', description: 'Cụm suy luận biên độ trễ thấp tối ưu hóa cho lượng truy cập đồng thời lớn từ Pi Browser di động.' },
      ],
      communityBenefits: [
        { title: 'Tạo Tiện Ích Pi Trực Tiếp', description: 'Chuyển hóa Pi từ tài sản tích trữ thành năng lực tính toán hằng ngày cho hàng triệu sinh viên, kỹ sư và nhà sáng tạo.' },
        { title: 'Tiếp Cận Tri Thức Phi Tập Trung', description: 'Phổ cập trí tuệ nhân tạo cao cấp tới các nền kinh tế mới nổi mà không cần thẻ tín dụng quốc tế.' },
      ],
      milestones: [
        { phase: 'Cột mốc 1', title: 'Động Cơ Cốt Lõi & Cổng Xác Thực Pi', description: 'Hệ thống suy luận LLM tốc độ cao tích hợp xác thực Pi Network chính thức và kiểm tra token.' },
        { phase: 'Cột mốc 2', title: 'Trình Phân Tích Tài Liệu & Bộ Đa Ngôn Ngữ', description: 'Động cơ phân tích tài liệu dựa trên vector và căn chỉnh ngữ cảnh cho 95 ngôn ngữ.' },
        { phase: 'Cột mốc 3', title: 'Hợp Đồng Thông Minh Đăng Ký Thanh Toán Pi', description: 'Tích hợp đăng ký thanh toán Pi-to-App chính thức với cấp quyền tự động theo gói.' },
        { phase: 'Cột mốc 4', title: 'Mở Rộng Toàn Cầu & Ra Mắt Trên Pi App Store', description: 'Triển khai trên các cụm biên quốc tế và phát hành chính thức trên hệ sinh thái Pi.' },
      ],
    },
    id: {
      name: 'PiMind AI',
      tagline: 'Platform AI Percakapan & Produktivitas Cerdas Generasi Berikutnya',
      concept: 'Asisten AI multibahasa canggih dan platform produktivitas yang terinspirasi sistem AI percakapan modern, dibangun khusus untuk ekosistem Pi global.',
      description: 'PiMind AI menghubungkan kecerdasan percakapan mutakhir dengan utilitas Pi yang mulus. Dirancang untuk memberdayakan ratusan juta Perintis di 230+ negara melalui pemahaman bahasa kontekstual, asisten coding cerdas, ringkasan riset terstruktur, dan analisis dokumen otomatis — semua paket premium hanya diakses dengan Pi.',
      plannedFeatures: [
        { title: 'Asisten Percakapan Cerdas', description: 'Penalaran percakapan multi-giliran, konteks memori dinamis, dan pemecahan masalah teknis, kreatif, serta komersial.' },
        { title: 'Terjemahan & Lokalisasi Multibahasa Mendalam', description: 'Pemahaman asli lebih dari 95 bahasa, adaptasi dialek, dan pelestarian nuansa budaya bagi Perintis global.' },
        { title: 'Pemahaman Dokumen & Riset', description: 'Unggah PDF, DOCX, CSV, atau whitepaper untuk rincian analitis instan, tanya jawab kontekstual, dan laporan sintetis.' },
        { title: 'Rangkaian Penulisan & Kreatif', description: 'Penyusunan terbantu untuk dokumentasi teknis, makalah akademik, salinan pemasaran, dan penerbitan multi-format.' },
        { title: 'Kopilot Coding & Debugging Perintis', description: 'Pembuatan sintaks, audit logika, dan kerangka API untuk Python, JavaScript, Rust, Solidity, dan Pi SDK.' },
        { title: 'Paket Langganan Mikro Eksklusif Pi', description: 'Tanpa hambatan fiat. Perintis membuka model inferensi berkecepatan tinggi melalui pembayaran mikro Pi langsung.' },
        { title: 'Infrastruktur Terdistribusi yang Skalabel', description: 'Klaster inferensi edge latensi rendah yang dioptimalkan untuk volume permintaan tinggi dari Pi Browser.' },
      ],
      communityBenefits: [
        { title: 'Penciptaan Utilitas Pi Langsung', description: 'Mengubah Pi dari aset simpanan menjadi daya komputasi harian bagi jutaan pelajar, insinyur, dan kreator.' },
        { title: 'Akses Pengetahuan Terdesentralisasi', description: 'Mendemokratisasi kecerdasan buatan tingkat tinggi bagi negara berkembang tanpa kartu kredit internasional.' },
      ],
      milestones: [
        { phase: 'Tonggak 1', title: 'Mesin Inti & Gerbang Autentikasi Pi', description: 'Pipeline inferensi LLM berkecepatan tinggi dengan autentikasi resmi Pi Network dan validasi token.' },
        { phase: 'Tonggak 2', title: 'Pengurai Dokumen & Paket Multibahasa', description: 'Mesin analisis dokumen berbasis vektor dan penyelarasan kontekstual 95 bahasa.' },
        { phase: 'Tonggak 3', title: 'Kontrak Cerdas Langganan Pembayaran Pi', description: 'Integrasi langganan resmi Pi-to-App dengan penyediaan paket otomatis.' },
        { phase: 'Tonggak 4', title: 'Skala Edge Global & Rilis Pi App Ecosystem', description: 'Penerapan di zona edge internasional dan penerbitan resmi di Ekosistem Aplikasi Pi.' },
      ],
    },
    zh: {
      name: 'PiMind AI',
      tagline: '新一代智能对话与生产力平台',
      concept: '受现代对话式 AI 系统启发而打造的先进多语言 AI 助手与生产力平台，原生服务全球 Pi 生态。',
      description: 'PiMind AI 将前沿对话智能与无缝 Pi 实用价值相结合，赋能 230 多个国家的数亿先锋，提供上下文语言理解、智能编程助手、结构化研究摘要与自动文档分析——所有高级功能独家通过 Pi 加密货币解锁。',
      plannedFeatures: [
        { title: '智能对话助手', description: '多轮对话推理、动态记忆上下文，以及覆盖技术、创意与商业领域的解决方案。' },
        { title: '深度多语言翻译与本地化', description: '原生理解 95+ 种语言，适配地方表达，为全球先锋保留文化语境。' },
        { title: '文档与研究解析', description: '上传 PDF、DOCX、CSV 或白皮书，即刻生成深度分析、上下文问答与综合报告。' },
        { title: '写作与创意套件', description: '辅助撰写技术文档、学术论文、营销文案及多格式内容发布。' },
        { title: '先锋编程与调试副驾驶', description: '支持 Python、JavaScript、Rust、Solidity 与 Pi SDK 开发的语法生成、逻辑审计和 API 搭建。' },
        { title: 'Pi 专属微支付订阅层级', description: '零法币门槛，先锋直接使用 Pi 微支付解锁高吞吐量推理模型。' },
        { title: '分布式可扩展基础设施', description: '低延迟边缘推理集群，专为移动端 Pi 浏览器高并发请求而优化。' },
      ],
      communityBenefits: [
        { title: '创造直接 Pi 实用价值', description: '将 Pi 从持仓资产转化为数百万学生、工程师与创作者日常可用的算力服务。' },
        { title: '去中心化知识普惠', description: '无需国际信用卡即可让新兴市场用户畅享顶级人工智能技术。' },
      ],
      milestones: [
        { phase: '里程碑 1', title: '核心引擎与 Pi 认证网关', description: '集成 Pi Network 官方认证与令牌验证的高速大语言模型推理管线。' },
        { phase: '里程碑 2', title: '文档解析器与多语言套件', description: '基于向量检索的文档分析引擎与 95 种语言上下文对齐。' },
        { phase: '里程碑 3', title: 'Pi 支付订阅智能合约', description: '接入官方 Pi-to-App 支付订阅并实现自动化权益开通。' },
        { phase: '里程碑 4', title: '全球边缘扩展与 Pi 应用商店发布', description: '部署至全球边缘节点并在 Pi 应用生态正式上线。' },
      ],
    },
    th: {
      name: 'PiMind AI',
      tagline: 'แพลตฟอร์ม AI สนทนาอัจฉริยะและเพิ่มประสิทธิภาพยุคใหม่',
      concept: 'ผู้ช่วย AI หลายภาษาขั้นสูงและแพลตฟอร์มเพิ่มประสิทธิภาพการทำงานที่ได้รับแรงบันดาลใจจากระบบ AI สมัยใหม่ ออกแบบเพื่อระบบนิเวศ Pi ทั่วโลก',
      description: 'PiMind AI ผสานปัญญาประดิษฐ์การสนทนาล้ำสมัยเข้ากับการใช้งาน Pi ได้อย่างราบรื่น เพื่อเสริมพลังให้ผู้บุกเบิกหลายร้อยล้านคนในกว่า 230 ประเทศ ทั้งการเข้าใจภาษาตามบริบท ผู้ช่วยเขียนโค้ดอัจฉริยะ สรุปงานวิจัย และวิเคราะห์เอกสารอัตโนมัติ โดยระดับพรีเมียมทั้งหมดชำระผ่าน Pi เท่านั้น',
      plannedFeatures: [
        { title: 'ผู้ช่วยสนทนาอัจฉริยะ', description: 'การให้เหตุผลต่อเนื่องหลายรอบ ความจำบริบทแบบไดนามิก และการแก้ปัญหาด้านเทคนิค สร้างสรรค์ และธุรกิจ' },
        { title: 'การแปลและปรับภาษาเชิงลึกหลายภาษา', description: 'เข้าใจมากกว่า 95 ภาษาโดยกำเนิด รองรับสำเนียงและรักษารายละเอียดทางวัฒนธรรม' },
        { title: 'การวิเคราะห์เอกสารและงานวิจัย', description: 'อัปโหลด PDF, DOCX, CSV หรือ Whitepaper เพื่อแยกวิเคราะห์ทันที ถาม-ตอบตามบริบท และสรุปรายงาน' },
        { title: 'ชุดเครื่องมือการเขียนและสร้างสรรค์', description: 'ช่วยร่างเอกสารทางเทคนิค บทความวิชาการ คอนเทนต์การตลาด และงานเผยแพร่หลายรูปแบบ' },
        { title: 'ผู้ช่วยเขียนโค้ดและดีบักสำหรับผู้บุกเบิก', description: 'สร้างโค้ด ตรวจสอบตรรกะ และวางโครง API สำหรับ Python, JavaScript, Rust, Solidity และ Pi SDK' },
        { title: 'แพ็กเกจสมัครสมาชิกรายย่อยด้วย Pi เท่านั้น', description: 'ไร้ข้อจำกัดสกุลเงินทั่วไป ปลดล็อกโมเดลความเร็วสูงด้วยไมโครเพย์เมนต์ Pi โดยตรง' },
        { title: 'โครงสร้างพื้นฐานแบบกระจายที่ขยายขนาดได้', description: 'คลัสเตอร์ Edge ความหน่วงต่ำที่ปรับแต่งให้รองรับคำขอพร้อมกันจำนวนมากจาก Pi Browser' },
      ],
      communityBenefits: [
        { title: 'สร้างประโยชน์ใช้งานจริงให้เหรียญ Pi', description: 'เปลี่ยน Pi จากการถือครองให้กลายเป็นพลังประมวลผลประจำวันสำหรับนักเรียน วิศวกร และครีเอเตอร์' },
        { title: 'การเข้าถึงองค์ความรู้แบบกระจายศูนย์', description: 'เปิดโอกาสให้ประเทศกำลังพัฒนาเข้าถึง AI ระดับสูงโดยไม่ต้องใช้บัตรเครดิตต่างประเทศ' },
      ],
      milestones: [
        { phase: 'ระยะที่ 1', title: 'เครื่องยนต์หลักและเกตเวย์ยืนยันตัวตน Pi', description: 'ระบบประมวลผล LLM ความเร็วสูงพร้อมการยืนยันตัวตน Pi Network อย่างเป็นทางการ' },
        { phase: 'ระยะที่ 2', title: 'ตัวแยกวิเคราะห์เอกสารและชุดภาษา 95 ภาษา', description: 'ระบบวิเคราะห์เอกสารด้วยเวกเตอร์และการปรับความเข้าใจบริบทหลายภาษา' },
        { phase: 'ระยะที่ 3', title: 'สัญญาอัจฉริยะสมัครสมาชิกผ่าน Pi', description: 'เชื่อมต่อระบบสมัครสมาชิก Pi-to-App อย่างเป็นทางการพร้อมเปิดสิทธิ์อัตโนมัติ' },
        { phase: 'ระยะที่ 4', title: 'ขยาย Edge ทั่วโลกและเปิดตัวใน Pi Ecosystem', description: 'เปิดใช้งานบนเซิร์ฟเวอร์ทั่วโลกและเผยแพร่ในระบบนิเวศแอป Pi อย่างเป็นทางการ' },
      ],
    },
    tr: {
      name: 'PiMind AI',
      tagline: 'Yeni Nesil Akıllı Sohbet ve Verimlilik Platformu',
      concept: 'Modern konuşma tabanlı yapay zeka sistemlerinden ilham alan, küresel Pi ekosistemi için yerel olarak tasarlanmış gelişmiş çok dilli yapay zeka asistanı.',
      description: 'PiMind AI, en yeni konuşma zekasını sorunsuz Pi kullanımıyla birleştirir. 230’dan fazla ülkedeki yüz milyonlarca Öncüye bağlamsal dil anlayışı, akıllı kodlama desteği, yapılandırılmış araştırma özetleri ve otomatik belge analizi sunar — tüm premium katmanlara yalnızca Pi kripto parası ile erişilir.',
      plannedFeatures: [
        { title: 'Akıllı Sohbet Asistanı', description: 'Çok turlu mantık yürütme, dinamik bellek bağlamı ve teknik, yaratıcı ve ticari alanlarda problem çözme.' },
        { title: 'Derin Çok Dilli Çeviri ve Yerelleştirme', description: '95’ten fazla dilde yerel anlama, lehçe uyumu ve uluslararası Öncüler için kültürel doğruluk.' },
        { title: 'Belge ve Araştırma Anlama', description: 'Anında analitik özetler, bağlamsal soru-cevap ve raporlar için PDF, DOCX, CSV veya teknik doküman yükleyin.' },
        { title: 'Yazım ve Yaratıcı Araç Seti', description: 'Teknik dokümantasyon, akademik makaleler, pazarlama metinleri ve çok formatlı içerik üretimi.' },
        { title: 'Öncü Kodlama ve Hata Ayıklama Yardımcısı', description: 'Python, JavaScript, Rust, Solidity ve Pi SDK geliştirme için kod üretimi ve API iskeleti.' },
        { title: 'Pi’ye Özel Mikro Abonelik Katmanları', description: 'İtibari para engeli yok. Öncüler yüksek hızlı modelleri doğrudan Pi mikro ödemeleriyle açar.' },
        { title: 'Dağıtık Ölçeklenebilir Altyapı', description: 'Mobil Pi Browser oturumlarından gelen yüksek eşzamanlı istekler için optimize edilmiş düşük gecikmeli uç kümeler.' },
      ],
      communityBenefits: [
        { title: 'Doğrudan Pi Kullanım Değeri', description: 'Pi’yi spekülatif bir varlıktan milyonlarca öğrenci, mühendis ve üretici için günlük işlem gücüne dönüştürür.' },
        { title: 'Merkeziyetsiz Bilgi Erişimi', description: 'Gelişmekte olan ekonomiler için uluslararası kredi kartı olmadan üst düzey yapay zekayı erişilebilir kılar.' },
      ],
      milestones: [
        { phase: 'Aşama 1', title: 'Çekirdek Motor ve Pi Doğrulama Geçidi', description: 'Resmi Pi Network kimlik doğrulaması ve token kontrolüne sahip yüksek hızlı LLM altyapısı.' },
        { phase: 'Aşama 2', title: 'Belge Ayrıştırıcı ve Çok Dilli Paket', description: 'Vektör tabanlı belge analiz motoru ve 95 dilde bağlamsal uyum.' },
        { phase: 'Aşama 3', title: 'Pi Ödemeli Abonelik Akıllı Sözleşmeleri', description: 'Otomatik paket tanımlamalı resmi Pi-to-App abonelik entegrasyonu.' },
        { phase: 'Aşama 4', title: 'Küresel Uç Ölçeklendirme ve Pi Mağaza Yayını', description: 'Uluslararası uç bölgelerde dağıtım ve Pi Uygulama Ekosisteminde resmi yayın.' },
      ],
    },
    ru: {
      name: 'PiMind AI',
      tagline: 'Интеллектуальная платформа диалогового ИИ и продуктивности',
      concept: 'Передовой многоязычный ИИ-ассистент и платформа продуктивности, вдохновлённая современными системами диалогового ИИ и созданная специально для глобальной экосистемы Pi.',
      description: 'PiMind AI объединяет передовой разговорный интеллект и практическую пользу Pi. Создан для сотен миллионов Пионеров в 230+ странах: понимание контекста, умный помощник программиста, конспектирование исследований и автоматический анализ документов — все премиум-тарифы доступны исключительно за криптовалюту Pi.',
      plannedFeatures: [
        { title: 'Интеллектуальный диалоговый ассистент', description: 'Многоступенчатое рассуждение, динамическая память контекста и решение технических, творческих и бизнес-задач.' },
        { title: 'Глубокий многоязычный перевод и локализация', description: 'Нативное понимание более 95 языков, адаптация диалектов и сохранение культурных нюансов.' },
        { title: 'Анализ документов и исследований', description: 'Загружайте PDF, DOCX, CSV и whitepaper для мгновенного разбора, вопросов по тексту и аналитических отчётов.' },
        { title: 'Инструменты для письма и креатива', description: 'Помощь в написании технической документации, научных работ, маркетинговых текстов и публикаций.' },
        { title: 'Помощник программиста и отладчик', description: 'Генерация кода, аудит логики и создание API для Python, JavaScript, Rust, Solidity и Pi SDK.' },
        { title: 'Микроподписки исключительно за Pi', description: 'Никаких фиатных барьеров. Пионеры открывают высокоскоростные модели прямыми микроплатежами в Pi.' },
        { title: 'Распределённая масштабируемая инфраструктура', description: 'Периферийные кластеры с низкой задержкой, оптимизированные для высокой нагрузки из Pi Browser.' },
      ],
      communityBenefits: [
        { title: 'Прямая утилитарность Pi', description: 'Превращает Pi в повседневную вычислительную мощность для миллионов студентов, инженеров и создателей.' },
        { title: 'Децентрализованный доступ к знаниям', description: 'Открывает доступ к передовому ИИ для развивающихся стран без международных банковских карт.' },
      ],
      milestones: [
        { phase: 'Этап 1', title: 'Базовый движок и шлюз Pi Auth', description: 'Высокоскоростной конвейер LLM с официальной авторизацией Pi Network и проверкой токенов.' },
        { phase: 'Этап 2', title: 'Анализатор документов и языковой пакет', description: 'Векторный движок разбора документов и контекстное согласование для 95 языков.' },
        { phase: 'Этап 3', title: 'Смарт-контракты подписок Pi', description: 'Официальная интеграция подписок Pi-to-App с автоматической активацией тарифов.' },
        { phase: 'Этап 4', title: 'Глобальный запуск в экосистеме Pi', description: 'Развёртывание на международных узлах и официальный релиз в магазине приложений Pi.' },
      ],
    },
  },
  pi_battle_arena: {
    vi: {
      name: 'Pi Battle Arena',
      tagline: 'Game Sinh Tồn Battle Royale Tốc Độ Cao Cho Kỷ Nguyên Web3',
      concept: 'Tựa game Battle Royale đa người chơi tầm cỡ quốc tế được xây dựng từ đầu với cơ chế gốc, cốt truyện gốc và tích hợp kinh tế Pi Network bản địa.',
      description: 'Pi Battle Arena thả tối đa 100 người chơi vào các đấu trường holographic biến đổi liên tục. Với đồng bộ trạng thái độ trễ thấp, trang bị vũ khí chiến thuật, phá hủy địa hình và ghép trận giải đấu toàn cầu, người chơi tranh tài vì vinh quang mùa giải. Mọi skin vũ khí, giáp, vé khán giả và lệ phí giải đấu đều dùng độc quyền bằng Pi (IP gốc 100%).',
      plannedFeatures: [
        { title: 'Battle Royale Thời Gian Thực 100 Người Chơi', description: 'Trận chiến quy mô lớn với vòng bo an toàn thu hẹp linh hoạt, tiếp tế chiến thuật và lá chắn có thể phá hủy.' },
        { title: 'Ghép Trận Toàn Cầu & Cụm Máy Chủ Khu Vực', description: 'Máy chủ tick-rate độ trễ siêu thấp tại Bắc Mỹ, Châu Âu, Châu Á và Trung Đông đảm bảo công bằng.' },
        { title: 'Giải Đấu Cạnh Tranh & Mùa Giải Xếp Hạng', description: 'Hệ thống hạng từ Đồng đến Đại Tướng Tiên Phong với bảng đấu tự động.' },
        { title: 'Hồ Sơ Tiên Phong & Thành Tích Chiến Đấu Xác Thực', description: 'Bằng chứng hạng, tỷ lệ K/D, cúp giải đấu và huy hiệu liên kết trực tiếp với Pi UID.' },
        { title: 'Tùy Biến Trang Phục & Giáp Chiến Đấu', description: 'Trang phục cyber, skin súng, dù nhảy và biểu cảm holographic độc quyền. Tuyệt đối không pay-to-win.' },
        { title: 'Giao Dịch Vi Mô Trong Game Bằng Pi', description: 'Mua Battle Pass và vật phẩm mùa giải chỉ với một chạm trực tiếp qua Ví Pi.' },
        { title: 'Động Cơ Đa Nền Tảng Di Động & Máy Tính', description: 'Client WebGL/WebGPU tối ưu chạy mượt trên Pi Browser di động lẫn máy tính để bàn.' },
      ],
      communityBenefits: [
        { title: 'Thu Hút Mạnh Mẽ Giới Trẻ & Game Thủ', description: 'Định vị Pi Network thành đồng tiền game Web3 hàng đầu, thu hút hàng triệu game thủ trở thành Pioneer.' },
        { title: 'Tăng Tốc Độ Lưu Thông Giao Dịch Pi', description: 'Tạo ra hàng triệu giao dịch vi mô thực tế thông qua vé giải đấu và vật phẩm tùy biến theo mùa.' },
      ],
      milestones: [
        { phase: 'Cột mốc 1', title: 'Nguyên Mẫu Vật Lý & Đồng Bộ Mạng', description: 'Mô phỏng vật lý do máy chủ quyết định, nội suy chuyển động và mạng rollback mượt mà.' },
        { phase: 'Cột mốc 2', title: 'Thiết Kế Bản Đồ & Đấu Trường Cybernetic', description: 'Chiến trường mô-đun chi tiết với độ cao đa tầng, chỗ ẩn nấp chiến thuật và ánh sáng động.' },
        { phase: 'Cột mốc 3', title: 'Cửa Hàng Battle Pass & Trang Phục Pi Payment', description: 'Tích hợp thanh toán Pi Platform chính thức cho kho vật phẩm trang trí và Battle Pass.' },
        { phase: 'Cột mốc 4', title: 'Giải Đấu Beta Toàn Cầu & Ra Mắt Mainnet', description: 'Giải đấu công khai 100 người chơi quốc tế cùng bảng xếp hạng cộng đồng Pi xác thực.' },
      ],
    },
    id: {
      name: 'Pi Battle Arena',
      tagline: 'Battle Royale Multipemain Beroktan Tinggi untuk Era Web3',
      concept: 'Game battle royale multipemain internasional ambisius yang dibangun dari nol dengan mekanik orisinal, kisah orisinal, dan integrasi ekonomi Pi Network asli.',
      description: 'Pi Battle Arena menerjunkan hingga 100 pemain ke arena holografik yang dinamis. Memanfaatkan sinkronisasi latensi rendah, loadout senjata taktis, medan yang dapat dihancurkan, dan matchmaking turnamen global, pemain bersaing memperebutkan kejayaan musiman. Semua skin senjata, zirah, tiket penonton, dan biaya turnamen didukung eksklusif oleh Pi.',
      plannedFeatures: [
        { title: 'Battle Royale Real-Time 100 Pemain', description: 'Pertandingan kompetitif berskala besar dengan penyusutan zona aman dinamis, airdrop taktis, dan pelindung yang dapat hancur.' },
        { title: 'Matchmaking Global & Klaster Regional', description: 'Server latensi ultra-rendah di Amerika Utara, Eropa, Asia, dan Timur Tengah untuk kompetisi adil.' },
        { title: 'Turnamen Kompetitif & Liga Musiman', description: 'Peringkat dari Perunggu hingga Grand Pioneer Master dengan pengelolaan bagan turnamen otomatis.' },
        { title: 'Profil Perintis & Rekor Tempur Terverifikasi', description: 'Bukti peringkat, rasio KD, trofi turnamen, dan lencana pencapaian yang terhubung ke UID Perintis.' },
        { title: 'Kustomisasi Kosmetik & Zirah', description: 'Kostum sibernetik eksklusif, skin senjata, parasut, dan emote holografik. Nol mekanik pay-to-win.' },
        { title: 'Transaksi Mikro Dalam Game Eksklusif Pi', description: 'Pembelian Battle Pass dan kosmetik musiman sekali ketuk langsung melalui Pi Wallet.' },
        { title: 'Mesin Lintas Platform Ponsel & Desktop', description: 'Klien WebGL/WebGPU optimal yang berjalan lancar di Pi Browser seluler maupun desktop.' },
      ],
      communityBenefits: [
        { title: 'Adopsi Masif Generasi Muda & Gamer', description: 'Menjadikan Pi Network mata uang game Web3 utama yang menarik jutaan gamer menjadi Perintis.' },
        { title: 'Kecepatan Transaksi Volume Tinggi', description: 'Menghasilkan jutaan transaksi mikro otentik melalui tiket masuk dan kustomisasi musiman.' },
      ],
      milestones: [
        { phase: 'Tonggak 1', title: 'Prototipe Fisika & Sinkronisasi Netcode', description: 'Simulasi fisika otoritatif server, interpolasi gerakan, dan rollback networking.' },
        { phase: 'Tonggak 2', title: 'Desain Peta & Geometri Arena Sibernetik', description: 'Medan tempur modular mendetail dengan vertikalitas beragam, perlindungan taktis, dan pencahayaan dinamis.' },
        { phase: 'Tonggak 3', title: 'Toko Kosmetik & Battle Pass Pembayaran Pi', description: 'Integrasi pembayaran resmi Pi Platform untuk inventaris kosmetik dan Battle Pass musiman.' },
        { phase: 'Tonggak 4', title: 'Turnamen Beta Global & Peluncuran Mainnet', description: 'Turnamen publik internasional 100 pemain dengan papan peringkat komunitas Pi terverifikasi.' },
      ],
    },
    zh: {
      name: 'Pi Battle Arena',
      tagline: '面向 Web3 时代的高燃多人大逃杀竞技场',
      concept: '一款从零打造、拥有原创玩法、原创世界观并原生集成 Pi Network 经济体系的国际化多人大逃杀游戏。',
      description: 'Pi Battle Arena 将最多 100 名玩家空投至动态变化的全息竞技场。依托低延迟状态同步、战术武器配置、可破坏地形与全球锦标赛匹配，玩家为赛季荣耀而战。所有武器涂装、装甲皮肤、观赛通行证与赛事报名费均独家由 Pi 加密货币驱动（100% 原创 IP）。',
      plannedFeatures: [
        { title: '百人实时大逃杀模式', description: '大规模竞技对战，具备动态安全区收缩、战术空投与可破坏能量掩体。' },
        { title: '全球匹配与区域服务器集群', description: '在北美、欧洲、亚洲与中东部署超低延迟高刷新服务器，保障公平竞技。' },
        { title: '竞技锦标赛与赛季联赛', description: '从青铜到至尊先锋大师的排位体系，支持自动化赛事对阵管理。' },
        { title: '先锋战绩与认证战斗档案', description: '绑定先锋 UID 的段位认证、KD 比、赛事奖杯与成就徽章。' },
        { title: '外观与装甲个性化定制', description: '专属赛博服饰、武器皮肤、降落伞与全息表情，绝无付费变强机制。' },
        { title: 'Pi 专属游戏内微交易', description: '通过 Pi 钱包一键购买赛季通行证与限定装饰外观。' },
        { title: '移动端与桌面端跨平台引擎', description: '深度优化的 WebGL/WebGPU 客户端，在手机 Pi 浏览器和电脑端均流畅运行。' },
      ],
      communityBenefits: [
        { title: '吸引海量年轻玩家群体', description: '将 Pi Network 打造为领先的 Web3 游戏货币，吸引数百万玩家加入成为先锋。' },
        { title: '高频真实交易流转', description: '通过赛事门票与赛季外观定制创造数以百万计的真实微交易。' },
      ],
      milestones: [
        { phase: '里程碑 1', title: '物理引擎与网络同步原型', description: '服务器权威物理模拟、动作插值与回滚网络同步技术。' },
        { phase: '里程碑 2', title: '地图设计与赛博竞技场构建', description: '精细化模块化战场，拥有立体地形、战术掩体与动态光影。' },
        { phase: '里程碑 3', title: 'Pi 支付战斗通行证与外观商店', description: '接入官方 Pi Platform 支付，上线装饰背包与赛季通行证。' },
        { phase: '里程碑 4', title: '全球公测锦标赛与主网正式上线', description: '举办 100 人国际公开锦标赛并同步认证 Pi 社区排行榜。' },
      ],
    },
    th: {
      name: 'Pi Battle Arena',
      tagline: 'เกม Battle Royale หลายผู้เล่นสุดเดือดสำหรับยุค Web3',
      concept: 'เกม Battle Royale ระดับนานาชาติที่สร้างขึ้นใหม่ทั้งหมดด้วยระบบการเล่นและเนื้อเรื่องดั้งเดิม พร้อมระบบเศรษฐกิจ Pi Network โดยกำเนิด',
      description: 'Pi Battle Arena ส่งผู้เล่นสูงสุด 100 คนลงสู่สนามรบโฮโลแกรมที่เปลี่ยนแปลงตลอดเวลา ด้วยการซิงค์ความหน่วงต่ำ ชุดอาวุธเชิงกลยุทธ์ ฉากที่ทำลายได้ และการจับคู่ทัวร์นาเมนต์ระดับโลก สกินอาวุธ ชุดเกราะ บัตรผู้ชม และค่าสมัครแข่งขันทั้งหมดขับเคลื่อนด้วยเหรียญ Pi เท่านั้น (ลิขสิทธิ์แท้ 100%)',
      plannedFeatures: [
        { title: 'Battle Royale เรียลไทม์ 100 ผู้เล่น', description: 'การแข่งขันขนาดใหญ่พร้อมวงบีบแบบไดนามิก แอร์ดรอปกลยุทธ์ และที่กำบังพลังงานที่ทำลายได้' },
        { title: 'จับคู่ทั่วโลกและเซิร์ฟเวอร์ประจำภูมิภาค', description: 'เซิร์ฟเวอร์ความหน่วงต่ำพิเศษครอบคลุมอเมริกา ยุโรป เอเชีย และตะวันออกกลางเพื่อความยุติธรรม' },
        { title: 'ทัวร์นาเมนต์แข่งขันและลีกประจำฤดูกาล', description: 'อันดับตั้งแต่บรอนซ์ถึงแกรนด์มาสเตอร์ผู้บุกเบิก พร้อมระบบจัดสายแข่งอัตโนมัติ' },
        { title: 'โปรไฟล์ผู้บุกเบิกและสถิติรบที่ยืนยันได้', description: 'หลักฐานอันดับ อัตรา K/D ถ้วยรางวัล และเหรียญตราความสำเร็จที่ผูกกับ Pi UID' },
        { title: 'ปรับแต่งคอสเมติกและชุดเกราะ', description: 'ชุดไซเบอร์ สกินอาวุธ ร่มชูชีพ และอีโมตโฮโลแกรมสุดพิเศษ ไร้ระบบ Pay-to-Win' },
        { title: 'ร้านค้าในเกมด้วย Pi โดยเฉพาะ', description: 'ซื้อ Battle Pass และสกินประจำฤดูกาลได้ในแตะเดียวผ่าน Pi Wallet' },
        { title: 'เอนจินข้ามแพลตฟอร์มมือถือและเดสก์ท็อป', description: 'ไคลเอนต์ WebGL/WebGPU ที่ลื่นไหลทั้งบน Pi Browser มือถือและคอมพิวเตอร์' },
      ],
      communityBenefits: [
        { title: 'ดึงดูดเยาวชนและเกมเมอร์จำนวนมหาศาล', description: 'ผลักดัน Pi Network สู่สกุลเงินเกม Web3 ชั้นนำ ดึงดูดผู้เล่นนับล้านสู่เครือข่าย' },
        { title: 'เพิ่มปริมาณธุรกรรมความถี่สูง', description: 'สร้างธุรกรรมจริงนับล้านรายการผ่านบัตรเข้าแข่งและไอเทมปรับแต่งตามฤดูกาล' },
      ],
      milestones: [
        { phase: 'ระยะที่ 1', title: 'ต้นแบบฟิสิกส์และการซิงค์เครือข่าย', description: 'ระบบจำลองฟิสิกส์ฝั่งเซิร์ฟเวอร์และการชดเชยความหน่วงเพื่อการยิงที่แม่นยำ' },
        { phase: 'ระยะที่ 2', title: 'ออกแบบแผนที่และสนามรบไซเบอร์เนติก', description: 'สมรภูมิสามมิติหลายระดับพร้อมที่กำบังเชิงกลยุทธ์และแสงเงาแบบไดนามิก' },
        { phase: 'ระยะที่ 3', title: 'ร้านค้าสกินและ Battle Pass ผ่าน Pi', description: 'เชื่อมต่อ Pi Platform อย่างเป็นทางการสำหรับคลังคอสเมติกและบัตรฤดูกาล' },
        { phase: 'ระยะที่ 4', title: 'ทัวร์นาเมนต์เบต้าโลกและเปิด Mainnet', description: 'จัดการแข่งขัน 100 ผู้เล่นระดับนานาชาติพร้อมกระดานผู้นำชุมชน Pi ที่ตรวจสอบได้' },
      ],
    },
    tr: {
      name: 'Pi Battle Arena',
      tagline: 'Web3 Çağı İçin Yüksek Tempolu Çok Oyunculu Battle Royale',
      concept: 'Sıfırdan özgün mekanikler, özgün hikaye ve yerel Pi Network ekonomik entegrasyonu ile tasarlanmış iddialı uluslararası çok oyunculu battle royale oyunu.',
      description: 'Pi Battle Arena, 100 oyuncuyu dinamik ve değişen holografik arenalara indirir. Düşük gecikmeli senkronizasyon, taktik silah dizilimleri, yıkılabilir arazi ve küresel turnuva eşleştirmesi ile oyuncular sezonluk zafer için yarışır. Tüm silah kaplamaları, zırh kostümleri, izleyici biletleri ve turnuva katılım ücretleri yalnızca Pi ile çalışır (%100 özgün fikri mülkiyet).',
      plannedFeatures: [
        { title: '100 Oyunculu Gerçek Zamanlı Battle Royale', description: 'Dinamik daralan güvenli alanlar, taktik hava yardımları ve yıkılabilir enerji siperleriyle büyük ölçekli maçlar.' },
        { title: 'Küresel Eşleştirme ve Bölgesel Kümeler', description: 'Adil rekabet için Kuzey Amerika, Avrupa, Asya ve Orta Doğu’da ultra düşük gecikmeli sunucular.' },
        { title: 'Rekabetçi Turnuvalar ve Sezonluk Ligler', description: 'Bronz’dan Büyük Öncü Ustası’na kadar dereceli ligler ve otomatik turnuva ağacı yönetimi.' },
        { title: 'Öncü Profili ve Doğrulanmış Savaş Kaydı', description: 'Öncü UID’lerine bağlı kademe kanıtı, KD oranları, turnuva kupaları ve başarı rozetleri.' },
        { title: 'Kozmetik ve Zırh Özelleştirme', description: 'Özel sibernetik kıyafetler, silah görünümleri, paraşütler ve holografik ifadeler. Sıfır kazanmak-için-öde mekaniği.' },
        { title: 'Pi’ye Özel Oyun İçi Mikro İşlemler', description: 'Doğrudan Pi Cüzdan üzerinden tek dokunuşla Savaş Bileti ve sezonluk kozmetik satın alımı.' },
        { title: 'Çapraz Platform Mobil ve Masaüstü Motoru', description: 'Hem mobil Pi Browser hem de masaüstü ortamlarda akıcı çalışan optimize WebGL/WebGPU istemcisi.' },
      ],
      communityBenefits: [
        { title: 'Gençler ve Oyuncular Arasında Kitlesel Benimseme', description: 'Pi Network’ü önde gelen Web3 oyun para birimi haline getirerek milyonlarca oyuncuyu Öncü olmaya çeker.' },
        { title: 'Yüksek Hacimli İşlem Hızı', description: 'Katılım biletleri ve sezonluk özelleştirmeler sayesinde milyonlarca gerçek mikro işlem üretir.' },
      ],
      milestones: [
        { phase: 'Aşama 1', title: 'Fizik ve Ağ Senkronizasyon Prototipi', description: 'Sunucu yetkili fizik simülasyonu, hareket enterpolasyonu ve gecikme telafi ağı.' },
        { phase: 'Aşama 2', title: 'Harita Tasarımı ve Sibernetik Arena Mimarisi', description: 'Çeşitli dikeylik, taktik siperler ve dinamik aydınlatmaya sahip modüler savaş alanı.' },
        { phase: 'Aşama 3', title: 'Pi Ödemeli Savaş Bileti ve Kozmetik Mağazası', description: 'Kozmetik envanteri ve sezonluk Savaş Biletleri için resmi Pi Platform ödeme entegrasyonu.' },
        { phase: 'Aşama 4', title: 'Küresel Beta Turnuvası ve Mainnet Açılışı', description: 'Doğrulanmış Pi topluluk sıralamalarıyla 100 oyunculu uluslararası açık turnuva.' },
      ],
    },
    ru: {
      name: 'Pi Battle Arena',
      tagline: 'Динамичная многопользовательская королевская битва для эпохи Web3',
      concept: 'Масштабная международная королевская битва, созданная с нуля с оригинальными механиками, лором и нативной экономикой Pi Network.',
      description: 'Pi Battle Arena высаживает до 100 игроков на динамичные голографические арены. Благодаря синхронизации с минимальной задержкой, тактическому снаряжению, разрушаемым укрытиям и глобальному подбору матчей игроки сражаются за сезонную славу. Все скины оружия, броня, пропуска и турнирные взносы работают исключительно на криптовалюте Pi (100% оригинальный IP).',
      plannedFeatures: [
        { title: 'Королевская битва на 100 игроков в реальном времени', description: 'Масштабные матчи с динамическим сужением зоны, тактическим сбросом грузов и разрушаемыми щитами.' },
        { title: 'Глобальный подбор и региональные кластеры', description: 'Серверы с ультранизким пингом в Северной Америке, Европе, Азии и на Ближнем Востоке.' },
        { title: 'Соревновательные турниры и сезонные лиги', description: 'Ранги от Бронзы до Гранд-мастера пионеров с автоматическими турнирными сетками.' },
        { title: 'Профиль пионера и подтверждённая статистика боёв', description: 'Подтверждение ранга, K/D, трофеи и значки достижений, привязанные к UID Пионера.' },
        { title: 'Кастомизация брони и обликов', description: 'Кибернетические костюмы, раскраски оружия, парашюты и эмоции. Никакого pay-to-win.' },
        { title: 'Внутриигровые микротранзакции за Pi', description: 'Покупка Боевых пропусков и сезонных предметов в одно касание через Pi Wallet.' },
        { title: 'Кроссплатформенный движок для мобильных и ПК', description: 'Оптимизированный WebGL/WebGPU клиент, плавно работающий в мобильном Pi Browser и на компьютерах.' },
      ],
      communityBenefits: [
        { title: 'Массовое привлечение геймеров и молодёжи', description: 'Позиционирует Pi Network как ведущую игровую Web3-валюту, привлекая миллионы игроков.' },
        { title: 'Высокая скорость оборота транзакций', description: 'Создаёт миллионы реальных микротранзакций за счёт пропусков и сезонной кастомизации.' },
      ],
      milestones: [
        { phase: 'Этап 1', title: 'Прототип физики и сетевой синхронизации', description: 'Серверная симуляция физики, интерполяция движений и сглаживание сетевой задержки.' },
        { phase: 'Этап 2', title: 'Дизайн карт и геометрия кибер-арены', description: 'Детализированная модульная арена с многоуровневым рельефом и динамическим освещением.' },
        { phase: 'Этап 3', title: 'Магазин обликов и Боевой пропуск за Pi', description: 'Официальная интеграция платежей Pi Platform для инвентаря и сезонных пропусков.' },
        { phase: 'Этап 4', title: 'Глобальный бета-турнир и открытый запуск', description: 'Международный открытый турнир на 100 игроков с проверенным рейтингом сообщества Pi.' },
      ],
    },
  },
};

const AR_MILESTONE_PHASES: Record<string, string> = {
  'Milestone 1': 'المرحلة 1',
  'Milestone 2': 'المرحلة 2',
  'Milestone 3': 'المرحلة 3',
  'Milestone 4': 'المرحلة 4',
};

export interface LocalizedProjectResult {
  name: string;
  tagline: string;
  concept: string;
  description: string;
  plannedFeatures: { title: string; description: string; icon: string }[];
  communityBenefits: { title: string; description: string }[];
  milestones: {
    id: string;
    phase: string;
    title: string;
    description: string;
    targetQuarter: string;
    status: 'planned' | 'in_development' | 'completed';
  }[];
}

export const getLocalizedProject = (project: PiEcosystemProject, language: Language): LocalizedProjectResult => {
  if (language === 'en') {
    return {
      name: project.name,
      tagline: project.tagline,
      concept: project.concept,
      description: project.description,
      plannedFeatures: project.plannedFeatures.map((f) => ({ title: f.title, description: f.description, icon: f.icon })),
      communityBenefits: project.communityBenefits.map((b) => ({ title: b.title, description: b.description })),
      milestones: project.milestones.map((m) => ({
        id: m.id,
        phase: m.phase,
        title: m.title,
        description: m.description,
        targetQuarter: m.targetQuarter,
        status: m.status,
      })),
    };
  }
  if (language === 'ar') {
    return {
      name: project.nameAr,
      tagline: project.taglineAr,
      concept: project.conceptAr,
      description: project.descriptionAr,
      plannedFeatures: project.plannedFeatures.map((f) => ({ title: f.titleAr, description: f.descriptionAr, icon: f.icon })),
      communityBenefits: project.communityBenefits.map((b) => ({ title: b.titleAr, description: b.descriptionAr })),
      milestones: project.milestones.map((m) => ({
        id: m.id,
        phase: AR_MILESTONE_PHASES[m.phase] || m.phase,
        title: m.titleAr,
        description: m.descriptionAr,
        targetQuarter: m.targetQuarter,
        status: m.status,
      })),
    };
  }

  const tr = PROJECT_TRANSLATIONS[project.id]?.[language];
  if (!tr) {
    return getLocalizedProject(project, 'en');
  }
  return {
    name: tr.name,
    tagline: tr.tagline,
    concept: tr.concept,
    description: tr.description,
    plannedFeatures: project.plannedFeatures.map((f, idx) => ({
      title: tr.plannedFeatures[idx]?.title || f.title,
      description: tr.plannedFeatures[idx]?.description || f.description,
      icon: f.icon,
    })),
    communityBenefits: project.communityBenefits.map((b, idx) => ({
      title: tr.communityBenefits[idx]?.title || b.title,
      description: tr.communityBenefits[idx]?.description || b.description,
    })),
    milestones: project.milestones.map((m, idx) => ({
      id: m.id,
      phase: tr.milestones[idx]?.phase || m.phase,
      title: tr.milestones[idx]?.title || m.title,
      description: tr.milestones[idx]?.description || m.description,
      targetQuarter: m.targetQuarter,
      status: m.status,
    })),
  };
};

// ============================================================================
// 9. ALL 80 UPGRADES
// ============================================================================
const UPGRADE_TRANSLATIONS: Record<string, Record<NonEnArLang, { name: string; description: string }>> = {
  // --- SECTION 1: TAP & COMBAT ---
  tap_paws_1: {
    vi: { name: 'Găng Tay Nhung', description: 'Tăng lực chạm với độ linh hoạt mượt mà (+1 sức chạm).' },
    id: { name: 'Sarung Tangan Beludru', description: 'Meningkatkan dampak ketukan dengan kelincahan halus (+1 kekuatan tap).' },
    zh: { name: '天鹅绒手套', description: '以丝滑敏捷增强点击冲击力（+1 点击威力）。' },
    th: { name: 'ถุงมือกำมะหยี่', description: 'เพิ่มแรงแตะอย่างนุ่มนวลและคล่องตัว (+1 พลังแตะ)' },
    tr: { name: 'Kadife Eldivenler', description: 'Dokunuş gücünü ipeksi çeviklikle artırır (+1 dokunuş gücü).' },
    ru: { name: 'Бархатные перчатки', description: 'Усиливает клик с невероятной ловкостью (+1 к силе клика).' },
  },
  tap_bionic_paws: {
    vi: { name: 'Chân Sinh Học Bionic', description: 'Bàn chân cơ học gia cường tạo lực chạm mạnh mẽ (+4 sức chạm).' },
    id: { name: 'Cakar Bionik', description: 'Cakar sibernetik yang diperkuat untuk dampak berat (+4 kekuatan tap).' },
    zh: { name: '仿生机械爪', description: '强化赛博机械爪，带来沉重打击力（+4 点击威力）。' },
    th: { name: 'อุ้งเท้าไบโอนิก', description: 'อุ้งเท้าไซเบอร์เสริมแกร่งให้แรงกระแทกหนักแน่น (+4 พลังแตะ)' },
    tr: { name: 'Biyonik Patiler', description: 'Güçlü etki sağlayan takviyeli siber patiler (+4 dokunuş gücü).' },
    ru: { name: 'Бионические лапы', description: 'Усиленные кибер-лапы для мощного удара (+4 к силе клика).' },
  },
  tap_kinetic_claws: {
    vi: { name: 'Vuốt Nano Động Lực', description: 'Bộ vuốt động lực siêu nhạy (+12 sức chạm).' },
    id: { name: 'Cakar Nano Kinetik', description: 'Cakar kinetik ultra-responsif (+12 kekuatan tap).' },
    zh: { name: '动能纳米爪', description: '超高响应速度的纳米动能利爪（+12 点击威力）。' },
    th: { name: 'กรงเล็บนาโนจลน์', description: 'กรงเล็บจลน์ตอบสนองไวเป็นพิเศษ (+12 พลังแตะ)' },
    tr: { name: 'Kinetik Nano Pençeler', description: 'Ultra duyarlı kinetik pençeler (+12 dokunuş gücü).' },
    ru: { name: 'Кинетические нано-когти', description: 'Сверхчувствительные кинетические когти (+12 к силе клика).' },
  },
  tap_spiked_knuckles: {
    vi: { name: 'Đấm Gai Thép', description: 'Nắm đấm gai tung ra cú chạm uy lực (+25 sức chạm).' },
    id: { name: 'Buku Jari Berduri', description: 'Sarung tinju berduri yang menghasilkan pukulan dahsyat (+25 kekuatan tap).' },
    zh: { name: '尖刺指虎', description: '蕴含猛烈冲击力的尖刺拳套（+25 点击威力）。' },
    th: { name: 'สนับมือหนาม', description: 'สนับมือหนามที่ปล่อยหมัดอันดุดัน (+25 พลังแตะ)' },
    tr: { name: 'Dikenli Muşta', description: 'Sert vuruşlar indiren darbeli muşta (+25 dokunuş gücü).' },
    ru: { name: 'Шипованные кастеты', description: 'Ударные кастеты для сокрушительных кликов (+25 к силе клика).' },
  },
  tap_titanium_pads: {
    vi: { name: 'Đệm Chân Titan', description: 'Miếng đệm titan hàng không siêu nhẹ (+50 sức chạm).' },
    id: { name: 'Pelindung Kaki Titanium', description: 'Bantalan titanium kedirgantaraan yang ringan (+50 kekuatan tap).' },
    zh: { name: '钛合金护垫', description: '轻量化航空级钛合金护掌（+50 点击威力）。' },
    th: { name: 'เกราะอุ้งเท้าไทเทเนียม', description: 'แผ่นรองไทเทเนียมเกรดอากาศยานน้ำหนักเบา (+50 พลังแตะ)' },
    tr: { name: 'Titanyum Pati Koruyucu', description: 'Hafif havacılık sınıfı titanyum yastıklar (+50 dokunuş gücü).' },
    ru: { name: 'Титановые накладки', description: 'Лёгкие авиационные титановые накладки (+50 к силе клика).' },
  },
  tap_plasma_ring: {
    vi: { name: 'Nhẫn Xung Plasma', description: 'Thắp sáng plasma ion hóa quanh mỗi cú chạm (+110 sức chạm).' },
    id: { name: 'Cincin Serangan Plasma', description: 'Menyalakan plasma terionisasi di sekitar ketukanmu (+110 kekuatan tap).' },
    zh: { name: '等离子打击环', description: '在每次点击周围点燃电离等离子体（+110 点击威力）。' },
    th: { name: 'แหวนโจมตีพลาสมา', description: 'จุดพลังพลาสมารอบทุกการแตะของคุณ (+110 พลังแตะ)' },
    tr: { name: 'Plazma Darbe Yüzüğü', description: 'Her dokunuşta iyonize plazma ateşler (+110 dokunuş gücü).' },
    ru: { name: 'Плазменное кольцо', description: 'Воспламеняет ионизированную плазму при каждом ударе (+110 к клику).' },
  },
  tap_sonic_amplifier: {
    vi: { name: 'Bộ Khuếch Đại Siêu Âm', description: 'Tạo sóng xung kích âm thanh theo từng lần chạm (+240 sức chạm).' },
    id: { name: 'Penguat Serangan Sonik', description: 'Menghasilkan gelombang kejut sonik di setiap ketukan (+240 kekuatan tap).' },
    zh: { name: '音爆增幅器', description: '每次点击都释放震撼音爆冲击波（+240 点击威力）。' },
    th: { name: 'เครื่องขยายพลังโซนิก', description: 'สร้างคลื่นกระแทกโซนิกในทุกครั้งที่แตะ (+240 พลังแตะ)' },
    tr: { name: 'Sonik Darbe Güçlendirici', description: 'Her dokunuşta sarsıcı ses şok dalgaları üretir (+240 dokunuş gücü).' },
    ru: { name: 'Звуковой усилитель', description: 'Создаёт мощные звуковые ударные волны при каждом клике (+240 к клику).' },
  },
  tap_thunder_mallet: {
    vi: { name: 'Búa Sấm Sét Hamster', description: 'Chiếc búa huyền thoại giáng đòn sấm rền (+500 sức chạm).' },
    id: { name: 'Palu Petir Hamster', description: 'Palu epik yang menghantam dengan kekuatan guntur (+500 kekuatan tap).' },
    zh: { name: '雷霆仓鼠战锤', description: '释放雷鸣重击的史诗矮人战锤（+500 点击威力）。' },
    th: { name: 'ค้อนสายฟ้าแฮมสเตอร์', description: 'ค้อนระดับตำนานที่ฟาดด้วยพลังสายฟ้าฟาด (+500 พลังแตะ)' },
    tr: { name: 'Yıldırım Hamster Çekici', description: 'Gök gürültüsü etkisiyle vuran destansı çekiç (+500 dokunuş gücü).' },
    ru: { name: 'Молот грома', description: 'Эпический молот с громовым ударом (+500 к силе клика).' },
  },
  tap_quantum_hyper: {
    vi: { name: 'Siêu Đòn Lượng Tử', description: 'Bùng nổ hạt hạ nguyên tử khi chạm (+1100 sức chạm).' },
    id: { name: 'Serangan Hiper Kuantum', description: 'Ledakan partikel subatomik saat bersentuhan (+1100 kekuatan tap).' },
    zh: { name: '量子超击', description: '触碰瞬间触发亚原子粒子爆发（+1100 点击威力）。' },
    th: { name: 'ไฮเปอร์สไตรก์ควอนตัม', description: 'ระเบิดอนุภาคควอนตัมทันทีที่สัมผัส (+1100 พลังแตะ)' },
    tr: { name: 'Kuantum Hiper Vuruşu', description: 'Temas anında atom altı parçacık patlaması (+1100 dokunuş gücü).' },
    ru: { name: 'Квантовый гипероудар', description: 'Взрыв субатомных частиц при каждом касании (+1100 к клику).' },
  },
  lucky_clover: {
    vi: { name: 'Cỏ Bốn Lá May Mắn', description: 'Tăng tỷ lệ đòn chí mạng thêm +2%.' },
    id: { name: 'Semanggi Empat Daun', description: 'Meningkatkan peluang serangan kritis sebesar +2%.' },
    zh: { name: '四叶幸运草', description: '暴击几率提高 +2%。' },
    th: { name: 'ใบโคลเวอร์สี่แฉก', description: 'เพิ่มโอกาสติดคริติคอล +2%' },
    tr: { name: 'Dört Yapraklı Yonca', description: 'Kritik vuruş şansını +%2 artırır.' },
    ru: { name: 'Четырёхлистный клевер', description: 'Повышает шанс критического удара на +2%.' },
  },
  crit_laser_scope: {
    vi: { name: 'Ống Ngắm Laser Chính Xác', description: 'Khuếch đại hệ số sát thương chí mạng (+0.3x).' },
    id: { name: 'Teropong Laser Presisi', description: 'Memperkuat pengali kerusakan serangan kritis (+0.3x).' },
    zh: { name: '精密激光瞄准镜', description: '放大暴击伤害倍率（+0.3x）。' },
    th: { name: 'กล้องเลเซอร์แม่นยำสูง', description: 'เพิ่มตัวคูณความเสียหายคริติคอล (+0.3x)' },
    tr: { name: 'Hassas Lazer Dürbünü', description: 'Kritik vuruş hasar çarpanını artırır (+0.3x).' },
    ru: { name: 'Лазерный прицел', description: 'Увеличивает множитель критического удара (+0.3x).' },
  },
  crit_berserker_helm: {
    vi: { name: 'Mũ Chiến Binh Cuồng Nộ', description: 'Mũ sừng dũng mãnh tăng +2.5% tỷ lệ chí mạng.' },
    id: { name: 'Helm Hamster Berserker', description: 'Helm bertanduk ganas yang memberi +2.5% peluang kritis.' },
    zh: { name: '狂战士仓鼠头盔', description: '凶猛的双角头盔，提供 +2.5% 暴击几率。' },
    th: { name: 'หมวกเกราะเบอร์เซิร์กเกอร์', description: 'หมวกเขาดุดันเพิ่มโอกาสคริติคอล +2.5%' },
    tr: { name: 'Vahşi Hamster Miğferi', description: '+%2.5 kritik vuruş şansı veren boynuzlu miğfer.' },
    ru: { name: 'Шлем берсерка', description: 'Грозный рогатый шлем, дающий +2.5% к шансу крита.' },
  },
  crit_target_visor: {
    vi: { name: 'Kính Ngắm Chiến Thuật', description: 'Phân tích điểm yếu để cộng +0.5x hệ số chí mạng.' },
    id: { name: 'Visor Target Tempur', description: 'Menganalisis titik lemah untuk menambah +0.5x pengali kritis.' },
    zh: { name: '战术瞄准护目镜', description: '分析弱点并额外增加 +0.5x 暴击倍率。' },
    th: { name: 'แว่นเล็งเป้าหมายยุทธวิธี', description: 'วิเคราะห์จุดอ่อนเพื่อเพิ่มตัวคูณคริติคอล +0.5x' },
    tr: { name: 'Savaş Hedefleme Vizörü', description: '+0.5x kritik çarpanı eklemek için zayıf noktaları analiz eder.' },
    ru: { name: 'Боевой визор наведения', description: 'Находит уязвимые точки и добавляет +0.5x к крит. множителю.' },
  },
  crit_fatal_focus: {
    vi: { name: 'Tập Trung Chí Tử', description: 'Rèn bản năng chiến đấu tăng +3% tỷ lệ chí mạng.' },
    id: { name: 'Fokus Serangan Fatal', description: 'Mempertajam insting tempur untuk +3% peluang serangan kritis.' },
    zh: { name: '致命打击专注', description: '磨砺战斗直觉，获得 +3% 暴击几率。' },
    th: { name: 'สมาธิพิฆาต', description: 'ลับสัญชาตญาณการต่อสู้ เพิ่มโอกาสคริติคอล +3%' },
    tr: { name: 'Ölümcül Vuruş Odağı', description: '+%3 kritik vuruş şansı için savaş içgüdülerini keskinleştirir.' },
    ru: { name: 'Фокус смертельного удара', description: 'Обостряет боевые инстинкты: +3% к шансу крита.' },
  },
  combo_metronome: {
    vi: { name: 'Máy Đếm Nhịp Combo', description: 'Giữ nhịp chạm đều và cộng +5% điểm thưởng combo.' },
    id: { name: 'Metronom Ritme', description: 'Menjaga kecepatan ketukan dan menambah +5% bonus hasil kombo.' },
    zh: { name: '节奏节拍器', description: '保持点击节奏并增加 +5% 连击收益加成。' },
    th: { name: 'เครื่องเคาะจังหวะคอมโบ', description: 'รักษาจังหวะการแตะและเพิ่มโบนัสคอมโบ +5%' },
    tr: { name: 'Ritim Metronomu', description: 'Dokunuş temposunu korur ve +%5 kombo bonusu ekler.' },
    ru: { name: 'Ритм-метроном', description: 'Поддерживает темп нажатий и даёт +5% к комбо-бонусу.' },
  },
  combo_resonator: {
    vi: { name: 'Bộ Cộng Hưởng Nhịp Liên Tiếp', description: 'Chạm liên tục tích lũy combo tới +10% điểm cộng thêm.' },
    id: { name: 'Resonator Ritme Berkelanjutan', description: 'Ketukan beruntun membangun bonus kombo hingga +10% poin ekstra.' },
    zh: { name: '连续节奏谐振器', description: '连续点击累积连击奖励，最高可获 +10% 额外积分。' },
    th: { name: 'ตัวสะท้อนจังหวะต่อเนื่อง', description: 'แตะต่อเนื่องเพื่อสะสมโบนัสคอมโบสูงสุด +10%' },
    tr: { name: 'Sürekli Ritim Rezonatörü', description: 'Ardışık dokunuşlar +%10’a kadar ekstra kombo puanı biriktirir.' },
    ru: { name: 'Резонатор ритма', description: 'Серии нажатий увеличивают комбо-награду до +10%.' },
  },
  combo_fury_gauge: {
    vi: { name: 'Đồng Hồ Cuồng Nộ Combo', description: 'Tích thanh cuồng nộ khi chạm nhanh để nhận thêm +15% sản lượng.' },
    id: { name: 'Pengukur Kemarahan Kombo', description: 'Mengisi bilah fury saat ketukan cepat untuk +15% hasil ekstra.' },
    zh: { name: '狂怒连击计量表', description: '快速点击充能狂怒条，获得 +15% 额外产出。' },
    th: { name: 'มาตรวัดคลั่งคอมโบ', description: 'ชาร์จแถบคลั่งเมื่อแตะเร็วเพื่อรับคะแนนเพิ่ม +15%' },
    tr: { name: 'Öfke Kombo Göstergesi', description: 'Hızlı dokunuşlarda öfke çubuğunu doldurarak +%15 ekstra gelir sağlar.' },
    ru: { name: 'Шкала ярости комбо', description: 'Заряжается при быстрых кликах, давая +15% к доходу.' },
  },
  touch_midas_glove: {
    vi: { name: 'Nguyên Mẫu Găng Tay Midas', description: 'Mỗi lần chạm có cơ hội nhận trực tiếp Hạt Vàng thưởng.' },
    id: { name: 'Prototipe Sarung Tangan Midas', description: 'Setiap ketukan berpeluang langsung memberi bonus Biji Emas.' },
    zh: { name: '迈达斯金手原型', description: '每次点击都有几率直接获得额外金种子奖励。' },
    th: { name: 'ต้นแบบถุงมือไมดาส', description: 'ทุกการแตะมีโอกาสได้รับเมล็ดทองคำโบนัสทันที' },
    tr: { name: 'Midas Eldiveni Prototipi', description: 'Her dokunuş doğrudan bonus Altın Tohum kazandırma şansına sahiptir.' },
    ru: { name: 'Прототип перчатки Мидаса', description: 'Каждый клик имеет шанс сразу принести бонусные золотые семена.' },
  },
  touch_golden_bracer: {
    vi: { name: 'Vòng Tay Bàn Tay Vàng', description: 'Biến cú chạm thường thành cơn mưa điểm vàng nhân 3x.' },
    id: { name: 'Gelang Sentuhan Emas', description: 'Mengubah ketukan biasa menjadi hujan poin emas 3x lipat.' },
    zh: { name: '点金手腕甲', description: '将普通点击转化为 3 倍黄金积分雨。' },
    th: { name: 'ปลอกแขนสัมผัสทองคำ', description: 'เปลี่ยนการแตะธรรมดาให้เป็นสายฝนคะแนนทองคำ 3x' },
    tr: { name: 'Altın Dokunuş Bilekliği', description: 'Normal dokunuşları 3 kat altın puan yağmuruna dönüştürür.' },
    ru: { name: 'Браслет золотого касания', description: 'Превращает обычные клики в 3x золотой дождь очков.' },
  },
  touch_alchemical_seal: {
    vi: { name: 'Ấn Ký Giả Kim', description: 'Cổ ấn giúp tăng tỷ lệ hóa chạm thành Hạt Vàng.' },
    id: { name: 'Segel Sentuhan Alkimia', description: 'Segel kuno yang meningkatkan transmutasi biji emas saat mengetuk.' },
    zh: { name: '炼金之触封印', description: '古老符印，提升点击转化为金种子的几率。' },
    th: { name: 'ตราประทับเล่นแร่แปรธาตุ', description: 'สัญลักษณ์โบราณที่ช่วยเพิ่มการแปรธาตุเป็นเมล็ดทองคำ' },
    tr: { name: 'Simya Dokunuş Mührü', description: 'Dokunuşlarda altın tohum dönüşümünü artıran kadim mühür.' },
    ru: { name: 'Алхимическая печать', description: 'Древний символ, повышающий шанс добычи золотых семян при клике.' },
  },

  // --- SECTION 2: PRODUCTION ---
  pi_node_workshop: {
    vi: { name: 'Xưởng Nút Pi Node', description: 'Nút máy tính nhỏ khai thác điểm liên tục suốt ngày đêm (+50/giờ).' },
    id: { name: 'Bengkel Node Pi', description: 'Node desktop sederhana yang menambang poin sepanjang waktu (+50/jam).' },
    zh: { name: 'Pi 节点工坊', description: '全天候自动挖矿积分的桌面节点（+50/小时）。' },
    th: { name: 'เวิร์กช็อปโหนด Pi', description: 'โหนดตั้งโต๊ะขนาดย่อมที่ขุดคะแนนตลอด 24 ชั่วโมง (+50/ชม.)' },
    tr: { name: 'Pi Node Atölyesi', description: 'Günün her saati puan kazan mütevazı bir masaüstü düğümü (+50/sa).' },
    ru: { name: 'Мастерская Pi-ноды', description: 'Компактная нода, круглосуточно добывающая очки (+50/ч).' },
  },
  hamster_rig: {
    vi: { name: 'Giàn Khai Thác Bánh Xe', description: 'Chuyển hóa động năng chạy bánh xe thành điểm liên tục (+140/giờ).' },
    id: { name: 'Rig Tambang Roda Hamster', description: 'Energi kinetik hamster diubah menjadi poin berkelanjutan (+140/jam).' },
    zh: { name: '仓鼠滚轮矿机', description: '将仓鼠奔跑动能持续转化为积分产出（+140/小时）。' },
    th: { name: 'แท่นขุดวงล้อแฮมสเตอร์', description: 'แปลงพลังงานจลน์จากวงล้อแฮมสเตอร์เป็นคะแนนต่อเนื่อง (+140/ชม.)' },
    tr: { name: 'Hamster Çarkı Maden Düzeneği', description: 'Kinetik hamster enerjisi sürekli puana dönüştürülür (+140/sa).' },
    ru: { name: 'Колесо для майнинга', description: 'Преобразует кинетическую энергию бега хомяка в очки (+140/ч).' },
  },
  solar_seed_farm: {
    vi: { name: 'Trang Trại Hạt Năng Lượng Mặt Trời', description: 'Cánh đồng hướng dương thân thiện môi trường tạo thu nhập đều (+360/giờ).' },
    id: { name: 'Ladang Biji Tenaga Surya', description: 'Ladang bunga matahari ramah lingkungan dengan hasil berkelanjutan (+360/jam).' },
    zh: { name: '太阳能种子农场', description: '绿色环保的向日葵农场，持续创造积分收益（+360/小时）。' },
    th: { name: 'ฟาร์มเมล็ดพลังงานแสงอาทิตย์', description: 'ทุ่งทานตะวันรักษ์โลกที่สร้างผลผลิตต่อเนื่อง (+360/ชม.)' },
    tr: { name: 'Güneş Enerjili Tohum Çiftliği', description: 'Sürekli gelir üreten çevre dostu ayçiçeği tarlaları (+360/sa).' },
    ru: { name: 'Солнечная ферма семян', description: 'Экологичные поля подсолнухов с непрерывным доходом (+360/ч).' },
  },
  wind_turbine_nest: {
    vi: { name: 'Tổ Tua-bin Gió', description: 'Tua-bin gió khí động học thu giữ gió núi (+850/giờ).' },
    id: { name: 'Sarang Turbin Angin', description: 'Turbin angin aero-kinetik penangkap angin pegunungan (+850/jam).' },
    zh: { name: '风力涡轮巢穴', description: '捕捉山风的空气动力学风力涡轮机组（+850/小时）。' },
    th: { name: 'รังกังหันลม', description: 'กังหันลมแอโรจลน์ดักจับสายลมบนภูเขา (+850/ชม.)' },
    tr: { name: 'Rüzgar Türbini Yuvası', description: 'Dağ esintilerini yakalayan aero-kinetik rüzgar türbinleri (+850/sa).' },
    ru: { name: 'Гнездо ветряных турбин', description: 'Аэродинамические турбины, ловящие горный ветер (+850/ч).' },
  },
  hydro_acorn_mill: {
    vi: { name: 'Cối Xay Thủy Điện Hạt Dẻ', description: 'Dòng sông chảy xiết quay cối xay điểm mô-men xoắn cao (+1.900/giờ).' },
    id: { name: 'Kincir Air Biji Ek', description: 'Aliran sungai terus-menerus memutar kincir poin bertenaga tinggi (+1.900/jam).' },
    zh: { name: '水力橡果磨坊', description: '奔腾河水驱动高扭矩积分磨坊持续运转（+1,900/小时）。' },
    th: { name: 'โรงสีพลังน้ำลูกโอ๊ก', description: 'กระแสน้ำไหลต่อเนื่องปั่นโรงสีคะแนนแรงบิดสูง (+1,900/ชม.)' },
    tr: { name: 'Hidro Meşe Değirmeni', description: 'Yüksek torklu puan değirmenini döndüren kesintisiz nehir akışı (+1.900/sa).' },
    ru: { name: 'Водяная мельница желудей', description: 'Бурный поток реки вращает мощную мельницу очков (+1 900/ч).' },
  },
  geothermal_seed_forge: {
    vi: { name: 'Lò Rèn Hạt Địa Nhiệt', description: 'Khai thác hơi nước núi lửa ngầm chạy siêu tua-bin (+4.200/giờ).' },
    id: { name: 'Tempa Biji Geotermal', description: 'Memanfaatkan uap vulkanik bawah tanah untuk menggerakkan mega-turbin (+4.200/jam).' },
    zh: { name: '地热种子熔炉', description: '利用地下火山蒸汽驱动巨型涡轮机（+4,200/小时）。' },
    th: { name: 'โรงหลอมเมล็ดพลังงานความร้อนใต้พิภพ', description: 'ใช้ไอน้ำภูเขาไฟใต้ดินขับเคลื่อนเมกะเทอร์ไบน์ (+4,200/ชม.)' },
    tr: { name: 'Jeotermal Tohum Ocağı', description: 'Mega türbinleri sürmek için yeraltı volkanik buharını kullanır (+4.200/sa).' },
    ru: { name: 'Геотермальная кузница', description: 'Использует подземный вулканический пар для вращения мега-турбин (+4 200/ч).' },
  },
  nuclear_dynamo: {
    vi: { name: 'Máy Phát Hạt Nhân Hamster', description: 'Máy phát phân hạch an toàn bơm điểm liên tục (+9.500/giờ).' },
    id: { name: 'Dinamo Nuklir Hamster', description: 'Dinamo bertenaga fisi yang memancarkan poin terus-menerus (+9.500/jam).' },
    zh: { name: '仓鼠核能发电机', description: '安全裂变发电机，持续输出澎湃积分流（+9,500/小时）。' },
    th: { name: 'ไดนาโมนิวเคลียร์แฮมสเตอร์', description: 'เครื่องกำเนิดพลังงานฟิชชันที่จ่ายคะแนนอย่างต่อเนื่อง (+9,500/ชม.)' },
    tr: { name: 'Nükleer Hamster Dinamosu', description: 'Kesintisiz puan akışı sağlayan fisyon güçlü dinamo (+9.500/sa).' },
    ru: { name: 'Ядерное динамо хомяка', description: 'Генератор деления, выдающий непрерывный поток очков (+9 500/ч).' },
  },
  orbital_seed_harvester: {
    vi: { name: 'Trạm Thu Hoạch Quỹ Đạo', description: 'Trạm vũ trụ thu năng lượng mặt trời truyền thẳng thành điểm (+22.000/giờ).' },
    id: { name: 'Pemanen Biji Orbital', description: 'Kolektor stasiun luar angkasa yang memancarkan energi surya menjadi poin (+22.000/jam).' },
    zh: { name: '轨道种子收割站', description: '太空站太阳能收集器将星能转化为积分（+22,000/小时）。' },
    th: { name: 'เครื่องเก็บเกี่ยววงโคจร', description: 'สถานีอวกาศส่งพลังงานแสงอาทิตย์แปลงเป็นคะแนน (+22,000/ชม.)' },
    tr: { name: 'Yörünge Tohum Biçerdöveri', description: 'Güneş enerjisini puana dönüştüren uzay istasyonu toplayıcıları (+22.000/sa).' },
    ru: { name: 'Орбитальный сборщик', description: 'Космическая станция преобразует солнечные лучи в очки (+22 000/ч).' },
  },
  mach_steam_extractor: {
    vi: { name: 'Máy Chiết Xuất Hơi Nước', description: 'Cỗ máy hơi nước công nghiệp bơm sản lượng tự động (+1.300/giờ).' },
    id: { name: 'Ekstraktor Biji Tenaga Uap', description: 'Mesin uap industri yang memompa hasil otomatis (+1.300/jam).' },
    zh: { name: '蒸汽动力提取机', description: '工业级蒸汽机械，自动泵出稳定积分收益（+1,300/小时）。' },
    th: { name: 'เครื่องสกัดเมล็ดพลังไอน้ำ', description: 'เครื่องจักรไอน้ำอุตสาหกรรมผลิตคะแนนอัตโนมัติ (+1,300/ชม.)' },
    tr: { name: 'Buharlı Tohum Çıkarıcı', description: 'Otomatik gelir pompalayan endüstriyel buhar makinesi (+1.300/sa).' },
    ru: { name: 'Паровой экстрактор семян', description: 'Промышленная паровая машина с автоматической добычей (+1 300/ч).' },
  },
  pi_data_center: {
    vi: { name: 'Trung Tâm Dữ Liệu Đám Mây Pi', description: 'Cụm máy chủ mật độ cao truyền điểm tự động liên tục (+3.400/giờ).' },
    id: { name: 'Pusat Data Cloud Pi', description: 'Klaster server berdensitas tinggi yang mengalirkan poin otomatis (+3.400/jam).' },
    zh: { name: 'Pi 云端数据中心', description: '高密度服务器集群，源源不断传输自动积分（+3,400/小时）。' },
    th: { name: 'ศูนย์ข้อมูลคลาวด์ Pi', description: 'คลัสเตอร์เซิร์ฟเวอร์ความหนาแน่นสูงที่ส่งคะแนนอัตโนมัติ (+3,400/ชม.)' },
    tr: { name: 'Pi Bulut Veri Merkezi', description: 'Otomatik puan akışı sağlayan yüksek yoğunluklu sunucu kümeleri (+3.400/sa).' },
    ru: { name: 'Облачный дата-центр Pi', description: 'Высокоплотные кластеры серверов с потоком очков (+3 400/ч).' },
  },
  mach_hydroponic_wheel: {
    vi: { name: 'Bánh Xe Thủy Canh Tự Động', description: 'Buồng thủy canh xoay giàu dinh dưỡng (+7.800/giờ).' },
    id: { name: 'Roda Hidroponik Otomatis', description: 'Ruang hidroponik berputar penuh nutrisi (+7.800/jam).' },
    zh: { name: '自动水培旋转轮', description: '富含营养液的自动旋转水培舱（+7,800/小时）。' },
    th: { name: 'วงล้อไฮโดรโปนิกส์อัตโนมัติ', description: 'ห้องเพาะเลี้ยงไฮโดรโปนิกส์หมุนวนอัตโนมัติ (+7,800/ชม.)' },
    tr: { name: 'Otomatik Hidroponik Çark', description: 'Besin destekli dönen hidroponik odalar (+7.800/sa).' },
    ru: { name: 'Гидропонное колесо', description: 'Вращающиеся питательные гидропонные камеры (+7 800/ч).' },
  },
  mach_molecular_press: {
    vi: { name: 'Máy Ép Hạt Phân Tử', description: 'Máy ép chính xác cấp nguyên tử tạo mật độ điểm cực cao (+16.500/giờ).' },
    id: { name: 'Mesin Pres Biji Molekuler', description: 'Mesin pres presisi atomik yang menghasilkan poin ultra-padat (+16.500/jam).' },
    zh: { name: '分子种子压榨机', description: '原子级精密压榨机，产出超高密度积分（+16,500/小时）。' },
    th: { name: 'เครื่องอัดเมล็ดระดับโมเลกุล', description: 'เครื่องอัดความแม่นยำระดับอะตอมผลิตคะแนนหนาแน่นสูง (+16,500/ชม.)' },
    tr: { name: 'Moleküler Tohum Presi', description: 'Ultra yoğun puan geliri üreten atomik hassasiyetli pres (+16.500/sa).' },
    ru: { name: 'Молекулярный пресс', description: 'Сверхточный атомный пресс, создающий плотный поток очков (+16 500/ч).' },
  },
  auto_mini_drone: {
    vi: { name: 'Drone Tự Hành Mini', description: 'Liên tục trinh sát và thu gom điểm ngoại tuyến (+1.600/giờ).' },
    id: { name: 'Drone Mini Otonom', description: 'Terus memantau dan mengumpulkan poin offline (+1.600/jam).' },
    zh: { name: '自主微型无人机', description: '持续侦察并自动收集离线积分（+1,600/小时）。' },
    th: { name: 'มินิโดรนอัตโนมัติ', description: 'ออกลาดตระเวนและเก็บเกี่ยวคะแนนออฟไลน์ต่อเนื่อง (+1,600/ชม.)' },
    tr: { name: 'Otonom Mini Drone', description: 'Çevrimdışı puanları sürekli tarar ve toplar (+1.600/sa).' },
    ru: { name: 'Автономный мини-дрон', description: 'Непрерывно ищет и собирает оффлайн-очки (+1 600/ч).' },
  },
  auto_magnetic_hopper: {
    vi: { name: 'Phễu Hút Hạt Từ Tính', description: 'Tự động hút các hạt điểm trôi nổi vào số dư của bạn (+3.800/giờ).' },
    id: { name: 'Penampung Biji Ek Magnetik', description: 'Menarik partikel poin yang berkeliaran langsung ke saldomu (+3.800/jam).' },
    zh: { name: '磁力橡果收集斗', description: '自动将游离的积分粒子吸入你的账户余额（+3,800/小时）。' },
    th: { name: 'กรวยดูดลูกโอ๊กแม่เหล็ก', description: 'ดึงอนุภาคคะแนนที่ลอยอยู่เข้าสู่ยอดคงเหลือของคุณอัตโนมัติ (+3,800/ชม.)' },
    tr: { name: 'Manyetik Palamut Hunisi', description: 'Dolaşan puan parçacıklarını otomatik olarak bakiyene çeker (+3.800/sa).' },
    ru: { name: 'Магнитный бункер желудей', description: 'Автоматически притягивает блуждающие частицы очков (+3 800/ч).' },
  },
  auto_ai_sorting_bot: {
    vi: { name: 'Robot Phân Loại AI', description: 'Robot mạng nơ-ron tối ưu hóa dòng chảy điểm số (+8.900/giờ).' },
    id: { name: 'Robot Penyortir AI', description: 'Bot jaringan saraf yang mengoptimalkan aliran poin (+8.900/jam).' },
    zh: { name: 'AI 智能分拣机器人', description: '利用神经网络优化积分产出的智能机器人（+8,900/小时）。' },
    th: { name: 'หุ่นยนต์คัดแยก AI', description: 'บอทโครงข่ายประสาทที่ปรับปรุงการไหลเวียนคะแนน (+8,900/ชม.)' },
    tr: { name: 'Yapay Zeka Ayıklama Robotu', description: 'Puan akışını optimize eden sinir ağı robotu (+8.900/sa).' },
    ru: { name: 'ИИ-робот сортировщик', description: 'Нейросетевой бот, оптимизирующий поток очков (+8 900/ч).' },
  },
  core_fusion_cell: {
    vi: { name: 'Lõi Nhiệt Hạch Siêu Nhỏ', description: 'Tăng hiệu suất toàn bộ cơ sở sản xuất thụ động thêm +5%.' },
    id: { name: 'Inti Fusi Mikro', description: 'Meningkatkan semua fasilitas produksi pasif secara global sebesar +5%.' },
    zh: { name: '微型聚变核心', description: '全局提升所有被动生产设施效率 +5%。' },
    th: { name: 'แกนฟิวชันขนาดจิ๋ว', description: 'เพิ่มผลผลิตของระบบการผลิตอัตโนมัติทั้งหมด +5%' },
    tr: { name: 'Mikro Füzyon Çekirdeği', description: 'Tüm pasif üretim tesislerini küresel olarak +%5 güçlendirir.' },
    ru: { name: 'Микро-термоядерное ядро', description: 'Усиливает все пассивные фабрики глобально на +5%.' },
  },
  core_superconductor: {
    vi: { name: 'Ma Trận Siêu Dẫn', description: 'Truyền tải điện không điện trở tăng sản lượng toàn cầu +7%.' },
    id: { name: 'Matriks Superkonduktor', description: 'Transfer daya tanpa hambatan yang meningkatkan produksi global +7%.' },
    zh: { name: '超导能量矩阵', description: '零电阻能量传输，使全球积分产出提高 +7%。' },
    th: { name: 'เมทริกซ์ตัวนำยิ่งยวด', description: 'การส่งพลังงานไร้แรงต้านเพิ่มผลผลิตรวม +7%' },
    tr: { name: 'Süper İletken Matrisi', description: 'Sıfır dirençli enerji aktarımıyla küresel üretimi +%7 artırır.' },
    ru: { name: 'Матрица сверхпроводников', description: 'Передача энергии без потерь увеличивает доход на +7%.' },
  },
  core_dyson_collector: {
    vi: { name: 'Bộ Thu Quần Thể Dyson', description: 'Khai thác năng lượng sao tăng sản lượng toàn cầu +10%.' },
    id: { name: 'Pemanen Kawanan Dyson', description: 'Memanfaatkan energi bintang untuk meningkatkan output poin global +10%.' },
    zh: { name: '戴森云采集器', description: '汲取恒星能量，将全球积分输出提高 +10%。' },
    th: { name: 'ตัวเก็บเกี่ยวฝูงไดสัน', description: 'ควบคุมพลังงานดวงดาวเพิ่มผลผลิตคะแนนรวม +10%' },
    tr: { name: 'Dyson Sürüsü Toplayıcısı', description: 'Küresel puan çıktısını +%10 artırmak için yıldız enerjisinden yararlanır.' },
    ru: { name: 'Сборщик роя Дайсона', description: 'Использует энергию звёзд для роста глобального дохода на +10%.' },
  },
  mach_antimatter_synth: {
    vi: { name: 'Máy Tổng Hợp Phản Vật Chất', description: 'Chuyển hóa trực tiếp vật chất thành năng lượng tạo +45.000/giờ.' },
    id: { name: 'Penyintesis Poin Antimateri', description: 'Konversi materi-ke-energi langsung yang menghasilkan +45.000/jam.' },
    zh: { name: '反物质积分合成器', description: '直接将物质转化为能量，产出 +45,000/小时。' },
    th: { name: 'เครื่องสังเคราะห์คะแนนปฏิสสาร', description: 'แปลงสสารเป็นพลังงานโดยตรง สร้างรายได้ +45,000/ชม.' },
    tr: { name: 'Antimadde Puan Sentezleyici', description: 'Doğrudan madde-enerji dönüşümü ile +45.000/sa üretir.' },
    ru: { name: 'Синтезатор антиматерии', description: 'Прямое преобразование материи в энергию (+45 000/ч).' },
  },
  core_singularity_engine: {
    vi: { name: 'Lõi Sản Xuất Điểm Kỳ Dị', description: 'Khai thác lực hấp dẫn hố đen mini (+12% sản lượng toàn cầu).' },
    id: { name: 'Inti Produksi Singularitas', description: 'Memanfaatkan energi gravitasi lubang hitam mini (+12% hasil global).' },
    zh: { name: '奇点生产核心', description: '驾驭微型黑洞引力能量（+12% 全局收益）。' },
    th: { name: 'แกนผลิตภาวะเอกฐาน', description: 'ควบคุมพลังงานแรงโน้มถ่วงจากหลุมดำจิ๋ว (+12% ผลผลิตรวม)' },
    tr: { name: 'Tekillik Üretim Çekirdeği', description: 'Minyatür kara delik kütle çekim enerjisini kullanır (+%12 küresel gelir).' },
    ru: { name: 'Ядро сингулярности', description: 'Использует гравитацию мини-чёрной дыры (+12% к общему доходу).' },
  },

  // --- SECTION 3: ENERGY & TURBO ---
  energy_seeds_1: {
    vi: { name: 'Chế Độ Ăn Hạt Vàng', description: 'Mở rộng bể thể lực tối đa của Hamster (+200 năng lượng tối đa).' },
    id: { name: 'Diet Biji Emas', description: 'Memperluas kumpulan stamina maksimum Hamster (+200 energi maks).' },
    zh: { name: '金种子营养餐', description: '扩充仓鼠的最大体力上限（+200 最大能量）。' },
    th: { name: 'อาหารเมล็ดทองคำ', description: 'ขยายขีดจำกัดความอึดสูงสุดของแฮมสเตอร์ (+200 พลังงานสูงสุด)' },
    tr: { name: 'Altın Tohum Diyeti', description: 'Maksimum hamster dayanıklılık havuzunu genişletir (+200 maks enerji).' },
    ru: { name: 'Диета из золотых семян', description: 'Увеличивает максимальный запас выносливости хомяка (+200 макс. энергии).' },
  },
  energy_acorn_battery: {
    vi: { name: 'Pin Hạt Dẻ Mật Độ Cao', description: 'Lưu trữ điện hóa giúp mở rộng bể năng lượng (+350 năng lượng tối đa).' },
    id: { name: 'Baterai Biji Ek Berdensitas Tinggi', description: 'Penyimpanan elektrokimia yang memperluas energi (+350 energi maks).' },
    zh: { name: '高密度橡果电池', description: '电化学储能电池，扩大能量容量（+350 最大能量）。' },
    th: { name: 'แบตเตอรี่ลูกโอ๊กความหนาแน่นสูง', description: 'ระบบกักเก็บไฟฟ้าเคมีช่วยเพิ่มความจุพลังงาน (+350 พลังงานสูงสุด)' },
    tr: { name: 'Yüksek Yoğunluklu Palamut Pili', description: 'Enerji havuzunu genişleten elektrokimyasal depolama (+350 maks enerji).' },
    ru: { name: 'Батарея из желудей', description: 'Электрохимический накопитель, расширяющий запас сил (+350 макс. энергии).' },
  },
  energy_hyper_nest: {
    vi: { name: 'Tổ Siêu Tụ Điện', description: 'Chiếc tổ tích điện tĩnh cộng thêm +550 thể lực tối đa.' },
    id: { name: 'Sarang Hiper-Kapasitor', description: 'Sarang bermuatan elektrostatik yang menambah +550 stamina maks.' },
    zh: { name: '超级电容巢穴', description: '静电充能巢穴，增加 +550 最大体力。' },
    th: { name: 'รังตัวเก็บประจุยิ่งยวด', description: 'รังประจุไฟฟ้าสถิตเพิ่มความอึดสูงสุด +550' },
    tr: { name: 'Hiper-Kapasitör Yuvası', description: '+550 maks dayanıklılık ekleyen elektrostatik yüklü yuva.' },
    ru: { name: 'Гнездо с гиперконденсатором', description: 'Электростатическое гнездо: +550 к макс. энергии.' },
  },
  energy_graphene_cell: {
    vi: { name: 'Tế Bào Năng Lượng Graphene', description: 'Pin tấm carbon đơn lớp cộng thêm +800 năng lượng tối đa.' },
    id: { name: 'Sel Energi Grafena', description: 'Baterai lembaran karbon monolapis yang menambah +800 energi maks.' },
    zh: { name: '石墨烯能量电池', description: '单层碳纳米膜电池，增加 +800 最大能量。' },
    th: { name: 'เซลล์พลังงานกราฟีน', description: 'แบตเตอรี่แผ่นคาร์บอนชั้นเดียวเพิ่ม +800 พลังงานสูงสุด' },
    tr: { name: 'Grafen Enerji Hücresi', description: '+800 maks enerji ekleyen tek katmanlı karbon pil.' },
    ru: { name: 'Графеновая ячейка', description: 'Однослойная углеродная батарея (+800 макс. энергии).' },
  },
  energy_quantum_pack: {
    vi: { name: 'Bể Năng Lượng Lượng Tử', description: 'Bình vướng víu hạ nguyên tử cung cấp +1200 năng lượng tối đa.' },
    id: { name: 'Reservoir Energi Kuantum', description: 'Tangki belitan subatomik yang menyediakan +1200 energi maks.' },
    zh: { name: '量子能量储罐', description: '亚原子纠缠储罐，提供 +1200 最大能量。' },
    th: { name: 'ถังเก็บพลังงานควอนตัม', description: 'ถังพัวพันควอนตัมมอบ +1200 พลังงานสูงสุด' },
    tr: { name: 'Kuantum Enerji Rezervuarı', description: '+1200 maks enerji sağlayan atom altı dolanıklık tankı.' },
    ru: { name: 'Квантовый резервуар', description: 'Субатомный накопитель на основе запутанности (+1200 макс. энергии).' },
  },
  energy_dark_matter_pack: {
    vi: { name: 'Pin Thể Lực Vật Chất Tối', description: 'Vật chất hư không sâu thẳm cộng thêm +1800 năng lượng tối đa.' },
    id: { name: 'Sel Stamina Materi Gelap', description: 'Materi non-baryonik ruang hampa dalam yang menambah +1800 energi maks.' },
    zh: { name: '暗物质耐力电池', description: '深空暗物质核心，额外提供 +1800 最大能量。' },
    th: { name: 'เซลล์ความอึดสสารมืด', description: 'สสารมืดจากห้วงอวกาศเพิ่ม +1800 พลังงานสูงสุด' },
    tr: { name: 'Karanlık Madde Dayanıklılık Hücresi', description: '+1800 maks enerji ekleyen derin uzay karanlık maddesi.' },
    ru: { name: 'Ячейка тёмной материи', description: 'Энергия глубокого космоса (+1800 макс. энергии).' },
  },
  energy_cosmic_matrix: {
    vi: { name: 'Ma Trận Năng Lượng Vũ Trụ', description: 'Ma trận tinh tú vô tận mở rộng +2800 năng lượng tối đa.' },
    id: { name: 'Matriks Energi Kosmik', description: 'Matriks bintang tak terbatas yang memperluas kapasitas +2800 energi maks.' },
    zh: { name: '宇宙能量矩阵', description: '无限星辰矩阵，扩充 +2800 最大能量容量。' },
    th: { name: 'เมทริกซ์พลังงานจักรวาล', description: 'เมทริกซ์แห่งดวงดาวขยายความจุ +2800 พลังงานสูงสุด' },
    tr: { name: 'Kozmik Enerji Matrisi', description: 'Kapasiteyi +2800 maks enerji artıran sonsuz yıldız matrisi.' },
    ru: { name: 'Космическая матрица энергии', description: 'Бесконечная звёздная матрица (+2800 макс. энергии).' },
  },
  caffeine_nut: {
    vi: { name: 'Hướng Dương Caffeine', description: 'Sạc nhanh tốc độ hồi phục thể lực mỗi giây (+1.0/giây).' },
    id: { name: 'Bunga Matahari Kafein', description: 'Mengisi ulang pemulihan stamina dengan cepat setiap detik (+1.0/detik).' },
    zh: { name: '咖啡因向日葵', description: '每秒快速恢复体力（+1.0/秒）。' },
    th: { name: 'เมล็ดทานตะวันคาเฟอีน', description: 'ฟื้นฟูพลังงานอย่างรวดเร็วทุกวินาที (+1.0/วินาที)' },
    tr: { name: 'Kafeinli Ayçiçeği', description: 'Her saniye dayanıklılık yenilenmesini hızlandırır (+1.0/sn).' },
    ru: { name: 'Кофеиновый подсолнух', description: 'Ускоряет восстановление энергии каждую секунду (+1.0/с).' },
  },
  energy_electrolyte_bottle: {
    vi: { name: 'Bình Nước Điện Giải', description: 'Nước bổ sung khoáng chất tăng tốc độ hồi năng lượng (+1.8/giây).' },
    id: { name: 'Botol Hidro Elektrolit', description: 'Air mineral terfortifikasi yang mempercepat pengisian ulang (+1.8/detik).' },
    zh: { name: '电解质能量水壶', description: '强化矿物质饮水，提升能量恢复速度（+1.8/秒）。' },
    th: { name: 'ขวดน้ำเกลือแร่อิเล็กโทรไลต์', description: 'น้ำแร่เสริมพลังช่วยเร่งการชาร์จพลังงาน (+1.8/วินาที)' },
    tr: { name: 'Elektrolit Hidro Şişesi', description: 'Şarj hızını artıran mineral destekli su (+1.8/sn).' },
    ru: { name: 'Бутылка с электролитами', description: 'Минеральная вода для быстрой подзарядки (+1.8/с).' },
  },
  energy_thermal_bed: {
    vi: { name: 'Tổ Hồi Phục Nhiệt Sinh Học', description: 'Phục hồi thể lực trong hơi ấm sinh học dễ chịu (+3.0/giây).' },
    id: { name: 'Sarang Pemulihan Termal', description: 'Memulihkan stamina dalam kehangatan bio-termal yang nyaman (+3.0/detik).' },
    zh: { name: '生物热能恢复巢', description: '在舒适的生物恒温窝中快速恢复体力（+3.0/秒）。' },
    th: { name: 'รังฟื้นฟูความร้อนชีวภาพ', description: 'ฟื้นฟูความอึดในความอบอุ่นสบาย (+3.0/วินาที)' },
    tr: { name: 'Termal İyileşme Yuvası', description: 'Rahat biyo-termal sıcaklıkta dayanıklılığı yeniler (+3.0/sn).' },
    ru: { name: 'Термальное гнездо', description: 'Восстанавливает силы в уютном био-тепле (+3.0/с).' },
  },
  energy_cryo_chamber: {
    vi: { name: 'Khoang Phục Hồi Đông Lạnh', description: 'Buồng làm lạnh sâu tái tạo cơ bắp tức thì (+5.0/giây).' },
    id: { name: 'Kapsul Pemulihan Krio', description: 'Kapsul pendingin super yang meremajakan serat otot (+5.0/detik).' },
    zh: { name: '低温冷冻恢复舱', description: '超低温恢复舱，极速焕活肌肉纤维（+5.0/秒）。' },
    th: { name: 'ห้องฟื้นฟูความเย็นยิ่งยวด', description: 'แคปซูลความเย็นฟื้นฟูกล้ามเนื้อทันที (+5.0/วินาที)' },
    tr: { name: 'Kriyo İyileşme Odası', description: 'Kas liflerini canlandıran süper soğutmalı kapsül (+5.0/sn).' },
    ru: { name: 'Криокамера восстановления', description: 'Охлаждаемая капсула для мгновенного восстановления (+5.0/с).' },
  },
  energy_bio_nano_serum: {
    vi: { name: 'Huyết Thanh Sinh Học Nano', description: 'Hạt nano tự động sửa chữa và nạp lại thể lực (+7.5/giây).' },
    id: { name: 'Serum Vitalitas Bio-Nano', description: 'Nanite otomatis memperbaiki dan mengisi ulang stamina (+7.5/detik).' },
    zh: { name: '生物纳米活力血清', description: '纳米机器人自动修复并补充体力（+7.5/秒）。' },
    th: { name: 'เซรั่มฟื้นพลังไบโอนาโน', description: 'นาโนบอทซ่อมแซมและเติมความอึดอัตโนมัติ (+7.5/วินาที)' },
    tr: { name: 'Biyo-Nano Canlılık Serumu', description: 'Nanitler dayanıklılığı otomatik olarak onarır ve doldurur (+7.5/sn).' },
    ru: { name: 'Био-нано сыворотка', description: 'Наниты автоматически восстанавливают запас сил (+7.5/с).' },
  },
  energy_chrono_restorer: {
    vi: { name: 'Bộ Hồi Thể Lực Thời Gian', description: 'Uốn cong trường thời gian quanh tổ để sạc nhanh như chớp (+11.0/giây).' },
    id: { name: 'Pemulih Stamina Krono', description: 'Membengkokkan medan waktu di sekitar sarang untuk regenerasi kilat (+11.0/detik).' },
    zh: { name: '时空体力重置仪', description: '弯曲巢穴周围的局部时间场，实现闪电般回能（+11.0/秒）。' },
    th: { name: 'เครื่องฟื้นพลังข้ามเวลา', description: 'บิดเบือนสนามเวลารอบรังเพื่อชาร์จพลังเร็วปานสายฟ้า (+11.0/วินาที)' },
    tr: { name: 'Krono-Dayanıklılık Yükleyici', description: 'Yıldırım hızında yenilenme için yuva çevresinde zamanı büker (+11.0/sn).' },
    ru: { name: 'Хроно-восстановитель', description: 'Искривляет время вокруг гнезда для молниеносной регенерации (+11.0/с).' },
  },
  turbo_overclock_gear: {
    vi: { name: 'Hộp Số Ép Xung', description: 'Kéo dài thời gian tăng tốc turbo thêm +10 giây.' },
    id: { name: 'Girboks Overclock', description: 'Memperpanjang durasi booster turbo sebesar +10 detik.' },
    zh: { name: '超频变速箱', description: '将涡轮加速持续时间延长 +10 秒。' },
    th: { name: 'ชุดเกียร์โอเวอร์คล็อก', description: 'ขยายระยะเวลาเทอร์โบบูสต์เพิ่มขึ้น +10 วินาที' },
    tr: { name: 'Hız Aşırtmalı Şanzıman', description: 'Turbo güçlendirici süresini +10 saniye uzatır.' },
    ru: { name: 'Разогнанная коробка передач', description: 'Продлевает действие турбо-бустера на +10 секунд.' },
  },
  turbo_nitro_acorn: {
    vi: { name: 'Nhiên Liệu Hạt Dẻ Nitro', description: 'Thức ăn tẩm nitro cộng thêm +15 giây cho các bộ tăng tốc đang chạy.' },
    id: { name: 'Bahan Bakar Biji Ek Nitro', description: 'Pakan infus nitro yang menambah +15 detik pada booster aktif.' },
    zh: { name: '氮气橡果燃料', description: '注入氮气的高能饲料，为激活中的加速器增加 +15 秒。' },
    th: { name: 'เชื้อเพลิงลูกโอ๊กไนโตร', description: 'เชื้อเพลิงไนโตรเพิ่มเวลาบูสเตอร์ +15 วินาที' },
    tr: { name: 'Nitro Palamut Yakıtı', description: 'Aktif güçlendiricilere +15 saniye ekleyen nitro takviyeli yem.' },
    ru: { name: 'Нитро-жёлудевое топливо', description: 'Добавляет +15 секунд к времени активных бустеров.' },
  },
  turbo_flywheel: {
    vi: { name: 'Bánh Đà Động Lực', description: 'Lưu trữ động lượng quay cộng thêm +20 giây thời gian tăng tốc.' },
    id: { name: 'Roda Gila Kinetik', description: 'Menyimpan momentum putaran dan menambah +20 detik waktu boost.' },
    zh: { name: '动能飞轮', description: '储存旋转动量，增加 +20 秒加速时间。' },
    th: { name: 'ฟลายวีลพลังงานจลน์', description: 'กักเก็บโมเมนตัมการหมุนเพิ่มเวลาบูสต์ +20 วินาที' },
    tr: { name: 'Kinetik Volan', description: 'Güçlendirme süresine +20 saniye ekleyen dönme momentumu depolar.' },
    ru: { name: 'Кинетический маховик', description: 'Накапливает момент вращения, добавляя +20 секунд буста.' },
  },
  turbo_hyper_injector: {
    vi: { name: 'Kim Phun Siêu Tốc', description: 'Phun nhiên liệu tăng áp trực tiếp cộng thêm +25 giây.' },
    id: { name: 'Injektor Hiper-Drive', description: 'Injeksi booster oktan tinggi langsung yang menambah durasi +25 detik.' },
    zh: { name: '超驱动喷射器', description: '高辛烷值直喷推进系统，增加 +25 秒持续时间。' },
    th: { name: 'หัวฉีดไฮเปอร์ไดรฟ์', description: 'ฉีดเชื้อเพลิงแรงดันสูงเพิ่มเวลาบูสต์ +25 วินาที' },
    tr: { name: 'Hiper-Sürüş Enjektörü', description: '+25 sn süre ekleyen doğrudan yüksek oktanlı enjeksiyon.' },
    ru: { name: 'Гипер-инжектор', description: 'Прямой впрыск высокооктанового буста (+25 с к длительности).' },
  },
  turbo_plasma_burst: {
    vi: { name: 'Tụ Phóng Xung Plasma', description: 'Xả tụ điện cao áp cộng thêm +30 giây thời gian tăng tốc.' },
    id: { name: 'Kapasitor Ledakan Plasma', description: 'Pelepasan kapasitor tegangan tinggi yang menambah +30 detik waktu boost.' },
    zh: { name: '等离子爆裂电容器', description: '高压电容放电，增加 +30 秒加速时间。' },
    th: { name: 'ตัวเก็บประจุพลาสมาเบิร์สต์', description: 'คายประจุแรงสูงเพิ่มเวลาบูสต์ +30 วินาที' },
    tr: { name: 'Plazma Patlama Kapasitörü', description: '+30 sn güçlendirme süresi ekleyen yüksek voltajlı deşarj.' },
    ru: { name: 'Плазменный конденсатор', description: 'Высоковольтный разряд продлевает буст на +30 секунд.' },
  },
  turbo_warp_conduit: {
    vi: { name: 'Ống Dẫn Bước Nhảy Không Gian', description: 'Đường ống xuyên không kéo dài thời gian tăng tốc thêm +40 giây.' },
    id: { name: 'Saluran Kecepatan Warp', description: 'Saluran warp antarbintang yang memperpanjang durasi boost +40 detik.' },
    zh: { name: '曲速能量导管', description: '星际曲速导管，将加速持续时间延长 +40 秒。' },
    th: { name: 'ท่อส่งความเร็ววาร์ป', description: 'ท่อวาร์ประหว่างดวงดาวขยายระยะเวลาบูสต์ +40 วินาที' },
    tr: { name: 'Büküm Hızı Kanalı', description: 'Güçlendirme süresini +40 sn uzatan yıldızlararası büküm kanalı.' },
    ru: { name: 'Варп-канал скорости', description: 'Межзвёздный варп-канал, продлевающий буст на +40 секунд.' },
  },
  energy_eternal_core: {
    vi: { name: 'Lò Phản Ứng Thể Lực Vĩnh Cửu', description: 'Bộ nạp thể lực vĩnh cửu không giới hạn (+18.0/giây).' },
    id: { name: 'Reaktor Stamina Abadi', description: 'Pengisi ulang stamina abadi tanpa batas (+18.0/detik).' },
    zh: { name: '永恒耐力反应堆', description: '永动级无限体力恢复核心（+18.0/秒）。' },
    th: { name: 'เตาปฏิกรณ์ความอึดนิรันดร์', description: 'ตัวเติมพลังงานไร้ขีดจำกัดตลอดกาล (+18.0/วินาที)' },
    tr: { name: 'Ebedi Dayanıklılık Reaktörü', description: 'Sınırsız sürekli dayanıklılık yükleyici (+18.0/sn).' },
    ru: { name: 'Вечный реактор выносливости', description: 'Бесконечный генератор восстановления сил (+18.0/с).' },
  },

  // --- SECTION 4: SPECIAL LAB ---
  royal_crown: {
    vi: { name: 'Vương Miện Pi Hoàng Gia', description: 'Phong vương cho Hamster để nhận +350/giây và trang phục Vua.' },
    id: { name: 'Mahkota Kerajaan Pi', description: 'Nobatkan hamstermu sebagai raja, dapatkan +350/detik dan Skin Raja.' },
    zh: { name: '皇家 Pi 王冠', description: '加冕仓鼠为王，获得 +350/秒 收益并解锁国王外观。' },
    th: { name: 'มงกุฎ Pi แห่งราชวงศ์', description: 'สถาปนาแฮมสเตอร์เป็นราชา รับ +350/วินาที และสกินราชา' },
    tr: { name: 'Kraliyet Pi Tacı', description: 'Hamster’ını kral ilan et, +350/sn gelir ve Kral Kostümü kazan.' },
    ru: { name: 'Королевская корона Pi', description: 'Коронуйте хомяка: +350/с дохода и скин Короля.' },
  },
  cyber_visor: {
    vi: { name: 'Kính Cyberpunk', description: 'Mở khóa trang phục Cyber tương lai và +35 sức chạm.' },
    id: { name: 'Visor Cyberpunk', description: 'Buka skin hamster siber futuristik dan +35 kekuatan tap.' },
    zh: { name: '赛博朋克护目镜', description: '解锁未来赛博仓鼠外观与 +35 点击威力。' },
    th: { name: 'แว่นไซเบอร์พังก์', description: 'ปลดล็อกสกินแฮมสเตอร์ไซเบอร์สุดล้ำและ +35 พลังแตะ' },
    tr: { name: 'Siberpunk Vizörü', description: 'Fütüristik siber hamster kostümünü ve +35 dokunuş gücünü aç.' },
    ru: { name: 'Киберпанк-визор', description: 'Открывает футуристический скин и даёт +35 к силе клика.' },
  },
  quantum_lab: {
    vi: { name: 'Phòng Thí Nghiệm Lượng Tử', description: 'Vật lý lượng tử tạo ra lượng điểm khổng lồ (+2800/giây).' },
    id: { name: 'Lab Hamster Kuantum', description: 'Fisika kuantum menghasilkan poin besar-besaran (+2800/detik).' },
    zh: { name: '量子仓鼠实验室', description: '前沿量子物理实验产出海量积分（+2800/秒）。' },
    th: { name: 'ห้องแล็บแฮมสเตอร์ควอนตัม', description: 'ฟิสิกส์ควอนตัมผลิตคะแนนมหาศาล (+2800/วินาที)' },
    tr: { name: 'Kuantum Hamster Laboratuvarı', description: 'Devasa puan geliri üreten kuantum fiziği (+2800/sn).' },
    ru: { name: 'Квантовая лаборатория', description: 'Квантовая физика генерирует огромный поток очков (+2800/с).' },
  },
  lab_antimatter_collider: {
    vi: { name: 'Máy Gia Tốc Hạt Phản Vật Chất', description: 'Va chạm chùm hạt tương đối tính tạo sản lượng dày đặc (+6500/giây).' },
    id: { name: 'Penumbuk Biji Ek Antimateri', description: 'Menabrakkan berkas partikel relativistik menjadi hasil padat (+6500/detik).' },
    zh: { name: '反物质橡果对撞机', description: '高能粒子束对撞产生高密度积分收益（+6500/秒）。' },
    th: { name: 'เครื่องชนอนุภาคปฏิสสาร', description: 'ชนลำอนุภาคสัมพัทธภาพสร้างผลผลิตหนาแน่น (+6500/วินาที)' },
    tr: { name: 'Antimadde Palamut Çarpıştırıcısı', description: 'Göreceli parçacık demetlerini çarpıştırarak yoğun gelir üretir (+6500/sn).' },
    ru: { name: 'Коллайдер антиматерии', description: 'Сталкивает пучки частиц, создавая колоссальный доход (+6500/с).' },
  },
  lab_dimensional_portal: {
    vi: { name: 'Cổng Hút Khe Nứt Không Gian', description: 'Khai thác vũ trụ song song để rút điểm thuần khiết (+14000/giây).' },
    id: { name: 'Penyedot Celah Dimensi', description: 'Menyadap alam semesta paralel untuk menyedot poin murni (+14000/detik).' },
    zh: { name: '维度裂隙虹吸器', description: '连接平行宇宙，源源不断汲取纯净积分（+14000/秒）。' },
    th: { name: 'ช่องดูดรอยแยกมิติ', description: 'เชื่อมต่อจักรวาลคู่ขนานเพื่อดูดคะแนนบริสุทธิ์ (+14000/วินาที)' },
    tr: { name: 'Boyutsal Yarık Sifonu', description: 'Saf puan çekmek için paralel evrenlere bağlanır (+14000/sn).' },
    ru: { name: 'Портал межпространственного разлома', description: 'Выкачивает чистые очки из параллельных вселенных (+14000/с).' },
  },
  lab_chrono_accelerator: {
    vi: { name: 'Máy Gia Tốc Thời Gian', description: 'Tăng tốc không-thời gian cục bộ tạo +28000 điểm/giây.' },
    id: { name: 'Akselerator Krono-Waktu', description: 'Mempercepat ruang-waktu lokal untuk menghasilkan +28000 poin/detik.' },
    zh: { name: '时空加速器', description: '加速局部时空流速，每秒产出 +28000 积分。' },
    th: { name: 'เครื่องเร่งกาลอวกาศ', description: 'เร่งความเร็วกาลอวกาศเฉพาะจุดเพื่อผลิต +28000 คะแนน/วินาที' },
    tr: { name: 'Krono-Zaman Hızlandırıcısı', description: 'Yerel uzay-zamanı hızlandırarak +28000 puan/sn üretir.' },
    ru: { name: 'Хроно-ускоритель времени', description: 'Ускоряет локальное пространство-время для добычи +28000 очков/с.' },
  },
  lab_omega_synthesizer: {
    vi: { name: 'Máy Tổng Hợp Thực Tại Omega', description: 'Biến đổi quy luật vật lý để sản xuất điểm vô hạn (+55000/giây).' },
    id: { name: 'Penyintesis Realitas Omega', description: 'Mengubah hukum fisika untuk memproduksi poin tanpa batas (+55000/detik).' },
    zh: { name: '欧米茄现实合成器', description: '改写物理法则，制造无限积分（+55000/秒）。' },
    th: { name: 'เครื่องสังเคราะห์ความจริงโอเมก้า', description: 'ดัดแปลงกฎฟิสิกส์เพื่อสร้างคะแนนไร้ขีดจำกัด (+55000/วินาที)' },
    tr: { name: 'Omega Gerçeklik Sentezleyicisi', description: 'Sınırsız puan üretmek için fizik yasalarını değiştirir (+55000/sn).' },
    ru: { name: 'Синтезатор реальности Омега', description: 'Меняет законы физики для безграничной генерации (+55000/с).' },
  },
  seeds_acorn_tree: {
    vi: { name: 'Vườn Ươm Hạt Vàng', description: 'Nuôi dưỡng hạt vàng quý hiếm để tăng sức nâng cấp (+1 hạt thưởng).' },
    id: { name: 'Kebun Biji Emas', description: 'Merawat biji emas langka untuk boost bernilai tinggi (+1 bonus biji).' },
    zh: { name: '金种子果园', description: '培育珍稀金种子，提供强力加成（+1 种子奖励）。' },
    th: { name: 'สวนเมล็ดทองคำ', description: 'เพาะเลี้ยงเมล็ดทองคำหายากเพื่อการอัปเกรดขั้นสูง (+1 เมล็ด)' },
    tr: { name: 'Altın Tohum Bahçesi', description: 'Yüksek değerli güçlendirmeler için nadir altın tohumlar yetiştirir (+1 tohum).' },
    ru: { name: 'Сад золотых семян', description: 'Выращивает редкие золотые семена для мощных бустов (+1 семя).' },
  },
  seeds_forager_whistle: {
    vi: { name: 'Còi Trinh Sát Hạt Vàng', description: 'Triệu hồi đội sóc trinh sát mang về thêm hạt vàng.' },
    id: { name: 'Peluit Pencari Emas', description: 'Memanggil pengintai tupai emas yang membawa biji tambahan.' },
    zh: { name: '黄金采集者哨笛', description: '召唤黄金松鼠侦察兵带回更多金种子。' },
    th: { name: 'นกหวีดนักหาเมล็ดทองคำ', description: 'เรียกลูกเสือกระรอกทองคำให้นำเมล็ดเพิ่มกลับมา' },
    tr: { name: 'Altın Toplayıcı Düdüğü', description: 'Ekstra tohum getiren altın sincap gözcülerini çağırır.' },
    ru: { name: 'Свисток золотого собирателя', description: 'Призывает белок-разведчиков, приносящих дополнительные семена.' },
  },
  seeds_sacred_altar: {
    vi: { name: 'Đền Thờ Hạt Dẻ Linh Thiêng', description: 'Bàn thờ cổ được các trưởng lão Hamster ban phước tặng +2 hạt.' },
    id: { name: 'Kuil Biji Ek Suci', description: 'Altar kuno yang diberkati para tetua hamster memberi +2 biji.' },
    zh: { name: '神圣橡果祭坛', description: '受先祖仓鼠祝福的古老祭坛，额外奖励 +2 金种子。' },
    th: { name: 'วิหารลูกโอ๊กศักดิ์สิทธิ์', description: 'แท่นบูชาโบราณที่ได้รับพรจากบรรพบุรุษแฮมสเตอร์ มอบ +2 เมล็ด' },
    tr: { name: 'Kutsal Palamut Tapınağı', description: 'Kadim hamsterlar tarafından kutsanmış +2 tohum veren sunak.' },
    ru: { name: 'Священное святилище желудя', description: 'Древний алтарь, благословлённый старейшинами (+2 семени).' },
  },
  seeds_alchemy_pot: {
    vi: { name: 'Nồi Luyện Kim Hạt Vàng', description: 'Chuyển hóa điểm thô thành hạt vàng tinh thể (+2 hạt).' },
    id: { name: 'Wadah Alkimia', description: 'Mengubah poin mentah menjadi biji emas kristal (+2 biji).' },
    zh: { name: '炼金坩埚', description: '将原始积分炼化为晶莹剔透的金种子（+2 金种子）。' },
    th: { name: 'เบ้าหลอมเล่นแร่แปรธาตุ', description: 'แปรสภาพคะแนนดิบเป็นผลึกเมล็ดทองคำ (+2 เมล็ด)' },
    tr: { name: 'Simya Potası', description: 'Ham puanları kristal altın tohumlara dönüştürür (+2 tohum).' },
    ru: { name: 'Алхимический тигель', description: 'Превращает очки в кристаллические золотые семена (+2 семени).' },
  },
  seeds_celestial_grove: {
    vi: { name: 'Khu Rừng Vàng Thiên Giới', description: 'Khu rừng thần thoại cho sản lượng hạt vàng dồi dào (+3 hạt).' },
    id: { name: 'Hutan Emas Surgawi', description: 'Hutan kosmik mitis yang menghasilkan banyak biji emas (+3 biji).' },
    zh: { name: '天界黄金圣林', description: '神话般的宇宙圣林，源源不断出产金种子（+3 金种子）。' },
    th: { name: 'ป่าทองคำแห่งสวรรค์', description: 'ป่าจักรวาลในตำนานที่ให้ผลผลิตเมล็ดทองคำมหาศาล (+3 เมล็ด)' },
    tr: { name: 'Göksel Altın Korusu', description: 'Bol miktarda altın tohum veren efsanevi kozmik koru (+3 tohum).' },
    ru: { name: 'Небесная золотая роща', description: 'Мифическая космическая роща, дарящая обилие семян (+3 семени).' },
  },
  reactor_cosmic_dice: {
    vi: { name: 'Lò Xác Suất Vũ Trụ', description: 'Kích hoạt các đợt bùng nổ điểm vàng 5x bất ngờ khi chạm.' },
    id: { name: 'Reaktor Probabilitas Kosmik', description: 'Memicu ledakan poin emas 5x kejutan selama ketukan aktif.' },
    zh: { name: '宇宙概率反应堆', description: '在主动点击时触发惊喜 5 倍黄金积分爆发。' },
    th: { name: 'เตาปฏิกรณ์ความน่าจะเป็นจักรวาล', description: 'กระตุ้นการระเบิดคะแนนทองคำ 5x แบบสุ่มขณะแตะ' },
    tr: { name: 'Kozmik Olasılık Reaktörü', description: 'Aktif dokunuş sırasında sürpriz 5x altın puan patlamalarını tetikler.' },
    ru: { name: 'Космический реактор шанса', description: 'Вызывает внезапные 5x всплески золотых очков при кликах.' },
  },
  reactor_quantum_flux: {
    vi: { name: 'Máy Phát Thông Lượng Lượng Tử', description: 'Tạo thác năng lượng hạ nguyên tử tự phát trao điểm thưởng.' },
    id: { name: 'Generator Fluks Kuantum', description: 'Menciptakan kaskade energi subatomik spontan yang memberi poin.' },
    zh: { name: '量子通量发生器', description: '自发产生亚原子能量瀑布，送出意外积分奖励。' },
    th: { name: 'เครื่องกำเนิดฟลักซ์ควอนตัม', description: 'สร้างน้ำตกพลังงานระดับควอนตัมมอบคะแนนโบนัส' },
    tr: { name: 'Kuantum Akı Jeneratörü', description: 'Puan kazandıran kendiliğinden atom altı enerji şelaleleri üretir.' },
    ru: { name: 'Генератор квантового потока', description: 'Создаёт спонтанные каскады энергии с бонусными очками.' },
  },
  reactor_chaos_engine: {
    vi: { name: 'Động Cơ Entropy Hỗn Mang', description: 'Biến sự hỗn loạn xung quanh thành làn sóng thưởng khổng lồ 10x.' },
    id: { name: 'Mesin Entropi Kekacauan', description: 'Mengubah kekacauan sekitar menjadi lonjakan hadiah besar 10x.' },
    zh: { name: '混沌熵增引擎', description: '将周围的混沌能量转化为惊人的 10 倍奖励浪潮。' },
    th: { name: 'เครื่องยนต์เอนโทรปีโกลาหล', description: 'เปลี่ยนความโกลาหลรอบตัวเป็นคลื่นรางวัล 10x มหาศาล' },
    tr: { name: 'Kaos Entropi Motoru', description: 'Ortam kaosunu devasa 10x ödül dalgalarına dönüştürür.' },
    ru: { name: 'Двигатель энтропии хаоса', description: 'Превращает хаос в мощные 10x волны наград.' },
  },
  reactor_supernova_spark: {
    vi: { name: 'Buồng Tia Lửa Siêu Tân Tinh', description: 'Giải phóng vụ nổ tinh tú mang lại lượng điểm bùng nổ khổng lồ.' },
    id: { name: 'Ruang Percikan Supernova', description: 'Melepaskan ledakan bintang yang menghasilkan ledakan poin raksasa.' },
    zh: { name: '超新星火花室', description: '释放恒星爆发能量，带来海量积分暴击。' },
    th: { name: 'ห้องประกายซูเปอร์โนวา', description: 'ปลดปล่อยการระเบิดของดวงดาวมอบคะแนนมหาศาล' },
    tr: { name: 'Süpernova Kıvılcım Odası', description: 'Devasa puan patlamaları sağlayan yıldız patlamaları başlatır.' },
    ru: { name: 'Камера сверхновой искры', description: 'Освобождает звёздные взрывы с колоссальными бонусами очков.' },
  },
  special_golden_halo: {
    vi: { name: 'Vòng Hào Quang Tiên Phong Vàng', description: 'Tỏa sáng uy nghi thiên thể tăng sản lượng thụ động (+1500/giây).' },
    id: { name: 'Halo Perintis Emas', description: 'Memancarkan keagungan surgawi untuk hasil pasif (+1500/detik).' },
    zh: { name: '金色先锋光环', description: '散发神圣光辉，提升被动收益（+1500/秒）。' },
    th: { name: 'วงแหวนรัศมีผู้บุกเบิกทองคำ', description: 'เปล่งประกายสง่างามเพิ่มรายได้อัตโนมัติ (+1500/วินาที)' },
    tr: { name: 'Altın Öncü Halesi', description: 'Pasif geliri artıran göksel ihtişam yayar (+1500/sn).' },
    ru: { name: 'Золотой нимб пионера', description: 'Излучает небесное величие, усиливая пассивный доход (+1500/с).' },
  },
  special_graviton_wheel: {
    vi: { name: 'Bánh Xe Điều Khiển Trọng Lực', description: 'Bẻ cong trọng lực giúp bánh xe quay không ma sát (+9000/giây).' },
    id: { name: 'Roda Manipulasi Graviton', description: 'Melengkungkan gravitasi untuk memutar roda tanpa hambatan (+9000/detik).' },
    zh: { name: '引力子操控滚轮', description: '扭曲重力使滚轮零阻力飞旋（+9000/秒）。' },
    th: { name: 'วงล้อควบคุมแรงโน้มถ่วง', description: 'บิดเบือนแรงโน้มถ่วงให้วงล้อหมุนไร้แรงต้าน (+9000/วินาที)' },
    tr: { name: 'Graviton Manipülasyon Çarkı', description: 'Çarkı sıfır dirençle döndürmek için yerçekimini büker (+9000/sn).' },
    ru: { name: 'Гравитонное колесо', description: 'Искривляет гравитацию для вращения без трения (+9000/с).' },
  },
  special_telepathic_beacon: {
    vi: { name: 'Đèn Hiệu Thần Giao Cách Cảm', description: 'Điều khiển từ xa hút các điểm ở xa về thẳng kho của bạn (+20000/giây).' },
    id: { name: 'Suar Poin Telepati', description: 'Memerintahkan poin jarak jauh masuk ke brankasmu secara telepati (+20000/detik).' },
    zh: { name: '心灵感应积分信标', description: '以心灵感应将远方积分直接汇聚入你的金库（+20000/秒）。' },
    th: { name: 'ประภาคารโทรจิตดึงคะแนน', description: 'สั่งการระยะไกลดึงคะแนนเข้าสู่คลังของคุณ (+20000/วินาที)' },
    tr: { name: 'Telepatik Puan Feneri', description: 'Uzak puanları telepatik olarak kasana çeker (+20000/sn).' },
    ru: { name: 'Телепатический маяк очков', description: 'Телепатически притягивает далёкие очки в хранилище (+20000/с).' },
  },
  special_infinity_core: {
    vi: { name: 'Chất Xúc Tác Pi Vô Cực', description: 'Cổ vật tối thượng cung cấp sức mạnh cho đỉnh cao đế chế Hamster (+45000/giây).' },
    id: { name: 'Katalis Pi Tak Terbatas', description: 'Artefak tertinggi yang menggerakkan puncak kerajaan hamster (+45000/detik).' },
    zh: { name: '无限 Pi 催化剂', description: '驱动仓鼠帝国巅峰实力的至高神器（+45000/秒）。' },
    th: { name: 'ตัวเร่งปฏิกิริยา Pi อนันต์', description: 'วัตถุโบราณสูงสุดที่ขับเคลื่อนยอดอาณาจักรแฮมสเตอร์ (+45000/วินาที)' },
    tr: { name: 'Sonsuzluk Pi Katalizörü', description: 'Hamster imparatorluğunun zirvesini besleyen yüce eser (+45000/sn).' },
    ru: { name: 'Бесконечный катализатор Pi', description: 'Высший артефакт на вершине империи хомяков (+45000/с).' },
  },
};

export const getLocalizedUpgrade = (upgrade: UpgradeItem, language: Language) => {
  if (language === 'en') {
    return { name: upgrade.name, description: upgrade.description };
  }
  if (language === 'ar') {
    return { name: upgrade.nameAr, description: upgrade.descriptionAr };
  }
  const entry = UPGRADE_TRANSLATIONS[upgrade.id]?.[language];
  return {
    name: entry?.name || upgrade.name,
    description: entry?.description || upgrade.description,
  };
};

// ============================================================================
// 10. RELATIVE TIME HELPER (FOR REFERRALS LIST)
// ============================================================================
const RELATIVE_TIME_TRANSLATIONS: Record<string, Record<Exclude<Language, 'en'>, string>> = {
  '2 days ago': {
    ar: 'منذ يومين',
    vi: '2 ngày trước',
    id: '2 hari lalu',
    zh: '2 天前',
    th: '2 วันที่แล้ว',
    tr: '2 gün önce',
    ru: '2 дня назад',
  },
  '5 hours ago': {
    ar: 'منذ 5 ساعات',
    vi: '5 giờ trước',
    id: '5 jam lalu',
    zh: '5 小时前',
    th: '5 ชั่วโมงที่แล้ว',
    tr: '5 saat önce',
    ru: '5 часов назад',
  },
};

export const translateRelativeTime = (val: string, language: Language): string => {
  if (language === 'en') return val;
  return RELATIVE_TIME_TRANSLATIONS[val]?.[language] || val;
};
