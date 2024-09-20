/**
 * Byimaan
 * 
 */

import ChatbarContainer from "@/components/routes/bchat/layout/sidebar/chatbar-container";
import BChatHeader from "../../components/routes/bchat/layout/header";

import ReduxStoreProvider from "@/providers/StoreProvider";
import SocketProvider from "@/providers/io-socket/SocketProvider";

export default function BchatLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return (
      <ReduxStoreProvider>
        <SocketProvider>
          <main className="w-full h-[100dvh] sm:py-[3dvh] overflow-hidden bg-transparent flex items-center justify-center">
              <div className="w-full h-full flex flex-col sm:rounded-lg sm:w-[620px] md:w-[710px] lg:w-[940px] xl:w-[1080px] 2xl:w-[1260px] bg-gray-100 overflow-hidden">
                <BChatHeader />

                <div className="flex flex-grow overflow-hidden">
                  
                  {/* max-w-[28%] because children takes 72% for large-screens  */}
                  <ChatbarContainer className="h-full flex-grow lg:max-w-[28%]"/>

                  {/* User work area */}
                  {
                    children
                  }
                </div>
              </div>
          </main>
        </SocketProvider> 
      </ReduxStoreProvider>
    )
}