import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Ic } from '../icons';
import { BOOKS, CHAPTERS } from '../data';
import '../scriptorium.css';

const STARTER: Record<number, string> = {
  1: `<p>The lamp had not gone out in four hundred years, and Mara intended to keep it that way for at least one more night.</p><p>She climbed the iron stair the way her mother had taught her — left hand on the cold rail, right hand cupped around the taper, breath held against the draught that lived in the throat of the tower. At the top, the great lens waited, patient as a sleeping animal, and beyond it the dark pressed its face to the glass.</p><p>"Not tonight," she told it, and struck the flint.</p>`,
  2: `<p>Morning came grey and uncertain, the way it always did over the Hollow.</p>`,
  3: '', 4: '', 5: '', 6: '', 7: '',
};

const PI: Record<string, ReactNode> = {
  alignLeft:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 10h10M4 14h16M4 18h10"/></svg>,
  alignCenter:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M7 10h10M4 14h16M7 18h10"/></svg>,
  alignRight:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M10 10h10M4 14h16M10 18h10"/></svg>,
  alignJustify: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>,
  ul:           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.4"/><circle cx="4.5" cy="12" r="1.4"/><circle cx="4.5" cy="18" r="1.4"/></svg>,
  ol:           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h10M10 12h10M10 18h10"/><path d="M3.5 4.5h1.2v3.2M3.4 11.6h1.6l-1.6 2.1h1.7M3.4 16.6h1.6v1.1l-1.6.9h1.7" strokeWidth="1.4"/></svg>,
  indent:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M10 10h10M10 14h10M4 18h16M3 9l3 3-3 3"/></svg>,
  outdent:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M10 10h10M10 14h10M4 18h16M6 9l-3 3 3 3"/></svg>,
  link:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 13a4 4 0 0 0 6 0l2-2a4 4 0 1 0-5.7-5.7L10 7"/><path d="M15 11a4 4 0 0 0-6 0l-2 2a4 4 0 1 0 5.7 5.7L14 17"/></svg>,
  rule:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16"/><circle cx="12" cy="6" r="0.8"/><circle cx="8" cy="6" r="0.8"/><circle cx="16" cy="6" r="0.8"/><circle cx="12" cy="18" r="0.8"/><circle cx="8" cy="18" r="0.8"/><circle cx="16" cy="18" r="0.8"/></svg>,
  undo:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 7 4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 0 10h-2"/></svg>,
  redo:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m15 7 5 5-5 5"/><path d="M20 12H9a5 5 0 0 0 0 10h2"/></svg>,
  clear:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6 18 18M9.5 5h9M7 19h7"/><path d="M13 5 9 19"/></svg>,
  import:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v11M8 10l4 4 4-4"/><path d="M5 20h14"/></svg>,
  comment:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5 6 19M18 5l-4 14"/></svg>,
};

const FONTS = [
  { label: 'Inter (Sans)',      css: "'Inter',-apple-system,sans-serif" },
  { label: 'Georgia (Serif)',   css: 'Georgia,"Times New Roman",serif' },
  { label: 'Iowan / Palatino', css: '"Iowan Old Style","Palatino Linotype",Palatino,serif' },
  { label: 'Times',             css: '"Times New Roman",Times,serif' },
  { label: 'Courier (Mono)',    css: '"Courier New",ui-monospace,monospace' },
  { label: 'Space Grotesk',     css: "'Space Grotesk',sans-serif" },
];
const SIZES = [13, 14, 16, 18, 19, 21, 24, 28, 32, 40];
const STYLES = [
  { label: 'Body text',  tag: 'P' },
  { label: 'Title',      tag: 'H1' },
  { label: 'Heading',    tag: 'H2' },
  { label: 'Subheading', tag: 'H3' },
  { label: 'Quote',      tag: 'BLOCKQUOTE' },
];
const TEXT_COLORS = ['#1d1d1b', '#0E8F60', '#E6A300', '#C23B3B', '#3A57C4', '#6C4FD8', '#73726B'];
const HILITES    = ['#FFF4CC', '#DBF6EC', '#FFE3E3', '#E7E1FF', '#D8ECFF', 'transparent'];

