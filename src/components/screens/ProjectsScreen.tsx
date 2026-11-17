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
  Loader2,
  Users,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { getLocalizedProject } from '../../services/contentTranslations';
import { PI_ECOSYSTEM_PROJECTS, PiEcosystemProject } from '../../data/piProjects';
import { PiProduct } from '../../data/piProducts';
import { AnimatedGlobe } from '../projects/AnimatedGlobe';

export const ProjectsScreen: React.FC = () => {
  const {
    language,
    isPiConnected,
    isPiBrowser,
    connectPiAccount,
    purchasePiProduct,
    paymentStatus,
  } = useGame();
  const t = translations[language];

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<string>('25');
  const [contributionNotice, setContributionNotice] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const [userContribution, setUserContribution] = useState<number>(0);
  const [userContributions, setUserContributions] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return {};
    const res: Record<string, number> = {};
    PI_ECOSYSTEM_PROJECTS.forEach((p) => {
      try {
        const val = localStorage.getItem(`hamsterpi_project_contributions_${p.id}`);
        res[p.id] = val ? parseFloat(val) : 0;
      } catch {
        res[p.id] = 0;
      }
    });
    return res;
  });

  const [liveFunding, setLiveFunding] = useState<Record<string, { collectedPi: number; backersCount: number }>>({});

  // Fetch live aggregated project funding stats
  React.useEffect(() => {
    fetch('/api/projects/funding')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.funding) {
          setLiveFunding(data.funding);
        }
      })
      .catch(() => {});
  }, []);

  // Sync user contribution from localStorage for selected project
  React.useEffect(() => {
    if (selectedProjectId && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`hamsterpi_project_contributions_${selectedProjectId}`);
        const parsed = saved ? parseFloat(saved) : 0;
        setUserContribution(parsed);
        setUserContributions((prev) => ({ ...prev, [selectedProjectId]: parsed }));
      } catch {
        setUserContribution(0);
      }
    }
  }, [selectedProjectId]);

  const getProjectFundingData = (project: PiEcosystemProject) => {
    const userContributed = userContributions[project.id] || 0;
    const baseCollected = liveFunding[project.id]?.collectedPi ?? project.currentFundingPi;
    const totalCollected = baseCollected + userContributed;
    const percent = Math.min(100, Math.max(0, (totalCollected / project.fundingTargetPi) * 100));
    const baseBackers = liveFunding[project.id]?.backersCount ?? project.backersCount;
    const totalBackers = baseBackers + (userContributed > 0 ? 1 : 0);
    return {
      totalCollected,
      target: project.fundingTargetPi,
      percent,
      totalBackers,
      userContributed,
    };
  };

  const selectedProject = PI_ECOSYSTEM_PROJECTS.find((p) => p.id === selectedProjectId);
  const localizedSelectedProject = selectedProject
    ? getLocalizedProject(selectedProject, language)
    : null;

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

  const handleContributeClick = async () => {
    if (!selectedProject || !localizedSelectedProject) return;

    const amt = parseFloat(contributionAmount);
    if (isNaN(amt) || amt < 0.1) {
      setContributionNotice({
        type: 'error',
        message: t.projects.errMinAmount,
      });
      return;
    }

    if (!isPiBrowser) {
      setContributionNotice({
        type: 'error',
        message: t.projects.errPiBrowser,
      });
      return;
    }

    if (!isPiConnected) {
      setContributionNotice({
        type: 'info',
        message: t.projects.connectingPi,
      });
      const authRes = await connectPiAccount(true);
      if (!authRes.success) {
        setContributionNotice({
          type: 'error',
          message: authRes.error || t.projects.errAuthFailed,
        });
        return;
      }
    }

    setContributionNotice(null);

    // Create authentic Pi payment product for this voluntary project support
    const supportProduct: PiProduct = {
      id: `support_${selectedProject.id}_${Date.now()}`,
      name: `${t.projects.supportProductPrefix}${localizedSelectedProject.name}`,
      nameAr: `دعم مشروع: ${selectedProject.nameAr}`,
      description: `${t.projects.supportProductDescPrefix}${localizedSelectedProject.name}`,
      descriptionAr: `مساهمة مجتمعية طوعية لدعم وتطوير مشروع ${selectedProject.nameAr}`,
      pricePi: amt,
      icon: 'Coins',
      badge: t.projects.supportProductBadge,
      rewardType: 'points_bundle',
      rewardPayload: {
        points: Math.round(amt * 100000),
        seeds: Math.max(10, Math.round(amt * 5)),
      },
    };

    const res = await purchasePiProduct(supportProduct);
    if (res.success) {
      const updatedTotal = userContribution + amt;
      setUserContribution(updatedTotal);
      setUserContributions((prev) => ({
        ...prev,
        [selectedProject.id]: updatedTotal,
      }));
      try {
        localStorage.setItem(
          `hamsterpi_project_contributions_${selectedProject.id}`,
          updatedTotal.toString()
        );
      } catch {}

      setContributionNotice({
        type: 'success',
        message: t.projects.successContribution
          .replace('{amount}', String(amt))
          .replace('{name}', localizedSelectedProject.name)
          .replace('{txid}', res.txid?.substring(0, 10) || ''),
      });
    } else if (res.error && res.error !== 'PAYMENT_CANCELLED') {
      setContributionNotice({
        type: 'error',
        message: res.error,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] px-4 py-3 pb-24 max-w-md mx-auto text-slate-100 animate-in fade-in">
      {/* View Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">
              {t.projects.ecosystemBadge}
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-100 tracking-tight mt-0.5">
            {t.projects.title}
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
            <span>{t.projects.backToGlobes}</span>
          </button>
        )}
      </div>

      {/* VIEW 1: PREMIER TWO-GLOBE INTERFACE */}
      {!selectedProject || !localizedSelectedProject ? (
        <div className="flex flex-col items-center space-y-6 my-auto py-2">
          {/* Subtitle / Intro */}
          <div className="text-center px-2">
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              {t.projects.intro}
            </p>
          </div>

          {/* TWO MAIN PROJECT GLOBES */}
          <div className="w-full flex flex-col gap-6 items-center">
            {/* Globe 1: PiMind AI */}
            {(() => {
              const project = PI_ECOSYSTEM_PROJECTS[0];
              const locProj = getLocalizedProject(project, language);
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
                        {t.projects.aiBadge}
                      </span>
                      <h2 className="text-lg font-black text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {locProj.name}
                      </h2>
                      <p className="text-xs text-slate-400 line-clamp-2 max-w-xs">
                        {locProj.tagline}
                      </p>
                    </div>

                    {/* Funding Progress Bar */}
                    {(() => {
                      const funding = getProjectFundingData(project);
                      return (
                        <div className="mt-4 pt-3 border-t border-slate-800/80 w-full space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <Coins className="w-4 h-4 text-amber-400" />
                              <span className="text-slate-100 font-mono font-bold">
                                {funding.totalCollected.toLocaleString()} π
                              </span>
                              <span className="text-slate-400 text-[11px] font-mono">
                                / {project.fundingTargetPi.toLocaleString()} π
                              </span>
                            </div>
                            <span className="font-mono text-xs font-black px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 shadow-sm">
                              {funding.percent.toFixed(1)}%
                            </span>
                          </div>

                          {/* Progress Track */}
                          <div className="w-full h-2.5 rounded-full bg-slate-950/90 border border-slate-800 p-0.5 overflow-hidden relative shadow-inner">
                            <div
                              className="h-full rounded-full transition-all duration-700 relative overflow-hidden bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                              style={{ width: `${Math.max(4, funding.percent)}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-cyan-400" />
                              <span>
                                {funding.totalBackers.toLocaleString()} {t.projects.pioneers}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                              <span>{t.projects.exploreAndSupport}</span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}

            {/* Globe 2: Pi Battle Arena */}
            {(() => {
              const project = PI_ECOSYSTEM_PROJECTS[1];
              const locProj = getLocalizedProject(project, language);
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
                        {t.projects.arenaBadge}
                      </span>
                      <h2 className="text-lg font-black text-slate-100 group-hover:text-amber-300 transition-colors">
                        {locProj.name}
                      </h2>
                      <p className="text-xs text-slate-400 line-clamp-2 max-w-xs">
                        {locProj.tagline}
                      </p>
                    </div>

                    {/* Funding Progress Bar */}
                    {(() => {
                      const funding = getProjectFundingData(project);
                      return (
                        <div className="mt-4 pt-3 border-t border-slate-800/80 w-full space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <Coins className="w-4 h-4 text-amber-400" />
                              <span className="text-slate-100 font-mono font-bold">
                                {funding.totalCollected.toLocaleString()} π
                              </span>
                              <span className="text-slate-400 text-[11px] font-mono">
                                / {project.fundingTargetPi.toLocaleString()} π
                              </span>
                            </div>
                            <span className="font-mono text-xs font-black px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/50 text-amber-300 shadow-sm">
                              {funding.percent.toFixed(1)}%
                            </span>
                          </div>

                          {/* Progress Track */}
                          <div className="w-full h-2.5 rounded-full bg-slate-950/90 border border-slate-800 p-0.5 overflow-hidden relative shadow-inner">
                            <div
                              className="h-full rounded-full transition-all duration-700 relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                              style={{ width: `${Math.max(4, funding.percent)}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-amber-400" />
                              <span>
                                {funding.totalBackers.toLocaleString()} {t.projects.pioneers}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                              <span>{t.projects.exploreAndSupport}</span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Mandatory Transparency Disclaimer Box */}
          <div className="w-full p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2 mt-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Info className="w-4 h-4 shrink-0" />
              <span>{t.projects.disclaimerTitle}</span>
            </div>
            <p>{t.projects.disclaimerBody}</p>
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
                  {t.projects.proposalBadge}
                </span>
                <h2 className="text-xl font-black text-slate-100 truncate mt-1">
                  {localizedSelectedProject.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  {localizedSelectedProject.tagline}
                </p>
              </div>
            </div>

            {/* Target Display */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">
                {t.projects.fundingGoal}:
              </span>
              <span className="font-mono text-base font-black text-amber-300">
                {selectedProject.fundingTargetPi.toLocaleString()} π
              </span>
            </div>
          </div>

          {/* COMMUNITY FUNDING PROGRESS CARD */}
          {(() => {
            const funding = getProjectFundingData(selectedProject);
            const isAi = selectedProject.id === 'pimind_ai';
            return (
              <div className="p-4 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-950 to-purple-950/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {t.projects.fundingProgress}
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xl font-mono font-black text-amber-300">
                          {funding.totalCollected.toLocaleString()} π
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          / {selectedProject.fundingTargetPi.toLocaleString()} π
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono text-xs font-black px-2.5 py-1 rounded-full border shadow-sm ${
                        isAi
                          ? 'bg-cyan-950/90 border-cyan-500/60 text-cyan-300'
                          : 'bg-amber-950/90 border-amber-500/60 text-amber-300'
                      }`}
                    >
                      {funding.percent.toFixed(1)}%
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1 font-medium">
                      <Users className="w-3 h-3 text-purple-400" />
                      <span>
                        {funding.totalBackers.toLocaleString()} {t.projects.backers}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Progress Bar Track */}
                <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800/80 p-0.5 relative overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-700 relative overflow-hidden ${
                      isAi
                        ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 shadow-[0_0_14px_rgba(6,182,212,0.7)]'
                        : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-[0_0_14px_rgba(245,158,11,0.7)]'
                    }`}
                    style={{ width: `${Math.max(4, funding.percent)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                  </div>
                </div>

                {/* Personal Support Badge */}
                {funding.userContributed > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{t.projects.verifiedSupport}</span>
                    </div>
                    <span className="font-mono font-black text-amber-300 text-sm">
                      {funding.userContributed.toLocaleString()} π
                    </span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Project Concept & Detailed Description */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{t.projects.conceptTitle}</span>
            </h3>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {localizedSelectedProject.concept}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-slate-900">
              {localizedSelectedProject.description}
            </p>
          </div>

          {/* Planned Features */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 px-1">
              {t.projects.plannedFeaturesTitle}
            </h3>

            <div className="space-y-2">
              {localizedSelectedProject.plannedFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                    {getFeatureIcon(feat.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">
                      {feat.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Benefits to the Pi Community */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-900/40 space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300">
              {t.projects.communityBenefitsTitle}
            </h3>

            <div className="space-y-2">
              {localizedSelectedProject.communityBenefits.map((ben, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">
                      {ben.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {ben.description}
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
              <span>{t.projects.roadmapTitle}</span>
            </h3>

            <div className="space-y-3">
              {localizedSelectedProject.milestones.map((m) => (
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
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {m.description}
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
                  {t.projects.supportTitle}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-400 font-mono">
                {t.projects.maxSuffix.replace('{amount}', selectedProject.fundingTargetPi.toLocaleString())}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.projects.supportSubtitle}
            </p>

            {/* Quick Amount Selector Chips */}
            <div className="grid grid-cols-4 gap-2">
              {['1', '5', '25', '100'].map((val) => (
                <button
                  key={val}
                  type="button"
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
                placeholder={t.projects.customAmountPlaceholder}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-purple-500 pl-8"
              />
              <span className="absolute left-3 top-2.5 text-amber-400 font-bold font-mono text-sm">
                π
              </span>
            </div>

            {/* Contribution Button */}
            <button
              onClick={handleContributeClick}
              disabled={paymentStatus.isProcessing}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                paymentStatus.isProcessing
                  ? 'bg-slate-800 border border-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/40 active:scale-98'
              }`}
            >
              {paymentStatus.isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>
                    {paymentStatus.message || t.projects.processingPayment}
                  </span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 text-amber-300" />
                  <span>
                    {t.projects.supportWithBtn.replace('{amount}', contributionAmount || '0')}
                  </span>
                </>
              )}
            </button>

            {/* Notice Output */}
            {contributionNotice && (
              <div
                className={`p-3 rounded-xl text-xs leading-relaxed flex items-start gap-2 animate-in fade-in ${
                  contributionNotice.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-200'
                    : contributionNotice.type === 'error'
                    ? 'bg-rose-950/80 border border-rose-500/60 text-rose-200'
                    : 'bg-purple-950/80 border border-purple-500/60 text-purple-200'
                }`}
              >
                {contributionNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      contributionNotice.type === 'error' ? 'text-rose-400' : 'text-purple-400'
                    }`}
                  />
                )}
                <p>{contributionNotice.message}</p>
              </div>
            )}
          </div>

          {/* Mandatory Transparency Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Info className="w-3.5 h-3.5" />
              <span>{t.projects.officialDisclaimerTitle}</span>
            </div>
            <p>{t.projects.disclaimerBody}</p>
          </div>
        </div>
      )}
    </div>
  );
};
