'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth.js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="relative z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-semibold text-foreground hover:text-secondary transition"
          >
            Watch
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/watches"
              className="text-foreground hover:text-secondary transition"
            >
              Watches
            </Link>
            <div className="relative group">
              <button className="text-foreground hover:text-secondary transition">
                Brands
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block bg-card border border-border rounded-md shadow-lg py-2 min-w-40">
                {["Rolex", "Omega", "TAG Heuer", "Seiko", "Patek Philippe"].map(
                  (brand) => (
                    <Link
                      key={brand}
                      href={`/watches?brand=${brand}`}
                      className="block px-4 py-2 text-foreground hover:bg-muted transition"
                    >
                      {brand}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <>
                <Link
                  href="/Pages/wishlist"
                  className="text-foreground hover:text-secondary transition"
                >
                  Wishlist
                </Link>
                <Link
                  href="/Pages/cart"
                  className="text-foreground hover:text-secondary transition"
                >
                  Cart
                </Link>
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-foreground text-foreground hover:bg-foreground hover:text-background transition rounded"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  href="/Pages/login"
                  className="px-4 py-2 border border-foreground text-foreground hover:bg-foreground hover:text-background transition rounded"
                >
                  Login
                </Link>
                <Link
                  href="/Pages/signup"
                  className="px-4 py-2 bg-foreground text-background hover:bg-secondary hover:text-foreground transition rounded"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 border-t border-border pt-4">
            <Link
              href="/watches"
              className="block text-foreground hover:text-secondary py-2"
            >
              Watches
            </Link>
            <Link
              href="/watches?brand=Rolex"
              className="block text-foreground hover:text-secondary py-2 pl-4"
            >
              Brands
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/Pages/wishlist"
                  className="block text-foreground hover:text-secondary py-2"
                >
                  Wishlist
                </Link>
                <Link
                  href="/Pages/cart"
                  className="block text-foreground hover:text-secondary py-2"
                >
                  Cart
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-foreground hover:text-secondary py-2 border-t border-border pt-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/Pages/login"
                  className="block text-foreground hover:text-secondary py-2"
                >
                  Login
                </Link>
                <Link
                  href="/Pages/signup"
                  className="block text-foreground hover:text-secondary py-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
