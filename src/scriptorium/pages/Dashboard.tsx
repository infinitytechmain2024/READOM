import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ic } from '../icons';
import { DonutChart, LineChart } from '../charts';
import { BOOKS, TOP_BOOKS, TREND, AGE_SEGMENTS } from '../data';

const Dashboard = () => {
  const navigate = useNavigate();
  const [trendMetric, setTrendMetric] = useState<'views' | 'subscribers'>('views');
  const [pubTab, setPubTab] = useState<'Published' | 'Draft'>('Published');

  const openBook = (id: string) => navigate(`/scriptorium/book/${id}`);
  const published = BOOKS.filter((b) => b.status === 'Published');
  const drafts = BOOKS.filter((b) => b.status === 'Draft' || b.status === 'Ongoing');
  const pubList = pubTab === 'Published' ? published : drafts;
  const trendColor = trendMetric === 'views' ? '#15B97C' : '#7B61FF';

  return (
    <div className="bento">
      {/* LEFT COLUMN */}
      <div className="col">
        <div className="card donut-card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick" />Subscribers</div>
            <span className="chip chip-up"><Ic.up style={{ width: 13, height: 13 }} />+12.4%</span>
          </div>
          <div className="body">
            <div className="legend">
              {AGE_SEGMENTS.map((sg, i) => (
                <div className="legend-row" key={i}>
                  <span className="sw" style={{ background: sg.color }} />
                  <span className="lbl">{sg.label}</span>
                  <span className="pct">{sg.pct}%</span>
                </div>
              ))}
            </div>
            <DonutChart segments={AGE_SEGMENTS} total="12.9k" />
          </div>
        </div>

        <div className="card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick" />Top books</div>
            <button className="btn btn-sm btn-ghost" onClick={() => navigate('/scriptorium/books')}>View all <Ic.arrow /></button>
          </div>
          <div className="rowlist">
            {TOP_BOOKS.map((b, i) => (
              <button className="row" key={b.id} onClick={() => openBook(b.id)} style={{ background: 'none', width: '100%', textAlign: 'left' }}>
                <span className="rank">{i + 1}</span>
                <span className="cover-mini" style={{ background: b.cover }}>{b.title[0]}</span>
                <span className="meta">
                  <span className="t">{b.title}</span>
                  <span className="s">{b.genre}</span>
                </span>
                <span className="stat">{b.reads}<small>reads</small></span>
              </button>
            ))}
          </div>
        </div>

        <div className="card earn-card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick" />Earnings</div>
            <span className="card-sub">This month</span>
          </div>
          <div className="amount"><span className="cur">$</span>2,480</div>
          <div className="earn-bars">
            {[40, 62, 48, 75, 58, 88, 70, 96].map((h, i) => (
              <div key={i} className={'bar' + (i > 4 ? ' on' : '')} style={{ height: h + '%' }} />
            ))}
          </div>
          <div className="earn-row">
            <span className="chip chip-up"><Ic.up style={{ width: 13, height: 13 }} />+18% vs last month</span>
            <button className="btn btn-green btn-sm" onClick={() => navigate('/scriptorium/money')}>Details <Ic.arrow /></button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="col">
        <div className="card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick" />Views</div>
            <button className="btn btn-yellow btn-sm" onClick={() => navigate('/scriptorium/analytics')}>Details <Ic.arrow /></button>
          </div>
          <div className="stat-grid">
            <div className="stat-cell"><div className="k">Today</div><div className="v">1,204</div><div className="d">+8.2%</div></div>
            <div className="stat-cell"><div className="k">This week</div><div className="v">9,860</div><div className="d">+14.0%</div></div>
            <div className="stat-cell"><div className="k">This month</div><div className="v">41.2k</div><div className="d">+22.6%</div></div>
            <div className="stat-cell"><div className="k">All time</div><div className="v">312k</div><div className="d">+3.1%</div></div>
          </div>
        </div>

        <div className="card trend-card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick" />{trendMetric === 'views' ? 'Views' : 'Subscribers'} over time</div>
            <div className="toggle-pills">
              <button className={'pill' + (trendMetric === 'subscribers' ? ' active' : '')} onClick={() => setTrendMetric('subscribers')}>Subscribers</button>
              <button className={'pill' + (trendMetric === 'views' ? ' active' : '')} onClick={() => setTrendMetric('views')}>Views</button>
            </div>
          </div>
          <LineChart data={TREND[trendMetric]} labels={TREND.labels} color={trendColor} />
          <div className="chart-legend">
            <div className="it"><span className="ln" style={{ background: trendColor }} />{trendMetric === 'views' ? 'Daily views' : 'New subscribers'}</div>
            <div className="it">Peak {Math.max(...TREND[trendMetric]).toLocaleString()} on 18 Jun</div>
          </div>
        </div>

        <div className="card hoverable">
          <div className="card-head">
            <div className="card-title"><span className="tick" />Library</div>
            <div className="seg">
              <button className={pubTab === 'Published' ? 'active' : ''} onClick={() => setPubTab('Published')}>Published</button>
              <button className={pubTab === 'Draft' ? 'active' : ''} onClick={() => setPubTab('Draft')}>Drafts</button>
            </div>
          </div>
          <div className="rowlist">
            {pubList.map((b) => (
              <button className="row" key={b.id} onClick={() => openBook(b.id)} style={{ background: 'none', width: '100%', textAlign: 'left' }}>
                <span className="cover-mini" style={{ background: b.cover }}>{b.title[0]}</span>
                <span className="meta">
                  <span className="t">{b.title}</span>
                  <span className="s">{b.chapters} chapters · {b.words} words</span>
                </span>
                <span className={'chip ' + (b.status === 'Published' ? 'chip-green' : 'chip-yellow')}>{b.status}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
