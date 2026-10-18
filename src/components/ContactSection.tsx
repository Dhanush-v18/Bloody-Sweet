import React, { useState } from 'react';
import { Phone, Mail, Send, CheckCircle2, AlertCircle, Clock, Calendar, ArrowRight } from 'lucide-react';
import { CONSULTING_SERVICES } from '../data/services';
import { saveContactEnquiry } from '../services/storageService';

interface ContactSectionProps {
  onStartBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onStartBooking }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(CONSULTING_SERVICES[0].title);
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Please provide a message with at least 10 characters.');
      return;
    }

    setSubmitting(true);

    try {
      saveContactEnquiry({
        name: name.trim(),
        email: email.trim(),
        category,
        message: message.trim()
      });

      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setSubmitting(false);
      setErrorMessage(err.message || 'Failed to send message.');
    }
  };

  return (
    <section id="contact-section" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#07090D]">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11151D] border border-[#D4AF37]/30 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Direct Contact
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
            Get in Touch with <span className="gold-gradient-text">BLOODY SWEET</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A6ADBB] leading-relaxed">
            Have questions before booking? Call directly, send an email, or submit a consultation enquiry below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Direct Channels Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Phone Link */}
            <a
              href="tel:8610196055"
              className="glass-panel group rounded-2xl p-6 border border-white/10 hover:border-[#D4AF37] transition-all flex items-start gap-4 block cursor-pointer"
              aria-label="Call Us at 8610196055"
            >
              <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs uppercase font-semibold tracking-wider text-[#A6ADBB]">
                  Telephone Handler
                </span>
                <p className="text-xl font-bold font-mono text-white group-hover:text-[#D4AF37] transition-colors mt-0.5">
                  8610196055
                </p>
                <p className="text-xs text-[#A6ADBB] mt-1">
                  Click to launch telephone dialer on supported devices.
                </p>
              </div>
            </a>

            {/* Direct Email Link */}
            <a
              href="mailto:dhanushnandhakumarr@gmail.com"
              className="glass-panel group rounded-2xl p-6 border border-white/10 hover:border-[#168BFF] transition-all flex items-start gap-4 block cursor-pointer"
              aria-label="Email Us at dhanushnandhakumarr@gmail.com"
            >
              <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#168BFF]/30 flex items-center justify-center shrink-0 text-[#168BFF] group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs uppercase font-semibold tracking-wider text-[#A6ADBB]">
                  Direct Email
                </span>
                <p className="text-sm sm:text-base font-bold font-mono text-white group-hover:text-[#168BFF] transition-colors mt-0.5 break-all">
                  dhanushnandhakumarr@gmail.com
                </p>
                <p className="text-xs text-[#A6ADBB] mt-1">
                  Click to open default mail client.
                </p>
              </div>
            </a>

            {/* What happens next box */}
            <div className="p-6 rounded-2xl bg-[#11151D] border border-white/10 text-xs text-[#A6ADBB] space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                What happens after an enquiry?
              </h4>
              <p>
                1. We review your challenge details to ensure our expertise directly matches your needs.
              </p>
              <p>
                2. We reply within 24 business hours via email or telephone with feedback and a scheduling link.
              </p>
              <p>
                3. If your request is urgent, booking an available slot via the calendar ensures an instant confirmed appointment.
              </p>

              <button
                type="button"
                onClick={onStartBooking}
                className="mt-2 w-full py-2.5 rounded-xl text-xs font-bold text-[#07090D] bg-[#D4AF37] hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Jump Straight to Calendar Booking</span>
              </button>
            </div>
          </div>

          {/* Consultation Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-panel-glow rounded-3xl p-8 sm:p-10 border border-white/10 text-left">
              <h3 className="text-2xl font-bold text-white font-heading mb-2">
                Send a Consultation Enquiry
              </h3>
              <p className="text-xs sm:text-sm text-[#A6ADBB] mb-6">
                Fill out the form below and we will get back to you promptly.
              </p>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {submitted ? (
                <div className="p-8 rounded-2xl bg-[#11151D] border border-emerald-500/40 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white font-heading">Enquiry Received Successfully</h4>
                  <p className="text-xs text-[#A6ADBB] max-w-sm mx-auto">
                    Thank you. Your consultation enquiry has been recorded. Dhanush Nandhakumar will review your dossier and follow up at your provided email.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-[#07090D] border border-white/10 text-xs text-white placeholder-[#A6ADBB]/40 focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">
                      Your Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#07090D] border border-white/10 text-xs text-white placeholder-[#A6ADBB]/40 focus:border-[#D4AF37] focus:outline-none transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">
                      Consultation Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#07090D] border border-white/10 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    >
                      {CONSULTING_SERVICES.map((srv) => (
                        <option key={srv.id} value={srv.title} className="bg-[#11151D] text-white">
                          {srv.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">
                      Message / Topic Details <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe what you want to address or any scheduling preferences..."
                      className="w-full px-4 py-3 rounded-xl bg-[#07090D] border border-white/10 text-xs text-white placeholder-[#A6ADBB]/40 focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-[#07090D] bg-gradient-to-r from-[#F7F8FC] via-[#FFF5DB] to-[#D4AF37] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-[#07090D] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#07090D]" />
                        <span>Submit Consultation Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
