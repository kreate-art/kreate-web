// TODO: Remove 'unsafe-inline'. And stricter rules...
// https://scotthelme.co.uk/content-security-policy-an-introduction/
const CONTENT_SECURITY_POLICY = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' https://*.grammarly.com/;
  style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com/ajax/libs/normalize/ https://cdn.jsdelivr.net/npm/react-responsive-carousel/ https://cdn.jsdelivr.net/npm/semantic-ui@2/ https://fonts.googleapis.com/css;
  img-src 'self' blob: data: https://teiki.network https://*.teiki.network https://*.grammarly.com/;
  media-src 'self' blob: data: https://teiki.network https://*.teiki.network;
  font-src 'self' data: https://cdn.jsdelivr.net/npm/semantic-ui@2/ https://fonts.gstatic.com/s/lato/;
  connect-src 'self' blob: data: https://teiki.network https://*.teiki.network https://*.blockfrost.io/api/ https://api.coingecko.com https://*.grammarly.com/ https://*.grammarly.io/ wss://*.grammarly.com/;
`;
const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: CONTENT_SECURITY_POLICY.replace(/\s{2,}/g, " ").trim(),
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
      {
        protocol: "https",
        hostname: "**.teiki.network",
      },
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              protocol: "http",
              hostname: "localhost",
            },
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
