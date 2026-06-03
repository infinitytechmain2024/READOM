import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe, Menu, X, ChevronDown, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Logo from './Logo';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === i18n.language) ?? languages[0];

  const selectLang = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
  };

  const links = [
    { label: t('nav.home'), href: '#top' },
    { label: t('nav.community'), href: '#community' },
    { label: t('nav.books'), href: '#books' },
    { label: t('nav.advantages'), href: '#advantages' },
    { label: t('nav.plans'), href: '#plans' },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary mt-[14px]">
          <Logo />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div
            className="relative hidden sm:block"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <button
              aria-haspopup="listbox"
              aria-expanded={isLangOpen}
              className="flex items-center gap-1 text-sm text-foreground/80 hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{currentLang.label}</span>
              <motion.span
                animate={{ rotate: isLangOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.ul
                  role="listbox"
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-44 origin-top-right glass-card rounded-xl p-1.5 shadow-xl"
                >
                  {languages.map((lang) => {
                    const isActive = lang.code === i18n.language;
                    return (
                      <li key={lang.code}>
                        <button
                          onClick={() => selectLang(lang.code)}
                          role="option"
                          aria-selected={isActive}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground/80 hover:bg-foreground/5 hover:text-primary'
                          }`}
                        >
                          <span className="text-base leading-none">{lang.flag}</span>
                          <span className="flex-1 text-left">{lang.label}</span>
                          {isActive && <Check className="h-4 w-4" />}
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
              variant="ghost"
              size="sm"
              className="border-0 bg-transparent text-[#FFCC18] hover:bg-transparent hover:text-[#FFCC18]/80 font-extrabold text-[23px]"
            >
              {t('nav.signIn')}
            </Button>
          </Link>
          <button
            className="lg:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden glass-card border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-2 py-1">
              <Globe className="h-4 w-4 text-foreground/80" />
              {languages.map((lang) => {
                const isActive = lang.code === i18n.language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => selectLang(lang.code)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/80 hover:text-primary'
                    }`}
                  >
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
