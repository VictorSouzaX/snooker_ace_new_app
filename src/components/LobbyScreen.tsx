import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { GameMode } from '../types';

interface LobbyScreenProps {
  modes: GameMode[];
  onOpenFriends: () => void;
  onViewChange: (view: 'store' | 'history') => void;
  onOpenBattlePass: () => void;
}

type ModeId = 'duel' | 'tournaments' | 'training' | 'store';

const MODE_CFG: Record<string, {
  accent: string;
  glow: string;
  label: string;
  sub: string;
  btnText: string;
  btnGrad: string;
  btnColor: string;
  liveLabel: string;
}> = {
  duel: {
    accent: '#00e870',
    glow: 'rgba(0,232,112,0.45)',
    label: 'DUELO',
    sub: '1v1 ONLINE',
    btnText: 'JOGAR',
    btnGrad: 'linear-gradient(160deg, #00e870 0%, #00c058 55%, #008a3a 100%)',
    btnColor: '#000',
    liveLabel: 'ENCONTRAR ADVERSÁRIO',
  },
  tournaments: {
    accent: '#f5c518',
    glow: 'rgba(245,197,24,0.4)',
    label: 'TORNEIOS',
    sub: 'AO VIVO',
    btnText: 'ENTRAR',
    btnGrad: 'linear-gradient(160deg, #f5c518 0%, #c9952a 55%, #8a6010 100%)',
    btnColor: '#000',
    liveLabel: 'PRÓXIMO TORNEIO EM 03:42',
  },
  store: {
    accent: '#fbbf24',
    glow: 'rgba(251,191,36,0.55)',
    label: 'LOJA',
    sub: 'ITENS PREMIUM',
    btnText: 'EXPLORAR',
    btnGrad: 'linear-gradient(160deg, #fbbf24 0%, #d97706 55%, #92400e 100%)',
    btnColor: '#000',
    liveLabel: 'OFERTAS ESPECIAIS',
  },
  training: {
    accent: 'rgba(255,255,255,0.65)',
    glow: 'rgba(255,255,255,0.12)',
    label: 'TREINO',
    sub: 'PRÁTICA SOLO',
    btnText: 'TREINAR',
    btnGrad: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
    btnColor: 'rgba(255,255,255,0.75)',
    liveLabel: 'MODO SOLO',
  },
};

const BANNERS = [
  {
    id: 'bonus',
    title: 'BÔNUS DE 100%',
    sub: 'No primeiro depósito · Até R$ 500',
    cta: 'RESGATAR',
    bg: 'linear-gradient(135deg, rgba(0,60,22,0.92) 0%, rgba(0,130,60,0.22) 100%)',
    accent: '#00e870',
    border: 'rgba(0,210,106,0.38)',
  },
  {
    id: 'tournament',
    title: 'TORNEIO ESPECIAL',
    sub: 'Prêmio: R$ 5.000 · Inscrições abertas',
    cta: 'ENTRAR',
    bg: 'linear-gradient(135deg, rgba(60,38,0,0.92) 0%, rgba(180,130,0,0.22) 100%)',
    accent: '#f5c518',
    border: 'rgba(245,197,24,0.38)',
  },
  {
    id: 'store',
    title: 'NOVOS TACOS',
    sub: 'Coleção exclusiva · Edição limitada',
    cta: 'VER LOJA',
    bg: 'linear-gradient(135deg, rgba(60,30,0,0.92) 0%, rgba(200,110,0,0.22) 100%)',
    accent: '#fbbf24',
    border: 'rgba(251,191,36,0.38)',
  },
] as const;

const POCKETS = [
  { top: '6px',    left: '12px' },
  { top: '6px',    left: '50%', transform: 'translateX(-50%)' },
  { top: '6px',    right: '12px' },
  { bottom: '6px', left: '12px' },
  { bottom: '6px', left: '50%', transform: 'translateX(-50%)' },
  { bottom: '6px', right: '12px' },
] as const;

