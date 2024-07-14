import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {SessionProvider} from 'next-auth/react';
import {Toaster} from 'react-hot-toast';

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
      <SessionProvider>
        <body className={`px-3 flex flex-col w-full min-w-[400px] h-screen ${inter.className}`}>
          <Toaster />
          <Header/>
          <section className="flex-grow">
            {children}
          </section>
        </body>
      </SessionProvider>
    </html>
  );
}
