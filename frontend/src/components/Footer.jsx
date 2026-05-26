import { motion } from 'framer-motion';
import { GiWheat } from 'react-icons/gi';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const footerLinks = {
  Product: ['Crop Prediction', 'Soil Analysis', 'Weather Forecast', 'AI Assistant', 'Analytics'],
  Technology: ['XGBoost ML', 'LangChain AI', 'FastAPI Backend', 'React Frontend', 'Streamlit Admin'],
  Resources: ['Documentation', 'API Reference', 'Dataset Sources', 'Research Papers', 'Changelog'],
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="relative border-t" style={{ borderColor: 'rgba(0,255,136,0.08)', background: 'rgba(0,10,4,0.98)' }}>
      <div className="w-full max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center" style={{ boxShadow: '0 0 16px rgba(0,255,136,0.4)' }}>
                <GiWheat className="text-black text-xl" />
              </div>
              <div>
                <div className="font-black text-lg leading-none" style={{ fontFamily: 'Poppins,sans-serif' }}>
                  <span className="neon-text">Precision</span><span className="text-white"> Agri.AI</span>
                </div>
                <div className="text-xs text-gray-600">Smart Farming Platform</div>
              </div>
            </div>
          
            <div className="flex gap-3">
              {[
                { icon: <FiGithub />, href: '#', label: 'GitHub' },
                { icon: <FiTwitter />, href: '#', label: 'Twitter' },
                { icon: <FiLinkedin />, href: '#', label: 'LinkedIn' },
              ].map(({ icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#00ff88] transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  whileHover={{ borderColor: 'rgba(0,255,136,0.4)', background: 'rgba(0,255,136,0.08)', scale: 1.1 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{section}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-[#00ff88] transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="neon-divider mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {year} Precision Agriculture AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            All systems operational · API uptime: 99.9%
          </div>
          <div className="flex gap-4 text-xs text-gray-600">
            <a href="#" className="hover:text-[#00ff88] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#00ff88] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#00ff88] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
