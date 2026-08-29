import { useState } from "react";
import { useDebounce } from "./use-debounce";

export function useTableState(initialSize = 5) {
  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(initialSize);

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
