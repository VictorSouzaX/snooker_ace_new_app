import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Tag, Box, LayoutGrid, Gift, X, Lock, Sparkles, Ticket,
  type LucideIcon,
} from 'lucide-react';

/* ───────────────────────── Rarity system ───────────────────────── */
type Rarity = 'comum' | 'raro' | 'super' | 'lendario' | 'elite' | 'passe';

const RARITY: Record<Rarity, { label: string; color: string; tint: boolean }> = {
  comum:    { label: 'Comum',      color: '#9ca3af', tint: false }, // sem cor de fundo
  raro:     { label: 'Raro',       color: '#3b82f6', tint: true  }, // azul
  super:    { label: 'Super Raro', color: '#a855f7', tint: true  }, // roxo
  lendario: { label: 'Lendário',   color: '#f5c518', tint: true  }, // dourado
  passe:    { label: 'Passe',      color: '#10b981', tint: true  }, // verde esmeralda
  elite:    { label: 'Elite',      color: '#e11d48', tint: true  }, // vermelho escuro
};

const RARITY_TIER: Record<Rarity, number> = {
  comum: 1, raro: 2, super: 3, passe: 4, elite: 4, lendario: 5,
};

/* ───────────────────────── Data types ──────────────────────────── */
type ItemKind = 'taco' | 'mesa' | 'adesivo' | 'emoji' | 'avatar' | 'moldura' | 'consumivel';

interface Item {
  id: string; name: string; kind: ItemKind; rarity: Rarity;
  coins?: number;           // preço em fichas
  priceBRL?: string;        // preço em reais
  glyph?: string;           // emoji / adesivo
  avatarSeed?: string;      // avatar / moldura
  tableColor?: string;      // mesa
  note?: string;            // observação (ex: "Apenas em caixas")
  soon?: boolean;           // em breve
  discount?: number;        // % de desconto (ofertas)
  oldCoins?: number;        // preço antigo (ofertas)
}

const KIND_LABEL: Record<ItemKind, string> = {
  taco: 'Tacos', mesa: 'Mesas', adesivo: 'Adesivos', emoji: 'Emojis',
  avatar: 'Avatares', moldura: 'Molduras', consumivel: 'Consumível',
};

/* ───────────────────────── Catalog data ────────────────────────── */
const CATALOG: Item[] = [
  // Tacos
  { id: 't1', name: 'Taco Iniciante', kind: 'taco', rarity: 'comum',    coins: 1200 },
  { id: 't2', name: 'Taco Fibra',     kind: 'taco', rarity: 'raro',     coins: 4800 },
  { id: 't3', name: 'Taco Carbono',   kind: 'taco', rarity: 'super',    coins: 12000 },
  { id: 't4', name: 'Taco de Ouro',   kind: 'taco', rarity: 'lendario', note: 'Apenas em caixas' },
  // Mesas
  { id: 'm1', name: 'Baize Clássico', kind: 'mesa', rarity: 'comum',    coins: 3000,  tableColor: '#1a5c2e' },
  { id: 'm2', name: 'Abismo Azul',    kind: 'mesa', rarity: 'super',    coins: 15000, tableColor: '#0f2d5e' },
  { id: 'm3', name: 'Mesa Real',      kind: 'mesa', rarity: 'lendario', note: 'Apenas em caixas', tableColor: '#3a2d0a' },
  { id: 'm4', name: 'Mesa Esmeralda', kind: 'mesa', rarity: 'passe',    note: 'Passe da Temporada', tableColor: '#064e3b' },
  // Adesivos de mesa
  { id: 'a1', name: 'Adesivo Chama',  kind: 'adesivo', rarity: 'raro',     coins: 800,  glyph: '🔥' },
  { id: 'a2', name: 'Adesivo Caveira',kind: 'adesivo', rarity: 'super',    coins: 2200, glyph: '💀' },
  { id: 'a3', name: 'Adesivo Coroa',  kind: 'adesivo', rarity: 'lendario', note: 'Apenas em caixas', glyph: '👑' },
  // Emojis
  { id: 'e1', name: 'Emoji Risada',   kind: 'emoji', rarity: 'comum', coins: 300,  glyph: '😂' },
  { id: 'e2', name: 'Emoji Estiloso', kind: 'emoji', rarity: 'raro',  coins: 600,  glyph: '😎' },
  { id: 'e3', name: 'Emoji Fogo',     kind: 'emoji', rarity: 'super', coins: 1500, glyph: '🔥' },
  // Avatares
  { id: 'av1', name: 'Avatar Ninja',  kind: 'avatar', rarity: 'raro',     coins: 5000, avatarSeed: 'ninja' },
  { id: 'av2', name: 'Avatar Mestre', kind: 'avatar', rarity: 'super',    coins: 8000, avatarSeed: 'master' },
  { id: 'av3', name: 'Avatar Rei',    kind: 'avatar', rarity: 'lendario', note: 'Apenas em caixas', avatarSeed: 'king' },
  // Molduras de avatar
  { id: 'mo1', name: 'Moldura Prata',     kind: 'moldura', rarity: 'raro',     coins: 2000, avatarSeed: 'frame1' },
  { id: 'mo2', name: 'Moldura Neon',      kind: 'moldura', rarity: 'super',    coins: 6000, avatarSeed: 'frame2' },
  { id: 'mo3', name: 'Moldura Áurea',     kind: 'moldura', rarity: 'lendario', note: 'Apenas em caixas', avatarSeed: 'frame3' },
  { id: 'mo4', name: 'Moldura Carnaval',  kind: 'moldura', rarity: 'elite',    coins: 9900, note: 'Edição limitada', avatarSeed: 'frame4' },
  { id: 'mo5', name: 'Moldura Temporada', kind: 'moldura', rarity: 'passe',    note: 'Passe da Temporada', avatarSeed: 'frame5' },
];

