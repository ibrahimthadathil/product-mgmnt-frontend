import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z
    .string()
    .min(1, { message: "Price is required" })
    .refine(
      (val) => {
        const parsed = parseFloat(val);
        return !Number.isNaN(parsed) && parsed > 0;
      },
      { message: "Price must be greater than 0" }
    ),
  description: z.string().min(1, { message: "Description is required" }),
  images: z.array(z.any()).min(1, { message: "At least one image is required" }).max(3,{message:'Maximum three photos'}),
});

export type ProductFormValues = z.infer<typeof productSchema>;