/**
 * Byimaan
 */


import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton as ShadCnSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  className: string
}

const  ContactCardSkeleton: React.FC = () => {
  const Skeleton = ({className}: Props) => <ShadCnSkeleton className={cn("bg-gray-300", className)}/>
  return (
    <Card className="w-full sm:w-[330px] lg:w-[390px] flex-shrink-0 p-4 ">

      <CardContent className="flex gap-2 p-0">
        <Skeleton className="size-[90px] sm:size-[120px] rounded-2xl flex-shrink-0"></Skeleton>
        <div className="w-[180px] lg:w-[220px] flex-shrink-0 space-y-3 text-[1rem] px-1">
          <Skeleton className="w-[80%] h-7 rounded-lg"/>
          <Skeleton className="w-[65%] h-5 rounded-lg"/>
        </div>
      </CardContent>

    </Card>
  )
}

export default ContactCardSkeleton