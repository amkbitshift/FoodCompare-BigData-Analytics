/**
 * FoodCompare Machine Learning Evaluation Data
 * 
 * Sourced directly from genuine experiment runs:
 * - Baseline: scripts/train_rating_classifier.py -> output/ml_classification_results.json
 * - Improved: scripts/train_rating_classifier_improved.py -> output/ml_classification_improved_results.json
 * - Final Experiment: scripts/train_rating_classifier_final_experiment.py -> output/ml_classification_final_experiment.json
 * - Regression: scripts/train_delivery_regressor.py -> output/ml_regression_results.json
 */

/**
 * Baseline Classification Results (One-Hot Encoded, Untuned Ensembles)
 */
export const ML_CLASSIFICATION_RESULTS = {
  "task": "classification",
  "experiment_name": "Swiggy High-Rating Classification (Baseline)",
  "dataset_file": "output/swiggy_analysis_ready.csv",
  "total_dataset_rows": 139321,
  "valid_rated_rows": 105864,
  "excluded_unrated_rows": 33457,
  "target_definition": "Rating_Numeric >= 4.2",
  "class_distribution": {
    "positive_high_rated": 50964,
    "negative_standard": 54900,
    "positive_percentage": 48.14
  },
  "train_samples": 84691,
  "test_samples": 21173,
  "random_seed": 42,
  "test_size": 0.2,
  "features_used": [
    "price_numeric",
    "offers_count",
    "pure_veg_flag",
    "primary_cuisine",
    "location_clean"
  ],
  "leakage_prevention_dropped": [
    "Rating",
    "Rating_Numeric",
    "Rating_Is_New",
    "Rating_Count_Minimum",
    "Rating_Count_Type",
    "Rating_Count_Unavailable",
    "Number of Ratings"
  ],
  "models_evaluated": {
    "DummyClassifier": {
      "accuracy": 0.5186,
      "balanced_accuracy": 0.5,
      "precision": 0.0,
      "recall": 0.0,
      "f1_score": 0.0,
      "roc_auc": 0.5,
      "model_type": "DummyClassifier",
      "parameters": {
        "strategy": "most_frequent"
      }
    },
    "LogisticRegression": {
      "accuracy": 0.5869,
      "balanced_accuracy": 0.5817,
      "precision": 0.5958,
      "recall": 0.4413,
      "f1_score": 0.507,
      "roc_auc": 0.6213,
      "model_type": "LogisticRegression",
      "parameters": {
        "C": "1.0",
        "max_iter": "1000"
      }
    },
    "RandomForestClassifier": {
      "accuracy": 0.5965,
      "balanced_accuracy": 0.5894,
      "precision": 0.6273,
      "recall": 0.3989,
      "f1_score": 0.4877,
      "roc_auc": 0.627,
      "model_type": "RandomForestClassifier",
      "parameters": {
        "max_depth": "12",
        "min_samples_split": "10",
        "n_estimators": "100"
      }
    }
  },
  "selected_model": "LogisticRegression",
  "selected_model_metrics": {
    "accuracy": 0.5869,
    "balanced_accuracy": 0.5817,
    "precision": 0.5958,
    "recall": 0.4413,
    "f1_score": 0.507,
    "roc_auc": 0.6213,
    "model_type": "LogisticRegression",
    "parameters": {
      "C": "1.0",
      "max_iter": "1000"
    }
  },
  "selected_model_confusion_matrix": {
    "true_negatives": 7928,
    "false_positives": 3052,
    "false_negatives": 5695,
    "true_positives": 4498
  },
  "confusion_matrix_plot": "output/ml_rating_confusion_matrix.png",
  "limitations": "These models evaluate statistical associations between restaurant attributes (location, price, offers, cuisine) and customer ratings. They demonstrate correlation, not direct causality. A high prediction reflects market segmentation patterns rather than objective culinary quality."
};

/**
 * Improved Classification Results (Target Encoding + Hyperparameter Grid Tuning)
 */
