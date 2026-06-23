import { motion } from 'motion/react';
import { toast } from 'sonner';
import { GameMode } from '../types';
import { useLanguage } from '../i18n';

/* ── Snooker cue + ball visual for DUELO ────────────────────────── */
function DuelArena() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      {/* Ambient table felt glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 70%, rgba(0,100,40,0.22) 0%, transparent 65%)',
      }} />

      {/* Left cue stick */}
      <div className="absolute" style={{
        width: '360px', height: '10px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(160,120,50,0.1) 12%, rgba(210,170,80,0.42) 42%, rgba(240,195,95,0.55) 52%, rgba(210,170,80,0.35) 68%, rgba(140,100,40,0.1) 85%, transparent 100%)',
        borderRadius: '5px',
        transform: 'rotate(-30deg) translateY(-8px)',
        filter: 'blur(0.3px)',
        boxShadow: '0 0 18px rgba(200,155,60,0.14)',
      }} />

      {/* Right cue stick */}
      <div className="absolute" style={{
        width: '360px', height: '10px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(140,100,40,0.1) 12%, rgba(210,170,80,0.35) 42%, rgba(240,195,95,0.55) 52%, rgba(210,170,80,0.42) 68%, rgba(160,120,50,0.1) 85%, transparent 100%)',
        borderRadius: '5px',
        transform: 'rotate(30deg) translateY(8px)',
        filter: 'blur(0.3px)',
        boxShadow: '0 0 18px rgba(200,155,60,0.14)',
      }} />

      {/* Snooker cue ball */}
      <div className="relative z-10" style={{
        width: '44px', height: '44px', borderRadius: '50%',
        background: 'radial-gradient(circle at 36% 30%, rgba(255,255,255,0.97) 0%, rgba(228,228,228,0.88) 35%, rgba(180,180,180,0.7) 65%, rgba(100,100,100,0.55) 100%)',
        boxShadow: '0 0 32px rgba(255,255,255,0.32), 0 0 60px rgba(255,255,255,0.1), 0 6px 20px rgba(0,0,0,0.95)',
      }}>
        <div style={{
          position: 'absolute', top: '17%', left: '20%',
          width: '28%', height: '20%', borderRadius: '50%',
          background: 'rgba(255,255,255,0.75)', filter: 'blur(1.5px)',
        }} />
      </div>
    </div>
  );
}

/* ── Trophy visual for TORNEIOS ─────────────────────────────────── */
function TournamentArena() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Trophy image */}
      <img
        src="/trofeu%20-%20torneio.png"
        alt=""
        className="absolute object-contain"
        style={{
          right: '-8%', top: '2%', height: '90%',
          opacity: 0.7,
          filter: 'drop-shadow(0 0 28px rgba(201,149,42,0.55)) drop-shadow(0 0 60px rgba(201,149,42,0.22)) saturate(1.15) brightness(1.05)',
        }}
      />
      {/* Left-to-right fade so text stays readable */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, rgba(20,12,0,0.92) 0%, rgba(20,12,0,0.65) 42%, rgba(20,12,0,0.15) 70%, transparent 85%)',
      }} />
    </div>
  );
}

/* ── Generic secondary card visual ──────────────────────────────── */
function GenericBackground({ src, opacity = 0.18 }: { src?: string; opacity?: number }) {
  if (!src) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <img src={src} alt="" className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-25"
        style={{ opacity, objectPosition: 'center' }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.92) 100%)',
      }} />
    </div>
  );
}

