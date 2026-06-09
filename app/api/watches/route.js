import { NextResponse } from "next/server";
import watchesData from "@/data/watches.json" assert { type: "json" };

export async function GET(request) {
	try {
		const searchParams = request.nextUrl.searchParams;

		const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
		const perpage = Math.max(
			1,
			Math.min(100, parseInt(searchParams.get("perpage") || "10")),
		);
		const search = (searchParams.get("search") || "").trim();
		const minPrice = Math.max(0, parseInt(searchParams.get("minPrice") || "0"));
		const maxPrice = Math.max(
			minPrice,
			parseInt(searchParams.get("maxPrice") || "50000"),
		);
		const sort = searchParams.get("sort") || "newest";

		// ── FIX: read ALL `brand` params into an array (supports multi-brand filter)
		// Previously only searchParams.get("brand") was used — that reads just the
		// first value, so a second brand was ignored entirely.
		const selectedBrands = searchParams.getAll("brand").filter(Boolean);

		if (!watchesData || !Array.isArray(watchesData.watches)) {
			throw new Error("Watch data is unavailable");
		}

		let filtered = [...watchesData.watches];

		if (search) {
			const searchLower = search.toLowerCase();
			filtered = filtered.filter(
				(w) =>
					w.name.toLowerCase().includes(searchLower) ||
					w.brand.toLowerCase().includes(searchLower) ||
					w.description.toLowerCase().includes(searchLower),
			);
		}

		// ── FIX: filter by ANY of the selected brands (OR logic)
		if (selectedBrands.length > 0) {
			filtered = filtered.filter((w) => selectedBrands.includes(w.brand));
		}

		filtered = filtered.filter(
			(w) => w.price >= minPrice && w.price <= maxPrice,
		);

		if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
		else if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
		else if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
		else filtered.sort((a, b) => b.id - a.id); // newest

		const total = filtered.length;
		const totalpages = Math.ceil(total / perpage);

		if (page > totalpages && total > 0) {
			return NextResponse.json(
				{ error: `page ${page} exceeds maximum pages ${totalpages}` },
				{ status: 400 },
			);
		}

		const startIndex = (page - 1) * perpage;
		const watches = filtered.slice(startIndex, startIndex + perpage);

		return NextResponse.json({
			success: true,
			watches,
			pagination: { page, perpage, total, totalpages },
		});
	} catch (error) {
		console.error(
			"Watches API error:",
			error instanceof Error ? error.message : String(error),
		);
		return NextResponse.json(
			{
				error: "Failed to fetch watches",
				details:
					process.env.NODE_ENV === "development" ? error.message : undefined,
			},
			{ status: 500 },
		);
	}
}