export const ML_CLASSIFICATION_IMPROVED_RESULTS = {
  "task": "classification",
  "experiment_name": "Swiggy High-Rating Classification (Enhanced)",
  "dataset_file": "output/swiggy_analysis_ready.csv",
  "total_dataset_rows": 139321,
  "valid_rated_rows": 105864,
  "target_definition": "Rating_Numeric >= 4.2",
  "train_samples": 84691,
  "test_samples": 21173,
  "models_evaluated": {
    "DummyClassifier": {
      "accuracy": 0.5186,
      "f1_score": 0.0,
      "roc_auc": 0.5,
      "model_type": "DummyClassifier"
    },
    "Tuned_LogisticRegression": {
      "accuracy": 0.6280,
      "balanced_accuracy": 0.6259,
      "precision": 0.6248,
      "recall": 0.5691,
      "f1_score": 0.5956,
      "roc_auc": 0.6757,
      "model_type": "LogisticRegression"
    },
    "Tuned_RandomForest": {
      "accuracy": 0.6299,
      "balanced_accuracy": 0.6278,
      "precision": 0.6265,
      "recall": 0.5725,
      "f1_score": 0.5983,
      "roc_auc": 0.6804,
      "model_type": "RandomForestClassifier"
    },
    "ExtraTreesClassifier": {
      "accuracy": 0.6322,
      "balanced_accuracy": 0.6301,
      "precision": 0.6294,
      "recall": 0.5741,
      "f1_score": 0.6005,
      "roc_auc": 0.6800,
      "model_type": "ExtraTreesClassifier"
    },
    "HistGradientBoostingClassifier": {
      "accuracy": 0.6321,
      "balanced_accuracy": 0.6300,
      "precision": 0.6293,
      "recall": 0.5738,
      "f1_score": 0.6003,
      "roc_auc": 0.6814,
      "model_type": "HistGradientBoostingClassifier"
    }
  },
  "selected_model": "ExtraTreesClassifier",
  "selected_model_metrics": {
    "accuracy": 0.6322,
    "balanced_accuracy": 0.6301,
    "precision": 0.6294,
    "recall": 0.5741,
    "f1_score": 0.6005,
    "roc_auc": 0.6800
  },
  "confusion_matrix_plot": "output/ml_rating_improved_confusion_matrix.png",
  "feature_importance_plot": "output/ml_rating_improved_feature_importance.png"
};

/**
 * Final Controlled Classification Experiment Results
 * Features: 18 predictors (multi-cuisine tags, offer indicators, city-area interaction)
 * Model Selection: 5-Fold Stratified Cross-Validation on Training Set
 * Generalization: 5-Fold GroupKFold by Restaurant Name
 */