const CONSUMIVEIS: Item[] = [
  { id: 'c1', name: 'Troca de Nome', kind: 'consumivel', rarity: 'raro',  coins: 5000, glyph: '✏️', note: 'Altere seu nome de jogador' },
  { id: 'c2', name: 'Criar Clube',   kind: 'consumivel', rarity: 'super', glyph: '🛡️', note: 'Disponível em breve', soon: true },
  { id: 'c3', name: 'Ticket Torneio',kind: 'consumivel', rarity: 'raro',  coins: 2500, glyph: '🎟️', note: 'Entrada para torneios especiais' },
  { id: 'c4', name: 'Chave de Caixa',kind: 'consumivel', rarity: 'comum', coins: 1500, glyph: '🔑', note: 'Abre qualquer caixa' },
];

const OFFERS: Item[] = [
  { id: 'of2', name: 'Taco Carbono',     kind: 'taco',    rarity: 'super', coins: 8400,  oldCoins: 12000, discount: 30 },
  { id: 'of3', name: 'Moldura Carnaval', kind: 'moldura', rarity: 'elite', coins: 6900,  oldCoins: 9900,  discount: 30, avatarSeed: 'frame4', note: 'Edição limitada' },
  { id: 'of4', name: 'Avatar Mestre',    kind: 'avatar',  rarity: 'super', coins: 5600,  oldCoins: 8000,  discount: 30, avatarSeed: 'master' },
  { id: 'of5', name: 'Moldura Neon',     kind: 'moldura', rarity: 'super', coins: 4200,  oldCoins: 6000,  discount: 30, avatarSeed: 'frame2' },
];

interface BoxOdd { r: Rarity; p: number; }
interface BoxDef {
  id: string; name: string; coins: number; items: number; color: string;
  odds: BoxOdd[]; bonus?: string;
}

const BOXES: BoxDef[] = [
  { id: 'bronze',   name: 'Bronze Box',   coins: 1000,  items: 3, color: '#cd7f32',
    odds: [{ r: 'comum', p: 70 }, { r: 'raro', p: 25 }, { r: 'super', p: 5 }] },
  { id: 'silver',   name: 'Silver Box',   coins: 2500,  items: 4, color: '#c4c9d4',
    odds: [{ r: 'comum', p: 50 }, { r: 'raro', p: 35 }, { r: 'super', p: 15 }] },
  { id: 'gold',     name: 'Gold Box',     coins: 6000,  items: 5, color: '#f5c518',
    odds: [{ r: 'comum', p: 30 }, { r: 'raro', p: 40 }, { r: 'super', p: 29 }, { r: 'lendario', p: 1 }] },
  { id: 'platinum', name: 'Platinum Box', coins: 15000, items: 7, color: '#67e8f9',
    odds: [{ r: 'comum', p: 20 }, { r: 'raro', p: 30 }, { r: 'super', p: 35 }, { r: 'lendario', p: 15 }],
    bonus: 'Ticket do Torneio Principal Semanal' },
];

// Catalog organisation
const CATALOG_TYPES: ItemKind[] = ['taco', 'mesa', 'moldura', 'avatar', 'adesivo', 'emoji'];
const CATALOG_RARITY_ORDER: Rarity[] = ['lendario', 'elite', 'passe', 'super', 'raro', 'comum'];

const DAILY_GIFTS = [
  { glyph: '💵', label: 'R$ 1 em aposta' },
  { glyph: '🎟️', label: 'Ticket classificatório' },
  { glyph: '🔑', label: 'Chave de caixa' },
  { glyph: '🎉', label: 'Item comemorativo' },
  { glyph: '😎', label: 'Emoji / Adesivo' },
];

/* ───────────────────────── Main menus ──────────────────────────── */
type Menu = 'ofertas' | 'caixas' | 'catalogo' | 'presente';
const MENUS: { id: Menu; label: string; Icon: LucideIcon; color: string }[] = [
  { id: 'ofertas',  label: 'Ofertas',         Icon: Tag,        color: '#fbbf24' },
  { id: 'caixas',   label: 'Caixas',          Icon: Box,        color: '#a855f7' },
  { id: 'catalogo', label: 'Catálogo',        Icon: LayoutGrid, color: '#00e870' },
  { id: 'presente', label: 'Presente Diário', Icon: Gift,       color: '#ED0A65' },
];

type CatalogSub = 'nivel' | 'tipo' | 'consumivel';

const USER_BALANCE = 12450;
const fmtCoins = (n: number) => n.toLocaleString('pt-BR');

