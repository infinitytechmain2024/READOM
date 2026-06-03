import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Book } from '@/data/books';
import { motion } from 'framer-motion';

interface BookSectionProps {
  titleKey: string;
  books: Book[];
}

const BookSection = ({ titleKey, books }: BookSectionProps) => {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-display font-bold text-gray-900"
          >
            {t(titleKey)}
          </motion.h2>
          <button className="flex items-center gap-1 text-sm text-primary hover:text-gold-light transition-colors">
            {t('sections.more')}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="relative flex items-center gap-3">
          {/* Prev arrow */}
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="hidden md:flex shrink-0 h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Carousel viewport */}
          <div className="overflow-hidden flex-1" ref={emblaRef}>
            <div className="flex gap-4 sm:gap-5">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="shrink-0 basis-[calc((100%-1rem)/2)] sm:basis-[calc((100%-2.5rem)/3)] md:basis-[calc((100%-3.75rem)/4)] lg:basis-[calc((100%-5rem)/5)] xl:basis-[calc((100%-6.25rem)/6)]"
                >
                  <Link to={`/book/${book.id}`} className="group block hover-lift">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                          <span className="text-sm font-medium text-foreground">{book.rating}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-center font-display font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Next arrow */}
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="hidden md:flex shrink-0 h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dots */}
        {scrollSnaps.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === selectedIndex ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookSection;
