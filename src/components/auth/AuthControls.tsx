import type { ReactNode, InputHTMLAttributes } from 'react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AuthHeading = ({ children }: { children: ReactNode }) => (
  <h1 className="mb-8 text-center text-3xl sm:text-4xl font-bold text-[#FFCC18]">{children}</h1>
);

export const AuthInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full h-14 px-5 rounded-md bg-transparent border border-white/40 text-white placeholder:text-white/60 focus:outline-none focus:border-primary transition-colors"
  />
);

// Password field with a show/hide toggle. Defaults to masked.
export const PasswordInput = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className="w-full h-14 pl-5 pr-14 rounded-md bg-transparent border border-white/40 text-white placeholder:text-white/60 focus:outline-none focus:border-primary transition-colors"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
        aria-pressed={visible}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center text-white/60 hover:text-white transition-colors"
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
};

export const AuthSubmit = ({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) => (
  <button
    type="submit"
    disabled={disabled}
    className="w-full h-14 rounded-md bg-[#FFCC18] text-black font-bold text-base transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:opacity-50"
  >
    {children}
  </button>
);

export const OrDivider = () => {
  const { t } = useTranslation();
  return (
    <div className="my-6 flex items-center gap-4 text-white/60">
      <span className="h-px flex-1 bg-white/25" />
      <span className="text-sm font-medium">{t('auth.or')}</span>
      <span className="h-px flex-1 bg-white/25" />
    </div>
  );
};

export const SocialButton = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <button
    type="button"
    className="relative flex h-14 w-full items-center rounded-md border border-white/40 px-5 transition-colors hover:border-primary hover:bg-white/5"
  >
    <span className="absolute left-5 flex h-8 w-8 items-center justify-center">{icon}</span>
    <span className="flex-1 text-center font-bold text-white">{label}</span>
  </button>
);
