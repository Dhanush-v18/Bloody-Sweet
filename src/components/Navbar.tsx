import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  Mail,
  ChevronDown 
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onOpenAdminSettings: () => void;
  onStartBooking: (categoryKey?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentView,
  onNavigate,
  onLogout,
  onOpenAdminSettings,
  onStartBooking
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'quotes', label: 'Daily Quote' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'dashboard', label: 'My Dashboard' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D4AF37]/20 bg-[#07090D]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group text-left"
            aria-label="BLOODY SWEET Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#168BFF] via-[#11151D] to-[#D4AF37] p-0.5 shadow-md shadow-[#D4AF37]/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#07090D] rounded-[10px] flex items-center justify-center border border-[#D4AF37]/40">
                <span className="font-heading font-black text-sm text-[#D4AF37]">BS</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">
                BLOODY SWEET
              </span>
              <span className="text-[10px] text-[#A6ADBB] tracking-widest uppercase font-mono">
                Consulting
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    active
                      ? 'text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 shadow-sm'
                      : 'text-[#A6ADBB] hover:text-[#F7F8FC] hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Book Consultation Button */}
            <button
              onClick={() => onStartBooking()}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-[#07090D] bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#D4AF37]/20 cursor-pointer flex items-center gap-2"
              aria-label="Book a Consultation"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Consultation</span>
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#11151D] border border-white/10 hover:border-[#D4AF37]/40 transition-colors cursor-pointer text-left"
                aria-label="User Profile Menu"
                aria-expanded={profileDropdownOpen}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#168BFF]/20 text-[#168BFF] border border-[#168BFF]/40 flex items-center justify-center text-xs font-bold font-mono">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden md:flex flex-col text-xs leading-tight">
                  <span className="text-[#F7F8FC] font-medium max-w-[100px] truncate">
                    {user.displayName.split(' ')[0]}
                  </span>
                  {user.isAdmin && (
                    <span className="text-[9px] text-[#D4AF37] font-semibold tracking-wider uppercase">
                      Admin
                    </span>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#A6ADBB]" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#11151D] border border-[#D4AF37]/30 shadow-2xl p-2 z-50 text-left"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2.5 border-b border-white/10">
                    <p className="text-xs font-semibold text-[#F7F8FC] truncate">{user.displayName}</p>
                    <p className="text-[11px] text-[#A6ADBB] truncate">{user.email}</p>
                    {user.isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                        <ShieldCheck className="w-3 h-3" />
                        Administrator Access
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#A6ADBB] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#168BFF]" />
                      <span>User Dashboard</span>
                    </button>

                    {user.isAdmin && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAdminSettings();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        <span>Availability Settings</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer mt-1 border-t border-white/10"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onStartBooking()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#07090D] bg-[#D4AF37] cursor-pointer"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#11151D] text-[#F7F8FC] border border-white/10 cursor-pointer"
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#D4AF37]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#D4AF37]/20 bg-[#07090D]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2">
          {/* User info banner */}
          <div className="p-3 rounded-xl bg-[#11151D] border border-white/10 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#168BFF]/20 text-[#168BFF] flex items-center justify-center font-bold text-xs">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white">{user.displayName}</span>
                <span className="text-[10px] text-[#A6ADBB]">{user.email}</span>
              </div>
            </div>
            {user.isAdmin && (
              <span className="text-[9px] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                Admin
              </span>
            )}
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentView === item.id
                  ? 'text-[#D4AF37] bg-[#D4AF37]/10 font-bold border border-[#D4AF37]/30'
                  : 'text-[#A6ADBB] hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}

          {user.isAdmin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminSettings();
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Availability Settings</span>
            </button>
          )}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartBooking();
              }}
              className="w-full py-3 rounded-xl font-bold text-xs text-[#07090D] bg-gradient-to-r from-[#D4AF37] to-[#AA820A] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Consultation</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-medium text-red-400 bg-red-950/30 border border-red-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
