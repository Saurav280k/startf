import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

const ContactUsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast({ message: 'Please fill all contact fields.', type: 'error' });
      return;
    }
    setSubmitted(true);
    addToast({ message: 'Message sent! We will reply on WhatsApp/Email shortly.', type: 'success' });
  };

  const openWhatsApp = () => {
    const text = 'Hi Modern Teams Support, I have an inquiry.';
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
          Contact Us & WhatsApp Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Have any questions about account purchase, UPI payment, or internships? We are here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="md:col-span-5 space-y-4">
          <div
            onClick={openWhatsApp}
            className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  WhatsApp Direct Help
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Replies within 5 minutes
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click to chat directly with our team on WhatsApp for fastest resolution.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs text-slate-400 font-bold uppercase">Official Support Email</h4>
                <div className="text-sm font-bold text-slate-900 dark:text-white">support@modernteams.in</div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs text-slate-400 font-bold uppercase">Customer Helpline</h4>
                <div className="text-sm font-bold text-slate-900 dark:text-white">+91 98765 43210</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="md:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-obsidian-900 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Send Us a Message
            </h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Message Received!</h4>
                <p className="text-xs text-slate-500">
                  Our team will contact you on your provided email/phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">Your Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">Your Message / Query</label>
                  <textarea
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you today?"
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-850 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-brand-600/25 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
