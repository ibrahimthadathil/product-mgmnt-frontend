'use client';

import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ViewMode } from '@/types/types';

interface FilterBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchChange: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  onPriceChange?: (price: string) => void;
}

interface FilterFormData {
  search: string;
  category: string;
  price: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  viewMode,
  onViewModeChange,
  onSearchChange,
  onCategoryChange,
  onPriceChange,
}) => {
  const { register, watch } = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      category: 'Category',
      price: 'Price',
    },
  });

  // Watch form values and trigger callbacks
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'search' && value.search !== undefined) {
        onSearchChange(value.search);
      }
      if (name === 'category' && value.category !== undefined && onCategoryChange) {
        onCategoryChange(value.category);
      }
      if (name === 'price' && value.price !== undefined && onPriceChange) {
        onPriceChange(value.price);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onSearchChange, onCategoryChange, onPriceChange]);

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="w-full md:w-96">
        <Input 
          {...register('search')}
          placeholder="Search for products..." 
          className="h-10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Category Select */}
        <div className="relative">
          <select 
            {...register('category')}
            className="h-10 w-[140px] appearance-none rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option>Category</option>
            <option>Clothing</option>
            <option>Footwear</option>
            <option>Accessories</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Price Select */}
        <div className="relative">
          <select 
            {...register('price')}
            className="h-10 w-[140px] appearance-none rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option>Price</option>
            <option>Low to High</option>
            <option>High to Low</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="ml-auto flex items-center rounded-full bg-slate-100 p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              viewMode === 'grid'
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid View</span>
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              viewMode === 'table'
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Table View</span>
          </button>
        </div>
      </div>
    </div>
  );
};