import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Minus, Plus, Star, ChevronLeft, ChevronRight, Play, BookOpen,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Type, Coins, Gift, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBook, getChapters, getBookMeta, mockBooks } from '@/data/books';
import Logo from '@/components/Logo';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useReadWallet } from '@/hooks/useReadWallet';
import { CHAPTER_REWARD, NetworkError, REWARD_COOLDOWN_SECONDS, TOKEN_SYMBOL } from '@/integrations/readnet';

/** A chapter counts as read once scrolled this far… */
const REWARD_PROGRESS = 90;
/** …and open for at least this long (matches the network's reward cooldown). */
const REWARD_DWELL_MS = REWARD_COOLDOWN_SECONDS * 1000;
const TIP_PRESETS = [5, 10, 25, 50];

const FONT_MIN = 16;
const FONT_MAX = 26;

const Reader = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const book = getBook(id);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(19);
  const [progress, setProgress] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [relatedOpen, setRelatedOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { user, wallet, claim, tip } = useReadWallet();
  const chapterOpenedAt = useRef(Date.now());
  const attempted = useRef(new Set<string>());
  const [claimed, setClaimed] = useState<Set<string>>(() => new Set());
  const [tipOpen, setTipOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(10);
  const rewardKey = `${id}#${chapterIndex}`;

  useEffect(() => {
    setChapterIndex(0);
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setProgress(0);
    chapterOpenedAt.current = Date.now();
  }, [chapterIndex, id]);

  // Reading reward: once the chapter is (nearly) scrolled through and has been
  // open long enough, claim it on the READOM Network. One attempt per chapter
  // per visit; the network itself dedupes, rate-limits and caps rewards.
  useEffect(() => {
    if (!user || !id || attempted.current.has(rewardKey)) return;
    const el = scrollRef.current;
    const fits = !!el && el.scrollHeight <= el.clientHeight + 4;
    if (progress < REWARD_PROGRESS && !fits) return;

    const wait = Math.max(0, REWARD_DWELL_MS - (Date.now() - chapterOpenedAt.current));
    const timer = window.setTimeout(() => {
      if (attempted.current.has(rewardKey)) return;
      attempted.current.add(rewardKey);
      claim.mutate(
        { bookId: id, chapter: chapterIndex },
        {
          onSuccess: () => setClaimed((s) => new Set(s).add(rewardKey)),
          onError: (e) => {
            if (e instanceof NetworkError && e.code === 'already_claimed') setClaimed((s) => new Set(s).add(rewardKey));
            // Cooldown: allow a retry on the next scroll event.
            if (e instanceof NetworkError && e.code === 'cooldown') attempted.current.delete(rewardKey);
          },
        },
      );
    }, wait);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, rewardKey, user]);

  const chapters = useMemo(() => (book ? getChapters(book) : []), [book]);

  const related = useMemo(() => {
    if (!book) return [];
    const sameGenre = mockBooks.filter((b) => b.genre === book.genre && b.id !== book.id);
    const others = mockBooks.filter((b) => b.genre !== book.genre && b.id !== book.id);
    return [...sameGenre, ...others].slice(0, 6);
  }, [book]);

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-foreground/80">{t('reader.notFound')}</p>
        <Link to="/">
          <Button className="rounded-full">{t('reader.backToBrowse')}</Button>
        </Link>
      </div>
    );
  }

  const meta = getBookMeta(book);
  const chapter = chapters[chapterIndex];

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
  };

  const goChapter = (delta: number) => {
    setChapterIndex((i) => Math.max(0, Math.min(chapters.length - 1, i + delta)));
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top bar */}
      <header className="shrink-0 h-14 mt-1 flex items-center gap-3 px-3 sm:px-4 border-b border-border bg-background/95 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          aria-label={t('reader.back')}
          className="h-10 w-10 flex items-center justify-center rounded-full text-foreground/80 hover:bg-foreground/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Link to="/" className="text-primary hidden sm:block">
          <Logo className="h-6 w-auto" />
        </Link>

        {/* Book info toggle */}
        <button
          onClick={() => setInfoOpen((v) => !v)}
          aria-label="Информация о книге"
          className="h-10 flex items-center gap-2 px-3 rounded-full text-foreground/80 hover:bg-foreground/10 transition-colors"
        >
          {infoOpen ? (
            <PanelLeftClose className="h-4 w-4 shrink-0" />
          ) : (
            <PanelLeftOpen className="h-4 w-4 shrink-0" />
          )}
          <span className="text-sm font-medium hidden sm:block truncate max-w-[160px]">{book.title}</span>
        </button>

        <div className="flex-1" />

        {/* Tip the author (READ token) */}
        {user && (
          <button
            onClick={() => setTipOpen(true)}
            aria-label={t('readnet.tip')}
            className="h-10 flex items-center gap-2 px-3 rounded-full text-primary hover:bg-primary/10 transition-colors"
          >
            <Gift className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium hidden md:block">{t('readnet.tip')}</span>
          </button>
        )}

        {/* Related toggle */}
        <button
          onClick={() => setRelatedOpen((v) => !v)}
          aria-label={t('reader.upNext')}
          className="hidden xl:flex h-10 items-center gap-2 px-3 rounded-full text-foreground/80 hover:bg-foreground/10 transition-colors"
        >
          <span className="text-sm font-medium">{t('reader.upNext')}</span>
          {relatedOpen ? (
            <PanelRightClose className="h-4 w-4 shrink-0" />
          ) : (
            <PanelRightOpen className="h-4 w-4 shrink-0" />
          )}
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 min-h-0 flex overflow-hidden">

        {/* Book info sidebar (left) */}
        <aside
          className={`shrink-0 overflow-y-auto border-r border-border bg-background transition-all duration-300 ${
            infoOpen ? 'w-72' : 'w-0'
          }`}
        >
          <div className="w-72 p-5 flex flex-col gap-5">
            {/* Cover */}
            <div className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-md">
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            </div>

            {/* Meta */}
            <div>
              <h2 className="font-display font-extrabold text-lg text-foreground leading-tight">{book.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{book.author} · {meta.year}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Star className="h-4 w-4 fill-primary" /> {book.rating}
                </span>
                <span>·</span>
                <span>{t(`genres.${book.genre}`)}</span>
                <span>·</span>
                <span>{meta.pages} {t('app.pages')}</span>
              </div>
            </div>

            {/* Opening quote */}
            {meta.openingText && (
              <blockquote className="border-l-2 border-primary pl-3 text-sm text-foreground/70 italic leading-relaxed">
                {meta.openingText}
              </blockquote>
            )}

            {/* Stats */}
            <div className="rounded-xl bg-secondary p-3 text-sm text-muted-foreground space-y-1">
              <p>{meta.readers.toLocaleString()} читателей</p>
              <p>{chapters.length} главы</p>
            </div>
          </div>
        </aside>

        {/* Scrollable reading column */}
        <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto">
          <article className="mx-auto max-w-2xl px-5 sm:px-8 pt-10 pb-28">
            {/* Book header (compact, shown only when info panel is closed) */}
            {!infoOpen && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1 text-primary">
                    <Star className="h-4 w-4 fill-primary" /> {book.rating}
                  </span>
                  <span>·</span>
                  <span>{t(`genres.${book.genre}`)}</span>
                  <span>·</span>
                  <span>{meta.pages} {t('app.pages')}</span>
                </div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground leading-tight">
                  {book.title}
                </h1>
                <p className="mt-2 text-muted-foreground">{book.author} · {meta.year}</p>
              </div>
            )}

            {/* Chapter switcher */}
            <div className={`flex flex-wrap gap-2 ${infoOpen ? 'mt-0' : ''}`}>
              {chapters.map((c, i) => (
                <button
                  key={c.title}
                  onClick={() => setChapterIndex(i)}
                  className={`h-8 px-3 rounded-lg text-sm font-medium transition-colors ${
                    i === chapterIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground/80 hover:bg-foreground/10'
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>

            <div className="my-7 border-t border-border" />

            {/* Chapter content */}
            <h2 className="font-display font-bold text-xl text-foreground mb-5">{chapter.title}</h2>
            <div
              className="font-body text-foreground/90 space-y-5"
              style={{ fontSize, lineHeight: 1.8 }}
            >
              {chapter.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? 'first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-primary first-letter:mr-2 first-letter:float-left first-letter:leading-[0.8]' : ''}>
                  {p}
                </p>
              ))}
            </div>

            {/* Chapter nav */}
            <div className="mt-12 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => goChapter(-1)}
                disabled={chapterIndex === 0}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> {t('reader.prev')}
              </Button>
              <span className="text-sm text-muted-foreground">
                {chapterIndex + 1} / {chapters.length}
              </span>
              <Button
                onClick={() => goChapter(1)}
                disabled={chapterIndex === chapters.length - 1}
                className="rounded-full"
              >
                {t('reader.next')} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {user && (
              <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                {claimed.has(rewardKey) ? (
                  <><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {t('readnet.rewardDone')}</>
                ) : (
                  <><Coins className="h-3.5 w-3.5 text-primary" /> {t('readnet.rewardHint', { amount: CHAPTER_REWARD })}</>
                )}
              </p>
            )}
          </article>
        </div>

        {/* Up next rail (right) */}
        <aside
          className={`hidden xl:block shrink-0 overflow-y-auto border-l border-border bg-background transition-all duration-300 ${
            relatedOpen ? 'w-80' : 'w-0'
          }`}
        >
          <div className="w-80 p-4">
            <h2 className="flex items-center gap-2 font-display font-bold text-foreground mb-4">
              <BookOpen className="h-4 w-4 text-primary" /> {t('reader.upNext')}
            </h2>
            <div className="flex flex-col gap-3">
              {related.map((b) => (
                <Link
                  key={b.id}
                  to={`/book/${b.id}`}
                  className="group flex gap-3 rounded-xl p-2 hover:bg-foreground/5 transition-colors"
                >
                  <div className="relative shrink-0 w-20 aspect-[3/4] rounded-lg overflow-hidden">
                    <img src={b.cover} alt={b.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-5 w-5 fill-white text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {b.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.author}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Star className="h-3 w-3 fill-primary text-primary" /> {b.rating}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Floating font-size controls — centered bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-full bg-background/95 backdrop-blur-md border border-border shadow-lg px-2 py-1">
        <Type className="h-4 w-4 text-muted-foreground mx-1" />
        <button
          onClick={() => setFontSize((s) => Math.max(FONT_MIN, s - 1))}
          aria-label={t('reader.smaller')}
          className="h-8 w-8 flex items-center justify-center rounded-full text-foreground/80 hover:bg-foreground/10 disabled:opacity-40 transition-colors"
          disabled={fontSize <= FONT_MIN}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-7 text-center text-xs font-medium text-muted-foreground tabular-nums">{fontSize}</span>
        <button
          onClick={() => setFontSize((s) => Math.min(FONT_MAX, s + 1))}
          aria-label={t('reader.larger')}
          className="h-8 w-8 flex items-center justify-center rounded-full text-foreground/80 hover:bg-foreground/10 disabled:opacity-40 transition-colors"
          disabled={fontSize >= FONT_MAX}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Dialog open={tipOpen} onOpenChange={setTipOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" /> {t('readnet.tipTitle', { author: book.author })}
            </DialogTitle>
            <DialogDescription>
              {t('readnet.tipBody', { balance: wallet.data?.balance ?? 0 })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-2">
            {TIP_PRESETS.map((v) => (
              <button
                key={v}
                onClick={() => setTipAmount(v)}
                className={`h-11 rounded-xl text-sm font-semibold transition-colors ${
                  tipAmount === v ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/80 hover:bg-foreground/10'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button
              className="w-full rounded-full"
              disabled={tip.isPending || (wallet.data?.balance ?? 0) < tipAmount}
              onClick={() =>
                tip.mutate(
                  { author: book.author, bookId: book.id, amount: tipAmount },
                  { onSuccess: () => setTipOpen(false) },
                )
              }
            >
              {t('readnet.tipBtn')} · {tipAmount} {TOKEN_SYMBOL}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reader;
