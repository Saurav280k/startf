import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Check, ShieldCheck, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

const SlideToPay = ({ onConfirm, disabled = false, amount = 0, isSubmitting = false }) => {
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);
  const startXRef = useRef(0);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch (e) {
      // fallback if canvas-confetti is not loaded
    }
  };

  const handleTouchStart = (e) => {
    if (disabled || isCompleted || isSubmitting) return;
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isCompleted || disabled) return;
    const track = trackRef.current;
    if (!track) return;

    const trackWidth = track.clientWidth - 56; // thumb width ~56px
    const currentX = e.touches[0].clientX;
    const deltaX = Math.max(0, Math.min(trackWidth, currentX - startXRef.current));
    const progress = deltaX / trackWidth;
    setDragProgress(progress);

    if (progress >= 0.92) {
      completePayment();
    }
  };

  const handleTouchEnd = () => {
    if (isCompleted) return;
    setIsDragging(false);
    if (dragProgress < 0.92) {
      setDragProgress(0); // spring back
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    if (disabled || isCompleted || isSubmitting) return;
    setIsDragging(true);
    startXRef.current = e.clientX;

    const onMouseMove = (moveEvent) => {
      const track = trackRef.current;
      if (!track) return;
      const trackWidth = track.clientWidth - 56;
      const deltaX = Math.max(0, Math.min(trackWidth, moveEvent.clientX - startXRef.current));
      const progress = deltaX / trackWidth;
      setDragProgress(progress);

      if (progress >= 0.92) {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        completePayment();
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      setIsDragging(false);
      setDragProgress((prev) => (prev >= 0.92 ? 1 : 0));
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const completePayment = () => {
    setIsCompleted(true);
    setDragProgress(1);
    setIsDragging(false);
    triggerCelebration();
    if (onConfirm) {
      setTimeout(() => {
        onConfirm();
      }, 500);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Slider Container */}
      <div
        ref={trackRef}
        className={`relative h-16 w-full rounded-3xl p-1.5 flex items-center select-none overflow-hidden transition-all duration-300 ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-obsidian-800'
            : isCompleted
            ? 'bg-emerald-600 shadow-xl shadow-emerald-600/30'
            : 'bg-slate-200/90 dark:bg-obsidian-850 border border-slate-300/80 dark:border-white/10 shadow-inner'
        }`}
      >
        {/* Dynamic sliding progress background */}
        <div
          className={`absolute inset-y-0 left-0 transition-colors duration-200 ${
            isCompleted ? 'bg-emerald-600' : 'bg-brand-600/20 dark:bg-brand-500/20'
          }`}
          style={{ width: `${Math.min(100, Math.max(12, dragProgress * 100))}%` }}
        />

        {/* Center label */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${
            isDragging ? 'opacity-40' : 'opacity-100'
          }`}
        >
          {isCompleted ? (
            <span className="flex items-center gap-2 text-white font-bold text-sm tracking-wide animate-pulse">
              <Check className="w-5 h-5" />
              Payment Recorded & Protection Activated
            </span>
          ) : isSubmitting ? (
            <span className="text-slate-500 text-sm font-semibold animate-pulse">
              Verifying Payment Details...
            </span>
          ) : (
            <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-brand-500" />
              Slide to Confirm ₹{amount.toLocaleString()}
            </span>
          )}
        </div>

        {/* Interactive Draggable Thumb */}
        <div
          id="slide-payment-thumb"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`relative z-10 h-13 w-13 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform ${
            isDragging ? 'scale-105' : 'transition-all duration-300'
          } ${
            isCompleted
              ? 'bg-white text-emerald-600 shadow-lg'
              : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 slider-thumb-pulse'
          }`}
          style={{
            transform: `translateX(${
              trackRef.current
                ? dragProgress * (trackRef.current.clientWidth - 56)
                : 0
            }px)`,
          }}
        >
          {isCompleted ? (
            <Check className="w-6 h-6 stroke-[3]" />
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-emerald-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          100% Safe Buyer Protection
        </span>
        <span>256-Bit SSL Encrypted</span>
      </div>
    </div>
  );
};

export default SlideToPay;
