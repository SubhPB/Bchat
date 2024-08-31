/**
 * Byimaan
 */

import React, { useRef, useState } from "react";

import { 
    StarIcon,
    BanIcon,
    SignatureIcon,
    AtSignIcon
} from "lucide-react"

import { cn } from "@/lib/utils";

import {
Command,
CommandEmpty,
CommandGroup,
CommandInput,
CommandItem,
CommandList,
CommandSeparator,
CommandShortcut,
} from "@/components/ui/command";

import { FilterStrategy } from ".";
import { useClickScopeEffect } from "@/utils/react-hooks/use-click-scope";

type Props = {
    searchQuery: string;
    audience: FilterStrategy['audience'];
    attribute: FilterStrategy['attribute'];
    updateFilterAudience : (audience: FilterStrategy['audience']) => void;
    updateFilterAttribute: (attribute: FilterStrategy['attribute']) => void;
    isTransitioning: boolean;
    updateSearchQuery: (newQuery: string) => void;
}


export function ContactsSearchbar({audience, searchQuery, attribute, updateFilterAttribute, updateSearchQuery, updateFilterAudience, isTransitioning}:Props){

    const [renderOptions, setRenderOptions] = useState(false);
    const elemRef = useRef<HTMLDivElement>(null)

    const matchAudience = (str: Props['audience']) => audience === str;
    const matchAttribute = (str: Props['attribute']) => attribute === str;

    const getPlaceHolder = () => {
        let attr = attribute.toLowerCase(), contactType = audience === "*" ? 'any' : 'any blocked'
        return `Type the ${attr} of ${contactType} contact`
    };

    /** if filtering options are rendered and user clicked somewhere outside of the this component then this hook will set the renderOptions to false and our component will be shrinked in its size*/
    useClickScopeEffect<React.RefObject<HTMLDivElement>>({rootRef: elemRef, state: renderOptions, setState: setRenderOptions, dependencies: [renderOptions]})

    return (
        <Command ref={elemRef} className="rounded-lg border shadow-md h-fit w-full my-2 sticky top-1 z-[100]" shouldFilter={false}>
        <CommandInput
            onFocus={() => setRenderOptions(true)}
            value={searchQuery}
            placeholder={getPlaceHolder()}
            onValueChange={newQuery => updateSearchQuery(newQuery)}/>
            {
                renderOptions && (
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="What type of users you want to search for?">
                        <CommandItem 
                            className={cn(matchAudience('IS_BLOCKED') && "bg-[#AFDBF5]")}
                            disabled={isTransitioning || matchAudience('IS_BLOCKED')} 
                            onSelect={() => updateFilterAudience("IS_BLOCKED")}>
                            <BanIcon className="mr-2 h-4 w-4" />
                            <span>Blocked users</span>
                        </CommandItem>
                        <CommandItem  
                            className={cn(matchAudience('*') && "bg-[#AFDBF5]")} 
                            disabled={isTransitioning || matchAudience('*')}
                            onSelect={() => updateFilterAudience('*')}>
                            <StarIcon className="mr-2 h-4 w-4" />
                            <span>Any</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Filter by">
                        <CommandItem 
                            className={cn(matchAttribute('NAME') && "bg-[#AFDBF5]")}
                            disabled={isTransitioning || matchAttribute('NAME')}
                            onSelect={() => updateFilterAttribute('NAME')}>
                            <SignatureIcon className="mr-2 h-4 w-4" />
                            <span>Name</span>
                            <CommandShortcut>⌘N</CommandShortcut>
                        </CommandItem>
                        <CommandItem 
                            className={cn(matchAttribute('EMAIL') && "bg-[#AFDBF5]")}
                            disabled={isTransitioning || matchAttribute('EMAIL')} 
                            onSelect={() => updateFilterAttribute('EMAIL')}>
                            <AtSignIcon className="mr-2 h-4 w-4" />
                            <span>Email</span>
                            <CommandShortcut>⌘E</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
                )
            }
    </Command> 
    );
}