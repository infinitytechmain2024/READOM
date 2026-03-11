import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import BookCard from './BookCard';
import type { Book } from '@/data/books';
import { motion } from 'framer-motion';

interface BookSectionProps {
  titleKey: string;
  books: Book[];
}

const BookSection = ({ titleKey, books }: BookSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-display font-bold"
          >
            {t(titleKey)}
          </motion.h2>
          <button className="flex items-center gap-1 text-sm text-primary hover:text-gold-light transition-colors">
            {t('sections.viewAll')}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {books.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookSection;
