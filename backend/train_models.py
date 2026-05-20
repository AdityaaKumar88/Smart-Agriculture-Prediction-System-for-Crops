"""
train_models.py — Train & Save Real ML Models for Precision Agriculture AI
=========================================================================
Run once before starting the FastAPI server:
    python train_models.py

Outputs:
    models/xgboost_yield.pkl          — XGBoost crop yield regressor
    models/rf_crop_recommender.pkl    — Random Forest crop classifier
    models/label_encoder_crop.pkl     — LabelEncoder for crop names
    models/feature_scaler.pkl         — StandardScaler for features
    models/model_metrics.json         — RMSE, MAE, R², accuracy per crop

Dataset: Synthetic but statistically realistic data based on
         Kaggle Crop Yield Dataset (India) structure.
         Replace generate_dataset() with pd.read_csv('your_dataset.csv')
         to use a real dataset.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path

from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score,
    accuracy_score, classification_report,
)
from xgboost import XGBRegressor

# ─── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(exist_ok=True)


# ─── 1. Dataset Generation ─────────────────────────────────────────────────────

def generate_dataset(n_samples: int = 8000) -> pd.DataFrame:
    """
    Generates a statistically realistic synthetic crop yield dataset.
    Structure mirrors the Kaggle Crop Yield Prediction Dataset (India).

    Replace this function body with:
        df = pd.read_csv('data/crop_yield_india.csv')
        return df
    to use a real dataset.
    """
    rng = np.random.default_rng(42)

    crop_profiles = {
        # crop: (base_yield, N_mean, N_std, P_mean, P_std, K_mean, K_std,
        #         pH_mean, pH_std, temp_mean, temp_std, rain_mean, rain_std, hum_mean, hum_std)
        "Wheat":     (4500, 90,  20, 60, 15, 70, 18, 6.8, 0.4, 22, 4,  80, 20, 60, 12),
        "Rice":      (4200, 80,  18, 50, 12, 60, 15, 6.5, 0.4, 28, 3, 200, 50, 75, 10),
        "Maize":     (3900, 85,  22, 55, 14, 65, 16, 6.6, 0.4, 26, 4, 100, 30, 65, 12),
        "Sugarcane": (8500, 120, 25, 80, 20, 90, 22, 6.9, 0.5, 30, 3, 150, 40, 70, 10),
        "Cotton":    (2100, 75,  18, 45, 12, 55, 14, 7.2, 0.5, 32, 3,  60, 20, 55, 12),
        "Soybean":   (2800, 40,  12, 60, 15, 50, 13, 6.5, 0.4, 25, 4, 100, 25, 65, 10),
        "Groundnut": (2400, 35,  10, 55, 13, 45, 12, 6.4, 0.4, 28, 3,  70, 20, 60, 12),
        "Mustard":   (1800, 70,  16, 40, 11, 45, 12, 7.0, 0.5, 20, 5,  40, 15, 55, 10),
        "Barley":    (3200, 65,  15, 35, 10, 40, 11, 6.7, 0.4, 18, 5,  50, 18, 55, 12),
        "Potato":    (22000, 100, 22, 70, 18, 80, 20, 6.3, 0.4, 20, 4, 100, 30, 70, 10),
    }

    records = []
    samples_per_crop = n_samples // len(crop_profiles)

    for crop, params in crop_profiles.items():
        (base_yield, n_m, n_s, p_m, p_s, k_m, k_s,
         ph_m, ph_s, t_m, t_s, r_m, r_s, h_m, h_s) = params

        n = rng.normal(n_m, n_s, samples_per_crop).clip(0, 200)
        p = rng.normal(p_m, p_s, samples_per_crop).clip(0, 200)
        k = rng.normal(k_m, k_s, samples_per_crop).clip(0, 200)
        ph = rng.normal(ph_m, ph_s, samples_per_crop).clip(4.0, 9.5)
        temp = rng.normal(t_m, t_s, samples_per_crop).clip(5, 50)
        rain = rng.normal(r_m, r_s, samples_per_crop).clip(0, 500)
        humidity = rng.normal(h_m, h_s, samples_per_crop).clip(0, 100)

        # Yield is a function of inputs (realistic feature relationships)
        npk_score = (n / n_m) * 0.35 + (p / p_m) * 0.30 + (k / k_m) * 0.25
        ph_penalty = 1.0 - np.abs(ph - ph_m) * 0.08
        rain_factor = np.clip(rain / r_m, 0.6, 1.3)
        temp_factor = 1.0 - np.abs(temp - t_m) * 0.01
        noise = rng.normal(1.0, 0.06, samples_per_crop)

        yield_kg_ha = (
            base_yield * npk_score * ph_penalty * rain_factor * temp_factor * noise
        ).clip(base_yield * 0.3, base_yield * 1.6)

        for i in range(samples_per_crop):
            records.append({
                "nitrogen": round(n[i], 1),
                "phosphorus": round(p[i], 1),
                "potassium": round(k[i], 1),
                "ph": round(ph[i], 2),
                "temperature": round(temp[i], 1),
                "rainfall": round(rain[i], 1),
                "humidity": round(humidity[i], 1),
                "crop": crop,
                "yield_kg_ha": round(yield_kg_ha[i], 0),
            })

    df = pd.DataFrame(records).sample(frac=1, random_state=42).reset_index(drop=True)
    print(f"✅ Dataset: {len(df)} samples, {df['crop'].nunique()} crops")
    print(df.groupby("crop")["yield_kg_ha"].agg(["mean", "std"]).round(0))
    return df


# ─── 2. Feature Engineering ────────────────────────────────────────────────────

FEATURE_COLS = [
    "nitrogen", "phosphorus", "potassium",
    "ph", "temperature", "rainfall", "humidity",
    # Derived features
    "npk_sum", "npk_ratio_nk", "ph_deviation", "rain_temp_ratio",
]


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add derived features that improve model accuracy."""
    df = df.copy()
    df["npk_sum"] = df["nitrogen"] + df["phosphorus"] + df["potassium"]
    df["npk_ratio_nk"] = df["nitrogen"] / (df["potassium"] + 1)
    df["ph_deviation"] = np.abs(df["ph"] - 6.5)          # distance from neutral
    df["rain_temp_ratio"] = df["rainfall"] / (df["temperature"] + 1)
    return df


