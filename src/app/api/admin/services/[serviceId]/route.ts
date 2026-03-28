// Same-origin admin service mutation proxy using the stored admin session cookie.
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "../../../../../lib/env";
import { ADMIN_SESSION_COOKIE } from "../../../../../core/auth/auth";

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "authorization_required", message: "Authentication required." },
    { status: 401 },
  );
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ serviceId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return unauthorizedResponse();
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

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ serviceId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return unauthorizedResponse();
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
