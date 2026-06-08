import { NextRequest, NextResponse } from 'next/server';
import watchesData from '@/data/watches.json' assert { type: 'json' };

export async function GET(request, { params }) {
  try {
    return await Promise.resolve().then(async () => {
      try {
        const { id } = await Promise.resolve(params);
        const watchId = parseInt(id);

        if (isNaN(watchId) || watchId < 1) {
          return NextResponse.json(
            { error: 'Invalid watch ID format' },
            { status: 400 }
          );
        }

        console.log('[v0] Fetching watch with ID:', watchId);

        if (!watchesData || !Array.isArray(watchesData.watches)) {
          throw new Error('Watch data is unavailable');
        }

        const watch = await Promise.resolve(
          watchesData.watches.find(w => w.id === watchId)
        );

        if (!watch) {
          console.log('[v0] Watch not found:', watchId);
          return NextResponse.json(
            { error: `Watch with ID ${watchId} not found` },
            { status: 404 }
          );
        }

        const relatedWatches = await Promise.resolve(
          watchesData.watches.filter(
            w => watch.relatedProducts && watch.relatedProducts.includes(w.id)
          )
        );

        console.log('[v0] Found watch and', relatedWatches.length, 'related watches');

        return NextResponse.json({
          success: true,
          watch,
          relatedWatches,
        });
      } catch (err) {
        throw err;
      }
    });
  } catch (error) {
    console.error('[v0] Watch detail API error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Failed to fetch watch details', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
