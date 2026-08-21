const variants = [
  { from: "#0b2545", to: "#1a4680" },
  { from: "#123563", to: "#2c5aa0" },
  { from: "#071527", to: "#123563" },
];

export function NewsCover({
  seed = 0,
  className,
}: {
  seed?: number;
  className?: string;
}) {
  const { from, to } = variants[seed % variants.length];
  const gradId = `newsGrad${seed}`;

  return (
    <svg
      viewBox="0 0 400 240"
      className={className}
      role="img"
      aria-label="Ảnh minh họa bài viết kỹ thuật cẩu gập"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${gradId})`} />
      <g stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1">
        <line x1="0" y1="60" x2="400" y2="60" />
        <line x1="0" y1="120" x2="400" y2="120" />
        <line x1="0" y1="180" x2="400" y2="180" />
      </g>
      <circle cx="330" cy="60" r="70" fill="#ffc629" opacity="0.15" />
      <g transform="translate(150,90)" fill="none" stroke="#e35c66" strokeWidth="5" strokeLinecap="round">
        <path d="M10 60 L10 20 L60 20" />
        <circle cx="10" cy="12" r="8" fill="#e35c66" stroke="none" />
        <path d="M60 20 L90 45" />
        <circle cx="90" cy="45" r="6" fill="#ffffff" stroke="none" />
      </g>
    </svg>
  );
}
