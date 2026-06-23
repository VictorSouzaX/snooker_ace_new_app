import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '../i18n';

type Mode = "login" | "register";

interface LoginScreenProps {
  onLogin: () => void;
}

const InputField = ({ label, type = "text", ...props }: any) => (
  <div className="relative w-full group">
    <input
      type={type}
      className="w-full bg-white/[0.04] border border-white/5 hover:bg-white/[0.06] rounded-2xl px-5 py-4 text-white text-sm font-medium transition-all focus:outline-none focus:ring-1 focus:ring-brand-green/30 focus:border-brand-green/50 placeholder-white/30"
      {...props}
    />
  </div>
);

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>("login");
  const [registerStep, setRegisterStep] = useState(1);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formatCPF = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const formatDate = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 8)
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2");

  const nextStep = () => {
    setError("");
    if (registerStep === 1) {
      if (!name || !email) {
        setError(t('errorStep1'));
        return;
      }
      setRegisterStep(2);
    } else if (registerStep === 2) {
      if (!document || !birthDate) {
        setError(t('errorStep2'));
        return;
      }
      setRegisterStep(3);
    }
  };

  const prevStep = () => {
    setError("");
    setRegisterStep((prev) => Math.max(1, prev - 1));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 800);
    } catch {
      setError(t('errorLoginFields'));
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!termsAccepted) {
      setError(t('errorTerms'));
      return;
    }
    setIsLoading(true);
    try {
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 800);
    } catch {
      setError(t('errorRegister'));
      setIsLoading(false);
    }
  };

  const toggleMode = (newMode: Mode) => {
    if (mode === newMode) return;
    setMode(newMode);
    setError("");
    setRegisterStep(1);
  };

  return (
    <motion.div
      key="login-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 z-50 flex overflow-hidden bg-black font-sans selection:bg-brand-green/30"
    >
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] max-w-[600px] max-h-[600px] bg-brand-green/20 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-[#008A45]/20 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Left side: Branding */}
      <div className="relative z-10 hidden md:flex flex-1 flex-col items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center justify-center group"
        >
          <motion.img
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            src="/Logo bola 8.png"
            alt="8 Ball Mascot"
            className="w-40 h-40 object-contain drop-shadow-[0_0_40px_rgba(0,210,106,0.2)] mb-8 transition-transform duration-700 group-hover:scale-105"
          />
          <img
            src="/snooker ace - Escrita vetor.svg"
            alt="Snooker Ace"
            className="w-72 max-w-full drop-shadow-[0_0_15px_rgba(0,210,106,0.3)] transition-all duration-700 group-hover:drop-shadow-[0_0_25px_rgba(0,210,106,0.5)]"
          />
          <p className="mt-6 text-white/40 text-xs font-semibold tracking-[0.3em] uppercase">{t('tagline')}</p>
        </motion.div>
      </div>

      {/* Right side: Login Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.1 }}
        className="relative z-20 w-full md:w-[460px] bg-black/60 backdrop-blur-3xl border-l border-white/5 shadow-[-30px_0_80px_rgba(0,0,0,0.6)] flex flex-col overflow-y-auto"
      >
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 py-10 min-h-fit">
          {/* Mobile Only Logo */}
          <div className="md:hidden flex flex-col items-center justify-center mb-8">
            <img src="/Logo bola 8.png" alt="8 Ball" className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(0,210,106,0.3)] mb-4" />
            <img src="/snooker ace - Escrita vetor.svg" alt="Snooker Ace" className="w-32 drop-shadow-[0_0_15px_rgba(0,210,106,0.2)]" />
          </div>

          {/* Segmented Control */}
          <motion.div layout className="relative flex p-1 mb-8 bg-white/5 rounded-2xl backdrop-blur-md shrink-0">
            <motion.div
              layoutId="active-pill"
              className="absolute inset-y-1 w-[calc(50%-4px)] bg-white/10 rounded-xl shadow-sm"
              initial={false}
              animate={{ left: mode === "login" ? "4px" : "calc(50%)" }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
            <button
              onClick={() => toggleMode("login")}
              className={`relative z-10 flex-1 py-3 text-sm font-semibold transition-colors duration-300 ${
                mode === "login" ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => toggleMode("register")}
              className={`relative z-10 flex-1 py-3 text-sm font-semibold transition-colors duration-300 ${
                mode === "register" ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {t('register')}
            </button>
          </motion.div>

          {/* Form Area */}
          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="flex flex-col space-y-4 h-full justify-center"
                >
                  <InputField
                    type="text"
                    placeholder={t('username')}
                    value={username}
                    onChange={(e: any) => setUsername(e.target.value)}
                    required
                  />
                  <InputField
                    type="password"
                    placeholder={t('password')}
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    required
                  />

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs text-center font-medium">
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 bg-brand-green/90 hover:bg-brand-green text-black font-bold text-sm py-4 rounded-2xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isLoading ? t('signingIn') : t('enterGame')}
                  </motion.button>

                  <button type="button" className="mt-4 text-white/40 hover:text-white/80 text-xs font-medium transition-colors text-center w-full">
                    {t('forgotPassword')}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="register-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleRegister}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-6 px-1 shrink-0">
                    <div className="flex gap-2 w-full">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-in-out ${
                            step === registerStep
                              ? "bg-brand-green"
                              : step < registerStep
                                ? "bg-brand-green/30"
                                : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {registerStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col space-y-4"
                        >
                          <InputField
                            type="text"
                            placeholder={t('fullName')}
                            value={name}
                            onChange={(e: any) => setName(e.target.value)}
                          />
                          <InputField
                            type="email"
                            placeholder={t('email')}
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                          />
                        </motion.div>
                      )}

                      {registerStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col space-y-4"
                        >
                          <div>
                            <InputField
                              type="text"
                              placeholder={t('cpf')}
                              value={document}
                              onChange={(e: any) => setDocument(formatCPF(e.target.value))}
                            />
                            <p className="text-white/30 text-[10px] mt-2 ml-2">{t('cpfHint')}</p>
                          </div>
                          <InputField
                            type="text"
                            placeholder={t('birthDate')}
                            value={birthDate}
                            onChange={(e: any) => setBirthDate(formatDate(e.target.value))}
                          />
                        </motion.div>
                      )}

                      {registerStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col space-y-4"
                        >
                          <InputField
                            type="text"
                            placeholder={t('usernameField')}
                            value={username}
                            onChange={(e: any) => setUsername(e.target.value)}
                          />
                          <InputField
                            type="password"
                            placeholder={t('password')}
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                          />

                          <div className="flex items-start gap-3 mt-2 px-1">
                            <button
                              type="button"
                              onClick={() => setTermsAccepted(!termsAccepted)}
                              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                termsAccepted ? "bg-brand-green border-brand-green" : "border-white/20 bg-white/5"
                              }`}
                            >
                              {termsAccepted && <Check className="w-3.5 h-3.5 text-black" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => setTermsAccepted(!termsAccepted)}
                              className="text-left text-white/50 text-xs leading-relaxed"
                            >
                              {t('terms')} <span className="text-brand-green">{t('termsLink')}</span> {t('andThe')} <span className="text-brand-green">{t('privacyLink')}</span>.
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs text-center font-medium mt-4 shrink-0">
                      {error}
                    </motion.p>
                  )}

                  <div className="flex gap-3 mt-6 shrink-0">
                    {registerStep > 1 && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={prevStep}
                        className="w-14 shrink-0 bg-white/5 hover:bg-white/10 text-white rounded-2xl flex items-center justify-center transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </motion.button>
                    )}

                    {registerStep < 3 ? (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={nextStep}
                        className="flex-1 bg-white/10 hover:bg-white/15 text-white font-bold text-sm py-4 rounded-2xl transition-all flex justify-center items-center gap-2"
                      >
                        {t('next')} <ChevronRight className="w-4 h-4 ml-1" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-brand-green/90 hover:bg-brand-green text-black font-bold text-sm py-4 rounded-2xl transition-all disabled:opacity-50 flex justify-center items-center"
                      >
                        {isLoading ? t('finishing') : t('finishRegister')}
                      </motion.button>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
