"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Layout } from "@/components/common/Layout.jsx";
import { WatchCard } from "@/components/common/WatchCard.jsx";
import { FilterSidebar } from "@/components/common/FilterSidebar.jsx";
import { Pagination } from "@/components/common/Pagination.jsx";
import { SearchBar } from "@/components/common/SearchBar.jsx";
import { useDebounce } from "@/hooks/useDebounce.js";

export default function WatchesContent() {
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

	// ── FIX: brands is now an ARRAY matching FilterSidebar's multi-select.
	// Previously `brand` was a single string — changing it to `brands` (array)
	// lets multiple checkboxes stay active at the same time.
	const [brands, setBrands] = useState(
		searchParams.get("brand") ? [searchParams.get("brand")] : [],
	);
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(50000);
	const [sort, setSort] = useState(searchParams.get("sort") || "newest");
	const [allBrands, setAllBrands] = useState([]);
	const [currentpage, setCurrentpage] = useState(1);
	const [toastMessage, setToastMessage] = useState("");

	const debouncedSearch = useDebounce(search, 300);

	// Load brand list once
	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const response = await fetch("/api/watches?perpage=1000");
				const data = await response.json();
				const unique = Array.from(
					new Set(data.watches.map((w) => w.brand)),
				).sort();
				setAllBrands(unique);
			} catch (error) {
				console.error("Failed to fetch brands:", error);
			}
		};
		fetchBrands();
	}, []);

	// Fetch watches — builds query with multiple brand params if needed
	const fetchWatches = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: currentpage.toString(),
				perpage: "10",
				...(debouncedSearch && { search: debouncedSearch }),
				minPrice: minPrice.toString(),
				maxPrice: maxPrice.toString(),
				sort,
			});

			// ── FIX: append each selected brand as a separate `brand` param
			// so the API receives brand=Rolex&brand=Omega etc.
			brands.forEach((b) => params.append("brand", b));

			const response = await fetch(`/api/watches?${params}`);
			const data = await response.json();
			setWatches(data.watches);
			setPagination(data.pagination);
		} catch (error) {
			console.error("Failed to fetch watches:", error);
		} finally {
			setLoading(false);
		}
	}, [currentpage, debouncedSearch, brands, minPrice, maxPrice, sort]);

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentpage(1);
	}, [debouncedSearch, brands, minPrice, maxPrice, sort]);

	useEffect(() => {
		fetchWatches();
	}, [fetchWatches]);

	// Keep URL in sync (first brand only for shareability)
	useEffect(() => {
		const params = new URLSearchParams();
		if (brands.length === 1) params.set("brand", brands[0]);
		if (search) params.set("search", search);
		if (sort && sort !== "newest") params.set("sort", sort);
		const query = params.toString();
		router.replace(query ? `/watches?${query}` : "/watches", { scroll: false });
	}, [brands, search, sort]);

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
		setBrands([]);
		setMinPrice(0);
		setMaxPrice(50000);
		setSort("newest");
		router.replace("/watches", { scroll: false });
	};

	return (
		<Layout>
			{toastMessage && (
				<div className="fixed top-6 right-6 z-50 bg-foreground text-background px-6 py-3 rounded shadow-lg">
					{toastMessage}
				</div>
			)}

			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-2">
						{brands.length === 1 ? `${brands[0]} Watches` : "Our Collection"}
					</h1>
					<p className="text-muted-foreground">
						{brands.length > 0
							? `Showing ${pagination.total} watches from ${brands.join(", ")}`
							: `Discover ${pagination.total} luxury watches from premium brands`}
					</p>

					{/* Active brand tags */}
					{brands.length > 0 && (
						<div className="mt-3 flex flex-wrap gap-2">
							{brands.map((b) => (
								<span
									key={b}
									className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm text-foreground"
								>
									<strong>{b}</strong>
									<button
										onClick={() => setBrands(brands.filter((x) => x !== b))}
										className="text-muted-foreground hover:text-foreground transition font-semibold"
										aria-label={`Remove ${b} filter`}
									>
										✕
									</button>
								</span>
							))}
						</div>
					)}
				</div>

				{/* Search */}
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
							brands={allBrands}
							selectedBrand={brands[0] || ""}
							onBrandChange={setBrands}
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
	);
}
