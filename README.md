# 営業支援システム MVP

お問い合わせフォーム自動送信基盤 — MIKOMERUの運用像を自社保有で再現するMVP。
全6マイルストーン構成。現在 **MS2 (案件管理機能)** 完了時点。

## 構成

- `apps/admin` — 管理画面 (Next.js 15 App Router, :3000)
- `apps/lp` — LP (Next.js 15, :3001) — MS6で本実装
- `packages/db` — Prismaスキーマ・マイグレーション・シード

## セットアップ

### 前提
- Node.js 22+
- PostgreSQL 17 (ローカル `localhost:5432`)

### 初回セットアップ

```bash
# 1. 依存インストール
npm install

# 2. .env 設定 (PostgreSQL 接続情報 / SESSION_SECRET)
cp .env.example .env
# .env を編集

# 3. DB マイグレーション
npm run db:migrate

# 4. 管理者アカウント作成
npm run db:seed
# -> admin@example.com / admin1234
```

### 開発サーバー

```bash
npm run dev:admin   # :3000 管理画面
npm run dev:lp      # :3001 LP
```

## マイルストーン進捗

| MS | 内容 | 状態 |
|---|---|---|
| MS1 | 要件整理・画面構成確定 | ✅ 完了 |
| **MS2** | **認証・共通シェル・案件管理** | **✅ 完了** |
| MS3 | リスト・テンプレート | 🔜 次 |
| MS4 | フォーム送信エンジン (基本) | ⏳ |
| MS5 | 配信結果・ダッシュボード | ⏳ |
| MS6 | 結合テスト・LP・納品 | ⏳ |

## MS2 実装範囲

- F-01 管理者ログイン／ログアウト (P01)
- F-02 案件登録 (P04)
- F-03 案件一覧・検索・絞込 (P03)
- F-04 案件編集・削除・複製 (P05)
- F-05 案件ステータス管理
- 共通シェル (MIKOMERU式 3グループサイドバー)
- ホーム骨格 (P02 — KPIはMS5で中身投入)
- 設定画面最小構成 (P13)
