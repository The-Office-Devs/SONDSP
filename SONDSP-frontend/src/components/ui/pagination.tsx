import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"
import type { VariantProps } from "class-variance-authority"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("", className)} {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Ir para a página anterior"
      size="default"
      className={cn("gap-1 pl-2.5 cursor-pointer", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Anterior</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Ir para a próxima página"
      size="default"
      className={cn("gap-1 pr-2.5 cursor-pointer", className)}
      {...props}
    >
      <span>Próximo</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">Mais páginas</span>
    </span>
  )
}

export interface AppPaginationProps {
  page: number; // 0-indexed page
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  totalElements?: number;
  size?: number;
  className?: string;
}

function AppPagination({
  page,
  totalPages,
  onPageChange,
  hasNext,
  hasPrevious,
  totalElements,
  size,
  className,
}: AppPaginationProps) {
  const currentPage = page; // 0-indexed
  const current = currentPage + 1; // 1-indexed for display

  const hasPrevPage = hasPrevious ?? currentPage > 0;
  const hasNextPage = hasNext ?? currentPage < totalPages - 1;

  const pageNumbers = React.useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    pages.push(1);

    if (current > 3) {
      pages.push("ellipsis");
    }

    let start = Math.max(2, current - 1);
    let end = Math.min(totalPages - 1, current + 1);

    if (current <= 3) {
      end = 4;
    } else if (current >= totalPages - 2) {
      start = totalPages - 3;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  }, [current, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 w-full px-2 py-3", className)}>
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (hasPrevPage) onPageChange(currentPage - 1);
              }}
              className={cn(
                "select-none",
                !hasPrevPage && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>

          {pageNumbers.map((pageNum, idx) => {
            if (pageNum === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const pageIdx = pageNum - 1;
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  isActive={pageIdx === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(pageIdx);
                  }}
                  className="cursor-pointer select-none"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (hasNextPage) onPageChange(currentPage + 1);
              }}
              className={cn(
                "select-none",
                !hasNextPage && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  AppPagination,
}
