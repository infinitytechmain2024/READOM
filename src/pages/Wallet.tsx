import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Coins, Copy, Send, ArrowDownLeft, ArrowUpRight, ShieldCheck, ShieldAlert,
  Blocks, BookOpen, Gift, Sparkles, HardDrive, Cloud, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import TopBar from '@/components/app/TopBar';
import Sidebar from '@/components/app/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNetworkExplorer, useReadWallet } from '@/hooks/useReadWallet';
import {
  CHAPTER_REWARD, DAILY_REWARD_CAP, WELCOME_BONUS, TOKEN_SYMBOL,
  isAddress, verifyChain, type Block,
} from '@/integrations/readnet';

const short = (s: string, head = 8, tail = 6) => (s.length > head + tail + 1 ? `${s.slice(0, head)}…${s.slice(-tail)}` : s);
const fmtDate = (iso: string, lang: string) =>
  new Date(iso).toLocaleString(lang, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const KIND_ICON = { mint: Sparkles, reward: BookOpen, tip: Gift, transfer: Send } as const;

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <section className={`rounded-2xl border border-border bg-card p-5 ${className}`}>{children}</section>
);

const Wallet = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, wallet, transfer } = useReadWallet();
  const explorer = useNetworkExplorer(15);

  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [verifying, setVerifying] = useState(false);

  const toggleSidebar = () => (isMobile ? setMobileOpen((v) => !v) : setSidebarExpanded((v) => !v));
  const mainPad = sidebarExpanded ? 'lg:pl-60' : 'lg:pl-[72px]';

  const w = wallet.data;
  const mode = w?.mode ?? explorer.data?.mode;

  const copyAddress = async () => {
    if (!w) return;
    try {
      await navigator.clipboard.writeText(w.address);
      toast.success(t('readnet.copied'));
    } catch {
      /* clipboard can be unavailable (insecure context); the address is still selectable */
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    transfer.mutate(
      { to: to.trim(), amount: Number(amount), memo },
      { onSuccess: () => { setTo(''); setAmount(''); setMemo(''); } },
    );
  };

  const verify = async () => {
    if (!explorer.data) return;
    setVerifying(true);
    try {
      const r = await verifyChain(explorer.data.blocks);
      if (r.ok) toast.success(t('readnet.verifyOk', { count: r.checked }));
      else toast.error(t('readnet.verifyFail', { height: r.brokenAt }));
    } finally {
      setVerifying(false);
    }
  };

  const direction = (b: Block) => (w && b.to === w.address ? 'in' : 'out');

  return (
    <div className="min-h-screen bg-background">
      <TopBar onToggleSidebar={toggleSidebar} />
      <Sidebar
        expanded={sidebarExpanded}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeGenre="wallet"
        onSelectGenre={() => navigate('/')}
      />

      <div className={`pt-14 transition-[padding] duration-200 ${mainPad}`}>
        <main className="px-4 pb-16 pt-6 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground flex items-center gap-2">
              <Coins className="h-7 w-7 text-primary" /> {t('readnet.network')}
            </h1>
            {mode && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {mode === 'local' ? <HardDrive className="h-3.5 w-3.5" /> : <Cloud className="h-3.5 w-3.5" />}
                {mode === 'local' ? t('readnet.modeLocal') : t('readnet.modeSupabase')}
              </span>
            )}
          </div>

          {!user ? (
            <Card className="text-center py-12">
              <Coins className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="font-display font-bold text-xl text-foreground">{t('readnet.signInTitle')}</h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">{t('readnet.signInBody')}</p>
              <Link to="/auth"><Button className="rounded-full mt-5">{t('nav.signIn')}</Button></Link>
            </Card>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {/* Balance */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-primary/15 via-card to-card">
                <p className="text-sm font-medium text-muted-foreground">{t('readnet.balance')}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  {wallet.isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <span className="font-display font-extrabold text-5xl text-foreground tabular-nums">
                        {(w?.balance ?? 0).toLocaleString(i18n.language)}
                      </span>
                      <span className="font-display font-bold text-xl text-primary">{TOKEN_SYMBOL}</span>
                    </>
                  )}
                </div>
                {wallet.error && <p className="mt-2 text-sm text-destructive">{(wallet.error as Error).message}</p>}
                {w && (
                  <div className="mt-5">
                    <p className="text-xs font-medium text-muted-foreground mb-1">{t('readnet.address')}</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 min-w-0 truncate rounded-lg bg-secondary px-3 py-2 text-sm text-foreground select-all">
                        {w.address}
                      </code>
                      <Button variant="outline" size="sm" className="rounded-full shrink-0" onClick={copyAddress}>
                        <Copy className="h-4 w-4 mr-1" /> {t('readnet.copy')}
                      </Button>
                    </div>
                  </div>
                )}
                {mode === 'local' && (
                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t('readnet.localHint')}</p>
                )}
              </Card>

              {/* How to earn */}
              <Card>
                <h2 className="font-display font-bold text-foreground mb-3">{t('readnet.howToEarn')}</h2>
                <ul className="space-y-3 text-sm text-foreground/85">
                  <li className="flex gap-2"><BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />{t('readnet.earnRead', { amount: CHAPTER_REWARD })}</li>
                  <li className="flex gap-2"><ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />{t('readnet.earnCap', { cap: DAILY_REWARD_CAP })}</li>
                  <li className="flex gap-2"><Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />{t('readnet.earnWelcome', { amount: WELCOME_BONUS })}</li>
                </ul>
              </Card>

              {/* Send */}
              <Card>
                <h2 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                  <Send className="h-4 w-4 text-primary" /> {t('readnet.send')}
                </h2>
                <form onSubmit={submit} className="space-y-3">
                  <Input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder={t('readnet.to')}
                    aria-label={t('readnet.to')}
                    spellCheck={false}
                    className="font-mono text-xs"
                  />
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))}
                    inputMode="numeric"
                    placeholder={`${t('readnet.amount')}, ${TOKEN_SYMBOL}`}
                    aria-label={t('readnet.amount')}
                  />
                  <Input
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    maxLength={140}
                    placeholder={t('readnet.memo')}
                    aria-label={t('readnet.memo')}
                  />
                  <Button
                    type="submit"
                    className="w-full rounded-full"
                    disabled={!isAddress(to) || !Number(amount) || transfer.isPending}
                  >
                    {transfer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('readnet.sendBtn')}
                  </Button>
                </form>
              </Card>

              {/* History */}
              <Card className="lg:col-span-2">
                <h2 className="font-display font-bold text-foreground mb-3">{t('readnet.history')}</h2>
                {w && w.history.length === 0 && <p className="text-sm text-muted-foreground">{t('readnet.noHistory')}</p>}
                <ul className="divide-y divide-border">
                  {w?.history.map((b) => {
                    const Icon = KIND_ICON[b.kind];
                    const dir = direction(b);
                    return (
                      <li key={b.hash} className="flex items-center gap-3 py-2.5">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${dir === 'in' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{t(`readnet.kinds.${b.kind}`)}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {dir === 'in' ? <ArrowDownLeft className="inline h-3 w-3" /> : <ArrowUpRight className="inline h-3 w-3" />}{' '}
                            {dir === 'in' ? short(b.from) : short(b.to)} · {fmtDate(b.ts, i18n.language)} · #{b.height}
                          </p>
                        </div>
                        <span className={`text-sm font-semibold tabular-nums ${dir === 'in' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {dir === 'in' ? '+' : '−'}{b.amount} {TOKEN_SYMBOL}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </div>
          )}

          {/* Explorer */}
          <Card className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="font-display font-bold text-foreground flex items-center gap-2">
                <Blocks className="h-4 w-4 text-primary" /> {t('readnet.explorer')}
              </h2>
              <Button variant="outline" size="sm" className="rounded-full" onClick={verify} disabled={!explorer.data?.blocks.length || verifying}>
                {verifying ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <ShieldCheck className="h-4 w-4 mr-1" />}
                {t('readnet.verify')}
              </Button>
            </div>

            {explorer.error ? (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" /> {(explorer.error as Error).message}
              </p>
            ) : (
              <>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    [t('readnet.height'), explorer.data ? `#${Math.max(0, explorer.data.stats.height)}` : '—'],
                    [t('readnet.supply'), explorer.data ? `${explorer.data.stats.supply.toLocaleString(i18n.language)} ${TOKEN_SYMBOL}` : '—'],
                    [t('readnet.wallets'), explorer.data?.stats.wallets ?? '—'],
                    [t('readnet.head'), explorer.data ? short(explorer.data.stats.headHash, 6, 6) : '—'],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-xl bg-secondary px-3 py-2.5">
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="font-display font-bold text-foreground truncate font-mono">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-border">
                      {[...(explorer.data?.blocks ?? [])].reverse().map((b) => (
                        <tr key={b.hash} className="text-foreground/85">
                          <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">#{b.height}</td>
                          <td className="py-2 pr-3 whitespace-nowrap">{t(`readnet.kinds.${b.kind}`)}</td>
                          <td className="py-2 pr-3 font-mono text-xs whitespace-nowrap">{short(b.from, 6, 4)} → {short(b.to, 6, 4)}</td>
                          <td className="py-2 pr-3 text-right tabular-nums whitespace-nowrap">{b.amount} {TOKEN_SYMBOL}</td>
                          <td className="py-2 font-mono text-xs text-muted-foreground whitespace-nowrap" title={b.hash}>{b.hash.slice(0, 10)}…</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Wallet;
