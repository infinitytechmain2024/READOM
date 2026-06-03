interface LogoProps {
  className?: string;
}

/** Angular rune-style READOM mark used across the site. */
const Logo = ({ className }: LogoProps) => (
  <svg
    width={40.5}
    height={86.5}
    viewBox="0 0 45 88"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    className={className}
    aria-hidden="true"
  >
    <path d="M2 1.5L42 41.5L34.5 49L13 27.5V35L41.5 63.5L34.5 70.5L13 49V86.5H1.5V0.5V0" />
  </svg>
);

export default Logo;
