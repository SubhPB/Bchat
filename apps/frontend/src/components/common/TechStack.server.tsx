// Byimaan

import { cn } from "@/lib/utils";
import { FaReact } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { RiNextjsLine } from "react-icons/ri";
import { SiDocker } from "react-icons/si";
import { SiExpress } from "react-icons/si";
import { SiApachekafka } from "react-icons/si";
import { SiRedis } from "react-icons/si";
import { SiPostgresql } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { IconType } from "react-icons";
import { randomUUID } from "crypto";

function RenderTechStack(size: number, className: string, techArray: IconType[]){
    return (
        <div className={cn(className)}>
            {
                techArray.map(
                    (Tech, index) => <Tech key={index} size={size}/>
                )
            }
        </div>
    )
}

class Render {
    static Frontend (size=16, className=''){
        const techUsed = [
            FaReact, SiTypescript, RiTailwindCssFill
        ]
        return RenderTechStack(size, className, techUsed)
    }
    static Backend (size=16, className=''){
        const techUsed = [
            RiNextjsLine, SiDocker, SiExpress, SiApachekafka, SiRedis, SiPostgresql, FaAws
        ];

        return RenderTechStack(size, className, techUsed)
    };
    static ['*']({size=16, className='', iconClassName=''}){
        return (
            <div className={cn(className)}>
                {Render.Frontend(size, iconClassName)}
                {Render.Backend(size, iconClassName)}
            </div>
        )
    }
}

class TechStack {
    static render = Render
};

export {TechStack};