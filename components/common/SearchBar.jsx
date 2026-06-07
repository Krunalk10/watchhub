'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce.js';

export function SearchBar({ onSearch, placeholder = 'Search watches...' }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  // Call onSearch when debounced query changes
  if (debouncedQuery !== query.slice(0, debouncedQuery.length)) {
    onSearch(debouncedQuery);
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-card border border-border rounded focus:outline-none focus:ring-2 focus:ring-secondary"
      />
      <svg className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}
