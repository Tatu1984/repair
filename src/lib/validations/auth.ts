import { z } from "zod";

export const sendOtpSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  role: z.enum(["RIDER", "MECHANIC", "WORKSHOP", "ADMIN"]).default("RIDER"),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  role: z.enum(["RIDER", "MECHANIC", "WORKSHOP", "ADMIN"]).default("RIDER"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
