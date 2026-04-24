export default function DummyForm2() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-2">お問い合わせフォーム (タイプ2)</h1>
        <p className="text-sm text-gray-500 mb-6">
          placeholder ベース (ラベルなし)
        </p>
        <form method="POST" action="/dummy-form-2/thanks" className="space-y-4 bg-gray-50 p-6 rounded border border-gray-200">
          <input name="f1" placeholder="会社名" required className="w-full border border-gray-300 rounded px-3 py-2" />
          <input name="f2" placeholder="お名前" required className="w-full border border-gray-300 rounded px-3 py-2" />
          <input name="f3" type="email" placeholder="email@example.com" required className="w-full border border-gray-300 rounded px-3 py-2" />
          <input name="f4" placeholder="電話番号 (任意)" className="w-full border border-gray-300 rounded px-3 py-2" />
          <textarea name="f5" rows={6} placeholder="お問い合わせ内容をご記入ください" required className="w-full border border-gray-300 rounded px-3 py-2" />
          <button type="submit" className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700">送信する</button>
        </form>
      </div>
    </main>
  );
}