# ─── 3. Train XGBoost Yield Regressor ─────────────────────────────────────────

def train_xgboost(df: pd.DataFrame, scaler: StandardScaler, le: LabelEncoder):
    """Train XGBRegressor for yield prediction."""
    print("\n" + "═" * 60)
    print("Training XGBoost Yield Regressor...")

    df = engineer_features(df)

    # Encode crop as numeric for XGBoost
    df["crop_enc"] = le.transform(df["crop"])
    feature_cols = FEATURE_COLS + ["crop_enc"]

    X = df[feature_cols]
    y = df["yield_kg_ha"]

    X_scaled_base = scaler.transform(df[FEATURE_COLS])
    X_scaled = np.hstack([X_scaled_base, df[["crop_enc"]].values])

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    model = XGBRegressor(
        n_estimators=400,
        learning_rate=0.05,
        max_depth=7,
        subsample=0.85,
        colsample_bytree=0.85,
        min_child_weight=3,
        reg_alpha=0.1,
        reg_lambda=1.0,
        random_state=42,
        n_jobs=-1,
        eval_metric="rmse",
        early_stopping_rounds=30,
    )

    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=50,
    )

    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"\n📊 XGBoost Results:")
    print(f"   RMSE : {rmse:.2f} kg/ha")
    print(f"   MAE  : {mae:.2f} kg/ha")
    print(f"   R²   : {r2:.4f}")

    # Per-crop RMSE
    df_test = df.iloc[X_train.shape[0]:].copy()
    df_test["predicted"] = y_pred
    per_crop = {}
    for crop in df["crop"].unique():
        mask = df_test["crop"] == crop
        if mask.sum() > 5:
            c_rmse = np.sqrt(mean_squared_error(
                df_test.loc[mask, "yield_kg_ha"],
                df_test.loc[mask, "predicted"]
            ))
            per_crop[crop] = round(c_rmse, 1)
    print(f"   Per-crop RMSE: {per_crop}")

    path = MODELS_DIR / "xgboost_yield.pkl"
    joblib.dump(model, path, compress=3)
    print(f"💾 Saved → {path}")

    return model, {"rmse": round(rmse, 2), "mae": round(mae, 2), "r2": round(r2, 4), "per_crop_rmse": per_crop}


