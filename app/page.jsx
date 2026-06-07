'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Layout } from '@/components/common/Layout.jsx';
import { WatchCard } from '@/components/common/WatchCard.jsx';
import { useEffect, useState } from 'react';

export default function Page() {
  const [featuredWatches, setFeaturedWatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedWatches = async () => {
      try {
        const response = await fetch('/api/watches?perPage=6&sort=rating');
        const data = await response.json();
        setFeaturedWatches(data.watches);
      } catch (error) {
        console.error('Failed to fetch watches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedWatches();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-card to-muted py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <p className="text-secondary font-semibold text-sm mb-2">DISCOVER LUXURY</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Timeless Elegance Meets Modern Craftsmanship
            </h1>
            <p className="text-lg text-muted-foreground mb-6 text-pretty">
              Explore our curated collection of premium watches from world-renowned brands. Each timepiece tells a story of precision, heritage, and sophisticated design.
            </p>
            <div className="flex gap-4">
              <Link
                href="/watches"
                className="px-8 py-3 bg-foreground text-background rounded font-semibold hover:bg-secondary hover:text-foreground transition"
              >
                Shop Now
              </Link>
              <Link
                href="/watches?sort=rating"
                className="px-8 py-3 border border-foreground text-foreground rounded font-semibold hover:bg-foreground hover:text-background transition"
              >
                Top Rated
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full min-h-96">
            <Image
              src="/hero-watch.png"
              alt="Premium Watch"
              fill
              className="object-cover rounded"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-secondary font-semibold text-sm mb-2">OUR COLLECTION</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Watches
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our top-rated selection of luxury watches. From classic timepieces to modern innovations, find your perfect watch.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWatches.map((watch) => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/watches"
            className="inline-block px-8 py-3 border border-foreground text-foreground rounded font-semibold hover:bg-foreground hover:text-background transition"
          >
            View All Watches
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">1000+</div>
            <p className="text-lg opacity-90">Premium Watches</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">20+</div>
            <p className="text-lg opacity-90">World Brands</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.7★</div>
            <p className="text-lg opacity-90">Average Rating</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
