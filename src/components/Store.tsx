import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Flame, Swords, LayoutGrid, CircleUser, Package, X, type LucideIcon } from 'lucide-react';

type TabId = 'destaque' | 'tacos' | 'mesas' | 'avatares' | 'baus';

interface Category {
  id: TabId; label: string; count: number; Icon: LucideIcon;
  color: string; glow: string; description: string; isNew?: boolean;
}

const CATEGORIES: Category[] = [
  { id: 'destaque',  label: 'Destaque', count: 6, Icon: Flame,      color: '#f59e0b', glow: 'rgba(245,158,11,0.3)',  description: 'Ofertas exclusivas da semana' },
  { id: 'tacos',    label: 'Tacos',    count: 6, Icon: Swords,     color: '#cbd5e1', glow: 'rgba(203,213,225,0.2)', description: 'Tacos personalizados' },
  { id: 'mesas',    label: 'Mesas',    count: 5, Icon: LayoutGrid, color: '#00d26a', glow: 'rgba(0,210,106,0.3)',   description: 'Panos exclusivos', isNew: true },
  { id: 'avatares', label: 'Avatares', count: 7, Icon: CircleUser, color: '#818cf8', glow: 'rgba(129,140,248,0.3)', description: 'Perfis únicos' },
  { id: 'baus',     label: 'Baús',     count: 4, Icon: Package,    color: '#e879f9', glow: 'rgba(232,121,249,0.3)', description: 'Surpresas especiais', isNew: true },
];

type Rarity = 'LENDÁRIO' | 'ÉPICO' | 'RARO' | 'COMUM' | 'EXCLUSIVO' | 'COPA 3D' | 'ANIMADO' | 'PREMIUM' | 'PADRÃO';

const RARITY_COLOR: Record<Rarity, string> = {
  'LENDÁRIO': '#f59e0b', 'ÉPICO': '#a855f7', 'RARO': '#3b82f6', 'COMUM': '#9ca3af',
  'EXCLUSIVO': '#ff004c', 'COPA 3D': '#fde047', 'ANIMADO': '#34d399',
  'PREMIUM': '#f9a8d4', 'PADRÃO': '#6b7280',
};

const RARITY_TIER: Record<Rarity, number> = {
  'LENDÁRIO': 5, 'EXCLUSIVO': 4, 'ÉPICO': 3, 'COPA 3D': 3,
  'ANIMADO': 2, 'PREMIUM': 2, 'RARO': 2, 'COMUM': 1, 'PADRÃO': 0,
};

const USER_BALANCE = 12450;
const parsePrice = (price: string) => parseInt(price.replace('.', ''), 10);

interface StoreItem {
  id: string; name: string; rarity: Rarity; price: string; accent: string;
  description?: string; badge?: string; image?: string; avatarUrl?: string;
  tableColor?: string; chestGradient?: string; chestIcon?: string;
}

const CUES: StoreItem[] = [
  { id: 'cu1', name: 'Taco de Ouro',   rarity: 'LENDÁRIO', price: '25.000', accent: '#f59e0b', description: 'Forjado em ouro puro, símbolo máximo de supremacia nas mesas.', image: 'https://images.unsplash.com/photo-1595861962325-1e42e47c162f?auto=format&fit=crop&w=400&q=80' },
  { id: 'cu2', name: 'Predador Negro', rarity: 'ÉPICO',    price: '12.500', accent: '#a855f7', description: 'Acabamento em ébano fosco com precisão letal.', image: 'https://images.unsplash.com/photo-1615671043232-a5d6255776d6?auto=format&fit=crop&w=400&q=80' },
  { id: 'cu3', name: 'Fibra Carbono',  rarity: 'RARO',     price: '4.800',  accent: '#3b82f6', description: 'Leveza extrema e rigidez máxima para jogadas perfeitas.', image: 'https://images.unsplash.com/photo-1629810817025-b9b58ba0cbac?auto=format&fit=crop&w=400&q=80' },
  { id: 'cu4', name: 'Cobra de Fogo',  rarity: 'ÉPICO',    price: '9.200',  accent: '#ef4444', description: 'Design flamejante para quem joga com intensidade e paixão.', badge: 'NOVO', image: 'https://images.unsplash.com/photo-1563288600-63f3c9af6af9?auto=format&fit=crop&w=400&q=80' },
  { id: 'cu5', name: 'Glacial',        rarity: 'LENDÁRIO', price: '32.000', accent: '#67e8f9', description: 'Fria como o ártico, implacável como uma tempestade de gelo.', image: 'https://images.unsplash.com/photo-1615671043232-a5d6255776d6?auto=format&fit=crop&w=400&q=80' },
  { id: 'cu6', name: 'Iniciante',      rarity: 'COMUM',    price: '1.200',  accent: '#9ca3af', description: 'O começo de uma grande jornada no snooker.', image: 'https://images.unsplash.com/photo-1629810817025-b9b58ba0cbac?auto=format&fit=crop&w=400&q=80' },
];

