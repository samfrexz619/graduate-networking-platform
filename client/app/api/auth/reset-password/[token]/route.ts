import { NextRequest, NextResponse } from "next/server";


const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? "http://localhost:5001";


interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {

  try {
    const { token } = await params;
    const body = await req.json();

    const backendResponse = await fetch(`${BACKEND_API_URL}/api/v1/auth/reset-password/${encodeURIComponent(token)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: backendResponse.status
    })
  } catch (error) {
    console.error("Reset password BFF error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to authentication service",
      },
      {
        status: 502
      }
    )
  }

}