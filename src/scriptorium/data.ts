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

export interface Comment {
  id: string; reader: string; handle: string; av: string; book: string; chapter: string;
  text: string; time: string; likes: number; replies: number;
  kind: 'praise' | 'question' | 'critique'; unread: boolean; resolved: boolean;
}

const AV = ['#FF5A5A','#15B97C','#7B61FF','#FF9F1C','#3E7CB1','#E6A300','#C8434F','#0E8F60'];

export const COMMENTS: Comment[] = [
  { id:'c1', reader:'Nadia Okonkwo', handle:'@nightreads', av:AV[2], book:'Saltblood', chapter:'Ch. 41 — The Last Tide',
    text:'That ending GUTTED me. I’ve re-read the last three paragraphs four times — the way the map finally makes sense, I actually screamed into a pillow. Please tell me there’s a sequel.',
    time:'18m', likes:42, replies:3, kind:'praise', unread:true, resolved:false },
  { id:'c2', reader:'Tom Vesely', handle:'@tomreads', av:AV[4], book:'The Lantern of Vorth', chapter:'Ch. 12 — Where the Light Goes',
    text:'Quick question — is the Hollow the same darkness from chapter 3, or a different entity entirely? I might be missing a detail but I want to make sure I’m tracking it right.',
    time:'1h', likes:9, replies:1, kind:'question', unread:true, resolved:false },
  { id:'c3', reader:'Marisol Reyes', handle:'@solwrites', av:AV[0], book:'Honeyed Ash', chapter:'Ch. 23 — The Customers',
    text:'The bakery-that-isn’t-on-any-map is such a cozy, eerie concept. The croissant scene made me hungry and unsettled at the same time. Chef’s kiss.',
    time:'3h', likes:31, replies:0, kind:'praise', unread:true, resolved:false },
  { id:'c4', reader:'Derek H.', handle:'@derek_h', av:AV[6], book:'Saltblood', chapter:'Ch. 38 — Cartographer’s Knot',
    text:'Pacing dipped a little here for me — the middle of this chapter felt like it repeated the tension from ch.36 without adding much. Still loving the book overall though.',
    time:'5h', likes:4, replies:2, kind:'critique', unread:true, resolved:false },
  { id:'c5', reader:'Priya Anand', handle:'@priya.reads', av:AV[1], book:'North of Tomorrow', chapter:'Ch. 29 — The Frozen Coast',
    text:'I drove this exact coastline last winter and you captured the light perfectly. This whole chapter felt like a memory I didn’t know I had.',
    time:'8h', likes:27, replies:1, kind:'praise', unread:true, resolved:false },
  { id:'c6', reader:'J. Mbeki', handle:'@jmbeki', av:AV[3], book:'The Lantern of Vorth', chapter:'Ch. 12 — Where the Light Goes',
    text:'Typo near the end: “she striked the flint” should be “struck.” Tiny thing, gorgeous chapter.',
    time:'Yesterday', likes:6, replies:0, kind:'question', unread:true, resolved:false },
  { id:'c7', reader:'Lena Fischer', handle:'@lenaf', av:AV[5], book:'Honeyed Ash', chapter:'Ch. 22 — Opening Day',
    text:'When does the next chapter drop? I have been refreshing like a maniac. No pressure. Okay, some pressure.',
    time:'Yesterday', likes:18, replies:1, kind:'question', unread:true, resolved:false },
  { id:'c8', reader:'Owen Park', handle:'@owen', av:AV[7], book:'Saltblood', chapter:'Ch. 40 — Three Oceans',
    text:'The slow burn is paying off so well. Thank you for trusting readers to wait for it.',
    time:'2d', likes:53, replies:4, kind:'praise', unread:false, resolved:true },
  { id:'c9', reader:'Amara Cole', handle:'@amarareads', av:AV[0], book:'North of Tomorrow', chapter:'Ch. 27 — Ashes',
    text:'Resolved my earlier confusion after re-reading — the two timelines clicked. Brilliant structure.',
    time:'3d', likes:12, replies:0, kind:'praise', unread:false, resolved:true },
];

