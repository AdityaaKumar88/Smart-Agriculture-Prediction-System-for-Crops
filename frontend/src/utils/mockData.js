// Mock data for the entire application
export const mockWeatherData = {
  location: "Punjab, India",
  temperature: 28,
  humidity: 65,
  rainfall: 12,
  windSpeed: 14,
  condition: "Partly Cloudy",
  uvIndex: 7,
  forecast: [
    { day: "Mon", high: 30, low: 22, condition: "Sunny", rain: 0 },
    { day: "Tue", high: 28, low: 20, condition: "Cloudy", rain: 20 },
    { day: "Wed", high: 25, low: 18, condition: "Rainy", rain: 85 },
    { day: "Thu", high: 27, low: 21, condition: "Partly Cloudy", rain: 30 },
    { day: "Fri", high: 31, low: 23, condition: "Sunny", rain: 5 },
    { day: "Sat", high: 32, low: 24, condition: "Sunny", rain: 0 },
    { day: "Sun", high: 29, low: 22, condition: "Cloudy", rain: 15 },
  ],
};

export const mockSoilData = {
  nitrogen: 72,
  phosphorus: 58,
  potassium: 81,
  ph: 6.8,
  moisture: 65,
  organicMatter: 4.2,
  fertility: 78,
  recommendations: [
    { type: "Urea", amount: "25 kg/acre", priority: "High" },
    { type: "DAP", amount: "15 kg/acre", priority: "Medium" },
    { type: "MOP", amount: "10 kg/acre", priority: "Low" },
    { type: "Gypsum", amount: "50 kg/acre", priority: "Medium" },
  ],
};

export const mockYieldData = {
  predictedYield: 4850,
  unit: "kg/hectare",
  confidence: 92,
  bestCrop: "Wheat",
  alternativeCrops: ["Rice", "Sugarcane", "Soybean"],
  yieldHistory: [
    { year: "2020", yield: 3800 },
    { year: "2021", yield: 4100 },
    { year: "2022", yield: 4400 },
    { year: "2023", yield: 4600 },
    { year: "2024", yield: 4750 },
    { year: "2025", yield: 4850 },
  ],
  cropComparison: [
    { crop: "Wheat", yield: 4850 },
    { crop: "Rice", yield: 4200 },
    { crop: "Maize", yield: 3900 },
    { crop: "Sugarcane", yield: 3600 },
    { crop: "Soybean", yield: 3100 },
  ],
};

export const mockAnalyticsData = {
  totalPredictions: 12847,
  activeUsers: 3294,
  cropAccuracy: 94.7,
  areasMonitored: 28500,
  monthlyYield: [
    { month: "Jan", yield: 3200, rainfall: 45, temp: 18 },
    { month: "Feb", yield: 3500, rainfall: 38, temp: 20 },
    { month: "Mar", yield: 4100, rainfall: 62, temp: 25 },
    { month: "Apr", yield: 4400, rainfall: 55, temp: 30 },
    { month: "May", yield: 4800, rainfall: 48, temp: 34 },
    { month: "Jun", yield: 4200, rainfall: 120, temp: 32 },
    { month: "Jul", yield: 3900, rainfall: 180, temp: 30 },
    { month: "Aug", yield: 4000, rainfall: 160, temp: 29 },
    { month: "Sep", yield: 4500, rainfall: 90, temp: 28 },
    { month: "Oct", yield: 4700, rainfall: 55, temp: 26 },
    { month: "Nov", yield: 4300, rainfall: 30, temp: 22 },
    { month: "Dec", yield: 3800, rainfall: 20, temp: 19 },
  ],
  cropDistribution: [
    { name: "Wheat", value: 35, color: "#00ff88" },
    { name: "Rice", value: 28, color: "#00b359" },
    { name: "Maize", value: 18, color: "#00d46a" },
    { name: "Sugarcane", value: 12, color: "#004d26" },
    { name: "Others", value: 7, color: "#007a3d" },
  ],
};

export const stateYieldData = [
  { state: "Punjab", yield: 4850, crop: "Wheat", area: 3500 },
  { state: "Haryana", yield: 4600, crop: "Rice", area: 2800 },
  { state: "Uttar Pradesh", yield: 4200, crop: "Sugarcane", area: 5100 },
  { state: "Maharashtra", yield: 3800, crop: "Cotton", area: 4200 },
  { state: "Gujarat", yield: 3500, crop: "Groundnut", area: 3800 },
  { state: "Rajasthan", yield: 2800, crop: "Bajra", area: 6200 },
  { state: "Madhya Pradesh", yield: 3200, crop: "Soybean", area: 4700 },
  { state: "Karnataka", yield: 3600, crop: "Ragi", area: 3200 },
  { state: "Tamil Nadu", yield: 4100, crop: "Rice", area: 2900 },
  { state: "West Bengal", yield: 4400, crop: "Rice", area: 3100 },
];

export const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

export const cropsList = [
  "Wheat","Rice","Maize","Sugarcane","Cotton","Soybean","Groundnut",
  "Mustard","Barley","Jowar","Bajra","Ragi","Tur Dal","Chana","Sunflower",
  "Turmeric","Ginger","Onion","Potato","Tomato",
];

export const aiChatResponses = [
  {
    trigger: ["wheat", "rabi"],
    response: "🌾 **Wheat Cultivation Tips:**\n\nFor optimal wheat yield:\n- **Sowing time:** Nov 15 – Dec 15 (ideal)\n- **Seed rate:** 100-125 kg/ha\n- **Irrigation:** 5-6 times (CRI, tillering, jointing, flowering, grain filling, maturity)\n- **Fertilizer:** N:P:K = 120:60:40 kg/ha\n\nExpected yield: 4.5-5.5 tonnes/ha with proper care."
  },
  {
    trigger: ["soil", "nutrient", "fertilizer"],
    response: "🧪 **Soil Health Recommendations:**\n\nBased on typical soil analysis:\n- Apply **25 kg Urea/acre** for nitrogen deficiency\n- Use **DAP (Diammonium Phosphate)** for phosphorus\n- Add **organic compost** 2-3 tonnes/ha to improve soil structure\n- Maintain pH between **6.0-7.5** for most crops\n\nTest soil every season for best results!"
  },
  {
    trigger: ["pest", "disease", "insect"],
    response: "🐛 **Pest & Disease Management:**\n\n**Early warning signs:**\n- Yellowing leaves → Nitrogen deficiency or aphids\n- Brown spots → Fungal disease\n- Wilting → Root rot or borers\n\n**Organic remedies:**\n- Neem oil spray (3ml/L water)\n- Trichogramma cards for stem borer\n- Bordeaux mixture for fungal diseases\n\nPrevention is always better than cure!"
  },
];
