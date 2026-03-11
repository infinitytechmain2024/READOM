import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { genres, mockBooks } from '@/data/books';
import BookCard from './BookCard';
import { motion } from 'framer-motion';

const GenreFilter = () => {
  const { t } = useTranslation();
  const [activeGenre, setActiveGenre] = useState('all');

  const filteredBooks = activeGenre === 'all'
    ? mockBooks
    : mockBooks.filter(b => b.genre === activeGenre);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-display font-bold mb-6"
        >
          {t('sections.genres')}
        </motion.h2>

        {/* Genre tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {genres.map(genre => (
            <button
              key={genre.id}
              onClick={() => setActiveGenre(genre.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeGenre === genre.id
                  ? 'bg-primary text-primary-foreground glow-gold'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {t(genre.key)}
            </button>
          ))}
        </div>

        {/* Books grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredBooks.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreFilter;
