import React, { useState } from 'react';
import { AdminAvailabilityConfig, UserProfile } from '../types';
import { saveAdminConfig } from '../services/storageService';
import { ShieldCheck, Plus, Trash2, CheckCircle2, Clock, Calendar, AlertTriangle } from 'lucide-react';

interface AdminSettingsModalProps {
  user: UserProfile;
  initialConfig: AdminAvailabilityConfig;
  onClose: () => void;
  onSave: (config: AdminAvailabilityConfig) => void;
}

const DAYS_OF_WEEK = [
  { id: 0, label: 'Sun' },
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' }
];

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  user,
  initialConfig,
  onClose,
  onSave
}) => {
  const [workingDays, setWorkingDays] = useState<number[]>(initialConfig.workingDays);
  const [startHour, setStartHour] = useState<number>(initialConfig.startHour);
  const [endHour, setEndHour] = useState<number>(initialConfig.endHour);
  const [slotDuration, setSlotDuration] = useState<number>(initialConfig.slotDurationMinutes);
  const [bufferTime, setBufferTime] = useState<number>(initialConfig.bufferTimeMinutes);
  const [timezone, setTimezone] = useState<string>(initialConfig.timezone);
  const [cancellationNoticeHours, setCancellationNoticeHours] = useState<number>(
    initialConfig.cancellationNoticeHours
  );

  const [blockedDates, setBlockedDates] = useState<string[]>(initialConfig.blockedDates || []);
  const [newBlockedDate, setNewBlockedDate] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Guard: if not admin
  if (!user.isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
        <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-red-500/40 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-white font-heading">Access Denied</h3>
          <p className="text-xs text-[#A6ADBB]">
            Administrator privileges are restricted to Dhanush Nandhakumar (dhanushnandhakumarr@gmail.com).
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#11151D] text-xs text-white border border-white/10 hover:border-white/20"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const toggleDay = (dayId: number) => {
    if (workingDays.includes(dayId)) {
      if (workingDays.length === 1) return; // Keep at least 1 day
      setWorkingDays(workingDays.filter((d) => d !== dayId));
    } else {
      setWorkingDays([...workingDays, dayId].sort((a, b) => a - b));
    }
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    if (!blockedDates.includes(newBlockedDate)) {
      setBlockedDates([...blockedDates, newBlockedDate]);
      setNewBlockedDate('');
    }
  };

  const handleRemoveBlockedDate = (dateToRemove: string) => {
    setBlockedDates(blockedDates.filter((d) => d !== dateToRemove));
  };

  const handleSave = () => {
    const updated: AdminAvailabilityConfig = {
      workingDays,
      startHour: Number(startHour),
      endHour: Number(endHour),
      slotDurationMinutes: Number(slotDuration),
      bufferTimeMinutes: Number(bufferTime),
      blockedDates,
      timezone: timezone.trim() || 'Asia/Kolkata',
      cancellationNoticeHours: Number(cancellationNoticeHours)
    };

    saveAdminConfig(updated);
    onSave(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="glass-panel max-w-2xl w-full rounded-2xl border border-[#D4AF37]/40 shadow-2xl relative my-auto text-left overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#11151D] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Admin Availability & Calendar Protocol
              </h3>
              <p className="text-[11px] text-[#A6ADBB]">
                Authorized Admin: {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#A6ADBB] hover:text-white p-2 text-lg cursor-pointer"
            aria-label="Close admin modal"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Availability settings saved successfully! Calendar slots updated.</span>
            </div>
          )}

          {/* Working Days */}
          <div>
            <label className="block font-semibold text-white mb-2">
              Configured Working Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const active = workingDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`px-4 py-2 rounded-xl font-bold font-mono transition-all cursor-pointer border ${
                      active
                        ? 'bg-[#D4AF37] text-[#07090D] border-[#D4AF37] shadow-sm'
                        : 'bg-[#07090D] text-[#A6ADBB] border-white/10 hover:border-white/20'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Working Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-white mb-1.5">
                Daily Start Hour (24h format)
              </label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#07090D] border border-white/10 text-white focus:border-[#D4AF37]"
              >
                {[7, 8, 9, 10, 11, 12].map((h) => (
                  <option key={h} value={h} className="bg-[#11151D]">
                    {h.toString().padStart(2, '0')}:00 ({h > 12 ? `${h - 12} PM` : `${h} AM`})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-white mb-1.5">
                Daily End Hour (24h format)
              </label>
              <select
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#07090D] border border-white/10 text-white focus:border-[#D4AF37]"
              >
                {[15, 16, 17, 18, 19, 20, 21].map((h) => (
                  <option key={h} value={h} className="bg-[#11151D]">
                    {h.toString().padStart(2, '0')}:00 ({h > 12 ? `${h - 12} PM` : `${h} AM`})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slot Duration & Buffer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-white mb-1.5">
                Consultation Slot Duration
              </label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#07090D] border border-white/10 text-white focus:border-[#D4AF37]"
              >
                <option value={20} className="bg-[#11151D]">20 Minutes</option>
                <option value={30} className="bg-[#11151D]">30 Minutes (Default)</option>
                <option value={45} className="bg-[#11151D]">45 Minutes</option>
                <option value={60} className="bg-[#11151D]">60 Minutes</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-white mb-1.5">
                Buffer Time Between Sessions
              </label>
              <select
                value={bufferTime}
                onChange={(e) => setBufferTime(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#07090D] border border-white/10 text-white focus:border-[#D4AF37]"
              >
                <option value={0} className="bg-[#11151D]">0 Minutes</option>
                <option value={10} className="bg-[#11151D]">10 Minutes</option>
                <option value={15} className="bg-[#11151D]">15 Minutes (Default)</option>
                <option value={30} className="bg-[#11151D]">30 Minutes</option>
              </select>
            </div>
          </div>

          {/* Timezone & Cancellation Policy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-white mb-1.5">
                Consulting Time Zone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="Asia/Kolkata"
                className="w-full px-3 py-2 rounded-xl bg-[#07090D] border border-white/10 text-white focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-semibold text-white mb-1.5">
                Cancellation Notice Window (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={168}
                value={cancellationNoticeHours}
                onChange={(e) => setCancellationNoticeHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#07090D] border border-white/10 text-white focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Blocked Dates & Holidays */}
          <div>
            <label className="block font-semibold text-white mb-1.5">
              Blocked Dates / Leave Days (No slots will be offered)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#07090D] border border-white/10 text-white focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={handleAddBlockedDate}
                disabled={!newBlockedDate}
                className="px-4 py-2 rounded-xl bg-[#11151D] border border-white/20 hover:border-[#D4AF37] text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Add Date</span>
              </button>
            </div>

            {blockedDates.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {blockedDates.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 font-mono"
                  >
                    <span>{d}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlockedDate(d)}
                      className="hover:text-white cursor-pointer ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-[#A6ADBB] italic">No dates currently blocked.</p>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#11151D] border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#A6ADBB] hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#07090D] bg-[#D4AF37] hover:brightness-110 cursor-pointer shadow-md shadow-[#D4AF37]/20"
          >
            Save Availability Settings
          </button>
        </div>

      </div>
    </div>
  );
};
