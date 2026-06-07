import { useSyncExternalStore } from 'react';

function getMatch(query: string): boolean {
  if (globalThis.window === undefined) {
    return false;
  }

  return globalThis.window.matchMedia(query).matches;
}

export function useMediaQuery(query: string): boolean {
  const subscribe = (onStoreChange: () => void) => {
    if (globalThis.window === undefined) {
      return () => undefined;
    }

    const mediaQueryList = globalThis.window.matchMedia(query);
    const onChange = () => onStoreChange();

    mediaQueryList.addEventListener('change', onChange);
    return () => mediaQueryList.removeEventListener('change', onChange);
  };

  const getSnapshot = () => getMatch(query);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}
