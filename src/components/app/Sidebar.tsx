import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  Home, Flame, Sparkles, Library, Clock, Heart, PenLine,
  LayoutGrid, Briefcase, Brain, Wand2, Rocket, Lightbulb,
  User, Skull, Search, type LucideIcon,
} from 'lucide-react';
import { genres } from '@/data/books';

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid, Briefcase, Brain, Sparkles, Wand2, Rocket,
  Lightbulb, User, Skull, Heart, Search,
};

interface SidebarProps {
  /** Expanded shows labels; collapsed shows an icon rail (desktop only). */
  expanded: boolean;
  /** Whether the mobile drawer overlay is open. */
  mobileOpen: boolean;
  onClose: () => void;
  activeGenre: string;
  onSelectGenre: (id: string) => void;
}

const Sidebar = ({ expanded, mobileOpen, onClose, activeGenre, onSelectGenre }: SidebarProps) => {
  const { t } = useTranslation();

  const primaryLinks = [
    { id: 'all', icon: Home, label: t('app.home') },
    { id: 'popular', icon: Flame, label: t('app.trending') },
    { id: 'new', icon: Sparkles, label: t('app.new') },
  ];

  const libraryLinks = [
    { icon: Library, label: t('app.library') },
    { icon: Clock, label: t('app.continue') },
    { icon: Heart, label: t('app.favorites') },
    { icon: PenLine, label: t('app.write') },
  ];

  const showLabels = expanded || mobileOpen;

  const itemBase =
    'flex items-center rounded-xl text-sm font-medium transition-colors cursor-pointer';

  const railWidth = mobileOpen
    ? 'w-64'
    : expanded
      ? 'lg:w-60'
      : 'lg:w-[72px]';

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed left-0 top-14 bottom-0 z-50 overflow-y-auto bg-background border-r border-border px-3 py-4',
          'transition-transform duration-300 lg:transition-[width] lg:duration-200',
          railWidth,
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <nav className="flex flex-col gap-1">
          {primaryLinks.map(({ id, icon: Icon, label }) => {
            const active = activeGenre === id;
            return (
              <button
                key={id}
                onClick={() => { onSelectGenre(id); onClose(); }}
                className={[
                  itemBase,
                  showLabels ? 'gap-4 px-3 h-10' : 'flex-col gap-1 h-16 justify-center',
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground',
                ].join(' ')}
              >
                <Icon className={showLabels ? 'h-5 w-5 shrink-0' : 'h-5 w-5'} />
                <span className={showLabels ? '' : 'text-[10px]'}>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="my-3 border-t border-border" />

        <nav className="flex flex-col gap-1">
          {showLabels && (
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('app.you')}
            </p>
          )}
          {libraryLinks.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className={[
                itemBase,
                'text-foreground/80 hover:bg-foreground/5 hover:text-foreground',
                showLabels ? 'gap-4 px-3 h-10' : 'flex-col gap-1 h-16 justify-center',
              ].join(' ')}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className={showLabels ? '' : 'text-[10px]'}>{label}</span>
            </div>
          ))}
        </nav>

        {showLabels && (
          <>
            <div className="my-3 border-t border-border" />
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('sections.genres')}
            </p>
            <nav className="flex flex-col gap-1">
              {genres.map((g) => {
                const Icon = iconMap[g.icon] ?? LayoutGrid;
                const active = activeGenre === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => { onSelectGenre(g.id); onClose(); }}
                    className={[
                      itemBase, 'gap-4 px-3 h-10',
                      active
                        ? 'bg-primary/15 text-primary'
                        : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground',
                    ].join(' ')}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{t(g.key)}</span>
                  </button>
                );
              })}
            </nav>
          </>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
