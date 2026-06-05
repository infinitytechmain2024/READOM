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
};

export type IcName = keyof typeof Ic;
