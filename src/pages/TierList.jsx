import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, Link2, RotateCcw, Share2 } from 'lucide-react';
import { Link, PageHead, Faq } from '../components/ui.jsx';
import { cover } from '../lib/images.js';

const TIERS = [
  { key: 'S', color: '#ff5a5f' },
  { key: 'A', color: '#ff9f43' },
  { key: 'B', color: '#ffd93d' },
  { key: 'C', color: '#c8ff2e' },
  { key: 'D', color: '#5ad1ff' },
  { key: 'F', color: '#b38cff' },
];
const empty = () => Object.fromEntries(TIERS.map((t) => [t.key, []]));

// Share format: #S=id36.id36;A=...  (IGDB ids in base36 keep links short)
function encode(state) {
  return TIERS.filter((t) => state[t.key].length)
    .map((t) => `${t.key}=${state[t.key].map((id) => id.toString(36)).join('.')}`)
    .join(';');
}
function decode(hash, valid) {
  const out = empty();
  hash.replace(/^#/, '').split(';').forEach((part) => {
    const [k, v] = part.split('=');
    if (out[k] && v) out[k] = v.split('.').map((s) => parseInt(s, 36)).filter((id) => valid.has(id));
  });
  return out;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function renderPng(title, state, byId) {
  const W = 1200, label = 120, size = { w: 84, h: 112 }, gap = 6, pad = 8, header = 96, footer = 48;
  const perRow = Math.floor((W - label - pad * 2 + gap) / (size.w + gap));
  const rows = TIERS.map((t) => Math.max(1, Math.ceil(state[t.key].length / perRow)));
  const H = header + rows.reduce((a, r) => a + r * (size.h + gap) + pad * 2 - gap + 4, 0) + footer;
  const c = document.createElement('canvas');
  c.width = W * 2;
  c.height = H * 2;
  const ctx = c.getContext('2d');
  ctx.scale(2, 2);
  ctx.fillStyle = '#0b0b0d';
  ctx.fillRect(0, 0, W, H);
  await document.fonts?.ready;
  ctx.fillStyle = '#f2f2f3';
  ctx.font = '800 40px Archivo, Arial Narrow, sans-serif';
  ctx.fillText(title, 24, 62);

  const ids = TIERS.flatMap((t) => state[t.key]);
  const imgs = new Map(await Promise.all(ids.map(async (id) => [id, await loadImage(cover(byId.get(id)?.cover, 'cover_big').replace('.webp', '.jpg'))])));

  let y = header;
  TIERS.forEach((t, i) => {
    const h = rows[i] * (size.h + gap) + pad * 2 - gap;
    ctx.fillStyle = '#141417';
    ctx.fillRect(0, y, W, h);
    ctx.fillStyle = t.color;
    ctx.fillRect(0, y, label, h);
    ctx.fillStyle = '#0b0b0d';
    ctx.font = '900 48px Archivo, Arial Narrow, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.key, label / 2, y + h / 2 + 17);
    ctx.textAlign = 'left';
    state[t.key].forEach((id, j) => {
      const x = label + pad + (j % perRow) * (size.w + gap);
      const yy = y + pad + Math.floor(j / perRow) * (size.h + gap);
      const img = imgs.get(id);
      if (img) ctx.drawImage(img, x, yy, size.w, size.h);
      else {
        ctx.fillStyle = '#24242a';
        ctx.fillRect(x, yy, size.w, size.h);
      }
    });
    y += h + 4;
  });
  ctx.fillStyle = '#c8ff2e';
  ctx.font = '600 18px Geist Mono, monospace';
  ctx.fillText('nextplaygame.me/tier-list', 24, H - 18);
  return new Promise((r) => c.toBlob(r, 'image/png'));
}

