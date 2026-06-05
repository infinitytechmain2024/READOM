import { useNavigate, useParams } from 'react-router-dom';
import { Ic } from '../icons';
import { LineChart } from '../charts';
import { BOOKS, CHAPTERS, TREND } from '../data';

const BookDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const b = BOOKS.find((x) => x.id === id) ?? BOOKS[0];
  const write = () => navigate('/scriptorium/write');

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/scriptorium/books')}><Ic.back /> Back to books</button>

      <div className="book-detail">
        <div className="detail-cover">
          <div className="art" style={{ background: b.cover }}>
            <span className="ttl">{b.title}</span>
          </div>
          <div className="cover-actions">
            <button className="btn btn-yellow" onClick={write}><Ic.edit /> Edit book</button>
            <button className="btn" onClick={write}><Ic.eye /> Preview</button>
          </div>
        </div>

        <div className="detail-main">
          <span className={'chip ' + (b.status === 'Published' ? 'chip-green' : 'chip-yellow')} style={{ marginBottom: 14, display: 'inline-block' }}>{b.status}</span>
          <h2>{b.title}</h2>
          <div className="byline">{b.genre} · {b.chapters} chapters · {b.words} words</div>
          <p className="detail-desc">{b.desc}</p>

          <div className="metric-grid">
            <div className="metric"><div className="mv">{b.reads}</div><div className="ml">Total reads</div><div className="md">+9.4% wk</div></div>
            <div className="metric"><div className="mv">{b.subs}</div><div className="ml">Subscribers</div><div className="md">+124 wk</div></div>
            <div className="metric metric-earn"><div className="mv">{b.earned}</div><div className="ml">Earned</div><div className="md">+$182 wk</div></div>
            <div className="metric"><div className="mv">{b.completion}%</div><div className="ml">Completion</div><div className="md">+2.1% wk</div></div>
          </div>

          <div className="card hoverable" style={{ padding: '22px 24px' }}>
            <div className="card-head">
              <div className="card-title"><span className="tick" />Reads this week</div>
              <span className="chip chip-up"><Ic.up style={{ width: 13, height: 13 }} />+9.4%</span>
            </div>
            <LineChart data={[2100, 2480, 2200, 2900, 3150, 2980, 3420]} labels={TREND.labels} color="#15B97C" height={190} />
          </div>

          <div className="section-label"><span className="tick" />Chapters</div>
          <div className="chapter-list">
            {CHAPTERS.map((c) => (
              <button className="chapter" key={c.n} onClick={write} style={{ background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                <span className="cn">{String(c.n).padStart(2, '0')}</span>
                <span className="ct">{c.t}</span>
                <span className="cmeta">{c.words} · {c.reads} reads</span>
                <span className={'cstatus ' + (c.status === 'Published' ? 'chip-green' : c.status === 'New' ? 'chip-yellow' : '')} style={c.status === 'Draft' ? { background: '#fff' } : undefined}>{c.status}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
