import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(5, "Email is too short.")
  .max(100, "Email is too long.")
  .email("Please enter a valid email address.")
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Email format doesn't look correct.",
  })
  .transform((v) => v.toLowerCase());
export const instituteSchema = z.object({
  name: z.string().trim().min(1, "Owner name is required."),

  email: emailSchema,

  institute_name: z.string().trim().min(1, "Institute name is required."),

  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(/[A-Z]/, "Add at least one uppercase letter.")
    .regex(/[0-9]/, "Add at least one number."),
});
