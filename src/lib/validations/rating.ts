import { z } from "zod";

export const createRatingSchema = z.object({
  toUserId: z.string().min(1),
  stars: z.number().int().min(1).max(5),
  review: z.string().optional(),
  breakdownId: z.string().optional(),
  orderId: z.string().optional(),
});

export type CreateRatingInput = z.infer<typeof createRatingSchema>;
