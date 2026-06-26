import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Tag, Box, LayoutGrid, Gift, X, Lock, Ticket, Sparkles, ChevronRight, type LucideIcon } from 'lucide-react';

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
  { id: 't4', name: 'Taco de Ouro', kind: 'taco', rarity: 'lendario', note: 'Apenas em caixas' },
  { id: 'm1', name: 'Baize Clássico', kind: 'mesa', rarity: 'comum', coins: 3000, tableColor: '#1a5c2e' },
  { id: 'm2', name: 'Abismo Azul', kind: 'mesa', rarity: 'super', coins: 15000, tableColor: '#0f2d5e' },
  { id: 'm3', name: 'Mesa Real', kind: 'mesa', rarity: 'lendario', note: 'Apenas em caixas', tableColor: '#3a2d0a' },
  { id: 'm4', name: 'Mesa Esmeralda', kind: 'mesa', rarity: 'passe', note: 'Passe da Temporada', tableColor: '#064e3b' },
  { id: 'a1', name: 'Adesivo Chama', kind: 'adesivo', rarity: 'raro', coins: 800, glyph: '🔥' },
  { id: 'a2', name: 'Adesivo Caveira', kind: 'adesivo', rarity: 'super', coins: 2200, glyph: '💀' },
  { id: 'a3', name: 'Adesivo Coroa', kind: 'adesivo', rarity: 'lendario', note: 'Apenas em caixas', glyph: '👑' },
  { id: 'e1', name: 'Emoji Risada', kind: 'emoji', rarity: 'comum', coins: 300, glyph: '😂' },
  { id: 'e2', name: 'Emoji Estiloso', kind: 'emoji', rarity: 'raro', coins: 600, glyph: '😎' },
  { id: 'e3', name: 'Emoji Fogo', kind: 'emoji', rarity: 'super', coins: 1500, glyph: '🔥' },
  { id: 'av1', name: 'Avatar Ninja', kind: 'avatar', rarity: 'raro', coins: 5000, avatarSeed: 'ninja' },
  { id: 'av2', name: 'Avatar Mestre', kind: 'avatar', rarity: 'super', coins: 8000, avatarSeed: 'master' },
  { id: 'av3', name: 'Avatar Rei', kind: 'avatar', rarity: 'lendario', note: 'Apenas em caixas', avatarSeed: 'king' },
  { id: 'mo1', name: 'Moldura Prata', kind: 'moldura', rarity: 'raro', coins: 2000, avatarSeed: 'f1' },
  { id: 'mo2', name: 'Moldura Neon', kind: 'moldura', rarity: 'super', coins: 6000, avatarSeed: 'f2' },
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

