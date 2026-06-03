import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockBooks } from '@/data/books';
import heroImage from '@/assets/hero-library.png';

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return mockBooks.filter((book) =>
      [book.title, book.author, t(`genres.${book.genre}`), book.genre]
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [query, t]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submitSearch = () => {
    if (results.length > 0) {
      navigate(`/book/${results[0].id}`);
    }
  };

  return (
    <section id="top" className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Library" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-2xl pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ color: '#FFCC18' }}
          className="text-shadow-hero text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-10"
        >
          {t('hero.title')}{' '}
          {t('brand')}
        </motion.h1>

        {/* Search panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-5 mb-8"
        >
          <div ref={containerRef} className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full h-14 pl-12 pr-10 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setIsOpen(false); }}
                  aria-label={t('hero.clear')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Results dropdown */}
              {isOpen && query.trim() && (
                <div className="absolute z-20 left-0 right-0 top-[calc(100%+0.5rem)] bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden text-left max-h-80 overflow-y-auto">
                  {results.length > 0 ? (
                    results.map((book) => (
                      <Link
                        key={book.id}
                        to={`/book/${book.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <img src={book.cover} alt={book.title} className="h-14 w-10 rounded object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-display font-semibold text-sm text-gray-900 truncate">{book.title}</p>
                          <p className="text-xs text-gray-500 truncate">{book.author}</p>
                          <p className="text-xs text-gold-dark truncate">{t(`genres.${book.genre}`)}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-gray-500 text-center">{t('hero.noResults')}</p>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={submitSearch}
              style={{ backgroundColor: '#FFCC18' }}
              className="sm:w-32 h-14 font-bold text-black hover:opacity-90 hover:bg-[#FFCC18] glow-gold"
            >
              {t('hero.find')}
            </Button>
          </div>
        </motion.div>

        {/* Community CTA */}
        <motion.h2
          id="community"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ color: '#FFCC18' }}
          className="scroll-mt-24 text-shadow-hero text-2xl sm:text-3xl font-display font-bold mb-5"
        >
          {t('hero.community')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-shadow-hero text-sm sm:text-base text-foreground/90 max-w-xl mx-auto mb-8 leading-relaxed"
        >
          {t('hero.communityText')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button size="lg" className="text-base px-8 h-12 glow-gold">
            {t('hero.startReading')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base px-8 h-12 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            {t('hero.startWriting')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
