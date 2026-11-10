import React from 'react';
import { Home, Gamepad2, ArrowUpCircle, CheckSquare, User, Globe } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { translations } from '../services/i18n';

export type TabType = 'home' | 'upgrades' | 'projects' | 'games' | 'missions' | 'profile';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const { language, missions } = useGame();
  const t = translations[language];

  // Check if any mission has an uncollected reward
  const hasClaimableMission = missions.some((m) => m.isCompleted && !m.isClaimed);

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    {
      id: 'home',
      label: t.nav.home,
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'upgrades',
      label: t.nav.upgrades,
      icon: <ArrowUpCircle className="w-4 h-4" />,
    },
    {
      id: 'projects',
      label: t.nav.projects,
      icon: <Globe className="w-4 h-4 text-cyan-300" />,
    },
    {
      id: 'games',
      label: t.nav.games,
      icon: <Gamepad2 className="w-4 h-4" />,
    },
    {
      id: 'missions',
      label: t.nav.missions,
      icon: <CheckSquare className="w-4 h-4" />,
      badge: hasClaimableMission,
    },
    {
      id: 'profile',
      label: t.nav.profile,
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-6 h-16 items-center px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-all outline-none focus:outline-none focus:ring-0 active:outline-none select-none ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <div
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110 -translate-y-0.5' : ''
                  }`}
                >
                  {tab.icon}
                </div>
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-6 h-0.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
