import { useState } from 'react';
import type { ReactNode } from 'react';
import { Ic } from '../icons';

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className={'switch' + (on ? ' on' : '')} role="switch" aria-checked={on}
      onClick={() => onChange(!on)}>
      <span className="knob"></span>
    </button>
  );
}

function ToggleRow({ label, desc, on, onChange }: { label: string; desc: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="set-toggle">
      <div className="st-text">
        <div className="st-l">{label}</div>
        <div className="st-d">{desc}</div>
      </div>
      <Switch on={on} onChange={onChange} />
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="set-field">
      <span className="sf-l">{label}</span>
      {children}
      {hint && <span className="sf-hint">{hint}</span>}
    </label>
  );
}

const Settings = () => {
  const SECTIONS = [
    { id: 'profile', label: 'Profile',            icon: 'user'     },
    { id: 'notify',  label: 'Notifications',      icon: 'bell'     },
    { id: 'privacy', label: 'Privacy & readers',  icon: 'lock'     },
    { id: 'account', label: 'Account',            icon: 'settings' },
  ] as const;

  const [sec, setSec] = useState<'profile' | 'notify' | 'privacy' | 'account'>('profile');
  const [saved, setSaved] = useState(false);
  const flashSave = () => { setSaved(true); setTimeout(() => setSaved(false), 1600); };

  const [p, setP] = useState({
    name: 'Dmytro Levchenko', pen: 'D. L. Vorth', email: 'dmytro@readom.co', url: 'vorth',
    bio: 'Fantasy & literary fiction. Currently serialising "The Lantern of Vorth." Coffee-fuelled, deadline-averse.',
    lang: 'English (US)', tz: '(GMT+2) Kyiv',
  });
  const setField = (k: keyof typeof p, v: string) => setP(s => ({ ...s, [k]: v }));

  const [tg, setTg] = useState({
    n_comments: true, n_replies: true, n_subs: true, n_milestones: true, n_payout: true, n_digest: false, n_news: false,
    pv_earnings: false, pv_dm: true, pv_activity: true, pv_draftcomments: false, twofa: true,
  });
  const setT = (k: keyof typeof tg, v: boolean) => setTg(s => ({ ...s, [k]: v }));
  const [whoComment, setWhoComment] = useState('Everyone');

  const SaveBar = () => (
    <div className="set-savebar">
      {saved && <span className="set-saved"><Ic.check style={{ width: 15, height: 15 }} /> Saved</span>}
      <button className="btn btn-ghost btn-sm" onClick={() => {}}>Cancel</button>
      <button className="btn btn-yellow btn-sm" onClick={flashSave}>Save changes</button>
    </div>
  );

  return (
    <div className="set-grid">
      <aside className="set-nav">
        {SECTIONS.map(s => {
          const Icon = Ic[s.icon];
          return (
            <button key={s.id} className={'set-nav-item' + (sec === s.id ? ' active' : '')} onClick={() => setSec(s.id)}>
              <Icon style={{ width: 19, height: 19 }} /><span>{s.label}</span>
            </button>
          );
        })}
      </aside>

      <div className="set-panel">
        {sec === 'profile' && (
          <div className="card">
            <div className="card-head"><div className="card-title"><span className="tick"></span>Public profile</div></div>
            <div className="set-avatrow">
              <div className="set-avatar">LD</div>
              <div className="set-avatxt">
                <div className="t">Profile photo</div>
                <div className="s">PNG or JPG, at least 400×400px.</div>
                <div className="set-avatbtns">
                  <button className="btn btn-line btn-sm">Upload</button>
                  <button className="btn btn-ghost btn-sm">Remove</button>
                </div>
              </div>
            </div>
            <div className="set-fields two">
              <Field label="Legal name" hint="Private — used for payouts & tax only">
                <input className="set-input" value={p.name} onChange={e => setField('name', e.target.value)} />
              </Field>
              <Field label="Pen name" hint="Shown to readers across READOM">
                <input className="set-input" value={p.pen} onChange={e => setField('pen', e.target.value)} />
              </Field>
              <Field label="Email">
                <input className="set-input" type="email" value={p.email} onChange={e => setField('email', e.target.value)} />
              </Field>
              <Field label="Profile URL">
                <div className="set-input-group">
                  <span className="sig-pre">readom.co/@</span>
                  <input className="set-input bare" value={p.url} onChange={e => setField('url', e.target.value)} />
                </div>
              </Field>
            </div>
            <Field label="Bio" hint={`${p.bio.length}/240`}>
              <textarea className="set-input set-textarea" maxLength={240} value={p.bio}
                onChange={e => setField('bio', e.target.value)} />
            </Field>
            <div className="set-fields two">
              <Field label="Language">
                <select className="set-input set-select" value={p.lang} onChange={e => setField('lang', e.target.value)}>
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Українська</option>
                  <option>Deutsch</option>
                  <option>Español</option>
                </select>
              </Field>
              <Field label="Timezone">
                <select className="set-input set-select" value={p.tz} onChange={e => setField('tz', e.target.value)}>
                  <option>(GMT+2) Kyiv</option>
                  <option>(GMT+0) London</option>
                  <option>(GMT-5) New York</option>
                  <option>(GMT+1) Berlin</option>
                  <option>(GMT+9) Tokyo</option>
                </select>
              </Field>
            </div>
            <SaveBar />
          </div>
        )}

        {sec === 'notify' && (
          <div className="card">
            <div className="card-head">
              <div className="card-title"><span className="tick"></span>Notifications</div>
              <span className="card-sub">Email &amp; in-app</span>
            </div>
            <div className="set-group-label">Community</div>
            <ToggleRow label="New comments" desc="When a reader comments on any of your books." on={tg.n_comments} onChange={v => setT('n_comments', v)} />
            <ToggleRow label="Replies to me" desc="When someone replies to one of your replies." on={tg.n_replies} onChange={v => setT('n_replies', v)} />
            <ToggleRow label="New subscribers" desc="When a reader subscribes to your work." on={tg.n_subs} onChange={v => setT('n_subs', v)} />
            <div className="set-group-label">Milestones &amp; money</div>
            <ToggleRow label="Reading milestones" desc="Reads, likes and rating milestones per book." on={tg.n_milestones} onChange={v => setT('n_milestones', v)} />
            <ToggleRow label="Payout confirmations" desc="When a payout is sent to your account." on={tg.n_payout} onChange={v => setT('n_payout', v)} />
            <div className="set-group-label">From READOM</div>
            <ToggleRow label="Weekly digest" desc="A Monday summary of your week's performance." on={tg.n_digest} onChange={v => setT('n_digest', v)} />
            <ToggleRow label="Product news" desc="New features and occasional tips. No spam." on={tg.n_news} onChange={v => setT('n_news', v)} />
            <SaveBar />
          </div>
        )}

        {sec === 'privacy' && (
          <div className="card">
            <div className="card-head"><div className="card-title"><span className="tick"></span>Privacy &amp; readers</div></div>
            <Field label="Who can comment on your books">
              <div className="seg set-seg">
                {['Everyone', 'Subscribers', 'No one'].map(o => (
                  <button key={o} className={whoComment === o ? 'active' : ''} onClick={() => setWhoComment(o)}>{o}</button>
                ))}
              </div>
            </Field>
            <div className="set-group-label" style={{ marginTop: 22 }}>Visibility</div>
            <ToggleRow label="Show earnings on profile" desc="Display lifetime earnings publicly. Off by default." on={tg.pv_earnings} onChange={v => setT('pv_earnings', v)} />
            <ToggleRow label="Show reading activity" desc="Let readers see what you're currently reading." on={tg.pv_activity} onChange={v => setT('pv_activity', v)} />
            <ToggleRow label="Allow reader messages" desc="Readers can send you direct messages." on={tg.pv_dm} onChange={v => setT('pv_dm', v)} />
            <ToggleRow label="Comments on drafts" desc="Allow comments on chapters still in draft." on={tg.pv_draftcomments} onChange={v => setT('pv_draftcomments', v)} />
            <SaveBar />
          </div>
        )}

        {sec === 'account' && (
          <div className="col">
            <div className="card">
              <div className="card-head">
                <div className="card-title"><span className="tick"></span>Plan</div>
                <span className="chip chip-green">READOM Pro</span>
              </div>
              <div className="set-plan">
                <div>
                  <div className="t">READOM Pro · $12/mo</div>
                  <div className="s">Unlimited books, advanced analytics, lowest payout fees. Renews Jul 1, 2026.</div>
                </div>
                <button className="btn btn-line btn-sm">Manage plan</button>
              </div>
            </div>
            <div className="card">
              <div className="card-head"><div className="card-title"><span className="tick"></span>Security</div></div>
              <ToggleRow label="Two-factor authentication" desc="Require a code from your authenticator app at sign-in." on={tg.twofa} onChange={v => setT('twofa', v)} />
              <div className="set-conn">
                <div className="conn-row">
                  <span className="conn-ic">G</span>
                  <div className="conn-t"><div className="n">Google</div><div className="s">dmytro@gmail.com</div></div>
                  <span className="chip chip-green">Connected</span>
                </div>
                <div className="conn-row">
                  <span className="conn-ic" style={{ background: 'var(--ink)', color: '#fff' }}>A</span>
                  <div className="conn-t"><div className="n">Apple</div><div className="s">Not connected</div></div>
                  <button className="btn btn-ghost btn-sm">Connect</button>
                </div>
              </div>
            </div>
            <div className="card set-danger">
              <div className="card-head">
                <div className="card-title"><span className="tick" style={{ background: 'var(--coral)' }}></span>Danger zone</div>
              </div>
              <div className="set-danger-row">
                <div><div className="t">Deactivate account</div><div className="s">Hide your profile and books. Reversible any time.</div></div>
                <button className="btn btn-line btn-sm">Deactivate</button>
              </div>
              <div className="set-danger-row">
                <div><div className="t">Delete account</div><div className="s">Permanently remove your account and all manuscripts.</div></div>
                <button className="btn btn-danger btn-sm">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
