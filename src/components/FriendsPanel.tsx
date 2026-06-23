import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Copy, UserPlus, Swords, Eye, MessageCircle, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface FriendsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'in-game' | 'online' | 'offline';

interface Friend {
  id: string;
  name: string;
  seed: string;
  status: Status;
  level: number;
  game?: string;
  lastSeen?: string;
  winRate: number;
}

const FRIENDS: Friend[] = [
  { id: '1', name: 'Lucas M.',    seed: 'lucas',    status: 'in-game', level: 18, game: 'Bola 8',    winRate: 64 },
  { id: '2', name: 'Roberto S.',  seed: 'roberto',  status: 'in-game', level: 22, game: 'Torneio',   winRate: 71 },
  { id: '3', name: 'Maria G.',    seed: 'maria',    status: 'online',  level: 12, winRate: 55 },
  { id: '4', name: 'Carlos R.',   seed: 'carlos',   status: 'online',  level: 25, winRate: 68 },
  { id: '5', name: 'Ana Paula',   seed: 'ana',      status: 'offline', level: 9,  lastSeen: '2h',    winRate: 49 },
  { id: '6', name: 'Pedro H.',    seed: 'pedro',    status: 'offline', level: 15, lastSeen: 'Ontem', winRate: 60 },
  { id: '7', name: 'Fernanda L.', seed: 'fernanda', status: 'offline', level: 31, lastSeen: '3 dias', winRate: 73 },
  { id: '8', name: 'Thiago V.',   seed: 'thiago',   status: 'offline', level: 7,  lastSeen: '1 sem', winRate: 42 },
];

const MY_CODE = '482139';

const PANEL_STYLE = {
  background: 'linear-gradient(170deg, #08080e 0%, #050509 100%)',
  borderLeft: '1px solid rgba(255,255,255,0.055)',
  boxShadow: '-12px 0 48px rgba(0,0,0,0.65)',
};

const GLASS_CARD = {
  background: 'rgba(255,255,255,0.036)',
  border: '1px solid rgba(255,255,255,0.055)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.055)',
};

/* ── Status dot ─────────────────────────────────────────────────── */
const STATUS_COLORS: Record<Status, { dot: string; glow: string }> = {
  'in-game': { dot: 'bg-brand-green', glow: '0 0 6px rgba(0,210,106,0.85)' },
  'online':  { dot: 'bg-sky-400',     glow: '0 0 6px rgba(56,189,248,0.75)' },
  'offline': { dot: 'bg-white/18',    glow: 'none' },
};

function StatusDot({ status }: { status: Status }) {
  const { dot, glow } = STATUS_COLORS[status];
  return (
    <span
      className={cn('absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2', dot, status === 'in-game' && 'animate-pulse')}
      style={{ borderColor: '#040e06', boxShadow: glow }}
    />
  );
}

