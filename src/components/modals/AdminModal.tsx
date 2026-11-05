import React, { useState } from 'react';
import { X, ShieldAlert, Sliders, Bell, Activity, Check, Database } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { isSupabaseConfigured } from '../../services/supabaseClient';

interface AdminModalProps {
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ onClose }) => {
  const { language, adminSettings, updateAdminSettings } = useGame();
  const t = translations[language];

  const [tapMult, setTapMult] = useState(adminSettings.tapMultiplier);
  const [passiveMult, setPassiveMult] = useState(adminSettings.passiveMultiplier);
  const [broadcast, setBroadcast] = useState(adminSettings.broadcastNotice);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateAdminSettings({
      tapMultiplier: Number(tapMult),
      passiveMultiplier: Number(passiveMult),
      broadcastNotice: broadcast,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const auditLogs = [
    { time: '10:42:01', action: 'TAP_BATCH_VERIFY', player: 'Pioneer_Chief', status: 'VERIFIED' },
    { time: '10:41:15', action: 'UPGRADE_PURCHASE', player: 'CryptoPioneer99', status: 'SUCCESS' },
    { time: '10:40:22', action: 'MINIGAME_SCORE', player: 'StarMiner_Pi', status: 'VERIFIED_320' },
    { time: '10:39:50', action: 'PI_TOKEN_VERIFY', player: 'PiOverlord_77', status: 'AUTHENTICATED' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden pb-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold text-slate-100">{t.admin.title}</h2>
              <span className="text-[10px] text-amber-400 font-mono">{t.admin.badge}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Ecosystem Metrics Strip */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="glass-panel rounded-xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400">{t.admin.activePlayers}</div>
              <div className="text-base font-bold font-mono text-slate-100 mt-0.5">148,290</div>
            </div>
            <div className="glass-panel rounded-xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400">{t.admin.dailyActive}</div>
              <div className="text-base font-bold font-mono text-purple-300 mt-0.5">42,150 DAU</div>
            </div>
            <div className="glass-panel rounded-xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400">{t.admin.totalPointsMinted}</div>
              <div className="text-base font-bold font-mono text-amber-400 mt-0.5">18.4M π</div>
            </div>
            <div className="glass-panel rounded-xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400">{t.admin.suspiciousFlags}</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">0 Clean</div>
            </div>
          </div>

          {/* Database & Cloud Status */}
          <div className="glass-panel rounded-xl p-3 border border-slate-800 mb-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Supabase PostgreSQL Sync</span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                  : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
              }`}
            >
              {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL CACHE READY'}
            </span>
          </div>

          {/* Economy Multipliers */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-slate-200">{t.admin.economyControls}</h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{t.admin.tapRateMult}</span>
                  <span className="font-mono font-bold text-amber-400">{tapMult}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.5"
                  value={tapMult}
                  onChange={(e) => setTapMult(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{t.admin.passiveMult}</span>
                  <span className="font-mono font-bold text-purple-400">{passiveMult}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.5"
                  value={passiveMult}
                  onChange={(e) => setPassiveMult(parseFloat(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Broadcast Announcement */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-slate-200">{t.admin.broadcastMessage}</h3>
            </div>
            <textarea
              value={broadcast}
              onChange={(e) => setBroadcast(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            />
            <button
              onClick={handleSave}
              className="w-full mt-2.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{saved ? 'Settings Updated!' : t.admin.saveChanges}</span>
            </button>
          </div>

          {/* Live Security Audit Logs */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t.admin.liveLogs}
              </h3>
            </div>

            <div className="flex flex-col gap-1.5 font-mono text-[11px]">
              {auditLogs.map((log, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-slate-300"
                >
                  <span className="text-slate-500">{log.time}</span>
                  <span className="text-amber-400 font-bold">{log.action}</span>
                  <span className="text-slate-300 truncate max-w-[90px]">{log.player}</span>
                  <span className="text-emerald-400 text-[10px]">{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
