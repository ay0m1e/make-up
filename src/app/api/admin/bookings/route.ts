// Same-origin admin bookings proxy using the stored admin session cookie.
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "../../../../lib/env";
import { ADMIN_SESSION_COOKIE } from "../../../../core/auth/auth";
import {
  adminUnauthorizedResponse,
  proxyAdminUpstreamResponse,
} from "../../../../core/auth/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return adminUnauthorizedResponse();
  }

  try {
    const upstream = await fetch(
      getBackendUrl(`/api/admin/bookings${request.nextUrl.search}`),
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

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
