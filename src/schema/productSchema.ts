import { z } from "zod";

export const productSchema = z.object({
  name: z.string().nonempty({ message: "Product name is required" }),
  category: z.string().nonempty({ message: "Category is required" }),
  price: z
    .string()
    .nonempty({ message: "Price is required" })
    .refine(
      (val) => {
        const parsed = parseFloat(val);
        return !Number.isNaN(parsed) && parsed >= 0;
      },
      { message: "Price must be a number >= 0" }
    ),
  description: z
    .string()
    .optional()
    .nullable(),
  images: z.array(z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
