import { useRef, useState, useEffect, type ReactNode, type RefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Tag, Box, LayoutGrid, Gift, X, Lock, Ticket, Sparkles, ChevronRight, Check, type LucideIcon } from 'lucide-react';

/* ═══════════════════ Rarity ═══════════════════ */
type Rarity = 'comum' | 'raro' | 'super' | 'lendario' | 'elite' | 'passe';
const RARITY: Record<Rarity, { label: string; color: string; tint: boolean }> = {
  comum:    { label: 'Comum',      color: '#9ca3af', tint: false },
  raro:     { label: 'Raro',       color: '#3b82f6', tint: true },
  super:    { label: 'Super Raro', color: '#a855f7', tint: true },
  lendario: { label: 'Lendário',   color: '#f5c518', tint: true },
  passe:    { label: 'Passe',      color: '#10b981', tint: true },
  elite:    { label: 'Elite',      color: '#e11d48', tint: true },
};
const TIER: Record<Rarity, number> = { comum: 1, raro: 2, super: 3, passe: 4, elite: 4, lendario: 5 };
const fmt = (n: number) => n.toLocaleString('pt-BR');

/* Opaque rarity-tinted surface — a solid dark base + rarity tint overlay so
   the wallpaper never bleeds through. `strong` boosts the tint for hero cards. */
function tintedSurface(color: string, strong?: boolean) {
  const tint = strong
    ? `linear-gradient(168deg, ${color}4a 0%, ${color}22 38%, ${color}0a 70%, transparent 100%)`
    : `linear-gradient(168deg, ${color}33 0%, ${color}12 42%, ${color}03 72%, transparent 100%)`;
  return `${tint}, #16161b`;
}
function rarityBg(r: Rarity) {
  const { color, tint } = RARITY[r];
  const t = TIER[r];
  return {
    background: tint ? tintedSurface(color, t >= 4) : 'linear-gradient(168deg, #24242a 0%, #161619 60%, #101013 100%), #16161b',
    border: `1px solid ${tint ? color + (t >= 5 ? '88' : t >= 3 ? '66' : '4d') : 'rgba(255,255,255,0.14)'}`,
    boxShadow: t >= 4
      ? `0 0 22px ${color}33, inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -2px 8px rgba(0,0,0,0.45)`
      : 'inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -2px 8px rgba(0,0,0,0.45)',
  } as const;
}

/* ═══════════════════ Data ═══════════════════ */
type ItemKind = 'taco' | 'mesa' | 'adesivo' | 'emoji' | 'avatar' | 'moldura' | 'consumivel';
interface Item {
  id: string; name: string; kind: ItemKind; rarity: Rarity;
  coins?: number; oldCoins?: number; glyph?: string; avatarSeed?: string;
  tableColor?: string; note?: string; soon?: boolean;
}
const KIND_LABEL: Record<ItemKind, string> = {
  taco: 'Tacos', mesa: 'Mesas', adesivo: 'Adesivos', emoji: 'Emojis',
  avatar: 'Avatares', moldura: 'Molduras', consumivel: 'Consumíveis',
};
const KIND_GLYPH: Record<ItemKind, string> = {
  taco: '🎱', mesa: '🟩', adesivo: '🔥', emoji: '😎', avatar: '🧑', moldura: '🖼️', consumivel: '🎟️',
};

