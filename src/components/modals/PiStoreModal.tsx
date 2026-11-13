import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Crown,
  Eye,
  Coins,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  Copy,
  Check,
  Frame,
  Cpu,
  Atom,
  BatteryCharging,
  Lock,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';
import {
  AVATAR_FRAMES,
  AvatarFrameId,
  PI_PRODUCTS,
  PiProduct,
  formatPiPrice,
} from '../../data/piProducts';
import { HAMSTER_SKINS } from '../../data/initialData';

interface PiStoreModalProps {
  onClose: () => void;
}

export const PiStoreModal: React.FC<PiStoreModalProps> = ({ onClose }) => {
  const {
    language,
    activeSkin,
    isPiConnected,
    isPiBrowser,
    connectPiAccount,
    paymentStatus,
    purchasePiProduct,
    paymentHistory,
    stats,
    equippedFrame,
    unlockedFrames,
    purchasedOneTimeIds,
    equipFrame,
  } = useGame();

  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'boosters' | 'exclusives' | 'history'>('boosters');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const skinImg = HAMSTER_SKINS[activeSkin]?.image || '/images/hamster_mascot_default_1793717666154.jpg';

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'Crown':
        return <Crown className="w-6 h-6 text-amber-300" />;
      case 'Eye':
        return <Eye className="w-6 h-6 text-cyan-300" />;
      case 'Coins':
        return <Coins className="w-6 h-6 text-amber-400" />;
      case 'Frame':
        return <Frame className="w-6 h-6 text-cyan-300" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      case 'Atom':
        return <Atom className="w-6 h-6 text-purple-300" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-6 h-6 text-emerald-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-purple-400" />;
    }
  };

  const handleBuy = async (product: PiProduct) => {
    if (product.oneTimeOnly && purchasedOneTimeIds.includes(product.id)) {
      return;
    }
    setSelectedProductId(product.id);
    await purchasePiProduct(product);
  };

  const copyPiBrowserUrl = () => {
    const currentUrl = window.location.href;
    const piUrl = currentUrl.startsWith('https://')
      ? currentUrl.replace('https://', 'pi://')
      : currentUrl;
    navigator.clipboard.writeText(piUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isBoosterActive = Boolean(
    stats.activeBoosterExpiresAt && Date.now() < stats.activeBoosterExpiresAt
  );

  const visibleProducts = PI_PRODUCTS.filter((p) =>
    activeTab === 'exclusives' ? p.tab === 'exclusives' : p.tab === 'boosters'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-950 border border-purple-900/60 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden pb-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-gradient-to-r from-purple-950/60 to-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-amber-300 font-black text-lg">
              π
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{t.piStore.title}</h2>
              <p className="text-[10px] text-purple-300 font-medium">0.001 π – 1.0 π Official Store</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Tab Switcher */}
        <div className="px-4 pt-3">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('boosters')}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all truncate ${
                activeTab === 'boosters'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.piStore.tabBoosters}
            </button>
            <button
              onClick={() => setActiveTab('exclusives')}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 truncate ${
                activeTab === 'exclusives'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Frame className="w-3 h-3 shrink-0" />
              <span className="truncate">{t.piStore.tabExclusives}</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 truncate ${
                activeTab === 'history'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3 h-3 shrink-0" />
              <span className="truncate">{t.piStore.txHistory}</span>
            </button>
          </div>
        </div>

        {/* Payment Processing Banner */}
        {paymentStatus.isProcessing && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-purple-950/80 border border-purple-500 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-purple-300 animate-spin shrink-0" />
            <div className="text-xs text-purple-200 font-medium truncate">
              {paymentStatus.message || t.piStore.processing}
            </div>
          </div>
        )}

        {paymentStatus.step === 'success' && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/80 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-emerald-200 font-medium">
              <span className="font-bold">{t.piStore.successTitle}</span> {t.piStore.successDesc}
            </div>
          </div>
        )}

        {paymentStatus.step === 'error' && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-950/80 border border-rose-500/80 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-xs text-rose-200 font-medium">
              <span className="font-bold">Error:</span> {paymentStatus.error}
            </div>
          </div>
        )}

        {paymentStatus.step === 'cancelled' && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-slate-300 font-medium">
              <span className="font-bold">{t.piStore.cancelledTitle}</span> {t.piStore.cancelledDesc}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Pi Browser Notice if outside Pi Browser */}
          {!isPiBrowser && activeTab !== 'history' && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-amber-950/40 border border-amber-600/40">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300">Pi Browser Environment Required</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    {t.piStore.piBrowserNotice}
                  </p>
                  <button
                    onClick={copyPiBrowserUrl}
                    className="mt-2.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? t.piStore.copied : t.piStore.copyPiUrl}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Booster Notice */}
          {isBoosterActive && activeTab === 'boosters' && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between text-xs text-amber-300 font-bold">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-amber-400" />
                <span>3X Multiplier Active!</span>
              </div>
              <span className="text-[10px] text-amber-400/80 font-mono">
                {Math.round(((stats.activeBoosterExpiresAt || 0) - Date.now()) / (1000 * 60))} mins left
              </span>
            </div>
          )}

          {/* One-time Exclusive Tab Info */}
          {activeTab === 'exclusives' && (
            <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 flex items-start gap-2.5 text-[11px] text-amber-200/90 leading-relaxed">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{t.piStore.oneTimeNotice}</span>
            </div>
          )}

          {activeTab !== 'history' ? (
            <div className="space-y-3">
              {visibleProducts.map((product) => {
                const title = language === 'ar' ? product.nameAr : product.name;
                const desc = language === 'ar' ? product.descriptionAr : product.description;
                const badgeText = language === 'ar' ? product.badgeAr || product.badge : product.badge;
                const priceDisplay = formatPiPrice(product.pricePi);
                const isBuying = paymentStatus.isProcessing && selectedProductId === product.id;

                const frameId = product.rewardPayload.frameId;
                const frameConfig = frameId ? AVATAR_FRAMES[frameId as AvatarFrameId] : null;
                const isFrameOwned = Boolean(frameId && unlockedFrames.includes(frameId));
                const isOwned = Boolean(
                  product.oneTimeOnly && (purchasedOneTimeIds.includes(product.id) || isFrameOwned)
                );
                const isEquipped = Boolean(frameId && equippedFrame === frameId);

                return (
                  <div
                    key={product.id}
                    className={`glass-panel rounded-2xl p-4 border transition-all ${
                      isOwned
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-slate-800 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Visual Preview: Frame Avatar preview or Product Icon */}
                        {frameConfig ? (
                          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                            <img
                              src={skinImg}
                              alt={title}
                              referrerPolicy="no-referrer"
                              className={`w-11 h-11 rounded-full object-cover ${frameConfig.ringClass}`}
                            />
                            {frameConfig.badgeText && (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-[9px]">
                                {frameConfig.badgeText}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-950 to-slate-900 border border-purple-800/60 flex items-center justify-center shrink-0 shadow-inner">
                            {getProductIcon(product.icon)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-100">{title}</h3>
                            {badgeText && (
                              <span className="text-[9px] font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                                {badgeText}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-900">
                      <div className="flex items-center gap-1 font-mono text-base font-black text-amber-400 tabular-nums">
                        <span className="text-purple-400">π</span>
                        <span>{priceDisplay}</span>
                      </div>

                      {isOwned ? (
                        <div className="flex items-center gap-2">
                          {frameId && (
                            <button
                              onClick={() => equipFrame(isEquipped ? 'none' : frameId)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                                isEquipped
                                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                              }`}
                            >
                              {isEquipped ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{t.piStore.equipped}</span>
                                </>
                              ) : (
                                <span>{t.piStore.equip}</span>
                              )}
                            </button>
                          )}

                          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.piStore.owned}</span>
                          </span>
                        </div>
                      ) : isPiConnected ? (
                        <button
                          onClick={() => handleBuy(product)}
                          disabled={paymentStatus.isProcessing}
                          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                            paymentStatus.isProcessing
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-900/30 active:scale-95'
                          }`}
                        >
                          {isBuying ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{t.piStore.processing}</span>
                            </>
                          ) : (
                            <span>{t.piStore.payWithPi.replace('{amount}', priceDisplay)}</span>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => connectPiAccount(true)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-purple-800/60 text-purple-300 font-bold text-xs flex items-center gap-1"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>{t.piStore.loginToBuy}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {paymentHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p>{t.piStore.noHistory}</p>
                </div>
              ) : (
                paymentHistory.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-200 truncate max-w-[180px]">
                        {rec.memo || 'Pi In-Game Purchase'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {rec.created_at ? new Date(rec.created_at).toLocaleDateString() : 'Recent'} · ID:{' '}
                        {rec.pi_payment_id.substring(0, 10)}...
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-400 tabular-nums">
                        {formatPiPrice(Number(rec.amount || 0))} π
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          rec.status === 'COMPLETED'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : rec.status === 'APPROVED'
                            ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
