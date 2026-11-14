import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckSquare,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Tv,
  Zap,
  ExternalLink,
  AlertTriangle,
  Flame,
  Share2,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { DAILY_LOGIN_REWARDS } from '../../data/initialData';
import {
  SOCIAL_TASKS,
  SOCIAL_TASK_COOLDOWN_MS,
  SOCIAL_MIN_AWAY_MS,
} from '../../data/socialTasks';
import { SocialPlatform, SocialTask } from '../../types/game';
import { sounds } from '../../services/sound';

const PENDING_SOCIAL_KEY = 'hamsterpi_pending_social_task';

interface PendingSocialAttempt {
  taskId: string;
  clickedAt: number;
  leftAppAt: number | null;
  didLeaveApp: boolean;
}

const SocialBrandIcon: React.FC<{ platform: SocialPlatform }> = ({ platform }) => {
  switch (platform) {
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-sky-400" aria-hidden="true">
          <path d="M21.9 4.6c.3-1.2-.8-2.2-1.9-1.7L2.5 10.1c-1.2.5-1.1 2.2.1 2.6l4.4 1.4 1.7 5.3c.3 1 1.6 1.3 2.4.6l2.5-2.3 4.6 3.4c.9.7 2.2.2 2.4-.9l1.3-15.6zm-4.1 3.7-7.7 7-.3 2.8-1.2-3.9 9.2-5.9z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-rose-500" aria-hidden="true">
          <path d="M23 7.1a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.5A3 3 0 0 0 1 7.1C.5 9 .5 12 .5 12s0 3 .5 4.9a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.9.5-4.9s0-3-.5-4.9zM9.8 15.2V8.8L15.6 12l-5.8 3.2z" />
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-slate-100" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blue-500" aria-hidden="true">
          <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.6V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7.5v3h2.8v8h3.2z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-pink-400 fill-none" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" className="fill-pink-400 stroke-none" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-cyan-300" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      );
  }
};

const getPlatformContainerStyle = (platform: SocialPlatform): string => {
  switch (platform) {
    case 'telegram':
      return 'bg-sky-950/50 border-sky-500/40';
    case 'youtube':
      return 'bg-rose-950/50 border-rose-500/40';
    case 'x':
      return 'bg-slate-900 border-slate-700';
    case 'facebook':
      return 'bg-blue-950/50 border-blue-500/40';
    case 'instagram':
      return 'bg-pink-950/50 border-pink-500/40';
    case 'tiktok':
      return 'bg-cyan-950/50 border-cyan-500/40';
  }
};

