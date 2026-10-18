import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, ConsultingCategoryId, Booking, AdminAvailabilityConfig } from '../types';
import { CONSULTING_SERVICES } from '../data/services';
import { 
  generateAvailableSlots, 
  validateBookingSlot 
} from '../utils/bookingLogic';
import { 
  getAdminConfig, 
  getAllBookings, 
  createBooking 
} from '../services/storageService';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  Briefcase, 
  Compass, 
  TrendingUp, 
  Layers, 
  Cpu, 
  Download, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface BookingFlowProps {
  user: UserProfile;
  initialCategory?: ConsultingCategoryId;
  onClose: () => void;
  onBookingComplete: (booking: Booking) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  user,
  initialCategory = 'business',
  onClose,
  onBookingComplete
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [category, setCategory] = useState<ConsultingCategoryId>(initialCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  
  // Date & Time selection
  const todayStr = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Storage & Config
  const [adminConfig, setAdminConfig] = useState<AdminAvailabilityConfig>(getAdminConfig());
  const [allBookings, setAllBookings] = useState<Booking[]>(getAllBookings());

  // Available slots for selectedDate
  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    return generateAvailableSlots(selectedDate, adminConfig, allBookings);
  }, [selectedDate, adminConfig, allBookings]);

  // Submission & Validation status
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    setAdminConfig(getAdminConfig());
    setAllBookings(getAllBookings());
  }, []);

  const currentService = useMemo(() => {
    return CONSULTING_SERVICES.find((s) => s.id === category) || CONSULTING_SERVICES[0];
  }, [category]);

  // Step 2 Validation
  const isStep2Valid = title.trim().length >= 3 && description.trim().length >= 10 && goal.trim().length >= 5;

  // Step 3 Validation
  const isStep3Valid = Boolean(selectedDate && selectedTimeSlot);

  // Handle final submission in Step 4
  const handleConfirmBooking = () => {
    setSubmitting(true);
    setErrorMessage(null);

    // Re-validate against fresh storage state
    const currentConfig = getAdminConfig();
    const currentBookings = getAllBookings();

    const validation = validateBookingSlot(selectedDate, selectedTimeSlot, currentConfig, currentBookings);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'The selected slot has become unavailable. Please pick another time.');
      setSubmitting(false);
      setStep(3); // Send back to pick another slot
      return;
    }

    const result = createBooking({
      userId: user.uid,
      userName: user.displayName,
      userEmail: user.email,
      category,
      categoryTitle: currentService.title,
      title: title.trim(),
      description: description.trim(),
      goal: goal.trim(),
      additionalContext: additionalContext.trim() || undefined,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      durationMinutes: adminConfig.slotDurationMinutes || 30,
      timezone: adminConfig.timezone
    });

    setSubmitting(false);

    if (result.success && result.booking) {
      setConfirmedBooking(result.booking);
      setStep(5);
      onBookingComplete(result.booking);
    } else {
      setErrorMessage(result.error || 'Failed to confirm booking. Please try again.');
    }
  };

  // Helper to generate Google Calendar Link
  const getGoogleCalendarUrl = (b: Booking) => {
    const [y, m, d] = b.date.split('-').map(Number);
    // Parse time
    const match = b.timeSlot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    let startH = 10, startMin = 0;
    if (match) {
      startH = parseInt(match[1], 10);
      startMin = parseInt(match[2], 10);
      if (match[3].toUpperCase() === 'PM' && startH < 12) startH += 12;
      if (match[3].toUpperCase() === 'AM' && startH === 12) startH = 0;
    }
    const startDate = new Date(Date.UTC(y, m - 1, d, startH, startMin));
    const endDate = new Date(startDate.getTime() + b.durationMinutes * 60 * 1000);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatGCal = (dt: Date) =>
      `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;

    const gcalStart = formatGCal(startDate);
    const gcalEnd = formatGCal(endDate);

    const details = encodeURIComponent(
      `BLOODY SWEET Consultation (${b.categoryTitle})\nReference: ${b.reference}\nGoal: ${b.goal}\nDetails: ${b.description}`
    );
    const summary = encodeURIComponent(`BLOODY SWEET: ${b.title}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${summary}&dates=${gcalStart}/${gcalEnd}&details=${details}&location=Google+Meet`;
  };

  // Helper to generate and download .ics file
  const downloadIcsFile = (b: Booking) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BLOODY SWEET//Consulting Appointments//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${b.reference}@bloodysweet.consulting`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:BLOODY SWEET: ${b.title}`,
      `DESCRIPTION:Consultation: ${b.categoryTitle}\\nReference: ${b.reference}\\nGoal: ${b.goal}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${b.reference}-appointment.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="glass-panel max-w-3xl w-full rounded-2xl border border-[#D4AF37]/40 shadow-2xl relative my-auto text-left overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Progress Header */}
        <div className="px-6 py-4 bg-[#11151D] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold text-xs">
              {step < 5 ? `0${step}` : '✓'}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                {step === 1 && 'Step 1: Choose Consultation Category'}
                {step === 2 && 'Step 2: Describe Your Challenge'}
                {step === 3 && 'Step 3: Select Date & Available Time'}
                {step === 4 && 'Step 4: Review & Confirm Consultation'}
                {step === 5 && 'Step 5: Appointment Confirmed!'}
              </h3>
              <p className="text-[11px] text-[#A6ADBB]">
                {step < 5 ? `Step ${step} of 4 • Guaranteed conflict-free booking` : 'Your reference code and calendar invite'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#A6ADBB] hover:text-white p-2 text-lg cursor-pointer"
            aria-label="Close booking modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          
          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Booking Notification</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* STEP 1: CHOOSE CATEGORY */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-[#A6ADBB] mb-4">
                Select the specific advisory discipline that best matches your current challenge:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {CONSULTING_SERVICES.map((srv) => {
                  const isSelected = category === srv.id;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => setCategory(srv.id)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-4 ${
                        isSelected
                          ? 'bg-[#11151D] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                          : 'bg-[#07090D] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#11151D] text-[#A6ADBB]'
                      }`}>
                        {srv.id === 'business' && <Briefcase className="w-5 h-5" />}
                        {srv.id === 'personal' && <Compass className="w-5 h-5" />}
                        {srv.id === 'career' && <TrendingUp className="w-5 h-5" />}
                        {srv.id === 'problem-solving' && <Layers className="w-5 h-5" />}
                        {srv.id === 'digital' && <Cpu className="w-5 h-5" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-white'}`}>
                            {srv.title}
                          </h4>
                          {isSelected && <CheckCircle className="w-4 h-4 text-[#D4AF37]" />}
                        </div>
                        <p className="text-xs text-[#A6ADBB] mt-1">{srv.subtitle}</p>
                        {srv.disclaimer && (
                          <p className="text-[10px] text-amber-400/80 mt-1 italic">{srv.disclaimer}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: DESCRIBE CHALLENGE */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                  Selected Category: {currentService.title}
                </span>
                <h4 className="text-base font-bold text-white mt-1">Brief Consultation Dossier</h4>
                <p className="text-xs text-[#A6ADBB]">
                  Help us understand your objective prior to the session. No sensitive personal data required.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Consultation Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scaling B2B SaaS sales or Evaluating cross-country relocation"
                  className="w-full px-4 py-3 rounded-xl bg-[#07090D] border border-white/10 text-xs text-white placeholder-[#A6ADBB]/50 focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Brief Description of the Challenge <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is the current situation and where is the friction or uncertainty?"
                  className="w-full px-4 py-3 rounded-xl bg-[#07090D] border border-white/10 text-xs text-white placeholder-[#A6ADBB]/50 focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Main Goal for the Session <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Reach a definitive go/no-go decision on the proposed offer"
                  className="w-full px-4 py-3 rounded-xl bg-[#07090D] border border-white/10 text-xs text-white placeholder-[#A6ADBB]/50 focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A6ADBB] mb-1.5">
                  Additional Context (Optional)
                </label>
                <input
                  type="text"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="Any relevant deadlines, key stakeholders, or constraints"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#07090D] border border-white/10 text-xs text-white placeholder-[#A6ADBB]/50 focus:border-[#168BFF] focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* STEP 3: SELECT DATE & TIME */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#11151D] border border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-white font-semibold">
                    Duration: {adminConfig.slotDurationMinutes} Minutes
                  </span>
                </div>
                <div className="text-[#A6ADBB]">
                  Timezone: <span className="text-[#168BFF] font-mono">{adminConfig.timezone}</span>
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Select Consultation Date (Past dates and holidays disabled)
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTimeSlot('');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[#07090D] border border-white/15 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              {/* Time Slots Area */}
              {selectedDate && (
                <div>
                  <h4 className="text-xs font-semibold text-white mb-2 flex items-center justify-between">
                    <span>Available Consultation Slots for {selectedDate}:</span>
                    <span className="text-[#A6ADBB] font-normal">{availableSlots.length} available</span>
                  </h4>

                  {availableSlots.length === 0 ? (
                    <div className="p-6 rounded-xl bg-[#11151D] border border-white/10 text-center">
                      <AlertCircle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                      <p className="text-xs text-white font-semibold">No Available Slots on this Date</p>
                      <p className="text-[11px] text-[#A6ADBB] mt-1">
                        This date may fall on a non-working day, be blocked for holidays, or all slots have been reserved. Please pick another business day.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedTimeSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-semibold font-mono border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#D4AF37] text-[#07090D] border-[#D4AF37] shadow-md shadow-[#D4AF37]/20 scale-[1.02]'
                                : 'bg-[#07090D] text-white border-white/10 hover:border-[#168BFF]'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white">Review Consultation Details</h4>
                <p className="text-xs text-[#A6ADBB]">
                  Please verify your information before confirming reservation.
                </p>
              </div>

              <div className="rounded-xl bg-[#11151D] border border-white/10 p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[#A6ADBB] block text-[11px]">Consultation Category</span>
                    <span className="font-bold text-[#D4AF37] text-sm">{currentService.title}</span>
                  </div>
                  <div>
                    <span className="text-[#A6ADBB] block text-[11px]">Scheduled Date & Time</span>
                    <span className="font-bold text-white text-sm">
                      {selectedDate} at {selectedTimeSlot}
                    </span>
                    <span className="block text-[10px] text-[#168BFF]">
                      {adminConfig.slotDurationMinutes} mins • {adminConfig.timezone}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[#A6ADBB] block text-[11px]">Client Name</span>
                    <span className="font-semibold text-white">{user.displayName}</span>
                  </div>
                  <div>
                    <span className="text-[#A6ADBB] block text-[11px]">Client Email</span>
                    <span className="font-semibold text-white font-mono">{user.email}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#A6ADBB] block text-[11px]">Topic / Title</span>
                  <p className="font-semibold text-white mt-0.5">{title}</p>
                </div>

                <div>
                  <span className="text-[#A6ADBB] block text-[11px]">Challenge Summary</span>
                  <p className="text-[#A6ADBB] mt-0.5 leading-relaxed">{description}</p>
                </div>

                <div>
                  <span className="text-[#A6ADBB] block text-[11px]">Key Goal for Session</span>
                  <p className="text-[#F7F8FC] mt-0.5">{goal}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#07090D] border border-white/10 text-[11px] text-[#A6ADBB]">
                <strong>Cancellation Policy:</strong> Rescheduling or cancellation is available with at least {adminConfig.cancellationNoticeHours} hours advance notice via your dashboard.
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION SUCCESS */}
          {step === 5 && confirmedBooking && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto shadow-xl shadow-[#D4AF37]/20">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                  Reservation Confirmed
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
                  Your Consultation is Booked
                </h3>
                <p className="text-xs sm:text-sm text-[#A6ADBB] mt-2 max-w-md mx-auto">
                  A calendar placeholder has been generated. Your unique session dossier reference is ready.
                </p>
              </div>

              {/* Reference Box */}
              <div className="p-4 rounded-xl bg-[#11151D] border border-[#D4AF37]/40 max-w-sm mx-auto">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#A6ADBB]">
                  Booking Reference
                </span>
                <p className="text-xl font-bold font-mono text-[#D4AF37] tracking-wider mt-0.5">
                  {confirmedBooking.reference}
                </p>
                <p className="text-xs text-white mt-1">
                  {confirmedBooking.date} • {confirmedBooking.timeSlot} ({confirmedBooking.durationMinutes}m)
                </p>
              </div>

              {/* Calendar Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getGoogleCalendarUrl(confirmedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-white bg-[#11151D] border border-white/20 hover:border-[#168BFF] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#168BFF]" />
                  <span>Add to Google Calendar</span>
                </a>

                <button
                  type="button"
                  onClick={() => downloadIcsFile(confirmedBooking)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-white bg-[#11151D] border border-white/20 hover:border-[#D4AF37] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Download .ICS File</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#11151D] border-t border-white/10 flex items-center justify-between">
          {step > 1 && step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#A6ADBB] hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 && (
            <button
              type="button"
              disabled={
                (step === 2 && !isStep2Valid) ||
                (step === 3 && !isStep3Valid)
              }
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#07090D] bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-md shadow-[#D4AF37]/20"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirmBooking}
              className="px-8 py-3 rounded-xl text-xs font-bold text-[#07090D] bg-gradient-to-r from-[#F7F8FC] via-[#FFF5DB] to-[#D4AF37] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/30"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-[#07090D] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Reservation</span>
                </>
              )}
            </button>
          )}

          {step === 5 && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#07090D] bg-[#D4AF37] hover:brightness-110 cursor-pointer ml-auto"
            >
              Done & Return to App
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
