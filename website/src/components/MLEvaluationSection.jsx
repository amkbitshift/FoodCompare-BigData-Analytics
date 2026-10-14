import React, { useState } from 'react';
import {
  ML_CLASSIFICATION_FINAL_RESULTS,
  ML_CLASSIFICATION_IMPROVED_RESULTS,
  ML_CLASSIFICATION_RESULTS,
  ML_REGRESSION_RESULTS,
  ML_EXPERIMENT_METADATA
} from '../data/mlResults';

export default function MLEvaluationSection() {
  const [activeTab, setActiveTab] = useState('classification'); // 'classification' | 'regression' | 'methodology'
  const [classificationExperiment, setClassificationExperiment] = useState('final'); // 'final' | 'improved' | 'baseline'

  const finalClf = ML_CLASSIFICATION_FINAL_RESULTS;
  const improvedClf = ML_CLASSIFICATION_IMPROVED_RESULTS;
  const baselineClf = ML_CLASSIFICATION_RESULTS;
  const reg = ML_REGRESSION_RESULTS;

  return (
    <section id="ml-evaluation-section" className="card" style={{ padding: '28px', marginBottom: '28px', backgroundColor: '#FFFFFF' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span className="badge badge-coral">Predictive Analytics</span>
            <span className="text-muted" style={{ fontSize: 12 }}>
              scikit-learn 1.9.0 &bull; 5-Fold Cross-Validation &bull; Supervised ML Benchmarks
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Machine Learning Model Evaluation & Benchmark Experiments
          </h2>
          <p className="text-muted" style={{ fontSize: '13px', marginTop: 4, maxWidth: 880 }}>
            Supervised learning experiments evaluating restaurant rating classification on 105,864 Swiggy records across 3 iterative benchmarks and delivery time regression on 8,088 Grubhub operational orders.
          </p>
        </div>

        {/* Experiment Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            gap: '4px',
            border: '1px solid var(--border-default)'
          }}
        >
          <button
            onClick={() => setActiveTab('classification')}
            style={{
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: activeTab === 'classification' ? 700 : 500,
              backgroundColor: activeTab === 'classification' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'classification' ? 'var(--coral-700)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              boxShadow: activeTab === 'classification' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            🎯 Rating Classification
          </button>

          <button
            onClick={() => setActiveTab('regression')}
            style={{
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: activeTab === 'regression' ? 700 : 500,
              backgroundColor: activeTab === 'regression' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'regression' ? 'var(--coral-700)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              boxShadow: activeTab === 'regression' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            ⏱️ Delivery Time Regression
          </button>

          <button
            onClick={() => setActiveTab('methodology')}
            style={{
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: activeTab === 'methodology' ? 700 : 500,
              backgroundColor: activeTab === 'methodology' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'methodology' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              boxShadow: activeTab === 'methodology' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            🛡️ Leakage Prevention & Design
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: CLASSIFICATION EXPERIMENT                                */}
      {/* ============================================================== */}
      {activeTab === 'classification' && (
        <div>
          {/* Classification Iteration Selector Sub-Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18, padding: '10px 14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>EXPERIMENT ITERATION:</span>
              <div style={{ display: 'inline-flex', gap: 6 }}>
                <button
                  onClick={() => setClassificationExperiment('final')}
                  style={{
                    padding: '5px 12px',
                    fontSize: 12,
                    fontWeight: classificationExperiment === 'final' ? 700 : 500,
                    backgroundColor: classificationExperiment === 'final' ? 'var(--coral-700)' : '#FFFFFF',
                    color: classificationExperiment === 'final' ? '#FFFFFF' : 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                >
                  Controlled Final Experiment (Latest) ★
                </button>
                <button
                  onClick={() => setClassificationExperiment('improved')}
                  style={{
                    padding: '5px 12px',
                    fontSize: 12,
                    fontWeight: classificationExperiment === 'improved' ? 700 : 500,
                    backgroundColor: classificationExperiment === 'improved' ? 'var(--coral-700)' : '#FFFFFF',
                    color: classificationExperiment === 'improved' ? '#FFFFFF' : 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                >
                  Enhanced Benchmark (TargetEncoder)
                </button>
                <button
                  onClick={() => setClassificationExperiment('baseline')}
                  style={{
                    padding: '5px 12px',
                    fontSize: 12,
                    fontWeight: classificationExperiment === 'baseline' ? 700 : 500,
                    backgroundColor: classificationExperiment === 'baseline' ? 'var(--coral-700)' : '#FFFFFF',
                    color: classificationExperiment === 'baseline' ? '#FFFFFF' : 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                >
                  Initial Baseline (One-Hot)
                </button>
              </div>
            </div>

            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Target: <code>Rating_Numeric &ge; 4.2</code> &bull; 105,864 Rated Venues
            </div>
          </div>

          {/* FINAL EXPERIMENT VIEW */}
          {classificationExperiment === 'final' && (
            <div>
              {/* Highlight KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginBottom: 20 }}>
                <div style={{ padding: '14px 16px', backgroundColor: '#FEF2F2', borderRadius: 'var(--radius-md)', border: '1px solid #FECDD3' }}>
                  <div style={{ fontSize: 11, color: 'var(--coral-700)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Soft Voting Ensemble (Test)
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#991B1B', marginTop: 4 }}>
                    63.39% Acc &bull; 0.6030 F1
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    ROC-AUC: <strong>0.6851</strong> (RF + HGB + ET)
                  </div>
                </div>

                <div style={{ padding: '14px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    5-Fold CV Performance (Train)
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                    63.23% Acc &bull; 0.6002 F1
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    Ensemble CV ROC-AUC: <strong>0.6822</strong> (&plusmn;0.0044)
                  </div>
                </div>

                <div style={{ padding: '14px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Best Single Model (By CV F1)
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                    Random Forest
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--green-700)', marginTop: 2 }}>
                    CV F1: <strong>0.6006 &plusmn; 0.0022</strong> (Acc: 63.08%)
                  </div>
                </div>

                <div style={{ padding: '14px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Brand Generalization (GroupKFold)
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                    0.5946 - 0.5971 F1
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    &Delta; &lt; 0.006 vs Stratified CV (Robust)
                  </div>
                </div>
              </div>

              {/* Methodological Transparency Notice */}
              <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 12, color: '#334155', lineHeight: 1.5 }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>🔬 Evaluation Integrity Note:</span> To prevent selection bias from prior test-set inspections, <strong>model selection is strictly governed by 5-fold Stratified Cross-Validation on the training set</strong> (N = 84,691). The test partition (N = 21,173) is reported below for standardized comparison with earlier runs and is not claimed as an untouched final holdout.
              </div>

              {/* TABLE 1: 5-FOLD STRATIFIED CROSS-VALIDATION */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    1. 5-Fold Stratified Cross-Validation on Training Set (N = 84,691) — Model Selection
                  </h3>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Evaluated across 5 validation folds</span>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-default)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        <th style={{ padding: '10px 14px' }}>Model</th>
                        <th style={{ padding: '10px 14px' }}>CV Accuracy</th>
                        <th style={{ padding: '10px 14px' }}>CV Balanced Acc</th>
                        <th style={{ padding: '10px 14px' }}>CV Precision</th>
                        <th style={{ padding: '10px 14px' }}>CV Recall</th>
                        <th style={{ padding: '10px 14px' }}>CV F1-Score (Mean &plusmn; Std)</th>
                        <th style={{ padding: '10px 14px' }}>CV ROC-AUC</th>
                        <th style={{ padding: '10px 14px' }}>Selection Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(finalClf.cross_validation_training_set).map(([name, m]) => {
                        const isBestSingle = name === 'RandomForest';
                        const isEnsemble = name === 'SoftVotingEnsemble';
                        return (
                          <tr
                            key={name}
                            style={{
                              borderBottom: '1px solid var(--border-light)',
                              backgroundColor: isBestSingle ? 'var(--coral-50)' : isEnsemble ? '#F0FDF4' : '#FFFFFF'
                            }}
                          >
                            <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {name === 'Dummy_Baseline' ? 'Dummy Baseline' : name === 'SoftVotingEnsemble' ? 'Soft Voting Ensemble (RF + HGB + ET)' : name}
                            </td>
                            <td style={{ padding: '12px 14px', fontWeight: 600 }}>{(m.cv_accuracy_mean * 100).toFixed(2)}% (&plusmn;{(m.cv_accuracy_std * 100).toFixed(2)}%)</td>
                            <td style={{ padding: '12px 14px' }}>{(m.cv_balanced_accuracy_mean * 100).toFixed(2)}%</td>
                            <td style={{ padding: '12px 14px' }}>{(m.cv_precision_mean * 100).toFixed(2)}%</td>
                            <td style={{ padding: '12px 14px' }}>{(m.cv_recall_mean * 100).toFixed(2)}%</td>
                            <td style={{ padding: '12px 14px', fontWeight: 700, color: isBestSingle ? 'var(--coral-700)' : isEnsemble ? 'var(--green-700)' : 'inherit' }}>
                              {m.cv_f1_mean.toFixed(4)} &plusmn; {m.cv_f1_std.toFixed(4)}
                            </td>
                            <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                              {m.cv_roc_auc_mean !== null ? `${m.cv_roc_auc_mean.toFixed(4)} (±${m.cv_roc_auc_std.toFixed(4)})` : '0.5000'}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              {isBestSingle ? (
                                <span className="badge badge-coral">★ Best Single Model (CV F1)</span>
                              ) : isEnsemble ? (
                                <span className="badge badge-green">★ Highest CV Accuracy & AUC</span>
                              ) : name === 'HistGradientBoosting' ? (
                                <span className="badge badge-blue">Strong Single Model</span>
                              ) : (
                                <span className="badge badge-neutral">Evaluated</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABLE 2: TEST PARTITION BENCHMARK */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    2. Test Partition Benchmark (N = 21,173) — Comparative Metrics
                  </h3>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Held-out partition evaluation</span>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-default)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        <th style={{ padding: '10px 14px' }}>Model</th>
                        <th style={{ padding: '10px 14px' }}>Accuracy</th>
                        <th style={{ padding: '10px 14px' }}>Balanced Acc</th>
                        <th style={{ padding: '10px 14px' }}>Precision</th>
                        <th style={{ padding: '10px 14px' }}>Recall</th>
                        <th style={{ padding: '10px 14px' }}>F1-Score</th>
                        <th style={{ padding: '10px 14px' }}>ROC-AUC</th>
                        <th style={{ padding: '10px 14px' }}>Confusion Matrix (TN / FP / FN / TP)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(finalClf.test_partition_evaluation).map(([name, m]) => {
                        const isEnsemble = name === 'SoftVotingEnsemble';
                        const isRF = name === 'RandomForest';
                        return (
                          <tr
                            key={name}
                            style={{
                              borderBottom: '1px solid var(--border-light)',
                              backgroundColor: isEnsemble ? '#FEF2F2' : isRF ? 'var(--coral-50)' : '#FFFFFF'
                            }}
                          >
                            <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {name === 'Dummy_Baseline' ? 'Dummy Baseline' : name === 'SoftVotingEnsemble' ? 'Soft Voting Ensemble (RF+HGB+ET)' : name}
                            </td>
                            <td style={{ padding: '12px 14px', fontWeight: 600 }}>{(m.accuracy * 100).toFixed(2)}%</td>
                            <td style={{ padding: '12px 14px' }}>{(m.balanced_accuracy * 100).toFixed(2)}%</td>
                            <td style={{ padding: '12px 14px' }}>{(m.precision * 100).toFixed(2)}%</td>
                            <td style={{ padding: '12px 14px' }}>{(m.recall * 100).toFixed(2)}%</td>
                            <td style={{ padding: '12px 14px', fontWeight: 700, color: isEnsemble ? 'var(--coral-700)' : 'inherit' }}>
                              {m.f1_score.toFixed(4)}
                            </td>
                            <td style={{ padding: '12px 14px', fontWeight: 600 }}>{m.roc_auc !== null ? m.roc_auc.toFixed(4) : '0.5000'}</td>
                            <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)' }}>
                              {m.confusion_matrix.true_negatives.toLocaleString()} / {m.confusion_matrix.false_positives.toLocaleString()} / {m.confusion_matrix.false_negatives.toLocaleString()} / {m.confusion_matrix.true_positives.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* VISUALIZATIONS GRID: CONFUSION MATRIX & FEATURE IMPORTANCE */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 20 }}>
                {/* Confusion Matrix Card */}
                <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 16, backgroundColor: '#FFFFFF' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Final Best Model Confusion Matrix (Random Forest, N = 21,173)
                  </div>
                  <div style={{ textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', padding: 12 }}>
                    <img
                      src="/charts/ml_rating_final_experiment_confusion_matrix.png"
                      alt="Confusion Matrix: Best Random Forest Model"
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                    Generated by <code>scripts/train_rating_classifier_final_experiment.py</code> &bull; Saved to <code>output/ml_rating_final_experiment_confusion_matrix.png</code>
                  </div>
                </div>

                {/* Feature Importance Card */}
                <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 16, backgroundColor: '#FFFFFF' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Predictor Importance Hierarchy (Gini Impurity Decrease)
                  </div>
                  <div style={{ textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', padding: 12 }}>
                    <img
                      src="/charts/ml_rating_final_experiment_feature_importance.png"
                      alt="Feature Importance: Random Forest Classifier"
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                    Generated by <code>scripts/train_rating_classifier_final_experiment.py</code> &bull; Saved to <code>output/ml_rating_final_experiment_feature_importance.png</code>
                  </div>
                </div>
              </div>

              {/* Incremental Improvement Rationale & Academic Limitations */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 16 }}>
                <div style={{ padding: '14px 18px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Benchmark Comparison & Honest Findings
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                    The final Soft Voting Ensemble achieves <strong>63.39% test accuracy</strong> and an F1-score of <strong>0.6030</strong>, representing a modest refinement over the previous Extra Trees result (<strong>63.22% Acc, 0.6005 F1</strong>) and a major improvement over the baseline Logistic Regression (<strong>58.69% Acc, 0.5070 F1</strong>).
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    All top tree ensembles converge closely within <strong>63.0% – 63.4% accuracy</strong>. Differences fall within cross-validation variance (&plusmn;0.22% to &plusmn;0.29%), showing that tabular listing attributes have reached an empirical predictive boundary.
                  </p>
                </div>

                <div style={{ padding: '14px 18px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Brand-Level Generalization Audit
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                    Evaluating <strong>GroupKFold grouped by Restaurant Name</strong> yields a Group CV F1 of <strong>0.5946 &plusmn; 0.0040</strong> for Random Forest and <strong>0.5971 &plusmn; 0.0053</strong> for HistGradientBoosting.
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    The minimal performance delta (&lt; 0.006) confirms that the models generalize robustly to previously unseen restaurant brands rather than simply memorizing national chain identities.
                  </p>
                </div>
              </div>

              {/* Academic Limitation Banner */}
              <div style={{ padding: '12px 16px', backgroundColor: 'var(--amber-50)', border: '1px solid var(--amber-border)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--amber-800)', lineHeight: 1.5 }}>
                ⚠️ <strong>Academic Limitation Notice:</strong> {finalClf.limitations} These models do not establish culinary causation or guarantee consumer satisfaction.
              </div>
            </div>
          )}

          {/* IMPROVED EXPERIMENT VIEW */}
          {classificationExperiment === 'improved' && (
            <div>
              <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Enhanced Benchmark: Target Encoding on 576 Cities &amp; 14.4K Neighborhoods
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  This iteration introduced cross-validated <code>TargetEncoder</code> to resolve high-cardinality geographic information loss from one-hot encoding, lifting F1 from 0.5070 to 0.6005 on the test set.
                </p>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-default)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 14px' }}>Model</th>
                      <th style={{ padding: '10px 14px' }}>Accuracy</th>
                      <th style={{ padding: '10px 14px' }}>Balanced Acc</th>
                      <th style={{ padding: '10px 14px' }}>Precision</th>
                      <th style={{ padding: '10px 14px' }}>Recall</th>
                      <th style={{ padding: '10px 14px' }}>F1-Score</th>
                      <th style={{ padding: '10px 14px' }}>ROC-AUC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(improvedClf.models_evaluated).map(([name, m]) => (
                      <tr key={name} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: name === improvedClf.selected_model ? 'var(--coral-50)' : '#FFFFFF' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>{name}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{(m.accuracy * 100).toFixed(2)}%</td>
                        <td style={{ padding: '12px 14px' }}>{m.balanced_accuracy ? (m.balanced_accuracy * 100).toFixed(2) + '%' : '—'}</td>
                        <td style={{ padding: '12px 14px' }}>{m.precision ? (m.precision * 100).toFixed(2) + '%' : '—'}</td>
                        <td style={{ padding: '12px 14px' }}>{m.recall ? (m.recall * 100).toFixed(2) + '%' : '—'}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: name === improvedClf.selected_model ? 'var(--coral-700)' : 'inherit' }}>{m.f1_score.toFixed(4)}</td>
                        <td style={{ padding: '12px 14px' }}>{m.roc_auc.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', padding: 12, border: '1px solid var(--border-default)' }}>
                <img src="/charts/ml_rating_improved_confusion_matrix.png" alt="Improved Confusion Matrix" style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }} />
              </div>
            </div>
          )}

          {/* BASELINE EXPERIMENT VIEW */}
          {classificationExperiment === 'baseline' && (
            <div>
              <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Initial Baseline: One-Hot Categorical Encoding (max_categories=30)
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  The original experiment established baseline performance with untuned Logistic Regression and Random Forest models. One-hot encoding truncated locations and excluded micro-neighborhood area context.
                </p>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-default)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 14px' }}>Model</th>
                      <th style={{ padding: '10px 14px' }}>Accuracy</th>
                      <th style={{ padding: '10px 14px' }}>Balanced Acc</th>
                      <th style={{ padding: '10px 14px' }}>Precision</th>
                      <th style={{ padding: '10px 14px' }}>Recall</th>
                      <th style={{ padding: '10px 14px' }}>F1-Score</th>
                      <th style={{ padding: '10px 14px' }}>ROC-AUC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(baselineClf.models_evaluated).map(([name, m]) => (
                      <tr key={name} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: name === baselineClf.selected_model ? 'var(--coral-50)' : '#FFFFFF' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>{name}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{(m.accuracy * 100).toFixed(2)}%</td>
                        <td style={{ padding: '12px 14px' }}>{(m.balanced_accuracy * 100).toFixed(2)}%</td>
                        <td style={{ padding: '12px 14px' }}>{(m.precision * 100).toFixed(2)}%</td>
                        <td style={{ padding: '12px 14px' }}>{(m.recall * 100).toFixed(2)}%</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: name === baselineClf.selected_model ? 'var(--coral-700)' : 'inherit' }}>{m.f1_score.toFixed(4)}</td>
                        <td style={{ padding: '12px 14px' }}>{m.roc_auc.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', padding: 12, border: '1px solid var(--border-default)' }}>
                <img src="/charts/ml_rating_confusion_matrix.png" alt="Baseline Confusion Matrix" style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: REGRESSION EXPERIMENT                                    */}
      {/* ============================================================== */}
      {activeTab === 'regression' && (
        <div>
          {/* Metadata Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>TARGET VARIABLE</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                delivery_time (minutes)
              </div>
              <div style={{ fontSize: 11, color: 'var(--navy-700)', marginTop: 2 }}>Continuous Delivery Duration</div>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>SOURCE DATASET</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                Grubhub Cleaned
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                8,088 operational delivery logs (0 excluded)
              </div>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>TARGET DISTRIBUTION</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                Mean 42.5 min &bull; Std 14.4 min
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Range: 17.5 to 127.5 minutes</div>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>SPLIT SIZES</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                6,470 Train / 1,618 Test
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>80/20 Split (Seed 42)</div>
            </div>
          </div>

          {/* Model Performance Comparison Table */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 8 }}>
              Test-Set Regression Metrics (N = {reg.test_samples.toLocaleString()})
            </h3>

            <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-default)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 14px' }}>Model</th>
                    <th style={{ padding: '10px 14px' }}>Mean Absolute Error (MAE)</th>
                    <th style={{ padding: '10px 14px' }}>Mean Squared Error (MSE)</th>
                    <th style={{ padding: '10px 14px' }}>Root Mean Squared Error (RMSE)</th>
                    <th style={{ padding: '10px 14px' }}>Variance Explained (R²)</th>
                    <th style={{ padding: '10px 14px' }}>Selection Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(reg.models_evaluated).map(([name, m]) => {
                    const isSelected = name === reg.selected_model;
                    return (
                      <tr
                        key={name}
                        style={{
                          borderBottom: '1px solid var(--border-light)',
                          backgroundColor: isSelected ? 'var(--coral-50)' : '#FFFFFF'
                        }}
                      >
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {name}
                          {name === 'DummyRegressor' && (
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', fontWeight: 400 }}>
                              Baseline (mean prediction)
                            </span>
                          )}
                          {name === 'Ridge' && (
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', fontWeight: 400 }}>
                              L2 Regularized Linear Model, alpha=1.0
                            </span>
                          )}
                          {name === 'RandomForestRegressor' && (
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', fontWeight: 400 }}>
                              100 Trees, Depth 10, min_split=8
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: isSelected ? 700 : 500 }}>
                          {m.mae.toFixed(2)} min
                        </td>
                        <td style={{ padding: '12px 14px' }}>{m.mse.toFixed(2)}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: isSelected ? 'var(--coral-700)' : 'inherit' }}>
                          {m.rmse.toFixed(2)} min
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: isSelected ? 'var(--green-600)' : 'inherit' }}>
                          {m.r2_score.toFixed(4)} ({Math.round(m.r2_score * 100)}%)
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          {isSelected ? (
                            <span className="badge badge-coral">★ Best Model (Lowest RMSE)</span>
                          ) : name === 'Ridge' ? (
                            <span className="badge badge-blue">Linear Model (R²=0.50)</span>
                          ) : (
                            <span className="badge badge-neutral">Baseline</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actual vs Predicted Plot & Residuals Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 20 }}>
            <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 16, backgroundColor: '#FFFFFF' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Actual vs. Predicted Delivery Time & Residuals
              </div>
              <div style={{ textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', padding: 12 }}>
                <img
                  src="/charts/ml_delivery_time_predictions.png"
                  alt="Actual vs Predicted Delivery Time Plot"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }}
                />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                Generated by <code>scripts/train_delivery_regressor.py</code> &bull; Saved to <code>output/ml_delivery_time_predictions.png</code>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
                  Selected Model Summary ({reg.selected_model})
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  <div style={{ padding: 10, backgroundColor: '#FFFFFF', borderRadius: 6, border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Root Mean Squared Error</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--coral-700)', marginTop: 2 }}>
                      {reg.selected_model_metrics.rmse.toFixed(2)} min
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--green-600)', marginTop: 2 }}>-37.8% vs Baseline (14.71 min)</div>
                  </div>

                  <div style={{ padding: 10, backgroundColor: '#FFFFFF', borderRadius: 6, border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mean Absolute Error</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                      {reg.selected_model_metrics.mae.toFixed(2)} min
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Average deviation from ground truth</div>
                  </div>

                  <div style={{ padding: 10, backgroundColor: '#FFFFFF', borderRadius: 6, border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Variance Explained (R²)</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--green-600)', marginTop: 2 }}>
                      {(reg.selected_model_metrics.r2_score * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>R² score of 0.6128</div>
                  </div>

                  <div style={{ padding: 10, backgroundColor: '#FFFFFF', borderRadius: 6, border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Key Features Used</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-700)', marginTop: 2 }}>
                      Distance, Fees, Metros
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>9 scaled &amp; one-hot predictors</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '14px 18px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', flex: 1 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Non-Linear Feature Interaction
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  The <strong>RandomForestRegressor</strong> outperforms <strong>Ridge</strong> (RMSE 9.15 min vs 10.44 min; R² 0.61 vs 0.50) because delivery durations exhibit non-linear step increments (e.g. courier dispatch staging, prep-time floors) across urban delivery distances and metropolitan zones.
                </p>
              </div>
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: 'var(--amber-50)', border: '1px solid var(--amber-border)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--amber-800)', lineHeight: 1.5 }}>
            ⚠️ <strong>Academic Limitation Notice:</strong> {reg.limitations}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LEAKAGE PREVENTION & DESIGN ARCHITECTURE                */}
      {/* ============================================================== */}
      {activeTab === 'methodology' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 16 }}>
            <div style={{ padding: '18px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                🛡️ Classification Leakage Prevention Strategy
              </h4>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                In restaurant rating classification, including popularity counts or rating labels as features causes synthetic target leakage. The Swiggy pipeline explicitly dropped the following columns before modeling:
              </p>
              <ul style={{ paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {finalClf.leakage_prevention_dropped.map((col) => (
                  <li key={col}><code>{col}</code> — rating label or review count derivative</li>
                ))}
              </ul>
            </div>

            <div style={{ padding: '18px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                🛡️ Regression Leakage Prevention Strategy
              </h4>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                In delivery-time regression, raw text strings, unique location keys, and scraped web identifiers contain ungeneralizable shortcuts. The Grubhub pipeline excluded:
              </p>
              <ul style={{ paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {reg.leakage_prevention_dropped.map((col) => (
                  <li key={col}><code>{col}</code> — unparsed string, ID, or non-predictive metadata</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Reproducibility Commands
            </h4>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
              All experiments can be re-run deterministically using the Python scripts:
            </div>
            <pre style={{ backgroundColor: 'var(--bg-app)', padding: '10px 14px', borderRadius: 6, fontSize: 12, border: '1px solid var(--border-default)', overflowX: 'auto' }}>
{`# 1. Controlled Final Classification Experiment (5-Fold CV + Soft Voting Ensemble)
python scripts/train_rating_classifier_final_experiment.py

# 2. Enhanced Benchmark (TargetEncoder Tuning)
python scripts/train_rating_classifier_improved.py

# 3. Initial Baseline Classification
python scripts/train_rating_classifier.py

# 4. Delivery Time Regression
python scripts/train_delivery_regressor.py`}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
