import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Bot,
  Swords,
  Languages,
  FileText,
  PenTool,
  Code,
  CreditCard,
  Server,
  Globe,
  Trophy,
  Shield,
  ShoppingBag,
  Monitor,
  CheckCircle2,
  Clock,
  AlertCircle,
  Database,
  Coins,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PI_ECOSYSTEM_PROJECTS, PiEcosystemProject } from '../../data/piProjects';
import { AnimatedGlobe } from '../projects/AnimatedGlobe';

export const ProjectsScreen: React.FC = () => {
  const { language, isPiConnected, profile } = useGame();
  const isAr = language === 'ar';

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<string>('25');
  const [contributionNotice, setContributionNotice] = useState<string | null>(null);

  const selectedProject = PI_ECOSYSTEM_PROJECTS.find((p) => p.id === selectedProjectId);

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="w-5 h-5 text-cyan-400" />;
      case 'Languages':
        return <Languages className="w-5 h-5 text-cyan-300" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-purple-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-emerald-400" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-amber-300" />;
      case 'Server':
        return <Server className="w-5 h-5 text-blue-400" />;
      case 'Swords':
        return <Swords className="w-5 h-5 text-amber-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-amber-300" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-yellow-300" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-red-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-orange-400" />;
      case 'Monitor':
        return <Monitor className="w-5 h-5 text-pink-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleContributeClick = () => {
    const amt = parseFloat(contributionAmount);
    if (isNaN(amt) || amt <= 0) {
      setContributionNotice(
        isAr ? 'يرجى إدخال مبلغ صحيح للمساهمة' : 'Please enter a valid Pi contribution amount.'
      );
      return;
    }

    // Strict compliance feedback: Database is awaiting activation
    setContributionNotice(
      isAr
        ? `جاهز للمنظومة: تم تحضير بروتوكول المساهمة بـ ${amt} π بنجاح على مستوى الواجهة والخوادم. سيتم تفعيل التوثيق المالي بمجرد اكتمال تفعيل حزمة قاعدة بيانات Supabase.`
        : `Ready for Activation: The ${amt} π contribution protocol is fully prepared at code and server level. Live escrow recording will be enabled immediately upon Supabase database activation.`
    );
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] px-4 py-3 pb-24 max-w-md mx-auto text-slate-100 animate-in fade-in">
      {/* View Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">
              {isAr ? 'منظومة مشاريع باي المستقلة' : 'Pi Ecosystem Showcase'}
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-100 tracking-tight mt-0.5">
            {isAr ? 'مشاريع تدعم مستقبل منظومة Pi' : 'Pi Ecosystem Projects'}
          </h1>
        </div>

        {selectedProjectId && (
          <button
            onClick={() => {
              setSelectedProjectId(null);
              setContributionNotice(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isAr ? 'الرجوع للكوكبين' : 'Two-Globe View'}</span>
          </button>
        )}
      </div>

      {/* VIEW 1: PREMIER TWO-GLOBE INTERFACE */}
      {!selectedProject ? (
        <div className="flex flex-col items-center space-y-6 my-auto py-2">
          {/* Subtitle / Intro */}
          <div className="text-center px-2">
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              {isAr
                ? 'استكشف مشاريع الرواد التقنية المقترحة والمصممة خصيصاً لدعم المنفعة الحقيقية لشبكة Pi.'
                : 'Explore pioneer-driven technology proposals built to expand authentic utility across the global Pi Network.'}
            </p>
          </div>

          {/* TWO MAIN PROJECT GLOBES */}
          <div className="w-full flex flex-col gap-6 items-center">
            {/* Globe 1: PiMind AI */}
            {(() => {
              const project = PI_ECOSYSTEM_PROJECTS[0];
              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className="w-full rounded-3xl p-5 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-cyan-950/30 border border-cyan-800/40 hover:border-cyan-400/60 shadow-xl shadow-cyan-950/20 cursor-pointer transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col items-center text-center">
                    {/* Animated Spherical Planet */}
                    <div className="py-2">
                      <AnimatedGlobe type="pimind" size={175} />
                    </div>

                    {/* Project Header Info */}
                    <div className="mt-2 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                        {isAr ? 'ذكاء اصطناعي متعدد اللغات' : 'Multilingual AI Platform'}
                      </span>
                      <h2 className="text-lg font-black text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {isAr ? project.nameAr : project.name}
                      </h2>
                      <p className="text-xs text-slate-400 line-clamp-2 max-w-xs">
                        {isAr ? project.taglineAr : project.tagline}
                      </p>
                    </div>

                    {/* Funding Target Tag */}
                    <div className="mt-4 flex items-center justify-between w-full pt-3 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span>{isAr ? 'الهدف التمويلي:' : 'Funding Goal:'}</span>
                        <strong className="font-mono text-amber-300 font-black">
                          {project.fundingTargetPi.toLocaleString()} π
                        </strong>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                        <span>{isAr ? 'استكشف المشروع' : 'Explore'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Globe 2: Pi Battle Arena */}
            {(() => {
              const project = PI_ECOSYSTEM_PROJECTS[1];
              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className="w-full rounded-3xl p-5 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-amber-950/30 border border-amber-800/40 hover:border-amber-400/60 shadow-xl shadow-amber-950/20 cursor-pointer transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col items-center text-center">
                    <div className="py-2">
                      <AnimatedGlobe type="battle_arena" size={175} />
                    </div>

                    <div className="mt-2 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40">
                        {isAr ? 'ألعاب باتل رويال ويب 3' : 'Web3 Battle Royale'}
                      </span>
                      <h2 className="text-lg font-black text-slate-100 group-hover:text-amber-300 transition-colors">
                        {isAr ? project.nameAr : project.name}
                      </h2>
                      <p className="text-xs text-slate-400 line-clamp-2 max-w-xs">
                        {isAr ? project.taglineAr : project.tagline}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between w-full pt-3 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span>{isAr ? 'الهدف التمويلي:' : 'Funding Goal:'}</span>
                        <strong className="font-mono text-amber-300 font-black">
                          {project.fundingTargetPi.toLocaleString()} π
                        </strong>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                        <span>{isAr ? 'استكشف المشروع' : 'Explore'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Mandatory Transparency Disclaimer Box */}
          <div className="w-full p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2 mt-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Info className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'إخلاء مسؤولية وشفافية المشاريع' : 'Project Transparency & Community Disclaimer'}</span>
            </div>
            <p>
              {isAr
                ? 'هذه مشاريع تطوير مستقلة مقترحة ومدعومة من المجتمع. المساهمات اختيارية ولا تمثل استثمارًا أو ضمانًا للربح أو ملكية أو عائدًا ماليًا مضمونًا، وليست حملات تمويل رسمية تابعة لفريق Pi Core Team.'
                : 'These are independent community-supported development proposals. Contributions are voluntary and do not represent an investment, guarantee of profit, ownership, or promised financial return. They are not official Pi Core Team fundraising campaigns.'}
            </p>
          </div>
        </div>
      ) : (
        /* VIEW 2: EXPANDED PROJECT DETAILS VIEW */
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Hero Banner with Mini Planet */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-800 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-950 to-purple-950/30">
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <AnimatedGlobe
                  type={selectedProject.id === 'pimind_ai' ? 'pimind' : 'battle_arena'}
                  size={105}
                  isSelected
                />
              </div>

              <div className="min-w-0 flex-1">
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${selectedProject.theme.badgeBg} ${selectedProject.theme.badgeText}`}
                >
                  {isAr ? 'مقترح تطوير مستقل' : 'Development Proposal'}
                </span>
                <h2 className="text-xl font-black text-slate-100 truncate mt-1">
                  {isAr ? selectedProject.nameAr : selectedProject.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  {isAr ? selectedProject.taglineAr : selectedProject.tagline}
                </p>
              </div>
            </div>

            {/* Target Display */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">
                {isAr ? 'الهدف التمويلي للمشروع' : 'Community Funding Goal'}:
              </span>
              <span className="font-mono text-base font-black text-amber-300">
                {selectedProject.fundingTargetPi.toLocaleString()} π
              </span>
            </div>
          </div>

          {/* CRITICAL STATS RULE: DATABASE ACTIVATION NOTICE */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/50 shadow-inner">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center shrink-0 text-amber-300">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-purple-200">
                  {isAr ? 'حالة إحصائيات التمويل الموثقة' : 'Verified Funding Statistics'}
                </h4>
                <p className="text-xs text-amber-300 font-semibold mt-1">
                  {isAr
                    ? 'ستظهر إحصائيات التمويل بعد تفعيل قاعدة البيانات.'
                    : 'Funding statistics will become available after database activation.'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {isAr
                    ? 'التزاماً بأعلى معايير الشفافية، لا يتم عرض أي أرقام مساهمات وهمية أو أشرطة تقدم صورية حتى يتم تشغيل سجل المعاملات على قاعدة بيانات Supabase.'
                    : 'In strict compliance with transparency standards, no simulated or fictional collected balances are shown until live records are verified through Supabase.'}
                </p>
              </div>
            </div>
          </div>

          {/* Project Concept & Detailed Description */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'رؤية ومفهوم المشروع' : 'Concept & Overview'}</span>
            </h3>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {isAr ? selectedProject.conceptAr : selectedProject.concept}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-slate-900">
              {isAr ? selectedProject.descriptionAr : selectedProject.description}
            </p>
          </div>

          {/* Planned Features */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 px-1">
              {isAr ? 'المزايا والمواصفات المخططة' : 'Planned Features'}
            </h3>

            <div className="space-y-2">
              {selectedProject.plannedFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                    {getFeatureIcon(feat.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">
                      {isAr ? feat.titleAr : feat.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {isAr ? feat.descriptionAr : feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Benefits to the Pi Community */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-900/40 space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300">
              {isAr ? 'القيمة المضافة لمجتمع Pi' : 'Expected Benefits to the Pi Community'}
            </h3>

            <div className="space-y-2">
              {selectedProject.communityBenefits.map((ben, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">
                      {isAr ? ben.titleAr : ben.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {isAr ? ben.descriptionAr : ben.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Development Roadmap & Milestones */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{isAr ? 'خارطة الطريق ومراحل التطوير' : 'Development Roadmap & Milestones'}</span>
            </h3>

            <div className="space-y-3">
              {selectedProject.milestones.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 relative pl-4 border-l-2 border-l-amber-500"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-amber-400 font-mono">{m.phase}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {m.targetQuarter}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 mt-1">
                    {isAr ? m.titleAr : m.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {isAr ? m.descriptionAr : m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pi Contribution Preparation Section */}
          <div className="p-4 rounded-3xl bg-gradient-to-b from-purple-950/50 via-slate-950 to-slate-950 border border-purple-800/60 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  {isAr ? 'دعم المشروع بعملة Pi' : 'Voluntary Project Support in Pi'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-400 font-mono">
                {selectedProject.fundingTargetPi.toLocaleString()} π Max
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isAr
                ? 'حدد مقدار عملة باي التي ترغب في المساهمة بها لدعم تطوير هذا المقترح.'
                : 'Select or input any Pi amount you wish to contribute to support this project proposal.'}
            </p>

            {/* Quick Amount Selector Chips */}
            <div className="grid grid-cols-4 gap-2">
              {['5', '25', '100', '500'].map((val) => (
                <button
                  key={val}
                  onClick={() => setContributionAmount(val)}
                  className={`py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                    contributionAmount === val
                      ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-purple-600/50'
                  }`}
                >
                  {val} π
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="relative mt-2">
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder={isAr ? 'أدخل مبلغ باي مخصص' : 'Enter custom Pi amount'}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-purple-500 pl-8"
              />
              <span className="absolute left-3 top-2.5 text-amber-400 font-bold font-mono text-sm">
                π
              </span>
            </div>

            {/* Contribution Button */}
            <button
              onClick={handleContributeClick}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40 active:scale-98 transition-all"
            >
              <Coins className="w-4 h-4 text-amber-300" />
              <span>
                {isAr
                  ? `دعم المشروع بـ ${contributionAmount || 0} π`
                  : `Support Project with ${contributionAmount || 0} π`}
              </span>
            </button>

            {/* Notice Output */}
            {contributionNotice && (
              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/50 text-xs text-amber-200 leading-relaxed flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>{contributionNotice}</p>
              </div>
            )}
          </div>

          {/* Mandatory Transparency Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Info className="w-3.5 h-3.5" />
              <span>{isAr ? 'إخلاء المسؤولية الرسمي' : 'Official Voluntary Disclaimer'}</span>
            </div>
            <p>
              {isAr
                ? 'هذه مشاريع تطوير مستقلة مقترحة ومدعومة من المجتمع. المساهمات اختيارية ولا تمثل استثمارًا أو ضمانًا للربح أو ملكية أو عائدًا ماليًا مضمونًا، وليست حملات تمويل رسمية تابعة لفريق Pi Core Team.'
                : 'These are independent community-supported development proposals. Contributions are voluntary and do not represent an investment, guarantee of profit, ownership, or promised financial return. They are not official Pi Core Team fundraising campaigns.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
