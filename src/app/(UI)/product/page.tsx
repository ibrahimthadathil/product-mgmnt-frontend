"use client";

import { useMemo } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductModal } from "@/components/product-modal";
import { DataTable } from "@/components/table/dataTable";
import type { Product } from "@/types/types";
import { useProducts } from "@/hooks/useProduct";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const {
    products,
    productLoading,
    isModalOpen,
    editingProduct,
    openAddModal,
    openEditModal,
    closeModal,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    isAdding,
    isEditing,
    isDeleting,
  } = useProducts();

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "images",
        header: "Image",
        cell: ({ row }) => {
          const src = row.original.images?.[0];
          return src ? (
            <div className="relative w-16 h-16">
              <Image src={src} alt={row.original.name} fill className="object-cover rounded-md" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-muted rounded-md" />
          );
        },
      },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "price", header: "Price" },
      {
      id: "edit",
      header: "Edit",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditModal(row.original)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
        );
      },
    },
        {
      id: "delete",
      header: "Delete",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteProduct(row.original._id as string)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        );
      },
    },
      // {
      //   id: "actions",
      //   header: "Actions",
      //   cell: ({ row }) => (
      //     <div className="flex justify-content-between">
      //       <Button
      //         variant="outline"
      //         size="sm"
      //         onClick={() => openEditModal(row.original)}
      //         disabled={isEditing}
      //         className="gap-1"
      //       >
      //         <Edit className="w-4 h-4" />
      //         Edit
      //       </Button>
      //       <Button
      //         variant="destructive"
      //         size="sm"
      //         onClick={() => handleDeleteProduct(row?.original?._id as string)}
      //         disabled={isDeleting}
      //         className="gap-1"
      //       >
      //         <Trash2 className="w-4 h-4" />
      //         Delete
      //       </Button>
      //     </div>
      //   ),
      // },
    ],
    [handleDeleteProduct, isDeleting, isEditing, openEditModal]
  );

  return (
    <main className="max-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <Button onClick={openAddModal} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </div>

        <ProductModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          initialProduct={editingProduct}
          isLoading={isAdding || isEditing}
        />

        {productLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <DataTable data={products || []} columns={columns} />
        )}
      </div>
    </main>
  );
}