export default function TierList({ data }) {
  const { title, key, pool, templates, seo } = data;
  const byId = useMemo(() => new Map(pool.map((g) => [g.id, g])), [pool]);
  const storageKey = `np_tier_${key}`;
  const [state, setState] = useState(empty);
  const [shared, setShared] = useState(false);
  const [selected, setSelected] = useState(null);
  const [drag, setDrag] = useState(null); // { id, x, y }
  const [over, setOver] = useState(null);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const loaded = useRef(false);
  const dragRef = useRef(null);
  const initialState = useRef(state);

  // Restore: shared link wins, then saved progress.
  useEffect(() => {
    const valid = new Set(pool.map((g) => g.id));
    if (window.location.hash.length > 3) {
      setState(decode(window.location.hash, valid));
      setShared(true);
    } else {
      const saved = localStorage.getItem(storageKey);
      if (saved) setState(decode(saved, valid));
    }
    loaded.current = true;
  }, [pool, storageKey]);

  useEffect(() => {
    // Skip the initial empty state so a restore is never overwritten before it applies.
    if (loaded.current && !shared && state !== initialState.current) localStorage.setItem(storageKey, encode(state));
  }, [state, shared, storageKey]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const placed = new Set(TIERS.flatMap((t) => state[t.key]));
  const unranked = pool.filter((g) => !placed.has(g.id));

  const move = useCallback((id, tier, beforeId = null) => {
    setState((s) => {
      const next = Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v.filter((x) => x !== id)]));
      if (tier !== 'pool') {
        const list = next[tier];
        const at = beforeId != null ? list.indexOf(beforeId) : -1;
        if (at >= 0) list.splice(at, 0, id);
        else list.push(id);
      }
      return next;
    });
    setShared(false);
  }, []);

  // Pointer-based drag (works with mouse, pen and touch).
  const targetAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const zone = el?.closest('[data-zone]');
    const item = el?.closest('[data-item]');
    return zone ? { tier: zone.dataset.zone, before: item ? Number(item.dataset.item) : null } : null;
  };
  // Listeners attach synchronously on pointerdown so even a very fast flick is tracked.
  const startDrag = (e, id) => {
    const start = { id, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false };
    dragRef.current = start;
    setDrag(start);
    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const next = { ...d, x: ev.clientX, y: ev.clientY, moved: d.moved || Math.hypot(ev.clientX - d.sx, ev.clientY - d.sy) > 6 };
      dragRef.current = next;
      setDrag(next);
      setOver(targetAt(ev.clientX, ev.clientY)?.tier || null);
    };
    const onUp = (ev) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointercancel', onUp);
      const d = dragRef.current;
      const t = targetAt(ev.clientX, ev.clientY);
      const moved = d && (d.moved || Math.hypot(ev.clientX - d.sx, ev.clientY - d.sy) > 6);
      if (ev.type === 'pointerup' && moved && t) move(d.id, t.tier, t.before === d.id ? null : t.before);
      else if (ev.type === 'pointerup' && d && !moved) setSelected((cur) => (cur === d.id ? null : d.id)); // tap = select
      dragRef.current = null;
      setDrag(null);
      setOver(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
    window.addEventListener('pointercancel', onUp, { once: true });
  };

  const Item = ({ g }) => (
    <button
      type="button"
      className="tier-item"
      data-item={g.id}
      aria-pressed={selected === g.id}
      aria-label={`${g.name}${selected === g.id ? ' (selected — choose a tier)' : ''}`}
      title={g.name}
      style={drag?.id === g.id && drag.moved ? { opacity: 0.3 } : undefined}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        startDrag(e, g.id);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelected((s) => (s === g.id ? null : g.id));
        }
        const idx = TIERS.findIndex((t) => t.key === e.key.toUpperCase());
        if (idx >= 0) move(g.id, TIERS[idx].key);
      }}
    >
      <img src={cover(g.cover, 'cover_small')} srcSet={`${cover(g.cover, 'cover_small')} 90w, ${cover(g.cover, 'cover_big')} 264w`} sizes="64px" alt="" loading="lazy" draggable="false" />
    </button>
  );

  const placeSelected = (tier) => {
    if (selected == null) return;
    move(selected, tier);
    setSelected(null);
  };

  const download = async () => {
    setBusy(true);
    try {
      const blob = await renderPng(title, state, byId);
      const file = new File([blob], `${key === 'default' ? 'my' : key}-tier-list.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title, text: `My ${title} — make yours at nextplaygame.me/tier-list` }).catch(() => {});
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }
    } catch {
      flash('Could not create the image. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${encode(state)}`;
    try {
      await navigator.clipboard.writeText(url);
      flash('Link copied — anyone can open your exact list');
    } catch {
      window.prompt('Copy this link', url);
    }
  };

  const dragged = drag?.moved ? byId.get(drag.id) : null;
  const count = placed.size;

  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow="Tier list maker" title={title} lede={`Drag covers into tiers (or tap a cover, then tap a tier). Keyboard: focus a cover and press S, A, B, C, D or F. Saved automatically.`}>
        <nav className="filter-bar" aria-label="Templates" style={{ marginTop: 20, marginBottom: 0 }}>
          {templates.map((t) => (
            <Link key={t.path} to={t.path} className="chip" aria-current={t.path === seo.url.replace('https://nextplaygame.me', '') ? 'page' : undefined}>
              {t.title}
            </Link>
          ))}
        </nav>
      </PageHead>

      <section className="container" aria-label="Tier list">
        {shared ? (
          <div className="notice" style={{ marginBottom: 16 }}>
            <span>
              <strong>Viewing a shared tier list.</strong> Move anything to start your own version.
            </span>
          </div>
        ) : null}
        <div className="row wrap between" style={{ marginBottom: 14 }}>
          <span className="mono faint" style={{ fontSize: 13 }}>
            {count}/{pool.length} ranked
          </span>
          <div className="row wrap" style={{ gap: 8 }}>
            <button type="button" className="btn btn-sm" onClick={() => (setState(empty()), setShared(false), history.replaceState(null, '', window.location.pathname))} disabled={!count}>
              <RotateCcw size={15} aria-hidden="true" /> Reset
            </button>
            <button type="button" className="btn btn-sm" onClick={copyLink} disabled={!count}>
              <Link2 size={15} aria-hidden="true" /> Copy link
            </button>
            <button type="button" className="btn btn-sm btn-accent" onClick={download} disabled={!count || busy}>
              {typeof navigator !== 'undefined' && navigator.canShare ? <Share2 size={15} aria-hidden="true" /> : <Download size={15} aria-hidden="true" />}
              {busy ? 'Creating image…' : 'Save image'}
            </button>
          </div>
        </div>

        <div className="tiers">
          {TIERS.map((t) => (
            <div className="tier" key={t.key}>
              <button type="button" className="label" style={{ background: t.color }} onClick={() => placeSelected(t.key)} aria-label={selected != null ? `Place ${byId.get(selected)?.name} in tier ${t.key}` : `Tier ${t.key}`}>
                {t.key}
              </button>
              <div className="drop" data-zone={t.key} data-over={over === t.key} onClick={(e) => e.target === e.currentTarget && placeSelected(t.key)}>
                {state[t.key].map((id) => byId.get(id) && <Item key={id} g={byId.get(id)} />)}
              </div>
            </div>
          ))}
        </div>

        <h2 className="eyebrow" style={{ marginTop: 28 }}>
          Unranked · {unranked.length}
        </h2>
        <div className="tier-pool" data-zone="pool" data-over={over === 'pool'} onClick={(e) => e.target === e.currentTarget && selected != null && (move(selected, 'pool'), setSelected(null))}>
          {unranked.length ? unranked.map((g) => <Item key={g.id} g={g} />) : <p className="faint" style={{ padding: 12 }}>All ranked. Save the image and post it.</p>}
        </div>
      </section>

      <div className="container">
        <Faq
          items={[
            { q: 'How do I make a tier list?', a: 'Drag each game cover into a tier from S (best) to F (worst). On a phone, tap a cover and then tap a tier letter. Your progress saves automatically in this browser.' },
            { q: 'How do I share my tier list?', a: 'Use "Save image" to download a PNG (or share it directly on mobile), or "Copy link" to share a link that opens your exact rankings.' },
            { q: 'Which games are included?', a: `${pool.length} of the most popular games for this template, chosen by player interest from IGDB and Steam data. Switch templates above for other years.` },
          ]}
        />
      </div>

      {dragged ? (
        <div aria-hidden="true" style={{ position: 'fixed', left: drag.x - 32, top: drag.y - 42, width: 64, pointerEvents: 'none', zIndex: 80, transform: 'rotate(-4deg) scale(1.08)', boxShadow: '0 16px 30px rgba(0,0,0,.6)', borderRadius: 4, overflow: 'hidden' }}>
          <img src={cover(dragged.cover, 'cover_small')} alt="" />
        </div>
      ) : null}
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </>
  );
}
