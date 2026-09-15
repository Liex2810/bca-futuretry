import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { missionById } from "@/lib/content/missions";
import { dbEnabled, prisma } from "@/lib/db";

const schema = z.object({
  missionId: z.string().min(1),
  choices: z.array(z.object({
    stepId: z.string(),
    choiceId: z.string(),
  })).min(1),
  reflection: z.object({
    enjoyed: z.array(z.string()).max(10),
    challenged: z.array(z.string()).max(10),
    nextTry: z.string().max(200),
    note: z.string().max(1000).optional(),
  }).optional(),
  // sesi demo tanpa login: id acak dari client utk sinkronisasi opsional
  sessionId: z.string().min(8).max(64).optional(),
});

// POST /api/mission/complete — validasi + simpan (DB bila tersedia).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload tidak valid", details: parsed.error.flatten() }, { status: 400 });
  }
  const { missionId, choices, reflection, sessionId } = parsed.data;

  const mission = missionById(missionId);
  if (!mission) {
    return NextResponse.json({ error: "Mission tidak ditemukan" }, { status: 404 });
  }

  if (choices.length !== mission.steps.length || new Set(choices.map((p) => p.stepId)).size !== mission.steps.length) {
    return NextResponse.json({ error: "Semua langkah misi harus dijawab tepat satu kali" }, { status: 400 });
  }
  // Validasi setiap pilihan benar-benar ada di mission tsb (anti-rewriting).
  for (const pick of choices) {
    const step = mission.steps.find((s) => s.id === pick.stepId);
    if (!step || !step.choices.some((c) => c.id === pick.choiceId)) {
      return NextResponse.json({ error: `Pilihan ${pick.choiceId} tidak valid untuk langkah ${pick.stepId}` }, { status: 400 });
    }
  }

  let saved = false;
  if (dbEnabled && sessionId) {
    try {
      saved = await prisma.$transaction(async (tx: import("@prisma/client").Prisma.TransactionClient) => {
        const user = sessionId
          ? await tx.user.upsert({ where: { id: sessionId }, update: {}, create: { id: sessionId } })
          : null;
        const m = await tx.mission.findUnique({ where: { slug: missionId } });
        if (user && m) {
          const previous = await tx.userMissionProgress.findUnique({ where: { userId: user.id } });
          const completed = Array.isArray(previous?.completedMissions) ? previous.completedMissions.filter((id): id is string => typeof id === "string") : [];
          await tx.userMissionProgress.upsert({
            where: { userId: user.id },
            update: { completedMissions: Array.from(new Set([...completed, missionId])) },
            create: { userId: user.id, missionId: m.id, completedMissions: [missionId] as unknown as object[], unlocked: [] as unknown as object[] },
          });
        }
        if (user && reflection && m) {
          await tx.reflection.create({
            data: { userId: user.id, missionId: m.id, enjoyed: reflection.enjoyed as unknown as object[], challenged: reflection.challenged as unknown as object[], nextTry: reflection.nextTry, note: reflection.note },
          });
        }
        return Boolean(user && m);
      });
    } catch (e) {
      // DB error tidak boleh menghancurkan demo — log & tetap balas OK (client sudah simpan lokal).
      console.error("DB write failed (mode demo lanjut):", e instanceof Error ? e.message : e);
    }
  }

  return NextResponse.json({ ok: true, missionId, saved });
}
