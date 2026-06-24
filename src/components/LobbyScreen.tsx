import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Package, Users } from 'lucide-react';
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
  accent: string; glow: string; label: string; sub: string;
  btnText: string; btnGrad: string; btnColor: string; liveLabel: string;
}> = {
  duel: {
    accent: '#00e870', glow: 'rgba(0,232,112,0.45)', label: 'DUELO', sub: '1v1 ONLINE',
    btnText: 'JOGAR', btnGrad: 'linear-gradient(160deg, #00e870 0%, #00c058 55%, #008a3a 100%)',
    btnColor: '#000', liveLabel: 'ENCONTRAR ADVERSÁRIO',
  },
  tournaments: {
    accent: '#f5c518', glow: 'rgba(245,197,24,0.4)', label: 'TORNEIOS', sub: 'AO VIVO',
    btnText: 'ENTRAR', btnGrad: 'linear-gradient(160deg, #f5c518 0%, #c9952a 55%, #8a6010 100%)',
    btnColor: '#000', liveLabel: 'PRÓXIMO TORNEIO EM 03:42',
  },
  store: {
    accent: '#fbbf24', glow: 'rgba(251,191,36,0.55)', label: 'LOJA', sub: 'ITENS PREMIUM',
    btnText: 'EXPLORAR', btnGrad: 'linear-gradient(160deg, #fbbf24 0%, #d97706 55%, #92400e 100%)',
    btnColor: '#000', liveLabel: 'OFERTAS ESPECIAIS',
  },
  training: {
    accent: 'rgba(255,255,255,0.65)', glow: 'rgba(255,255,255,0.12)', label: 'TREINO', sub: 'PRÁTICA SOLO',
    btnText: 'TREINAR', btnGrad: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
    btnColor: 'rgba(255,255,255,0.75)', liveLabel: 'MODO SOLO',
  },
};

// ── Banner data ───────────────────────────────────────────────────────────────

interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  sub: string;
  desc: string;
  flair?: 'live' | 'free';
}

const BANNER_DATA: Record<string, BannerSlide[]> = {
  duel: [
    {
      id: 'bola8',
      tag: 'MAIS POPULAR',
      title: 'BOLA 8',
      sub: 'DUELO 1v1',
      desc: 'Embole todas as suas bolas e finalize com a bola 8 para vencer a partida.',
    },
    {
      id: 'par-impar',
      tag: 'ESTRATÉGIA',
      title: 'PAR & ÍMPAR',
      sub: 'DUELO 1v1',
      desc: 'Escolha pares ou ímpares e embole as suas bolas antes do adversário.',
    },
    {
      id: 'bolinho',
      tag: 'MODO RÁPIDO',
      title: 'BOLINHO',
      sub: 'DUELO 1v1',
      desc: 'Partidas relâmpago com poucas bolas. Pura habilidade em minutos.',
    },
  ],
  tournaments: [
    {
      id: 'torneio-rapido',
      tag: 'AO VIVO',
      title: 'TORNEIO',
      sub: 'RÁPIDO',
      desc: 'Eliminação direta. Vença os adversários em série e leve o prêmio.',
      flair: 'live',
    },
    {
      id: 'torneio-classico',
      tag: 'SEMANAL',
      title: 'TORNEIO',
      sub: 'CLÁSSICO',
      desc: 'Formato liga. Pontuação acumulada ao longo da semana com recompensas exclusivas.',
    },
  ],
  training: [
    {
      id: 'treino-solo',
      tag: 'SEM FICHAS',
      title: 'TREINO',
      sub: 'SOLO',
      desc: 'Jogue à vontade sem consumir fichas. Melhore sua técnica no seu ritmo.',
      flair: 'free',
    },
  ],
  store: [
    {
      id: 'store-banner',
      tag: 'OFERTAS',
      title: 'LOJA',
      sub: 'PREMIUM',
      desc: 'Tacos exclusivos, avatares e personalizações para destacar seu perfil.',
    },
  ],
};

