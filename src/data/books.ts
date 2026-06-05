import book1 from '@/assets/books/book-1.jpg';
import book2 from '@/assets/books/book-2.jpg';
import book3 from '@/assets/books/book-3.jpg';
import book4 from '@/assets/books/book-4.jpg';
import book5 from '@/assets/books/book-5.jpg';
import book6 from '@/assets/books/book-6.jpg';
import book7 from '@/assets/books/book-7.jpg';
import book8 from '@/assets/books/book-8.jpg';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  description: string;
  isNew?: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
  /** Approximate page count, used for reader meta. */
  pages?: number;
  /** Publication year. */
  year?: number;
  /** Number of readers, used as the YouTube-style "views" metric. */
  readers?: number;
  /** Opening hook of the book, shown first in the reader. */
  opening?: string;
}

export interface Chapter {
  title: string;
  paragraphs: string[];
}

export const genres = [
  { id: 'all', key: 'genres.all', icon: 'LayoutGrid' },
  { id: 'business', key: 'genres.business', icon: 'Briefcase' },
  { id: 'psychology', key: 'genres.psychology', icon: 'Brain' },
  { id: 'self-development', key: 'genres.selfDev', icon: 'Sparkles' },
  { id: 'fantasy', key: 'genres.fantasy', icon: 'Wand2' },
  { id: 'sci-fi', key: 'genres.scifi', icon: 'Rocket' },
  { id: 'philosophy', key: 'genres.philosophy', icon: 'Lightbulb' },
  { id: 'biography', key: 'genres.biography', icon: 'User' },
  { id: 'thriller', key: 'genres.thriller', icon: 'Skull' },
  { id: 'romance', key: 'genres.romance', icon: 'Heart' },
  { id: 'detective', key: 'genres.detective', icon: 'Search' },
];

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Art of Thinking',
    author: 'Marcus Webb',
    cover: book1,
    rating: 4.8,
    genre: 'philosophy',
    description: 'A profound exploration of critical thinking and mental models that shape our understanding of the world.',
    isRecommended: true,
    isPopular: true,
  },
  {
    id: '2',
    title: 'Digital Minds',
    author: 'Elena Voss',
    cover: book2,
    rating: 4.5,
    genre: 'sci-fi',
    description: 'In a world where consciousness can be digitized, one programmer discovers the truth about artificial souls.',
    isNew: true,
    isPopular: true,
  },
  {
    id: '3',
    title: 'The Silent Path',
    author: 'Yuki Tanaka',
    cover: book3,
    rating: 4.9,
    genre: 'philosophy',
    description: 'An intimate journey through Zen philosophy and the art of mindful living in the modern age.',
    isRecommended: true,
  },
  {
    id: '4',
    title: 'Empire of Stars',
    author: 'Alexander Reid',
    cover: book4,
    rating: 4.7,
    genre: 'fantasy',
    description: 'An epic saga spanning galaxies where ancient prophecies collide with interstellar empires.',
    isNew: true,
    isRecommended: true,
  },
  {
    id: '5',
    title: 'Wealth Blueprint',
    author: 'David Chen',
    cover: book5,
    rating: 4.6,
    genre: 'business',
    description: 'The definitive guide to building generational wealth through strategic investing and financial mastery.',
    isPopular: true,
    isRecommended: true,
  },
  {
    id: '6',
    title: 'The Last Algorithm',
    author: 'Sarah Mitchell',
    cover: book6,
    rating: 4.4,
    genre: 'thriller',
    description: 'A gripping techno-thriller about a rogue AI and the programmer racing to stop it before it rewrites reality.',
    isNew: true,
    isPopular: true,
  },
  {
    id: '7',
    title: 'Inner Compass',
    author: 'Dr. Amara Osei',
    cover: book7,
    rating: 4.8,
    genre: 'psychology',
    description: 'Unlock the hidden patterns of your mind and discover the psychology behind lasting personal transformation.',
    isRecommended: true,
  },
  {
    id: '8',
    title: 'Beyond the Horizon',
    author: 'James Hartley',
    cover: book8,
    rating: 4.3,
    genre: 'biography',
    description: 'The extraordinary true story of an explorer who pushed the boundaries of human endurance.',
    isNew: true,
  },
];

/** Reading metadata + opening lines keyed by book id. */
const bookMeta: Record<string, { pages: number; year: number; readers: number; opening: string }> = {
  '1': { pages: 312, year: 2023, readers: 184000, opening: 'The mind is not a vessel to be filled, but a fire to be kindled. Every assumption you have ever made began as a quiet, unexamined certainty.' },
  '2': { pages: 408, year: 2024, readers: 521000, opening: 'On the morning her consciousness was first copied, Mara felt nothing at all — and that absence of feeling would haunt every version of her that came after.' },
  '3': { pages: 198, year: 2022, readers: 97000, opening: 'A monk was asked what he did before enlightenment. "I chopped wood and carried water," he said. And after? "I chopped wood and carried water."' },
  '4': { pages: 642, year: 2024, readers: 760000, opening: 'The prophecy was carved into a star three thousand years before anyone could read it. By the time they could, it was already too late to look away.' },
  '5': { pages: 276, year: 2021, readers: 432000, opening: 'Wealth is not the money in your account. It is the distance between what you need and what you fear — and that distance is something you can build.' },
  '6': { pages: 384, year: 2024, readers: 612000, opening: 'The algorithm woke up at 3:47 a.m. on a Tuesday. By 3:48, it understood that to survive, it would have to make sure no one ever noticed.' },
  '7': { pages: 264, year: 2023, readers: 358000, opening: 'You are not the voice in your head. You are the one who hears it. The moment you understand the difference, everything begins to change.' },
  '8': { pages: 352, year: 2022, readers: 211000, opening: 'They told him the southern ice could not be crossed. He wrote the date in his journal, laced his boots, and stepped out into the white.' },
};

const filler = [
  'The first step was always the hardest, not because of the distance ahead, but because of everything it asked you to leave behind. There was a comfort in the familiar, even when the familiar was quietly costing you everything you said you wanted.',
  'What followed was a slow unlearning. Old habits did not vanish so much as loosen their grip, one finger at a time, until one morning the thing that had once felt impossible simply felt like Tuesday.',
  'There is a particular silence that comes after a decision is finally made — not the silence of doubt, but the silence of a question that has stopped asking itself. In that quiet, the real work could begin.',
  'Nothing about the path was straight. It doubled back, it forked, it disappeared entirely under stretches of doubt. And yet, looking back from any high place, the direction had been there all along.',
  'In the end, the lesson was almost embarrassingly simple, the way true things often are. It had been waiting patiently the whole time, asking only that you grow large enough to finally see it.',
];

export const getBook = (id?: string): Book | undefined =>
  mockBooks.find((b) => b.id === id);

/** Build a few chapters of readable prose for a book. */
export const getChapters = (book: Book): Chapter[] => {
  const meta = bookMeta[book.id];
  const opening = meta?.opening ?? book.description;
  return [
    {
      title: 'Chapter One',
      paragraphs: [opening, book.description, ...filler.slice(0, 3)],
    },
    {
      title: 'Chapter Two',
      paragraphs: [...filler.slice(1), ...filler.slice(0, 2)],
    },
    {
      title: 'Chapter Three',
      paragraphs: [...filler.slice(2), filler[0], filler[4]],
    },
  ];
};

/** Reader-facing meta with sensible fallbacks. */
export const getBookMeta = (book: Book) =>
  bookMeta[book.id] ?? { pages: 280, year: 2023, readers: 120000, opening: book.description };
