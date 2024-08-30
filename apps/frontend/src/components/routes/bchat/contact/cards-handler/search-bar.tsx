/**
 * Byimaan
 */

import React, { useState } from "react";

import { 
    RocketIcon,
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

    const matchAudience = (str: Props['audience']) => audience === str;
    const matchAttribute = (str: Props['attribute']) => attribute === str;

    const getPlaceHolder = () => {
        let attr = attribute.toLowerCase(), contactType = audience === "*" ? 'any' : 'any blocked'
        return `Type the ${attr} of ${contactType} contact`
    }

    return (
        <Command className="rounded-lg border shadow-md h-fit w-full mb-2" shouldFilter={false}>
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