// ── Slide visuals ─────────────────────────────────────────────────────────────

function Ball({ size = 88, color, label, blackBall = false }: {
  size?: number; color: string; label: string; blackBall?: boolean;
}) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: -18, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}40 0%, transparent 65%)`,
        filter: 'blur(14px)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `radial-gradient(circle at 36% 30%, rgba(255,255,255,${blackBall ? '0.18' : '0.28'}) 0%, ${color} 38%, rgba(0,0,0,0.72) 100%)`,
        boxShadow: '0 14px 44px rgba(0,0,0,0.96), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>
        {blackBall ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: Math.round(size * 0.45), height: Math.round(size * 0.45),
              borderRadius: '50%', background: 'rgba(255,255,255,0.96)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: Math.round(size * 0.22), fontWeight: 900, color: '#000' }}>{label}</span>
            </div>
          </div>
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: Math.round(size * 0.3), fontWeight: 900, color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>{label}</span>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', top: '11%', left: '19%', width: '28%', height: '19%', borderRadius: '50%', background: 'rgba(255,255,255,0.46)', filter: 'blur(2.5px)' }} />
    </div>
  );
}

function SlideVisual({ id, accent }: { id: string; accent: string }) {
  if (id === 'bola8') return <Ball size={90} color="#111" label="8" blackBall />;

  if (id === 'par-impar') {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Ball size={46} color="#1a3b99" label="2" />
        <Ball size={46} color="#cc2200" label="5" />
      </div>
    );
  }

  if (id === 'bolinho') {
    const MINI = [
      { c: '#c80000', x: 0,  y: 0  },
      { c: '#1a7a1a', x: 30, y: 0  },
      { c: '#1a3b99', x: 60, y: 0  },
      { c: '#9932cc', x: 15, y: 28 },
      { c: '#c8a000', x: 45, y: 28 },
    ];
    return (
      <div style={{ position: 'relative', width: 84, height: 54, flexShrink: 0 }}>
        {MINI.map((b, i) => (
          <div key={i} style={{
            position: 'absolute', width: 26, height: 26, borderRadius: '50%',
            left: b.x, top: b.y,
            background: `radial-gradient(circle at 36% 30%, rgba(255,255,255,0.28) 0%, ${b.c} 40%, rgba(0,0,0,0.65) 100%)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.9)',
          }}>
            <div style={{ position: 'absolute', top: '11%', left: '19%', width: '28%', height: '19%', borderRadius: '50%', background: 'rgba(255,255,255,0.42)', filter: 'blur(1px)' }} />
          </div>
        ))}
      </div>
    );
  }

  if (id.startsWith('torneio')) {
    const isFast = id === 'torneio-rapido';
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: `radial-gradient(circle, ${accent}38 0%, transparent 70%)`, filter: 'blur(14px)' }} />
        <div style={{
          width: 60, height: 52, position: 'relative',
          background: `linear-gradient(165deg, ${accent} 0%, ${accent}99 100%)`,
          borderRadius: '10px 10px 6px 6px',
          boxShadow: `0 0 28px ${accent}50, inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.14)`,
        }}>
          <div style={{ position: 'absolute', left: -11, top: 8, width: 11, height: 22, borderLeft: `3.5px solid ${accent}cc`, borderTop: `3.5px solid ${accent}cc`, borderRadius: '50% 0 0 0', boxSizing: 'border-box' }} />
          <div style={{ position: 'absolute', right: -11, top: 8, width: 11, height: 22, borderRight: `3.5px solid ${accent}cc`, borderTop: `3.5px solid ${accent}cc`, borderRadius: '0 50% 0 0', boxSizing: 'border-box' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 22, lineHeight: 1, color: 'rgba(0,0,0,0.28)', fontWeight: 900 }}>{isFast ? '⚡' : '★'}</span>
          </div>
        </div>
        <div style={{ width: 12, height: 14, background: `${accent}cc` }} />
        <div style={{ width: 56, height: 8, borderRadius: 4, background: `${accent}ee`, boxShadow: `0 0 14px ${accent}68` }} />
      </div>
    );
  }

  // Training
  return (
    <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 36% 30%, rgba(215,215,215,0.88) 0%, rgba(125,125,125,0.8) 48%, rgba(50,50,50,0.9) 100%)',
        boxShadow: '0 12px 38px rgba(0,0,0,0.95)',
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ padding: '3px 8px', borderRadius: 5, background: 'rgba(0,232,112,0.9)', fontSize: 8, fontWeight: 900, color: '#000', letterSpacing: '0.1em' }}>GRÁTIS</div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '11%', left: '19%', width: '27%', height: '19%', borderRadius: '50%', background: 'rgba(255,255,255,0.48)', filter: 'blur(2.5px)' }} />
    </div>
  );
}