interface ImportState {
  state: 'idle' | 'loading' | 'ready' | 'error';
  data: { html: string; words: number; name: string } | null;
  error: string;
  name: string;
  dragging: boolean;
}

const DocExtract = {
  ACCEPT: '.txt,.md,.html',
  fromFile: async (file: File): Promise<{ html: string; words: number; name: string }> => {
    const text = await file.text();
    const html = text.split('\n').filter(Boolean).map(l =>
      `<p>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`
    ).join('');
    return { html, words: text.trim().split(/\s+/).length, name: file.name };
  },
  fromUrl: async (_url: string): Promise<{ html: string; words: number; name: string }> => {
    throw new Error('URL import requires server support.');
  },
  fromText: (text: string, _isMd: boolean): { html: string; words: number; name: string } => {
    const html = text.split('\n').filter(Boolean).map(l =>
      `<p>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`
    ).join('');
    return { html, words: text.trim().split(/\s+/).length, name: 'Pasted text' };
  },
};

const Write = () => {
  const { bookId } = useParams<{ bookId?: string }>();
  const navigate = useNavigate();
  const back = () => navigate(bookId ? `/scriptorium/book/${bookId}` : '/scriptorium/books');

  const book = BOOKS.find(b => b.id === bookId) || BOOKS[0];
  const chapters = CHAPTERS;

  const [activeN, setActiveN] = useState(1);
  const [focus, setFocus] = useState(false);
  const [counts, setCounts] = useState({ words: 0, chars: 0 });
  const [save, setSave] = useState<'saved' | 'saving'>('saved');
  const [status, setStatus] = useState('Draft');
  const [act, setAct] = useState<Record<string, boolean>>({});
  const [block, setBlock] = useState('P');
  const [exportOpen, setExportOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [hiOpen, setHiOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [menu, setMenu] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const contentsRef = useRef<Record<number, string>>({ ...STARTER });
  const titlesRef = useRef<Record<number, string>>(
    Object.fromEntries(chapters.map(c => [c.n, c.t]))
  );
  const [titleVal, setTitleVal] = useState(chapters[0]?.t || '');
  const saveTimer = useRef<number>(0);

  const [imp, setImp] = useState<ImportState>({ state: 'idle', data: null, error: '', name: '', dragging: false });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pasteRef = useRef<HTMLTextAreaElement | null>(null);
  const urlRef = useRef<HTMLInputElement | null>(null);

  const computeCounts = () => {
    const el = editorRef.current;
    if (!el) { setCounts({ words: 0, chars: 0 }); return; }
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.au-comment').forEach(n => n.remove());
    const txt = (clone.textContent || '').replace(/ /g, ' ').trim();
    setCounts({ words: txt ? txt.split(/\s+/).length : 0, chars: txt.length });
  };

  useEffect(() => { computeCounts(); }, [activeN]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { try { document.execCommand('styleWithCSS', false, 'true'); } catch (_) {} }, []);

  const onInput = () => {
    computeCounts();
    setSave('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setSave('saved'), 850);
  };

  const switchTo = (n: number) => {
    if (editorRef.current) contentsRef.current[activeN] = editorRef.current.innerHTML;
    titlesRef.current[activeN] = titleVal;
    setActiveN(n);
    setTitleVal(titlesRef.current[n] || '');
  };

  const focusEditor = () => editorRef.current?.focus();

  const refreshActive = () => {
    try {
      setAct({
        bold:      document.queryCommandState('bold'),
        italic:    document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strike:    document.queryCommandState('strikeThrough'),
        ul:        document.queryCommandState('insertUnorderedList'),
        ol:        document.queryCommandState('insertOrderedList'),
        left:      document.queryCommandState('justifyLeft'),
        center:    document.queryCommandState('justifyCenter'),
        right:     document.queryCommandState('justifyRight'),
        justify:   document.queryCommandState('justifyFull'),
      });
      let b = (document.queryCommandValue('formatBlock') || '').toUpperCase();
      if (b === 'DIV' || b === '') b = 'P';
      setBlock(b);
    } catch (_) {}
  };

  const exec = (cmd: string, val?: string) => {
    focusEditor();
    document.execCommand(cmd, false, val);
    refreshActive();
    onInput();
  };

  const setFontName = (css: string) => { focusEditor(); document.execCommand('fontName', false, css); onInput(); };
  const setFontSize = (px: number) => {
    focusEditor();
    document.execCommand('fontSize', false, '7');
    editorRef.current?.querySelectorAll('font[size="7"]').forEach((f: Element) => {
      (f as HTMLElement).removeAttribute('size');
      (f as HTMLElement).style.fontSize = px + 'px';
    });
    onInput();
  };
  const setColor  = (c: string) => { exec('foreColor', c); setColorOpen(false); };
  const setHilite = (c: string) => {
    focusEditor();
    if (!document.execCommand('hiliteColor', false, c)) document.execCommand('backColor', false, c);
    setHiOpen(false);
    onInput();
  };
  const makeLink = () => {
    const url = window.prompt('Link URL', 'https://');
    if (url) exec('createLink', url);
  };
  const clearFmt = () => {
    focusEditor();
    document.execCommand('removeFormat');
    document.execCommand('formatBlock', false, 'P');
    refreshActive();
    onInput();
  };

  const insertComment = () => {
    focusEditor();
    if (!showComments) setShowComments(true);
    const sel = window.getSelection();
    const selected = sel && !sel.isCollapsed ? sel.toString() : '';
    const id = 'auc' + Date.now();
    if (selected) {
      const esc = selected.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      document.execCommand('insertHTML', false, `<span class="au-comment" data-au="1">${esc}</span> `);
    } else {
      document.execCommand('insertHTML', false, `<span class="au-comment" data-au="1" id="${id}">​</span> `);
      const node = document.getElementById(id);
      if (node && sel) {
        node.removeAttribute('id');
        const tn = node.firstChild;
        if (tn) {
          const r = document.createRange();
          r.setStart(tn, (tn as Text).length);
          r.collapse(true);
          sel.removeAllRanges();
          sel.addRange(r);
        }
      }
    }
    onInput();
  };

  const sync = () => {
    if (editorRef.current) contentsRef.current[activeN] = editorRef.current.innerHTML;
    titlesRef.current[activeN] = titleVal;
  };

  const handleFiles = async (files: FileList | null) => {
    const file = files && files[0];
    if (!file) return;
    setImp({ state: 'loading', data: null, error: '', name: file.name, dragging: false });
    try {
      const res = await DocExtract.fromFile(file);
      setImp({ state: 'ready', data: res, error: '', name: file.name, dragging: false });
    } catch (e) {
      setImp({ state: 'error', data: null, error: (e as Error).message || 'Could not read that file.', name: file.name, dragging: false });
    }
  };

  const handleUrl = async () => {
    const url = urlRef.current?.value || '';
    if (!url.trim()) return;
    setImp({ state: 'loading', data: null, error: '', name: url.trim(), dragging: false });
    try {
      const res = await DocExtract.fromUrl(url);
      setImp({ state: 'ready', data: res, error: '', name: res.name, dragging: false });
    } catch (e) {
      setImp({ state: 'error', data: null, error: (e as Error).message || 'Could not fetch that link.', name: url.trim(), dragging: false });
    }
  };

  const handlePaste = () => {
    const raw = pasteRef.current?.value || '';
    if (!raw.trim()) return;
    const looksMd = /(^|\n)#{1,6}\s|\*\*|^\s*[-*]\s|\[[^\]]+\]\(/.test(raw);
    const res = DocExtract.fromText(raw, looksMd);
    setImp({ state: 'ready', data: res, error: '', name: 'Pasted text', dragging: false });
  };

  const applyImport = (mode: 'replace' | 'insert') => {
    if (!imp.data) return;
    focusEditor();
    if (mode === 'replace') {
      if (editorRef.current) editorRef.current.innerHTML = imp.data.html;
    } else {
      const ok = document.execCommand('insertHTML', false, imp.data.html);
      if (!ok && editorRef.current) editorRef.current.insertAdjacentHTML('beforeend', imp.data.html);
    }
    onInput();
    setImportOpen(false);
    setImp({ state: 'idle', data: null, error: '', name: '', dragging: false });
    if (pasteRef.current) pasteRef.current.value = '';
  };

  const closeImport = () => {
    setImportOpen(false);
    setImp({ state: 'idle', data: null, error: '', name: '', dragging: false });
  };

  const htmlToMd = (html: string) => {
    const doc = document.createElement('div');
    doc.innerHTML = html || '';
    doc.querySelectorAll('.au-comment').forEach(n => n.remove());
    const lines: string[] = [];
    const inline = (el: Element): string => {
      let out = '';
      el.childNodes.forEach(c => {
        if (c.nodeType === 3) { out += c.textContent; return; }
        const tag = (c as Element).tagName?.toLowerCase();
        const inner = inline(c as Element);
        if (tag === 'b' || tag === 'strong') out += `**${inner}**`;
        else if (tag === 'i' || tag === 'em') out += `*${inner}*`;
        else if (tag === 'br') out += '\n';
        else out += inner;
      });
      return out;
    };
    doc.childNodes.forEach(node => {
      if (node.nodeType === 3) { const t = (node.textContent || '').trim(); if (t) lines.push(t); return; }
      if (node.nodeType !== 1) return;
      const tag = (node as Element).tagName.toLowerCase();
      if (tag === 'h1') lines.push('# ' + inline(node as Element));
      else if (tag === 'h2') lines.push('## ' + inline(node as Element));
      else if (tag === 'h3') lines.push('### ' + inline(node as Element));
      else if (tag === 'blockquote') lines.push('> ' + inline(node as Element));
      else if (tag === 'ul') (node as Element).querySelectorAll('li').forEach(li => lines.push('- ' + inline(li)));
      else if (tag === 'ol') (node as Element).querySelectorAll('li').forEach((li, i) => lines.push(`${i + 1}. ` + inline(li)));
      else if (tag === 'hr') lines.push('* * *');
      else lines.push(inline(node as Element));
    });
    return lines.join('\n\n');
  };

  const htmlToText = (html: string) => {
    const doc = document.createElement('div');
    doc.innerHTML = (html || '')
      .replace(/<\/(p|h[1-6]|blockquote|li|div)>/gi, '\n\n')
      .replace(/<hr\s*\/?>/gi, '\n* * *\n')
      .replace(/<br\s*\/?>/gi, '\n');
    doc.querySelectorAll('.au-comment').forEach(n => n.remove());
    return (doc.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
  };

  const download = (filename: string, text: string, mime = 'text/plain') => {
    const blob = new Blob([text], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const slug = (s: string) => (s || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const doExport = (scope: 'chapter' | 'book', fmt: 'txt' | 'md') => {
    sync();
    const wrapChapter = (n: number, asMd: boolean) => {
      const title = titlesRef.current[n] || `Chapter ${n}`;
      const bodyHtml = contentsRef.current[n] || '';
      const body = asMd ? htmlToMd(bodyHtml) : htmlToText(bodyHtml);
      const heading = asMd
        ? `# Chapter ${n} — ${title}`
        : `CHAPTER ${n}\n${title}\n${'—'.repeat(title.length + 12)}`;
      return `${heading}\n\n${body || '(empty)'}`;
    };
    const ext = fmt === 'md' ? 'md' : 'txt';
    const mime = fmt === 'md' ? 'text/markdown' : 'text/plain';
    if (scope === 'chapter') {
      download(
        `${slug(book.title)}-ch${String(activeN).padStart(2, '0')}-${slug(titlesRef.current[activeN])}.${ext}`,
        wrapChapter(activeN, fmt === 'md'), mime
      );
    } else {
      const head = fmt === 'md'
        ? `# ${book.title}\n\n_${book.genre}_\n\n`
        : `${book.title.toUpperCase()}\n${book.genre}\n${'='.repeat(40)}\n\n`;
      const all = head + chapters.map(c => wrapChapter(c.n, fmt === 'md')).join('\n\n\n' + (fmt === 'md' ? '---\n\n' : '* * *\n\n'));
      download(`${slug(book.title)}-manuscript.${ext}`, all, mime);
    }
    setExportOpen(false);
  };

  const goalTotal = 1500;
  const goalPct = Math.min(100, Math.round((counts.words / goalTotal) * 100));
  const R = 26, C = 2 * Math.PI * R;
  const doneChapters = chapters.filter(c => c.status === 'Published').length;
  const progPct = Math.round((doneChapters / chapters.length) * 100);

  const statusOpts = [
    { v: 'Draft',     c: '#B8B6AD'  },
    { v: 'In review', c: '#FFC400'  },
    { v: 'Published', c: '#15B97C'  },
  ];

  const TB = ({ on, onClick, title, children, wide }: {
    on?: boolean; onClick: () => void; title?: string; children: ReactNode; wide?: boolean;
  }) => (
    <button className={'tbtn' + (on ? ' on' : '') + (wide ? ' wide' : '')} title={title}
      onMouseDown={e => e.preventDefault()} onClick={onClick}>{children}</button>
  );

  const RibMenu = ({ id, label, width, children }: {
    id: string; label: string; width: number | string; children: ReactNode;
  }) => (
    <div className="rib-menu-wrap">
      <button className={'rib-select rib-menu-btn' + (menu === id ? ' open' : '')} style={{ minWidth: width }}
        onMouseDown={e => e.preventDefault()} onClick={() => setMenu(menu === id ? null : id)} title={label}>
        <span className="rmb-label">{label}</span>
      </button>
      {menu === id && (
        <>
          <div className="mini-scrim" onClick={() => setMenu(null)}></div>
          <div className="rib-menu" style={{ minWidth: width }}>{children}</div>
        </>
      )}
    </div>
  );

  const Opt = ({ active, onClick, children, style }: {
    active?: boolean; onClick: () => void; children: ReactNode; style?: React.CSSProperties;
  }) => (
    <button className={'rib-opt' + (active ? ' active' : '')} style={style}
      onMouseDown={e => e.preventDefault()} onClick={() => { onClick(); setMenu(null); }}>
      <span className="ro-tick">{active ? '✓' : ''}</span>{children}
    </button>
  );

  return (
    <div className="scrip">
    <div className="write-screen">
      <div className="write-top">
        <div className="wt-left">
          <button className="wt-back" onClick={back} title="Back to book"><Ic.back /></button>
          <div className="wt-title">
            <div className="bk">{book.title}</div>
            <div className="ch">Chapter {activeN} · {titleVal || 'Untitled'}</div>
          </div>
        </div>
        <div className="wt-center">
          <span className={'save-dot' + (save === 'saving' ? ' saving' : '')}></span>
          {save === 'saving' ? 'Saving…' : 'All changes saved'}
          <span style={{ color: '#3A3A35' }}>·</span>
          {counts.words.toLocaleString()} words
        </div>
        <div className="wt-right">
          <button className={'icon-toggle' + (focus ? ' on' : '')} title="Focus mode" onClick={() => setFocus(f => !f)}>
            <Ic.eye />
          </button>
          <button className={'icon-toggle' + (showComments ? ' on' : '')}
            title={showComments ? 'Hide author comments' : 'Show author comments'}
            onClick={() => setShowComments(v => !v)}>
            <Ic.comments />
          </button>
          <button className="btn btn-dark btn-sm" onClick={() => setImportOpen(true)}>{PI.import} Import</button>
          <div className="export-wrap">
            <button className="btn btn-dark btn-sm" onClick={() => setExportOpen(o => !o)}>
              <Ic.download /> Export
            </button>
            {exportOpen && (
              <>
                <div className="export-scrim" onClick={() => setExportOpen(false)}></div>
                <div className="export-menu">
                  <div className="em-group">This chapter</div>
                  <button className="em-item" onClick={() => doExport('chapter', 'txt')}><span className="em-ic">TXT</span> Plain text (.txt)</button>
                  <button className="em-item" onClick={() => doExport('chapter', 'md')}><span className="em-ic">MD</span> Markdown (.md)</button>
                  <div className="em-sep"></div>
                  <div className="em-group">Whole manuscript</div>
                  <button className="em-item" onClick={() => doExport('book', 'txt')}><span className="em-ic">TXT</span> Plain text (.txt)</button>
                  <button className="em-item" onClick={() => doExport('book', 'md')}><span className="em-ic">MD</span> Markdown (.md)</button>
                </div>
              </>
            )}
          </div>
          <button className="btn btn-yellow btn-sm"><Ic.up /> Publish</button>
        </div>
      </div>

      <div className={'write-body' + (focus ? ' focus' : '') + (showComments ? '' : ' hide-comments')}>
        <div className="ribbon">
          <div className="rib-group">
            <div className="rib-row">
              <TB title="Undo (⌘Z)" onClick={() => exec('undo')}>{PI.undo}</TB>
              <TB title="Redo (⌘⇧Z)" onClick={() => exec('redo')}>{PI.redo}</TB>
            </div>
            <div className="rib-cap">History</div>
          </div>
          <span className="rib-sep"></span>

          <div className="rib-group">
            <div className="rib-row">
              <RibMenu id="style" label={(STYLES.find(s => s.tag === block) || STYLES[0]).label} width={138}>
                {STYLES.map(s => <Opt key={s.tag} active={block === s.tag} onClick={() => exec('formatBlock', s.tag)}>{s.label}</Opt>)}
              </RibMenu>
            </div>
            <div className="rib-cap">Style</div>
          </div>
          <span className="rib-sep"></span>

          <div className="rib-group">
            <div className="rib-row">
              <RibMenu id="font" label="Font" width={138}>
                {FONTS.map(f => <Opt key={f.label} onClick={() => setFontName(f.css)} style={{ fontFamily: f.css }}>{f.label}</Opt>)}
              </RibMenu>
              <RibMenu id="size" label="Size" width={82}>
                {SIZES.map(s => <Opt key={s} onClick={() => setFontSize(s)}>{s}</Opt>)}
              </RibMenu>
            </div>
            <div className="rib-cap">Font</div>
          </div>
          <span className="rib-sep"></span>

          <div className="rib-group">
            <div className="rib-row">
              <TB on={act.bold}      title="Bold (⌘B)"      onClick={() => exec('bold')}><b style={{ fontWeight: 900 }}>B</b></TB>
              <TB on={act.italic}    title="Italic (⌘I)"    onClick={() => exec('italic')}><i style={{ fontFamily: 'Georgia,serif' }}>I</i></TB>
              <TB on={act.underline} title="Underline (⌘U)" onClick={() => exec('underline')}><span style={{ textDecoration: 'underline' }}>U</span></TB>
              <TB on={act.strike}    title="Strikethrough"  onClick={() => exec('strikeThrough')}><span style={{ textDecoration: 'line-through' }}>S</span></TB>
              <div className="swatch-wrap">
                <button className="tbtn color-btn" title="Text color" onMouseDown={e => e.preventDefault()}
                  onClick={() => { setColorOpen(o => !o); setHiOpen(false); }}>
                  <span className="cg">A</span><span className="cbar" style={{ background: '#1d1d1b' }}></span>
                </button>
                {colorOpen && (
                  <>
                    <div className="mini-scrim" onClick={() => setColorOpen(false)}></div>
                    <div className="swatch-pop">{TEXT_COLORS.map(c => <button key={c} className="sw" style={{ background: c }} onClick={() => setColor(c)} />)}</div>
                  </>
                )}
              </div>
              <div className="swatch-wrap">
                <button className="tbtn color-btn" title="Highlight" onMouseDown={e => e.preventDefault()}
                  onClick={() => { setHiOpen(o => !o); setColorOpen(false); }}>
                  <span className="cg" style={{ background: '#FFF4CC', padding: '0 3px', borderRadius: 3 }}>H</span>
                </button>
                {hiOpen && (
                  <>
                    <div className="mini-scrim" onClick={() => setHiOpen(false)}></div>
                    <div className="swatch-pop">
                      {HILITES.map(c => (
                        <button key={c} className={'sw' + (c === 'transparent' ? ' none' : '')}
                          style={{ background: c === 'transparent' ? '#fff' : c }} onClick={() => setHilite(c)} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <TB title="Clear formatting" onClick={clearFmt}>{PI.clear}</TB>
            </div>
            <div className="rib-cap">Format</div>
          </div>
          <span className="rib-sep"></span>

          <div className="rib-group">
            <div className="rib-row">
              <TB on={act.left}    title="Align left"     onClick={() => exec('justifyLeft')}>{PI.alignLeft}</TB>
              <TB on={act.center}  title="Center"         onClick={() => exec('justifyCenter')}>{PI.alignCenter}</TB>
              <TB on={act.right}   title="Align right"    onClick={() => exec('justifyRight')}>{PI.alignRight}</TB>
              <TB on={act.justify} title="Justify"        onClick={() => exec('justifyFull')}>{PI.alignJustify}</TB>
              <TB on={act.ul}      title="Bullet list"    onClick={() => exec('insertUnorderedList')}>{PI.ul}</TB>
              <TB on={act.ol}      title="Numbered list"  onClick={() => exec('insertOrderedList')}>{PI.ol}</TB>
              <TB title="Decrease indent" onClick={() => exec('outdent')}>{PI.outdent}</TB>
              <TB title="Increase indent" onClick={() => exec('indent')}>{PI.indent}</TB>
            </div>
            <div className="rib-cap">Paragraph</div>
          </div>
          <span className="rib-sep"></span>

          <div className="rib-group">
            <div className="rib-row">
              <TB title="Insert link"                                    onClick={makeLink}>{PI.link}</TB>
              <TB title="Scene break"                                    onClick={() => exec('insertHorizontalRule')}>{PI.rule}</TB>
              <TB title="Author comment — visible only to you, never exported" onClick={insertComment}>{PI.comment}</TB>
              <TB wide title="Extract text from a file"                  onClick={() => setImportOpen(true)}>{PI.import}<span className="tbl">Import</span></TB>
            </div>
            <div className="rib-cap">Insert</div>
          </div>
        </div>

        <aside className="write-outline">
          <div className="outline-head">
            <span className="lbl">Manuscript</span>
            <button className="add" title="Add chapter"><Ic.plus /></button>
          </div>
          <div className="outline-prog">
            <div className="bar"><span style={{ width: progPct + '%' }}></span></div>
            <div className="t">{doneChapters} of {chapters.length} chapters published</div>
          </div>
          {chapters.map(c => (
            <button key={c.n} className={'chap-row' + (c.n === activeN ? ' active' : '')} onClick={() => switchTo(c.n)}>
              <span className="cn">{String(c.n).padStart(2, '0')}</span>
              <span className="ci">
                <span className="t">{titlesRef.current[c.n]}</span>
                <span className="m">{c.words} words</span>
              </span>
              <span className={'st ' + (c.status === 'Published' ? 'st-pub' : c.status === 'New' ? 'st-new' : 'st-draft')}></span>
            </button>
          ))}
        </aside>

        <div className="write-canvas">
          <div className="doc-page">
            <textarea className="doc-title" value={titleVal} rows={1}
              onChange={e => { setTitleVal(e.target.value); onInput(); }}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = 'auto';
                t.style.height = t.scrollHeight + 'px';
              }}
              placeholder="Chapter title" />
            <div className="doc-meta">
              <span>Chapter {activeN}</span><span>·</span><span>{book.genre}</span>
            </div>
            <div
              ref={editorRef}
              className="prose"
              contentEditable
              suppressContentEditableWarning
              data-ph="Start writing your chapter…"
              onInput={onInput}
              onKeyUp={refreshActive}
              onMouseUp={refreshActive}
              onFocus={refreshActive}
              key={activeN}
              dangerouslySetInnerHTML={{ __html: contentsRef.current[activeN] || '' }}
            />
          </div>
        </div>

        <aside className="write-inspector">
          <div className="insp-sec">
            <div className="h">This chapter</div>
            <div className="stat-pair">
              <div className="stat-box"><div className="n">{counts.words.toLocaleString()}</div><div className="l">Words</div></div>
              <div className="stat-box"><div className="n">{Math.max(1, Math.ceil(counts.words / 220))}<small style={{ fontSize: 13 }}>m</small></div><div className="l">Read time</div></div>
              <div className="stat-box"><div className="n">{counts.chars.toLocaleString()}</div><div className="l">Characters</div></div>
              <div className="stat-box"><div className="n">{(counts.words / 250).toFixed(1)}</div><div className="l">Pages</div></div>
            </div>
          </div>

          <div className="insp-sec">
            <div className="h">Daily goal</div>
            <div className="goal-ring">
              <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="32" cy="32" r={R} fill="none" stroke="#EDECE4" strokeWidth="7" />
                <circle cx="32" cy="32" r={R} fill="none" stroke="var(--green)" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={C} strokeDashoffset={C - (goalPct / 100) * C}
                  style={{ transition: 'stroke-dashoffset .5s' }} />
              </svg>
              <div className="gtxt">
                <div className="gv">{goalPct}%</div>
                <div className="gl">{counts.words} / {goalTotal} words today</div>
              </div>
            </div>
          </div>

          <div className="insp-sec">
            <div className="h">Status</div>
            <div className="status-select">
              {statusOpts.map(o => (
                <button key={o.v} className={'status-opt' + (status === o.v ? ' sel' : '')} onClick={() => setStatus(o.v)}>
                  <span className="sd" style={{ background: o.c }}></span>{o.v}
                </button>
              ))}
            </div>
          </div>

          <div className="insp-sec">
            <div className="h">Notes</div>
            <textarea className="insp-notes" placeholder="Plot threads, reminders, things to fix…"
              defaultValue={"• Don't forget the broken lens subplot\n• Mara's mother — name?"} />
          </div>
        </aside>
      </div>

      {importOpen && (
        <div className="imp-overlay" onClick={closeImport}>
          <div className="imp-modal" onClick={e => e.stopPropagation()}>
            <div className="imp-head">
              <div>
                <div className="imp-kick">Extract text</div>
                <div className="imp-title">Bring in text from another file</div>
              </div>
              <button className="imp-x" onClick={closeImport} aria-label="Close">✕</button>
            </div>

            <div className="imp-body">
              <div
                className={'imp-drop' + (imp.dragging ? ' drag' : '')}
                onDragOver={e => { e.preventDefault(); setImp(s => ({ ...s, dragging: true })); }}
                onDragLeave={() => setImp(s => ({ ...s, dragging: false }))}
                onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="imp-drop-ic">{PI.import}</div>
                <div className="imp-drop-t">Drop a file here, or <span>browse</span></div>
                <div className="imp-drop-s">{DocExtract.ACCEPT}</div>
                <input ref={fileInputRef} type="file" accept={DocExtract.ACCEPT} hidden
                  onChange={e => handleFiles(e.target.files)} />
              </div>

              <div className="imp-or"><span>or paste a link</span></div>
              <div className="imp-url-row">
                <span className="imp-url-ic">🔗</span>
                <input ref={urlRef} className="imp-url" type="url"
                  placeholder="Google Docs share link, or a .pdf / .docx / .html URL…"
                  onKeyDown={e => { if (e.key === 'Enter') handleUrl(); }} />
                <button className="btn btn-dark btn-sm" onClick={handleUrl}>Fetch</button>
              </div>

              <div className="imp-or"><span>or paste text</span></div>
              <div className="imp-paste-row">
                <textarea ref={pasteRef} className="imp-paste" placeholder="Paste manuscript text or Markdown here…" />
                <button className="btn btn-dark btn-sm" onClick={handlePaste}>Use text</button>
              </div>

              {imp.state === 'loading' && <div className="imp-status loading">Reading <b>{imp.name}</b>…</div>}
              {imp.state === 'error'   && <div className="imp-status error">⚠ {imp.error}</div>}

              {imp.state === 'ready' && imp.data && (
                <div className="imp-result">
                  <div className="imp-result-head">
                    <span className="imp-file">📄 {imp.data.name}</span>
                    <span className="imp-meta">{imp.data.words.toLocaleString()} words extracted</span>
                  </div>
                  <div className="imp-preview" dangerouslySetInnerHTML={{ __html: imp.data.html }} />
                </div>
              )}
            </div>

            <div className="imp-foot">
              <button className="btn btn-ghost btn-sm" onClick={closeImport}>Cancel</button>
              <div style={{ flex: 1 }}></div>
              <button className="btn btn-line btn-sm" disabled={imp.state !== 'ready'} onClick={() => applyImport('replace')}>
                Replace chapter
              </button>
              <button className="btn btn-yellow btn-sm" disabled={imp.state !== 'ready'} onClick={() => applyImport('insert')}>
                Insert at cursor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Write;
