// Booking Types
export type BookingStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "PAYMENT_PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED"
  | "PAYMENT_FAILED";

export type PeriodType = "MORNING" | "EVENING" | "CUSTOM";
export type ModeType = "ONLINE" | "OFFLINE";
export type PaymentModeType = "ONLINE" | "OFFLINE";
export type GenderType = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export interface BookingDraftRequest {
  email: string;
  full_name: string;
  phone_number: string;
  city: string;
  state: string;
  country: string;
  age: number;
  gender: GenderType;
  emergency_contact: string;
  consent_given: boolean;
  preferred_date: string;
  preferred_period: PeriodType;
  mode: ModeType;
  preferred_time_start?: string;
  preferred_time_end?: string;
  user_message?: string;
}

export interface BookingDraftResponse {
  message: string;
  acknowledgement_id?: string;
}

export interface VerifyEmailResponse {
  message: string;
  acknowledgement_id: string;
  status: BookingStatus;
}

export interface BookingStatusResponse {
  acknowledgement_id: string;
  status: BookingStatus;
  preferred_date: string;
  preferred_period: PeriodType;
  preferred_time_start?: string;
  preferred_time_end?: string;
  mode: ModeType;
  approved_slot_start?: string;
  approved_slot_end?: string;
  amount?: string;
  timeline: BookingStatus[];
  created_at: string;
}

export interface InitiatePaymentRequest {
  acknowledgement_id: string;
}

export interface InitiatePaymentResponse {
  message: string;
  payment_reference: string;
  amount: string;
}

export interface CompletePaymentRequest {
  payment_reference: string;
}

export interface CompletePaymentResponse {
  message: string;
  status: BookingStatus;
}

export interface RequestCancellationRequest {
  acknowledgement_id: string;
}

export interface RequestCancellationResponse {
  message: string;
}

export interface VerifyCancellationResponse {
  message: string;
  status: BookingStatus;
}
