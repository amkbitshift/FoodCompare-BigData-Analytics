/**
 * FoodCompare Research Report Generator
 * 
 * Generates academic research reports in Markdown (.md) and Printable PDF formats
 * derived directly from project datasets, PySpark pipelines, EDA summaries,
 * and methodology documents.
 */

import {
  PROJECT_METADATA,
  KPI_SUMMARY,
  PLATFORM_COMPARISON_METRICS,
  DATASET_QUALITY_AUDIT,
  METHODOLOGY_STAGES,
  EDA_CHARTS_GALLERY
} from '../data/sampleAnalyticsData.js';
import { CURRENCY_CONFIG } from './currency.js';
import {
  ML_CLASSIFICATION_RESULTS,
  ML_CLASSIFICATION_IMPROVED_RESULTS,
  ML_CLASSIFICATION_FINAL_RESULTS,
  ML_REGRESSION_RESULTS,
  ML_EXPERIMENT_METADATA
} from '../data/mlResults.js';

/**
 * Build the full Markdown research report string
 */
export function generateMarkdownReport() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `# ${PROJECT_METADATA.title}
## Academic Capstone Research Report & Technical Documentation
**Project Title:** FoodCompare — Comparative Big Data Analytics of Online Food Delivery Platforms  
**Date of Report:** ${currentDate}  
**Audit Version:** ${PROJECT_METADATA.version} (${PROJECT_METADATA.lastAuditTimestamp})  
**Base Currency Standard:** ${CURRENCY_CONFIG.targetCurrency} (₹)  
**Platforms Investigated:** ${PROJECT_METADATA.platformsAnalyzed.join(', ')}  
**Analytical Pipeline:** Apache Spark, Python / PySpark, Pandas, SQLite, React + Vite  

---

## 1. Abstract
The rapid global expansion of on-demand food delivery platforms has created complex, fragmented consumer marketplaces characterized by dynamic menu pricing, variable service fees, promotional discounting, and disparate fulfillment times. This capstone project presents an empirical big-data analytics framework evaluating five prominent food delivery ecosystems: **Swiggy**, **Zomato**, **Grubhub**, **DoorDash**, and **Foodpanda**. 

Analyzing **5,394,588 records** across cleaned datasets, distributed PySpark processing routines, and relational database partitions, this study investigates price elasticity, rating distributions, restaurant micro-clusters, and the mechanics of true consumer cart totals. To enable transparent cross-market comparisons, monetary metrics are standardized to Indian Rupees (₹ INR) using configurable historical benchmark rates with complete source traceability.

---

## 2. Research Objectives
1. **Heterogeneous Data Aggregation**: Design robust ingestion, audit, and deduplication workflows for multi-country food-tech datasets differing in schema, granularity, and currency.
2. **Distributed Big Data Processing**: Implement scalable PySpark routines to process over 5.08 million menu items and 63,309 restaurant listings without memory bottlenecks.
3. **Data Quality & Schema Validation**: Formulate explicit quality-control procedures to identify missing values, trim whitespace, normalize ratings, and bound delivery-time outliers.
4. **Empirical Exploratory Analysis (EDA)**: Compare rating distributions, city-level sampling densities, cuisine market shares, and platform-specific fee structures.
5. **Centralized Currency Standardization**: Establish a mathematically sound conversion framework into Indian Rupees (₹) with source metadata preservation and strict disclaimers preventing misinterpretation of historical records as live rates.
6. **Consumer Intelligence Demonstration**: Deliver an interactive comparison platform (**FoodCompare**) enabling side-by-side cost transparency across listed prices, verified discounts, delivery fees, and estimated final totals.

---

## 3. Dataset Inventory & Record Counts
The project operates upon cleaned, analysis-ready datasets and raw source logs summarized below:

| Platform / Dataset | Cleaned Rows | Columns | Source File Path | Observation Unit | Native Currency | Primary Geographic Scope |
|:---|:---:|:---:|:---|:---|:---:|:---|
| **Swiggy** | 139,321 | 10 | \`output/swiggy_analysis_ready.csv\` | Restaurants & Menus | INR (₹) | Pan-India (Kanpur, Hyderabad, Goa, etc.) |
| **Zomato** | 101,530 | 26 | \`output/zomato_cleaned.csv\` | Menu Items & Tags | INR (₹) | Indian Metro & Tier-1 Hubs |
| **Grubhub** | 8,088 | 27 | \`output/grubhub_cleaned.csv\` | Restaurant Venues | USD ($) | United States Metros (Brooklyn, etc.) |
| **DoorDash** | 1,200 | 38 | \`datasets/Doordash.csv\` | Order Fulfillment Runs | USD ($) | US Metropolitan Hubs (Doorlanta, Dashattan) |
| **Foodpanda** | 6,000 | 20 | \`datasets/Foodpanda Analysis Dataset.csv\` | Customer Dish Orders | PKR (₨) | South Asia (Peshawar, Multan, etc.) |
| **Restaurant Listings** | 63,469 | 8 | \`output/restaurants_analysis_ready.csv\` | Restaurant Entities | Multi | US & Global Geocoded Locations |
| **Restaurant Menus** | 5,082,180 | 9 | \`output/restaurant_menus_analysis_ready.csv\` | Individual Menu Lines | Multi | Pan-Enterprise Menu Catalog |
| **TOTAL PROCESSED** | **5,394,588** | — | — | — | — | — |

---

## 4. Data Cleaning, Deduplication & Quality Assessment
Data quality audits were executed systematically across each dataset partition:

### 4.1 Swiggy Processing Pipeline
- **Raw Dimension**: 148,541 raw listings reduced to **139,321 cleaned records**.
- **Missing Values**: Handled 27 missing cuisine entries; resolved 14,436 missing rating count flags.
- **Normalization**: Handled the categorical \`NEW\` restaurant label without silent record loss.
- **Deduplication**: Area names, city names, and rating counts normalized into uniform casing and clean delimiters.

### 4.2 Zomato Processing Pipeline
- **Record Volume**: **101,530 item records** validated with zero blank cells in critical analytic fields.
- **Transformation Integrity**: Confirmed mathematical validity of \`Log_Price\` defined as $\\ln(\\text{Prices} + 1)$ and verified \`Price_per_Vote\` distribution.
- **Bestseller Validation**: 101,530 verified bestseller flags indexed for dish frequency analysis.

### 4.3 Grubhub Processing Pipeline
- **Record Volume**: **8,088 US dining venues** analyzed across 27 operational metrics.
- **Flag Audits**: Handled 231 missing \`is_gh\` delivery flags; parsed \`restaurant_tags\` arrays.
- **Outlier Bounding**: Delivery fees (mean $2.45, max $19.99) and delivery times (mean 42.54 min, max 127.5 min) bounded to eliminate corrupted records.

### 4.4 PySpark Restaurant Menus Scale
- **Record Volume**: **5,082,180 menu items** spanning 63,309 unique restaurant identifiers.
- **Price Classification**: Identified 4,907,926 positive parsed prices, 174,251 valid zero prices (representing free additions/promos), and only 3 unparsed anomalies.
- **Distributed Execution**: Handled via Apache Spark chunking and PySpark DataFrame transformations.

---

## 5. Exploratory Data Analysis (EDA) Findings

### 5.1 Rating Distribution & Parity
- **Swiggy Rating Profile**: Mean rating of **4.04 / 5.0** across 105,864 rated dining entities. High concentration (52.6%) between 3.9 and 4.4 stars.
- **Zomato Rating Profile**: Mean rating of **3.89 / 5.0** across 101,530 validated items. Displays broader dispersion with 36.1% between 3.3 and 3.8 stars.
- **Grubhub Rating Profile**: Mean venue review score of **3.40 / 5.0** across 8,088 venues, displaying greater consumer rating variance in US markets.

### 5.2 Price Metrics & Currency Standardization
All monetary values are converted to Indian Rupees (₹ INR) using documented historical benchmark assumptions as of October 2026:
- **1.00 USD ≈ ₹83.50 INR** (Grubhub and DoorDash sources)
- **1.00 PKR ≈ ₹0.30 INR** (Foodpanda source)
- **Swiggy**: Average listed price for two = **₹270.34** (range: ₹1.00 to ₹199,246.00).
- **Zomato**: Average item listed price = **₹243.69** (range: ₹0.95 to ₹12,024.00).
- **Grubhub**: Average delivery fee = $2.45 USD (**₹204.58**); average service fee = $6.16 USD (**₹514.36**).
- **DoorDash**: Average fulfillment order subtotal = $24.83 USD (**₹2,073.41**).

### 5.3 Cuisine Specialization & Market Concentration
Analysis of 139,321 Swiggy records reveals significant cuisine concentration:
1. **Chinese**: 37,527 records (26.9% of offerings)
2. **North Indian**: 28,722 records (20.6% of offerings)
3. **Indian / Regional**: 23,160 records (16.6% of offerings)
4. **Snacks / Street Food**: 17,339 records (12.4% of offerings)
5. **Biryani**: 14,942 records (10.7% of offerings)
6. **Fast Food / Burgers**: 13,416 records (9.6% of offerings)
7. **Beverages & Juices**: 13,118 records (9.4% of offerings)
8. **South Indian**: 12,275 records (8.8% of offerings)

### 5.4 Geographic Sampling Density
- **India (Swiggy)**: Evenly sampled regional hubs (~2,000 records each in Kanpur, Hyderabad, Central-Goa, Indore, Vadodara, and Lucknow).
- **India (Zomato)**: Concentrated in major metropolitan areas (Hyderabad: 13,100; Mumbai: 11,640; Chennai: 11,147; Jaipur: 11,009; Bangalore: 9,450).
- **United States (Grubhub & DoorDash)**: High-density urban corridors (Brooklyn, NY: 8,088; Doorlanta: 750; Dashattan: 450).

---

## 6. Generated EDA Visualizations & Chart Artifacts
The following 8 analytical plots were programmatically generated by Python visualization scripts (\`scripts/generate_eda_charts.py\` and \`scripts/swiggy_eda.py\`) and saved to \`output/\`:

1. **\`comparative_average_ratings.png\`**: Cross-platform bar comparison illustrating mean ratings across Swiggy (4.04), Zomato (3.89), and Grubhub (3.40).
2. **\`grubhub_delivery_metrics.png\`**: Dual histogram displaying delivery time distributions (mean 42.5 min) and delivery fee structures ($0 to $19.99).
3. **\`swiggy_price_distribution.png\`**: Log-transformed price distribution for Swiggy dining entities highlighting common consumer price bands.
4. **\`swiggy_rating_distribution.png\`**: Rating frequency distribution demonstrating right-skewed positive customer satisfaction patterns in India.
5. **\`swiggy_top_cuisines.png\`**: Horizontal volume chart showing Chinese and North Indian dominant market shares.
6. **\`swiggy_top_cities.png\`**: Uniform bar plot illustrating the 2,000-record city sampling methodology.
7. **\`comparative_zomato_top_cities.png\`**: City volume breakdown across 101,530 validated Zomato menu records.
8. **\`comparative_swiggy_top_locations.png\`**: Micro-location density map highlighting dining cluster volumes.

---

## 7. Methodological Workflow & Technology Stack

\`\`\`mermaid
flowchart TD
    A["Raw Datasets (CSV/Excel)"] --> B["Step 1: Dataset Audit & Dimension Check"]
    B --> C["Step 2: Cleaning & Deduplication (Python/Spark)"]
    C --> D["Step 3: Quality Assessment & Anomaly Bounding"]
    D --> E["Step 4: Currency Standardization (INR Base ₹)"]
    E --> F["Step 5: Analysis-Ready CSV Artifacts (output/)"]
    F --> G["Step 6: Statistical EDA & Plot Generation (matplotlib)"]
    F --> H["Step 7: Consumer Comparison UI (FoodCompare / React)"]
\`\`\`

### Technology Stack
- **Apache Spark / PySpark**: Distributed partitioning and lazy evaluation for the 5.08M row menu catalog.
- **Python 3 / Pandas / NumPy**: Tabular data manipulation, text normalization, and statistical aggregations.
- **scikit-learn**: Classification and regression modeling pipelines, preprocessing transformers, and evaluation metrics.
- **Matplotlib & Seaborn**: High-resolution publication-quality statistical plotting.
- **SQLite**: Local indexed staging for relational queries.
- **React 18 + Vite**: Responsive client-side user experience, deterministic image hashing, and real-time cost calculation engine.

---

## 8. Machine Learning Model Evaluation & Benchmark Experiments
Supervised machine learning experiments were conducted using \`scikit-learn\` (v1.9.0) in Python 3.14 to evaluate predictive capability across cleaned food delivery datasets while strictly guarding against target leakage.

### 8.1 Experiment 1: Swiggy Restaurant Rating Classification (Controlled Final Experiment & Benchmark Evolution)
- **Objective:** Predict whether a dining venue achieves a top-tier rating (\`is_high_rated = Rating_Numeric >= 4.2\`) using venue attributes.
- **Dataset Partition:** \`${ML_CLASSIFICATION_FINAL_RESULTS.dataset_file}\` (${ML_CLASSIFICATION_FINAL_RESULTS.total_dataset_rows.toLocaleString()} total listings; **${ML_CLASSIFICATION_FINAL_RESULTS.valid_rated_rows.toLocaleString()} valid rated items**; ${ML_CLASSIFICATION_FINAL_RESULTS.excluded_unrated_rows.toLocaleString()} unrated excluded).
- **Target Distribution:** Positive (High-Rated $\\ge 4.2$): ${ML_CLASSIFICATION_FINAL_RESULTS.class_distribution.positive_high_rated.toLocaleString()} (${ML_CLASSIFICATION_FINAL_RESULTS.class_distribution.positive_percentage}%), Negative (Standard $< 4.2$): ${ML_CLASSIFICATION_FINAL_RESULTS.class_distribution.negative_standard.toLocaleString()}.
- **Split Protocol:** Stratified 80/20 train-test split (\`random_state=42\`; Train: ${ML_CLASSIFICATION_FINAL_RESULTS.train_samples.toLocaleString()}, Test: ${ML_CLASSIFICATION_FINAL_RESULTS.test_partition_samples.toLocaleString()}).
- **Input Features (18 Predictors):** \`${ML_CLASSIFICATION_FINAL_RESULTS.features_used.join('`, `')}\`.
- **Target Leakage Prevention:** Dropped all 7 rating-derived columns (\`${ML_CLASSIFICATION_FINAL_RESULTS.leakage_prevention_dropped.join('`, `')}\`) prior to pipeline transformation.
- **Validation Methodology:** Model selection is governed strictly by **5-Fold Stratified Cross-Validation on the training set** (N = ${ML_CLASSIFICATION_FINAL_RESULTS.train_samples.toLocaleString()}) to prevent selection bias from repeated test-set inspections.

#### Primary Model Selection: 5-Fold Stratified Cross-Validation on Training Set (N = ${ML_CLASSIFICATION_FINAL_RESULTS.train_samples.toLocaleString()})
| Model | CV Accuracy | CV Balanced Acc | CV Precision | CV Recall | CV F1-Score (Mean ± Std) | CV ROC-AUC | Selection Status |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **Dummy Baseline** | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.Dummy_Baseline.cv_accuracy_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.Dummy_Baseline.cv_balanced_accuracy_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.Dummy_Baseline.cv_precision_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.Dummy_Baseline.cv_recall_mean * 100).toFixed(2)}% | ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.Dummy_Baseline.cv_f1_mean.toFixed(4)} ± ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.Dummy_Baseline.cv_f1_std.toFixed(4)} | ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.Dummy_Baseline.cv_roc_auc_mean.toFixed(4)} | Baseline |
| **Logistic Regression** | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.LogisticRegression.cv_accuracy_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.LogisticRegression.cv_balanced_accuracy_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.LogisticRegression.cv_precision_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.LogisticRegression.cv_recall_mean * 100).toFixed(2)}% | ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.LogisticRegression.cv_f1_mean.toFixed(4)} ± ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.LogisticRegression.cv_f1_std.toFixed(4)} | ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.LogisticRegression.cv_roc_auc_mean.toFixed(4)} | Linear Model |
| **Extra Trees** | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.ExtraTrees.cv_accuracy_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.ExtraTrees.cv_balanced_accuracy_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.ExtraTrees.cv_precision_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.ExtraTrees.cv_recall_mean * 100).toFixed(2)}% | ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.ExtraTrees.cv_f1_mean.toFixed(4)} ± ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.ExtraTrees.cv_f1_std.toFixed(4)} | ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.ExtraTrees.cv_roc_auc_mean.toFixed(4)} | Tree Ensemble |
| **HistGradientBoosting** | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.HistGradientBoosting.cv_accuracy_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.HistGradientBoosting.cv_balanced_accuracy_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.HistGradientBoosting.cv_precision_mean * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.HistGradientBoosting.cv_recall_mean * 100).toFixed(2)}% | ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.HistGradientBoosting.cv_f1_mean.toFixed(4)} ± ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.HistGradientBoosting.cv_f1_std.toFixed(4)} | ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.HistGradientBoosting.cv_roc_auc_mean.toFixed(4)} | Gradient Boosting |
| **Random Forest (Selected Single)** | **${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.RandomForest.cv_accuracy_mean * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.RandomForest.cv_balanced_accuracy_mean * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.RandomForest.cv_precision_mean * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.RandomForest.cv_recall_mean * 100).toFixed(2)}%** | **${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.RandomForest.cv_f1_mean.toFixed(4)} ± ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.RandomForest.cv_f1_std.toFixed(4)}** | **${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.RandomForest.cv_roc_auc_mean.toFixed(4)}** | **★ Best Single Model by CV F1** |
| **Soft Voting Ensemble (RF+HGB+ET)** | **${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.SoftVotingEnsemble.cv_accuracy_mean * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.SoftVotingEnsemble.cv_balanced_accuracy_mean * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.SoftVotingEnsemble.cv_precision_mean * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.SoftVotingEnsemble.cv_recall_mean * 100).toFixed(2)}%** | **${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.SoftVotingEnsemble.cv_f1_mean.toFixed(4)} ± ${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.SoftVotingEnsemble.cv_f1_std.toFixed(4)}** | **${ML_CLASSIFICATION_FINAL_RESULTS.cross_validation_training_set.SoftVotingEnsemble.cv_roc_auc_mean.toFixed(4)}** | **★ Highest CV Accuracy & AUC** |

#### Test Partition Evaluation Benchmark (N = ${ML_CLASSIFICATION_FINAL_RESULTS.test_partition_samples.toLocaleString()})
| Model | Accuracy | Balanced Accuracy | Precision | Recall | F1-Score | ROC-AUC | Parameters |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **DummyClassifier (Baseline)** | ${(ML_CLASSIFICATION_RESULTS.models_evaluated.DummyClassifier.accuracy * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_RESULTS.models_evaluated.DummyClassifier.balanced_accuracy * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_RESULTS.models_evaluated.DummyClassifier.precision * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_RESULTS.models_evaluated.DummyClassifier.recall * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_RESULTS.models_evaluated.DummyClassifier.f1_score * 100).toFixed(2)}% | ${ML_CLASSIFICATION_RESULTS.models_evaluated.DummyClassifier.roc_auc.toFixed(4)} | \`strategy='most_frequent'\` |
| **LogisticRegression (Selected)** | **${(ML_CLASSIFICATION_RESULTS.models_evaluated.LogisticRegression.accuracy * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_RESULTS.models_evaluated.LogisticRegression.balanced_accuracy * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_RESULTS.models_evaluated.LogisticRegression.precision * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_RESULTS.models_evaluated.LogisticRegression.recall * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_RESULTS.models_evaluated.LogisticRegression.f1_score * 100).toFixed(2)}%** | **${ML_CLASSIFICATION_RESULTS.models_evaluated.LogisticRegression.roc_auc.toFixed(4)}** | \`C=1.0, max_iter=1000 (Initial Baseline)\` |
| **RandomForest (Controlled Final)** | ${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.RandomForest.accuracy * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.RandomForest.balanced_accuracy * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.RandomForest.precision * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.RandomForest.recall * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.RandomForest.f1_score * 100).toFixed(2)}% | ${ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.RandomForest.roc_auc.toFixed(4)} | \`n_estimators=120, max_depth=14, min_split=15\` |
| **ExtraTrees (Improved Benchmark)** | ${(ML_CLASSIFICATION_IMPROVED_RESULTS.models_evaluated.ExtraTreesClassifier.accuracy * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_IMPROVED_RESULTS.models_evaluated.ExtraTreesClassifier.balanced_accuracy * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_IMPROVED_RESULTS.models_evaluated.ExtraTreesClassifier.precision * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_IMPROVED_RESULTS.models_evaluated.ExtraTreesClassifier.recall * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_IMPROVED_RESULTS.models_evaluated.ExtraTreesClassifier.f1_score * 100).toFixed(2)}% | ${ML_CLASSIFICATION_IMPROVED_RESULTS.models_evaluated.ExtraTreesClassifier.roc_auc.toFixed(4)} | \`n_estimators=150, max_depth=16\` |
| **HistGradientBoosting** | ${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.HistGradientBoosting.accuracy * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.HistGradientBoosting.balanced_accuracy * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.HistGradientBoosting.precision * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.HistGradientBoosting.recall * 100).toFixed(2)}% | ${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.HistGradientBoosting.f1_score * 100).toFixed(2)}% | ${ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.HistGradientBoosting.roc_auc.toFixed(4)} | \`learning_rate=0.08, max_iter=150, leaves=31\` |
| **Soft Voting Ensemble (Latest)** | **${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.SoftVotingEnsemble.accuracy * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.SoftVotingEnsemble.balanced_accuracy * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.SoftVotingEnsemble.precision * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.SoftVotingEnsemble.recall * 100).toFixed(2)}%** | **${(ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.SoftVotingEnsemble.f1_score * 100).toFixed(2)}%** | **${ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.SoftVotingEnsemble.roc_auc.toFixed(4)}** | \`Soft Voting: RF (120) + HGB (150) + ET (120)\` |

#### Longitudinal Benchmark Comparison Across Iterations
- **Baseline Experiment:** Logistic Regression — Accuracy: **58.69%**, F1: **0.5070**, ROC-AUC: **0.6213** (TN: 7,928, FP: 3,052, FN: 5,695, TP: 4,498; artifact: \`output/ml_rating_confusion_matrix.png\`).
- **Enhanced Benchmark:** Extra Trees Classifier — Accuracy: **63.22%**, F1: **0.6005**, ROC-AUC: **0.6800** (artifact: \`output/ml_rating_improved_confusion_matrix.png\`).
- **Controlled Final Experiment:** Soft Voting Ensemble — Accuracy: **63.39%**, F1: **0.6030**, ROC-AUC: **0.6851** (TN: 7,533, FP: 3,447, FN: 4,305, TP: 5,888; artifact: \`output/ml_rating_final_experiment_confusion_matrix.png\`).

#### Confusion Matrix (Final Best Model: Soft Voting Ensemble on 21,173 Test Records)
- **True Negatives (TN):** ${ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.SoftVotingEnsemble.confusion_matrix.true_negatives.toLocaleString()}
- **False Positives (FP):** ${ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.SoftVotingEnsemble.confusion_matrix.false_positives.toLocaleString()}
- **False Negatives (FN):** ${ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.SoftVotingEnsemble.confusion_matrix.false_negatives.toLocaleString()}
- **True Positives (TP):** ${ML_CLASSIFICATION_FINAL_RESULTS.test_partition_evaluation.SoftVotingEnsemble.confusion_matrix.true_positives.toLocaleString()}
- **Plot Artifact:** \`${ML_CLASSIFICATION_FINAL_RESULTS.confusion_matrix_plot}\` (also deployed to \`website/public/charts/ml_rating_final_experiment_confusion_matrix.png\`).

#### Feature Importance Analysis (Random Forest Gini Impurity Decrease)
- **City (\`location_clean\`):** **27.3%** — Regional metropolitan tier and geographic density are the single strongest predictors of restaurant rating satisfaction.
- **Micro-Locality (\`city_area\`):** **22.6%** — Disambiguated micro-neighborhood socioeconomic context.
- **Primary Cuisine (\`primary_cuisine\`):** **17.3%** — Baseline customer rating expectations across core culinary genres.
- **Meal Pricing (\`log_price\` / \`price_numeric\`):** **13.8%** combined — Diminishing returns of price scaling at higher spend tiers.
- **Promotional Volume (\`offers_count\`):** **3.5%** — Active promotional discounts available.
- **Bakery / Desserts (\`is_desserts_bakery\`):** **2.3%** — Sweet-shop and dessert outlets carry systematically higher positive ratings.
- **Pure Vegetarian (\`pure_veg_flag\`):** **2.2%** — Vegetarian dining focus.
- **Plot Artifact:** \`${ML_CLASSIFICATION_FINAL_RESULTS.feature_importance_plot}\` (also deployed to \`website/public/charts/ml_rating_final_experiment_feature_importance.png\`).

#### Brand-Level Generalization Audit (GroupKFold by Restaurant Name)
Evaluating 5-fold GroupKFold by restaurant brand confirms strong generalization to previously unseen dining chains:
- **Random Forest:** Group CV F1: **0.5946 ± 0.0040** (vs Stratified CV F1: 0.6006)
- **HistGradientBoosting:** Group CV F1: **0.5971 ± 0.0053** (vs Stratified CV F1: 0.5991)
- **Soft Voting Ensemble:** Group CV F1: **0.5951 ± 0.0051** (vs Stratified CV F1: 0.6002)
- **Conclusion:** The minor performance delta (< 0.006 F1) confirms the model learns genuine spatial and culinary features rather than memorizing chain identities.

#### Methodological Integrity Disclosures
1. **Incremental Refinement Notice:** The final ensemble's **63.39% test accuracy is only a small improvement over the previous Extra Trees result of 63.22%**. This represents an incremental refinement rather than a major breakthrough. All top tree ensembles converge closely within 63.0% – 63.4% accuracy, with variations falling within cross-validation standard deviation margins (±0.22% to ±0.29%).
2. **Evaluation Partition Status:** Because the test partition has been examined during earlier experiments, it is **not a fully independent final evaluation**. Genuinely independent validation should be conducted on a future, freshly collected dataset (e.g. newly scraped listings).
3. **Scientific Scope:** These experiments evaluate statistical associations between static catalog attributes (location, price, offers, cuisine) and customer ratings. They **do not prove an intrinsic statistical ceiling, establish causation, or guarantee customer satisfaction**. In practical operations, customer ratings are primarily driven by food taste, packaging quality, delivery speed, and courier reliability—variables not present in catalog metadata.

### 8.2 Experiment 2: Grubhub Delivery Time Regression
- **Objective:** Predict estimated delivery fulfillment duration in continuous minutes.
- **Dataset Partition:** \`${ML_REGRESSION_RESULTS.dataset_file}\` (**${ML_REGRESSION_RESULTS.valid_target_rows.toLocaleString()} valid restaurant venues**).
- **Target Distribution:** Continuous \`delivery_time\` in minutes (Mean: ${ML_REGRESSION_RESULTS.target_distribution.mean} min, Median: ${ML_REGRESSION_RESULTS.target_distribution.median} min, Std: ${ML_REGRESSION_RESULTS.target_distribution.std} min, Range: ${ML_REGRESSION_RESULTS.target_distribution.min} to ${ML_REGRESSION_RESULTS.target_distribution.max} min).
- **Split Protocol:** 80/20 train-test split (\`random_state=42\`; Train: ${ML_REGRESSION_RESULTS.train_samples.toLocaleString()}, Test: ${ML_REGRESSION_RESULTS.test_samples.toLocaleString()}).
- **Input Features:** \`${ML_REGRESSION_RESULTS.features_used.join('`, `')}\`.
- **Target Leakage Prevention:** Dropped all direct identifiers and timestamps (\`${ML_REGRESSION_RESULTS.leakage_prevention_dropped.join('`, `')}\`).

#### Regression Model Comparison (Test Set N = ${ML_REGRESSION_RESULTS.test_samples.toLocaleString()})
| Model | MAE (min) | MSE (min²) | RMSE (min) | R² Score | Parameters |
|:---|:---:|:---:|:---:|:---:|:---|
| **DummyRegressor (Mean Baseline)** | ${ML_REGRESSION_RESULTS.models_evaluated.DummyRegressor.mae.toFixed(2)} min | ${ML_REGRESSION_RESULTS.models_evaluated.DummyRegressor.mse.toFixed(2)} | ${ML_REGRESSION_RESULTS.models_evaluated.DummyRegressor.rmse.toFixed(2)} min | ${ML_REGRESSION_RESULTS.models_evaluated.DummyRegressor.r2_score.toFixed(4)} | \`strategy='${ML_REGRESSION_RESULTS.models_evaluated.DummyRegressor.parameters.strategy}'\` |
| **Ridge Regression** | ${ML_REGRESSION_RESULTS.models_evaluated.Ridge.mae.toFixed(2)} min | ${ML_REGRESSION_RESULTS.models_evaluated.Ridge.mse.toFixed(2)} | ${ML_REGRESSION_RESULTS.models_evaluated.Ridge.rmse.toFixed(2)} min | ${ML_REGRESSION_RESULTS.models_evaluated.Ridge.r2_score.toFixed(4)} | \`alpha=${ML_REGRESSION_RESULTS.models_evaluated.Ridge.parameters.alpha}\` |
| **RandomForestRegressor (Selected)** | **${ML_REGRESSION_RESULTS.models_evaluated.RandomForestRegressor.mae.toFixed(2)} min** | **${ML_REGRESSION_RESULTS.models_evaluated.RandomForestRegressor.mse.toFixed(2)}** | **${ML_REGRESSION_RESULTS.models_evaluated.RandomForestRegressor.rmse.toFixed(2)} min** | **${ML_REGRESSION_RESULTS.models_evaluated.RandomForestRegressor.r2_score.toFixed(4)}** | \`n_estimators=${ML_REGRESSION_RESULTS.models_evaluated.RandomForestRegressor.parameters.n_estimators}, max_depth=${ML_REGRESSION_RESULTS.models_evaluated.RandomForestRegressor.parameters.max_depth}\` |

*Selection Rationale:* Random Forest Regressor minimized prediction error across all metrics, achieving an RMSE of ${ML_REGRESSION_RESULTS.models_evaluated.RandomForestRegressor.rmse.toFixed(2)} minutes and explaining ${(ML_REGRESSION_RESULTS.models_evaluated.RandomForestRegressor.r2_score * 100).toFixed(2)}% of the variance (R² = ${ML_REGRESSION_RESULTS.models_evaluated.RandomForestRegressor.r2_score.toFixed(4)}), significantly outperforming the linear baseline.
- **Plot Artifact:** \`${ML_REGRESSION_RESULTS.predictions_plot}\` (also deployed to \`website/public/charts/ml_delivery_time_predictions.png\`).

### 8.3 ML Limitations & Methodological Integrity
- **Correlation, Not Causation:** Evaluated models identify statistical relationships between attributes and observed metrics. High predicted ratings do not guarantee culinary excellence.
- **Historical Snapshot Validity:** Predictions are trained on historical crawl datasets and do not represent live dynamic traffic, kitchen surges, or courier availability.

---

## 9. Limitations & Data Provenance Disclosures
1. **Historical Snapshot Scope**: All datasets represent historical research snapshots and must not be interpreted as live commercial pricing or operational guarantees.
2. **Observation Unit Heterogeneity**: The datasets do not share identical observation units: Swiggy captures restaurant venues with two-person pricing; Zomato captures itemized dishes; Grubhub captures restaurant venues with delivery fees; DoorDash captures complete order fulfillment runs.
3. **Geographic Non-Equivalence**: Comparisons across platforms reflect different geographic markets (India, United States, and South Asia).
4. **Currency Exchange Caveats**: Converted amounts reflect historical benchmark rates (1 USD ≈ ₹83.50, 1 PKR ≈ ₹0.30 as of October 2026). Real currency exchange rates fluctuate continuously.
5. **Fee Transparency**: Where platforms did not record delivery charges in their raw data, the cost calculation engine marks the breakdown as partial (\`isComplete: false\`) rather than inventing estimates.

---

## 10. Conclusion & Future Scope
This capstone research demonstrates an end-to-end big-data lifecycle—from raw heterogeneous ingestion to distributed PySpark normalization, automated quality audits, and consumer-facing transparency interfaces. By standardizing diverse currencies into Indian Rupees while explicitly preserving provenance, the project demonstrates how data engineering can bridge disparate data models without corrupting empirical truths.

**Future Scope**:
- Integration of live API webhooks to track real-time dynamic surge pricing.
- Geospatial distance routing using OpenStreetMap/OSRM APIs to model distance-based delivery fees.
- Machine-learning basket price optimization predicting lowest-cost platform combinations across multi-item family orders.

---
*Report produced by the FoodCompare Analytics Engine for academic submission.*
`;
}