/* ═══════════════════ Shared visuals ═══════════════════ */
function AvatarImg({ seed, color, size }: { seed: string; color: string; size: number }) {
  return <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundColor=${color.slice(1)}`} alt=""
    style={{ width: size, height: size, borderRadius: '50%', border: `2px solid ${color}70`, boxShadow: `0 0 16px ${color}35` }} />;
}
function TablePreview({ color }: { color: string }) {
  const pk = [['0%', '0%'], ['50%', '0%'], ['100%', '0%'], ['0%', '100%'], ['50%', '100%'], ['100%', '100%']];
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative" style={{ width: '76%', height: '64%' }}>
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
  if (item.kind === 'avatar' && item.avatarSeed) return <div className="w-full h-full flex items-center justify-center"><AvatarImg seed={item.avatarSeed} color={color} size={big ? 110 : 60} /></div>;
  if (item.kind === 'moldura') return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative flex items-center justify-center rounded-full" style={{ width: big ? 116 : 66, height: big ? 116 : 66, padding: big ? 6 : 4, background: `conic-gradient(from 0deg, ${color}, ${color}55, ${color}, ${color}55, ${color})`, boxShadow: `0 0 18px ${color}45` }}>
        <div className="rounded-full w-full h-full" style={{ background: 'radial-gradient(circle at 40% 35%, #2a2a30, #0c0c10)' }} />
      </div>
    </div>
  );
  if (item.kind === 'taco') return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute rounded-full rotate-[38deg]" style={{ width: big ? 6 : 4, height: big ? '72%' : '66%', background: `linear-gradient(to bottom, ${color}, #4a3520 65%, #2a1d12)` }} />
      <div className="absolute rounded-full rotate-[38deg]" style={{ width: big ? 8 : 6, height: big ? 8 : 6, background: color, boxShadow: `0 0 8px ${color}`, top: big ? '15%' : '17%', left: '56%' }} />
    </div>
  );
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="rounded-full flex items-center justify-center" style={{ width: big ? 96 : 56, height: big ? 96 : 56, background: `radial-gradient(circle at 40% 35%, ${color}22, rgba(8,8,12,0.6))`, border: `1.5px solid ${color}40` }}>
        <span style={{ fontSize: big ? 48 : 30, lineHeight: 1 }}>{item.glyph ?? '🎱'}</span>
      </div>
    </div>
  );
}
function ChestVisual({ color, big }: { color: string; big?: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: `radial-gradient(ellipse at 50% 40%, ${color}22 0%, transparent 70%)` }}>
      <svg viewBox="0 0 44 36" style={{ width: big ? '52%' : '64%', height: big ? '52%' : '64%', filter: `drop-shadow(0 0 ${big ? 16 : 10}px ${color}66)` }} fill="none">
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
function CoinPrice({ coins, old, size }: { coins?: number; old?: number; size?: 'sm' | 'lg' }) {
  if (coins == null) return null;
  const big = size === 'lg';
  return (
    <div className="flex items-center gap-1.5">
      <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: big ? 20 : 14, height: big ? 20 : 14, background: 'linear-gradient(145deg,#00e870,#00a84a)', boxShadow: '0 0 6px rgba(0,210,106,0.5)' }}>
        <span style={{ fontSize: big ? 9 : 6, fontWeight: 900, color: '#000' }}>$</span>
      </div>
      <span className="font-black leading-none" style={{ fontSize: big ? 20 : 13, color: '#00e870' }}>{fmt(coins)}</span>
      {old != null && <span className="text-[10px] font-bold line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>{fmt(old)}</span>}
    </div>
  );
}
function rarityCard(r: Rarity) {
  const { color, tint } = RARITY[r];
  const t = TIER[r];
  return {
    background: tint ? `radial-gradient(ellipse at 35% -10%, ${color}26 0%, ${color}0c 42%, rgba(13,13,16,0.97) 70%)` : 'linear-gradient(160deg, rgba(24,24,27,0.96) 0%, rgba(12,12,15,0.98) 100%)',
    border: tint ? `1px solid ${color}${t >= 5 ? '70' : t >= 3 ? '50' : '38'}` : '1px solid rgba(255,255,255,0.12)',
    boxShadow: t >= 4 ? `0 0 18px ${color}22, inset 0 1px 0 rgba(255,255,255,0.16)` : 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.4)',
  };
}

