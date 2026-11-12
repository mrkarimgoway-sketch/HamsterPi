/**
 * Official Pi Ecosystem Projects Showcase Data
 * Independent community-supported projects for the Pi Network ecosystem.
 * 
 * DISCLAIMER:
 * These are independent community-supported development proposals. Contributions
 * are voluntary and do not represent an investment, guarantee of profit, ownership,
 * or promised financial return. They are not official Pi Core Team fundraising campaigns.
 */

export interface ProjectMilestone {
  id: string;
  phase: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  targetQuarter: string;
  status: 'planned' | 'in_development' | 'completed';
}

export interface PiEcosystemProject {
  id: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  concept: string;
  conceptAr: string;
  description: string;
  descriptionAr: string;
  fundingTargetPi: number;
  currentFundingPi: number;
  backersCount: number;
  plannedFeatures: {
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    icon: string;
  }[];
  communityBenefits: {
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
  }[];
  milestones: ProjectMilestone[];
  theme: {
    primaryColor: string;
    glowColor: string;
    ringColor: string;
    atmosphereColor: string;
    badgeBg: string;
    badgeText: string;
  };
}

export const PI_ECOSYSTEM_PROJECTS: PiEcosystemProject[] = [
  {
    id: 'pimind_ai',
    name: 'PiMind AI',
    nameAr: 'باي مايند للذكاء الاصطناعي',
    tagline: 'Next-Gen Intelligent Conversational & Productivity Platform',
    taglineAr: 'منصة الذكاء الاصطناعي والإنتاجية الفائقة لمنظومة باي',
    concept: 'An advanced multilingual AI assistant and productivity platform inspired by modern conversational AI systems, architected natively for the global Pi ecosystem.',
    conceptAr: 'مساعد ذكاء اصطناعي متعدد اللغات ومنصة إنتاجية متقدمة مستوحاة من أحدث أنظمة الذكاء الاصطناعي التوليدي، ومصممة خصيصاً لمجتمع رواد باي العالمي.',
    description: 'PiMind AI bridges cutting-edge conversational intelligence with seamless Pi utility. Built to empower hundreds of millions of Pioneers across 230+ countries, it provides contextual language understanding, intelligent coding assistance, structured research summarization, and automated document analysis—with all premium tiers accessible exclusively via Pi cryptocurrency.',
    descriptionAr: 'يجمع مشروع PiMind AI بين أحدث تقنيات المحادثة الذكية والاستخدام العملي لعملة باي. صُمم لتمكين ملايين الرواد حول العالم من خلال فهم سياقي متعدد اللغات، ومساعد برمجي متقدم، وتلخيص الأبحاث، وتحليل المستندات، مع إتاحة الاشتراكات حصرياً عبر عملة باي.',
    fundingTargetPi: 300000,
    currentFundingPi: 134250,
    backersCount: 4890,
    plannedFeatures: [
      {
        title: 'Intelligent Conversational Assistant',
        titleAr: 'مساعد محادثة ذكي وتوليدي',
        description: 'Multi-turn conversational reasoning, dynamic memory context, and problem-solving across technical, creative, and commercial domains.',
        descriptionAr: 'حوار استدلالي متعدد الجولات مع ذاكرة سياقية ذكية وحلول للمهام التقنية والإبداعية والتجارية.',
        icon: 'Bot',
      },
      {
        title: 'Deep Multilingual Translation & Localization',
        titleAr: 'دعم متعدد اللغات وترجمة فورية',
        description: 'Native comprehension of over 95 languages, dialect adaptation, and cultural nuance preservation for international Pioneers.',
        descriptionAr: 'فهم دقيق لأكثر من 95 لغة وتكيف مع اللهجات المحلية لدعم جميع رواد شبكة باي.',
        icon: 'Languages',
      },
      {
        title: 'Document & Research Understanding',
        titleAr: 'تحليل وتلخيص المستندات والأبحاث',
        description: 'Upload PDF, DOCX, CSV, or whitepapers for instant analytical breakdowns, contextual Q&A, and synthesized reports.',
        descriptionAr: 'معالجة ملفات PDF والمستندات والبيانات للحصول على تحليلات دقيقة وإجابات موثقة.',
        icon: 'FileText',
      },
      {
        title: 'Writing & Creative Suite',
        titleAr: 'أدوات الكتابة وصياغة المحتوى',
        description: 'Assisted composition for technical documentation, academic papers, marketing copy, and multi-format publishing.',
        descriptionAr: 'صياغة المستندات التقنية، الأوراق البحثية، والمحتوى الإبداعي بجودة احترافية.',
        icon: 'PenTool',
      },
      {
        title: 'Pioneer Coding & Debugging Copilot',
        titleAr: 'مساعد البرمجة وتصحيح الأكواد',
        description: 'Syntax generation, logic auditing, and API scaffolding for Python, JavaScript, Rust, Solidity, and Pi SDK development.',
        descriptionAr: 'كتابة الأكواد ومراجعتها ودعم بناء تطبيقات Pi Network ومكتبات البرمجة الحديثة.',
        icon: 'Code',
      },
      {
        title: 'Pi-Exclusive Subscription Micro-Tiers',
        titleAr: 'اشتراكات مدفوعة حصرياً بعملة باي',
        description: 'Zero fiat barriers. Pioneers unlock high-throughput inference models using direct micro-payments with Pi cryptocurrency.',
        descriptionAr: 'لا حاجة للعملات التقليدية؛ يتم تفعيل باقات السرعة الفائقة باشتراكات دورية بعملة باي.',
        icon: 'CreditCard',
      },
      {
        title: 'Distributed Scalable Infrastructure',
        titleAr: 'بنية تحتية موزعة وقابلة للتوسع',
        description: 'Low-latency edge inference clusters optimized for high concurrent request volumes from mobile Pi Browser sessions.',
        descriptionAr: 'شبكة خوادم موزعة تضمن سرعة استجابة فورية عبر متصفح باي والأجهزة الذكية.',
        icon: 'Server',
      },
    ],
    communityBenefits: [
      {
        title: 'Direct Pi Utility Creation',
        titleAr: 'خلق منفعة استهلاكية حقيقية لعملة باي',
        description: 'Transforms Pi from a speculative holding into everyday computational power for millions of students, engineers, and creators.',
        descriptionAr: 'يحول عملة باي إلى طاقة حسابية يومية تخدم الطلاب والمهندسين وأصحاب الأعمال.',
      },
      {
        title: 'Decentralized Knowledge Access',
        titleAr: 'إتاحة المعرفة المتقدمة للجميع',
        description: 'Democratizes high-tier artificial intelligence for emerging economies without requiring foreign credit cards.',
        descriptionAr: 'يتيح تقنيات الذكاء الاصطناعي للدول النامية دون الحاجة لبطاقات بنكية أجنبية.',
      },
    ],
    milestones: [
      {
        id: 'pm_q1',
        phase: 'Milestone 1',
        title: 'Core Engine & Pi Auth Gateway',
        titleAr: 'المحرك الأساسي وبوابة مصادقة باي',
        description: 'High-speed LLM inference pipeline with official Pi Network authentication and token validation.',
        descriptionAr: 'بناء خط معالجة النماذج اللغوية مع ربط المصادقة الرسمية لشبكة باي.',
        targetQuarter: 'Q1 2027',
        status: 'in_development',
      },
      {
        id: 'pm_q2',
        phase: 'Milestone 2',
        title: 'Document Parser & Multilingual Suite',
        titleAr: 'معالج المستندات والمكتبة اللغوية',
        description: 'Vector-grounded document analysis engine and multi-language contextual alignment.',
        descriptionAr: 'تطوير محرك تحليل المستندات المتجهي وضبط التوافق اللغوي لـ 95 لغة.',
        targetQuarter: 'Q2 2027',
        status: 'planned',
      },
      {
        id: 'pm_q3',
        phase: 'Milestone 3',
        title: 'Pi Payment Subscription Smart Contracts',
        titleAr: 'عقود الاشتراكات الدورية عبر باي',
        description: 'Official Pi-to-App payment subscriptions integration with automated tier provisioning.',
        descriptionAr: 'تفعيل اشتراكات المنظومة المؤتمتة باستخدام مدفوعات باي الرسمية.',
        targetQuarter: 'Q3 2027',
        status: 'planned',
      },
      {
        id: 'pm_q4',
        phase: 'Milestone 4',
        title: 'Global Edge Scale & Pioneer App Store Release',
        titleAr: 'الإطلاق العالمي وتوسيع البنية التحتية',
        description: 'Deployment across international edge zones and native publishing on the Pi App Ecosystem.',
        descriptionAr: 'نشر النظام على مراكز البيانات الدولية وإتاحة التطبيق رسمياً في منظومة باي.',
        targetQuarter: 'Q4 2027',
        status: 'planned',
      },
    ],
    theme: {
      primaryColor: 'from-cyan-500 via-indigo-600 to-purple-700',
      glowColor: 'rgba(6, 182, 212, 0.45)',
      ringColor: '#06b6d4',
      atmosphereColor: 'rgba(99, 102, 241, 0.3)',
      badgeBg: 'bg-cyan-950/70 border-cyan-500/50',
      badgeText: 'text-cyan-300',
    },
  },
  {
    id: 'pi_battle_arena',
    name: 'Pi Battle Arena',
    nameAr: 'ساحة معارك باي (Pi Battle Arena)',
    tagline: 'High-Octane Multiplayer Battle Royale for the Web3 Era',
    taglineAr: 'لعبة باتل رويال جماعية تنافسية لجيل الويب 3',
    concept: 'An ambitious international multiplayer battle royale game engineered from the ground up with original mechanics, original lore, and native Pi Network economic integration.',
    conceptAr: 'لعبة باتل رويال ملحمية متعددة اللاعبين مصممة بالكامل بهوية وقواعد لعب ومؤثرات أصلية، ومدمجة اقتصادياً مع شبكة باي لدعم البطولات العالمية.',
    description: 'Pi Battle Arena drops up to 100 players onto dynamic, shifting holographic arenas. Utilizing low-latency state synchronization, strategic weapon loadouts, tactical terrain destruction, and global tournament matchmaking, players compete for seasonal glory. All weapon wraps, armor skins, spectator passes, and tournament registration fees are powered exclusively by Pi cryptocurrency. (100% original IP, no copyrighted assets).',
    descriptionAr: 'تهبط في لعبة Pi Battle Arena بـ 100 لاعب في ساحات ثلاثية الأبعاد متحركة. مع خوادم تزامن فائقة السرعة، وأسلحة تكتيكية، ومطابقة لاعبين دولية، يتنافس الرواد في بطولات موسمية كبرى. جميع المظاهر التجميلية وتذاكر البطولات مفعلة حصرياً بعملة باي (هوية أصلية 100%).',
    fundingTargetPi: 1000000,
    currentFundingPi: 412800,
    backersCount: 12640,
    plannedFeatures: [
      {
        title: '100-Player Real-Time Battle Royale',
        titleAr: 'باتل رويال لـ 100 لاعب في الوقت الفعلي',
        description: 'Large-scale competitive matches with dynamic safe zone constrictions, tactical airdrops, and destructible energy covers.',
        descriptionAr: 'مواجهات جماعية ضخمة مع انكماش تدريجي لمنطقة الأمان وإسقاطات جوية تكتيكية.',
        icon: 'Swords',
      },
      {
        title: 'Global Matchmaking & Regional Clusters',
        titleAr: 'خوادم مطابقة دولية بزمن استجابة منخفض',
        description: 'Ultra-low latency server tick rates deployed across North America, Europe, Asia, and the Middle East for fair competition.',
        descriptionAr: 'خوادم مخصصة في مختلف القارات لضمان سرعة استجابة متكافئة وتنافس عادل.',
        icon: 'Globe',
      },
      {
        title: 'Competitive Tournaments & Seasonal Leagues',
        titleAr: 'بطولات تنافسية ودوريات موسمية',
        description: 'Ranked tiers from Bronze to Grand Pioneer Master with automated tournament bracket management.',
        descriptionAr: 'تصنيفات دورية من البرونزي حتى رتبة سيد الرواد، مع جداول منافسات مؤتمتة.',
        icon: 'Trophy',
      },
      {
        title: 'Pioneer Profile & Verified Combat Record',
        titleAr: 'سجل معارك وتصنيف موثق بالباي',
        description: 'On-chain proof of rank, KD ratios, tournament trophies, and verifiable achievement badges linked to Pioneer UIDs.',
        descriptionAr: 'ملف مقاتل موثق يسجل الانتصارات ومعدل القنص والكؤوس المرتبطة بحساب باي.',
        icon: 'Shield',
      },
      {
        title: 'Cosmetics & Armor Customization',
        titleAr: 'تخصيص المظاهر والدروع التجميلية',
        description: 'Exclusive cybernetic outfits, weapon skins, parachutes, and holographic emotes. Zero pay-to-win mechanics.',
        descriptionAr: 'أزياء مستقبلية ومظاهر أسلحة وشارات ترحيبية تجميلية دون أي تأثير على عدالة القتال.',
        icon: 'Sparkles',
      },
      {
        title: 'Pi-Exclusive In-Game Micro-Transactions',
        titleAr: 'متجر حصري بعملة باي للمظاهر',
        description: 'Smooth, one-tap purchases of Battle Passes and seasonal cosmetics directly through the Pi Wallet.',
        descriptionAr: 'شراء بطاقات الموسم والمظاهر الحصرية بنقرة واحدة مباشرة عبر محفظة باي.',
        icon: 'ShoppingBag',
      },
      {
        title: 'Cross-Platform Mobile & Desktop Engine',
        titleAr: 'دعم سلس للهواتف الذكية والحواسيب',
        description: 'Optimized WebGL/WebGPU client running fluidly in Pi Browser mobile as well as standalone desktop environments.',
        descriptionAr: 'محرك ألعاب خفيف وسريع يعمل بسلاسة عبر متصفح باي على الهواتف والأجهزة المكتبية.',
        icon: 'Monitor',
      },
    ],
    communityBenefits: [
      {
        title: 'Massive Youth & Gaming Adoption',
        titleAr: 'جذب مجتمع اللاعبين العالمي إلى شبكة باي',
        description: 'Positions Pi Network as the premier Web3 gaming currency, attracting millions of passionate gamers to become Pioneers.',
        descriptionAr: 'يرسخ شبكة باي كعملة ألعاب الويب 3 الأولى عالمياً، ويجذب ملايين اللاعبين للشبكة.',
      },
      {
        title: 'High-Volume Transaction Velocity',
        titleAr: 'زيادة وتيرة التداول والمعاملات لعملة باي',
        description: 'Generates millions of authentic micro-transactions through entry passes and seasonal customization.',
        descriptionAr: 'يولد ملايين المعاملات الدقيقة الموثوقة لتنشيط الدورة الاقتصادية للشبكة.',
      },
    ],
    milestones: [
      {
        id: 'pba_q1',
        phase: 'Milestone 1',
        title: 'Physics & Netcode Synchronization Prototype',
        titleAr: 'بروتوكول حركة اللاعبين وتزامن الشبكة',
        description: 'Server-authoritative physics simulation, movement interpolation, and rollback networking.',
        descriptionAr: 'بناء خوادم المحاكاة الفيزيائية وتزامن إطلاق النار وحركة اللاعبين دون تقطيع.',
        targetQuarter: 'Q2 2027',
        status: 'in_development',
      },
      {
        id: 'pba_q2',
        phase: 'Milestone 2',
        title: 'Map Design & Cybernetic Arena Geometry',
        titleAr: 'تصميم خرائط الساحات التكتيكية',
        description: 'Detailed modular battleground with diverse verticality, tactical cover, and dynamic lighting.',
        descriptionAr: 'تصميم ساحة القتال الرئيسية بتضاريس ثلاثية الأبعاد تفاعلية وإضاءة ديناميكية.',
        targetQuarter: 'Q3 2027',
        status: 'planned',
      },
      {
        id: 'pba_q3',
        phase: 'Milestone 3',
        title: 'Pi Payment Battle Pass & Cosmetics Shop',
        titleAr: 'تكامل متجر باي وبطاقة المعركة الموسمية',
        description: 'Official Pi Platform payment integration for cosmetic inventory and seasonal Battle Passes.',
        descriptionAr: 'ربط مدفوعات باي لشراء بطاقات المعركة والمظاهر التجميلية الرسمية.',
        targetQuarter: 'Q4 2027',
        status: 'planned',
      },
      {
        id: 'pba_q4',
        phase: 'Milestone 4',
        title: 'Global Beta Tournament & Open Mainnet Launch',
        titleAr: 'إطلاق بطولة البيتا العالمية والافتتاح الرسمي',
        description: 'International 100-player public tournament with verified Pi community leaderboards.',
        descriptionAr: 'تنظيم أول بطولة عالمية بمشاركة 100 لاعب وتتويج أبطال مجتمع باي.',
        targetQuarter: 'Q1 2028',
        status: 'planned',
      },
    ],
    theme: {
      primaryColor: 'from-amber-500 via-orange-600 to-red-700',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      ringColor: '#f59e0b',
      atmosphereColor: 'rgba(239, 68, 68, 0.3)',
      badgeBg: 'bg-amber-950/70 border-amber-500/50',
      badgeText: 'text-amber-300',
    },
  },
];
