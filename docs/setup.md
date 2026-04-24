# セットアップ手順書

営業支援システム MVP のローカル環境構築と運用起動手順。

## 1. 前提ソフトウェア

| ソフト | バージョン | 備考 |
|---|---|---|
| Node.js | 22.x 以降 | https://nodejs.org/ |
| PostgreSQL | 17.x | Windows ネイティブインストーラで導入 |
| Git | 任意 | ソース取得 |
| Chrome | 最新版 | 動作確認対象 |

### PostgreSQL の確認
```powershell
# Windows: サービスが起動中か確認
Get-Service | Where-Object { $_.Name -like "*postgres*" }
# Status が Running ならOK
```

## 2. 初回セットアップ

### 2-1. リポジトリ取得 & 依存インストール
```bash
git clone <remote URL>
cd milestone1
npm install
```

### 2-2. .env の作成
```bash
cp .env.example .env
```
`.env` を編集:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/MVP_business_message?schema=public"
SESSION_SECRET="64文字以上のランダム文字列"
```

`SESSION_SECRET` 生成例:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### 2-3. データベース作成
```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost `
  -c "CREATE DATABASE \"MVP_business_message\";"
```

### 2-4. マイグレーション & 初期データ
```bash
npm run db:migrate
npm run db:seed    # → admin@example.com / admin1234 が作成される
```

### 2-5. Playwright (送信ワーカー用 Chromium) のインストール
```bash
npx playwright install chromium
```
※ 約 110MB ダウンロードされます (初回のみ)。

## 3. 開発サーバー起動

### 3-1. 全プロセス同時起動 (推奨)
```bash
npm run dev
```
3 プロセスが同時に起動し、ターミナルに色分けログが表示されます。

- **admin** (:3002) — 管理画面
- **lp** (:3001) — LP + ダミーフォーム + 受信ログ
- **worker** — 送信ワーカー (HTTP ポート無し、pg-boss で PostgreSQL 経由でジョブ受信)

### 3-2. 個別起動
```bash
npm run dev:admin    # :3002
npm run dev:lp       # :3001
npm run dev:worker   # worker (ポート無し)
```

## 4. アクセス

| URL | 用途 |
|---|---|
| http://localhost:3002/login | 管理画面ログイン (`admin@example.com` / `admin1234`) |
| http://localhost:3001 | LP (サービス紹介) |
| http://localhost:3001/dummy-form-1〜3 | ダミーフォーム (自動送信動作確認用) |
| http://localhost:3001/dummy-log | ダミーフォーム受信ログ |

## 5. よくあるトラブル

### P1002: advisory lock timeout
古い Prisma マイグレーションセッションが PostgreSQL 側で保持されています:
```powershell
$env:PGPASSWORD = "YOUR_PASSWORD"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -d MVP_business_message `
  -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='MVP_business_message' AND pid <> pg_backend_pid();"
```

### EADDRINUSE :3002 / :3001
既に別プロセスが同ポートを占有しています:
```powershell
netstat -ano | findstr ":3002"
taskkill /F /PID <PID>
```

### EPERM on query_engine DLL during migrate
Prisma Client DLL が admin/worker に使用中で再生成できません。
該当 dev サーバーを一度停止してから:
```bash
rm -f packages/db/generated/prisma/query_engine-windows.dll.node
npm run db:generate
```

### worker が「PrismaClient not exported」
ESM/CJS 相互運用の既知パターン。Prisma Client の再生成後、worker を再起動すれば解消。

## 6. 本番運用への移行ヒント (MVP 範囲外だが参考)

- **プロセス常駐**: PM2 / systemd / Docker でそれぞれのアプリを常駐化
- **セキュリティ**: admin の `SESSION_SECRET` と DB パスワードはランダム・環境変数経由
- **バックアップ**: `pg_dump MVP_business_message > backup.sql` を定期実行
- **ログ**: worker ターミナル出力は可観測性のために別途ファイル / ログ基盤へ転送
- **送信レート**: 大量送信前に `apps/worker/src/job-processor.ts` の `INTER_COMPANY_DELAY_MS` と 1 ジョブ上限 (`apps/admin/src/app/(authed)/send/actions.ts: MAX_COMPANIES = 50`) を調整

## 7. 停止

dev サーバーは各ターミナルで **Ctrl+C** で停止。
データを消したい場合:
```bash
npx dotenv -e .env -- npx prisma migrate reset --schema=packages/db/prisma/schema.prisma
```
(確認プロンプトで yes → DB をドロップ & 再マイグレーション & シード自動実行)
