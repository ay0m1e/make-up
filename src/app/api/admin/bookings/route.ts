// Same-origin admin bookings proxy using the stored admin session cookie.
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "../../../../lib/env";
import { ADMIN_SESSION_COOKIE } from "../../../../core/auth/auth";

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "authorization_required", message: "Authentication required." },
    { status: 401 },
  );
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return unauthorizedResponse();
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