/* ───────────────────────── Shared bits ─────────────────────────── */
const EdgeLayers = ({ accent }: { accent?: string }) => (
  <>
    <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{
      background: accent
        ? `linear-gradient(90deg, transparent 6%, ${accent}55 28%, rgba(255,255,255,0.4) 50%, ${accent}38 72%, transparent 94%)`
        : 'linear-gradient(90deg, transparent 8%, rgba(255,255,255,0.22) 50%, transparent 92%)',
    }} />
    <div className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
      style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 45%, transparent 80%)' }} />
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: 'linear-gradient(128deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 35%, transparent 55%)' }} />
  </>
);

/* glass card style helper following the passe/lobby aesthetic */
function rarityCardStyle(rarity: Rarity) {
  const { color, tint } = RARITY[rarity];
  const tier = RARITY_TIER[rarity];
  const bg = tint
    ? `radial-gradient(ellipse at 35% -10%, ${color}26 0%, ${color}0c 42%, rgba(13,13,16,0.97) 70%)`
    : 'linear-gradient(160deg, rgba(24,24,27,0.96) 0%, rgba(12,12,15,0.98) 100%)';
  const border = tint ? `1px solid ${color}${tier >= 5 ? '70' : tier >= 3 ? '50' : '38'}` : '1px solid rgba(255,255,255,0.12)';
  const glow = tier >= 5
    ? `0 0 26px ${color}30, inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.5)`
    : tier >= 3
      ? `0 0 16px ${color}18, inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.45)`
      : 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.45)';
  return { background: bg, border, boxShadow: glow };
}

/* ───────────────────────── Visuals ─────────────────────────────── */
function TablePreview({ color }: { color: string }) {
  const pockets = [['0%','0%'],['50%','0%'],['100%','0%'],['0%','100%'],['50%','100%'],['100%','100%']];
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative" style={{ width: '78%', height: '70%' }}>
        <div className="absolute inset-0 rounded-[7px]"
          style={{ background: 'linear-gradient(135deg,#5c3210,#7a4520,#5c3210)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)' }} />
        <div className="absolute inset-[8px] rounded-[3px]" style={{ background: color, boxShadow: 'inset 0 0 18px rgba(0,0,0,0.4)' }}>
          <div className="absolute top-[8%] bottom-[8%] left-1/2 w-px bg-white/10" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15" />
        </div>
        {pockets.map((p, i) => (
          <div key={i} className="absolute w-3.5 h-3.5 rounded-full bg-[#050505]"
            style={{ left: p[0], top: p[1], transform: 'translate(-50%,-50%)' }} />
        ))}
      </div>
    </div>
  );
}

function AvatarImg({ seed, color, size }: { seed: string; color: string; size: number }) {
  return (
    <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundColor=${color.slice(1)}`}
      alt="" width={size} height={size}
      style={{ width: size, height: size, borderRadius: '50%', border: `2px solid ${color}70`, boxShadow: `0 0 18px ${color}35` }} />
  );
}

function ItemVisual({ item, size = 'card' }: { item: Item; size?: 'card' | 'big' }) {
  const color = RARITY[item.rarity].color;
  const big = size === 'big';
  if (item.kind === 'mesa' && item.tableColor) return <TablePreview color={item.tableColor} />;
  if (item.kind === 'avatar' && item.avatarSeed)
    return <div className="w-full h-full flex items-center justify-center"><AvatarImg seed={item.avatarSeed} color={color} size={big ? 120 : 70} /></div>;
  if (item.kind === 'moldura')
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative flex items-center justify-center rounded-full"
          style={{ width: big ? 128 : 78, height: big ? 128 : 78, padding: big ? 7 : 5,
            background: `conic-gradient(from 0deg, ${color}, ${color}55, ${color}, ${color}55, ${color})`,
            boxShadow: `0 0 22px ${color}45` }}>
          <div className="rounded-full" style={{ width: '100%', height: '100%',
            background: 'radial-gradient(circle at 40% 35%, #2a2a30, #0c0c10)', border: '2px solid rgba(0,0,0,0.5)' }} />
        </div>
      </div>
    );
  if (item.kind === 'taco')
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute rounded-full rotate-[38deg]"
          style={{ width: big ? 6 : 4, height: big ? '74%' : '70%', background: `linear-gradient(to bottom, ${color}, #4a3520 65%, #2a1d12)` }} />
        <div className="absolute rounded-full rotate-[38deg]"
          style={{ width: big ? 8 : 6, height: big ? 8 : 6, background: color, boxShadow: `0 0 8px ${color}`, top: big ? '14%' : '16%', left: '56%' }} />
      </div>
    );
  // emoji / adesivo / consumivel → glyph on a soft tinted disc
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="rounded-full flex items-center justify-center"
        style={{ width: big ? 110 : 64, height: big ? 110 : 64,
          background: `radial-gradient(circle at 40% 35%, ${color}22, rgba(8,8,12,0.6))`,
          border: `1.5px solid ${color}40` }}>
        <span style={{ fontSize: big ? 56 : 32, lineHeight: 1, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }}>{item.glyph ?? '🎱'}</span>
      </div>
    </div>
  );
}

