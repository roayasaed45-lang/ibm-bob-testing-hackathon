// Shared Ramadan decorative SVG elements for use across sections

export const SmallCrescent = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-5 h-5 opacity-20 ${className}`}
    viewBox="0 0 64 64"
    fill="none"
    style={{ filter: 'drop-shadow(0 0 4px hsl(43 64% 52% / 0.3))' }}
  >
    <path
      d="M40 8C28 8 18 18 18 30s10 22 22 22c4 0 7.5-1 10.5-2.5C45 54 38 48 38 38c0-12 7-20 14-24C48.5 10 44.5 8 40 8z"
      fill="hsl(43 64% 52%)"
    />
  </svg>
);

export const StarCluster = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-16 h-16 opacity-10 ${className}`}
    viewBox="0 0 80 80"
    fill="none"
    style={{ filter: 'drop-shadow(0 0 4px hsl(43 64% 52% / 0.2))' }}
  >
    {/* 8-pointed star */}
    <path
      d="M40 10l3 12 12-3-9 9 9 9-12-3-3 12-3-12-12 3 9-9-9-9 12 3z"
      fill="hsl(43 64% 52%)"
      opacity="0.6"
    />
    <circle cx="18" cy="18" r="1.5" fill="hsl(43 64% 52%)" opacity="0.4" />
    <circle cx="62" cy="22" r="1" fill="hsl(43 64% 52%)" opacity="0.3" />
    <circle cx="55" cy="60" r="1.5" fill="hsl(43 64% 52%)" opacity="0.35" />
    <circle cx="22" cy="58" r="1" fill="hsl(43 64% 52%)" opacity="0.25" />
  </svg>
);

export const MiniLantern = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-6 h-14 opacity-15 ${className}`}
    viewBox="0 0 30 70"
    fill="none"
    style={{ filter: 'drop-shadow(0 0 4px hsl(43 64% 52% / 0.2))' }}
  >
    <line x1="15" y1="0" x2="15" y2="15" stroke="hsl(43 64% 52%)" strokeWidth="0.8" opacity="0.5" />
    <path d="M10 15h10l1.5 4H8.5l1.5-4z" fill="hsl(43 64% 52%)" opacity="0.6" />
    <path
      d="M8.5 19C8.5 19 6 28 6 37c0 6 4 11 9 11s9-5 9-11c0-9-2.5-18-2.5-18H8.5z"
      fill="hsl(43 64% 52%)"
      opacity="0.12"
      stroke="hsl(43 64% 52%)"
      strokeWidth="0.6"
      strokeOpacity="0.35"
    />
    <ellipse cx="15" cy="34" rx="3.5" ry="5.5" fill="hsl(43 64% 52%)" opacity="0.15" />
    <path d="M11 48h8l-1.5 3.5h-5L11 48z" fill="hsl(43 64% 52%)" opacity="0.6" />
    <line x1="15" y1="51.5" x2="15" y2="60" stroke="hsl(43 64% 52%)" strokeWidth="0.8" opacity="0.35" />
    <circle cx="15" cy="62" r="1.5" fill="hsl(43 64% 52%)" opacity="0.35" />
  </svg>
);

export const SectionDivider = () => (
  <div className="flex items-center justify-center gap-3 py-2">
    <div className="h-px w-12 bg-primary/15" />
    <SmallCrescent />
    <div className="h-px w-12 bg-primary/15" />
  </div>
);
