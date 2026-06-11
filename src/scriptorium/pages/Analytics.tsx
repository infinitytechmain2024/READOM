import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spark, LineChart, DonutChart } from '../charts';
import { Ic } from '../icons';
import { BOOKS, TOP_BOOKS, AGE_SEGMENTS, TREND } from '../data';

interface Seg { pct: number; color: string; }

const RING_SEG: Seg[] = [
  { pct: 24, color: '#FF5A5A' },
  { pct: 30, color: '#15B97C' },
  { pct: 15, color: '#35C4D6' },
  { pct: 19, color: '#FF9F1C' },
  { pct: 12, color: '#7B61FF' },
];

const rotSeg = (k: number): Seg[] => {
  const a = [...RING_SEG];
  for (let i = 0; i < k; i++) a.push(a.shift()!);
  return a;
};

function RingStat({ value, label, sub, segments = RING_SEG, size = 150, action }: {
  value: string; label: string; sub?: string; segments?: Seg[]; size?: number; action?: ReactNode;
}) {
  const stroke = 12;
  const r = (size - stroke) / 2, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  const gap = 0.022 * circ;
  const [grow, setGrow] = useState(0);
  useEffect(() => {
    let raf = 0, start = 0;
    const dur = 900;
    const tick = (tm: number) => {
      if (!start) start = tm;
      const p = Math.min(1, (tm - start) / dur);
      setGrow(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  let offset = 0;
  const arcs = segments.map((s, i) => {
    const len = (s.pct / 100) * circ;
    const dash = Math.max(0, len * grow - gap);
    const el = (
      <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset * grow} />
    );
    offset += len;
    return el;
  });

  return (
    <div className="ring-stat">
      <div className="donut-wrap" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDECE4" strokeWidth={stroke} />
          {arcs}
        </svg>
        <div className="donut-center">
          <div className="rs-num">{value}</div>
          <div className="rs-lbl">{label}</div>
          {sub && <div className="rs-sub">{sub}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}

function LiveData() {
  return (
    <div className="card hero-card hoverable">
      <div className="hero-title">Live Data</div>
      <div className="live-badge"><span className="live-dot"></span> Updating</div>
      <div className="ring-row">
        <RingStat value="12.9k" label="Subscribers" sub="+128 this week" segments={rotSeg(0)}
          action={<button className="btn btn-yellow btn-sm">Details</button>} />
        <RingStat value="1,204" label="Views" sub="Last 48 hours" segments={rotSeg(2)}
          action={<button className="btn btn-sm">Details</button>} />
      </div>
    </div>
  );
}

function LatestContent() {
  const navigate = useNavigate();
  const books = BOOKS;
  const [i, setI] = useState(0);
  const n = books.length;
  const b = books[i];
  const at = (k: number) => () => setI(Math.max(0, Math.min(n - 1, k)));
  return (
    <div className="card hero-card hoverable">
      <div className="hero-title">Latest Content</div>
      <div className="hero-sub"><span className="bk">{b.title}</span><span className="dot"></span>{b.age} since publishing</div>
      <div className="latest-body">
        <div className="latest-rings">
          <RingStat value={b.reads} label="Views" sub="Last 48 hours" size={138} segments={rotSeg(0)} />
          <RingStat value={b.completion + '%'} label="Avg. completion" size={138} segments={rotSeg(1)} />
          <RingStat value={b.likes} label="Likes" size={138} segments={rotSeg(3)} />
        </div>
        <button className="latest-cover" style={{ background: b.cover, border: '2px solid var(--ink)' }}
          onClick={() => navigate('/scriptorium/books')}>
          <div className="lc-ttl">{b.title}</div>
        </button>
      </div>
      <div className="latest-foot">
        <button className="pager-btn" onClick={at(0)} disabled={i === 0} title="First"><Ic.first /></button>
        <button className="pager-btn" onClick={at(i - 1)} disabled={i === 0} title="Previous"><Ic.back /></button>
        <span className="pager-count">{i + 1}/{n}</span>
        <button className="pager-btn" onClick={at(i + 1)} disabled={i === n - 1} title="Next"><Ic.arrow /></button>
        <button className="pager-btn" onClick={at(n - 1)} disabled={i === n - 1} title="Last"><Ic.last /></button>
      </div>
    </div>
  );
}

const RANGES = ['7 days', '30 days', '90 days', 'All time'] as const;
type Range = typeof RANGES[number];
type Metric = 'views' | 'reads';

interface RangeData { views: number[]; reads: number[]; labels: string[]; }

const RANGE_DATA: Record<Range, RangeData> = {
  '7 days': { views: [5200, 6100, 4300, 7400, 6900, 7600, 9050], reads: [3100, 3600, 2800, 4200, 4050, 4600, 5400], labels: TREND.labels },
  '30 days': {
    views: [28,34,31,40,37,46,42,50,55,49,58,63,60,67,72,69,75,81,78,86,82,90,88,96,93,101,98,107,104,118].map(v => v * 100),
    reads: [16,20,18,24,22,28,26,31,33,30,36,40,38,43,45,42,48,51,49,55,52,58,56,62,60,66,64,70,68,76].map(v => v * 100),
    labels: ['','','','wk 1','','','','','wk 2','','','','','wk 3','','','','','wk 4','','','','','','','','','','',''],
  },
  '90 days': {
    views: [210,240,200,290,315,298,342,360,330,388,402,440].map(v => v * 100),
    reads: [120,140,115,170,180,165,200,215,198,240,250,272].map(v => v * 100),
    labels: ['Apr','','','','May','','','','Jun','','',''],
  },
  'All time': {
    views: [120,180,260,340,420,510,620,760,880,1010,1180,1320].map(v => v * 100),
    reads: [70,110,160,210,280,350,430,520,610,700,820,940].map(v => v * 100),
    labels: ['2023','','','Q4','2024','','','Q4','2025','','','2026'],
  },
};

const TRAFFIC = [
  { src: 'READOM Discover feed', pct: 38, color: '#15B97C' },
  { src: 'Search', pct: 24, color: '#FFC400' },
  { src: 'Author profile', pct: 17, color: '#7B61FF' },
  { src: 'Shared links', pct: 13, color: '#FF9F1C' },
  { src: 'External / other', pct: 8, color: '#FF5A5A' },
];

const COUNTRIES = [
  { code: 'UA', name: 'Ukraine', val: '38.2k', pct: 31 },
  { code: 'PL', name: 'Poland', val: '21.6k', pct: 18 },
  { code: 'US', name: 'United States', val: '18.1k', pct: 15 },
  { code: 'DE', name: 'Germany', val: '12.4k', pct: 10 },
  { code: 'GB', name: 'United Kingdom', val: '9.7k', pct: 8 },
  { code: 'CA', name: 'Canada', val: '6.3k', pct: 5 },
];

const CHAPTER_RETENTION = [
  { n: 1, t: "The Keeper’s Last Night", pct: 100, color: '#15B97C' },
  { n: 2, t: 'Where the Light Goes', pct: 92, color: '#15B97C' },
  { n: 3, t: 'A Door Left Open', pct: 84, color: '#15B97C' },
  { n: 4, t: 'The Hollow Remembers', pct: 76, color: '#FFC400' },
  { n: 5, t: 'Borrowed Names', pct: 63, color: '#FFC400' },
  { n: 6, t: 'What the River Carried', pct: 41, color: '#FF9F1C' },
  { n: 7, t: 'The Long Way Down', pct: 22, color: '#FF5A5A' },
];

const Analytics = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<Range>('7 days');
  const [metric, setMetric] = useState<Metric>('views');
  const d = RANGE_DATA[range];
  const metricColor = metric === 'views' ? '#15B97C' : '#7B61FF';

  const kpis = [
    { k: 'Total views', v: '312k', delta: '+22.6%', up: true, spark: [40,46,42,55,58,62,70,68,82,90], color: '#15B97C' },
    { k: 'Reads', v: '198k', delta: '+18.1%', up: true, spark: [30,32,38,36,44,48,52,58,62,70], color: '#7B61FF' },
    { k: 'New subscribers', v: '12.9k', delta: '+12.4%', up: true, spark: [20,28,24,33,36,32,42,46,48,55], color: '#FFC400' },
    { k: 'Avg. completion', v: '84%', delta: '−1.3%', up: false, spark: [88,86,87,85,86,84,85,83,84,84], color: '#FF5A5A' },
  ];

  return (
    <div>
      <div className="hero-grid">
        <LiveData />
        <LatestContent />
      </div>

      <div className="an-toolbar">
        <div className="range-seg">
          {RANGES.map(r => (
            <button key={r} className={range === r ? 'active' : ''} onClick={() => setRange(r)}>{r}</button>
          ))}
        </div>
        <button className="btn"><Ic.download /> Export report</button>
      </div>

      <div className="kpi-row">
        {kpis.map(m => (
          <div className="kpi" key={m.k}>
            <div className="k">{m.k}</div>
            <div className="v">{m.v}</div>
            <div className="spark"><Spark data={m.spark} color={m.color} /></div>
            <div className={'d' + (m.up ? '' : ' down')}><Ic.up />{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="an-grid">
        <div className="card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick"></span>{metric === 'views' ? 'Views' : 'Reads'} over time</div>
            <div className="toggle-pills">
              <button className={'pill' + (metric === 'views' ? ' active' : '')} onClick={() => setMetric('views')}>Views</button>
              <button className={'pill' + (metric === 'reads' ? ' active' : '')} onClick={() => setMetric('reads')}>Reads</button>
            </div>
          </div>
          <LineChart key={range + metric} data={d[metric]} labels={d.labels} color={metricColor} height={260} />
          <div className="chart-legend">
            <div className="it"><span className="ln" style={{ background: metricColor }}></span>{metric === 'views' ? 'Views' : 'Reads'} · {range}</div>
            <div className="it">Peak {Math.max(...d[metric]).toLocaleString()}</div>
          </div>
        </div>

        <div className="card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick"></span>Traffic sources</div>
          </div>
          <div className="src-list">
            {TRAFFIC.map(t => (
              <div className="src" key={t.src}>
                <div className="top"><span>{t.src}</span><span className="pc">{t.pct}%</span></div>
                <div className="track"><span style={{ width: t.pct + '%', background: t.color }}></span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="an-grid-3">
        <div className="card donut-card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick"></span>Readers by age</div>
          </div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <DonutChart segments={AGE_SEGMENTS} total="12.9k" size={150} />
            <div className="legend" style={{ width: '100%' }}>
              {AGE_SEGMENTS.map((s, i) => (
                <div className="legend-row" key={i}>
                  <span className="sw" style={{ background: s.color }}></span>
                  <span className="lbl">{s.label}</span><span className="pct">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card hoverable" style={{ gridColumn: 'span 2' }}>
          <div className="card-head">
            <div className="card-title"><span className="tick"></span>Chapter retention</div>
            <span className="card-sub">The Lantern of Vorth</span>
          </div>
          <div className="chbar-list">
            {CHAPTER_RETENTION.map(c => (
              <div className="chbar" key={c.n}>
                <span className="lab"><b>{String(c.n).padStart(2, '0')}</b>{c.t}</span>
                <div className="track"><span style={{ width: c.pct + '%', background: c.color }}>{c.pct}%</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="an-grid" style={{ marginTop: 22 }}>
        <div className="card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick"></span>Top books</div>
            <button className="btn btn-sm btn-ghost" onClick={() => navigate('/scriptorium/books')}>View all <Ic.arrow /></button>
          </div>
          <div className="rowlist">
            {TOP_BOOKS.map((b, i) => (
              <div className="row" key={b.id}>
                <span className="rank">{i + 1}</span>
                <span className="cover-mini" style={{ background: b.cover }}>{b.title[0]}</span>
                <span className="meta"><span className="t">{b.title}</span><span className="s">{b.genre}</span></span>
                <span className="stat">{b.reads}<small>reads</small></span>
              </div>
            ))}
          </div>
        </div>

        <div className="card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick"></span>Top countries</div>
          </div>
          <div className="geo-list">
            {COUNTRIES.map(c => (
              <div className="geo" key={c.code}>
                <span className="flag">{c.code}</span>
                <span className="nm">{c.name}</span>
                <span className="vv">{c.val}<small>{c.pct}%</small></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
