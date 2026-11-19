import { NextRequest, NextResponse } from "next/server";


const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? "http://localhost:5001";


interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {

  try {
    const { token } = await params;

    const backendResponse = await fetch(`${BACKEND_API_URL}/api/v1/auth/verify-email/${encodeURIComponent(token)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: backendResponse.status
    })
  } catch (error) {
    console.error("Email verification proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify your email. Please try again.",
      },
      {
        status: 502
      }
    )
  }

}