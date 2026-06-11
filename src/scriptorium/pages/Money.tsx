import { useNavigate } from 'react-router-dom';
import { LineChart } from '../charts';
import { Ic } from '../icons';
import { BOOKS } from '../data';
import type { IcName } from '../icons';

const REVENUE_SOURCES = [
  { src: 'Subscriptions', pct: 54, color: '#15B97C', amount: '$1,339' },
  { src: 'Reader tips', pct: 21, color: '#FF5A5A', amount: '$521' },
  { src: 'Chapter unlocks', pct: 16, color: '#FFC400', amount: '$397' },
  { src: 'READOM bonuses', pct: 9, color: '#7B61FF', amount: '$223' },
];

const EARN_MONTHLY = [820, 1100, 980, 1340, 1210, 1680, 1520, 1910, 2080, 2240, 2310, 2480];
const EARN_LABELS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

interface Transaction {
  type: string;
  title: string;
  date: string;
  amount: string;
  sign: string;
  status: string;
  icon: IcName;
  cls: string;
}

const TRANSACTIONS: Transaction[] = [
  { type: 'sub',    title: 'Subscription revenue',          date: 'Jun 1 – Jun 3, 2026', amount: '+$182.40', sign: 'pos', status: 'Cleared', icon: 'money',  cls: 'ti-sub'    },
  { type: 'tip',    title: 'Tip from reader · @nightreads', date: 'Jun 2, 2026',          amount: '+$25.00',  sign: 'pos', status: 'Cleared', icon: 'gift',   cls: 'ti-tip'    },
  { type: 'payout', title: 'Withdrawal to Visa ···· 4218',  date: 'Jun 1, 2026',          amount: '−$1,800.00', sign: 'neg', status: 'Paid',  icon: 'wallet', cls: 'ti-payout' },
  { type: 'bonus',  title: 'Top-author bonus · May',        date: 'May 31, 2026',         amount: '+$120.00', sign: 'pos', status: 'Cleared', icon: 'up',     cls: 'ti-bonus'  },
  { type: 'sub',    title: 'Chapter unlocks · Saltblood',   date: 'May 28, 2026',         amount: '+$64.80',  sign: 'pos', status: 'Cleared', icon: 'card',   cls: 'ti-sub'    },
  { type: 'tip',    title: 'Tip from reader · @mara_v',     date: 'May 26, 2026',         amount: '+$10.00',  sign: 'pos', status: 'Pending', icon: 'gift',   cls: 'ti-tip'    },
];

const Money = () => {
  const navigate = useNavigate();

  const topEarners = [...BOOKS]
    .filter(b => b.earned && b.earned !== '$0')
    .sort((a, b) => parseFloat(b.earned.replace(/[$,]/g, '')) - parseFloat(a.earned.replace(/[$,]/g, '')))
    .slice(0, 4);

  return (
    <div>
      <div className="money-grid">
        <div className="card balance-card">
          <div>
            <div className="bc-label">Available balance</div>
            <div className="bc-amount"><span className="cur">$</span>680<span style={{ fontSize: 38 }}>.40</span></div>
            <div style={{ color: 'var(--muted)', fontWeight: 700, fontSize: 13 }}>Ready to withdraw now</div>
          </div>
          <div className="bc-row">
            <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
              <div className="bc-mini"><span className="v">$420.80</span><span className="l">Pending</span></div>
              <div className="bc-mini"><span className="v">$2,480</span><span className="l">This month</span></div>
              <div className="bc-mini"><span className="v">$18,940</span><span className="l">Lifetime</span></div>
            </div>
            <div className="bc-withdraw">
              <button className="btn btn-withdraw"><Ic.wallet /> Withdraw</button>
            </div>
          </div>
        </div>

        <div className="card payout-card">
          <div className="card-head" style={{ marginBottom: 0 }}>
            <div className="card-title"><span className="tick"></span>Payouts</div>
          </div>
          <div className="next-payout">
            <span className="npi"><Ic.calendar /></span>
            <div className="npt">
              <div className="d">Jul 1, 2026</div>
              <div className="s">Next automatic payout · $680.40</div>
            </div>
          </div>
          <div className="method-row">
            <span className="mi"><Ic.card /></span>
            <div className="mt">
              <div className="n">Visa ···· 4218</div>
              <div className="s">Default payout method</div>
            </div>
            <button className="btn btn-sm btn-ghost">Change</button>
          </div>
          <div className="threshold">
            <div className="top"><span>Payout threshold</span><span>$680 / $50</span></div>
            <div className="bar"><span style={{ width: '100%' }}></span></div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--muted)', marginTop: 8 }}>
              You're above the $50 minimum — payouts run automatically.
            </div>
          </div>
        </div>
      </div>

      <div className="an-grid">
        <div className="card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick"></span>Earnings over time</div>
            <span className="chip chip-up"><Ic.up style={{ width: 13, height: 13 }} />+18% MoM</span>
          </div>
          <LineChart data={EARN_MONTHLY} labels={EARN_LABELS} color="#15B97C" height={250} />
          <div className="chart-legend">
            <div className="it"><span className="ln" style={{ background: '#15B97C' }}></span>Net earnings · last 12 months</div>
            <div className="it">Best month ${Math.max(...EARN_MONTHLY).toLocaleString()}</div>
          </div>
        </div>

        <div className="card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick"></span>Revenue sources</div>
            <span className="card-sub">This month</span>
          </div>
          <div className="src-list">
            {REVENUE_SOURCES.map(s => (
              <div className="src" key={s.src}>
                <div className="top"><span>{s.src}</span><span className="pc">{s.amount}</span></div>
                <div className="track"><span style={{ width: s.pct + '%', background: s.color }}></span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="an-grid" style={{ marginTop: 22 }}>
        <div className="card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick"></span>Top earning books</div>
            <button className="btn btn-sm btn-ghost" onClick={() => navigate('/scriptorium/books')}>View all <Ic.arrow /></button>
          </div>
          <div className="rowlist">
            {topEarners.map((b, i) => (
              <div className="row" key={b.id}>
                <span className="rank">{i + 1}</span>
                <span className="cover-mini" style={{ background: b.cover }}>{b.title[0]}</span>
                <span className="meta"><span className="t">{b.title}</span><span className="s">{b.genre}</span></span>
                <span className="stat" style={{ color: 'var(--green-deep)' }}>{b.earned}<small>earned</small></span>
              </div>
            ))}
          </div>
        </div>

        <div className="card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick"></span>Recent transactions</div>
            <button className="btn btn-sm"><Ic.download /> Statement</button>
          </div>
          <div className="txn-list">
            {TRANSACTIONS.map((t, i) => {
              const Icon = Ic[t.icon];
              return (
                <div className="txn" key={i}>
                  <span className={'ti ' + t.cls}><Icon /></span>
                  <span className="td"><span className="n">{t.title}</span><span className="s">{t.date}</span></span>
                  <span className={'ta ' + t.sign}>{t.amount}</span>
                  <span className={'tstatus ' + (t.status === 'Pending' ? 'chip-yellow' : 'chip-green')}>{t.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Money;
