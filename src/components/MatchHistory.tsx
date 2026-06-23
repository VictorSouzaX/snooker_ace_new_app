import React from 'react';
import { motion } from 'motion/react';
import { History, Trophy, User, Check, X } from 'lucide-react';
import { useLanguage } from '../i18n';

interface Match {
  id: string;
  game: string;
  dateKey: 'today' | 'yesterday' | string;
  result: 'win' | 'loss';
  profit: string;
  opponent: string;
  time: string;
}

const MATCHES: Match[] = [
  { id: '1', game: 'Bola 8',    dateKey: 'today',     time: '14:30', result: 'win',  profit: 'R$ 5,00',  opponent: 'Lucas M.' },
  { id: '2', game: 'Bolinho',   dateKey: 'yesterday', time: '18:15', result: 'loss', profit: '-R$ 2,50', opponent: 'Maria G.' },
  { id: '3', game: 'Par e Ímpar', dateKey: 'yesterday', time: '12:00', result: 'win', profit: 'R$ 10,00', opponent: 'Carlos R.' },
  { id: '4', game: 'Sinuca',    dateKey: '08 DE JUN', time: '20:45', result: 'win',  profit: 'R$ 15,00', opponent: 'Ana P.' },
];

export default function MatchHistory() {
  const { t } = useLanguage();

  const resolveDate = (dateKey: string) => {
    if (dateKey === 'today') return t('today');
    if (dateKey === 'yesterday') return t('yesterday');
    return dateKey;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-6 p-8"
    >
      {/* Period Filter & Stats Summary */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">{t('overview')}</h3>
          <div className="flex bg-black border border-white/5 rounded-full p-1 shadow-2xl">
            {([['days7', t('days7')], ['days30', t('days30')], ['total', t('total')]] as [string, string][]).map(([key, label], i) => (
              <button
                key={key}
                className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-brand-green text-black shadow-[0_0_15px_rgba(0,210,106,0.3)]' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={<History className="text-white/40" />}
            label={t('matches')}
            value="86"
            subValue={t('matchesPlayed')}
          />
          <StatCard
            icon={<Check className="text-brand-green" strokeWidth={3} />}
            label={t('wins')}
            value="52"
            subValue={`60${t('winRate')}`}
            accentColor="rgba(0, 210, 106, 0.15)"
          />
          <StatCard
            icon={<X className="text-red-500" strokeWidth={3} />}
            label={t('losses')}
            value="34"
            subValue={`40${t('lossRate')}`}
            accentColor="rgba(239, 68, 68, 0.15)"
          />
        </div>
      </div>

      {/* Match List */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">{t('recentMatches')}</h3>

        {MATCHES.map((match, index) => {
          const isWin = match.result === 'win';
          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.08) }}
              className="group flex flex-col bg-[#050505] border border-white/[0.03] rounded-[32px] overflow-hidden hover:border-white/10 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] cursor-pointer"
            >
              <div className="flex items-center justify-between px-8 py-4 border-b border-white/[0.01] bg-white/[0.005]">
                <div className="flex items-center gap-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${isWin ? 'bg-brand-green shadow-[0_0_8px_rgba(0,210,106,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
                  <span className="text-[12px] font-black text-white/60 tracking-[0.3em] uppercase">{match.game}</span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em]">{resolveDate(match.dateKey)} • {match.time}</span>
                </div>
                <div className={`text-[13px] font-black tracking-tight ${isWin ? 'text-brand-green' : 'text-red-500'}`}>
                  {isWin ? '+' : ''}{match.profit}
                </div>
              </div>

              <div className="flex items-center justify-between p-8 relative">
                {/* Player Info (You) */}
                <div className="flex items-center gap-6 flex-1">
                  <div className="relative group/avatar">
                    <div className={`w-16 h-16 rounded-full bg-zinc-900 border p-0.5 transition-all duration-500 group-hover/avatar:scale-105 ${isWin ? 'border-brand-green/40 shadow-[0_0_40px_rgba(0,210,106,0.15)]' : 'border-white/[0.05]'}`}>
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Joao"
                        alt="João Silva"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-[#050505] flex items-center justify-center ${isWin ? 'bg-brand-green shadow-[0_0_10px_rgba(0,210,106,0.4)]' : 'bg-red-500'}`}>
                      {isWin ? <Trophy className="w-2.5 h-2.5 text-black" /> : <X className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5">{t('you')}</span>
                    <span className="text-lg font-black text-white tracking-tighter">JOÃO SILVA</span>
                  </div>
                </div>

                {/* VS Central Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-black border border-white/[0.08] flex items-center justify-center text-[13px] font-black text-white/20 italic tracking-tighter shadow-3xl">VS</div>
                  <div className={`text-[9px] font-black uppercase tracking-[0.35em] px-5 py-2 rounded-full border transition-all duration-500 shadow-lg ${isWin ? 'text-brand-green bg-brand-green/10 border-brand-green/30 shadow-brand-green/10' : 'text-red-500 bg-red-500/10 border-red-500/30 shadow-red-500/10'}`}>
                    {isWin ? t('victory') : t('defeat')}
                  </div>
                </div>

                {/* Opponent Info */}
                <div className="flex items-center gap-6 flex-1 justify-end text-right">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5">{t('opponent')}</span>
                    <span className="text-lg font-black text-white tracking-tighter">{match.opponent.toUpperCase()}</span>
                  </div>
                  <div className="relative group/avatar">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/[0.05] p-0.5 transition-transform duration-500 group-hover/avatar:scale-105">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${match.opponent}`}
                        alt={match.opponent}
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-[#050505] flex items-center justify-center bg-zinc-800">
                      <User className="w-2.5 h-2.5 text-white/40" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, subValue, accentColor = "rgba(255, 255, 255, 0.05)" }: { icon: React.ReactNode, label: string, value: string, subValue: string, accentColor?: string }) {
  return (
    <div className="bg-[#050505] border border-white/[0.03] rounded-[32px] p-7 flex flex-col gap-5 relative overflow-hidden group transition-all duration-500 shadow-2xl hover:border-white/10 hover:shadow-brand-green/5">
      <div className="flex items-center justify-between z-10">
        <div className="p-3.5 bg-white/[0.02] rounded-[20px] border border-white/[0.03] transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: accentColor }}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' }) : icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white/60 transition-all duration-500">{label}</span>
      </div>
      <div className="z-10 flex flex-col">
        <div className="text-5xl font-black text-white leading-none tracking-tighter mb-2">{value}</div>
        <div className="text-[12px] font-bold text-white/60 uppercase tracking-[0.15em] group-hover:text-white/80 transition-colors">{subValue}</div>
      </div>
      <div
        className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-all duration-700 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}
