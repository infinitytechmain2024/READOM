import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import authBg from '@/assets/auth-library.png';

type Tab = 'login' | 'register';

const TabLink = ({ to, label, isActive }: { to: string; label: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`relative px-6 py-3 text-base sm:text-lg font-bold transition-colors ${
      isActive ? 'text-primary' : 'text-white/80 hover:text-white'
    }`}
  >
    {isActive && (
      <>
        <span className="pointer-events-none absolute -left-5 -top-2 h-6 w-12 border-l-2 border-t-2 border-primary" />
        <span className="pointer-events-none absolute -right-5 -bottom-2 h-6 w-12 border-r-2 border-b-2 border-primary" />
      </>
    )}
    {label}
  </Link>
);

const AuthLayout = ({ active, children }: { active: Tab; children: ReactNode }) => {
  const { t } = useTranslation();

  return (
    <div className="dark min-h-screen flex flex-col bg-background">
      <div className="relative flex-1">
        {/* background */}
        <img src={authBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />

        {/* content */}
        <div className="relative container mx-auto px-4 py-10">
          <Link to="/" className="flex items-center justify-center gap-2 mb-12 text-primary">
            <Logo className="h-10 w-[21px]" />
            <span className="text-2xl font-bold">{t('brand')}</span>
          </Link>

          <div className="flex items-center justify-center gap-10 sm:gap-20 mb-14">
            <TabLink to="/auth" label={t('auth.tabLogin')} isActive={active === 'login'} />
            <TabLink to="/register" label={t('auth.tabRegister')} isActive={active === 'register'} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto w-full max-w-2xl pb-16"
          >
            {children}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthLayout;
