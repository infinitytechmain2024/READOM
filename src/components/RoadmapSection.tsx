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
  { num: 1, textKey: 'plans.stage1', color: '142 70% 50%', glow: '142 70% 50%' },
  { num: 2, textKey: 'plans.stage2', color: '270 70% 65%', glow: '270 70% 65%' },
  { num: 3, textKey: 'plans.stage3', color: '270 70% 65%', glow: '270 70% 65%' },
  { num: 4, textKey: 'plans.stage4', color: '43 80% 55%', glow: '43 80% 55%' },
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
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gradient-to-b from-[hsl(142_70%_50%)] via-[hsl(270_70%_65%)] to-[hsl(43_80%_55%)] opacity-50" />

          <div className="flex flex-col gap-16">
            {stages.map((stage, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={stage.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4"
                >
                  {/* text — alternates side */}
                  <div className={isLeft ? 'text-right pr-2' : 'col-start-3 text-left pl-2'}>
                    <p className="text-sm text-foreground/70 whitespace-pre-line leading-relaxed">
                      {t(stage.textKey)}
                    </p>
                  </div>

                  {/* rune on the empty side */}
                  <div
                    className={`hidden sm:block ${isLeft ? 'col-start-3 justify-self-start pl-2' : 'col-start-1 justify-self-end pr-2'}`}
                    style={{ color: `hsl(${stage.color})` }}
                  >
                    <Logo className="h-10 w-10 opacity-80" />
                  </div>

                  {/* node */}
                  <div className="col-start-2 flex items-center justify-center">
                    <div
                      className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 font-display text-xl font-bold"
                      style={{
                        borderColor: `hsl(${stage.color})`,
                        color: `hsl(${stage.color})`,
                        background: 'hsl(220 18% 4%)',
                        boxShadow: `0 0 24px -2px hsl(${stage.glow} / 0.7)`,
                      }}
                    >
                      {stage.num}
                    </div>
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