const CATALOG: Item[] = [
  { id: 't1', name: 'Taco Iniciante', kind: 'taco', rarity: 'comum', coins: 1200 },
  { id: 't2', name: 'Taco Fibra', kind: 'taco', rarity: 'raro', coins: 4800 },
  { id: 't3', name: 'Taco Carbono', kind: 'taco', rarity: 'super', coins: 12000 },
  { id: 't5', name: 'Taco Inferno', kind: 'taco', rarity: 'super', coins: 13500 },
  { id: 't4', name: 'Taco de Ouro', kind: 'taco', rarity: 'lendario', note: 'Apenas em caixas' },
  { id: 't6', name: 'Taco Esmeralda', kind: 'taco', rarity: 'passe', note: 'Passe da Temporada' },
  { id: 'm1', name: 'Baize Clássico', kind: 'mesa', rarity: 'comum', coins: 3000, tableColor: '#1a5c2e' },
  { id: 'm5', name: 'Mesa Rubi', kind: 'mesa', rarity: 'raro', coins: 7000, tableColor: '#5c1212' },
  { id: 'm2', name: 'Abismo Azul', kind: 'mesa', rarity: 'super', coins: 15000, tableColor: '#0f2d5e' },
  { id: 'm3', name: 'Mesa Real', kind: 'mesa', rarity: 'lendario', note: 'Apenas em caixas', tableColor: '#3a2d0a' },
  { id: 'm4', name: 'Mesa Esmeralda', kind: 'mesa', rarity: 'passe', note: 'Passe da Temporada', tableColor: '#064e3b' },
  { id: 'a1', name: 'Adesivo Chama', kind: 'adesivo', rarity: 'raro', coins: 800, glyph: '🔥' },
  { id: 'a2', name: 'Adesivo Caveira', kind: 'adesivo', rarity: 'super', coins: 2200, glyph: '💀' },
  { id: 'a4', name: 'Adesivo Raio', kind: 'adesivo', rarity: 'raro', coins: 900, glyph: '⚡' },
  { id: 'a3', name: 'Adesivo Coroa', kind: 'adesivo', rarity: 'lendario', note: 'Apenas em caixas', glyph: '👑' },
  { id: 'e1', name: 'Emoji Risada', kind: 'emoji', rarity: 'comum', coins: 300, glyph: '😂' },
  { id: 'e2', name: 'Emoji Estiloso', kind: 'emoji', rarity: 'raro', coins: 600, glyph: '😎' },
  { id: 'e3', name: 'Emoji Fogo', kind: 'emoji', rarity: 'super', coins: 1500, glyph: '🔥' },
  { id: 'e4', name: 'Emoji Bravo', kind: 'emoji', rarity: 'comum', coins: 300, glyph: '😤' },
  { id: 'e5', name: 'Emoji Rei', kind: 'emoji', rarity: 'super', coins: 1500, glyph: '🤴' },
  { id: 'av1', name: 'Avatar Ninja', kind: 'avatar', rarity: 'raro', coins: 5000, avatarSeed: 'ninja' },
  { id: 'av2', name: 'Avatar Mestre', kind: 'avatar', rarity: 'super', coins: 8000, avatarSeed: 'master' },
  { id: 'av4', name: 'Avatar Pirata', kind: 'avatar', rarity: 'raro', coins: 5200, avatarSeed: 'pirate' },
  { id: 'av3', name: 'Avatar Rei', kind: 'avatar', rarity: 'lendario', note: 'Apenas em caixas', avatarSeed: 'king' },
  { id: 'mo1', name: 'Moldura Prata', kind: 'moldura', rarity: 'raro', coins: 2000, avatarSeed: 'f1' },
  { id: 'mo2', name: 'Moldura Neon', kind: 'moldura', rarity: 'super', coins: 6000, avatarSeed: 'f2' },
  { id: 'mo6', name: 'Moldura Gelo', kind: 'moldura', rarity: 'super', coins: 6500, avatarSeed: 'f6' },
  { id: 'mo3', name: 'Moldura Áurea', kind: 'moldura', rarity: 'lendario', note: 'Apenas em caixas', avatarSeed: 'f3' },
  { id: 'mo4', name: 'Moldura Carnaval', kind: 'moldura', rarity: 'elite', coins: 9900, note: 'Edição limitada', avatarSeed: 'f4' },
  { id: 'mo5', name: 'Moldura Temporada', kind: 'moldura', rarity: 'passe', note: 'Passe da Temporada', avatarSeed: 'f5' },
];
const CONSUMIVEIS: Item[] = [
  { id: 'c1', name: 'Troca de Nome', kind: 'consumivel', rarity: 'raro', coins: 5000, glyph: '✏️', note: 'Altere seu nome' },
  { id: 'c2', name: 'Criar Clube', kind: 'consumivel', rarity: 'super', glyph: '🛡️', note: 'Em breve', soon: true },
  { id: 'c3', name: 'Ticket Torneio', kind: 'consumivel', rarity: 'raro', coins: 2500, glyph: '🎟️', note: 'Torneios especiais' },
  { id: 'c4', name: 'Chave de Caixa', kind: 'consumivel', rarity: 'comum', coins: 1500, glyph: '🔑', note: 'Abre caixas' },
];
const OFFERS: Item[] = [
  { id: 'of1', name: 'Taco Carbono', kind: 'taco', rarity: 'super', coins: 8400, oldCoins: 12000 },
  { id: 'of2', name: 'Moldura Carnaval', kind: 'moldura', rarity: 'elite', coins: 6900, oldCoins: 9900, avatarSeed: 'f4' },
  { id: 'of3', name: 'Avatar Mestre', kind: 'avatar', rarity: 'super', coins: 5600, oldCoins: 8000, avatarSeed: 'master' },
  { id: 'of4', name: 'Mesa Rubi', kind: 'mesa', rarity: 'raro', coins: 4900, oldCoins: 7000, tableColor: '#5c1212' },
  { id: 'of5', name: 'Moldura Neon', kind: 'moldura', rarity: 'super', coins: 4200, oldCoins: 6000, avatarSeed: 'f2' },
];

interface BoxDef { id: string; name: string; coins: number; items: number; color: string; odds: { r: Rarity; p: number }[]; bonus?: string; timer?: string; }
const BOXES: BoxDef[] = [
  { id: 'bronze', name: 'Bronze Box', coins: 1000, items: 3, color: '#cd7f32', odds: [{ r: 'comum', p: 70 }, { r: 'raro', p: 25 }, { r: 'super', p: 5 }] },
  { id: 'silver', name: 'Silver Box', coins: 2500, items: 4, color: '#c4c9d4', odds: [{ r: 'comum', p: 50 }, { r: 'raro', p: 35 }, { r: 'super', p: 15 }] },
  { id: 'gold', name: 'Gold Box', coins: 6000, items: 5, color: '#f5c518', odds: [{ r: 'comum', p: 30 }, { r: 'raro', p: 40 }, { r: 'super', p: 29 }, { r: 'lendario', p: 1 }], timer: '7h 46m' },
  { id: 'platinum', name: 'Platinum Box', coins: 15000, items: 7, color: '#67e8f9', odds: [{ r: 'comum', p: 20 }, { r: 'raro', p: 30 }, { r: 'super', p: 35 }, { r: 'lendario', p: 15 }], bonus: 'Ticket Torneio Principal' },
];

interface Prize { label: string; glyph: string; color: string; }
const PRIZES: Prize[] = [
  { label: '100 fichas', glyph: '🪙', color: '#9ca3af' },
  { label: 'Ticket', glyph: '🎟️', color: '#3b82f6' },
  { label: '500 fichas', glyph: '💰', color: '#a855f7' },
  { label: 'Emoji', glyph: '😎', color: '#9ca3af' },
  { label: 'Chave', glyph: '🔑', color: '#3b82f6' },
  { label: 'Comemorativo', glyph: '🎉', color: '#a855f7' },
  { label: '50 fichas', glyph: '🪙', color: '#9ca3af' },
  { label: 'MEGA', glyph: '💎', color: '#f5c518' },
];

const PASSE_REWARDS = [
  { lv: 5, glyph: '🎱', label: 'Taco', r: 'raro' as Rarity },
  { lv: 10, glyph: '🖼️', label: 'Moldura', r: 'super' as Rarity },
  { lv: 15, glyph: '🟩', label: 'Mesa', r: 'super' as Rarity },
  { lv: 20, glyph: '👑', label: 'Exclusivo', r: 'passe' as Rarity },
  { lv: 30, glyph: '💎', label: 'Lendário', r: 'lendario' as Rarity },
];

