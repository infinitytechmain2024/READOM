import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getNetwork, NetworkError, TOKEN_SYMBOL, type Block } from '@/integrations/readnet';

const KEY = ['readnet'] as const;

/** The signed-in user's READ wallet plus actions that move tokens. */
export function useReadWallet() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const userId = user?.id;

  const wallet = useQuery({
    queryKey: [...KEY, 'wallet', userId],
    enabled: !!userId,
    queryFn: async () => {
      const net = await getNetwork();
      const view = await net.openWallet(userId!);
      const history = await net.history(userId!);
      return { ...view, history, mode: net.mode };
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: KEY });

  const describe = (err: unknown) =>
    err instanceof NetworkError ? t(`readnet.errors.${err.code}`) : (err as Error)?.message ?? String(err);

  const requireUser = () => {
    if (!userId) throw new NetworkError('no_wallet');
    return userId;
  };

  const claim = useMutation({
    mutationFn: async (v: { bookId: string; chapter: number }) =>
      (await getNetwork()).claimChapterReward(requireUser(), v.bookId, v.chapter),
    onSuccess: (b: Block) => {
      toast.success(t('readnet.rewardToast', { amount: b.amount, symbol: TOKEN_SYMBOL }));
      invalidate();
    },
    // Reward failures (already claimed, cooldown, cap) are expected and silent.
  });

  const transfer = useMutation({
    mutationFn: async (v: { to: string; amount: number; memo?: string }) =>
      (await getNetwork()).transfer(requireUser(), v.to, v.amount, v.memo),
    onSuccess: (b: Block) => {
      toast.success(t('readnet.sentToast', { amount: b.amount, symbol: TOKEN_SYMBOL }));
      invalidate();
    },
    onError: (e) => toast.error(describe(e)),
  });

  const tip = useMutation({
    mutationFn: async (v: { author: string; bookId: string; amount: number }) =>
      (await getNetwork()).tipAuthor(requireUser(), v.author, v.bookId, v.amount),
    onSuccess: (b: Block) => {
      toast.success(t('readnet.tipToast', { amount: b.amount, symbol: TOKEN_SYMBOL }));
      invalidate();
    },
    onError: (e) => toast.error(describe(e)),
  });

  return { user, wallet, claim, transfer, tip, describe };
}

/** Public explorer data: network stats and the latest blocks. */
export function useNetworkExplorer(limit = 20) {
  return useQuery({
    queryKey: [...KEY, 'explorer', limit],
    queryFn: async () => {
      const net = await getNetwork();
      const [stats, blocks] = await Promise.all([net.stats(), net.latestBlocks(limit)]);
      return { stats, blocks, mode: net.mode };
    },
  });
}
