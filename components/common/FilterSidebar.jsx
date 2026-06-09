"use client";

import { useState } from "react";

export function FilterSidebar({
	brands,
	selectedBrand,
	onBrandChange,
	onPriceChange,
	onSortChange,
	currentSort,
}) {
	const [selectedBrands, setSelectedBrands] = useState([]);
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(50000);
	const [sort, setSort] = useState(currentSort || "newest");

	const handleBrandToggle = (brand) => {
		const updated = selectedBrands.includes(brand)
			? selectedBrands.filter((b) => b !== brand)
			: [...selectedBrands, brand];
		setSelectedBrands(updated);
		onBrandChange(updated);
	};

	const handlePriceChange = (min, max) => {
		setMinPrice(min);
		setMaxPrice(max);
		onPriceChange(min, max);
	};

	const handleSortChange = (newSort) => {
		setSort(newSort);
		onSortChange(newSort);
	};

	const handleReset = () => {
		setSelectedBrands([]);
		setMinPrice(0);
		setMaxPrice(50000);
		setSort("newest");
		onBrandChange([]);
		onPriceChange(0, 50000);
		onSortChange("newest");
	};

	return (
		<div className="bg-card rounded p-6 h-fit sticky top-4">
			<div className="mb-8">
				<h3 className="font-semibold text-foreground mb-4">Sort By</h3>
				<select
					value={sort}
					onChange={(e) => handleSortChange(e.target.value)}
					className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-secondary text-foreground"
				>
					<option value="newest">Newest</option>
					<option value="price-low">Price: Low to High</option>
					<option value="price-high">Price: High to Low</option>
					<option value="rating">Top Rated</option>
				</select>
			</div>

			<div className="mb-8">
				<h3 className="font-semibold text-foreground mb-4">
					Brands
					{selectedBrands.length > 0 && (
						<span className="ml-2 text-xs font-normal text-muted-foreground">
							({selectedBrands.length} selected)
						</span>
					)}
				</h3>
				<div className="space-y-3">
					{brands.slice(0, 10).map((brand) => (
						<label
							key={brand}
							className="flex items-center gap-2 cursor-pointer"
						>
							<input
								type="checkbox"
								checked={selectedBrands.includes(brand)}
								onChange={() => handleBrandToggle(brand)}
								className="w-4 h-4 rounded border-border"
							/>
							<span className="text-sm text-foreground">{brand}</span>
						</label>
					))}
				</div>
			</div>

			<div className="mb-8">
				<h3 className="font-semibold text-foreground mb-4">Price Range</h3>
				<div className="space-y-4">
					<div>
						<label className="text-xs text-muted-foreground block mb-2">
							Min Price: ${minPrice.toLocaleString()}
						</label>
						<input
							type="range"
							min="0"
							max="50000"
							value={minPrice}
							onChange={(e) =>
								handlePriceChange(parseInt(e.target.value), maxPrice)
							}
							className="w-full"
						/>
					</div>
					<div>
						<label className="text-xs text-muted-foreground block mb-2">
							Max Price: ${maxPrice.toLocaleString()}
						</label>
						<input
							type="range"
							min="0"
							max="50000"
							value={maxPrice}
							onChange={(e) =>
								handlePriceChange(minPrice, parseInt(e.target.value))
							}
							className="w-full"
						/>
					</div>
				</div>
			</div>

			<button
				onClick={handleReset}
				className="w-full py-2 px-4 border border-foreground text-foreground rounded hover:bg-foreground hover:text-background transition text-sm font-semibold"
			>
				Reset Filters
			</button>
		</div>
	);
}
