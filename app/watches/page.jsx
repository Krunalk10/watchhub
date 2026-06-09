import { Suspense } from "react";
import WatchesContent from "./WatchesContent";

export default function Watchespage() {
	return (
		<Suspense fallback={<div className="p-8">Loading watches...</div>}>
			<WatchesContent />
		</Suspense>
	);
}
