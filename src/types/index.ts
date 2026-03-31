export type UserRole = 'external' | 'internal' | 'studio' | 'admin';
export type PassType = 'full_day' | 'half_day';
export type SpaceType = 'training_room' | 'hot_desk' | 'meeting_room' | 'studio';
export type SessionType = 'half_day_am' | 'half_day_pm' | 'full_day' | 'hourly';
export type BookingStatus = 'upcoming' | 'confirmed' | 'completed' | 'cancelled';
export type BookingSource = 'client' | 'staff' | 'admin';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  phone?: string;
  role: UserRole;
  invoice_email?: string;
  studio_access: boolean;
  anytime_access: boolean;
  is_suspended: boolean;
  created_at: string;
}

export interface PassBalance {
  id: string;
  user_id: string;
  pass_type: PassType;
  total_passes: number;
  used_passes: number;
  purchased_at: string;
  stripe_payment_id?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  space_type: SpaceType;
  booking_date: string;
  start_time: string;
  end_time: string;
  session_type: SessionType;
  duration_hours?: number;
  delegates?: number;
  total_ex_vat: number;
  total_inc_vat: number;
  status: BookingStatus;
  reference: string;
  stripe_payment_id?: string;
  invoice_url?: string;
  special_requirements?: string;
  booking_source?: BookingSource;
  booked_by?: string;
  internal_notes?: string;
  created_at: string;
  // Joined profile data (admin/staff queries)
  profiles?: { first_name: string; last_name: string; email: string } | null;
}

export interface Invoice {
  id: string;
  user_id: string;
  booking_id: string;
  invoice_number: string;
  description: string;
  amount_ex_vat: number;
  vat_amount: number;
  total_inc_vat: number;
  pdf_url?: string;
  issued_at: string;
}

export interface StudioEnquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  session_type: string;
  frequency: string;
  preferred_start?: string;
  preferred_end?: string;
  attendees: string;
  brief: string;
  status: string;
  created_at: string;
}

export interface RoomSettings {
  space_type: SpaceType;
  is_active: boolean;
  half_day_rate?: number;
  full_day_rate?: number;
  hourly_rate?: number;
}

export interface PassBundle {
  passes: number;
  price: number;
  perPass: number;
  label: string;
}

export const FULL_DAY_BUNDLES: PassBundle[] = [
  { passes: 1, price: 15, perPass: 15, label: 'Single' },
  { passes: 4, price: 48, perPass: 12, label: '4-Pass Bundle' },
  { passes: 8, price: 80, perPass: 10, label: '8-Pass Bundle' },
  { passes: 12, price: 108, perPass: 9, label: '12-Pass Bundle' },
  { passes: 20, price: 160, perPass: 8, label: '20-Pass Bundle' },
];

export const HALF_DAY_BUNDLES: PassBundle[] = [
  { passes: 1, price: 10, perPass: 10, label: 'Single' },
  { passes: 4, price: 32, perPass: 8, label: '4-Pass Bundle' },
  { passes: 8, price: 56, perPass: 7, label: '8-Pass Bundle' },
  { passes: 12, price: 72, perPass: 6, label: '12-Pass Bundle' },
  { passes: 20, price: 100, perPass: 5, label: '20-Pass Bundle' },
];

export const IMAGES = {
  hero: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/a0e0681a-1de9-4cff-9c4a-75832e41c871/IMG_6147.JPG',
  trainingRoom: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/92681489-6e4b-4533-8104-bbcdc04e9797/_DSC6388.jpg',
  coworking: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/8aa0a9dd-04cc-4e0b-b9c9-dbe29910391f/IMG_9716.jpg',
  meetingRoom: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/badd0c5e-ef10-42a4-a162-0802bf59b9f6/IMG_9735_02.jpg',
  studio: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/ffbe13b4-cb5e-4439-be9d-444096e12145/_DSC6489.jpg',
  coworkHero: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/1af9e01b-63e8-44f4-a635-69e89e5fdfc4/IMG_1139.jpg',
  pricingHero: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/c5a87787-de70-4c4f-8c11-0bed38573fd1/_DSC6530.jpg',
  fullDayPasses: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/1af9e01b-63e8-44f4-a635-69e89e5fdfc4/IMG_1139.jpg',
  halfDayPasses: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/86c4a77a-a000-44d6-bb0d-69b254507e8c/IMG_3846.JPG',
  meetingRoomPricing: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/63b9e369-c497-43de-b1aa-e5a459a48121/IMG_1174.JPG',
  trainingRoomPricing: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/96bde99d-63ff-40cc-bb8e-5b82a5e09860/IMG_3114.JPG',
  spacesHeader: 'https://images.squarespace-cdn.com/content/v1/648b57cff3f5254410d92f92/a0e0681a-1de9-4cff-9c4a-75832e41c871/IMG_6967.jpg',
};
