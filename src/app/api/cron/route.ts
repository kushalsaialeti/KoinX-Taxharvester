import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Verify request is authorized by Vercel Cron Secret
  const authHeader = request.headers.get("Authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized access to cron runner" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff"
        }
      }
    );
  }

  // Periodic cron task logging / execution (e.g. data syncing, log updates, caching)
  console.log("KoinX Tax Loss Harvesting Cron triggered at: " + new Date().toISOString());

  return new NextResponse(
    JSON.stringify({
      success: true,
      message: "Tax Loss Harvesting Cron executed successfully",
      timestamp: new Date().toISOString(),
    }),
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
