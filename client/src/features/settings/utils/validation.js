import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  avatar: z.string().url("Enter a valid image URL").or(z.literal("")).optional(),
});

export const passwordSchema = z
  .object({
    current: z.string().min(1, "Current password is required"),
    next: z.string().min(8, "New password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.next === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
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
