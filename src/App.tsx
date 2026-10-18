import React, { useState, useEffect } from 'react';
import { UserProfile, Booking, AdminAvailabilityConfig, ConsultingCategoryId } from './types';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { DailyQuotesSection } from './components/DailyQuotesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AboutUsSection } from './components/AboutUsSection';
import { ContactSection } from './components/ContactSection';
import { Dashboard } from './components/Dashboard';
import { BookingFlow } from './components/BookingFlow';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { Footer } from './components/Footer';

import {
  isFirebaseConfigured,
  subscribeToAuth,
  logoutUser,
  ADMIN_EMAIL
} from './services/firebase';
import {
  getUserBookings,
  getAdminConfig,
  getSavedQuoteIds,
  toggleSaveQuote
} from './services/storageService';

const USER_SESSION_KEY = 'bloody_sweet_active_user_v1';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    // Check URL parameters for autostart or demo query (Ultra Mode requirement)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' || params.get('demo') === 'admin') {
        return {
          uid: 'admin-dhanush-01',
          email: ADMIN_EMAIL,
          displayName: 'Dhanush Nandhakumar',
          isAdmin: true
        };
      }
      if (params.get('demo') === 'client') {
        return {
          uid: 'client-user-01',
          email: 'client@example.com',
          displayName: 'Client Partner',
          isAdmin: false
        };
      }

      // Check stored session
      try {
        const stored = localStorage.getItem(USER_SESSION_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Error reading stored session', e);
      }
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState<ConsultingCategoryId>('business');
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const [adminConfig, setAdminConfig] = useState<AdminAvailabilityConfig>(getAdminConfig());
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [savedQuoteIds, setSavedQuoteIds] = useState<number[]>([]);

  // Subscribe to real Firebase auth if configured
  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = subscribeToAuth((user) => {
        if (user) {
          setCurrentUser(user);
          localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Sync bookings & quotes when user changes
  useEffect(() => {
    if (currentUser) {
      setUserBookings(getUserBookings(currentUser.email, currentUser.uid));
      setSavedQuoteIds(getSavedQuoteIds(currentUser.uid));
      setAdminConfig(getAdminConfig());
    } else {
      setUserBookings([]);
      setSavedQuoteIds([]);
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Could not store session', e);
    }
    setCurrentView('home');
  };

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem(USER_SESSION_KEY);
    setCurrentUser(null);
    setCurrentView('home');
    setBookingModalOpen(false);
    setAdminModalOpen(false);
  };

  const handleStartBooking = (categoryKey?: string) => {
    if (
      categoryKey &&
      ['business', 'personal', 'career', 'problem-solving', 'digital'].includes(categoryKey)
    ) {
      setPreselectedCategory(categoryKey as ConsultingCategoryId);
    } else {
      setPreselectedCategory('business');
    }
    setBookingModalOpen(true);
  };

  const handleBookingComplete = (newBooking: Booking) => {
    if (currentUser) {
      setUserBookings(getUserBookings(currentUser.email, currentUser.uid));
    }
  };

  const handleToggleQuote = (quoteId: number) => {
    if (!currentUser) return;
    const updated = toggleSaveQuote(currentUser.uid, quoteId);
    setSavedQuoteIds(updated);
  };

  const handleRefreshBookings = () => {
    if (currentUser) {
      setUserBookings(getUserBookings(currentUser.email, currentUser.uid));
    }
  };

  // 1. SIGNED-OUT VISITOR: Display dedicated full-screen login page first!
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. SIGNED-IN USER: Full application experience
  return (
    <div className="min-h-screen bg-[#07090D] text-[#F7F8FC] flex flex-col selection:bg-[#D4AF37]/30 selection:text-[#F7F8FC]">
      
      {/* Global Navigation */}
      <Navbar
        user={currentUser}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={handleLogout}
        onOpenAdminSettings={() => setAdminModalOpen(true)}
        onStartBooking={() => handleStartBooking()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection
              user={currentUser}
              onBookCategory={(cat) => handleStartBooking(cat)}
              onOpenGeneralBooking={() => handleStartBooking()}
              onExploreServices={() => {
                const el = document.getElementById('services-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('services');
              }}
            />

            <ServicesSection
              onSelectServiceForBooking={(catId) => handleStartBooking(catId)}
            />

            <DailyQuotesSection
              userId={currentUser.uid}
              savedQuoteIds={savedQuoteIds}
              onToggleSaveQuote={handleToggleQuote}
            />

            <HowItWorksSection
              onStartConsultation={() => handleStartBooking()}
            />

            <AboutUsSection
              onStartBooking={() => handleStartBooking()}
            />

            <ContactSection
              onStartBooking={() => handleStartBooking()}
            />
          </>
        )}

        {currentView === 'services' && (
          <div className="py-6">
            <ServicesSection
              onSelectServiceForBooking={(catId) => handleStartBooking(catId)}
            />
          </div>
        )}

        {currentView === 'quotes' && (
          <div className="py-6">
            <DailyQuotesSection
              userId={currentUser.uid}
              savedQuoteIds={savedQuoteIds}
              onToggleSaveQuote={handleToggleQuote}
            />
          </div>
        )}

        {currentView === 'how-it-works' && (
          <div className="py-6">
            <HowItWorksSection
              onStartConsultation={() => handleStartBooking()}
            />
          </div>
        )}

        {currentView === 'about' && (
          <div className="py-6">
            <AboutUsSection
              onStartBooking={() => handleStartBooking()}
            />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="py-6">
            <ContactSection
              onStartBooking={() => handleStartBooking()}
            />
          </div>
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            user={currentUser}
            bookings={userBookings}
            savedQuoteIds={savedQuoteIds}
            adminConfig={adminConfig}
            onRefreshBookings={handleRefreshBookings}
            onToggleSaveQuote={handleToggleQuote}
            onStartBooking={() => handleStartBooking()}
            onOpenAdminSettings={() => setAdminModalOpen(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Booking Flow Modal */}
      {bookingModalOpen && (
        <BookingFlow
          user={currentUser}
          initialCategory={preselectedCategory}
          onClose={() => setBookingModalOpen(false)}
          onBookingComplete={handleBookingComplete}
        />
      )}

      {/* Admin Availability Settings Modal */}
      {adminModalOpen && (
        <AdminSettingsModal
          user={currentUser}
          initialConfig={adminConfig}
          onClose={() => setAdminModalOpen(false)}
          onSave={(updatedConfig) => setAdminConfig(updatedConfig)}
        />
      )}

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartBooking={() => handleStartBooking()}
      />
    </div>
  );
}
