import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Lock, Check, Zap, ChevronRight, Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface BattlePassProps {
  isOpen: boolean;
  onClose: () => void;
}

type RewardKind = 'cash' | 'cue' | 'table' | 'coins' | 'xp' | 'avatar' | 'chest';
type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Reward {
  kind: RewardKind;
  label: string;
  sub: string;
  rarity: Rarity;
}

interface Level {
  n: number;
  reward: Reward;
  milestone?: boolean;
}

const RARITY_COLOR: Record<Rarity, string> = {
  common:    '#9ca3af',
  rare:      '#60a5fa',
  epic:      '#a78bfa',
  legendary: '#f8e71c',
};

const RARITY_LABEL: Record<Rarity, string> = {
  common:    'Comum',
  rare:      'Raro',
  epic:      'Épico',
  legendary: 'Lendário',
};

const LEVELS: Level[] = [
  { n: 1,  reward: { kind: 'cash',   label: 'R$ 2,50',      sub: 'Bônus',       rarity: 'common'    } },
  { n: 2,  reward: { kind: 'coins',  label: '50',            sub: 'Fichas',      rarity: 'common'    } },
  { n: 3,  reward: { kind: 'cue',    label: 'Taco Bronze',   sub: 'Taco',        rarity: 'common'    } },
  { n: 4,  reward: { kind: 'chest',  label: 'Baú Simples',   sub: 'Baú',         rarity: 'common'    } },
  { n: 5,  reward: { kind: 'table',  label: 'Mesa Clássica', sub: 'Mesa',        rarity: 'rare'      }, milestone: true },
  { n: 6,  reward: { kind: 'coins',  label: '100',           sub: 'Fichas',      rarity: 'common'    } },
  { n: 7,  reward: { kind: 'cash',   label: 'R$ 5,00',       sub: 'Bônus',       rarity: 'common'    } },
  { n: 8,  reward: { kind: 'xp',     label: 'XP +50%',       sub: 'Impulsionar', rarity: 'rare'      } },
  { n: 9,  reward: { kind: 'chest',  label: 'Baú Raro',      sub: 'Baú',         rarity: 'rare'      } },
  { n: 10, reward: { kind: 'cash',   label: 'R$ 10,00',      sub: 'Bônus',       rarity: 'rare'      }, milestone: true },
  { n: 11, reward: { kind: 'cue',    label: 'Taco Prata',    sub: 'Taco',        rarity: 'rare'      } },
  { n: 12, reward: { kind: 'xp',     label: 'XP +100%',      sub: 'Impulsionar', rarity: 'rare'      } },
  { n: 13, reward: { kind: 'cue',    label: 'Taco Carbono',  sub: 'Taco',        rarity: 'epic'      } },
  { n: 14, reward: { kind: 'chest',  label: 'Baú Épico',     sub: 'Baú',         rarity: 'epic'      } },
  { n: 15, reward: { kind: 'cash',   label: 'R$ 15,00',      sub: 'Bônus',       rarity: 'epic'      }, milestone: true },
  { n: 16, reward: { kind: 'coins',  label: '200',           sub: 'Fichas',      rarity: 'common'    } },
  { n: 17, reward: { kind: 'avatar', label: 'Avatar Élite',  sub: 'Avatar',      rarity: 'epic'      } },
  { n: 18, reward: { kind: 'cue',    label: 'Taco de Ouro',  sub: 'Taco',        rarity: 'legendary' } },
  { n: 19, reward: { kind: 'chest',  label: 'Baú Lendário',  sub: 'Baú',         rarity: 'legendary' } },
  { n: 20, reward: { kind: 'table',  label: 'Mesa VIP',      sub: 'Mesa',        rarity: 'legendary' }, milestone: true },
];

const CURRENT_LEVEL = 12;
const CURRENT_XP    = 6500;
const NEXT_XP       = 10000;
const XP_PCT        = (CURRENT_XP / NEXT_XP) * 100;

const CONFETTI_COLORS = [
  '#00d26a', '#f8e71c', '#a78bfa', '#f472b6',
  '#60a5fa', '#fb923c', '#ffffff', '#34d399',
];

