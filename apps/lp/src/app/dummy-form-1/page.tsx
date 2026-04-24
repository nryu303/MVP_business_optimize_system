export default function DummyForm1() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-2">お問い合わせフォーム (タイプ1)</h1>
        <p className="text-sm text-gray-500 mb-6">
          ラベル + name 属性ベース (最も一般的)
        </p>
        <form method="POST" action="/dummy-form-1/thanks" className="space-y-4 bg-gray-50 p-6 rounded border border-gray-200">
          <div>
            <label htmlFor="company" className="block text-sm mb-1">会社名 <span className="text-red-600">*</span></label>
            <input id="company" name="company" required className="w-full border border-gray-300 rounded px-3 py-1.5" />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm mb-1">ご担当者氏名 <span className="text-red-600">*</span></label>
            <input id="name" name="name" required className="w-full border border-gray-300 rounded px-3 py-1.5" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm mb-1">メールアドレス <span className="text-red-600">*</span></label>
            <input id="email" name="email" type="email" required className="w-full border border-gray-300 rounded px-3 py-1.5" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm mb-1">電話番号</label>
            <input id="phone" name="phone" className="w-full border border-gray-300 rounded px-3 py-1.5" />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm mb-1">件名</label>
            <input id="subject" name="subject" className="w-full border border-gray-300 rounded px-3 py-1.5" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm mb-1">お問い合わせ内容 <span className="text-red-600">*</span></label>
            <textarea id="message" name="message" rows={6} required className="w-full border border-gray-300 rounded px-3 py-1.5" />
          </div>
          <button type="submit" className="px-6 py-2 rounded bg-[#1e5ab4] text-white hover:bg-[#17498f]">送信</button>
        </form>
      </div>
    </main>
  );
}
