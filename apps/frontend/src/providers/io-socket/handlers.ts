/** Byimaan */

import {CLIENT_EVENTS} from "./events";

import { ConversationBaseProps, ConversationUserBaseProps, HandleMessageProps, UserTypingProps } from "./types";

/** ------------ Events that everybody has received in the room ------------ */

const handleReceiveMessageFromConversation = ({conversationId, message} : HandleMessageProps) => {
    /**
     * Responsibilities in this handler are following
     *  [1] Update the redux store with the new message after figuring out the conversation id
     */
};

/** ------------ Broadcasted events ------------ */

const handleSomeoneIsTypingInConversation = ({conversationId, userId}:UserTypingProps) => {
    /**
     * Responsibilities in this handler are following
     *  [1] We know the userId of user who is typing and in which conversation he is typing so identify the conversation and update the redux store
     */
};

const handleSomeoneHasStoppedTypingInConversation = ({conversationId, userId}:UserTypingProps) => {
    /**
     * Responsibilities in this handler are following
     *  [1] We know the userId of user who has stopped typing and we also know the conversationId
     */
};

const handleSomeoneIsOnline = ({userId} : ConversationUserBaseProps) => {
    /**
     * Responsibilities in this handler are following
     * [1] Someone who we know is online we only have his userId so we can change the redux state 
     */
};

const handleSomeOneIsOffline = ({userId} : ConversationUserBaseProps) => {
    /**
     * Responsibilities in this handler are following
     * [1] Someone who we know got offline we only have his userId so we can change the redux state to update user's online status
     */
}


/** ------------ Events that i (this user) has received ------------ */

const handleYouhaveDeletedAMessageFromConversation = ({conversationId, message} : HandleMessageProps) => {

    /**
     * Responsibilties in this handler are following
     * [1] By this event we are 100%sure that the message we had deleted is also has been deleted in the database So we can update the conversation state
     *  > Suppose user clicked to delete message then we emitted a action of `DELETE_MESSAGE_FROM_CONVERSATION` to the server and meanwhile we set the loading state that we are in the middle of deleting the message and then when we receive this event as confirmation and we can set the loading state to false
     */
};

const handleYouHaveJoinedConversation = ({conversationId} : ConversationBaseProps) => {
    /**
     * Responsibilties in this handler are following
     * [1] This will be received after `JOIN_CONVERSATION` event and server has sent this event to tell us that you really have joined the room or conversation that you requested
     */
};

const handleYouHaveJoinedUserRoom = ({userId} : ConversationUserBaseProps) => {
    /**
     * Responsibilties in this handler are following
     * [1] This is supposed to be received after dispatched event of `JOIN_USER_ROOM` and indicates that now we are part of the user 's personal room this room will helpful in the ways like knowing whther user'sonline status or more...
     */
};

const handleYouHaveLeftUserRoom = ({userId} : ConversationUserBaseProps) => {
    /**
     * Responsibilties in this handler are following
     * [1] This is supposed to be received after dispatched event of `LEAVE_USER_ROOM` and indicates that user who owned this room has gone offline.
     */
};

const handleYouHaveToLeaveUserRoom = ({userId} : ConversationUserBaseProps) => {
    /**
     * Responsibilties in this handler are following
     * [1] Server has sent this event to us to inform that the user who was online and whom we joined the room has gone offline and no longer exist in his personal room So should also leave his personal room
     */
};

const handleYourRequestedUserIsOnline = ({userId} : ConversationUserBaseProps) => {
    /**
     * Responsibilties in this handler are following
     * [1] Server has sent this event to us to inform that user we requested about is online
     */
};

const handleYourRequestedUserIsOffline = ({userId} : ConversationUserBaseProps) => {
    /**
     * Responsibilties in this handler are following
     * [1] Server has sent this event to us to inform that user we requested about is offline
     */
};

export const clientEventHandlers = {
    [CLIENT_EVENTS.RECEIVE_MESSAGE_FROM_CONVERSATION] : handleReceiveMessageFromConversation,
    [CLIENT_EVENTS.SOMEONE_IS_TYPING_IN_CONVERSATION] : handleSomeoneIsTypingInConversation,
    [CLIENT_EVENTS.SOMEONE_HAS_STOPPED_TYPING_IN_CONVERSATION] : handleSomeoneHasStoppedTypingInConversation,
    [CLIENT_EVENTS.SOMEONE_IS_ONLINE] : handleSomeoneIsOnline,
    [CLIENT_EVENTS.SOMEONE_IS_OFFLINE] : handleSomeOneIsOffline,
    [CLIENT_EVENTS.YOU_HAVE_DELETED_A_MESSAGE_FROM_CONVERSATION] : handleYouhaveDeletedAMessageFromConversation,
    [CLIENT_EVENTS.YOU_HAVE_JOINED_CONVERSATION] : handleYouHaveJoinedConversation,
    [CLIENT_EVENTS.YOU_HAVE_JOINED_USER_ROOM] : handleYouHaveJoinedUserRoom,
    [CLIENT_EVENTS.YOU_HAVE_LEFT_USER_ROOM] : handleYouHaveLeftUserRoom,
    [CLIENT_EVENTS.YOU_HAVE_TO_LEAVE_USER_ROOM] : handleYouHaveToLeaveUserRoom,
    [CLIENT_EVENTS.YOUR_REQUESTED_USER_IS_ONLINE] : handleYourRequestedUserIsOnline,
    [CLIENT_EVENTS.YOUR_REQUESTED_USER_IS_OFFLINE] : handleYourRequestedUserIsOffline,
} as const;