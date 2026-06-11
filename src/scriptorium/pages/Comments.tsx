import { useState } from 'react';
import { Ic } from '../icons';
import { COMMENTS, BOOKS } from '../data';
import type { Comment } from '../data';

interface CState {
  read: boolean;
  liked: boolean;
  resolved: boolean;
  likes: number;
  replies: number;
}

const KIND: Record<string, { label: string; cls: string }> = {
  praise:   { label: 'Praise',    cls: 'kind-praise'   },
  question: { label: 'Question',  cls: 'kind-question' },
  critique: { label: 'Feedback',  cls: 'kind-critique' },
};

const initials = (name: string) => name.split(/\s+/).map(w => w[0]).slice(0, 2).join('');
const coverFor = (title: string) => (BOOKS.find(b => b.title === title) || { cover: '#ddd' }).cover;

const Comments = () => {
  const all: Comment[] = COMMENTS;
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [st, setSt] = useState<Record<string, CState>>(() =>
    Object.fromEntries(all.map(c => [c.id, {
      read: !c.unread, liked: false, resolved: c.resolved, likes: c.likes, replies: c.replies,
    }]))
  );

  const upd = (id: string, patch: Partial<CState>) => setSt(s => ({ ...s, [id]: { ...s[id], ...patch } }));
  const markRead = (id: string) => { if (!st[id].read) upd(id, { read: true }); };

  const unreadCount = all.filter(c => !st[c.id].read).length;
  const resolvedCount = all.filter(c => st[c.id].resolved).length;

  const FILTERS = [
    { id: 'all',      label: 'All',       n: all.length },
    { id: 'unread',   label: 'Unread',    n: unreadCount },
    { id: 'question', label: 'Questions', n: all.filter(c => c.kind === 'question').length },
    { id: 'critique', label: 'Feedback',  n: all.filter(c => c.kind === 'critique').length },
    { id: 'resolved', label: 'Resolved',  n: resolvedCount },
  ];

  const list = all.filter(c => {
    if (filter === 'unread'   && st[c.id].read)      return false;
    if (filter === 'resolved' && !st[c.id].resolved) return false;
    if (filter === 'question' && c.kind !== 'question') return false;
    if (filter === 'critique' && c.kind !== 'critique') return false;
    if (q.trim()) {
      const hay = (c.reader + ' ' + c.handle + ' ' + c.book + ' ' + c.text).toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const byBook: Record<string, number> = {};
  all.forEach(c => { byBook[c.book] = (byBook[c.book] || 0) + 1 + c.replies; });
  const topBooks = Object.entries(byBook).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const sentiment = ['praise', 'question', 'critique'].map(k => ({ k, n: all.filter(c => c.kind === k).length }));
  const sentTotal = all.length;

  const sendReply = (id: string) => {
    if (!replyText.trim()) { setReplyOpen(null); return; }
    upd(id, { replies: st[id].replies + 1, read: true });
    setReplyText('');
    setReplyOpen(null);
  };

  return (
    <div>
      <div className="an-toolbar">
        <div className="range-seg cmt-filters">
          {FILTERS.map(f => (
            <button key={f.id} className={filter === f.id ? 'active' : ''} onClick={() => setFilter(f.id)}>
              {f.label}<span className="seg-n">{f.n}</span>
            </button>
          ))}
        </div>
        <div className="searchbox cmt-search">
          <Ic.search style={{ width: 17, height: 17, flex: 'none' }} />
          <input placeholder="Search comments…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      <div className="an-grid">
        <div className="cmt-feed">
          {list.length === 0 && (
            <div className="card" style={{ padding: '46px 30px', textAlign: 'center', borderStyle: 'dashed' }}>
              <div className="card-title" style={{ justifyContent: 'center' }}>Nothing here</div>
              <p style={{ color: 'var(--muted)', fontWeight: 600, marginTop: 8 }}>No comments match this filter.</p>
            </div>
          )}
          {list.map(c => {
            const s = st[c.id];
            return (
              <div key={c.id}
                className={'cmt card' + (!s.read ? ' unread' : '') + (s.resolved ? ' resolved' : '')}
                onClick={() => markRead(c.id)}>
                <div className="cmt-av" style={{ background: c.av }}>{initials(c.reader)}</div>
                <div className="cmt-main">
                  <div className="cmt-top">
                    <span className="cmt-name">{c.reader}</span>
                    <span className="cmt-handle">{c.handle}</span>
                    <span className="cmt-dot">·</span>
                    <span className="cmt-time">{c.time}</span>
                    {!s.read && <span className="cmt-newdot" title="Unread"></span>}
                    <button className="cmt-more" onClick={e => e.stopPropagation()} title="More"><Ic.more /></button>
                  </div>
                  <div className="cmt-ctx">
                    <span className={'kind ' + KIND[c.kind].cls}>{KIND[c.kind].label}</span>
                    {' '}on <b>{c.book}</b> <span className="cmt-dot">·</span> {c.chapter}
                  </div>
                  <p className="cmt-text">{c.text}</p>
                  <div className="cmt-actions" onClick={e => e.stopPropagation()}>
                    <button
                      className={'cmt-act' + (s.liked ? ' liked' : '')}
                      onClick={() => upd(c.id, { liked: !s.liked, likes: s.likes + (s.liked ? -1 : 1) })}>
                      <Ic.heart /> {s.likes}
                    </button>
                    <button className="cmt-act" onClick={() => {
                      setReplyOpen(replyOpen === c.id ? null : c.id);
                      setReplyText('');
                      markRead(c.id);
                    }}>
                      <Ic.reply /> Reply{s.replies ? ` · ${s.replies}` : ''}
                    </button>
                    <button
                      className={'cmt-act resolve' + (s.resolved ? ' on' : '')}
                      onClick={() => upd(c.id, { resolved: !s.resolved, read: true })}>
                      <Ic.check /> {s.resolved ? 'Resolved' : 'Resolve'}
                    </button>
                  </div>
                  {replyOpen === c.id && (
                    <div className="cmt-reply" onClick={e => e.stopPropagation()}>
                      <div className="cmt-av sm" style={{ background: 'var(--yellow)', color: 'var(--ink)' }}>LD</div>
                      <textarea
                        autoFocus
                        placeholder={`Reply to ${c.reader.split(' ')[0]}…`}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply(c.id); }}
                      />
                      <div className="cmt-reply-foot">
                        <span className="hint">⌘↵ to send</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => setReplyOpen(null)}>Cancel</button>
                        <button className="btn btn-yellow btn-sm" onClick={() => sendReply(c.id)}>Reply</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="col">
          <div className="card">
            <div className="card-head"><div className="card-title"><span className="tick"></span>Overview</div></div>
            <div className="stat-grid">
              <div className="stat-cell"><div className="k">Unread</div><div className="v">{unreadCount}</div><div className="d">needs you</div></div>
              <div className="stat-cell"><div className="k">This week</div><div className="v">38</div><div className="d">+11 vs last</div></div>
              <div className="stat-cell"><div className="k">Replied</div><div className="v">92%</div><div className="d">response rate</div></div>
              <div className="stat-cell"><div className="k">Resolved</div><div className="v">{resolvedCount}</div><div className="d">of {all.length}</div></div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><div className="card-title"><span className="tick"></span>Sentiment</div></div>
            <div className="sent-list">
              {sentiment.map(s => (
                <div className="sent-row" key={s.k}>
                  <div className="sent-top"><span>{KIND[s.k].label}</span><span>{s.n}</span></div>
                  <div className="sent-bar">
                    <span className={KIND[s.k].cls} style={{ width: (s.n / sentTotal * 100) + '%' }}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><div className="card-title"><span className="tick"></span>Most discussed</div></div>
            <div className="rowlist">
              {topBooks.map(([title, n]) => (
                <div className="row" key={title}>
                  <span className="cover-mini" style={{ background: coverFor(title) }}>{title[0]}</span>
                  <span className="meta">
                    <span className="t">{title}</span>
                    <span className="s">{n} comments &amp; replies</span>
                  </span>
                  <span className="stat">{n}<small>total</small></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
