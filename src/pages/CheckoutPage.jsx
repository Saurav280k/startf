import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import QRCode from 'react-qr-code';
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
  ExternalLink,
  Smartphone,
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
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const { openConfirmation } = useModalStore();
  const checkoutStore = useCheckoutStore();
  const { currency, formatAmount } = useCurrencyStore();
  const { items: cartItems, clearCart, getTotal: getCartTotal } = useCartStore();

  const ADMIN_UPI =
    import.meta.env.ADMIN_UPI ||
    import.meta.env.VITE_ADMIN_UPI ||
    'gauravpushpa28@okaxis';

  // Require user to be logged in/signed up to complete purchase
  useEffect(() => {
    if (!isAuthenticated) {
      addToast({
        message: 'Please sign in or create an account to complete your purchase.',
        type: 'info',
      });
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, {
        replace: true,
      });
    }
  }, [isAuthenticated, location.pathname, location.search, navigate, addToast]);

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
    navigator.clipboard.writeText(ADMIN_UPI);
    setCopiedUpi(true);
    addToast({ message: `UPI ID (${ADMIN_UPI}) copied to clipboard!`, type: 'success' });
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

  // Dynamic UPI URL for QR generation using ADMIN_UPI environment variable and exact amount
  const upiAmount = Math.round(amount);
  const upiIntentString = `upi://pay?pa=${encodeURIComponent(ADMIN_UPI)}&pn=${encodeURIComponent(
    'Modern Teams'
  )}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent(`Order_${itemType}`)}`;

  const upiApps = [
    {
      id: 'gpay',
      name: 'Google Pay',
      scheme: `tez://upi/pay?pa=${encodeURIComponent(ADMIN_UPI)}&pn=${encodeURIComponent(
        'Modern Teams'
      )}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent('Modern Teams Order')}`,
      badge: 'GPay',
      borderClass: 'border-blue-500/30 hover:border-blue-500 bg-blue-500/5',
      icon: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      ),
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      scheme: `phonepe://pay?pa=${encodeURIComponent(ADMIN_UPI)}&pn=${encodeURIComponent(
        'Modern Teams'
      )}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent('Modern Teams Order')}`,
      badge: 'PhonePe',
      borderClass: 'border-purple-500/30 hover:border-purple-500 bg-purple-500/5',
      icon: (
        <div className="w-5 h-5 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-black text-[11px] shadow-sm shrink-0">
          पे
        </div>
      ),
    },
    {
      id: 'paytm',
      name: 'Paytm UPI',
      scheme: `paytmmp://pay?pa=${encodeURIComponent(ADMIN_UPI)}&pn=${encodeURIComponent(
        'Modern Teams'
      )}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent('Modern Teams Order')}`,
      badge: 'Paytm',
      borderClass: 'border-sky-500/30 hover:border-sky-500 bg-sky-500/5',
      icon: (
        <div className="w-5 h-5 rounded-md bg-[#002970] flex items-center justify-center text-[#00baf2] font-black text-[9px] shadow-sm shrink-0">
          Pay
        </div>
      ),
    },
    {
      id: 'bhim',
      name: 'BHIM UPI',
      scheme: `bhim://pay?pa=${encodeURIComponent(ADMIN_UPI)}&pn=${encodeURIComponent(
        'Modern Teams'
      )}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent('Modern Teams Order')}`,
      badge: 'BHIM',
      borderClass: 'border-orange-500/30 hover:border-orange-500 bg-orange-500/5',
      icon: (
        <div className="w-5 h-5 rounded-md bg-gradient-to-r from-orange-500 to-green-600 flex items-center justify-center text-white font-bold text-[8px] shadow-sm shrink-0">
          BHIM
        </div>
      ),
    },
    {
      id: 'any_upi',
      name: 'CRED / Other',
      scheme: `upi://pay?pa=${encodeURIComponent(ADMIN_UPI)}&pn=${encodeURIComponent(
        'Modern Teams'
      )}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent('Modern Teams Order')}`,
      badge: 'Any UPI',
      borderClass: 'border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5',
      icon: (
        <div className="w-5 h-5 rounded-md bg-slate-900 dark:bg-obsidian-800 text-emerald-400 flex items-center justify-center font-black text-[10px] shadow-sm shrink-0">
          UPI
        </div>
      ),
    },
  ];

  const handleOpenUpiApp = (scheme, appName) => {
    navigator.clipboard?.writeText(ADMIN_UPI);
    addToast({
      message: `Opening ${appName}... Pre-filled for ₹${upiAmount.toLocaleString('en-IN')}. If on PC, scan the QR code!`,
      type: 'info',
    });
    window.location.href = scheme;
  };

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

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Buyer Protection Guarantee</span>
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
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center gap-6">
                  {/* Dynamic Pure SVG QR Code */}
                  <div className="w-44 h-44 rounded-2xl bg-white p-3 shadow-md border border-slate-200 shrink-0 flex items-center justify-center">
                    <QRCode
                      value={upiIntentString}
                      size={160}
                      style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                      viewBox="0 0 160 160"
                    />
                  </div>

                  {/* UPI Details & Copy */}
                  <div className="space-y-3 flex-1 text-center sm:text-left min-w-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Amount to Pay</span>
                      <div className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
                        {formatAmount(amount)}
                      </div>
                      {currency === 'USD' && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          (UPI INR equivalent: ₹{upiAmount.toLocaleString('en-IN')})
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400">Admin UPI ID:</span>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-obsidian-850 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 select-all">
                          {ADMIN_UPI}
                        </span>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="p-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-colors cursor-pointer active:scale-95"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Scan with any UPI App or tap buttons below</span>
                    </div>
                  </div>
                </div>

                {/* 1-Click UPI Apps Section */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-brand-500" />
                      <span>Click to Pay Directly via UPI App:</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">Auto-fills ₹{upiAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {upiApps.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        id={`upi-app-btn-${app.id}`}
                        onClick={() => handleOpenUpiApp(app.scheme, app.name)}
                        className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer active:scale-95 text-slate-800 dark:text-slate-100 ${app.borderClass}`}
                      >
                        {app.icon}
                        <span className="text-xs font-bold truncate">{app.badge}</span>
                        <span className="text-[9px] text-slate-400 font-medium">1-Click Pay</span>
                      </button>
                    ))}
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