/**
 * Generate formatted HTML string for print-to-PDF
 */
export function generateHtmlReport() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FoodCompare — Big Data Analytics Research Report</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1C1917;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-size: 20pt;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    h2 {
      font-size: 14pt;
      font-weight: 700;
      color: #E23744;
      margin-top: 18pt;
      margin-bottom: 8pt;
      border-bottom: 1.5pt solid #E2E8F0;
      padding-bottom: 4pt;
      page-break-after: avoid;
    }
    h3 {
      font-size: 12pt;
      font-weight: 600;
      color: #1E293B;
      margin-top: 12pt;
      margin-bottom: 6pt;
      page-break-after: avoid;
    }
    p, li {
      color: #334155;
      font-size: 10.5pt;
      margin-bottom: 6pt;
    }
    ul, ol {
      margin-top: 4pt;
      margin-bottom: 8pt;
      padding-left: 20pt;
    }
    li {
      margin-bottom: 4pt;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12pt 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1pt solid #CBD5E1;
      padding: 6pt 8pt;
      text-align: left;
    }
    th {
      background-color: #F1F5F9;
      font-weight: 700;
      color: #0F172A;
      text-transform: uppercase;
      font-size: 8.5pt;
      letter-spacing: 0.03em;
    }
    tr:nth-child(even) {
      background-color: #F8FAFC;
    }
    .badge {
      display: inline-block;
      padding: 2pt 6pt;
      border-radius: 4pt;
      font-size: 8.5pt;
      font-weight: 700;
      background-color: #FFF1F2;
      color: #BE123C;
      border: 1pt solid #FECDD3;
    }
    .meta-box {
      background-color: #F8FAFC;
      border: 1.5pt solid #E2E8F0;
      border-left: 4pt solid #E23744;
      border-radius: 6pt;
      padding: 10pt 14pt;
      margin-bottom: 16pt;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6pt;
      font-size: 9.5pt;
    }
    .meta-item strong {
      color: #0F172A;
    }
    .disclaimer-box {
      background-color: #FFFBEB;
      border: 1pt solid #FDE68A;
      border-left: 4pt solid #D97706;
      border-radius: 6pt;
      padding: 10pt 12pt;
      margin: 12pt 0;
      font-size: 9.5pt;
      color: #92400E;
      page-break-inside: avoid;
    }
    .chart-card {
      border: 1pt solid #E2E8F0;
      border-radius: 6pt;
      padding: 8pt 12pt;
      margin-bottom: 8pt;
      background-color: #FFFFFF;
      page-break-inside: avoid;
    }
    .chart-title {
      font-weight: 700;
      color: #0F172A;
      font-size: 10pt;
    }
    .chart-sub {
      font-size: 8.5pt;
      color: #64748B;
      margin-top: 2pt;
    }
    .footer-note {
      margin-top: 24pt;
      border-top: 1pt solid #CBD5E1;
      padding-top: 8pt;
      font-size: 8.5pt;
      color: #64748B;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>${PROJECT_METADATA.title}</h1>
  <div style="font-size: 12pt; font-weight: 600; color: #475569; margin-bottom: 12pt;">
    Academic Capstone Project &bull; Comparative Big Data Research Findings
  </div>

  <div class="meta-box">
    <div class="meta-grid">
      <div class="meta-item"><strong>Date of Report:</strong> ${currentDate}</div>
      <div class="meta-item"><strong>Audit Version:</strong> ${PROJECT_METADATA.version}</div>
      <div class="meta-item"><strong>Base Target Currency:</strong> ${CURRENCY_CONFIG.targetCurrency} (₹)</div>
      <div class="meta-item"><strong>Total Records Processed:</strong> 5,394,588</div>
      <div class="meta-item"><strong>Platforms Investigated:</strong> ${PROJECT_METADATA.platformsAnalyzed.join(', ')}</div>
      <div class="meta-item"><strong>Primary Technologies:</strong> PySpark, Python, Pandas, SQLite, React</div>
    </div>
  </div>

  <h2>1. Abstract</h2>
  <p>
    The rapid global expansion of on-demand food delivery platforms has created fragmented consumer marketplaces characterized by variable service fees, dynamic menu pricing, promotional discounting, and disparate fulfillment durations. This academic project presents an empirical big-data analytics framework evaluating five major food delivery platforms: <strong>Swiggy</strong>, <strong>Zomato</strong>, <strong>Grubhub</strong>, <strong>DoorDash</strong>, and <strong>Foodpanda</strong>.
  </p>
  <p>
    Analyzing <strong>5,394,588 records</strong> across cleaned partitions, distributed PySpark routines, and relational database partitions, this study investigates price elasticity, rating distributions, restaurant micro-clusters, and the mechanics of true consumer cart totals. To enable transparent cross-market comparisons, all monetary figures are standardized to Indian Rupees (₹ INR) using documented historical benchmark rates with complete source traceability.
  </p>

  <h2>2. Research Objectives</h2>
  <ul>
    <li><strong>Heterogeneous Data Aggregation:</strong> Ingest, audit, and deduplicate multi-country food-tech datasets differing in schema, granularity, and currency.</li>
    <li><strong>Distributed Big Data Processing:</strong> Implement scalable PySpark routines to process over 5.08 million menu items across 63,309 restaurants.</li>
    <li><strong>Data Quality & Schema Validation:</strong> Standardize text fields, preserve categorical flags, and bound delivery-time outliers without silent data loss.</li>
    <li><strong>Empirical Exploratory Analysis:</strong> Compare rating distributions, city densities, cuisine market shares, and fee structures.</li>
    <li><strong>Centralized Currency Standardization:</strong> Standardize values into Indian Rupees (₹) with source metadata preservation.</li>
    <li><strong>Consumer Intelligence UI:</strong> Deliver an interactive platform (FoodCompare) demonstrating cross-platform cost transparency.</li>
  </ul>

  <h2>3. Dataset Inventory & Record Counts</h2>
  <table>
    <thead>
      <tr>
        <th>Platform / Dataset</th>
        <th>Cleaned Rows</th>
        <th>Observation Unit</th>
        <th>Native Currency</th>
        <th>Source File</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Swiggy</strong></td>
        <td>139,321</td>
        <td>Restaurants & Menus</td>
        <td>INR (₹)</td>
        <td>output/swiggy_analysis_ready.csv</td>
      </tr>
      <tr>
        <td><strong>Zomato</strong></td>
        <td>101,530</td>
        <td>Menu Items & Tags</td>
        <td>INR (₹)</td>
        <td>output/zomato_cleaned.csv</td>
      </tr>
      <tr>
        <td><strong>Grubhub</strong></td>
        <td>8,088</td>
        <td>Restaurant Venues</td>
        <td>USD ($)</td>
        <td>output/grubhub_cleaned.csv</td>
      </tr>
      <tr>
        <td><strong>DoorDash</strong></td>
        <td>1,200</td>
        <td>Order Fulfillment Runs</td>
        <td>USD ($)</td>
        <td>datasets/Doordash.csv</td>
      </tr>
      <tr>
        <td><strong>Foodpanda</strong></td>
        <td>6,000</td>
        <td>Customer Dish Orders</td>
        <td>PKR (₨)</td>
        <td>datasets/Foodpanda Analysis Dataset.csv</td>
      </tr>
      <tr>
        <td><strong>Restaurant Listings</strong></td>
        <td>63,469</td>
        <td>Dining Entities</td>
        <td>Multi</td>
        <td>output/restaurants_analysis_ready.csv</td>
      </tr>
      <tr>
        <td><strong>Restaurant Menus</strong></td>
        <td>5,082,180</td>
        <td>Menu Line Items</td>
        <td>Multi</td>
        <td>output/restaurant_menus_analysis_ready.csv</td>
      </tr>
      <tr style="font-weight: 700; background-color: #F1F5F9;">
        <td>TOTAL RECORDS</td>
        <td>5,394,588</td>
        <td>Across 7 Partitions</td>
        <td>Standardized (₹)</td>
        <td>Cleaned & Analysis-Ready</td>
      </tr>
    </tbody>
  </table>

  <h2>4. Key Exploratory Data Analysis (EDA) Findings</h2>
  <ul>
    <li><strong>Rating Parity:</strong> Swiggy demonstrates an average rating of <strong>4.04/5.0</strong> across 105,864 rated items; Zomato averages <strong>3.89/5.0</strong> across 101,530 items; Grubhub US averages <strong>3.40/5.0</strong> across 8,088 venues.</li>
    <li><strong>Price Metrics (INR Standardized):</strong> Swiggy average listed price for two is <strong>₹270.34</strong>; Zomato average item price is <strong>₹243.69</strong>; Grubhub average delivery fee is $2.45 USD (<strong>₹204.58</strong>); DoorDash average fulfillment run subtotal is $24.83 USD (<strong>₹2,073.41</strong>).</li>
    <li><strong>Cuisine Dominance:</strong> Chinese (37,527 records, 26.9%) and North Indian (28,722 records, 20.6%) represent nearly half of total Indian catalog offerings.</li>
    <li><strong>Big Data Menu Scale:</strong> PySpark routines validated 4,907,926 positive parsed menu prices and 174,251 zero prices across 63,309 unique restaurant entities.</li>
  </ul>

  <h2>5. Generated EDA Chart Artifacts</h2>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8pt;">
    ${EDA_CHARTS_GALLERY.map(c => `
      <div class="chart-card">
        <div class="chart-title">${c.title}</div>
        <div class="chart-sub">Generated by <code>${c.script}</code> &bull; Saved to <code>output/</code></div>
        <div style="font-size: 8.5pt; color: #475569; margin-top: 4pt;">${c.description}</div>
      </div>
    `).join('')}
  </div>

  <h2>6. Machine Learning Model Evaluation & Empirical Experiments</h2>
  <p>
    Predictive modeling using <code>scikit-learn 1.9.0</code> in Python 3.14 across cleaned food delivery datasets with strict target leakage prevention, 5-fold cross-validation on the training set (N = 84,691), and test partition benchmarks (N = 21,173).
  </p>

  <h3>6.1 Swiggy Rating Classification (Controlled Final Experiment, N = 105,864 Rated Venues)</h3>
  <p style="font-size: 9.5pt; color: #475569;">
    <strong>Target:</strong> <code>is_high_rated = Rating_Numeric &gt;= 4.2</code> (Positive: 48.14%, Negative: 51.86%). Dropped all 7 rating-derived columns to prevent target leakage. 18 predictors including multi-cuisine genre flags, offer types, and <code>city_area</code> micro-locality interactions.
  </p>
  
  <div style="background-color: #F8FAFC; border: 1pt solid #CBD5E1; border-radius: 4pt; padding: 6pt 10pt; margin: 8pt 0; font-size: 8.5pt; color: #334155;">
    <strong>Validation Strategy:</strong> Model selection is governed strictly by <strong>5-Fold Stratified Cross-Validation on the training set</strong> (N = 84,691). The test partition (N = 21,173) is reported below for standardized comparison with prior runs.
  </div>

  <table>
    <thead>
      <tr>
        <th>Model</th>
        <th>5-Fold CV Accuracy</th>
        <th>5-Fold CV F1-Score</th>
        <th>Test Partition Acc</th>
        <th>Test Partition F1</th>
        <th>Test ROC-AUC</th>
        <th>Operational Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Dummy Baseline</strong></td>
        <td>51.86%</td>
        <td>0.0000</td>
        <td>51.86%</td>
        <td>0.0000</td>
        <td>0.5000</td>
        <td>Zero-information most-frequent baseline</td>
      </tr>
      <tr>
        <td><strong>Logistic Regression (Selected)</strong></td>
        <td>62.25% (±0.28%)</td>
        <td>0.5874 (±0.0035)</td>
        <td>58.69%* / 62.67%</td>
        <td>50.70%* / 0.5934</td>
        <td>0.6213* / 0.6733</td>
        <td>Initial baseline: 58.69% Acc, 50.70% F1; Final: 62.67% Acc</td>
      </tr>
      <tr style="background-color: #FEF2F2; font-weight: 600;">
        <td><strong>Random Forest Classifier</strong></td>
        <td><strong>63.08% (±0.22%)</strong></td>
        <td><strong>0.6006 (±0.0022)</strong></td>
        <td>63.17%</td>
        <td>0.6019</td>
        <td>0.6837</td>
        <td>★ Best single model selected by CV F1-score</td>
      </tr>
      <tr>
        <td><strong>Extra Trees Classifier</strong></td>
        <td>62.97% (±0.25%)</td>
        <td>0.5920 (±0.0020)</td>
        <td>63.11% (63.22% in run 2)</td>
        <td>0.5965 (0.6005 in run 2)</td>
        <td>0.6814</td>
        <td>Tuned 120 trees, max depth 16</td>
      </tr>
      <tr>
        <td><strong>HistGradientBoosting</strong></td>
        <td>63.01% (±0.29%)</td>
        <td>0.5991 (±0.0032)</td>
        <td>63.19%</td>
        <td>0.6015</td>
        <td>0.6824</td>
        <td>Fast gradient boosted histograms</td>
      </tr>
      <tr style="background-color: #F0FDF4; font-weight: 700;">
        <td><strong>Soft Voting Ensemble (Latest)</strong></td>
        <td><strong>63.23% (±0.23%)</strong></td>
        <td><strong>0.6002 (±0.0028)</strong></td>
        <td><strong>63.39%</strong></td>
        <td><strong>0.6030</strong></td>
        <td><strong>0.6851</strong></td>
        <td>★ Highest CV Acc (63.23%) &amp; Test Acc (63.39%)</td>
      </tr>
    </tbody>
  </table>

  <p style="font-size: 8.5pt; color: #475569; margin-top: -2pt;">
    *<em>Note: 58.69% accuracy, 50.70% F1, and TN = 7,928 &bull; FP = 3,052 &bull; FN = 5,695 &bull; TP = 4,498 reflect the initial baseline (One-Hot).</em><br/>
    <strong>Final Best Model Confusion Matrix (21,173 test venues):</strong> TN = 7,533 &bull; FP = 3,447 &bull; FN = 4,305 &bull; TP = 5,888. Plot artifact: <code>output/ml_rating_final_experiment_confusion_matrix.png</code>.<br/>
    <strong>Top Feature Importances (Gini):</strong> City (27.3%), Micro-Locality (22.6%), Primary Cuisine (17.3%), Price Tier (13.8%), Offers Count (3.5%). Plot artifact: <code>output/ml_rating_final_experiment_feature_importance.png</code>.<br/>
    <strong>Brand Generalization (GroupKFold):</strong> RF Group CV F1 = 0.5946 ± 0.0040 (vs 0.6006 Stratified CV), confirming robust generalization to unseen dining brands (&Delta; &lt; 0.006).<br/>
    <strong>Methodological Disclosures:</strong> The final ensemble's 63.39% test accuracy is only a small improvement over the previous Extra Trees result of 63.22%, representing an incremental refinement rather than a major breakthrough. Because the test partition was examined during earlier experiments, it is not a fully independent final evaluation; future validation should use a freshly scraped dataset. These experiments evaluate statistical associations and do not prove an intrinsic statistical ceiling, establish causation, or guarantee customer satisfaction.
  </p>

  <h3>6.2 Grubhub Delivery Time Regression (N = 8,088 Delivery Venues)</h3>
  <p style="font-size: 9.5pt; color: #475569;">
    <strong>Target:</strong> Continuous <code>delivery_time</code> in minutes (Mean: 42.54 min, Median: 40.0 min, Range: 17.5 to 127.5 min).
  </p>
  <table>
    <thead>
      <tr>
        <th>Model</th>
        <th>MAE</th>
        <th>MSE</th>
        <th>RMSE</th>
        <th>R² Score</th>
        <th>Operational Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Dummy Regressor</strong></td>
        <td>11.38 min</td>
        <td>216.40</td>
        <td>14.71 min</td>
        <td>-0.0016</td>
        <td>Mean baseline strategy</td>
      </tr>
      <tr>
        <td><strong>Ridge Regression</strong></td>
        <td>7.66 min</td>
        <td>109.04</td>
        <td>10.44 min</td>
        <td>0.4953</td>
        <td>L2 regularized linear model</td>
      </tr>
      <tr style="background-color: #FEF2F2; font-weight: 600;">
        <td><strong>Random Forest Regressor (Selected)</strong></td>
        <td>6.51 min</td>
        <td>83.65</td>
        <td>9.15 min</td>
        <td>0.6128</td>
        <td>Explains 61.28% variance; lowest error</td>
      </tr>
    </tbody>
  </table>
  <p style="font-size: 9pt; color: #334155; margin-top: -4pt;">
    <strong>Plot Artifact:</strong> <code>output/ml_delivery_time_predictions.png</code>.
  </p>

  <h2>7. Data Quality & Limitations Disclosures</h2>
  <div class="disclaimer-box">
    <strong>Data Provenance & Policy Notice:</strong> All dataset records reflect historical research snapshots and must not be presented as live commercial offers. The observation units differ across platforms (order logs vs menus vs venues). Foreign currencies are converted at benchmark rates (1 USD ≈ ₹83.50, 1 PKR ≈ ₹0.30 as of Oct 2026). Unrecorded delivery fees are explicitly flagged rather than fabricated. Models demonstrate correlation, not direct causality.
  </div>

  <h2>8. Conclusion</h2>
  <p>
    This project demonstrates an academic big-data lifecycle—from heterogeneous ingestion to distributed PySpark normalization, automated quality audits, and consumer-facing transparency interfaces. By standardizing currencies into Indian Rupees while explicitly preserving provenance, the project demonstrates how data engineering can bridge disparate data models without compromising empirical rigor.
  </p>

  <div class="footer-note">
    &copy; 2026 FoodCompare &bull; Academic Capstone Project: Comparative Big Data Analytics of Online Food Delivery Platforms
  </div>
</body>
</html>`;
}

/**
 * Trigger client-side download of Markdown report
 */
export function downloadMarkdownReport() {
  const mdContent = generateMarkdownReport();
  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'FoodCompare_BigData_Research_Report.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Open print-to-PDF dialog with complete print styling
 */
export function printOrSavePdfReport() {
  const htmlContent = generateHtmlReport();
  const printWindow = window.open('', '_blank', 'width=900,height=750');
  if (!printWindow) {
    throw new Error('Popup blocked! Please allow popups to save the PDF report.');
  }
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for resources then trigger print
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
