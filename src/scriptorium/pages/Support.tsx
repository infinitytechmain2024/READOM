import { useState } from 'react';
import { Ic } from '../icons';
import { FAQS, TICKETS } from '../data';
import type { IcName } from '../icons';

interface Channel {
  ic: IcName;
  name: string;
  meta: string;
  cta: string;
  online?: boolean;
  cls: string;
  messengers?: { ic: IcName; name: string; cls: string }[];
}

const CHANNELS: Channel[] = [
  {
    ic: 'chat', name: 'Live chat', meta: 'Typical reply under 2 min', cta: 'Start chat', online: true, cls: 'ch-green',
    messengers: [
      { ic: 'telegram', name: 'Telegram', cls: 'tg' },
      { ic: 'whatsapp', name: 'WhatsApp', cls: 'wa' },
    ],
  },
  { ic: 'mail',    name: 'Email support',    meta: 'support@readom.co · ~4h',        cta: 'Send email',  cls: 'ch-yellow' },
  { ic: 'support', name: 'Submit a ticket',  meta: 'Track a request end-to-end',     cta: 'New ticket',  cls: 'ch-ink'    },
];

const STATUS = [
  { s: 'Editor & autosave',    ok: true },
  { s: 'Publishing pipeline',  ok: true },
  { s: 'Payments & payouts',   ok: true },
  { s: 'Analytics',            ok: true },
  { s: 'Reader apps',          ok: true },
];

const ticketChip = (s: string) => s === 'Open' ? 'chip-yellow' : s === 'Resolved' ? 'chip-green' : 'chip';

const Support = () => {
  const [open, setOpen] = useState<string | null>(FAQS[0].q);
  const [q, setQ] = useState('');

  const faqs = FAQS.filter(f => {
    if (!q.trim()) return true;
    return (f.q + ' ' + f.a + ' ' + f.cat).toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div>
      <div className="card sup-hero">
        <div className="sup-hero-in">
          <div className="sup-kick">Help center</div>
          <h3>How can we help, Dmytro?</h3>
          <div className="searchbox sup-search">
            <Ic.search style={{ width: 19, height: 19, flex: 'none' }} />
            <input placeholder="Search help articles, payouts, publishing…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div className="sup-tags">
            {['Getting paid', 'Publishing', 'Importing text', 'Account', 'Readers'].map(t => (
              <button key={t} className="sup-tag" onClick={() => setQ(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="sup-channels">
        {CHANNELS.map(c => {
          const Icon = Ic[c.ic];
          return (
            <div className="card sup-ch" key={c.name}>
              <div className={'sup-ch-ic ' + c.cls}><Icon style={{ width: 24, height: 24 }} /></div>
              <div className="sup-ch-name">
                {c.name}
                {c.online && <span className="sup-online"><span className="live-dot"></span>Online</span>}
              </div>
              <div className="sup-ch-meta">{c.meta}</div>
              <button className="btn btn-sm btn-line sup-ch-cta">{c.cta} <Ic.arrow /></button>
              {c.messengers && (
                <div className="sup-msg">
                  <span className="sup-msg-lbl">Or chat on</span>
                  <div className="sup-msg-row">
                    {c.messengers.map(m => {
                      const MIcon = Ic[m.ic];
                      return (
                        <button key={m.name} className={'sup-msg-btn ' + m.cls}><MIcon /> {m.name}</button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="an-grid">
        <div className="card">
          <div className="card-head">
            <div className="card-title"><span className="tick"></span>Frequently asked</div>
            <span className="card-sub">{faqs.length} article{faqs.length === 1 ? '' : 's'}</span>
          </div>
          <div className="faq-list">
            {faqs.length === 0 && (
              <p style={{ color: 'var(--muted)', fontWeight: 600, padding: '14px 2px' }}>
                No articles match "{q}". Try the chat instead.
              </p>
            )}
            {faqs.map(f => {
              const isOpen = open === f.q;
              return (
                <div className={'faq' + (isOpen ? ' open' : '')} key={f.q}>
                  <button className="faq-q" onClick={() => setOpen(isOpen ? null : f.q)}>
                    <span className="faq-cat">{f.cat}</span>
                    <span className="faq-qt">{f.q}</span>
                    <span className="faq-chev"><Ic.chevron style={{ width: 18, height: 18 }} /></span>
                  </button>
                  {isOpen && <div className="faq-a">{f.a}</div>}
                </div>
              );
            })}
          </div>
          <div className="faq-foot">
            <span>Didn't find it?</span>
            <button className="btn btn-yellow btn-sm"><Ic.chat /> Ask support</button>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-head"><div className="card-title"><span className="tick"></span>System status</div></div>
            <div className="sup-status-banner"><span className="live-dot"></span>All systems operational</div>
            <div className="sup-status-list">
              {STATUS.map(s => (
                <div className="sup-status-row" key={s.s}>
                  <span>{s.s}</span>
                  <span className="sup-ok"><span className="dot-ok"></span>Operational</span>
                </div>
              ))}
            </div>
            <div className="sup-status-foot"><Ic.clock style={{ width: 14, height: 14 }} /> No incidents in the last 30 days</div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title"><span className="tick"></span>Your tickets</div>
              <button className="btn btn-ghost btn-sm">New <Ic.plus /></button>
            </div>
            <div className="tkt-list">
              {TICKETS.map(t => (
                <button className="tkt" key={t.id}>
                  <div className="tkt-main">
                    <div className="tkt-subj">{t.subject}</div>
                    <div className="tkt-meta">{t.id} · {t.agent} · {t.updated}</div>
                  </div>
                  <span className={'chip ' + ticketChip(t.status)}>{t.status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
