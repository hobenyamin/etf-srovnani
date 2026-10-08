import { type NextRequest, NextResponse } from "next/server";

// Hero podle reklamy: utm_content začínající „b“ (např. b-zvedavost-feed) → varianta B.
// Rewrite, ne redirect: URL i UTM v prohlížeči zůstávají, stránka se servíruje staticky.
export function proxy(request: NextRequest) {
  const content = request.nextUrl.searchParams.get("utm_content") ?? "";
  if (!content.toLowerCase().startsWith("b")) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/v/b";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/",
};
