import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Library, MousePointerClick, Globe2, type LucideIcon } from 'lucide-react';

interface Advantage {
  num: number;
  titleKey: string;
  textKey: string;
  icon: LucideIcon;
  color: string;
}

const advantages: Advantage[] = [
  { num: 1, titleKey: 'advantages.choiceTitle', textKey: 'advantages.choiceText', icon: Library, color: '25 90% 55%' },
  { num: 2, titleKey: 'advantages.simpleTitle', textKey: 'advantages.simpleText', icon: MousePointerClick, color: '142 70% 50%' },
  { num: 3, titleKey: 'advantages.accessTitle', textKey: 'advantages.accessText', icon: Globe2, color: '300 75% 60%' },
];

const AdvantagesSection = () => {
  const { t } = useTranslation();

  return (
    <section id="advantages" className="py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-12 text-gradient-gold">
          {t('advantages.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {advantages.map((adv, i) => {
            const Icon = adv.icon;
            return (
              <motion.div
                key={adv.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover-lift"
              >
                {/* glow accent */}
                <div
                  className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-30"
                  style={{ background: `hsl(${adv.color})` }}
                />
                <div className="relative">
                  <div
                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl font-display text-2xl font-bold text-background"
                    style={{
                      background: `hsl(${adv.color})`,
                      boxShadow: `0 0 24px -4px hsl(${adv.color} / 0.6)`,
                    }}
                  >
                    {adv.num}
                  </div>
                  <Icon className="h-7 w-7 mb-4" style={{ color: `hsl(${adv.color})` }} />
                  <h3 className="text-xl font-display font-bold mb-3 text-foreground">
                    {t(adv.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(adv.textKey)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
