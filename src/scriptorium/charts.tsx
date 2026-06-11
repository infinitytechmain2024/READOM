/* Animated SVG charts — ported from the Scriptorium design bundle. */
import { useEffect, useRef, useState } from 'react';
import type { AgeSegment } from './data';

export function DonutChart({ segments, total, size = 170 }: { segments: AgeSegment[]; total: string; size?: number }) {
  const stroke = 20;
  const r = (size - stroke) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const gap = 0.018 * circ;

  const [grow, setGrow] = useState(0);
  useEffect(() => {
    let raf = 0, start = 0;
    const dur = 950;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      setGrow(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  let offset = 0;
  const arcs = segments.map((seg, i) => {
    const len = (seg.pct / 100) * circ;
    const dash = Math.max(0, len * grow - gap);
    const el = (
      <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset * grow} />
    );
    offset += len;
    return el;
  });

  return (
    <div className="donut-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0EFE8" strokeWidth={stroke} />
        {arcs}
      </svg>
      <div className="donut-center">
        <div className="num">{total}</div>
        <div className="cap">Subscribers</div>
      </div>
    </div>
  );
}

interface Pt { x: number; y: number; }
export function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function LineChart({ data, labels, color = '#15B97C', height = 230 }: { data: number[]; labels: string[]; color?: string; height?: number }) {
  const W = 640, H = height, padL = 44, padR = 16, padT = 18, padB = 30;
  const max = Math.max(...data) * 1.12;
  const min = 0;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const x = (i: number) => padL + (i / (data.length - 1)) * innerW;
  const y = (v: number) => padT + innerH - ((v - min) / (max - min)) * innerH;
  const pts: Pt[] = data.map((v, i) => ({ x: x(i), y: y(v) }));
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${padT + innerH} L ${pts[0].x} ${padT + innerH} Z`;
  const gradId = `scripArea-${color.replace(/[^a-z0-9]/gi, '')}`;

  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const L = el.getTotalLength();
    el.style.transition = 'none';
    el.style.strokeDasharray = String(L);
    el.style.strokeDashoffset = String(L);
    el.getBoundingClientRect();
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.05s cubic-bezier(.4,0,.2,1)';
      el.style.strokeDashoffset = '0';
    });
  }, [data.join(',')]);

  const gridLines = 4;
  const grid = Array.from({ length: gridLines + 1 }, (_, i) => {
    const gy = padT + (i / gridLines) * innerH;
    const val = Math.round(max - (i / gridLines) * (max - min));
    return { gy, val };
  });

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let nearest = 0, best = Infinity;
    pts.forEach((p, i) => { const d = Math.abs(p.x - px); if (d < best) { best = d; nearest = i; } });
    setHover(nearest);
  };

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height={H} onMouseMove={onMove} onMouseLeave={() => setHover(null)} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.26" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((g, i) => (
        <g key={i}>
          <line x1={padL} y1={g.gy} x2={W - padR} y2={g.gy} stroke="#EBEAE2" strokeWidth="1" />
          <text x={padL - 9} y={g.gy + 4} textAnchor="end" fontSize="11" fontWeight="700" fill="#9C9B92" fontFamily="Inter">{g.val}</text>
        </g>
      ))}
      <path d={area} fill={`url(#${gradId})`} />
      <path ref={pathRef} d={line} fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={hover === i ? 6 : 4} fill="#fff" stroke={color} strokeWidth="3" style={{ transition: 'r .12s' }} />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={x(i)} y={H - 9} textAnchor="middle" fontSize="11" fontWeight="700" fill="#9C9B92" fontFamily="Inter">{l}</text>
      ))}
      {hover !== null && (
        <g>
          <line x1={pts[hover].x} y1={padT} x2={pts[hover].x} y2={padT + innerH} stroke={color} strokeWidth="1.4" strokeDasharray="4 4" opacity="0.5" />
          <g transform={`translate(${Math.min(Math.max(pts[hover].x, padL + 38), W - padR - 38)}, ${Math.max(pts[hover].y - 38, padT + 6)})`}>
            <rect x="-38" y="-20" width="76" height="30" rx="8" fill="#111110" />
            <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="Inter">{data[hover].toLocaleString()}</text>
          </g>
        </g>
      )}
    </svg>
  );
}

export function Spark({ data, color = '#15B97C', w = 150, h = 30 }: { data: number[]; color?: string; w?: number; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data);
  const x = (i: number) => (i / (data.length - 1)) * w;
  const y = (v: number) => h - 3 - ((v - min) / (max - min || 1)) * (h - 6);
  const pts: Pt[] = data.map((v, i) => ({ x: x(i), y: y(v) }));
  const d = smoothPath(pts);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: 'block' }}>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={color} opacity="0.13" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
