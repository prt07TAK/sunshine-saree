import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiHeart, FiGift, FiAward } from 'react-icons/fi';

const About = () => {
  const values = [
    { icon: <FiAward className="w-6 h-6 text-maroon" />, title: 'Unmatched Quality', desc: 'Every single thread, color, and embellishment is checked individually to guarantee flawless sarees.' },
    { icon: <FiCheckCircle className="w-6 h-6 text-maroon" />, title: 'Authenticity Guarantee', desc: 'We supply only genuine silks, linen, and block prints sourced directly from native weavers.' },
    { icon: <FiHeart className="w-6 h-6 text-maroon" />, title: 'Customer Trust', desc: 'Over thousands of happy customers in Rajasthan and nationwide trust us for major celebrations.' },
    { icon: <FiGift className="w-6 h-6 text-maroon" />, title: 'Gifting & Heritage', desc: 'Every drape comes in signature moisture-free storage bags to preserve the fabric for generations.' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us | Sunshine Saree</title>
        <meta name="description" content="Discover our history, values, and craftsmanship of sourcing authentic Indian sarees from Sujangarh." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-maroon-dark to-maroon text-white py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,160,23,0.1),transparent_35%)]"></div>
        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-playfair font-bold">Our Heritage & Story</h1>
          <p className="text-white/80 text-sm">Empowering master artisans and celebrating Indian traditions since inception.</p>
        </div>
      </section>

      {/* Story & Image */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-playfair font-bold text-maroon">Born from Passion</h2>
            <div className="w-16 h-0.5 bg-golden"></div>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                <strong>Sunshine Saree</strong> was born from a deep love for Indian weaves and the graceful tradition of saree-wearing. Located in the heart of Sujangarh, Rajasthan, we bring you authentic, carefully curated sarees sourced from master weavers across India.
              </p>
              <p>
                Our collection reflects the vibrant hues of Rajasthan while maintaining a modern, seamless online shopping experience. We work directly with weavers in Varanasi, Kanchipuram, Chanderi, and Jaipur, eliminating middlemen to provide the finest quality at fair prices.
              </p>
              <p>
                Whether it is a heavy bridal silk, a light festive organza, or a breathable cotton block print for everyday wear, we make sure that your drape feels special, comfortable, and timeless.
              </p>
            </div>
          </div>

          {/* Right Placeholder Image / Visual Graphic */}
          <div className="lg:col-span-5 aspect-[4/5] rounded-3xl overflow-hidden border border-maroon/5 bg-gradient-to-br from-maroon/10 to-golden/10 flex flex-col items-center justify-center p-8 text-center relative shadow-sm">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-xs"></div>
            <div className="relative z-10 space-y-4">
              <span className="text-6xl animate-pulse">☀️</span>
              <h3 className="font-playfair text-xl font-bold text-maroon">Sunshine Saree</h3>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">Located near Ashok Circle, Sujangarh. We welcome you to experience our traditional customer service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-16 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-maroon">Our Foundational Values</h2>
            <div className="w-16 h-0.5 bg-golden mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-maroon/5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-maroon/5 flex items-center justify-center mb-4">{v.icon}</div>
                <h4 className="font-playfair font-bold text-gray-800 text-base">{v.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Maps Location */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-maroon">Visit Our Store</h2>
          <div className="w-16 h-0.5 bg-golden mx-auto"></div>
          <p className="text-xs text-gray-500">Come explore our physical catalogs in Sujangarh</p>
        </div>

        <div className="w-full h-96 rounded-2xl overflow-hidden border border-maroon/5 shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14134.46912384725!2d74.45672205541992!3d27.701389800000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396acbe02df2ad09%3A0x6b406faef7d53b92!2sSujangarh%2C%20Rajasthan%20331507!5e0!3m2!1sen!2sin!4v1717387220000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sujangarh Map"
          ></iframe>
        </div>
      </section>
    </>
  );
};

export default About;
