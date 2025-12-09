"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react";
import { Product } from "@/types/types";
import { UseRQ } from "@/hooks/useRQ";
import { UseRMutation } from "@/hooks/useMutation";
import { getProductById } from "@/api/productApi";
import { addToCart } from "@/api/cartApi";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
export const dynamic = "force-dynamic";
const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const { items, addOrUpdateItem } = useCartStore();

  const { data: product, isLoading, error } = UseRQ<Product>(
    `product-${productId}`, ()=>getProductById(productId)
  );
  
  const addToCartMutation = UseRMutation("cart", async (data: { product: string; qty: number }) => {
    const result = await addToCart({ items: [{ product: data.product, quantity: data.qty }] });
    return { data: result };
  });

  const handleAddToCart = async () => {
    if (!product?._id) {
      toast.warning("Product ID is missing");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart");
      router.push("/login");
      return;
    }

    const alreadyInCart = items.some((item) => item.productId === product._id);
    if (alreadyInCart) {
      toast.info("This product is already in your cart");
      return;
    }
    try {
      const data:any = await addToCartMutation.mutateAsync({ product: product._id, qty: quantity });
      if (data.success) {
        toast.success(data.message);
        addOrUpdateItem(product._id, quantity);
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <p className="text-lg text-slate-500">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <p className="text-lg text-slate-500">Product not found</p>
        <Button onClick={() => router.push("/shop")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Button>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage = images[selectedImageIndex] || images[0] || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <Button
        onClick={() => router.push("/shop")}
        variant="ghost"
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Section */}
        <div className="flex flex-col gap-4">
          {/* Main Image Preview */}
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    loading="eager"  
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              {product.name}
            </h1>
            <p className="text-sm text-slate-500 uppercase tracking-wide">
              {product.category}
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold text-slate-900">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(product.price)}
            </p>
          </div>

          <div>
            <p className="text-base text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-900">
              Quantity:
            </label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-10 w-10 rounded-r-none"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 text-base font-semibold text-slate-900 min-w-[3rem] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                className="h-10 w-10 rounded-l-none"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {addToCartMutation.isPending
              ? "Adding to Cart..."
              : "Add to Cart"}
          </Button>

          {/* Thumbnail Gallery - Below Add to Cart */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === index
                      ? "border-primary shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;