import { z } from "zod";

export const sellerResponseSchema = z
  .object({
    reply: z.string().trim().min(1, "reply cannot be empty"),
    emotion: z.enum(["neutral", "happy", "annoyed", "frustrated", "pleased"]),
    reason: z.string().trim().min(1, "reason cannot be empty"),
    confidence: z
      .number()
      .int("confidence must be an integer")
      .min(0, "confidence must be 0-100")
      .max(100, "confidence must be 0-100"),
  })
  .strict();

export const validateSellerResponse = (data) => {
  const result = sellerResponseSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? null : result.error.issues,
  };
};
