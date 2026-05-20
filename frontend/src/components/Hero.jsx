import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GiWheat, GiPlantRoots, GiSunflower, GiWateringCan } from 'react-icons/gi';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';

const floatingIcons = [
  { Icon: GiWheat, size: 40, style: { top: '15%', left: '8%' }, delay: 0, color: '#00ff88' },
  { Icon: GiSunflower, size: 32, style: { top: '25%', right: '10%' }, delay: 0.8, color: '#00d46a' },
  { Icon: GiPlantRoots, size: 36, style: { bottom: '30%', left: '12%' }, delay: 1.2, color: '#00b359' },
  { Icon: GiWateringCan, size: 28, style: { bottom: '20%', right: '8%' }, delay: 0.4, color: '#00ff88' },
  { Icon: BsRobot, size: 30, style: { top: '60%', left: '5%' }, delay: 1.6, color: '#00d46a' },
];

// Particle component
function Particle({ index }) {
  const rand = (min, max) => Math.random() * (max - min) + min;
  const size = rand(2, 5);
  const x = rand(0, 100);
  const duration = rand(8, 20);
  const delay = rand(0, 10);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: '-10px',
        background: `rgba(0,255,136,${rand(0.2, 0.7)})`,
        boxShadow: `0 0 ${size * 2}px rgba(0,255,136,0.5)`,
      }}
      animate={{
        y: [0, -window.innerHeight * 1.2],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 0.8, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export default function Hero() {
  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden animated-bg grid-bg"
    >
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,255,136,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,150,80,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, size, style, delay, color }, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:flex items-center justify-center opacity-20 hover:opacity-60 transition-opacity duration-300"
          style={style}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.18, scale: 1, y: [0, i % 2 === 0 ? -12 : 10, 0] }}
          transition={{
            opacity: { delay, duration: 1 },
            scale: { delay, duration: 0.8 },
            y: { delay, duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Icon style={{ color, fontSize: size, filter: `drop-shadow(0 0 10px ${color})` }} />
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-24 pt-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-label mx-auto mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse inline-block" />
          AI-Powered Agriculture Platform • India's First
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight mb-6"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Smart Farming
          <br />
          <span className="gradient-text">for a Better</span>
          <br />
          <span className="text-white">Future</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Harness the power of <span className="text-[#00ff88] font-semibold">XGBoost AI</span>, real-time soil analytics, 
          and precision weather forecasting to maximize your crop yield and transform Indian agriculture.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            className="btn-neon text-base px-8 py-4 flex items-center gap-2 w-full sm:w-auto"
            onClick={() => handleScroll('prediction')}
          >
            <span className="relative z-10 flex items-center gap-2">
              🚀 Get Started <FiArrowRight />
            </span>
          </button>
          <button
            className="btn-outline text-base px-8 py-4 flex items-center gap-2 w-full sm:w-auto"
            onClick={() => handleScroll('features')}
          >
            <FiPlay size={16} /> Explore Features
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { value: '94.7%', label: 'Model Accuracy' },
            { value: '28,500+', label: 'Acres Monitored' },
            { value: '12,847', label: 'Predictions Made' },
            { value: '20+', label: 'Crop Varieties' },
          ].map(({ value, label }, i) => (
            <motion.div
              key={label}
              className="counter-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <div
                className="text-2xl sm:text-3xl font-black neon-text mb-1"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {value}
              </div>
              <div className="text-xs text-gray-500 font-medium">{label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-600 tracking-widest uppercase">Scroll to explore</span>
          <div
            className="w-5 h-9 rounded-full border border-[rgba(0,255,136,0.3)] flex items-start justify-center pt-1.5"
          >
            <motion.div
              className="w-1.5 h-2.5 rounded-full bg-[#00ff88]"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
