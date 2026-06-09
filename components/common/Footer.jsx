import Link from "next/link";

export function Footer() {
	return (
		<footer className="bg-foreground text-background mt-16">
			<div className="max-w-7xl mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<div>
						<h3 className="text-xl font-semibold mb-4">Watch</h3>
						<p className="text-sm opacity-80">
							Your premier destination for luxury watches from the world&apos;s
							finest brands.
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Shop</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/watches"
									className="opacity-80 hover:opacity-100 transition"
								>
									All Watches
								</Link>
							</li>
							<li>
								<Link
									href="/watches?sort=price-low"
									className="opacity-80 hover:opacity-100 transition"
								>
									Budget Watches
								</Link>
							</li>
							<li>
								<Link
									href="/watches?sort=price-high"
									className="opacity-80 hover:opacity-100 transition"
								>
									Luxury Watches
								</Link>
							</li>
							<li>
								<Link
									href="/watches?sort=rating"
									className="opacity-80 hover:opacity-100 transition"
								>
									Top Rated
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Customer Service</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="#"
									className="opacity-80 hover:opacity-100 transition"
								>
									Contact Us
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="opacity-80 hover:opacity-100 transition"
								>
									Shipping Info
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="opacity-80 hover:opacity-100 transition"
								>
									Returns
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="opacity-80 hover:opacity-100 transition"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Information</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="#"
									className="opacity-80 hover:opacity-100 transition"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="opacity-80 hover:opacity-100 transition"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="opacity-80 hover:opacity-100 transition"
								>
									Terms & Conditions
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="opacity-80 hover:opacity-100 transition"
								>
									Blog
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-background border-opacity-20 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
						<p>&copy; 2024 WatchHub. All rights reserved.</p>
						<div className="flex gap-6 mt-4 md:mt-0">
							<Link
								href="#"
								className="opacity-80 hover:opacity-100 transition"
							>
								Facebook
							</Link>
							<Link
								href="#"
								className="opacity-80 hover:opacity-100 transition"
							>
								Instagram
							</Link>
							<Link
								href="#"
								className="opacity-80 hover:opacity-100 transition"
							>
								Twitter
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
