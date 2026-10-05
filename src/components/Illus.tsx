// Small two-tone illustrations (red line + soft pink fill) for perks, the shipping pill and product facts.
// Drawn on a 48×48 grid; the pink comes from --il-fill so they can sit on any background.

const ln = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const soft = { fill: "var(--il-fill, #FBE8EA)" } as const;

const art: Record<string, JSX.Element> = {
  // paper plane with a dashed flight trail — delivery
  plane: (
    <>
      <path {...soft} d="M42 7 6 22l13 5 3 13 7-9 9 6Z" />
      <path {...ln} d="M42 7 6 22l13 5 3 13 7-9 9 6L42 7ZM19 27 42 7M22 40l1-10" />
      <path {...ln} strokeDasharray="1 4" d="M4 34c4 2 8 2 11 0" />
    </>
  ),
  // banknote with a coin — cash on delivery
  cash: (
    <>
      <rect {...soft} x="5" y="13" width="32" height="20" rx="4" />
      <rect {...ln} x="5" y="13" width="32" height="20" rx="4" />
      <circle {...ln} cx="21" cy="23" r="4.5" />
      <circle {...soft} cx="37" cy="33" r="7" />
      <circle {...ln} cx="37" cy="33" r="7" />
      <path {...ln} d="M37 30v6M10 18v.01M32 28v.01" />
    </>
  ),
  // box with a circular arrow — returns
  return: (
    <>
      <path {...soft} d="M10 18 24 11l14 7v16l-14 7-14-7Z" />
      <path {...ln} d="M10 18 24 11l14 7v16l-14 7-14-7V18Zm0 0 14 7 14-7M24 25v16" />
      <path {...ln} d="M6 10a9 9 0 0 1 14-3M6 10V4m0 6h6" />
    </>
  ),
  // soft tape measure — fits up to 90 kg
  tape: (
    <>
      <circle {...soft} cx="19" cy="22" r="13" />
      <circle {...ln} cx="19" cy="22" r="13" />
      <circle {...ln} cx="19" cy="22" r="4" />
      <path {...ln} d="M32 22h12v8H19M24 30v-3M29 30v-4M34 30v-3M39 30v-4" />
    </>
  ),
  // gift box with a bow — birthday
  gift: (
    <>
      <rect {...soft} x="8" y="20" width="32" height="22" rx="3" />
      <path {...ln} d="M8 20h32v22H8zM5 14h38v6H5zM24 14v28" />
      <path {...ln} d="M24 14c-3-6-11-8-11-3 0 3 6 3 11 3Zm0 0c3-6 11-8 11-3 0 3-6 3-11 3Z" />
    </>
  ),
  // tag with percent — offer
  tag: (
    <>
      <path {...soft} d="M6 24 24 6h16v16L22 40Z" />
      <path {...ln} d="M6 24 24 6h16v16L22 40 6 24Z" />
      <circle {...ln} cx="33" cy="13" r="2.5" />
      <path {...ln} d="m17 29 8-8M17 22h.01M25 29h.01" />
    </>
  ),
};

export const Illus = ({ name, className = "size-11" }: { name: keyof typeof art | string; className?: string }) => (
  <svg viewBox="0 0 48 48" className={`illus ${className}`} aria-hidden="true">{art[name]}</svg>
);