/* ── Reward icon ─────────────────────────────────────────────────── */
function RewardIcon({ reward, size = 'md' }: { reward: Reward; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const color = RARITY_COLOR[reward.rarity];
  const s     = size === 'xl' ? 'w-24 h-24' : size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  const inner = () => {
    switch (reward.kind) {
      case 'cash':
        return (
          <div className="flex flex-col items-center justify-center leading-none gap-0.5">
            <span className={cn('font-black', size === 'xl' ? 'text-base' : 'text-[8px]')} style={{ color }}>R$</span>
            <span className={cn('font-black', size === 'xl' ? 'text-2xl' : 'text-[11px]')} style={{ color }}>
              {reward.label.replace('R$ ', '')}
            </span>
          </div>
        );
      case 'cue':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-[2.5px] h-[80%] rounded-full rotate-[35deg]"
              style={{ background: `linear-gradient(to bottom, ${color}, #555 70%)` }} />
            <div className="absolute w-[5px] h-[5px] rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}`, top: '12%', left: '58%', transform: 'translate(-50%,-50%) rotate(35deg)' }} />
          </div>
        );
      case 'table': {
        const tc = reward.rarity === 'rare' ? '#1d4ed8' : reward.rarity === 'epic' ? '#6d28d9' : reward.rarity === 'legendary' ? '#b45309' : '#065f46';
        return (
          <div className="relative w-[85%] h-[65%] rounded-[3px] border-2 flex items-center justify-center"
            style={{ borderColor: color, backgroundColor: tc + '33' }}>
            {[['0%','0%'],['100%','0%'],['0%','100%'],['100%','100%']].map(([l, t], i) => (
              <div key={i} className="absolute w-[5px] h-[5px] rounded-full bg-black border"
                style={{ left: l, top: t, transform: 'translate(-50%,-50%)', borderColor: color }} />
            ))}
            <div className="w-[30%] h-[30%] rounded-full opacity-60" style={{ backgroundColor: color }} />
          </div>
        );
      }
      case 'coins':
        return (
          <div className="flex flex-col items-center justify-center gap-0.5">
            <div className={cn('rounded-full border-2 flex items-center justify-center', size === 'xl' ? 'w-12 h-12' : 'w-[65%] h-[65%]')}
              style={{ borderColor: color, backgroundColor: color + '20' }}>
              <span className={cn('font-black', size === 'xl' ? 'text-xl' : 'text-[8px]')} style={{ color }}>$</span>
            </div>
            <span className={cn('font-black', size === 'xl' ? 'text-sm' : 'text-[8px]')} style={{ color }}>{reward.label}</span>
          </div>
        );
      case 'xp':
        return (
          <div className="flex items-center justify-center w-full h-full">
            <Zap className="w-[55%] h-[55%]" style={{ color }} fill={color + '40'} />
          </div>
        );
      case 'avatar':
        return (
          <div className={cn('rounded-full border-2 overflow-hidden', size === 'xl' ? 'w-16 h-16' : 'w-[65%] h-[65%]')}
            style={{ borderColor: color, boxShadow: `0 0 8px ${color}40` }}>
            <img src={`https://api.dicebear.com/7.x/micah/svg?seed=elite&backgroundColor=${color.slice(1)}`}
              className="w-full h-full" alt="avatar" />
          </div>
        );
      case 'chest':
        return (
          <div className="relative w-full h-full flex items-center justify-center"
            style={{ filter: `drop-shadow(0 0 ${size === 'xl' ? '12px' : '6px'} ${color}55)` }}>
            <svg viewBox="0 0 44 36" style={{ width: '85%', height: '85%' }} fill="none">
              {/* Body */}
              <rect x="2" y="17" width="40" height="17" rx="2.5"
                fill={color + '15'} stroke={color} strokeWidth="1.8" />
              {/* Lid arc */}
              <path d="M2 19 Q2 8 22 8 Q42 8 42 19 L42 21 L2 21 Z"
                fill={color + '28'} stroke={color} strokeWidth="1.8" />
              {/* Band */}
              <rect x="2" y="20" width="40" height="4" fill={color + '45'} />
              {/* Lock body */}
              <rect x="18.5" y="23" width="7" height="5" rx="1.5"
                fill={color + '55'} stroke={color} strokeWidth="1" />
              {/* Lock shackle */}
              <path d="M20 23 Q20 19.5 22 19.5 Q24 19.5 24 23"
                stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Sparkles */}
              <circle cx="9"  cy="13" r="1.5" fill={color + '90'} />
              <circle cx="22" cy="9"  r="2"   fill={color} />
              <circle cx="35" cy="13" r="1.5" fill={color + '90'} />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={cn('relative flex items-center justify-center rounded-xl shrink-0', s)}>
      {inner()}
    </div>
  );
}

/* ── Confetti ────────────────────────────────────────────────────── */
function Confetti() {
  const particles = useMemo(() =>
    Array.from({ length: 90 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 90 + (Math.random() - 0.5) * 0.4;
      const dist  = 80 + Math.random() * 240;
      return {
        id:     i,
        color:  CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        x:      Math.cos(angle) * dist,
        y:      Math.sin(angle) * dist * 0.85 + Math.random() * 30,
        rot:    Math.random() * 720 - 360,
        delay:  Math.random() * 0.2,
        size:   5 + Math.random() * 7,
        isRect: Math.random() > 0.4,
        dur:    0.85 + Math.random() * 0.65,
      };
    }), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: [0, 1.3, 0.9],
            opacity: [0, 1, 1, 0],
            rotate: p.rot,
          }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeOut' }}
          className={cn('absolute', p.isRect ? 'rounded-sm' : 'rounded-full')}
          style={{
            width:       p.size,
            height:      p.size,
            backgroundColor: p.color,
            left: '50%',
            top:  '50%',
            marginLeft: -p.size / 2,
            marginTop:  -p.size / 2,
          }}
        />
      ))}
    </div>
  );
}

