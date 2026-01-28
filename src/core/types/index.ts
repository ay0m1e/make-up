// Shared types placeholder.
// Shared domain types for the booking system
// These mirror the Flask backend responses

export interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration_minutes: number
  is_active: boolean
}

export interface AvailabilitySlot {
  start: string // ISO datetime
  end: string   // ISO datetime
}

export type PaymentMode = 'online' | 'in_person'

export interface BookingDraft {
  service?: Service
  date?: string // YYYY-MM-DD
  timeSlot?: AvailabilitySlot
  paymentMode?: PaymentMode
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Booking {
  id: string
  service: Service
  date: string
  start_time: string
  end_time: string
  status: BookingStatus
  payment_mode: PaymentMode
  created_at: string
}
