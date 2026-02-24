import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sellernote - 글로벌 무역, 더 쉽고 단순하게",
  description: "국제 무역의 장벽을 낮추는 스마트 디지털 물류 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} font-sans antialiased text-gray-900 bg-white`}>
        {children}
      </body>
    </html>
  );
}