export const ML_CLASSIFICATION_FINAL_RESULTS = {
  "task": "classification",
  "experiment_name": "Swiggy High-Rating Classification (Controlled Final Experiment)",
  "dataset_file": "output/swiggy_analysis_ready.csv",
  "total_dataset_rows": 139321,
  "valid_rated_rows": 105864,
  "excluded_unrated_rows": 33457,
  "target_definition": "Rating_Numeric >= 4.2",
  "class_distribution": {
    "positive_high_rated": 50964,
    "negative_standard": 54900,
    "positive_percentage": 48.14
  },
  "train_samples": 84691,
  "test_partition_samples": 21173,
  "random_seed": 42,
  "test_size": 0.2,
  "validation_strategy": {
    "primary_model_selection": "5-Fold Stratified Cross-Validation on Training Set",
    "brand_generalization_audit": "5-Fold GroupKFold by Restaurant Name",
    "addressing_test_set_reuse": "Because the test partition was evaluated in prior iterations, using it to select models would introduce subtle selection bias. Model selection is strictly governed by 5-fold cross-validation on the training set. A completely independent evaluation would require either an out-of-time dataset of freshly scraped restaurants or a full Nested Cross-Validation (5x5) architecture."
  },
  "features_used": [
    "price_numeric",
    "log_price",
    "offers_count",
    "cuisine_count",
    "has_offers",
    "pure_veg_flag",
    "is_biryani",
    "is_desserts_bakery",
    "is_beverages",
    "is_fast_food",
    "is_north_indian",
    "is_south_indian",
    "has_trynew",
    "has_no_code",
    "has_bank_offer",
    "primary_cuisine",
    "location_clean",
    "city_area"
  ],
  "leakage_prevention_dropped": [
    "Rating",
    "Rating_Numeric",
    "Rating_Is_New",
    "Rating_Count_Minimum",
    "Rating_Count_Type",
    "Rating_Count_Unavailable",
    "Number of Ratings"
  ],
  "preprocessing_description": "StandardScaler for numeric predictors, passthrough for binary flags, and cross-validated TargetEncoder for high-cardinality geographical and culinary features.",
  
  // 5-Fold Stratified Cross-Validation on Training Set (N = 84,691)
  "cross_validation_training_set": {
    "Dummy_Baseline": {
      "cv_f1_mean": 0.0,
      "cv_f1_std": 0.0,
      "cv_accuracy_mean": 0.5186,
      "cv_accuracy_std": 0.0,
      "cv_roc_auc_mean": 0.5,
      "cv_roc_auc_std": 0.0,
      "cv_balanced_accuracy_mean": 0.5,
      "cv_balanced_accuracy_std": 0.0,
      "cv_precision_mean": 0.0,
      "cv_precision_std": 0.0,
      "cv_recall_mean": 0.0,
      "cv_recall_std": 0.0
    },
    "LogisticRegression": {
      "cv_f1_mean": 0.5874,
      "cv_f1_std": 0.0035,
      "cv_accuracy_mean": 0.6225,
      "cv_accuracy_std": 0.0028,
      "cv_roc_auc_mean": 0.6691,
      "cv_roc_auc_std": 0.0050,
      "cv_balanced_accuracy_mean": 0.6202,
      "cv_balanced_accuracy_std": 0.0028,
      "cv_precision_mean": 0.6198,
      "cv_precision_std": 0.0030,
      "cv_recall_mean": 0.5582,
      "cv_recall_std": 0.0038
    },
    "RandomForest": {
      "cv_f1_mean": 0.6006,
      "cv_f1_std": 0.0022,
      "cv_accuracy_mean": 0.6308,
      "cv_accuracy_std": 0.0022,
      "cv_roc_auc_mean": 0.6804,
      "cv_roc_auc_std": 0.0039,
      "cv_balanced_accuracy_mean": 0.6289,
      "cv_balanced_accuracy_std": 0.0021,
      "cv_precision_mean": 0.6268,
      "cv_precision_std": 0.0033,
      "cv_recall_mean": 0.5766,
      "cv_recall_std": 0.0041
    },
    "ExtraTrees": {
      "cv_f1_mean": 0.5920,
      "cv_f1_std": 0.0020,
      "cv_accuracy_mean": 0.6297,
      "cv_accuracy_std": 0.0025,
      "cv_roc_auc_mean": 0.6787,
      "cv_roc_auc_std": 0.0052,
      "cv_balanced_accuracy_mean": 0.6272,
      "cv_balanced_accuracy_std": 0.0024,
      "cv_precision_mean": 0.6305,
      "cv_precision_std": 0.0039,
      "cv_recall_mean": 0.5579,
      "cv_recall_std": 0.0029
    },
    "HistGradientBoosting": {
      "cv_f1_mean": 0.5991,
      "cv_f1_std": 0.0032,
      "cv_accuracy_mean": 0.6301,
      "cv_accuracy_std": 0.0029,
      "cv_roc_auc_mean": 0.6792,
      "cv_roc_auc_std": 0.0043,
      "cv_balanced_accuracy_mean": 0.6281,
      "cv_balanced_accuracy_std": 0.0028,
      "cv_precision_mean": 0.6264,
      "cv_precision_std": 0.0036,
      "cv_recall_mean": 0.5740,
      "cv_recall_std": 0.0047
    },
    "SoftVotingEnsemble": {
      "cv_f1_mean": 0.6002,
      "cv_f1_std": 0.0028,
      "cv_accuracy_mean": 0.6323,
      "cv_accuracy_std": 0.0023,
      "cv_roc_auc_mean": 0.6822,
      "cv_roc_auc_std": 0.0044,
      "cv_balanced_accuracy_mean": 0.6302,
      "cv_balanced_accuracy_std": 0.0023,
      "cv_precision_mean": 0.6298,
      "cv_precision_std": 0.0029,
      "cv_recall_mean": 0.5732,
      "cv_recall_std": 0.0040
    }
  },

  // Brand-level generalization: 5-Fold GroupKFold by Restaurant Name
  "brand_generalization_group_kfold": {
    "RandomForest": {
      "group_f1_mean": 0.5946,
      "group_f1_std": 0.0040,
      "group_accuracy_mean": 0.6269,
      "group_accuracy_std": 0.0013
    },
    "HistGradientBoosting": {
      "group_f1_mean": 0.5971,
      "group_f1_std": 0.0053,
      "group_accuracy_mean": 0.6283,
      "group_accuracy_std": 0.0037
    },
    "SoftVotingEnsemble": {
      "group_f1_mean": 0.5951,
      "group_f1_std": 0.0051,
      "group_accuracy_mean": 0.6285,
      "group_accuracy_std": 0.0034
    }
  },

  // Test partition metrics (N = 21,173) for exact benchmark tracking
  "test_partition_evaluation": {
    "Dummy_Baseline": {
      "accuracy": 0.5186,
      "balanced_accuracy": 0.5,
      "precision": 0.0,
      "recall": 0.0,
      "f1_score": 0.0,
      "roc_auc": 0.5,
      "confusion_matrix": {
        "true_negatives": 10980,
        "false_positives": 0,
        "false_negatives": 10193,
        "true_positives": 0
      }
    },
    "LogisticRegression": {
      "accuracy": 0.6267,
      "balanced_accuracy": 0.6246,
      "precision": 0.6238,
      "recall": 0.5659,
      "f1_score": 0.5934,
      "roc_auc": 0.6733,
      "confusion_matrix": {
        "true_negatives": 7502,
        "false_positives": 3478,
        "false_negatives": 4425,
        "true_positives": 5768
      }
    },
    "RandomForest": {
      "accuracy": 0.6317,
      "balanced_accuracy": 0.6297,
      "precision": 0.6273,
      "recall": 0.5785,
      "f1_score": 0.6019,
      "roc_auc": 0.6837,
      "confusion_matrix": {
        "true_negatives": 7477,
        "false_positives": 3503,
        "false_negatives": 4296,
        "true_positives": 5897
      }
    },
    "ExtraTrees": {
      "accuracy": 0.6311,
      "balanced_accuracy": 0.6288,
      "precision": 0.6299,
      "recall": 0.5665,
      "f1_score": 0.5965,
      "roc_auc": 0.6814,
      "confusion_matrix": {
        "true_negatives": 7588,
        "false_positives": 3392,
        "false_negatives": 4419,
        "true_positives": 5774
      }
    },
    "HistGradientBoosting": {
      "accuracy": 0.6319,
      "balanced_accuracy": 0.6299,
      "precision": 0.6281,
      "recall": 0.5771,
      "f1_score": 0.6015,
      "roc_auc": 0.6824,
      "confusion_matrix": {
        "true_negatives": 7497,
        "false_positives": 3483,
        "false_negatives": 4311,
        "true_positives": 5882
      }
    },
    "SoftVotingEnsemble": {
      "accuracy": 0.6339,
      "balanced_accuracy": 0.6319,
      "precision": 0.6307,
      "recall": 0.5777,
      "f1_score": 0.6030,
      "roc_auc": 0.6851,
      "confusion_matrix": {
        "true_negatives": 7533,
        "false_positives": 3447,
        "false_negatives": 4305,
        "true_positives": 5888
      }
    }
  },

  "selected_best_model_by_cv": "RandomForest",
  "selected_best_model_cv_metrics": {
    "cv_f1_mean": 0.6006,
    "cv_f1_std": 0.0022,
    "cv_accuracy_mean": 0.6308,
    "cv_accuracy_std": 0.0022,
    "cv_roc_auc_mean": 0.6804,
    "cv_roc_auc_std": 0.0039
  },
  "selected_ensemble_metrics": {
    "accuracy": 0.6339,
    "f1_score": 0.6030,
    "roc_auc": 0.6851,
    "cv_accuracy": 0.6323,
    "cv_f1_score": 0.6002
  },
  "feature_importance_gini": {
    "location_clean": 0.2732,
    "city_area": 0.2256,
    "primary_cuisine": 0.1735,
    "log_price": 0.0696,
    "price_numeric": 0.0675,
    "offers_count": 0.0346,
    "is_desserts_bakery": 0.0232,
    "pure_veg_flag": 0.0224,
    "cuisine_count": 0.0172,
    "is_fast_food": 0.0142,
    "has_trynew": 0.0135,
    "has_no_code": 0.0125,
    "is_beverages": 0.0111,
    "is_north_indian": 0.0106,
    "is_south_indian": 0.0102,
    "is_biryani": 0.0094,
    "has_bank_offer": 0.0090,
    "has_offers": 0.0028
  },
  "confusion_matrix_plot": "output/ml_rating_final_experiment_confusion_matrix.png",
  "feature_importance_plot": "output/ml_rating_final_experiment_feature_importance.png",
  "limitations": "These models evaluate statistical associations between restaurant attributes (location, micro-neighborhood area, price tier, offers count, cuisine) and customer ratings. They demonstrate correlation, not direct causality. The test partition was examined in earlier experiments and serves as a benchmark rather than an untouched holdout."
};

