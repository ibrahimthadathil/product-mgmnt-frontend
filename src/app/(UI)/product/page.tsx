"use client";

import { useState } from "react";
import { ProductModal } from "@/components/product-modal";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Product } from "@/types/types";
import {
  addProduct,
  getAllProduct,
  deleteProduct,
  editProduct,
} from "@/api/productApi";
import { UseRQ } from "@/hooks/useRQ";
import { UseRMutation } from "@/hooks/useMutation";
import { DataTable } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { toast } from "sonner";
export const dynamic = "force-dynamic";
export default function ProductsPage() {
  const { data: products, isLoading: productLoading } = UseRQ<Product[]>(
    "products",
    getAllProduct
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const addMutation = UseRMutation("products", async (newProduct: FormData) => {
    const result = await addProduct(newProduct);
    return { data: result };
  });

  const editMutation = UseRMutation(
    "products",
    async (body: { productId: string; data: FormData }) => {
      const result = await editProduct(body.productId, body.data);
      return { data: result };
    }
  );

  const deleteMutation = UseRMutation("products", async (productId: string) => {
    const result = await deleteProduct(productId);
    return { data: result };
  });

  const handleAddProduct = async (newProduct: FormData) => {
    try {
      setIsModalOpen(false);
      const data = await addMutation.mutateAsync(newProduct);
      if (data.success) toast.success(data.message);
      else toast.error(data.message);
    } catch (error) {
      toast.error("error in add product");
    }
  };

  const handleEditProduct = async (updatedProduct: FormData) => {
    if (!editingProduct?._id) return;
    try {
      setIsModalOpen(false);
      const data = await editMutation.mutateAsync({
        productId: editingProduct._id,
        data: updatedProduct,
      });
      toast.success(data.message);
      setEditingProduct(null);
    } catch (error) {
      toast.error("error in edit product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const data = await deleteMutation.mutateAsync(id);
      toast.success(data.message);
    } catch (error) {
      toast.error("error in delete product");
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const columns: ColumnDef<Product>[] = [
    {
      header: "No",
      cell: ({ row }) => <p>{row.index + 1}</p>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
    },
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const images = row.original.images || [];
        const firstImage = images[0] || "";
        const isBase64 = firstImage.startsWith("data:");
        return (
          <div className="flex justify-center">
            {firstImage ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                {isBase64 ? (
                  <Image
                    src={firstImage}
                    alt={row.original.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={firstImage}
                    alt={row.original.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-400">No Image</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="text-center max-w-xs truncate"
          title={row.original.description}
        >
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price =
          typeof row.original.price === "string"
            ? parseFloat(row.original.price)
            : row.original.price;
        return (
          <div className="text-center">
            ${isNaN(price) ? "0.00" : price.toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="text-center">{row.original.category}</div>
      ),
    },
    {
      id: "edit",
      header: "Edit",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditClick(row.original)}
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
  ];

  return (
    <main className="max-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </div>

        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          initialProduct={editingProduct}
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
