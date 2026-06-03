interface LogoProps {
  className?: string;
}

/** Angular rune-style READOM mark used across the site. */
const Logo = ({ className }: LogoProps) => (
  <svg
    viewBox="0 0 32 40"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M8 38 V4 L24 4" />
    <path d="M8 20 L24 4" />
    <path d="M8 20 L22 32" />
  </svg>
);

export default Logo;
