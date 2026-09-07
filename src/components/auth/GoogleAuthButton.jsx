import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  import.meta.env.GOOGLE_CLIENT_ID ||
  '476772254070-dipbjkh4lv5i63ljsihme4knm3gdhnjc.apps.googleusercontent.com';

const GoogleAuthButton = ({ mode = 'signin' }) => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);
  const hiddenButtonRef = useRef(null);

  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      addToast({ message: 'No credential received from Google.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.googleAuth({
        credential: response.credential,
        clientId: GOOGLE_CLIENT_ID,
      });

      setAuth(res.user, res.token);
      addToast({
        message: `Welcome${res.user.username ? `, ${res.user.username}` : ''}! Successfully authenticated with Google.`,
        type: 'success',
      });
      navigate('/');
    } catch (err) {
      addToast({
        message: err.message || 'Google authentication failed. Please try again or use email sign-in.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if google GIS library is loaded
    const initGoogleGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Render official Google button inside hidden container if needed
          if (hiddenButtonRef.current) {
            window.google.accounts.id.renderButton(hiddenButtonRef.current, {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              shape: 'rectangular',
              text: mode === 'signup' ? 'signup_with' : 'signin_with',
              width: 380,
            });
          }
        } catch (e) {
          console.warn('Google GSI init warning:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogleGsi();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogleGsi();
          clearInterval(timer);
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [mode]);

  const handleCustomClick = () => {
    if (isLoading) return;

    if (window.google?.accounts?.id) {
      // Trigger prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If prompt was skipped or suppressed, click the rendered hidden button
          const actualBtn = hiddenButtonRef.current?.querySelector('div[role=button]');
          if (actualBtn) {
            actualBtn.click();
          } else {
            addToast({
              message: 'Google Sign-In prompt was dismissed. Click again to retry.',
              type: 'info',
            });
          }
        }
      });
    } else {
      addToast({
        message: 'Google Sign-In service is initializing. Please try again in a few seconds.',
        type: 'info',
      });
    }
  };

  const buttonText = mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google';

  return (
    <div className="w-full space-y-2">
      {/* Visual Branded Modern Teams Button */}
      <button
        type="button"
        id={`google-${mode}-btn`}
        onClick={handleCustomClick}
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-obsidian-850 hover:bg-slate-50 dark:hover:bg-obsidian-800 text-slate-800 dark:text-white font-bold text-xs sm:text-sm border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 group"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{isLoading ? 'Connecting to Google...' : buttonText}</span>
      </button>

      {/* Hidden container where GIS renders official iframe button as fallback trigger */}
      <div
        ref={hiddenButtonRef}
        id="google-hidden-btn-container"
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};

export default GoogleAuthButton;
