/** Byimaan */

import React from "react";
import { TechStack } from "@/components/common/TechStack.server";
import BChatText from "@/components/common/AppText.server";
import { cn } from "@/lib/utils";

type Props = {
    className?: string
};

export const Thumbnail: React.FC<Props> = ({className=''}) => {

    return (
    <div className={cn(className)}>
        <BChatText textSizeInTailwind="text-[8rem]" className='text-gray-300'
            spanChildOf_B_letter={
            <span className='absolute left-full top-5 text-[0.3em] tracking-wider'>YIਮਾਨ</span>
            }
        />
        {
            TechStack.render["*"]({
                size: 24,
                className:"w-full flex justify-center items-center gap-3 sm:gap-5",
                iconClassName: "flex gap-3 sm:gap-5 text-bold text-gray-400"
            })
        }
    </div>
    )
}