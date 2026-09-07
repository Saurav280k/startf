import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  ArrowLeft,
  Copy,
  Check,
  QrCode,
  ShoppingBag,
  Clock,
  ChevronRight,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { useModalStore } from '../store/useModalStore';
import { useCheckoutStore } from '../store/useCheckoutStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useCartStore } from '../store/useCartStore';

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const { openConfirmation } = useModalStore();
  const checkoutStore = useCheckoutStore();
  const { currency, formatAmount } = useCurrencyStore();
  const { items: cartItems, clearCart, getTotal: getCartTotal } = useCartStore();

  const rawItemType = searchParams.get('type');
  const itemId = searchParams.get('id');
  const isCart = rawItemType === 'cart' || (!itemId && cartItems.length > 0);
  const itemType = isCart ? 'cart' : rawItemType || 'account';
  const initialTransferEmail =
    searchParams.get('transferEmail') || user?.email || checkoutStore.transferDestinationEmail || '';
  const tierName = searchParams.get('tier') || '';

  // 2-Step Payment Gateway Flow: 'details' -> 'payment'
  const [step, setStep] = useState('details');

  // Form states initialized with persisted store values
  const [buyerEmail, setBuyerEmail] = useState(checkoutStore.buyerEmail || user?.email || '');
  const [buyerPhone, setBuyerPhone] = useState(checkoutStore.buyerPhone || user?.phone || '');
  const [transferDestinationEmail, setTransferDestinationEmail] = useState(initialTransferEmail);
  const [upiTransactionId, setUpiTransactionId] = useState(checkoutStore.upiTransactionId || '');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errors, setErrors] = useState({});

  // 10-Minute Countdown Timer (600 seconds)
  const [timerSeconds, setTimerSeconds] = useState(600);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Floating Order Items Drawer state
  const [isItemsDrawerOpen, setIsItemsDrawerOpen] = useState(false);

  const UPI_ID = 'gauravpushpa28@okaxis';

  // Fetch single item details if not a multi-item cart
  const { data: accountData, isLoading: accountLoading } = useQuery({
    queryKey: ['checkout-account', itemId],
    queryFn: () => api.getAccountById(itemId),
    enabled: itemType === 'account' && !isCart && !!itemId,
  });

  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: ['checkout-service', itemId],
    queryFn: () => api.getServiceById(itemId),
    enabled: itemType === 'service' && !isCart && !!itemId,
  });

  const account = accountData?.account;
  const service = serviceData?.service;

  let amount = 0;
  let itemTitle = '';
  let itemSubtitle = '';
  let itemsList = [];

  if (isCart) {
    amount = getCartTotal();
    itemTitle = `${cartItems.length} Cart Items`;
    itemSubtitle = cartItems.map((i) => i.title).slice(0, 2).join(', ') + (cartItems.length > 2 ? '...' : '');
    itemsList = cartItems.map((ci) => ({
      id: ci.id,
      title: ci.title,
      subtitle: ci.subtitle || ci.platform || (ci.type === 'account' ? 'Verified Account' : 'Digital Service'),
      price: ci.price,
      image: ci.image,
      type: ci.type,
    }));
  } else if (itemType === 'account' && account) {
    amount = account.price;
    itemTitle = account.title;
    itemSubtitle = `${account.platform} • ${account.handle}`;
    itemsList = [
      {
        id: account._id,
        title: account.title,
        subtitle: `${account.platform} • ${account.handle}`,
        price: account.price,
        image: account.screenshots?.[0],
        type: 'account',
      },
    ];
  } else if (itemType === 'service' && service) {
    const selectedTier =
      service.pricingTiers?.find((t) => t.tierName.toLowerCase() === tierName.toLowerCase()) ||
      service.pricingTiers?.[0];
    amount = selectedTier?.price || 9999;
    itemTitle = service.title;
    itemSubtitle = `${service.category} • ${selectedTier?.tierName || 'Starter'} Tier`;
    itemsList = [
      {
        id: service._id,
        title: service.title,
        subtitle: `${service.category} • ${selectedTier?.tierName || 'Starter'} Tier`,
        price: amount,
        image: null,
        type: 'service',
      },
    ];
  }

  // Pre-fill user details if authenticated
  useEffect(() => {
    if (user) {
      if (!buyerEmail) setBuyerEmail(user.email);
      if (!buyerPhone && user.phone) setBuyerPhone(user.phone);
      if (!transferDestinationEmail) setTransferDestinationEmail(user.email);
    }
  }, [user]);

  // Persist form inputs to checkout store
  useEffect(() => {
    checkoutStore.setCheckoutData({
      buyerEmail,
      buyerPhone,
      transferDestinationEmail,
      upiTransactionId,
    });
  }, [buyerEmail, buyerPhone, transferDestinationEmail, upiTransactionId]);

  // 10-Minute Countdown Timer logic
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    addToast({ message: 'UPI ID copied to clipboard!', type: 'success' });
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleBackNavigation = () => {
    if (step === 'payment') {
      setStep('details');
      return;
    }

    if (buyerPhone.trim() || buyerEmail.trim()) {
      openConfirmation({
        title: 'Leave Checkout?',
        message: 'Your entered details will be saved. Do you want to return to the previous page?',
        confirmText: 'Yes, Go Back',
        cancelText: 'Stay on Page',
        type: 'info',
        onConfirm: () => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate(isCart ? '/cart' : itemType === 'account' ? `/accounts/${itemId}` : '/services');
          }
        },
      });
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(isCart ? '/cart' : itemType === 'account' ? `/accounts/${itemId}` : '/services');
      }
    }
  };

  const orderMutation = useMutation({
    mutationFn: api.createOrder,
    onSuccess: (res) => {
      if (isCart) {
        clearCart();
      }
      checkoutStore.clearCheckoutData();
      addToast({
        message: 'Payment recorded! Sent for admin approval.',
        type: 'success',
      });
      navigate(`/order-success/${res.order._id}`, { replace: true });
    },
    onError: (err) => {
      addToast({
        message: err.message || 'Payment submission failed. Please verify your details.',
        type: 'error',
      });
    },
  });

  const validateDetails = () => {
    const errs = {};
    if (!transferDestinationEmail || !/^\S+@\S+\.\S+$/.test(transferDestinationEmail)) {
      errs.transferDestinationEmail = 'Enter a valid delivery email';
    }
    if (!buyerEmail || !/^\S+@\S+\.\S+$/.test(buyerEmail)) {
      errs.buyerEmail = 'Enter a valid contact email';
    }
    if (!buyerPhone || buyerPhone.trim().length < 7) {
      errs.buyerPhone = 'Enter your phone or WhatsApp number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (!validateDetails()) {
      addToast({
        message: 'Please fill in all delivery and contact details.',
        type: 'error',
      });
      return;
    }
    setStep('payment');
    setTimerSeconds(600); // Start 10-minute timer
    setIsTimerActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!upiTransactionId || upiTransactionId.trim().length < 6) {
      setErrors((prev) => ({
        ...prev,
        upiTransactionId: 'Enter valid 12-digit UPI UTR / Transaction ID',
      }));
      addToast({
        message: 'Please enter the 12-digit UPI Transaction ID.',
        type: 'error',
      });
      return;
    }

    orderMutation.mutate({
      buyerEmail,
      buyerPhone,
      transferDestinationEmail,
      itemType,
      itemId: isCart ? undefined : itemId,
      tierName: isCart ? undefined : tierName,
      cartItems: isCart ? cartItems : undefined,
      upiTransactionId,
    });
  };

  const isLoading = !isCart && (accountLoading || serviceLoading);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="h-96 rounded-3xl shimmer-box" />
      </div>
    );
  }

  if (isCart && cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/accounts"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30"
        >
          <span>Explore Accounts</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    );
  }

  // Dynamic UPI URL for QR generation
  const upiIntentString = `upi://pay?pa=${UPI_ID}&pn=ModernTeams&am=${amount}&cu=INR&tn=Order_${itemType}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiIntentString)}`;

  return (
    <div className="relative min-h-[80vh] max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBackNavigation}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 'payment' ? 'Back to Details' : isCart ? 'Back to Cart' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Safe Buyer Protection</span>
        </div>
      </div>

      {/* Modern Payment Gateway Box */}
      <div className="rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Gateway Brand Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-obsidian-950 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-brand-600/20">
              ⚡
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Modern Teams Payment Gateway</span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Secure
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                {step === 'details' ? 'Step 1 of 2: Contact & Delivery' : 'Step 2 of 2: Instant UPI Payment'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Amount</span>
            <span className="text-base sm:text-lg font-black font-display text-brand-600 dark:text-brand-400">
              {formatAmount(amount)}
            </span>
          </div>
        </div>

        {/* STEP 1: DIRECT DELIVERY & ACCOUNT DETAILS */}
        {step === 'details' && (
          <form onSubmit={handleContinueToPayment} className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              {/* Delivery Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  Delivery Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500" />
                  <input
                    type="email"
                    id="checkout-transfer-email"
                    placeholder="Email for credentials / service delivery"
                    value={transferDestinationEmail}
                    onChange={(e) => {
                      setTransferDestinationEmail(e.target.value);
                      if (errors.transferDestinationEmail) setErrors({ ...errors, transferDestinationEmail: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.transferDestinationEmail ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
                      }`}
                  />
                </div>
                {errors.transferDestinationEmail && (
                  <p className="text-[11px] text-red-500">{errors.transferDestinationEmail}</p>
                )}
              </div>

              {/* Contact Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      id="checkout-buyer-email"
                      placeholder="Your primary email"
                      value={buyerEmail}
                      onChange={(e) => {
                        setBuyerEmail(e.target.value);
                        if (errors.buyerEmail) setErrors({ ...errors, buyerEmail: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.buyerEmail ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
                        }`}
                    />
                  </div>
                  {errors.buyerEmail && <p className="text-[11px] text-red-500">{errors.buyerEmail}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      id="checkout-buyer-phone"
                      placeholder="Your phone number"
                      value={buyerPhone}
                      onChange={(e) => {
                        setBuyerPhone(e.target.value);
                        if (errors.buyerPhone) setErrors({ ...errors, buyerPhone: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.buyerPhone ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
                        }`}
                    />
                  </div>
                  {errors.buyerPhone && <p className="text-[11px] text-red-500">{errors.buyerPhone}</p>}
                </div>
              </div>
            </div>

            {/* Quick Order Overview Pill */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                    {itemTitle}
                  </h4>
                  <p className="hidden sm:block text-[11px] text-slate-400 truncate">{itemSubtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsItemsDrawerOpen(true)}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View Items</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              id="checkout-continue-btn"
              className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Payment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: 10-MIN TIMER & UPI PAYMENT GATEWAY */}
        {step === 'payment' && (
          <form onSubmit={handlePaymentSubmit} className="p-6 sm:p-8 space-y-6">
            {/* 10-Minute Countdown Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-bold">Payment Session Active</span>
              </div>
              <div className="font-mono text-sm font-black flex items-center gap-1">
                <span>Expires in:</span>
                <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-white shadow-sm">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>

            {timerSeconds === 0 ? (
              <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Payment Session Expired</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  The 10-minute timer for this transaction expired. Please refresh the session to continue.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTimerSeconds(600);
                    setIsTimerActive(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
                >
                  Restart 10-Min Session
                </button>
              </div>
            ) : (
              <>
                {/* QR Code & UPI Details Card */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center gap-6">
                  {/* Dynamic QR Code */}
                  <div className="w-40 h-40 rounded-2xl bg-white p-2.5 shadow-md border border-slate-200 shrink-0 flex items-center justify-center">
                    <img src={qrCodeUrl} alt="UPI QR" className="w-full h-full object-contain" />
                  </div>

                  {/* UPI Details & Copy */}
                  <div className="space-y-3 flex-1 text-center sm:text-left min-w-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Amount to Pay</span>
                      <div className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                        {formatAmount(amount)}
                      </div>
                      {currency === 'USD' && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          (UPI INR equivalent: ₹{amount.toLocaleString('en-IN')})
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400">UPI ID:</span>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-obsidian-850 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 select-all">
                          {UPI_ID}
                        </span>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="p-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-colors cursor-pointer"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Supported: <span className="font-semibold text-slate-700 dark:text-slate-300">GPay, PhonePe, Paytm, CRED</span>
                    </div>
                  </div>
                </div>

                {/* Concise Transaction ID / UTR Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">
                    Transaction ID / UTR Number *
                  </label>
                  <div className="relative">
                    <QrCode className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500" />
                    <input
                      type="text"
                      id="checkout-utr-input"
                      maxLength={18}
                      placeholder="Enter 12-digit UTR or Reference number"
                      value={upiTransactionId}
                      onChange={(e) => {
                        setUpiTransactionId(e.target.value);
                        if (errors.upiTransactionId) setErrors({ ...errors, upiTransactionId: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.upiTransactionId ? 'border-red-500' : 'border-slate-200/80 dark:border-white/10'
                        }`}
                    />
                  </div>
                  {errors.upiTransactionId && (
                    <p className="text-[11px] text-red-500 font-medium">{errors.upiTransactionId}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    id="checkout-confirm-payment-btn"
                    disabled={orderMutation.isPending}
                    className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {orderMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Confirm & Submit Payment</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep('details')}
                      className="text-slate-500 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
                    >
                      Change delivery or contact details
                    </button>
                    <span className="font-mono text-[11px]">256-Bit SSL Encrypted</span>
                  </div>
                </div>
              </>
            )}
          </form>
        )}
      </div>

      {/* FLOATING RIGHT-MIDDLE BUTTON: VIEW ITEMS LIST ANYTIME */}
      <button
        type="button"
        id="floating-checkout-items-btn"
        onClick={() => setIsItemsDrawerOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-brand-600 hover:bg-brand-500 text-white rounded-l-2xl shadow-2xl p-3 flex flex-col items-center gap-1 cursor-pointer transition-transform hover:scale-105"
        title="View Items in Order"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px] font-black tracking-wider uppercase writing-vertical">
          {itemsList.length} Items
        </span>
      </button>

      {/* RIGHT-SIDE ORDER ITEMS DRAWER */}
      {isItemsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsItemsDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-white dark:bg-obsidian-950 h-full shadow-2xl border-l border-slate-200 dark:border-white/10 p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Order Summary</h3>
                    <p className="text-[11px] text-slate-400">{itemsList.length} item(s) selected</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsItemsDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-850 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {itemsList.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200/60 dark:border-white/5"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {item.type === 'account' ? 'ACC' : 'SVC'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                    </div>
                    <div className="text-xs font-bold font-display text-slate-900 dark:text-white shrink-0">
                      {formatAmount(item.price)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200/60 dark:border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatAmount(amount)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Buyer Protection</span>
                  <span className="font-bold text-emerald-500">FREE</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-baseline font-bold">
                  <span className="text-slate-900 dark:text-white">Total</span>
                  <span className="text-base font-black text-brand-600 dark:text-brand-400">
                    {formatAmount(amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Drawer CTA */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsItemsDrawerOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
              >
                Close & Return to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
