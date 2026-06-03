import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  LayoutGrid, Briefcase, Brain, Sparkles, Wand2, Rocket,
  Lightbulb, User, Skull, Heart, Search, type LucideIcon,
} from 'lucide-react';
import { genres, mockBooks } from '@/data/books';
import BookCard from './BookCard';
import { motion } from 'framer-motion';

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid, Briefcase, Brain, Sparkles, Wand2, Rocket,
  Lightbulb, User, Skull, Heart, Search,
};

const GenreFilter = () => {
  const { t } = useTranslation();
  const [activeGenre, setActiveGenre] = useState('all');

  const filteredBooks = activeGenre === 'all'
    ? mockBooks
    : mockBooks.filter(b => b.genre === activeGenre);

  return (
    <section id="books" className="py-16 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-display font-bold mb-8 text-gray-900"
        >
          {t('sections.books')}
        </motion.h2>

        <h3 className="text-sm font-medium text-gray-500 mb-4">{t('sections.genres')}</h3>

        {/* Genre tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {genres.map(genre => {
            const Icon = iconMap[genre.icon] ?? LayoutGrid;
            const isActive = activeGenre === genre.id;
            return (
              <motion.button
                key={genre.id}
                onClick={() => setActiveGenre(genre.id)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`relative flex items-center gap-2 h-11 px-4 rounded-xl border text-sm font-medium ${
                  isActive
                    ? 'border-primary text-primary-foreground'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-primary/50 hover:text-primary transition-colors'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="genre-active-pill"
                    className="absolute inset-0 -z-0 rounded-xl bg-primary glow-gold"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                  <Icon className="h-4 w-4 shrink-0" />
                  {t(genre.key)}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Books grid */}
        <motion.div
          key={activeGenre}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5"
        >
          {filteredBooks.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GenreFilter;
