import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ChevronRight, ChevronLeft, Check,
  User, Wallet, Shield,
  Bell, Globe, CircleHelp, FileText, LogOut,
  Music, Zap, Smartphone, Volume2, VolumeX, Volume1,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage, Language } from '../i18n';
import { cn } from '../lib/utils';

const AudioIcon = Volume2;

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type Screen = 'main' | 'audio' | 'language';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English',   flag: '🇺🇸' },
  { code: 'es', label: 'Español',   flag: '🇪🇸' },
];

const PANEL_BG = {
  background: 'linear-gradient(170deg, #08080e 0%, #050509 100%)',
  borderLeft: '1px solid rgba(255,255,255,0.055)',
  boxShadow: '-12px 0 48px rgba(0,0,0,0.65)',
};

const GLASS_CARD = {
  background: 'rgba(255,255,255,0.036)',
  border: '1px solid rgba(255,255,255,0.055)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.055)',
};

/* ── Slider ─────────────────────────────────────────────────────── */
function Slider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="range" min={0} max={100} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ background: `linear-gradient(to right,#00d26a ${value}%,rgba(255,255,255,0.07) ${value}%)` }}
      className={cn(
        'w-full h-[3px] rounded-full appearance-none cursor-pointer outline-none',
        '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px]',
        '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white',
        '[&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.5),0_0_0_2px_rgba(0,210,106,0.3)]',
        '[&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing',
      )}
    />
  );
}

/* ── Toggle ─────────────────────────────────────────────────────── */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onChange(!value); }}
      className={cn(
        'relative w-[44px] h-[26px] rounded-full shrink-0 transition-colors duration-300',
        value ? 'bg-brand-green' : 'bg-white/[0.10]',
      )}
      style={value ? { boxShadow: '0 0 12px rgba(0,210,106,0.4)' } : undefined}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 700, damping: 40 }}
        className="absolute top-[3px] w-5 h-5 bg-white rounded-full"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.45)' }}
      />
    </button>
  );
}

/* ── Row ─────────────────────────────────────────────────────────── */
function Row({
  iconColor, icon, label, right, onClick, last,
}: {
  iconColor: string;
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onClick?: () => void;
  last?: boolean;
}) {
  return (
    <>
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-[12px] hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors text-left"
      >
        <div
          className={cn('w-[30px] h-[30px] rounded-[9px] flex items-center justify-center shrink-0', iconColor)}
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)' }}
        >
          <span className="[&>svg]:w-[15px] [&>svg]:h-[15px] text-white">{icon}</span>
        </div>
        <span className="flex-1 text-[13.5px] text-white/88 font-medium tracking-[-0.01em]">{label}</span>
        {right !== undefined
          ? right
          : <ChevronRight className="w-[14px] h-[14px] text-white/18 shrink-0" />}
      </button>
      {!last && <div className="h-px bg-white/[0.04] ml-[58px]" />}
    </>
  );
}

/* ── Section ────────────────────────────────────────────────────── */
function Section({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      {label && (
        <p className="text-[9.5px] text-white/28 font-semibold uppercase tracking-[0.12em] px-5 mb-2">{label}</p>
      )}
      <div className="mx-4 rounded-[16px] overflow-hidden" style={GLASS_CARD}>
        {children}
      </div>
    </div>
  );
}

/* ── Sub-screen nav bar ─────────────────────────────────────────── */
function SubNavBar({ title, onBack, backLabel }: { title: string; onBack: () => void; backLabel: string }) {
  return (
    <div
      className="flex items-center px-3 pt-4 pb-3 shrink-0 relative"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,10,4,0.55)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-0.5 text-brand-green text-[13.5px] font-semibold hover:opacity-75 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
        {backLabel}
      </button>
      <span className="absolute left-1/2 -translate-x-1/2 text-white/85 text-[14.5px] font-semibold tracking-[-0.01em]">
        {title}
      </span>
    </div>
  );
}

/* ── Screen transitions ─────────────────────────────────────────── */
const slideIn  = { x: '100%', opacity: 0 };
const visible  = { x: 0,      opacity: 1 };
const slideOut = { x: '-28%', opacity: 0 };

