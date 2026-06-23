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

  useEffect(() => {
    const id = setInterval(() => setChestSecs(s => Math.max(0, s - 1)), 1000);
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

      {/* ── CENTER: Arena + JOGAR ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 relative z-10">
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

        <AnimatePresence mode="wait">
          <motion.div
            key={selected + '-btn-wrap'}
            initial={{ opacity: 0, y: 14, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.93 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="relative flex items-center justify-center"
          >
            {/* Breathing outer bloom */}
            <motion.div
              animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-[22px] pointer-events-none"
              style={{ boxShadow: `0 0 55px ${cfg.glow}80, 0 0 110px ${cfg.glow}35` }}
            />

            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.97, y: 0 }}
              onClick={handlePlay}
              className="relative overflow-hidden cursor-pointer"
              style={{
                width: '292px',
                padding: '22px 0',
                borderRadius: '22px',
                background: cfg.btnGrad,
                boxShadow: [
                  `0 20px 55px rgba(0,0,0,0.75)`,
                  `inset 0 2.5px 0 rgba(255,255,255,0.72)`,
                  `inset 0 -2px 0 rgba(0,0,0,0.28)`,
                  `inset 2px 0 0 rgba(255,255,255,0.22)`,
                  `inset -2px 0 0 rgba(255,255,255,0.1)`,
                ].join(', '),
              }}
            >
              {/* Primary specular — top-half glass reflection */}
              <div className="absolute inset-x-0 top-0 pointer-events-none"
                style={{
                  height: '54%',
                  borderRadius: '22px 22px 0 0',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.2) 40%, transparent 100%)',
                }} />

              {/* Ultra-bright top rim */}
              <div className="absolute top-0 inset-x-6 h-[2px] pointer-events-none rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)' }} />

              {/* Left edge light */}
              <div className="absolute left-0 top-4 bottom-4 w-[2.5px] pointer-events-none rounded-r-full"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.06) 100%)' }} />

              {/* Right edge subtle */}
              <div className="absolute right-0 top-4 bottom-4 w-[1.5px] pointer-events-none rounded-l-full"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }} />

              {/* Bottom inner glow — depth */}
              <div className="absolute inset-x-8 bottom-0 pointer-events-none"
                style={{
                  height: '38%',
                  background: `linear-gradient(0deg, ${cfg.glow}38 0%, transparent 100%)`,
                }} />

              {/* Label */}
              <span className="relative z-10 block text-center font-display leading-none tracking-[0.18em]"
                style={{ fontSize: '40px', color: cfg.btnColor }}>
                {cfg.btnText}
              </span>
            </motion.button>
          </motion.div>
        </AnimatePresence>
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
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                    style={{ background: 'rgba(237,10,101,0.12)', border: '1px solid rgba(237,10,101,0.28)' }}>
                    <span className="font-display text-[11px] leading-none" style={{ color: '#ED0A65' }}>NÍV</span>
                    <span className="font-display text-[13px] leading-none" style={{ color: '#fff' }}>12</span>
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

              {/* ── Ranking ── */}
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toast('Em breve', { description: 'Rankings chegando em breve.' })}
                className="relative rounded-[16px] overflow-hidden flex-1 flex flex-col cursor-pointer"
                style={{
                  ...glass,
                  border: '1px solid rgba(245,197,24,0.28)',
                  background: 'linear-gradient(155deg, rgba(16,12,0,0.97) 0%, rgba(6,4,0,0.99) 65%, rgba(245,197,24,0.05) 100%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.85), 0 0 20px rgba(245,197,24,0.1), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4)',
                }}
              >
                <EdgeLayers accent="#f5c518" />
                {/* gold ambient bloom */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(245,197,24,0.07) 0%, transparent 60%)' }} />

                {/* Header */}
                <div className="relative z-10 px-4 pt-3.5 pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-[14px] h-[14px]" style={{ color: '#f5c518', filter: 'drop-shadow(0 0 4px rgba(245,197,24,0.7))' }} />
                    <span className="font-display text-[16px] leading-none tracking-[0.08em]"
                      style={{ color: '#f5c518', textShadow: '0 0 18px rgba(245,197,24,0.5)' }}>
                      RANKING
                    </span>
                  </div>
                  <span className="text-[7px] font-black uppercase tracking-wider px-2 py-[3px] rounded-full"
                    style={{
                      background: 'rgba(245,197,24,0.1)',
                      border: '1px solid rgba(245,197,24,0.3)',
                      color: 'rgba(245,197,24,0.75)',
                    }}>
                    GLOBAL
                  </span>
                </div>

                {/* Top 3 */}
                <div className="relative z-10 px-4 pt-3 pb-0 flex flex-col gap-2">
                  {[
                    { pos: 1, name: 'LegendAce',  pts: '14.820', medal: '#f5c518',  img: 'rank1' },
                    { pos: 2, name: 'SnookerPro', pts: '12.340', medal: '#b8c4cc',  img: 'rank2' },
                    { pos: 3, name: 'CueMaster',  pts: '10.990', medal: '#c47c3a',  img: 'rank3' },
                  ].map(({ pos, name, pts, medal, img }) => (
                    <div key={pos} className="flex items-center gap-2.5">
                      <span className="font-display text-[14px] w-4 text-center leading-none shrink-0"
                        style={{ color: medal, textShadow: `0 0 8px ${medal}80` }}>
                        {pos}
                      </span>
                      <img
                        src={`https://i.pravatar.cc/40?u=${img}`}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                        style={{ border: `1.5px solid ${medal}55`, boxShadow: `0 0 6px ${medal}30` }}
                      />
                      <span className="flex-1 text-[9px] font-black uppercase tracking-wide leading-none min-w-0 truncate"
                        style={{ color: 'rgba(255,255,255,0.62)' }}>
                        {name}
                      </span>
                      <span className="text-[9px] font-black leading-none shrink-0"
                        style={{ color: medal }}>
                        {pts}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="mx-4 mt-3 mb-2 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(245,197,24,0.18), transparent)' }} />

                {/* Minha posição */}
                <div className="relative z-10 px-4 pb-3.5 flex items-center gap-2.5">
                  <span className="font-display text-[12px] w-4 text-center leading-none shrink-0"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>
                    47
                  </span>
                  <img
                    src="https://i.pravatar.cc/40?u=me"
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                    style={{ border: '1.5px solid rgba(0,210,106,0.45)', boxShadow: '0 0 6px rgba(0,210,106,0.3)' }}
                  />
                  <span className="flex-1 text-[9px] font-black uppercase tracking-wide leading-none"
                    style={{ color: '#00e870' }}>
                    Você
                  </span>
                  <span className="text-[9px] font-black leading-none shrink-0"
                    style={{ color: 'rgba(255,255,255,0.38)' }}>
                    3.210
                  </span>
                </div>
              </motion.div>
            </>
          );
        })()}

      </div>
    </div>
  );
}