function ChestVisual({ color, big = false }: { color: string; big?: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center"
      style={{ background: `radial-gradient(ellipse at 50% 40%, ${color}22 0%, rgba(8,8,12,0.85) 70%)` }}>
      <svg viewBox="0 0 44 36" style={{ width: big ? '52%' : '60%', height: big ? '52%' : '60%', filter: `drop-shadow(0 0 ${big ? 16 : 9}px ${color}66)` }} fill="none">
        <rect x="2" y="17" width="40" height="17" rx="2.5" fill={color + '20'} stroke={color} strokeWidth="1.8" />
        <path d="M2 19 Q2 8 22 8 Q42 8 42 19 L42 21 L2 21 Z" fill={color + '33'} stroke={color} strokeWidth="1.8" />
        <rect x="2" y="20" width="40" height="4" fill={color + '55'} />
        <rect x="18.5" y="23" width="7" height="5" rx="1.5" fill={color + '66'} stroke={color} strokeWidth="1" />
        <path d="M20 23 Q20 19.5 22 19.5 Q24 19.5 24 23" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="9" cy="13" r="1.5" fill={color + 'aa'} /><circle cx="22" cy="9" r="2" fill={color} /><circle cx="35" cy="13" r="1.5" fill={color + 'aa'} />
      </svg>
    </div>
  );
}

/* ───────────────────────── Rarity pill / odds ──────────────────── */
function RarityPill({ rarity, small }: { rarity: Rarity; small?: boolean }) {
  const { label, color } = RARITY[rarity];
  return (
    <span className={`inline-block font-black uppercase rounded-full ${small ? 'text-[7px] px-1.5 py-0.5 tracking-[0.12em]' : 'text-[8px] px-2 py-0.5 tracking-[0.16em]'}`}
      style={{ color, background: `${color}1a`, border: `1px solid ${color}45` }}>
      {label}
    </span>
  );
}