/* ═══════════════════ Shared visuals ═══════════════════ */
function AvatarImg({ seed, color, size }: { seed: string; color: string; size: number }) {
  return <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundColor=${color.slice(1)}`} alt=""
    style={{ width: size, height: size, borderRadius: '50%', border: `2px solid ${color}70`, boxShadow: `0 0 16px ${color}35` }} />;
}
function TablePreview({ color }: { color: string }) {
  const pk = [['0%', '0%'], ['50%', '0%'], ['100%', '0%'], ['0%', '100%'], ['50%', '100%'], ['100%', '100%']];
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative" style={{ width: '74%', height: '60%' }}>
        <div className="absolute inset-0 rounded-[6px]" style={{ background: 'linear-gradient(135deg,#5c3210,#7a4520,#5c3210)' }} />
        <div className="absolute inset-[7px] rounded-[3px]" style={{ background: color, boxShadow: 'inset 0 0 14px rgba(0,0,0,0.4)' }} />
        {pk.map((p, i) => <div key={i} className="absolute w-3 h-3 rounded-full bg-[#050505]" style={{ left: p[0], top: p[1], transform: 'translate(-50%,-50%)' }} />)}
      </div>
    </div>
  );
}
function ItemVisual({ item, big }: { item: Item; big?: boolean }) {
  const color = RARITY[item.rarity].color;
  if (item.kind === 'mesa' && item.tableColor) return <TablePreview color={item.tableColor} />;
  if (item.kind === 'avatar' && item.avatarSeed) return <div className="w-full h-full flex items-center justify-center"><AvatarImg seed={item.avatarSeed} color={color} size={big ? 110 : 58} /></div>;
  if (item.kind === 'moldura') return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative flex items-center justify-center rounded-full" style={{ width: big ? 116 : 62, height: big ? 116 : 62, padding: big ? 6 : 4, background: `conic-gradient(from 0deg, ${color}, ${color}55, ${color}, ${color}55, ${color})`, boxShadow: `0 0 18px ${color}45` }}>
        <div className="rounded-full w-full h-full" style={{ background: 'radial-gradient(circle at 40% 35%, #2a2a30, #0c0c10)' }} />
      </div>
    </div>
  );
  if (item.kind === 'taco') return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute rounded-full rotate-[38deg]" style={{ width: big ? 6 : 4, height: big ? '72%' : '64%', background: `linear-gradient(to bottom, ${color}, #4a3520 65%, #2a1d12)` }} />
      <div className="absolute rounded-full rotate-[38deg]" style={{ width: big ? 8 : 6, height: big ? 8 : 6, background: color, boxShadow: `0 0 8px ${color}`, top: big ? '15%' : '18%', left: '56%' }} />
    </div>
  );
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="rounded-full flex items-center justify-center" style={{ width: big ? 96 : 54, height: big ? 96 : 54, background: `radial-gradient(circle at 40% 35%, ${color}22, rgba(8,8,12,0.6))`, border: `1.5px solid ${color}40` }}>
        <span style={{ fontSize: big ? 48 : 28, lineHeight: 1 }}>{item.glyph ?? '🎱'}</span>
      </div>
    </div>
  );
}
function ChestVisual({ color, big }: { color: string; big?: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: `radial-gradient(ellipse at 50% 40%, ${color}22 0%, transparent 70%)` }}>
      <svg viewBox="0 0 44 36" style={{ width: big ? '52%' : '60%', height: big ? '52%' : '60%', filter: `drop-shadow(0 0 ${big ? 16 : 10}px ${color}66)` }} fill="none">
        <rect x="2" y="17" width="40" height="17" rx="2.5" fill={color + '20'} stroke={color} strokeWidth="1.8" />
        <path d="M2 19 Q2 8 22 8 Q42 8 42 19 L42 21 L2 21 Z" fill={color + '33'} stroke={color} strokeWidth="1.8" />
        <rect x="2" y="20" width="40" height="4" fill={color + '55'} />
        <rect x="18.5" y="23" width="7" height="5" rx="1.5" fill={color + '66'} stroke={color} strokeWidth="1" />
        <path d="M20 23 Q20 19.5 22 19.5 Q24 19.5 24 23" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="22" cy="9" r="2" fill={color} />
      </svg>
    </div>
  );
}
function CoinPrice({ coins, old, size }: { coins?: number; old?: number; size?: 'sm' | 'lg' | 'xl' }) {
  if (coins == null) return null;
  const dim = size === 'xl' ? 26 : size === 'lg' ? 20 : 14;
  const fs = size === 'xl' ? 26 : size === 'lg' ? 20 : 13;
  return (
    <div className="flex items-center gap-1.5">
      <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: dim, height: dim, background: 'linear-gradient(145deg,#00e870,#00a84a)', boxShadow: '0 0 6px rgba(0,210,106,0.5)' }}>
        <span style={{ fontSize: fs * 0.45, fontWeight: 900, color: '#000' }}>$</span>
      </div>
      <span className="font-black leading-none" style={{ fontSize: fs, color: '#00e870' }}>{fmt(coins)}</span>
      {old != null && <span className="font-bold line-through" style={{ fontSize: fs * 0.62, color: 'rgba(255,255,255,0.3)' }}>{fmt(old)}</span>}
    </div>
  );
}

