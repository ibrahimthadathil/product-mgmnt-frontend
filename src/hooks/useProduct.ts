"use client";
import { useState } from "react";
import { toast } from "sonner";
import { UseRQ } from "./useRQ";
import { UseRMutation } from "./useMutation";
import { addProduct, editProduct, deleteProduct, getAllProduct } from "@/api/productApi";
import type { Product } from "@/types/types";

export const useProducts = () => {
  const { data: products, isLoading: productLoading } = UseRQ<Product[]>(
    "products",
    getAllProduct
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const addMutation = UseRMutation(
    "products",
    (newProduct: FormData) => addProduct(newProduct).then((data) => ({ data })),
    "products",
    (res) => {
      if (res?.data?.success) toast.success(res.data.message);
      else toast.error(res?.data?.message || "Create failed");
      setIsModalOpen(false);
    }
  );

  const editMutation = UseRMutation(
    "products",
    (body: { productId: string; data: FormData }) =>
      editProduct(body.productId, body.data).then((data) => ({ data })),
    "products",
    (res) => {
      if (res?.data?.success) toast.success(res.data.message);
      else toast.error(res?.data?.message || "Update failed");
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  );

  const deleteMutation = UseRMutation(
    "products",
    (productId: string) => deleteProduct(productId).then((data) => ({ data })),
    "products",
    (res) => {
      if (res?.data?.success) toast.success(res.data.message);
      else toast.error(res?.data?.message || "Delete failed");
    }
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleAddProduct = (newProduct: FormData) => addMutation.mutate(newProduct);

  const handleEditProduct = (updatedProduct: FormData) => {
    if (!editingProduct?._id) return;
    editMutation.mutate({ productId: editingProduct._id, data: updatedProduct });
  };

  const handleDeleteProduct = (id: string) => deleteMutation.mutate(id);

  return {
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
    isAdding: addMutation.isPending,
    isEditing: editMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};