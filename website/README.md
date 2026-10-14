# FoodCompare — One Place. Every Platform. Better Deals.

A premium, modern consumer food discovery and multi-platform price comparison platform developed for the college project:
*"Comparative Big Data Analytics of Online Food Delivery Platforms"*.

---

## 🌟 Core Value Proposition

FoodCompare bridges **Swiggy, Zomato, DoorDash, Grubhub, and Foodpanda**, enabling diners to:
1. **Discover Food**: Explore appetizing categories (Biryani, Pizza, Burgers, Indian, Chinese, Desserts, Beverages).
2. **True Final Cost Comparison**: Avoid surprise checkout totals with the audited formula:
   $$\text{Estimated Final Cost} = \text{Listed Price} + \text{Delivery Fee} + \text{Service Fee} + \text{Other Charges} - \text{Verified Discount}$$
3. **Data Transparency**: Distinguishes verified historical dataset records from regional sample items; explicitly notes when fees or discounts are absent rather than inventing figures.
4. **Best Deals Engine**: Dynamically ranks deals by Lowest Estimated Total, Highest Verified Discount, Lowest Listed Price, Highest Rating, or Fastest Delivery.
5. **Research & Insights**: Dedicated view with empirical distributions (mean ratings, price variance, cuisine coverage) and 5.39M record data quality logs.

---

## 📁 Architecture & File Layout

```text
website/
├── index.html                 # HTML shell with Inter typography & metadata
├── package.json               # React 18, Vite dependencies & scripts
├── vite.config.js             # Vite development server configuration
├── README.md                  # Project documentation & local launch guide
└── src/
    ├── main.jsx               # Application entry point
    ├── App.jsx                # Layout orchestrator (Navbar + Hero + Discovery + Drawer + Deals)
    ├── index.css              # Warm ivory, deep charcoal & coral design system tokens
    ├── services/
    │   └── dataService.js     # Data adapter layer connecting UI to cleaned datasets
    ├── data/
    │   └── sampleAnalyticsData.js # Big Data metrics, ratings & EDA audit summaries
    └── components/
        ├── Navbar.jsx         # Sticky header with FoodCompare brand, links & search
        ├── Hero.jsx           # Editorial hero with search input, chips & visual
        ├── PlatformBar.jsx    # Filters for Swiggy, Zomato, DoorDash, Grubhub, Foodpanda
        ├── CategoryStrip.jsx  # Horizontal scroll category pills
        ├── FoodCard.jsx       # App-style card with ratings, prices & compare action
        ├── ComparisonDrawer.jsx # Flagship drawer: multi-platform fee breakdown & formula
        ├── BestDealsSection.jsx # Top deals sorted by lowest total, discount, rating
        ├── InsightsView.jsx   # Dedicated analytical charts, quality audits & methodology
        └── Footer.jsx         # Startup footer with methodology & data policy
```

---

## 🚀 Running the Platform Locally

### 1. Ensure Dependencies Are Installed
```powershell
cd website
npm install
```

### 2. Start Vite Development Server
```powershell
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.
