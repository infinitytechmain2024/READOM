import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, Globe, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-primary">READOM</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/catalog" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            {t('nav.catalog')}
          </Link>
          <Link to="/categories" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            {t('nav.categories')}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase">{i18n.language}</span>
          </button>
          <Link to="/auth">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex border-border text-foreground hover:border-primary hover:text-primary">
              {t('nav.signIn')}
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button size="sm" className="hidden sm:inline-flex">
              {t('nav.signUp')}
            </Button>
          </Link>
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