// ── BannerCard ────────────────────────────────────────────────────────────────

function BannerCard({ slide, accent, glow, slideCount, slideIdx, onDot }: {
  slide: BannerSlide; accent: string; glow: string;
  slideCount: number; slideIdx: number; onDot: (i: number) => void;
}) {
  return (
    <div className="relative w-full rounded-[22px] overflow-hidden" style={{
      height: '212px',
      background: 'linear-gradient(155deg, rgba(8,8,14,0.98) 0%, rgba(3,3,6,0.99) 100%)',
      border: `1px solid ${accent}28`,
      boxShadow: `0 22px 64px rgba(0,0,0,0.92), inset 0 1px 0 rgba(255,255,255,0.07)`,
    }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 78% 52%, ${glow}50 0%, transparent 58%)` }} />
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent 5%, ${accent}50 30%, rgba(255,255,255,0.42) 50%, ${accent}32 70%, transparent 95%)` }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(130deg, rgba(255,255,255,0.036) 0%, rgba(255,255,255,0.01) 36%, transparent 56%)' }} />

      <div className="absolute inset-0 flex">
        <div className="flex flex-col justify-between px-5 py-4 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[8px] font-black uppercase tracking-[0.14em] px-2.5 py-[5px] rounded-full"
              style={{ background: `${accent}14`, border: `1px solid ${accent}45`, color: accent }}>
              {slide.tag}
            </span>
            {slide.flair === 'live' && (
              <div className="flex items-center gap-1">
                <motion.div animate={{ opacity: [0.35, 1, 0.35] }} transition={{ repeat: Infinity, duration: 1.4 }}
                  className="w-1.5 h-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 5px ${accent}` }} />
                <span className="text-[8px] font-black uppercase tracking-wider" style={{ color: accent }}>AO VIVO</span>
              </div>
            )}
            {slide.flair === 'free' && (
              <span className="text-[8px] font-black uppercase tracking-[0.12em] px-2 py-[4px] rounded-full"
                style={{ background: 'rgba(0,232,112,0.1)', border: '1px solid rgba(0,232,112,0.38)', color: '#00e870' }}>
                SEM FICHAS
              </span>
            )}
          </div>

          <div>
            <h2 className="font-display leading-none" style={{ fontSize: '38px', color: '#fff', letterSpacing: '0.04em' }}>
              {slide.title}
            </h2>
            <div className="font-display leading-none mt-0.5" style={{ fontSize: '24px', color: accent, letterSpacing: '0.07em', opacity: 0.82 }}>
              {slide.sub}
            </div>
          </div>

          <p className="text-[9.5px] leading-[1.45] pr-2"
            style={{ color: 'rgba(255,255,255,0.34)', letterSpacing: '0.02em', fontWeight: 500 }}>
            {slide.desc}
          </p>

          {slideCount > 1 && (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: slideCount }, (_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); onDot(i); }}
                  style={{
                    width: i === slideIdx ? 18 : 5, height: 5, borderRadius: 3, padding: 0,
                    background: i === slideIdx ? accent : 'rgba(255,255,255,0.18)',
                    boxShadow: i === slideIdx ? `0 0 7px ${accent}88` : 'none',
                    border: 'none', cursor: 'pointer',
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center shrink-0 pr-4" style={{ width: '132px' }}>
          <SlideVisual id={slide.id} accent={accent} />
        </div>
      </div>
    </div>
  );
}

