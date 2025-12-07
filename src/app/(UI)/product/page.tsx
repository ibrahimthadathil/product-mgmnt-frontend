"use client";

import { useState } from "react";
import { ProductModal } from "@/components/product-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  createdAt: Date;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = (newProduct: Omit<Product, "id" | "createdAt">) => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProducts([product, ...products]);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
   <main className="max-h-screen bg-background">
  <div className="w-full max-w-7xl mx-auto px-4 py-8">
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-4xl font-bold text-foreground">Products</h1>
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

  </div>
</main>

  );
}

{/* <ProductTable products={products} onEdit={handleEditClick} onDelete={handleDeleteProduct} /> */}