import { NextRequest, NextResponse } from "next/server";

const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=92VJ%2BR6%2C%20Abidjan%2C%20Cocody%20Angr%C3%A9%208e%20Tranche%2C%20Zone%20Bon%20Prix";

const shortLinks: Record<string, string> = {
  i: "/register",
  c: "/register-club",
  r: "/rendez-vous",
  p: googleMapsUrl,
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
