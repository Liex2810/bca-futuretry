// ════════════════════════════════════════════════════════════════
//  Seed database FutureTry.
//  Jalankan: npx prisma db seed  (butuh DATABASE_URL di .env)
//  Sumber data: file konten yang sama dipakai frontend (single source).
// ════════════════════════════════════════════════════════════════
import { PrismaClient } from "@prisma/client";
import { missions } from "../src/lib/content/missions";
import { stories } from "../src/lib/content/stories";
import { faqs, eligibilityRules, programInfo } from "../src/lib/content/futurepath";

const prisma = new PrismaClient();

async function main() {
  console.log("→ Seeding missions…");
  for (const m of missions) {
    await prisma.mission.upsert({
      where: { slug: m.id },
      update: {},
      create: {
        slug: m.id, title: m.title, program: m.program, district: m.district,
        role: m.role, duration: m.duration, summary: m.summary, intro: m.intro,
        steps: m.steps as object[], reflectionHints: m.reflectionHints as object,
      },
    });
    for (const step of m.steps) {
      for (const c of step.choices) {
        await prisma.missionChoice.upsert({
          where: { id: `${m.id}:${step.id}:${c.id}` },
          update: {},
          create: {
            id: `${m.id}:${step.id}:${c.id}`, missionSlug: m.id, stepId: step.id,
            choiceId: c.id, label: c.label, consequence: c.consequence, skills: c.skills as unknown as object[],
          },
        });
      }
    }
  }

  console.log("→ Seeding stories…");
  for (const s of stories) {
    await prisma.story.upsert({
      where: { slug: s.id },
      update: {},
      create: {
        slug: s.id, name: s.name, program: s.program, role: s.role, title: s.title,
        excerpt: s.excerpt, dayInLife: s.dayInLife as object[],
        expectationVsReality: s.expectationVsReality as object,
        hardestPart: s.hardestPart, favoriteMoment: s.favoriteMoment,
      },
    });
  }

  console.log("→ Seeding futurepath content…");
  let n = 0;
  for (const [prog, info] of Object.entries(programInfo)) {
    for (const item of info.learn) {
      await prisma.futurePathContent.create({
        data: { id: `learn-${prog}-${n++}`, kind: "learn", program: prog, title: item.title, body: item.body, source: item.source, tags: [] },
      });
    }
  }
  for (const f of faqs) {
    await prisma.futurePathContent.create({
      data: { id: f.id, kind: "faq", title: f.question, body: f.answer, source: f.source, tags: f.tags },
    });
  }
  for (const r of eligibilityRules) {
    await prisma.futurePathContent.create({
      data: { id: r.id, kind: "eligibility", program: r.program, title: r.requirement, body: r.explanation, source: r.source, tags: [] },
    });
  }

  console.log("✔ Seed selesai:", await prisma.mission.count(), "misi,", await prisma.story.count(), "cerita,", await prisma.futurePathContent.count(), "konten futurepath.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
