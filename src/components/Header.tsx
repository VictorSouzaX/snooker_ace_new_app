import { useState } from 'react';
import { Bell, Settings, Gift, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { toast } from 'sonner';
import { useLanguage } from '../i18n';

interface HeaderProps {
  onOpenSettings: () => void;
}

export default function Header({ onOpenSettings }: HeaderProps) {
  const { t } = useLanguage();
  const [showBalanceInfo, setShowBalanceInfo] = useState(false);
  return (
    <Tooltip.Provider delayDuration={400}>
      <header
        className="flex items-center justify-between w-full relative z-50"
        style={{
          paddingTop: 'calc(12px + env(safe-area-inset-top))',
          paddingBottom: '12px',
          paddingLeft: 'calc(24px + env(safe-area-inset-left))',
          paddingRight: 'calc(24px + env(safe-area-inset-right))',
          background: 'rgba(2,5,8,0.55)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* ── LEFT: Avatar + player info ── */}
        <div className="flex items-center gap-3">
          {/* Avatar with flaming arc */}
          <div className="relative shrink-0" style={{ width: 52, height: 52 }}>
            {/* Rotating fire arc */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            >
              <svg viewBox="0 0 52 52" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                <defs>
                  <linearGradient id="flameArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#ff6600" stopOpacity="0" />
                    <stop offset="20%"  stopColor="#ff3300" stopOpacity="0.9" />
                    <stop offset="50%"  stopColor="#ffbb00" stopOpacity="1" />
                    <stop offset="80%"  stopColor="#ff3300" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Soft glow layer */}
                <circle cx="26" cy="26" r="22"
                  fill="none" stroke="#ff5500" strokeWidth="6"
                  strokeLinecap="round" strokeDasharray="77 61"
                  style={{ filter: 'blur(4px)', opacity: 0.38 }}
                />
                {/* Sharp arc */}
                <circle cx="26" cy="26" r="22"
                  fill="none" stroke="url(#flameArcGrad)" strokeWidth="2.5"
                  strokeLinecap="round" strokeDasharray="77 61"
                  style={{ filter: 'drop-shadow(0 0 3px rgba(255,110,0,0.95)) drop-shadow(0 0 7px rgba(255,55,0,0.6))' }}
                />
              </svg>
            </motion.div>

            {/* Faint track */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,90,0,0.08)" strokeWidth="1.5" />
            </svg>

            {/* Avatar */}
            <div className="absolute rounded-full overflow-hidden"
              style={{ inset: '5px', border: '1.5px solid rgba(255,110,0,0.3)' }}>
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Avatar"
                className="w-full h-full rounded-full bg-slate-800"
              />
            </div>
          </div>

          {/* Name + bonus */}
          <div className="flex flex-col gap-1.5">
            <span className="font-display text-white leading-none tracking-wider" style={{ fontSize: '18px' }}>
              JOÃO SILVA
            </span>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toast('Bônus disponível!', { description: 'Resgate seu bônus diário agora.' })}
                  className="flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(0,210,106,0.08)',
                    border: '1px solid rgba(0,210,106,0.22)',
                  }}
                >
                  <Gift className="w-3 h-3 text-brand-green stroke-[2.5]" />
                  <span className="text-brand-green text-[8.5px] font-black tracking-widest uppercase leading-none">{t('bonus')}</span>
                </motion.button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content side="bottom" sideOffset={6}
                  className="bg-[#111] text-white/80 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-2xl tracking-wide z-[300]">
                  Resgate seu bônus diário
                  <Tooltip.Arrow className="fill-[#111]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </div>

        {/* ── CENTER: Logo ── */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0">
          <img
            src="/snooker ace - Escrita vetor.svg"
            alt="Snooker Ace"
            className="h-8"
            style={{ filter: 'drop-shadow(0 0 14px rgba(0,210,106,0.2)) drop-shadow(0 2px 18px rgba(0,0,0,0.7))' }}
          />
          {/* Underline accent */}
          <div className="h-px w-14 mt-0.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,210,106,0.55), transparent)' }} />
        </div>

        {/* ── RIGHT: Balance + actions ── */}
        <div className="flex items-center gap-3 relative">
          {/* Balance pill */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <motion.button
                onClick={() => setShowBalanceInfo(!showBalanceInfo)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full overflow-hidden cursor-pointer outline-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,210,106,0.1), rgba(0,150,60,0.05))',
                  border: '1px solid rgba(0,210,106,0.2)',
                  boxShadow: '0 0 18px rgba(0,210,106,0.08), inset 0 1px 0 rgba(255,255,255,0.07)',
                }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(130deg, rgba(255,255,255,0.06) 0%, transparent 55%)' }} />
                <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(0,210,106,0.45), transparent)' }} />
                {/* Coin icon */}
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(145deg, #00e870, #00a84a)',
                    boxShadow: '0 0 8px rgba(0,210,106,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
                  }}>
                  <div className="w-3 h-3 rounded-full border-2 border-black/20" />
                </div>
                <span className="relative z-10 font-mono font-bold text-[13px] tracking-tight text-white">
                  10,00
                </span>
              </motion.button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side="bottom" sideOffset={6}
                className="bg-[#111] text-white/80 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-2xl tracking-wide z-[300]">
                {t('availableBalance')}
                <Tooltip.Arrow className="fill-[#111]" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          {/* Balance popover */}
          <AnimatePresence>
            {showBalanceInfo && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowBalanceInfo(false)} className="fixed inset-0 z-40" />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-12 right-0 w-64 rounded-2xl p-6 z-50"
                  style={{
                    background: 'rgba(4,8,6,0.95)',
                    backdropFilter: 'blur(32px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">{t('availableBalance')}</span>
                    <button onClick={() => setShowBalanceInfo(false)} className="text-white/20 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(145deg,#00e870,#00a84a)', boxShadow: '0 0 14px rgba(0,210,106,0.4)' }}>
                      <div className="w-4 h-4 rounded-full border-[2.5px] border-black/20" />
                    </div>
                    <span className="font-mono font-black text-3xl text-white tracking-tighter">R$ 25,00</span>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed text-white/45 tracking-wide">
                    {t('balanceHint')}
                  </p>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toast('Nenhuma notificação nova', { description: 'Você está em dia!' })}
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.45)',
                  }}
                >
                  <Bell className="w-4.5 h-4.5" />
                </motion.button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content side="bottom" sideOffset={6}
                  className="bg-[#111] text-white/80 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-2xl tracking-wide z-[300]">
                  Notificações
                  <Tooltip.Arrow className="fill-[#111]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onOpenSettings}
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.45)',
                  }}
                >
                  <Settings className="w-4.5 h-4.5" />
                </motion.button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content side="bottom" sideOffset={6}
                  className="bg-[#111] text-white/80 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-2xl tracking-wide z-[300]">
                  {t('settings')}
                  <Tooltip.Arrow className="fill-[#111]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </div>
      </header>
    </Tooltip.Provider>
  );
}
