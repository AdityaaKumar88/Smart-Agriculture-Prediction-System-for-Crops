import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapContainer, TileLayer, GeoJSON, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { stateYieldData } from '../utils/mockData';
import { FiMap } from 'react-icons/fi';

// Color scale for yield
const getColor = (yield_val) => {
  if (yield_val >= 4500) return '#00ff88';
  if (yield_val >= 4000) return '#00d46a';
  if (yield_val >= 3500) return '#00b359';
  if (yield_val >= 3000) return '#007a3d';
  return '#003d1f';
};

export default function IndiaMap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="map" className="relative py-24 overflow-hidden" ref={ref}>
      <hr className="neon-divider" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0,255,136,0.03) 0%, transparent 70%)' }}
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
            <FiMap className="text-[#00ff88]" />
            Geospatial Analytics
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Poppins,sans-serif' }}>
            India <span className="gradient-text">Crop Yield Map</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            State-wise crop production analytics with interactive heatmap visualization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 map-container"
            style={{ height: 480 }}
          >
            <MapContainer
              center={[22.5, 82]}
              zoom={4}
              style={{ width: '100%', height: '100%', background: '#030b05' }}
              zoomControl={true}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
              />
            </MapContainer>
          </motion.div>

          {/* State rankings */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div className="glass rounded-2xl p-5 flex-1" style={{ border: '1px solid rgba(0,255,136,0.12)' }}>
              <h3 className="text-base font-bold text-white mb-5">Top States by Yield</h3>
              <div className="flex flex-col gap-3">
                {stateYieldData.slice(0, 8).map(({ state, yield: yld, crop }, i) => (
                  <motion.div
                    key={state}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black"
                      style={{
                        background: i < 3 ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)',
                        color: i < 3 ? '#00ff88' : '#8ba899',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{state}</div>
                      <div className="text-xs text-gray-500">{crop}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: getColor(yld) }}>
                        {yld.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">kg/ha</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Color legend */}
            <div className="glass rounded-xl p-4" style={{ border: '1px solid rgba(0,255,136,0.1)' }}>
              <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Yield Legend</h4>
              <div className="flex flex-col gap-2">
                {[
                  { color: '#00ff88', label: '4500+ kg/ha', level: 'Excellent' },
                  { color: '#00d46a', label: '4000–4500', level: 'Good' },
                  { color: '#00b359', label: '3500–4000', level: 'Average' },
                  { color: '#007a3d', label: '3000–3500', level: 'Below Avg' },
                  { color: '#003d1f', label: 'Below 3000', level: 'Low' },
                ].map(({ color, label, level }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded" style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className="text-xs text-gray-600 ml-auto">{level}</span>
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
