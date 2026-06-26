import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Users, Play } from 'lucide-react';
import { toast } from 'sonner';
import { MODE_CFG, BANNER_DATA, SLIDE_BG_IMAGE, BET_TIERS, money } from './LobbyScreen';

export type PlayMode = 'duel' | 'tournaments';

interface PlayModalProps {
  mode: PlayMode | null;
  onClose: () => void;
}

export default function PlayModal({ mode, onClose }: PlayModalProps) {
  const open = mode !== null;
  const cfg = MODE_CFG[mode ?? 'duel'] ?? MODE_CFG.duel;
  const subModes = mode ? (BANNER_DATA[mode] ?? []) : [];

  const [modalModeId, setModalModeId] = useState<string | null>(null);
  const [modalBet, setModalBet] = useState<number>(1);
  const [betCounts, setBetCounts] = useState<number[]>(() => BET_TIERS.map(t => t.players));

  // Reset selection each time the modal opens for a mode
  useEffect(() => {
    if (!mode) return;
    const sm = BANNER_DATA[mode] ?? [];
    setModalModeId(sm[0]?.id ?? null);
    setModalBet(1);
    setBetCounts(BET_TIERS.map(t => t.players));
  }, [mode]);

  // Live-ish drift of waiting players while open
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setBetCounts(prev => prev.map(c => Math.max(8, c + Math.round((Math.random() - 0.5) * 7))));
    }, 2200);
    return () => clearInterval(id);
  }, [open]);

  const confirmMatch = () => {
    const sub = subModes.find(s => s.id === modalModeId);
    const title = mode === 'tournaments' ? 'Inscrevendo no torneio…' : 'Buscando adversário…';
    toast(title, { description: `${sub?.title ?? ''} • Aposta ${money(modalBet)}` });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ background: 'rgba(2,4,3,0.74)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          onClick={onClose}
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
                  {mode === 'tournaments' ? 'Escolha o formato e a entrada' : 'Escolha o modo e o valor'}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={onClose}
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
                  {subModes.map((sm) => {
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
                    {mode === 'tournaments' ? 'CONFIRMAR' : 'JOGAR'}
                  </span>
                  {mode !== 'tournaments' && (
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
  );
}
