import { useRef, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { SPONSOR_URL } from '../lib/site.js';

// Sponsor details are sent to Dodo Payments with the checkout link (email prefill + metadata_* fields), so they
// arrive attached to the payment in the Dodo dashboard. No backend needed.
const LIMITS = { product: 60, link: 200, description: 200 };

function normaliseLink(v) {
  const s = v.trim();
  if (!s) return '';
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withScheme);
    return u.hostname.includes('.') ? u.href : '';
  } catch {
    return '';
  }
}

export function checkoutUrl({ product, link, description, email }) {
  const url = new URL(SPONSOR_URL);
  url.searchParams.set('email', email.trim());
  url.searchParams.set('metadata_product', product.trim());
  url.searchParams.set('metadata_link', link);
  if (description.trim()) url.searchParams.set('metadata_description', description.trim());
  return url.href;
}

// Returns [open, dialog]: call open() from any trigger, render dialog once.
export function useSponsorDialog() {
  const ref = useRef(null);
  const open = (e) => {
    if (!ref.current?.showModal) return; // very old browser: let the plain checkout link work
    e?.preventDefault();
    ref.current.showModal();
  };
  return [open, <SponsorDialog key="sponsor-dialog" dialogRef={ref} />];
}

function SponsorDialog({ dialogRef }) {
  const [form, setForm] = useState({ product: '', link: '', description: '', email: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const close = () => dialogRef.current?.close();

  const submit = (e) => {
    e.preventDefault();
    const link = normaliseLink(form.link);
    if (!form.product.trim()) return setError('Add your product or brand name.');
    if (!link) return setError('Add a valid link, like example.com.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Add an email we can reach you at.');
    setError('');
    window.location.href = checkoutUrl({ ...form, link });
  };

  return (
    <dialog ref={dialogRef} className="sponsor-dialog" aria-labelledby="sponsor-title" onClick={(e) => e.target === e.currentTarget && close()}>
      <form onSubmit={submit} noValidate>
        <header className="sponsor-dialog-head">
          <h2 id="sponsor-title" className="h2">
            Become a sponsor
          </h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close">
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <p className="muted">Tell us about your brand, then pay on the next page. Your logo goes up in the sponsor section on the NextPlay homepage.</p>

        <label className="field">
          <span>Product</span>
          <input value={form.product} onChange={set('product')} placeholder="e.g. Acme Studio" maxLength={LIMITS.product} autoComplete="organization" required />
        </label>
        <label className="field">
          <span>
            Link <em>Where it points</em>
          </span>
          <input value={form.link} onChange={set('link')} placeholder="example.com" maxLength={LIMITS.link} inputMode="url" autoComplete="url" required />
        </label>
        <label className="field">
          <span>
            Description <em>{form.description.length}/{LIMITS.description}</em>
          </span>
          <textarea value={form.description} onChange={set('description')} placeholder="Short description highlighting what your product does." maxLength={LIMITS.description} rows={3} />
        </label>
        <label className="field">
          <span>
            Email <em>Where we reach you</em>
          </span>
          <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" required />
        </label>

        {error ? (
          <p className="sponsor-error" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn btn-accent sponsor-submit">
          Continue to payment <ArrowRight size={16} aria-hidden="true" />
        </button>
        <p className="faint" style={{ fontSize: 12, textAlign: 'center' }}>
          Secure checkout by Dodo Payments. Your details are attached to the payment.
        </p>
      </form>
    </dialog>
  );
}
