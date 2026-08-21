export function CraneHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 480"
      className={className}
      role="img"
      aria-label="Minh họa cẩu gập (knuckle boom crane) lắp trên xe tải"
    >
      <defs>
        <linearGradient id="chSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123563" />
          <stop offset="100%" stopColor="#0b2545" />
        </linearGradient>
      </defs>

      <rect width="640" height="480" fill="url(#chSky)" rx="24" />

      <circle cx="520" cy="90" r="70" fill="#ffffff" opacity="0.04" />
      <circle cx="90" cy="60" r="40" fill="#ffffff" opacity="0.05" />

      <rect x="0" y="380" width="640" height="100" fill="#071527" />
      <rect x="0" y="378" width="640" height="6" fill="#1a4680" />

      <g stroke="#2c5aa0" strokeWidth="2" opacity="0.5">
        <line x1="0" y1="410" x2="640" y2="410" strokeDasharray="14 14" />
      </g>

      <g transform="translate(70,230)">
        <rect x="0" y="70" width="360" height="70" rx="6" fill="#e6e9ec" />
        <rect x="0" y="70" width="360" height="14" fill="#d81e2c" />
        <rect x="18" y="18" width="120" height="60" rx="6" fill="#cdd3d9" />
        <rect x="34" y="30" width="40" height="30" rx="3" fill="#0b2545" />

        <circle cx="70" cy="150" r="34" fill="#14181d" />
        <circle cx="70" cy="150" r="14" fill="#6b7680" />
        <circle cx="300" cy="150" r="34" fill="#14181d" />
        <circle cx="300" cy="150" r="14" fill="#6b7680" />

        <g transform="translate(170,70)">
          <rect x="-14" y="-150" width="28" height="150" rx="6" fill="#a6afb8" />
          <g transform="rotate(-35)">
            <rect x="0" y="-16" width="150" height="24" rx="6" fill="#d81e2c" />
            <g transform="translate(150,0) rotate(55)">
              <rect x="0" y="-11" width="110" height="18" rx="5" fill="#ffc629" />
              <circle cx="110" cy="-2" r="10" fill="#0b2545" />
            </g>
          </g>
        </g>
      </g>

      <g fill="#1a4680" opacity="0.5">
        <rect x="40" y="120" width="18" height="90" rx="3" />
        <rect x="580" y="150" width="14" height="60" rx="3" />
      </g>
    </svg>
  );
}
