export type ConsultingCategoryId = 
  | 'business' 
  | 'personal' 
  | 'career' 
  | 'problem-solving' 
  | 'digital';

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
