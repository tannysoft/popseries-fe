type Props = {
  className?: string;
  variant?: "full" | "mark";
};

export function Logo({ className, variant = "full" }: Props) {
  if (variant === "mark") {
    return (
      <svg viewBox="0 0 96 96" className={className} aria-label="Pop Series">
        <circle cx="48" cy="48" r="40" fill="#F2A48C" />
        <circle cx="48" cy="48" r="30" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="48" cy="48" r="20" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="48" cy="48" r="10" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 96" className={className} aria-label="Pop Series">
      <defs>
        <clipPath id="logo-clip-1">
          <circle cx="48" cy="48" r="38" />
        </clipPath>
        <clipPath id="logo-clip-2">
          <circle cx="110" cy="48" r="38" />
        </clipPath>
        <clipPath id="logo-clip-3">
          <circle cx="172" cy="48" r="38" />
        </clipPath>
      </defs>
      <circle cx="48" cy="48" r="38" fill="#F2A48C" />
      <g clipPath="url(#logo-clip-1)">
        <circle cx="48" cy="48" r="29" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="48" cy="48" r="20" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="48" cy="48" r="11" fill="#fff" />
      </g>
      <circle cx="110" cy="48" r="38" fill="#7DB7AA" />
      <g clipPath="url(#logo-clip-2)">
        <circle cx="110" cy="48" r="29" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="110" cy="48" r="20" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="110" cy="48" r="11" fill="#fff" />
      </g>
      <circle cx="172" cy="48" r="38" fill="#F1D182" />
      <g clipPath="url(#logo-clip-3)">
        <circle cx="172" cy="48" r="29" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="172" cy="48" r="20" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="172" cy="48" r="11" fill="#fff" />
      </g>
      <g
        fontFamily="'Kanit', system-ui, sans-serif"
        fontWeight={800}
        fill="#2B2F3A"
        fontSize="34"
        textAnchor="middle"
      >
        <text x="48" y="60">P</text>
        <text x="110" y="60">O</text>
        <text x="172" y="60">P</text>
      </g>
    </svg>
  );
}