const BALLS = [
  { color: '#c80000', x: '52%', y: '43%', r: 13 },
  { color: '#c80000', x: '57%', y: '37%', r: 13 },
  { color: '#c80000', x: '57%', y: '49%', r: 13 },
  { color: '#c80000', x: '62%', y: '31%', r: 13 },
  { color: '#c80000', x: '62%', y: '43%', r: 13 },
  { color: '#c80000', x: '62%', y: '55%', r: 13 },
  { color: '#6a0dad', x: '43%', y: '42%', r: 12 },
  { color: '#1a7a1a', x: '37%', y: '52%', r: 12 },
  { color: '#c8a000', x: '37%', y: '33%', r: 12 },
];

function SnookerTable({ accent }: { accent: string }) {
  return (
    <div className="relative" style={{ perspective: '900px' }}>
      <motion.div
        className="relative"
        style={{
          width: '360px',
          height: '190px',
          transform: 'rotateX(54deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Table outer frame */}
        <div className="absolute inset-0 rounded-[16px]"
          style={{
            background: 'linear-gradient(160deg, #0e4820 0%, #082e12 50%, #041a08 100%)',
            boxShadow: '0 0 60px rgba(0,100,40,0.35), inset 0 0 24px rgba(0,0,0,0.6)',
            border: '3px solid #1a5c2a',
          }} />
        {/* Cushion band */}
        <div className="absolute inset-[9px] rounded-[9px]"
          style={{
            border: '8px solid #1d6630',
            background: 'transparent',
            boxShadow: 'inset 0 0 12px rgba(0,0,0,0.5)',
          }} />
        {/* Felt surface */}
        <div className="absolute inset-[17px] rounded-[3px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, #12582e 0%, #0a3e1e 50%, #072a14 100%)',
          }} />
        {/* Overhead lamp highlight */}
        <div className="absolute inset-[17px] rounded-[3px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 10%, rgba(255,252,200,0.1) 0%, transparent 55%)',
            mixBlendMode: 'screen',
          }} />
        {/* Baulk line */}
        <div className="absolute"
          style={{ left: '17px', right: '17px', top: '32%', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        {/* D semi-circle */}
        <div className="absolute"
          style={{
            left: '17px', top: 'calc(32% - 16px)', width: '32px', height: '32px',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0 50% 50% 0',
          }} />
        {/* Pockets */}
        {POCKETS.map((pos, i) => (
          <div key={i} className="absolute w-[18px] h-[18px] rounded-full"
            style={{
              ...pos,
              background: 'radial-gradient(circle at 35% 30%, #111 0%, #000 80%)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.08)',
            }} />
        ))}
        {/* Cue ball */}
        <div className="absolute"
          style={{
            width: '15px', height: '15px', borderRadius: '50%',
            background: 'radial-gradient(circle at 34% 28%, #fff 0%, #e0e0e0 40%, #aaa 80%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.95), 0 0 10px rgba(255,255,255,0.3)',
            top: '38%', left: '31%', transform: 'translate(-50%,-50%)',
          }} />
        {/* Colored balls */}
        {BALLS.map((b, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: b.r, height: b.r,
              background: `radial-gradient(circle at 34% 28%, ${b.color}ee 0%, ${b.color} 55%, rgba(0,0,0,0.45) 100%)`,
              left: b.x, top: b.y, transform: 'translate(-50%,-50%)',
              boxShadow: '0 1px 5px rgba(0,0,0,0.95)',
            }} />
        ))}
      </motion.div>
      {/* Glow below table */}
      <div className="absolute pointer-events-none"
        style={{
          inset: '-36px',
          background: `radial-gradient(ellipse at 50% 60%, ${accent}28 0%, transparent 60%)`,
        }} />
    </div>
  );
}

