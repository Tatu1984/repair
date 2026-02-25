import { z } from "zod";

export const createDisputeSchema = z.object({
  relatedId: z.string().min(1),
  relatedType: z.enum(["BREAKDOWN", "ORDER"]),
  reason: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

export const resolveDisputeSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("UNDER_REVIEW"),
    resolution: z.string().optional().default(""),
  }),
  z.object({
    status: z.literal("RESOLVED"),
    resolution: z.string().min(1),
  }),
  z.object({
    status: z.literal("CLOSED"),
    resolution: z.string().min(1),
  }),
]);

export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
