import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const CAPITAL_GAINS_DATA = {
  "capitalGains": {
    "stcg": { "profits": 70200.88, "losses": 1548.53 },
    "ltcg": { "profits": 5020, "losses": 3050 }
  }
};

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  if (!checkRateLimit(ip)) {
    return new NextResponse(
      JSON.stringify({ error: "Too Many Requests" }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff"
        }
      }
    );
  }

  return new NextResponse(
    JSON.stringify(CAPITAL_GAINS_DATA),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    }
  );
}
