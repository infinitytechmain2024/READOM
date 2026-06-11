import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { AuthHeading, PasswordInput, AuthSubmit } from '@/components/auth/AuthControls';
import { passwordRules, isPasswordValid } from '@/lib/passwordRules';
import { getPasswordBreachCount } from '@/lib/passwordBreach';
import { usePasswordBreach } from '@/hooks/usePasswordBreach';
import { usePasswordMatch } from '@/hooks/usePasswordMatch';
import { supabase } from '@/integrations/supabase/client';

const SetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const rulesValid = isPasswordValid(password);
  const breach = usePasswordBreach(password, rulesValid);
  const match = usePasswordMatch(password, confirm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!rulesValid) { setFormError(t('auth.fixPasswordRules')); return; }
    if (match.state !== 'match') { setFormError(t('auth.passwordMismatch')); return; }

    setSubmitting(true);
    try {
      const count = await getPasswordBreachCount(password);
      if (count > 0) { setFormError(t('auth.breachFound', { count })); return; }
    } catch {
      setFormError(t('auth.breachCheckError'));
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { setFormError(error.message); return; }
      setDone(true);
      setTimeout(() => navigate('/auth'), 3000);
    } catch {
      setFormError(t('auth.errGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <AuthLayout active="login">
        <div className="flex flex-col items-center gap-5 py-6">
          <AuthHeading>{t('auth.passwordChangedTitle')}</AuthHeading>
          <p className="text-center text-sm text-white/75">{t('auth.passwordChangedBody')}</p>
          <Link to="/auth" className="text-sm font-semibold text-primary hover:underline">
            {t('auth.goToLogin')}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout active="login">
      <AuthHeading>{t('auth.setPasswordTitle')}</AuthHeading>
      <p className="text-center text-sm text-white/75 mb-4">{t('auth.setPasswordSubtitle')}</p>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <PasswordInput
          placeholder={t('auth.password')}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <ul className="space-y-2 py-1">
          {passwordRules.map((rule) => {
            const met = rule.test(password);
            return (
              <li key={rule.key} className={`flex items-center gap-3 text-sm transition-colors ${met ? 'text-[#FFCC18]' : 'text-white/85'}`}>
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border transition-colors ${met ? 'border-[#FFCC18] bg-[#FFCC18]' : 'border-white/50'}`}>
                  {met && <Check className="h-3 w-3 text-black" />}
                </span>
                {t(rule.key)}
              </li>
            );
          })}
        </ul>

        {breach.state === 'checking' && (
          <p className="flex items-center gap-2 text-sm text-white/70"><Loader2 className="h-4 w-4 animate-spin" />{t('auth.breachChecking')}</p>
        )}
        {breach.state === 'safe' && (
          <p className="flex items-center gap-2 text-sm text-[#FFCC18]"><ShieldCheck className="h-4 w-4" />{t('auth.breachSafe')}</p>
        )}
        {breach.state === 'breached' && (
          <p className="flex items-center gap-2 text-sm text-red-400"><ShieldAlert className="h-4 w-4 shrink-0" />{t('auth.breachFound', { count: breach.count })}</p>
        )}

        <PasswordInput
          placeholder={t('auth.confirmPassword')}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {match.state === 'mismatch' && (
          <p className="flex items-center gap-2 text-sm text-red-400"><ShieldAlert className="h-4 w-4 shrink-0" />{t('auth.passwordMismatch')}</p>
        )}
        {match.state === 'match' && (
          <p className="flex items-center gap-2 text-sm text-[#FFCC18]"><ShieldCheck className="h-4 w-4 shrink-0" />{t('auth.passwordMatch')}</p>
        )}

        {formError && (
          <p className="flex items-center gap-2 text-sm text-red-400"><ShieldAlert className="h-4 w-4 shrink-0" />{formError}</p>
        )}

        <AuthSubmit disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : null}
          {t('auth.savePassword')}
        </AuthSubmit>
      </form>
    </AuthLayout>
  );
};

export default SetPassword;
