import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

/*
 * Waitlist API — stores emails in Upstash Redis (free tier).
 *
 * Required env vars (add in Vercel dashboard → Settings → Environment Variables):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * Get these free at: https://console.upstash.com
 *   → Create Database → pick a region → copy REST URL + Token
 */

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

// Fallback in-memory store (used when Redis isn't configured yet)
const memoryEmails = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const redis = getRedis();

    if (redis) {
      // Real persistence with Upstash Redis
      const exists = await redis.sismember("waitlist_emails", trimmed);
      if (exists) {
        return NextResponse.json({
          duplicate: true,
          message: "Already signed up",
        });
      }
      await redis.sadd("waitlist_emails", trimmed);
      const count = await redis.scard("waitlist_emails");
      console.log(`[waitlist] New signup: ${trimmed} (total: ${count})`);
    } else {
      // Fallback: in-memory (won't persist across deploys)
      if (memoryEmails.has(trimmed)) {
        return NextResponse.json({
          duplicate: true,
          message: "Already signed up",
        });
      }
      memoryEmails.add(trimmed);
      console.log(
        `[waitlist] New signup (memory-only): ${trimmed} — Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for persistence`
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[waitlist] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// GET endpoint to check waitlist count (optional, for your own use)
export async function GET() {
  const redis = getRedis();
  if (redis) {
    const count = await redis.scard("waitlist_emails");
    const emails = await redis.smembers("waitlist_emails");
    return NextResponse.json({ count, emails });
  }
  return NextResponse.json({
    count: memoryEmails.size,
    emails: Array.from(memoryEmails),
    note: "Using in-memory store. Add Upstash env vars for persistence.",
  });
}
