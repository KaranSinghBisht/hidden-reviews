import { NextResponse } from "next/server";
import { z } from "zod";
import { dig } from "@/lib/dig/dig";

// Live digs run a multi-step research agent; give it headroom under the cap.
export const maxDuration = 60;

const DigSchema = z.object({
  query: z.string().trim().min(1, "Enter something to look up.").max(120),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = DigSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid query.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const result = await dig(parsed.data.query);
    return NextResponse.json(result);
  } catch {
    // Keep details server-side; never leak internals to the client.
    return NextResponse.json(
      { error: "Couldn't dig that up right now. Try again." },
      { status: 500 },
    );
  }
}
