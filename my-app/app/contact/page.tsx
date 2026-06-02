'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      info: '+212 6 12 34 56 78',
      link: 'tel:+212612345678',
    },
    {
      icon: Mail,
      title: 'Email',
      info: 'hello@lamsa.com',
      link: 'mailto:hello@lamsa.com',
    },
    {
      icon: MapPin,
      title: 'Address',
      info: 'Casablanca, Morocco',
      link: '#',
    },
    {
      icon: Clock,
      title: 'Hours',
      info: 'Mon - Sat: 9AM - 6PM',
      link: '#',
    },
  ];

  const faqItems = [
    {
      question: 'What is your return policy?',
      answer:
        'We offer a 30-day return policy on all items. Products must be in original condition with all tags attached.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Standard shipping within Morocco takes 2-5 business days. We offer free shipping on orders over 500 DH.',
    },
    {
      question: 'Do you offer international shipping?',
      answer:
        'Currently, we ship within Morocco. International shipping options are coming soon!',
    },
    {
      question: 'How can I track my order?',
      answer:
        'You will receive tracking information via WhatsApp and email once your order ships.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We currently offer Cash on Delivery (COD) for all orders within Morocco.',
    },
    {
      question: 'Can I customize my order?',
      answer:
        'For custom orders or special requests, please contact us via WhatsApp or email.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container-lamsa text-center">
          <h1 className="text-4xl font-light mb-4 tracking-tight">Get In Touch</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Reach out to our team anytime.
          </p>
        </div>
      </section>

      <div className="container-lamsa section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-light mb-8 tracking-tight">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="input-field h-32"
                  placeholder="Your message..."
                />
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>

              {submitted && (
                <p className="text-green-600 text-sm font-medium">
                  ✓ Message sent! We'll respond soon.
                </p>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-light mb-8 tracking-tight">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.link}
                    className="flex items-start gap-4 p-4 border border-gray-200 hover:border-black hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.info}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
              <h4 className="font-semibold mb-2">Quick Support</h4>
              <p className="text-sm text-gray-700 mb-4">
                Chat with us on WhatsApp for instant responses!
              </p>
              <a
                href="https://wa.me/212612345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 text-white px-6 py-3 hover:bg-green-600 transition-colors font-medium text-center block"
              >
                💬 Start WhatsApp Chat
              </a>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-light mb-6 tracking-tight">Visit Us</h2>
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.365906266848!2d-7.589842!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d28cad1e0001%3A0x1234567890!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2sus!4v1234567890123"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <h4 className="font-semibold mb-3">{item.question}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Connect */}
        <div className="bg-gray-50 p-12 rounded-lg text-center">
          <h2 className="text-2xl font-light mb-4 tracking-tight">Follow Us</h2>
          <p className="text-gray-600 mb-8">
            Stay updated with new collections, styling tips, and exclusive offers
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 hover:bg-black hover:text-white transition-colors rounded-full"
            >
              📷
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 hover:bg-black hover:text-white transition-colors rounded-full"
            >
              f
            </a>
            <a
              href="https://wa.me/212612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors rounded-full"
            >
              💬
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
