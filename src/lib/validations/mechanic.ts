import { z } from "zod";

export const registerMechanicSchema = z.object({
  aadhaarNumber: z.string().optional(),
  panNumber: z.string().optional(),
  tradeLicense: z.string().optional(),
  skills: z.array(z.string()).default([]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const updateMechanicStatusSchema = z.object({
  status: z.enum(["ONLINE", "OFFLINE", "BUSY"]),
});

export const updateMechanicLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const nearbyMechanicsSchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  radius: z.coerce.number().default(15),
});

export type RegisterMechanicInput = z.infer<typeof registerMechanicSchema>;
