import React, { useState } from 'react';
import { X, Volume2, VolumeX, Smartphone, Globe, Shield, RefreshCw } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import { piNetwork } from '../../services/piNetwork';
import { Language } from '../../types/game';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const {
    language,
    setLanguage,
    isMuted,
    toggleSound,
    hapticEnabled,
    toggleHaptic,
  } = useGame();

  const t = translations[language];
  const [isSandbox, setIsSandbox] = useState(piNetwork.getIsSandbox());

  const handleSandboxToggle = (sandbox: boolean) => {
    setIsSandbox(sandbox);
    piNetwork.setSandboxMode(sandbox);
  };

  const handleClearCache = () => {
    if (window.confirm('Reset local cache and reload game?')) {
      localStorage.removeItem('hamsterpi_save_v2');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden pb-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
          <h2 className="text-base font-bold text-slate-100">{t.settings.title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Audio Toggle */}
          <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-rose-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              )}
              <div>
                <div className="text-xs font-bold text-slate-200">{t.settings.soundEffects}</div>
                <div className="text-[10px] text-slate-400">Web Audio arcade synthesizer</div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isMuted
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {!isMuted ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Haptics Toggle */}
          <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">{t.settings.vibration}</div>
                <div className="text-[10px] text-slate-400">Mobile tactile touch vibration</div>
              </div>
            </div>
            <button
              onClick={toggleHaptic}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                hapticEnabled
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {hapticEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Language Selector */}
          <div className="glass-panel rounded-xl p-3.5 border border-slate-800">
            <div className="flex items-center gap-3 mb-2.5">
              <Globe className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">{t.settings.language}</div>
                <div className="text-[10px] text-slate-400">Instant English & Arabic RTL support</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                  language === 'en'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                English (US)
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                  language === 'ar'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                العربية (RTL)
              </button>
            </div>
          </div>

          {/* Pi Network Environment */}
          <div className="glass-panel rounded-xl p-3.5 border border-slate-800">
            <div className="flex items-center gap-3 mb-2.5">
              <Shield className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">{t.settings.piNetworkMode}</div>
                <div className="text-[10px] text-slate-400">Official Pi Developer SDK config</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleSandboxToggle(true)}
                className={`py-2 px-2 rounded-lg font-bold border text-center transition-all ${
                  isSandbox
                    ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Sandbox Mode
              </button>
              <button
                onClick={() => handleSandboxToggle(false)}
                className={`py-2 px-2 rounded-lg font-bold border text-center transition-all ${
                  !isSandbox
                    ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Mainnet Live
              </button>
            </div>
          </div>

          {/* Reset Cache */}
          <div className="pt-2">
            <button
              onClick={handleClearCache}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-rose-400 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.settings.resetData}</span>
            </button>
          </div>

          {/* Version badge */}
          <div className="text-center text-[10px] text-slate-500 pt-2">
            {t.settings.version}
          </div>
        </div>
      </div>
    </div>
  );
};
