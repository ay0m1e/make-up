// Same-origin admin booking action proxy for cancellation.
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBackendUrl } from "../../../../../../lib/env";
import { ADMIN_SESSION_COOKIE } from "../../../../../../core/auth/auth";

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "authorization_required", message: "Authentication required." },
    { status: 401 },
  );
}

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ bookingId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return unauthorizedResponse();
  }

  const { bookingId } = await context.params;

  try {
    const upstream = await fetch(
      getBackendUrl(`/api/admin/bookings/${bookingId}/cancel`),
      {
        method: "PATCH",
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
