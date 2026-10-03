// Vicuna mark: a "V" (the torso) with a belt tied around its waist — a band, a knot and two tails.

export const MARK_PATHS = (ink: string, accent: string, knot: string) => `
  <path d="M12 12h18l25 76h-10z" fill="${ink}"/>
  <path d="M79 12h9L53 88h-6z" fill="${ink}"/>
  <rect x="9" y="41" width="82" height="12" rx="2.5" fill="${accent}"/>
  <rect x="44.5" y="38" width="11" height="18" rx="3.2" fill="${knot}"/>
  <path d="M48 55.5 41 76M52.5 55.5 60 73" stroke="${knot}" stroke-width="2.6" stroke-linecap="round" fill="none"/>
`;

export const LogoMark = ({ size = 34 }: { size?: number }) => (
  <svg
    className="logo-mark"
    width={size}
    height={size}
    viewBox="0 0 100 100"
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: MARK_PATHS("var(--ink)", "var(--accent)", "var(--accent-deep)") }}
  />
);

export const Logo = () => (
  <span className="logo">
    <LogoMark />
    <span className="logo-word">
      <span className="logo-en">VICUNA</span>
      <span className="logo-ar">فيكونا</span>
    </span>
  </span>
);

/** Favicon as a data URI (fixed colours, works on any tab background). */
export const faviconHref =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#F7F3F0"/>${MARK_PATHS("#1C1819", "#9A5B3A", "#6E3B22")}</svg>`,
  );
