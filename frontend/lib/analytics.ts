// Firebase Analytics Event Tracking
// Privacy-First: NO emails, IDs, tokens, or payment references

import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "./firebase";

// Analytics Event Names (as per requirements)
export const ANALYTICS_EVENTS = {
  BOOKING_FORM_OPENED: "booking_form_opened",
  BOOKING_SUBMITTED: "booking_submitted",
  BOOKING_VERIFIED: "booking_verified",
  BOOKING_APPROVED: "booking_approved",
  PAYMENT_INITIATED: "payment_initiated",
  PAYMENT_COMPLETED: "payment_completed",
  CANCELLATION_REQUESTED: "cancellation_requested",
  CANCELLATION_CONFIRMED: "cancellation_confirmed",
} as const;

// Helper function to log analytics events safely
const logAnalyticsEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  try {
    const analytics = getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  } catch (error) {
    // Silently fail - analytics should never break the app
    if (process.env.NODE_ENV === "development") {
      console.warn("Analytics error:", error);
    }
  }
};

// Booking Form Events
export const trackBookingFormOpened = (params?: {
  mode?: "ONLINE" | "OFFLINE";
}) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.BOOKING_FORM_OPENED, {
    mode: params?.mode || "unknown",
  });
};

export const trackBookingSubmitted = (params?: {
  mode?: "ONLINE" | "OFFLINE";
  period?: "MORNING" | "EVENING" | "CUSTOM";
}) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.BOOKING_SUBMITTED, {
    mode: params?.mode || "unknown",
    period: params?.period || "unknown",
  });
};

// Verification Events
export const trackBookingVerified = (params?: {
  status?: string;
}) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.BOOKING_VERIFIED, {
    status: params?.status || "unknown",
  });
};

export const trackBookingApproved = () => {
  logAnalyticsEvent(ANALYTICS_EVENTS.BOOKING_APPROVED);
};

// Payment Events
export const trackPaymentInitiated = (params?: {
  has_amount?: boolean;
}) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.PAYMENT_INITIATED, {
    has_amount: params?.has_amount || false,
  });
};

export const trackPaymentCompleted = () => {
  logAnalyticsEvent(ANALYTICS_EVENTS.PAYMENT_COMPLETED);
};

// Cancellation Events
export const trackCancellationRequested = () => {
  logAnalyticsEvent(ANALYTICS_EVENTS.CANCELLATION_REQUESTED);
};

export const trackCancellationConfirmed = () => {
  logAnalyticsEvent(ANALYTICS_EVENTS.CANCELLATION_CONFIRMED);
};

// Generic event tracker for custom events (if needed later)
export const trackCustomEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  logAnalyticsEvent(eventName, params);
};
