export type LeadSubmissionStatus = "idle" | "submitting" | "success" | "error";

export type LeadSubmissionState = {
  message: string | null;
  productId: string | null;
  status: LeadSubmissionStatus;
};

export type LeadSubmissionAction =
  | { type: "reset"; productId?: string }
  | { type: "submit"; productId?: string }
  | { type: "succeed"; message: string }
  | { type: "fail"; message: string };

export function createLeadSubmissionState(
  productId?: string,
): LeadSubmissionState {
  return {
    message: null,
    productId: productId ?? null,
    status: "idle",
  };
}

export function leadSubmissionReducer(
  state: LeadSubmissionState,
  action: LeadSubmissionAction,
): LeadSubmissionState {
  switch (action.type) {
    case "reset":
      return createLeadSubmissionState(
        action.productId ?? state.productId ?? undefined,
      );
    case "submit":
      return {
        message: null,
        productId: action.productId ?? state.productId,
        status: "submitting",
      };
    case "succeed":
      return {
        ...state,
        message: action.message,
        status: "success",
      };
    case "fail":
      return {
        ...state,
        message: action.message,
        status: "error",
      };
  }
}
