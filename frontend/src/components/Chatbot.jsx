import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiMic } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import { GiWheat } from 'react-icons/gi';
import { aiChatResponses } from '../utils/mockData';

const suggestedPrompts = [
  "How to grow wheat in Punjab?",
  "What fertilizer for low nitrogen soil?",
  "Pest control for rice crops",
  "Best crops for summer season",
  "How to improve soil pH?",
];

const getAIResponse = (message) => {
  const lower = message.toLowerCase();
  for (const { trigger, response } of aiChatResponses) {
    if (trigger.some((t) => lower.includes(t))) return response;
  }
  return `🤖 **AgriAI Response:**\n\nThank you for your question about **"${message}"**.\n\nBased on your location and soil data:\n- Current soil NPK levels are moderate (N:72, P:58, K:81)\n- Temperature is optimal for most rabi crops\n- Rainfall forecast shows adequate moisture this week\n\n**Recommendation:** Monitor your crop closely and consider consulting your local Krishi Vigyan Kendra (KVK) for region-specific advice. I can analyze your specific soil report if you upload it! 🌱`;
};

const MessageBubble = ({ msg }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
  >
    {msg.role === 'ai' && (
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center flex-shrink-0 mb-1" style={{ boxShadow: '0 0 10px rgba(0,255,136,0.3)' }}>
        <GiWheat size={14} className="text-black" />
      </div>
    )}
    <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
      <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: '#e8fff2' }}>
        {msg.content}
      </p>
      <div className="text-xs text-gray-600 mt-1.5 text-right">{msg.time}</div>
    </div>
  </motion.div>
);

const TypingIndicator = () => (
  <div className="flex items-end gap-2">
    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center" style={{ boxShadow: '0 0 10px rgba(0,255,136,0.3)' }}>
      <GiWheat size={14} className="text-black" />
    </div>
    <div className="chat-bubble-ai">
      <div className="flex gap-1.5 items-center h-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: '🌾 Namaste! I\'m **AgriAI**, your intelligent farming assistant.\n\nI can help you with:\n• Crop selection & planning\n• Soil health & fertilizers\n• Pest & disease management\n• Weather-based farming tips\n\nAsk me anything about agriculture!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { role: 'user', content: msg, time }]);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    setTyping(false);
    setMessages((prev) => [
      ...prev,
      { role: 'ai', content: getAIResponse(msg), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
  };

  return (
    <>
      {/* Section anchor */}
      <div id="chatbot" className="sr-only" />

      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: open ? 'rgba(0,50,20,0.9)' : 'linear-gradient(135deg, #00ff88, #00b359)',
          boxShadow: open ? '0 0 20px rgba(0,255,136,0.2)' : '0 0 30px rgba(0,255,136,0.6), 0 4px 20px rgba(0,0,0,0.4)',
          border: '1.5px solid rgba(0,255,136,0.3)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: open
          ? '0 0 20px rgba(0,255,136,0.2)'
          : ['0 0 20px rgba(0,255,136,0.4)', '0 0 40px rgba(0,255,136,0.8)', '0 0 20px rgba(0,255,136,0.4)']
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <FiX size={22} style={{ color: '#00ff88' }} />
              </motion.span>
            : <motion.span key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                <BsRobot size={22} className="text-black" />
              </motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] max-h-[600px] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(3, 11, 5, 0.96)',
              border: '1px solid rgba(0,255,136,0.2)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,255,136,0.1)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 p-4 border-b"
              style={{ borderColor: 'rgba(0,255,136,0.12)', background: 'rgba(0,255,136,0.04)' }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(0,255,136,0.4)' }}>
                  <GiWheat className="text-black text-lg" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00ff88] rounded-full border-2 border-[#030b05] animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">AgriAI Assistant</div>
                <div className="text-xs text-[#00ff88]">● Online • Powered by LangChain + Ollama</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-300 transition-colors p-1">
                <FiX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ maxHeight: 380 }}>
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {typing && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length < 3 && (
              <div className="px-4 pb-2">
                <div className="text-xs text-gray-600 mb-2">Suggested questions:</div>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.slice(0, 3).map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all hover:border-[#00ff88] hover:text-[#00ff88]"
                      style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)', color: '#8ba899' }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 pt-2 border-t" style={{ borderColor: 'rgba(0,255,136,0.1)' }}>
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)' }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about farming, crops, soil..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-600"
                />
                <button
                  className="text-gray-600 hover:text-gray-400 transition-colors p-1"
                  title="Voice input (coming soon)"
                >
                  <FiMic size={16} />
                </button>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg, #00ff88, #00b359)', color: '#000' }}
                >
                  <FiSend size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
