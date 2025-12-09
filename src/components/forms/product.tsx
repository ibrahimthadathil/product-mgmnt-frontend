// "use client";
// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "../ui/button";
// import { Upload, X } from "lucide-react";
// import { Textarea } from "../ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { Input } from "../ui/input";
// import { Product } from "@/types/types";
// import { ProductFormValues, productSchema } from "@/schema/productSchema";

// const CATEGORIES = ["Electronics", "Clothing", "Books", "Other"];

// interface ProductFormProps {
//   onSubmit: (formData: FormData) => void;
//   onClose: () => void;
//   initialProduct?: Product | null;
// }

// const ProductForm = ({
//   onSubmit,
//   initialProduct,
//   onClose,
// }: ProductFormProps) => {
//   const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
//   const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

//   const [retainedExistingImages, setRetainedExistingImages] = useState<
//     string[]
//   >((initialProduct?.images as string[]) || []);

//   const {
//     register,
//     handleSubmit,
//     control,
//     setValue,
//     formState: { errors },
//   } = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       name: initialProduct?.name || "",
//       category: initialProduct?.category || "",
//       price:
//         initialProduct?.price !== undefined ? String(initialProduct.price) : "",
//       description: initialProduct?.description || "",
//       images: (initialProduct?.images as string[]) || [],
//     },
//   });

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;

//     setNewImageFiles((prev) => [...prev, ...files]);

//     files.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         if (event.target?.result) {
//           setNewImagePreviews((prev) => {
//             const newPreviews = [...prev, event?.target?.result as string];

