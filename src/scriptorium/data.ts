/* Shared mock data for the Scriptorium studio — ported from the design bundle. */

export type NavId =
  | 'dashboard' | 'books' | 'analytics' | 'settings' | 'comments' | 'money' | 'support';

export interface NavItem {
  id: NavId;
  label: string;
  icon: string;
  badge?: string;
}

export const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'books', label: 'Books', icon: 'books', badge: '12' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'comments', label: 'Comments', icon: 'comments', badge: '7' },
  { id: 'money', label: 'Money', icon: 'money' },
  { id: 'support', label: 'IT support', icon: 'support' },
];

export interface AgeSegment { label: string; pct: number; color: string; }
export const AGE_SEGMENTS: AgeSegment[] = [
  { label: '18 & under', pct: 20, color: '#FF5A5A' },
  { label: '19 – 25', pct: 30, color: '#FF9F1C' },
  { label: '26 – 40', pct: 24, color: '#FFC400' },
  { label: '41 – 60', pct: 16, color: '#15B97C' },
  { label: '60 +', pct: 10, color: '#7B61FF' },
];

export const TREND = {
  views: [520, 610, 360, 740, 690, 760, 905],
  subscribers: [120, 180, 210, 260, 240, 330, 420],
  labels: ['12 Jun', '13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun'],
};

const COVERS = [
  'linear-gradient(150deg,#1B1B3A,#3A2E6E)',
  'linear-gradient(150deg,#7A1F2B,#C8434F)',
  'linear-gradient(150deg,#0E3B2E,#15B97C)',
  'linear-gradient(150deg,#2A2A26,#5A5A50)',
  'linear-gradient(150deg,#3D2A0A,#E6A300)',
  'linear-gradient(150deg,#1A2B4A,#3E7CB1)',
];

export interface Book {
  id: string;
  title: string;
  genre: string;
  status: 'Published' | 'Ongoing' | 'Draft';
  cover: string;
  reads: string;
  subs: string;
  rating: string;
  chapters: number;
  words: string;
  earned: string;
  likes: string;
  completion: number;
  age: string;
  desc: string;
}

export const BOOKS: Book[] = [
  { id: 'b1', title: 'The Lantern of Vorth', genre: 'Epic Fantasy', status: 'Published',
    cover: COVERS[0], reads: '48.2k', subs: '3.1k', rating: '4.8', chapters: 34, words: '112k', earned: '$3,180', likes: '6.1k', completion: 84, age: '226 days 7 hours',
    desc: 'When the last light-keeper abandons her post, the border between the waking world and the Hollow begins to thin. A sweeping tale of duty, memory, and the cost of holding back the dark.' },
  { id: 'b2', title: 'Saltblood', genre: 'Dark Romance', status: 'Published',
    cover: COVERS[1], reads: '71.6k', subs: '5.4k', rating: '4.9', chapters: 41, words: '138k', earned: '$5,940', likes: '9.8k', completion: 91, age: '1 yr 14 days',
    desc: 'A pirate queen and the cartographer she was sent to kill. Across three oceans and one impossible promise, they learn that some maps are drawn in blood.' },
  { id: 'b3', title: 'Quiet Machines', genre: 'Sci-Fi', status: 'Ongoing',
    cover: COVERS[2], reads: '22.9k', subs: '1.8k', rating: '4.6', chapters: 18, words: '61k', earned: '$1,420', likes: '3.2k', completion: 76, age: '48 days 3 hours',
    desc: 'In a city where every appliance keeps a diary, one repair technician starts reading them — and discovers the machines have been waiting a very long time to be heard.' },
  { id: 'b4', title: 'The Understudy', genre: 'Thriller', status: 'Draft',
    cover: COVERS[3], reads: '—', subs: '—', rating: '—', chapters: 6, words: '19k', earned: '$0', likes: '—', completion: 0, age: 'Not published',
    desc: 'She memorised every line of a role she was never meant to play. Then the lead actress vanished, and the script started predicting the murders.' },
  { id: 'b5', title: 'Honeyed Ash', genre: 'Cozy Fantasy', status: 'Ongoing',
    cover: COVERS[4], reads: '33.4k', subs: '2.6k', rating: '4.7', chapters: 23, words: '74k', earned: '$2,070', likes: '4.7k', completion: 88, age: '96 days 11 hours',
    desc: 'A retired battle-mage opens a bakery in a town that does not exist on any map. The croissants are perfect. The customers are not entirely alive.' },
  { id: 'b6', title: 'North of Tomorrow', genre: 'Literary', status: 'Published',
    cover: COVERS[5], reads: '56.0k', subs: '4.0k', rating: '4.8', chapters: 29, words: '97k', earned: '$4,260', likes: '7.3k', completion: 81, age: '310 days 2 hours',
    desc: 'Two estranged siblings drive the length of a frozen coastline to scatter their mother’s ashes, and find the road keeps stretching the closer they get.' },
];

export const TOP_BOOKS: Book[] = [BOOKS[1], BOOKS[5], BOOKS[0], BOOKS[4]];

export interface Chapter { n: number; t: string; words: string; reads: string; status: 'Published' | 'New' | 'Draft'; }
export const CHAPTERS: Chapter[] = [
  { n: 1, t: 'The Keeper’s Last Night', words: '3.4k', reads: '12.1k', status: 'Published' },
  { n: 2, t: 'Where the Light Goes', words: '4.1k', reads: '10.8k', status: 'Published' },
  { n: 3, t: 'A Door Left Open', words: '3.9k', reads: '9.6k', status: 'Published' },
  { n: 4, t: 'The Hollow Remembers', words: '4.4k', reads: '8.9k', status: 'Published' },
  { n: 5, t: 'Borrowed Names', words: '3.7k', reads: '7.2k', status: 'Published' },
  { n: 6, t: 'What the River Carried', words: '4.0k', reads: '2.4k', status: 'New' },
  { n: 7, t: 'The Long Way Down', words: '2.1k', reads: '—', status: 'Draft' },
];

export const PAGE_META: Record<string, { crumb: string; h: string; eyebrow: string; title: string; sub: string }> = {
  dashboard: { crumb: 'Main page', h: 'Dashboard', eyebrow: 'Welcome back, Dmytro', title: 'Here’s how your stories are doing', sub: 'A live snapshot of your readership, earnings, and library across READOM.' },
  books: { crumb: 'Library', h: 'Your books', eyebrow: 'Library', title: 'Your books', sub: 'Everything you’ve written on READOM — published, ongoing, and in draft.' },
  analytics: { crumb: 'Insights', h: 'Analytics', eyebrow: 'Insights', title: 'Analytics', sub: 'How readers are finding, reading, and finishing your stories across READOM.' },
  money: { crumb: 'Finance', h: 'Money', eyebrow: 'Finance', title: 'Money', sub: 'Your balance, payouts, and where every dollar of your earnings comes from.' },
  comments: { crumb: 'Community', h: 'Comments', eyebrow: 'Community', title: 'Comments', sub: 'What readers are saying across your books — reply, resolve, and keep the conversation going.' },
  settings: { crumb: 'Workspace', h: 'Settings', eyebrow: 'Workspace', title: 'Settings', sub: 'Manage your public profile, notifications, privacy, and account.' },
  support: { crumb: 'Help', h: 'IT support', eyebrow: 'Help', title: 'IT support', sub: 'Search the help center, check system status, or reach a human — fast.' },
  book: { crumb: 'Library / Book', h: 'Book overview', eyebrow: '', title: '', sub: '' },
};
