import React from 'react';
import { MessageSquare, Search, GitCompare, Compass, ArrowRight, Calendar } from 'lucide-react';

interface HowItWorksSectionProps {
  onStartConsultation: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onStartConsultation
}) => {
  const steps = [
    {
      number: '01',
      title: 'Tell Us',
      subtitle: 'Explain your challenge',
      description:
        'Share your business bottleneck, career decision, or complex personal choice without filtering. You outline the context and what success looks like.',
      icon: MessageSquare,
      accent: 'border-[#168BFF]/40 text-[#168BFF]'
    },
    {
      number: '02',
      title: 'Understand',
      subtitle: 'Clarify the actual issue',
      description:
        'We deconstruct the situation using first-principles thinking to isolate the core constraint from surface symptoms and emotional noise.',
      icon: Search,
      accent: 'border-[#D4AF37]/50 text-[#D4AF37]'
    },
    {
      number: '03',
      title: 'Explore',
      subtitle: 'Compare possible solutions',
      description:
        'We map out divergent paths, scoring each across upside, downside risk, resource cost, and second-order consequences.',
      icon: GitCompare,
      accent: 'border-[#168BFF]/40 text-[#168BFF]'
    },
    {
      number: '04',
      title: 'Move Forward',
      subtitle: 'Define practical next steps',
      description:
        'You walk away with an unambiguous, sequenced protocol: exactly what to do first, what to ignore, and how to verify progress.',
      icon: Compass,
      accent: 'border-[#D4AF37]/50 text-[#D4AF37]'
    }
  ];

  return (
    <section id="how-it-works-section" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#07090D] border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11151D] border border-[#D4AF37]/30 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Advisory Framework
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
            How We Bring <span className="gold-gradient-text">Structure to Chaos</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A6ADBB] leading-relaxed">
            A battle-tested 4-step sequence designed to take you from confusing ambiguity to calm, decisive action.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="glass-panel rounded-2xl p-6 sm:p-7 relative border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black font-heading text-white/30 group-hover:text-[#D4AF37] transition-colors">
                      {step.number}
                    </span>
                    <div className={`w-12 h-12 rounded-xl bg-[#11151D] border ${step.accent} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold text-white font-heading mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#D4AF37] mb-4">
                    {step.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-[#A6ADBB] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom decorative line */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A6ADBB] font-mono">
                  <span>Phase {idx + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#168BFF] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="text-center">
          <button
            onClick={onStartConsultation}
            className="px-8 py-4 rounded-xl text-xs sm:text-sm font-bold text-[#07090D] bg-gradient-to-r from-[#F7F8FC] via-[#FFF5DB] to-[#D4AF37] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/25 inline-flex items-center gap-3 cursor-pointer"
            aria-label="Start Your Consultation"
          >
            <Calendar className="w-4 h-4 text-[#07090D]" />
            <span>Start Your Consultation</span>
          </button>
        </div>

      </div>
    </section>
  );
};
