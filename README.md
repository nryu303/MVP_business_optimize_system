# 営業支援システム MVP

お問い合わせフォーム自動送信基盤 — MIKOMERU 運用像を自社保有で再現する MVP。
**全 6 マイルストーン完了、MVP として運用開始可能な状態で納品**。

## 構成

| パッケージ | ポート | 役割 |
|---|---|---|
| `apps/admin` | 3002 | 管理画面 (Next.js 15 App Router) |
| `apps/lp` | 3001 | LP + ダミーフォーム + 受信ログ |
| `apps/worker` | (なし) | 送信ワーカー (Playwright + pg-boss) |
| `packages/db` | — | Prisma スキーマ・マイグレーション・シード |

## ドキュメント

- **セットアップ手順書**: [docs/setup.md](docs/setup.md) — 初回構築・dev 起動・トラブルシューティング
- **操作マニュアル**: [docs/manual.md](docs/manual.md) — 運用者向け画面操作手順

## クイックスタート

```bash
# 初回のみ
npm install
cp .env.example .env          # DATABASE_URL と SESSION_SECRET を設定
npm run db:migrate
npm run db:seed
npx playwright install chromium

# 開発サーバー 3プロセス同時起動
npm run dev
```

アクセス先:
- 管理画面: http://localhost:3002/login (`admin@example.com` / `admin1234`)
- LP: http://localhost:3001

## マイルストーン進捗

| MS | 内容 | 状態 | 主要成果物 |
|---|---|---|---|
| MS1 | 要件整理・画面構成確定 | ✅ 完了 | 要件定義書 |
| MS2 | 認証・共通シェル・案件管理 | ✅ 完了 | P01 / P03-05 / P13 |
| MS3 | リスト・テンプレート | ✅ 完了 | P06-10 / BL / 紐付け |
| MS4 | フォーム送信エンジン (基本) | ✅ 完了 | P11 / worker / queue |
| MS5 | 配信結果・ダッシュボード | ✅ 完了 | P12 / P02 / CSV |
| MS6 | 結合テスト・LP・納品 | ✅ 完了 | マニュアル / 手順書 / LP |

## 主要機能一覧

- **認証** — bcrypt + JWT セッション / 単一管理者
- **案件管理** — CRUD / 検索・絞込 / ステータス遷移 / 複製 / リスト・テンプレ紐付け
- **CSV 取込** — UTF-8 / Shift_JIS 自動判定 / 項目マッピング / 重複排除 / BL 突合
- **テンプレート** — 送信文章 (変数対応・プレビュー・文字数カウンタ) / 送信元プロファイル
- **ブラックリスト** — 手動登録 / 取込時自動キーワード検出
- **自動送信** — Playwright 汎用フォーム検出 / リトライ 2 回 / レート制限 / 一時停止・再開・キャンセル
- **キュー管理** — pg-boss (PostgreSQL backed) / pending / running / done / failed
- **配信結果** — エラー種別 5 分類 / 絞込 / CSV エクスポート
- **ダッシュボード** — KPI カード / 日次グラフ / 案件別グラフ / 最新ジョブログ
- **設定** — 文字数プリセット / 送信元既定値 / アカウント情報

## スコープ外 (別契約 / 別見積)

- CAPTCHA 完全対応・高度な到達率最適化
- AI 自動リスト取得 (form_url は手動収集前提)
- 複数ユーザ / 権限分離
- 継続保守・機能拡張 (MS6 納品時点までの重大不具合対応のみ無償)

## 技術スタック

- **Frontend/Backend**: Next.js 15 (App Router) + React 19 + TypeScript 5.7 + Tailwind CSS 4
- **DB**: PostgreSQL 17 + Prisma 6
- **認証**: bcryptjs + jose (JWT)
- **キュー**: pg-boss 10 (PostgreSQL backend)
- **ブラウザ自動化**: Playwright 1.49 (Chromium)
- **CSV 処理**: papaparse + iconv-lite
- **可視化**: Recharts 3
- **モノレポ**: npm workspaces

## 備考

- xlsx 要件整理書 (マイルストーン1_要件整理.xlsx) は `.gitignore` 対象 (社外秘扱い)
- 送信成功率は対象サイトの仕様により変動 (目安 80〜85%、保証なし)
- 納品後の保守・改修・機能追加は別途見積

## ライセンス

- 白石様との個別契約に基づく納品物 (Lancers 経由)
- 著作権は納品日時点でクライアントに譲渡
