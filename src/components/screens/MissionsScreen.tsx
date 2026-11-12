import React, { useState, useEffect } from 'react';
import { CheckSquare, Calendar, Gift, Sparkles, CheckCircle2, Clock, Play, Tv, Zap } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { DAILY_LOGIN_REWARDS } from '../../data/initialData';

export const MissionsScreen: React.FC = () => {
  const {
    language,
    missions,
    stats,
    claimMissionReward,
    claimDailyLogin,
    isDailyRewardClaimable,
    isAdWatching,
    adCooldownRemainingMs,
    watchRewardedAd,
  } = useGame();

  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [adFeedback, setAdFeedback] = useState<string | null>(null);

  // Helper to format remaining cooldown milliseconds into HH:MM:SS
  const formatCooldown = (ms: number) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleWatchAd = async () => {
    setAdFeedback(null);
    const result = await watchRewardedAd();
    if (!result.success && result.error) {
      setAdFeedback(result.error);
      setTimeout(() => setAdFeedback(null), 4000);
    }
  };

  // Live countdown until midnight (next calendar day)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredMissions = missions.filter((m) => m.frequency === activeTab);

  // Determine current active day in 7-day cycle
  const activeDayIndex = ((stats.loginStreak - 1) % 7) + 1;
  const lastClaimedDayIndex = ((stats.loginStreak - 2 + 7) % 7) + 1;

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
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">
                {language === 'ar' ? 'مكافأة الغد تفتح خلال:' : 'Next Streak Reward Unlocks In:'}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
              {timeLeft}
            </span>
          </div>
        ) : (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
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

        {/* Reward pills */}
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

      {/* Daily / Weekly Selector */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-4">
        <button
          onClick={() => setActiveTab('daily')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'daily'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.missions.dailyTab}
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'weekly'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.missions.weeklyTab}
        </button>
      </div>

      {/* Missions List */}
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
    </div>
  );
};
