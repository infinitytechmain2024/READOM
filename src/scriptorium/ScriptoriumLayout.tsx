import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Ic } from './icons';
import { NAV, PAGE_META, type NavId } from './data';
import './scriptorium.css';

const BrandMark = () => <div className="brand-mark">R</div>;

/** Resolve the current screen id from the URL. */
function useScreen(): NavId | 'book' {
  const { pathname } = useLocation();
  const seg = pathname.replace(/^\/scriptorium\/?/, '').split('/')[0];
  if (!seg) return 'dashboard';
  if (seg === 'book') return 'book';
  return (seg as NavId);
}

const ScriptoriumLayout = () => {
  const screen = useScreen();
  const navigate = useNavigate();
  const params = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const meta = PAGE_META[screen] ?? PAGE_META.dashboard;
  const showHead = screen !== 'book';
  const head = showHead && meta.title ? meta : null;

  const go = (id: NavId) => { navigate(id === 'dashboard' ? '/scriptorium' : `/scriptorium/${id}`); setMobileOpen(false); };

  return (
    <div className="scrip">
      <div className={'app' + (collapsed ? ' collapsed' : '')}>
        <button className="collapse-toggle" title={collapsed ? 'Expand menu' : 'Collapse menu'} onClick={() => setCollapsed((c) => !c)}>
          <Ic.collapse />
        </button>

        <div className="brand-cell">
          <BrandMark />
          <div className="brand-text">
            <div className="brand-name">Scriptorium</div>
            <div className="brand-sub">READOM</div>
          </div>
        </div>

        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
            <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu"><Ic.menu /></button>
            <div className="topbar-title">
              <span className="crumb">{meta.crumb}</span>
              <h1>{meta.h}</h1>
            </div>
          </div>
          <div className="topbar-right">
            <div className="searchbox">
              <Ic.search style={{ width: 18, height: 18, flex: 'none' }} />
              <input placeholder="Search books, readers…" />
            </div>
            <button className="icon-btn" aria-label="Notifications"><Ic.bell /><span className="dot" /></button>
            <div className="user-chip">
              <div className="avatar">LD</div>
              <div className="user-meta">
                <div className="nm">Dmytro L.</div>
                <div className="rl">Author</div>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <div className={'scrim' + (mobileOpen ? ' show' : '')} onClick={() => setMobileOpen(false)} />
        <aside className={'sidebar' + (mobileOpen ? ' open' : '')}>
          <div className="mobile-brand">
            <BrandMark />
            <div>
              <div className="brand-name">Scriptorium</div>
              <div className="brand-sub">READOM</div>
            </div>
          </div>
          <div className="nav-group-label">Workspace</div>
          <nav className="nav">
            {NAV.map((n) => {
              const Icon = Ic[n.icon as keyof typeof Ic];
              const active = screen === n.id || (screen === 'book' && n.id === 'books');
              return (
                <button key={n.id} title={n.label} className={'nav-item' + (active ? ' active' : '')} onClick={() => go(n.id)}>
                  <Icon />
                  <span>{n.label}</span>
                  {n.badge && <span className="nav-badge">{n.badge}</span>}
                </button>
              );
            })}
          </nav>
          <div className="sidebar-spacer" />
          <Link to="/" className="logout" title="Leave studio" style={{ textDecoration: 'none' }}>
            <Ic.power /><span>Exit studio</span>
          </Link>
        </aside>

        {/* Main */}
        <main className="main" key={screen + (params.id ?? '')}>
          {head && (
            <div className="main-head">
              <div>
                <div className="eyebrow">{head.eyebrow}</div>
                <h2>{head.title}</h2>
                <p>{head.sub}</p>
              </div>
              {screen === 'dashboard' && (
                <div className="head-actions">
                  <button className="btn"><Ic.download /> Export</button>
                  <button className="btn btn-yellow" onClick={() => navigate('/scriptorium/books')}><Ic.plus /> New book</button>
                </div>
              )}
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ScriptoriumLayout;
