"use client";

import { FilterBar } from "@/components/global/filterBar";
import { Pagination } from "@/components/global/pagination";
import { DataTable } from "@/components/table/dataTable";
import { GenericGrid } from "@/components/table/gridTable";
import { ViewMode, Product } from "@/types/types";
import { AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { mockProducts } from "@/data/mockProducts";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

const ITEMS_PER_PAGE = 12;

const page = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Category");
  const [priceSort, setPriceSort] = useState<string>("Price");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "Category") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply price sorting
    if (priceSort === "Low to High") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === "High to Low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceSort]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Grid config for GenericGrid
  const gridConfig = {
    getId: (product: Product) => product?.id,
    getImageUrl: (product: Product) => product?.images[0]||"",
    getTitle: (product: Product) => product?.name,
    getDescription: (product: Product) => product?.description,
    getPrice: (product: Product) => product?.price,
    onActionClick: (product: Product) => {
      console.log("Add to cart:", product);
    },
    actionIcon: <ShoppingCart className="h-4 w-4 text-white" />,
  };

  // Table columns for DataTable
  const tableColumns: ColumnDef<Product>[] = [
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => (
        <Image
          src={row.original.images[0] || ""}
          alt={row.original.name}
          width={64}
          height={64}
          className="h-16 w-16 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">{row.original.name}</div>
          <div className="text-sm text-slate-500 line-clamp-1">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(row.original.price);
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          onClick={() => {
            console.log("Add to cart:", row.original);
            // TODO: Implement add to cart functionality
          }}
          className="h-8"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      ),
    },
  ];

  // Handle filter changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceChange = (price: string) => {
    setPriceSort(price);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <FilterBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onPriceChange={handlePriceChange}
      />
      <div className="min-h-[600px]">
        {filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-lg text-slate-500">
              No products found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <GenericGrid
                  key="grid"
                  items={paginatedProducts}
                  config={gridConfig}
                  columns={{ sm: 2, md: 2, lg: 4, xl: 4 }}
                />
              ) : (
                <DataTable
                  key="table"
                  data={paginatedProducts}
                  columns={tableColumns}
                />
              )}
            </AnimatePresence>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default page;
