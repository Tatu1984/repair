import { z } from "zod";

export const createPartSchema = z.object({
  name: z.string().min(1),
  vehicleType: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().optional(),
  condition: z.enum(["USED_GOOD", "REFURBISHED", "LIKE_NEW", "OEM_SURPLUS"]),
  price: z.number().positive(),
  marketPrice: z.number().positive().optional(),
  stock: z.number().int().min(0).default(0),
  description: z.string().optional(),
});

export const updatePartSchema = createPartSchema.partial();

export const searchPartsSchema = z.object({
  search: z.string().optional(),
  vehicleType: z.string().optional(),
  brand: z.string().optional(),
  condition: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(12),
});

export type CreatePartInput = z.infer<typeof createPartSchema>;
export type SearchPartsInput = z.infer<typeof searchPartsSchema>;
