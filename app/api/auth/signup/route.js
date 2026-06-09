import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/api.js";

export async function POST(request) {
	try {
		let requestBody;
		try {
			requestBody = await request.json();
		} catch (parseError) {
			console.error("[v0] Invalid JSON in signup request:", parseError.message);
			return NextResponse.json(
				{ error: "Invalid request format" },
				{ status: 400 },
			);
		}

		const { email, password, confirmPassword } = requestBody;

		if (!email || !password || !confirmPassword) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 },
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email format" },
				{ status: 400 },
			);
		}

		if (password !== confirmPassword) {
			return NextResponse.json(
				{ error: "Passwords do not match" },
				{ status: 400 },
			);
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: "Password must be at least 6 characters" },
				{ status: 400 },
			);
		}

		const user = await Promise.resolve(registerUser(email, password));

		if (!user) {
			return NextResponse.json(
				{ error: "User with this email already exists" },
				{ status: 409 },
			);
		}

		const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

		return NextResponse.json({
			success: true,
			user,
			token,
		});
	} catch (error) {
		console.error(
			"[v0] Signup error:",
			error instanceof Error ? error.message : String(error),
		);
		return NextResponse.json(
			{
				error: "Internal server error",
				details:
					process.env.NODE_ENV === "development" ? error.message : undefined,
			},
			{ status: 500 },
		);
	}
}
