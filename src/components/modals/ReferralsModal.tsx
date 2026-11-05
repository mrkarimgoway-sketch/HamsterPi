import React, { useState } from 'react';
import { X, Users, Copy, Check, Share2, Sparkles, Send } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { translations } from '../../services/i18n';

interface ReferralsModalProps {
  onClose: () => void;
}

export const ReferralsModal: React.FC<ReferralsModalProps> = ({ onClose }) => {
  const { language, profile, referrals, copyReferralLink } = useGame();
  const t = translations[language];

  const [copied, setCopied] = useState(false);

  const referralLink = `https://hamsterpi.app/?ref=${profile.referralCode}`;

  const handleCopy = async () => {
    const success = await copyReferralLink();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `🐹 Join HamsterPi with my referral code ${profile.referralCode} and claim 5,000 free bonus points!\n\nTAP. PLAY. UPGRADE. RULE THE PI WORLD.`
    );
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `🐹 Join HamsterPi with my referral code ${profile.referralCode} and claim 5,000 bonus points! ${referralLink}`
    );
    const url = `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
  };

  const totalBonusEarned = referrals.reduce((sum, r) => sum + r.rewardClaimed, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden pb-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-slate-100">{t.referrals.title}</h2>
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
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {t.referrals.subtitle}
          </p>

          {/* Stats strip */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="glass-panel rounded-xl p-3 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">{t.referrals.totalInvited}</div>
              <div className="text-xl font-bold font-mono text-purple-300 mt-0.5">
                {referrals.length}
              </div>
            </div>

            <div className="glass-panel rounded-xl p-3 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">{t.referrals.totalBonusEarned}</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                +{totalBonusEarned.toLocaleString()} π
              </div>
            </div>
          </div>

          {/* Referral Link Box */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 mb-4">
            <div className="text-xs font-bold text-slate-200 mb-2">{t.referrals.yourLink}</div>
            <div className="flex items-center gap-2 p-2 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="font-mono text-xs text-amber-300 truncate flex-1">
                {referralLink}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.referrals.copied : t.referrals.copyLink}</span>
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={handleShareTelegram}
                className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>
              <button
                onClick={handleShareWhatsapp}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Invited Friends List */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {t.referrals.friendsList} ({referrals.length})
            </h3>

            {referrals.length === 0 ? (
              <div className="text-center p-4 text-xs text-slate-400">
                {t.referrals.noFriendsYet}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {referrals.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-200">{friend.username}</div>
                      <div className="text-[10px] text-slate-400">
                        Joined {friend.joinedAt} · Level {friend.activeLevel}
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-emerald-400">
                      +{friend.rewardClaimed.toLocaleString()} π
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
