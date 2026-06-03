import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface Stage {
  num: number;
  textKey: string;
  color: string;
  glow: string;
}

const stages: Stage[] = [
  { num: 1, textKey: 'plans.stage1', color: '270 70% 65%', glow: '270 70% 65%' },
  { num: 2, textKey: 'plans.stage2', color: '270 70% 65%', glow: '270 70% 65%' },
  { num: 3, textKey: 'plans.stage3', color: '270 70% 65%', glow: '270 70% 65%' },
  { num: 4, textKey: 'plans.stage4', color: '270 70% 65%', glow: '270 70% 65%' },
];

const RoadmapSection = () => {
  const { t } = useTranslation();

  return (
    <section id="plans" className="relative py-24 bg-[hsl(220_18%_4%)] scroll-mt-20 overflow-hidden">
      {/* subtle radial glow backdrop */}
      <div className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 40%, hsl(270 70% 30% / 0.25), transparent 60%)' }} />

      <div className="relative container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-16 text-gradient-gold">
          {t('plans.title')}
        </h2>

        <div className="relative max-w-3xl mx-auto">
          {/* vertical connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-[hsl(270_70%_65%)] opacity-50" />

          <div className="flex flex-col gap-16">
            {stages.map((stage, i) => {
              const isLeft = i % 2 === 0;
              const longLine = (
                <span
                  className="hidden h-px flex-1 opacity-50 sm:block"
                  style={{ backgroundColor: `hsl(${stage.color})` }}
                />
              );
              const shortLine = (
                <span
                  className="hidden h-px w-10 opacity-50 sm:block"
                  style={{ backgroundColor: `hsl(${stage.color})` }}
                />
              );
              const textEl = (
                <p className="text-sm text-foreground/70 whitespace-pre-line leading-relaxed">
                  {t(stage.textKey)}
                </p>
              );
              const runeEl = (
                <div className="hidden shrink-0 sm:block" style={{ color: `hsl(${stage.color})` }}>
                  <Logo className="opacity-80" />
                </div>
              );
              return (
                <motion.div
                  key={stage.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-0"
                >
                  {/* left cell: text hugs the outer edge (long line); rune sits close to the node (short line) */}
                  <div className={`row-start-1 col-start-1 flex items-center gap-3 ${isLeft ? 'text-right' : 'justify-end'}`}>
                    {isLeft ? textEl : runeEl}
                    {isLeft ? longLine : shortLine}
                  </div>

                  {/* node */}
                  <div className="relative z-10 row-start-1 col-start-2 flex items-center justify-center">
                    <div
                      className="relative flex h-12 w-12 rotate-45 items-center justify-center rounded-sm border-2"
                      style={{
                        borderColor: `hsl(${stage.color})`,
                        background: 'hsl(220 18% 4%)',
                        boxShadow: `0 0 24px -2px hsl(${stage.glow} / 0.7)`,
                      }}
                    >
                      <span
                        className="-rotate-45 font-display text-xl font-bold"
                        style={{ color: `hsl(${stage.color})` }}
                      >
                        {stage.num}
                      </span>
                    </div>
                  </div>

                  {/* right cell: rune sits close to the node (short line); text hugs the outer edge (long line) */}
                  <div className={`row-start-1 col-start-3 flex items-center gap-3 ${isLeft ? 'justify-start' : 'text-left'}`}>
                    {isLeft ? shortLine : longLine}
                    {isLeft ? runeEl : textEl}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
