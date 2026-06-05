import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, X, Globe, ChevronDown, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { mockBooks } from '@/data/books';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

interface TopBarProps {
  onToggleSidebar: () => void;
}

const TopBar = ({ onToggleSidebar }: TopBarProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === i18n.language) ?? languages[0];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return mockBooks
      .filter((book) =>
        [book.title, book.author, t(`genres.${book.genre}`), book.genre]
          .some((f) => f.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  }, [query, t]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submit = () => {
    if (results.length > 0) navigate(`/book/${results[0].id}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] h-14 flex items-center gap-2 sm:gap-4 px-3 sm:px-4 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Left: menu + logo */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Menu"
          className="h-10 w-10 flex items-center justify-center rounded-full text-foreground/80 hover:bg-foreground/10 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Logo className="h-6 w-auto" />
          <span className="hidden sm:block font-display font-extrabold tracking-tight text-lg text-foreground">
            {t('brand')}
          </span>
        </Link>
      </div>

      {/* Center: search */}
      <div ref={containerRef} className="relative flex-1 max-w-xl mx-auto">
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder={t('hero.searchPlaceholder')}
              className="w-full h-10 pl-4 pr-9 rounded-l-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary transition-all"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setIsOpen(false); }}
                aria-label={t('hero.clear')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={submit}
            aria-label={t('hero.find')}
            className="h-10 px-5 rounded-r-full bg-secondary border border-l-0 border-border text-foreground/80 hover:bg-foreground/10 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Search dropdown */}
        {isOpen && query.trim() && (
          <div className="absolute z-50 left-0 right-0 top-[calc(100%+0.5rem)] bg-popover border border-border shadow-2xl rounded-xl overflow-hidden max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              results.map((book) => (
                <Link
                  key={book.id}
                  to={`/book/${book.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2.5 hover:bg-foreground/5 transition-colors border-b border-border last:border-0"
                >
                  <img src={book.cover} alt={book.title} className="h-12 w-9 rounded object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-sm text-foreground truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="p-4 text-sm text-muted-foreground text-center">{t('hero.noResults')}</p>
            )}
          </div>
        )}
      </div>

      {/* Right: theme + language + sign in */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <ThemeToggle />
        <div
          className="relative hidden sm:block"
          onMouseEnter={() => setIsLangOpen(true)}
          onMouseLeave={() => setIsLangOpen(false)}
        >
          <button className="flex items-center gap-1 h-10 px-2 rounded-full text-sm text-foreground/80 hover:bg-foreground/10 transition-colors">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">{currentLang.label}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <AnimatePresence>
            {isLangOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1 w-44 origin-top-right bg-popover border border-border rounded-xl p-1.5 shadow-xl"
              >
                {languages.map((lang) => {
                  const active = lang.code === i18n.language;
                  return (
                    <li key={lang.code}>
                      <button
                        onClick={() => { i18n.changeLanguage(lang.code); setIsLangOpen(false); }}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                          active ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-foreground/5'
                        }`}
                      >
                        <span className="text-base leading-none">{lang.flag}</span>
                        <span className="flex-1 text-left">{lang.label}</span>
                        {active && <Check className="h-4 w-4" />}
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <Link to="/auth">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
          >
            {t('nav.signIn')}
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
