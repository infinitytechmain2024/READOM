import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import { AuthHeading, AuthInput, PasswordInput, AuthSubmit, OrDivider, SocialButton } from '@/components/auth/AuthControls';
import {
  FacebookIcon, LinkedInIcon, GoogleIcon, TelegramIcon, ViberIcon, WhatsAppIcon,
} from '@/components/auth/brandIcons';

const Login = () => {
  const { t } = useTranslation();

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

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <AuthInput type="email" placeholder={t('auth.username')} autoComplete="email" />
        <PasswordInput placeholder={t('auth.password')} autoComplete="current-password" />
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
