import React from 'react';
import { Phone, Mail, Sparkles, ArrowUp, Calendar } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onStartBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onStartBooking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#D4AF37]/20 bg-[#07090D] pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-xs text-[#A6ADBB]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#168BFF] via-[#11151D] to-[#D4AF37] p-0.5">
                <div className="w-full h-full bg-[#07090D] rounded-[10px] flex items-center justify-center border border-[#D4AF37]/40">
                  <span className="font-heading font-black text-xs text-[#D4AF37]">BS</span>
                </div>
              </div>
              <span className="font-heading font-extrabold text-lg tracking-wider text-white">
                BLOODY SWEET
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white font-medium">
              Life Gets Complicated. We Make It Clear.
            </p>

            <p className="text-xs text-[#A6ADBB] leading-relaxed max-w-sm">
              Helping entrepreneurs, executives, and individuals understand their challenges, 
              explore practical options, and make better-informed decisions.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="tel:8610196055"
                className="flex items-center gap-2 text-white hover:text-[#D4AF37] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-mono font-semibold">8610196055</span>
              </a>

              <a
                href="mailto:dhanushnandhakumarr@gmail.com"
                className="flex items-center gap-2 text-white hover:text-[#168BFF] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#168BFF]" />
                <span className="font-mono">dhanushnandhakumarr@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-heading mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  5 Consulting Disciplines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quotes')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Daily Dose of Clarity
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Consulting Disciplines */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-heading mb-4">
              Consulting
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-[#F7F8FC]">Business Strategy</span>
              </li>
              <li>
                <span className="text-[#F7F8FC]">Personal Decision Support</span>
              </li>
              <li>
                <span className="text-[#F7F8FC]">Career & Professional Growth</span>
              </li>
              <li>
                <span className="text-[#F7F8FC]">Problem-Solving Architecture</span>
              </li>
              <li>
                <span className="text-[#F7F8FC]">Digital & Technology Strategy</span>
              </li>
            </ul>
          </div>

          {/* Action & Back to Top */}
          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-heading mb-2">
              Book a Session
            </h4>
            <p className="text-xs text-[#A6ADBB]">
              Guaranteed calendar reservation with pre-session dossier review.
            </p>
            <button
              onClick={onStartBooking}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#07090D] bg-[#D4AF37] hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#D4AF37]/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Appointment</span>
            </button>

            <button
              onClick={scrollToTop}
              className="w-full py-2 rounded-xl bg-[#11151D] border border-white/10 hover:border-white/20 text-[#A6ADBB] hover:text-white text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A6ADBB]">
          <p>
            © {new Date().getFullYear()} BLOODY SWEET. All rights reserved.
          </p>

          <p className="text-center sm:text-right max-w-xl text-[10px] text-[#A6ADBB]/70">
            Advisory services provide structured thinking frameworks and objective decision modeling. 
            They do not constitute licensed medical, legal, financial, or psychological psychiatric therapy.
          </p>
        </div>
      </div>
    </footer>
  );
};
