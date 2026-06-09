# WatchHub - Premium E-Commerce Watch Store

A modern, fully-featured e-commerce platform for buying and selling luxury watches. Built with Next.js, React, and Tailwind CSS.

## Features

✨ **Complete E-Commerce Experience**

- Browse 1000+ premium watches from world-renowned brands
- Advanced filtering by brand and price range
- Smart sorting (newest, price, ratings)
- Lazy loading with pagination (10 watches per page)
- Responsive design for mobile, tablet, and desktop

🔐 **User Authentication**

- Sign up and login system
- Session-based authentication
- Protected cart and wishlist features

🛒 **Shopping Features**

- Add watches to cart with quantity selection
- Manage wishlist for favorite watches
- View detailed product information
- Read customer reviews and specifications
- Browse related watches

🎯 **Product pages**

- Beautiful hero section on home page
- Detailed watch pages with:
  - Product images and pricing
  - Specifications and ratings
  - Customer reviews
  - Related products recommendations
- Search functionality with debouncing
- Filter sidebar with brand and price controls

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── login/page.tsx           # Login page
│   ├── signup/page.tsx          # Signup page
│   ├── cart/page.tsx            # Shopping cart
│   ├── wishlist/page.tsx        # Wishlist
│   ├── watches/
│   │   ├── page.tsx             # Watches listing with filters
│   │   └── [id]/page.tsx        # Watch detail page
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── signup/route.ts
│   │   └── watches/
│   │       ├── route.ts         # List and search watches
│   │       └── [id]/route.ts    # Get single watch
│   └── globals.css              # Theme and styles
├── components/
│   └── common/
│       ├── Layout.tsx           # Main layout wrapper
│       ├── Navbar.tsx           # Navigation bar
│       ├── Footer.tsx           # Footer
│       ├── WatchCard.tsx        # Product card component
│       ├── SearchBar.tsx        # Search with debouncing
│       ├── FilterSidebar.tsx    # Filters and sorting
│       └── Pagination.tsx       # page navigation
├── hooks/
│   ├── useAuth.ts              # Authentication logic
│   ├── useDebounce.ts          # Debounce hook for search
│   └── useFetch.ts             # Data fetching hook
├── lib/
│   ├── api.ts                  # API utilities
│   └── utils.ts                # Helper functions
├── data/
│   └── watches.json            # 1000+ watch database
├── public/
│   └── hero-watch.png          # Hero image
├── .env.local                  # Environment configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables (already configured in `.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_NAME=WatchHub
AUTH_SECRET=watch-store-secret-key-change-in-production
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Features Explained

### 1. Authentication System

- Uses `sessionStorage` for session-only persistence (clears on browser close)
- Login/Signup with email and password validation
- Protected routes redirect to login page
- User session managed via custom `useAuth` hook

### 2. Product Browsing

- 1000 watches with realistic data (brands, prices, ratings)
- Advanced filtering:
  - Filter by brand (20+ brands)
  - Price range slider ($0-$50,000)
  - Sort by newest, price, or rating
- Search with 300ms debounce for performance
- Pagination with 10 watches per page

### 3. Cart & Wishlist

- Session-based storage (no database persistence)
- Add items with quantity selection
- Remove items and update quantities
- Cart summary with subtotal, tax, and total
- Both require authentication

### 4. Watch Details page

- Full product information display
- Specifications in organized grid
- Customer reviews section
- Related products recommendations
- Quantity selector and action buttons

## Technology Stack

**Frontend:**

- Next.js 14+ (App Router)
- React 19+
- TypeScript
- Tailwind CSS

**State Management:**

- React Hooks
- sessionStorage (session-only persistence)
- Custom hooks (useAuth, useDebounce, useFetch)

**Styling:**

- Tailwind CSS with premium color scheme
- Gold accent colors (#d4af37)
- Neutral backgrounds (off-white/dark)
- Responsive design patterns

**API:**

- Next.js API Routes
- RESTful endpoints
- In-memory user storage

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Watches

- `GET /api/watches` - List watches with pagination, filtering, and search
- `GET /api/watches/[id]` - Get single watch details

Query parameters for `/api/watches`:

- `page` - page number (default: 1)
- `perpage` - Items per page (default: 10)
- `search` - Search query
- `brand` - Filter by brand
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `sort` - Sort by (newest, price-low, price-high, rating)

## Component Usage

### WatchCard Component

```tsx
<WatchCard
	watch={watch}
	onAddToCart={handleAddToCart}
	onAddToWishlist={handleAddToWishlist}
/>
```

### FilterSidebar Component

```tsx
<FilterSidebar
	brands={brands}
	onBrandChange={setBrand}
	onPriceChange={(min, max) => {
		/* ... */
	}}
	onSortChange={setSort}
/>
```

### SearchBar with Debounce

```tsx
<SearchBar onSearch={setSearch} placeholder="Search watches..." />
```

## Design System

### Colors

- **Primary**: #1a1a1a (Dark)
- **Secondary**: #d4af37 (Gold accent)
- **Background**: #fafaf8 (Off-white)
- **Foreground**: #1a1a1a (Text)
- **Muted**: #e5e5e0 (Light backgrounds)

### Typography

- **Headings**: Sans-serif (bold)
- **Body**: Sans-serif (regular)
- **Accents**: Gold (#d4af37)

## Performance Optimizations

1. **Image Optimization**: Using Next.js Image component with lazy loading
2. **Debounced Search**: 300ms debounce on search input
3. **Pagination**: Only load 10 watches per page
4. **Component Reusability**: Avoid code duplication
5. **Responsive Design**: Mobile-first approach

## Testing

Test the application by:

1. **Home page**: Visit `/` - See hero section and featured watches
2. **Watches Listing**: Visit `/watches` - Browse all watches with filters
3. **Search**: Use search bar with debouncing
4. **Filters**: Select brand and adjust price range
5. **Watch Details**: Click any watch to see full details
6. **Authentication**: Visit `/signup` to create account, then `/login`
7. **Cart**: After login, add watches to cart at `/cart`
8. **Wishlist**: Add watches to wishlist at `/wishlist`

## Development Notes

### Adding New Watches

Edit `/data/watches.json` or regenerate using the script:

```bash
node /tmp/generate-watches.js
```

### Custom Hooks

- `useAuth()` - Manages user authentication and session
- `useDebounce()` - Debounces values with custom delay
- `useFetch()` - Generic data fetching with loading/error states

### Environment Variables

All necessary env vars are in `.env.local`. Key variables:

- `NEXT_PUBLIC_API_BASE_URL` - API base URL
- `NEXT_PUBLIC_SITE_NAME` - Site branding
- `AUTH_SECRET` - Authentication secret key

## Future Enhancements

- Payment integration (Stripe)
- Persistent database (PostgreSQL/MongoDB)
- User profiles and order history
- Email notifications
- Admin dashboard
- Product reviews/ratings submission
- Wishlist sharing
- Price comparison
- Watch reviews from external sources

## License

MIT

## Support

For support, create an issue or contact the development team.

# watchhub
