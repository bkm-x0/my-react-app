import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Users } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'support@cyberstore.com',
      subtext: 'Reply within 24 hours'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) CYBER-TECH',
      subtext: '24/7 Support'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: 'Tech Hub, Silicon Valley',
      subtext: 'San Francisco, CA 94105'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: '24/7 Operations',
      subtext: 'Always available'
    }
  ];

  const faqs = [
    {
      question: 'What is the warranty period?',
      answer: 'All CyberStore products come with a standard 2-year warranty covering manufacturing defects and technical issues.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes! We ship to 50+ countries worldwide. Shipping costs and delivery times vary by location.'
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order in real-time through your account dashboard or using the tracking link sent to your email.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day money-back guarantee if you\'re not satisfied with your purchase, no questions asked.'
    },
    {
      question: 'Do you offer bulk discounts?',
      answer: 'Yes! Contact our sales team for custom pricing on bulk orders and enterprise solutions.'
    },
    {
      question: 'Are your products customizable?',
      answer: 'Many of our products can be customized. Contact us to discuss your specific requirements.'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-cyber-muted-blue/30">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-muted-pink/10 via-transparent to-cyber-muted-blue/10"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 leading-tight">
              <span className="text-cyber-muted-blue">GET IN</span>
              <span className="text-cyber-muted-pink"> TOUCH</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 font-rajdhani">
              Have questions? We'd love to hear from you. Get in touch with our support team.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="cyber-card text-center hover:scale-105 transition-transform">
                  <div className="flex justify-center mb-6">
                    <Icon className="h-12 w-12 text-cyber-muted-pink" />
                  </div>
                  <h3 className="text-xl font-orbitron font-bold mb-3 text-cyber-muted-blue">
                    {info.title}
                  </h3>
                  <p className="text-white font-semibold mb-2">{info.details}</p>
                  <p className="text-gray-400 text-sm">{info.subtext}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form and Map Section */}
      <div className="py-20 bg-cyber-dark/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="cyber-card">
              <div className="flex items-center mb-8">
                <MessageSquare className="h-8 w-8 text-cyber-muted-pink mr-3" />
                <h2 className="text-3xl font-orbitron font-bold text-cyber-muted-blue">SEND US A MESSAGE</h2>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✓</div>
                  <h3 className="text-2xl font-orbitron font-bold text-cyber-muted-green mb-3">
                    MESSAGE SENT!
                  </h3>
                  <p className="text-gray-300">
                    Thank you for your message. We'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-rajdhani font-semibold text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="cyber-input w-full"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-rajdhani font-semibold text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="cyber-input w-full"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-rajdhani font-semibold text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="cyber-input w-full"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-rajdhani font-semibold text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="cyber-input w-full"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-rajdhani font-semibold text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="cyber-input w-full resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="cyber-button w-full py-3 flex items-center justify-center text-lg"
                  >
                    SEND MESSAGE
                    <Send className="ml-2 h-5 w-5" />
                  </button>
                </form>
              )}
            </div>

            {/* Support Info */}
            <div className="space-y-8">
              <div className="cyber-card">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-cyber-muted-blue mr-3" />
                  <h3 className="text-2xl font-orbitron font-bold text-cyber-muted-blue">SUPPORT TEAM</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Our dedicated support team is ready to help you with any questions or concerns.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyber-muted-pink rounded-full mr-3"></span>
                    Technical Support
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyber-muted-pink rounded-full mr-3"></span>
                    Order Assistance
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyber-muted-pink rounded-full mr-3"></span>
                    Product Customization
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyber-muted-pink rounded-full mr-3"></span>
                    Bulk Order Quotes
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-cyber-muted-pink rounded-full mr-3"></span>
                    After-Sale Support
                  </li>
                </ul>
              </div>

              <div className="cyber-card">
                <div className="flex items-center mb-4">
                  <Clock className="h-8 w-8 text-cyber-muted-green mr-3" />
                  <h3 className="text-2xl font-orbitron font-bold text-cyber-muted-green">RESPONSE TIME</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <span className="font-semibold text-cyber-muted-green">Email:</span> Within 24 hours
                  </li>
                  <li>
                    <span className="font-semibold text-cyber-muted-green">Phone:</span> Immediate
                  </li>
                  <li>
                    <span className="font-semibold text-cyber-muted-green">Chat:</span> Within minutes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold mb-4">
              <span className="text-cyber-muted-blue">FREQUENTLY</span>
              <span className="text-cyber-muted-pink"> ASKED</span>
              <span className="text-cyber-muted-blue"> QUESTIONS</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details 
                key={index}
                className="cyber-card group cursor-pointer"
              >
                <summary className="flex items-center justify-between py-6 px-6 font-orbitron font-bold text-lg text-cyber-muted-blue hover:text-cyber-muted-pink transition-colors">
                  {faq.question}
                  <span className="text-cyber-muted-pink group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-300 border-t border-cyber-muted-blue/20">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-muted-blue/10 via-cyber-muted-purple/10 to-cyber-muted-pink/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="cyber-card bg-cyber-dark/80 backdrop-blur-sm">
              <h2 className="text-4xl font-orbitron font-bold mb-6">
                <span className="text-cyber-muted-blue">READY TO</span>
                <span className="text-cyber-muted-pink"> EXPLORE?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Return to our store and discover amazing products.
              </p>
              <a href="/products" className="cyber-button text-lg py-4 px-8 inline-block">
                BACK TO SHOP
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Animated grid overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>
    </div>
  );
};

export default Contact;
