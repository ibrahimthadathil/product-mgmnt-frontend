"use client";

import { ArrowRight } from "lucide-react";

export default function OrderSummary({ total }: { total: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm h-fit sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-bold text-gray-900">Total</span>
        <span className="text-xl font-bold text-gray-900">
          ${total.toFixed(2)}
        </span>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-sm transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center space-x-2 group">
        <span>Proceed to Checkout</span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="mt-4 text-center">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}