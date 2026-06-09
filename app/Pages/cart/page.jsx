"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/common/Layout.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Cartpage() {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();
	const [cartItems, setCartItems] = useState([]);

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push("/pages/login");
		}
	}, [isAuthenticated, loading, router]);

	useEffect(() => {
		const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
		setCartItems(cart);
	}, []);

	if (loading) return null;
	if (!isAuthenticated) return null;

	const handleRemoveItem = (id) => {
		const updatedCart = cartItems.filter((item) => item.id !== id);
		setCartItems(updatedCart);
		sessionStorage.setItem("cart", JSON.stringify(updatedCart));
	};

	const handleQuantityChange = (id, quantity) => {
		if (quantity < 1) {
			handleRemoveItem(id);
			return;
		}
		const updatedCart = cartItems.map((item) =>
			item.id === id ? { ...item, quantity } : item,
		);
		setCartItems(updatedCart);
		sessionStorage.setItem("cart", JSON.stringify(updatedCart));
	};

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const tax = subtotal * 0.1;
	const total = subtotal + tax;

	return (
		<Layout>
			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-foreground mb-8">
					Shopping Cart
				</h1>

				{cartItems.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-lg text-muted-foreground mb-6">
							Your cart is empty
						</p>
						<Link
							href="/watches"
							className="inline-block px-6 py-3 bg-foreground text-background rounded font-semibold hover:bg-secondary hover:text-foreground transition"
						>
							Continue Shopping
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Cart Items */}
						<div className="lg:col-span-2">
							<div className="space-y-4">
								{cartItems.map((item) => (
									<div
										key={item.id}
										className="bg-card rounded p-6 border border-border flex gap-6"
									>
										<div className="relative w-24 h-24 bg-muted rounded overflow-hidden">
											<Image
												src={item.image}
												alt={item.name}
												fill
												className="object-cover"
												sizes="100px"
											/>
										</div>

										<div className="flex-1">
											<h3 className="font-semibold text-foreground">
												{item.name}
											</h3>
											<p className="text-sm text-muted-foreground mb-2">
												{item.brand}
											</p>
											<p className="font-semibold text-foreground mb-4">
												${item.price.toLocaleString()}
											</p>

											<div className="flex items-center justify-between">
												<div className="flex items-center border border-border rounded">
													<button
														onClick={() =>
															handleQuantityChange(item.id, item.quantity - 1)
														}
														className="px-3 py-1 text-foreground hover:bg-muted transition"
													>
														−
													</button>
													<input
														type="number"
														value={item.quantity}
														onChange={(e) =>
															handleQuantityChange(
																item.id,
																parseInt(e.target.value) || 1,
															)
														}
														className="w-12 text-center border-x border-border py-1 bg-background text-foreground focus:outline-none"
														min="1"
													/>
													<button
														onClick={() =>
															handleQuantityChange(item.id, item.quantity + 1)
														}
														className="px-3 py-1 text-foreground hover:bg-muted transition"
													>
														+
													</button>
												</div>

												<button
													onClick={() => handleRemoveItem(item.id)}
													className="text-red-600 hover:text-red-700 text-sm font-medium"
												>
													Remove
												</button>
											</div>
										</div>

										<div className="text-right">
											<p className="font-semibold text-foreground">
												${(item.price * item.quantity).toLocaleString()}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Summary */}
						<div className="lg:col-span-1">
							<div className="bg-card rounded p-6 border border-border sticky top-4">
								<h2 className="text-lg font-bold text-foreground mb-6">
									Order Summary
								</h2>

								<div className="space-y-3 mb-6 pb-6 border-b border-border">
									<div className="flex justify-between text-foreground">
										<span>Subtotal</span>
										<span>${subtotal.toLocaleString()}</span>
									</div>
									<div className="flex justify-between text-foreground">
										<span>Tax (10%)</span>
										<span>${tax.toLocaleString()}</span>
									</div>
								</div>

								<div className="flex justify-between text-lg font-bold text-foreground mb-6">
									<span>Total</span>
									<span>${total.toLocaleString()}</span>
								</div>

								<button className="w-full py-3 bg-foreground text-background rounded font-semibold hover:bg-secondary hover:text-foreground transition mb-3">
									Proceed to Checkout
								</button>

								<Link
									href="/watches"
									className="block text-center py-3 border border-foreground text-foreground rounded font-semibold hover:bg-foreground hover:text-background transition"
								>
									Continue Shopping
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}
