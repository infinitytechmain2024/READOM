import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { AuthHeading } from '@/components/auth/AuthControls';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // detectSessionInUrl: true (default) triggers PKCE code exchange automatically.
    // onAuthStateChange fires once the exchange completes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setStatus('success');
        setTimeout(() => navigate('/'), 1500);
      } else if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password/set');
      }
    });

    // Trigger the exchange by calling getSession while code is in URL.
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setStatus('error');
        return;
      }
      if (data.session) {
        setStatus('success');
        setTimeout(() => navigate('/'), 1500);
      }
    });

    // Fallback: if nothing resolved after 8 s, show error.
    const timer = setTimeout(() => {
      setStatus((prev) => (prev === 'loading' ? 'error' : prev));
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <AuthLayout active="login">
      <div className="flex flex-col items-center gap-6 py-8">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <AuthHeading>{t('auth.verifyingTitle')}</AuthHeading>
            <p className="text-center text-sm text-white/75">{t('auth.verifyingBody')}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <AuthHeading>{t('auth.verifySuccessTitle')}</AuthHeading>
            <p className="text-center text-sm text-white/75">{t('auth.verifySuccessBody')}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <AuthHeading>{t('auth.verifyErrorTitle')}</AuthHeading>
            <p className="text-center text-sm text-white/75">{t('auth.verifyErrorBody')}</p>
            <Link to="/register" className="text-sm font-semibold text-primary hover:underline">
              {t('auth.backToLogin')}
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default AuthCallback;
