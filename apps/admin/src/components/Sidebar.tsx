"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; disabled?: boolean };
type Group = { title?: string; items: Item[] };

const groups: Group[] = [
  {
    items: [
      { href: "/home", label: "ホーム" },
      { href: "/cases", label: "案件" },
    ],
  },
  {
    title: "フォーム送信",
    items: [
      { href: "/send", label: "自動送信", disabled: true },
      { href: "/send/log", label: "自動送信ログ", disabled: true },
      { href: "/templates/message", label: "送信文章テンプレート", disabled: true },
      { href: "/templates/sender", label: "送信元テンプレート", disabled: true },
      { href: "/exclusions", label: "送信除外設定", disabled: true },
    ],
  },
  {
    title: "会社情報",
    items: [
      { href: "/lists/import", label: "リスト取込", disabled: true },
      { href: "/lists", label: "保存済みリスト", disabled: true },
    ],
  },
  {
    title: "その他",
    items: [{ href: "/settings", label: "設定" }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-[#1f2a34] text-gray-100 min-h-screen flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-white/10">
        <span className="text-xl font-bold tracking-widest">MIKOMERU MVP</span>
      </div>

      <nav className="flex-1 py-4 text-sm">
        {groups.map((g, gi) => (
          <div key={gi} className="mb-4">
            {g.title && (
              <div className="px-5 py-2 text-[11px] uppercase tracking-widest text-gray-400">
                {g.title}
              </div>
            )}
            <ul>
              {g.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const base = "block px-5 py-2.5 transition-colors";
                if (item.disabled) {
                  return (
                    <li key={item.href}>
                      <span
                        className={`${base} text-gray-500 cursor-not-allowed flex items-center justify-between`}
                        aria-disabled="true"
                        title="MS3以降で実装予定"
                      >
                        {item.label}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">
                          予定
                        </span>
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${base} ${
                        active
                          ? "bg-[#2b3a48] text-white border-l-4 border-[#1e5ab4]"
                          : "text-gray-200 hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 text-[11px] text-gray-500 border-t border-white/10">
        © 2026 営業支援システム MVP
      </div>
    </aside>
  );
}