/* ═══════════════════ Item card (catalog grid) ═══════════════════ */
function GridCard({ item, onOpen }: { item: Item; onOpen: (i: Item) => void }) {
  const { color } = RARITY[item.rarity];
  const onlyBox = item.note?.toLowerCase().includes('caixa');
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} onClick={() => onOpen(item)}
      className="relative rounded-[14px] overflow-hidden flex flex-col cursor-pointer shrink-0" style={{ width: 128, height: 150, ...rarityCard(item.rarity) }}>
      <div className="absolute top-0 inset-x-0 h-[2px] z-20" style={{ background: color, boxShadow: TIER[item.rarity] >= 4 ? `0 0 7px ${color}` : 'none' }} />
      <div className="relative shrink-0" style={{ height: 60 }}><ItemVisual item={item} /></div>
      <div className="flex flex-col flex-1 px-2.5 py-1.5 min-h-0 justify-between gap-1">
        <div className="flex flex-col gap-1">
          <span className="inline-block self-start text-[7px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-full" style={{ color, background: `${color}1a`, border: `1px solid ${color}45` }}>{RARITY[item.rarity].label}</span>
          <h3 className="font-display leading-none truncate" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.94)' }}>{item.name}</h3>
        </div>
        <div>
          {onlyBox ? (
            <div className="flex items-center justify-center gap-1 rounded-[8px] py-1.5" style={{ background: `${color}14`, border: `1px solid ${color}38` }}>
              <Lock size={9} style={{ color }} /><span className="text-[7px] font-black uppercase" style={{ color }}>Caixas</span>
            </div>
          ) : item.coins != null ? (
            <div className="flex items-center justify-center rounded-[8px] py-1.5" style={{ background: 'rgba(0,232,112,0.12)', border: '1px solid rgba(0,232,112,0.28)' }}><CoinPrice coins={item.coins} /></div>
          ) : (
            <div className="flex items-center justify-center rounded-[8px] py-1.5" style={{ background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.38)' }}><span className="text-[7px] font-black uppercase" style={{ color: '#10b981' }}>{item.soon ? 'Em breve' : 'Passe'}</span></div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════ Detail modal (centered) ═══════════════════ */
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
      className="absolute inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(2,3,4,0.72)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 12, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        onClick={e => e.stopPropagation()} className="relative rounded-[24px] overflow-hidden flex"
        style={{ width: 'min(94vw, 600px)', maxHeight: '90vh', background: 'linear-gradient(160deg, rgba(22,22,26,0.99) 0%, rgba(10,10,13,0.99) 100%)', border: `1px solid ${color}45`, boxShadow: `0 30px 80px rgba(0,0,0,0.75), 0 0 60px ${color}22` }}>
        <div className="absolute top-0 inset-x-0 h-px z-20" style={{ background: `linear-gradient(90deg, transparent 6%, ${color}66 30%, rgba(255,255,255,0.5) 50%, ${color}44 70%, transparent 94%)` }} />
        <div className="relative shrink-0 overflow-hidden" style={{ width: 220 }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 38%, ${color}2e 0%, ${color}0c 45%, rgba(6,6,9,0.95) 75%)` }} />
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
function Roulette() {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [used, setUsed] = useState(false);
  const seg = 360 / PRIZES.length;
  const arc = (i: number) => {
    const a1 = (-90 + i * seg - seg / 2) * Math.PI / 180;
    const a2 = (-90 + i * seg + seg / 2) * Math.PI / 180;
    const r = 96;
    const x1 = 100 + r * Math.cos(a1), y1 = 100 + r * Math.sin(a1);
    const x2 = 100 + r * Math.cos(a2), y2 = 100 + r * Math.sin(a2);
    return `M100,100 L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 0 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`;
  };
  const labelPos = (i: number) => {
    const a = (-90 + i * seg) * Math.PI / 180;
    const r = 62;
    return { x: 100 + r * Math.cos(a), y: 100 + r * Math.sin(a), deg: -90 + i * seg + 90 };
  };
  const spin = () => {
    if (spinning || used) return;
    const chosen = Math.floor(Math.random() * PRIZES.length);
    const targetMod = ((-chosen * seg) % 360 + 360) % 360;
    const curMod = ((rot % 360) + 360) % 360;
    let delta = targetMod - curMod; if (delta < 0) delta += 360;
    setRot(rot + 360 * 5 + delta);
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false); setUsed(true);
      toast.success(`Você ganhou: ${PRIZES[chosen].label}!`, { description: 'Prêmio adicionado. Volte amanhã para girar de novo.' });
    }, 3700);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative" style={{ width: 220, height: 220 }}>
        {/* pointer */}
        <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: -4, width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderTop: '20px solid #ED0A65', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }} />
        {/* wheel */}
        <motion.div animate={{ rotate: rot }} transition={{ duration: 3.6, ease: [0.18, 0.9, 0.2, 1] }} style={{ width: 220, height: 220 }}>
          <svg viewBox="0 0 200 200" width={220} height={220} style={{ filter: 'drop-shadow(0 8px 26px rgba(0,0,0,0.6))' }}>
            <circle cx={100} cy={100} r={99} fill="#0a0a0d" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
            {PRIZES.map((p, i) => (
              <g key={i}>
                <path d={arc(i)} fill={`${p.color}${i % 2 === 0 ? '33' : '22'}`} stroke={p.color} strokeWidth={1} />
                <g transform={`translate(${labelPos(i).x},${labelPos(i).y}) rotate(${labelPos(i).deg})`}>
                  <text textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 18 }}>{p.glyph}</text>
                </g>
              </g>
            ))}
            <circle cx={100} cy={100} r={20} fill="#15151a" stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          </svg>
        </motion.div>
      </div>
      <motion.button whileTap={!spinning && !used ? { scale: 0.95 } : {}} whileHover={!spinning && !used ? { scale: 1.04, y: -2 } : {}} onClick={spin}
        className="relative overflow-hidden rounded-[14px] px-8 py-3 font-display tracking-[0.14em] cursor-pointer"
        style={used ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: 16, border: '1px solid rgba(255,255,255,0.1)' }
          : { background: 'linear-gradient(160deg,#ED0A65,#a30848)', color: '#fff', fontSize: 19, border: '1px solid rgba(255,255,255,0.28)', boxShadow: '0 0 26px rgba(237,10,101,0.5), inset 0 2px 0 rgba(255,255,255,0.45)' }}>
        {!used && <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ borderRadius: '14px 14px 0 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)' }} />}
        <span className="relative z-10">{spinning ? 'GIRANDO…' : used ? 'VOLTE AMANHÃ' : 'GIRAR GRÁTIS'}</span>
      </motion.button>
    </div>
  );
}

/* ═══════════════════ Sections ═══════════════════ */
const Section = ({ children, tint }: { children: ReactNode; tint: string }) => (
  <section className="snap-start shrink-0 h-full relative flex flex-col" style={{ width: '100%', minWidth: '100%' }}>
    <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${tint}14 0%, transparent 60%)` }} />
    {children}
  </section>
);

