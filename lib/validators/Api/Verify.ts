import { z } from "zod";

// Read OTP length from env
const OTP_LENGTH = Number(process.env.OTP_LENGTH) || 6; // fallback default 6

export const verifyOtpSchema = z.object({
  // Accept only valid email
  identifier: z
    .union([z.string().min(1), z.string().email("Invalid email address")])
    .transform((v) => v.trim()),

  // OTP must be digits only + must respect ENV length
  code: z
    .string()
    .regex(/^\d+$/, "OTP must contain only digits")
    .length(OTP_LENGTH, `OTP must be exactly ${OTP_LENGTH} digits`),
});

// Type inference (optional)
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
