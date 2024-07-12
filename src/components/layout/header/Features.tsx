// BYIMAAN

"use client";

import * as React from "react"
import { Session } from "next-auth";
import Link from "next/link";

import { cn } from "@/lib/utils"
import { MessageSquareCodeIcon } from "lucide-react";
import { PiSignInLight } from "react-icons/pi";
import { FaUserPen } from "react-icons/fa6";
import { SlLogout } from "react-icons/sl";
import { PiChatTeardropDots } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { _console } from "@/utils/console";

export function NavigationMenuDemo() {

  const {data, status} = useSession();
  const authenticaed = status === 'authenticated';

  _console._log.doMagenta('Header Log : Check session data ', data)
  

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
                <div className="group flex font-semibold px-2 gap-2">
                    <h2 className='text-3xl font-bold text-gray-500'><span className="text-gray-700">B</span><span className="group-hover:inline leading-[-1rem] text-sm transition text-gray-700 hidden">YIMAAN</span><span className="group-hover:hidden">Chat</span></h2>
                    <PiChatTeardropDots size={20} className="font-bold text-sm size-6"/>
                </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent >
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <HeadBanner data={data}/>
                </NavigationMenuLink>
              </li>
              {
                !authenticaed ? (
                  <>
                    <ListItem href="/auth?type=signin" >
                      <div className="flex font-semibold gap-2" >
                          <PiSignInLight size={20} className="font-bold"/>
                          log in
                      </div>
                    </ListItem>
                    <ListItem href="/auth?type=signup">
                      <div className="flex font-semibold gap-2">
                          <FaUserPen size={16}/> 
                          Sign Up
                      </div>
                    </ListItem>
                  </>
              ) : (
                <>
                  <ListItem href="#?action=profile">
                      <div className="flex font-semibold gap-2">
                          <AiOutlineUser size={16}/>
                          {data.user?.name || data?.user?.email || 'N/A'}
                      </div>
                    </ListItem>
                  <ListItem>
                    <div className="flex font-semibold gap-2" onClick={ () => signOut({callbackUrl: '/?action=signOut'})}>
                        <SlLogout size={16} className="cursor-pointer "/>
                        Log out
                    </div>
                  </ListItem>
                </>
                )
              }
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"


const HeadBanner = ({data}: {data: Session | null}) => {

  const imageUrl = data?.user?.image ? `url(${data.user.image})` : undefined;
  return (
    <div
      style={{backgroundImage: imageUrl, backgroundSize:'cover', backgroundPosition:'center'}}
      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md object-cover object-center "
      >

        <div className="h-full w-full flex flex-col-reverse min-h-400px">

          { 
            !data &&
            <Link href={'https://github.com/SubhPB'} className="mb-2 mt-4 text-xs font-medium hover:underline">
              @byimaan/bChat
            </Link>
            &&  <MessageSquareCodeIcon className="h-6 w-6" />
          }
        </div>
    </div>
  )
}