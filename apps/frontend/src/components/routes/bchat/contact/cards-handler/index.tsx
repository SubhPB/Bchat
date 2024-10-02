/**
 * Byimaan
 * So the idea for this component is that to render all the contact cards whose data will be received as prop belongs to user plus with the functionality of filtering and searching.
 */

'use client';

import React, {useState, useTransition} from "react";
import { cn } from "@/lib/utils";

import { ExpectedContactsDataTypeFromAPI } from "@/lib/redux/features/contacts/slice";
import ContactCardSkeleton from "../view/skeleton";
import { ContactsSearchbar } from "./search-bar";
import { Duration } from "@/utils/features/time/duration";

type Props = {
    className: string;
    children: (cards: ExpectedContactsDataTypeFromAPI) => React.ReactNode;
    ChildSkeleton ?: React.ComponentType;
    contacts: ExpectedContactsDataTypeFromAPI;
    renderSearchbar: boolean
};

export type FilterStrategy = {
    /** '*' means perform filtering over all contacts
     *  'IS_BLOCKED' means filter over blocked contacts
     */
    audience: '*' | 'IS_BLOCKED';
    /**
     *  'NAME' means searchQuery will be compared using the name of the contact
     * 'EMAIL' means searchQuery will use email attribute of the contact for filtering
     */
    attribute: 'NAME' | 'EMAIL' 
};

const defaultStrategy: FilterStrategy = {
    audience: '*',
    attribute: 'NAME'
};

export function  ContactsHandler({className, children, contacts, renderSearchbar, ChildSkeleton=ContactCardSkeleton}:Props){
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStrategy, setFilterStrategy] = useState(defaultStrategy);

    /** useTransition will be used to define the priority of a state update just for better user interactivity*/
    const [isTransitioning, startTransition] = useTransition();
    
    const {audience, attribute} = filterStrategy;

    const updateFilterAudience = (newAudience: FilterStrategy['audience']) => {
        if (newAudience !== audience){
            setFilterStrategy(
                strategy => ({
                    ...strategy,
                    audience: newAudience
                })
            )
        }
    };

    const updateFilterAttribute = (newAttribute: FilterStrategy['attribute']) => {
        if (newAttribute !== attribute){
            setFilterStrategy(
                strategy => ({
                    ...strategy,
                    attribute: newAttribute
                })
            )
        }
    };

    const updateSearchQuery = (newQuery: string) => {
        if (newQuery.trim() !== searchQuery){
            setSearchQuery(newQuery.trim());

            /** filtering contacts have less priority than updating the state os searchQuery */
            /** Suppose there are 1000 contacts and we're not using useTransition then it will cause ugly lag in our application */
            /*By filterContacts will be executed only when the browser has an ideal time meanwhile we will render the contact skeleton*/
            startTransition(
                async() => {
                    await Duration.holdOn(800) /**for the smooth skeleton rendering */
                }
            )
        }
    }

    const filterContacts = (query: string) => {
        query = query.toLowerCase()
        return contacts.filter(
            card => {
                if (audience === 'IS_BLOCKED' && !card.isBlocked){
                    /** Reject if user is not blocked and audience is set to IS_BLOCKED */
                    return false
                };
                return attribute === 'NAME' ? (
                    card.name.toLowerCase().includes(query)
                ) : (
                    card.contact.email.toLowerCase().includes(query)
                );
            }
        );
    };
    

    return (
        <div className={cn('w-full', className)}>
            
            {renderSearchbar && <ContactsSearchbar {...{audience, attribute, searchQuery, isTransitioning, updateFilterAttribute, updateSearchQuery, updateFilterAudience}}/>}
            {
                isTransitioning ? (
                    // In between the time user is entering query display the contact skeleton
                    Array.from('abcd').map( i => <ChildSkeleton key={i}/> )
                ) : (
                    // fiteredContacts's value will be reassigned by filterContacts:fn
                    children(filterContacts(searchQuery))
                )
            }
        </div>
    )
}