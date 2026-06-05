import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, BookOpen, BookOpenText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBookMeta, type Book } from '@/data/books';

interface FeaturedSpotlightProps {
  book: Book;
}

/** Large hero card that drops the reader straight into the book — the "autoplay" of READOM. */
const FeaturedSpotlight = ({ book }: FeaturedSpotlightProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const meta = getBookMeta(book);

  const read = () => navigate(`/book/${book.id}`);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Ambient cover backdrop */}
      <div className="absolute inset-0">
        <img src={book.cover} alt="" aria-hidden className="w-full h-full object-cover scale-110 blur-2xl opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
      </div>

      <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
        <button
          onClick={read}
          aria-label={t('app.startReadingNow')}
          className="group relative shrink-0 w-36 sm:w-44 aspect-[2/3] rounded-xl shadow-2xl bg-secondary
            [transform-origin:left_center] transition-transform duration-500 ease-out will-change-transform
            hover:[transform:perspective(1200px)_rotateY(-12deg)]"
        >
          {/* clip layer so the cover + peel stay inside the rounded card */}
          <span className="absolute inset-0 overflow-hidden rounded-xl">
            <img src={book.cover} alt={book.title} loading="eager" decoding="async" className="w-full h-full object-cover" />

            {/* book-related hover overlay */}
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <BookOpenText className="h-6 w-6" />
              </span>
            </span>

            {/* recess/shadow revealed under the lifting corner */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 border-solid border-transparent
                border-b-black/45 border-0 transition-all duration-500 ease-out
                group-hover:border-b-[66px] group-hover:border-l-[66px] blur-[2px]"
            />
          </span>

          {/* the page corner itself, folding up like an opening book */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 border-solid border-transparent
              border-b-[hsl(40_30%_92%)] border-0 transition-all duration-500 ease-out
              group-hover:border-b-[58px] group-hover:border-l-[58px]
              [filter:drop-shadow(-4px_-4px_5px_rgba(0,0,0,0.45))]"
          />
        </button>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary text-xs font-semibold px-3 py-1 mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            {t('app.featured')}
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-foreground leading-tight">
            {book.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {book.author} · {meta.year} · {t(`genres.${book.genre}`)}
          </p>

          <div className="mt-2 flex items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-primary">
              <Star className="h-4 w-4 fill-primary" /> {book.rating}
            </span>
            <span>{meta.pages} {t('app.pages')}</span>
            <span>{Intl.NumberFormat('en', { notation: 'compact' }).format(meta.readers)} {t('app.readers')}</span>
          </div>

          <p className="mt-3 text-sm sm:text-base text-foreground/80 line-clamp-2 max-w-2xl">
            {book.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <Button onClick={read} size="lg" className="rounded-full px-7 h-12 font-bold glow-gold">
              <BookOpen className="h-5 w-5 mr-1" />
              {t('app.startReadingNow')}
            </Button>
            <Button onClick={read} size="lg" variant="outline" className="rounded-full px-6 h-12 border-border">
              {t('app.preview')}
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedSpotlight;