import { NextRequest, NextResponse } from "next/server";

const shortLinks: Record<string, string> = {
  i: "/register",
  c: "/register-club",
  r: "/rendez-vous",
  p: "/contact",
  b: "/brochure-pla-2026.pdf",
  e: "/login",
  m: "/forgot-password",
  contact: "/contact",
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const target = shortLinks[slug.toLowerCase()] || "/";

  return NextResponse.redirect(new URL(target, request.url), 307);
}
