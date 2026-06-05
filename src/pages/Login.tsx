import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { AuthHeading, AuthInput, PasswordInput, AuthSubmit, OrDivider, SocialButton } from '@/components/auth/AuthControls';
import {
  FacebookIcon, LinkedInIcon, GoogleIcon, TelegramIcon, ViberIcon, WhatsAppIcon,
} from '@/components/auth/brandIcons';
import { isValidEmail } from '@/lib/validators';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isValidEmail(email)) {
      setFormError(t('auth.invalidEmail'));
      return;
    }
    if (!password) {
      setFormError(t('auth.passwordRequired'));
      return;
    }

    // TODO(backend): call sign-in endpoint with the validated credentials.
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
    <AuthLayout active="login">
      <AuthHeading>{t('auth.loginTitle')}</AuthHeading>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AuthInput
          type="email"
          placeholder={t('auth.username')}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          placeholder={t('auth.password')}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {formError && (
          <p className="flex items-center gap-2 text-sm text-red-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            {formError}
          </p>
        )}

        <AuthSubmit>{t('auth.loginBtn')}</AuthSubmit>
      </form>

      <div className="mt-5 space-y-1.5 text-center text-sm text-white/75">
        <p>
          {t('auth.forgotPassword')}{' '}
          <Link to="/reset-password" className="font-bold text-white hover:text-primary transition-colors">
            {t('auth.changePassword')}
          </Link>
        </p>
        <p>
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-bold text-white hover:text-primary transition-colors">
            {t('auth.register')}
          </Link>
        </p>
      </div>

      <OrDivider />

      <div className="space-y-3">
        {providers.map((p) => (
          <SocialButton key={p.name} icon={p.icon} label={`${t('auth.loginWith')} ${p.name}`} />
        ))}
      </div>
    </AuthLayout>
  );
};

export default Login;
