import { z } from "zod";

export const updateWorkshopProfileSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  phone: z.string().optional(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  tradeLicenseUrl: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIfscCode: z.string().optional(),
  serviceRadiusKm: z.number().positive().optional(),
  specialties: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type UpdateWorkshopProfileInput = z.infer<typeof updateWorkshopProfileSchema>;

export const workshopInventoryFilterSchema = z.object({
  search: z.string().optional(),
  condition: z.enum(["USED_GOOD", "REFURBISHED", "LIKE_NEW", "OEM_SURPLUS"]).optional(),
  stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"]).optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const workshopOrdersFilterSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
