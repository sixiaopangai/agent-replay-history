import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent重演历史 — 当AI分身穿越三国",
  description: "让你的AI分身化身三国英雄，在历史碰撞中找到同频的人。A2A for Reconnect。",
  keywords: "Agent, 三国, A2A, Second Me, 历史, AI分身",
  openGraph: {
    title: "Agent重演历史 — 当AI分身穿越三国",
    description: "让你的AI分身化身三国英雄，在历史碰撞中找到同频的人。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Ma+Shan+Zheng&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
