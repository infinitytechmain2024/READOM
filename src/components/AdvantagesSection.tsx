import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Картинки карточек — лежат в src/assets/advantages/ (по одной на карточку).
import imgChoice from '@/assets/advantages/choice.png';
import imgSimple from '@/assets/advantages/simple.png';
import imgAccess from '@/assets/advantages/access.png';

interface Advantage {
  num: number;
  titleKey: string;
  textKey: string;
  color: string; // accent hex
  image: string;
}

const advantages: Advantage[] = [
  { num: 1, titleKey: 'advantages.choiceTitle', textKey: 'advantages.choiceText', color: '#E8932E', image: imgChoice },
  { num: 2, titleKey: 'advantages.simpleTitle', textKey: 'advantages.simpleText', color: '#5FE83A', image: imgSimple },
  { num: 3, titleKey: 'advantages.accessTitle', textKey: 'advantages.accessText', color: '#D633E8', image: imgAccess },
];

const AdvantagesSection = () => {
  const { t } = useTranslation();

  return (
    <section id="advantages" className="py-20 scroll-mt-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
          {t('advantages.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {advantages.map((adv, i) => (
            <motion.div
              key={adv.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-xl"
            >
              {/* background image */}
              <img
                src={adv.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* color-tinted dark overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${adv.color}40 0%, rgba(10,10,14,0.55) 45%, rgba(10,10,14,0.85) 100%)`,
                }}
              />

              {/* content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center px-7 py-14">
                {/* number badge with glowing nested frames */}
                <div className="relative mb-9 flex items-center justify-center">
                  <span
                    className="absolute rounded-[2px] border"
                    style={{ height: 124, width: 124, borderColor: `${adv.color}55` }}
                  />
                  <span
                    className="absolute rounded-[2px] border"
                    style={{ height: 106, width: 106, borderColor: `${adv.color}99` }}
                  />
                  <div
                    className="relative flex items-center justify-center rounded-[2px] text-3xl font-bold text-black"
                    style={{
                      height: 88,
                      width: 88,
                      background: adv.color,
                      boxShadow: `0 0 45px ${adv.color}b3`,
                    }}
                  >
                    {adv.num}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  {t(adv.titleKey)}
                </h3>
                <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-[18rem] drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                  {t(adv.textKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
