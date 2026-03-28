// Same-origin admin login proxy that stores the backend JWT in an httpOnly cookie.
import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "../../../../lib/env";
import { ADMIN_SESSION_COOKIE } from "../../../../core/auth/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const upstream = await fetch(getBackendUrl("/api/admin/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
      cache: "no-store",
    });

    const responseBody = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return NextResponse.json(
        responseBody ?? { error: "login_failed", message: "Unable to log in." },
        { status: upstream.status },
      );
    }

    const accessToken = responseBody?.access_token;
    const admin = responseBody?.admin;
    if (typeof accessToken !== "string" || !admin) {
      return NextResponse.json(
        { error: "invalid_response", message: "Login response is invalid." },
        { status: 502 },
      );
    }

    const response = NextResponse.json({ admin }, { status: 200 });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: accessToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
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
