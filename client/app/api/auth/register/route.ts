import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";


const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? "http://localhost:5001";


export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const backendResponse = await fetch(`${BACKEND_API_URL}/api/v1/auth/register`, {
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
    console.error("Registration proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the registration service.",
      },
      { status: 502 }
    )
  }
}