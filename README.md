# 🍽️ FoodCompare — Big Data Analytics of Food Delivery Platforms

**A data-driven platform for exploring, comparing, and analyzing online food delivery platforms using Big Data Analytics and Machine Learning.**

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Python-Analytics-3776AB?logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Machine%20Learning-Scikit--learn-F7931E?logo=scikitlearn&logoColor=white" alt="Machine Learning" />
  <img src="https://img.shields.io/badge/Status-Development-blue" alt="Project status" />
</p>

## 🔗 Project Links

- **🌐 Live Demo:** [Add your deployed website URL here](ADD_YOUR_LIVE_DEMO_URL_HERE)
- **💻 GitHub Repository:** [FoodCompare-BigData-Analytics](https://github.com/amkbitshift/FoodCompare-BigData-Analytics)

> The live demo link will work after the website is deployed. Replace the placeholder above with your actual deployment URL.

---

## 📸 Project Screenshots


### 1. Home Page

<!-- Replace the path below with your homepage screenshot. -->
![FoodCompare Home Page]<img width="1920" height="1140" alt="image" src="https://github.com/user-attachments/assets/9001c08c-6c60-41cb-b587-9778a6da3cdb" />


*The main dashboard and food discovery interface.*

### 2. Food Exploration and Category Filtering

<!-- Replace the path below with your food exploration screenshot. -->
![Food Exploration]<img width="1920" height="1140" alt="image" src="https://github.com/user-attachments/assets/1ffaa0d3-0e19-4ea4-aefb-039a13fee5bf" />


*Explore food listings and browse categories across supported platforms.*

### 3. Food Comparison

<!-- Replace the path below with your comparison screenshot. -->
![Food Comparison]<img width="1920" height="1140" alt="image" src="https://github.com/user-attachments/assets/ae6ac9fe-25d7-4351-8630-dcde4786e90c" />


*Compare available listings, prices, and other displayed details.*

### 4. Analytics Dashboard

<!-- Replace the path below with your analytics screenshot. -->
![Analytics Dashboard]<img width="1920" height="1140" alt="image" src="https://github.com/user-attachments/assets/8cefdcfc-6e2d-4195-8dcd-fae3f750b6a7" />


*Explore analytical summaries and visualizations derived from the project datasets.*

### 5. Machine Learning Evaluation

<!-- Replace the path below with your ML evaluation screenshot. -->
![Machine Learning Evaluation](docs/screenshots/ml-evaluation.png)

*View rating-classification experiments and delivery-time prediction results.*

---

## 🚀 About the Project

FoodCompare is a college project focused on the comparative analysis of online food delivery platforms using data processing, exploratory data analysis, visualization, and machine learning.

The project combines datasets from multiple platforms to explore food listings, restaurant characteristics, pricing information, ratings, and delivery-related data.

The website provides an interactive interface for exploring the prepared data and presenting analytical findings.

Because the datasets cover different countries, currencies, and observation types, cross-platform comparisons must be interpreted in their respective contexts.

## ✨ Key Features

- **Food Discovery:** Browse food listings using category filters.
- **Platform Comparison:** Explore and compare supported food delivery listings.
- **Price Analysis:** Examine available pricing information and displayed offers.
- **Data Visualization:** Present analytical findings through charts and summaries.
- **Machine Learning Evaluation:** Display rating-classification experiments and delivery-time regression results.
- **Research Reporting:** Generate or export analytical reports using the website's supported features.
- **Responsive Interface:** A web interface built with React and Vite.

## 🤖 Machine Learning

The project includes two machine learning tasks.

### Rating Classification

Predicts whether a Swiggy listing belongs to the high-rating category, defined in the experiment as a rating of at least 4.2.

| Metric | Final experiment |
|---|---:|
| Test accuracy | 63.39% |
| Test F1-score | 0.6030 |
| Test ROC-AUC | 0.6851 |
| 5-fold CV accuracy | 63.23% |
| 5-fold CV F1-score | 0.6002 |

The final experiment evaluated a soft-voting ensemble. These results are experimental metrics, not a guarantee of customer satisfaction or future predictive performance.

### Delivery-Time Regression

Uses the prepared Grubhub dataset to estimate delivery time from available listing and delivery-related features.

The project includes regression evaluation using MAE, RMSE, and R². See the generated evaluation results for the recorded model metrics.

## 🧰 Technologies Used

- **Frontend:** React, Vite, JavaScript, CSS
- **Data Processing:** Python, Pandas, NumPy
- **Machine Learning:** Scikit-learn
- **Visualization:** Matplotlib and website charts
- **Big Data Analytics:** PySpark experiments and data-processing workflows
- **Development Tools:** Git, GitHub, Node.js, npm

## 📂 Project Structure

```text
food_delivery_bigdata/
├── datasets/             # Source datasets (some excluded from GitHub)
├── output/               # Prepared data and analytical results
├── reports/              # Project findings and methodology
├── scripts/              # Cleaning, analysis, ML and validation scripts
└── website/
    ├── public/
    │   └── charts/       # Visualization assets
    ├── src/
    │   ├── components/   # React components
    │   ├── data/         # Website data and ML results
    │   ├── services/     # Data services
    │   └── utils/        # Filtering, comparison and image utilities
    ├── package.json
    └── vite.config.js
```

## 💻 Run the Website Locally

### Prerequisites

- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/amkbitshift/FoodCompare-BigData-Analytics.git
cd FoodCompare-BigData-Analytics
```

### 2. Open the website directory

```bash
cd website
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal, usually `http://localhost:5173/`.

### 5. Build for production

```bash
npm run build
```

**Note:** Some analytical workflows require datasets that are not included in the GitHub repository. The website may also depend on prepared output files or assets. Follow the project scripts and dataset requirements when reproducing the complete analysis.

## 📊 Data and Methodology

The project uses datasets associated with platforms including Swiggy, Zomato, Grubhub, DoorDash, and Foodpanda.

The workflow includes:

1. Dataset inspection and quality checks.
2. Data cleaning and preprocessing.
3. Exploratory data analysis.
4. Comparative visualizations.
5. Machine learning experiments.
6. Model evaluation and research reporting.
7. Presentation of findings through the website.

The datasets differ in geography, currency, and observation unit. Results should not be interpreted as perfectly equivalent platform rankings without appropriate normalization and context.

## ⚠️ Dataset Availability

Some original and intermediate CSV files exceed GitHub's individual file-size limit and are intentionally excluded from version control.

Consequently, cloning the repository alone may not reproduce every preprocessing and analysis workflow. Large datasets should be obtained from their original sources and placed in the expected directories before running the relevant scripts.

Do not commit API keys, credentials, private data, or environment files.

## 🔮 Future Improvements

- Deploy the website publicly.
- Improve image-to-dish matching and data validation.
- Expand the analysis with additional verified datasets.
- Evaluate machine learning models on genuinely new data.
- Improve cross-platform price comparability.
- Add reproducible data acquisition and preprocessing instructions.

## 👩‍💻 Author

**Ameya Jose Chazhoor**

B.Tech — Artificial Intelligence and Data Science

Jyothi Engineering College, Cheruthuruthy

GitHub: [@amkbitshift](https://github.com/amkbitshift)

---

*FoodCompare — Turning food delivery data into meaningful insights.*
