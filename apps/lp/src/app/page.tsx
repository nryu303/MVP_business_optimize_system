import Link from "next/link";

export default function LPHome() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Hero />
      <Features />
      <Flow />
      <Scope />
      <DevLinks />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#1f2a34] to-[#2b3a48] text-white">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <div className="text-xs tracking-widest text-blue-200 mb-3">
          SALES STUDIO / 営業支援システム MVP
        </div>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-5">
          お問い合わせフォーム<br className="md:hidden" />自動送信基盤
        </h1>
        <p className="text-gray-200 text-lg md:text-xl max-w-2xl">
          自社保有・長期運用型。MIKOMERU の運用像を最小コストで再現。
          案件管理 / CSV リスト取込 / テンプレート管理 / 自動送信 / 配信結果可視化 まで、
          6 マイルストーンで一貫実装。
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href="http://localhost:3002/login"
            className="px-5 py-2.5 rounded bg-white text-[#1f2a34] font-semibold hover:bg-gray-100"
          >
            管理画面を開く
          </a>
          <Link
            href="/dummy-log"
            className="px-5 py-2.5 rounded border border-white/40 text-white hover:bg-white/10"
          >
            ダミーフォーム受信ログ
          </Link>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      title: "案件管理",
      body: "スポンサー・期間・ジャンル・ステータスで営業活動を整理。複製・論理削除対応。",
    },
    {
      title: "CSV リスト取込",
      body: "UTF-8 / Shift_JIS 自動判定。重複排除 + ブラックリスト突合 + キーワード自動検出。",
    },
    {
      title: "テンプレート管理",
      body: "送信文章 (変数 {{会社名}} / {{担当者名}}) + 送信元プロファイルの両軸で再利用。",
    },
    {
      title: "一般フォーム自動送信",
      body: "Playwright によるルールベース検出 + 入力 + 送信 + 成功判定。リトライ最大 2 回。",
    },
    {
      title: "キュー管理",
      body: "pg-boss + PostgreSQL。pending / running / done / failed + 一時停止 / 再開 / キャンセル。",
    },
    {
      title: "配信結果・ダッシュボード",
      body: "エラー種別 5 分類。案件別 / 日次グラフ。CSV エクスポートで外部集計連携。",
    },
  ];
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-xl md:text-2xl font-bold mb-8">主要機能</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((i) => (
          <div
            key={i.title}
            className="rounded border border-gray-200 p-5 bg-white hover:shadow transition"
          >
            <h3 className="font-semibold mb-2">{i.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{i.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Flow() {
  const steps = [
    { n: "1", t: "リスト取込", d: "CSV 取込 → 重複 / BL 除外 → リスト作成" },
    { n: "2", t: "テンプレ作成", d: "送信文章 + 送信元プロファイルを登録" },
    { n: "3", t: "案件紐付け", d: "案件にリスト / テンプレを紐付け" },
    { n: "4", t: "ジョブ承認", d: "ウィザードで確認 → 承認実行" },
    { n: "5", t: "自動送信", d: "worker が Playwright でフォーム送信 (BL 事前除外)" },
    { n: "6", t: "結果確認", d: "ダッシュボード / 一覧 / CSV 出力で把握" },
  ];
  return (
    <section className="bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xl md:text-2xl font-bold mb-8">運用フロー</h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded border border-gray-200 bg-white p-5">
              <div className="text-xs text-[#1e5ab4] font-bold tracking-widest mb-1">
                STEP {s.n}
              </div>
              <div className="font-semibold mb-1">{s.t}</div>
              <div className="text-sm text-gray-600">{s.d}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Scope() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-xl md:text-2xl font-bold mb-4">本 MVP のスコープ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
        <div className="rounded border border-gray-200 p-5 bg-white">
          <h3 className="font-semibold mb-3 text-green-700">✓ 含まれるもの</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>認証・案件管理 (MS2)</li>
            <li>CSV取込 / リスト / テンプレート (MS3)</li>
            <li>汎用フォーム自動送信・キュー (MS4)</li>
            <li>配信結果 / 基本ダッシュボード (MS5)</li>
            <li>セットアップ手順書・操作マニュアル (MS6)</li>
          </ul>
        </div>
        <div className="rounded border border-gray-200 p-5 bg-white">
          <h3 className="font-semibold mb-3 text-gray-500">— 含まれないもの (別契約 / 別見積)</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-500">
            <li>CAPTCHA 完全対応・高度な到達率最適化</li>
            <li>AI 自動リスト取得 (form_url は手動収集前提)</li>
            <li>複数ユーザ / 権限分離 (単一管理者運用)</li>
            <li>継続保守・機能拡張 (MS6 納品時点までの重大不具合対応のみ無償)</li>
          </ul>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        ※ 対象サイトの仕様・入力制限・セキュリティ設定により送信可否・成功率は変動します (目安 80〜85%、保証なし)。
      </p>
    </section>
  );
}

function DevLinks() {
  return (
    <section className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">開発・検証リンク</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <DevLink href="/dummy-form-1" label="ダミーフォーム #1 (標準)" />
          <DevLink href="/dummy-form-2" label="ダミーフォーム #2 (placeholder)" />
          <DevLink href="/dummy-form-3" label="ダミーフォーム #3 (日本語name)" />
          <DevLink href="/dummy-log" label="受信ログ閲覧" />
        </div>
      </div>
    </section>
  );
}

function DevLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
    >
      {label}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-500">
      © 2026 営業支援システム MVP — Lancers 経由納品 (MS1〜MS6 / 計 50 万円)
    </footer>
  );
}
