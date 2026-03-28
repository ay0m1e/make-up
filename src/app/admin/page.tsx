import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "../../core/auth/auth";

export default async function AdminIndexPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_SESSION_COOKIE)?.value) {
    redirect("/admin/login");
  }

  redirect("/admin/bookings");
}
