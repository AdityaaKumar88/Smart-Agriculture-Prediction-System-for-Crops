import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiHome, FiGrid, FiBarChart2, FiDroplet,
  FiCloud, FiMessageSquare, FiMap, FiActivity, FiPhone
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

const navLinks = [
  { label: 'Home', href: '#home', icon: <FiHome /> },
  { label: 'Features', href: '#features', icon: <FiGrid /> },
  { label: 'Prediction', href: '#prediction', icon: <FiBarChart2 /> },
  { label: 'Soil Health', href: '#soil', icon: <FiDroplet /> },
  { label: 'Weather', href: '#weather', icon: <FiCloud /> },
  { label: 'AI Assistant', href: '#chatbot', icon: <FiMessageSquare /> },
  { label: 'Analytics', href: '#analytics', icon: <FiActivity /> },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = navLinks.map(l => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'navbar-blur shadow-lg' : 'bg-transparent'
          }`}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleNav('#home')}
              whileHover={{ scale: 1.04 }}
            >
              <div className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-700" style={{ boxShadow: '0 0 16px rgba(0,255,136,0.4)' }}>
                <GiWheat className="text-black text-xl" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: 'Poppins,sans-serif' }}>
                <span className="neon-text">Precision</span>
                <span className="text-white"> Agri.AI</span>
              </span>
            </motion.div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-1.5 ${activeSection === link.href.replace('#', '')
                    ? 'text-[#00ff88]'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {link.label}
                  {activeSection === link.href.replace('#', '') && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg, transparent, #00ff88, transparent)' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <button
                className="hidden sm:block btn-neon text-sm py-2 px-5"
                onClick={() => handleNav('#prediction')}
              >
                <span>Try AI Now</span>
              </button>
              <button
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-[#00ff88] transition-colors"
                onClick={() => setMenuOpen(prev => !prev)}
              >
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 glass-dark border-t border-[rgba(0,255,136,0.1)] py-4 px-4"
            style={{ backdropFilter: 'blur(24px)' }}
          >
            <div className="max-w-md mx-auto flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeSection === link.href.replace('#', '')
                    ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </button>
              ))}
              <button
                className="btn-neon mt-3 w-full text-sm py-3"
                onClick={() => handleNav('#prediction')}
              >
                <span>🚀 Try AI Prediction Now</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
