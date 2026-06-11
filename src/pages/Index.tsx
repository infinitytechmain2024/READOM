import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TopBar from '@/components/app/TopBar';
import Sidebar from '@/components/app/Sidebar';
import CategoryChips from '@/components/app/CategoryChips';
import FeaturedSpotlight from '@/components/app/FeaturedSpotlight';
import BookGrid from '@/components/app/BookGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import { mockBooks } from '@/data/books';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? '';
  // Desktop sidebar starts expanded; mobile drawer starts closed.
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [category, setCategory] = useState('all');

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen((v) => !v);
    else setSidebarExpanded((v) => !v);
  };

  const best = mockBooks.filter((b) => b.isRecommended);
  const newBooks = mockBooks.filter((b) => b.isNew);
  const popular = mockBooks.filter((b) => b.isPopular);

  // Featured = highest rated recommended book.
  const featured = [...best].sort((a, b) => b.rating - a.rating)[0] ?? mockBooks[0];

  const isHome = category === 'all';

  const filtered =
    category === 'popular' ? popular
    : category === 'new' ? newBooks
    : mockBooks.filter((b) => b.genre === category);

  // Main content offset must follow the desktop sidebar width.
  const mainPad = sidebarExpanded ? 'lg:pl-60' : 'lg:pl-[72px]';

  return (
    <div className="min-h-screen bg-background">
      <TopBar onToggleSidebar={toggleSidebar} />
      <Sidebar
        expanded={sidebarExpanded}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeGenre={category}
        onSelectGenre={setCategory}
      />

      <div className={`pt-14 transition-[padding] duration-200 ${mainPad}`}>
        <CategoryChips active={category} onSelect={setCategory} />

        <main className="px-4 pb-16 pt-5 max-w-[1600px] mx-auto">
          {isHome && user && (
            <div className="mb-6 rounded-2xl bg-primary/10 border border-primary/20 px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground">
                  {firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t('sections.best')} — here's what's trending for you today.
                </p>
              </div>
              <a
                href="/READOM/scriptorium"
                className="shrink-0 text-sm font-semibold text-primary border border-primary/40 rounded-full px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {t('app.write')}
              </a>
            </div>
          )}

          {isHome ? (
            <>
              <FeaturedSpotlight book={featured} />
              <BookGrid titleKey="sections.best" books={best} />
              <BookGrid titleKey="sections.newBooks" books={newBooks} />
              <BookGrid titleKey="sections.popular" books={popular} />
            </>
          ) : (
            <>
              <h1 className="font-display font-bold text-2xl text-foreground mb-1">
                {category === 'popular' ? t('sections.popular')
                  : category === 'new' ? t('sections.newBooks')
                  : t(`genres.${category}`)}
              </h1>
              {filtered.length > 0 ? (
                <BookGrid books={filtered} />
              ) : (
                <p className="text-muted-foreground mt-8">{t('hero.noResults')}</p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
