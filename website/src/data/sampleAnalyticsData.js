/**
 * Sample Analytics Data
 * Derived directly from project outputs, reports, and exploratory data analysis (EDA).
 * Standardized to display monetary amounts in Indian Rupees (₹) with source disclosures.
 */

export const PROJECT_METADATA = {
  title: "Comparative Big Data Analytics of Online Food Delivery Platforms",
  shortTitle: "Food Delivery Big Data Analytics",
  badge: "Academic Capstone Project",
  version: "v1.2-inr",
  lastAuditTimestamp: "October 2026",
  baseCurrency: "INR (₹)",
  platformsAnalyzed: ["Swiggy", "Zomato", "Grubhub", "DoorDash", "Foodpanda"],
  toolsUsed: ["Apache Spark", "Python / PySpark", "Pandas", "SQLite", "React + Vite"]
};

export const KPI_SUMMARY = [
  {
    id: "total_records",
    label: "Total Records Processed",
    value: "5,394,588",
    unit: "records",
    change: "+100%",
    changeType: "neutral",
    subtext: "Across 5 cleansed dataset partitions",
    platform: "All Platforms"
  },
  {
    id: "swiggy_rating",
    label: "Swiggy Mean Rating",
    value: "4.04",
    unit: "/ 5.0",
    change: "+0.15 vs Zomato",
    changeType: "positive",
    subtext: "105,864 verified rating records (₹270.34 avg)",
    platform: "Swiggy"
  },
  {
    id: "zomato_rating",
    label: "Zomato Mean Rating",
    value: "3.89",
    unit: "/ 5.0",
    change: "-0.15 vs Swiggy",
    changeType: "neutral",
    subtext: "101,530 validated item records (₹243.69 avg)",
    platform: "Zomato"
  },
  {
    id: "grubhub_delivery",
    label: "Grubhub Avg Delivery Fee",
    value: "₹204.58",
    unit: "INR",
    change: "$2.45 USD original",
    changeType: "neutral",
    subtext: "8,088 US restaurants &bull; 42.5 min mean time",
    platform: "Grubhub"
  },
  {
    id: "menus_scale",
    label: "Menu Items Extracted",
    value: "5.08 M",
    unit: "items",
    change: "63,309 venues",
    changeType: "positive",
    subtext: "4.91M positive parsed price items via PySpark",
    platform: "Restaurant Menus"
  }
];

export const PLATFORM_COMPARISON_METRICS = [
  {
    platform: "Swiggy",
    totalRecords: "139,321",
    observationUnit: "Restaurants & Menus",
    avgRating: 4.04,
    avgPrice: "₹270.34 (for two)",
    originalCurrency: "INR",
    geography: "Pan-India (Kanpur, Goa, Hyderabad, etc.)",
    vegRatio: "42.0% Veg / 58.0% Non-Veg",
    keyQualityAction: "Area & rating count label normalization"
  },
  {
    platform: "Zomato",
    totalRecords: "101,530",
    observationUnit: "Menu Items",
    avgRating: 3.89,
    avgPrice: "₹243.69 (per item)",
    originalCurrency: "INR",
    geography: "Indian Metro & Tier-1 Hubs",
    vegRatio: "Categorical item flags",
    keyQualityAction: "Log_Price & Price_per_Vote validation passed"
  },
  {
    platform: "Grubhub",
    totalRecords: "8,088",
    observationUnit: "Restaurant Venues",
    avgRating: 3.40,
    avgPrice: "₹204.58 fee ($2.45 USD @ ₹83.50)",
    originalCurrency: "USD",
    geography: "United States Metro Regions (Brooklyn, NY, etc.)",
    vegRatio: "N/A (Restaurant tags)",
    keyQualityAction: "Delivery time & fee outlier bounding checks"
  },
  {
    platform: "DoorDash",
    totalRecords: "1,200",
    observationUnit: "Order Fulfillment Logs",
    avgRating: 4.80,
    avgPrice: "₹2,073.41 subtotal ($24.83 USD @ ₹83.50)",
    originalCurrency: "USD",
    geography: "US Metros (Doorlanta, Dashattan)",
    vegRatio: "Order basket level",
    keyQualityAction: "Dasher delivery durations & subtotal validation"
  },
  {
    platform: "Foodpanda",
    totalRecords: "6,000",
    observationUnit: "Customer Dish Orders",
    avgRating: 3.75,
    avgPrice: "₹342.60 dish (₨1,142 PKR @ ₹0.30)",
    originalCurrency: "PKR",
    geography: "South Asia / Regional Metros (Peshawar, Multan)",
    vegRatio: "Dish category flags",
    keyQualityAction: "Order status & dish price checks"
  }
];

