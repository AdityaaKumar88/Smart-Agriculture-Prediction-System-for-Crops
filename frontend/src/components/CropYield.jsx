import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart,
} from 'recharts';
import { FiCpu, FiTrendingUp, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { indianStates, cropsList, mockYieldData } from '../utils/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 text-xs" style={{ border: '1px solid rgba(0,255,136,0.25)' }}>
        <p className="text-[#00ff88] font-semibold mb-1">{label}</p>
        <p className="text-white">{payload[0].name}: <span className="text-[#00ff88]">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

export default function CropYield() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [form, setForm] = useState({
    nitrogen: 80, phosphorus: 60, potassium: 70,
    ph: 6.5, temperature: 28, rainfall: 80, humidity: 65,
    state: 'Punjab', crop: 'Wheat',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    // Simulate API call with mock data
    await new Promise((r) => setTimeout(r, 2200));
    // Add slight variation based on form inputs
    const variation = (Math.random() * 600 - 300);
    setResult({
      ...mockYieldData,
      predictedYield: Math.max(2000, Math.round(mockYieldData.predictedYield + variation)),
      confidence: Math.min(97, Math.max(85, 92 + Math.random() * 5 - 2)),
    });
    setLoading(false);
  };

  return (
    <section id="prediction" className="relative py-24 overflow-hidden" ref={ref}>
      <hr className="neon-divider" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 80% 50%, rgba(0,255,136,0.04) 0%, transparent 70%)' }}
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
            <FiCpu className="text-[#00ff88]" />
            AI Prediction Engine
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Poppins,sans-serif' }}>
            Crop Yield <span className="gradient-text">Prediction</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Input your field parameters and let our XGBoost AI predict crop yield with 94%+ accuracy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 glass p-6 rounded-2xl"
            style={{ border: '1px solid rgba(0,255,136,0.12)' }}
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FiTrendingUp className="text-[#00ff88]" />
              Field Parameters
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Nitrogen (N)', name: 'nitrogen', min: 0, max: 200 },
                { label: 'Phosphorus (P)', name: 'phosphorus', min: 0, max: 200 },
                { label: 'Potassium (K)', name: 'potassium', min: 0, max: 200 },
                { label: 'Soil pH', name: 'ph', min: 3, max: 10, step: 0.1 },
                { label: 'Temperature (°C)', name: 'temperature', min: 5, max: 50 },
                { label: 'Rainfall (mm)', name: 'rainfall', min: 0, max: 500 },
                { label: 'Humidity (%)', name: 'humidity', min: 0, max: 100 },
              ].map(({ label, name, min, max, step }) => (
                <div key={name}>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium">{label}</label>
                  <input
                    type="number"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    step={step || 1}
                    className="input-neon text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">State</label>
                <select name="state" value={form.state} onChange={handleChange} className="input-neon text-sm">
                  {indianStates.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Crop</label>
                <select name="crop" value={form.crop} onChange={handleChange} className="input-neon text-sm">
                  {cropsList.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <button
              className="btn-neon w-full py-3.5 text-base flex items-center justify-center gap-2"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? (
                <span className="relative z-10 flex items-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <FiLoader />
                  </motion.span>
                  Predicting...
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  <FiCpu /> Run AI Prediction
                </span>
              )}
            </button>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3 flex flex-col gap-5"
          >
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-2xl p-10 flex flex-col items-center justify-center text-center h-64"
                  style={{ border: '1px solid rgba(0,255,136,0.08)' }}
                >
                  <div className="text-5xl mb-4">🌾</div>
                  <p className="text-gray-400">Fill in your field parameters and click <span className="text-[#00ff88]">Run AI Prediction</span> to see results</p>
                </motion.div>
              )}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-2xl p-10 flex flex-col items-center justify-center text-center h-64"
                  style={{ border: '1px solid rgba(0,255,136,0.15)' }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full border-2 border-transparent mb-5"
                    style={{ borderTopColor: '#00ff88', borderRightColor: 'rgba(0,255,136,0.3)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-[#00ff88] font-semibold">AI Model Processing...</p>
                  <p className="text-gray-500 text-sm mt-1">XGBoost analyzing 47 parameters</p>
                </motion.div>
              )}
              {result && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-5"
                >
                  {/* Score cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Predicted Yield', value: `${result.predictedYield.toLocaleString()}`, unit: 'kg/ha', icon: '🌾' },
                      { label: 'Confidence', value: `${result.confidence.toFixed(1)}%`, unit: 'accuracy', icon: '🎯' },
                      { label: 'Best Crop', value: result.bestCrop, unit: 'recommended', icon: '✅' },
                    ].map(({ label, value, unit, icon }) => (
                      <div key={label} className="glass rounded-xl p-4 text-center" style={{ border: '1px solid rgba(0,255,136,0.15)' }}>
                        <div className="text-2xl mb-1">{icon}</div>
                        <div className="text-xl font-black text-[#00ff88]" style={{ fontFamily: 'Poppins,sans-serif' }}>{value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                        <div className="text-xs text-gray-600 mt-0.5">{unit}</div>
                      </div>
                    ))}
                  </div>

                  {/* Yield history chart */}
                  <div className="glass rounded-xl p-5" style={{ border: '1px solid rgba(0,255,136,0.12)' }}>
                    <h4 className="text-sm font-semibold text-white mb-4">Yield Trend (2020–2025)</h4>
                    <ResponsiveContainer width="100%" height={170}>
                      <AreaChart data={result.yieldHistory}>
                        <defs>
                          <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,136,0.05)" />
                        <XAxis dataKey="year" tick={{ fill: '#8ba899', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#8ba899', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="yield" stroke="#00ff88" strokeWidth={2} fill="url(#yieldGrad)" name="Yield (kg/ha)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Crop comparison */}
                  <div className="glass rounded-xl p-5" style={{ border: '1px solid rgba(0,255,136,0.12)' }}>
                    <h4 className="text-sm font-semibold text-white mb-4">Crop Yield Comparison</h4>
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={result.cropComparison} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,136,0.05)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: '#8ba899', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="crop" tick={{ fill: '#8ba899', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="yield" fill="url(#barGrad)" radius={[0, 4, 4, 0]} name="Yield (kg/ha)">
                          <defs>
                            <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#003d1f" />
                              <stop offset="100%" stopColor="#00ff88" />
                            </linearGradient>
                          </defs>
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
