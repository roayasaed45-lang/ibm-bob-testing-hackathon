// Elegant Eid al-Adha decorative SVG elements — minimal, luxe, soft-gold

export const SmallCrescent = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-5 h-5 opacity-30 ${className}`}
    viewBox="0 0 64 64"
    fill="none"
    style={{ filter: 'drop-shadow(0 0 6px hsl(43 64% 60% / 0.35))' }}
  >
    <path
      d="M40 8C28 8 18 18 18 30s10 22 22 22c4 0 7.5-1 10.5-2.5C45 54 38 48 38 38c0-12 7-20 14-24C48.5 10 44.5 8 40 8z"
      fill="hsl(43 64% 55%)"
    />
  </svg>
);

// Subtle 8-point Islamic geometric star
export const StarCluster = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-14 h-14 opacity-20 ${className}`}
    viewBox="0 0 80 80"
    fill="none"
    style={{ filter: 'drop-shadow(0 0 6px hsl(43 64% 60% / 0.25))' }}
  >
    <g transform="translate(40 40)">
      <rect x="-18" y="-18" width="36" height="36" fill="none" stroke="hsl(43 64% 55%)" strokeWidth="0.8" opacity="0.6" />
      <rect x="-18" y="-18" width="36" height="36" fill="none" stroke="hsl(43 64% 55%)" strokeWidth="0.8" opacity="0.6" transform="rotate(45)" />
      <circle r="3" fill="hsl(43 64% 55%)" opacity="0.5" />
    </g>
  </svg>
);

export const MiniLantern = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-6 h-14 opacity-25 ${className}`}
    viewBox="0 0 30 70"
    fill="none"
    style={{ filter: 'drop-shadow(0 0 6px hsl(43 64% 60% / 0.3))' }}
  >
    <line x1="15" y1="0" x2="15" y2="15" stroke="hsl(43 64% 55%)" strokeWidth="0.6" opacity="0.5" />
    <path d="M10 15h10l1.5 4H8.5l1.5-4z" fill="hsl(43 64% 55%)" opacity="0.6" />
    <path
      d="M8.5 19C8.5 19 6 28 6 37c0 6 4 11 9 11s9-5 9-11c0-9-2.5-18-2.5-18H8.5z"
      fill="hsl(43 64% 70%)"
      opacity="0.15"
      stroke="hsl(43 64% 55%)"
      strokeWidth="0.5"
      strokeOpacity="0.4"
    />
    <ellipse cx="15" cy="34" rx="3.5" ry="5.5" fill="hsl(43 80% 70%)" opacity="0.25" />
    <path d="M11 48h8l-1.5 3.5h-5L11 48z" fill="hsl(43 64% 55%)" opacity="0.6" />
    <line x1="15" y1="51.5" x2="15" y2="60" stroke="hsl(43 64% 55%)" strokeWidth="0.6" opacity="0.35" />
    <circle cx="15" cy="62" r="1.2" fill="hsl(43 64% 55%)" opacity="0.4" />
  </svg>
);

export const SectionDivider = () => (
  <div className="flex items-center justify-center gap-3 py-2">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
    <SmallCrescent />
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
  </div>
);

// Soft glowing orb — premium ambient light
export const SoftGlow = ({ className = '', size = 200 }: { className?: string; size?: number }) => (
  <div
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      background: 'radial-gradient(circle, hsl(43 80% 70% / 0.25) 0%, hsl(43 80% 70% / 0) 70%)',
      filter: 'blur(20px)',
    }}
  />
);
