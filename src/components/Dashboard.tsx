import React, { useState } from 'react';
import { UserProfile, Booking, Quote, AdminAvailabilityConfig } from '../types';
import { BLOODY_SWEET_QUOTES } from '../data/quotes';
import { CONSULTING_SERVICES } from '../data/services';
import { canCancelBooking } from '../utils/bookingLogic';
import { cancelBooking, getAdminConfig } from '../services/storageService';
import { 
  Calendar, 
  Clock, 
  Bookmark, 
  Phone, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  ArrowRight, 
  Trash2, 
  Copy, 
  Check, 
  Share2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  bookings: Booking[];
  savedQuoteIds: number[];
  adminConfig: AdminAvailabilityConfig;
  onRefreshBookings: () => void;
  onToggleSaveQuote: (quoteId: number) => void;
  onStartBooking: (categoryKey?: string) => void;
  onOpenAdminSettings: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  bookings,
  savedQuoteIds,
  adminConfig,
  onRefreshBookings,
  onToggleSaveQuote,
  onStartBooking,
  onOpenAdminSettings,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'quotes' | 'profile'>('bookings');
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [copiedQuoteId, setCopiedQuoteId] = useState<number | null>(null);

  const firstName = user.displayName.split(' ')[0] || 'Friend';

  // Filter bookings
  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status !== 'confirmed');

  // Saved quotes
  const savedQuotesList = BLOODY_SWEET_QUOTES.filter((q) => savedQuoteIds.includes(q.id));

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    setCancelError(null);

    // Validate notice policy
    const eligible = canCancelBooking(cancelModalBooking, adminConfig);
    if (!eligible) {
      setCancelError(
        `Cancellations must be made at least ${adminConfig.cancellationNoticeHours} hours before the appointment. Please contact support at 8610196055.`
      );
      return;
    }

    const res = cancelBooking(cancelModalBooking.id, cancelReason);
    if (res.success) {
      setCancelModalBooking(null);
      setCancelReason('');
      onRefreshBookings();
    } else {
      setCancelError(res.error || 'Failed to cancel reservation.');
    }
  };

  const handleCopyQuote = async (quote: Quote) => {
    try {
      await navigator.clipboard.writeText(`"${quote.text}" — ${quote.attribution}`);
      setCopiedQuoteId(quote.id);
      setTimeout(() => setCopiedQuoteId(null), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/30 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#168BFF] animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#168BFF]">
              Client & Advisory Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            Welcome back, <span className="gold-gradient-text">{firstName}</span>.
          </h1>
          <p className="text-xs sm:text-sm text-[#A6ADBB] mt-1">
            Track your consultations, review past dossiers, and manage saved insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user.isAdmin && (
            <button
              onClick={onOpenAdminSettings}
              className="px-4 py-2.5 rounded-xl bg-[#11151D] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-semibold text-[#D4AF37] transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Admin Availability Settings</span>
            </button>
          )}

          <button
            onClick={() => onStartBooking()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 text-xs font-bold text-[#07090D] transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-[#D4AF37]/20"
          >
            <Calendar className="w-4 h-4 text-[#07090D]" />
            <span>Book New Session</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel rounded-2xl p-5 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#A6ADBB]">Upcoming Consultations</span>
            <p className="text-2xl font-bold font-mono text-white mt-1">{upcomingBookings.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#168BFF]/20 border border-[#168BFF]/30 flex items-center justify-center text-[#168BFF]">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#A6ADBB]">Completed / Past Sessions</span>
            <p className="text-2xl font-bold font-mono text-white mt-1">{pastBookings.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#A6ADBB]">Saved Clarity Insights</span>
            <p className="text-2xl font-bold font-mono text-white mt-1">{savedQuotesList.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 mb-8 space-x-6 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-[#A6ADBB] hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Consultations ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`pb-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'quotes'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-[#A6ADBB] hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Quotes ({savedQuotesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-[#A6ADBB] hover:text-white'
          }`}
        >
          <span>Account & Security</span>
        </button>
      </div>

      {/* TAB 1: CONSULTATIONS / MY BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-8">
          
          {/* Upcoming Section */}
          <div>
            <h2 className="text-lg font-bold text-white font-heading mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Upcoming Scheduled Consultations</span>
            </h2>

            {upcomingBookings.length === 0 ? (
              <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center border border-white/10">
                <Calendar className="w-12 h-12 text-[#A6ADBB]/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white font-heading">
                  No consultations booked yet.
                </h3>
                <p className="text-xs sm:text-sm text-[#A6ADBB] mt-1 max-w-md mx-auto mb-6 leading-relaxed">
                  When you&apos;re ready, choose a topic and book your first session.
                </p>
                <button
                  onClick={() => onStartBooking()}
                  className="px-6 py-3 rounded-xl font-bold text-xs text-[#07090D] bg-[#D4AF37] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 cursor-pointer inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule First Session</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((b) => {
                  const eligibleForCancel = canCancelBooking(b, adminConfig);
                  return (
                    <div
                      key={b.id}
                      className="glass-panel rounded-2xl p-6 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2.5 py-0.5 rounded bg-[#168BFF]/20 text-[#168BFF] font-semibold border border-[#168BFF]/30">
                            {b.categoryTitle}
                          </span>
                          <span className="font-mono text-[#D4AF37] font-semibold">
                            Ref: {b.reference}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
                            CONFIRMED
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                          {b.title}
                        </h3>

                        <p className="text-xs text-[#A6ADBB] line-clamp-2">
                          {b.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#A6ADBB] pt-1">
                          <span className="text-white font-semibold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                            {b.date} at {b.timeSlot}
                          </span>
                          <span>•</span>
                          <span>{b.durationMinutes} Minutes</span>
                          <span>•</span>
                          <span className="font-mono">{b.timezone}</span>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                        <button
                          onClick={() => setCancelModalBooking(b)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-500/20 transition-colors cursor-pointer"
                        >
                          Request Cancellation
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past / Cancelled History */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-[#A6ADBB] font-heading mb-3">
                Consultation History ({pastBookings.length})
              </h2>
              <div className="space-y-3">
                {pastBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-[#11151D]/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-semibold text-[#A6ADBB]">{b.reference}</span>
                        <span className="text-white font-semibold">{b.categoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          b.status === 'cancelled'
                            ? 'bg-red-950/50 text-red-400 border border-red-500/20'
                            : 'bg-white/5 text-[#A6ADBB]'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-white font-medium">{b.title}</p>
                      <p className="text-[#A6ADBB] text-[11px] mt-0.5">
                        Scheduled for: {b.date} • {b.timeSlot}
                      </p>
                    </div>

                    {b.cancellationReason && (
                      <div className="text-[11px] text-red-300/80 bg-red-950/20 p-2 rounded border border-red-500/10">
                        Reason: {b.cancellationReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: SAVED QUOTES */}
      {activeTab === 'quotes' && (
        <div>
          {savedQuotesList.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 text-center border border-white/10">
              <Bookmark className="w-10 h-10 text-[#A6ADBB]/30 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white font-heading">No saved quotes yet</h3>
              <p className="text-xs text-[#A6ADBB] mt-1 max-w-sm mx-auto">
                Bookmark clarity insights from the Daily Quote section to revisit them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedQuotesList.map((q) => (
                <div
                  key={q.id}
                  className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-[#11151D] text-[#168BFF] font-medium text-[11px]">
                        {q.category}
                      </span>
                      <button
                        onClick={() => onToggleSaveQuote(q.id)}
                        className="text-red-400 hover:text-red-300 text-xs p-1 cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-sm sm:text-base font-serif text-white italic leading-relaxed mb-4">
                      &ldquo;{q.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                      {q.attribution}
                    </span>

                    <button
                      onClick={() => handleCopyQuote(q)}
                      className="px-2.5 py-1 rounded bg-[#11151D] hover:bg-white/10 text-[11px] text-[#A6ADBB] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedQuoteId === q.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ACCOUNT & PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl glass-panel rounded-2xl p-8 border border-white/10 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-white/10">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#168BFF]/20 text-[#168BFF] border-2 border-[#168BFF]/40 flex items-center justify-center text-xl font-bold font-mono">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-white font-heading">{user.displayName}</h3>
              <p className="text-xs text-[#A6ADBB] font-mono">{user.email}</p>
              {user.isAdmin && (
                <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Administrator Rights Active
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[#A6ADBB] block text-[11px]">User Account ID</span>
              <p className="font-mono text-white mt-0.5 break-all">{user.uid}</p>
            </div>
            <div>
              <span className="text-[#A6ADBB] block text-[11px]">Primary Contact Support</span>
              <p className="text-white mt-0.5">Telephone: 8610196055 • Email: dhanushnandhakumarr@gmail.com</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={onLogout}
              className="px-5 py-2.5 rounded-xl bg-red-950/40 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-900/50 cursor-pointer"
            >
              Sign Out of Session
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-red-500/40 text-left space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-white font-heading">Cancel Appointment</h3>
            </div>

            <p className="text-xs text-[#A6ADBB] leading-relaxed">
              Are you sure you want to cancel your session for <strong>{cancelModalBooking.title}</strong> on{' '}
              <strong className="text-white">{cancelModalBooking.date} at {cancelModalBooking.timeSlot}</strong>?
            </p>

            <div className="p-3 rounded-lg bg-[#07090D] border border-white/10 text-[11px] text-[#A6ADBB]">
              Notice policy: cancellations require at least {adminConfig.cancellationNoticeHours} hours notice.
            </div>

            {cancelError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/30 text-xs text-red-200">
                {cancelError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Reason for Cancellation (Optional)
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict or resolved internally"
                className="w-full px-3 py-2 rounded-xl bg-[#07090D] border border-white/10 text-xs text-white placeholder-[#A6ADBB]/40 focus:border-red-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 text-xs font-medium text-[#A6ADBB] hover:text-white cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
