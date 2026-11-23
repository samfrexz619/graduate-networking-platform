import { NextRequest, NextResponse } from "next/server";



const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:5001";


export async function POST(req: NextRequest) {

  try {
    const cookie = req.headers.get("cookie");

    const backendResponse = await fetch(`${BACKEND_API_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        ...(cookie && { Cookie: cookie })
      },
      cache: "no-store"
    });

    const data = await backendResponse.json();

    const res = NextResponse.json(data, {
      status: backendResponse.status
    });

    const setCookie = backendResponse.headers.get("set-cookie");

    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }
    return res;
  } catch (error) {
    console.error("Logout proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the authentication service"
      },
      {
        status: 502
      }
    );
  }
}