/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Header from './components/Header';
import LobbyScreen from './components/LobbyScreen';
import MatchHistory from './components/MatchHistory';
import Store from './components/Store';
import IntroSplash from './components/IntroSplash';
import LoginScreen from './components/LoginScreen';
import SettingsPanel from './components/SettingsPanel';
import FriendsPanel from './components/FriendsPanel';
import BattlePass from './components/BattlePass';
import { GameMode } from './types';
import { LanguageProvider, useLanguage } from './i18n';

export { toast };

const OVERLAY_HEADER_STYLE = {
  background: 'rgba(8,8,12,0.45)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
};

const OVERLAY_BG = {};

function AppContent() {
  const { t } = useLanguage();
  const [showSplash,     setShowSplash]     = useState(true);
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  const [showSettings,   setShowSettings]   = useState(false);
  const [showFriends,    setShowFriends]    = useState(false);
  const [showBattlePass, setShowBattlePass] = useState(false);
  const [activeView, setActiveView] = useState<'lobby' | 'history' | 'store'>('lobby');

  const GAME_MODES: GameMode[] = [
    {
      id: 'duel',
      title: t('duelTitle'),
      subtitle: t('duelSubtitle'),
      tag: t('duelTag'),
      playersOnline: '2,431',
      buttonText: t('duelButton'),
      buttonType: 'green',
      highlightColor: '#00d26a'
    },
    {
      id: 'tournaments',
      title: t('tournamentsTitle'),
      subtitle: t('tournamentsSubtitle'),
      tag: t('tournamentsTag'),
      statusText: t('tournamentsStatus'),
      buttonText: t('tournamentsButton'),
      buttonType: 'yellow',
      backgroundImage: '/trofeu%20-%20torneio.png',
      highlightColor: '#f8e71c'
    },
    {
      id: 'training',
      title: t('trainingTitle'),
      subtitle: t('trainingSubtitle'),
      tag: t('trainingTag'),
      buttonText: t('trainingButton'),
      buttonType: 'outline',
      backgroundImage: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=1200&auto=format&fit=crop',
      highlightColor: '#ffffff'
    },
    {
      id: 'store',
      title: 'LOJA',
      subtitle: 'ITENS PREMIUM',
      tag: 'OFERTAS',
      buttonText: 'EXPLORAR',
      buttonType: 'outline',
      highlightColor: '#fbbf24'
    }
  ];

  const overlayTransition = { type: 'spring', stiffness: 380, damping: 42 } as const;

  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col select-none font-sans"
    >

        {showSplash && <IntroSplash onComplete={() => setShowSplash(false)} />}

        {/* Main layer */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {!isAuthenticated && !showSplash && (
            <LoginScreen onLogin={() => {
              setIsAuthenticated(true);
              setTimeout(() => toast.success('Bem-vindo de volta, João! 🎱', {
                description: 'Você tem 2 desafios pendentes.',
              }), 400);
            }} />
          )}

          {isAuthenticated && (
            <>
              <Header onOpenSettings={() => setShowSettings(true)} />

              {/* Lobby — always the base content */}
              <main className="flex-1 overflow-hidden relative">
                <LobbyScreen
                  modes={GAME_MODES}
                  onOpenFriends={() => setShowFriends(true)}
                  onViewChange={setActiveView}
                  onOpenBattlePass={() => setShowBattlePass(true)}
                />
              </main>

              <Toaster
                position="top-center"
                toastOptions={{
                  style: {
                    background: '#111',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    borderRadius: '16px',
                  },
                }}
              />

              <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
              <FriendsPanel  isOpen={showFriends}  onClose={() => setShowFriends(false)} />
            </>
          )}
        </div>

        {/* ── Overlays ── */}
        {isAuthenticated && (
          <>
            <BattlePass isOpen={showBattlePass} onClose={() => setShowBattlePass(false)} />

            {/* Store overlay */}
            <AnimatePresence>
              {activeView === 'store' && (
                <motion.div
                  key="store-overlay"
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
                  transition={overlayTransition}
                  className="absolute inset-0 z-[150] flex flex-col overflow-hidden"
                >
                  {/* Wallpaper from the root div shows through */}

                  {/* ── Refined header ── */}
                  <div
                    className="relative flex items-center shrink-0 z-10"
                    style={{
                      paddingTop: 'calc(12px + env(safe-area-inset-top))',
                      paddingBottom: '12px',
                      paddingLeft: 'calc(20px + env(safe-area-inset-left))',
                      paddingRight: 'calc(20px + env(safe-area-inset-right))',
                      background: 'rgba(2,5,8,0.6)',
                      backdropFilter: 'blur(28px)',
                      WebkitBackdropFilter: 'blur(28px)',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 30px rgba(0,0,0,0.55)',
                    }}
                  >
                    {/* Subtle top edge highlight */}
                    <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
                      style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(245,158,11,0.28) 30%, rgba(255,255,255,0.18) 50%, rgba(245,158,11,0.22) 70%, transparent 95%)' }} />

                    {/* Voltar — pill */}
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      whileHover={{ x: -2 }}
                      onClick={() => setActiveView('lobby')}
                      className="relative flex items-center gap-1.5 pl-2.5 pr-3.5 py-2 rounded-full overflow-hidden shrink-0"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 14px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 55%)' }} />
                      <ChevronLeft className="w-[15px] h-[15px] relative z-10" style={{ color: 'rgba(255,255,255,0.7)' }} />
                      <span className="text-[10px] font-black tracking-[0.16em] uppercase relative z-10"
                        style={{ color: 'rgba(255,255,255,0.65)' }}>Voltar</span>
                    </motion.button>

                    {/* Center — LOJA + tagline */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5">
                      {/* Coin badge */}
                      <div className="relative w-7 h-7 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(145deg,#fbbf24 0%,#d97706 100%)',
                          boxShadow: '0 0 14px rgba(245,158,11,0.6), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.25)',
                        }}>
                        <span className="text-[12px] font-black text-black leading-none">$</span>
                      </div>
                      <div className="flex flex-col items-start gap-0.5">
                        <h1 className="font-display leading-none"
                          style={{
                            fontSize: '22px', letterSpacing: '0.22em', color: '#fbbf24',
                            textShadow: '0 0 22px rgba(245,158,11,0.55), 0 2px 8px rgba(0,0,0,0.7)',
                          }}>LOJA</h1>
                        <span className="text-[8px] font-black uppercase tracking-[0.28em]"
                          style={{ color: 'rgba(255,255,255,0.32)' }}>Itens Premium</span>
                      </div>
                    </div>

                    {/* Saldo — direita, mesmo estilo do home */}
                    <div className="ml-auto relative flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full overflow-hidden shrink-0"
                      style={{
                        background: 'linear-gradient(135deg,rgba(0,210,106,0.1),rgba(0,150,60,0.05))',
                        border: '1px solid rgba(0,210,106,0.22)',
                        boxShadow: '0 0 18px rgba(0,210,106,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
                      }}>
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(130deg,rgba(255,255,255,0.06) 0%,transparent 55%)' }} />
                      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
                        style={{ background: 'linear-gradient(90deg,transparent,rgba(0,210,106,0.5),transparent)' }} />
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: 'linear-gradient(145deg,#00e870,#00a84a)',
                          boxShadow: '0 0 10px rgba(0,210,106,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
                        }}>
                        <div className="w-3 h-3 rounded-full border-2 border-black/20" />
                      </div>
                      <span className="relative z-10 text-[13px] font-black leading-none tracking-tight"
                        style={{ color: '#00e870', textShadow: '0 0 14px rgba(0,210,106,0.45)' }}>
                        12.450
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden relative z-10">
                    <Store />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History overlay */}
            <AnimatePresence>
              {activeView === 'history' && (
                <motion.div
                  key="history-overlay"
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
                  transition={overlayTransition}
                  className="absolute inset-0 z-[150] flex flex-col overflow-hidden"
                  style={OVERLAY_BG}
                >
                  <div className="flex items-center px-6 py-4 relative shrink-0" style={OVERLAY_HEADER_STYLE}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveView('lobby')}
                      className="flex items-center gap-1 text-white/50 hover:text-white/80 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="text-[12px] font-bold">Voltar</span>
                    </motion.button>
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-white font-black text-sm tracking-widest uppercase">
                      Histórico
                    </h1>
                  </div>
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <MatchHistory />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
