import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Leo의 블로그",
  description: "생각과 경험을 기록하는 공간",
};

// Script to prevent dark mode flash on load
const themeScript = `
  (function() {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
