import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "./auth";

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}

export function adminUnauthorizedResponse() {
  return clearAdminSessionCookie(
    NextResponse.json(
      { error: "authorization_required", message: "Authentication required." },
      { status: 401 },
    ),
  );
}

export async function proxyAdminUpstreamResponse(upstream: Response) {
  const body = await upstream.text();
  const response = new NextResponse(body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/json",
    },
  });

  if (upstream.status === 401) {
    clearAdminSessionCookie(response);
  }

  return response;
}
