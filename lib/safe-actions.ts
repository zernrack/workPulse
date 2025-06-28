import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e: Error) {
    // Don't handle NEXT_REDIRECT errors, let them propagate
    if (e.message === "NEXT_REDIRECT") {
      throw e;
    }
    
    // Return the actual error message instead of a generic one
    return e.message;
  },
});