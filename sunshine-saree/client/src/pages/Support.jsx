import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPhone, FiMail, FiMapPin, FiClock, FiChevronDown, FiChevronUp, FiSend } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';

const Support = () => {
  const { user, isAuthenticated } = useAuth();

  // Ticket Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: 'Order Issue',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How do I track my order?',
      a: 'Simply enter your unique Order ID on our Track Order page to view the live status of your parcel from Sujangarh to your doorstep.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 7-day easy return or exchange policy from the date of delivery. Saree must be unworn, unwashed, and in its original packaging with tags intact.',
    },
    {
      q: 'Do you deliver outside Sujangarh?',
      a: 'Yes, we deliver pan-India! We work with premier courier services like Delhivery and BlueDart to ensure safe delivery across all states.',
    },
    {
      q: 'How long does delivery take?',
      a: 'It typically takes 1-2 business days to process and package your order. Shipping takes between 3-5 business days depending on your location.',
    },
    {
      q: 'Can I place bulk/wedding orders?',
      a: 'Absolutely! We specialize in bulk wedding sarees and customized gifting packages. Please call us directly at 6203569455 or email us for special pricing.',
    },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message, subject } = formData;
    if (!name || !email || !message || !subject) {
      return toast.error('Please fill in all required fields');
    }

    setLoading(true);
    try {
      const headers = {};
      if (isAuthenticated) {
        headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
      }
      await API.post('/support', formData, { headers });
      toast.success('Your support ticket has been raised. Our team will contact you shortly!');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        subject: 'Order Issue',
        message: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to raise ticket');
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Customer Support | Sunshine Saree</title>
      </Helmet>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-maroon to-maroon-dark text-white py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,23,0.1),transparent_35%)]"></div>
        <div className="max-w-2xl mx-auto px-4 relative z-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-playfair font-bold">We're Here to Help You 💬</h1>
          <p className="text-white/80 text-sm">Have any issues with your saree order, payments, or returns? Get in touch with our team.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact details & FAQ */}
          <div className="lg:col-span-7 space-y-10">
            {/* Contact Panel */}
            <div className="bg-[#FFF8F0] p-6 sm:p-8 rounded-2xl border border-maroon/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-playfair text-xl font-bold text-maroon">Direct Contact</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <FiPhone className="w-5 h-5 text-maroon" />
                  <a href="tel:+916203569455" className="hover:underline font-medium">+91 6203569455</a>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <FiMail className="w-5 h-5 text-maroon" />
                  <a href="mailto:A.amansingh0143@gmail.com" className="hover:underline font-medium">A.amansingh0143@gmail.com</a>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-playfair text-xl font-bold text-maroon">Store Location</h3>
                <div className="flex items-start space-x-3 text-sm text-gray-700">
                  <FiMapPin className="w-5 h-5 text-maroon mt-0.5" />
                  <span>Near Ashok Circle, Sujangarh, Rajasthan - 331507</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <FiClock className="w-5 h-5 text-maroon" />
                  <span>Monday – Saturday, 9 AM – 8 PM</span>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              <h3 className="font-playfair text-2xl font-bold text-gray-800">Frequently Asked Questions</h3>
              <div className="w-16 h-0.5 bg-golden mb-6"></div>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 font-bold text-sm text-gray-800 text-left hover:bg-maroon/5 hover:text-maroon transition-all"
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {openFaq === idx && (
                      <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-xs leading-relaxed text-gray-600">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Raise ticket Form */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-2xl border border-maroon/5 shadow-sm space-y-6 sticky top-24">
              <h3 className="font-playfair text-xl font-bold text-maroon">Raise a Support Ticket</h3>
              <p className="text-xs text-gray-500">Provide details about your query below and we will get back to you within 24 hours.</p>

              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Aman Singh"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. A.amansingh0143@gmail.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 6203569455"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject Category</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                  >
                    <option value="Order Issue">Order Issue</option>
                    <option value="Wrong Product">Wrong Product</option>
                    <option value="Delivery Delay">Delivery Delay</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Return/Refund">Return/Refund</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Describe Your Issue</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please write down order IDs and specify details..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-maroon hover:bg-maroon-dark text-white font-semibold rounded-xl text-sm transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:bg-gray-300 shadow-md"
                >
                  <FiSend />
                  <span>{loading ? 'Submitting query...' : 'Submit Support Ticket'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;
