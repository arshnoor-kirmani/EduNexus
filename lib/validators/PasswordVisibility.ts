import z from "zod";

export const instituteSchema = z.object({
  name: z.string().min(1, "Owner name is required"),
  email: z.string().email("Enter a valid email"),
  institute_name: z.string().min(1, "Institute name is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});
