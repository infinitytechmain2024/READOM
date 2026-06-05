// Password requirement checks for the registration form.
// Each rule maps to an i18n key shown in the requirement checklist.

export type PasswordRule = {
  key: string; // i18n translation key
  test: (password: string) => boolean;
};

// Latin + Cyrillic aware checks (use Unicode property escapes).
const hasUpper = (p: string) => /\p{Lu}/u.test(p);
const hasLower = (p: string) => /\p{Ll}/u.test(p);
const hasDigit = (p: string) => /\p{Nd}/u.test(p);
// "special" = any visible, non-whitespace char that is not a letter or digit.
const hasSpecial = (p: string) => /[^\p{L}\p{Nd}\s]/u.test(p);
// Allowed: letters, digits and special characters — i.e. no whitespace.
const onlyAllowed = (p: string) => p.length > 0 && !/\s/u.test(p);

export const passwordRules: PasswordRule[] = [
  { key: 'auth.ruleLength', test: (p) => p.length >= 8 && p.length <= 100 },
  { key: 'auth.ruleChars', test: onlyAllowed },
  { key: 'auth.ruleUpper', test: hasUpper },
  { key: 'auth.ruleLower', test: hasLower },
  { key: 'auth.ruleSpecial', test: hasSpecial },
  { key: 'auth.ruleDigit', test: hasDigit },
];

// True when every rule passes.
export const isPasswordValid = (password: string) =>
  passwordRules.every((rule) => rule.test(password));