function ChestIcon() {
  return (
    <div className="shrink-0 w-12 h-12 rounded-[13px] relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #6b4a10 0%, #3d2800 100%)',
        border: '1px solid rgba(201,149,42,0.5)',
        boxShadow: '0 0 18px rgba(201,149,42,0.28)',
      }}>
      <div className="absolute top-0 inset-x-0 h-[44%] rounded-t-[12px]"
        style={{ background: 'linear-gradient(180deg, #9b7030 0%, #6b4a10 100%)' }} />
      <div className="absolute top-0 inset-x-0 h-[44%] border-b"
        style={{ borderColor: 'rgba(201,149,42,0.7)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
        style={{ background: 'linear-gradient(135deg,#f5c518,#c9952a)', boxShadow: '0 0 8px rgba(245,197,24,0.8)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(130deg, rgba(255,255,255,0.12) 0%, transparent 55%)' }} />
    </div>
  );
}

export default function LobbyScreen({ modes, onOpenFriends, onViewChange, onOpenBattlePass }: LobbyScreenProps) {
  const [selected, setSelected] = useState<ModeId>('duel');
  const [chestSecs, setChestSecs] = useState(5325);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setChestSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 3800);
    return () => clearInterval(id);
  }, []);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sc = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`;
  };

  const cfg = MODE_CFG[selected];

  const handlePlay = () => {
    if (selected === 'store') {
      onViewChange('store');
      return;
    }
    const msgs: Record<string, { title: string; desc: string }> = {
      duel:        { title: 'Buscando adversário…',    desc: 'Encontrando o melhor oponente para você.' },
      tournaments: { title: 'Inscrevendo no torneio…', desc: 'Você está na fila para o próximo torneio.' },
      training:    { title: 'Modo treino iniciado',    desc: 'Boa prática!' },
    };
    const m = msgs[selected];
    if (m) toast(m.title, { description: m.desc });
  };

  return (
    <div className="flex h-full w-full overflow-hidden">

      {/* ── LEFT PANEL: Mode Selector ── */}
      <div className="flex flex-col gap-3 px-3 py-5 w-[178px] shrink-0 justify-center z-10">
        {modes.map((mode) => {
          const mc = MODE_CFG[mode.id] ?? MODE_CFG.training;
          const isActive = mode.id === selected;
          const isStore = mode.id === 'store';
          return (
            <motion.button
              key={mode.id}
              onClick={() => isStore ? onViewChange('store') : setSelected(mode.id as ModeId)}
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex flex-col gap-1.5 px-4 py-4 rounded-[15px] overflow-hidden text-left cursor-pointer"
              style={{
                background: isActive
                  ? `linear-gradient(155deg, rgba(14,14,20,0.97) 0%, rgba(6,6,10,0.99) 60%, ${mc.accent}0a 100%)`
                  : isStore
                    ? 'linear-gradient(155deg, rgba(20,14,0,0.97) 0%, rgba(8,5,0,0.99) 60%, rgba(251,191,36,0.06) 100%)'
                    : 'linear-gradient(155deg, rgba(12,12,18,0.95) 0%, rgba(5,5,8,0.98) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${isActive ? mc.accent + '55' : isStore ? 'rgba(251,191,36,0.35)' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: isActive
                  ? `0 12px 40px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.7), 0 0 0 1px ${mc.accent}22, inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.5), inset 1px 0 0 rgba(255,255,255,0.07), inset -1px 0 0 rgba(0,0,0,0.4)`
                  : isStore
                    ? '0 8px 32px rgba(0,0,0,0.85), 0 0 18px rgba(251,191,36,0.22), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.4)'
                    : '0 8px 32px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,255,255,0.06), inset -1px 0 0 rgba(0,0,0,0.3)',
              }}
            >
              {/* Active left accent bar */}
              {isActive && (
                <motion.div
                  layoutId="mode-bar"
                  className="absolute left-0 top-[18%] bottom-[18%] w-[4px] rounded-r-full"
                  style={{ background: mc.accent, boxShadow: `0 0 12px ${mc.accent}, 0 0 24px ${mc.accent}60` }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}

              {/* Store: shimmer sweep */}
              {isStore && (
                <motion.div
                  animate={{ x: ['-100%', '320%'] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', repeatDelay: 2 }}
                  className="absolute inset-y-0 pointer-events-none z-20"
                  style={{
                    width: '45%',
                    background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.22), rgba(255,230,100,0.14), transparent)',
                  }}
                />
              )}

              {/* Store: pulsing outer glow ring */}
              {isStore && (
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    boxShadow: [
                      'inset 0 0 0px rgba(251,191,36,0)',
                      'inset 0 0 14px rgba(251,191,36,0.18)',
                      'inset 0 0 0px rgba(251,191,36,0)',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-[15px] pointer-events-none z-10"
                />
              )}

              {/* Top edge glass highlight */}
              <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
                style={{
                  background: isActive
                    ? `linear-gradient(90deg, transparent 5%, ${mc.accent}60 25%, rgba(255,255,255,0.55) 50%, ${mc.accent}40 75%, transparent 95%)`
                    : isStore
                      ? 'linear-gradient(90deg, transparent 5%, rgba(251,191,36,0.45) 25%, rgba(255,230,100,0.65) 50%, rgba(251,191,36,0.35) 75%, transparent 95%)'
                      : 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.22) 30%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0.18) 70%, transparent 95%)',
                }} />

              {/* Left edge glass highlight */}
              <div className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.1) 40%, transparent 80%)',
                }} />

              {/* Bottom edge shadow */}
              <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.7)' }} />

              {/* Diagonal glass sheen */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(128deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 35%, transparent 55%)',
                }} />

              {/* Active accent tint bloom */}
              {isActive && (
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 20% 50%, ${mc.accent}12 0%, transparent 65%)`,
                  }} />
              )}

              <span className="font-display text-[21px] leading-none tracking-[0.06em] relative z-10"
                style={{
                  color: isActive ? mc.accent : isStore ? 'rgba(251,191,36,0.85)' : 'rgba(255,255,255,0.38)',
                  textShadow: isActive ? `0 0 20px ${mc.accent}60` : isStore ? '0 0 16px rgba(251,191,36,0.5)' : 'none',
                }}>
                {mc.label}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none relative z-10"
                style={{ color: isActive ? mc.accent + 'bb' : isStore ? 'rgba(251,191,36,0.55)' : 'rgba(255,255,255,0.22)' }}>
                {mc.sub}
              </span>

              {(mode.id === 'duel' || mode.id === 'tournaments') && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: mode.id === 'tournaments' ? 1.5 : 2.2 }}
                  className="absolute top-3 right-3 w-2 h-2 rounded-full"
                  style={{ background: mc.accent, boxShadow: `0 0 7px ${mc.accent}, 0 0 14px ${mc.accent}70` }}
                />
              )}
              {isStore && (
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  className="absolute top-2.5 right-2.5 px-1.5 py-[3px] rounded-full text-[7px] font-black uppercase tracking-wide z-20"
                  style={{
                    background: 'rgba(251,191,36,0.18)',
                    border: '1px solid rgba(251,191,36,0.6)',
                    color: '#fbbf24',
                    boxShadow: '0 0 8px rgba(251,191,36,0.5)',
                  }}
                >
                  HOT
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── CENTER: Banners + Arena + Live ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3.5 py-3 relative z-10">

        {/* ── Banner carousel ── */}
        <div className="w-full max-w-[360px] px-2 relative">
          <AnimatePresence mode="wait">
            {BANNERS.map((b, i) => i === bannerIdx && (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="relative h-[52px] rounded-[14px] overflow-hidden flex items-center px-4 gap-3 cursor-pointer"
                style={{ background: b.bg, border: `1px solid ${b.border}` }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(130deg, rgba(255,255,255,0.07) 0%, transparent 55%)' }} />
                <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, ${b.accent}70, transparent)` }} />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[13px] leading-none tracking-[0.06em]" style={{ color: b.accent }}>
                    {b.title}
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-wider leading-none mt-[5px]"
                    style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {b.sub}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[7px] font-black uppercase tracking-wider"
                  style={{ background: `${b.accent}18`, border: `1px solid ${b.accent}55`, color: b.accent }}
                >
                  {b.cta}
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Progress dots */}
          <div className="flex justify-center gap-1 mt-2">
            {BANNERS.map((_, i) => (
              <motion.div
                key={i}
                animate={{ width: i === bannerIdx ? 14 : 4, opacity: i === bannerIdx ? 0.8 : 0.25 }}
                transition={{ duration: 0.25 }}
                onClick={() => setBannerIdx(i)}
                className="h-[3px] rounded-full cursor-pointer"
                style={{ background: '#fff' }}
              />
            ))}
          </div>
        </div>

        {/* ── Snooker table ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected + '-table'}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <SnookerTable accent={cfg.accent} />
          </motion.div>
        </AnimatePresence>

        {/* ── Live matches ticker ── */}
        <div className="flex gap-2 w-full max-w-[360px] px-2">
          {[
            { p1: 'João S.', p2: 'Pedro A.', score: '4–2', d: 0 },
            { p1: 'Maria L.', p2: 'Carlos R.', score: '6–5', d: 0.4 },
            { p1: 'Rafael M.', p2: 'Ana P.', score: '3–1', d: 0.8 },
          ].map((m, i) => (
            <div key={i} className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-[9px]"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.6, delay: m.d }}
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: '#00e870', boxShadow: '0 0 4px rgba(0,210,106,0.9)' }}
              />
              <span className="flex-1 text-[7px] font-black uppercase tracking-wide leading-none truncate"
                style={{ color: 'rgba(255,255,255,0.38)' }}>
                {m.p1} vs {m.p2}
              </span>
              <span className="text-[8px] font-black leading-none shrink-0" style={{ color: '#00e870' }}>
                {m.score}
              </span>
            </div>
          ))}
        </div>

        {/* ── Mode CTA button ── */}
        <div className="flex flex-col items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.button
              key={selected + '-btn'}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96, y: 0 }}
              onClick={handlePlay}
              className="relative font-display leading-none tracking-[0.14em] px-14 py-[12px] overflow-hidden cursor-pointer"
              style={{
                fontSize: '28px',
                background: cfg.btnGrad,
                color: cfg.btnColor,
                clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)',
                boxShadow: `0 8px 36px ${cfg.glow}58, 0 2px 10px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.26)`,
              }}
            >
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 52%)' }} />
              <span className="relative z-10">{cfg.btnText}</span>
            </motion.button>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={selected + '-sub'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="font-black uppercase leading-none tracking-[0.26em]"
              style={{ fontSize: '10px', color: cfg.accent + '80' }}
            >
              {cfg.liveLabel}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT PANEL: Widgets ── */}
      <div className="flex flex-col gap-2.5 px-3 py-4 w-[220px] shrink-0 z-10">

        {/* ── shared glass ── */}
        {(() => {
          const glass = {
            background: 'linear-gradient(155deg, rgba(12,12,18,0.95) 0%, rgba(5,5,8,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,255,255,0.06), inset -1px 0 0 rgba(0,0,0,0.3)',
          };

          const EdgeLayers = ({ accent }: { accent?: string }) => (
            <>
              <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{
                background: accent
                  ? `linear-gradient(90deg, transparent 5%, ${accent}55 25%, rgba(255,255,255,0.38) 50%, ${accent}38 75%, transparent 95%)`
                  : 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.16) 70%, transparent 95%)',
              }} />
              <div className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.07) 45%, transparent 80%)' }} />
              <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.6)' }} />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(128deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 35%, transparent 55%)' }} />
            </>
          );

          return (
            <>
              {/* ── Passe Ace ── */}
              <div className="relative rounded-[16px] overflow-hidden" style={{
                ...glass,
                border: '1px solid rgba(237,10,101,0.22)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.85), 0 0 0 0px rgba(237,10,101,0), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,255,255,0.06), inset -1px 0 0 rgba(0,0,0,0.3)',
                background: 'linear-gradient(155deg, rgba(14,8,12,0.97) 0%, rgba(5,3,5,0.99) 70%, rgba(237,10,101,0.04) 100%)',
              }}>
                <EdgeLayers accent="#ED0A65" />
                {/* pink bloom */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 15% 50%, rgba(237,10,101,0.08) 0%, transparent 60%)' }} />

                {/* header */}
                <div className="relative z-10 px-4 pt-3.5 pb-0 flex items-center justify-between">
                  <span className="font-display text-[16px] leading-none tracking-[0.08em]"
                    style={{ color: '#ED0A65', textShadow: '0 0 18px rgba(237,10,101,0.5)' }}>
                    PASSE ACE
                  </span>
                  {/* Stylized avatar frame */}
                  <div className="relative shrink-0" style={{ width: 36, height: 36 }}>
                    {/* Rotating dashed ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0"
                    >
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none"
                          stroke="#ED0A65" strokeWidth="1.5"
                          strokeDasharray="5 3.5"
                          style={{ filter: 'drop-shadow(0 0 3px rgba(237,10,101,0.8))' }}
                        />
                        {([0, 90, 180, 270] as const).map((angle) => (
                          <circle key={angle}
                            cx={18 + 16 * Math.cos((angle - 90) * Math.PI / 180)}
                            cy={18 + 16 * Math.sin((angle - 90) * Math.PI / 180)}
                            r="1.8" fill="#ED0A65"
                            style={{ filter: 'drop-shadow(0 0 2px rgba(237,10,101,1))' }}
                          />
                        ))}
                      </svg>
                    </motion.div>
                    {/* Avatar */}
                    <div className="absolute inset-[3px] rounded-full overflow-hidden"
                      style={{ border: '1px solid rgba(237,10,101,0.4)', boxShadow: '0 0 8px rgba(237,10,101,0.35)' }}>
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        className="w-full h-full object-cover bg-slate-900" />
                    </div>
                    {/* Level badge */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-[14px] h-[14px] rounded-full flex items-center justify-center text-[7px] font-black leading-none"
                      style={{
                        background: 'linear-gradient(135deg, #ED0A65, #c00038)',
                        border: '1px solid rgba(0,0,0,0.8)',
                        color: '#fff',
                        boxShadow: '0 0 6px rgba(237,10,101,0.7)',
                      }}>
                      12
                    </div>
                  </div>
                </div>

                {/* XP bar */}
                <div className="relative z-10 px-4 pt-2.5 pb-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>6.500 / 10.000 XP</span>
                    <span className="text-[9px] font-black" style={{ color: '#ED0A65' }}>65%</span>
                  </div>
                  <div className="h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #c00038, #ED0A65)', boxShadow: '0 0 8px rgba(237,10,101,0.7)' }}
                    />
                  </div>
                </div>

                {/* reward milestones */}
                <div className="relative z-10 px-4 pb-3.5 pt-2 flex gap-2">
                  {[
                    { lv: 11, done: true,    label: 'TACO'   },
                    { lv: 12, active: true,  label: 'MESA'   },
                    { lv: 13, done: false,   label: 'AVATAR' },
                    { lv: 14, done: false,   label: 'BAÚ'    },
                  ].map((r) => (
                    <div key={r.lv} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full aspect-square rounded-[8px] flex items-center justify-center"
                        style={{
                          background: r.active ? 'rgba(237,10,101,0.18)' : r.done ? 'rgba(0,232,112,0.1)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${r.active ? 'rgba(237,10,101,0.55)' : r.done ? 'rgba(0,232,112,0.3)' : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: r.active ? '0 0 10px rgba(237,10,101,0.35), inset 0 1px 0 rgba(255,255,255,0.1)' : r.done ? 'inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
                        }}>
                        <span className="font-display text-[11px] leading-none"
                          style={{ color: r.active ? '#ED0A65' : r.done ? '#00e870' : 'rgba(255,255,255,0.22)' }}>
                          {r.done && !r.active ? '✓' : r.lv}
                        </span>
                      </div>
                      <span className="font-display text-[8px] leading-none tracking-wide"
                        style={{ color: r.active ? '#ED0A65' : r.done ? 'rgba(0,232,112,0.7)' : 'rgba(255,255,255,0.22)' }}>
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Caixa Grátis ── */}
              <div className="relative rounded-[16px] overflow-hidden" style={glass}>
                <EdgeLayers />
                <div className="relative z-10 px-4 py-3 flex items-center gap-3">
                  <ChestIcon />
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-display text-[14px] leading-none tracking-[0.06em]"
                      style={{ color: 'rgba(255,255,255,0.82)' }}>CAIXA GRÁTIS</span>
                    <span className="text-[9px] font-semibold leading-none"
                      style={{ color: 'rgba(255,255,255,0.3)' }}>Próxima em</span>
                    <span className="font-display text-[22px] leading-none tracking-[0.03em]"
                      style={{ color: '#f5c518', textShadow: '0 0 16px rgba(245,197,24,0.65)' }}>
                      {fmt(chestSecs)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── JOGAR ── sequential glow after Loja shimmer ── */}
              <motion.button
                onClick={() => toast('Buscando adversário…', { description: 'Encontrando o melhor oponente para você.' })}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="relative rounded-[16px] overflow-hidden flex-1 flex flex-col items-center justify-center gap-2 cursor-pointer"
                style={{
                  background: 'linear-gradient(155deg, rgba(0,28,10,0.97) 0%, rgba(0,10,4,0.99) 65%, rgba(0,232,112,0.07) 100%)',
                  border: '1px solid rgba(0,210,106,0.38)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.85), 0 0 18px rgba(0,210,106,0.12)',
                }}
              >
                {/* Sequenced glow pulse — fires after Loja shimmer (delay: 2.4s) */}
                <motion.div
                  animate={{
                    opacity: [0, 1, 0],
                    boxShadow: [
                      '0 0 0px rgba(0,210,106,0), inset 0 0 0px rgba(0,210,106,0)',
                      '0 0 40px rgba(0,210,106,0.65), inset 0 0 28px rgba(0,210,106,0.18)',
                      '0 0 0px rgba(0,210,106,0), inset 0 0 0px rgba(0,210,106,0)',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 1.6, delay: 2.4, repeatDelay: 2.8 }}
                  className="absolute inset-0 rounded-[16px] pointer-events-none z-20"
                />
                {/* Shimmer sweep — fires after Loja sweep */}
                <motion.div
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ repeat: Infinity, duration: 1.6, delay: 2.5, repeatDelay: 2.8, ease: 'easeInOut' }}
                  className="absolute inset-y-0 pointer-events-none z-10"
                  style={{ width: '40%', background: 'linear-gradient(90deg, transparent, rgba(0,210,106,0.28), transparent)' }}
                />

                <EdgeLayers accent="#00e870" />

                {/* Top ambient bloom */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,210,106,0.14) 0%, transparent 65%)' }} />

                {/* Play icon + label */}
                <div className="relative z-10 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(145deg, #00e870, #00a84a)',
                      boxShadow: '0 0 18px rgba(0,210,106,0.7), inset 0 1px 0 rgba(255,255,255,0.3)',
                    }}>
                    <svg viewBox="0 0 12 14" className="w-3 h-3.5 ml-0.5" fill="black">
                      <path d="M0 0 L12 7 L0 14 Z" />
                    </svg>
                  </div>
                  <span className="font-display text-[26px] leading-none tracking-[0.1em]"
                    style={{ color: '#00e870', textShadow: '0 0 24px rgba(0,210,106,0.7)' }}>
                    JOGAR
                  </span>
                </div>

                <span className="relative z-10 text-[8px] font-black uppercase tracking-[0.22em] leading-none"
                  style={{ color: 'rgba(0,210,106,0.5)' }}>
                  DUELO RÁPIDO
                </span>

                {/* Online counter */}
                <div className="relative z-10 flex items-center gap-1.5">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#00e870', boxShadow: '0 0 5px rgba(0,210,106,0.9)' }}
                  />
                  <span className="text-[8px] font-bold leading-none"
                    style={{ color: 'rgba(255,255,255,0.28)' }}>
                    2.431 ONLINE AGORA
                  </span>
                </div>
              </motion.button>
            </>
          );
        })()}

      </div>
    </div>
  );
}
