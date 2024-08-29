/**
 * Byimaan
 * 
 */

import ChatbarContainer from "@/components/routes/bchat/layout/ChatbarConainter";
import BChatHeader from "../../components/routes/bchat/layout/header";

import ReduxStoreProvider from "@/providers/StoreProvider";

export default function BchatLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return (
      <ReduxStoreProvider>
        <main className="w-full h-[100dvh] sm:py-[3dvh] overflow-hidden bg-transparent flex items-center justify-center">
            <div className="w-full h-full flex flex-col sm:rounded-lg sm:w-[620px] md:w-[710px] lg:w-[940px] xl:w-[1080px] 2xl:w-[1260px] bg-gray-100 overflow-hidden">
              <BChatHeader />

              <div className="flex flex-grow overflow-hidden">
                <ChatbarContainer className="h-full flex-grow"/>

                {/* User work area */}
                {
                  children
                }
              </div>
            </div>
        </main>
      </ReduxStoreProvider>
    )
}