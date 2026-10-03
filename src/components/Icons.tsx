// One inline SVG sprite; components reference symbols with <Icon name="…" />.

export const IconSprite = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <symbol id="i-wa" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
    </symbol>
    <symbol id="i-bag" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M5 8h14l-1.2 12H6.2L5 8Zm3.5 0V6.5a3.5 3.5 0 0 1 7 0V8" />
    </symbol>
    <symbol id="i-truck" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M2 6h11v10H2zM13 9h4l3 3v4h-7M6.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </symbol>
    <symbol id="i-tag" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" d="M3 12V4h8l10 10-8 8L3 12Z" />
      <circle cx="7.5" cy="8.5" r="1.4" fill="currentColor" />
    </symbol>
    <symbol id="i-ruler" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" d="M3 15 15 3l6 6L9 21l-6-6Zm4-1 2 2m1-5 2 2m1-5 2 2" />
    </symbol>
    <symbol id="i-return" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </symbol>
    <symbol id="i-pin" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </symbol>
  </svg>
);

export const Icon = ({ name }: { name: string }) => (
  <svg aria-hidden="true">
    <use href={`#i-${name}`} />
  </svg>
);
