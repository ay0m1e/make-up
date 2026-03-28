// Same-origin admin service mutation proxy using the stored admin session cookie.
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "../../../../../lib/env";
import { ADMIN_SESSION_COOKIE } from "../../../../../core/auth/auth";
import {
  adminUnauthorizedResponse,
  proxyAdminUpstreamResponse,
} from "../../../../../core/auth/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ serviceId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return adminUnauthorizedResponse();
  }

  const { serviceId } = await context.params;

  try {
    const body = await request.text();
    const upstream = await fetch(getBackendUrl(`/api/admin/services/${serviceId}`), {
      method: "PATCH",
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

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ serviceId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return adminUnauthorizedResponse();
  }

  const { serviceId } = await context.params;

  try {
    const upstream = await fetch(getBackendUrl(`/api/admin/services/${serviceId}`), {
      method: "DELETE",
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
