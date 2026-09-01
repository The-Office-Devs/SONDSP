import { useEffect, useState } from "react";

export function useDebounce<T>(value: T): T {
  const [debounced, setDebounced] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), 500);
    return () => clearTimeout(timer);
  }, [value]);
  
  return debounced;
}