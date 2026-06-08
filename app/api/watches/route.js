import { NextRequest, NextResponse } from 'next/server';
import watchesData from '@/data/watches.json' assert { type: 'json' };

export async function GET(request) {
  try {
    return await Promise.resolve().then(async () => {
      try {
        const searchParams = request.nextUrl.searchParams;
        
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const perPage = Math.max(1, Math.min(100, parseInt(searchParams.get('perPage') || '10')));
        const search = (searchParams.get('search') || '').trim();
        const brand = (searchParams.get('brand') || '').trim();
        const minPrice = Math.max(0, parseInt(searchParams.get('minPrice') || '0'));
        const maxPrice = Math.max(minPrice, parseInt(searchParams.get('maxPrice') || '50000'));
        const sort = searchParams.get('sort') || 'newest';

        console.log('[v0] Watches API called with params:', { page, perPage, search, brand, minPrice, maxPrice, sort });

        if (!watchesData || !Array.isArray(watchesData.watches)) {
          throw new Error('Watch data is unavailable');
        }

        let filtered = [...watchesData.watches];

        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(
            watch =>
              watch.name.toLowerCase().includes(searchLower) ||
              watch.brand.toLowerCase().includes(searchLower) ||
              watch.description.toLowerCase().includes(searchLower)
          );
        }

        if (brand) {
          filtered = filtered.filter(watch => watch.brand === brand);
        }

        filtered = filtered.filter(watch => watch.price >= minPrice && watch.price <= maxPrice);

        await Promise.resolve();
        if (sort === 'price-low') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'rating') {
          filtered.sort((a, b) => b.rating - a.rating);
        } else if (sort === 'newest') {
          filtered.sort((a, b) => b.id - a.id);
        }

        const total = filtered.length;
        const totalPages = Math.ceil(total / perPage);

        if (page > totalPages && total > 0) {
          return NextResponse.json(
            { error: `Page ${page} exceeds maximum pages ${totalPages}` },
            { status: 400 }
          );
        }

        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const watches = filtered.slice(startIndex, endIndex);

        console.log('[v0] Returning', watches.length, 'watches');

        return NextResponse.json({
          success: true,
          watches,
          pagination: {
            page,
            perPage,
            total,
            totalPages,
          },
        });
      } catch (err) {
        throw err;
      }
    });
  } catch (error) {
    console.error('Watches API error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Failed to fetch watches', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
