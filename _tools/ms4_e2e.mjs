import pkg from "../packages/db/generated/prisma/index.js";
import PgBoss from "pg-boss";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  console.log("--- MS4 E2E smoke ---");

  const user = await prisma.user.findFirst();
  if (!user) throw new Error("no admin user; run npm run db:seed");

  const existing = await prisma.list.findFirst({ where: { name: "MS4_E2E_List" } });
  if (existing) {
    await prisma.list.delete({ where: { id: existing.id } });
    console.log("[cleanup] removed prior MS4_E2E_List");
  }

  const list = await prisma.list.create({
    data: {
      name: "MS4_E2E_List",
      description: "MS4疎通確認用 (ダミーフォーム × 3)",
      companies: {
        create: [
          { name: "ダミー1社 (標準フォーム)", formUrl: "http://localhost:3001/dummy-form-1" },
          { name: "ダミー2社 (placeholder)", formUrl: "http://localhost:3001/dummy-form-2" },
          { name: "ダミー3社 (日本語name)", formUrl: "http://localhost:3001/dummy-form-3" },
        ],
      },
    },
    include: { companies: true },
  });
  console.log(`[seed] list ${list.id} with ${list.companies.length} companies`);

  const msg = await prisma.messageTemplate.create({
    data: {
      name: "MS4_E2E_MessageTemplate",
      subject: "【MS4疎通】{{会社名}} 様へ",
      body: "{{会社名}} 御中\n{{担当者名}}\n\n本メッセージは MS4 疎通確認です。",
    },
  });
  const sender = await prisma.senderTemplate.create({
    data: {
      name: "MS4_E2E_SenderTemplate",
      companyName: "株式会社サンプル (テスト)",
      personName: "山田 太郎",
      email: "test@example.com",
      phone: "03-1234-5678",
    },
  });

  const c = await prisma.case.findFirst({ where: { ownerId: user.id } });
  if (!c) throw new Error("no case; create one in admin first");

  const job = await prisma.deliveryJob.create({
    data: {
      caseId: c.id,
      listId: list.id,
      messageTemplateId: msg.id,
      senderTemplateId: sender.id,
      status: "PENDING",
      plannedCount: list.companies.length,
      note: "MS4 E2E smoke",
    },
  });
  console.log(`[seed] job ${job.id}`);

  const boss = new PgBoss({ connectionString: process.env.DATABASE_URL, schema: "pgboss" });
  await boss.start();
  await boss.createQueue("delivery");
  await boss.send("delivery", { jobId: job.id });
  console.log(`[enqueue] job ${job.id} sent to queue`);
  await boss.stop({ graceful: false });

  // poll job completion
  console.log("--- polling job status (timeout 180s) ---");
  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    const j = await prisma.deliveryJob.findUnique({ where: { id: job.id } });
    if (!j) break;
    console.log(
      `  [${new Date().toISOString().slice(11, 19)}] status=${j.status} ` +
        `planned=${j.plannedCount} ok=${j.successCount} ng=${j.failedCount} skip=${j.skippedCount}`,
    );
    if (["DONE", "FAILED", "CANCELLED"].includes(j.status)) break;
    await new Promise((r) => setTimeout(r, 5000));
  }

  const results = await prisma.deliveryResult.findMany({
    where: { jobId: job.id },
    include: { company: true },
  });
  console.log("\n=== RESULTS ===");
  for (const r of results) {
    console.log(
      `  ${r.company.name.padEnd(30)} ${r.status.padEnd(8)} ${r.errorType ?? ""} ${r.errorMessage ?? ""}`,
    );
  }

  await prisma.$disconnect();
  console.log("--- done ---");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