export interface Faq { cat: string; q: string; a: string; }
export const FAQS: Faq[] = [
  { cat:'Payments', q:'When and how do I get paid?',
    a:'Earnings accrue in real time and settle to your available balance daily. Once you’re above the $50 minimum, payouts run automatically on the 1st of each month to your default method. You can also withdraw manually any time from the Money page.' },
  { cat:'Publishing', q:'Can I schedule a chapter to publish later?',
    a:'Yes. In the editor, set a chapter’s status to “In review,” then use the Publish menu to pick a future date and time. Scheduled chapters appear with a clock icon in your manuscript outline.' },
  { cat:'Account', q:'How do I change my pen name?',
    a:'Open Settings → Profile and edit the Pen name field. Your pen name is what readers see across READOM; your legal name stays private and is only used for payouts and tax forms.' },
  { cat:'Readers', q:'Can I hide or block a specific reader’s comments?',
    a:'On any comment, use the ⋯ menu to hide it from your feed or block the reader. Blocked readers can still read your work but can no longer comment or message you.' },
  { cat:'Content', q:'What file types can I import into the editor?',
    a:'The editor extracts text from Word (.docx), PDF, Markdown (.md), plain text (.txt), HTML and .rtf files, plus shared Google Docs links. Author comments and formatting you add stay inside READOM and never appear in reader-facing exports.' },
  { cat:'Account', q:'Is my work backed up?',
    a:'Every keystroke autosaves and we keep 30 days of version history per chapter. You can export a full manuscript backup as .txt or Markdown at any time from the editor’s Export menu.' },
];

export interface Ticket { id: string; subject: string; status: 'Open' | 'Pending' | 'Resolved'; updated: string; agent: string; }
export const TICKETS: Ticket[] = [
  { id:'#48213', subject:'Chapter cover image won’t upload', status:'Open', updated:'2h ago', agent:'Priya · Support' },
  { id:'#47980', subject:'Payout method verification', status:'Pending', updated:'1d ago', agent:'Marco · Payments' },
  { id:'#47612', subject:'Markdown import dropped my headings', status:'Resolved', updated:'4d ago', agent:'Sam · Support' },
];

export const PAGE_META: Record<string, { crumb: string; h: string; eyebrow: string; title: string; sub: string }> = {
  dashboard: { crumb: 'Main page', h: 'Dashboard', eyebrow: 'Welcome back, Dmytro', title: 'Here’s how your stories are doing', sub: 'A live snapshot of your readership, earnings, and library across READOM.' },
  books: { crumb: 'Library', h: 'Your books', eyebrow: 'Library', title: 'Your books', sub: 'Everything you’ve written on READOM — published, ongoing, and in draft.' },
  analytics: { crumb: 'Insights', h: 'Analytics', eyebrow: 'Insights', title: 'Analytics', sub: 'How readers are finding, reading, and finishing your stories across READOM.' },
  money: { crumb: 'Finance', h: 'Money', eyebrow: 'Finance', title: 'Money', sub: 'Your balance, payouts, and where every dollar of your earnings comes from.' },
  comments: { crumb: 'Community', h: 'Comments', eyebrow: 'Community', title: 'Comments', sub: 'What readers are saying across your books — reply, resolve, and keep the conversation going.' },
  settings: { crumb: 'Workspace', h: 'Settings', eyebrow: 'Workspace', title: 'Settings', sub: 'Manage your public profile, notifications, privacy, and account.' },
  support: { crumb: 'Help', h: 'IT support', eyebrow: 'Help', title: 'IT support', sub: 'Search the help center, check system status, or reach a human — fast.' },
  book:  { crumb: 'Library / Book', h: 'Book overview', eyebrow: '', title: '', sub: '' },
  write: { crumb: 'Editor', h: 'Editor', eyebrow: '', title: '', sub: '' },
};
