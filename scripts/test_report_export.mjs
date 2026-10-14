/**
 * Automated Test Suite for FoodCompare Research Report Generator
 */

import { generateMarkdownReport, generateHtmlReport } from '../website/src/utils/reportGenerator.js';

console.log('================================================================');
console.log('🧪 TESTING REPORT GENERATOR (MARKDOWN & PRINT-READY PDF HTML)');
console.log('================================================================');

let tests = 0;
let passed = 0;

function assert(condition, desc) {
  tests++;
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${desc}`);
  } else {
    console.error(`  ❌ FAIL: ${desc}`);
  }
}

// 1. Generate Markdown Report
const md = generateMarkdownReport();
assert(typeof md === 'string' && md.length > 2000, `Markdown report generated (${md.length} characters)`);

// 2. Required Sections in Markdown
assert(md.includes('# Comparative Big Data Analytics of Online Food Delivery Platforms'), 'Includes Project Title');
assert(md.includes('## 1. Abstract'), 'Includes Abstract section');
assert(md.includes('## 2. Research Objectives'), 'Includes Objectives section');
assert(md.includes('## 3. Dataset Inventory & Record Counts'), 'Includes Dataset Inventory section');
assert(md.includes('## 4. Data Cleaning, Deduplication & Quality Assessment'), 'Includes Data Cleaning & Quality Checks');
assert(md.includes('## 5. Exploratory Data Analysis (EDA) Findings'), 'Includes EDA Findings section');
assert(md.includes('## 6. Generated EDA Visualizations & Chart Artifacts'), 'Includes Existing Charts with Captions');
assert(md.includes('## 7. Methodological Workflow & Technology Stack'), 'Includes Technologies Used & Methodology');
assert(md.includes('## 8. Machine Learning Model Evaluation & Benchmark Experiments'), 'Includes ML Evaluation section');
assert(md.includes('## 9. Limitations & Data Provenance Disclosures'), 'Includes Limitations & Data Provenance');
assert(md.includes('## 10. Conclusion & Future Scope'), 'Includes Conclusion & Future Scope');

// 3. Check Real Verified Findings in Report
assert(md.includes('5,394,588'), 'Documents total 5.39M records processed');
assert(md.includes('139,321') && md.includes('4.04'), 'Documents Swiggy 139,321 records and 4.04 rating');
assert(md.includes('101,530') && md.includes('3.89'), 'Documents Zomato 101,530 records and 3.89 rating');
assert(md.includes('8,088') && md.includes('3.40'), 'Documents Grubhub 8,088 records and 3.40 rating');
assert(md.includes('5,082,180'), 'Documents 5.08M PySpark menu records');
assert(md.includes('37,527') && md.includes('Chinese'), 'Documents Chinese top cuisine volume');
assert(md.includes('28,722') && md.includes('North Indian'), 'Documents North Indian cuisine volume');
assert(md.includes('83.50') && md.includes('0.30'), 'Documents exchange rate benchmark assumptions');

// 4. Check All 8 Chart Artifacts are Cataloged
const chartArtifacts = [
  'comparative_average_ratings.png',
  'grubhub_delivery_metrics.png',
  'swiggy_price_distribution.png',
  'swiggy_rating_distribution.png',
  'swiggy_top_cuisines.png',
  'swiggy_top_cities.png',
  'comparative_zomato_top_cities.png',
  'comparative_swiggy_top_locations.png'
];
for (const c of chartArtifacts) {
  assert(md.includes(c), `Catalogs chart artifact "${c}"`);
}

// 5. Check ML Evaluation in Markdown
assert(md.includes('LogisticRegression (Selected)') && md.includes('58.69%'), 'Markdown includes classification metrics');
assert(md.includes('RandomForestRegressor (Selected)') && md.includes('6.51 min'), 'Markdown includes regression metrics');
assert(md.includes('7,928') && md.includes('4,498'), 'Markdown includes confusion matrix metrics');
assert(md.includes('ml_rating_confusion_matrix.png'), 'Markdown references rating confusion matrix plot');
assert(md.includes('ml_delivery_time_predictions.png'), 'Markdown references delivery predictions plot');

// 6. Generate Print-Ready PDF HTML
const html = generateHtmlReport();
assert(typeof html === 'string' && html.length > 2000, `Print-ready HTML document generated (${html.length} characters)`);
assert(html.includes('@page {') && html.includes('size: A4;'), 'HTML contains @page A4 print configuration');
assert(html.includes('table') && html.includes('page-break-inside: avoid;'), 'HTML contains unclipped page-break rules');
assert(html.includes('5,394,588'), 'HTML includes total dataset record metrics');
assert(html.includes('Machine Learning Model Evaluation &amp; Empirical Experiments') || html.includes('Machine Learning Model Evaluation'), 'HTML includes ML section header');
assert(html.includes('Logistic Regression (Selected)') && html.includes('58.69%'), 'HTML includes classification table');
assert(html.includes('Random Forest Regressor (Selected)') && html.includes('6.51 min'), 'HTML includes regression table');

console.log('================================================================');
console.log(`REPORT TEST RESULTS: ${passed}/${tests} PASSED`);
console.log('================================================================');

if (passed !== tests) process.exit(1);
