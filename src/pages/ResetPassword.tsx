import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Check, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { AuthHeading, AuthInput, PasswordInput, AuthSubmit, OrDivider, SocialButton } from '@/components/auth/AuthControls';
import { GoogleIcon, TelegramIcon, ViberIcon, WhatsAppIcon } from '@/components/auth/brandIcons';
import { passwordRules, isPasswordValid } from '@/lib/passwordRules';
import { getPasswordBreachCount } from '@/lib/passwordBreach';
import { isValidEmail } from '@/lib/validators';
import { usePasswordBreach } from '@/hooks/usePasswordBreach';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const rulesValid = isPasswordValid(password);
  const breach = usePasswordBreach(password, rulesValid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isValidEmail(email)) {
      setFormError(t('auth.invalidEmail'));
      return;
    }
    if (!rulesValid) {
      setFormError(t('auth.fixPasswordRules'));
      return;
    }

    // Authoritative breach check on submit (k-anonymity — the password never
    // leaves the device intact).
    setSubmitting(true);
    try {
      const count = await getPasswordBreachCount(password);
      if (count > 0) {
        setFormError(t('auth.breachFound', { count }));
        return;
      }
      // TODO(backend): call the password-reset endpoint with the new password.
    } catch {
      setFormError(t('auth.breachCheckError'));
      return;
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

  return (
    <AuthLayout active="login">
      <AuthHeading>{t('auth.resetTitle')}</AuthHeading>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AuthInput
          type="email"
          placeholder={t('auth.email')}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          placeholder={t('auth.confirmPassword')}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* password requirement checklist */}
        <ul className="space-y-2 py-1">
          {passwordRules.map((rule) => {
            const met = rule.test(password);
            return (
              <li
                key={rule.key}
                className={`flex items-center gap-3 text-sm transition-colors ${met ? 'text-[#FFCC18]' : 'text-white/85'}`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border transition-colors ${met ? 'border-[#FFCC18] bg-[#FFCC18]' : 'border-white/50'}`}
                >
                  {met && <Check className="h-3 w-3 text-black" />}
                </span>
                {t(rule.key)}
              </li>
            );
          })}
        </ul>

        {/* breach check status (HIBP k-anonymity) */}
        {breach.state === 'checking' && (
          <p className="flex items-center gap-2 text-sm text-white/70">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('auth.breachChecking')}
          </p>
        )}
        {breach.state === 'safe' && (
          <p className="flex items-center gap-2 text-sm text-[#FFCC18]">
            <ShieldCheck className="h-4 w-4" />
            {t('auth.breachSafe')}
          </p>
        )}
        {breach.state === 'breached' && (
          <p className="flex items-center gap-2 text-sm text-red-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            {t('auth.breachFound', { count: breach.count })}
          </p>
        )}

        {formError && (
          <p className="flex items-center gap-2 text-sm text-red-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            {formError}
          </p>
        )}

        <AuthSubmit disabled={submitting}>
          {submitting ? t('auth.breachChecking') : t('auth.registerBtn')}
        </AuthSubmit>
      </form>

      <p className="mt-5 text-center text-sm text-white/75">
        {t('auth.haveAccount')}{' '}
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
