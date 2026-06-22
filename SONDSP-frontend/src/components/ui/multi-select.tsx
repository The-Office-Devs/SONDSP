import { CheckIcon, ChevronDown, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"
import { Badge } from "@/components/ui/badge"

type MultiSelectContextType = {
  open: boolean
  setOpen: (open: boolean) => void
  selectedValues: Set<string>
  toggleValue: (value: string) => void
  items: Map<string, ReactNode>
  single: boolean
  onItemAdded: (value: string, label: ReactNode) => void
}

const MultiSelectContext = createContext<MultiSelectContextType | null>(null)

export function MultiSelect({
  children,
  values,
  defaultValues,
  onValuesChange,
  single = false,
}: {
  children: ReactNode
  values?: string[]
  defaultValues?: string[]
  onValuesChange?: (values: string[]) => void
  single?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [internalValues, setInternalValues] = useState(
    new Set<string>(values ?? defaultValues ?? []),
  )
  const selectedValues = values ? new Set(values) : internalValues
  const [items, setItems] = useState<Map<string, ReactNode>>(new Map())

  function toggleValue(value: string) {
    const getNewSet = (prev: Set<string>) => {
      if (single) {
        return prev.has(value) ? new Set<string>() : new Set<string>([value])
      }

      const newSet = new Set(prev)
      if (newSet.has(value)) {
        newSet.delete(value)
      } else {
        newSet.add(value)
      }

      return newSet
    }

    setInternalValues(getNewSet)
    onValuesChange?.([...getNewSet(selectedValues)])

    if (single) setOpen(false)
  }

  const onItemAdded = useCallback((value: string, label: ReactNode) => {
    setItems((prev) => {
      if (prev.get(value) === label) return prev
      return new Map(prev).set(value, label)
    })
  }, [])

  return (
    <MultiSelectContext.Provider
      value={{
        open,
        setOpen,
        selectedValues,
        single,
        toggleValue,
        items,
        onItemAdded,
      }}
    >
      <Popover open={open} onOpenChange={setOpen} modal>
        {children}
      </Popover>
    </MultiSelectContext.Provider>
  )
}

export function MultiSelectTrigger({
  className,
  children,
  ...props
}: {
  className?: string
  children?: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open } = useMultiSelectContext()

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        className={cn(
          "flex h-12 w-full cursor-pointer items-center justify-between rounded-lg border border-input bg-white px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-base dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className,
        )}
        {...props}
      >
        <div className="min-w-0 flex-1 overflow-hidden text-left">
          {children}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
      </button>
    </PopoverTrigger>
  )
}

export function MultiSelectValue({
  placeholder,
  clickToRemove = true,
  className,
  overflowBehavior = "wrap-when-open",
  ...props
}: {
  placeholder?: string
  clickToRemove?: boolean
  overflowBehavior?: "wrap" | "wrap-when-open" | "cutoff"
} & Omit<ComponentPropsWithoutRef<"div">, "children">) {
  const { selectedValues, toggleValue, items, open, single } =
    useMultiSelectContext()
  const [overflowAmount, setOverflowAmount] = useState(0)
  const valueRef = useRef<HTMLDivElement>(null)
  const overflowRef = useRef<HTMLDivElement>(null)

  const shouldWrap =
    overflowBehavior === "wrap" ||
    (overflowBehavior === "wrap-when-open" && open)

  const checkOverflow = useCallback(() => {
    if (!valueRef.current) return

    const containerElement = valueRef.current
    const overflowElement = overflowRef.current
    const selectedItems =
      containerElement.querySelectorAll<HTMLElement>("[data-selected-item]")

    if (overflowElement) overflowElement.style.display = "none"
    selectedItems.forEach((child) => child.style.removeProperty("display"))

    let amount = 0

    for (let i = selectedItems.length - 1; i >= 0; i--) {
      if (containerElement.scrollWidth <= containerElement.clientWidth) break

      amount = selectedItems.length - i
      selectedItems[i]!.style.display = "none"
      overflowElement?.style.removeProperty("display")
    }

    setOverflowAmount(amount)
  }, [])

  const handleResize = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return

      valueRef.current = node

      const mutationObserver = new MutationObserver(checkOverflow)
      const observer = new ResizeObserver(debounce(checkOverflow, 100))

      mutationObserver.observe(node, {
        childList: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      })

      observer.observe(node)
      checkOverflow()

      return () => {
        observer.disconnect()
        mutationObserver.disconnect()
        valueRef.current = null
      }
    },
    [checkOverflow],
  )

  if (selectedValues.size === 0 && placeholder) {
    return (
      <span className="line-clamp-1 text-muted-foreground">{placeholder}</span>
    )
  }

  if (single && selectedValues.size > 0) {
    return (
      <span className="line-clamp-1">
        {items.get([...selectedValues][0])}
      </span>
    )
  }

  return (
    <div
      {...props}
      ref={handleResize}
      className={cn(
        "flex min-w-0 gap-1 overflow-hidden",
        shouldWrap && "flex-wrap",
        className,
      )}
    >
      {[...selectedValues]
        .filter((value) => items.has(value))
        .map((value) => (
          <Badge
            key={value}
            data-selected-item
            variant="secondary"
            className="max-w-full"
            onClick={
              clickToRemove
                ? (e) => {
                    e.stopPropagation()
                    toggleValue(value)
                  }
                : undefined
            }
          >
            <span className="truncate">{items.get(value)}</span>
            {clickToRemove && <XIcon className="ml-1 h-3 w-3" />}
          </Badge>
        ))}

      <Badge
        ref={overflowRef}
        variant="secondary"
        style={{ display: overflowAmount > 0 && !shouldWrap ? "inline-flex" : "none" }}
      >
        +{overflowAmount}
      </Badge>
    </div>
  )
}

