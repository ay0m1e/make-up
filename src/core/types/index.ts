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

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string | null;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  admin: AdminUser;
}

export interface AdminBooking {
  id: string;
  reference_code: string;
  service: {
    id?: string | null;
    name?: string | null;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  booking_date: string;
  start_time: string;
  end_time: string;
  quantity: number;
  amounts: {
    total_amount_pence: number;
    deposit_amount_pence: number;
  };
  booking_status: string;
  payment_method: string;
  payment_status: string;
  notes?: string | null;
  created_at?: string | null;
}

export interface AdminBookingListResponse {
  data: AdminBooking[];
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    pages?: number;
    filters?: {
      status?: string | null;
      date_from?: string | null;
      date_to?: string | null;
    };
  };
}

export interface AdminBookingResponse {
  data: AdminBooking;
}

export interface AdminServicePayload {
  name: string;
  description?: string | null;
  price_pence: number;
  duration_minutes: number;
  category?: string | null;
  is_active?: boolean;
}

export interface AdminServiceResponse {
  data: Service;
}
