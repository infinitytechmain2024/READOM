import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Loader2, Mail } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { AuthHeading } from '@/components/auth/AuthControls';
import { supabase } from '@/integrations/supabase/client';

const RegisterConfirm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? '';
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const resend = async () => {
    if (resendState !== 'idle' || !email) return;
    setResendState('sending');
    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`;
    await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: redirectTo } });
    setResendState('sent');
    setTimeout(() => setResendState('idle'), 6000);
  };

  return (
    <AuthLayout active="register">
      <div className="flex flex-col items-center gap-5 py-4">
        <Mail className="h-14 w-14 text-primary" />
        <AuthHeading>{t('auth.checkEmailTitle')}</AuthHeading>
        <p className="text-center text-sm text-white/75 max-w-xs">
          {t('auth.checkEmailRegisterBody', { email: email || t('auth.email') })}
        </p>
        <p className="text-center text-xs text-white/50">{t('auth.checkEmailHint')}</p>

        <button
          onClick={resend}
          disabled={resendState !== 'idle'}
          className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline disabled:opacity-60 transition-opacity"
        >
          {resendState === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
          {resendState === 'idle' && t('auth.resend')}
          {resendState === 'sending' && t('auth.resending')}
          {resendState === 'sent' && t('auth.resent')}
        </button>

        <Link to="/auth" className="text-sm text-white/75 hover:text-white transition-colors">
          {t('auth.backToLogin')}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterConfirm;