/* ── Friend row ─────────────────────────────────────────────────── */
function FriendRow({ friend }: { friend: Friend }) {
  const isOnline  = friend.status === 'online';
  const isInGame  = friend.status === 'in-game';
  const isOffline = friend.status === 'offline';

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.025] active:bg-white/[0.04] transition-colors group"
    >
      <div className="relative shrink-0">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.seed}`}
          className="w-9 h-9 rounded-full bg-[#0a1e0e]"
          style={{ border: '1.5px solid rgba(255,255,255,0.06)' }}
        />
        <StatusDot status={friend.status} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn('text-[13px] font-semibold truncate tracking-[-0.01em]', isOffline ? 'text-white/35' : 'text-white/88')}>
            {friend.name}
          </span>
          <span
            className="text-[8.5px] font-black text-white/18 px-1.5 py-0.5 rounded-md leading-none shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            {friend.level}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-0.5">
          {isInGame && (
            <>
              <span className="w-1 h-1 rounded-full bg-brand-green" style={{ boxShadow: '0 0 4px rgba(0,210,106,0.9)' }} />
              <span className="text-[10px] text-brand-green/75 font-medium">Em jogo · {friend.game}</span>
            </>
          )}
          {isOnline && (
            <>
              <span className="w-1 h-1 rounded-full bg-sky-400" />
              <span className="text-[10px] text-sky-400/75 font-medium">Online</span>
            </>
          )}
          {isOffline && (
            <span className="text-[10px] text-white/22 font-medium">Visto há {friend.lastSeen}</span>
          )}
        </div>
      </div>

      <div className={cn('flex items-center gap-1 transition-opacity duration-150', isOffline ? 'opacity-0 group-hover:opacity-35' : 'opacity-0 group-hover:opacity-100')}>
        {isInGame && <ActionBtn icon={<Eye className="w-3.5 h-3.5" />} label="Assistir" />}
        {isOnline && (
          <ActionBtn
            icon={<Swords className="w-3.5 h-3.5" />}
            label="Desafiar"
            onClick={() => toast(`⚔️ Desafio enviado para ${friend.name}!`)}
            highlight
          />
        )}
        <ActionBtn icon={<MessageCircle className="w-3.5 h-3.5" />} label="Chat" />
      </div>
    </motion.div>
  );
}

function ActionBtn({ icon, label, onClick, highlight }: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        'w-[26px] h-[26px] rounded-[8px] flex items-center justify-center transition-colors',
        highlight ? 'text-brand-green hover:bg-brand-green/20' : 'text-white/40 hover:text-white/70',
      )}
      style={
        highlight
          ? { background: 'rgba(0,210,106,0.10)', border: '1px solid rgba(0,210,106,0.20)' }
          : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }
      }
    >
      {icon}
    </button>
  );
}

/* ── Section header ─────────────────────────────────────────────── */
function SectionHeader({ label, count, icon }: { label: string; count: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 mt-1.5">
      <span className="text-white/20 [&>svg]:w-3 [&>svg]:h-3">{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/22">{label}</span>
      <span className="text-[9px] font-black text-white/18 ml-0.5">{count}</span>
    </div>
  );
}

/* ── Profile code ───────────────────────────────────────────────── */
function ProfileCode() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MY_CODE).catch(() => {});
    setCopied(true);
    toast.success('Código copiado!', { description: 'Compartilhe para que amigos te encontrem.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-4 mb-3.5">
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-[14px] relative overflow-hidden" style={GLASS_CARD}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.045) 0%, transparent 55%)' }} />
        <p className="text-[9.5px] font-semibold text-white/28 tracking-[0.08em] uppercase relative">Seu código</p>
        <button onClick={handleCopy} className="flex items-center gap-2 hover:opacity-75 transition-opacity group relative">
          <span className="text-[13px] font-black text-white/80 tracking-[0.22em] font-mono">{MY_CODE}</span>
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="ok" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
                className="text-[9px] font-black text-brand-green">✓</motion.span>
            ) : (
              <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Copy className="w-3 h-3 text-white/22 group-hover:text-white/45 transition-colors" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

/* ── Search bar ─────────────────────────────────────────────────── */
function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative mx-4 mb-3">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/22 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar por nome ou #código"
        className="w-full rounded-[12px] pl-9 pr-4 py-2.5 text-[12.5px] text-white/80 placeholder-white/18 outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.2)',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'rgba(0,210,106,0.28)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,210,106,0.06), inset 0 1px 0 rgba(0,0,0,0.2)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(0,0,0,0.2)';
        }}
      />
    </div>
  );
}

/* ── Add-by-code ────────────────────────────────────────────────── */
function AddByCode({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-3 flex items-center gap-3 px-4 py-3 rounded-[14px]"
      style={{
        background: 'rgba(0,210,106,0.05)',
        border: '1px solid rgba(0,210,106,0.18)',
        boxShadow: 'inset 0 1px 0 rgba(0,210,106,0.08)',
      }}
    >
      <UserPlus className="w-4 h-4 text-brand-green shrink-0" />
      <span className="flex-1 text-[12px] text-white/55">Adicionar <span className="text-white/80 font-semibold">{query}</span></span>
      <button
        onClick={() => toast.success(`Solicitação enviada para ${query}`)}
        className="text-[11px] font-black text-brand-green px-3 py-1.5 rounded-[8px] hover:bg-brand-green/15 transition-colors"
        style={{ background: 'rgba(0,210,106,0.10)', border: '1px solid rgba(0,210,106,0.20)' }}
      >
        Adicionar
      </button>
    </motion.div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function FriendsPanel({ isOpen, onClose }: FriendsPanelProps) {
  const [query, setQuery] = useState('');

  const isCodeQuery = query.startsWith('#') && query.length > 1;

  const filtered = useMemo<Friend[]>(() => {
    if (!query) return FRIENDS;
    const q = query.toLowerCase().replace('#', '');
    return FRIENDS.filter(f => f.name.toLowerCase().includes(q));
  }, [query]);

  const online  = filtered.filter(f => f.status === 'online');
  const inGame  = filtered.filter(f => f.status === 'in-game');
  const offline = filtered.filter(f => f.status === 'offline');
  const activeCount = online.length + inGame.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="friends-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="absolute inset-0 z-[150]"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}
          />

          {/* Panel */}
          <motion.div
            key="friends-panel"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 330 }}
            className="absolute top-0 right-0 h-full w-[290px] z-[151] flex flex-col overflow-hidden"
            style={PANEL_STYLE}
          >
            {/* Top shimmer line */}
            <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(0,210,106,0.18), transparent)' }} />

            {/* Header */}
            <div className="px-4 pt-5 pb-4 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white/92 font-semibold text-[16px] tracking-[-0.02em]">Amigos</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {activeCount > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"
                        style={{ boxShadow: '0 0 5px rgba(0,210,106,0.8)' }} />
                    )}
                    <p className={cn('text-[11px] font-medium', activeCount > 0 ? 'text-brand-green/70' : 'text-white/28')}>
                      {activeCount > 0 ? `${activeCount} online` : 'Todos offline'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-[28px] h-[28px] rounded-full flex items-center justify-center transition-colors hover:bg-white/[0.09]"
                  style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <X className="w-3 h-3 text-white/45" />
                </button>
              </div>
            </div>

            <div className="mx-4 mb-3.5 h-px" style={{ background: 'rgba(255,255,255,0.042)' }} />

            <ProfileCode />
            <SearchBar value={query} onChange={setQuery} />

            <AnimatePresence>
              {isCodeQuery && <AddByCode query={query} />}
            </AnimatePresence>

            <div className="h-px mx-4 mb-1" style={{ background: 'rgba(255,255,255,0.038)' }} />

            {/* Friends list */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-1">

              {inGame.length > 0 && (
                <>
                  <SectionHeader label="Em jogo" count={inGame.length} icon={<Swords />} />
                  {inGame.map(f => <React.Fragment key={f.id}><FriendRow friend={f} /></React.Fragment>)}
                </>
              )}

              {online.length > 0 && (
                <>
                  <SectionHeader label="Online" count={online.length} icon={<Wifi />} />
                  {online.map(f => <React.Fragment key={f.id}><FriendRow friend={f} /></React.Fragment>)}
                </>
              )}

              {offline.length > 0 && (
                <>
                  <SectionHeader label="Offline" count={offline.length} icon={<WifiOff />} />
                  {offline.map(f => <React.Fragment key={f.id}><FriendRow friend={f} /></React.Fragment>)}
                </>
              )}

              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 gap-3 text-center px-6"
                >
                  <Search className="w-8 h-8 text-white/8" />
                  <p className="text-white/28 text-[12.5px]">
                    Nenhum amigo encontrado para <span className="text-white/45 font-semibold">"{query}"</span>
                  </p>
                </motion.div>
              )}

              {!query && (
                <div className="mx-4 mt-4 mb-4">
                  <button
                    onClick={() => toast('Convite copiado!', { description: 'Compartilhe seu código para adicionar amigos.' })}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-white/22 hover:text-white/38 text-[11.5px] font-medium transition-colors"
                    style={{ border: '1px dashed rgba(255,255,255,0.10)' }}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Adicionar amigos
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
