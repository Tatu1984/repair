import { z } from "zod";

export const createOrderSchema = z.object({
  partId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  shippingAddress: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