/**
 * Regression Results (Delivery Time Prediction)
 */
export const ML_REGRESSION_RESULTS = {
  "task": "regression",
  "experiment_name": "Grubhub Delivery Time Regression",
  "dataset_file": "output/grubhub_cleaned.csv",
  "total_dataset_rows": 8088,
  "valid_target_rows": 8088,
  "excluded_rows": 0,
  "target_variable": "delivery_time",
  "target_unit": "minutes",
  "target_distribution": {
    "mean": 42.54,
    "std": 14.42,
    "median": 40.0,
    "min": 17.5,
    "max": 127.5
  },
  "train_samples": 6470,
  "test_samples": 1618,
  "random_seed": 42,
  "test_size": 0.2,
  "features_used": [
    "distance",
    "delivery_fee",
    "service_fee",
    "review_count",
    "review_rating",
    "searched_metro_clean",
    "is_gh_clean",
    "primary_cuisine",
    "delivery_type_clean"
  ],
  "leakage_prevention_dropped": [
    "delivery_time_raw",
    "loc_number",
    "loc_name",
    "url",
    "address",
    "searched_address",
    "searched_zipcode",
    "phone",
    "RunDate",
    "restaurant_tags"
  ],
  "models_evaluated": {
    "DummyRegressor": {
      "mae": 11.3829,
      "mse": 216.4008,
      "rmse": 14.7106,
      "r2_score": -0.0016,
      "model_type": "DummyRegressor",
      "parameters": {
        "strategy": "mean"
      }
    },
    "Ridge": {
      "mae": 7.6583,
      "mse": 109.0369,
      "rmse": 10.4421,
      "r2_score": 0.4953,
      "model_type": "Ridge",
      "parameters": {
        "alpha": "1.0"
      }
    },
    "RandomForestRegressor": {
      "mae": 6.5089,
      "mse": 83.6542,
      "rmse": 9.1463,
      "r2_score": 0.6128,
      "model_type": "RandomForestRegressor",
      "parameters": {
        "max_depth": "10",
        "min_samples_split": "8",
        "n_estimators": "100"
      }
    }
  },
  "selected_model": "RandomForestRegressor",
  "selected_model_metrics": {
    "mae": 6.5089,
    "mse": 83.6542,
    "rmse": 9.1463,
    "r2_score": 0.6128,
    "model_type": "RandomForestRegressor",
    "parameters": {
      "max_depth": "10",
      "min_samples_split": "8",
      "n_estimators": "100"
    }
  },
  "predictions_plot": "output/ml_delivery_time_predictions.png",
  "limitations": "These models capture statistical associations between delivery distance, platform fees, review volume, and historical delivery times. They do not constitute live dispatch tracking or real-time road traffic routing estimates."
};

export const ML_EXPERIMENT_METADATA = {
  experimentDate: "October 2026",
  framework: "scikit-learn 1.9.0",
  pythonVersion: "3.14.6",
  trainTestSplit: "80% Train / 20% Test (random_state=42)",
  totalExperiments: 4,
  classificationDataset: "Swiggy Cleaned (105,864 valid rated items)",
  regressionDataset: "Grubhub Cleaned (8,088 delivery venue records)",
  latestExperiment: "Controlled Final Experiment (Soft Voting Ensemble & 5-Fold Stratified CV)"
};
