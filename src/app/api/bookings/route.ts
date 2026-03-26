// Proxies booking creation requests to the Flask backend for local testing.
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "../../../lib/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const upstream = await fetch(getBackendUrl("/api/bookings"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
      cache: "no-store",
    });

    const responseBody = await upstream.text();
    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "backend_unavailable",
        message: error instanceof Error ? error.message : "Unable to reach backend.",
      },
      { status: 502 },
    );
  }
}
