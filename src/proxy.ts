import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";

const publicRoutes = ["/sign-in"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getSession();
  const isAuthenticated = !!session?.user;

  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  if (isPublicRoute && isAuthenticated && !path.startsWith("/")) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
