import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Package, Users, X, Check, Play } from 'lucide-react';
import { toast } from 'sonner';
import { GameMode } from '../types';

interface LobbyScreenProps {
  modes: GameMode[];
  onOpenFriends: () => void;
  onViewChange: (view: 'store' | 'history') => void;
  onOpenBattlePass: () => void;
  resetKey?: number;
}

type ModeId = 'duel' | 'tournaments' | 'training' | 'store';

const MODE_CFG: Record<string, {
  accent: string; glow: string; label: string; sub: string;
  btnText: string; btnSub: string; btnGrad: string; btnColor: string; liveLabel: string;
}> = {
  duel: {
    accent: '#00e870', glow: 'rgba(0,232,112,0.45)', label: 'DUELO', sub: '1v1 ONLINE',
    btnText: 'JOGAR', btnSub: 'Encontre seu adversário',
    btnGrad: 'linear-gradient(160deg, #00e870 0%, #00c058 55%, #008a3a 100%)',
    btnColor: '#000', liveLabel: 'ENCONTRAR ADVERSÁRIO',
  },
  tournaments: {
    accent: '#f5c518', glow: 'rgba(245,197,24,0.4)', label: 'TORNEIOS', sub: 'AO VIVO',
    btnText: 'ENTRAR', btnSub: 'Dispute o prêmio agora',
    btnGrad: 'linear-gradient(160deg, #f5c518 0%, #c9952a 55%, #8a6010 100%)',
    btnColor: '#000', liveLabel: 'PRÓXIMO TORNEIO EM 03:42',
  },
  store: {
    accent: '#fbbf24', glow: 'rgba(251,191,36,0.55)', label: 'LOJA', sub: 'ITENS PREMIUM',
    btnText: 'EXPLORAR', btnSub: 'Confira as ofertas',
    btnGrad: 'linear-gradient(160deg, #fbbf24 0%, #d97706 55%, #92400e 100%)',
    btnColor: '#000', liveLabel: 'OFERTAS ESPECIAIS',
  },
  training: {
    accent: 'rgba(255,255,255,0.65)', glow: 'rgba(255,255,255,0.12)', label: 'TREINO', sub: 'PRÁTICA SOLO',
    btnText: 'TREINAR', btnSub: 'Pratique sem gastar fichas',
    btnGrad: 'linear-gradient(160deg, #1b1b1f 0%, #0a0a0c 100%)',
    btnColor: 'rgba(255,255,255,0.92)', liveLabel: 'MODO SOLO',
  },
};

interface BannerSlide {
  id: string; tag: string; title: string; sub: string; desc: string; flair?: 'live' | 'free';
}

const BANNER_DATA: Record<string, BannerSlide[]> = {
  duel: [
    { id: 'bola8',     tag: 'MAIS POPULAR', title: 'BOLA 8',   sub: 'DUELO 1v1', desc: 'Embole todas as suas bolas e finalize com a bola 8 para vencer a partida.' },
    { id: 'par-impar', tag: 'ESTRATÉGIA',   title: 'PAR & ÍMPAR', sub: 'DUELO 1v1', desc: 'Escolha pares ou ímpares e embole as suas bolas antes do adversário.' },
    { id: 'bolinho',   tag: 'MODO RÁPIDO',  title: 'BOLINHO',  sub: 'DUELO 1v1', desc: 'Partidas relâmpago com poucas bolas. Pura habilidade em minutos.' },
  ],
  tournaments: [
    { id: 'torneio-rapido',   tag: 'AO VIVO', title: 'TORNEIO', sub: 'RÁPIDO',   desc: 'Eliminação direta. Vença os adversários em série e leve o prêmio.', flair: 'live' },
    { id: 'torneio-classico', tag: 'SEMANAL', title: 'TORNEIO', sub: 'CLÁSSICO', desc: 'Formato liga. Pontuação acumulada ao longo da semana com recompensas exclusivas.' },
  ],
  training: [
    { id: 'treino-solo', tag: 'SEM FICHAS', title: 'TREINO', sub: 'SOLO', desc: 'Jogue à vontade sem consumir fichas. Melhore sua técnica no seu ritmo.', flair: 'free' },
  ],
  store: [
    { id: 'store-banner', tag: 'OFERTAS', title: 'LOJA', sub: 'PREMIUM', desc: 'Tacos exclusivos, avatares e personalizações para destacar seu perfil.' },
  ],
};

