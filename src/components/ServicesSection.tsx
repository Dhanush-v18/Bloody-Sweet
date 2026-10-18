import React, { useState } from 'react';
import { CONSULTING_SERVICES } from '../data/services';
import { ConsultingService } from '../types';
import { 
  Briefcase, 
  Compass, 
  TrendingUp, 
  Layers, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Sparkles,
  Calendar
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForBooking: (categoryId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForBooking
}) => {
  const [activeModalService, setActiveModalService] = useState<ConsultingService | null>(null);

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <section id="services-section" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#07090D]">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#168BFF]/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11151D] border border-[#D4AF37]/30 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Our Expertise
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
            Consulting Disciplines Crafted for <span className="gold-gradient-text">Clarity</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A6ADBB] leading-relaxed">
            We reject vague generalities. Every engagement is rooted in first-principles thinking, 
            practical operational rigor, and actionable decision frameworks.
          </p>
        </div>

        {/* 5 Consulting Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CONSULTING_SERVICES.map((service, index) => {
            const isFeatured = index === 0 || index === 3;
            return (
              <div
                key={service.id}
                className={`group glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  isFeatured
                    ? 'border-[#D4AF37]/40 hover:border-[#D4AF37] hover:shadow-[#D4AF37]/10'
                    : 'border-white/10 hover:border-[#168BFF]/50 hover:shadow-[#168BFF]/10'
                }`}
              >
                <div>
                  {/* Top Bar & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-white/10 group-hover:border-[#D4AF37]/50 flex items-center justify-center transition-colors">
                      {renderIcon(service.icon, 'w-6 h-6 text-[#D4AF37] group-hover:text-[#168BFF] transition-colors')}
                    </div>
                    <span className="text-xs font-mono text-[#A6ADBB] tracking-wider uppercase">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-white font-heading mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs font-medium text-[#168BFF] mb-3">
                    {service.subtitle}
                  </p>
                  <p className="text-xs text-[#A6ADBB] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Key focus bullet points */}
                  <ul className="space-y-2 mb-6 border-t border-white/5 pt-4">
                    {service.bulletPoints.slice(0, 3).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#F7F8FC]/80 leading-normal">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Disclaimer for Personal Decision Service */}
                  {service.disclaimer && (
                    <div className="p-2.5 rounded-lg bg-[#11151D]/80 border border-white/10 mb-6 flex items-start gap-2 text-[11px] text-[#A6ADBB] leading-tight">
                      <Info className="w-3.5 h-3.5 text-[#168BFF] shrink-0 mt-0.5" />
                      <span>{service.disclaimer}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
                  <button
                    onClick={() => onSelectServiceForBooking(service.id)}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-[#07090D] bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#D4AF37]/15"
                    aria-label={service.ctaText}
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#07090D]" />
                    <span>{service.ctaText}</span>
                  </button>

                  <button
                    onClick={() => setActiveModalService(service)}
                    className="w-full py-2 text-center text-xs text-[#A6ADBB] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>View Methodology & Details</span>
                    <ArrowRight className="w-3 h-3 text-[#168BFF]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Service Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="glass-panel max-w-2xl w-full rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl relative my-8 text-left max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#D4AF37]/40 flex items-center justify-center">
                  {renderIcon(activeModalService.icon, 'w-6 h-6 text-[#D4AF37]')}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                    {activeModalService.title}
                  </h3>
                  <p className="text-xs text-[#168BFF]">{activeModalService.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalService(null)}
                className="text-[#A6ADBB] hover:text-white p-2 text-xl cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Description & Tagline */}
            <div className="mb-6 p-4 rounded-xl bg-[#11151D] border border-white/10">
              <p className="text-sm italic font-serif text-[#D4AF37] mb-2">
                &ldquo;{activeModalService.tagline}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-[#A6ADBB] leading-relaxed">
                {activeModalService.description}
              </p>
            </div>

            {/* Structured 5-Step Approach / Framework */}
            <div className="mb-6">
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] mb-3">
                Structured Advisory Protocol
              </h4>
              <div className="space-y-2">
                {activeModalService.approach.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#07090D] border border-white/10 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#168BFF]/20 text-[#168BFF] text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-[#F7F8FC] leading-normal">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Deliverable */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#11151D] to-[#07090D] border border-[#D4AF37]/30">
              <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Tangible Session Outcome
              </h4>
              <p className="text-xs sm:text-sm text-[#A6ADBB]">
                {activeModalService.expectedOutcome}
              </p>
            </div>

            {/* Disclaimer if present */}
            {activeModalService.disclaimer && (
              <div className="mb-6 p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs text-[#A6ADBB] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#168BFF] shrink-0 mt-0.5" />
                <span>{activeModalService.disclaimer}</span>
              </div>
            )}

            {/* Modal Bottom CTA */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveModalService(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#A6ADBB] hover:text-white cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const catId = activeModalService.id;
                  setActiveModalService(null);
                  onSelectServiceForBooking(catId);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#07090D] bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 cursor-pointer shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{activeModalService.ctaText}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
