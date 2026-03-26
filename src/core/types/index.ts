// Shared booking and API types used across the frontend.
export interface Service {
  id: string;
  name: string;
  description?: string | null;
  price_pence: number;
  duration_minutes: number;
  category?: string | null;
  is_active: boolean;
  created_at?: string | null;
}

export interface ServiceListResponse {
  data: Service[];
  meta?: {
    count?: number;
  };
}

export interface BookingDraft {
  service?: Service;
  booking_date?: string;
  start_time?: string;
  quantity: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string;
  confirmation?: BookingConfirmation;
}

export interface CreateBookingPayload {
  service_id: string;
  booking_date: string;
  start_time: string;
  quantity: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: string;
}

export interface BankTransferInstructions {
  account_name: string;
  sort_code: string;
  account_number: string;
  instructions: string;
}

export interface BookingConfirmation {
  booking_id: string;
  reference_code: string;
  booking_status: string;
  payment_status: string;
  total_amount_pence: number;
  deposit_amount_pence: number;
  bank_transfer: BankTransferInstructions;
}
