import { NextRequest, NextResponse } from "next/server";

const MODEL_MAP: Record<string, string> = {
  claude: "google/gemini-2.0-flash-001",
  chatgpt: "google/gemini-2.0-flash-001",
  gemini: "google/gemini-2.0-flash-001",
  perplexity: "google/gemini-2.0-flash-001",
};

const VALID_MODELS = new Set(Object.keys(MODEL_MAP));
const MAX_MESSAGES = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { model, messages } = body;

    if (!model || !VALID_MODELS.has(model)) {
      return NextResponse.json(
        { error: "Invalid model selection" },
        { status: 400 }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages must be a non-empty array" },
        { status: 400 }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_MESSAGES} messages allowed` },
        { status: 400 }
      );
    }

    for (const msg of messages) {
      if (
        !msg ||
        typeof msg.role !== "string" ||
        typeof msg.content !== "string" ||
        !["user", "assistant", "system"].includes(msg.role)
      ) {
        return NextResponse.json(
          { error: "Invalid message format" },
          { status: 400 }
        );
      }
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lidogent.vercel.app",
          "X-Title": "Lidogent",
        },
        body: JSON.stringify({
          model: MODEL_MAP[model],
          messages,
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get response from AI provider" },
        { status: 502 }
      );
    }

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Empty response from AI provider" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      content,
      model: model,
      usage: {
        prompt_tokens: data?.usage?.prompt_tokens ?? 0,
        completion_tokens: data?.usage?.completion_tokens ?? 0,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
