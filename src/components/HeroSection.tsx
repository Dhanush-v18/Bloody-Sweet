import React from 'react';
import { UserProfile } from '../types';
import { ThreeHeroScene } from './ThreeHeroScene';
import { Calendar, Compass, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  user: UserProfile;
  onBookCategory: (categoryId: 'business' | 'personal') => void;
  onOpenGeneralBooking: () => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  user,
  onBookCategory,
  onOpenGeneralBooking,
  onExploreServices
}) => {
  const firstName = user.displayName.split(' ')[0] || 'Friend';

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      {/* 3D Scene Background */}
      <ThreeHeroScene variant="hero" />

      {/* Cinematic radial gradient vignettes */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_40%,rgba(7,9,13,0.3)_0%,rgba(7,9,13,0.95)_100%)]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11151D]/90 border border-[#D4AF37]/35 shadow-lg shadow-black/50 mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">
            Life Gets Complicated. We Make It Clear.
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 font-heading leading-[1.1] max-w-4xl">
          Your Challenges Deserve <span className="gold-gradient-text">Better Solutions</span>.
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-xl text-[#A6ADBB] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Business decisions, career challenges, personal situations, or everyday problems. 
          Let&apos;s understand what matters, explore your options, and build a clearer path forward.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          <button
            onClick={onOpenGeneralBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wide text-[#07090D] bg-gradient-to-r from-[#F7F8FC] via-[#FFF5DB] to-[#D4AF37] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-2.5 cursor-pointer"
            aria-label="Book a Consultation"
          >
            <Calendar className="w-4 h-4 text-[#07090D]" />
            <span>Book a Consultation</span>
          </button>

          <button
            onClick={onExploreServices}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm tracking-wide text-[#F7F8FC] bg-[#11151D]/90 hover:bg-[#11151D] border border-white/15 hover:border-[#168BFF]/50 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
            aria-label="Explore Our Services"
          >
            <span>Explore Our Services</span>
            <ArrowRight className="w-4 h-4 text-[#168BFF]" />
          </button>
        </div>

        {/* Personalized Welcome Card with Quick Actions */}
        <div className="w-full max-w-3xl glass-panel-glow rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/30 text-left relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
                Personalized Advisory Portal
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
                Welcome back, <span className="gold-gradient-text">{firstName}</span>.
              </h2>
            </div>
            <p className="text-sm text-[#A6ADBB] max-w-xs sm:text-right">
              What would you like to make clearer today?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quick Action 1: Business Challenge */}
            <button
              onClick={() => onBookCategory('business')}
              className="group p-5 rounded-xl bg-[#07090D]/80 hover:bg-[#11151D] border border-white/10 hover:border-[#D4AF37]/60 transition-all duration-300 text-left flex items-start gap-4 cursor-pointer shadow-lg hover:shadow-[#D4AF37]/10"
              aria-label="I need help with a business challenge"
            >
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors flex items-center justify-between">
                  <span>I need help with a business challenge.</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#D4AF37]" />
                </h3>
                <p className="text-xs text-[#A6ADBB] mt-1 leading-normal">
                  Operations, strategy, market positioning, or scaling hurdles.
                </p>
              </div>
            </button>

            {/* Quick Action 2: Personal Decision */}
            <button
              onClick={() => onBookCategory('personal')}
              className="group p-5 rounded-xl bg-[#07090D]/80 hover:bg-[#11151D] border border-white/10 hover:border-[#168BFF]/60 transition-all duration-300 text-left flex items-start gap-4 cursor-pointer shadow-lg hover:shadow-[#168BFF]/10"
              aria-label="I need help with a personal decision"
            >
              <div className="w-10 h-10 rounded-lg bg-[#168BFF]/15 border border-[#168BFF]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5 text-[#168BFF]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white group-hover:text-[#168BFF] transition-colors flex items-center justify-between">
                  <span>I need help with a personal decision.</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#168BFF]" />
                </h3>
                <p className="text-xs text-[#A6ADBB] mt-1 leading-normal">
                  Competing priorities, life choices, or untangling complex crossroads.
                </p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