# ─── 4. Train Random Forest Crop Classifier ───────────────────────────────────

def train_rf_classifier(df: pd.DataFrame, scaler: StandardScaler, le: LabelEncoder):
    """Train RandomForestClassifier for crop recommendation."""
    print("\n" + "═" * 60)
    print("Training Random Forest Crop Classifier...")

    df = engineer_features(df)

    X = df[FEATURE_COLS]
    y = le.transform(df["crop"])

    X_scaled = scaler.transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_split=4,
        min_samples_leaf=2,
        max_features="sqrt",
        n_jobs=-1,
        random_state=42,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\n📊 Random Forest Results:")
    print(f"   Accuracy: {acc * 100:.2f}%")
    print(classification_report(
        y_test, y_pred,
        target_names=le.classes_,
        zero_division=0,
    ))

    # 5-fold CV
    cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring="accuracy", n_jobs=-1)
    print(f"   CV Accuracy: {cv_scores.mean() * 100:.2f}% ± {cv_scores.std() * 100:.2f}%")

    path = MODELS_DIR / "rf_crop_recommender.pkl"
    joblib.dump(model, path, compress=3)
    print(f"💾 Saved → {path}")

    return model, {"accuracy": round(acc * 100, 2), "cv_mean": round(cv_scores.mean() * 100, 2)}


# ─── 5. Fit & Save Scaler + LabelEncoder ──────────────────────────────────────

def fit_preprocessors(df: pd.DataFrame):
    df = engineer_features(df)

    le = LabelEncoder()
    le.fit(df["crop"])
    joblib.dump(le, MODELS_DIR / "label_encoder_crop.pkl", compress=3)
    print(f"💾 LabelEncoder saved  → classes: {list(le.classes_)}")

    # Fit scaler on ALL features (XGB uses crop_enc, RF uses without it)
    X_all = df[FEATURE_COLS]
    scaler = StandardScaler()
    scaler.fit(X_all)
    joblib.dump(scaler, MODELS_DIR / "feature_scaler.pkl", compress=3)
    print(f"💾 StandardScaler saved → {len(FEATURE_COLS)} features")

    return scaler, le


# ─── 6. Main ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 60)
    print("  Precision Agriculture AI — Model Training Pipeline")
    print("=" * 60)

    # Generate / load dataset
    df = generate_dataset(n_samples=10000)

    # Fit preprocessors first (needed before training)
    scaler, le = fit_preprocessors(df)

    # Train both models
    xgb_model, xgb_metrics = train_xgboost(df, scaler, le)
    rf_model, rf_metrics = train_rf_classifier(df, scaler, le)

    # Save consolidated metrics
    metrics = {
        "xgboost_yield": xgb_metrics,
        "rf_crop_classifier": rf_metrics,
        "feature_columns": FEATURE_COLS,
        "crops": list(le.classes_),
        "n_training_samples": len(df),
    }
    metrics_path = MODELS_DIR / "model_metrics.json"
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"\n💾 Metrics saved → {metrics_path}")

    print("\n" + "=" * 60)
    print("✅ All models trained and saved to ./models/")
    print("   Now run: python main.py  (or uvicorn main:app --reload)")
    print("=" * 60)
