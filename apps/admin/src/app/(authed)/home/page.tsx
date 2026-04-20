import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function HomePage() {
  const [totalCases, runningCases, newThisMonth] = await Promise.all([
    prisma.case.count(),
    prisma.case.count({ where: { status: "RUNNING" } }),
    prisma.case.count({ where: { createdAt: { gte: startOfMonth() } } }),
  ]);

  return (
    <div>
      <Breadcrumbs items={[{ label: "TOP", href: "/home" }, { label: "ホーム" }]} />
      <h1 className="text-2xl font-bold mb-6">今月の統計情報</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <KpiCard
          title="進行中の案件"
          value={runningCases}
          suffix="件"
          hint="ステータス: 配信中"
        />
        <KpiCard
          title="今月の送信数"
          value="—"
          suffix=""
          hint="MS5 (配信結果) で集計開始"
          pending
        />
        <KpiCard
          title="成功率"
          value="—"
          suffix=""
          hint="MS5 (配信結果) で集計開始"
          pending
        />
      </div>

      <div className="bg-white rounded border border-gray-200 p-5">
        <h2 className="text-base font-semibold mb-3">サマリー</h2>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <SummaryItem label="登録案件数 (全期間)" value={`${totalCases} 件`} />
          <SummaryItem label="今月新規登録案件" value={`${newThisMonth} 件`} />
          <SummaryItem label="配信ログ" value="MS5予定" muted />
          <SummaryItem label="CSV検索" value="スコープ外" muted />
        </dl>
        <div className="mt-5 flex gap-3 text-sm">
          <Link
            href="/cases"
            className="px-3 py-1.5 rounded bg-[#1e5ab4] text-white hover:bg-[#17498f]"
          >
            案件一覧へ
          </Link>
          <Link
            href="/cases/new"
            className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
          >
            新規案件登録
          </Link>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  suffix,
  hint,
  pending,
}: {
  title: string;
  value: number | string;
  suffix: string;
  hint?: string;
  pending?: boolean;
}) {
  return (
    <div
      className={`rounded border p-5 ${
        pending ? "bg-gray-50 border-dashed border-gray-300" : "bg-white border-gray-200"
      }`}
    >
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className="flex items-end gap-2">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {suffix && <div className="pb-1 text-gray-500">{suffix}</div>}
      </div>
      {hint && <div className="mt-2 text-[11px] text-gray-500">{hint}</div>}
    </div>
  );
}

function SummaryItem({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className={`mt-1 font-semibold ${muted ? "text-gray-400" : "text-gray-900"}`}>
        {value}
      </dd>
    </div>
  );
}
