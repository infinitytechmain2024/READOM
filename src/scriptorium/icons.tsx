/* Geometric line-icon set, ported from the Scriptorium design bundle. */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const s = (p: P) => ({ fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, viewBox: '0 0 24 24', ...p });

export const Ic = {
  dashboard: (p: P) => (<svg {...s(p)}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>),
  books: (p: P) => (<svg {...s(p)}><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5.5A1.5 1.5 0 0 1 4 18.5z" /><path d="M4 17.5A1.5 1.5 0 0 1 5.5 16H20" /><path d="M9 3v13" /></svg>),
  analytics: (p: P) => (<svg {...s(p)}><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8 17v-5" /><path d="M13 17V8" /><path d="M18 17v-8" /></svg>),
  settings: (p: P) => (<svg {...s(p)}><circle cx="12" cy="12" r="3.2" /><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" /></svg>),
  comments: (p: P) => (<svg {...s(p)}><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4 4z" /></svg>),
  money: (p: P) => (<svg {...s(p)}><circle cx="12" cy="12" r="9" /><path d="M14.5 9.2c-.5-1-1.5-1.4-2.6-1.4-1.4 0-2.4.8-2.4 1.9 0 2.7 5.3 1.4 5.3 4.2 0 1.2-1.1 2-2.6 2-1.3 0-2.3-.5-2.8-1.5" /><path d="M12 6v1.5M12 16.5V18" /></svg>),
  support: (p: P) => (<svg {...s(p)}><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M20 19v.5a2.5 2.5 0 0 1-2.5 2.5H13" /></svg>),
  search: (p: P) => (<svg {...s(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>),
  bell: (p: P) => (<svg {...s(p)}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>),
  power: (p: P) => (<svg {...s({ strokeWidth: 2.3, ...p })}><path d="M12 3v8" /><path d="M6.5 7a8 8 0 1 0 11 0" /></svg>),
  menu: (p: P) => (<svg {...s({ strokeWidth: 2.3, ...p })}><path d="M4 7h16M4 12h16M4 17h16" /></svg>),
  arrow: (p: P) => (<svg {...s({ strokeWidth: 2.3, ...p })}><path d="M5 12h14M13 6l6 6-6 6" /></svg>),
  back: (p: P) => (<svg {...s({ strokeWidth: 2.3, ...p })}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>),
  up: (p: P) => (<svg {...s({ strokeWidth: 2.6, ...p })}><path d="M6 14l6-6 6 6" /></svg>),
  plus: (p: P) => (<svg {...s({ strokeWidth: 2.4, ...p })}><path d="M12 5v14M5 12h14" /></svg>),
  collapse: (p: P) => (<svg {...s({ strokeWidth: 2.4, ...p })}><path d="M15 6l-6 6 6 6" /></svg>),
  eye: (p: P) => (<svg {...s(p)}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>),
  edit: (p: P) => (<svg {...s(p)}><path d="M14 4.5 19.5 10 9 20.5H4v-5z" /></svg>),
  download: (p: P) => (<svg {...s(p)}><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 19h14" /></svg>),
  first: (p: P) => (<svg {...s({ strokeWidth: 2.3, ...p })}><path d="M18 6l-6 6 6 6M11 6l-6 6 6 6" /></svg>),
  last: (p: P) => (<svg {...s({ strokeWidth: 2.3, ...p })}><path d="M6 6l6 6-6 6M13 6l6 6-6 6" /></svg>),
  card: (p: P) => (<svg {...s(p)}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 10h18M7 15h3" /></svg>),
  gift: (p: P) => (<svg {...s(p)}><rect x="4" y="9" width="16" height="11" rx="1.5" /><path d="M3 9h18M12 9v11" /><path d="M12 9S10.5 4 8 5c-2 .8-1 4 4 4zM12 9s1.5-5 4-4c2 .8 1 4-4 4z" /></svg>),
  calendar: (p: P) => (<svg {...s(p)}><rect x="3.5" y="5" width="17" height="16" rx="2.5" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></svg>),
  check: (p: P) => (<svg {...s({ strokeWidth: 2.4, ...p })}><path d="M5 12.5 10 17.5 19 6.5" /></svg>),
  wallet: (p: P) => (<svg {...s(p)}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v0H6.5" /><path d="M4 7.5V18a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3" /><path d="M20 11v5h-4a2.5 2.5 0 0 1 0-5z" /></svg>),
  heart: (p: P) => (<svg {...s(p)}><path d="M12 20s-7-4.4-9.3-8.4C1.3 9 2.5 5.8 5.6 5.2 7.7 4.8 9.6 6 12 8.4 14.4 6 16.3 4.8 18.4 5.2c3.1.6 4.3 3.8 2.9 6.4C19 15.6 12 20 12 20z" /></svg>),
  reply: (p: P) => (<svg {...s(p)}><path d="M9 7 4 12l5 5" /><path d="M4 12h10a6 6 0 0 1 6 6v1" /></svg>),
  more: (p: P) => (<svg fill="currentColor" stroke="none" viewBox="0 0 24 24" {...p}><circle cx="5" cy="12" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="19" cy="12" r="1.9" /></svg>),
  chat: (p: P) => (<svg {...s(p)}><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4 4z" /><path d="M8 9h8M8 12h5" /></svg>),
  mail: (p: P) => (<svg {...s(p)}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>),
  clock: (p: P) => (<svg {...s(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>),
  chevron: (p: P) => (<svg {...s({ strokeWidth: 2.4, ...p })}><path d="M6 9l6 6 6-6" /></svg>),
  user: (p: P) => (<svg {...s(p)}><circle cx="12" cy="8.5" r="4" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></svg>),
  lock: (p: P) => (<svg {...s(p)}><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></svg>),
  telegram: (p: P) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M21.7 4.2 2.9 11.5c-1.1.43-1.1 1.04-.2 1.32l4.7 1.46 1.82 5.57c.22.61.4.84.85.84.46 0 .66-.21.91-.5l2.27-2.2 4.66 3.44c.86.47 1.48.23 1.69-.79l3.06-14.4c.31-1.25-.48-1.81-1.66-1.3Zm-3.55 3.3-8.4 7.65c-.33.3-.47.65-.5 1.05l-.32 3.36-1.7-5.32 10.1-6.39c.48-.3.93.1.72.41Z" /></svg>),
  whatsapp: (p: P) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.1-1.34A10 10 0 1 0 12 2Zm0 1.84a8.16 8.16 0 0 1 6.93 12.5 8.16 8.16 0 0 1-10.43 3.1l-.37-.2-3.02.79.8-2.95-.21-.38A8.16 8.16 0 0 1 12 3.84Zm-3.1 4.1c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.71 2.74 4.22 3.74 2.09.82 2.51.66 2.97.62.46-.04 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.48-.74-1.71-.82-.22-.08-.39-.12-.55.12-.16.24-.63.81-.77.97-.14.16-.28.18-.52.06-.24-.12-1.04-.39-1.98-1.23-.73-.65-1.23-1.46-1.37-1.7-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.34-.76-1.83-.2-.48-.4-.41-.55-.42l-.47-.01Z" /></svg>),
};

export type IcName = keyof typeof Ic;
