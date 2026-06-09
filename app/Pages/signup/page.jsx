"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth.js";
import { Layout } from "@/components/common/Layout.jsx";

export default function Signuppage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { signup } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await signup(email, password, confirmPassword);
			router.push("/");
		} catch (err) {
			setError(err?.message || "Signup failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout>
			<div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
				<div className="w-full max-w-md bg-card rounded p-8 shadow-lg border border-border">
					<h1 className="text-3xl font-semibold text-foreground mb-2">
						Create Account
					</h1>
					<p className="text-muted-foreground mb-6">
						Join WatchHub to start collecting premium watches
					</p>

					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Email Address
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
								placeholder="you@example.com"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
								placeholder="********"
								required
							/>
							<p className="text-xs text-muted-foreground mt-1">
								At least 6 characters
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Confirm Password
							</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full px-4 py-3 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
								placeholder="********"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 bg-foreground text-background rounded font-semibold hover:bg-secondary hover:text-foreground transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Creating account..." : "Create Account"}
						</button>
					</form>

					<p className="text-sm text-muted-foreground text-center mt-6">
						Already have an account?{" "}
						<Link
							href="/pages/login"
							className="text-secondary font-semibold hover:underline"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</Layout>
	);
}
