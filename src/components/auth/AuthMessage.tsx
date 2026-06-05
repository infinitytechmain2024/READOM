import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Centered status/info screen: icon badge, heading, body text and actions.
// Used by the "check your email", verification, success and sign-out screens.
export const AuthMessage = ({
  icon,
  title,
  children,
}: {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
}) => (
  <div className="mx-auto max-w-md text-center">
    {icon && (
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#FFCC18]/40 bg-[#FFCC18]/10 text-[#FFCC18]">
        {icon}
      </div>
    )}
    <h1 className="mb-4 text-3xl sm:text-4xl font-bold text-[#FFCC18]">{title}</h1>
    <div className="space-y-3 text-base leading-relaxed text-white/80">{children}</div>
  </div>
);

// Primary call-to-action rendered as a router link (mirrors AuthSubmit styling).
export const AuthLinkButton = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link
    to={to}
    className="flex h-14 w-full items-center justify-center rounded-md bg-[#FFCC18] font-bold text-base text-black transition-opacity hover:opacity-90"
  >
    {children}
  </Link>
);

// Secondary, low-emphasis link below the primary action.
export const AuthSecondaryLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="font-bold text-white hover:text-primary transition-colors">
    {children}
  </Link>
);