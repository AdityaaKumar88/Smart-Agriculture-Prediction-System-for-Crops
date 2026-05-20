# Precision Agriculture AI

> **Crop Yield Prediction and Advisory System** — India's most advanced AI-powered smart farming platform.

---

## 🚀 Quick Start

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# → Opens at http://localhost:5173
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
# → API at http://localhost:8000
# → Swagger docs at http://localhost:8000/docs
```

### Streamlit Admin Panel
```bash
cd backend
pip install streamlit
streamlit run streamlit_app.py
# → Admin panel at http://localhost:8501
```

---

## 📁 Project Structure

```
Crop Project/
├── frontend/                     # React + Vite App
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Sticky futuristic navbar
│   │   │   ├── Hero.jsx            # Hero with particles & floating icons
│   │   │   ├── Features.jsx        # 4 glassmorphism feature cards
│   │   │   ├── CropYield.jsx       # AI prediction module + charts
│   │   │   ├── SoilHealth.jsx      # Soil analysis + radar + progress
│   │   │   ├── Weather.jsx         # 7-day weather forecast
│   │   │   ├── IndiaMap.jsx        # React Leaflet crop yield map
│   │   │   ├── Analytics.jsx       # Full analytics dashboard
│   │   │   ├── Chatbot.jsx         # Floating AI chatbot
│   │   │   ├── Footer.jsx          # Dark glassmorphism footer
│   │   │   └── CustomCursor.jsx    # Neon cursor with trailing ring
│   │   ├── utils/
│   │   │   └── mockData.js         # All mock datasets & AI responses
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Glassmorphism, neon, animations
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                      # Python FastAPI
│   ├── main.py                     # All 5 API endpoints
│   ├── streamlit_app.py            # Admin panel (6 pages)
│   └── requirements.txt
```

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary Color | `#00ff88` (Neon Green) |
| Background | `#030b05` (Deep Black-Green) |
| Card Background | `rgba(0,255,136,0.04)` |
| Card Border | `rgba(0,255,136,0.12)` |
| Fonts | Poppins (headings), Inter (body) |
| Border Radius | 16px cards, 8px inputs |

---

## 🤖 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | Model status |
| POST | `/predict-yield` | XGBoost yield prediction |
| POST | `/soil-analysis` | Soil health + fertilizer recs |
| GET | `/weather?state=Punjab` | 7-day weather forecast |
| POST | `/chatbot` | LangChain + Ollama AI chat |
| POST | `/crop-recommendation` | Random Forest crop suggestion |

### Example: Predict Yield
```bash
curl -X POST http://localhost:8000/predict-yield \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 80, "phosphorus": 60, "potassium": 70,
    "ph": 6.5, "temperature": 28, "rainfall": 80,
    "humidity": 65, "state": "Punjab", "crop": "Wheat"
  }'
```

---

## ✨ Features Implemented

### Frontend
- [x] Hero section with animated particles & floating agri icons
- [x] Smart features section (4 glassmorphism cards)
- [x] Crop yield prediction form + XGBoost results + charts
- [x] Soil health analysis: nutrient bars, radar chart, circular progress, fertilizer AI
- [x] Weather module: main card, 7-day forecast, area charts, AI seasonal tip
- [x] India crop yield map (React Leaflet + dark tile layer)
- [x] Analytics dashboard: stat cards, area chart, pie chart, bar chart, line chart
- [x] Floating AI chatbot (LangChain + Ollama mockup with typing animation)
- [x] Sticky responsive navbar with scroll-aware active state
- [x] Mobile hamburger menu
- [x] Dark glassmorphism footer with social links
- [x] Custom neon cursor with trailing ring
- [x] Framer Motion animations throughout
- [x] Fully responsive (Desktop / Tablet / Mobile)

### Backend
- [x] FastAPI with CORS configured
- [x] XGBoost yield prediction simulation
- [x] Random Forest crop recommendation
- [x] Soil health analysis + fertilizer engine
- [x] Weather API (NOAA mock — ready for real key)
- [x] LangChain + Ollama chatbot (mockup — ready for real Ollama)
- [x] Pydantic v2 schemas + validation
- [x] Swagger UI at `/docs`

### Streamlit Admin
- [x] Dashboard Overview with metrics
- [x] ML Model Monitoring (RMSE, MAE, R², accuracy per crop)
- [x] Dataset Upload & retraining simulation
- [x] Prediction Analytics with filtering
- [x] Accuracy Visualization (confusion matrix)
- [x] AI Chatbot Query Logs

---

## 🔧 Production Upgrades

To make this fully production-ready:

1. **Real ML Models:** Replace simulation with trained XGBoost/RF models
   ```python
   import joblib
   model = joblib.load('models/xgboost_yield.pkl')
   prediction = model.predict(features)
   ```

2. **Real Weather API:** Add NOAA or OpenWeatherMap key
   ```python
   WEATHER_API_KEY = os.getenv("NOAA_API_KEY")
   ```

3. **Real LangChain + Ollama:**
   ```python
   from langchain_community.llms import Ollama
   llm = Ollama(model="llama3")
   chain = ConversationChain(llm=llm)
   response = chain.predict(input=message)
   ```

4. **Database:** Add PostgreSQL or Supabase for prediction logs

5. **India Map GeoJSON:** Add state-level GeoJSON for heatmap coloring

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 8 |
| Styling | Tailwind CSS v4 + Custom CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| Map | React Leaflet |
| Icons | React Icons |
| Backend | FastAPI + Uvicorn |
| ML | XGBoost + Scikit-learn (simulated) |
| AI Chat | LangChain + Ollama (simulated) |
| Admin | Streamlit |
| Data | Pandas + NumPy |