export const RATING_DISTRIBUTION_DATA = [
  { range: "1.0 - 2.5", swiggy: 3.2, zomato: 1.8, grubhub: 14.5 },
  { range: "2.6 - 3.2", swiggy: 6.8, zomato: 8.4, grubhub: 24.2 },
  { range: "3.3 - 3.8", swiggy: 21.4, zomato: 36.1, grubhub: 34.6 },
  { range: "3.9 - 4.4", swiggy: 52.6, zomato: 44.2, grubhub: 21.1 },
  { range: "4.5 - 5.0", swiggy: 16.0, zomato: 9.5, grubhub: 5.6 }
];

export const TOP_CUISINES_DATA = [
  { cuisine: "Chinese", count: 37527, percentage: 26.9 },
  { cuisine: "North Indian", count: 28722, percentage: 20.6 },
  { cuisine: "Indian", count: 23160, percentage: 16.6 },
  { cuisine: "Snacks", count: 17339, percentage: 12.4 },
  { cuisine: "Biryani", count: 14942, percentage: 10.7 },
  { cuisine: "Fast Food", count: 13416, percentage: 9.6 },
  { cuisine: "Beverages", count: 13118, percentage: 9.4 },
  { cuisine: "South Indian", count: 12275, percentage: 8.8 }
];

export const CITY_COVERAGE_DATA = [
  { city: "Kanpur", records: 2000, state: "Uttar Pradesh (IN)" },
  { city: "Central-Goa", records: 1998, state: "Goa (IN)" },
  { city: "Hyderabad", records: 1998, state: "Telangana (IN)" },
  { city: "Indore", records: 1998, state: "Madhya Pradesh (IN)" },
  { city: "Brooklyn", records: 8088, state: "New York (US)" },
  { city: "Doorlanta", records: 750, state: "Atlanta (US)" },
  { city: "Peshawar", records: 1450, state: "Khyber Pakhtunkhwa (PK)" }
];

export const DATASET_QUALITY_AUDIT = [
  {
    id: "ds_swiggy",
    dataset: "Swiggy Cleaned",
    sourceFile: "datasets/Swiggy.csv",
    outputFile: "output/swiggy_analysis_ready.csv",
    rows: "139,321",
    columns: 10,
    status: "Normalized",
    statusType: "success",
    findings: "27 missing cuisines; 14,436 missing rating counts; NEW label handled without data loss",
    actionTaken: "Area & rating count label normalized"
  },
  {
    id: "ds_zomato",
    dataset: "Zomato Cleaned",
    sourceFile: "datasets/zomato_data.csv",
    outputFile: "output/zomato_cleaned.csv",
    rows: "101,530",
    columns: 26,
    status: "Validated",
    statusType: "success",
    findings: "Zero blank cells detected. Log_Price ln(Prices+1) & Price_per_Vote formulas confirmed",
    actionTaken: "Retained in zomato_cleaned.csv"
  },
  {
    id: "ds_grubhub",
    dataset: "Grubhub Metrics",
    sourceFile: "datasets/grubhub.csv",
    outputFile: "output/grubhub_cleaned.csv",
    rows: "8,088",
    columns: 27,
    status: "Validated",
    statusType: "info",
    findings: "231 missing is_gh values; 22 missing restaurant_tags. Converted to INR @ ₹83.50/$",
    actionTaken: "Retained in grubhub_cleaned.csv"
  },
  {
    id: "ds_doordash",
    dataset: "DoorDash Orders",
    sourceFile: "datasets/Doordash.csv",
    outputFile: "datasets/Doordash.csv",
    rows: "1,200",
    columns: 38,
    status: "Dispatch Validated",
    statusType: "info",
    findings: "Order fulfillment runs with subtotal in cents; converted to INR @ ₹83.50/$",
    actionTaken: "Order basket subtotal & delivery times verified"
  },
  {
    id: "ds_foodpanda",
    dataset: "Foodpanda History",
    sourceFile: "datasets/Foodpanda Analysis Dataset.csv",
    outputFile: "datasets/Foodpanda Analysis Dataset.csv",
    rows: "6,000",
    columns: 20,
    status: "Sample Validated",
    statusType: "info",
    findings: "Dish order records in PKR; converted to INR @ ₹0.30/PKR",
    actionTaken: "Dish price & customer frequency audit"
  }
];

