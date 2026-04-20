export default function LPHome() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-4">営業支援システム MVP</h1>
        <p className="text-gray-600 mb-8 text-lg">
          お問い合わせフォーム自動送信基盤 — 自社保有・長期運用型。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Feature title="案件管理" body="スポンサー・期間・ジャンル別に営業活動を整理。" />
          <Feature title="CSVリスト取込" body="既存リストをそのまま活用。重複・営業お断りを自動除外。" />
          <Feature title="一般フォーム自動送信" body="ヘッドレスブラウザによる非同期キュー処理。" />
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded p-6 text-sm text-gray-500">
          ※ LP (:3001) はマイルストーン6で詳細実装予定の構成確認用ページです。
        </div>
      </section>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-gray-200 rounded p-5">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{body}</p>
    </div>
  );
}