const TABLES: StoreItem[] = [
  { id: 'ta1', name: 'Mesa Real',      rarity: 'LENDÁRIO', price: '28.000', accent: '#f59e0b', description: 'O pano dourado dos campeões mundiais.', tableColor: '#1f6b30', badge: 'DESTAQUE' },
  { id: 'ta2', name: 'Abismo Azul',    rarity: 'ÉPICO',    price: '15.000', accent: '#3b82f6', description: 'Jogue nas profundezas de um oceano de precisão.', tableColor: '#0f2d5e' },
  { id: 'ta3', name: 'Veludo Negro',   rarity: 'ÉPICO',    price: '13.000', accent: '#a855f7', description: 'Elegância sombria para partidas épicas.', tableColor: '#1a0a2e' },
  { id: 'ta4', name: 'Baize Clássico', rarity: 'PADRÃO',   price: '4.500',  accent: '#00d26a', description: 'O verde tradicional que resistiu ao tempo.', tableColor: '#1a5c2e' },
  { id: 'ta5', name: 'Escarlate',      rarity: 'RARO',     price: '6.000',  accent: '#ef4444', description: 'Desafie seus limites no vermelho do perigo.', tableColor: '#5c1212' },
];

const AVATARS: StoreItem[] = [
  { id: 'av1', name: 'O Rei',     rarity: 'LENDÁRIO',  price: '25.000', accent: '#4ade80', description: 'Lenda viva do esporte. Poucos chegam perto de sua majestade.', avatarUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=Pele&backgroundColor=4ade80',    badge: 'LIMITADO' },
  { id: 'av2', name: 'Canarinho', rarity: 'COPA 3D',   price: '15.000', accent: '#fde047', description: 'O sorriso que conquistou o mundo.', avatarUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=Neymar&backgroundColor=fde047' },
  { id: 'av3', name: 'El Diez',   rarity: 'COPA 3D',   price: '15.000', accent: '#7dd3fc', description: 'Magia pura em cada tacada.', avatarUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=Messi&backgroundColor=7dd3fc' },
  { id: 'av4', name: 'Robozão',   rarity: 'COPA 3D',   price: '15.000', accent: '#ef4444', description: 'Eficiência e precisão máxima.', avatarUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=Ronaldo&backgroundColor=ef4444' },
  { id: 'av5', name: 'Ninja',     rarity: 'EXCLUSIVO', price: '10.000', accent: '#f472b6', description: 'Sombra veloz, golpe certeiro.', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja' },
  { id: 'av6', name: 'Mestre',    rarity: 'PREMIUM',   price: '5.000',  accent: '#f9a8d4', description: 'Décadas de experiência em cada movimento.', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master' },
  { id: 'av7', name: 'Shark',     rarity: 'ANIMADO',   price: '8.000',  accent: '#34d399', description: 'Silencioso nas águas, devastador no ataque.', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shark' },
];

const CHESTS: StoreItem[] = [
  { id: 'ch1', name: 'Baú Lendário', rarity: 'LENDÁRIO',  price: '9.500', accent: '#f59e0b', description: 'Tesouros raros e itens lendários aguardam dentro deste baú.', chestGradient: 'linear-gradient(155deg,#78350f 0%,#b45309 60%,#d97706 100%)', chestIcon: '🏆', badge: 'POPULAR' },
  { id: 'ch2', name: 'Baú Épico',    rarity: 'ÉPICO',     price: '3.800', accent: '#a855f7', description: 'Poder e glória selados neste baú roxo.', chestGradient: 'linear-gradient(155deg,#3b0764 0%,#6d28d9 60%,#8b5cf6 100%)', chestIcon: '⚡' },
  { id: 'ch3', name: 'Baú Raro',     rarity: 'RARO',      price: '1.200', accent: '#3b82f6', description: 'Itens raros para colecionadores exigentes.', chestGradient: 'linear-gradient(155deg,#1e3a5f 0%,#1e40af 60%,#3b82f6 100%)', chestIcon: '📦' },
  { id: 'ch4', name: 'Baú do Passe', rarity: 'EXCLUSIVO', price: 'PASSE', accent: '#ff004c', description: 'Recompensas exclusivas apenas para detentores do Passe Ace.', chestGradient: 'linear-gradient(155deg,#3f0018 0%,#880025 60%,#cc0038 100%)', chestIcon: '🎴', badge: 'EXCLUSIVO' },
];

const FEATURED: StoreItem[] = [
  { id: 'fe1', name: 'Taco de Ouro',  rarity: 'LENDÁRIO', price: '20.000', accent: '#f59e0b', description: 'Forjado em ouro puro. Oferta especial com 20% de desconto por tempo limitado.', badge: 'OFERTA -20%', image: CUES[0].image },
  { id: 'fe2', name: 'Baú Lendário',  rarity: 'LENDÁRIO', price: '9.500',  accent: '#f59e0b', description: 'Tesouros raros e itens lendários aguardam. Recém chegou à loja.', badge: 'NOVO', chestGradient: CHESTS[0].chestGradient, chestIcon: '🏆' },
  { id: 'fe3', name: 'O Rei',         rarity: 'LENDÁRIO', price: '25.000', accent: '#4ade80', description: 'Disponível por tempo limitado — quando acabar, não volta mais.', badge: 'LIMITADO', avatarUrl: AVATARS[0].avatarUrl },
  { id: 'fe4', name: 'Mesa Real',     rarity: 'LENDÁRIO', price: '28.000', accent: '#f59e0b', description: 'O pano dourado dos campeões mundiais.', badge: 'DESTAQUE', tableColor: TABLES[0].tableColor },
  { id: 'fe5', name: 'Cobra de Fogo', rarity: 'ÉPICO',    price: '9.200',  accent: '#ef4444', description: 'Design flamejante para quem joga com intensidade e paixão.', badge: 'NOVO', image: CUES[3].image },
  { id: 'fe6', name: 'Baú Épico',     rarity: 'ÉPICO',    price: '3.800',  accent: '#a855f7', description: 'Poder e glória selados neste baú roxo.', chestGradient: CHESTS[1].chestGradient, chestIcon: '⚡' },
];

const TAB_ITEMS: Record<TabId, StoreItem[]> = {
  destaque: FEATURED, tacos: CUES, mesas: TABLES, avatares: AVATARS, baus: CHESTS,
};

/* ── Shared glass edge highlights ───────────────────────────────── */
const EdgeLayers = ({ accent }: { accent?: string }) => (
  <>
    <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{
      background: accent
        ? `linear-gradient(90deg, transparent 5%, ${accent}55 25%, rgba(255,255,255,0.38) 50%, ${accent}38 75%, transparent 95%)`
        : 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.16) 70%, transparent 95%)',
    }} />
    <div className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
      style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.07) 45%, transparent 80%)' }} />
    <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: 'rgba(0,0,0,0.6)' }} />
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: 'linear-gradient(128deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 35%, transparent 55%)' }} />
  </>
);

