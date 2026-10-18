import { useDebounce } from "./use-debounce";
import { useSessionState } from "./use-session-state";

export function useTableState(initialSize = 5, storageKey?: string) {
  const [filter, setFilter] = useSessionState(storageKey && `${storageKey}:search`, "");
  const debouncedFilter = useDebounce(filter);
  const [page, setPage] = useSessionState(storageKey && `${storageKey}:page`, 0);
  const [size, setSize] = useSessionState(storageKey && `${storageKey}:size`, initialSize);

  const handleFilterChange = (val: string) => {
    setFilter(val);
    setPage(0);
  };

  return {
    filter,
    setFilter: handleFilterChange,
    debouncedFilter,
    page,
    setPage,
    size,
    setSize,
  };
}
