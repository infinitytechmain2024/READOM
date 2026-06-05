import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { genres } from '@/data/books';

interface CategoryChipsProps {
  active: string;
  onSelect: (id: string) => void;
}

/** YouTube-style horizontally scrollable category chip row. */
const CategoryChips = ({ active, onSelect }: CategoryChipsProps) => {
  const { t } = useTranslation();

  const chips = [
    { id: 'all', label: t('genres.all') },
    { id: 'popular', label: t('app.trending') },
    { id: 'new', label: t('app.new') },
    ...genres.filter((g) => g.id !== 'all').map((g) => ({ id: g.id, label: t(g.key) })),
  ];

  return (
    <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex gap-3 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((chip) => {
          const isActive = active === chip.id;
          return (
            <motion.button
              key={chip.id}
              onClick={() => onSelect(chip.id)}
              whileTap={{ scale: 0.95 }}
              className={`shrink-0 h-8 px-3.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground/80 hover:bg-foreground/10'
              }`}
            >
              {chip.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChips;