const SectionTitle = ({ label, color, sub }: { label: string; color: string; sub?: string }) => (
  <div className="shrink-0 flex items-baseline gap-3 px-5 pt-3 pb-2 relative z-10">
    <h2 className="font-display leading-none" style={{ fontSize: 26, letterSpacing: '0.05em', color, textShadow: `0 0 24px ${color}55, 0 2px 8px rgba(0,0,0,0.8)` }}>{label}</h2>
    {sub && <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</span>}
  </div>
);

/* ═══════════════════ Main ═══════════════════ */
type Menu = 'ofertas' | 'caixas' | 'catalogo' | 'presente';
const MENUS: { id: Menu; label: string; Icon: LucideIcon; color: string }[] = [
  { id: 'ofertas', label: 'Ofertas', Icon: Tag, color: '#fbbf24' },
  { id: 'caixas', label: 'Caixas', Icon: Box, color: '#a855f7' },
  { id: 'catalogo', label: 'Catálogo', Icon: LayoutGrid, color: '#00e870' },
  { id: 'presente', label: 'Presente Diário', Icon: Gift, color: '#ED0A65' },
];

export default function StoreHorizontal() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [detailBox, setDetailBox] = useState<BoxDef | null>(null);
  const [catType, setCatType] = useState<ItemKind>('taco');

  const scrollTo = (i: number) => {
    const el = scrollRef.current; if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    setActive(i);
  };
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const onScroll = () => setActive(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const catItems = catType === 'consumivel' ? CONSUMIVEIS : CATALOG.filter(i => i.kind === catType);
  const catTypes: ItemKind[] = ['taco', 'mesa', 'moldura', 'avatar', 'adesivo', 'emoji', 'consumivel'];

  return (
    <div className="h-full w-full relative flex flex-col select-none"
      style={{ padding: '0 0 calc(0px + env(safe-area-inset-bottom)) 0' }}>

      {/* ── Horizontal pager ── */}
      <div ref={scrollRef} className="flex-1 flex overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory min-h-0"
        style={{ scrollBehavior: 'smooth' }}>

        {/* OFERTAS */}
        <Section tint="#fbbf24">
          <SectionTitle label="Ofertas" color="#fbbf24" sub="Promoções da semana" />
          <div className="flex-1 flex gap-3 px-5 pb-3 min-h-0 overflow-hidden">
            {/* Passe destaque */}
            <motion.div whileTap={{ scale: 0.98 }} onClick={() => toast('Passe da Temporada', { description: 'Compra antecipada com preço promocional.' })}
              className="relative rounded-[18px] overflow-hidden flex flex-col cursor-pointer h-full shrink-0" style={{ width: '38%', ...rarityCard('passe') }}>
              <div className="absolute top-0 inset-x-0 h-[2px] z-20" style={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-black z-20" style={{ background: '#ef4444', color: '#fff' }}>-40%</div>
              <div className="relative flex-1 flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(16,185,129,0.28), transparent 70%)' }}>
                <Sparkles size={54} style={{ color: '#10b981', filter: 'drop-shadow(0 0 16px rgba(16,185,129,0.7))' }} />
              </div>
              <div className="px-4 pb-4 pt-1">
                <span className="text-[8px] font-black uppercase tracking-[0.16em]" style={{ color: '#10b981' }}>Compra antecipada</span>
                <h3 className="font-display leading-none mt-1" style={{ fontSize: 24, color: '#fff' }}>PASSE DA TEMPORADA</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>A partir de</span>
                  <CoinPrice coins={3000} old={5000} size="lg" />
                </div>
              </div>
            </motion.div>
            {/* offer items */}
            <div className="flex-1 grid grid-cols-3 gap-3 min-w-0">
              {OFFERS.map(it => (
                <motion.div key={it.id} whileTap={{ scale: 0.96 }} onClick={() => setDetailItem(it)}
                  className="relative rounded-[16px] overflow-hidden flex flex-col cursor-pointer h-full" style={rarityCard(it.rarity)}>
                  <div className="absolute top-0 inset-x-0 h-[2px] z-20" style={{ background: RARITY[it.rarity].color }} />
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[8px] font-black z-20" style={{ background: '#ef4444', color: '#fff' }}>-{Math.round((1 - it.coins! / it.oldCoins!) * 100)}%</div>
                  <div className="relative flex-1 min-h-0"><ItemVisual item={it} /></div>
                  <div className="px-2.5 pb-2.5 pt-1">
                    <span className="text-[7px] font-black uppercase tracking-[0.1em]" style={{ color: RARITY[it.rarity].color }}>{RARITY[it.rarity].label}</span>
                    <h4 className="font-display leading-none truncate" style={{ fontSize: 13, color: '#fff' }}>{it.name}</h4>
                    <div className="mt-1.5"><CoinPrice coins={it.coins} old={it.oldCoins} /></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* CAIXAS */}
        <Section tint="#a855f7">
          <SectionTitle label="Caixas" color="#a855f7" sub="Itens aleatórios" />
          <div className="flex-1 grid grid-cols-4 gap-3 px-5 pb-3 min-h-0">
            {BOXES.map(b => (
              <motion.div key={b.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => setDetailBox(b)}
                className="relative rounded-[18px] overflow-hidden flex flex-col cursor-pointer h-full"
                style={{ background: `radial-gradient(ellipse at 40% -10%, ${b.color}22 0%, ${b.color}08 42%, rgba(13,13,16,0.97) 70%)`, border: `1px solid ${b.color}50`, boxShadow: `0 0 18px ${b.color}1c, inset 0 1px 0 rgba(255,255,255,0.16)` }}>
                <div className="absolute top-0 inset-x-0 h-[2px] z-20" style={{ background: b.color, boxShadow: `0 0 8px ${b.color}` }} />
                {b.timer && <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[8px] font-black z-20" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>{b.timer}</div>}
                {b.bonus && <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full z-20" style={{ background: 'rgba(245,197,24,0.18)', border: '1px solid rgba(245,197,24,0.5)' }}><Ticket size={9} style={{ color: '#f5c518' }} /><span className="text-[7px] font-black" style={{ color: '#f5c518' }}>BRINDE</span></div>}
                <div className="relative flex-1 min-h-0"><ChestVisual color={b.color} /></div>
                <div className="px-3 pb-3 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display leading-none" style={{ fontSize: 16, color: '#fff' }}>{b.name}</h3>
                    <span className="text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{b.items} itens</span>
                  </div>
                  <div className="flex h-[5px] rounded-full overflow-hidden mt-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {b.odds.map(o => <div key={o.r} style={{ width: `${o.p}%`, background: RARITY[o.r].color }} />)}
                  </div>
                  <div className="mt-2 flex items-center justify-center rounded-[10px] py-1.5" style={{ background: `linear-gradient(135deg, ${b.color}28, ${b.color}10)`, border: `1px solid ${b.color}45` }}><CoinPrice coins={b.coins} /></div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* CATÁLOGO — área própria: menu esquerda + grid direita */}
        <Section tint="#00e870">
          <SectionTitle label="Catálogo" color="#00e870" sub="Todos os itens" />
          <div className="flex-1 flex gap-3 px-5 pb-3 min-h-0">
            {/* left menu */}
            <div className="shrink-0 flex flex-col gap-1.5 overflow-y-auto no-scrollbar" style={{ width: 132 }}>
              {catTypes.map(t => {
                const isSel = catType === t;
                return (
                  <button key={t} onClick={() => setCatType(t)}
                    className="relative flex items-center gap-2 px-3 py-2 rounded-[12px] cursor-pointer text-left shrink-0"
                    style={{ background: isSel ? 'linear-gradient(155deg, rgba(20,20,23,0.97), rgba(9,9,12,0.99) 60%, rgba(0,232,112,0.08))' : 'rgba(255,255,255,0.04)', border: `1px solid ${isSel ? 'rgba(0,232,112,0.5)' : 'rgba(255,255,255,0.08)'}`, boxShadow: isSel ? 'inset 0 1px 0 rgba(255,255,255,0.18)' : 'none' }}>
                    {isSel && <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-full" style={{ background: '#00e870', boxShadow: '0 0 8px #00e870' }} />}
                    <span style={{ fontSize: 15 }}>{KIND_GLYPH[t]}</span>
                    <span className="font-display tracking-wide leading-none" style={{ fontSize: 12.5, color: isSel ? '#00e870' : 'rgba(255,255,255,0.5)' }}>{KIND_LABEL[t]}</span>
                  </button>
                );
              })}
            </div>
            {/* right grid */}
            <div className="flex-1 min-w-0 rounded-[16px] relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <AnimatePresence mode="wait">
                <motion.div key={catType} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                  className="absolute inset-0 overflow-y-auto no-scrollbar flex flex-wrap gap-2.5 content-start p-3">
                  {catItems.map(it => <GridCard key={it.id} item={it} onOpen={setDetailItem} />)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Section>

        {/* PRESENTE DIÁRIO — roleta */}
        <Section tint="#ED0A65">
          <SectionTitle label="Presente Diário" color="#ED0A65" sub="Gire e ganhe" />
          <div className="flex-1 flex items-center justify-center gap-8 px-5 pb-3 min-h-0">
            <Roulette />
            <div className="flex flex-col gap-2 max-w-[260px]">
              <span className="font-display text-[16px] tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>POSSÍVEIS PRÊMIOS</span>
              <div className="grid grid-cols-2 gap-2">
                {PRIZES.slice(0, 6).map((p, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-[10px] px-2.5 py-1.5" style={{ background: `${p.color}12`, border: `1px solid ${p.color}30` }}>
                    <span style={{ fontSize: 16 }}>{p.glyph}</span>
                    <span className="text-[10px] font-semibold truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>{p.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] leading-snug mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Disponível para quem fez um depósito nos últimos 7 dias. 1 giro grátis por dia.</p>
            </div>
          </div>
        </Section>
      </div>

      {/* ── Bottom anchor nav ── */}
      <div className="shrink-0 relative flex items-stretch z-20"
        style={{ height: 52, background: 'rgba(8,8,12,0.72)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', borderTop: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
        <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent 5%, ${MENUS[active].color}45 30%, rgba(255,255,255,0.25) 50%, ${MENUS[active].color}35 70%, transparent 95%)` }} />
        {MENUS.map((m, i) => {
          const on = active === i;
          return (
            <button key={m.id} onClick={() => scrollTo(i)} className="relative flex-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer">
              {on && <motion.div layoutId="store-h-bar" className="absolute top-0 h-[3px] rounded-full" style={{ width: '46%', background: m.color, boxShadow: `0 0 10px ${m.color}` }} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <div className="flex items-center gap-1.5">
                <m.Icon size={15} style={{ color: on ? m.color : 'rgba(255,255,255,0.4)' }} />
                <span className="font-display tracking-[0.08em] leading-none" style={{ fontSize: 13, color: on ? m.color : 'rgba(255,255,255,0.45)', textShadow: on ? `0 0 14px ${m.color}66` : 'none' }}>{m.label}</span>
                {m.id === 'presente' && <span className="px-1 py-0.5 rounded text-[7px] font-black leading-none" style={{ background: '#10b981', color: '#000' }}>GRÁTIS</span>}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />}
        {detailBox && <DetailModal box={detailBox} onClose={() => setDetailBox(null)} />}
      </AnimatePresence>
    </div>
  );
}
