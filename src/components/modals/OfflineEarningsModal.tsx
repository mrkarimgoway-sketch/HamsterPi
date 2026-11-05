import React from 'react';
import { Sparkles, Clock, Coins } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';

export const OfflineEarningsModal: React.FC = () => {
  const { language, offlineEarnings, dismissOfflineEarnings } = useGame();
  const t = translations[language];

  if (!offlineEarnings) return null;

  const hours = Math.floor(offlineEarnings.seconds / 3600);
  const minutes = Math.floor((offlineEarnings.seconds % 3600) / 60);

  const durationStr =
    hours > 0
      ? `${hours}h ${minutes}m`
      : `${Math.max(1, minutes)}m`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-sm glass-panel-gold border-2 border-amber-500/60 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-purple-600/20 blur-2xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30">
          🐹
        </div>

        <h2 className="text-lg font-bold text-amber-300">{t.game.offlineEarningTitle}</h2>
        <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
          {t.game.offlineEarningDesc}
        </p>

        {/* Big Points Reveal */}
        <div className="my-4 p-4 rounded-2xl bg-slate-950/70 border border-amber-500/40">
          <div className="text-3xl font-mono font-black text-amber-400 tracking-tight">
            +{offlineEarnings.points.toLocaleString()} π
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Accumulated over {durationStr} away</span>
          </div>
        </div>

        <button
          onClick={dismissOfflineEarnings}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
        >
          {t.game.claimOffline}
        </button>
      </div>
    </div>
  );
};
