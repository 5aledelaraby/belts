// Minimal line icons (1.5px strokes) as an inline sprite; use <Icon name="…" />.

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconSprite = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <symbol id="i-bag" viewBox="0 0 24 24"><path {...s} d="M5 8h14l-1.1 12H6.1L5 8Zm3.5 0V6.5a3.5 3.5 0 0 1 7 0V8" /></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path {...s} d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" /></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path {...s} d="M4 8h16M4 16h16" /></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path {...s} d="M6 6l12 12M18 6 6 18" /></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path {...s} d="M19 12H5m5-5-5 5 5 5" /></symbol>
    <symbol id="i-filter" viewBox="0 0 24 24"><path {...s} d="M4 7h10m4 0h2M4 17h4m4 0h8M14 5v4M8 15v4" /></symbol>
    <symbol id="i-grid" viewBox="0 0 24 24"><path {...s} d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></symbol>
    <symbol id="i-list" viewBox="0 0 24 24"><path {...s} d="M4 5h16v6H4zM4 15h16v4H4z" /></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path {...s} d="m5 12.5 4.5 4.5L19 7" /></symbol>
    <symbol id="i-plane" viewBox="0 0 24 24"><path {...s} d="M21 3 3 10.5l6.5 2.5L12 20l3.5-4.5L20 18 21 3ZM9.5 13 21 3" /></symbol>
    <symbol id="i-gift" viewBox="0 0 24 24"><path {...s} d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5.5-4-5.5-1.5C6.5 7 9.5 7 12 7Zm0 0c1.5-3 5.5-4 5.5-1.5C17.5 7 14.5 7 12 7Z" /></symbol>
    <symbol id="i-sound" viewBox="0 0 24 24"><path {...s} d="M4 10v4h4l5 4V6L8 10H4Zm12.5-1.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></symbol>
    <symbol id="i-mute" viewBox="0 0 24 24"><path {...s} d="M4 10v4h4l5 4V6L8 10H4Zm12 0 5 5m0-5-5 5" /></symbol>
    <symbol id="i-truck" viewBox="0 0 24 24"><path {...s} d="M2 6h11v10H2zM13 9h4l3 3v4h-7M6.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /></symbol>
    <symbol id="i-return" viewBox="0 0 24 24"><path {...s} d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></symbol>
    <symbol id="i-cash" viewBox="0 0 24 24"><path {...s} d="M3 7h18v10H3zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6 10v.01M18 14v.01" /></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path {...s} d="M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2" /></symbol>
    <symbol id="i-ruler" viewBox="0 0 24 24"><path {...s} d="M3 15 15 3l6 6L9 21l-6-6Zm4-1 2 2m1-5 2 2m1-5 2 2" /></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24"><path {...s} d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle {...s} cx="12" cy="9.5" r="2.5" /></symbol>
    <symbol id="i-wa" viewBox="0 0 24 24"><path {...s} d="M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20Z" /><path {...s} d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2L9 9.5Z" /></symbol>
    <symbol id="i-tiktok" viewBox="0 0 24 24"><path {...s} d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.4 2 4 4.5 4.2" /></symbol>
    <symbol id="i-facebook" viewBox="0 0 24 24"><path {...s} d="M14 8h2.5V4.5H14A3.5 3.5 0 0 0 10.5 8v2.5H8V14h2.5v6H14v-6h2.5l.5-3.5h-3V8.5a.5.5 0 0 1 .5-.5Z" /></symbol>
    <symbol id="i-link" viewBox="0 0 24 24"><path {...s} d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path {...s} d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></symbol>
    <symbol id="i-instagram" viewBox="0 0 24 24"><rect {...s} x="4" y="4" width="16" height="16" rx="5" /><circle {...s} cx="12" cy="12" r="3.6" /><path {...s} d="M16.8 7.2v.01" /></symbol>
    <symbol id="i-snapchat" viewBox="0 0 24 24"><path {...s} d="M12 4c2.8 0 4.5 2 4.5 4.6v2.2l1.8-.5c.5 0 .7.6.2.9l-1.9 1c.6 1.8 1.9 3 3.4 3.4-.4.7-1.4 1-2.4 1.1l-.4 1.1c-1.1-.2-2 0-3 .7-1.4 1-3 1-4.4 0-1-.7-1.9-.9-3-.7l-.4-1.1c-1-.1-2-.4-2.4-1.1 1.5-.4 2.8-1.6 3.4-3.4l-1.9-1c-.5-.3-.3-.9.2-.9l1.8.5V8.6C7.5 6 9.2 4 12 4Z" /></symbol>
  </svg>
);

export const Icon = ({ name, className = "size-5" }: { name: string; className?: string }) => (
  <svg className={className} aria-hidden="true">
    <use href={`#i-${name}`} />
  </svg>
);
