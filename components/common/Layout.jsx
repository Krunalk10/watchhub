'use client';

import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';

export function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