function CoinPrice({ coins, old, size = 'sm' }: { coins?: number; old?: number; size?: 'sm' | 'lg' }) {
  if (coins == null) return null;
  const big = size === 'lg';
  return (
    <div className="flex items-center gap-1.5">
      <div className="rounded-full flex items-center justify-center shrink-0"
        style={{ width: big ? 22 : 15, height: big ? 22 : 15, background: 'linear-gradient(145deg,#00e870,#00a84a)', boxShadow: '0 0 7px rgba(0,210,106,0.55)' }}>
        <span style={{ fontSize: big ? 10 : 6, fontWeight: 900, color: '#000', lineHeight: 1 }}>$</span>
      </div>
      <span className="font-black leading-none" style={{ fontSize: big ? 22 : 14, color: '#00e870', textShadow: '0 0 10px rgba(0,210,106,0.4)' }}>{fmtCoins(coins)}</span>
      {old != null && <span className="text-[10px] font-bold line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>{fmtCoins(old)}</span>}
    </div>
  );
}

/* ───────────────────────── Item card ───────────────────────────── */
function ItemCard({ item, index, onOpen }: { item: Item; index: number; onOpen: (i: Item) => void }) {
  const { color } = RARITY[item.rarity];
  const onlyBox = item.note?.toLowerCase().includes('caixa');
  return (
    <motion.div
      initial={{ opacity: 0, x: 16, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onOpen(item)}
      className="relative rounded-[18px] overflow-hidden flex flex-col cursor-pointer h-full"
      style={rarityCardStyle(item.rarity)}
    >
      <div className="absolute top-0 inset-x-0 h-[2px] z-20 pointer-events-none" style={{ background: color, boxShadow: RARITY_TIER[item.rarity] >= 4 ? `0 0 8px ${color}` : 'none' }} />
      <EdgeLayers accent={RARITY_TIER[item.rarity] >= 3 ? color : undefined} />

      {/* visual */}
      <div className="relative shrink-0 overflow-hidden" style={{ height: 118 }}>
        <ItemVisual item={item} />
      </div>

      {/* info */}
      <div className="flex flex-col flex-1 px-3 pt-2 pb-2.5 gap-1 min-h-0">
        <div className="flex items-center justify-between gap-1">
          <RarityPill rarity={item.rarity} small />
          <span className="text-[7px] font-bold uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.3)' }}>{KIND_LABEL[item.kind]}</span>
        </div>
        <h3 className="font-display leading-none tracking-wide" style={{ fontSize: 16, color: 'rgba(255,255,255,0.94)' }}>{item.name}</h3>
        {item.note && <p className="text-[8.5px] leading-tight" style={{ color: `${color}cc` }}>{item.note}</p>}

        <div className="mt-auto pt-1.5">
          {onlyBox ? (
            <div className="flex items-center justify-center gap-1.5 rounded-[10px] py-2"
              style={{ background: `${color}14`, border: `1px solid ${color}40` }}>
              <Lock size={11} style={{ color }} />
              <span className="text-[9px] font-black uppercase tracking-wider" style={{ color }}>Só em caixas</span>
            </div>
          ) : item.coins != null ? (
            <div className="flex items-center justify-center rounded-[10px] py-2"
              style={{ background: 'linear-gradient(135deg, rgba(0,232,112,0.18), rgba(0,232,112,0.06))', border: '1px solid rgba(0,232,112,0.3)' }}>
              <CoinPrice coins={item.coins} old={item.oldCoins} />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 rounded-[10px] py-2"
              style={{ background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.4)' }}>
              <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: '#10b981' }}>Passe da Temporada</span>
            </div>
          )}
        </div>
      </div>

      {item.discount && (
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[8px] font-black z-20"
          style={{ background: '#ef4444', color: '#fff', boxShadow: '0 2px 8px rgba(239,68,68,0.5)' }}>-{item.discount}%</div>
      )}
    </motion.div>
  );
}

/* ───────────────────────── Shelf (compact) card ────────────────── */
function ShelfCard({ item, onOpen }: { item: Item; onOpen: (i: Item) => void }) {
  const { color } = RARITY[item.rarity];
  const onlyBox = item.note?.toLowerCase().includes('caixa');
  return (
    <motion.div whileTap={{ scale: 0.95 }} onClick={() => onOpen(item)}
      className="relative rounded-[14px] overflow-hidden flex flex-col cursor-pointer shrink-0"
      style={{ width: 132, height: '100%', ...rarityCardStyle(item.rarity) }}>
      <div className="absolute top-0 inset-x-0 h-[2px] z-20" style={{ background: color, boxShadow: RARITY_TIER[item.rarity] >= 4 ? `0 0 7px ${color}` : 'none' }} />
      <EdgeLayers accent={RARITY_TIER[item.rarity] >= 3 ? color : undefined} />
      <div className="relative shrink-0 overflow-hidden" style={{ height: 56 }}>
        <ItemVisual item={item} />
      </div>
      <div className="flex flex-col flex-1 px-2.5 py-1.5 min-h-0 justify-between gap-1">
        <div className="flex flex-col gap-1">
          <RarityPill rarity={item.rarity} small />
          <h3 className="font-display leading-none tracking-wide truncate" style={{ fontSize: 13, color: 'rgba(255,255,255,0.94)' }}>{item.name}</h3>
        </div>
        <div>
          {onlyBox ? (
            <div className="flex items-center justify-center gap-1 rounded-[8px] py-1.5" style={{ background: `${color}14`, border: `1px solid ${color}38` }}>
              <Lock size={9} style={{ color }} />
              <span className="text-[7.5px] font-black uppercase tracking-wide" style={{ color }}>Caixas</span>
            </div>
          ) : item.coins != null ? (
            <div className="flex items-center justify-center rounded-[8px] py-1.5" style={{ background: 'rgba(0,232,112,0.12)', border: '1px solid rgba(0,232,112,0.28)' }}>
              <CoinPrice coins={item.coins} />
            </div>
          ) : item.soon ? (
            <div className="flex items-center justify-center rounded-[8px] py-1.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-[7.5px] font-black uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>Em breve</span>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-[8px] py-1.5" style={{ background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.38)' }}>
              <span className="text-[7.5px] font-black uppercase tracking-wide" style={{ color: '#10b981' }}>Passe</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* horizontal shelf with a labelled header */
function Shelf({ title, items, color, onOpen }: { title: string; items: Item[]; color: string; onOpen: (i: Item) => void }) {
  if (items.length === 0) return null;
  return (
    <div className="shrink-0">
      <div className="flex items-center gap-2 px-1 mb-1.5">
        <span className="font-display tracking-[0.06em]" style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)' }}>{title}</span>
        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none"
          style={{ color, background: `${color}1a`, border: `1px solid ${color}38` }}>{items.length}</span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}40 0%, transparent 80%)` }} />
      </div>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1" style={{ height: 152 }}>
        {items.map(it => <ShelfCard key={it.id} item={it} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

/* ───────────────────────── Box card ────────────────────────────── */
function BoxCard({ box, index, onOpen }: { box: BoxDef; index: number; onOpen: (b: BoxDef) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onOpen(box)}
      className="relative rounded-[18px] overflow-hidden flex flex-col cursor-pointer h-full"
      style={{
        background: `radial-gradient(ellipse at 40% -10%, ${box.color}22 0%, ${box.color}08 42%, rgba(13,13,16,0.97) 70%)`,
        border: `1px solid ${box.color}50`,
        boxShadow: `0 0 18px ${box.color}1c, inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.45)`,
      }}
    >
      <div className="absolute top-0 inset-x-0 h-[2px] z-20" style={{ background: box.color, boxShadow: `0 0 8px ${box.color}` }} />
      <EdgeLayers accent={box.color} />

      <div className="relative shrink-0" style={{ height: 116 }}>
        <ChestVisual color={box.color} />
        {box.bonus && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(245,197,24,0.18)', border: '1px solid rgba(245,197,24,0.5)' }}>
            <Ticket size={9} style={{ color: '#f5c518' }} />
            <span className="text-[7px] font-black uppercase tracking-wide" style={{ color: '#f5c518' }}>Brinde</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 px-3 pt-2 pb-2.5 gap-1.5 min-h-0">
        <div className="flex items-center justify-between">
          <h3 className="font-display leading-none tracking-wide" style={{ fontSize: 17, color: '#fff' }}>{box.name}</h3>
          <span className="text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{box.items} itens</span>
        </div>

        {/* odds bar */}
        <div className="flex h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {box.odds.map(o => (
            <div key={o.r} style={{ width: `${o.p}%`, background: RARITY[o.r].color }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          {box.odds.map(o => (
            <div key={o.r} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: RARITY[o.r].color }} />
              <span className="text-[7.5px] font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>{o.p}%</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-1 flex items-center justify-center rounded-[10px] py-2"
          style={{ background: `linear-gradient(135deg, ${box.color}28, ${box.color}10)`, border: `1px solid ${box.color}45` }}>
          <CoinPrice coins={box.coins} />
        </div>
      </div>
    </motion.div>
  );
}

/* ───────────────────────── Detail modal ────────────────────────── */
function DetailModal({ item, box, onClose }: { item?: Item; box?: BoxDef; onClose: () => void }) {
  const color = item ? RARITY[item.rarity].color : box!.color;
  const onlyBox = item?.note?.toLowerCase().includes('caixa');
  const canBuy = item ? (!onlyBox && !item.soon) : true;

  const buy = () => {
    if (box) { toast.success(`${box.name} adquirida!`, { description: `${box.items} itens foram adicionados ao seu inventário.` }); }
    else if (item) {
      if (item.soon) { toast('Em breve', { description: `${item.name} estará disponível em breve.` }); return; }
      if (onlyBox) { toast('Item exclusivo de caixas', { description: `${item.name} só pode ser obtido abrindo caixas.` }); return; }
      toast.success(`${item.name} adquirido!`, { description: 'O item foi adicionado ao seu perfil.' });
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
      className="absolute inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 42 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full rounded-t-[26px] overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(160deg, rgba(22,22,25,0.99) 0%, rgba(10,10,13,0.99) 100%)',
          border: `1px solid ${color}30`, borderBottom: 'none',
          boxShadow: `0 -24px 60px rgba(0,0,0,0.85), 0 0 50px ${color}14`, maxHeight: '88vh',
        }}
      >
        <div className="absolute top-0 inset-x-0 h-[3px] z-10" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
        <div className="flex items-center justify-center pt-4 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
          className="absolute top-3.5 right-5 w-8 h-8 rounded-full flex items-center justify-center z-20"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <X size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
        </motion.button>

        <div className="flex gap-4 px-5 pb-6 pt-2 overflow-y-auto no-scrollbar">
          {/* visual */}
          <div className="relative rounded-[16px] overflow-hidden shrink-0" style={{ width: 200, height: 180, background: `radial-gradient(ellipse at 50% 40%, ${color}1c, rgba(8,8,12,0.9) 72%)` }}>
            {box ? <ChestVisual color={color} big /> : <ItemVisual item={item!} size="big" />}
            <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: color }} />
          </div>

          {/* details */}
          <div className="flex flex-col flex-1 min-w-0 gap-2 pt-1">
            {item && <RarityPill rarity={item.rarity} />}
            {box && (
              <span className="self-start text-[9px] font-black uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                style={{ color: box.color, background: `${box.color}1a`, border: `1px solid ${box.color}45` }}>Caixa · {box.items} itens</span>
            )}
            <h2 className="font-display leading-none" style={{ fontSize: 30, letterSpacing: '0.03em', color: '#fff' }}>{item?.name ?? box?.name}</h2>
            {item?.note && <p className="text-[11px]" style={{ color: `${color}cc` }}>{item.note}</p>}

            {/* box odds */}
            {box && (
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-[9px] font-black uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.4)' }}>Probabilidades</span>
                {box.odds.map(o => (
                  <div key={o.r} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: RARITY[o.r].color }} />
                    <span className="text-[10px] font-bold w-20" style={{ color: RARITY[o.r].color }}>{RARITY[o.r].label}</span>
                    <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${o.p}%`, background: RARITY[o.r].color }} />
                    </div>
                    <span className="text-[10px] font-black w-8 text-right" style={{ color: 'rgba(255,255,255,0.7)' }}>{o.p}%</span>
                  </div>
                ))}
                {box.bonus && (
                  <div className="flex items-center gap-1.5 mt-1 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.3)' }}>
                    <Ticket size={13} style={{ color: '#f5c518' }} />
                    <span className="text-[10px] font-bold" style={{ color: '#f5c518' }}>{box.bonus}</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-auto pt-2 flex items-center gap-3">
              {box ? (
                <CoinPrice coins={box.coins} size="lg" />
              ) : item?.coins != null ? (
                <CoinPrice coins={item.coins} old={item.oldCoins} size="lg" />
              ) : null}

              <motion.button whileTap={canBuy ? { scale: 0.97 } : {}} onClick={buy}
                className="ml-auto relative overflow-hidden rounded-[14px] px-6 py-3 font-display tracking-[0.12em]"
                style={canBuy
                  ? { background: 'linear-gradient(160deg,#00e870,#00c058 55%,#008a3a)', color: '#000', fontSize: 18, border: '1px solid rgba(255,255,255,0.28)', boxShadow: '0 0 22px rgba(0,232,112,0.45), inset 0 2px 0 rgba(255,255,255,0.65)' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ borderRadius: '14px 14px 0 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.5), transparent)' }} />
                <span className="relative z-10">{box ? 'COMPRAR' : item?.soon ? 'EM BREVE' : onlyBox ? 'SÓ EM CAIXAS' : 'COMPRAR'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────── Sidebar menu button ─────────────────── */
function MenuButton({ menu, active, onClick }: { menu: typeof MENUS[number]; active: boolean; onClick: () => void }) {
  const { Icon, color } = menu;
  return (
    <motion.button
      onClick={onClick} whileHover={{ x: 3, scale: 1.01 }} whileTap={{ scale: 0.97 }}
      className="relative flex flex-col justify-between px-3.5 py-3 rounded-[15px] overflow-hidden text-left cursor-pointer w-full flex-1 min-h-0"
      style={{
        background: active
          ? `linear-gradient(155deg, rgba(20,20,23,0.97) 0%, rgba(9,9,12,0.99) 60%, ${color}0d 100%)`
          : 'linear-gradient(155deg, rgba(16,16,20,0.95) 0%, rgba(7,7,10,0.98) 100%)',
        border: `1px solid ${active ? color + '55' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: active
          ? `0 0 0 1px ${color}22, inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.5)`
          : 'inset 0 1px 0 rgba(255,255,255,0.13), inset 0 -1px 0 rgba(0,0,0,0.4)',
      }}
    >
      {active && (
        <motion.div layoutId="store-menu-bar" className="absolute left-0 top-[18%] bottom-[18%] w-[4px] rounded-r-full"
          style={{ background: color, boxShadow: `0 0 12px ${color}, 0 0 24px ${color}60` }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
      )}
      <EdgeLayers accent={active ? color : undefined} />
      <Icon size={17} strokeWidth={2} color={active ? color : 'rgba(255,255,255,0.32)'} className="relative z-10 shrink-0" />
      <div className="relative z-10 font-display leading-tight tracking-[0.05em]"
        style={{ fontSize: 14, color: active ? color : 'rgba(255,255,255,0.4)', textShadow: active ? `0 0 18px ${color}55` : 'none' }}>
        {menu.label}
      </div>
    </motion.button>
  );
}

/* ───────────────────────── Horizontal scroll ───────────────────── */
function CardRow({ children, k }: { children: ReactNode; k: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={k}
        initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
        className="flex-1 overflow-x-auto no-scrollbar flex gap-3 items-stretch p-3 min-h-0">
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ───────────────────────── Main Store ──────────────────────────── */
export default function Store() {
  const [menu, setMenu] = useState<Menu>('ofertas');
  const [catalogView, setCatalogView] = useState<CatalogSub>('tipo');
  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [detailBox, setDetailBox] = useState<BoxDef | null>(null);

  const activeMenu = MENUS.find(m => m.id === menu)!;

  return (
    <div
      className="h-full w-full select-none relative overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: '150px 1fr',
        gridTemplateRows: 'minmax(0, 1fr)',
        columnGap: 8,
        padding: 'calc(10px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right)) calc(10px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left))',
      }}
    >
      {/* ── LEFT: main menus ── */}
      <div className="flex flex-col gap-2 z-10 min-h-0">
        {MENUS.map(m => (
          <MenuButton key={m.id} menu={m} active={menu === m.id} onClick={() => setMenu(m.id)} />
        ))}
      </div>

      {/* ── RIGHT: content frame ── */}
      <div className="relative flex flex-col min-w-0 z-10 rounded-[18px] overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(16,16,20,0.82) 0%, rgba(7,7,10,0.92) 100%)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4)',
        }}>
        <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent 5%, ${activeMenu.color}50 30%, rgba(255,255,255,0.32) 50%, ${activeMenu.color}30 70%, transparent 95%)` }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 25% -10%, ${activeMenu.color}12 0%, transparent 55%)` }} />

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between gap-2 px-4 pt-3 pb-2 relative z-10">
          <h2 className="font-display leading-none shrink-0"
            style={{ fontSize: 24, letterSpacing: '0.06em', color: activeMenu.color, textShadow: `0 0 24px ${activeMenu.color}55, 0 2px 8px rgba(0,0,0,0.8)` }}>
            {activeMenu.label}
          </h2>

          {/* Catalog grouping segmented control */}
          {menu === 'catalogo' && (
            <div className="flex items-center gap-1 p-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {([['tipo', 'Por Tipo'], ['nivel', 'Por Nível'], ['consumivel', 'Consumíveis']] as [CatalogSub, string][]).map(([id, label]) => (
                <button key={id} onClick={() => setCatalogView(id)}
                  className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                  style={{
                    color: catalogView === id ? '#000' : 'rgba(255,255,255,0.5)',
                    background: catalogView === id ? activeMenu.color : 'transparent',
                  }}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 mx-4 h-px" style={{ background: `linear-gradient(90deg, ${activeMenu.color}38 0%, transparent 70%)` }} />

        {/* ── Content per menu ── */}
        {menu === 'ofertas' && (
          <CardRow k="ofertas">
            {/* Passe da Temporada — destaque */}
            <motion.div
              initial={{ opacity: 0, x: 16, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toast('Passe da Temporada', { description: 'Compra antecipada com preço promocional — acesso a itens exclusivos por nível.' })}
              className="relative rounded-[18px] overflow-hidden flex flex-col cursor-pointer h-full shrink-0"
              style={{ width: 230, ...rarityCardStyle('passe') }}>
              <div className="absolute top-0 inset-x-0 h-[2px] z-20" style={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <EdgeLayers accent="#10b981" />
              <div className="relative shrink-0 flex items-center justify-center" style={{ height: 122, background: 'radial-gradient(ellipse at 50% 35%, rgba(16,185,129,0.25), rgba(8,8,12,0.85) 72%)' }}>
                <Sparkles size={46} style={{ color: '#10b981', filter: 'drop-shadow(0 0 14px rgba(16,185,129,0.7))' }} />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[8px] font-black" style={{ background: '#ef4444', color: '#fff' }}>-40%</div>
              </div>
              <div className="flex flex-col flex-1 px-3.5 pt-2.5 pb-3 gap-1">
                <span className="text-[8px] font-black uppercase tracking-[0.16em]" style={{ color: '#10b981' }}>Compra antecipada</span>
                <h3 className="font-display leading-none" style={{ fontSize: 22, color: '#fff' }}>PASSE DA TEMPORADA</h3>
                <p className="text-[9px] leading-snug" style={{ color: 'rgba(255,255,255,0.4)' }}>Acesso a itens exclusivos ao progredir nos níveis do passe.</p>
                <div className="mt-auto pt-1.5 flex items-center justify-center rounded-[11px] py-2.5"
                  style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0.08))', border: '1px solid rgba(16,185,129,0.45)' }}>
                  <CoinPrice coins={3000} old={5000} />
                </div>
              </div>
            </motion.div>

            {OFFERS.map((it, i) => <div key={it.id} style={{ width: 178, flexShrink: 0, height: '100%' }}><ItemCard item={it} index={i + 1} onOpen={setDetailItem} /></div>)}
          </CardRow>
        )}

        {menu === 'caixas' && (
          <CardRow k="caixas">
            {BOXES.map((b, i) => <div key={b.id} style={{ width: 200, flexShrink: 0, height: '100%' }}><BoxCard box={b} index={i} onOpen={setDetailBox} /></div>)}
          </CardRow>
        )}

        {menu === 'catalogo' && (
          <AnimatePresence mode="wait">
            <motion.div key={'cat-' + catalogView}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 px-3 py-3 min-h-0">
              {catalogView === 'tipo' && CATALOG_TYPES.map(t => (
                <Shelf key={t} title={KIND_LABEL[t]} color={activeMenu.color}
                  items={CATALOG.filter(i => i.kind === t)} onOpen={setDetailItem} />
              ))}
              {catalogView === 'nivel' && CATALOG_RARITY_ORDER.map(r => (
                <Shelf key={r} title={RARITY[r].label} color={RARITY[r].color}
                  items={CATALOG.filter(i => i.rarity === r)} onOpen={setDetailItem} />
              ))}
              {catalogView === 'consumivel' && (
                <Shelf title="Itens Consumíveis" color={activeMenu.color} items={CONSUMIVEIS} onOpen={setDetailItem} />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {menu === 'presente' && (
          <div className="flex-1 flex items-stretch gap-3 p-3 min-h-0">
            {/* Daily gift chest (locked) */}
            <div className="relative rounded-[18px] overflow-hidden flex flex-col items-center justify-center shrink-0 px-5"
              style={{ width: 230, ...rarityCardStyle('elite') }}>
              <EdgeLayers accent="#ED0A65" />
              <div className="relative">
                <ChestVisual color="#ED0A65" big />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <Lock size={18} style={{ color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                </div>
              </div>
              <span className="font-display text-[18px] leading-none mt-1" style={{ color: '#ED0A65' }}>PRESENTE DIÁRIO</span>
              <p className="text-[10px] text-center leading-snug mt-2" style={{ color: 'rgba(255,255,255,0.42)' }}>
                Disponível para quem fez um depósito nos últimos 7 dias.
              </p>
              <motion.button whileTap={{ scale: 0.96 }}
                onClick={() => toast('Faça um depósito', { description: 'Deposite para liberar seu presente diário.' })}
                className="mt-3 w-full rounded-[12px] py-2.5 font-display tracking-[0.1em] relative overflow-hidden"
                style={{ fontSize: 15, color: '#fff', background: 'linear-gradient(160deg,#ED0A65,#a30848)', border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 0 20px rgba(237,10,101,0.4), inset 0 2px 0 rgba(255,255,255,0.4)' }}>
                <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ borderRadius: '12px 12px 0 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)' }} />
                <span className="relative z-10">DEPOSITAR</span>
              </motion.button>
            </div>

            {/* Possible gifts */}
            <div className="relative rounded-[18px] overflow-hidden flex-1 min-w-0 flex flex-col p-4"
              style={{ background: 'linear-gradient(160deg, rgba(22,22,25,0.6) 0%, rgba(10,10,13,0.7) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <EdgeLayers />
              <span className="font-display text-[15px] tracking-[0.06em]" style={{ color: 'rgba(255,255,255,0.85)' }}>POSSÍVEIS PRESENTES</span>
              <div className="flex-1 grid grid-cols-1 gap-2 mt-3 content-start overflow-y-auto no-scrollbar">
                {DAILY_GIFTS.map((g, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-[12px] px-3 py-2"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span style={{ fontSize: 22 }}>{g.glyph}</span>
                    <span className="text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{g.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />}
        {detailBox && <DetailModal box={detailBox} onClose={() => setDetailBox(null)} />}
      </AnimatePresence>
    </div>
  );
}
