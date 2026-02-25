import { z } from "zod";

export const createDisputeSchema = z.object({
  relatedId: z.string().min(1),
  relatedType: z.enum(["BREAKDOWN", "ORDER"]),
  reason: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

export const resolveDisputeSchema = z.object({
  resolution: z.string().min(1),
  status: z.enum(["RESOLVED", "CLOSED"]).default("RESOLVED"),
});

export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