const NEWS_SLIDES: BannerSlide[] = [
  { id: 'news-season',     tag: 'TEMPORADA 1',     title: 'NOVA',    sub: 'TEMPORADA',  desc: 'A Temporada 1 chegou ao Snooker Ace! Compete no ranking global e conquiste recompensas exclusivas de campeão.', flair: 'live' },
  { id: 'news-tournament', tag: 'EVENTO ESPECIAL',  title: 'TORNEIO', sub: 'SEMANAL',   desc: 'Inscrições abertas para o Torneio Semanal. Prêmio total de 50.000 fichas para os melhores jogadores da semana.' },
  { id: 'news-store',      tag: 'LOJA',             title: 'NOVOS',   sub: 'TACOS',     desc: 'Coleção exclusiva de tacos profissionais disponível por tempo limitado. Garanta o seu agora!' },
  { id: 'news-update',     tag: 'ATUALIZAÇÃO',      title: 'PATCH',   sub: 'V2.0',      desc: 'Física de bola melhorada, novos efeitos visuais e sistema de ranking totalmente reformulado.' },
  { id: 'news-bonus',      tag: 'RECOMPENSA',       title: 'BÔNUS',   sub: 'DIÁRIO',    desc: 'Entre todos os dias para acumular bônus consecutivos. Cada check-in aumenta o valor da sua recompensa!' },
];

const NEWS_CFG = {
  accent: '#00e870', glow: 'rgba(0,232,112,0.45)',
  label: '', sub: '', btnText: '', btnSub: '', btnGrad: '', btnColor: '', liveLabel: '',
};

// Bet tiers shown in the play modal, with a baseline of players waiting
const BET_TIERS: { value: number; label: string; players: number }[] = [
  { value: 0.5, label: '0,50',  players: 124 },
  { value: 1,   label: '1,00',  players: 318 },
  { value: 2,   label: '2,00',  players: 207 },
  { value: 5,   label: '5,00',  players: 86  },
  { value: 10,  label: '10,00', players: 41  },
];

const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

