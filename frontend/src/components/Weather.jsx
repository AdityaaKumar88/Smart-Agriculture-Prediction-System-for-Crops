import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { WiDaySunny, WiRain, WiCloudy, WiDayCloudyGusts, WiThunderstorm, WiDayCloudy } from 'react-icons/wi';
import { FiCloud, FiDroplet, FiWind, FiSun, FiThermometer, FiMapPin } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';
import { mockWeatherData } from '../utils/mockData';

const STATES = [
  { name: 'Punjab', lat: 31.1471, lon: 75.3412 },
  { name: 'Haryana', lat: 29.0588, lon: 76.0856 },
  { name: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
  { name: 'Maharashtra', lat: 19.7515, lon: 75.7139 },
  { name: 'Gujarat', lat: 22.2587, lon: 71.1924 },
  { name: 'Rajasthan', lat: 27.0238, lon: 74.2179 },
  { name: 'Madhya Pradesh', lat: 22.9734, lon: 78.6569 },
  { name: 'Karnataka', lat: 15.3173, lon: 75.7139 },
  { name: 'Tamil Nadu', lat: 11.1271, lon: 78.6569 },
  { name: 'Kerala', lat: 10.8505, lon: 76.2711 },
];

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
  const [selectedState, setSelectedState] = useState(STATES[0]);
  const [weatherData, setWeatherData] = useState(mockWeatherData);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { lat, lon, name } = selectedState;
        const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
        
        const data = res.data;
        const current = data.current;
        const daily = data.daily;
        
        const mapCode = (code) => {
            if (code <= 3) return "Sunny";
            if (code <= 48) return "Cloudy";
            if (code <= 67 || code === 77 || code === 80 || code === 81 || code === 82) return "Rainy";
            if (code >= 95) return "Thunderstorm";
            return "Partly Cloudy";
        };

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const forecast = daily.time.slice(0, 7).map((time, i) => {
           const date = new Date(time);
           return {
             day: days[date.getDay()],
             high: Math.round(daily.temperature_2m_max[i]),
             low: Math.round(daily.temperature_2m_min[i]),
             condition: mapCode(daily.weather_code[i]),
             rain: daily.precipitation_probability_max[i] || 0
           };
        });

        setWeatherData({
          location: `${name}, India`,
          temperature: Math.round(current.temperature_2m),
          humidity: Math.round(current.relative_humidity_2m),
          rainfall: current.precipitation,
          windSpeed: Math.round(current.wind_speed_10m),
          condition: mapCode(current.weather_code),
          uvIndex: 8,
          forecast: forecast
        });
      } catch (err) {
        console.error("Failed to fetch weather", err);
      }
    };
    fetchWeather();
  }, [selectedState]);

  const tempData = weatherData.forecast.map(d => ({ day: d.day, high: d.high, low: d.low, rain: d.rain }));

  return (
    <section id="weather" className="relative py-24 overflow-hidden" ref={ref}>
      <hr className="neon-divider" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 70% 30%, rgba(0,180,90,0.04) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-[1400px] mx-auto px-6 pt-16">
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

          <div className="mt-8 flex justify-center">
            <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border border-[rgba(0,255,136,0.2)]">
              <FiMapPin className="text-[#00ff88]" />
              <select
                className="bg-transparent text-white outline-none cursor-pointer"
                value={selectedState.name}
                onChange={(e) => {
                  const s = STATES.find((x) => x.name === e.target.value);
                  if (s) setSelectedState(s);
                }}
              >
                {STATES.map((s) => (
                  <option key={s.name} value={s.name} className="bg-gray-900 text-white">{s.name}</option>
                ))}
              </select>
            </div>
          </div>
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
                {conditionIcon(weatherData.condition, 80)}
              </motion.div>
              <div>
                <div className="text-6xl font-black text-white" style={{ fontFamily: 'Poppins,sans-serif' }}>
                  {weatherData.temperature}°
                  <span className="text-2xl text-gray-400 font-normal">C</span>
                </div>
                <div className="text-[#00ff88] font-semibold text-lg">{weatherData.condition}</div>
                <div className="text-gray-400 text-sm mt-1">📍 {weatherData.location}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <FiDroplet />, label: 'Humidity', value: `${weatherData.humidity}%`, color: '#4da6ff' },
                { icon: <WiRain size={18} />, label: 'Rainfall', value: `${weatherData.rainfall}mm`, color: '#00d46a' },
                { icon: <FiWind />, label: 'Wind', value: `${weatherData.windSpeed} km/h`, color: '#00ff88' },
                { icon: <FiSun />, label: 'UV Index', value: weatherData.uvIndex, color: '#ffcc00' },
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
              {weatherData.forecast.map((day, i) => (
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
