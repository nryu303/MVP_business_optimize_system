import Link from "next/link";
import { readLog } from "@/lib/dummy-log";
import { clearLogAction } from "./actions";

export const dynamic = "force-dynamic";

const FORM_LABEL: Record<string, string> = {
  "form-1": "標準フォーム (label+name)",
  "form-2": "placeholder フォーム",
  "form-3": "母語 name フォーム",
};

export default async function DummyLogPage({
  searchParams,
}: {
  searchParams: Promise<{ form?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.form ?? "";
  const all = await readLog();
  const entries = filter ? all.filter((e) => e.formId === filter) : all;
  entries.reverse();

  const counts: Record<string, number> = {};
  for (const e of all) counts[e.formId] = (counts[e.formId] ?? 0) + 1;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <nav className="text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-gray-700">
            LP ホーム
          </Link>
          <span className="mx-2">/</span>
          <span>ダミーフォーム受信ログ</span>
        </nav>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">ダミーフォーム受信ログ</h1>
            <p className="text-sm text-gray-600 mt-1">
              admin の自動送信ジョブが localhost:3001 のダミーフォームに送った内容の履歴です。
              新しい順 / 全 {all.length} 件。
            </p>
          </div>
          <form action={clearLogAction}>
            <button className="px-3 py-1.5 border border-red-300 text-red-700 rounded hover:bg-red-50 text-sm">
              ログ全消去
            </button>
          </form>
        </div>

        <div className="flex gap-2 mb-4 text-sm flex-wrap">
          <FilterLink href="/dummy-log" active={!filter} label={`すべて (${all.length})`} />
          {(["form-1", "form-2", "form-3"] as const).map((f) => (
            <FilterLink
              key={f}
              href={`/dummy-log?form=${f}`}
              active={filter === f}
              label={`${FORM_LABEL[f]} (${counts[f] ?? 0})`}
            />
          ))}
        </div>

        {entries.length === 0 && (
          <div className="bg-white rounded border border-gray-200 p-10 text-center text-gray-500 text-sm">
            受信履歴がまだありません。admin から送信ジョブを実行するとここに記録されます。
          </div>
        )}

        <div className="space-y-3">
          {entries.map((e, i) => (
            <article
              key={i}
              className="bg-white rounded border border-gray-200 overflow-hidden"
            >
              <header className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-gray-500">
                    {new Date(e.timestamp).toLocaleString("ja-JP", { hour12: false })}
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {FORM_LABEL[e.formId] ?? e.formId}
                  </span>
                </div>
                <div className="text-gray-400 font-mono truncate max-w-md">
                  {e.userAgent ?? "—"}
                </div>
              </header>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(e.data).map(([k, v]) => (
                    <tr key={k} className="border-t border-gray-100">
                      <th className="text-left px-4 py-1.5 font-medium text-gray-500 w-48 align-top">
                        {k}
                      </th>
                      <td className="px-4 py-1.5 whitespace-pre-wrap break-words">
                        {v || <span className="text-gray-300">（空）</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function FilterLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1 rounded border text-xs ${
        active
          ? "bg-[#1e5ab4] text-white border-[#1e5ab4]"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );
}
