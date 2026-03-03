import type { Metadata } from "next";
import "./globals.css";
import Providers from "./components/Providers";
import Navbar from "./components/Navbar";
import EducationFooter from "./components/EducationFooter";

export const metadata: Metadata = {
  title: "Sellernote - 글로벌 무역, 쉽고 빠르게",
  description: "국제무역 학습부터 물류 실무까지, Sellernote 교육 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="font-sans antialiased text-gray-900 bg-white">
        <Providers>
          <Navbar />
          {children}
          <EducationFooter />
        </Providers>
      </body>
    </html>
  );
}
