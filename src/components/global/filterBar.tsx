"use client";

import React, { useEffect } from "react";
import { LayoutGrid, List } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ViewMode } from "@/types/types";

interface FilterBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchChange: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  onPriceChange?: (price: string) => void;
  categories?: string[];
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
  categories = [],
}) => {
  const { register, watch, setValue } = useForm<FilterFormData>({
    defaultValues: {
      search: "",
      category: "Category",
      price: "Price",
    },
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "search" && value.search !== undefined) {
        onSearchChange(value.search);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onSearchChange]);

  const handleCategoryChange = (value: string) => {
    setValue("category", value);
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };

  const handlePriceChange = (value: string) => {
    setValue("price", value);
    if (onPriceChange) {
      onPriceChange(value);
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="w-full md:w-96">
        <Input
          {...register("search")}
          placeholder="Search for products..."
          className="h-10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Category Select */}
        <Select onValueChange={handleCategoryChange} defaultValue="Category">
          <SelectTrigger className="h-10 w-[140px] rounded-full border-slate-200 bg-slate-50 text-sm text-slate-600 focus:ring-2 focus:ring-primary-500">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Category">Category</SelectItem>
            {categories.length > 0 ? (
              categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-categories" disabled>
                No categories available
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {/* Price Select */}
        <Select onValueChange={handlePriceChange} defaultValue="Price">
          <SelectTrigger className="h-10 w-[140px] rounded-full border-slate-200 bg-slate-50 text-sm text-slate-600 focus:ring-2 focus:ring-primary-500">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Price">Price</SelectItem>
            <SelectItem value="Low to High">Low to High</SelectItem>
            <SelectItem value="High to Low">High to Low</SelectItem>
          </SelectContent>
        </Select>

        {/* View Mode Toggle */}
        <div className="ml-auto flex items-center rounded-full bg-slate-100 p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all h-auto",
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow-sm hover:bg-white"
                : "text-slate-500 hover:text-slate-900 hover:bg-transparent"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid View</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("table")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all h-auto",
              viewMode === "table"
                ? "bg-white text-slate-900 shadow-sm hover:bg-white"
                : "text-slate-500 hover:text-slate-900 hover:bg-transparent"
            )}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Table View</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
