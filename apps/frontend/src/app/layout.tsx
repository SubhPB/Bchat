import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Suspense } from "react";
import {SessionProvider} from 'next-auth/react'

import LayoutBackground from "@/components/common/LayoutBackground.server";
import { AppLoading } from "@/components/layout/loading-dialog.server";

const inter = Inter({ subsets: ["latin"] })
const oswald = Oswald({ subsets: ["latin"], display: "swap", variable: "--font-poppins" })

export const metadata: Metadata = {
  title: "BChat",
  description: "Chat application powered with nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <SessionProvider>
        <body className={`relative min-h-dvh max-h-fit text-secondary-bchat min-w-[320px] ${inter.className} ${oswald.variable}`}>
          <LayoutBackground />
          <Toaster 
            containerStyle={{
              zIndex: 9999 // For the container
             }}
             toastOptions={{
               style: {
                 zIndex: 9999 // For toasts
               },
             }}/>

          <Suspense key={"app-loading"} fallback={<AppLoading/>}>
            {children}
          </Suspense>
        </body>
      </SessionProvider>
    </html>
  );
}
