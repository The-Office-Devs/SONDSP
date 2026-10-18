import { useEffect, useState } from "react";

/** Facilita na hora de limpar os storages */
const STORAGE_PREFIX = "session-state:";

/** Utilizado para manter os filtros entre as telas */
export function useSessionState<T>(key: string | undefined, initialValue: T) {
  const storageKey = key ? `${STORAGE_PREFIX}${key}` : undefined;

  const [value, setValue] = useState<T>(() => {
    if (!key) return initialValue;
    
    try {
      const saved = sessionStorage.getItem(key);
      return saved === null ? initialValue : (JSON.parse(saved) as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (!storageKey) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Se não tiver acesso ao storage, o valor continua só em memória
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
}

/** Apaga os filtros no logout */
export function clearSessionState() {
  try {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => sessionStorage.removeItem(key));
  } catch {
    // Se não tiver acesso ao storage, não dá pra limpar
  }
}