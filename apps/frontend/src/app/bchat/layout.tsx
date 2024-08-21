/**
 * Byimaan
 * 
 */

import BChatHeader from "./_components/chatbar/header";

export default function BchatLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){


    return (
        <main className="w-full h-[100dvh] sm:py-[3dvh] overflow-hidden bg-transparent flex items-center justify-center">
            <div className="w-full h-full sm:rounded-lg sm:w-[620px] md:w-[710px] lg:w-[940px] xl:w-[1080px] 2xl:w-[1260px] bg-gray-100 overflow-hidden">
              <BChatHeader />
              {children}
            </div>
        </main>
    )
}