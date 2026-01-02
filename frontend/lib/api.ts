import type {
  BookingDraftRequest,
  BookingDraftResponse,
  VerifyEmailResponse,
  BookingStatusResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  CompletePaymentRequest,
  CompletePaymentResponse,
  RequestCancellationRequest,
  RequestCancellationResponse,
  VerifyCancellationResponse,
} from "@/types";

export const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000").replace(
	/\/$/,
	""
);

// API Error Handler
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({ detail: "Invalid response from server" }));
  
  if (!response.ok) {
    throw new APIError(
      response.status,
      data.detail || data.message || data.error || "Request failed"
    );
  }
  
  return data as T;
}

// Booking API Functions
export const bookingAPI = {
  /**
   * Create a booking draft
   * POST /api/bookings/draft/
   */
  async createDraft(data: BookingDraftRequest): Promise<BookingDraftResponse> {
    const response = await fetch(`${BACKEND_URL}/api/bookings/draft/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<BookingDraftResponse>(response);
  },

  /**
   * Verify email with token
   * GET /api/bookings/verify-email/?token=...
   */
  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const response = await fetch(
      `${BACKEND_URL}/api/bookings/verify-email/?token=${encodeURIComponent(token)}`
    );
    return handleResponse<VerifyEmailResponse>(response);
  },

  /**
   * Get booking status
   * GET /api/bookings/status/?acknowledgement_id=...
   */
  async getStatus(acknowledgementId: string): Promise<BookingStatusResponse> {
    const response = await fetch(
      `${BACKEND_URL}/api/bookings/status/?acknowledgement_id=${encodeURIComponent(acknowledgementId)}`
    );
    return handleResponse<BookingStatusResponse>(response);
  },

  /**
   * Initiate payment
   * POST /api/bookings/initiate-payment/
   */
  async initiatePayment(data: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    const response = await fetch(`${BACKEND_URL}/api/bookings/initiate-payment/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<InitiatePaymentResponse>(response);
  },

  /**
   * Complete payment (dummy gateway)
   * POST /api/bookings/complete-payment/
   */
  async completePayment(data: CompletePaymentRequest): Promise<CompletePaymentResponse> {
    const response = await fetch(`${BACKEND_URL}/api/bookings/complete-payment/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<CompletePaymentResponse>(response);
  },

  /**
   * Request cancellation
   * POST /api/bookings/request-cancellation/
   */
  async requestCancellation(data: RequestCancellationRequest): Promise<RequestCancellationResponse> {
    const response = await fetch(`${BACKEND_URL}/api/bookings/request-cancellation/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<RequestCancellationResponse>(response);
  },

  /**
   * Verify cancellation
   * GET /api/bookings/verify-cancellation/?token=...
   */
  async verifyCancellation(token: string): Promise<VerifyCancellationResponse> {
    const response = await fetch(
      `${BACKEND_URL}/api/bookings/verify-cancellation/?token=${encodeURIComponent(token)}`
    );
    return handleResponse<VerifyCancellationResponse>(response);
  },
};

// Status helpers
export const statusHelpers = {
  canInitiatePayment: (status: string) => status === "APPROVED",
  canRequestCancellation: (status: string) => status === "CONFIRMED",
  isTerminal: (status: string) => ["CONFIRMED", "CANCELLED", "COMPLETED", "REJECTED"].includes(status),
  needsEmailVerification: (status: string) => status === "DRAFT",
  awaitingAdmin: (status: string) => status === "PENDING",
};

