import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { AuthHeading, AuthInput, PasswordInput, AuthSubmit, OrDivider, SocialButton } from '@/components/auth/AuthControls';
import {
  FacebookIcon, LinkedInIcon, GoogleIcon, TelegramIcon, ViberIcon, WhatsAppIcon,
} from '@/components/auth/brandIcons';
import { passwordRules, isPasswordValid } from '@/lib/passwordRules';
import { getPasswordBreachCount } from '@/lib/passwordBreach';
import { isValidEmail } from '@/lib/validators';
import { usePasswordBreach } from '@/hooks/usePasswordBreach';
import { usePasswordMatch } from '@/hooks/usePasswordMatch';
import { registerUser, EmailTakenError } from '@/integrations/localdb';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const rulesValid = isPasswordValid(password);
  // Only check breaches once the password satisfies the local rules.
  const breach = usePasswordBreach(password, rulesValid);
  const match = usePasswordMatch(password, confirm);

  // Validate the password when the user presses "Register".
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError(t('auth.nameRequired'));
      return;
    }
    if (!isValidEmail(email)) {
      setFormError(t('auth.invalidEmail'));
      return;
    }
    if (!rulesValid) {
      setFormError(t('auth.fixPasswordRules'));
      return;
    }
    if (match.state !== 'match') {
      setFormError(t('auth.passwordMismatch'));
      return;
    }
    if (!agreed) {
      setFormError(t('auth.mustAgree'));
      return;
    }

    // Authoritative breach check on submit (the inline one is debounced and may
    // not have resolved yet). The password never leaves the device intact.
    setSubmitting(true);
    try {
      const count = await getPasswordBreachCount(password);
      if (count > 0) {
        setFormError(t('auth.breachFound', { count }));
        return;
      }
    } catch {
      setFormError(t('auth.breachCheckError'));
      setSubmitting(false);
      return;
    }

    // All checks passed — persist the account in the local database.
    // TODO(backend): replace with the real sign-up endpoint.
    try {
      await registerUser({ email, fullName, password });
      navigate('/auth');
    } catch (err) {
      if (err instanceof EmailTakenError) {
        setFormError(t('auth.emailTaken'));
      } else {
        setFormError(t('auth.errGeneric'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const providers = [
    { icon: <FacebookIcon />, name: 'Facebook' },
    { icon: <LinkedInIcon />, name: 'LinkedIn' },
    { icon: <GoogleIcon />, name: 'Google' },
    { icon: <TelegramIcon />, name: 'Telegram' },
    { icon: <ViberIcon />, name: 'Viber' },
    { icon: <WhatsAppIcon />, name: 'WhatsApp' },
  ];

  return (
    <AuthLayout active="register">
      <AuthHeading>{t('auth.registerTitle')}</AuthHeading>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AuthInput
          type="text"
          placeholder={t('auth.fullName')}
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <AuthInput
          type="email"
          placeholder={t('auth.email')}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          placeholder={t('auth.password')}
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

        <PasswordInput
          placeholder={t('auth.confirmPassword')}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {/* confirm-password match status */}
        {match.state === 'mismatch' && (
          <p className="flex items-center gap-2 text-sm text-red-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            {t('auth.passwordMismatch')}
          </p>
        )}
        {match.state === 'match' && (
          <p className="flex items-center gap-2 text-sm text-[#FFCC18]">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            {t('auth.passwordMatch')}
          </p>
        )}

        {/* agreement */}
        <label className="flex items-start gap-3 text-sm text-white/85 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border transition-colors ${agreed ? 'border-[#FFCC18] bg-[#FFCC18]' : 'border-white'}`}
          >
            {agreed && <Check className="h-3.5 w-3.5 text-black" />}
          </span>
          <span>
            {t('auth.agreePrefix')}{' '}
            <b className="font-bold italic text-white">{t('auth.policyUse')}</b> {t('auth.and')}{' '}
            <b className="font-bold italic text-white">{t('auth.policyPrivacy')}</b>
          </span>
        </label>

        {/* form-level error shown after pressing Register */}
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
          <SocialButton key={p.name} icon={p.icon} label={`${t('auth.registerWith')} ${p.name}`} />
        ))}
      </div>
    </AuthLayout>
  );
};

export default Register;