//             const totalImages = [...retainedExistingImages, ...newPreviews];
//             setValue("images", totalImages, { shouldValidate: true });
//             return newPreviews;
//           });
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleRemoveExistingImage = (index: number) => {
//     const updatedRetained = retainedExistingImages.filter(
//       (_, i) => i !== index
//     );
//     setRetainedExistingImages(updatedRetained);

//     const totalImages = [...updatedRetained, ...newImagePreviews];
//     setValue("images", totalImages, { shouldValidate: true });
//   };

//   const handleRemoveNewImage = (index: number) => {
//     const updatedFiles = newImageFiles.filter((_, i) => i !== index);
//     const updatedPreviews = newImagePreviews.filter((_, i) => i !== index);

//     setNewImageFiles(updatedFiles);
//     setNewImagePreviews(updatedPreviews);

//     const totalImages = [...retainedExistingImages, ...updatedPreviews];
//     setValue("images", totalImages, { shouldValidate: true });
//   };

//   const submitHandler = (data: ProductFormValues) => {
//     const formData = new FormData();

//     formData.append("name", data.name);
//     formData.append("category", data.category);
//     formData.append("price", data.price);

//     if (data.description) {
//       formData.append("description", data.description);
//     }

//     newImageFiles.forEach((file) => {
//       formData.append("images", file);
//     });

//     if (initialProduct) {
//       formData.append("id", initialProduct._id as string);

//       if (retainedExistingImages.length > 0) {
//         formData.append("existingImages", retainedExistingImages.join(","));
//       } else {
//         formData.append("existingImages", "");
//       }
//     }

//     onSubmit(formData);
//   };

//   const totalImageCount =
//     retainedExistingImages.length + newImagePreviews.length;

//   return (
//     <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
//       {/* Product Name */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Product Name *</label>
//         <Input {...register("name")} placeholder="Enter product name" />
//         {errors.name && (
//           <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
//         )}
//       </div>

//       {/* Category */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Category *</label>
//         <Controller
//           name="category"
//           control={control}
//           render={({ field }) => (
//             <Select value={field.value} onValueChange={field.onChange}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a category" />
//               </SelectTrigger>
//               <SelectContent>
//                 {CATEGORIES.map((cat) => (
//                   <SelectItem key={cat} value={cat}>
//                     {cat}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         />
//         {errors.category && (
//           <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
//         )}
//       </div>

//       {/* Price */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Price *</label>
//         <Input
//           {...register("price")}
//           type="number"
//           step="0.01"
//           min="0"
//           placeholder="0.00"
//         />
//         {errors.price && (
//           <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
//         )}
//       </div>

//       {/* Description */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Description *</label>
//         <Textarea
//           {...register("description")}
//           rows={4}
//           placeholder="Enter product description"
//         />
//         {errors.description && (
//           <p className="text-sm text-red-500 mt-1">
//             {errors.description.message}
//           </p>
//         )}
//       </div>

//       {/* Image Upload */}
//       <div>
//         <label className="block text-sm font-medium mb-2">
//           Product Images * {totalImageCount > 0 && `(${totalImageCount})`}
//         </label>
//         <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
//           <div className="flex flex-col items-center">
//             <Upload className="w-6 h-6 text-gray-400 mb-2" />
//             <span className="text-sm text-gray-500">
//               Click to upload images
//             </span>
//           </div>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="hidden"
//           />
//         </label>

//         {/* Image Previews */}
//         {(retainedExistingImages.length > 0 || newImagePreviews.length > 0) && (
//           <div className="mt-4 space-y-3">
//             {/* Existing Images */}
//             {retainedExistingImages.length > 0 && (
//               <div>
//                 <p className="text-xs text-gray-500 mb-2">Existing Images</p>
//                 <div className="flex flex-wrap gap-3">
//                   {retainedExistingImages.map((imageUrl, index) => (
//                     <div
//                       key={`existing-${index}`}
//                       className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-300"
//                     >
//                       <img
//                         src={imageUrl}
//                         alt={`existing-${index}`}
//                         className="w-full h-full object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveExistingImage(index)}
//                         className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* New Images */}
//             {newImagePreviews.length > 0 && (
//               <div>
//                 <p className="text-xs text-gray-500 mb-2">New Images</p>
//                 <div className="flex flex-wrap gap-3">
//                   {newImagePreviews.map((preview, index) => (
//                     <div
//                       key={`new-${index}`}
//                       className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-green-300"
//                     >
//                       <img
//                         src={preview}
//                         alt={`new-${index}`}
//                         className="w-full h-full object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveNewImage(index)}
//                         className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {errors.images && (
//           <p className="text-sm text-red-500 mt-1">{errors.images.message}</p>
//         )}
//       </div>

//       {/* Actions */}
//       <div className="flex gap-3 justify-end pt-4">
//         <Button type="button" variant="outline" onClick={onClose}>
//           Cancel
//         </Button>
//         <Button type="submit">
//           {initialProduct ? "Update Product" : "Add Product"}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default ProductForm;





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

// ⬇️ New Imports
import { UseHookForm } from "@/hooks/useForm";
import { UseRMutation } from "@/hooks/useMutation";
import { toast } from "sonner";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Other"];

interface ProductFormProps {
  onSubmit: (formData: FormData) => Promise<any>;
  onClose: () => void;
  initialProduct?: Product | null;
}

const ProductForm = ({ onSubmit, initialProduct, onClose }: ProductFormProps) => {
  /** ------------------👇 STATES (NO CHANGE) ------------------ */
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [retainedExistingImages, setRetainedExistingImages] = useState<string[]>(
    (initialProduct?.images as string[]) || []
  );
  
  /** ------------------👇 FORM (REPLACED useForm→UseHookForm) ------------------ */
  const {
    form: { register, control, setValue,watch },
    onFormSubmit,
    errors,
  } = UseHookForm(productSchema, (values:Partial<Product>) => submitHandler(values as any), {
    name: initialProduct?.name || "",
    category: initialProduct?.category || "",
    price: initialProduct?.price ? String(initialProduct.price) : "",
    description: initialProduct?.description || "",
    images: initialProduct?.images || [],
  });
  useEffect(() => {
    setValue("images",newImageFiles)
    console.log('hj');
    
  }, [newImageFiles])
  console.log(watch('images'),newImageFiles)
  /** ------------------👇 MUTATION (REPLACED manual mutateAsync) ------------------ */
  const { mutate, isPending } = UseRMutation<FormData, FormData>(
    initialProduct ? "updateProduct" : "createProduct",
    async (formData:FormData) => ({ data: await onSubmit(formData) }),
    "products",
    () => {
      toast.success(initialProduct ? "Updated Successfully!" : "Created Successfully!");
      onClose();
    }
  );

  /** ------------------👇 SUBMIT HANDLER (NO UX CHANGE) ------------------ */
  const submitHandler = (data: ProductFormValues) => {
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("price", data.price);

    if (data.description) formData.append("description", data.description);

    // New Uploaded Images
    newImageFiles.forEach((file) => formData.append("images", file));

    // Edit Mode Logic
    if (initialProduct) {
      formData.append("id", initialProduct._id as string);
      formData.append("existingImages", retainedExistingImages.join(","));
    }

    mutate(formData);
  };

  /** ------------------👇 IMAGE HANDLING (UNCHANGED) ------------------ */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const previews = files.map((file) => URL.createObjectURL(file)) 
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

  const totalImageCount = retainedExistingImages.length + newImagePreviews.length;

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      {/* ---------- NAME ---------- */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Name *</label>
        <Input {...register("name")} placeholder="Enter product name" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      {/* ---------- PRICE ---------- */}
      <div>
        <label className="block text-sm font-medium mb-2">Price *</label>
        <Input {...register("price")} placeholder="Enter price" />
        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
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
        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>

      {/* ---------- DESCRIPTION ---------- */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea {...register("description")} placeholder="Description (optional)" />
      </div>

      {/* ---------- IMAGES ---------- */}
      <div>
        <label className="block text-sm font-medium mb-2">Images ({totalImageCount}/3)</label>

        <div className="flex gap-2 flex-wrap">
          {/* Existing Images */}
          {retainedExistingImages.map((img, idx) => (
            <div key={idx} className="relative">
              <img src={img} className="h-16 w-16 rounded border object-cover" />
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
              <img src={src} className="h-16 w-16 rounded border object-cover" />
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
              <input type="file" className="hidden" multiple onChange={handleImageUpload} />
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

