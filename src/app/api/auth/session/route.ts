import { NextResponse } from "next/server";

import { adminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const { idToken } = await req.json();

    const expiresIn = 5 * 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ ok: true });

    response.cookies.set({
        name: "__session",
        value: sessionCookie,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn / 1000,
    });

    return response;
}
