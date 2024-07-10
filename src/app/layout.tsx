import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BChat",
  description: "Chat application to connect with your loved ones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`px-3 flex flex-col ${inter.className}`}>
        <Header/>
        <section className="flex-grow-[1]">
          {children}
        </section>
      </body>
    </html>
  );
}
