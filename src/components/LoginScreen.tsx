import React, { useState } from 'react';
import { ThreeHeroScene } from './ThreeHeroScene';
import { loginWithGoogle, isFirebaseConfigured, ADMIN_EMAIL } from '../services/firebase';
import { UserProfile } from '../types';
import { Shield, Sparkles, ArrowRight, AlertCircle, Info, ExternalLink, CheckCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);

    if (!isFirebaseConfigured) {
      setLoading(false);
      setShowConfigModal(true);
      return;
    }

    try {
      const result = await loginWithGoogle();
      if (result.user) {
        onLoginSuccess(result.user);
      } else if (result.error) {
        if (result.error === 'FIREBASE_NOT_CONFIGURED') {
          setShowConfigModal(true);
        } else {
          setErrorMessage(result.error);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during Google sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsDemo = (role: 'client' | 'admin') => {
    if (role === 'admin') {
      onLoginSuccess({
        uid: 'admin-dhanush-01',
        email: ADMIN_EMAIL,
        displayName: 'Dhanush Nandhakumar',
        isAdmin: true
      });
    } else {
      onLoginSuccess({
        uid: 'client-user-01',
        email: 'client@example.com',
        displayName: 'Client Partner',
        isAdmin: false
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#07090D] overflow-hidden px-4 select-none">
      {/* 3D Cinematic Scene */}
      <ThreeHeroScene variant="login" />

      {/* Subtle background ambient gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.12),rgba(7,9,13,0))]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,rgba(22,139,255,0.08),rgba(7,9,13,0))]" />

      {/* Main Glass Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="glass-panel-glow rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden backdrop-blur-2xl shadow-2xl border border-[#D4AF37]/30">
          
          {/* Top Decorative Gold/Blue Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#168BFF] via-[#D4AF37] to-[#168BFF]" />

          {/* 3D Brand Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-[#11151D]/80 border border-[#D4AF37]/40 mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">
              BLOODY SWEET
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 font-heading">
            Welcome to <span className="gold-gradient-text">BLOODY SWEET</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-[#A6ADBB] mb-8 leading-relaxed">
            Better perspectives. Smarter decisions. Clearer outcomes.
          </p>

          {/* Error notice if present */}
          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs text-left flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Sign-in Notice</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-medium text-sm text-[#07090D] bg-gradient-to-r from-[#F7F8FC] via-[#FFF5DB] to-[#D4AF37] hover:brightness-105 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-60"
            aria-label="Continue with Google"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#07090D] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {/* Real Google G Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="font-semibold tracking-wide">Continue with Google</span>
              </>
            )}
          </button>

          {/* Additional text */}
          <p className="text-xs text-[#A6ADBB] mt-6 tracking-wide">
            Your next step toward clarity starts here.
          </p>

          {/* Transparent Preview & Firebase Status options */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs text-[#A6ADBB]">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                Auth Status:
              </span>
              <span className={isFirebaseConfigured ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                {isFirebaseConfigured ? 'Firebase Active' : 'Awaiting Firebase Keys'}
              </span>
            </div>

            {!isFirebaseConfigured && (
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(true)}
                  className="text-xs text-[#168BFF] hover:underline flex items-center justify-center gap-1 cursor-pointer py-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  View Firebase Setup Guide & Keys
                </button>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => handleContinueAsDemo('client')}
                    className="px-3 py-2 rounded-lg bg-[#11151D] border border-white/10 hover:border-[#168BFF]/50 text-xs text-[#F7F8FC] hover:text-[#168BFF] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Preview as Client</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContinueAsDemo('admin')}
                    className="px-3 py-2 rounded-lg bg-[#11151D] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs text-[#D4AF37] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Preview as Admin</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Firebase Credentials & Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-lg font-bold text-white font-heading">Firebase Authentication Setup</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-[#A6ADBB] hover:text-white text-xl p-1 cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-[#A6ADBB] mb-4 leading-relaxed">
              Google Login uses the real Firebase Auth SDK. To link your live Firebase Project, ensure the following environment variables are provided in your environment:
            </p>

            <div className="bg-[#07090D] p-3 rounded-lg border border-white/10 text-xs font-mono text-emerald-400 space-y-1 mb-4 overflow-x-auto">
              <p>VITE_FIREBASE_API_KEY=AIzaSy...</p>
              <p>VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com</p>
              <p>VITE_FIREBASE_PROJECT_ID=your-project-id</p>
              <p>VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com</p>
              <p>VITE_FIREBASE_MESSAGING_SENDER_ID=...</p>
              <p>VITE_FIREBASE_APP_ID=1:...:web:...</p>
            </div>

            <div className="text-xs text-[#A6ADBB] space-y-2 mb-6">
              <p className="font-semibold text-white">Required Firebase Console Steps:</p>
              <p>1. Open Firebase Console &gt; <strong>Authentication</strong> &gt; <strong>Sign-in method</strong> &gt; Enable <strong>Google</strong>.</p>
              <p>2. Under <strong>Settings &gt; Authorized domains</strong>, add current domain: <code className="text-[#D4AF37]">{window.location.hostname}</code></p>
              <p>3. Copy config values from <strong>Project Settings &gt; General &gt; Your apps</strong> into your project configuration.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setShowConfigModal(false);
                  handleContinueAsDemo('client');
                }}
                className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#07090D] font-semibold text-xs hover:brightness-110 cursor-pointer"
              >
                Continue in Guided Demo Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
