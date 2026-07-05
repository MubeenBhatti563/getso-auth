import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data;

    // 1. Check for arrays of validation errors (e.g., Zod/class-validator arrays)
    // Often nested inside responseData.errors OR responseData.data.errors
    const errorsArray = responseData?.errors || responseData?.data?.errors;
    if (Array.isArray(errorsArray) && errorsArray.length > 0) {
      return errorsArray.map((e: { message: string }) => e.message).join(", ");
    }

    // 2. Check for a single string message (NestJS standard exception response)
    // Often responseData.message OR responseData.data.message
    const singleMessage = responseData?.message || responseData?.data?.message;
    if (typeof singleMessage === "string") {
      return singleMessage;
    }

    // 3. Fallback to status code checks if the backend didn't provide a custom message
    if (error.response?.status === 429) {
      return "Too many attempts. Please try again later.";
    }

    if (error.response?.status === 403) {
      return "Account locked. Too many failed attempts.";
    }

    if (error.code === "ERR_NETWORK") {
      return "Network error. Please check your internet connection.";
    }
  }

  // 4. Fallback for standard native JavaScript errors
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
