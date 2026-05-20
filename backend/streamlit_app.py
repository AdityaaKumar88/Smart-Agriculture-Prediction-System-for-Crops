"""
Precision Agriculture AI — Streamlit Admin Panel
Run: streamlit run streamlit_app.py
"""
import streamlit as st
import pandas as pd
import numpy as np
import json
import random
from datetime import datetime, timedelta

# ─── Page Config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="AgriAI Admin Panel",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── Custom CSS ───────────────────────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
    .stApp { background: #030b05; color: #e8fff2; }
    
    .metric-card {
        background: rgba(0,255,136,0.06);
        border: 1px solid rgba(0,255,136,0.18);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
    }
    .metric-value { font-size: 2rem; font-weight: 800; color: #00ff88; }
    .metric-label { font-size: 0.8rem; color: #8ba899; margin-top: 4px; }
    
    [data-testid="stSidebar"] { background: rgba(0,20,8,0.98) !important; border-right: 1px solid rgba(0,255,136,0.1); }
    [data-testid="stSidebar"] * { color: #e8fff2 !important; }
    
    .stDataFrame { border: 1px solid rgba(0,255,136,0.15); border-radius: 8px; }
    
    div[data-testid="metric-container"] {
        background: rgba(0,255,136,0.05);
        border: 1px solid rgba(0,255,136,0.15);
        border-radius: 10px;
        padding: 12px;
    }
</style>
""", unsafe_allow_html=True)

# ─── Sidebar ──────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🌾 AgriAI Admin")
    st.markdown("---")
    page = st.selectbox("Navigation", [
        "📊 Dashboard Overview",
        "🤖 Model Monitoring",
        "📤 Dataset Upload",
        "📈 Prediction Analytics",
        "🎯 Accuracy Visualization",
        "💬 Query Logs",
    ])
    st.markdown("---")
    st.markdown("**System Status**")
    st.success("✅ API Online")
    st.success("✅ Models Loaded")
    st.warning("⚠️ NOAA API: Mock Mode")
    st.success("✅ Database: Connected")
    st.markdown("---")
    st.caption(f"Last updated: {datetime.now().strftime('%H:%M:%S')}")

# ─── Mock Data Generation ─────────────────────────────────────────────────────
@st.cache_data
def generate_prediction_logs():
    crops = ["Wheat", "Rice", "Maize", "Soybean", "Cotton", "Sugarcane"]
    states = ["Punjab", "Haryana", "UP", "Maharashtra", "Gujarat", "WB"]
    logs = []
    for i in range(150):
        date = datetime.now() - timedelta(hours=random.randint(1, 720))
        logs.append({
            "ID": f"PRED-{1000+i}",
            "Timestamp": date.strftime("%Y-%m-%d %H:%M"),
            "Crop": random.choice(crops),
            "State": random.choice(states),
            "Predicted Yield (kg/ha)": random.randint(2500, 6000),
            "Confidence (%)": round(random.uniform(82, 98), 1),
            "N": random.randint(50, 150),
            "P": random.randint(30, 120),
            "K": random.randint(40, 130),
            "pH": round(random.uniform(5.5, 8.0), 1),
        })
    return pd.DataFrame(logs)


@st.cache_data
def generate_model_metrics():
    return {
        "XGBoost Yield": {"RMSE": 248.3, "MAE": 185.6, "R2": 0.942, "Accuracy": "94.2%"},
        "Random Forest Crop": {"RMSE": None, "MAE": None, "R2": None, "Accuracy": "91.3%"},
        "Soil Analyzer": {"RMSE": 8.4, "MAE": 5.2, "R2": 0.886, "Accuracy": "88.6%"},
    }


# ─── Pages ────────────────────────────────────────────────────────────────────

if "Dashboard" in page:
    st.title("📊 Dashboard Overview")
    st.markdown("Real-time monitoring of the Precision Agriculture AI platform.")

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Predictions", "12,847", "+234 today")
    with col2:
        st.metric("Active Users", "3,294", "+18 today")
    with col3:
        st.metric("Model Accuracy", "94.7%", "+0.3%")
    with col4:
        st.metric("Acres Monitored", "28,500", "+650 new")

    st.markdown("---")
    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Predictions by Crop (Last 30 Days)")
        crop_data = pd.DataFrame({
            "Crop": ["Wheat", "Rice", "Maize", "Sugarcane", "Cotton", "Other"],
            "Predictions": [4231, 3180, 2100, 1520, 980, 836],
        })
        st.bar_chart(crop_data.set_index("Crop"), color="#00ff88")

    with col2:
        st.subheader("Daily Prediction Volume (Last 14 Days)")
        dates = pd.date_range(end=datetime.now(), periods=14)
        vol = pd.DataFrame({
            "Date": dates,
            "Predictions": [random.randint(280, 650) for _ in range(14)],
        })
        st.line_chart(vol.set_index("Date"), color="#00ff88")


elif "Model Monitoring" in page:
    st.title("🤖 ML Model Monitoring")

    metrics = generate_model_metrics()
    for model_name, m in metrics.items():
        with st.expander(f"📦 {model_name}", expanded=True):
            cols = st.columns(4)
            cols[0].metric("Accuracy", m["Accuracy"])
            if m["RMSE"]:
                cols[1].metric("RMSE", m["RMSE"])
                cols[2].metric("MAE", m["MAE"])
                cols[3].metric("R²", m["R2"])
            else:
                cols[1].info("Classification model — RMSE not applicable")

    st.markdown("---")
    st.subheader("Model Accuracy Trend Over Time")
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    acc_data = pd.DataFrame({
        "Month": months,
        "XGBoost": [88, 89.5, 91, 92.3, 91.8, 93.2, 92.9, 94.1, 93.5, 94.7, 95.2, 94.9],
        "Random Forest": [82, 83, 85, 86.5, 87, 88.2, 88.8, 89.5, 90.1, 91.3, 91.8, 91.3],
    })
    st.line_chart(acc_data.set_index("Month"))


elif "Dataset Upload" in page:
    st.title("📤 Dataset Upload & Management")
    st.markdown("Upload new crop yield datasets or soil health data to retrain models.")

    tab1, tab2, tab3 = st.tabs(["Upload Dataset", "View Current Dataset", "Data Quality Check"])

    with tab1:
        st.subheader("Upload CSV Dataset")
        col1, col2 = st.columns(2)
        with col1:
            dataset_type = st.selectbox("Dataset Type", [
                "Crop Yield Dataset (Kaggle)",
                "Soil Health Data (UCI)",
                "Weather Data (NOAA)",
                "Pest/Disease Records",
            ])
        with col2:
            model_target = st.selectbox("Target Model", [
                "XGBoost Yield Predictor",
                "Random Forest Classifier",
                "Soil Analyzer",
            ])

        uploaded = st.file_uploader("Upload CSV file", type=["csv"])
        if uploaded:
            df = pd.read_csv(uploaded)
            st.success(f"✅ Uploaded {len(df)} rows, {len(df.columns)} columns")
            st.dataframe(df.head(10))
            if st.button("🚀 Retrain Model with New Data", type="primary"):
                with st.spinner("Training model... (this is a simulation)"):
                    import time
                    time.sleep(2)
                st.success("✅ Model retrained successfully! New accuracy: 95.1%")
        else:
            st.info("📂 Drag and drop a CSV file to upload dataset")

    with tab2:
        st.subheader("Current Training Dataset")
        logs = generate_prediction_logs()
        st.dataframe(logs.head(30), use_container_width=True)
        st.caption(f"Showing 30 of {len(logs)} records")

    with tab3:
        st.subheader("Data Quality Report")
        col1, col2, col3 = st.columns(3)
        col1.metric("Missing Values", "0.3%", "-0.1%")
        col2.metric("Outliers Detected", "47 rows", "-12")
        col3.metric("Data Freshness", "2 hours ago", "")
        st.info("✅ Dataset quality score: 96.8/100 — Excellent quality for model training.")


elif "Prediction Analytics" in page:
    st.title("📈 Prediction Analytics")

    logs = generate_prediction_logs()

    col1, col2 = st.columns([1, 2])
    with col1:
        st.subheader("Filter Options")
        selected_crops = st.multiselect("Crops", logs["Crop"].unique(), default=list(logs["Crop"].unique()[:3]))
        selected_states = st.multiselect("States", logs["State"].unique(), default=list(logs["State"].unique()[:2]))

    filtered = logs[logs["Crop"].isin(selected_crops) & logs["State"].isin(selected_states)]

    with col2:
        st.subheader(f"Showing {len(filtered)} predictions")
        st.dataframe(filtered.head(25), use_container_width=True)

    st.markdown("---")
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Avg Yield by Crop")
        avg_yield = filtered.groupby("Crop")["Predicted Yield (kg/ha)"].mean().reset_index()
        st.bar_chart(avg_yield.set_index("Crop"), color="#00ff88")

    with col2:
        st.subheader("Confidence Distribution")
        conf_hist = pd.DataFrame({"Confidence": filtered["Confidence (%)"].values})
        st.area_chart(conf_hist, color="#00ff88")


elif "Accuracy Visualization" in page:
    st.title("🎯 Accuracy Visualization")

    st.subheader("Per-Crop RMSE Analysis")
    rmse_data = pd.DataFrame({
        "Crop": ["Wheat", "Rice", "Maize", "Sugarcane", "Cotton", "Soybean", "Groundnut"],
        "RMSE (kg/ha)": [185, 220, 260, 420, 310, 195, 175],
        "MAE (kg/ha)": [140, 175, 205, 340, 245, 150, 130],
        "R²": [0.956, 0.934, 0.918, 0.902, 0.921, 0.948, 0.961],
    })
    st.dataframe(rmse_data, use_container_width=True)
    st.bar_chart(rmse_data.set_index("Crop")[["RMSE (kg/ha)", "MAE (kg/ha)"]])

    st.markdown("---")
    st.subheader("Confusion Matrix: Crop Recommendation (Random Forest)")
    crops = ["Wheat", "Rice", "Maize", "Cotton", "Soybean"]
    matrix = np.array([
        [145, 8, 4, 2, 1],
        [6, 132, 7, 3, 2],
        [5, 9, 118, 6, 2],
        [2, 3, 5, 108, 2],
        [1, 2, 3, 4, 95],
    ])
    conf_df = pd.DataFrame(matrix, index=crops, columns=crops)
    st.dataframe(conf_df.style.background_gradient(cmap="Greens"), use_container_width=True)


elif "Query Logs" in page:
    st.title("💬 AI Chatbot Query Logs")

    sample_queries = [
        {"Time": "18:45:12", "Session": "USER-001", "Query": "How to treat wheat rust disease?", "Response Time": "1.2s", "Model": "llama3"},
        {"Time": "18:32:05", "Session": "USER-002", "Query": "Best fertilizer for low nitrogen soil", "Response Time": "0.9s", "Model": "llama3"},
        {"Time": "18:20:44", "Session": "USER-003", "Query": "Rice cultivation in West Bengal?", "Response Time": "1.4s", "Model": "llama3"},
        {"Time": "18:15:30", "Session": "USER-001", "Query": "Pest control for cotton bollworm", "Response Time": "1.1s", "Model": "llama3"},
        {"Time": "18:05:18", "Session": "USER-004", "Query": "Irrigation schedule for sugarcane", "Response Time": "0.8s", "Model": "llama3"},
    ]

    col1, col2, col3 = st.columns(3)
    col1.metric("Total Queries Today", "247", "+42")
    col2.metric("Avg Response Time", "1.1s", "-0.1s")
    col3.metric("User Satisfaction", "94%", "+2%")

    st.markdown("---")
    st.subheader("Recent Query Logs")
    df_queries = pd.DataFrame(sample_queries)
    st.dataframe(df_queries, use_container_width=True)

    st.subheader("Query Categories")
    cat_data = pd.DataFrame({
        "Category": ["Crop Management", "Soil & Fertilizer", "Pest/Disease", "Weather", "Irrigation", "Other"],
        "Count": [78, 65, 42, 31, 18, 13],
    })
    st.bar_chart(cat_data.set_index("Category"), color="#00ff88")

st.markdown("---")
st.caption("🌾 Precision Agriculture AI — Admin Panel v1.0 | Built with Streamlit + FastAPI + XGBoost")
