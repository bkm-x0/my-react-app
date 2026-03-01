import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Mail, Phone, MessageSquare, Send, CheckCircle } from 'lucide-react';
import useLangStore from './store/langStore';

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className="border border-zinc-800 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-800/50 transition-colors"
    >
      <span className="text-white font-medium pr-4">{faq.q}</span>
      <ChevronDown
        className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="px-4 pb-4 text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Support = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLangStore();

  const faqs = [
    { q: t('support.faq1q'), a: t('support.faq1a') },
    { q: t('support.faq2q'), a: t('support.faq2a') },
    { q: t('support.faq3q'), a: t('support.faq3a') },
    { q: t('support.faq4q'), a: t('support.faq4a') },
    { q: t('support.faq5q'), a: t('support.faq5a') },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
            <HelpCircle className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">{t('support.badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{t('support.title')}</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {t('support.subtitle')}
          </p>
        </motion.div>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          {[
            { icon: Mail, label: t('support.contactEmail'), value: 'support@cyberstore.example', color: 'text-orange-400' },
            { icon: Phone, label: t('support.contactPhone'), value: '+123 456 789', color: 'text-orange-400' },
            { icon: MessageSquare, label: t('support.contactChat'), value: t('support.chatAvailable'), color: 'text-orange-400' },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
              <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-2`} />
              <p className="text-white font-bold text-sm">{item.label}</p>
              <p className="text-zinc-400 text-sm">{item.value}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-5">{t('support.faqTitle')}</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  faq={faq}
                  isOpen={openFAQ === i}
                  onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              ))}
            </div>
          </motion.div>

          {/* Support Ticket Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-5">{t('support.ticketTitle')}</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-white font-bold text-lg">{t('support.ticketSuccess')}</p>
                  <p className="text-zinc-400 text-sm mt-1">{t('support.ticketSuccessDesc')}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-zinc-400 text-sm mb-1 block">{t('support.formName')}</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder={t('support.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-sm mb-1 block">{t('support.formEmail')}</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder={t('support.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-sm mb-1 block">{t('support.formSubject')}</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder={t('support.subjectPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-sm mb-1 block">{t('support.formMessage')}</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
                      placeholder={t('support.messagePlaceholder')}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />{' ' + t('support.submitTicket')}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Support;
