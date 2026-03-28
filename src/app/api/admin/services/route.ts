// Same-origin admin services proxy using the stored admin session cookie.
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "../../../../lib/env";
import { ADMIN_SESSION_COOKIE } from "../../../../core/auth/auth";
import {
  adminUnauthorizedResponse,
  proxyAdminUpstreamResponse,
} from "../../../../core/auth/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return adminUnauthorizedResponse();
  }

  try {
    const upstream = await fetch(getBackendUrl("/api/admin/services"), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return proxyAdminUpstreamResponse(upstream);
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

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return adminUnauthorizedResponse();
  }

  try {
    const body = await request.text();
    const upstream = await fetch(getBackendUrl("/api/admin/services"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
      cache: "no-store",
    });

    return proxyAdminUpstreamResponse(upstream);
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
