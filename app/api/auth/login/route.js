import { NextRequest, NextResponse } from "next/server";
import { validateAuth } from "@/lib/api.js";

export async function POST(request) {
	try {
		let requestBody;
		try {
			requestBody = await request.json();
		} catch (parseError) {
			console.error("[v0] Invalid JSON in login request:", parseError.message);
			return NextResponse.json(
				{ error: "Invalid request format" },
				{ status: 400 },
			);
		}

		const { email, password } = requestBody;

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
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

		const user = await Promise.resolve(validateAuth(email, password));

		if (!user) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 },
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
			" Login error:",
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
