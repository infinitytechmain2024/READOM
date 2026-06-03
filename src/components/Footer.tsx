import { useTranslation } from 'react-i18next';
import { Apple, Play, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Logo from './Logo';

const Footer = () => {
  const { t, i18n } = useTranslation();

  const columns: { title: string; links: string[] }[] = [
    {
      title: t('footer.main'),
      links: [
        t('footer.home'), t('footer.books'), t('footer.ourPlans'),
        t('footer.becomeMember'), t('footer.genres'), t('footer.allBooks'), t('footer.events'),
      ],
    },
    {
      title: t('footer.premium'),
      links: [t('footer.tariffs'), t('footer.howBuy'), t('footer.free'), t('footer.confirmSub')],
    },
    {
      title: t('footer.users'),
      links: [
        t('footer.privacy'), t('footer.terms'), t('footer.security'),
        t('footer.contentRules'), t('footer.dataChange'), t('footer.faq'),
      ],
    },
    {
      title: t('footer.company'),
      links: [t('footer.career'), t('footer.partners'), t('footer.ads')],
    },
    {
      title: t('footer.writers'),
      links: [t('footer.authorPage'), t('footer.rules'), t('footer.authorRights')],
    },
    {
      title: t('footer.readers'),
      links: [t('footer.readerPage')],
    },
    {
      title: t('footer.social'),
      links: ['Instagram', 'Facebook', 'Twitter/X', 'Telegram channel', 'Viber channel', 'WhatsApp channel'],
    },
  ];

  return (
    <footer className="border-t border-border bg-[hsl(220_18%_4%)]">
      <div className="container mx-auto px-4 py-14">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 mb-10 text-primary">
          <Logo className="h-8 w-8" />
          <span className="font-display text-xl font-bold text-primary">{t('brand')}</span>
        </Link>

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-8 mb-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-sm mb-4 text-foreground">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors leading-snug">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          {/* App store badges */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 h-11 px-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <Play className="h-5 w-5 text-foreground" />
              <span className="text-left leading-none">
                <span className="block text-[10px] text-muted-foreground">GET IT ON</span>
                <span className="block text-sm font-semibold text-foreground">Google Play</span>
              </span>
            </a>
            <a href="#" className="flex items-center gap-2 h-11 px-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
              <Apple className="h-5 w-5 text-foreground" />
              <span className="text-left leading-none">
                <span className="block text-[10px] text-muted-foreground">Download on the</span>
                <span className="block text-sm font-semibold text-foreground">App Store</span>
              </span>
            </a>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-5">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('footer.theme')}</span>
              <Switch />
            </div>
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en')}
              className="flex items-center gap-1 text-sm text-foreground/80 hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{i18n.language === 'ru' ? 'Русский' : 'English'}</span>
            </button>
            <Button size="sm" className="glow-gold">{t('hero.startReading')}</Button>
            <Button size="sm" variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
              {t('hero.startWriting')}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()} {t('brand')}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
