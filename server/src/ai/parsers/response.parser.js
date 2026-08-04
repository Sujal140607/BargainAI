import { validateSellerResponse } from "../schemas/seller-response.schema.js";

const CODE_FENCE = /```(?:json)?\s*([\s\S]*?)```/;
const OBJECT_BLOCK = /\{[\s\S]*\}/;

const extractJSON = (raw) => {
  if (typeof raw !== "string" || raw.trim() === "") return null;

  const candidates = [];
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) candidates.push(trimmed);

  const fence = trimmed.match(CODE_FENCE);
  if (fence) candidates.push(fence[1]);

  const object = trimmed.match(OBJECT_BLOCK);
  if (object) candidates.push(object[0]);

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // try next candidate
    }
  }
  return null;
};

export const parseSellerResponse = (rawOutput) => {
  const parsed = extractJSON(rawOutput);
  if (parsed === null) {
    return {
      success: false,
      data: null,
      errors: [{ path: ["root"], message: "Response is not valid JSON" }],
    };
  }
  return validateSellerResponse(parsed);
};
