export interface Experience {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  image: string;
  border_color: 'pink' | 'yellow' | 'blue' | 'green';
  about: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ExperienceSlot {
  id: string;
  experience_id: string;
  date: string;
  time: string;
  total_slots: number;
  booked_slots: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Booking {
  id: string;
  experience_id: string;
  slot_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  participants: number;
  promo_code?: string;
  discount_amount: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: Date;
  updated_at?: Date;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_amount?: number;
  max_discount?: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface BookingRequest {
  experienceId: string;
  slotId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  participants: number;
  promoCode?: string;
}

export interface ExperienceWithSlots extends Experience {
  availableDates: string[];
  availableTimes: { time: string; slotsLeft: number; slotId: string }[];
}