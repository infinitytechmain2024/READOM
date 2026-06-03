import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Logo from './Logo';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en');
  };

  const links = [
    { label: t('nav.home'), href: '#top' },
    { label: t('nav.download'), href: '#books' },
    { label: t('nav.advantages'), href: '#advantages' },
    { label: t('nav.plans'), href: '#plans' },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Logo className="h-9 w-9" />
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
          <button
            onClick={toggleLang}
            className="hidden sm:flex items-center gap-1 text-sm text-foreground/80 hover:text-primary transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>{i18n.language === 'ru' ? 'Русский' : 'English'}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <Link to="/auth">
            <Button
              variant="outline"
              size="sm"
              className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
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
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 text-sm text-foreground/80 hover:text-primary transition-colors py-1"
            >
              <Globe className="h-4 w-4" />
              <span>{i18n.language === 'ru' ? 'Русский' : 'English'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
