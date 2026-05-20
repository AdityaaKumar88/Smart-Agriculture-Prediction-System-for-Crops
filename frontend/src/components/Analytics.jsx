import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { FiActivity, FiTrendingUp, FiUsers, FiMapPin } from 'react-icons/fi';
import { mockAnalyticsData } from '../utils/mockData';

const StatCard = ({ icon, label, value, change, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="glass rounded-2xl p-5 flex items-start gap-4"
      style={{ border: '1px solid rgba(0,255,136,0.12)' }}
      whileHover={{ borderColor: 'rgba(0,255,136,0.3)', y: -3 }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
        style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', boxShadow: '0 0 16px rgba(0,255,136,0.15)' }}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-white" style={{ fontFamily: 'Poppins,sans-serif' }}>{value}</div>
        <div className="text-xs text-gray-400 mt-0.5">{label}</div>
        <div className="text-xs text-[#00ff88] mt-1 font-medium">{change}</div>
      </div>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 text-xs" style={{ border: '1px solid rgba(0,255,136,0.25)' }}>
        <p className="text-[#00ff88] font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="analytics" className="relative py-24 overflow-hidden" ref={ref}>
      <hr className="neon-divider" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,255,136,0.04) 0%, transparent 70%)' }}
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
            <FiActivity className="text-[#00ff88]" />
            Analytics Dashboard
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Poppins,sans-serif' }}>
            Data-Driven <span className="gradient-text">Insights</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Comprehensive analytics on crop yields, soil health, and weather patterns across India.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={<FiActivity />} label="Total Predictions" value="12,847" change="↑ 23% this month" delay={0} />
          <StatCard icon={<FiUsers />} label="Active Farmers" value="3,294" change="↑ 18% this week" delay={0.08} />
          <StatCard icon={<FiTrendingUp />} label="Model Accuracy" value="94.7%" change="↑ 2.1% improvement" delay={0.16} />
          <StatCard icon={<FiMapPin />} label="Acres Monitored" value="28,500" change="↑ 5,200 new acres" delay={0.24} />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly yield trend */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-2 glass rounded-2xl p-5"
            style={{ border: '1px solid rgba(0,255,136,0.12)' }}
          >
            <h3 className="text-base font-bold text-white mb-5">Monthly Yield & Rainfall Trends</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mockAnalyticsData.monthlyYield}>
                <defs>
                  <linearGradient id="yGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4da6ff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4da6ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#8ba899', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8ba899', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#8ba899' }} />
                <Area type="monotone" dataKey="yield" stroke="#00ff88" strokeWidth={2} fill="url(#yGrad)" name="Yield (kg/ha)" />
                <Area type="monotone" dataKey="rainfall" stroke="#4da6ff" strokeWidth={1.5} fill="url(#rGrad)" name="Rainfall (mm)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Crop distribution pie */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="glass rounded-2xl p-5"
            style={{ border: '1px solid rgba(0,255,136,0.12)' }}
          >
            <h3 className="text-base font-bold text-white mb-5">Crop Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={mockAnalyticsData.cropDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {mockAnalyticsData.cropDistribution.map(({ color }, i) => (
                    <Cell key={i} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#030b05', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, color: '#e8fff2', fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-2">
              {mockAnalyticsData.cropDistribution.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span className="text-gray-400">{name}</span>
                  </div>
                  <span style={{ color }} className="font-semibold">{value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="glass rounded-2xl p-5"
            style={{ border: '1px solid rgba(0,255,136,0.12)' }}
          >
            <h3 className="text-base font-bold text-white mb-5">Monthly Temperature (°C)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={mockAnalyticsData.monthlyYield}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#8ba899', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8ba899', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#030b05', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, color: '#e8fff2', fontSize: 11 }} />
                <Bar dataKey="temp" name="Temp (°C)" radius={[4, 4, 0, 0]}>
                  {mockAnalyticsData.monthlyYield.map((entry, i) => (
                    <Cell key={i} fill={entry.temp > 30 ? '#ff9944' : entry.temp > 25 ? '#00ff88' : '#4da6ff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Prediction history line */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="glass rounded-2xl p-5"
            style={{ border: '1px solid rgba(0,255,136,0.12)' }}
          >
            <h3 className="text-base font-bold text-white mb-5">Prediction Accuracy Over Time</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={[
                { month: 'Jan', accuracy: 88 }, { month: 'Feb', accuracy: 89.5 },
                { month: 'Mar', accuracy: 91 }, { month: 'Apr', accuracy: 92.3 },
                { month: 'May', accuracy: 91.8 }, { month: 'Jun', accuracy: 93.2 },
                { month: 'Jul', accuracy: 92.9 }, { month: 'Aug', accuracy: 94.1 },
                { month: 'Sep', accuracy: 93.5 }, { month: 'Oct', accuracy: 94.7 },
                { month: 'Nov', accuracy: 95.2 }, { month: 'Dec', accuracy: 94.9 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#8ba899', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 100]} tick={{ fill: '#8ba899', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#030b05', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, color: '#e8fff2', fontSize: 11 }} />
                <Line
                  type="monotone" dataKey="accuracy" stroke="#00ff88" strokeWidth={2.5}
                  dot={{ fill: '#00ff88', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#00ff88', boxShadow: '0 0 8px #00ff88' }}
                  name="Accuracy (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
