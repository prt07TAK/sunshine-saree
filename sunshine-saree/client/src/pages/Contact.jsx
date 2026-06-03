import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    if (!name || !email || !message) {
      return toast.error('Please enter name, email and message');
    }
    setLoading(true);
    // Mimic API submission
    setTimeout(() => {
      setLoading(false);
      toast.success('Your message has been sent successfully. We will connect with you soon!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Sunshine Saree</title>
        <meta name="description" content="Reach out to Sunshine Saree in Sujangarh for inquiries, order support, and store locations." />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-maroon to-maroon-dark text-white py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,23,0.1),transparent_35%)]"></div>
        <div className="max-w-2xl mx-auto px-4 relative z-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-playfair font-bold">Contact Sunshine Saree</h1>
          <p className="text-white/80 text-sm">Have a question or want to order bulk wedding sarees? Reach out to us.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info details */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-2xl font-playfair font-bold text-gray-800">Get in Touch</h2>
            <div className="w-12 h-0.5 bg-golden"></div>

            <div className="space-y-6 text-sm">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-maroon/5 rounded-full text-maroon mt-0.5"><FiMapPin className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-gray-800">Store Address</h4>
                  <p className="text-gray-500 leading-relaxed">Near Ashok Circle, Sujangarh,<br />Rajasthan - 331507</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-maroon/5 rounded-full text-maroon mt-0.5"><FiPhone className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-gray-800">Mobile Phone</h4>
                  <a href="tel:+916203569455" className="text-gray-500 hover:text-maroon transition-colors block">+91 6203569455</a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-maroon/5 rounded-full text-maroon mt-0.5"><FiMail className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-gray-800">Email Address</h4>
                  <a href="mailto:A.amansingh0143@gmail.com" className="text-gray-500 hover:text-maroon transition-colors block">A.amansingh0143@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-maroon/5 rounded-full text-maroon mt-0.5"><FiClock className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-gray-800">Business Hours</h4>
                  <p className="text-gray-500">Monday – Saturday: 9:00 AM – 8:00 PM</p>
                  <p className="text-[10px] text-gray-400">Closed on Sundays</p>
                </div>
              </div>
            </div>

            {/* Whatsapp quick chat button */}
            <div className="pt-4">
              <a
                href="https://wa.me/916203569455"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                <FaWhatsapp className="text-lg" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right: Message Form panel */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-maroon/5 shadow-sm space-y-6">
            <h3 className="font-playfair text-xl font-bold text-maroon">Send a Message</h3>
            <p className="text-xs text-gray-500">Fill out this quick form, and we will get back to you by email or phone call.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="How can we help you? Write your questions..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-maroon hover:bg-maroon-dark text-white font-semibold rounded-xl text-sm transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:bg-gray-300 shadow-md"
              >
                <FiSend />
                <span>{loading ? 'Sending message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Google maps iframe */}
        <div className="w-full h-80 rounded-2xl overflow-hidden border border-maroon/5 shadow-sm mt-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14134.46912384725!2d74.45672205541992!3d27.701389800000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396acbe02df2ad09%3A0x6b406faef7d53b92!2sSujangarh%2C%20Rajasthan%20331507!5e0!3m2!1sen!2sin!4v1717387220000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store Location Map"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Contact;
