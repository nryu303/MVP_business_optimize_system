import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "営業支援システム MVP - サービス紹介",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
