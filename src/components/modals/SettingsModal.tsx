import React, { useState } from 'react';
import { X, Volume2, VolumeX, Smartphone, Globe, Shield, RefreshCw, Lock } from 'lucide-react';
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
  const isTestnet = piNetwork.getIsSandbox();

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
                <div className="text-[10px] text-slate-400">
                  {language === 'ar'
                    ? 'الشبكة المعتمدة رسمياً — تعمل شبكة واحدة فقط في كل مرة'
                    : 'Authoritative network status — one network active at a time'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Testnet Card */}
              <div
                className={`py-2 px-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  isTestnet
                    ? 'bg-purple-950/60 border-purple-500/80 shadow-md shadow-purple-900/30'
                    : 'bg-slate-900/40 border-slate-800/60 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-purple-200 mb-0.5">
                  {isTestnet ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ) : (
                    <Lock className="w-3 h-3 text-slate-500" />
                  )}
                  <span>{t.settings.testnetMode}</span>
                </div>
                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                    isTestnet
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isTestnet ? t.settings.networkActive : t.settings.networkDisabled}
                </span>
              </div>

              {/* Mainnet Card */}
              <div
                className={`py-2 px-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  !isTestnet
                    ? 'bg-amber-950/60 border-amber-500/80 shadow-md shadow-amber-900/30'
                    : 'bg-slate-900/40 border-slate-800/60 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-200 mb-0.5">
                  {!isTestnet ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ) : (
                    <Lock className="w-3 h-3 text-slate-500" />
                  )}
                  <span>{t.settings.productionMode}</span>
                </div>
                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                    !isTestnet
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {!isTestnet ? t.settings.networkActive : t.settings.networkDisabled}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-2.5">
              {isTestnet
                ? language === 'ar'
                  ? '⚡ شبكة الاختبار (Testnet) نشطة رسمياً لمعاملات متصفح باي واختبارات التحقق.'
                  : '⚡ Pi Testnet is active for Pi Browser transactions and 5-wallet verification.'
                : language === 'ar'
                ? '🌟 الشبكة الرئيسية (Mainnet) نشطة لمدفوعات باي الحقيقية الرسمية.'
                : '🌟 Pi Mainnet is live for official real Pi cryptocurrency payments.'}
            </p>
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
