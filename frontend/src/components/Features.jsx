import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { GiPlantRoots, GiEarthAmerica, GiMicroscope, GiAnt } from 'react-icons/gi';
import { FiArrowUpRight } from 'react-icons/fi';

const features = [
  {
    icon: <GiEarthAmerica size={34} />,
    title: 'Better Crop Management',
    description:
      'Understand which crops are growing well and which need attention. Get real-time insights from AI-powered satellite data and sensor networks.',
    badge: 'AI-Powered',
    gradient: 'from-green-500/10 to-emerald-900/5',
  },
  {
    icon: <GiPlantRoots size={34} />,
    title: 'Soil Health Monitoring',
    description:
      'Find out if your soil lacks nutrients and improve it with the right fertilizers. Our NPK sensors and ML models detect deficiencies before visible damage.',
    badge: 'Real-time',
    gradient: 'from-teal-500/10 to-green-900/5',
  },
  {
    icon: <GiMicroscope size={34} />,
    title: 'Early Disease Detection',
    description:
      'Spot signs of disease early to prevent major losses. Deep learning image models identify 50+ crop diseases with 96% accuracy.',
    badge: '96% Accuracy',
    gradient: 'from-emerald-400/10 to-green-900/5',
  },
  {
    icon: <GiAnt size={34} />,
    title: 'Pest Forecasting',
    description:
      'Know in advance when pests might attack so you can protect your crops. Weather-linked ML models predict pest outbreaks 7 days in advance.',
    badge: '7-Day Forecast',
    gradient: 'from-lime-500/10 to-green-900/5',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" className="relative py-24 overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,255,136,0.04) 0%, transparent 70%)' }}
      />
      <hr className="neon-divider mb-0" />

      <div className="max-w-7xl mx-auto px-6 pt-24">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse inline-block" />
            Smart Features
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mt-4 mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Everything You Need to{' '}
            <span className="gradient-text">Farm Smarter</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our AI-powered platform combines satellite imagery, IoT sensors, and machine learning
            to give farmers actionable insights at their fingertips.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map(({ icon, title, description, badge, gradient }, i) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className={`feature-card glass p-6 cursor-pointer`}
              style={{ border: '1px solid rgba(0,255,136,0.12)' }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,180,90,0.05))',
                  border: '1px solid rgba(0,255,136,0.2)',
                  color: '#00ff88',
                  boxShadow: '0 0 20px rgba(0,255,136,0.1)',
                }}
              >
                {icon}
              </div>

              {/* Badge */}
              <div className="stat-badge mb-3 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] inline-block" />
                {badge}
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold text-white mb-3"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{description}</p>

              {/* Learn More */}
              <div className="flex items-center gap-1 text-[#00ff88] text-sm font-semibold group">
                Learn more
                <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom accent row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
        >
          {['Powered by XGBoost AI', 'Live Sensor Integration', 'NOAA Weather Data', 'Scikit-learn Models', 'FastAPI Backend'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
