import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const session = cookieStore.get("__session")?.value;

    if (!session) redirect("/");

    try {
        const decoded = await adminAuth.verifySessionCookie(session, true);
        if (!decoded.admin) redirect("/");
    } catch {
        redirect("/");
    }

    return <>{children}</>;
}
