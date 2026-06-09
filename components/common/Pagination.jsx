"use client";

export function Pagination({ currentpage, totalpages, onpageChange }) {
	const getpageNumbers = () => {
		const pages = [];
		const maxVisible = 5;

		if (totalpages <= maxVisible) {
			for (let i = 1; i <= totalpages; i++) {
				pages.push(i);
			}
		} else {
			let start = Math.max(1, currentpage - 2);
			let end = Math.min(totalpages, currentpage + 2);

			if (start > 1) {
				pages.push(1);
				if (start > 2) pages.push("...");
			}

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (end < totalpages) {
				if (end < totalpages - 1) pages.push("...");
				pages.push(totalpages);
			}
		}

		return pages;
	};

	return (
		<div className="flex items-center justify-center gap-2 mt-12">
			<button
				onClick={() => onpageChange(Math.max(1, currentpage - 1))}
				disabled={currentpage === 1}
				className="px-3 py-2 border border-border rounded text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
			>
				Previous
			</button>

			<div className="flex items-center gap-1">
				{getpageNumbers().map((page, index) => (
					<button
						key={index}
						onClick={() => typeof page === "number" && onpageChange(page)}
						disabled={page === "..." || page === currentpage}
						className={`px-3 py-2 rounded transition ${
							page === currentpage
								? "bg-foreground text-background font-semibold"
								: page === "..."
									? "cursor-default"
									: "border border-border text-foreground hover:bg-muted"
						}`}
					>
						{page}
					</button>
				))}
			</div>

			<button
				onClick={() => onpageChange(Math.min(totalpages, currentpage + 1))}
				disabled={currentpage === totalpages}
				className="px-3 py-2 border border-border rounded text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
			>
				Next
			</button>

			<span className="text-sm text-muted-foreground ml-4">
				page {currentpage} of {totalpages}
			</span>
		</div>
	);
}