/* ── Table top-down preview ─────────────────────────────────────── */
function TablePreview({ color }: { color: string }) {
  const pockets = [
    { x: '0%', y: '0%' }, { x: '50%', y: '0%' }, { x: '100%', y: '0%' },
    { x: '0%', y: '100%' }, { x: '50%', y: '100%' }, { x: '100%', y: '100%' },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative" style={{ width: '80%', height: '76%' }}>
        <div className="absolute inset-0 rounded-[7px]"
          style={{ background: 'linear-gradient(135deg,#5c3210,#7a4520,#5c3210)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)' }} />
        <div className="absolute inset-[9px] rounded-[3px]"
          style={{ background: color, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)' }}>
          <div className="absolute top-[8%] bottom-[8%] left-1/2 w-px bg-white/10" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15" />
          <div className="absolute right-[18%] top-[18%] bottom-[18%] w-[18%] rounded-l-full border border-white/10" />
        </div>
        {pockets.map((p, i) => (
          <div key={i} className="absolute w-4 h-4 rounded-full bg-[#050505]"
            style={{ left: p.x, top: p.y, transform: 'translate(-50%,-50%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.04)' }} />
        ))}
      </div>
    </div>
  );
}

/* ── Chest preview ──────────────────────────────────────────────── */
function ChestPreview({ gradient, icon }: { gradient: string; icon: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: gradient }}>
      <span className="text-[44px] leading-none" style={{ filter: 'drop-shadow(0 0 16px rgba(255,255,255,0.35))' }}>{icon}</span>
    </div>
  );
}

