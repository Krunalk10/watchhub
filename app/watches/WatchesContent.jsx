"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Layout } from "@/components/common/Layout.jsx";
import { WatchCard } from "@/components/common/WatchCard.jsx";
import { FilterSidebar } from "@/components/common/FilterSidebar.jsx";
import { Pagination } from "@/components/common/Pagination.jsx";
import { SearchBar } from "@/components/common/SearchBar.jsx";
import { useDebounce } from "@/hooks/useDebounce.js";
import { Suspense } from "react";

export default function Watchespage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [watches, setWatches] = useState([]);
	const [pagination, setPagination] = useState({
		page: 1,
		perpage: 10,
		total: 0,
		totalpages: 0,
	});
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [brand, setBrand] = useState(searchParams.get("brand") || "");
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(50000);
	const [sort, setSort] = useState(searchParams.get("sort") || "newest");
	const [brands, setBrands] = useState([]);
	const [currentpage, setCurrentpage] = useState(1);
	const [toastMessage, setToastMessage] = useState("");

	const debouncedSearch = useDebounce(search, 300);

	useEffect(() => {
		const urlBrand = searchParams.get("brand") || "";
		const urlSearch = searchParams.get("search") || "";
		const urlSort = searchParams.get("sort") || "newest";
		setBrand(urlBrand);
		setSearch(urlSearch);
		setSort(urlSort);
		setCurrentpage(1);
	}, [searchParams]);

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const response = await fetch("/api/watches?perpage=1000");
				const data = await response.json();
				const uniqueBrands = Array.from(
					new Set(data.watches.map((w) => w.brand)),
				).sort();
				setBrands(uniqueBrands);
			} catch (error) {
				console.error("Failed to fetch brands:", error);
			}
		};

		fetchBrands();
	}, []);

	// Fetch watches based on filters
	const fetchWatches = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: currentpage.toString(),
				perpage: "10",
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
			console.error("Failed to fetch watches:", error);
		} finally {
			setLoading(false);
		}
	}, [currentpage, debouncedSearch, brand, minPrice, maxPrice, sort]);

	// Reset to page 1 whenever filters change
	useEffect(() => {
		setCurrentpage(1);
	}, [debouncedSearch, brand, minPrice, maxPrice, sort]);

	useEffect(() => {
		fetchWatches();
	}, [fetchWatches]);

	// Update URL when brand/search/sort change so links stay shareable
	useEffect(() => {
		const params = new URLSearchParams();
		if (brand) params.set("brand", brand);
		if (search) params.set("search", search);
		if (sort && sort !== "newest") params.set("sort", sort);
		const query = params.toString();
		router.replace(query ? `/watches?${query}` : "/watches", { scroll: false });
	}, [brand, search, sort]);

	const showToast = (message) => {
		setToastMessage(message);
		setTimeout(() => setToastMessage(""), 3000);
	};

	const handleAddToCart = (watch) => {
		const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
		const existingItem = cart.find((item) => item.id === watch.id);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			cart.push({ ...watch, quantity: 1 });
		}

		sessionStorage.setItem("cart", JSON.stringify(cart));
		showToast(`${watch.name} added to cart!`);
	};

	const handleAddToWishlist = (watch) => {
		const wishlist = JSON.parse(sessionStorage.getItem("wishlist") || "[]");
		const exists = wishlist.find((item) => item.id === watch.id);

		if (!exists) {
			wishlist.push(watch);
			sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
			showToast(`${watch.name} added to wishlist!`);
		} else {
			showToast("Already in your wishlist!");
		}
	};

	const handleClearFilters = () => {
		setSearch("");
		setBrand("");
		setMinPrice(0);
		setMaxPrice(50000);
		setSort("newest");
		router.replace("/watches", { scroll: false });
	};

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Layout>
				{toastMessage && (
					<div className="fixed top-6 right-6 z-50 bg-foreground text-background px-6 py-3 rounded shadow-lg">
						{toastMessage}
					</div>
				)}

				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="mb-8">
						<h1 className="text-4xl font-bold text-foreground mb-2">
							{brand ? `${brand} Watches` : "Our Collection"}
						</h1>
						<p className="text-muted-foreground">
							{brand
								? `Showing ${pagination.total} watches from ${brand}`
								: `Discover ${pagination.total} luxury watches from premium brands`}
						</p>
						{brand && (
							<div className="mt-3 inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm text-foreground">
								<span>
									Brand: <strong>{brand}</strong>
								</span>
								<button
									onClick={() => setBrand("")}
									className="text-muted-foreground hover:text-foreground transition font-semibold"
									aria-label="Clear brand filter"
								>
									✕
								</button>
							</div>
						)}
					</div>

					{/* Search Bar */}
					<div className="mb-8">
						<SearchBar
							onSearch={setSearch}
							placeholder="Search by watch name or brand..."
							value={search}
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						<div className="lg:col-span-1">
							<FilterSidebar
								brands={brands}
								selectedBrand={brand}
								onBrandChange={setBrand}
								onPriceChange={(min, max) => {
									setMinPrice(min);
									setMaxPrice(max);
								}}
								onSortChange={setSort}
								currentSort={sort}
							/>
						</div>

						<div className="lg:col-span-3">
							{loading ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{[...Array(10)].map((_, i) => (
										<div
											key={i}
											className="bg-muted rounded h-96 animate-pulse"
										/>
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

									{pagination.totalpages > 1 && (
										<Pagination
											currentpage={pagination.page}
											totalpages={pagination.totalpages}
											onpageChange={setCurrentpage}
										/>
									)}
								</>
							) : (
								<div className="text-center py-12">
									<p className="text-lg text-muted-foreground mb-4">
										No watches found matching your criteria.
									</p>
									<button
										onClick={handleClearFilters}
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
		</Suspense>
	);
}
