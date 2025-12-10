"use client";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { Upload, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Product } from "@/types/types";
import { ProductFormValues, productSchema } from "@/schema/productSchema";

import { UseHookForm } from "@/hooks/useForm";
import { UseRMutation } from "@/hooks/useMutation";
import { toast } from "sonner";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Other"];

interface ProductFormProps {
  onSubmit: (formData: FormData) => Promise<any>;
  onClose: () => void;
  initialProduct?: Product | null;
}

const ProductForm = ({
  onSubmit,
  initialProduct,
  onClose,
}: ProductFormProps) => {
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [retainedExistingImages, setRetainedExistingImages] = useState<
    string[]
  >((initialProduct?.images as string[]) || []);

  const {
    form: { register, control, setValue, watch },
    onFormSubmit,
    errors,
  } = UseHookForm(
    productSchema,
    (values: Partial<Product>) => submitHandler(values as any),
    {
      name: initialProduct?.name || "",
      category: initialProduct?.category || "",
      price: initialProduct?.price ? String(initialProduct.price) : "",
      description: initialProduct?.description || "",
      images: initialProduct?.images || [],
    }
  );
  useEffect(() => {
   const bothImage = [
      ...retainedExistingImages,
      ...newImageFiles
    ];
    setValue("images", bothImage as any);
  }, [newImageFiles, retainedExistingImages, setValue]);
  console.log(watch("images"), newImageFiles);
  const { mutate, isPending } = UseRMutation<FormData, FormData>(
    initialProduct ? "updateProduct" : "createProduct",
    async (formData: FormData) => ({ data: await onSubmit(formData) }),
    "products",
    () => {
      toast.success(
        initialProduct ? "Updated Successfully!" : "Created Successfully!"
      );
      onClose();
    }
  );

  const submitHandler = (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("price", data.price);

    if (data.description) formData.append("description", data.description);

    newImageFiles.forEach((file) => formData.append("images", file));

    if (initialProduct) {
      formData.append("id", initialProduct._id as string);
      formData.append("existingImages", retainedExistingImages.join(","));
    }

    mutate(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (url: string) => {
    setRetainedExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const totalImageCount =
    retainedExistingImages.length + newImagePreviews.length;

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      {/* ---------- NAME ---------- */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Name *</label>
        <Input {...register("name")} placeholder="Enter product name" />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* ---------- PRICE ---------- */}
      <div>
        <label className="block text-sm font-medium mb-2">Price *</label>
        <Input {...register("price")} placeholder="Enter price" />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      {/* ---------- CATEGORY ---------- */}
      <div>
        <label className="block text-sm font-medium mb-2">Category *</label>

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* ---------- DESCRIPTION ---------- */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          {...register("description")}
          placeholder="Description (optional)"
        />
      </div>

      {/* ---------- IMAGES ---------- */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Images ({totalImageCount}/3)
        </label>

        <div className="flex gap-2 flex-wrap">
          {/* Existing Images */}
          {retainedExistingImages.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={img}
                className="h-16 w-16 rounded border object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveExistingImage(img)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={15} />
              </button>
            </div>
          ))}

          {/* Newly Uploaded Previews */}
          {newImagePreviews.map((src, idx) => (
            <div key={idx} className="relative">
              <img
                src={src}
                className="h-16 w-16 rounded border object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveNewImage(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={15} />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          {totalImageCount < 5 && (
            <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded border">
              <Upload size={20} />
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
      </div>

      {/* ---------- ACTION BUTTONS ---------- */}
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : initialProduct
            ? "Update Product"
            : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