function Ball({ size = 88, color, label, blackBall = false }: {
  size?: number; color: string; label: string; blackBall?: boolean;
}) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', background: `radial-gradient(circle, ${color}40 0%, transparent 65%)`, filter: 'blur(14px)' }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `radial-gradient(circle at 36% 30%, rgba(255,255,255,${blackBall ? '0.18' : '0.28'}) 0%, ${color} 38%, rgba(0,0,0,0.72) 100%)`,
        boxShadow: '0 14px 44px rgba(0,0,0,0.96), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>
        {blackBall ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: Math.round(size * 0.45), height: Math.round(size * 0.45), borderRadius: '50%', background: 'rgba(255,255,255,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

const SLIDE_BG_IMAGE: Record<string, string> = {
  'bola8':           '/bola%208-nova.png',
  'bolinho':         '/bolinho.png',
  'par-impar':       '/par%20e%20impar.png',
  'news-season':     '/temporada%201.png',
  'news-tournament': '/torneio.png',
  'news-store':      '/tacos.png',
  'news-update':     '/atualiza%C3%A7%C3%A3o.png',
  'news-bonus':      '/fichas.png',
};

function SlideVisual({ id, accent }: { id: string; accent: string }) {
  if (id === 'bola8') return null;
  if (id === 'bolinho') return null;
  if (id === 'par-impar') return null;
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
      { c: '#c80000', x: 0,  y: 0  }, { c: '#1a7a1a', x: 30, y: 0  },
      { c: '#1a3b99', x: 60, y: 0  }, { c: '#9932cc', x: 15, y: 28 },
      { c: '#c8a000', x: 45, y: 28 },
    ];
    return (
      <div style={{ position: 'relative', width: 84, height: 54, flexShrink: 0 }}>
        {MINI.map((b, i) => (
          <div key={i} style={{
            position: 'absolute', width: 26, height: 26, borderRadius: '50%', left: b.x, top: b.y,
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
  if (id.startsWith('news-')) {
    const INFO: Record<string, { sym: string; bg: string }> = {
      'news-season':     { sym: '1',  bg: '#00e870' },
      'news-tournament': { sym: '⚡', bg: '#f5c518' },
      'news-store':      { sym: '$',  bg: '#fbbf24' },
      'news-update':     { sym: '↑',  bg: '#3b82f6' },
      'news-bonus':      { sym: '+',  bg: '#00e870' },
    };
    const { sym, bg } = INFO[id] ?? { sym: '!', bg: accent };
    return (
      <div style={{
        width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `radial-gradient(circle at 36% 30%, ${bg}22 0%, ${bg}06 100%)`,
        border: `1.5px solid ${bg}38`,
        boxShadow: `0 0 36px ${bg}28, inset 0 1px 0 ${bg}30`,
      }}>
        <span style={{ fontSize: 36, fontWeight: 900, color: bg, textShadow: `0 0 20px ${bg}90`, lineHeight: 1 }}>{sym}</span>
      </div>
    );
  }

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

function BannerCard({ slide, accent, glow, slideCount, slideIdx, onDot }: {
  slide: BannerSlide; accent: string; glow: string;
  slideCount: number; slideIdx: number; onDot: (i: number) => void;
}) {
  const bgImage = SLIDE_BG_IMAGE[slide.id];
  const hasFullBg = !!bgImage;

  return (
    <div className="relative w-full h-full rounded-[22px] overflow-hidden" style={{
      background: 'linear-gradient(160deg, rgba(18,18,20,0.97) 0%, rgba(8,8,10,0.99) 100%)',
      backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
      border: `1px solid rgba(255,255,255,0.13)`,
      boxShadow: [
        'inset 0 1px 0 rgba(255,255,255,0.20)',
        'inset 0 -1px 0 rgba(0,0,0,0.50)',
        `0 0 0 0.5px rgba(255,255,255,0.04)`,
      ].join(', '),
    }}>

      {/* Full bleed background image (bola8, bolinho) */}
      {hasFullBg && (
        <>
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          {/* Dark overlay on left so text stays readable */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, rgba(4,4,6,0.88) 0%, rgba(4,4,6,0.72) 45%, rgba(4,4,6,0.18) 75%, rgba(4,4,6,0.05) 100%)' }} />
        </>
      )}

      {!hasFullBg && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 78% 52%, ${glow}50 0%, transparent 58%)` }} />
      )}
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
            <h2 className="font-display leading-none" style={{ fontSize: '38px', color: '#fff', letterSpacing: '0.04em' }}>{slide.title}</h2>
            <div className="font-display leading-none mt-0.5" style={{ fontSize: '24px', color: accent, letterSpacing: '0.07em', opacity: 0.82 }}>{slide.sub}</div>
          </div>
          <p className="text-[9.5px] leading-[1.45] pr-2" style={{ color: 'rgba(255,255,255,0.34)', letterSpacing: '0.02em', fontWeight: 500, maxWidth: hasFullBg ? '54%' : undefined }}>{slide.desc}</p>
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
        {!hasFullBg && (
          <div className="flex items-center justify-center shrink-0 pr-4" style={{ width: '132px' }}>
            <SlideVisual id={slide.id} accent={accent} />
          </div>
        )}
      </div>
    </div>
  );
}

function ChestIcon() {
  return (
    <div className="shrink-0 w-12 h-12 rounded-[13px] relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #6b4a10 0%, #3d2800 100%)', border: '1px solid rgba(201,149,42,0.5)', boxShadow: '0 0 18px rgba(201,149,42,0.28)' }}>
      <div className="absolute top-0 inset-x-0 h-[44%] rounded-t-[12px]" style={{ background: 'linear-gradient(180deg, #9b7030 0%, #6b4a10 100%)' }} />
      <div className="absolute top-0 inset-x-0 h-[44%] border-b" style={{ borderColor: 'rgba(201,149,42,0.7)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
        style={{ background: 'linear-gradient(135deg,#f5c518,#c9952a)', boxShadow: '0 0 8px rgba(245,197,24,0.8)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(130deg, rgba(255,255,255,0.12) 0%, transparent 55%)' }} />
    </div>
  );
}

export default function LobbyScreen({ modes, onOpenFriends, onViewChange, onOpenBattlePass, resetKey }: LobbyScreenProps) {
  const [selected, setSelected] = useState<ModeId | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [prevSlideId, setPrevSlideId] = useState<string | null>(null);
  const [chestSecs, setChestSecs] = useState(5325);

  // Play modal state
  const [playModalOpen, setPlayModalOpen] = useState(false);
  const [modalModeId, setModalModeId] = useState<string | null>(null);
  const [modalBet, setModalBet] = useState<number>(1);
  const [betCounts, setBetCounts] = useState<number[]>(() => BET_TIERS.map(t => t.players));

  const slides = selected === null ? NEWS_SLIDES : (BANNER_DATA[selected] ?? BANNER_DATA.training);
  const currentSlide = slides[Math.min(slideIdx, slides.length - 1)];
  const cfg = selected ? (MODE_CFG[selected] ?? MODE_CFG.training) : NEWS_CFG;

  // Refs so interval/pan callbacks always see latest state without stale closure
  const slideIdxRef = useRef(slideIdx);
  slideIdxRef.current = slideIdx;
  const slidesRef = useRef(slides);
  slidesRef.current = slides;

  const goToRef = useRef((_: number) => {});
  goToRef.current = (newIdx: number) => {
    const prev = slideIdxRef.current;
    if (prev === newIdx) return;
    setPrevSlideId(slidesRef.current[prev]?.id ?? null);
    setSlideIdx(newIdx);
  };

  useEffect(() => {
    const id = setInterval(() => setChestSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { setPrevSlideId(null); setSlideIdx(0); }, [selected]);
  useEffect(() => { if (resetKey) setSelected(null); }, [resetKey]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      goToRef.current((slideIdxRef.current + 1) % slidesRef.current.length);
    }, 7500);
    return () => clearInterval(id);
  }, [selected, slides.length]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sc = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`;
  };

  // Live-ish drift of waiting players while the modal is open
  useEffect(() => {
    if (!playModalOpen) return;
    const id = setInterval(() => {
      setBetCounts(prev => prev.map(c => Math.max(8, c + Math.round((Math.random() - 0.5) * 7))));
    }, 2200);
    return () => clearInterval(id);
  }, [playModalOpen]);

  const handlePlay = () => {
    if (!selected) return;
    if (selected === 'store') { onViewChange('store'); return; }
    if (selected === 'training') {
      toast('Modo treino iniciado', { description: 'Boa prática!' });
      return;
    }
    // duel & tournaments → open selection modal
    const subModes = BANNER_DATA[selected] ?? [];
    const preferred = subModes[Math.min(slideIdx, subModes.length - 1)]?.id ?? subModes[0]?.id ?? null;
    setModalModeId(preferred);
    setModalBet(1);
    setBetCounts(BET_TIERS.map(t => t.players));
    setPlayModalOpen(true);
  };

  const confirmMatch = () => {
    setPlayModalOpen(false);
    const sub = (selected ? BANNER_DATA[selected] : [])?.find(s => s.id === modalModeId);
    const title = selected === 'tournaments' ? 'Inscrevendo no torneio…' : 'Buscando adversário…';
    toast(title, { description: `${sub?.title ?? ''} • Aposta ${money(modalBet)}` });
  };

  const glass = {
    background: 'linear-gradient(160deg, rgba(22,22,24,0.97) 0%, rgba(10,10,12,0.99) 100%)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.13)',
    boxShadow: [
      'inset 0 1px 0 rgba(255,255,255,0.22)',  // top metallic highlight
      'inset 0 -1px 0 rgba(0,0,0,0.55)',       // bottom dark edge
      'inset 1px 0 0 rgba(255,255,255,0.06)',  // left subtle sheen
    ].join(', '),
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

  const BOTTOM_H = 76;
  const topModes = modes.filter(m => m.id !== 'store');

  const iconButtons = [
    { icon: Trophy,  onClick: () => toast('Em breve', { description: 'Rankings chegando em breve.' }) },
    { icon: Package, onClick: () => toast('Em breve', { description: 'Inventário chegando em breve.' }) },
    { icon: Users,   onClick: onOpenFriends },
  ] as const;

  const modalSubModes = (selected ? BANNER_DATA[selected] : []) ?? [];

  return (
    <>
    {/* 3-column grid: [modes | banner | (icons + passe-ace)], bottom row shared */}
    <div
      className="h-full w-full overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: '155px 1fr 200px',
        // minmax(0, 1fr) lets the top row actually shrink to fit short
        // (landscape) viewports instead of overflowing and clipping the
        // bottom button row.
        gridTemplateRows: 'minmax(0, 1fr) auto',
        columnGap: '8px',
        rowGap: '8px',
        padding: 'calc(12px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left))',
      }}
    >

      {/* ══ COL 1: Mode buttons (flex column, each flex-1 → identical heights) ══ */}
      <div className="z-10 flex flex-col gap-2 min-h-0" style={{ gridColumn: 1, gridRow: 1 }}>
        {topModes.map((mode) => {
          const mc = MODE_CFG[mode.id] ?? MODE_CFG.training;
          const isActive = mode.id === selected;
          return (
            <motion.button
              key={mode.id}
              onClick={() => setSelected(prev => prev === mode.id ? null : mode.id as ModeId)}
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex flex-col gap-1.5 px-4 py-4 rounded-[15px] overflow-hidden text-left cursor-pointer w-full flex-1 min-h-0"
              style={{
                background: isActive
                  ? `linear-gradient(155deg, rgba(14,14,20,0.97) 0%, rgba(6,6,10,0.99) 60%, ${mc.accent}0a 100%)`
                  : 'linear-gradient(155deg, rgba(12,12,18,0.95) 0%, rgba(5,5,8,0.98) 100%)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${isActive ? mc.accent + '55' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: isActive
                  ? `0 0 0 1px ${mc.accent}22, inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.5)`
                  : 'inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.4)',
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
                style={{ color: isActive ? mc.accent : '#fff', textShadow: isActive ? `0 0 20px ${mc.accent}60` : '0 1px 2px rgba(0,0,0,0.6)' }}>
                {mc.label}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none relative z-10"
                style={{ color: isActive ? mc.accent + 'bb' : 'rgba(255,255,255,0.75)' }}>
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

      {/* ══ COL 2: Banner — spans both rows when no mode selected ══ */}
      <div className="flex items-stretch z-10 min-h-0 min-w-0 relative" style={{ gridColumn: 2, gridRow: selected === null ? '1 / 3' : 1 }}>
        <motion.div
          className="absolute inset-0"
          style={{ touchAction: 'pan-y' }}
          onPanEnd={(_, info) => {
            if (slides.length <= 1) return;
            if (Math.abs(info.offset.x) > 40 || Math.abs(info.velocity.x) > 300) {
              const next = info.offset.x < 0
                ? (slideIdxRef.current + 1) % slides.length
                : (slideIdxRef.current - 1 + slides.length) % slides.length;
              goToRef.current(next);
            }
          }}
        >
          {/* Previous slide stays fully opaque underneath while new one fades in */}
          {prevSlideId !== null && (() => {
            const prev = slides.find(s => s.id === prevSlideId);
            return prev ? (
              <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <BannerCard slide={prev} accent={cfg.accent} glow={cfg.glow}
                  slideCount={slides.length} slideIdx={slideIdx}
                  onDot={(i) => goToRef.current(i)} />
              </div>
            ) : null;
          })()}
          {/* Current slide fades in on top of the previous */}
          <motion.div
            key={currentSlide.id}
            className="absolute inset-0"
            style={{ zIndex: 2 }}
            initial={{ opacity: prevSlideId !== null ? 0 : 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prevSlideId !== null ? 1.1 : 0.4, ease: 'easeInOut' }}
            onAnimationComplete={() => setPrevSlideId(null)}
          >
            <BannerCard
              slide={currentSlide} accent={cfg.accent} glow={cfg.glow}
              slideCount={slides.length} slideIdx={Math.min(slideIdx, slides.length - 1)}
              onDot={(i) => goToRef.current(i)}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ══ COL 3: Icon buttons row (top) + Passe Ace (fills rest) ══ */}
      <div className="z-10 flex flex-col gap-2 min-h-0" style={{ gridColumn: 3, gridRow: 1 }}>
        {/* Icon buttons (horizontal row) */}
        <div className="flex gap-2 shrink-0">
          {iconButtons.map(({ icon: Icon, onClick }, i) => (
            <motion.button
              key={i}
              onClick={onClick}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.93 }}
              className="relative flex-1 flex items-center justify-center py-4 rounded-[14px] overflow-hidden cursor-pointer"
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

        {/* Passe Ace fills the remaining space */}
        <motion.div
          role="button"
          onClick={onOpenBattlePass}
          whileTap={{ scale: 0.985 }}
          className="relative rounded-[16px] overflow-hidden flex-1 min-h-0 flex flex-col cursor-pointer" style={{
          ...glass, border: '1px solid rgba(237,10,101,0.22)',
          background: 'linear-gradient(155deg, rgba(14,8,12,0.97) 0%, rgba(5,3,5,0.99) 70%, rgba(237,10,101,0.04) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.4)',
        }}>
          <EdgeLayers accent="#ED0A65" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 15% 50%, rgba(237,10,101,0.08) 0%, transparent 60%)' }} />

          {/* Header */}
          <div className="relative z-10 px-4 pt-3.5 flex items-center justify-between">
            <span className="font-display text-[16px] leading-none tracking-[0.08em]"
              style={{ color: '#ED0A65', textShadow: '0 0 18px rgba(237,10,101,0.5)' }}>PASSE ACE</span>
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
              <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #c00038, #ED0A65)', boxShadow: '0 0 8px rgba(237,10,101,0.7)' }} />
            </div>
          </div>

          {/* Spacer pushes rewards to bottom */}
          <div className="flex-1" />

          {/* Rewards */}
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
        </motion.div>
      </div>

      {/* ══ ROW 2, COL 1: LOJA — always visible ══ */}
      <div className="z-10" style={{ gridColumn: 1, gridRow: 2 }}>
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
            boxShadow: '0 0 18px rgba(251,191,36,0.22), inset 0 1px 0 rgba(255,255,255,0.14)',
          }}
        >
          <motion.div animate={{ x: ['-100%', '320%'] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', repeatDelay: 2 }}
            className="absolute inset-y-0 pointer-events-none z-20"
            style={{ width: '45%', background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.22), rgba(255,230,100,0.14), transparent)' }} />
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
              style={{ color: 'rgba(251,191,36,0.85)', textShadow: '0 0 16px rgba(251,191,36,0.5)' }}>LOJA</div>
            <div className="text-[10px] font-black uppercase tracking-widest leading-none mt-1"
              style={{ color: 'rgba(251,191,36,0.55)' }}>ITENS PREMIUM</div>
          </div>
        </motion.button>
      </div>

      {/* ══ ROW 2, COL 2: JOGAR — only when a mode is selected ══ */}
      <div className="z-10 relative" style={{ gridColumn: 2, gridRow: 2, height: BOTTOM_H }}>
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              key={selected + '-jogar'}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.92, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 14 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
            >
              {/* Outer pulse glow */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-[18px] pointer-events-none"
                style={{ boxShadow: `0 0 48px ${cfg.glow}90, 0 0 90px ${cfg.glow}45, 0 0 140px ${cfg.glow}20` }}
              />
              <motion.button
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96, y: 0 }}
                onClick={handlePlay}
                className="relative overflow-hidden cursor-pointer w-full h-full"
                style={{
                  borderRadius: '18px',
                  background: cfg.btnGrad,
                  border: `1px solid rgba(255,255,255,0.28)`,
                  boxShadow: [
                    `0 0 32px ${cfg.glow}70`,
                    'inset 0 3px 0 rgba(255,255,255,0.80)',
                    'inset 0 -2px 0 rgba(0,0,0,0.30)',
                    'inset 2px 0 0 rgba(255,255,255,0.28)',
                    'inset -2px 0 0 rgba(255,255,255,0.12)',
                  ].join(', '),
                }}
              >
                {/* Main gloss — large top reflection */}
                <div className="absolute inset-x-0 top-0 pointer-events-none"
                  style={{ height: '52%', borderRadius: '18px 18px 0 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.26) 45%, transparent 100%)' }} />
                {/* Bright top edge line */}
                <div className="absolute top-0 inset-x-4 h-[2px] pointer-events-none rounded-full"
                  style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.98) 50%, transparent 95%)' }} />
                {/* Left edge sheen */}
                <div className="absolute left-0 top-2 bottom-2 w-[3px] pointer-events-none rounded-r-full"
                  style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.08) 100%)' }} />
                {/* Sweeping shine animation */}
                <motion.div
                  animate={{ x: ['-120%', '220%'] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', repeatDelay: 1.4 }}
                  className="absolute inset-y-0 pointer-events-none"
                  style={{ width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.30), rgba(255,255,255,0.18), transparent)', transform: 'skewX(-18deg)' }}
                />
                {/* Bottom glow reflection */}
                <div className="absolute inset-x-6 bottom-0 pointer-events-none"
                  style={{ height: '40%', background: `linear-gradient(0deg, ${cfg.glow}50 0%, transparent 100%)` }} />
                {/* Label + supporting phrase */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-0.5">
                  <span className="block text-center font-display leading-none tracking-[0.2em]"
                    style={{ fontSize: '26px', color: cfg.btnColor, textShadow: cfg.btnColor === '#000' ? '0 1px 0 rgba(255,255,255,0.35)' : `0 0 18px ${cfg.glow}, 0 2px 4px rgba(0,0,0,0.4)` }}>
                    {cfg.btnText}
                  </span>
                  <span className="block text-center font-semibold uppercase leading-none tracking-[0.06em]"
                    style={{ fontSize: '9px', color: cfg.btnColor === '#000' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)' }}>
                    {cfg.btnSub}
                  </span>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══ ROW 2, COL 3: CAIXA GRÁTIS — always visible ══ */}
      <div className="z-10" style={{ gridColumn: 3, gridRow: 2 }}>
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

    {/* ══ PLAY MODAL — game mode + bet value selection ══ */}
    <AnimatePresence>
      {playModalOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ background: 'rgba(2,4,3,0.74)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          onClick={() => setPlayModalOpen(false)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 22, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 14, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative rounded-[24px] overflow-hidden flex flex-col"
            style={{
              width: 'min(94vw, 700px)', maxHeight: '92vh',
              background: 'linear-gradient(160deg, rgba(20,20,23,0.98) 0%, rgba(9,9,12,0.99) 100%)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: [
                `0 30px 80px rgba(0,0,0,0.7)`,
                `0 0 60px ${cfg.glow}25`,
                'inset 0 1px 0 rgba(255,255,255,0.20)',
                'inset 0 -1px 0 rgba(0,0,0,0.5)',
              ].join(', '),
            }}
          >
            {/* Top metallic accent line */}
            <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent 6%, ${cfg.accent}55 28%, rgba(255,255,255,0.5) 50%, ${cfg.accent}40 72%, transparent 94%)` }} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${cfg.glow}18 0%, transparent 60%)` }} />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
              <div>
                <div className="font-display leading-none tracking-[0.06em]" style={{ fontSize: '26px', color: '#fff' }}>
                  {cfg.label}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] mt-1" style={{ color: cfg.accent }}>
                  {selected === 'tournaments' ? 'Escolha o formato e a entrada' : 'Escolha o modo e o valor'}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => setPlayModalOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <X style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.7)' }} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="relative z-10 px-6 pb-3 overflow-y-auto no-scrollbar flex flex-col gap-4">

              {/* Game modes */}
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Modo de jogo
                </div>
                <div className="flex gap-2.5">
                  {modalSubModes.map((sm) => {
                    const isSel = sm.id === modalModeId;
                    const img = SLIDE_BG_IMAGE[sm.id];
                    return (
                      <motion.button
                        key={sm.id}
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setModalModeId(sm.id)}
                        className="relative flex-1 rounded-[14px] overflow-hidden cursor-pointer text-left"
                        style={{
                          height: 76,
                          border: `1.5px solid ${isSel ? cfg.accent : 'rgba(255,255,255,0.1)'}`,
                          boxShadow: isSel ? `0 0 0 1px ${cfg.accent}40, 0 0 20px ${cfg.glow}40` : 'none',
                        }}
                      >
                        {img ? (
                          <div className="absolute inset-0" style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        ) : (
                          <div className="absolute inset-0" style={{ background: `linear-gradient(150deg, ${cfg.accent}22 0%, rgba(8,8,10,0.9) 70%)` }} />
                        )}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(2,3,4,0.25) 0%, rgba(2,3,4,0.85) 100%)' }} />
                        {isSel && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: cfg.accent, boxShadow: `0 0 10px ${cfg.glow}` }}>
                            <Check style={{ width: 12, height: 12, color: '#000' }} strokeWidth={3} />
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 p-2">
                          <div className="font-display leading-none tracking-[0.04em]" style={{ fontSize: '15px', color: '#fff' }}>{sm.title}</div>
                          <div className="text-[8px] font-bold uppercase tracking-[0.1em] mt-0.5" style={{ color: isSel ? cfg.accent : 'rgba(255,255,255,0.5)' }}>{sm.sub}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Bet values */}
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Valor da aposta
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {BET_TIERS.map((tier, i) => {
                    const isSel = tier.value === modalBet;
                    const count = betCounts[i];
                    return (
                      <motion.button
                        key={tier.value}
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setModalBet(tier.value)}
                        className="relative rounded-[13px] overflow-hidden cursor-pointer flex flex-col items-center justify-center py-2.5 gap-1.5"
                        style={{
                          background: isSel
                            ? `linear-gradient(160deg, ${cfg.accent}26 0%, rgba(10,10,12,0.95) 75%)`
                            : 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(8,8,10,0.6) 100%)',
                          border: `1.5px solid ${isSel ? cfg.accent : 'rgba(255,255,255,0.1)'}`,
                          boxShadow: isSel ? `0 0 18px ${cfg.glow}45, inset 0 1px 0 rgba(255,255,255,0.18)` : 'inset 0 1px 0 rgba(255,255,255,0.06)',
                        }}
                      >
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-[9px] font-bold" style={{ color: isSel ? cfg.accent : 'rgba(255,255,255,0.45)' }}>R$</span>
                          <span className="font-display leading-none" style={{ fontSize: '22px', color: '#fff' }}>{tier.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 1.6 }}
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: '#00e870', boxShadow: '0 0 5px #00e870' }} />
                          <Users style={{ width: 10, height: 10, color: 'rgba(255,255,255,0.4)' }} />
                          <span className="text-[10px] font-bold leading-none" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            {count}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer — confirm */}
            <div className="relative z-10 px-6 pt-2 pb-5 shrink-0">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                onClick={confirmMatch}
                className="group relative w-full overflow-hidden cursor-pointer rounded-[16px] flex items-center justify-center"
                style={{
                  height: 56,
                  background: cfg.btnGrad,
                  border: '1px solid rgba(255,255,255,0.30)',
                  boxShadow: [
                    `0 8px 26px ${cfg.glow}55`,
                    `0 0 34px ${cfg.glow}40`,
                    'inset 0 2.5px 0 rgba(255,255,255,0.78)',
                    'inset 0 -2px 0 rgba(0,0,0,0.30)',
                    'inset 2px 0 0 rgba(255,255,255,0.22)',
                    'inset -2px 0 0 rgba(255,255,255,0.12)',
                  ].join(', '),
                }}
              >
                {/* Top gloss */}
                <div className="absolute inset-x-0 top-0 pointer-events-none"
                  style={{ height: '52%', borderRadius: '16px 16px 0 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.18) 50%, transparent 100%)' }} />
                {/* Bright top edge line */}
                <div className="absolute top-0 inset-x-5 h-[2px] pointer-events-none rounded-full"
                  style={{ background: 'linear-gradient(90deg, transparent 4%, rgba(255,255,255,0.95) 50%, transparent 96%)' }} />
                {/* Bottom inner glow */}
                <div className="absolute inset-x-6 bottom-0 pointer-events-none"
                  style={{ height: '42%', background: `linear-gradient(0deg, ${cfg.glow}55 0%, transparent 100%)` }} />
                {/* Sweeping shine */}
                <motion.div
                  animate={{ x: ['-130%', '230%'] }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut', repeatDelay: 1.6 }}
                  className="absolute inset-y-0 pointer-events-none"
                  style={{ width: '38%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.34), rgba(255,255,255,0.18), transparent)', transform: 'skewX(-18deg)' }}
                />
                {/* Label */}
                <div className="relative z-10 flex items-center gap-2.5">
                  <Play style={{ width: 17, height: 17, color: cfg.btnColor, fill: cfg.btnColor }} />
                  <span className="font-display tracking-[0.16em]"
                    style={{ fontSize: '24px', color: cfg.btnColor, textShadow: cfg.btnColor === '#000' ? '0 1px 0 rgba(255,255,255,0.3)' : 'none' }}>
                    {selected === 'tournaments' ? 'CONFIRMAR' : 'JOGAR'}
                  </span>
                  {selected !== 'tournaments' && (
                    <span className="font-display tracking-[0.04em] px-2 py-0.5 rounded-md"
                      style={{ fontSize: '17px', color: cfg.btnColor, background: 'rgba(0,0,0,0.16)', border: '1px solid rgba(0,0,0,0.12)' }}>
                      {money(modalBet)}
                    </span>
                  )}
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
