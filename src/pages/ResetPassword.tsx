import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import { AuthHeading, AuthInput, PasswordInput, AuthSubmit, OrDivider, SocialButton } from '@/components/auth/AuthControls';
import { GoogleIcon, TelegramIcon, ViberIcon, WhatsAppIcon } from '@/components/auth/brandIcons';

const ResetPassword = () => {
  const { t } = useTranslation();

  const providers = [
    { icon: <GoogleIcon />, name: 'Google' },
    { icon: <TelegramIcon />, name: 'Telegram' },
    { icon: <ViberIcon />, name: 'Viber' },
    { icon: <WhatsAppIcon />, name: 'WhatsApp' },
  ];

  return (
    <AuthLayout active="login">
      <AuthHeading>{t('auth.resetTitle')}</AuthHeading>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <AuthInput type="email" placeholder={t('auth.email')} autoComplete="email" />
        <PasswordInput placeholder={t('auth.confirmPassword')} autoComplete="new-password" />
        <AuthSubmit>{t('auth.registerBtn')}</AuthSubmit>
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
