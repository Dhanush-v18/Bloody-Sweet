import { AdminAvailabilityConfig, Booking, ContactEnquiry } from '../types';
import { generateBookingReference, validateBookingSlot } from '../utils/bookingLogic';

const BOOKINGS_KEY = 'bloody_sweet_bookings_v1';
const ADMIN_CONFIG_KEY = 'bloody_sweet_admin_config_v1';
const SAVED_QUOTES_KEY = 'bloody_sweet_saved_quotes_v1';
const ENQUIRIES_KEY = 'bloody_sweet_enquiries_v1';

export const DEFAULT_ADMIN_CONFIG: AdminAvailabilityConfig = {
  workingDays: [1, 2, 3, 4, 5], // Monday through Friday
  startHour: 9, // 9:00 AM
  endHour: 18, // 6:00 PM
  slotDurationMinutes: 30,
  bufferTimeMinutes: 15,
  blockedDates: [],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
  cancellationNoticeHours: 24
};

// Initial starter bookings for Dhanush Nandhakumar
const INITIAL_DEMO_BOOKINGS: Booking[] = [
  {
    id: 'demo-b-1',
    reference: 'BS-2026-X9A1',
    userId: 'demo-user-1',
    userName: 'Aarav Patel',
    userEmail: 'aarav@example.com',
    category: 'business',
    categoryTitle: 'Business Strategy Consulting',
    title: 'SaaS Expansion & Pricing Model Audit',
    description: 'Transitioning from one-time licenses to tiered subscription contracts. Need review of pricing tiers and sales runway.',
    goal: 'Define enterprise contract pricing and milestone timelines',
    additionalContext: 'Current team size is 12 engineers and 3 sales leads.',
    date: '2026-10-22',
    timeSlot: '10:30 AM',
    durationMinutes: 30,
    timezone: 'Asia/Kolkata',
    status: 'confirmed',
    createdAt: '2026-10-17T12:00:00Z'
  },
  {
    id: 'demo-b-2',
    reference: 'BS-2026-M4K8',
    userId: 'demo-user-2',
    userName: 'Meera Sen',
    userEmail: 'meera@example.com',
    category: 'career',
    categoryTitle: 'Career and Work Consulting',
    title: 'Senior Leadership vs Founder Transition',
    description: 'Evaluating offer for VP Engineering versus leaving to launch bootstrapped B2B devtool.',
    goal: 'Structured trade-off framework for risk tolerance and timing',
    date: '2026-10-23',
    timeSlot: '02:00 PM',
    durationMinutes: 30,
    timezone: 'Asia/Kolkata',
    status: 'confirmed',
    createdAt: '2026-10-16T15:30:00Z'
  }
];

export function getAdminConfig(): AdminAvailabilityConfig {
  try {
    const raw = localStorage.getItem(ADMIN_CONFIG_KEY);
    if (raw) {
      return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading admin config:', e);
  }
  return DEFAULT_ADMIN_CONFIG;
}

export function saveAdminConfig(config: AdminAvailabilityConfig): void {
  try {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving admin config:', e);
  }
}

export function getAllBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Seed initial demo data
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_DEMO_BOOKINGS));
    return INITIAL_DEMO_BOOKINGS;
  } catch (e) {
    console.error('Error loading bookings:', e);
    return INITIAL_DEMO_BOOKINGS;
  }
}

export function getUserBookings(userEmail: string, userId: string): Booking[] {
  const all = getAllBookings();
  const lowerEmail = userEmail.toLowerCase().trim();
  return all.filter(
    (b) => (b.userEmail && b.userEmail.toLowerCase().trim() === lowerEmail) || b.userId === userId
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createBooking(
  bookingData: Omit<Booking, 'id' | 'reference' | 'createdAt' | 'status'>
): { success: boolean; booking?: Booking; error?: string } {
  const currentConfig = getAdminConfig();
  const currentBookings = getAllBookings();

  // 1. Strict double-booking validation
  const validation = validateBookingSlot(
    bookingData.date,
    bookingData.timeSlot,
    currentConfig,
    currentBookings
  );

  if (!validation.valid) {
    return { success: false, error: validation.error || 'This time slot is not available.' };
  }

  // 2. Generate unique reference and unique ID
  const reference = generateBookingReference();
  const newBooking: Booking = {
    ...bookingData,
    id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    reference,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  try {
    const updated = [newBooking, ...currentBookings];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return { success: true, booking: newBooking };
  } catch (e: any) {
    return { success: false, error: 'Database storage error: ' + (e.message || 'Failed to save appointment.') };
  }
}

export function cancelBooking(bookingId: string, reason?: string): { success: boolean; error?: string } {
  try {
    const all = getAllBookings();
    const index = all.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      return { success: false, error: 'Appointment not found.' };
    }

    all[index].status = 'cancelled';
    if (reason) {
      all[index].cancellationReason = reason;
    }

    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to cancel appointment.' };
  }
}

export function getSavedQuoteIds(userId: string): number[] {
  try {
    const raw = localStorage.getItem(`${SAVED_QUOTES_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading saved quotes:', e);
  }
  return [];
}

export function toggleSaveQuote(userId: string, quoteId: number): number[] {
  try {
    const current = getSavedQuoteIds(userId);
    let updated: number[];
    if (current.includes(quoteId)) {
      updated = current.filter((id) => id !== quoteId);
    } else {
      updated = [quoteId, ...current];
    }
    localStorage.setItem(`${SAVED_QUOTES_KEY}_${userId}`, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error toggling quote save:', e);
    return [];
  }
}

export function saveContactEnquiry(enquiry: Omit<ContactEnquiry, 'id' | 'createdAt'>): ContactEnquiry {
  const item: ContactEnquiry = {
    ...enquiry,
    id: `enq-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  try {
    const raw = localStorage.getItem(ENQUIRIES_KEY);
    const list: ContactEnquiry[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify([item, ...list]));
  } catch (e) {
    console.error('Error saving enquiry:', e);
  }
  return item;
}
