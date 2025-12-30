import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const session = req.cookies.get("__session")?.value;

    if (!session) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