/* ═══════════════════ Cards ═══════════════════ */
function ItemCardV({ item, w, onOpen }: { item: Item; w: number; onOpen: (i: Item) => void }) {
  const { color } = RARITY[item.rarity];
  const onlyBox = item.note?.toLowerCase().includes('caixa');
  const disc = item.oldCoins ? Math.round((1 - item.coins! / item.oldCoins) * 100) : 0;
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} onClick={() => onOpen(item)}
      className="relative rounded-[16px] overflow-hidden flex flex-col cursor-pointer h-full shrink-0" style={{ width: w, ...rarityBg(item.rarity) }}>
      <div className="absolute top-0 inset-x-0 h-[2px] z-20" style={{ background: color, boxShadow: TIER[item.rarity] >= 4 ? `0 0 8px ${color}` : 'none' }} />
      {TIER[item.rarity] >= 4 && <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}1c 0%, transparent 55%)` }} />}
      {disc > 0 && <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[8px] font-black z-20" style={{ background: '#ef4444', color: '#fff' }}>-{disc}%</div>}
      <div className="relative flex-1 min-h-0"><ItemVisual item={item} /></div>
      <div className="px-2.5 pb-2.5 pt-1 relative z-10">
        <span className="text-[7px] font-black uppercase tracking-[0.1em]" style={{ color }}>{RARITY[item.rarity].label}</span>
        <h4 className="font-display leading-none truncate mt-0.5" style={{ fontSize: 13.5, color: '#fff' }}>{item.name}</h4>
        <div className="mt-1.5">
          {onlyBox ? (
            <div className="flex items-center justify-center gap-1 rounded-[9px] py-1.5" style={{ background: `${color}1c`, border: `1px solid ${color}40` }}><Lock size={9} style={{ color }} /><span className="text-[8px] font-black uppercase" style={{ color }}>Caixas</span></div>
          ) : item.coins != null ? (
            <div className="flex items-center justify-center rounded-[9px] py-1.5" style={{ background: 'rgba(0,232,112,0.14)', border: '1px solid rgba(0,232,112,0.3)' }}><CoinPrice coins={item.coins} old={item.oldCoins} /></div>
          ) : (
            <div className="flex items-center justify-center rounded-[9px] py-1.5" style={{ background: 'rgba(16,185,129,0.16)', border: '1px solid rgba(16,185,129,0.4)' }}><span className="text-[8px] font-black uppercase" style={{ color: '#10b981' }}>{item.soon ? 'Em breve' : 'Passe'}</span></div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function BoxCardV({ box, onOpen }: { box: BoxDef; onOpen: (b: BoxDef) => void }) {
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => onOpen(box)}
      className="relative rounded-[18px] overflow-hidden flex flex-col cursor-pointer h-full shrink-0" style={{ width: 198,
        background: tintedSurface(box.color, true), border: `1px solid ${box.color}66`, boxShadow: `0 0 20px ${box.color}26, inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -2px 8px rgba(0,0,0,0.45)` }}>
      <div className="absolute top-0 inset-x-0 h-[2px] z-20" style={{ background: box.color, boxShadow: `0 0 8px ${box.color}` }} />
      {box.timer && <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[8px] font-black z-20" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>{box.timer}</div>}
      {box.bonus && <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full z-20" style={{ background: 'rgba(245,197,24,0.2)', border: '1px solid rgba(245,197,24,0.5)' }}><Ticket size={9} style={{ color: '#f5c518' }} /><span className="text-[7px] font-black" style={{ color: '#f5c518' }}>BRINDE</span></div>}
      <div className="relative flex-1 min-h-0"><ChestVisual color={box.color} /></div>
      <div className="px-3 pb-3 pt-1 relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-display leading-none" style={{ fontSize: 16, color: '#fff' }}>{box.name}</h3>
          <span className="text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>{box.items} itens</span>
        </div>
        <div className="flex h-[5px] rounded-full overflow-hidden mt-1.5" style={{ background: 'rgba(255,255,255,0.08)' }}>{box.odds.map(o => <div key={o.r} style={{ width: `${o.p}%`, background: RARITY[o.r].color }} />)}</div>
        <div className="mt-2 flex items-center justify-center rounded-[10px] py-1.5" style={{ background: `linear-gradient(135deg, ${box.color}30, ${box.color}12)`, border: `1px solid ${box.color}50` }}><CoinPrice coins={box.coins} /></div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════ Detail modal ═══════════════════ */
function DetailModal({ item, box, onClose }: { item?: Item; box?: BoxDef; onClose: () => void }) {
  const color = item ? RARITY[item.rarity].color : box!.color;
  const onlyBox = item?.note?.toLowerCase().includes('caixa');
  const canBuy = item ? (!onlyBox && !item.soon) : true;
  const buy = () => {
    if (box) toast.success(`${box.name} aberta!`, { description: `${box.items} itens adicionados ao inventário.` });
    else if (item) {
      if (item.soon) { toast('Em breve', { description: `${item.name} chega em breve.` }); return; }
      if (onlyBox) { toast('Exclusivo de caixas', { description: `${item.name} só vem em caixas.` }); return; }
      toast.success(`${item.name} adquirido!`, { description: 'Adicionado ao seu perfil.' });
    }
    onClose();
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
      className="absolute inset-0 z-[70] flex items-center justify-center p-4" style={{ background: 'rgba(2,3,4,0.74)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 12, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        onClick={e => e.stopPropagation()} className="relative rounded-[24px] overflow-hidden flex"
        style={{ width: 'min(94vw, 600px)', maxHeight: '90vh', background: 'linear-gradient(160deg, rgba(24,24,28,0.99) 0%, rgba(11,11,14,0.99) 100%)', border: `1px solid ${color}55`, boxShadow: `0 30px 80px rgba(0,0,0,0.75), 0 0 60px ${color}26` }}>
        <div className="absolute top-0 inset-x-0 h-px z-20" style={{ background: `linear-gradient(90deg, transparent 6%, ${color}66 30%, rgba(255,255,255,0.5) 50%, ${color}44 70%, transparent 94%)` }} />
        <div className="relative shrink-0 overflow-hidden" style={{ width: 220 }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 38%, ${color}33 0%, ${color}0e 45%, rgba(6,6,9,0.95) 75%)` }} />
          <div className="relative w-full h-full flex items-center justify-center p-4">{box ? <ChestVisual color={color} big /> : <ItemVisual item={item!} big />}</div>
          <div className="absolute top-4 bottom-4 right-0 w-px" style={{ background: `linear-gradient(180deg, transparent, ${color}40, transparent)` }} />
        </div>
        <div className="relative flex flex-col flex-1 min-w-0 px-5 py-5 overflow-y-auto no-scrollbar">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-20 cursor-pointer" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}><X size={14} style={{ color: 'rgba(255,255,255,0.6)' }} /></motion.button>
          <span className="self-start text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full mb-2" style={{ color, background: `${color}1a`, border: `1px solid ${color}50` }}>{item ? RARITY[item.rarity].label : `Caixa · ${box!.items} itens`}</span>
          <h2 className="font-display leading-none pr-8" style={{ fontSize: 30, color: '#fff' }}>{item?.name ?? box?.name}</h2>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] mt-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{item ? KIND_LABEL[item.kind] : 'Caixa surpresa'}</span>
          {item?.note && <p className="text-[11px] leading-snug mt-2" style={{ color: `${color}cc` }}>{item.note}</p>}
          {box && (
            <div className="flex flex-col gap-1.5 mt-3">
              <span className="text-[9px] font-black uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.4)' }}>Probabilidades</span>
              {box.odds.map(o => (
                <div key={o.r} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold w-[72px] shrink-0" style={{ color: RARITY[o.r].color }}>{RARITY[o.r].label}</span>
                  <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}><motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${o.p}%` }} transition={{ duration: 0.7 }} style={{ background: RARITY[o.r].color }} /></div>
                  <span className="text-[10px] font-black w-9 text-right shrink-0" style={{ color: 'rgba(255,255,255,0.75)' }}>{o.p}%</span>
                </div>
              ))}
              {box.bonus && <div className="flex items-center gap-1.5 mt-1 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.3)' }}><Ticket size={13} style={{ color: '#f5c518' }} /><span className="text-[10px] font-bold" style={{ color: '#f5c518' }}>{box.bonus}</span></div>}
            </div>
          )}
          <div className="mt-auto pt-4 flex items-center gap-3">
            {box ? <CoinPrice coins={box.coins} size="lg" /> : item?.coins != null ? <CoinPrice coins={item.coins} old={item.oldCoins} size="lg" /> : <span className="font-display text-[16px]" style={{ color: '#10b981' }}>Passe da Temporada</span>}
            <motion.button whileTap={canBuy ? { scale: 0.96 } : {}} onClick={buy} className="ml-auto relative overflow-hidden rounded-[14px] px-6 py-3 font-display tracking-[0.12em] cursor-pointer flex items-center gap-2"
              style={canBuy ? { background: 'linear-gradient(160deg,#00e870,#00c058 55%,#008a3a)', color: '#000', fontSize: 18, border: '1px solid rgba(255,255,255,0.28)', boxShadow: '0 0 24px rgba(0,232,112,0.45), inset 0 2px 0 rgba(255,255,255,0.65)' } : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: 15, border: '1px solid rgba(255,255,255,0.1)' }}>
              {!canBuy && onlyBox && <Lock size={14} className="relative z-10" />}
              <span className="relative z-10">{box ? 'ABRIR CAIXA' : item?.soon ? 'EM BREVE' : onlyBox ? 'SÓ EM CAIXAS' : 'COMPRAR'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════ Roulette ═══════════════════ */
function Roulette({ compact }: { compact?: boolean }) {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [used, setUsed] = useState(false);
  const size = compact ? 184 : 220;
  const seg = 360 / PRIZES.length;
  const arc = (i: number) => {
    const a1 = (-90 + i * seg - seg / 2) * Math.PI / 180, a2 = (-90 + i * seg + seg / 2) * Math.PI / 180, r = 96;
    return `M100,100 L${(100 + r * Math.cos(a1)).toFixed(2)},${(100 + r * Math.sin(a1)).toFixed(2)} A${r},${r} 0 0 1 ${(100 + r * Math.cos(a2)).toFixed(2)},${(100 + r * Math.sin(a2)).toFixed(2)} Z`;
  };
  const labelPos = (i: number) => { const a = (-90 + i * seg) * Math.PI / 180, r = 62; return { x: 100 + r * Math.cos(a), y: 100 + r * Math.sin(a), deg: -90 + i * seg + 90 }; };
  const spin = () => {
    if (spinning || used) return;
    const chosen = Math.floor(Math.random() * PRIZES.length);
    const targetMod = ((-chosen * seg) % 360 + 360) % 360;
    const curMod = ((rot % 360) + 360) % 360;
    let delta = targetMod - curMod; if (delta < 0) delta += 360;
    setRot(rot + 360 * 5 + delta); setSpinning(true);
    setTimeout(() => { setSpinning(false); setUsed(true); toast.success(`Você ganhou: ${PRIZES[chosen].label}!`, { description: 'Prêmio adicionado. Volte amanhã!' }); }, 3700);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: -3, width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '18px solid #ED0A65', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }} />
        <motion.div animate={{ rotate: rot }} transition={{ duration: 3.6, ease: [0.18, 0.9, 0.2, 1] }} style={{ width: size, height: size }}>
          <svg viewBox="0 0 200 200" width={size} height={size} style={{ filter: 'drop-shadow(0 8px 26px rgba(0,0,0,0.6))' }}>
            <circle cx={100} cy={100} r={99} fill="#0a0a0d" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
            {PRIZES.map((p, i) => (
              <g key={i}>
                <path d={arc(i)} fill={`${p.color}${i % 2 === 0 ? '3a' : '24'}`} stroke={p.color} strokeWidth={1} />
                <g transform={`translate(${labelPos(i).x},${labelPos(i).y}) rotate(${labelPos(i).deg})`}><text textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 18 }}>{p.glyph}</text></g>
              </g>
            ))}
            <circle cx={100} cy={100} r={18} fill="#15151a" stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          </svg>
        </motion.div>
      </div>
      <motion.button whileTap={!spinning && !used ? { scale: 0.95 } : {}} whileHover={!spinning && !used ? { scale: 1.04, y: -2 } : {}} onClick={spin}
        className="relative overflow-hidden rounded-[13px] px-7 py-2.5 font-display tracking-[0.14em] cursor-pointer"
        style={used ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: 15, border: '1px solid rgba(255,255,255,0.1)' } : { background: 'linear-gradient(160deg,#ED0A65,#a30848)', color: '#fff', fontSize: 18, border: '1px solid rgba(255,255,255,0.28)', boxShadow: '0 0 26px rgba(237,10,101,0.5), inset 0 2px 0 rgba(255,255,255,0.45)' }}>
        {!used && <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ borderRadius: '13px 13px 0 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)' }} />}
        <span className="relative z-10">{spinning ? 'GIRANDO…' : used ? 'VOLTE AMANHÃ' : 'GIRAR GRÁTIS'}</span>
      </motion.button>
    </div>
  );
}

/* ═══════════════════ Section start tag ═══════════════════ */
/* A category panel — a larger bordered rectangle that wraps the category's
   cards. The category label sits as a vertical tag on the LEFT side so the
   cards keep the full height (bigger cards). */
const CategoryPanel = ({ innerRef, Icon, title, color, children }: {
  innerRef: RefObject<HTMLDivElement>; Icon: LucideIcon; title: string; color: string; children: ReactNode;
}) => (
  <div ref={innerRef} className="shrink-0 h-full rounded-[22px] relative flex items-stretch gap-3 p-2.5 overflow-hidden"
    style={{
      background: `linear-gradient(160deg, ${color}1c 0%, rgba(12,12,16,0.72) 30%, rgba(9,9,12,0.7) 100%)`,
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      border: `1px solid ${color}55`,
      boxShadow: `0 0 28px ${color}1c, inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 10px rgba(0,0,0,0.4)`,
    }}>
    <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent 4%, ${color}66 28%, rgba(255,255,255,0.4) 50%, ${color}48 72%, transparent 96%)` }} />
    {/* side vertical tag */}
    <div className="shrink-0 h-full rounded-[16px] relative flex flex-col items-center justify-center gap-3 overflow-hidden"
      style={{ width: 50, background: 'linear-gradient(180deg, rgba(24,24,29,0.96), rgba(11,11,14,0.98))', border: `1px solid ${color}5a`, boxShadow: `inset 0 0 18px ${color}1f` }}>
      <div className="absolute top-0 inset-x-1.5 h-[3px] rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}26`, border: `1px solid ${color}66` }}>
        <Icon size={17} style={{ color }} />
      </div>
      <span className="font-display uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 14, fontWeight: 700, letterSpacing: '0.16em', color, textShadow: `0 0 10px ${color}66, 0 1px 2px rgba(0,0,0,0.7)` }}>{title}</span>
    </div>
    {/* cards (full height → bigger) */}
    <div className="flex items-stretch gap-3 h-full">
      {children}
    </div>
  </div>
);

/* ═══════════════════ Fullscreen overlays ═══════════════════ */
function FullHeader({ title, color, onClose }: { title: string; color: string; onClose: () => void }) {
  return (
    <div className="shrink-0 relative flex items-center px-5 py-3 z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent 5%, ${color}50 30%, rgba(255,255,255,0.3) 50%, ${color}35 70%, transparent 95%)` }} />
      <motion.button whileTap={{ scale: 0.92 }} onClick={onClose} className="flex items-center gap-1.5 pl-2.5 pr-3.5 py-2 rounded-full cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <X size={15} style={{ color: 'rgba(255,255,255,0.7)' }} /><span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Fechar</span>
      </motion.button>
      <h1 className="font-display absolute left-1/2 -translate-x-1/2 leading-none" style={{ fontSize: 24, letterSpacing: '0.08em', color, textShadow: `0 0 22px ${color}55` }}>{title}</h1>
    </div>
  );
}

function CatalogFull({ onClose, onOpen }: { onClose: () => void; onOpen: (i: Item) => void }) {
  const [type, setType] = useState<ItemKind>('taco');
  const types: ItemKind[] = ['taco', 'mesa', 'moldura', 'avatar', 'adesivo', 'emoji', 'consumivel'];
  const items = type === 'consumivel' ? CONSUMIVEIS : CATALOG.filter(i => i.kind === type);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22 }}
      className="absolute inset-0 z-[60] flex flex-col" style={{ background: 'linear-gradient(160deg, rgba(8,12,9,0.98), rgba(4,6,5,0.99))', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,232,112,0.12), transparent 60%)' }} />
      <FullHeader title="CATÁLOGO" color="#00e870" onClose={onClose} />
      <div className="flex-1 flex gap-3 p-4 min-h-0 relative z-10" style={{ paddingBottom: 'calc(14px + env(safe-area-inset-bottom))' }}>
        <div className="shrink-0 flex flex-col gap-2 overflow-y-auto no-scrollbar" style={{ width: 150 }}>
          {types.map(t => {
            const on = type === t;
            return (
              <motion.button key={t} whileTap={{ scale: 0.97 }} onClick={() => setType(t)} className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-[13px] cursor-pointer text-left shrink-0"
                style={{ background: on ? 'linear-gradient(155deg, rgba(20,20,23,0.97), rgba(9,9,12,0.99) 60%, rgba(0,232,112,0.1))' : 'rgba(255,255,255,0.04)', border: `1px solid ${on ? 'rgba(0,232,112,0.5)' : 'rgba(255,255,255,0.08)'}`, boxShadow: on ? 'inset 0 1px 0 rgba(255,255,255,0.18)' : 'none' }}>
                {on && <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-full" style={{ background: '#00e870', boxShadow: '0 0 8px #00e870' }} />}
                <span style={{ fontSize: 17 }}>{KIND_GLYPH[t]}</span>
                <span className="font-display tracking-wide leading-none" style={{ fontSize: 14, color: on ? '#00e870' : 'rgba(255,255,255,0.55)' }}>{KIND_LABEL[t]}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="flex-1 min-w-0 rounded-[16px] relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <AnimatePresence mode="wait">
            <motion.div key={type} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
              className="absolute inset-0 overflow-y-auto no-scrollbar flex flex-wrap gap-3 content-start p-4">
              {items.map(it => <div key={it.id} style={{ width: 132, height: 168 }}><ItemCardV item={it} w={132} onOpen={onOpen} /></div>)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function PasseFull({ onClose }: { onClose: () => void }) {
  const C = '#10b981';
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22 }}
      className="absolute inset-0 z-[60] flex flex-col" style={{ background: 'linear-gradient(160deg, rgba(5,14,10,0.98), rgba(3,7,5,0.99))' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(16,185,129,0.18), transparent 60%)' }} />
      <FullHeader title="PASSE DA TEMPORADA" color={C} onClose={onClose} />
      <div className="flex-1 flex gap-5 px-6 py-4 min-h-0 relative z-10 overflow-hidden" style={{ paddingBottom: 'calc(14px + env(safe-area-inset-bottom))' }}>
        {/* hero */}
        <div className="shrink-0 rounded-[20px] relative overflow-hidden flex flex-col items-center justify-center px-6" style={{ width: 280, background: 'radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.3), rgba(6,12,9,0.95) 75%)', border: '1px solid rgba(16,185,129,0.5)', boxShadow: '0 0 30px rgba(16,185,129,0.25), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
          <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: C, boxShadow: `0 0 8px ${C}` }} />
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-black" style={{ background: '#ef4444', color: '#fff' }}>-40%</div>
          <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }} transition={{ repeat: Infinity, duration: 2.4 }}>
            <Sparkles size={72} style={{ color: C, filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.7))' }} />
          </motion.div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-4" style={{ color: C }}>Temporada 1 · Compra antecipada</span>
          <h2 className="font-display leading-none text-center mt-1.5" style={{ fontSize: 30, color: '#fff' }}>PASSE ACE</h2>
          <p className="text-[11px] text-center leading-snug mt-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Libere recompensas exclusivas a cada nível e progrida durante toda a temporada.</p>
        </div>
        {/* rewards + buy */}
        <div className="flex-1 min-w-0 flex flex-col">
          <span className="font-display text-[15px] tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>O QUE VOCÊ DESBLOQUEIA</span>
          <div className="flex gap-2.5 mt-3 overflow-x-auto no-scrollbar">
            {PASSE_REWARDS.map(r => {
              const col = RARITY[r.r].color;
              return (
                <div key={r.lv} className="shrink-0 rounded-[14px] flex flex-col items-center justify-center gap-1 px-3 py-3" style={{ width: 92, background: `linear-gradient(165deg, ${col}26, #0d0d10)`, border: `1px solid ${col}55` }}>
                  <span className="text-[8px] font-black uppercase" style={{ color: col }}>Nível {r.lv}</span>
                  <span style={{ fontSize: 30 }}>{r.glyph}</span>
                  <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>{r.label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {['+30 recompensas', 'Molduras exclusivas', 'Tacos & mesas temáticos', 'Avanço acelerado'].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <Check size={11} style={{ color: C }} /><span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{b}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-4 pt-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>A partir de</span>
              <CoinPrice coins={3000} old={5000} size="xl" />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.03, y: -2 }}
              onClick={() => { toast.success('Passe da Temporada ativado!', { description: 'Suas coletas e progressão começaram. Boa sorte!' }); onClose(); }}
              className="ml-auto relative overflow-hidden rounded-[16px] px-8 py-3.5 font-display tracking-[0.12em] cursor-pointer"
              style={{ background: 'linear-gradient(160deg,#10e89a,#0c9d6a 55%,#077a4f)', color: '#04130c', fontSize: 21, border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 0 28px rgba(16,185,129,0.5), inset 0 2px 0 rgba(255,255,255,0.6)' }}>
              <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ borderRadius: '16px 16px 0 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.5), transparent)' }} />
              <span className="relative z-10">ADQUIRIR PASSE</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════ Bottom nav ═══════════════════ */
type Menu = 'ofertas' | 'caixas' | 'catalogo' | 'presente';
const MENUS: { id: Menu; label: string; Icon: LucideIcon; color: string }[] = [
  { id: 'ofertas', label: 'Ofertas', Icon: Tag, color: '#fbbf24' },
  { id: 'caixas', label: 'Caixas', Icon: Box, color: '#a855f7' },
  { id: 'catalogo', label: 'Catálogo', Icon: LayoutGrid, color: '#00e870' },
  { id: 'presente', label: 'Presente Diário', Icon: Gift, color: '#ED0A65' },
];

/* ═══════════════════ Main ═══════════════════ */
export default function StoreHorizontal() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const secRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [active, setActive] = useState(0);
  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [detailBox, setDetailBox] = useState<BoxDef | null>(null);
  const [full, setFull] = useState<'catalog' | 'passe' | null>(null);

  const scrollTo = (i: number) => {
    const el = scrollRef.current, sec = secRefs[i].current; if (!el || !sec) return;
    el.scrollTo({ left: sec.offsetLeft - 12, behavior: 'smooth' });
  };
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const onScroll = () => {
      const x = el.scrollLeft + 90;
      let cur = 0;
      secRefs.forEach((r, i) => { if (r.current && r.current.offsetLeft <= x) cur = i; });
      setActive(cur);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="h-full w-full relative flex flex-col select-none">

      {/* ── Continuous horizontal scroll ── */}
      <div ref={scrollRef} className="flex-1 relative flex items-stretch overflow-x-auto overflow-y-hidden no-scrollbar gap-4 px-4 py-3 min-h-0">

        {/* OFERTAS */}
        <CategoryPanel innerRef={secRefs[0]} Icon={MENUS[0].Icon} title="OFERTAS" color="#fbbf24">
          {/* Passe destaque */}
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => setFull('passe')}
            className="relative rounded-[18px] overflow-hidden flex flex-col cursor-pointer h-full shrink-0" style={{ width: 332, ...rarityBg('passe') }}>
            <div className="absolute top-0 inset-x-0 h-[2px] z-20" style={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black z-20" style={{ background: '#ef4444', color: '#fff' }}>-40%</div>
            <div className="relative flex-1 flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(16,185,129,0.3), transparent 70%)' }}>
              <motion.div animate={{ scale: [1, 1.07, 1], opacity: [0.85, 1, 0.85] }} transition={{ repeat: Infinity, duration: 2.4 }}>
                <Sparkles size={58} style={{ color: '#10b981', filter: 'drop-shadow(0 0 16px rgba(16,185,129,0.7))' }} />
              </motion.div>
            </div>
            <div className="px-4 pb-4 pt-1 relative z-10">
              <span className="text-[8px] font-black uppercase tracking-[0.16em]" style={{ color: '#10b981' }}>Compra antecipada</span>
              <h3 className="font-display leading-none mt-1" style={{ fontSize: 25, color: '#fff' }}>PASSE DA TEMPORADA</h3>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>A partir de</span>
                <CoinPrice coins={3000} old={5000} size="lg" />
              </div>
            </div>
          </motion.div>
          {OFFERS.map(it => <ItemCardV key={it.id} item={it} w={176} onOpen={setDetailItem} />)}
        </CategoryPanel>

        {/* CAIXAS */}
        <CategoryPanel innerRef={secRefs[1]} Icon={MENUS[1].Icon} title="CAIXAS" color="#a855f7">
          {BOXES.map(b => <BoxCardV key={b.id} box={b} onOpen={setDetailBox} />)}
        </CategoryPanel>

        {/* CATÁLOGO — card especial que abre fullscreen */}
        <CategoryPanel innerRef={secRefs[2]} Icon={MENUS[2].Icon} title="CATÁLOGO" color="#00e870">
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => setFull('catalog')}
            className="relative rounded-[18px] overflow-hidden flex flex-col cursor-pointer h-full shrink-0" style={{ width: 332, ...rarityBg('passe'), background: tintedSurface('#00e870', true), border: '1px solid rgba(0,232,112,0.55)' }}>
            <div className="absolute top-0 inset-x-0 h-[2px] z-20" style={{ background: '#00e870', boxShadow: '0 0 8px #00e870' }} />
            <div className="relative flex-1 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2.5 opacity-90">
                {['🎱', '🟩', '🖼️', '🧑', '🔥', '😎'].map((g, i) => (
                  <div key={i} className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,232,112,0.25)' }}><span style={{ fontSize: 24 }}>{g}</span></div>
                ))}
              </div>
            </div>
            <div className="px-4 pb-4 pt-1 relative z-10">
              <span className="text-[8px] font-black uppercase tracking-[0.16em]" style={{ color: '#00e870' }}>Explore tudo</span>
              <h3 className="font-display leading-none mt-1" style={{ fontSize: 25, color: '#fff' }}>VER CATÁLOGO</h3>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>Tacos · Mesas · Molduras…</span>
                <div className="flex items-center gap-1 font-display" style={{ fontSize: 13, color: '#00e870' }}>ABRIR <ChevronRight size={15} /></div>
              </div>
            </div>
          </motion.div>
        </CategoryPanel>

        {/* PRESENTE DIÁRIO — roleta */}
        <CategoryPanel innerRef={secRefs[3]} Icon={MENUS[3].Icon} title="PRESENTE DIÁRIO" color="#ED0A65">
          <div className="relative flex items-center justify-center gap-5 px-3 h-full shrink-0" style={{ width: 480 }}>
            <Roulette compact />
            <div className="flex flex-col gap-2 max-w-[200px]">
              <span className="font-display text-[14px] tracking-wide" style={{ color: '#fff' }}>POSSÍVEIS PRÊMIOS</span>
              <div className="flex flex-col gap-1.5 mt-1">
                {PRIZES.slice(0, 5).map((p, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-[9px] px-2.5 py-1.5" style={{ background: `${p.color}14`, border: `1px solid ${p.color}30` }}>
                    <span style={{ fontSize: 15 }}>{p.glyph}</span><span className="text-[10px] font-semibold truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CategoryPanel>
      </div>

      {/* ── Bottom anchor nav (flush to bottom, extends into safe area) ── */}
      <div className="shrink-0 relative z-20" style={{ background: 'rgba(8,8,12,0.92)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', borderTop: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)', paddingBottom: 'max(env(safe-area-inset-bottom), 4px)' }}>
        <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent 5%, ${MENUS[active].color}45 30%, rgba(255,255,255,0.25) 50%, ${MENUS[active].color}35 70%, transparent 95%)` }} />
        <div className="flex items-stretch" style={{ height: 50 }}>
          {MENUS.map((m, i) => {
            const on = active === i;
            return (
              <button key={m.id} onClick={() => scrollTo(i)} className="relative flex-1 flex items-center justify-center cursor-pointer">
                {on && <motion.div layoutId="store-h-bar" className="absolute top-0 h-[3px] rounded-full" style={{ width: '44%', background: m.color, boxShadow: `0 0 10px ${m.color}` }} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <div className="flex items-center gap-1.5">
                  <m.Icon size={15} style={{ color: on ? m.color : 'rgba(255,255,255,0.4)' }} />
                  <span className="font-display tracking-[0.08em] leading-none" style={{ fontSize: 13, color: on ? m.color : 'rgba(255,255,255,0.45)', textShadow: on ? `0 0 14px ${m.color}66` : 'none' }}>{m.label}</span>
                  {m.id === 'presente' && <span className="px-1 py-0.5 rounded text-[7px] font-black leading-none" style={{ background: '#10b981', color: '#000' }}>GRÁTIS</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {full === 'catalog' && <CatalogFull key="cf" onClose={() => setFull(null)} onOpen={setDetailItem} />}
        {full === 'passe' && <PasseFull key="pf" onClose={() => setFull(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />}
        {detailBox && <DetailModal box={detailBox} onClose={() => setDetailBox(null)} />}
      </AnimatePresence>
    </div>
  );
}
