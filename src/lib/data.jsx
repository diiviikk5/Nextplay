import { createContext, use, useContext, useSyncExternalStore } from 'react';
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

// Clock as an external store: the server snapshot is the build time, so hydration matches the
// prerendered HTML exactly, then React switches to the real clock.
function clock(ms) {
  return {
    subscribe(cb) {
      const id = setInterval(cb, ms);
      return () => clearInterval(id);
    },
    // Quantised so the snapshot is stable between ticks.
    get: () => Math.floor(Date.now() / ms) * (ms / 1000),
  };
}
const MINUTE = clock(60000);
const SECOND = clock(1000);

const NowContext = createContext(0);

export function NowProvider({ initial, children }) {
  return <NowContext.Provider value={initial}>{children}</NowContext.Provider>;
}

export function useNow() {
  const built = useContext(NowContext);
  return useSyncExternalStore(MINUTE.subscribe, MINUTE.get, () => built);
}

export function useTicker(initial) {
  return useSyncExternalStore(SECOND.subscribe, SECOND.get, () => initial);
}
