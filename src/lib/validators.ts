// Shared form validators for the auth pages.

// Pragmatic email check: non-empty local part, single @, a dotted domain.
// Server-side verification remains the source of truth.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string): boolean => EMAIL_RE.test(email.trim());
