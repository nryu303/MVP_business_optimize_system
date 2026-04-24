/**
 * MS6 通しシナリオ疎通テスト (DB + queue + worker)
 * 案件作成 → 送信元テンプレ → 文章テンプレ → リスト作成(3社) → ジョブ作成・enqueue
 *   → worker 処理完了待ち → 結果検証
 *
 * 前提: npm run dev で admin/lp/worker が起動中。
 * 使い方: npx dotenv -e .env -- node _tools/ms6_e2e.mjs
 */
import prismaPkg from "../packages/db/generated/prisma/index.js";
import PgBoss from "pg-boss";

const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

const PREFIX = "MS6_E2E_";

async function cleanup() {
  // delete prior MS6_E2E_* rows (idempotent run)
  await prisma.deliveryJob.deleteMany({
    where: { note: { startsWith: "MS6 E2E" } },
  });
  await prisma.list.deleteMany({ where: { name: { startsWith: PREFIX } } });
  await prisma.messageTemplate.deleteMany({ where: { name: { startsWith: PREFIX } } });
  await prisma.senderTemplate.deleteMany({ where: { name: { startsWith: PREFIX } } });
  await prisma.case.deleteMany({ where: { name: { startsWith: PREFIX } } });
}

async function main() {
  console.log("=== MS6 通しシナリオ疎通 ===");

  const admin = await prisma.user.findFirst();
  if (!admin) throw new Error("admin user not found; run npm run db:seed");

  await cleanup();

  // 1. 案件作成
  const caseRow = await prisma.case.create({
    data: {
      name: `${PREFIX}サンプル案件`,
      sponsor: "サンプルスポンサー",
      genre: "テスト",
      status: "PREPARING",
      ownerId: admin.id,
    },
  });
  console.log(`✓ 案件作成: ${caseRow.id}`);

  // 2. 送信元テンプレート
  const sender = await prisma.senderTemplate.create({
    data: {
      name: `${PREFIX}送信元`,
      companyName: "株式会社テスト",
      personName: "通し太郎",
      email: "toshi@example.com",
      phone: "03-0000-0000",
    },
  });
  console.log(`✓ 送信元テンプレ作成: ${sender.id}`);

  // 3. 送信文章テンプレ
  const msgTmpl = await prisma.messageTemplate.create({
    data: {
      name: `${PREFIX}文章`,
      subject: "【MS6疎通】{{会社名}} 様へ",
      body: "{{会社名}} 御中\n{{担当者名}}\n\n通しシナリオ確認用のメッセージです。",
    },
  });
  console.log(`✓ 送信文章テンプレ作成: ${msgTmpl.id}`);

  // 4. リスト(3社=ダミーフォーム3種)
  const list = await prisma.list.create({
    data: {
      name: `${PREFIX}リスト`,
      companies: {
        create: [
          { name: "E2E社1", formUrl: "http://localhost:3001/dummy-form-1" },
          { name: "E2E社2", formUrl: "http://localhost:3001/dummy-form-2" },
          { name: "E2E社3", formUrl: "http://localhost:3001/dummy-form-3" },
        ],
      },
    },
    include: { companies: true },
  });
  console.log(`✓ リスト作成: ${list.id} (${list.companies.length}社)`);

  // 5. 案件紐付け
  await prisma.caseList.create({ data: { caseId: caseRow.id, listId: list.id } });
  await prisma.caseTemplate.create({
    data: {
      caseId: caseRow.id,
      messageTemplateId: msgTmpl.id,
      senderTemplateId: sender.id,
    },
  });
  console.log(`✓ 案件紐付け完了`);

  // 6. 送信ジョブ作成
  const job = await prisma.deliveryJob.create({
    data: {
      caseId: caseRow.id,
      listId: list.id,
      messageTemplateId: msgTmpl.id,
      senderTemplateId: sender.id,
      status: "PENDING",
      plannedCount: list.companies.length,
      note: "MS6 E2E",
    },
  });
  console.log(`✓ ジョブ作成: ${job.id}`);

  // 7. enqueue (admin 側と同じ経路)
  const boss = new PgBoss({ connectionString: process.env.DATABASE_URL, schema: "pgboss" });
  await boss.start();
  await boss.createQueue("delivery");
  await boss.send("delivery", { jobId: job.id });
  await boss.stop({ graceful: false });
  console.log(`✓ キューに登録`);

  // 8. 完了待ち
  console.log("--- worker 処理を監視中 (最大 180 秒) ---");
  const deadline = Date.now() + 180_000;
  let finalJob = null;
  while (Date.now() < deadline) {
    const j = await prisma.deliveryJob.findUnique({ where: { id: job.id } });
    if (!j) break;
    process.stdout.write(
      `\r  [${new Date().toISOString().slice(11, 19)}] ${j.status} ` +
        `ok=${j.successCount} ng=${j.failedCount} skip=${j.skippedCount}      `,
    );
    if (["DONE", "FAILED", "CANCELLED"].includes(j.status)) {
      finalJob = j;
      break;
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  console.log("");
  if (!finalJob) throw new Error("タイムアウト — worker が動作していません");

  // 9. 結果検証
  const results = await prisma.deliveryResult.findMany({
    where: { jobId: job.id },
    include: { company: true },
  });
  console.log("\n=== 結果 ===");
  for (const r of results) {
    const icon =
      r.status === "SUCCESS" ? "✓" : r.status === "FAILED" ? "✗" : "-";
    console.log(
      `  ${icon} ${r.company.name.padEnd(10)} ${r.status.padEnd(8)} ${r.errorType ?? ""} ${r.errorMessage ?? ""}`,
    );
  }
  const ok = results.filter((r) => r.status === "SUCCESS").length;
  const rate = ok / results.length;
  console.log(`\n成功率: ${Math.round(rate * 1000) / 10}% (${ok}/${results.length})`);

  if (rate < 0.8) {
    console.log("\n⚠  MS6 承認条件 (成功率 > 80%) を満たしていません");
    process.exit(1);
  } else {
    console.log("\n✅ MS6 通し疎通 OK (成功率 > 80%)");
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
