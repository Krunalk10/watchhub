"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "@/components/common/Layout.jsx";
import { WatchCard } from "@/components/common/WatchCard.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import { useRouter } from "next/navigation";

export default function WatchDetailpage() {
	const params = useParams();
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const watchId = parseInt(params.id);

	const [watch, setWatch] = useState(null);
	const [relatedWatches, setRelatedWatches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("overview");
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		const fetchWatch = async () => {
			try {
				const response = await fetch(`/api/watches/${watchId}`);
				const data = await response.json();
				setWatch(data.watch);
				setRelatedWatches(data.relatedWatches || []);
			} catch (error) {
				console.error("Failed to fetch watch:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchWatch();
	}, [watchId]);

	const handleAddToCart = () => {
		if (!isAuthenticated) {
			router.push("/pages/login");
			return;
		}

		if (!watch) return;

		const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
		const existingItem = cart.find((item) => item.id === watch.id);

		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			cart.push({ ...watch, quantity });
		}

		sessionStorage.setItem("cart", JSON.stringify(cart));
		alert(`${watch.name} added to cart!`);
	};

	const handleAddToWishlist = () => {
		if (!isAuthenticated) {
			router.push("/pages/login");
			return;
		}

		if (!watch) return;

		const wishlist = JSON.parse(sessionStorage.getItem("wishlist") || "[]");
		const exists = wishlist.find((item) => item.id === watch.id);

		if (!exists) {
			wishlist.push(watch);
			sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
			alert(`${watch.name} added to wishlist!`);
		} else {
			alert("Already in your wishlist!");
		}
	};

	if (loading) {
		return (
			<Layout>
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="bg-muted rounded h-96 animate-pulse" />
				</div>
			</Layout>
		);
	}

	if (!watch) {
		return (
			<Layout>
				<div className="max-w-7xl mx-auto px-4 py-8 text-center">
					<h1 className="text-2xl font-bold text-foreground mb-4">
						Watch not found
					</h1>
					<Link href="/watches" className="text-secondary hover:underline">
						Back to watches
					</Link>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
					<Link href="/" className="hover:text-foreground">
						Home
					</Link>
					<span>/</span>
					<Link href="/watches" className="hover:text-foreground">
						Watches
					</Link>
					<span>/</span>
					<span>{watch.name}</span>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
					<div className="relative bg-muted rounded overflow-hidden h-96 md:h-full md:min-h-96">
						<Image
							src={watch.image}
							alt={watch.name}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 50vw"
							priority
						/>
					</div>

					<div className="flex flex-col justify-between">
						<div>
							<p className="text-secondary font-semibold text-sm mb-2">
								{watch.brand}
							</p>
							<h1 className="text-4xl font-bold text-foreground mb-4">
								{watch.name}
							</h1>

							<div className="flex items-center gap-3 mb-6">
								<div className="flex gap-1">
									{[...Array(5)].map((_, i) => (
										<span
											key={i}
											className={
												i < Math.floor(watch.rating)
													? "text-secondary text-2xl"
													: "text-muted text-2xl"
											}
										>
											★
										</span>
									))}
								</div>
								<span className="text-muted-foreground">
									{watch.rating} ({watch.reviews} reviews)
								</span>
							</div>

							<div className="mb-8 pb-8 border-b border-border">
								<p className="text-3xl font-bold text-foreground">
									${watch.price.toLocaleString()}
								</p>
							</div>

							<p className="text-foreground mb-8 leading-relaxed">
								{watch.description}
							</p>

							<div className="flex items-center gap-4 mb-8">
								<label className="text-foreground font-medium">Quantity:</label>
								<div className="flex items-center border border-border rounded">
									<button
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
										className="px-4 py-2 text-foreground hover:bg-muted transition"
									>
										−
									</button>
									<input
										type="number"
										value={quantity}
										onChange={(e) =>
											setQuantity(Math.max(1, parseInt(e.target.value) || 1))
										}
										className="w-16 text-center border-x border-border py-2 bg-background text-foreground focus:outline-none"
										min="1"
									/>
									<button
										onClick={() => setQuantity(quantity + 1)}
										className="px-4 py-2 text-foreground hover:bg-muted transition"
									>
										+
									</button>
								</div>
							</div>

							<div className="flex gap-4">
								<button
									onClick={handleAddToCart}
									className="flex-1 py-3 bg-foreground text-background rounded font-semibold hover:bg-secondary hover:text-foreground transition"
								>
									Add to Cart
								</button>
								<button
									onClick={handleAddToWishlist}
									className="flex-1 py-3 border border-foreground text-foreground rounded font-semibold hover:bg-foreground hover:text-background transition"
								>
									♡ Add to Wishlist
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="mb-16">
					<div className="flex gap-8 border-b border-border mb-8">
						{["overview", "specs", "reviews"].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={
									activeTab === tab
										? "pb-4 font-medium transition text-foreground border-b-2 border-secondary"
										: "pb-4 font-medium transition text-muted-foreground hover:text-foreground"
								}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</button>
						))}
					</div>

					{activeTab === "overview" && (
						<div className="space-y-4">
							<p className="text-foreground leading-relaxed">
								{watch.description}
							</p>
							<p className="text-foreground leading-relaxed">
								This exquisite timepiece represents the pinnacle of horological
								craftsmanship. Designed with meticulous attention to detail,
								every component has been engineered to provide exceptional
								accuracy and durability.
							</p>
						</div>
					)}

					{activeTab === "specs" && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{Object.entries(watch.specifications).map(([key, value]) => (
								<div key={key} className="border border-border rounded p-4">
									<p className="text-muted-foreground text-sm mb-1 capitalize">
										{key.replace(/([A-Z])/g, " $1")}
									</p>
									<p className="text-foreground font-semibold text-lg">
										{value}
									</p>
								</div>
							))}
						</div>
					)}

					{activeTab === "reviews" && (
						<div className="space-y-6">
							<div className="bg-card rounded p-6 border border-border">
								<div className="flex items-center justify-between mb-4">
									<div>
										<p className="font-semibold text-foreground">John Smith</p>
										<p className="text-sm text-muted-foreground">
											Verified Purchase
										</p>
									</div>
									<div className="flex gap-1 text-secondary">★★★★★</div>
								</div>
								<p className="text-foreground">
									Absolutely stunning watch! The craftsmanship is impeccable,
									and it arrived in perfect condition.
								</p>
							</div>

							<div className="bg-card rounded p-6 border border-border">
								<div className="flex items-center justify-between mb-4">
									<div>
										<p className="font-semibold text-foreground">
											Sarah Johnson
										</p>
										<p className="text-sm text-muted-foreground">
											Verified Purchase
										</p>
									</div>
									<div className="flex gap-1 text-secondary">★★★★☆</div>
								</div>
								<p className="text-foreground">
									Excellent watch. The only reason for 4 stars is the slight
									wait time for delivery.
								</p>
							</div>
						</div>
					)}
				</div>

				{relatedWatches.length > 0 && (
					<div>
						<h2 className="text-3xl font-bold text-foreground mb-8">
							Related Watches
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{relatedWatches.slice(0, 3).map((w) => (
								<WatchCard key={w.id} watch={w} />
							))}
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}
