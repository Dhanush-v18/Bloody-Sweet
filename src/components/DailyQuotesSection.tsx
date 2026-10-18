import React, { useState, useMemo } from 'react';
import { Quote } from '../types';
import { BLOODY_SWEET_QUOTES } from '../data/quotes';
import { getDeterministicDailyQuoteIndex } from '../utils/bookingLogic';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Shuffle, 
  ArrowRight,
  Filter
} from 'lucide-react';

interface DailyQuotesSectionProps {
  userId: string;
  savedQuoteIds: number[];
  onToggleSaveQuote: (quoteId: number) => void;
}

export const DailyQuotesSection: React.FC<DailyQuotesSectionProps> = ({
  userId,
  savedQuoteIds,
  onToggleSaveQuote
}) => {
  // Deterministic daily quote index for today
  const dailyIndex = useMemo(() => {
    return getDeterministicDailyQuoteIndex(new Date(), BLOODY_SWEET_QUOTES.length);
  }, []);

  const todayQuote = BLOODY_SWEET_QUOTES[dailyIndex];

  // Active browsed quote state (defaults to today's quote)
  const [activeQuote, setActiveQuote] = useState<Quote>(todayQuote);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(BLOODY_SWEET_QUOTES.map((q) => q.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredQuotes = useMemo(() => {
    if (selectedCategory === 'All') return BLOODY_SWEET_QUOTES;
    return BLOODY_SWEET_QUOTES.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  const isSaved = savedQuoteIds.includes(activeQuote.id);

  // Copy Quote Handler
  const handleCopyQuote = async () => {
    const textToCopy = `"${activeQuote.text}" — ${activeQuote.attribution} (Category: ${activeQuote.category})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  // Share Quote Handler
  const handleShareQuote = async () => {
    const shareData = {
      title: 'BLOODY SWEET Insight',
      text: `"${activeQuote.text}" — ${activeQuote.attribution}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareFeedback('Shared successfully');
        setTimeout(() => setShareFeedback(null), 2000);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyQuote();
        }
      }
    } else {
      // Fallback to clipboard
      handleCopyQuote();
      setShareFeedback('Link & Quote copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  // Random quote explorer
  const handleRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    setActiveQuote(filteredQuotes[randomIndex]);
  };

  return (
    <section id="daily-quote-section" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#07090D] overflow-hidden">
      {/* Background radial accent */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),rgba(7,9,13,0))]" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11151D] border border-[#D4AF37]/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Perspective Engine
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-3">
            Your Daily Dose of <span className="gold-gradient-text">Clarity</span>
          </h2>
          <p className="text-sm sm:text-base text-[#A6ADBB]">
            &ldquo;One fresh perspective can change the way you see a problem.&rdquo;
          </p>
        </div>

        {/* Featured Quote Card */}
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/35 shadow-2xl relative text-center backdrop-blur-2xl mb-12">
          
          {/* Top Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-semibold tracking-wide">
                {activeQuote.id === todayQuote.id ? "Today's Featured Insight" : "Vault Insight"}
              </span>
              <span className="text-[#A6ADBB] font-mono">
                Quote #{activeQuote.id}
              </span>
            </div>

            <span className="px-2.5 py-0.5 rounded bg-[#11151D] text-[#168BFF] border border-[#168BFF]/30 font-medium text-[11px]">
              {activeQuote.category}
            </span>
          </div>

          {/* Quote Body */}
          <div className="my-6 sm:my-8 px-2 sm:px-8">
            <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-white leading-relaxed tracking-wide">
              &ldquo;{activeQuote.text}&rdquo;
            </p>
          </div>

          {/* Attribution */}
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
              — {activeQuote.attribution}
            </span>
          </div>

          {/* Interactive Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-white/10">
            {/* Copy button */}
            <button
              onClick={handleCopyQuote}
              className="px-4 py-2.5 rounded-xl bg-[#11151D] hover:bg-[#1e2638] border border-white/10 hover:border-[#D4AF37]/50 text-xs font-semibold text-white transition-all flex items-center gap-2 cursor-pointer"
              aria-label="Copy quote to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#A6ADBB]" />
                  <span>Copy Quote</span>
                </>
              )}
            </button>

            {/* Share button */}
            <button
              onClick={handleShareQuote}
              className="px-4 py-2.5 rounded-xl bg-[#11151D] hover:bg-[#1e2638] border border-white/10 hover:border-[#168BFF]/50 text-xs font-semibold text-white transition-all flex items-center gap-2 cursor-pointer"
              aria-label="Share quote"
            >
              <Share2 className="w-4 h-4 text-[#168BFF]" />
              <span>Share Quote</span>
            </button>

            {/* Favorite Bookmark */}
            <button
              onClick={() => onToggleSaveQuote(activeQuote.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isSaved
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-[#11151D] hover:bg-[#1e2638] border-white/10 text-white'
              }`}
              aria-label="Save quote to favorites"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Saved in Favorites</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-[#A6ADBB]" />
                  <span>Save to Favorites</span>
                </>
              )}
            </button>

            {/* Random shuffle */}
            <button
              onClick={handleRandomQuote}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#11151D] to-[#1a202c] hover:border-[#D4AF37]/60 border border-white/15 text-xs font-semibold text-[#D4AF37] transition-all flex items-center gap-2 cursor-pointer ml-auto sm:ml-0"
              aria-label="Get another random quote"
            >
              <Shuffle className="w-4 h-4" />
              <span>Explore Another</span>
            </button>
          </div>

          {shareFeedback && (
            <p className="text-xs text-emerald-400 mt-3 font-mono">{shareFeedback}</p>
          )}
        </div>

        {/* Category Filter Drawer for 100+ Quotes Archive */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-white">Explore 100+ Original Insights by Theme</h3>
            </div>
            <button
              onClick={() => setActiveQuote(todayQuote)}
              className="text-xs text-[#168BFF] hover:underline cursor-pointer"
            >
              Return to Today&apos;s Featured Quote
            </button>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    const matching = cat === 'All' ? BLOODY_SWEET_QUOTES : BLOODY_SWEET_QUOTES.filter((q) => q.category === cat);
                    if (matching.length > 0) setActiveQuote(matching[0]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#D4AF37] text-[#07090D] font-bold'
                      : 'bg-[#07090D] text-[#A6ADBB] hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