/* ── Left sidebar category button ──────────────────────────────── */
function CategorySideButton({ cat, isActive, onClick }: { cat: Category; isActive: boolean; onClick: () => void }) {
  const { Icon } = cat;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 3, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col justify-between px-3.5 py-3 rounded-[15px] overflow-hidden text-left cursor-pointer w-full flex-1 min-h-0"
      style={{
        background: isActive
          ? `linear-gradient(155deg, rgba(14,14,20,0.97) 0%, rgba(6,6,10,0.99) 60%, ${cat.color}0a 100%)`
          : 'linear-gradient(155deg, rgba(12,12,18,0.95) 0%, rgba(5,5,8,0.98) 100%)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${isActive ? cat.color + '55' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: isActive
          ? `0 12px 40px rgba(0,0,0,0.9), 0 0 0 1px ${cat.color}22, inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.5)`
          : '0 8px 32px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.4)',
      }}
    >
      {/* Active left bar */}
      {isActive && (
        <motion.div
          layoutId="store-cat-bar"
          className="absolute left-0 top-[18%] bottom-[18%] w-[4px] rounded-r-full"
          style={{ background: cat.color, boxShadow: `0 0 12px ${cat.color}, 0 0 24px ${cat.color}60` }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        />
      )}
      <EdgeLayers accent={isActive ? cat.color : undefined} />
      {isActive && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 20% 50%, ${cat.color}12 0%, transparent 65%)` }} />
      )}

      {/* Icon */}
      <Icon size={17} strokeWidth={2} color={isActive ? cat.color : 'rgba(255,255,255,0.3)'} className="relative z-10 shrink-0" />

      {/* Label + count */}
      <div className="relative z-10">
        <div className="font-display leading-none tracking-[0.06em]"
          style={{ fontSize: '14px', color: isActive ? cat.color : 'rgba(255,255,255,0.38)', textShadow: isActive ? `0 0 20px ${cat.color}60` : 'none' }}>
          {cat.label}
        </div>
        <div className="text-[9px] font-black uppercase tracking-widest leading-none mt-1"
          style={{ color: isActive ? cat.color + 'bb' : 'rgba(255,255,255,0.22)' }}>
          {cat.count} itens
        </div>
      </div>

      {/* New dot */}
      {cat.isNew && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute top-3 right-3 w-2 h-2 rounded-full"
          style={{ background: cat.color, boxShadow: `0 0 7px ${cat.color}, 0 0 14px ${cat.color}70` }}
        />
      )}
    </motion.button>
  );
}

/* ── Store card (horizontal scroll, fixed width) ────────────────── */
function StoreCard({ item, index, onBuy }: { item: StoreItem; index: number; onBuy: (item: StoreItem) => void }) {
  const rarityColor = RARITY_COLOR[item.rarity] ?? '#9ca3af';
  const isPasse = item.price === 'PASSE';
  const tier = RARITY_TIER[item.rarity] ?? 0;

  const cardBg = tier >= 5
    ? `radial-gradient(ellipse at 30% -10%, ${rarityColor}40 0%, ${rarityColor}14 38%, rgba(8,8,12,0.97) 68%)`
    : tier >= 4
      ? `radial-gradient(ellipse at 30% -10%, ${rarityColor}30 0%, ${rarityColor}10 40%, rgba(8,8,12,0.95) 68%)`
      : tier >= 3
        ? `radial-gradient(ellipse at 30% -10%, ${rarityColor}22 0%, ${rarityColor}08 42%, rgba(8,8,12,0.92) 68%)`
        : tier >= 2
          ? `radial-gradient(ellipse at 30% -10%, ${rarityColor}12 0%, rgba(8,8,12,0.88) 60%)`
          : 'rgba(9,9,13,0.92)';

  const cardBorder = tier >= 3
    ? `1px solid ${rarityColor}${tier >= 5 ? '75' : tier >= 4 ? '60' : '45'}`
    : tier >= 2 ? `1px solid ${rarityColor}28` : '1px solid rgba(255,255,255,0.08)';

  const metallicInsets = tier >= 5
    ? 'inset 0 1px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(0,0,0,0.55), inset 1px 0 0 rgba(255,255,255,0.22), inset -1px 0 0 rgba(0,0,0,0.35)'
    : tier >= 4 ? 'inset 0 1px 0 rgba(255,255,255,0.48), inset 0 -1px 0 rgba(0,0,0,0.45), inset 1px 0 0 rgba(255,255,255,0.16)'
    : tier >= 3 ? 'inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -1px 0 rgba(0,0,0,0.35)'
    : tier >= 2 ? 'inset 0 1px 0 rgba(255,255,255,0.14)' : 'inset 0 1px 0 rgba(255,255,255,0.07)';

  const outerGlow = tier >= 5
    ? `0 0 40px ${rarityColor}35, 0 0 80px ${rarityColor}12, 0 14px 40px rgba(0,0,0,0.72)`
    : tier >= 4 ? `0 0 24px ${rarityColor}25, 0 10px 36px rgba(0,0,0,0.66)`
    : tier >= 3 ? `0 0 16px ${rarityColor}18, 0 8px 32px rgba(0,0,0,0.62)`
    : '0 6px 24px rgba(0,0,0,0.55)';

  const stripH = tier >= 5 ? '4px' : tier >= 3 ? '3px' : '2px';
  const stripGlow = tier >= 5
    ? `0 0 14px ${rarityColor}, 0 0 28px ${rarityColor}70`
    : tier >= 4 ? `0 0 9px ${rarityColor}cc` : tier >= 3 ? `0 0 6px ${rarityColor}99` : 'none';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.055, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[20px] overflow-hidden flex flex-col cursor-pointer h-full"
      onClick={() => onBuy(item)}
      whileTap={{ scale: 0.96, transition: { duration: 0.12 } }}
      style={{
        background: cardBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: cardBorder, boxShadow: [outerGlow, metallicInsets].join(', '),
      }}
    >
      {/* Rarity top strip */}
      <div className="absolute top-0 inset-x-0 z-20 pointer-events-none rounded-t-[20px]"
        style={{ height: stripH, background: rarityColor, boxShadow: stripGlow }} />

      {/* Legendary shimmer */}
      {tier >= 5 && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          animate={{ x: ['-120%', '220%'] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 5, ease: 'linear' }}
          style={{ background: `linear-gradient(105deg, transparent 35%, ${rarityColor}18 50%, transparent 65%)` }}
        />
      )}

      {tier >= 3 && (
        <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none z-10"
          style={{ background: `radial-gradient(circle at 100% 0%, ${rarityColor}20 0%, transparent 70%)` }} />
      )}
      <EdgeLayers accent={tier >= 3 ? rarityColor : undefined} />

      {/* Visual area */}
      <div className="relative overflow-hidden shrink-0"
        style={{ height: '130px', background: `linear-gradient(145deg, ${item.accent}22 0%, rgba(8,8,12,0.9) 100%)` }}>
        {item.image && (
          <>
            <img src={item.image} alt="" className="w-full h-full object-cover opacity-55"
              onError={e => { e.currentTarget.style.display = 'none'; }} />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%)' }} />
          </>
        )}
        {item.avatarUrl && (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: `radial-gradient(circle at 50% 60%, ${item.accent}22 0%, rgba(0,0,0,0) 70%)` }}>
            <div className="relative">
              <div className="absolute inset-0 rounded-full scale-110"
                style={{ background: `radial-gradient(circle, ${item.accent}30, transparent 70%)` }} />
              <img src={item.avatarUrl} alt={item.name}
                className="w-[72px] h-[72px] rounded-full relative z-10"
                style={{ border: `2px solid ${item.accent}60`, boxShadow: `0 0 20px ${item.accent}35` }} />
            </div>
          </div>
        )}
        {item.tableColor && <TablePreview color={item.tableColor} />}
        {item.chestGradient && <ChestPreview gradient={item.chestGradient} icon={item.chestIcon!} />}
      </div>

      {/* Info area */}
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3 gap-1 min-h-0">
        <span className="text-[8px] font-black uppercase tracking-[0.18em] shrink-0" style={{ color: rarityColor }}>
          {item.rarity}
        </span>
        <h3 className="font-display leading-none tracking-wide shrink-0" style={{ fontSize: '17px', color: 'rgba(255,255,255,0.92)' }}>
          {item.name}
        </h3>
        {item.description && (
          <p className="text-[9px] leading-[1.4] line-clamp-2 mt-0.5 flex-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
            {item.description}
          </p>
        )}

        {/* Price / buy button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="mt-auto shrink-0 flex items-center justify-center gap-1.5 rounded-[11px] py-2.5 relative overflow-hidden"
          style={
            isPasse
              ? { background: 'rgba(255,0,76,0.12)', border: '1px solid rgba(255,0,76,0.38)' }
              : {
                  background: `linear-gradient(135deg, ${rarityColor}28 0%, ${rarityColor}12 100%)`,
                  border: `1px solid ${rarityColor}40`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12)`,
                }
          }
        >
          <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }} />
          {isPasse ? (
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#ff004c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              PASSE ACE
            </span>
          ) : (
            <>
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(145deg,#00e870,#00a84a)', boxShadow: '0 0 6px rgba(0,210,106,0.6)' }}>
                <span style={{ fontSize: '5px', fontWeight: 900, color: '#000', lineHeight: 1 }}>$</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#00e870', textShadow: '0 0 10px rgba(0,210,106,0.45)', lineHeight: 1 }}>
                {item.price}
              </span>
            </>
          )}
        </motion.div>
      </div>

      {/* Badge */}
      {item.badge && (
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-wider z-20"
          style={{ background: item.accent, color: '#000', boxShadow: `0 2px 10px ${item.accent}55` }}>
          {item.badge}
        </div>
      )}
    </motion.div>
  );
}

