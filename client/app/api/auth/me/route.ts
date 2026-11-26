import { NextRequest, NextResponse } from "next/server";


const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:5001";


export async function GET(req: NextRequest) {
  try {
    const cookie = req.headers.get("cookie");

    const backendResponse = await fetch(`${BACKEND_API_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        ...(cookie && { Cookie: cookie })
      },
      cache: "no-store"
    });
    // 

    const data = await backendResponse.json();
    console.log(data)
    return NextResponse.json(data, {
      status: backendResponse.status
    })
  } catch (error) {
    console.error("Get profile BFF error:", error);

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