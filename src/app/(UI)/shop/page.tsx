"use client";

import { FilterBar } from "@/components/global/filterBar";
import { Pagination } from "@/components/global/pagination";
import { DataTable } from "@/components/table/dataTable";
import { GenericGrid } from "@/components/table/gridTable";
import { ViewMode, Product } from "@/types/types";
import { AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { UseRQ } from "@/hooks/useRQ";
import { UseRMutation } from "@/hooks/useMutation";
import { getAllProduct } from "@/api/productApi";
import { addToCart } from "@/api/cartApi";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 8;

const Page = () => {
  const { data: products, isLoading: productLoading } = UseRQ<Product[]>(
    "products",
    getAllProduct
  );
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 700);
  const [selectedCategory, setSelectedCategory] = useState<string>("Category");
  const [priceSort, setPriceSort] = useState<string>("Price");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product?.category).filter(Boolean))
    );
    return uniqueCategories.sort();
  }, [products]);

  const addToCartMutation = UseRMutation("cart", async (product: string,qty:number =1) => {
    const result = await addToCart({items:[{product,quantity:qty}]} );
    return { data: result };
  });

  const handleAddToCart = async (product: Product) => {
    if (!product._id) {
      toast.warning("Product ID is missing");
      return;
    }
    try {
     const data= await addToCartMutation.mutateAsync(product._id);
     if(data.success){
       toast.success(data.message);
     }else toast.warning(data.message)
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    let filtered = [...products];

    // Apply search filter (using debounced value)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
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
  }, [products, debouncedSearchQuery, selectedCategory, priceSort]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Grid config for GenericGrid
  const gridConfig = {
    getId: (product: Product) => product?._id || "",
    getImageUrl: (product: Product) => product?.images[0] || "",
    getTitle: (product: Product) => product?.name,
    getDescription: (product: Product) => product?.description,
    getPrice: (product: Product) => product?.price,
    onActionClick: (product: Product) => {
      handleAddToCart(product);
    },
    actionIcon: <ShoppingCart className="h-4 w-4 text-white" />,
    getNavigationUrl: (product: Product) => `/shop/${product?._id}`,
  };

  // Table columns for DataTable
  const tableColumns: ColumnDef<Product>[] = [
    {
      header:'No',
      cell : ({row})=>(<p>{row.index +1}</p>)
    },
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
          onClick={() => handleAddToCart(row.original)}
          disabled={addToCartMutation.isPending}
          className="h-8"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
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
        categories={categories}
      />
      <div className="min-h-[600px]">
        {productLoading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-lg text-slate-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
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

export default Page;