export const MissionsScreen: React.FC = () => {
  const {
    language,
    missions,
    stats,
    claimMissionReward,
    socialTaskCompletions,
    completeSocialTask,
    claimDailyLogin,
    isDailyRewardClaimable,
  } = useGame();

  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'social'>('daily');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  // Social task away-time verification state
  const [verifyingTaskId, setVerifyingTaskId] = useState<string | null>(null);
  const [socialFeedback, setSocialFeedback] = useState<{
    type: 'success' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const pendingAttemptRef = useRef<PendingSocialAttempt | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback(
    (type: 'success' | 'warning' | 'info', message: string, durationMs: number = 6000) => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      setSocialFeedback({ type, message });
      feedbackTimerRef.current = setTimeout(() => {
        setSocialFeedback(null);
      }, durationMs);
    },
    []
  );

  // Format milliseconds into HH:MM:SS
  const formatDuration = (ms: number) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Live 1s ticker for midnight countdown, 24h social refresh timers, and active boost display
  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();
      setNowMs(now.getTime());
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, []);

  // Evaluate pending away-from-app attempt when user returns
  const evaluateReturnFromExternal = useCallback(() => {
    let pending = pendingAttemptRef.current;
    if (!pending) {
      try {
        const raw = localStorage.getItem(PENDING_SOCIAL_KEY);
        if (raw) pending = JSON.parse(raw) as PendingSocialAttempt;
      } catch {
        pending = null;
      }
    }
    if (!pending) return;

    const now = Date.now();

    // Ignore immediate focus jitter within first 350ms of clicking the link
    if (!pending.didLeaveApp && now - pending.clickedAt < 350) {
      return;
    }

    // If user never left the app at all, do NOT count as completed
    if (!pending.didLeaveApp || !pending.leftAppAt) {
      return;
    }

    const awayMs = now - pending.leftAppAt;

    // Clear pending tracking once evaluated upon return
    pendingAttemptRef.current = null;
    setVerifyingTaskId(null);
    try {
      localStorage.removeItem(PENDING_SOCIAL_KEY);
    } catch {}

    if (awayMs < SOCIAL_MIN_AWAY_MS) {
      const secsStr = Math.max(0.1, awayMs / 1000).toFixed(1);
      sounds.playError();
      showFeedback('warning', t.missions.socialEarlyReturn.replace('{sec}', secsStr), 7000);
      return;
    }

    const task = SOCIAL_TASKS.find((item) => item.id === pending!.taskId);
    const res = completeSocialTask(pending.taskId);
    if (res.success && task) {
      const taskTitle = language === 'ar' ? task.titleAr : task.title;
      showFeedback(
        'success',
        t.missions.socialSuccessToast
          .replace('{title}', taskTitle)
          .replace('{mult}', String(res.newMultiplier)),
        7000
      );
    }
  }, [completeSocialTask, language, showFeedback, t.missions.socialEarlyReturn, t.missions.socialSuccessToast]);

  // Restore any pending social attempt on mount (in case OS reloaded webview after app switch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDING_SOCIAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PendingSocialAttempt;
        // Only evaluate attempts from the last 15 minutes
        if (parsed && parsed.taskId && Date.now() - parsed.clickedAt < 15 * 60 * 1000) {
          pendingAttemptRef.current = parsed;
          if (parsed.didLeaveApp && parsed.leftAppAt) {
            evaluateReturnFromExternal();
          } else {
            setVerifyingTaskId(parsed.taskId);
          }
        } else {
          localStorage.removeItem(PENDING_SOCIAL_KEY);
        }
      }
    } catch {}
  }, [evaluateReturnFromExternal]);

  // Attach visibilitychange / blur / focus / pagehide listeners to track leaving & returning
  useEffect(() => {
    const markLeftApp = () => {
      const pending = pendingAttemptRef.current;
      if (pending && !pending.didLeaveApp) {
        pending.didLeaveApp = true;
        pending.leftAppAt = Date.now();
        try {
          localStorage.setItem(PENDING_SOCIAL_KEY, JSON.stringify(pending));
        } catch {}
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        markLeftApp();
      } else if (document.visibilityState === 'visible') {
        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            evaluateReturnFromExternal();
          }
        }, 120);
      }
    };

    const handleWindowBlur = () => {
      markLeftApp();
    };

    const handleWindowFocus = () => {
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          evaluateReturnFromExternal();
        }
      }, 150);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('pagehide', markLeftApp);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('pageshow', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('pagehide', markLeftApp);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('pageshow', handleWindowFocus);
    };
  }, [evaluateReturnFromExternal]);

  const handleStartSocialTask = (task: SocialTask, isOnCooldown: boolean) => {
    if (isOnCooldown) return;
    const attempt: PendingSocialAttempt = {
      taskId: task.id,
      clickedAt: Date.now(),
      leftAppAt: null,
      didLeaveApp: false,
    };
    pendingAttemptRef.current = attempt;
    setVerifyingTaskId(task.id);
    try {
      localStorage.setItem(PENDING_SOCIAL_KEY, JSON.stringify(attempt));
    } catch {}
    showFeedback('info', t.missions.socialWaitPrompt, 8000);
  };

  const filteredMissions = missions.filter((m) => m.frequency === activeTab);

  // Determine current active day in 7-day cycle
  const activeDayIndex = ((stats.loginStreak - 1) % 7) + 1;
  const lastClaimedDayIndex = ((stats.loginStreak - 2 + 7) % 7) + 1;

  // Social task metrics
  const completedSocialCount = SOCIAL_TASKS.filter((task) => {
    const ts = socialTaskCompletions[task.id] || 0;
    return ts > 0 && nowMs - ts < SOCIAL_TASK_COOLDOWN_MS;
  }).length;
  const availableSocialCount = SOCIAL_TASKS.length - completedSocialCount;
  const boosterRemainingMs = Math.max(0, (stats.activeBoosterExpiresAt || 0) - nowMs);
  const isBoosterActive = boosterRemainingMs > 0;

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] px-4 py-3 pb-24 max-w-md mx-auto">
      {/* Title */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-100">{t.missions.title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{t.missions.subtitle}</p>
      </div>

      {/* 7-Day Login Calendar Card */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-slate-200">{t.missions.dailyLogin}</h2>
          </div>
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/40">
            {isDailyRewardClaimable
              ? `Day ${activeDayIndex} of 7`
              : `Day ${lastClaimedDayIndex} Claimed ✓`}
          </span>
        </div>

        {/* 7 Day Blocks Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {DAILY_LOGIN_REWARDS.map((reward) => {
            const isClaimed = isDailyRewardClaimable
              ? reward.day < activeDayIndex
              : reward.day <= lastClaimedDayIndex;
            const isToday = isDailyRewardClaimable && reward.day === activeDayIndex;

            return (
              <div
                key={reward.day}
                className={`relative rounded-xl p-2 flex flex-col items-center justify-between border text-center transition-all ${
                  isToday
                    ? 'glass-panel-gold border-amber-400 shadow-md shadow-amber-500/20 scale-105 ring-1 ring-amber-400/50'
                    : isClaimed
                    ? 'bg-slate-900/60 border-emerald-800/40 opacity-80'
                    : 'bg-slate-950 border-slate-800/60 opacity-60'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400">
                  {t.missions.day} {reward.day}
                </span>

                <div className="my-1 text-base">
                  {isClaimed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isToday ? (
                    '🎁'
                  ) : (
                    '🔒'
                  )}
                </div>

                <div className="text-[10px] font-mono font-bold text-amber-300">
                  +{reward.points >= 1000 ? `${reward.points / 1000}k` : reward.points}
                </div>

                {isToday ? (
                  <button
                    onClick={claimDailyLogin}
                    className="w-full mt-1.5 py-1 rounded bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider hover:brightness-110 active:scale-95 shadow-sm shadow-amber-500/40"
                  >
                    {t.missions.claim}
                  </button>
                ) : isClaimed ? (
                  <span className="w-full mt-1.5 py-0.5 text-center text-emerald-400 font-bold text-[8px] bg-emerald-950/40 rounded border border-emerald-900/30">
                    {t.missions.claimed}
                  </span>
                ) : (
                  <span className="w-full mt-1.5 py-0.5 text-center text-slate-600 font-medium text-[8px]">
                    Day {reward.day}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Status / Countdown Banner */}
        {!isDailyRewardClaimable ? (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300 font-medium">
                {language === 'ar' ? 'مكافأة الغد تفتح خلال:' : 'Next Streak Reward Unlocks In:'}
              </span>
            </div>
            <span className="text-xs font-mono font-bold tabular-nums text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
              {timeLeft}
            </span>
          </div>
        ) : (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-200 font-bold">
                {language === 'ar' ? 'مكافأتك اليومية جاهزة للاستلام الآن!' : 'Your daily login reward is ready to claim!'}
              </span>
            </div>
            <button
              onClick={claimDailyLogin}
              className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95"
            >
              {t.missions.claim}
            </button>
          </div>
        )}
      </div>

      {/* Pi Ad Network: 3-Hour Rewarded Video Card */}
      <div className="relative overflow-hidden rounded-2xl p-4 border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-slate-900/80 to-slate-950 mb-4 shadow-lg shadow-purple-950/30">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-purple-200">
                  {language === 'ar' ? 'شبكة إعلانات باي: دفعة طاقة' : 'Pi Ad Network: Power Surge'}
                </h2>
                <span className="text-[9px] font-bold text-purple-300 bg-purple-900/60 px-1.5 py-0.5 rounded-full border border-purple-700/50">
                  {language === 'ar' ? 'كل 3 ساعات' : '3-Hour Cooldown'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {language === 'ar'
                  ? 'شاهد إعلان باي واحصل فوراً على نقاط وبذور ومضاعف نقر مضاعف 2x لمدة 30 دقيقة'
                  : 'Watch an official Pi video ad to claim bonus points, seeds & a 30m 2x boost'}
              </p>
            </div>
          </div>
        </div>

        {/* Reward tags */}
        <div className="flex items-center gap-2 my-2.5">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-mono font-bold">
            <span>+2,500 π</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-950/40 border border-yellow-800/40 text-yellow-300 text-xs font-mono font-bold">
            <span>+2 🌰</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/50 border border-purple-700/50 text-purple-300 text-xs font-bold">
            <Zap className="w-3 h-3 text-purple-400" />
            <span>2x Boost (30m)</span>
          </div>
        </div>

        {/* Action Button: Safely Frozen Pending Pi Core Team Review */}
        <div className="mt-2 space-y-2">
          <button
            disabled={true}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-slate-800/80 border border-slate-700/60 text-slate-400 cursor-not-allowed opacity-90 shadow-inner"
          >
            <Clock className="w-4 h-4 text-purple-400" />
            <span>
              {language === 'ar'
                ? 'إعلانات باي: مجمدة مؤقتاً (قيد مراجعة فريق باي)'
                : 'Pi Ads: Temporarily Frozen (In Review by Pi Core Team)'}
            </span>
          </button>
          <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-800/30 text-[11px] text-purple-300/90 flex items-start gap-2">
            <span className="font-bold text-amber-400 shrink-0">ℹ️</span>
            <span>
              {language === 'ar'
                ? 'إعلانات مكافآت باي الرسمية تخضع لمراجعة واعتماد فريق باي الأساسي. تم تجميد الزر لحماية استقرار اللعبة، وسيتفعل فور اعتماد وحدة الإعلانات للتطبيق.'
                : 'Official Pi Rewarded Video Ads are currently under review by the Pi Core Team. This feature is safely paused to prevent glitches and will automatically activate once approved.'}
            </span>
          </div>
        </div>
      </div>

      {/* 3-Tab Selector: Daily / Weekly / Social Tasks */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-4">
        <button
          onClick={() => setActiveTab('daily')}
          className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all truncate ${
            activeTab === 'daily'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.missions.dailyTab}
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all truncate ${
            activeTab === 'weekly'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.missions.weeklyTab}
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 truncate ${
            activeTab === 'social'
              ? 'bg-cyan-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-3 h-3 shrink-0" />
          <span className="truncate">{t.missions.socialTab}</span>
          {availableSocialCount > 0 && activeTab !== 'social' && (
            <span className="text-[9px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-300">
              {availableSocialCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'social' ? (
        <div className="flex flex-col gap-3">
          {/* Cumulative Boost Summary Card */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-purple-950/30 border border-cyan-500/30">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h2 className="text-sm font-bold text-cyan-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>{t.missions.socialTitle}</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {t.missions.socialSubtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">{t.missions.socialCompletedCount}</div>
                <div className="text-sm font-mono font-black text-cyan-300 mt-0.5 tabular-nums">
                  {completedSocialCount} / {SOCIAL_TASKS.length}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">{t.missions.socialActiveBoost}</div>
                {isBoosterActive ? (
                  <div className="text-xs font-mono font-black text-amber-300 mt-0.5 tabular-nums">
                    {stats.activeBoosterMultiplier}x · {formatDuration(boosterRemainingMs)}
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    {t.missions.socialNoBoost}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2.5 text-[11px] text-emerald-300/90 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t.missions.socialCumulativeNote}</span>
            </div>
          </div>

          {/* Away-Time Verification Feedback Banner */}
          {socialFeedback && (
            <div
              className={`rounded-xl p-3 border text-xs flex items-start gap-2.5 ${
                socialFeedback.type === 'success'
                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                  : socialFeedback.type === 'warning'
                  ? 'bg-rose-950/70 border-rose-500/60 text-rose-200'
                  : 'bg-cyan-950/70 border-cyan-500/60 text-cyan-200'
              }`}
            >
              {socialFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : socialFeedback.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed font-medium">{socialFeedback.message}</span>
            </div>
          )}

          {/* 6 Official Social Tasks */}
          {SOCIAL_TASKS.map((task) => {
            const lastDoneAt = socialTaskCompletions[task.id] || 0;
            const cooldownRemaining = Math.max(0, lastDoneAt + SOCIAL_TASK_COOLDOWN_MS - nowMs);
            const isCompletedToday = lastDoneAt > 0 && cooldownRemaining > 0;
            const isVerifying = verifyingTaskId === task.id;

            const title = language === 'ar' ? task.titleAr : task.title;
            const desc = language === 'ar' ? task.descriptionAr : task.description;
            const actionLabel = language === 'ar' ? task.actionLabelAr : task.actionLabel;

            return (
              <div
                key={task.id}
                className={`glass-panel rounded-2xl p-3.5 border transition-all ${
                  isCompletedToday
                    ? 'border-emerald-800/40 opacity-80'
                    : isVerifying
                    ? 'border-cyan-400/70 bg-cyan-950/15'
                    : 'border-slate-800/80 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${getPlatformContainerStyle(
                        task.platform
                      )}`}
                    >
                      <SocialBrandIcon platform={task.platform} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-100">{title}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>

                  <span className="shrink-0 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/50 border border-amber-700/40 px-2 py-0.5 rounded-lg">
                    {t.missions.socialRewardBadge}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between gap-2">
                  {isCompletedToday ? (
                    <>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>
                          {t.missions.socialResetsIn}{' '}
                          <strong className="text-emerald-300">
                            {formatDuration(cooldownRemaining)}
                          </strong>
                        </span>
                      </div>

                      <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/40 text-emerald-300 font-bold text-[11px] flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.missions.claimed}</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {isVerifying ? t.missions.socialChecking : '5s+ external visit'}
                      </span>

                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleStartSocialTask(task, false)}
                        className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                      >
                        <span>{actionLabel}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Daily / Weekly Missions List */
        <div className="flex flex-col gap-3">
          {filteredMissions.map((mission) => {
            const progressPercent = Math.min(
              100,
              Math.round((mission.currentProgress / mission.targetCount) * 100)
            );
            const title = language === 'ar' ? mission.titleAr : mission.title;
            const desc = language === 'ar' ? mission.descriptionAr : mission.description;

            return (
              <div
                key={mission.id}
                className={`glass-panel rounded-2xl p-3.5 border transition-all ${
                  mission.isClaimed
                    ? 'border-slate-800/40 opacity-60'
                    : mission.isCompleted
                    ? 'border-amber-500/60 shadow-sm shadow-amber-500/10'
                    : 'border-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-100">{title}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                    </div>
                  </div>

                  {/* Reward Callout */}
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-mono font-bold text-amber-400">
                      +{mission.rewardPoints.toLocaleString()} π
                    </div>
                    {mission.rewardSeeds > 0 && (
                      <div className="text-[10px] font-semibold text-amber-300">
                        +{mission.rewardSeeds} 🌰
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress and Claim Button */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex-1">
                    <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span>{t.missions.progress}</span>
                      <span>
                        {mission.currentProgress} / {mission.targetCount} ({progressPercent}%)
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {mission.isClaimed ? (
                      <span className="text-[11px] font-bold text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-900/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.missions.claimed}</span>
                      </span>
                    ) : mission.isCompleted ? (
                      <button
                        type="button"
                        onClick={() => claimMissionReward(mission.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/30 hover:brightness-110 active:scale-95 transition-all outline-none focus:outline-none focus:ring-0 active:outline-none select-none"
                      >
                        {t.missions.claim}
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 px-3 py-1">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