export default function GameModeCard({ mode }: { mode: GameMode }) {
  const { t } = useLanguage();

  const isDuel       = mode.id === 'duel';
  const isTournament = mode.id === 'tournaments';

  const accent = isDuel
    ? '#00d26a'
    : isTournament
      ? '#c9952a'
      : 'rgba(255,255,255,0.22)';

  const glowColor = isDuel
    ? 'rgba(0,210,106,0.16)'
    : isTournament
      ? 'rgba(201,149,42,0.14)'
      : 'rgba(255,255,255,0.025)';

  const borderColor = isDuel
    ? 'rgba(0,210,106,0.32)'
    : isTournament
      ? 'rgba(201,149,42,0.28)'
      : 'rgba(255,255,255,0.08)';

  const cardBase = isDuel
    ? 'linear-gradient(160deg, rgba(0,22,10,0.98) 0%, rgba(0,8,4,0.99) 100%)'
    : isTournament
      ? 'linear-gradient(160deg, rgba(22,14,0,0.98) 0%, rgba(8,5,0,0.99) 100%)'
      : 'rgba(5,7,6,0.88)';

  const cardW = isDuel ? 440 : isTournament ? 390 : 310;

  return (
    <motion.div
      whileHover={{ y: -7, scale: 1.025 }}
      transition={{ type: 'spring', stiffness: 360, damping: 26 }}
      className="relative rounded-[28px] overflow-hidden group cursor-pointer shrink-0"
      style={{
        width: `${cardW}px`,
        height: '272px',
        boxShadow: `0 28px 70px rgba(0,0,0,0.92), 0 0 0 1px ${borderColor}, 0 0 55px ${glowColor}`,
      }}
    >
      {/* ── Base background ── */}
      <div className="absolute inset-0" style={{ background: cardBase }} />

      {/* ── Mode-specific visual layer ── */}
      {isDuel       && <DuelArena />}
      {isTournament && <TournamentArena />}
      {!isDuel && !isTournament && (
        <GenericBackground src={mode.backgroundImage} opacity={0.18} />
      )}

      {/* ── Atmospheric color bloom ── */}
      {isDuel && (
        <>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 65% 92%, rgba(0,140,60,0.2), transparent 58%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 30% 12%, rgba(0,200,90,0.06), transparent 50%)' }} />
        </>
      )}
      {isTournament && (
        <>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 30% 88%, rgba(180,128,18,0.22), transparent 60%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(201,149,42,0.06), transparent 50%)' }} />
        </>
      )}

      {/* ── Glass diagonal shine ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(130deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.018) 28%, transparent 52%)' }} />

      {/* ── Top edge light line ── */}
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent 5%, ${accent}55 38%, ${accent}cc 52%, ${accent}55 66%, transparent 95%)` }} />

      {/* ── Inner edge glow ── */}
      <div className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 32px ${glowColor}` }} />

      {/* ── Bottom color bloom ── */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none" style={{
        height: '42%',
        background: isDuel
          ? 'radial-gradient(ellipse at 50% 112%, rgba(0,180,80,0.24), transparent 65%)'
          : isTournament
            ? 'radial-gradient(ellipse at 50% 112%, rgba(201,149,42,0.2), transparent 65%)'
            : 'none',
      }} />

      {/* ── Content ── */}
      <div className="absolute inset-0 flex flex-col justify-between px-7 py-5 z-10">

        {/* Top row */}
        <div className="flex items-center justify-between">
          {mode.tag ? (
            <span className="px-2.5 py-[5px] rounded-full text-[8px] font-black uppercase tracking-[0.13em]"
              style={{
                background: isDuel ? 'rgba(0,210,106,0.1)' : isTournament ? 'rgba(201,149,42,0.1)' : 'rgba(255,255,255,0.06)',
                color: isDuel ? '#00d26a' : isTournament ? '#c9952a' : 'rgba(255,255,255,0.4)',
                border: `1px solid ${isDuel ? 'rgba(0,210,106,0.3)' : isTournament ? 'rgba(201,149,42,0.28)' : 'rgba(255,255,255,0.1)'}`,
              }}>
              {mode.tag}
            </span>
          ) : <span />}

          {mode.playersOnline && (
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
                className="w-1.5 h-1.5 rounded-full bg-brand-green"
                style={{ boxShadow: '0 0 6px rgba(0,210,106,0.95)' }}
              />
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                {mode.playersOnline} {t('playingNow')}
              </span>
            </div>
          )}

          {mode.statusText && (
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ repeat: Infinity, duration: 1.7 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#c9952a', boxShadow: '0 0 6px rgba(201,149,42,0.9)' }}
              />
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#c9952a' }}>
                {mode.statusText}
              </span>
            </div>
          )}
        </div>

        {/* Center: title + subtitle */}
        <div className="flex flex-col items-center text-center">
          <h2
            className="font-display leading-none"
            style={{
              fontSize: isDuel ? '5.8rem' : isTournament ? '4.4rem' : '3.6rem',
              letterSpacing: isDuel ? '0.04em' : '0.06em',
              color: isDuel
                ? '#ffffff'
                : isTournament
                  ? '#f5c518'
                  : 'rgba(255,255,255,0.52)',
              textShadow: isDuel
                ? '0 2px 30px rgba(0,0,0,0.95), 0 0 80px rgba(0,210,106,0.18)'
                : isTournament
                  ? '0 2px 24px rgba(0,0,0,0.92), 0 0 50px rgba(201,149,42,0.32)'
                  : '0 2px 18px rgba(0,0,0,0.9)',
            }}
          >
            {mode.title}
          </h2>
          <p
            className="font-black uppercase leading-none mt-2"
            style={{
              fontSize: '8.5px',
              letterSpacing: '0.22em',
              color: isDuel
                ? 'rgba(0,210,106,0.58)'
                : isTournament
                  ? 'rgba(201,149,42,0.52)'
                  : 'rgba(255,255,255,0.24)',
            }}
          >
            {mode.subtitle}
          </p>
        </div>

        {/* Bottom: CTA button */}
        <motion.button
          whileTap={{ scale: 0.95, y: 1 }}
          onClick={() => {
            const messages: Record<string, { title: string; desc: string }> = {
              duel:        { title: '🎱 Buscando adversário…',  desc: 'Encontrando o melhor oponente para você.' },
              tournaments: { title: '🏆 Inscrição realizada!',  desc: 'Você está na fila para o próximo torneio.' },
              clubs:       { title: '🎳 Entrando no clube…',    desc: 'Carregando sua liga.' },
              training:    { title: '🎯 Modo treino iniciado',  desc: 'Boa prática!' },
            };
            const m = messages[mode.id];
            if (m) toast(m.title, { description: m.desc });
          }}
          className="relative w-full py-[11px] rounded-full font-black text-[11px] uppercase tracking-[0.22em] overflow-hidden"
          style={
            isDuel ? {
              background: 'linear-gradient(180deg, #00e874 0%, #00b850 100%)',
              color: '#000',
              boxShadow: '0 4px 24px rgba(0,210,106,0.44), inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -1.5px 0 rgba(0,0,0,0.16)',
            } : isTournament ? {
              background: 'linear-gradient(180deg, #f5c518 0%, #c9952a 100%)',
              color: '#000',
              boxShadow: '0 4px 24px rgba(201,149,42,0.4), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1.5px 0 rgba(0,0,0,0.14)',
            } : {
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.4)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }
          }
        >
          {(isDuel || isTournament) && (
            <div className="absolute inset-0 pointer-events-none rounded-full"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 55%)' }} />
          )}
          <span className="relative z-10">{mode.buttonText}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
