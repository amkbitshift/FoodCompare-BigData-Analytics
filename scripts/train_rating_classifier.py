"""
scripts/train_rating_classifier.py
Machine Learning Experiment 1: Classification of High-Rated Restaurants (Swiggy)

Target: is_high_rated = (Rating_Numeric >= 4.2)
Models: DummyClassifier (Baseline), LogisticRegression, RandomForestClassifier
"""

import sys
import json
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
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    ConfusionMatrixDisplay
)

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    project_dir = Path(__file__).resolve().parent.parent
    data_path = project_dir / 'output' / 'swiggy_analysis_ready.csv'
    output_dir = project_dir / 'output'
    output_dir.mkdir(parents=True, exist_ok=True)

    print("==================================================================")
    print("🤖 SWIGGY HIGH-RATING CLASSIFICATION EXPERIMENT")
    print("==================================================================")

    # 1. Load Data
    print(f"Loading dataset: {data_path}")
    raw_df = pd.read_csv(data_path)
    total_records = len(raw_df)
    print(f"Total rows in raw dataset: {total_records:,}")

    # 2. Filter valid numeric ratings
    valid_df = raw_df.dropna(subset=['Rating_Numeric']).copy()
    valid_records = len(valid_df)
    excluded_records = total_records - valid_records
    print(f"Valid rated rows: {valid_records:,} (Excluded unrated/new: {excluded_records:,})")

    # 3. Define Binary Target (is_high_rated >= 4.2)
    # 4.2 provides a balanced distribution (~48% positive / 52% negative)
    rating_threshold = 4.2
    valid_df['is_high_rated'] = (valid_df['Rating_Numeric'] >= rating_threshold).astype(int)
    pos_count = int(valid_df['is_high_rated'].sum())
    neg_count = valid_records - pos_count
    print(f"Target distribution (Threshold >= {rating_threshold}):")
    print(f"  Positive (High-Rated): {pos_count:,} ({pos_count/valid_records*100:.2f}%)")
    print(f"  Negative (Standard):   {neg_count:,} ({neg_count/valid_records*100:.2f}%)")

    # 4. Feature Engineering & Strict Leakage Prevention
    # Explicitly exclude all rating-derived columns:
    # ['Rating', 'Rating_Numeric', 'Rating_Is_New', 'Rating_Count_Minimum',
    #  'Rating_Count_Type', 'Rating_Count_Unavailable', 'Number of Ratings']
    print("\nExtracting feature predictors (preventing target leakage)...")

    # Parse numeric price from "₹XXX for two"
    valid_df['price_numeric'] = valid_df['Average Price'].str.extract(r'(\d+)')[0].astype(float)
    # Extract primary cuisine (first in list)
    valid_df['primary_cuisine'] = valid_df['Cuisine'].fillna('Other').str.split(',').str[0].str.strip()
    # Normalize Pure Veg flag
    valid_df['pure_veg_flag'] = valid_df['Pure Veg'].fillna('No').map(lambda v: 1 if str(v).lower() == 'yes' else 0)
    # Location
    valid_df['location_clean'] = valid_df['Location'].fillna('Unknown').str.strip()
    # Number of Offers
    valid_df['offers_count'] = valid_df['Number of Offers'].fillna(0).astype(float)

    numeric_features = ['price_numeric', 'offers_count']
    categorical_features = ['pure_veg_flag', 'primary_cuisine', 'location_clean']
    all_features = numeric_features + categorical_features

    X = valid_df[all_features].copy()
    y = valid_df['is_high_rated'].copy()

    print(f"Features utilized ({len(all_features)}): {all_features}")
    print(f"Numeric features: {numeric_features}")
    print(f"Categorical features: {categorical_features}")

    # 5. Train-Test Split (Stratified 80/20)
    random_state = 42
    test_size = 0.2
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        stratify=y,
        random_state=random_state
    )
    print(f"\nTrain set: {len(X_train):,} samples | Test set: {len(X_test):,} samples")

    # 6. Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', max_categories=30, sparse_output=False), categorical_features)
        ]
    )

    # 7. Model Definitions
    models = {
        'DummyClassifier': DummyClassifier(strategy='most_frequent'),
        'LogisticRegression': LogisticRegression(max_iter=1000, random_state=random_state),
        'RandomForestClassifier': RandomForestClassifier(
            n_estimators=100,
            max_depth=12,
            min_samples_split=10,
            random_state=random_state,
            n_jobs=-1
        )
    }

    results = {}
    best_model_name = None
    best_f1 = -1.0
    best_pipeline = None
    best_y_pred = None

    print("\nTraining and evaluating models...")
    for name, clf in models.items():
        print(f"\n--- Training {name} ---")
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', clf)
        ])

        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        # Probabilities for ROC-AUC
        try:
            y_prob = pipeline.predict_proba(X_test)[:, 1]
            roc_auc = float(roc_auc_score(y_test, y_prob))
        except Exception:
            roc_auc = None

        acc = float(accuracy_score(y_test, y_pred))
        b_acc = float(balanced_accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))

        print(f"  Accuracy:          {acc:.4f}")
        print(f"  Balanced Accuracy: {b_acc:.4f}")
        print(f"  Precision:         {prec:.4f}")
        print(f"  Recall:            {rec:.4f}")
        print(f"  F1-Score:          {f1:.4f}")
        if roc_auc is not None:
            print(f"  ROC-AUC:           {roc_auc:.4f}")

        results[name] = {
            'accuracy': round(acc, 4),
            'balanced_accuracy': round(b_acc, 4),
            'precision': round(prec, 4),
            'recall': round(rec, 4),
            'f1_score': round(f1, 4),
            'roc_auc': round(roc_auc, 4) if roc_auc is not None else None,
            'model_type': str(clf.__class__.__name__),
            'parameters': {k: str(v) for k, v in clf.get_params().items() if k in ['strategy', 'max_iter', 'C', 'n_estimators', 'max_depth', 'min_samples_split']}
        }

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_pipeline = pipeline
            best_y_pred = y_pred

    print(f"\n🏆 Selected Best Model (by F1-score): {best_model_name} (F1 = {best_f1:.4f})")

    # 8. Confusion Matrix for Best Model
    cm = confusion_matrix(y_test, best_y_pred)
    tn, fp, fn, tp = cm.ravel()
    cm_dict = {
        'true_negatives': int(tn),
        'false_positives': int(fp),
        'false_negatives': int(fn),
        'true_positives': int(tp)
    }
    print(f"Confusion Matrix: TN={tn:,}, FP={fp:,}, FN={fn:,}, TP={tp:,}")

    # Plot Confusion Matrix
    cm_plot_path = output_dir / 'ml_rating_confusion_matrix.png'
    fig, ax = plt.subplots(figsize=(6, 5), dpi=150)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['Rating < 4.2', 'Rating ≥ 4.2'])
    disp.plot(ax=ax, cmap='Blues', values_format='d')
    ax.set_title(f'Confusion Matrix: {best_model_name}\n(Test Set N = {len(y_test):,})', fontsize=12, pad=10)
    plt.tight_layout()
    plt.savefig(cm_plot_path)
    plt.close()
    print(f"Saved confusion matrix plot: {cm_plot_path}")

    # 9. Save JSON Summary
    json_path = output_dir / 'ml_classification_results.json'
    summary = {
        'task': 'classification',
        'experiment_name': 'Swiggy High-Rating Classification',
        'dataset_file': 'output/swiggy_analysis_ready.csv',
        'total_dataset_rows': total_records,
        'valid_rated_rows': valid_records,
        'excluded_unrated_rows': excluded_records,
        'target_definition': f'Rating_Numeric >= {rating_threshold}',
        'class_distribution': {
            'positive_high_rated': pos_count,
            'negative_standard': neg_count,
            'positive_percentage': round(pos_count / valid_records * 100, 2)
        },
        'train_samples': len(X_train),
        'test_samples': len(X_test),
        'random_seed': random_state,
        'test_size': test_size,
        'features_used': all_features,
        'leakage_prevention_dropped': [
            'Rating', 'Rating_Numeric', 'Rating_Is_New',
            'Rating_Count_Minimum', 'Rating_Count_Type',
            'Rating_Count_Unavailable', 'Number of Ratings'
        ],
        'models_evaluated': results,
        'selected_model': best_model_name,
        'selected_model_metrics': results[best_model_name],
        'selected_model_confusion_matrix': cm_dict,
        'confusion_matrix_plot': 'output/ml_rating_confusion_matrix.png',
        'limitations': (
            'These models evaluate statistical associations between restaurant attributes '
            '(location, price, offers, cuisine) and customer ratings. They demonstrate correlation, '
            'not direct causality. A high prediction reflects market segmentation patterns '
            'rather than objective culinary quality.'
        )
    }

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
    print(f"Saved evaluation metrics JSON: {json_path}")
    print("==================================================================")
    print("✅ CLASSIFICATION EXPERIMENT COMPLETED SUCCESSFULLY")
    print("==================================================================")

if __name__ == '__main__':
    main()
