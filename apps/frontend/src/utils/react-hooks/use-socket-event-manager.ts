/** Byimaan 
 * 
 * Keep Track of Completed , partial completed task using the following keywords :-
 * 
 * Ctrl+F [1] //Done [2] //Partial
*/

'use client';

import { Socket } from "socket.io-client";
import { useAppDispatch } from "@/lib/redux/hooks";

import {EVENTS, CLIENT_EVENTS} from '../../providers/io-socket/events';
import {
    ConversationBaseProps,
    ConversationUserBaseProps,
    HandleMessageProps,
    IsUserOnlineProps,
    UserTypingProps,
    ConversationUsersBaseProps,
    YouAreIncludedInNewlyCreatedConversationProps,
    IHaveCreatedANewConversationProps
} from '../../providers/io-socket/types';

import { addMessageToConversation, addSomeoneWhoIsTyping, deleteMessageFromConversation, incrementConversationUnreadMessages, removeSomeoneWhoIsTyping, setSocketConnectionStatusOfConversation, upsertConversation } from "@/lib/redux/features/chat/conversations/slice";

import { upsertSomeoneIsOnline, upsertSomeoneIsOffline, addChatUser, setChatUserToOffline } from "@/lib/redux/features/chat/users/slice";

const DEBUG = [49, 229];

class Debug {
    constructor(public title ?: string){
        this.title = title || "CODE";
    }

    log(...args : any){
        console.log(`[DEBUG] : ${this.title}`, ...args)
    }
}