/* ── Main component ─────────────────────────────────────────────── */
export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { t, language, setLanguage } = useLanguage();
  const [screen, setScreen] = useState<Screen>('main');
  const [direction, setDirection] = useState<1 | -1>(1);

  const [masterVol, setMasterVol] = useState(75);
  const [musicVol,  setMusicVol]  = useState(60);
  const [sfxVol,    setSfxVol]    = useState(85);
  const [vibration, setVibration] = useState(true);
  const [notifOn,   setNotifOn]   = useState(true);

  const push = (s: Screen) => { setDirection(1);  setScreen(s); };
  const back = ()           => { setDirection(-1); setScreen('main'); };

  const currentLang = LANGUAGES.find(l => l.code === language)!;
  const VolIcon = masterVol === 0 ? VolumeX : masterVol < 40 ? Volume1 : Volume2;
  const audioLabel = language === 'en' ? 'Sound & Audio' : language === 'es' ? 'Sonido y Audio' : 'Som & Áudio';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="settings-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="absolute inset-0 z-[150]"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}
          />

          {/* Panel */}
          <motion.div
            key="settings-panel"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 330 }}
            className="absolute top-0 right-0 h-full w-[310px] z-[151] flex flex-col overflow-hidden"
            style={PANEL_BG}
          >
            {/* Top shimmer line */}
            <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(0,210,106,0.18), transparent)' }} />

            <AnimatePresence mode="popLayout" initial={false}>

              {/* ════ MAIN ════ */}
              {screen === 'main' && (
                <motion.div
                  key="main"
                  initial={direction === 1 ? slideOut : slideIn}
                  animate={visible}
                  exit={direction === 1 ? slideIn : slideOut}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="absolute inset-0 flex flex-col overflow-hidden"
                >
                  {/* Profile card */}
                  <div className="px-4 pt-5 pb-4 shrink-0">
                    <div className="flex items-center gap-3 p-3.5 rounded-[18px] relative overflow-hidden" style={GLASS_CARD}>
                      {/* Diagonal shine */}
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.045) 0%, transparent 55%)' }} />

                      <div className="relative shrink-0">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                          className="w-[48px] h-[48px] rounded-full bg-[#0a1e0e]"
                          style={{ border: '1.5px solid rgba(0,210,106,0.22)', boxShadow: '0 0 18px rgba(0,210,106,0.2)' }}
                        />
                        <div
                          className="absolute -bottom-1 -right-1 text-black text-[7.5px] font-black px-1.5 py-0.5 rounded-[5px] leading-none"
                          style={{
                            background: 'linear-gradient(135deg, #00e870, #00b848)',
                            boxShadow: '0 2px 6px rgba(0,200,100,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                            border: '1.5px solid rgba(0,0,0,0.25)',
                          }}
                        >
                          12
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 relative">
                        <p className="text-white/92 font-semibold text-[14.5px] tracking-[-0.01em] truncate">João Silva</p>
                        <p className="text-white/32 text-[11px] mt-0.5 font-medium">Pro · #4521</p>
                      </div>

                      <button
                        onClick={onClose}
                        className="w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0 relative hover:bg-white/[0.09] transition-colors"
                        style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        <X className="w-3 h-3 text-white/45" />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable */}
                  <div className="flex-1 overflow-y-auto no-scrollbar pb-2">

                    <Section label={language === 'en' ? 'Account' : language === 'es' ? 'Cuenta' : 'Conta'}>
                      <Row iconColor="bg-blue-500/20"    icon={<User />}   label={t('settingsMyAccount')} onClick={() => push('main')} />
                      <Row iconColor="bg-brand-green/18" icon={<Wallet />} label={t('settingsFinancial')} onClick={() => push('main')} />
                      <Row iconColor="bg-purple-500/20"  icon={<Shield />} label={t('settingsPrivacy')}   onClick={() => push('main')} last />
                    </Section>

                    <Section>
                      <Row
                        iconColor="bg-orange-500/20"
                        icon={<AudioIcon />}
                        label={audioLabel}
                        right={
                          <div className="flex items-center gap-1.5">
                            <VolIcon className="w-3.5 h-3.5 text-white/25" />
                            <ChevronRight className="w-[14px] h-[14px] text-white/18" />
                          </div>
                        }
                        onClick={() => push('audio')}
                      />
                      <Row
                        iconColor="bg-red-500/20"
                        icon={<Bell />}
                        label={t('settingsNotifications')}
                        right={<Toggle value={notifOn} onChange={setNotifOn} />}
                        last
                      />
                    </Section>

                    <Section>
                      <Row
                        iconColor="bg-sky-500/20"
                        icon={<Globe />}
                        label={t('settingsLanguage')}
                        right={
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-white/28 font-medium">{currentLang.flag} {currentLang.label}</span>
                            <ChevronRight className="w-[14px] h-[14px] text-white/18" />
                          </div>
                        }
                        onClick={() => push('language')}
                      />
                      <Row iconColor="bg-white/[0.07]" icon={<CircleHelp />} label={t('settingsSupport')} />
                      <Row iconColor="bg-white/[0.07]" icon={<FileText />}   label={t('settingsTerms')} last />
                    </Section>

                    <div className="mx-4 mb-5">
                      <button
                        onClick={() => { toast.error('Sessão encerrada'); onClose(); }}
                        className="w-full py-[12px] rounded-[16px] text-red-400/90 text-[13.5px] font-semibold flex items-center justify-center gap-2 hover:bg-red-500/[0.08] transition-colors"
                        style={{
                          background: 'rgba(220,38,38,0.05)',
                          border: '1px solid rgba(220,38,38,0.18)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        {t('settingsLogout')}
                      </button>
                    </div>

                    <p className="text-[9.5px] text-white/12 text-center pb-5 font-medium tracking-wide">
                      Snooker Ace {t('settingsVersion')} 1.0.0
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ════ AUDIO ════ */}
              {screen === 'audio' && (
                <motion.div
                  key="audio"
                  initial={direction === 1 ? slideIn : slideOut}
                  animate={visible}
                  exit={direction === 1 ? slideOut : slideIn}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="absolute inset-0 flex flex-col overflow-hidden"
                >
                  <SubNavBar title={audioLabel} onBack={back} backLabel={t('settings')} />

                  <div className="flex-1 overflow-y-auto no-scrollbar pt-5">

                    <Section>
                      <div className="px-4 py-3.5 border-b border-white/[0.04]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-[30px] h-[30px] rounded-[9px] bg-orange-500/20 flex items-center justify-center"
                              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)' }}>
                              <Volume2 className="w-[15px] h-[15px] text-white" />
                            </div>
                            <span className="text-[13.5px] text-white/88 font-medium tracking-[-0.01em]">
                              {language === 'en' ? 'Master' : language === 'es' ? 'General' : 'Geral'}
                            </span>
                          </div>
                          <span className="text-[13px] text-brand-green font-bold tabular-nums">{masterVol}</span>
                        </div>
                        <Slider value={masterVol} onChange={setMasterVol} />
                      </div>

                      <div className="px-4 py-3.5 border-b border-white/[0.04]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-[30px] h-[30px] rounded-[9px] bg-pink-500/20 flex items-center justify-center"
                              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)' }}>
                              <Music className="w-[15px] h-[15px] text-white" />
                            </div>
                            <span className="text-[13.5px] text-white/88 font-medium tracking-[-0.01em]">
                              {language === 'en' ? 'Music' : 'Música'}
                            </span>
                          </div>
                          <span className="text-[13px] text-brand-green font-bold tabular-nums">{musicVol}</span>
                        </div>
                        <Slider value={musicVol} onChange={setMusicVol} />
                      </div>

                      <div className="px-4 py-3.5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-[30px] h-[30px] rounded-[9px] bg-yellow-500/20 flex items-center justify-center"
                              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)' }}>
                              <Zap className="w-[15px] h-[15px] text-white" />
                            </div>
                            <span className="text-[13.5px] text-white/88 font-medium tracking-[-0.01em]">
                              {language === 'en' ? 'Sound FX' : language === 'es' ? 'Efectos' : 'Efeitos'}
                            </span>
                          </div>
                          <span className="text-[13px] text-brand-green font-bold tabular-nums">{sfxVol}</span>
                        </div>
                        <Slider value={sfxVol} onChange={setSfxVol} />
                      </div>
                    </Section>

                    <Section>
                      <Row
                        iconColor="bg-white/[0.08]"
                        icon={<Smartphone />}
                        label={language === 'en' ? 'Vibration' : language === 'es' ? 'Vibración' : 'Vibração'}
                        right={<Toggle value={vibration} onChange={setVibration} />}
                        last
                      />
                    </Section>
                  </div>
                </motion.div>
              )}

              {/* ════ LANGUAGE ════ */}
              {screen === 'language' && (
                <motion.div
                  key="language"
                  initial={direction === 1 ? slideIn : slideOut}
                  animate={visible}
                  exit={direction === 1 ? slideOut : slideIn}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="absolute inset-0 flex flex-col overflow-hidden"
                >
                  <SubNavBar title={t('settingsLanguage')} onBack={back} backLabel={t('settings')} />

                  <div className="flex-1 overflow-y-auto no-scrollbar pt-5">
                    <Section>
                      {LANGUAGES.map((lang, i) => (
                        <React.Fragment key={lang.code}>
                          <button
                            onClick={() => {
                              setLanguage(lang.code);
                              toast(`${lang.flag} ${lang.label}`, {
                                description: { pt: 'Idioma alterado.', en: 'Language changed.', es: 'Idioma cambiado.' }[lang.code],
                              });
                              back();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-[14px] hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors"
                          >
                            <span className="text-[22px] leading-none">{lang.flag}</span>
                            <span className="flex-1 text-[13.5px] text-white/88 font-medium tracking-[-0.01em]">{lang.label}</span>
                            {language === lang.code && (
                              <Check className="w-[15px] h-[15px] text-brand-green shrink-0" strokeWidth={2.5} />
                            )}
                          </button>
                          {i < LANGUAGES.length - 1 && <div className="h-px bg-white/[0.04] ml-[60px]" />}
                        </React.Fragment>
                      ))}
                    </Section>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
