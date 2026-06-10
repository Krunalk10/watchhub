"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth.js";
import { useRouter } from "next/navigation";

export function WatchCard({ watch, onAddToCart, onAddToWishlist }) {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	const handleAddToCart = (e) => {
		e.preventDefault();
		if (!isAuthenticated) {
			router.push("/pages/login");
			return;
		}
		onAddToCart?.(watch);
	};

	const handleAddToWishlist = (e) => {
		e.preventDefault();
		if (!isAuthenticated) {
			router.push("/pages/login");
			return;
		}
		onAddToWishlist?.(watch);
	};

	return (
    <Link href={`/watches/${watch.id}`}>
      <div className="bg-card rounded overflow-hidden shadow hover:shadow-xl transition-all duration-300 h-full flex flex-col group cursor-pointer">
        <div className="relative overflow-hidden bg-muted h-64">
          <Image
            src={watch.image}
            alt={watch.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <p className="text-xs text-muted-foreground font-semibold mb-1">
            {watch.brand}
          </p>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
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
            <br />
            <h6>Price: ${watch.price} </h6>
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-foreground text-background py-2 rounded text-sm font-semibold hover:bg-secondary hover:text-foreground transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              className="flex-1 border border-foreground text-foreground py-2 rounded text-sm font-semibold hover:bg-foreground hover:text-background transition"
            >
              ♡ Wishlist
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
