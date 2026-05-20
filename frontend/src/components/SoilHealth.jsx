import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { FiDroplet, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { mockSoilData } from '../utils/mockData';

const NutrientLevel = ({ label, value, max = 100 }) => {
  const pct = (value / max) * 100;
  const color = pct < 40 ? '#ff4d4d' : pct < 65 ? '#ffcc00' : '#00ff88';
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-semibold" style={{ color }}>{value}</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
};

const CircularProgress = ({ value, label, color = '#00ff88', size = 100 }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(0,255,136,0.1)" strokeWidth={7} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.5 }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text
          x={size / 2} y={size / 2 + 6}
          textAnchor="middle"
          style={{ transform: 'rotate(90deg)', transformOrigin: `${size / 2}px ${size / 2}px`, fill: '#fff', fontSize: 18, fontWeight: 800, fontFamily: 'Poppins,sans-serif' }}
        >
          {value}%
        </text>
      </svg>
      <span className="text-xs text-gray-400 text-center">{label}</span>
    </div>
  );
};

const radarData = [
  { nutrient: 'Nitrogen', value: 72 },
  { nutrient: 'Phosphorus', value: 58 },
  { nutrient: 'Potassium', value: 81 },
  { nutrient: 'Moisture', value: 65 },
  { nutrient: 'Organic', value: 74 },
  { nutrient: 'pH Score', value: 88 },
];

const barData = [
  { name: 'N', optimal: 100, actual: 72 },
  { name: 'P', optimal: 100, actual: 58 },
  { name: 'K', optimal: 100, actual: 81 },
  { name: 'pH', optimal: 100, actual: 88 },
  { name: 'Organic', optimal: 100, actual: 74 },
];

export default function SoilHealth() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="soil" className="relative py-24 overflow-hidden" ref={ref}>
      <hr className="neon-divider" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 20% 50%, rgba(0,255,136,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="section-label mx-auto">
            <FiDroplet className="text-[#00ff88]" />
            Soil Intelligence
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Poppins,sans-serif' }}>
            Soil Health <span className="gradient-text">Analysis</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Real-time NPK monitoring, pH analysis, and AI-powered fertilizer recommendations for optimal crop health.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nutrient Bars */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glass rounded-2xl p-6"
            style={{ border: '1px solid rgba(0,255,136,0.12)' }}
          >
            <h3 className="text-base font-bold text-white mb-6">Nutrient Levels</h3>
            <NutrientLevel label="Nitrogen (N)" value={mockSoilData.nitrogen} />
            <NutrientLevel label="Phosphorus (P)" value={mockSoilData.phosphorus} />
            <NutrientLevel label="Potassium (K)" value={mockSoilData.potassium} />
            <NutrientLevel label="Organic Matter" value={Math.round(mockSoilData.organicMatter * 10)} max={60} />
            <NutrientLevel label="Moisture" value={mockSoilData.moisture} />

            <div className="mt-6 flex gap-3 flex-wrap">
              {[
                { color: '#ff4d4d', label: 'Low' },
                { color: '#ffcc00', label: 'Moderate' },
                { color: '#00ff88', label: 'Healthy' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass rounded-2xl p-6"
            style={{ border: '1px solid rgba(0,255,136,0.12)' }}
          >
            <h3 className="text-base font-bold text-white mb-4">Soil Profile Radar</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(0,255,136,0.1)" />
                <PolarAngleAxis dataKey="nutrient" tick={{ fill: '#8ba899', fontSize: 11 }} />
                <Radar name="Soil" dataKey="value" stroke="#00ff88" fill="#00ff88" fillOpacity={0.12} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>

            <div className="mt-2 grid grid-cols-3 gap-3">
              <CircularProgress value={mockSoilData.fertility} label="Fertility" size={90} />
              <CircularProgress value={Math.round((mockSoilData.ph / 14) * 100)} label="pH Score" color="#00d46a" size={90} />
              <CircularProgress value={mockSoilData.moisture} label="Moisture" color="#00b359" size={90} />
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            {/* NPK bar chart */}
            <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(0,255,136,0.12)' }}>
              <h3 className="text-base font-bold text-white mb-4">NPK vs Optimal</h3>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,136,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#8ba899', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8ba899', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#030b05', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, color: '#e8fff2', fontSize: 12 }} />
                  <Bar dataKey="optimal" fill="rgba(0,255,136,0.1)" radius={[4, 4, 0, 0]} name="Optimal" />
                  <Bar dataKey="actual" fill="#00ff88" radius={[4, 4, 0, 0]} name="Actual" style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.4))' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Fertilizer recommendations */}
            <div className="glass rounded-2xl p-5 flex-1" style={{ border: '1px solid rgba(0,255,136,0.12)' }}>
              <h3 className="text-base font-bold text-white mb-4">AI Fertilizer Recommendations</h3>
              <div className="flex flex-col gap-3">
                {mockSoilData.recommendations.map(({ type, amount, priority }) => (
                  <div
                    key={type}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.08)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                        style={{
                          background: priority === 'High' ? 'rgba(255,77,77,0.15)' : priority === 'Medium' ? 'rgba(255,204,0,0.15)' : 'rgba(0,255,136,0.15)',
                          color: priority === 'High' ? '#ff4d4d' : priority === 'Medium' ? '#ffcc00' : '#00ff88',
                        }}
                      >
                        {type.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{type}</div>
                        <div className="text-xs text-gray-500">{amount}</div>
                      </div>
                    </div>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        background: priority === 'High' ? 'rgba(255,77,77,0.15)' : priority === 'Medium' ? 'rgba(255,204,0,0.15)' : 'rgba(0,255,136,0.15)',
                        color: priority === 'High' ? '#ff4d4d' : priority === 'Medium' ? '#ffcc00' : '#00ff88',
                      }}
                    >
                      {priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
