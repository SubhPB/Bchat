// Byimaan

import BChatText from "@/components/common/AppText.server";;
import Loading from "@/components/common/Loading.server";
import { cn } from "@/lib/utils";

type Props = {
    className ?:string,
    children ?: React.ReactNode,
    overWriteDefaultClassName ?: boolean,
}

const AppLoading = ({className='', children, overWriteDefaultClassName=false}: Props) => {

    let defaultClassName = 'fixed z-[999] inset-0 bg-transparent grid place-items-center backdrop-blur-[3px] px-8';

    className = overWriteDefaultClassName ? className : defaultClassName + " " + className

    return (
        <div className={cn(className)}>
            <div className="loading-holder bg-white rounded-lg flex-col gap-4 items-center justify-center py-6 px-4 text-sm sm:max-w-[400px]">

                <div className="flex justify-center gap-4">
                    <BChatText textSizeInTailwind="text-2xl"/>
                    <Loading sizeInTW="size-6" borderWidthInTW="border-2"/>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
};
export { AppLoading}