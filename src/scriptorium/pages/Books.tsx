import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ic } from '../icons';
import { BOOKS, type Book } from '../data';

const FILTERS = ['All', 'Published', 'Ongoing', 'Draft'] as const;

const Books = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const list = filter === 'All' ? BOOKS : BOOKS.filter((b) => b.status === filter);

  const openBook = (id: string) => navigate(`/scriptorium/book/${id}`);

  const statusTagClass = (b: Book) =>
    b.status === 'Published' ? 'chip-green' : b.status === 'Ongoing' ? 'chip-yellow' : 'chip';

  return (
    <div>
      <div className="books-toolbar">
        <div className="filter-row">
          {FILTERS.map((f) => (
            <button key={f} className={'pill' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <button className="btn btn-yellow" onClick={() => navigate('/scriptorium/write')}><Ic.plus /> New book</button>
      </div>

      <div className="book-grid">
        {list.map((b) => (
          <div className="book-card" key={b.id} onClick={() => openBook(b.id)}>
            <div className="book-cover" style={{ background: b.cover }}>
              <span className={'status-tag ' + statusTagClass(b)} style={b.status === 'Draft' ? { background: '#fff' } : undefined}>{b.status}</span>
              <span className="title-art">{b.title}</span>
              <button className="card-preview-btn" title="Preview as reader" onClick={(e) => { e.stopPropagation(); openBook(b.id); }}>
                <Ic.eye style={{ width: 16, height: 16 }} /> Preview
              </button>
            </div>
            <div className="book-body">
              <div className="bg-genre">{b.genre}</div>
              <div className="bt">{b.title}</div>
              <div className="book-stats">
                <div className="bs"><span className="n">{b.reads}</span><span className="l">Reads</span></div>
                <div className="bs"><span className="n">{b.subs}</span><span className="l">Subs</span></div>
                <div className="bs"><span className="n">{b.rating}</span><span className="l">Rating</span></div>
                <div className="bs bs-earn"><span className="n">{b.earned}</span><span className="l">Earned</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
