import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-maroon-dark to-maroon text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">☀️</span>
              <span className="font-playfair text-2xl font-bold text-golden">
                Sunshine Saree
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Bringing the rich tradition of Indian ethnic wear to your doorstep. 
              Handpicked sarees from master weavers across India.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/916203569455"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 transition-all duration-300 hover:scale-110"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-110"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-golden mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Collections', path: '/collections' },
                { name: 'About Us', path: '/about' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'Support', path: '/support' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-golden text-sm transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-golden/50" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-golden mb-4">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'My Account', path: '/profile' },
                { name: 'My Orders', path: '/orders' },
                { name: 'Shopping Cart', path: '/cart' },
                { name: 'Return Policy', path: '/support' },
                { name: 'FAQs', path: '/support' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-golden text-sm transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-golden/50" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-golden mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-golden flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  Near Ashok Circle, Sujangarh,<br />Rajasthan - 331507
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-golden flex-shrink-0" />
                <a href="tel:+916203569455" className="text-white/70 hover:text-golden text-sm transition-colors">
                  +91 6203569455
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-golden flex-shrink-0" />
                <a href="mailto:A.amansingh0143@gmail.com" className="text-white/70 hover:text-golden text-sm transition-colors">
                  A.amansingh0143@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FiClock className="w-5 h-5 text-golden flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  Mon – Sat, 9 AM – 8 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} Sunshine Saree. All Rights Reserved.
          </p>
          <p className="text-white/50 text-xs mt-2 sm:mt-0">
            Made with ❤️ in Sujangarh, Rajasthan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
