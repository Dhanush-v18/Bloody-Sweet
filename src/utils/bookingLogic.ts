import type { AdminAvailabilityConfig, Booking } from './bookingTypes.ts';

/**
 * Calculates a deterministic, stable quote index for a calendar day.
 * Changes deterministically at midnight local time and guarantees no out-of-bounds.
 */
export function getDeterministicDailyQuoteIndex(date: Date, totalQuotes: number): number {
  if (totalQuotes <= 0) return 0;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Golden ratio prime hash for uniform distribution without clustering
  const seed = (year * 10000 + month * 100 + day) * 2654435761;
  const positiveSeed = Math.abs(seed ^ (seed >>> 16));
  return positiveSeed % totalQuotes;
}

/**
 * Generates a clean, unique reference code: BS-YYYY-XXXX
 */
export function generateBookingReference(date: Date = new Date()): string {
  const year = date.getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous 0, O, 1, I
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BS-${year}-${randomPart}`;
}

/**
 * Formats hour and minute into standard 12-hour string "09:00 AM"
 */
export function formatTimeSlot(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const padH = displayHour.toString().padStart(2, '0');
  const padM = minute.toString().padStart(2, '0');
  return `${padH}:${padM} ${period}`;
}

/**
 * Parses "09:00 AM" back into hour and minute in 24h
 */
export function parseTimeSlot(slotStr: string): { hour: number; minute: number } | null {
  const match = slotStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return { hour, minute };
}

/**
 * Generates genuine available slots for a given date string (YYYY-MM-DD),
 * respecting admin working days, hours, durations, buffer times, blocked dates,
 * and filtering out any already booked slots.
 */
export function generateAvailableSlots(
  dateStr: string,
  config: AdminAvailabilityConfig,
  existingBookings: Booking[],
  referenceNow: Date = new Date()
): string[] {
  if (!dateStr) return [];

  // Parse YYYY-MM-DD cleanly in local calendar
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  if (isNaN(targetDate.getTime())) return [];

  // 1. Check if date is in the past
  const todayMidnight = new Date(
    referenceNow.getFullYear(),
    referenceNow.getMonth(),
    referenceNow.getDate()
  );
  if (targetDate < todayMidnight) {
    return [];
  }

  // 2. Check if date is blocked or holiday
  if (config.blockedDates.includes(dateStr)) {
    return [];
  }

  // 3. Check if day of week is configured as working day (0=Sun, 1=Mon, ..., 6=Sat)
  const dayOfWeek = targetDate.getDay();
  if (!config.workingDays.includes(dayOfWeek)) {
    return [];
  }

  // 4. Generate candidate slots from startHour to endHour
  const candidateSlots: string[] = [];
  const slotStepMinutes = Math.max(15, config.slotDurationMinutes + config.bufferTimeMinutes);

  let currentTotalMinutes = config.startHour * 60;
  const endTotalMinutes = config.endHour * 60;

  while (currentTotalMinutes + config.slotDurationMinutes <= endTotalMinutes) {
    const h = Math.floor(currentTotalMinutes / 60);
    const min = currentTotalMinutes % 60;
    candidateSlots.push(formatTimeSlot(h, min));
    currentTotalMinutes += slotStepMinutes;
  }

  // 5. Filter out slots already booked and active
  const activeBookingsForDate = existingBookings.filter(
    (b) => b.date === dateStr && b.status !== 'cancelled'
  );
  const bookedSlotStrings = new Set(activeBookingsForDate.map((b) => b.timeSlot.trim()));

  // 6. If targetDate is today, filter out times that have already passed
  const isToday =
    targetDate.getFullYear() === referenceNow.getFullYear() &&
    targetDate.getMonth() === referenceNow.getMonth() &&
    targetDate.getDate() === referenceNow.getDate();

  const nowTotalMinutes = referenceNow.getHours() * 60 + referenceNow.getMinutes();

  return candidateSlots.filter((slot) => {
    // Check if slot is already booked
    if (bookedSlotStrings.has(slot.trim())) {
      return false;
    }

    // Check if slot has passed today (give 15 min buffer)
    if (isToday) {
      const parsed = parseTimeSlot(slot);
      if (parsed) {
        const slotTotalMinutes = parsed.hour * 60 + parsed.minute;
        if (slotTotalMinutes <= nowTotalMinutes + 15) {
          return false;
        }
      }
    }

    return true;
  });
}

/**
 * Validates whether a specific slot can be safely reserved
 */
export function validateBookingSlot(
  dateStr: string,
  timeSlot: string,
  config: AdminAvailabilityConfig,
  existingBookings: Booking[],
  referenceNow: Date = new Date()
): { valid: boolean; error?: string } {
  if (!dateStr || !timeSlot) {
    return { valid: false, error: 'Please choose both a consultation date and an available time slot.' };
  }

  const available = generateAvailableSlots(dateStr, config, existingBookings, referenceNow);
  if (!available.includes(timeSlot.trim())) {
    // Determine why it's not available to provide helpful error
    const [y, m, d] = dateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    const todayMidnight = new Date(
      referenceNow.getFullYear(),
      referenceNow.getMonth(),
      referenceNow.getDate()
    );

    if (targetDate < todayMidnight) {
      return { valid: false, error: 'Cannot book appointments on past dates.' };
    }
    if (config.blockedDates.includes(dateStr)) {
      return { valid: false, error: 'This date is currently blocked or marked as unavailable.' };
    }
    if (!config.workingDays.includes(targetDate.getDay())) {
      return { valid: false, error: 'Consultations are not scheduled on this day of the week.' };
    }

    const isBooked = existingBookings.some(
      (b) => b.date === dateStr && b.timeSlot.trim() === timeSlot.trim() && b.status !== 'cancelled'
    );
    if (isBooked) {
      return {
        valid: false,
        error: 'This specific time slot has just been reserved. Please select another available time.'
      };
    }

    return {
      valid: false,
      error: 'The selected time slot is outside of current consulting hours or has already passed.'
    };
  }

  return { valid: true };
}

/**
 * Checks if a booking is eligible for cancellation according to notice policy
 */
export function canCancelBooking(
  booking: Booking,
  config: AdminAvailabilityConfig,
  referenceNow: Date = new Date()
): boolean {
  if (booking.status !== 'confirmed') return false;

  const [y, m, d] = booking.date.split('-').map(Number);
  const parsed = parseTimeSlot(booking.timeSlot);
  if (!parsed) return false;

  const bookingDateTime = new Date(y, m - 1, d, parsed.hour, parsed.minute);
  const diffHours = (bookingDateTime.getTime() - referenceNow.getTime()) / (1000 * 60 * 60);

  return diffHours >= config.cancellationNoticeHours;
}
