import React from 'react';
import { ShoppingBag, History, Newspaper, Users, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../i18n';

interface BottomBarProps {
  activeView: 'lobby' | 'history' | 'store';
  onViewChange: (view: 'lobby' | 'history' | 'store') => void;
  onOpenFriends: () => void;
  onOpenBattlePass: () => void;
}

export default function BottomBar({ activeView, onViewChange, onOpenFriends, onOpenBattlePass }: BottomBarProps) {
  const { t } = useLanguage();

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-[72px] pointer-events-none z-50 px-6 flex items-center"
      style={{
        background: 'rgba(2,5,8,0.58)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* ── LEFT: Battle Pass ── */}
      <motion.div
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
        onClick={onOpenBattlePass}
        className="pointer-events-auto flex-1 cursor-pointer max-w-[200px]"
      >
        <div className="relative flex items-center gap-2.5 px-3 py-2 rounded-[16px] overflow-hidden"
          style={{
            background: 'rgba(14,0,5,0.6)',
            border: '1px solid rgba(237,10,101,0.22)',
            boxShadow: '0 0 18px rgba(237,10,101,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Shine */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(128deg, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />
          {/* Top shimmer */}
          <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(237,10,101,0.5), transparent)' }} />

          {/* Level ring */}
          <div className="relative shrink-0 w-8 h-8 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="11" fill="none" stroke="rgba(237,10,101,0.12)" strokeWidth="2.5" />
              <circle cx="16" cy="16" r="11" fill="none" stroke="#ED0A65" strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 11}`}
                strokeDashoffset={`${2 * Math.PI * 11 * (1 - 0.65)}`}
                style={{ filter: 'drop-shadow(0 0 3px rgba(237,10,101,0.9))' }} />
            </svg>
            <span className="relative z-10 text-[11px] font-black leading-none" style={{ color: '#ED0A65' }}>12</span>
          </div>

          {/* Label + bar */}
          <div className="flex flex-col gap-[4px] flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-wider" style={{ color: 'rgba(237,10,101,0.7)' }}>Passe Ace</span>
              <span className="text-[9px] font-black text-white/38">65%</span>
            </div>
            <div className="h-[3px] rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.4)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.3, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #c00038, #ED0A65)', boxShadow: '0 0 6px rgba(237,10,101,0.7)' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── CENTER: Navigation — absolutely centered ── */}
      <div className="absolute inset-x-0 flex justify-center pointer-events-none h-full">
        <div className="flex items-center gap-5 pointer-events-auto px-2 relative h-full">
          <NavButton
            icon={<Home />} label={t('navHome')}
            isActive={activeView === 'lobby'}
            onClick={() => onViewChange('lobby')}
          />
          <NavButton
            icon={<ShoppingBag />} label={t('navStore')}
            isActive={activeView === 'store'}
            onClick={() => onViewChange('store')}
          />

          {/* VS button — main CTA */}
          <div className="relative flex items-end pb-1.5 px-1">
            {/* Ambient bloom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-8 -z-10 blur-2xl translate-y-2"
              style={{ background: 'rgba(0,210,106,0.45)' }} />
            {/* Outer ring */}
            <div className="absolute inset-y-2 -inset-x-2 rounded-full pointer-events-none"
              style={{
                background: 'transparent',
                boxShadow: '0 0 0 1px rgba(0,210,106,0.18), 0 0 0 3px rgba(0,210,106,0.05)',
              }} />
            <motion.button
              onClick={() => onViewChange('lobby')}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.92, y: 0 }}
              className="w-[68px] h-[68px] rounded-full relative z-10 flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #00e870 0%, #00c058 50%, #008a3a 100%)',
                boxShadow: '0 6px 28px rgba(0,210,106,0.58), 0 2px 8px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.32), inset 0 -2px 0 rgba(0,0,0,0.2), 0 0 0 3px rgba(0,0,0,0.72)',
              }}
            >
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 48%)' }} />
              <span className="relative z-10 font-display text-black leading-none" style={{ fontSize: '22px', letterSpacing: '0.04em' }}>
                VS
              </span>
            </motion.button>
          </div>

          <NavButton
            icon={<History />} label={t('navHistory')}
            isActive={activeView === 'history'}
            onClick={() => onViewChange('history')}
          />
          <NavButton icon={<Newspaper />} label={t('navNews')} />
        </div>
      </div>

      {/* ── RIGHT: Friends ── */}
      <div className="pointer-events-auto flex items-center gap-3 flex-1 justify-end">
        <div className="flex -space-x-2 items-center">
          {[
            { url: 'https://i.pravatar.cc/100?u=avatar1', online: true },
            { url: 'https://i.pravatar.cc/100?u=avatar2', online: true },
          ].map((f, i) => (
            <div key={i} className="relative">
              <img src={f.url}
                className="w-7 h-7 rounded-full object-cover"
                style={{ border: '2px solid rgba(2,5,8,0.9)', boxShadow: '0 0 0 1px rgba(255,255,255,0.07)' }} />
              {f.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{ background: '#00d26a', border: '1.5px solid rgba(2,5,8,0.9)', boxShadow: '0 0 4px rgba(0,210,106,0.8)' }} />
              )}
            </div>
          ))}
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[8.5px] font-black text-brand-green"
            style={{
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(0,210,106,0.3)',
              boxShadow: '0 0 8px rgba(0,210,106,0.12)',
            }}>
            +4
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenFriends}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-black text-[8.5px] tracking-widest uppercase transition-all"
          style={{
            background: 'rgba(0,210,106,0.06)',
            border: '1px solid rgba(0,210,106,0.25)',
            color: '#00d26a',
            boxShadow: '0 0 12px rgba(0,210,106,0.08)',
          }}
        >
          <Users className="w-3.5 h-3.5" />
          {t('navFriends')}
        </motion.button>
      </div>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.93 }}
      className="flex flex-col items-center gap-1 min-w-[46px] relative py-1.5 px-1"
    >
      {/* Active background pill */}
      {isActive && (
        <motion.div
          layoutId="nav-active-bg"
          className="absolute inset-0 rounded-xl"
          style={{ background: 'rgba(0,210,106,0.07)', border: '1px solid rgba(0,210,106,0.12)' }}
          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        />
      )}

      <div className={`transition-all duration-200 relative z-10 ${isActive ? 'text-brand-green' : 'text-white/28'}`}>
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<{ className?: string; strokeWidth?: number }>, {
              className: 'w-[18px] h-[18px]',
              strokeWidth: isActive ? 2.5 : 1.8,
            })
          : icon}
      </div>

      <span className={`text-[7px] font-black uppercase tracking-wider transition-all duration-200 leading-none relative z-10
        ${isActive ? 'text-brand-green' : 'text-white/22'}`}>
        {label}
      </span>

      {/* Bottom indicator line */}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-[6px] h-[2px] rounded-full"
          style={{
            width: '22px',
            background: '#00d26a',
            boxShadow: '0 0 8px rgba(0,210,106,0.9), 0 0 16px rgba(0,210,106,0.45)',
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        />
      )}
    </motion.button>
  );
}