/* ── Purchase confirmation — bottom sheet ─────────────────────── */
function ConfirmModal({ item, onConfirm, onCancel }: { item: StoreItem; onConfirm: () => void; onCancel: () => void }) {
  const rarityColor = RARITY_COLOR[item.rarity] ?? '#9ca3af';
  const isPasse = item.price === 'PASSE';
  const canAfford = isPasse || parsePrice(item.price) <= USER_BALANCE;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 42 }}
        className="relative w-full rounded-t-[28px] overflow-hidden flex flex-col"
        style={{
          background: 'rgba(8,8,12,0.98)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
          border: `1px solid ${rarityColor}28`, borderBottom: 'none',
          boxShadow: `0 -24px 60px rgba(0,0,0,0.85), 0 0 50px ${rarityColor}12`,
          maxHeight: '82vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 z-10 rounded-t-[28px]"
          style={{ height: '3px', background: rarityColor }} />
        <EdgeLayers accent={rarityColor} />

        <div className="flex items-center justify-center pt-5 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>

        <motion.button
          whileTap={{ scale: 0.88 }} onClick={onCancel}
          className="absolute top-4 right-5 w-8 h-8 rounded-full flex items-center justify-center z-20"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <X size={14} style={{ color: 'rgba(255,255,255,0.45)' }} />
        </motion.button>

        <div className="flex flex-col px-5 pb-8 gap-4 overflow-y-auto no-scrollbar">
          {/* Visual */}
          <div className="relative rounded-[16px] overflow-hidden shrink-0"
            style={{ height: '180px', background: `linear-gradient(145deg, ${item.accent}22 0%, rgba(8,8,12,0.9) 100%)` }}>
            {item.image && (
              <>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-75" />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.5) 100%)' }} />
              </>
            )}
            {item.avatarUrl && (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: `radial-gradient(circle at 50% 55%, ${item.accent}28 0%, rgba(6,6,10,0.9) 72%)` }}>
                <img src={item.avatarUrl} alt={item.name} className="w-[130px] h-[130px] rounded-full"
                  style={{ border: `3px solid ${item.accent}60`, boxShadow: `0 0 40px ${item.accent}35` }} />
              </div>
            )}
            {item.tableColor && (
              <div className="w-full h-full flex items-center justify-center p-5"
                style={{ background: `radial-gradient(circle at 50% 50%, ${item.accent}12 0%, rgba(6,6,10,0.9) 75%)` }}>
                <TablePreview color={item.tableColor} />
              </div>
            )}
            {item.chestGradient && (
              <div className="w-full h-full flex items-center justify-center" style={{ background: item.chestGradient }}>
                <span className="text-[72px] leading-none"
                  style={{ filter: 'drop-shadow(0 0 24px rgba(255,255,255,0.35))' }}>{item.chestIcon}</span>
              </div>
            )}
            <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-[16px]" style={{ background: rarityColor }} />
            {item.badge && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                style={{ background: item.accent, color: '#000', boxShadow: `0 2px 10px ${item.accent}55` }}>
                {item.badge}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2">
            <span className="self-start px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em]"
              style={{ background: `${rarityColor}18`, border: `1px solid ${rarityColor}45`, color: rarityColor }}>
              {item.rarity}
            </span>
            <h2 className="font-display leading-none"
              style={{ fontSize: '34px', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.95)' }}>
              {item.name}
            </h2>
            {item.description && (
              <p className="text-[12px] leading-[1.65]" style={{ color: 'rgba(255,255,255,0.38)' }}>{item.description}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            {!isPasse ? (
              <>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(145deg,#00e870,#00a84a)', boxShadow: '0 0 12px rgba(0,210,106,0.55)' }}>
                  <span className="text-[11px] font-black text-black leading-none">$</span>
                </div>
                <span className="text-[28px] font-black leading-none"
                  style={{ color: '#00e870', textShadow: '0 0 16px rgba(0,210,106,0.45)' }}>{item.price}</span>
                <span className="text-[12px] font-bold mt-1" style={{ color: 'rgba(0,210,106,0.4)' }}>moedas</span>
              </>
            ) : (
              <span className="text-[13px] font-black uppercase tracking-wider" style={{ color: '#ff004c' }}>
                Exclusivo do Passe Ace
              </span>
            )}
          </div>

          {/* Buy button */}
          <motion.button
            whileTap={canAfford ? { scale: 0.97 } : {}}
            onClick={canAfford ? onConfirm : undefined}
            className="w-full py-4 rounded-[16px] font-black text-[15px] uppercase tracking-widest relative overflow-hidden"
            style={
              isPasse
                ? { background: 'rgba(255,0,76,0.12)', border: '1px solid rgba(255,0,76,0.4)', color: '#ff004c' }
                : !canAfford
                  ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)', cursor: 'not-allowed' }
                  : { background: 'linear-gradient(135deg,#00e870,#00b050)', color: '#000', boxShadow: '0 0 24px rgba(0,210,106,0.4), inset 0 1px 0 rgba(255,255,255,0.28)' }
            }
          >
            {canAfford && !isPasse && (
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.16) 0%,transparent 55%)' }} />
            )}
            <span className="relative z-10">
              {isPasse ? 'Ver Passe Ace' : !canAfford ? 'Saldo insuficiente' : 'Comprar agora'}
            </span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Store ─────────────────────────────────────────────────── */
export default function Store() {
  const [activeTab, setActiveTab] = useState<TabId>('destaque');
  const [confirmItem, setConfirmItem] = useState<StoreItem | null>(null);

  const items = TAB_ITEMS[activeTab];
  const activeCat = CATEGORIES.find(c => c.id === activeTab)!;

  const handleConfirm = () => {
    if (!confirmItem) return;
    if (confirmItem.price === 'PASSE') {
      toast('Abra o Passe Ace para resgatar este item!');
    } else {
      toast.success(`${confirmItem.name} adquirido!`, { description: 'O item foi adicionado ao seu perfil.' });
    }
    setConfirmItem(null);
  };

  return (
    <div
      className="h-full w-full select-none relative overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: '155px 1fr',
        columnGap: '8px',
        padding: '12px 12px calc(12px + env(safe-area-inset-bottom)) 12px',
      }}
    >
      {/* ══ LEFT: Category sidebar ══ */}
      <div className="flex flex-col gap-2 z-10">
        {CATEGORIES.map(cat => (
          <CategorySideButton
            key={cat.id} cat={cat}
            isActive={activeTab === cat.id}
            onClick={() => setActiveTab(cat.id)}
          />
        ))}
      </div>

      {/* ══ RIGHT: Glass frame containing header + horizontal card scroll ══ */}
      <div
        className="relative flex flex-col min-w-0 z-10 rounded-[18px] overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, rgba(12,12,18,0.78) 0%, rgba(5,5,8,0.92) 100%)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4)',
        }}
      >
        {/* Top edge highlight on the frame */}
        <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent 5%, ${activeCat.color}45 30%, rgba(255,255,255,0.32) 50%, ${activeCat.color}30 70%, transparent 95%)` }} />
        {/* Soft accent glow following selected category */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 20% -10%, ${activeCat.color}14 0%, transparent 55%)` }} />

        {/* Category header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + '-header'}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 flex items-center justify-between px-4 pt-3 pb-2 relative z-10"
          >
            <div className="flex items-baseline gap-2.5 min-w-0">
              <h2 className="font-display leading-none shrink-0"
                style={{ fontSize: '24px', letterSpacing: '0.08em', color: activeCat.color,
                  textShadow: `0 0 26px ${activeCat.color}55, 0 2px 8px rgba(0,0,0,0.8)` }}>
                {activeCat.label}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] truncate"
                style={{ color: 'rgba(255,255,255,0.32)' }}>
                {activeCat.description}
              </span>
            </div>
            {/* Item count pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
              style={{ background: `${activeCat.color}14`, border: `1px solid ${activeCat.color}38` }}>
              <span className="font-display text-[11px] leading-none" style={{ color: activeCat.color }}>{activeCat.count}</span>
              <span className="text-[8px] font-black uppercase tracking-[0.18em] leading-none"
                style={{ color: activeCat.color + 'bb' }}>itens</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Divider */}
        <div className="shrink-0 mx-4 h-px"
          style={{ background: `linear-gradient(90deg, ${activeCat.color}38 0%, transparent 70%)` }} />

        {/* Horizontal card scroll */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + '-items'}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 overflow-x-auto no-scrollbar flex gap-3 items-stretch p-3 min-h-0"
          >
            {items.map((item, i) => (
              <div key={item.id} style={{ width: '180px', flexShrink: 0, height: '100%' }}>
                <StoreCard item={item} index={i} onBuy={setConfirmItem} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Purchase confirmation overlay */}
      <AnimatePresence>
        {confirmItem && (
          <ConfirmModal
            item={confirmItem}
            onConfirm={handleConfirm}
            onCancel={() => setConfirmItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