/* ── Claim modal ─────────────────────────────────────────────────── */
function ClaimModal({ level, onClose }: { level: Level; onClose: () => void }) {
  const color = RARITY_COLOR[level.reward.rarity];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-[300] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Confetti burst */}
      <Confetti />

      {/* Reward card */}
      <motion.div
        initial={{ scale: 0.15, opacity: 0, rotate: -10, y: 20 }}
        animate={{ scale: 1,    opacity: 1, rotate: 0,   y: 0   }}
        exit={{    scale: 0.8,  opacity: 0, rotate: 4,   y: -10 }}
        transition={{ type: 'spring', damping: 11, stiffness: 150, delay: 0.08 }}
        className="relative flex flex-col items-center rounded-3xl border-2 overflow-hidden"
        style={{
          width:       268,
          borderColor: color,
          background:  `linear-gradient(160deg, #060e08, #030a04)`,
          backdropFilter: 'blur(24px)',
          boxShadow:   `0 0 60px ${color}35, 0 0 120px ${color}15, inset 0 1px 0 ${color}30`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top shimmer line */}
        <div className="absolute top-0 inset-x-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

        {/* Rarity glow bg */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 40%, ${color}, transparent 70%)` }} />

        {/* "VOCÊ GANHOU" */}
        <div className="relative z-10 pt-6 pb-2 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <Star className="w-3 h-3" style={{ color }} fill={color} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color }}>
              Você Ganhou
            </span>
            <Star className="w-3 h-3" style={{ color }} fill={color} />
          </div>
        </div>

        {/* Big reward icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 180, delay: 0.25 }}
          className="relative z-10 my-4"
        >
          <div className="relative">
            {/* Glow ring behind icon */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full blur-xl"
              style={{ backgroundColor: color, margin: '-16px' }}
            />
            <RewardIcon reward={level.reward} size="xl" />
          </div>
        </motion.div>

        {/* Reward info */}
        <div className="relative z-10 flex flex-col items-center px-8 pb-2 gap-1">
          <p className="text-white font-black text-xl text-center leading-tight">
            {level.reward.label}
          </p>
          <p className="text-white/40 text-[11px]">{level.reward.sub} · Nível {level.n}</p>
          <span
            className="mt-1 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ color, backgroundColor: color + '18', border: `1px solid ${color}40` }}
          >
            {RARITY_LABEL[level.reward.rarity]}
          </span>
        </div>

        {/* CTA button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          className="relative z-10 w-full mx-0 mt-4 py-4 font-black text-[13px] uppercase tracking-widest text-black transition-opacity hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
        >
          Incrível! 🎉
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ── Reward card (track) ─────────────────────────────────────────── */
function RewardCard({ lv, current, claimed, onClaim }: {
  lv: Level;
  current: boolean;
  claimed: boolean;
  onClaim: (n: number) => void;
}) {
  const unlocked = lv.n <= CURRENT_LEVEL;
  const color    = RARITY_COLOR[lv.reward.rarity];
  const cardW    = lv.milestone ? 'w-[200px]' : 'w-[172px]';

  const borderColor = current  ? 'rgba(0,210,106,0.5)'
    : claimed        ? 'rgba(255,255,255,0.07)'
    : unlocked       ? color + '42'
    : 'rgba(255,255,255,0.04)';

  const baseBg = current  ? 'rgba(0,210,106,0.06)'
    : claimed            ? 'rgba(0,210,106,0.03)'
    : unlocked           ? color + '07'
    : 'rgba(0,0,0,0.25)';

  return (
    <div
      className={cn('relative flex flex-col rounded-2xl shrink-0 overflow-hidden transition-all duration-300 h-full', cardW)}
      style={{
        border: `1px solid ${borderColor}`,
        boxShadow: current
          ? `0 0 28px rgba(0,210,106,0.2), 0 8px 32px rgba(0,0,0,0.5)`
          : unlocked && !claimed
            ? `0 0 18px ${color}12, 0 6px 24px rgba(0,0,0,0.45)`
            : '0 4px 20px rgba(0,0,0,0.35)',
      }}
    >
      {/* Glass base */}
      <div className="absolute inset-0 backdrop-blur-md" style={{ background: baseBg }} />

      {/* Diagonal shine */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 55%)' }} />

      {/* Top shimmer line */}
      {(current || (unlocked && !claimed)) && (
        <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${current ? '#00d26a' : color}88, transparent)` }} />
      )}

      {/* Milestone shimmer bar */}
      {lv.milestone && (
        <div className="absolute top-0 inset-x-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      )}

      {/* Inner edge glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 20px ${current ? 'rgba(0,210,106,0.05)' : color + '07'}` }} />

      {/* Level + tag */}
      <div className="relative z-10 flex items-center justify-between px-3 pt-3 pb-1">
        <span className={cn('text-[9px] font-black uppercase tracking-wider',
          current  ? 'text-brand-green'
          : claimed  ? 'text-white/25'
          : unlocked ? 'text-white/45'
          : 'text-white/15',
        )}>LV {lv.n}</span>
        {lv.milestone && (
          <span className="text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full"
            style={{ color, backgroundColor: color + '18', border: `1px solid ${color}35` }}>
            Marco
          </span>
        )}
      </div>

      {/* Icon */}
      <div className={cn('relative z-10 flex-1 flex items-center justify-center py-2', !unlocked && 'opacity-12')}>
        <RewardIcon reward={lv.reward} size="lg" />
      </div>

      {/* Info */}
      <div className={cn('relative z-10 px-3 pb-1', !unlocked && 'opacity-22')}>
        <p className="text-[12px] font-black text-white leading-tight truncate">{lv.reward.label}</p>
        <p className="text-[9px] text-white/35 mt-0.5">{lv.reward.sub}</p>
        <span className="inline-block mt-1.5 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
          style={{ color, backgroundColor: color + '15', border: `1px solid ${color}30` }}>
          {RARITY_LABEL[lv.reward.rarity]}
        </span>
      </div>

      {/* Action */}
      <div className="relative z-10 px-3 pb-3 pt-2">
        {claimed ? (
          <div className="flex items-center gap-1.5 text-brand-green/80">
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-brand-green/15">
              <Check className="w-2.5 h-2.5 text-brand-green" strokeWidth={3} />
            </div>
            <span className="text-[9px] font-black">Resgatado</span>
          </div>
        ) : current ? (
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 rounded-full bg-brand-green"
              style={{ boxShadow: '0 0 6px rgba(0,210,106,0.9)' }}
            />
            <span className="text-[9px] font-black text-brand-green">Em progresso</span>
          </div>
        ) : unlocked ? (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => onClaim(lv.n)}
            className="relative w-full py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-black overflow-hidden transition-opacity hover:opacity-88"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}bb)`,
              boxShadow: `0 2px 12px ${color}40, inset 0 1px 0 rgba(255,255,255,0.22)`,
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 60%)' }} />
            <span className="relative z-10">Resgatar</span>
          </motion.button>
        ) : (
          <div className="flex items-center gap-1.5 text-white/15">
            <Lock className="w-3 h-3" />
            <span className="text-[9px] font-bold">Bloqueado</span>
          </div>
        )}
      </div>

      {/* Pulsing border for current */}
      {current && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: '1px solid rgba(0,210,106,0.4)' }}
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        />
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function BattlePass({ isOpen, onClose }: BattlePassProps) {
  const trackRef   = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);

  // Levels 1-8 already claimed; 9-11 earned but waiting to be claimed
  const [claimed,  setClaimed]  = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6, 7, 8]));
  const [claiming, setClaiming] = useState<Level | null>(null);

  useEffect(() => {
    if (!isOpen || !trackRef.current) return;
    setTimeout(() => {
      const el = trackRef.current?.querySelector(`[data-level="${CURRENT_LEVEL}"]`) as HTMLElement;
      if (el) el.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
    }, 350);
  }, [isOpen]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current || (e.target as HTMLElement).closest('button')) return;
    isDragging.current = true;
    startX.current     = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.4;
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  }, []);

  const handleClaim = (n: number) => {
    const lv = LEVELS.find(l => l.n === n)!;
    setClaiming(lv);
  };

  const handleClaimClose = () => {
    if (claiming) setClaimed(prev => new Set([...prev, claiming.n]));
    setClaiming(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="battlepass"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute inset-0 z-[200] flex flex-col overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #021008 0%, #010904 50%, #020e06 100%)' }}
        >
          {/* Ambient depth */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] rounded-full blur-[100px]"
              style={{ background: 'rgba(0,180,80,0.10)' }} />
            <div className="absolute bottom-0 right-0 w-[350px] h-[200px] rounded-full blur-[80px]"
              style={{ background: 'rgba(248,231,28,0.05)' }} />
            <div className="absolute top-1/3 left-0 w-[250px] h-[250px] rounded-full blur-[100px]"
              style={{ background: 'rgba(0,100,40,0.12)' }} />
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />
          </div>

          {/* ── Header ── */}
          <div className="relative z-10 flex items-center px-6 pt-4 pb-3 shrink-0"
            style={{
              background: 'rgba(0,14,6,0.55)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>
            <button onClick={onClose}
              className="flex items-center gap-1 text-white/50 hover:text-white/80 transition-colors shrink-0 min-w-[80px]">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[12px] font-bold">Voltar</span>
            </button>
            <div className="flex-1 flex flex-col items-center">
              <h1 className="text-white font-black text-lg tracking-tight leading-tight">Passe de Batalha</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-green/70">Temporada 1</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[9px] font-bold text-white/30">14 dias restantes</span>
              </div>
            </div>
            <div className="flex items-center justify-end shrink-0 min-w-[80px]">
              <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-[0_0_6px_rgba(0,210,106,0.8)]" />
                <span className="text-white font-black text-[12px]">Nível {CURRENT_LEVEL}</span>
              </div>
            </div>
          </div>

          {/* ── XP bar ── */}
          <div className="relative z-10 px-12 py-3 shrink-0"
            style={{
              background: 'rgba(0,10,4,0.4)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-[10px] text-white/35 font-medium">Progresso para o Nível {CURRENT_LEVEL + 1}</span>
              <span className="text-[10px] font-black text-brand-green">
                {CURRENT_XP.toLocaleString('pt-BR')} / {NEXT_XP.toLocaleString('pt-BR')} XP
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${XP_PCT}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #00b84a, #00e870)',
                  boxShadow: '0 0 14px rgba(0,210,106,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
                }}
              />
            </div>
          </div>

          {/* ── Card track ── */}
          <div
            ref={trackRef}
            className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar relative z-10 cursor-grab select-none"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            <div className="flex items-stretch h-full px-8 py-4 gap-3" style={{ width: 'max-content', minWidth: '100%' }}>
              {LEVELS.map((lv) => (
                <div key={lv.n} data-level={lv.n} className="h-full">
                  <RewardCard
                    lv={lv}
                    current={lv.n === CURRENT_LEVEL}
                    claimed={claimed.has(lv.n)}
                    onClaim={handleClaim}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="relative z-10 px-8 py-4 flex items-center justify-between shrink-0"
            style={{
              background: 'rgba(0,14,6,0.55)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl"
                style={{ background: 'rgba(0,210,106,0.10)', border: '1px solid rgba(0,210,106,0.2)' }}>
                <Zap className="w-4 h-4 text-brand-green" />
              </div>
              <div>
                <p className="text-white/75 text-[12px] font-bold">Ganhe XP jogando partidas</p>
                <p className="text-white/28 text-[10px]">+250 XP por vitória · +100 XP por derrota</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="relative flex items-center gap-2 text-black font-black text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-xl overflow-hidden transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(150deg, #00e870 0%, #00b848 100%)',
                boxShadow: '0 4px 20px rgba(0,210,106,0.38), inset 0 1px 0 rgba(255,255,255,0.25)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none rounded-xl"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 55%)' }} />
              <span className="relative z-10">Jogar agora</span>
              <ChevronRight className="w-4 h-4 relative z-10" />
            </motion.button>
          </div>

          {/* ── Claim modal ── */}
          <AnimatePresence>
            {claiming && (
              <ClaimModal
                key={claiming.n}
                level={claiming}
                onClose={handleClaimClose}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
