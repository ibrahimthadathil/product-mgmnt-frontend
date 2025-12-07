import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Upload, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Product } from "@/types/types";
import { Select } from "@radix-ui/react-select";
import { ProductFormValues, productSchema } from "@/schema/productSchema";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Other",
];


const ProductForm = ({
  onSubmit,
  initialProduct,
  onClose,
}: {
  onSubmit: (product: any) => void;
  onClose: () => void;
  initialProduct?: Product | null;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialProduct?.name || "",
      category: initialProduct?.category || "",
      price: initialProduct?.price !== undefined ? String(initialProduct.price) : "",
      description: initialProduct?.description || "",
      images: (initialProduct?.images as string[]) || [],
    },
  });

  const images = watch("images") || [];
  const selectedCategory = watch("category");

  // Keep Select UI exactly same; we update hidden form field via setValue
  const handleCategoryChange = (value: string) => {
    setValue("category", value, { shouldValidate: true, shouldDirty: true });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target?.result) return;
        // Append image dataURL to images array
        setValue("images", [...(watch("images") || []), event.target.result as string], {
          shouldValidate: true,
          shouldDirty: true,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const current = watch("images") || [];
    setValue(
      "images",
      (current as string[]).filter((_, i) => i !== index),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const submitHandler = (data: ProductFormValues) => {
    const payload = {
      ...data,
      price: parseFloat(data.price),
    };

    if (initialProduct) {
      onSubmit({ ...initialProduct, ...payload });
    } else {
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Name *</label>
        <Input type="text" placeholder="Enter product name" {...register("name")} required />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">Category *</label>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register("category")} />
        {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-2">Price *</label>
        <Input
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          {...register("price")}
          required
        />
        {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea rows={4} placeholder="Enter product description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Images</label>
        <div className="mb-4">
          <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {(images as string[]).map((image, index) => (
              <div key={index} className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border">
                <img src={image || "/placeholder.svg"} alt={`preview-${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-destructive text-white rounded-full p-1 transform translate-x-1 -translate-y-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {/* register hidden images field */}
        <input type="hidden" {...register("images")} />
        {errors.images && <p className="text-sm text-destructive mt-1">{(errors.images as any).message}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {initialProduct ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
