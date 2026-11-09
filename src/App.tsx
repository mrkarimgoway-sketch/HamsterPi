import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { HomeScreen } from './components/screens/HomeScreen';
import { GamesScreen } from './components/screens/GamesScreen';
import { UpgradesScreen } from './components/screens/UpgradesScreen';
import { ProjectsScreen } from './components/screens/ProjectsScreen';
import { MissionsScreen } from './components/screens/MissionsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { LeaderboardModal } from './components/modals/LeaderboardModal';
import { ReferralsModal } from './components/modals/ReferralsModal';
import { AdminModal } from './components/modals/AdminModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { OfflineEarningsModal } from './components/modals/OfflineEarningsModal';
import { PiStoreModal } from './components/modals/PiStoreModal';

function GameContent() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showReferrals, setShowReferrals] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPiStore, setShowPiStore] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-purple-900/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 left-1/4 w-[380px] h-[380px] bg-amber-600/10 rounded-full blur-[110px]" />
        <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-indigo-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Main Container Wrapper */}
      <div className="relative z-10 w-full flex-1 flex flex-col">
        {/* Top Header */}
        <Header
          onOpenSettings={() => setShowSettings(true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenReferrals={() => setShowReferrals(true)}
          onOpenPiStore={() => setShowPiStore(true)}
          onOpenProfile={() => setCurrentTab('profile')}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 w-full">
          {currentTab === 'home' && (
            <HomeScreen
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenLeaderboard={() => setShowLeaderboard(true)}
              onOpenDailyModal={() => setCurrentTab('missions')}
            />
          )}
          {currentTab === 'games' && <GamesScreen />}
          {currentTab === 'upgrades' && (
            <UpgradesScreen onOpenPiStore={() => setShowPiStore(true)} />
          )}
          {currentTab === 'projects' && <ProjectsScreen />}
          {currentTab === 'missions' && <MissionsScreen />}
          {currentTab === 'profile' && (
            <ProfileScreen
              onOpenAdmin={() => setShowAdmin(true)}
              onOpenPiStore={() => setShowPiStore(true)}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <Navigation currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />
      </div>

      {/* Modals */}
      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}
      {showReferrals && (
        <ReferralsModal onClose={() => setShowReferrals(false)} />
      )}
      {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showPiStore && <PiStoreModal onClose={() => setShowPiStore(false)} />}
      <OfflineEarningsModal />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
