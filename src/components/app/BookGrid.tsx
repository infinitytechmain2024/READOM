import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, BookOpenText } from 'lucide-react';
import { getBookMeta, type Book } from '@/data/books';

interface BookGridProps {
  titleKey?: string;
  title?: string;
  books: Book[];
}

const compact = (n: number) => Intl.NumberFormat('en', { notation: 'compact' }).format(n);

const circleVariants = {
  rest: { scale: 0, opacity: 0 },
  hover: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 320, damping: 18 },
  },
};

/** YouTube-style results grid: cover "thumbnail" + meta. Clicking starts reading. */
const BookGrid = ({ titleKey, title, books }: BookGridProps) => {
  const { t } = useTranslation();
  if (books.length === 0) return null;

  return (
    <section className="mt-8">
      {(titleKey || title) && (
        <h2 className="font-display font-bold text-xl text-foreground mb-4">
          {title ?? t(titleKey!)}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-7">
        {books.map((book, i) => {
          const meta = getBookMeta(book);
          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover="hover"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 5) * 0.05 }}
            >
              <Link to={`/book/${book.id}`} className="group block">
                {/* Thumbnail */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Book-open circle: springs in via framer-motion variant propagation */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.span
                      className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl"
                      variants={circleVariants}
                      initial="rest"
                    >
                      <BookOpenText className="h-7 w-7" />
                    </motion.span>
                  </div>

                  {/* Page-corner peel — shadow layer */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 border-solid border-transparent
                      border-b-black/40 border-0 transition-all duration-500 ease-out blur-[2px]
                      group-hover:border-b-[38px] group-hover:border-l-[38px]"
                  />
                  {/* Page-corner peel — paper layer */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 border-solid border-transparent
                      border-b-[hsl(40_30%_92%)] border-0 transition-all duration-500 ease-out
                      group-hover:border-b-[34px] group-hover:border-l-[34px]
                      [filter:drop-shadow(-3px_-3px_4px_rgba(0,0,0,0.35))]"
                  />

                  {/* Badges — z-10 so they float above the page-curl */}
                  <span className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    {book.rating}
                  </span>

                  {book.isNew && (
                    <span className="absolute top-2 left-2 z-10 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                      {t('app.new')}
                    </span>
                  )}
                </div>

                {/* Meta */}
                <div className="mt-2.5 flex gap-3">
                  <span className="mt-0.5 shrink-0 h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold font-display">
                    {book.author.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-sm text-foreground line-clamp-2 leading-snug transition-colors group-hover:text-primary">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {compact(meta.readers)} {t('app.readers')} · {t(`genres.${book.genre}`)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default BookGrid;