export const METHODOLOGY_STAGES = [
  { step: "01", name: "Dataset Audit", status: "Completed", detail: "Dimensions & schema validation" },
  { step: "02", name: "Data Cleaning", status: "Completed", detail: "Deduplication & text normalization" },
  { step: "03", name: "Quality Assessment", status: "Completed", detail: "Missing values & coordinate checks" },
  { step: "04", name: "Currency Standardization", status: "Completed", detail: "Centralized INR conversion (₹)" },
  { step: "05", name: "Analysis-Ready Preparation", status: "Completed", detail: "Safe labeling without silent drops" },
  { step: "06", name: "Consumer Comparison UI", status: "Active", detail: "FoodCompare Multi-Platform Platform" }
];

export const EDA_CHARTS_GALLERY = [
  {
    id: 'comp_ratings',
    title: 'Comparative Mean Ratings (Swiggy vs Zomato vs Grubhub)',
    src: '/charts/comparative_average_ratings.png',
    script: 'scripts/generate_eda_charts.py',
    description: 'Empirical cross-platform rating distributions highlighting rating skew and density.'
  },
  {
    id: 'gh_delivery',
    title: 'Grubhub US Delivery Fee & Duration Metrics',
    src: '/charts/grubhub_delivery_metrics.png',
    script: 'scripts/generate_eda_charts.py',
    description: 'Delivery duration distribution (mean 42.5 min) and delivery fees in US metropolitan markets.'
  },
  {
    id: 'swiggy_price',
    title: 'Swiggy Cleaned Price Distribution (₹ INR)',
    src: '/charts/swiggy_price_distribution.png',
    script: 'scripts/swiggy_eda.py',
    description: 'Histogram and kernel density of price for two across 139,321 Pan-India records.'
  },
  {
    id: 'swiggy_rating',
    title: 'Swiggy Restaurant Rating Distribution',
    src: '/charts/swiggy_rating_distribution.png',
    script: 'scripts/swiggy_eda.py',
    description: 'Normal distribution curve of 105,864 rated dining entities centering at 4.04/5.0.'
  },
  {
    id: 'swiggy_cuisines',
    title: 'Swiggy Top Cuisines Market Share',
    src: '/charts/swiggy_top_cuisines.png',
    script: 'scripts/swiggy_eda.py',
    description: 'Chinese (37.5K) and North Indian (28.7K) constitute majority market offerings.'
  },
  {
    id: 'swiggy_cities',
    title: 'Swiggy Cleaned City Sampling Density',
    src: '/charts/swiggy_top_cities.png',
    script: 'scripts/swiggy_eda.py',
    description: 'Balanced geographic representation across Kanpur, Hyderabad, Goa, Indore, etc.'
  },
  {
    id: 'zomato_cities',
    title: 'Zomato Top Metro City Records',
    src: '/charts/comparative_zomato_top_cities.png',
    script: 'scripts/generate_eda_charts.py',
    description: 'Volume breakdown across 101,530 validated item listings.'
  },
  {
    id: 'swiggy_locations',
    title: 'Swiggy Micro-Location Clusters',
    src: '/charts/comparative_swiggy_top_locations.png',
    script: 'scripts/generate_eda_charts.py',
    description: 'High-density dining cluster analysis across Indian urban areas.'
  }
];
