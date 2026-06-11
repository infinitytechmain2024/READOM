import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Loader2, Mail, ShieldAlert } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { AuthHeading, AuthInput, AuthSubmit, OrDivider, SocialButton } from '@/components/auth/AuthControls';
import { GoogleIcon, TelegramIcon, ViberIcon, WhatsAppIcon } from '@/components/auth/brandIcons';
import { isValidEmail } from '@/lib/validators';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!isValidEmail(email)) { setFormError(t('auth.invalidEmail')); return; }

    setSubmitting(true);
    try {
      const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) { setFormError(error.message); return; }
      setSent(true);
    } catch {
      setFormError(t('auth.errGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  const providers = [
    { icon: <GoogleIcon />, name: 'Google' },
    { icon: <TelegramIcon />, name: 'Telegram' },
    { icon: <ViberIcon />, name: 'Viber' },
    { icon: <WhatsAppIcon />, name: 'WhatsApp' },
  ];

  if (sent) {
    return (
      <AuthLayout active="login">
        <div className="flex flex-col items-center gap-5 py-4">
          <Mail className="h-14 w-14 text-primary" />
          <AuthHeading>{t('auth.checkEmailTitle')}</AuthHeading>
          <p className="text-center text-sm text-white/75 max-w-xs">
            {t('auth.checkEmailResetBody', { email })}
          </p>
          <p className="text-center text-xs text-white/50">{t('auth.checkEmailHint')}</p>
          <Link to="/auth" className="text-sm font-semibold text-primary hover:underline">
            {t('auth.backToLogin')}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout active="login">
      <AuthHeading>{t('auth.forgotTitle')}</AuthHeading>
      <p className="text-center text-sm text-white/75 mb-4">{t('auth.forgotSubtitle')}</p>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AuthInput
          type="email"
          placeholder={t('auth.email')}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {formError && (
          <p className="flex items-center gap-2 text-sm text-red-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            {formError}
          </p>
        )}

        <AuthSubmit disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : null}
          {t('auth.sendResetLink')}
        </AuthSubmit>
      </form>

      <p className="mt-5 text-center text-sm text-white/75">
        {t('auth.rememberPassword')}{' '}
        <Link to="/auth" className="font-bold text-white hover:text-primary transition-colors">
          {t('auth.signIn')}
        </Link>
      </p>

      <OrDivider />

      <div className="space-y-3">
        {providers.map((p) => (
          <SocialButton key={p.name} icon={p.icon} label={`${t('auth.resetWith')} ${p.name}`} />
        ))}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
