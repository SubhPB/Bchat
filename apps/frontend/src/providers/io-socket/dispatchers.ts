/** Byimaan */

/** What are the socket features and events do our components want to use and dispatch  */

import { Socket } from "socket.io";
import { EVENTS } from "./events";
import { 
    ConversationBaseProps,
    ConversationUserBaseProps,
    HandleMessageProps,
    IsUserOnlineProps,
    UserTypingProps
} from "./types";

const useEventDispatcher = (socket : Socket) => {
    
    const dispatchEvents =  {
        dispatchJoinConversation: ({conversationId}: ConversationBaseProps) => {
            /**
             * Responsibilities:
             *  [1] Dispatch the JOIN_CONVERSATION event to the server
             */

            socket.emit(EVENTS.JOIN_CONVERSATION, {conversationId})
        },

        dispatchJoinUserRoom: ({userId}: Omit<ConversationUserBaseProps, 'conversationId'>) => {
            /**
             * Responsibilities:
             *  [1] Dispatch the JOIN_USER_ROOM event to the server so that i can get the update about the user who own the room
             */
            socket.emit(EVENTS.JOIN_USER_ROOM, {userId})
        },

        dispatchLeaveUserRoom: ({userId}: Omit<ConversationUserBaseProps, 'conversationId'>) => {
            /**
             * Responsibilities:
             *  [1] Dispatch the LEAVE_USER_ROOM event to the server because the user who owns the room has gone offline or we are no longer interested in this room
             */
            socket.emit(EVENTS.LEAVE_USER_ROOM, {userId})
        },

        dispatchIsUserOnline: ({userId}: IsUserOnlineProps) => {
            /**
             * Responsibilities:
             *  [1] Dispatch the IS_USER_ONLINE event to the server because we are curious if someone is online
             */
            socket.emit(EVENTS.IS_USER_ONLINE, {userId})
        },

        dispatchSendMessageToConversation: ({conversationId, message}: HandleMessageProps) => {
            /**
             * Responsibilities:
             *  [1] Dispatch the SEND_MESSAGE_TO_CONVERSATION event to the server
             *  [2] we may also need to update the redux state in here so that we can show that message is being sent
             */
            socket.emit(EVENTS.SEND_MESSAGE_TO_CONVERSATION, {conversationId, message})
        },

        dispatchDeleteMessageFromConversation: ({conversationId, message}: HandleMessageProps) => {
            /**
             * Responsibilities:
             *  [1] Dispatch the DELETE_MESSAGE_FROM_CONVERSATION event to the server
             *  [2] mean while we will want for server to event named YOU_HAVE_DELETED_A_MESSAGE_FROM_CONVERSATION which is separate logic and not a part of this event
             */
            socket.emit(EVENTS.DELETE_MESSAGE_FROM_CONVERSATION, {conversationId, message})
        },

        dispatchIamTypingInConversation: ({conversationId}: UserTypingProps) => {
            /**
             * Responsibilities:
             *  [1] Dispatch the USER_IS_TYPING_IN_CONVERSATION event to the server so that other users can see that iam typing
             */
            socket.emit(EVENTS.USER_IS_TYPING_IN_CONVERSATION, {conversationId})
        },

        dispatchIHaveStoppedTypingInConversation: ({conversationId}: UserTypingProps) => { 
            /**
             * Responsibilities: 
             *  [1] Dispatch USER_STOPPED_TYPING_IN_CONVERSATION event to the server so that other user can know that i no longer typing in a conversation
             */
            socket.emit(EVENTS.USER_STOPPED_TYPING_IN_CONVERSATION,{conversationId})
        }
    }
};