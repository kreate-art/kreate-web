import { NextRequest, NextResponse } from "next/server";

const IPFS_GATEWAY_ORIGIN =
  process.env.INTERNAL_IPFS_GATEWAY_ORIGIN ||
  process.env.NEXT_PUBLIC_IPFS_GATEWAY_ORIGIN ||
  "";

const SAFE_HTTP_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

if (!/^(http|https):\/\/.*[^/]$/.test(IPFS_GATEWAY_ORIGIN))
  throw new Error(
    "IPFS_GATEWAY_ORIGIN must starts with " +
      "'http://' or 'https://' and must not end with '/'"
  );

console.log(`Interally route IPFS Gateway to: ${IPFS_GATEWAY_ORIGIN}`);

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  if (pathname === "/_next/image") {
    const imageUrl = url.searchParams.get("url");
    if (imageUrl && imageUrl.includes("/api/v1/exclusive"))
      return NextResponse.redirect(new URL(imageUrl, request.url), 308);
  } else {
    if (!SAFE_HTTP_METHODS.has(request.method))
      return new NextResponse("Invalid HTTP method", {
        status: 405,
        statusText: "Method Not Allowed",
      });
    if (pathname === "/_proxy") {
      const proxyUrl = url.searchParams.get("url");
      if (!proxyUrl)
        return new NextResponse("URL must be specified", {
          status: 400,
          statusText: "Bad Request",
        });
      return NextResponse.rewrite(proxyUrl);
    } else {
      // Must be /_ipfs/:path*
      return NextResponse.rewrite(
        `${IPFS_GATEWAY_ORIGIN}${pathname.slice(6)}${url.search}${url.hash}`
      );
    }
  }
}

export const config = {
  matcher: ["/_next/image", "/_ipfs/:path*", "/_proxy"],
};
