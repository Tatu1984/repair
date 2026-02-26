import { z } from "zod";

export const createVehicleMasterSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().optional(),
  yearFrom: z.number().int().min(1950).max(2100).optional(),
  yearTo: z.number().int().min(1950).max(2100).optional(),
  isActive: z.boolean().default(true),
});

export const updateVehicleMasterSchema = createVehicleMasterSchema.partial();

export type CreateVehicleMasterInput = z.infer<typeof createVehicleMasterSchema>;
export type UpdateVehicleMasterInput = z.infer<typeof updateVehicleMasterSchema>;