// ── ChestIcon ─────────────────────────────────────────────────────────────────

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
      <div className="absolute top-0 inset-x-0 h-[44%] border-b" style={{ borderColor: 'rgba(201,149,42,0.7)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
        style={{ background: 'linear-gradient(135deg,#f5c518,#c9952a)', boxShadow: '0 0 8px rgba(245,197,24,0.8)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(130deg, rgba(255,255,255,0.12) 0%, transparent 55%)' }} />
    </div>
  );
}

// ── LobbyScreen ───────────────────────────────────────────────────────────────

export default function LobbyScreen({ modes, onOpenFriends, onViewChange, onOpenBattlePass }: LobbyScreenProps) {
  const [selected, setSelected] = useState<ModeId>('duel');
  const [slideIdx, setSlideIdx] = useState(0);
  const [chestSecs, setChestSecs] = useState(5325);

  const slides = BANNER_DATA[selected] ?? BANNER_DATA.training;
  const currentSlide = slides[Math.min(slideIdx, slides.length - 1)];
  const cfg = MODE_CFG[selected];

  useEffect(() => {
    const id = setInterval(() => setChestSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { setSlideIdx(0); }, [selected]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, [selected, slides.length]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sc = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`;
  };

  const handlePlay = () => {
    if (selected === 'store') { onViewChange('store'); return; }
    const msgs: Record<string, { title: string; desc: string }> = {
      duel:        { title: 'Buscando adversário…',    desc: 'Encontrando o melhor oponente para você.' },
      tournaments: { title: 'Inscrevendo no torneio…', desc: 'Você está na fila para o próximo torneio.' },
      training:    { title: 'Modo treino iniciado',    desc: 'Boa prática!' },
    };
    const m = msgs[selected];
    if (m) toast(m.title, { description: m.desc });
  };

  const glass = {
    background: 'linear-gradient(155deg, rgba(12,12,18,0.95) 0%, rgba(5,5,8,0.98) 100%)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.4)',
  } as const;

  const EdgeLayers = ({ accent }: { accent?: string }) => (
    <>
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: accent
        ? `linear-gradient(90deg, transparent 5%, ${accent}55 25%, rgba(255,255,255,0.38) 50%, ${accent}38 75%, transparent 95%)`
        : 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.16) 70%, transparent 95%)' }} />
      <div className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.07) 45%, transparent 80%)' }} />
      <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: 'rgba(0,0,0,0.6)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(128deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 35%, transparent 55%)' }} />
    </>
  );

  // Shared bottom-row height so LOJA / JOGAR / CAIXA align perfectly
  const BOTTOM_H = 80;

  // Mode buttons that live in the top section (all except store)
  const topModes = modes.filter(m => m.id !== 'store');

  return (
    // CSS grid: 3 columns × 2 rows — bottom row is shared, so all three elements align
    <div
      className="h-full w-full overflow-hidden"
      style={{ display: 'grid', gridTemplateColumns: '178px 1fr 220px', gridTemplateRows: '1fr auto' }}
    >

      {/* ══ ROW 1 — LEFT: Duelo / Torneios / Treino ══ */}
      <div className="flex flex-col gap-3 px-3 pt-5 pb-2 justify-center z-10">
        {topModes.map((mode) => {
          const mc = MODE_CFG[mode.id] ?? MODE_CFG.training;
          const isActive = mode.id === selected;
          return (
            <motion.button
              key={mode.id}
              onClick={() => { setSelected(mode.id as ModeId); setSlideIdx(0); }}
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex flex-col gap-1.5 px-4 py-4 rounded-[15px] overflow-hidden text-left cursor-pointer"
              style={{
                background: isActive
                  ? `linear-gradient(155deg, rgba(14,14,20,0.97) 0%, rgba(6,6,10,0.99) 60%, ${mc.accent}0a 100%)`
                  : 'linear-gradient(155deg, rgba(12,12,18,0.95) 0%, rgba(5,5,8,0.98) 100%)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${isActive ? mc.accent + '55' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: isActive
                  ? `0 12px 40px rgba(0,0,0,0.9), 0 0 0 1px ${mc.accent}22, inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.5)`
                  : '0 8px 32px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.4)',
              }}
            >
              {isActive && (
                <motion.div layoutId="mode-bar" className="absolute left-0 top-[18%] bottom-[18%] w-[4px] rounded-r-full"
                  style={{ background: mc.accent, boxShadow: `0 0 12px ${mc.accent}, 0 0 24px ${mc.accent}60` }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
              )}
              <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
                style={{ background: isActive
                  ? `linear-gradient(90deg, transparent 5%, ${mc.accent}60 25%, rgba(255,255,255,0.55) 50%, ${mc.accent}40 75%, transparent 95%)`
                  : 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.22) 30%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0.18) 70%, transparent 95%)'
                }} />
              <div className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.1) 40%, transparent 80%)' }} />
              <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: 'rgba(0,0,0,0.7)' }} />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(128deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 35%, transparent 55%)' }} />
              {isActive && (
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 50%, ${mc.accent}12 0%, transparent 65%)` }} />
              )}
              <span className="font-display text-[21px] leading-none tracking-[0.06em] relative z-10"
                style={{ color: isActive ? mc.accent : 'rgba(255,255,255,0.38)', textShadow: isActive ? `0 0 20px ${mc.accent}60` : 'none' }}>
                {mc.label}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none relative z-10"
                style={{ color: isActive ? mc.accent + 'bb' : 'rgba(255,255,255,0.22)' }}>
                {mc.sub}
              </span>
              {(mode.id === 'duel' || mode.id === 'tournaments') && (
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: mode.id === 'tournaments' ? 1.5 : 2.2 }}
                  className="absolute top-3 right-3 w-2 h-2 rounded-full"
                  style={{ background: mc.accent, boxShadow: `0 0 7px ${mc.accent}, 0 0 14px ${mc.accent}70` }} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ══ ROW 1 — CENTER: Banner ══ */}
      <div className="flex items-center justify-center px-2 pt-4 pb-2 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full"
          >
            <BannerCard
              slide={currentSlide}
              accent={cfg.accent}
              glow={cfg.glow}
              slideCount={slides.length}
              slideIdx={Math.min(slideIdx, slides.length - 1)}
              onDot={setSlideIdx}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ══ ROW 1 — RIGHT: Icon buttons + Passe Ace ══ */}
      <div className="flex flex-col gap-2.5 px-3 pt-4 pb-2 justify-center z-10">
        {/* Icon buttons */}
        <div className="flex gap-2">
          {([
            { icon: Trophy,  onClick: () => toast('Em breve', { description: 'Rankings chegando em breve.' }) },
            { icon: Package, onClick: () => toast('Em breve', { description: 'Inventário chegando em breve.' }) },
            { icon: Users,   onClick: onOpenFriends },
          ] as const).map(({ icon: Icon, onClick }, i) => (
            <motion.button
              key={i}
              onClick={onClick}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.93 }}
              className="relative flex-1 flex items-center justify-center py-3 rounded-[14px] overflow-hidden cursor-pointer"
              style={{ ...glass, border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.18) 50%, transparent 90%)' }} />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(128deg, rgba(255,255,255,0.04) 0%, transparent 55%)' }} />
              <Icon style={{ width: 18, height: 18, color: 'rgba(255,255,255,0.45)' }} />
            </motion.button>
          ))}
        </div>

        {/* Passe Ace */}
        <div className="relative rounded-[16px] overflow-hidden" style={{
          ...glass, border: '1px solid rgba(237,10,101,0.22)',
          background: 'linear-gradient(155deg, rgba(14,8,12,0.97) 0%, rgba(5,3,5,0.99) 70%, rgba(237,10,101,0.04) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.4)',
        }}>
          <EdgeLayers accent="#ED0A65" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 15% 50%, rgba(237,10,101,0.08) 0%, transparent 60%)' }} />
          <div className="relative z-10 px-4 pt-3.5 pb-0 flex items-center justify-between">
            <span className="font-display text-[16px] leading-none tracking-[0.08em]"
              style={{ color: '#ED0A65', textShadow: '0 0 18px rgba(237,10,101,0.5)' }}>PASSE ACE</span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full"
              style={{ background: 'rgba(237,10,101,0.12)', border: '1px solid rgba(237,10,101,0.28)' }}>
              <span className="font-display text-[11px] leading-none" style={{ color: '#ED0A65' }}>NÍV</span>
              <span className="font-display text-[13px] leading-none" style={{ color: '#fff' }}>12</span>
            </div>
          </div>
          <div className="relative z-10 px-4 pt-2.5 pb-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>6.500 / 10.000 XP</span>
              <span className="text-[9px] font-black" style={{ color: '#ED0A65' }}>65%</span>
            </div>
            <div className="h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #c00038, #ED0A65)', boxShadow: '0 0 8px rgba(237,10,101,0.7)' }} />
            </div>
          </div>
          <div className="relative z-10 px-4 pb-3.5 pt-2 flex gap-2">
            {[
              { lv: 11, done: true,   label: 'TACO'   },
              { lv: 12, active: true,  label: 'MESA'   },
              { lv: 13, done: false,   label: 'AVATAR' },
              { lv: 14, done: false,   label: 'BAÚ'    },
            ].map((r) => (
              <div key={r.lv} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full aspect-square rounded-[8px] flex items-center justify-center" style={{
                  background: r.active ? 'rgba(237,10,101,0.18)' : r.done ? 'rgba(0,232,112,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${r.active ? 'rgba(237,10,101,0.55)' : r.done ? 'rgba(0,232,112,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: r.active ? '0 0 10px rgba(237,10,101,0.35), inset 0 1px 0 rgba(255,255,255,0.1)' : 'none',
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
      </div>

      {/* ══ ROW 2 — LEFT: LOJA (aligned with JOGAR & CAIXA) ══ */}
      <div className="px-3 pb-5 pt-1.5 z-10">
        <motion.button
          onClick={() => onViewChange('store')}
          whileHover={{ x: 4, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="relative w-full flex items-center gap-3 px-4 rounded-[15px] overflow-hidden text-left cursor-pointer"
          style={{
            height: BOTTOM_H,
            background: 'linear-gradient(155deg, rgba(20,14,0,0.97) 0%, rgba(8,5,0,0.99) 60%, rgba(251,191,36,0.06) 100%)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(251,191,36,0.35)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.85), 0 0 18px rgba(251,191,36,0.22), inset 0 1px 0 rgba(255,255,255,0.14)',
          }}
        >
          <motion.div animate={{ x: ['-100%', '320%'] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', repeatDelay: 2 }}
            className="absolute inset-y-0 pointer-events-none z-20"
            style={{ width: '45%', background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.22), rgba(255,230,100,0.14), transparent)' }} />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], boxShadow: ['inset 0 0 0px rgba(251,191,36,0)', 'inset 0 0 14px rgba(251,191,36,0.18)', 'inset 0 0 0px rgba(251,191,36,0)'] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-[15px] pointer-events-none z-10" />
          <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(251,191,36,0.45) 25%, rgba(255,230,100,0.65) 50%, rgba(251,191,36,0.35) 75%, transparent 95%)' }} />
          <div className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.1) 40%, transparent 80%)' }} />
          <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: 'rgba(0,0,0,0.7)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(128deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 35%, transparent 55%)' }} />
          <motion.div animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="absolute top-2 right-2.5 px-1.5 py-[3px] rounded-full text-[7px] font-black uppercase tracking-wide z-20"
            style={{ background: 'rgba(251,191,36,0.18)', border: '1px solid rgba(251,191,36,0.6)', color: '#fbbf24', boxShadow: '0 0 8px rgba(251,191,36,0.5)' }}>
            HOT
          </motion.div>
          <div className="relative z-10">
            <div className="font-display text-[21px] leading-none tracking-[0.06em]"
              style={{ color: 'rgba(251,191,36,0.85)', textShadow: '0 0 16px rgba(251,191,36,0.5)' }}>
              LOJA
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest leading-none mt-1"
              style={{ color: 'rgba(251,191,36,0.55)' }}>
              ITENS PREMIUM
            </div>
          </div>
        </motion.button>
      </div>

      {/* ══ ROW 2 — CENTER: JOGAR (full width, same height as LOJA & CAIXA) ══ */}
      <div className="px-2 pb-5 pt-1.5 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected + '-btn-wrap'}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="relative w-full"
            style={{ height: BOTTOM_H }}
          >
            <motion.div
              animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-[18px] pointer-events-none"
              style={{ boxShadow: `0 0 55px ${cfg.glow}80, 0 0 110px ${cfg.glow}35` }}
            />
            <motion.button
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97, y: 0 }}
              onClick={handlePlay}
              className="relative overflow-hidden cursor-pointer w-full h-full"
              style={{
                borderRadius: '18px',
                background: cfg.btnGrad,
                boxShadow: [
                  '0 20px 55px rgba(0,0,0,0.75)',
                  'inset 0 2.5px 0 rgba(255,255,255,0.72)',
                  'inset 0 -2px 0 rgba(0,0,0,0.28)',
                  'inset 2px 0 0 rgba(255,255,255,0.22)',
                  'inset -2px 0 0 rgba(255,255,255,0.1)',
                ].join(', '),
              }}
            >
              <div className="absolute inset-x-0 top-0 pointer-events-none"
                style={{ height: '54%', borderRadius: '18px 18px 0 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.2) 40%, transparent 100%)' }} />
              <div className="absolute top-0 inset-x-6 h-[2px] pointer-events-none rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)' }} />
              <div className="absolute left-0 top-3 bottom-3 w-[2.5px] pointer-events-none rounded-r-full"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.06) 100%)' }} />
              <div className="absolute right-0 top-3 bottom-3 w-[1.5px] pointer-events-none rounded-l-full"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }} />
              <div className="absolute inset-x-8 bottom-0 pointer-events-none"
                style={{ height: '38%', background: `linear-gradient(0deg, ${cfg.glow}38 0%, transparent 100%)` }} />
              <span className="relative z-10 block text-center font-display leading-none tracking-[0.18em]"
                style={{ fontSize: '38px', color: cfg.btnColor }}>{cfg.btnText}</span>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ══ ROW 2 — RIGHT: CAIXA GRÁTIS (same height as LOJA & JOGAR) ══ */}
      <div className="px-3 pb-5 pt-1.5 z-10">
        <div className="relative rounded-[16px] overflow-hidden w-full" style={{ ...glass, height: BOTTOM_H }}>
          <EdgeLayers />
          <div className="relative z-10 px-4 h-full flex items-center gap-3">
            <ChestIcon />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="font-display text-[14px] leading-none tracking-[0.06em]" style={{ color: 'rgba(255,255,255,0.82)' }}>CAIXA GRÁTIS</span>
              <span className="text-[9px] font-semibold leading-none" style={{ color: 'rgba(255,255,255,0.3)' }}>Próxima em</span>
              <span className="font-display text-[20px] leading-none tracking-[0.03em]"
                style={{ color: '#f5c518', textShadow: '0 0 16px rgba(245,197,24,0.65)' }}>{fmt(chestSecs)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
