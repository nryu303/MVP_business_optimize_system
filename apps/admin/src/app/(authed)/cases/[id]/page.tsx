import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { prisma } from "@/lib/db";
import { STATUS_BADGE, STATUS_LABEL } from "@/lib/case-status";
import CaseForm from "../CaseForm";
import { updateCaseAction, deleteCaseAction, duplicateCaseAction } from "../actions";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function CaseDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const c = await prisma.case.findUnique({ where: { id } });
  if (!c) notFound();

  const bound = updateCaseAction.bind(null, id);
  const del = deleteCaseAction.bind(null, id);
  const dup = duplicateCaseAction.bind(null, id);

  return (
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "TOP", href: "/home" },
          { label: "案件一覧", href: "/cases" },
          { label: c.name },
        ]}
      />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">{c.name}</h1>
          <div className="mt-1 text-sm text-gray-500 flex items-center gap-3">
            <span className={`inline-block text-xs px-2 py-0.5 rounded ${STATUS_BADGE[c.status]}`}>
              {STATUS_LABEL[c.status]}
            </span>
            <span>作成 {c.createdAt.toISOString().slice(0, 10)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <form action={dup}>
            <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm">
              複製
            </button>
          </form>
          <form
            action={del}
            onSubmit={(e) => {
              if (!confirm("この案件を削除します。よろしいですか？")) e.preventDefault();
            }}
          >
            <button className="px-3 py-1.5 border border-red-300 text-red-700 rounded hover:bg-red-50 text-sm">
              削除
            </button>
          </form>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">■ 基本情報 (編集)</h2>
        <CaseForm action={bound} initial={c} submitLabel="更新" />
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">■ 紐付けリスト</h2>
        <div className="bg-white rounded border border-dashed border-gray-300 p-5 text-sm text-gray-500">
          MS3 (リスト機能) 実装後に有効化されます。
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">■ 紐付けテンプレート</h2>
        <div className="bg-white rounded border border-dashed border-gray-300 p-5 text-sm text-gray-500">
          MS3 (テンプレート機能) 実装後に有効化されます。
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-2">■ 配信結果サマリ</h2>
        <div className="bg-white rounded border border-dashed border-gray-300 p-5 text-sm text-gray-500">
          MS5 (配信結果) 実装後に有効化されます。
        </div>
      </section>
    </div>
  );
}
