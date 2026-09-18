import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { askFutureTry } from "@/lib/chat";
import { dbEnabled, prisma } from "@/lib/db";

const schema = z.object({
  message: z.string().min(1).max(500),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) })).max(20).optional(),
  sessionId: z.string().min(8).max(64).optional(),
});

// POST /api/chat — Ask FutureTry.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }
  const { message, history = [], sessionId } = parsed.data;

  try {
    const reply = await askFutureTry(message, history, sessionId);

    if (dbEnabled && sessionId) {
      try {
        await prisma.chatMessage.createMany({
          data: [
            { userId: sessionId, role: "user", content: message },
            { userId: sessionId, role: "assistant", content: reply.content, sources: reply.sources as unknown as object[] },
          ],
        });
      } catch (e) {
        console.error("Chat log DB gagal (tidak menghentikan jawaban):", e instanceof Error ? e.message : e);
      }
    }

    return NextResponse.json(reply);
  } catch (e) {
    console.error("Chat error:", e);
    return NextResponse.json({ error: "Maaf, asisten sedang sibuk. Coba lagi sebentar." }, { status: 500 });
  }
}
