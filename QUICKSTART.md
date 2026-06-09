# WatchHub - Quick Start Guide

## 🚀 Get Started in 30 Seconds

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

### 3. Open in Browser

Visit: **http://localhost:3000**

That's it! The app is ready to use.

## 📖 How to Use

### Browse Watches

1. Click "Watches" in the navigation bar
2. Use filters on the left (Brand, Price)
3. Use search bar to find specific watches
4. Click any watch to see details

### Create Account

1. Click "Sign Up" button
2. Enter email and password
3. Click "Create Account"
4. You're logged in!

### Test Account

You can create any account with:

- Email: `test@watchhub.com`
- Password: `Password123` (6+ characters)

### Shopping

1. Click "Add to Cart" on any watch
2. Go to "Cart" in navbar to manage items
3. Adjust quantities or remove items

### Wishlist

1. Click "Add to Wishlist" on any watch (after login)
2. Visit "Wishlist" in navbar
3. Move items to cart or remove

## 🎨 Features to Try

✨ **Search with Debounce**

- Type in search bar - results update after 300ms
- Searches by brand, name, or description

✨ **Smart Filters**

- Select brand to filter by manufacturer
- Adjust price range slider
- Sort by newest, price, or rating

✨ **Pagination**

- Navigate through pages of watches
- Shows 10 watches per page
- Total of 1000 watches available

✨ **Responsive Design**

- Resize browser to see mobile menu
- All features work on mobile devices
- Professional layout on all sizes

✨ **Watch Details**

- View specifications in dedicated tabs
- Read customer reviews
- See related products
- Select quantity before adding to cart

## 📱 Testing on Mobile

```bash
# Resize browser window to mobile size
# Or use browser DevTools (F12) → Device Toolbar
# Test on iPhone 375px width
```

## 🔐 Authentication Notes

- Uses session-only storage (clears on browser close)
- Cart and wishlist only available when logged in
- Redirects to login page when needed
- Logout button appears in navbar after login

## 🎯 Key pages

| URL          | What to See                 |
| ------------ | --------------------------- |
| `/`          | Home page with hero section |
| `/watches`   | All watches with filters    |
| `/watches/1` | Detailed watch page         |
| `/login`     | Login form                  |
| `/signup`    | Registration form           |
| `/cart`      | Shopping cart               |
| `/wishlist`  | Saved watches               |

## 💡 Pro Tips

1. **Search Performance**: Search is debounced to prevent lag
2. **Pagination**: Uses 10 watches per page to load faster
3. **Mobile Menu**: Click hamburger ☰ on mobile devices
4. **Product Hover**: Cards have hover effects on desktop
5. **Responsive Images**: Images adapt to screen size

## 🐛 Troubleshooting

### App won't start?

```bash
pnpm install
pnpm dev
```

### Port 3000 already in use?

```bash
pnpm dev -- -p 3001
```

### Can't add to cart?

- Make sure you're logged in (Sign Up first)
- Login redirects to home page after success

### Search not working?

- It's debounced with 300ms delay
- Wait after typing before checking results

## 📚 Learn More

See detailed documentation:

- **README.md** - Full project documentation
- **IMPLEMENTATION_SUMMARY.md** - What was built and how

## 🎓 Next Steps

1. Explore the watch catalog
2. Try filtering and searching
3. Create an account
4. Add watches to cart
5. Checkout the wishlist feature
6. Browse watch specifications
7. Read customer reviews

## 🎨 Customization

### Change Theme Colors

Edit `app/globals.css` - Color variables at top

### Add More Watches

Edit `data/watches.json` or regenerate with script

### Modify Products Per page

Edit `/api/watches/route.ts` - Change `perpage` value

## 📞 Support

Questions? Check:

1. README.md for detailed info
2. Component files in `components/`
3. API routes in `app/api/`
4. Hooks in `hooks/`

---

**Happy Shopping! 🛍️**

Enjoy browsing the premium watch collection.
