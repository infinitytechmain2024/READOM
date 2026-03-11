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
}

export const genres = [
  { id: 'all', key: 'genres.all' },
  { id: 'business', key: 'genres.business' },
  { id: 'psychology', key: 'genres.psychology' },
  { id: 'self-development', key: 'genres.selfDev' },
  { id: 'fantasy', key: 'genres.fantasy' },
  { id: 'sci-fi', key: 'genres.scifi' },
  { id: 'philosophy', key: 'genres.philosophy' },
  { id: 'biography', key: 'genres.biography' },
  { id: 'thriller', key: 'genres.thriller' },
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
