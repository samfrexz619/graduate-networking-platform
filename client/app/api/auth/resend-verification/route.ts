import { NextRequest, NextResponse } from "next/server";


const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? "http://localhost:5001";

export async function POST(req: NextRequest) {
  try {
    const body = req.json();

    const backendResponse = await fetch(`${BACKEND_API_URL}/api/v1/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: backendResponse.status
    });
  } catch (error) {
    console.error("Resend verification BFF error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}