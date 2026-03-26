// Proxies public service requests to the Flask backend for local testing.
import { NextResponse } from "next/server";
import { getBackendUrl } from "../../../lib/env";

export async function GET() {
  try {
    const upstream = await fetch(getBackendUrl("/api/services"), {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const body = await upstream.text();
    return new NextResponse(body, {
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
