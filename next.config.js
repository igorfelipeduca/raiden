/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_SUPABASE_URL: "https://johdvypbxsyngfdiocyf.supabase.co",
    NEXT_SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvaGR2eXBieHN5bmdmZGlvY3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc2MDA2ODMsImV4cCI6MjAxMzE3NjY4M30.-UvrWgdMIT04W-2XiR-1uqW3ZcJ9dfrJZnSR4SWZ7kI",
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
