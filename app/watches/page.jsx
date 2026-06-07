'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout } from "@/components/common/Layout.jsx";
import { WatchCard } from "@/components/common/WatchCard.jsx";
import { FilterSidebar } from "@/components/common/FilterSidebar.jsx";
import { Pagination } from "@/components/common/Pagination.jsx";
import { SearchBar } from "@/components/common/SearchBar.jsx";
import { useDebounce } from "@/hooks/useDebounce.js";





export default function WatchesPage() {
  const searchParams = useSearchParams();
  const [watches, setWatches] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Fetch all brands for filter
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/watches?perPage=1000');
        const data = await response.json();
        const uniqueBrands = Array.from(new Set(data.watches.map((w) => w.brand))).sort();
        setBrands(uniqueBrands);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      }
    };

    fetchBrands();
  }, []);

  // Fetch watches based on filters and search
  const fetchWatches = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: '10',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(brand && { brand }),
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
        sort,
      });

      const response = await fetch(`/api/watches?${params}`);
      const data = await response.json();
      setWatches(data.watches);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch watches:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, brand, minPrice, maxPrice, sort]);

  // Fetch watches when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, brand, minPrice, maxPrice, sort]);

  useEffect(() => {
    fetchWatches();
  }, [fetchWatches]);

  const handleAddToCart = (watch) => {
    // Session-only cart handling
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item) => item.id === watch.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...watch, quantity: 1 });
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    alert(`${watch.name} added to cart!`);
  };

  const handleAddToWishlist = (watch) => {
    // Session-only wishlist handling
    const wishlist = JSON.parse(sessionStorage.getItem('wishlist') || '[]');
    const exists = wishlist.find((item) => item.id === watch.id);

    if (!exists) {
      wishlist.push(watch);
      sessionStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert(`${watch.name} added to wishlist!`);
    } else {
      alert('Already in your wishlist!');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Our Collection</h1>
          <p className="text-muted-foreground">
            Discover {pagination.total} luxury watches from premium brands
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={setSearch}
            placeholder="Search by watch name or brand..."
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              brands={brands}
              onBrandChange={setBrand}
              onPriceChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
              onSortChange={setSort}
            />
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-muted rounded h-96 animate-pulse" />
                ))}
              </div>
            ) : watches.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {watches.map((watch) => (
                    <WatchCard
                      key={watch.id}
                      watch={watch}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  No watches found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setBrand('');
                    setMinPrice(0);
                    setMaxPrice(50000);
                    setSort('newest');
                  }}
                  className="px-6 py-2 border border-foreground text-foreground rounded hover:bg-foreground hover:text-background transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
