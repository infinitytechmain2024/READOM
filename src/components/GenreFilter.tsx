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
          className="text-3xl sm:text-4xl font-display font-bold mb-8"
        >
          {t('sections.books')}
        </motion.h2>

        <h3 className="text-sm font-medium text-muted-foreground mb-4">{t('sections.genres')}</h3>

        {/* Genre icon tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {genres.map(genre => {
            const Icon = iconMap[genre.icon] ?? LayoutGrid;
            const isActive = activeGenre === genre.id;
            return (
              <button
                key={genre.id}
                onClick={() => setActiveGenre(genre.id)}
                title={t(genre.key)}
                className={`flex items-center justify-center gap-2 h-12 rounded-xl border transition-all duration-200 ${
                  genre.id === 'all' ? 'px-5' : 'w-12'
                } ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary glow-gold'
                    : 'bg-card text-foreground/70 border-border hover:border-primary/50 hover:text-primary'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {genre.id === 'all' && (
                  <span className="text-sm font-semibold uppercase tracking-wide">{t(genre.key)}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Books grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredBooks.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreFilter;
