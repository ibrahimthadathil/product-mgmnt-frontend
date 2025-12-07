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
  //   useEffect(() => {
  //     if (initialProduct) {
  //       setFormData({
  //         name: initialProduct.name,
  //         category: initialProduct.category,
  //         price: initialProduct.price.toString(),
  //         description: initialProduct.description,
  //         images: initialProduct.images,
  //       });
  //     } else {
  //       setFormData({
  //         name: "",
  //         category: "",
  //         price: "",
  //         description: "",
  //         images: [],
  //       });
  //     }
  //   }, [initialProduct, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
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
