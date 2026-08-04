export function getErrorMessage(error) {
  if (!error) {
    return null;
  }
  if (typeof error === "string") {
    return error;
  }
  return error.message || "Something went wrong. Please try again.";
}
