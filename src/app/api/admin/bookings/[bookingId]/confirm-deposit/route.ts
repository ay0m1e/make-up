// Same-origin admin booking action proxy for confirming deposits.
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBackendUrl } from "../../../../../../lib/env";
import { ADMIN_SESSION_COOKIE } from "../../../../../../core/auth/auth";
import {
  adminUnauthorizedResponse,
  proxyAdminUpstreamResponse,
} from "../../../../../../core/auth/server";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ bookingId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return adminUnauthorizedResponse();
  }

  const { bookingId } = await context.params;

  try {
    const upstream = await fetch(
      getBackendUrl(`/api/admin/bookings/${bookingId}/confirm-deposit`),
      {
        method: "PATCH",
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
