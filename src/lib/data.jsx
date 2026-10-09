import { createContext, use, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { dataUrl } from '../routes.js';

// Per-route JSON produced at build time (dist/data/**). The initial route's payload is inlined in the
// HTML so hydration is synchronous; later navigations fetch + cache.

const StoreContext = createContext(null);
const norm = (p) => p.replace(/\/+$/, '') || '/';

function fulfilled(value) {
  const p = Promise.resolve(value);
  p.status = 'fulfilled';
  p.value = value;
  return p;
}

export function createDataStore(initial) {
  const cache = new Map();
  if (initial) cache.set(norm(initial.path), fulfilled(initial.data));
  return {
    builtAt: initial?.data?.builtAt ?? Math.floor(Date.now() / 1000),
    get(path) {
      const key = norm(path);
      if (!cache.has(key)) {
        const p = fetch(dataUrl(key)).then((r) => {
          if (r.status === 404) return { status: 404 };
          if (!r.ok) throw new Error(`Request failed (${r.status})`);
          return r.json();
        });
        p.then(
          (v) => Object.assign(p, { status: 'fulfilled', value: v }),
          (e) => {
            Object.assign(p, { status: 'rejected', reason: e });
            cache.delete(key);
          }
        );
        cache.set(key, p);
      }
      return cache.get(key);
    },
  };
}

export function DataProvider({ store, children }) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}

export function useRouteData() {
  const { pathname } = useLocation();
  return use(useContext(StoreContext).get(pathname));
}

// Prefetch on hover/focus so navigation feels instant.
export function usePrefetch() {
  const store = useContext(StoreContext);
  return (path) => {
    if (typeof window !== 'undefined' && path?.startsWith('/')) store.get(path.split('?')[0].split('#')[0]);
  };
}

// "Now" that matches the build on first render (no hydration mismatch), then follows the real clock.
const NowContext = createContext(0);

export function NowProvider({ initial, children }) {
  const [now, setNow] = useState(initial);
  useEffect(() => {
    setNow(Math.floor(Date.now() / 1000));
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 60000);
    return () => clearInterval(id);
  }, []);
  return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
}

export const useNow = () => useContext(NowContext);

export function useTicker(initial, ms = 1000) {
  const [now, setNow] = useState(initial);
  useEffect(() => {
    setNow(Date.now() / 1000);
    const id = setInterval(() => setNow(Date.now() / 1000), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}
