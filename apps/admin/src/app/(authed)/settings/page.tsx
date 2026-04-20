import Breadcrumbs from "@/components/Breadcrumbs";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="max-w-2xl">
      <Breadcrumbs items={[{ label: "TOP", href: "/home" }, { label: "設定" }]} />
      <h1 className="text-2xl font-bold mb-6">設定</h1>

      <section className="bg-white border border-gray-200 rounded p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-600 mb-4">■ アカウント情報</h2>
        <dl className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
          <dt className="text-gray-500">表示名</dt>
          <dd>{user?.name ?? "—"}</dd>
          <dt className="text-gray-500">メールアドレス</dt>
          <dd>{user?.email ?? "—"}</dd>
        </dl>
      </section>

      <section className="bg-white border border-dashed border-gray-300 rounded p-6">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">
          ■ 文字数プリセット / CSV既定項目
        </h2>
        <p className="text-sm text-gray-500">
          MS3 (テンプレート・CSV取込) 実装後に編集可能になります。
        </p>
      </section>
    </div>
  );
}
