"""
scripts/train_delivery_regressor.py
Machine Learning Experiment 2: Regression of Grubhub Delivery Times

Target: delivery_time (numeric continuous minutes)
Models: DummyRegressor (Baseline), Ridge, RandomForestRegressor
"""

import sys
import json
import ast
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

def extract_primary_cuisine(val):
    if pd.isnull(val):
        return 'Other'
    s = str(val).strip()
    try:
        parsed = ast.literal_eval(s)
        if isinstance(parsed, list) and len(parsed) > 0:
            return str(parsed[0]).strip()
    except Exception:
        pass
    cleaned = s.replace('[', '').replace(']', '').replace('"', '').replace("'", '')
    parts = cleaned.split(',')
    return parts[0].strip() if len(parts) > 0 and parts[0].strip() else 'Other'

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    project_dir = Path(__file__).resolve().parent.parent
    data_path = project_dir / 'output' / 'grubhub_cleaned.csv'
    output_dir = project_dir / 'output'
    output_dir.mkdir(parents=True, exist_ok=True)

    print("==================================================================")
    print("🤖 GRUBHUB DELIVERY TIME REGRESSION EXPERIMENT")
    print("==================================================================")

    # 1. Load Data
    print(f"Loading dataset: {data_path}")
    raw_df = pd.read_csv(data_path)
    total_records = len(raw_df)
    print(f"Total rows in raw dataset: {total_records:,}")

    # 2. Filter valid numeric delivery time target
    valid_df = raw_df.dropna(subset=['delivery_time']).copy()
    valid_records = len(valid_df)
    excluded_records = total_records - valid_records
    print(f"Valid delivery time rows: {valid_records:,} (Excluded: {excluded_records:,})")

    # Target statistics
    y = valid_df['delivery_time'].astype(float)
    print("\nTarget (delivery_time in minutes) distribution:")
    print(f"  Mean:   {y.mean():.2f} min")
    print(f"  Std:    {y.std():.2f} min")
    print(f"  Median: {y.median():.2f} min")
    print(f"  Min:    {y.min():.2f} min")
    print(f"  Max:    {y.max():.2f} min")

    # 3. Feature Engineering & Leakage Prevention
    # Strictly exclude raw unparsed strings, IDs, URLs, and phone numbers:
    # ['delivery_time_raw', 'loc_number', 'loc_name', 'url', 'address',
    #  'searched_address', 'searched_zipcode', 'phone', 'RunDate', 'restaurant_tags']
    print("\nExtracting feature predictors (preventing target leakage)...")

    valid_df['primary_cuisine'] = valid_df['cuisines'].apply(extract_primary_cuisine)
    valid_df['is_gh_clean'] = valid_df['is_gh'].fillna('Standard').astype(str).str.strip()
    valid_df['searched_metro_clean'] = valid_df['searched_metro'].fillna('Other').astype(str).str.strip()
    valid_df['delivery_type_clean'] = valid_df['delivery_type'].fillna('Standard').astype(str).str.strip()

    numeric_features = [
        'distance',
        'delivery_fee',
        'service_fee',
        'review_count',
        'review_rating'
    ]
    categorical_features = [
        'searched_metro_clean',
        'is_gh_clean',
        'primary_cuisine',
        'delivery_type_clean'
    ]
    all_features = numeric_features + categorical_features

    X = valid_df[all_features].copy()

    # Fill any subtle nulls in predictors safely
    for col in numeric_features:
        X[col] = X[col].fillna(X[col].median()).astype(float)
    for col in categorical_features:
        X[col] = X[col].fillna('Unknown').astype(str)

    print(f"Features utilized ({len(all_features)}): {all_features}")
    print(f"Numeric features: {numeric_features}")
    print(f"Categorical features: {categorical_features}")

    # 4. Train-Test Split (80/20)
    random_state = 42
    test_size = 0.2
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state
    )
    print(f"\nTrain set: {len(X_train):,} samples | Test set: {len(X_test):,} samples")

    # 5. Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', max_categories=25, sparse_output=False), categorical_features)
        ]
    )

    # 6. Model Definitions
    models = {
        'DummyRegressor': DummyRegressor(strategy='mean'),
        'Ridge': Ridge(alpha=1.0, random_state=random_state),
        'RandomForestRegressor': RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            min_samples_split=8,
            random_state=random_state,
            n_jobs=-1
        )
    }

    results = {}
    best_model_name = None
    best_rmse = float('inf')
    best_pipeline = None
    best_y_pred = None

    print("\nTraining and evaluating regression models...")
    for name, reg in models.items():
        print(f"\n--- Training {name} ---")
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('regressor', reg)
        ])

        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        mae = float(mean_absolute_error(y_test, y_pred))
        mse = float(mean_squared_error(y_test, y_pred))
        rmse = float(np.sqrt(mse))
        r2 = float(r2_score(y_test, y_pred))

        print(f"  MAE:  {mae:.4f} minutes")
        print(f"  MSE:  {mse:.4f}")
        print(f"  RMSE: {rmse:.4f} minutes")
        print(f"  R²:   {r2:.4f}")

        results[name] = {
            'mae': round(mae, 4),
            'mse': round(mse, 4),
            'rmse': round(rmse, 4),
            'r2_score': round(r2, 4),
            'model_type': str(reg.__class__.__name__),
            'parameters': {k: str(v) for k, v in reg.get_params().items() if k in ['strategy', 'alpha', 'n_estimators', 'max_depth', 'min_samples_split']}
        }

        if rmse < best_rmse:
            best_rmse = rmse
            best_model_name = name
            best_pipeline = pipeline
            best_y_pred = y_pred

    print(f"\n🏆 Selected Best Model (lowest RMSE): {best_model_name} (RMSE = {best_rmse:.4f} min)")

    # 7. Regression Evaluation Plot: Actual vs Predicted
    plot_path = output_dir / 'ml_delivery_time_predictions.png'
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5), dpi=150)

    # Subplot 1: Actual vs Predicted
    ax1.scatter(y_test, best_y_pred, alpha=0.35, color='#2563EB', edgecolors='none', s=20)
    min_val = min(y_test.min(), best_y_pred.min())
    max_val = max(y_test.max(), best_y_pred.max())
    ax1.plot([min_val, max_val], [min_val, max_val], 'r--', lw=2, label='Ideal 1:1 Reference')
    ax1.set_xlabel('Actual Delivery Time (minutes)', fontsize=11)
    ax1.set_ylabel('Predicted Delivery Time (minutes)', fontsize=11)
    ax1.set_title(f'Actual vs. Predicted Delivery Time\n({best_model_name}, N = {len(y_test):,})', fontsize=12)
    ax1.legend(loc='upper left')
    ax1.grid(True, alpha=0.3)

    # Subplot 2: Residuals Distribution
    residuals = y_test - best_y_pred
    ax2.hist(residuals, bins=35, color='#0284C7', edgecolor='black', alpha=0.7)
    ax2.axvline(0, color='r', linestyle='--', lw=2, label='Zero Error')
    ax2.set_xlabel('Prediction Error (Actual - Predicted, min)', fontsize=11)
    ax2.set_ylabel('Frequency', fontsize=11)
    ax2.set_title(f'Residuals Distribution (Mean Error: {residuals.mean():.2f} min)', fontsize=12)
    ax2.legend(loc='upper right')
    ax2.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig(plot_path)
    plt.close()
    print(f"Saved regression evaluation plot: {plot_path}")

    # 8. Save JSON Summary
    json_path = output_dir / 'ml_regression_results.json'
    summary = {
        'task': 'regression',
        'experiment_name': 'Grubhub Delivery Time Regression',
        'dataset_file': 'output/grubhub_cleaned.csv',
        'total_dataset_rows': total_records,
        'valid_target_rows': valid_records,
        'excluded_rows': excluded_records,
        'target_variable': 'delivery_time',
        'target_unit': 'minutes',
        'target_distribution': {
            'mean': round(float(y.mean()), 2),
            'std': round(float(y.std()), 2),
            'median': round(float(y.median()), 2),
            'min': round(float(y.min()), 2),
            'max': round(float(y.max()), 2)
        },
        'train_samples': len(X_train),
        'test_samples': len(X_test),
        'random_seed': random_state,
        'test_size': test_size,
        'features_used': all_features,
        'leakage_prevention_dropped': [
            'delivery_time_raw', 'loc_number', 'loc_name', 'url',
            'address', 'searched_address', 'searched_zipcode',
            'phone', 'RunDate', 'restaurant_tags'
        ],
        'models_evaluated': results,
        'selected_model': best_model_name,
        'selected_model_metrics': results[best_model_name],
        'predictions_plot': 'output/ml_delivery_time_predictions.png',
        'limitations': (
            'These models capture statistical associations between delivery distance, '
            'platform fees, review volume, and historical delivery times. They do not constitute '
            'live dispatch tracking or real-time road traffic routing estimates.'
        )
    }

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
    print(f"Saved evaluation metrics JSON: {json_path}")
    print("==================================================================")
    print("✅ REGRESSION EXPERIMENT COMPLETED SUCCESSFULLY")
    print("==================================================================")

if __name__ == '__main__':
    main()
