import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const IPFS_GATEWAY_ORIGIN =
  process.env.INTERNAL_IPFS_GATEWAY_ORIGIN ||
  process.env.NEXT_PUBLIC_IPFS_GATEWAY_ORIGIN ||
  "";

if (!/^(http|https):\/\/.*[^/]$/.test(IPFS_GATEWAY_ORIGIN))
  throw new Error(
    "IPFS_GATEWAY_ORIGIN must starts with " +
      "'http://' or 'https://' and must not end with '/'"
  );

console.log(`Interally route IPFS Gateway to: ${IPFS_GATEWAY_ORIGIN}`);

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const method = request.method;
  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS")
    throw new Error("We only accept GET/HEAD/OPTIONS method");
  const url = request.nextUrl;
  return NextResponse.rewrite(
    `${IPFS_GATEWAY_ORIGIN}${url.pathname.slice(6)}${url.search}${url.hash}`
  );
}

export const config = {
  matcher: ["/_ipfs/:path*"],
};
