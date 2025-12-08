"use client";

import { CartItem } from "@/types/types";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";

interface CartItemRowProps {
  item: CartItem;
  cartItProductId: string; // The cart item _id from backend
  onUpdateQuantity: (cartItProductId: string, newQuantity: number) => void;
  onRemove: (cartItProductId: string) => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

export default function CartItemRow({
  item,
  cartItProductId,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
  isRemoving = false,
}: CartItemRowProps) {
  const quantity = item.items[0]?.quantity || 1;
  const productImage = item.images?.[0] || "";

  return (
    <div className="flex flex-col sm:flex-row items-center bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 mb-4 shadow-sm transition-all hover:shadow-md">
      {/* Product Image */}
      <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0 relative">
        {productImage ? (
          <Image
            src={productImage}
            alt={item.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-grow sm:ml-6 flex flex-col sm:flex-row sm:items-center w-full">
        <div className="flex-grow mb-4 sm:mb-0 text-center sm:text-left">
          <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0 space-x-0 sm:space-x-6">
          {/* Increment / Decrement */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onUpdateQuantity(cartItProductId, quantity - 1)}
              disabled={quantity <= 1 || isUpdating || isRemoving}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={14} />
            </button>

            <span className="w-8 text-center text-sm font-medium text-gray-900">
              {quantity}
            </span>

            <button
              onClick={() => onUpdateQuantity(cartItProductId, quantity + 1)}
              disabled={isUpdating || isRemoving}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Price & Delete */}
          <div className="flex items-center space-x-6 ml-6">
            <span className="text-base font-bold text-gray-900 w-20 text-right">
              ${(item.price * quantity).toFixed(2)}
            </span>

            <button
              onClick={() => onRemove(cartItProductId)}
              disabled={isRemoving || isUpdating}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
