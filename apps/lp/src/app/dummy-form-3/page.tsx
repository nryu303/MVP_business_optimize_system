export default function DummyForm3() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-2">お問い合わせフォーム (タイプ3)</h1>
        <p className="text-sm text-gray-500 mb-6">
          母語 name 属性 (国産CMSで多いパターン)
        </p>
        <form method="POST" action="/dummy-form-3/thanks" className="space-y-4 bg-gray-50 p-6 rounded border border-gray-200">
          <div>
            <label className="block text-sm mb-1">会社名</label>
            <input name="会社名" required className="w-full border border-gray-300 rounded px-3 py-1.5" />
          </div>
          <div>
            <label className="block text-sm mb-1">氏名</label>
            <input name="氏名" required className="w-full border border-gray-300 rounded px-3 py-1.5" />
          </div>
          <div>
            <label className="block text-sm mb-1">メールアドレス</label>
            <input name="メールアドレス" type="email" required className="w-full border border-gray-300 rounded px-3 py-1.5" />
          </div>
          <div>
            <label className="block text-sm mb-1">電話番号</label>
            <input name="電話番号" className="w-full border border-gray-300 rounded px-3 py-1.5" />
          </div>
          <div>
            <label className="block text-sm mb-1">ご質問・ご相談内容</label>
            <textarea name="お問い合わせ内容" rows={6} required className="w-full border border-gray-300 rounded px-3 py-1.5" />
          </div>
          <button type="submit" className="px-6 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">確認画面へ進む</button>
        </form>
      </div>
    </main>
  );
}
