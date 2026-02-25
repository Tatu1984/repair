import { z } from "zod";

export const createBreakdownSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  locationAddress: z.string().optional(),
  vehicleInfo: z.string().optional(),
  emergencyType: z.enum([
    "FLAT_TYRE", "ENGINE_STALL", "BATTERY_DEAD", "CHAIN_BREAK",
    "FUEL_EMPTY", "BRAKE_FAILURE", "PUNCTURE", "CLUTCH_ISSUE",
    "SELF_START_FAIL", "OVERHEATING", "OTHER",
  ]),
  notes: z.string().optional(),
});

export const updateBreakdownStatusSchema = z.object({
  status: z.enum([
    "PENDING", "SEARCHING", "ACCEPTED", "EN_ROUTE", "ARRIVED",
    "DIAGNOSING", "ESTIMATE_SENT", "ESTIMATE_APPROVED",
    "IN_PROGRESS", "COMPLETED", "CANCELLED",
  ]),
});

export const setEstimateSchema = z.object({
  estimatedPrice: z.number().positive(),
});

export const completeBreakdownSchema = z.object({
  finalPrice: z.number().positive(),
  notes: z.string().optional(),
});

export type CreateBreakdownInput = z.infer<typeof createBreakdownSchema>;
