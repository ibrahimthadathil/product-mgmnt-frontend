"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Product } from "@/types/types";
import ProductForm from "./forms/product";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: any) => void;
  initialProduct?: Product | null;
}

export function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialProduct,
}: ProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>
            {initialProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <ProductForm
          onClose={onClose}
          onSubmit={onSubmit}
          initialProduct={initialProduct as Product}
        />
      </DialogContent>
    </Dialog>
  );
}
