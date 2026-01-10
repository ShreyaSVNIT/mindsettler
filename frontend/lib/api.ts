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

// Backend URL configuration - must be set in production
const getBackendURL = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Production must be explicit
  if (process.env.NODE_ENV === "production") {
    if (!url) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL is not set in production"
      );
    }
    return url.replace(/\/$/, "");
  }

  // Local dev fallback
  return (url ?? "http://127.0.0.1:8000").replace(/\/$/, "");
};

export const BACKEND_URL = getBackendURL();

// API Error Handler
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  // Handle empty responses (204 No Content)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.error('Non-JSON response detected', {
      status: response.status,
      contentType,
    });

    if (typeof window !== "undefined") {
      // Redirect user to verify-email page on backend HTML/500 errors
      window.location.href = "/verify-email";
    }

    throw new Error("Non-JSON response received from backend");
  }
  
  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error('JSON parse error:', e);
    throw new APIError(response.status, "Invalid JSON response from server");
  }
  
  if (!response.ok) {
    console.error('API Error:', { status: response.status, data });
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
   * GET /api/bookings/check-status/?acknowledgement_id=...
   */
  async getStatus(acknowledgementId: string): Promise<BookingStatusResponse> {
    const response = await fetch(
      `${BACKEND_URL}/api/bookings/check-status/?acknowledgement_id=${encodeURIComponent(acknowledgementId)}`
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
  canRequestCancellation: (status: string) => !["CANCELLED", "REJECTED"].includes(status),
  isTerminal: (status: string) => ["CONFIRMED", "CANCELLED", "COMPLETED", "REJECTED"].includes(status),
  needsEmailVerification: (status: string) => status === "DRAFT",
  awaitingAdmin: (status: string) => status === "PENDING",
};
