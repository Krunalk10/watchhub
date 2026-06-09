"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/common/Layout.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Wishlistpage() {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();
	const [wishlistItems, setWishlistItems] = useState([]);

	// Effect 1 — redirect only after auth is fully resolved
	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push("/pages/login");
		}
	}, [isAuthenticated, loading, router]);

	// Effect 2 — load wishlist once on mount, never re-runs
	useEffect(() => {
		const wishlist = JSON.parse(sessionStorage.getItem("wishlist") || "[]");
		setWishlistItems(wishlist);
	}, []);

	// Wait for auth to resolve before rendering anything
	if (loading) return null;
	if (!isAuthenticated) return null;

	const handleRemoveFromWishlist = (id) => {
		const updated = wishlistItems.filter((item) => item.id !== id);
		setWishlistItems(updated);
		sessionStorage.setItem("wishlist", JSON.stringify(updated));
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
		alert(`${watch.name} added to cart!`);
	};

	return (
		<Layout>
			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-foreground mb-8">My Wishlist</h1>

				{wishlistItems.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-lg text-muted-foreground mb-6">
							Your wishlist is empty
						</p>
						<Link
							href="/watches"
							className="inline-block px-6 py-3 bg-foreground text-background rounded font-semibold hover:bg-secondary hover:text-foreground transition"
						>
							Start Shopping
						</Link>
					</div>
				) : (
					<div className="space-y-6">
						{wishlistItems.map((watch) => (
							<div
								key={watch.id}
								className="bg-card rounded p-6 border border-border flex flex-col md:flex-row items-start gap-6"
							>
								<Link
									href={`/watches/${watch.id}`}
									className="flex-shrink-0 w-full md:w-48"
								>
									<div className="relative w-full h-40 bg-muted rounded overflow-hidden hover:scale-105 transition-transform">
										<img
											src={watch.image}
											alt={watch.name}
											className="w-full h-full object-cover"
										/>
									</div>
								</Link>

								<div className="flex-1 flex flex-col justify-between">
									<div>
										<p className="text-secondary font-semibold text-sm mb-1">
											{watch.brand}
										</p>
										<h3 className="text-xl font-semibold text-foreground mb-2">
											{watch.name}
										</h3>

										<div className="flex items-center gap-1 mb-4">
											<div className="flex gap-1">
												{[...Array(5)].map((_, i) => (
													<span
														key={i}
														className={
															i < Math.floor(watch.rating)
																? "text-secondary"
																: "text-muted"
														}
													>
														★
													</span>
												))}
											</div>
											<span className="text-xs text-muted-foreground">
												({watch.reviews})
											</span>
										</div>

										<p className="text-2xl font-bold text-foreground mb-4">
											${watch.price.toLocaleString()}
										</p>
									</div>

									<div className="flex gap-3 mt-4 flex-col md:flex-row">
										<button
											onClick={() => handleAddToCart(watch)}
											className="flex-1 py-2 bg-foreground text-background rounded font-semibold hover:bg-secondary hover:text-foreground transition text-sm"
										>
											Add to Cart
										</button>
										<button
											onClick={() => handleRemoveFromWishlist(watch.id)}
											className="flex-1 py-2 border border-red-600 text-red-600 rounded font-semibold hover:bg-red-600 hover:text-background transition text-sm"
										>
											Remove
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</Layout>
	);
}
