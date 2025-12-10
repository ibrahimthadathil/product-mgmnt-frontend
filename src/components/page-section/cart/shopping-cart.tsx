"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import type { CartItem } from "@/types/types";
import CartItemRow from "./cart-item-row";
import OrderSummary from "./order-summery";
import { useCart } from "@/hooks/useCart";

export default function ShoppingCart() {
  const {
    cartData,
    cartItems,
    isEmpty,
    total,
    cartLoading,
    updateQuantity,
    removeItem,
    isUpdating,
    isRemoving,
  } = useCart();

  if (cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-lg text-slate-500">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10 flex items-center gap-3">
        Your Shopping Cart
        {isEmpty && <span className="text-gray-400 font-normal text-lg">(Empty)</span>}
      </h1>

      {!isEmpty ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => {
              const cartItem: CartItem = {
                _id: item.product._id,
                name: item.product.name,
                description: item.product.description,
                price:
                  typeof item.product.price === "string"
                    ? parseFloat(item.product.price)
                    : item.product.price,
                category: item.product.category,
                images: item.product.images,
                user: cartData?.user as string,
                items: [
                  {
                    product: item.product._id,
                    quantity: item.quantity,
                  },
                ],
                created_at: cartData?.createdAt ? new Date(cartData.createdAt) : undefined,
              };

              return (
                <CartItemRow
                  key={item._id}
                  item={cartItem}
                  cartItProductId={cartItem.items[0]?.product as string}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  isUpdating={isUpdating}
                  isRemoving={isRemoving}
                />
              );
            })}
          </div>

          <div className="lg:col-span-4">
            <OrderSummary total={total} />
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-50 p-6 rounded-full">
              <ShoppingBag size={48} className="text-gray-300" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
