// BYIMAAN

"use client";

"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { MessageSquareCodeIcon } from "lucide-react";
import { PiSignInLight } from "react-icons/pi";
import { FaUserPen } from "react-icons/fa6";
import { SlLogout } from "react-icons/sl";
import { PiChatTeardropDots } from "react-icons/pi";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
                <div className="flex font-semibold px-2 gap-2">
                    <h2 className='text-2xl font-bold text-gray-700 '>BChat</h2>
                    <PiChatTeardropDots size={20} className="font-bold text-sm"/>
                </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent >
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <MessageSquareCodeIcon className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      byimaan/bChat
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      nextjs.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              {
                Object.values(AuthListItem).map((Item, index) => Item(index) )
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


const AuthListItem = {
    SignIn : (
        (key:number) => (
            <ListItem key={key} href="/auth?type=signin" >
                <div className="flex font-semibold gap-2">
                    <PiSignInLight size={20} className="font-bold"/>
                    log in
                </div>
            </ListItem>
        )
    ),
    SignUp: (
        (key: number) => (
            <ListItem key={key} href="/auth?type=signup">
                <div className="flex font-semibold gap-2">
                    <FaUserPen size={16}/> 
                    Sign Up
                </div>
            </ListItem>
        )
    ),
    SignOut: (
        (key:number) => (
            <ListItem key={key} href="/auth?type=signout">
                <div className="flex font-semibold gap-2">
                    <SlLogout size={16}/>
                    Log out
                </div>
            </ListItem>
        )
    )
}
 