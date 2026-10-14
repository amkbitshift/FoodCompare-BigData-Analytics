import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlatformBar from './components/PlatformBar';
import CategoryStrip from './components/CategoryStrip';
import FoodCard from './components/FoodCard';
import ComparisonDrawer from './components/ComparisonDrawer';
import BestDealsSection from './components/BestDealsSection';
import InsightsView from './components/InsightsView';
import Footer from './components/Footer';
import { dataService, normalizePlatformId, FEATURED_COMPARISON_ITEMS } from './services/dataService';

const INITIAL_PAGE_SIZE = 8;
const PAGE_INCREMENT = 8;

export default function App() {
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
  
  // Selected food item for Comparison Drawer
  const [comparedFood, setComparedFood] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filtered food items via adapter service
  const filteredFoods = useMemo(() => {
    return dataService.getFoodItems({
      category: selectedCategory,
      platform: selectedPlatform,
      search: searchTerm,
      location: selectedLocation,
      sortBy: sortBy
    });
  }, [selectedCategory, selectedPlatform, searchTerm, selectedLocation, sortBy]);

  // Reset pagination whenever filters or search change
  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [selectedCategory, selectedPlatform, searchTerm, selectedLocation, sortBy]);

  const normPlat = normalizePlatformId(selectedPlatform);

  // Slice currently displayed items up to visibleCount
  const displayedFoods = useMemo(() => {
    return filteredFoods.slice(0, visibleCount);
  }, [filteredFoods, visibleCount]);

  const handleOpenCompare = (food) => {
    setComparedFood(food);
    setIsDrawerOpen(true);
  };

  const handleChipClick = (chip) => {
    setSearchTerm(chip);
    if (activeNav === 'insights') setActiveNav('home');
    const el = document.getElementById('food-discovery-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHeroSearch = () => {
    if (activeNav === 'insights') setActiveNav('home');
    const el = document.getElementById('food-discovery-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPlatform('all');
    setSelectedLocation('all');
    setSortBy('default');
    setVisibleCount(INITIAL_PAGE_SIZE);
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + PAGE_INCREMENT);
  };

  // Category Title Formulation
  const categoryTitle = useMemo(() => {
    if (searchTerm) return `Results for "${searchTerm}"`;
    if (normPlat !== 'all' && normPlat) {
      const pName = normPlat.charAt(0).toUpperCase() + normPlat.slice(1);
      if (selectedCategory !== 'all') {
        const cName = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        return `${pName} &bull; ${cName} Records`;
      }
      return `${pName} Dataset Records`;
    }
    if (selectedCategory !== 'all') {
      return `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Dishes`;
    }
    return 'All Food & Restaurants';
  }, [searchTerm, normPlat, selectedCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {/* Top Navigation */}
      <Navbar
        activeNav={activeNav}
        setActiveNav={(nav) => {
          setActiveNav(nav);
          if (nav === 'explore') {
            const el = document.getElementById('food-discovery-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onOpenSearch={handleHeroSearch}
      />

      {/* Main Content Views */}
      <main style={{ flex: 1 }}>
        {activeNav === 'insights' ? (
          <InsightsView />
        ) : (
          <div>
            {/* Hero Section on Home View */}
            {activeNav === 'home' && (
              <Hero
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearchSubmit={handleHeroSearch}
                onChipClick={handleChipClick}
              />
            )}

            {/* Compare Prices Dedicated Header Section */}
            {activeNav === 'compare' && (
              <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-default)', padding: '36px 0 28px' }}>
                <div className="container">
                  <div style={{ maxWidth: 760, marginBottom: 20 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span className="badge badge-coral">Cross-Platform Price Intelligence</span>
                      <span style={{ fontSize: 12, color: 'var(--green-600)', fontWeight: 600 }}>Standardized in INR (₹)</span>
                    </div>
                    <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 8 }}>
                      Compare Food Prices Across 5 Platforms
                    </h1>
                    <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                      Evaluate true end-to-end costs including item list prices, delivery fees, platform service charges, and verified discounts. Select any dish below to inspect side-by-side breakdowns.
                    </p>
                  </div>

                  {/* Benchmark Quick-Compare Shortcuts */}
                  <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      ⚡ Benchmark Multi-Platform Comparisons (Click to Inspect)
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {FEATURED_COMPARISON_ITEMS.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleOpenCompare(item)}
                          className="btn btn-sm btn-outline-coral"
                          style={{ backgroundColor: '#FFFFFF', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          <span>{item.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({item.city})</span>
                          <span style={{ color: 'var(--coral-600)', fontWeight: 800 }}>→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Best Deals Prominently at Top in Deals View */}
            {activeNav === 'deals' && (
              <BestDealsSection onSelectFood={handleOpenCompare} />
            )}

            {/* Platform Selector Bar */}
            <PlatformBar
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
            />

            {/* Horizontal Category Strip */}
            <CategoryStrip
              selectedCategory={selectedCategory}
              setSelectedCategory={(cat) => {
                setSelectedCategory(cat);
                const el = document.getElementById('food-discovery-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Food Discovery Grid Section */}
            <section id="food-discovery-section" style={{ padding: '36px 0 48px' }}>
              <div className="container">
                {/* Platform Specific Context Banner if DoorDash or Grubhub selected */}
                {normPlat === 'doordash' && (
                  <div
                    style={{
                      padding: '14px 18px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1.5px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                        📦 DoorDash Dataset Scope: Order-Level Fulfillment Logs (1,200 Records)
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                        This source tracks complete order baskets, dasher transit times, and market subtotals rather than dish-level menus. Converted from USD at benchmark rate (1 USD ≈ ₹83.50).
                      </div>
                    </div>
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="btn btn-sm btn-primary"
                      >
                        Show All DoorDash Orders
                      </button>
                    )}
                  </div>
                )}

                {normPlat === 'grubhub' && (
                  <div
                    style={{
                      padding: '14px 18px',
                      backgroundColor: 'var(--coral-50)',
                      border: '1px solid var(--coral-200)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--coral-800)' }}>
                        🏬 Grubhub Dataset Scope: Restaurant Venues & Fee Breakdown (8,088 Records)
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                        Features real delivery fees, service charges, review ratings, and cuisine specializations across US metropolitan hubs. Converted from USD at benchmark rate (1 USD ≈ ₹83.50).
                      </div>
                    </div>
                  </div>
                )}

                {/* Discovery Section Controls Header */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    marginBottom: 24
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        <span dangerouslySetInnerHTML={{ __html: categoryTitle }} />
                      </h2>
                      <span className="badge badge-coral" style={{ fontSize: 12, padding: '3px 8px' }}>
                        {filteredFoods.length} {filteredFoods.length === 1 ? 'match' : 'matches'}
                      </span>
                    </div>

                    <p className="text-muted" style={{ fontSize: '13px', marginTop: 4 }}>
                      Showing {Math.min(displayedFoods.length, filteredFoods.length)} of {filteredFoods.length} genuine matching records &bull; All monetary amounts standardized in Indian Rupees (₹)
                    </p>
                  </div>

                  {/* Filter Status & Sort Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {(searchTerm || selectedCategory !== 'all' || (selectedPlatform !== 'all' && selectedPlatform) || selectedLocation !== 'all' || sortBy !== 'default') && (
                      <button
                        onClick={handleResetFilters}
                        className="btn btn-sm"
                        style={{ color: 'var(--coral-700)', fontWeight: 600 }}
                      >
                        Reset all filters ↺
                      </button>
                    )}

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        padding: '7px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-default)',
                        backgroundColor: '#FFFFFF',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="default">Sort: Recommended</option>
                      <option value="price_asc">Price: Low to High (₹)</option>
                      <option value="price_desc">Price: High to Low (₹)</option>
                      <option value="rating">Highest Rating</option>
                    </select>
                  </div>
                </div>

                {/* Cards Grid */}
                {filteredFoods.length === 0 ? (
                  <div
                    style={{
                      padding: '48px 24px',
                      textAlign: 'center',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-default)'
                    }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                      No matching records found for current filters
                    </h3>
                    <p className="text-muted" style={{ maxWidth: 520, margin: '0 auto 20px', lineHeight: 1.5 }}>
                      {normPlat === 'doordash' && selectedCategory !== 'all'
                        ? "The DoorDash dataset represents order-level fulfillment logs and does not contain categorized menu dishes. Select 'All Food' to view DoorDash dispatch records."
                        : `No records match the combination of platform '${selectedPlatform}', category '${selectedCategory}', and search '${searchTerm}'.`}
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="btn btn-primary btn-sm"
                    >
                      Clear filters and view all records
                    </button>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 24,
                        marginBottom: 32
                      }}
                    >
                      {displayedFoods.map((food) => (
                        <FoodCard
                          key={food.id}
                          food={food}
                          onCompare={handleOpenCompare}
                        />
                      ))}
                    </div>

                    {/* Functional "Show More" Pagination Control */}
                    {visibleCount < filteredFoods.length && (
                      <div style={{ textAlign: 'center', paddingTop: 8 }}>
                        <button
                          onClick={handleShowMore}
                          className="btn btn-secondary btn-lg"
                          style={{
                            padding: '11px 28px',
                            fontWeight: 600,
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          Show more items ({filteredFoods.length - visibleCount} remaining) ↓
                        </button>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                          Showing {visibleCount} of {filteredFoods.length} items
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Best Deals Showcase Section */}
            {activeNav === 'home' && (
              <BestDealsSection onSelectFood={handleOpenCompare} />
            )}
          </div>
        )}
      </main>

      {/* Comparison Drawer / Modal */}
      <ComparisonDrawer
        food={comparedFood}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Startup Footer */}
      <Footer onNavigate={setActiveNav} />
    </div>
  );
}
