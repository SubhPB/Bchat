/**
 * Byimaan
 * 
 */

import ChatbarContainer from "./_components/_chatbar";
import BChatHeader from "./_components/_header";
import { WorkArea } from "./_components/_workarea";
// import ChatbarContainer from "./_components/chatbar";
// import { WorkArea } from "./_components/workarea";

export default function BchatLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return (
        <main className="w-full h-[100dvh] sm:py-[3dvh] overflow-hidden bg-transparent flex items-center justify-center">
            <div className="w-full h-full sm:rounded-lg sm:w-[620px] md:w-[710px] lg:w-[940px] xl:w-[1080px] 2xl:w-[1260px] bg-gray-100 overflow-hidden">
              <BChatHeader />

              <div className="h-full flex">
                <ChatbarContainer className="h-full w-1/2"/>
                <WorkArea className="h-full w-1/2">
                  {children}
                </WorkArea>
              </div>
            </div>
        </main>
    )
}