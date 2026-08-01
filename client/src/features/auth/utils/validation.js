import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export function getFieldErrors(result) {
  if (result.success) {
    return {};
  }

  const fieldErrors = result.error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, messages]) => [
      key,
      messages[0] || "",
    ])
  );
}
