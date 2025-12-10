"use client";

import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { UseRQ } from "./useRQ";
import { UseRMutation } from "./useMutation";
import { getCart, updateCart, deleteCart } from "@/api/cartApi";
import { useCartStore } from "@/store/cartStore";
import type { cartResponse } from "@/types/types";

export const useCart = () => {
  const router = useRouter();
  const { status } = useSession();
  const { setCartFromResponse, clearCart } = useCartStore();

  const { data: cartData, isLoading: cartLoading } = UseRQ<cartResponse>(
    "cart",
    getCart
  );

  const updateCartMutation = UseRMutation(
    "cart-update",
    (payload: { cartId: string; quantity: number }) => updateCart(payload),
    "cart"
  );

  const deleteCartMutation = UseRMutation(
    "cart-delete",
    (cartItemId: string) => deleteCart(cartItemId),
    "cart"
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      clearCart();
      router.replace("/login");
    }
  }, [status, clearCart, router]);

  useEffect(() => {
    setCartFromResponse(cartData);
  }, [cartData, setCartFromResponse]);

  const cartItems = cartData?.items ?? [];
  const isEmpty = cartItems.length === 0;

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price =
        typeof item.product.price === "string"
          ? parseFloat(item.product.price)
          : item.product.price;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    try {
      await updateCartMutation.mutateAsync({ cartId, quantity: newQuantity });
      toast.success("Cart updated successfully");
    } catch (err) {
      console.error("Update cart error:", err);
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      await deleteCartMutation.mutateAsync(cartItemId);
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Delete cart item error:", err);
      toast.error("Failed to remove item");
    }
  };

  return {
    cartData,
    cartItems,
    isEmpty,
    total,
    cartLoading: cartLoading || status === "loading",
    status,
    updateQuantity,
    removeItem,
    isUpdating: updateCartMutation.isPending,
    isRemoving: deleteCartMutation.isPending,
  };
};