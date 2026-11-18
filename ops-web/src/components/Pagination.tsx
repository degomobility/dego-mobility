"use client";

import { useEffect, useState } from "react";

const pageSizeOptions = [10, 25, 50, 100];

export function usePagination<T>(items: readonly T[], resetKey?: string) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return {
    items: items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    page: currentPage,
    pageCount,
    pageSize,
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
    totalItems: items.length,
    firstItem: items.length === 0 ? 0 : (currentPage - 1) * pageSize + 1,
    lastItem: Math.min(currentPage * pageSize, items.length),
  };
}

export function PaginationControls({
  firstItem,
  lastItem,
  totalItems,
  page,
  pageCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  firstItem: number;
  lastItem: number;
  totalItems: number;
  page: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <select
          aria-label="Rows per page"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-200"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span>{firstItem}–{lastItem} of {totalItems}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-slate-700 px-2.5 py-1.5 text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="min-w-16 text-center">Page {page} of {pageCount}</span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-slate-700 px-2.5 py-1.5 text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
