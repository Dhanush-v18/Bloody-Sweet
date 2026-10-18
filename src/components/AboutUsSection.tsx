import React from 'react';
import { Target, Shield, HeartHandshake, Zap, Calendar, Users, Eye } from 'lucide-react';

interface AboutUsSectionProps {
  onStartBooking: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ onStartBooking }) => {
  const values = [
    {
      title: 'Our Mission',
      description:
        'To empower founders, professionals, and individuals with structured clarity so they make courageous, well-informed choices in high-friction environments.',
      icon: Target
    },
    {
      title: 'Consulting Philosophy',
      description:
        'Clarity over complexity. We strip away theoretical jargon, consulting buzzwords, and vanity metrics to reach the bedrock constraints.',
      icon: Eye
    },
    {
      title: 'First-Principles Approach',
      description:
        'We do not borrow analogies blindly. Every challenge is audited against fundamental economic, operational, and psychological truths.',
      icon: Zap
    },
    {
      title: 'Clear Communication',
      description:
        'No endless decks or evasive language. We communicate with directness, transparency, and actionable next steps.',
      icon: HeartHandshake
    }
  ];

  const whoWeServe = [
    'Entrepreneurs & Small-Business Owners navigating pivotal inflection points',
    'Businesses facing operational, strategic, or margin bottlenecks',
    'Students & Working Professionals crafting deliberate career trajectories',
    'Individuals making high-stakes personal life or relocation choices',
    'Teams and founders seeking pragmatic digital & technology selection'
  ];

  return (
    <section id="about-section" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#07090D]">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Manifesto Box */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11151D] border border-[#D4AF37]/30 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              About BLOODY SWEET
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-8">
            Life Gets Complicated. <span className="gold-gradient-text">We Make It Clear.</span>
          </h2>

          <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/30 text-left sm:text-center">
            <p className="text-lg sm:text-2xl text-white font-serif leading-relaxed italic">
              &ldquo;BLOODY SWEET exists to make complicated situations easier to understand. 
              We bring structure to difficult questions, help people and businesses explore their options, 
              and focus on practical next steps rather than unnecessary complexity.&rdquo;
            </p>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="glass-panel rounded-2xl p-8 border border-white/10 hover:border-[#D4AF37]/40 transition-all flex items-start gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading mb-2">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-[#A6ADBB] leading-relaxed">{v.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Who We Serve & CTA Banner */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-[#168BFF]/30 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-[#168BFF]" />
              <h3 className="text-lg font-bold text-white font-heading">Who We Partner With</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#A6ADBB] mb-4">
              Our structured problem-solving methodologies are tailored to distinct problem domains:
            </p>
            <ul className="space-y-2.5">
              {whoWeServe.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-[#F7F8FC]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-72 shrink-0 flex flex-col gap-3 text-center sm:text-left">
            <p className="text-xs text-[#A6ADBB]">
              Ready to untangle your situation and map your next move?
            </p>
            <button
              onClick={onStartBooking}
              className="w-full py-4 px-6 rounded-xl font-bold text-xs text-[#07090D] bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4 text-[#07090D]" />
              <span>Book a Consultation</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
