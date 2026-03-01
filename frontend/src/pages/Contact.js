import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import useLangStore from './store/langStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

const inputClasses = 'w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-zinc-600';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const { t } = useLangStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    { icon: Mail, title: t('contact.infoEmail'), details: t('contact.infoEmailDetail'), subtext: t('contact.infoEmailSub') },
    { icon: Phone, title: t('contact.infoPhone'), details: t('contact.infoPhoneDetail'), subtext: t('contact.infoPhoneSub') },
    { icon: MapPin, title: t('contact.infoAddress'), details: t('contact.infoAddressDetail'), subtext: t('contact.infoAddressSub') },
    { icon: Clock, title: t('contact.infoHours'), details: t('contact.infoHoursDetail'), subtext: t('contact.infoHoursSub') }
  ];

  const faqs = [
    { question: t('contact.faq1q'), answer: t('contact.faq1a') },
    { question: t('contact.faq2q'), answer: t('contact.faq2a') },
    { question: t('contact.faq3q'), answer: t('contact.faq3a') },
    { question: t('contact.faq4q'), answer: t('contact.faq4a') },
    { question: t('contact.faq5q'), answer: t('contact.faq5a') },
    { question: t('contact.faq6q'), answer: t('contact.faq6a') }
  ];

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      {/* Hero */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white" initial="hidden" animate="visible" variants={fadeUp}>
            {t('contact.title') + ' '}<span className="text-orange-400">{t('contact.titleHighlight')}</span>
          </motion.h1>
          <motion.p className="text-lg text-zinc-400 max-w-2xl mx-auto" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div key={index} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center hover:border-zinc-700 transition-colors" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index}>
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-orange-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{info.title}</h3>
                <p className="text-white font-semibold text-sm mb-1">{info.details}</p>
                <p className="text-zinc-500 text-sm">{info.subtext}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Form & Support */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Form */}
            <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center mb-8">
                <MessageSquare className="h-6 w-6 text-orange-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">{t('contact.formTitle')}</h2>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-emerald-400 text-2xl">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">{t('contact.messageSent')}</h3>
                  <p className="text-zinc-400">{t('contact.messageSentDesc')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">{t('contact.formName')}</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder={t('contact.namePlaceholder')} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">{t('contact.formEmail')}</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} placeholder={t('contact.emailPlaceholder')} />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-zinc-400 mb-2">{t('contact.formPhone')}</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} placeholder={t('contact.phonePlaceholder')} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-zinc-400 mb-2">{t('contact.formSubject')}</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className={inputClasses} placeholder={t('contact.subjectPlaceholder')} />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-2">{t('contact.formMessage')}</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows="6" className={`${inputClasses} resize-none`} placeholder={t('contact.messagePlaceholder')} />
                  </div>
                  <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl py-3 flex items-center justify-center transition-colors">
                    {t('contact.sendMessage')}
                    <Send className="ml-2 h-5 w-5" />
                  </button>
                </form>
              )}
            </motion.div>

            {/* Support */}
            <div className="space-y-6">
              <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-orange-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">{t('contact.supportTeam')}</h3>
                </div>
                <p className="text-zinc-400 mb-4 text-sm">{t('contact.supportTeamDesc')}</p>
                <ul className="space-y-3 text-zinc-300 text-sm">
                  {[t('contact.technicalSupport'), t('contact.orderAssistance'), t('contact.productCustomization'), t('contact.bulkOrderQuotes'), t('contact.afterSaleSupport')].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-orange-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">{t('contact.responseTime')}</h3>
                </div>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li><span className="font-semibold text-orange-400">Email:</span> {t('contact.emailResponseTime')}</li>
                  <li><span className="font-semibold text-orange-400">Phone:</span> {t('contact.phoneResponseTime')}</li>
                  <li><span className="font-semibold text-orange-400">Chat:</span> {t('contact.chatResponseTime')}</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.h2 className="text-3xl font-bold text-center mb-12 text-white" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {t('contact.faqTitle') + ' '}<span className="text-orange-400">{t('contact.faqTitleHighlight')}</span>
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.details key={index} className="bg-zinc-900 border border-zinc-800 rounded-2xl group cursor-pointer" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index * 0.5}>
                <summary className="flex items-center justify-between py-5 px-6 font-semibold text-white hover:text-orange-400 transition-colors">
                  {faq.question}
                  <span className="text-orange-400 group-open:rotate-180 transition-transform text-sm">▼</span>
                </summary>
                <div className="px-6 pb-5 text-zinc-400 text-sm border-t border-zinc-800">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.div className="max-w-3xl mx-auto text-center bg-zinc-900 border border-zinc-800 rounded-2xl p-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl font-bold mb-4 text-white">
              {t('contact.ctaTitle') + ' '}<span className="text-orange-400">{t('contact.ctaTitleHighlight')}</span>
            </h2>
            <p className="text-zinc-400 mb-8">{t('contact.ctaDesc')}</p>
            <Link to="/products" className="bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl py-3 px-8 inline-block transition-colors">
              {t('contact.ctaBtn')}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
