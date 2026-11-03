import { NextRequest, NextResponse } from "next/server";


const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:5001";

export async function POST(req: NextRequest) {
  const body = await req.json();


  try {
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await backendResponse.json();

    const response = NextResponse.json(data, {
      status: backendResponse.status
    });

    const setCookie = backendResponse.headers.get("set-cookie");

    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    console.error("Login proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to authentication service"
      },
      {
        status: 500
      }
    )
  }

}