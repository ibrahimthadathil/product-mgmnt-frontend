"use client";

import { useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ShoppingBag } from "lucide-react";
import type { CartItem, Iuser } from "@/types/types";
import CartItemRow from "./cart-item-row";
import OrderSummary from "./order-summery";

// Dummy user
const DUMMY_USER: Iuser = {
  userName: "john_doe",
  email: "john@example.com",
  password: "password123",
} as Iuser;

// Initial dummy items
export const INITIAL_ITEMS: CartItem[] = [
  {
    id: "1",
    name: "Classic Crewneck T-Shirt",
    description: "Comfortable cotton t-shirt",
    price: 25,
    category: "T-Shirts",
    images: ["https://picsum.photos/200/200?random=1"],
    user: DUMMY_USER,
    items: [{ product: "1", quantity: 1 }],
    created_at: new Date(),
  },
  {
    id: "2",
    name: "Slim-Fit Chino Pants",
    description: "Elegant slim-fit pants",
    price: 45,
    category: "Pants",
    images: ["https://picsum.photos/200/200?random=2"],
    user: DUMMY_USER,
    items: [{ product: "2", quantity: 1 }],
    created_at: new Date(),
  },
];

// Zod schema matching flattened CartItemRow props
const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  images: z.array(z.string()),
  quantity: z.number().min(1).max(99),
});

const cartSchema = z.object({
  items: z.array(cartItemSchema),
});

type CartFormValues = z.infer<typeof cartSchema>;

// Convert CartItem[] to flattened form for useForm
const flattenCartItems = (items: CartItem[]) =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    images: item.images,
    quantity: item.items[0]?.quantity || 1,
  }));

export default function ShoppingCart() {
  const { control, watch, setValue } = useForm<CartFormValues>({
    resolver: zodResolver(cartSchema),
    // defaultValues: { items: flattenCartItems(INITIAL_ITEMS) },
  });

  const { fields } = useFieldArray({ control, name: "items" });
  const items = watch("items") || [];;

  const { subtotal, tax, total } = useMemo(() => {
    const sub = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const estimatedTax = sub * 0.05; // 5% tax
    return {
      subtotal: sub,
      tax: estimatedTax,
      total: sub + 5 + estimatedTax,
    };
  }, [items]);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const index = fields.findIndex((item) => item.id === id);
    if (index >= 0) {
      setValue(`items.${index}.quantity`, newQuantity, { shouldValidate: true });
    }
  };

  const handleRemoveItem = (id: string) => {
    setValue("items", items.filter((item) => item.id !== id), { shouldValidate: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10 flex items-center gap-3">
        Your Shopping Cart
        {items.length === 0 && (
          <span className="text-gray-400 font-normal text-lg">(Empty)</span>
        )}
      </h1>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              // Construct a proper CartItem from the flattened form data
              const cartItem: CartItem = {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                images: item.images,
                user: DUMMY_USER,
                items: [{ product: item.id, quantity: item.quantity }],
                created_at: new Date(),
              };
              return (
                <CartItemRow
                  key={item.id}
                  item={cartItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              );
            })}
          </div>
          <div className="lg:col-span-4">
            <OrderSummary subtotal={subtotal} shipping={5} tax={tax} total={total} />
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
            Looks like you haven't added anything to your cart yet.
          </p>
          <button
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            Reload Sample Items
          </button>
        </div>
      )}
    </div>
  );
}
