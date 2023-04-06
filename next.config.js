const NODE_ENV = process.env.NODE_ENV;
const KREATE_ENV = process.env.NEXT_PUBLIC_KREATE_ENV;

// TODO: Remove 'unsafe-inline'. And stricter rules...
// https://scotthelme.co.uk/content-security-policy-an-introduction/
// TODO: Tighten grammarly
const CONTENT_SECURITY_POLICY = (() => {
  const csp = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-eval'", "https://*.grammarly.com/"],
    "style-src": [
      "'self'",
      "'unsafe-inline'",
      "https://cdnjs.cloudflare.com/ajax/libs/normalize/",
      "https://cdn.jsdelivr.net/npm/react-responsive-carousel/",
      "https://cdn.jsdelivr.net/npm/semantic-ui@2/",
      "https://fonts.googleapis.com/css",
    ],
    "img-src": ["'self'", "blob:", "data:", "https://*.grammarly.com/"],
    "media-src": ["'self'", "blob:", "data:"],
    "font-src": [
      "'self'",
      "data:",
      "https://cdn.jsdelivr.net/npm/semantic-ui@2/",
      "https://fonts.gstatic.com/s/lato/",
    ],
    "connect-src": [
      "'self'",
      "blob:",
      "data:",
      "https://*.blockfrost.io/api/",
      "https://api.coingecko.com",
      "https://*.grammarly.com/",
      "https://*.grammarly.io/",
      "wss://*.grammarly.com/",
      "https://ai.kreate.community",
    ],
    "object-src": ["'none'"],
  };
  if (KREATE_ENV === "testnet") {
    csp["media-src"].push("https://cdn.testnet.kreate.community");
    csp["media-src"].push("https://ipfs.testnet.kreate.community");
    csp["img-src"].push("https://ipfs.testnet.kreate.community");
    csp["connect-src"].push("https://ipfs.testnet.kreate.community");
    // Legacy, @sk-yagi
    csp["media-src"].push("https://ipfs-testnet.teiki.network");
    csp["img-src"].push("https://ipfs-testnet.teiki.network");
  }
  if (KREATE_ENV === "mainnet") {
    csp["media-src"].push("https://cdn.kreate.community");
    csp["media-src"].push("https://ipfs.kreate.community");
    csp["img-src"].push("https://ipfs.kreate.community");
    csp["connect-src"].push("https://ipfs.kreate.community");
    // Legacy, @sk-yagi
    csp["media-src"].push("https://ipfs.teiki.network");
    csp["img-src"].push("https://ipfs.teiki.network");
  }
  return csp;
})();

const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: Object.entries(CONTENT_SECURITY_POLICY)
      .map(([key, values]) => `${key} ${values.join(" ")};`)
      .join(" "),
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    swcPlugins: [["next-superjson-plugin", { excluded: [] }]],
  },
  webpack: (config, _webpackConfigContext) => {
    config.experiments = {
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...(NODE_ENV === "development"
        ? [
            { protocol: "http", hostname: "localhost" },
            { protocol: "http", hostname: "127.0.0.1", port: "8080" },
          ]
        : []),
      ...(KREATE_ENV === "testnet"
        ? [
            { protocol: "https", hostname: "testnet.kreate.community" },
            { protocol: "https", hostname: "ipfs.testnet.kreate.community" },
            // Legacy, @sk-yagi
            { protocol: "https", hostname: "ipfs-testnet.teiki.network" },
          ]
        : []),
      ...(KREATE_ENV === "mainnet"
        ? [
            { protocol: "https", hostname: "beta.kreate.community" },
            { protocol: "https", hostname: "ipfs.kreate.community" },
            // Legacy, @sk-yagi
            { protocol: "https", hostname: "ipfs.teiki.network" },
          ]
        : []),
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        source: "/__commit_sha__",
        headers: [
          { key: "Content-Type", value: "text/plain" },
          {
            key: "Cache-Control",
            value:
              "Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/images/:img*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/stylesheets/:css*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  redirects() {
    return [
      {
        source: "/c/:slug*",
        destination: "/k/:slug*",
        permanent: true,
      },
      {
        source: "/creator-by-id/:slug*",
        destination: "/kreator-by-id/:slug*",
        permanent: true,
      },
      {
        source: "/projects/:slug*",
        destination: "/k/:slug*",
        permanent: true,
      },
      {
        source: "/projects-by-id/:slug*",
        destination: "/kreator-by-id/:slug*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
