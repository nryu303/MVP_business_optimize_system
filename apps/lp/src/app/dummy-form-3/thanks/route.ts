import { logDummySubmission } from "@/lib/dummy-log";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await logDummySubmission("form-3", req);
  return new Response(
    `<!DOCTYPE html><html><head><title>送信完了</title><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:40px">
<h1>お問い合わせを受け付けました</h1>
<p>ご送信いただいた内容を確認させていただきます。送信完了。</p>
<p style="color:#888;font-size:12px;margin-top:40px">
(受信内容は <a href="/dummy-log">受信ログ画面</a> から確認できます)
</p></body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
