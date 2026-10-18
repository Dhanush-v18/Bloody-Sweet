export type ConsultingCategoryId = 
  | 'business' 
  | 'personal' 
  | 'career' 
  | 'problem-solving' 
  | 'digital';

export interface ConsultingService {
  id: ConsultingCategoryId;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  bulletPoints: string[];
  approach: string[];
  expectedOutcome: string;
  ctaText: string;
  disclaimer?: string;
  icon: string;
}

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'pending';

export interface Booking {
  id: string;
  reference: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: ConsultingCategoryId;
  categoryTitle: string;
  title: string;
  description: string;
  goal: string;
  additionalContext?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  durationMinutes: number;
  timezone: string;
  status: BookingStatus;
  createdAt: string;
  cancellationReason?: string;
}

export interface Quote {
  id: number;
  text: string;
  category: string;
  attribution: string;
}

export interface AdminAvailabilityConfig {
  workingDays: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  startHour: number; // e.g. 9 (09:00)
  endHour: number; // e.g. 18 (18:00)
  slotDurationMinutes: number; // 30
  bufferTimeMinutes: number; // 15
  blockedDates: string[]; // ['2026-10-25', ...]
  timezone: string; // 'Asia/Kolkata' or user's local
  cancellationNoticeHours: number; // 24
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  createdAt: string;
}
