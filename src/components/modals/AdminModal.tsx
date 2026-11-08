import React, { useState } from 'react';
import { X, ShieldAlert, Sliders, Bell, Activity, Check, Database } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { piNetwork } from '../../services/piNetwork';

interface AdminModalProps {
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ onClose }) => {
  const { language, adminSettings, updateAdminSettings } = useGame();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'overview' | 'projects'>('overview');
  const [tapMult, setTapMult] = useState(adminSettings.tapMultiplier);
  const [passiveMult, setPassiveMult] = useState(adminSettings.passiveMultiplier);
  const [broadcast, setBroadcast] = useState(adminSettings.broadcastNotice);
  const [saved, setSaved] = useState(false);
  const [isAdminTestnet, setIsAdminTestnet] = useState(piNetwork.getIsSandbox());

  const handleNetworkSwitch = (toTestnet: boolean) => {
    setIsAdminTestnet(toTestnet);
    piNetwork.setSandboxMode(toTestnet);
  };

  // Administrative Project States
  const [projectGoals, setProjectGoals] = useState({
    pimind_ai: 300000,
    pi_battle_arena: 1000000,
  });
  const [projectStatus, setProjectStatus] = useState({
    pimind_ai: 'ACTIVE',
    pi_battle_arena: 'ACTIVE',
  });

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
    { time: '10:39:50', action: 'PROJECT_INTENT_AUDIT', player: 'PiMind_Pioneer', status: 'LOGGED_RECOVERY' },
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

        {/* Sub-Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-slate-800">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              System & Economy
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'projects'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Projects Admin
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeTab === 'projects' ? (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200">
                <span className="font-bold text-amber-300">Database Schema Notice:</span>
                <p className="mt-0.5 text-[11px] text-slate-300">
                  Project configuration is active in server runtime. Live multi-admin database persistence will link to table <code className="text-amber-400">public.projects</code> and <code className="text-amber-400">public.project_contributions</code> once consolidated SQL is activated.
                </p>
              </div>

              {/* PiMind AI Admin Card */}
              <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-xs font-black text-cyan-300">
                      AI
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">PiMind AI</h4>
                      <span className="text-[10px] text-cyan-400 font-mono">ID: pimind_ai</span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setProjectStatus((prev) => ({
                        ...prev,
                        pimind_ai: prev.pimind_ai === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
                      }))
                    }
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      projectStatus.pimind_ai === 'ACTIVE'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                    }`}
                  >
                    {projectStatus.pimind_ai}
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold">Funding Target (Pi)</label>
                  <input
                    type="number"
                    value={projectGoals.pimind_ai}
                    onChange={(e) =>
                      setProjectGoals((prev) => ({ ...prev, pimind_ai: Number(e.target.value) }))
                    }
                    className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* Pi Battle Arena Admin Card */}
              <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-500/40 flex items-center justify-center text-xs font-black text-amber-300">
                      ⚔️
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">Pi Battle Arena</h4>
                      <span className="text-[10px] text-amber-400 font-mono">ID: pi_battle_arena</span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setProjectStatus((prev) => ({
                        ...prev,
                        pi_battle_arena: prev.pi_battle_arena === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
                      }))
                    }
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      projectStatus.pi_battle_arena === 'ACTIVE'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                    }`}
                  >
                    {projectStatus.pi_battle_arena}
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold">Funding Target (Pi)</label>
                  <input
                    type="number"
                    value={projectGoals.pi_battle_arena}
                    onChange={(e) =>
                      setProjectGoals((prev) => ({ ...prev, pi_battle_arena: Number(e.target.value) }))
                    }
                    className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
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
          <div className="glass-panel rounded-xl p-3 border border-slate-800 mb-2 flex items-center justify-between text-xs">
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

          {/* Pi Network Platform Backend Status */}
          <div className="glass-panel rounded-xl p-3 border border-slate-800 mb-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-bold text-amber-400">π</span>
              <span>Pi Platform API / Payments</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-purple-950/60 text-purple-300 border border-purple-800/40">
              ACTIVE V2
            </span>
          </div>

          {/* Developer / Admin Pi Blockchain Target Control */}
          <div className="glass-panel rounded-xl p-3 border border-slate-800 mb-4 text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="text-amber-400 font-bold">⚡</span>
                <span className="font-bold">Pi Blockchain Target</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isAdminTestnet
                    ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                    : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                }`}
              >
                {isAdminTestnet ? 'TESTNET' : 'MAINNET LIVE'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => handleNetworkSwitch(true)}
                className={`py-1.5 px-2 rounded-lg font-bold text-xs border transition-all ${
                  isAdminTestnet
                    ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                Testnet (Active)
              </button>
              <button
                type="button"
                onClick={() => handleNetworkSwitch(false)}
                className={`py-1.5 px-2 rounded-lg font-bold text-xs border transition-all ${
                  !isAdminTestnet
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                Mainnet Live
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              {isAdminTestnet
                ? 'Transactions route to the official Pi Testnet blockchain for 5-wallet verification.'
                : 'Transactions route to real Pi Mainnet. (Requires approved Mainnet App Wallet from Core Team).'}
            </p>
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
        </>
      )}
    </div>
  </div>
</div>
  );
};