export function MultiSelectContent({
  search = true,
  children,
  className,
  ...props
}: {
  search?: boolean | { placeholder?: string; emptyMessage?: string }
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<typeof Command>, "children">) {
  const canSearch = typeof search === "object" ? true : search

  return (
    <>
      <div className="hidden">
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>

      <PopoverContent
        align="start"
        className={cn(
          "w-[var(--radix-popover-trigger-width)] min-w-[8rem] rounded-md border bg-popover p-0 text-popover-foreground shadow-md",
          className,
        )}
      >
        <Command {...props}>
          {canSearch ? (
            <CommandInput
              placeholder={
                typeof search === "object" ? search.placeholder : "Selecione..."
              }
              className="h-12"
            />
          ) : (
            <button autoFocus className="sr-only" />
          )}

          <CommandList>
            {canSearch && (
              <CommandEmpty>
                {typeof search === "object"
                  ? search.emptyMessage
                  : "Nenhum resultado encontrado."}
              </CommandEmpty>
            )}

            {children}
          </CommandList>
        </Command>
      </PopoverContent>
    </>
  )
}

export function MultiSelectItem({
  value,
  children,
  badgeLabel,
  className,
  onSelect,
  ...props
}: {
  badgeLabel?: ReactNode
  value: string
  className?: string
} & Omit<ComponentPropsWithoutRef<typeof CommandItem>, "value">) {
  const { toggleValue, selectedValues, onItemAdded } = useMultiSelectContext()
  const isSelected = selectedValues.has(value)

  useEffect(() => {
    onItemAdded(value, badgeLabel ?? children)
  }, [value, children, onItemAdded, badgeLabel])

  return (
    <CommandItem
      {...props}
      value={value}
      onSelect={() => {
        toggleValue(value)
        onSelect?.(value)
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-base outline-none hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className,
      )}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <CheckIcon className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
      </span>
      {children}
    </CommandItem>
  )
}

export function MultiSelectGroup(
  props: ComponentPropsWithoutRef<typeof CommandGroup>,
) {
  return <CommandGroup {...props} />
}

export function MultiSelectSeparator(
  props: ComponentPropsWithoutRef<typeof CommandSeparator>,
) {
  return <CommandSeparator {...props} />
}

function useMultiSelectContext() {
  const context = useContext(MultiSelectContext)
  if (context == null) {
    throw new Error("useMultiSelectContext must be used within a MultiSelect")
  }
  return context
}

function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}