export const useIoEventManager  = (socket: Socket | null, appDispatch: ReturnType<typeof useAppDispatch>) => {

    /* some event handlers may need to know the current conversationId if user is currently in that conversation */
    const eventDispatchers =  {
        //Done
        dispatchJoinConversation: ({conversationId}: ConversationBaseProps) => {
                        
            if (!socket){
                return
            };
            /**
             * Responsibilities:
             *  [1] Dispatch the JOIN_CONVERSATION event to the server
             */
            socket.emit(EVENTS.JOIN_CONVERSATION, {conversationId})
        },
        //Done
        dispatchJoinUserRooms: ({userIds}: Omit<ConversationUsersBaseProps, 'conversationId'>) => {
            if (!socket){
                return
            };

            const userIdsSet = new Set(userIds)

            userIdsSet.forEach(userId => {
                socket.emit(EVENTS.JOIN_USER_ROOM, {userId})
            })
        },
        //Done
        dispatchJoinUserRoom: ({userId}: Omit<ConversationUserBaseProps, 'conversationId'>) => {
            if (!socket){
                return
            };
            /**
             * Responsibilities:
             *  [1] Dispatch the JOIN_USER_ROOM event to the server so that i can get the update about the user who own the room
             */
            socket.emit(EVENTS.JOIN_USER_ROOM, {userId})
        },
        //Done
        dispatchLeaveUserRoom: ({userId}: Omit<ConversationUserBaseProps, 'conversationId'>) => {
            if (!socket){
                return
            }

            /**
             * Responsibilities:
             *  [1] Dispatch the LEAVE_USER_ROOM event to the server because the user who owns the room has gone offline or we are no longer interested in this room
             */
            socket.emit(EVENTS.LEAVE_USER_ROOM, {userId})
        },
        //Done
        dispatchIsUserOnline: ({userId}: IsUserOnlineProps) => {
            if (!socket){
                return
            }

            /**
             * Responsibilities:
             *  [1] Dispatch the IS_USER_ONLINE event to the server because we are curious if someone is online
             */
            socket.emit(EVENTS.IS_USER_ONLINE, {userId})
        },
        //Done
        dispatchSendMessageToConversation: ({conversationId, message}: HandleMessageProps) => {
            if (!socket){
                return
            }

            /**
             * Responsibilities:
             *  [1] Dispatch the SEND_MESSAGE_TO_CONVERSATION event to the server
             *  [2] we may also need to update the redux state in here so that we can show that message is being sent
             */
            socket.emit(EVENTS.SEND_MESSAGE_TO_CONVERSATION, {conversationId, message})
        },
        //Done
        dispatchDeleteMessageFromConversation: ({conversationId, message}: HandleMessageProps) => {
            if (!socket){
                return
            }

            /**
             * Responsibilities:
             *  [1] Dispatch the DELETE_MESSAGE_FROM_CONVERSATION event to the server
             *  [2] mean while we will want for server to event named YOU_HAVE_DELETED_A_MESSAGE_FROM_CONVERSATION which is separate logic and not a part of this event
             */
            socket.emit(EVENTS.DELETE_MESSAGE_FROM_CONVERSATION, {conversationId, message})
        },
        //Done
        dispatchIamTypingInConversation: ({conversationId, userId}: UserTypingProps) => {
            if (!socket){
                return
            }

            /**
             * Responsibilities:
             *  [1] Dispatch the USER_IS_TYPING_IN_CONVERSATION event to the server so that other users can see that iam typing
             */
            socket.emit(EVENTS.USER_IS_TYPING_IN_CONVERSATION, {conversationId, userId})
        },
        //Done
        dispatchIHaveStoppedTypingInConversation: ({conversationId, userId}: UserTypingProps) => { 
            if (!socket){
                return
            }

            /**
             * Responsibilities: 
             *  [1] Dispatch USER_STOPPED_TYPING_IN_CONVERSATION event to the server so that other user can know that i no longer typing in a conversation
             */
            socket.emit(EVENTS.USER_STOPPED_TYPING_IN_CONVERSATION,{conversationId, userId})
        },

        dispatchIHaveCreatedANewConversation: (conversationData:IHaveCreatedANewConversationProps) => {
            if (!socket){
                return
            }
            const debug = new Debug(" feat/Handler : dispatchIHaveCreatedANewConversation | CODE > 159 ");
            debug.log("Dispatching a event named I_HAVE_CREATED_A_NEW_CONVERSATION ", {conversationData} )
            socket.emit(EVENTS.A_CONVERSATION_HAS_BEEN_CREATED, conversationData)
        }
    } as const;

    const eventHandlers = {

        /** ------------ Events that everybody has received in the room ------------ */
        
        //Done
        [CLIENT_EVENTS.RECEIVE_MESSAGE_FROM_CONVERSATION] : function handleReceiveMessageFromConversation({conversationId, message} : HandleMessageProps) {
            /**
             * Responsibilities in this handler are following
             *  [1] Update the redux store with the new message after figuring out the conversation id
             */

            appDispatch(incrementConversationUnreadMessages({conversationId}))
            appDispatch(addMessageToConversation({conversationId, message}))
        },

        /** ------------ Broadcasted events ------------ */

        //Done
        [CLIENT_EVENTS.SOMEONE_IS_TYPING_IN_CONVERSATION] : function handleSomeoneIsTypingInConversation({conversationId, userId}:UserTypingProps) {
            /**
             * Responsibilities in this handler are following
             *  [1] We know the userId of user who is typing and in which conversation he is typing so identify the conversation and update the redux store
             */
            appDispatch(addSomeoneWhoIsTyping({conversationId, userId}))
        },

        //Done
        [CLIENT_EVENTS.SOMEONE_HAS_STOPPED_TYPING_IN_CONVERSATION] : function handleSomeoneHasStoppedTypingInConversation({conversationId, userId}:UserTypingProps) {
            /**
             * Responsibilities in this handler are following
             *  [1] We know the userId of user who has stopped typing and we also know the conversationId
             */
            appDispatch(removeSomeoneWhoIsTyping({conversationId, userId}))
        },

        //Done
        [CLIENT_EVENTS.SOMEONE_IS_ONLINE] : function handleSomeoneIsOnline({userId} : ConversationUserBaseProps) {
            /**
             * Responsibilities in this handler are following
             * [1] Someone who we know is online we only have his userId so we can change the redux state 
             */
            appDispatch(upsertSomeoneIsOnline({userId}))
        },

        //Done
        [CLIENT_EVENTS.SOMEONE_IS_OFFLINE] : function handleSomeOneIsOffline({userId} : ConversationUserBaseProps) {
            /**
             * Responsibilities in this handler are following
             * [1] Someone who we know got offline we only have his userId so we can change the redux state to update user's online status
             */
            appDispatch(upsertSomeoneIsOffline({userId}))
        },

        [CLIENT_EVENTS.SOMEONE_S_USER_ROOM_SHOULD_BE_JOINED]: function handleSomeoneSUserRoomShouldBeJoined({userId} : ConversationUserBaseProps) {
            /**
             * Responsibility in this handler are following
             *   [1] Server has felt the necessity of us to join the user's room
             */
            eventDispatchers.dispatchJoinUserRoom({userId})
        },

        

        /** ------------ Events that i (this user) has received ------------ */

        //Done
        [CLIENT_EVENTS.YOU_HAVE_DELETED_A_MESSAGE_FROM_CONVERSATION] : function handleYouHaveDeletedAMessageFromConversation({conversationId, message} : HandleMessageProps) {
            
            /**
             * Responsibilities in this handler are following
             * [1] By this event we are 100%sure that the message we had deleted is also has been deleted in the database So we can update the conversation state
             *  > Suppose user clicked to delete message then we emitted a action of `DELETE_MESSAGE_FROM_CONVERSATION` to the server and meanwhile we set the loading state that we are in the middle of deleting the message and then when we receive this event as confirmation and we can set the loading state to false
             */
            appDispatch(deleteMessageFromConversation({conversationId, message}))
        },

        //Done
        [CLIENT_EVENTS.YOU_HAVE_JOINED_CONVERSATION] : function handleYouHaveJoinedConversation({conversationId} : ConversationBaseProps) {
            /**
             * Responsibilities in this handler are following
             * [1] This will be received after `JOIN_CONVERSATION` event and server has sent this event to tell us that you really have joined the room or conversation that you requested
             */
            appDispatch(setSocketConnectionStatusOfConversation({conversationId}))
        },
        //Partial
        [CLIENT_EVENTS.YOU_HAVE_JOINED_USER_ROOM] : function handleYouHaveJoinedUserRoom({userId} : ConversationUserBaseProps) {
            /**
             * Responsibilities in this handler are following
             * [1] This is supposed to be received after dispatched event of `JOIN_USER_ROOM` and indicates that now we are part of the user 's personal room this room will helpful in the ways like knowing whether user's online status or more...
             */
            appDispatch(
                /** if user is online then it is backend s responsibility to inform us. By default we will set it to `offline` */
                addChatUser({userId, status: 'offline'})
            )
        },
        //Partial
        [CLIENT_EVENTS.YOU_HAVE_LEFT_USER_ROOM] : function handleYouHaveLeftUserRoom({userId} : ConversationUserBaseProps) {
            /**
             * Responsibilities in this handler are following
             * [1] This is supposed to be received after dispatched event of `LEAVE_USER_ROOM` and indicates that user who owned this room has gone offline.
             */
            appDispatch(
                /** there are 2 choices for us to do
                 * either we can remove the user from redux state
                 * else we can set the user's online status to `offline`
                 * --> we can set it to `offline` 
                 */
                setChatUserToOffline({userId})
            )
        },
        //Done
        [CLIENT_EVENTS.YOU_HAVE_TO_LEAVE_USER_ROOM] : function handleYouHaveToLeaveUserRoom({userId} : ConversationUserBaseProps) {
            /**
             * Responsibilities in this handler are following
             * [1] Server has sent this event to us to inform that the user who was online and whom we joined the room has gone offline and no longer exist in his personal room So should also leave his personal room
             */
            eventDispatchers.dispatchLeaveUserRoom({userId})
        },
        //Done
        [CLIENT_EVENTS.YOUR_REQUESTED_USER_IS_ONLINE] : function handleYourRequestedUserIsOnline({userId} : ConversationUserBaseProps) {
            /**
             * Responsibilities in this handler are following
             * [1] Server has sent this event to us to inform that user we requested about is online
             */
            appDispatch(upsertSomeoneIsOnline({userId}))
        },
        //Done
        [CLIENT_EVENTS.YOUR_REQUESTED_USER_IS_OFFLINE] : function handleYourRequestedUserIsOffline({userId} : ConversationUserBaseProps) {
            /**
             * Responsibilities in this handler are following
             * [1] Server has sent this event to us to inform that user we requested about is offline
             */
            appDispatch(upsertSomeoneIsOffline({userId}))
        },
        //Partial
        [CLIENT_EVENTS.YOU_ARE_INCLUDED_IN_NEWLY_CREATED_CONVERSATION]: function handleYouAreIncludedInNewlyCreatedConversation({conversationData}: YouAreIncludedInNewlyCreatedConversationProps) {
            const debug = new Debug(` Feat/${CLIENT_EVENTS.YOU_ARE_INCLUDED_IN_NEWLY_CREATED_CONVERSATION} | 290 `);

            debug.log(`argument.conversationData = `, conversationData);
            /** Means We to dispatch upsertConversation and then also need to join conversation through dispatchJoinConversation.
             * Before that it is better to verify the conversation data.
             */

            if (typeof conversationData !== 'object') return;

            // @ts-ignore
            const myUserId = socket?.userId;

            const {id, participants, messages=[]} = conversationData;

            if (
                Array.isArray(participants) 

                && [
                    'id',
                    'userId',
                    'status',
                    'createdAt',
                    'updatedAt'
                ].every(key => key in conversationData)

                && participants.every(
                    participant => (
                        typeof participant === 'object'
                         && 'user' in participant
                         && typeof participant.user === 'object'
                         && [
                            'id', 
                            'name', 
                            'email', 
                            'emailVerified', 
                            'image', 
                            'firstName', 
                            'lastName', 
                            'isActive', 
                            'createdAt', 
                            'updatedAt',
                         ].every(key => key in participant.user) 
                    )
                )

                && Array.isArray(messages)
                
                && participants.some(
                    participant => participant?.userId === myUserId
                )
            ){
                debug.log("All tests passed! Valid conversation data received");
                debug.log("Going to upsert this conversation into the redux store");
                // we are truly included in this conversation
                appDispatch(upsertConversation(conversationData));

                debug.log("Going to join this conversation through socket");
                eventDispatchers.dispatchJoinConversation({
                    conversationId: id
                })
            };
        
        }

    } as const;
    
    
    return {
        eventDispatchers, 
        eventHandlers
    } as const;
}