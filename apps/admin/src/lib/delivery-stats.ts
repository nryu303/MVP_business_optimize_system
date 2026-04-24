import type { DeliveryErrorType, DeliveryResultStatus } from "@mvp/db";
import { prisma } from "./db";

/**
 * 配信結果の 5 分類 (xlsx MS2反映 D-3)
 * 成功 / 失敗 / 営業拒否 / フォームなし / キャンセル
 * (キャンセルは DeliveryJob レベル。ここでは DeliveryResult レベルの 4 分類 + extra)
 */
export type ResultBucket = "SUCCESS" | "FAILED" | "REJECTED" | "FORM_MISSING" | "CANCELLED";

export const BUCKET_LABEL: Record<ResultBucket, string> = {
  SUCCESS: "成功",
  FAILED: "失敗",
  REJECTED: "営業拒否",
  FORM_MISSING: "フォームなし",
  CANCELLED: "キャンセル",
};

export const BUCKET_BADGE: Record<ResultBucket, string> = {
  SUCCESS: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REJECTED: "bg-orange-100 text-orange-700",
  FORM_MISSING: "bg-purple-100 text-purple-700",
  CANCELLED: "bg-gray-200 text-gray-600",
};

export function bucketOf(
  status: DeliveryResultStatus,
  errorType: DeliveryErrorType | null,
): ResultBucket {
  if (status === "SUCCESS") return "SUCCESS";
  if (status === "SKIPPED" && errorType === "BLACKLISTED") return "REJECTED";
  if (status === "FAILED" && (errorType === "FORM_NOT_FOUND" || errorType === "FIELD_MISMATCH"))
    return "FORM_MISSING";
  if (status === "FAILED") return "FAILED";
  // PENDING / RUNNING / SKIPPED (non-BL) — treat as pending/other
  return "FAILED";
}

export type DashboardKpi = {
  sentToday: number;
  successToday: number;
  failedToday: number;
  successRateToday: number | null; // 0-1
  sentThisMonth: number;
  successRateThisMonth: number | null;
  runningCases: number;
  newCasesThisMonth: number;
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDashboardKpi(): Promise<DashboardKpi> {
  const today = startOfToday();
  const month = startOfMonth();

  const [todayResults, monthResults, running, newCases] = await Promise.all([
    prisma.deliveryResult.groupBy({
      by: ["status"],
      where: { attemptedAt: { gte: today } },
      _count: true,
    }),
    prisma.deliveryResult.groupBy({
      by: ["status"],
      where: { attemptedAt: { gte: month } },
      _count: true,
    }),
    prisma.case.count({ where: { status: "RUNNING" } }),
    prisma.case.count({ where: { createdAt: { gte: month } } }),
  ]);

  const tot = (arr: typeof todayResults) =>
    arr.reduce((s, r) => s + r._count, 0);
  const ok = (arr: typeof todayResults) =>
    arr.find((r) => r.status === "SUCCESS")?._count ?? 0;
  const ng = (arr: typeof todayResults) =>
    arr.find((r) => r.status === "FAILED")?._count ?? 0;

  const sentToday = tot(todayResults);
  const sentThisMonth = tot(monthResults);

  const successToday = ok(todayResults);
  const failedToday = ng(todayResults);

  return {
    sentToday,
    successToday,
    failedToday,
    successRateToday: sentToday > 0 ? successToday / sentToday : null,
    sentThisMonth,
    successRateThisMonth:
      sentThisMonth > 0 ? ok(monthResults) / sentThisMonth : null,
    runningCases: running,
    newCasesThisMonth: newCases,
  };
}

export type DailyPoint = { date: string; success: number; failed: number; skipped: number };

export async function getDailySeries(days = 14): Promise<DailyPoint[]> {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  from.setDate(from.getDate() - (days - 1));

  const rows = await prisma.$queryRaw<
    { d: Date; status: DeliveryResultStatus; count: bigint }[]
  >`
    SELECT date_trunc('day', "attempted_at") AS d,
           "status",
           COUNT(*)::bigint AS count
    FROM "delivery_results"
    WHERE "attempted_at" >= ${from}
    GROUP BY d, "status"
    ORDER BY d ASC
  `;

  const map = new Map<string, DailyPoint>();
  for (let i = 0; i < days; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, { date: key, success: 0, failed: 0, skipped: 0 });
  }
  for (const r of rows) {
    const key = r.d.toISOString().slice(0, 10);
    const entry = map.get(key);
    if (!entry) continue;
    const n = Number(r.count);
    if (r.status === "SUCCESS") entry.success += n;
    else if (r.status === "FAILED") entry.failed += n;
    else if (r.status === "SKIPPED") entry.skipped += n;
  }
  return Array.from(map.values());
}

export type CasePoint = {
  caseId: string;
  caseName: string;
  success: number;
  failed: number;
  skipped: number;
  total: number;
};

export async function getCaseSeries(limit = 8): Promise<CasePoint[]> {
  const jobs = await prisma.deliveryJob.findMany({
    include: { case: true },
  });
  const byCaseId = new Map<string, CasePoint>();
  for (const j of jobs) {
    const existing = byCaseId.get(j.caseId) ?? {
      caseId: j.caseId,
      caseName: j.case.name,
      success: 0,
      failed: 0,
      skipped: 0,
      total: 0,
    };
    existing.success += j.successCount;
    existing.failed += j.failedCount;
    existing.skipped += j.skippedCount;
    existing.total += j.successCount + j.failedCount + j.skippedCount;
    byCaseId.set(j.caseId, existing);
  }
  return Array.from(byCaseId.values())
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export async function getLatestJobs(limit = 10) {
  return prisma.deliveryJob.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { case: true, list: true },
  });
}
