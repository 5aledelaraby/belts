// Decorative line art drawn for Vicuna: bows, ribbons, sparkles, blobs, wavy dividers.
// Pure SVG, coloured with currentColor so they follow the palette.

const line = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Bow = ({ className = "", w = 1.6 }: { className?: string; w?: number }) => (
  <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
    <path {...line} strokeWidth={w} d="M60 38C48 22 22 8 14 18c-8 10 4 30 46 22M60 38c12-16 38-30 46-20 8 10-4 30-46 22" />
    <path {...line} strokeWidth={w} d="M54 34c-2 4-2 8 0 11 4 3 8 3 12 0 2-3 2-7 0-11-4-3-8-3-12 0Z" />
    <path {...line} strokeWidth={w} d="M56 45c-6 10-14 20-22 28M64 45c6 10 12 19 20 27" />
  </svg>
);

export const Ribbon = ({ className = "", w = 1.4 }: { className?: string; w?: number }) => (
  <svg viewBox="0 0 400 60" className={className} aria-hidden="true" preserveAspectRatio="none">
    <path {...line} strokeWidth={w} d="M2 30c40-26 80 26 120 0s80-26 120 0 80 26 120 0c14-9 26-12 36-10" />
  </svg>
);

export const Sparkle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="currentColor" d="M12 1.5c.6 4.8 2.7 7.6 10.5 10.5-7.8 2.9-9.9 5.7-10.5 10.5-.6-4.8-2.7-7.6-10.5-10.5C9.3 9.1 11.4 6.3 12 1.5Z" />
  </svg>
);

export const Heart = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="currentColor" d="M12 21s-8-4.9-8-11a4.6 4.6 0 0 1 8-3.1A4.6 4.6 0 0 1 20 10c0 6.1-8 11-8 11Z" />
  </svg>
);

/** Soft wavy edge between sections. `flip` turns it upside down. */
export const Wave = ({ className = "", flip = false }: { className?: string; flip?: boolean }) => (
  <svg viewBox="0 0 1440 60" className={className} preserveAspectRatio="none" aria-hidden="true" style={flip ? { transform: "scaleY(-1)" } : undefined}>
    <path fill="currentColor" d="M0 30c120-24 240-24 360 0s240 24 360 0 240-24 360 0 240 24 360 0v30H0Z" />
  </svg>
);

/** Drifting blurred colour blobs for section backgrounds. */
export const Blobs = ({ className = "" }: { className?: string }) => (
  <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
    <span className="blob blob-1" />
    <span className="blob blob-2" />
    <span className="blob blob-3" />
  </div>
);
