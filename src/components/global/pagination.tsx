'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="text-slate-500"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {[1, 2, 3].map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onPageChange(page)}
          className={cn(
            "h-9 w-9 rounded-full text-sm",
            currentPage === page
              ? "bg-primary hover:bg-primary/90"
              : "text-slate-500 hover:bg-slate-100"
          )}
        >
          {page}
        </Button>
      ))}
      
      <span className="px-2 text-slate-400">...</span>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(10)}
        className="h-9 w-9 rounded-full text-sm text-slate-500"
      >
        10
      </Button>

      <Button
        variant="ghost"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="text-slate-500"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};