import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getDeterministicDailyQuoteIndex,
  generateBookingReference,
  formatTimeSlot,
  parseTimeSlot,
  generateAvailableSlots,
  validateBookingSlot,
  canCancelBooking
} from './bookingLogic.ts';
import type { AdminAvailabilityConfig, Booking } from './bookingTypes.ts';

const mockAdminConfig: AdminAvailabilityConfig = {
  workingDays: [1, 2, 3, 4, 5], // Mon to Fri
  startHour: 9, // 9:00 AM
  endHour: 17, // 5:00 PM
  slotDurationMinutes: 30,
  bufferTimeMinutes: 15,
  blockedDates: ['2026-10-25'],
  timezone: 'Asia/Kolkata',
  cancellationNoticeHours: 24
};

test('getDeterministicDailyQuoteIndex produces stable index for same date and advances correctly', () => {
  const dateA = new Date('2026-10-18T10:00:00Z');
  const dateB = new Date('2026-10-18T22:30:00Z');
  const dateNext = new Date('2026-10-19T08:00:00Z');

  const idxA = getDeterministicDailyQuoteIndex(dateA, 100);
  const idxB = getDeterministicDailyQuoteIndex(dateB, 100);
  const idxNext = getDeterministicDailyQuoteIndex(dateNext, 100);

  assert.equal(idxA, idxB, 'Same day should produce identical quote index');
  assert.ok(idxA >= 0 && idxA < 100, 'Index must be within bounds 0-99');
  assert.notEqual(idxA, idxNext, 'Subsequent day should produce different quote index');
});

test('generateBookingReference produces valid BS-YYYY-XXXX format', () => {
  const ref = generateBookingReference(new Date('2026-10-18T00:00:00Z'));
  assert.match(ref, /^BS-2026-[A-Z0-9]{4}$/);
});

test('formatTimeSlot and parseTimeSlot convert cleanly', () => {
  assert.equal(formatTimeSlot(9, 0), '09:00 AM');
  assert.equal(formatTimeSlot(14, 30), '02:30 PM');
  assert.equal(formatTimeSlot(12, 0), '12:00 PM');
  assert.equal(formatTimeSlot(0, 15), '12:15 AM');

  const parsed = parseTimeSlot('02:30 PM');
  assert.deepEqual(parsed, { hour: 14, minute: 30 });
});

test('generateAvailableSlots handles working days, hours, blocked dates, and conflicts', () => {
  const referenceNow = new Date('2026-10-19T08:00:00'); // Monday 8am
  const mondayDate = '2026-10-19';
  const sundayDate = '2026-10-18';
  const blockedDate = '2026-10-25';

  // Sunday is not in workingDays (1-5)
  const sundaySlots = generateAvailableSlots(sundayDate, mockAdminConfig, [], referenceNow);
  assert.equal(sundaySlots.length, 0, 'Should not return slots for non-working days');

  // Blocked date
  const blockedSlots = generateAvailableSlots(blockedDate, mockAdminConfig, [], referenceNow);
  assert.equal(blockedSlots.length, 0, 'Should not return slots for blocked dates');

  // Monday should return slots
  const mondaySlots = generateAvailableSlots(mondayDate, mockAdminConfig, [], referenceNow);
  assert.ok(mondaySlots.length > 0, 'Monday should have available slots');
  assert.equal(mondaySlots[0], '09:00 AM');

  // Existing booking conflict test
  const existingBookings: Booking[] = [
    {
      id: 'b-1',
      reference: 'BS-2026-TEST',
      userId: 'u1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      category: 'business',
      categoryTitle: 'Business Strategy',
      title: 'Strategy Audit',
      description: 'Audit operations',
      goal: 'Improve margin',
      date: '2026-10-19',
      timeSlot: '09:00 AM',
      durationMinutes: 30,
      timezone: 'Asia/Kolkata',
      status: 'confirmed',
      createdAt: '2026-10-18T00:00:00Z'
    }
  ];

  const slotsAfterBooking = generateAvailableSlots(mondayDate, mockAdminConfig, existingBookings, referenceNow);
  assert.equal(slotsAfterBooking.includes('09:00 AM'), false, 'Booked slot should be excluded from available slots');
  assert.equal(slotsAfterBooking.includes('09:45 AM'), true, 'Next slot with 15min buffer should be available');
});

test('validateBookingSlot prevents booking invalid or conflicting slots', () => {
  const referenceNow = new Date('2026-10-19T08:00:00');
  const existingBookings: Booking[] = [
    {
      id: 'b-1',
      reference: 'BS-2026-TEST',
      userId: 'u1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      category: 'business',
      categoryTitle: 'Business Strategy',
      title: 'Strategy Audit',
      description: 'Audit operations',
      goal: 'Improve margin',
      date: '2026-10-19',
      timeSlot: '09:00 AM',
      durationMinutes: 30,
      timezone: 'Asia/Kolkata',
      status: 'confirmed',
      createdAt: '2026-10-18T00:00:00Z'
    }
  ];

  // Try to book already taken slot
  const resConflicted = validateBookingSlot('2026-10-19', '09:00 AM', mockAdminConfig, existingBookings, referenceNow);
  assert.equal(resConflicted.valid, false);
  assert.ok(resConflicted.error?.includes('reserved'));

  // Try to book valid slot
  const resValid = validateBookingSlot('2026-10-19', '09:45 AM', mockAdminConfig, existingBookings, referenceNow);
  assert.equal(resValid.valid, true);
  assert.equal(resValid.error, undefined);
});

test('canCancelBooking respects cancellation window', () => {
  const referenceNow = new Date('2026-10-19T08:00:00');
  
  const futureBooking: Booking = {
    id: 'b-1',
    reference: 'BS-2026-FUTR',
    userId: 'u1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    category: 'business',
    categoryTitle: 'Business Strategy',
    title: 'Strategy',
    description: 'Help',
    goal: 'Growth',
    date: '2026-10-21', // 48h in future
    timeSlot: '10:00 AM',
    durationMinutes: 30,
    timezone: 'Asia/Kolkata',
    status: 'confirmed',
    createdAt: '2026-10-18T00:00:00Z'
  };

  const imminentBooking: Booking = {
    ...futureBooking,
    date: '2026-10-19', // Only 2h in future
    timeSlot: '10:00 AM'
  };

  assert.equal(canCancelBooking(futureBooking, mockAdminConfig, referenceNow), true, 'Eligible for cancellation 48h ahead');
  assert.equal(canCancelBooking(imminentBooking, mockAdminConfig, referenceNow), false, 'Not eligible for cancellation under 24h notice');
});
