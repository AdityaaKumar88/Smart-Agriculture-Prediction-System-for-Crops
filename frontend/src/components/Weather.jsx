import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { WiDaySunny, WiRain, WiCloudy, WiDayCloudyGusts, WiThunderstorm, WiDayCloudy } from 'react-icons/wi';
import { FiCloud, FiDroplet, FiWind, FiSun, FiThermometer } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { mockWeatherData } from '../utils/mockData';

const conditionIcon = (condition, size = 40) => {
  const icons = {
    'Sunny': <WiDaySunny size={size} style={{ color: '#ffcc00' }} />,
    'Rainy': <WiRain size={size} style={{ color: '#4da6ff' }} />,
    'Cloudy': <WiCloudy size={size} style={{ color: '#a0a0a0' }} />,
    'Partly Cloudy': <WiDayCloudy size={size} style={{ color: '#00d46a' }} />,
    'Windy': <WiDayCloudyGusts size={size} style={{ color: '#00d46a' }} />,
    'Thunderstorm': <WiThunderstorm size={size} style={{ color: '#8866ff' }} />,
  };
  return icons[condition] || <WiDayCloudy size={size} style={{ color: '#00d46a' }} />;
};

export default function Weather() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const tempData = mockWeatherData.forecast.map(d => ({ day: d.day, high: d.high, low: d.low, rain: d.rain }));

  return (
    <section id="weather" className="relative py-24 overflow-hidden" ref={ref}>
      <hr className="neon-divider" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 70% 30%, rgba(0,180,90,0.04) 0%, transparent 70%)' }}
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
            <FiCloud className="text-[#00ff88]" />
            Weather Intelligence
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Poppins,sans-serif' }}>
            Live Weather <span className="gradient-text">Forecast</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Hyperlocal 7-day weather forecasts integrated with your field data for precision farming decisions.
          </p>
        </motion.div>

        {/* Main weather card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass rounded-2xl p-6 sm:p-8 mb-6"
          style={{ border: '1px solid rgba(0,255,136,0.12)' }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {conditionIcon(mockWeatherData.condition, 80)}
              </motion.div>
              <div>
                <div className="text-6xl font-black text-white" style={{ fontFamily: 'Poppins,sans-serif' }}>
                  {mockWeatherData.temperature}°
                  <span className="text-2xl text-gray-400 font-normal">C</span>
                </div>
                <div className="text-[#00ff88] font-semibold text-lg">{mockWeatherData.condition}</div>
                <div className="text-gray-400 text-sm mt-1">📍 {mockWeatherData.location}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <FiDroplet />, label: 'Humidity', value: `${mockWeatherData.humidity}%`, color: '#4da6ff' },
                { icon: <WiRain size={18} />, label: 'Rainfall', value: `${mockWeatherData.rainfall}mm`, color: '#00d46a' },
                { icon: <FiWind />, label: 'Wind', value: `${mockWeatherData.windSpeed} km/h`, color: '#00ff88' },
                { icon: <FiSun />, label: 'UV Index', value: mockWeatherData.uvIndex, color: '#ffcc00' },
              ].map(({ icon, label, value, color }) => (
                <div key={label} className="weather-card text-center px-4 py-3 min-w-[90px]">
                  <div style={{ color }} className="text-xl flex justify-center mb-1">{icon}</div>
                  <div className="text-sm font-bold text-white">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 7-day forecast */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-1 glass rounded-2xl p-5"
            style={{ border: '1px solid rgba(0,255,136,0.12)' }}
          >
            <h3 className="text-base font-bold text-white mb-5">7-Day Forecast</h3>
            <div className="flex flex-col gap-3">
              {mockWeatherData.forecast.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-center justify-between py-2 px-3 rounded-xl transition-all hover:bg-white/5"
                >
                  <span className="text-sm text-gray-400 w-10">{day.day}</span>
                  <span>{conditionIcon(day.condition, 24)}</span>
                  <div className="flex items-center gap-1 text-xs text-blue-400">
                    <FiDroplet size={10} />{day.rain}%
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="text-white font-semibold">{day.high}°</span>
                    <span className="text-gray-600">{day.low}°</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Temperature chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-2 glass rounded-2xl p-5"
            style={{ border: '1px solid rgba(0,255,136,0.12)' }}
          >
            <h3 className="text-base font-bold text-white mb-5">Temperature & Rain Forecast</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={tempData}>
                <defs>
                  <linearGradient id="tempHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9944" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff9944" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4da6ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4da6ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: '#8ba899', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8ba899', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#030b05', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, color: '#e8fff2', fontSize: 12 }} />
                <Area type="monotone" dataKey="high" stroke="#ff9944" strokeWidth={2} fill="url(#tempHigh)" name="High (°C)" />
                <Area type="monotone" dataKey="low" stroke="#00ff88" strokeWidth={2} fill="none" name="Low (°C)" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="rain" stroke="#4da6ff" strokeWidth={1.5} fill="url(#rainGrad)" name="Rain %" />
              </AreaChart>
            </ResponsiveContainer>

            {/* Seasonal tip */}
            <div
              className="mt-5 p-4 rounded-xl flex items-start gap-3"
              style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.12)' }}
            >
              <span className="text-2xl mt-0.5">🌱</span>
              <div>
                <div className="text-sm font-semibold text-[#00ff88] mb-1">AI Seasonal Tip</div>
                <p className="text-xs text-gray-400">
                  Rainfall expected mid-week. Consider delaying irrigation for 2–3 days to save water. Soil moisture should remain adequate for wheat at this growth stage.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
