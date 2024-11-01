/**
 * Byimaan
 * 
 * All socket.io events names that server will handle
 */

import { Socket, Server as IoServer } from "socket.io";
import { socketEventHandlers } from "./handlers";
import { 
    ConversationBaseProps,
    ConversationUserBaseProps,
    HandleMessageProps,
    IsUserOnlineProps,
    UserTypingProps
 } from "./handlers";
import { DataAfterConversationCreation } from "./type";

const {
    handleSendMessageToConversation,    
    handleUserIsTypingInConversation,
    handleUserStoppedTypingInConversation,
    handleDeleteMessageFromConversation,
    handleJoinConversation,
    handleJoinUserRoom,
    handleIsUserOnline,
    handleLeaveUserRoom,
    handleOnDisconnect,

    handleNewConversationHasBeenCreated
} = socketEventHandlers;

/** The events that will be received from client */
export const EVENTS = {
    JOIN_CONVERSATION : "join_conversation",

    /** it is possible for a user with id u123 to join the room of user with id u456 does not matter whether he is online or not  */
    JOIN_USER_ROOM : "join_user_room",

    LEAVE_USER_ROOM : "leave_user_room",

    SEND_MESSAGE_TO_CONVERSATION : "send_message_to_conversation",
    DELETE_MESSAGE_FROM_CONVERSATION : "delete_message_from_conversation",
    USER_IS_TYPING_IN_CONVERSATION : "user_is_typing_in_conversation",
    USER_STOPPED_TYPING_IN_CONVERSATION : "user_stopped_typing_in_conversation",

    /* Client can make special request to check if someone is online */
    IS_USER_ONLINE : "is_user_online",

    /** If one user creates a conversation then other participants needs to join that conversation */
    A_CONVERSATION_HAS_BEEN_CREATED: "a_conversation_has_been_created",

    DISCONNECT: "disconnect",

} as const;


/** Events that will be sent from server to client */
export const CLIENT_EVENTS = {
    RECEIVE_MESSAGE_FROM_CONVERSATION : "receive_message_from_conversation",
    
    /**
     * Clue: client event that starts with YOU or YOUR means only the user will receive the event
     */

    YOU_HAVE_JOINED_CONVERSATION : "joined_conversation",
    YOU_HAVE_DELETED_A_MESSAGE_FROM_CONVERSATION : "you_have_deleted_a_message_from_conversation",

    YOU_HAVE_JOINED_USER_ROOM : "you_have_joined_user_room",
    YOU_HAVE_LEFT_USER_ROOM : "you_have_left_user_room",

    YOU_ARE_INCLUDED_IN_NEWLY_CREATED_CONVERSATION : "you_are_included_in_newly_created_conversation",


    YOUR_REQUESTED_USER_IS_ONLINE : "your_requested_user_is_online",
    YOUR_REQUESTED_USER_IS_OFFLINE : "your_requested_user_is_offline",

    /** The following event is not yet implemented but still can be used in the future if any new feature is needed to implement or to use this as solution to a problem  */
    YOU_HAVE_TO_LEAVE_USER_ROOM : "you_have_to_leave_this_room",

    /** ERROR */
    YOU_NOT_GAVE_USER_ID_FOR_CONNECTION : "you_not_gave_user_id_for_connection",

    /** Clue : Any client events starts with SOMEONE will be broadcasted means user itself will not receive the event */
    SOMEONE_IS_TYPING_IN_CONVERSATION : "someone_is_typing_in_conversation",
    SOMEONE_HAS_STOPPED_TYPING_IN_CONVERSATION : "someone_has_stopped_typing_in_conversation",
    SOMEONE_IS_ONLINE : "someone_is_online",
    SOMEONE_IS_OFFLINE : "someone_is_offline",
    SOMEONE_S_USER_ROOM_SHOULD_BE_JOINED : "someone_s_user_room_should_be_joined"

} as const;


const onConnection = (socket: Socket, io : IoServer) => {

    /** Remember after connection it is important to join this socket to the group of 
     *  <socket.userId> and emit the event  to that group which indicates that this someone who they care about is online
     * 
     *  # Again upon we need to dispatch the event indicating that someone who they care about is offline
     */

    /** Join this user in a room named after his userId */
    //@ts-ignore
    if (socket?.userId && typeof socket?.userId === 'string' && socket?.userId !== 'undefined') {
        //@ts-ignore
        const userRoomId = socket?.userId as string;

        socket.join(userRoomId);
        socket.broadcast.to(userRoomId).emit(CLIENT_EVENTS.SOMEONE_IS_ONLINE, {userId : userRoomId});
    };

    /** ^^^^^^^^^^^ SOCKET EVENTS HANDLERS ^^^^^^^^^^^ */


    /** ------------ Events to send only to the user (socket) ------------ */


    socket.on(
        EVENTS.JOIN_CONVERSATION,
        (props: ConversationBaseProps) => handleJoinConversation(socket, props)
    );

    socket.on(
        EVENTS.JOIN_USER_ROOM,
        (props: Omit<ConversationUserBaseProps, 'conversationId'>) => handleJoinUserRoom(socket, io, props)
    );
    
    socket.on(EVENTS.DELETE_MESSAGE_FROM_CONVERSATION, 
        (props: HandleMessageProps) => handleDeleteMessageFromConversation(socket, props)
    );

    socket.on(
        EVENTS.IS_USER_ONLINE,
        (props: IsUserOnlineProps) => handleIsUserOnline(socket, io, props)
    );

    socket.on(
        EVENTS.LEAVE_USER_ROOM,
        (props: Omit<ConversationUserBaseProps, 'conversationId'>) => handleLeaveUserRoom(socket, props)
    );

    socket.on(
        EVENTS.A_CONVERSATION_HAS_BEEN_CREATED, 
        (props: {conversationData: DataAfterConversationCreation}) => handleNewConversationHasBeenCreated(socket, io, props)
    )

    socket.on(EVENTS.DISCONNECT, () => handleOnDisconnect(socket));

    /** ------------ Events to broadcast ------------ */


    socket.on(
        EVENTS.USER_IS_TYPING_IN_CONVERSATION,
        (props: UserTypingProps) => handleUserIsTypingInConversation(socket, props)
    );

    socket.on(
        EVENTS.USER_STOPPED_TYPING_IN_CONVERSATION,
        (props: UserTypingProps) => handleUserStoppedTypingInConversation(socket, props)
    );

    
    /** ------------ Events to send everybody in the room ------------ */

    socket.on(
        EVENTS.SEND_MESSAGE_TO_CONVERSATION,
        (props: HandleMessageProps) => handleSendMessageToConversation(socket, io, props)
    )

};
const userIdMiddleware = (socket: Socket, next: Function) => {
    const userId = socket?.handshake?.query?.userId;
    if (typeof userId === 'string') {
        //@ts-ignore
        socket.userId = userId;
        next();
    } else {
        socket.emit(CLIENT_EVENTS.YOU_NOT_GAVE_USER_ID_FOR_CONNECTION);
        return next(
            new Error(CLIENT_EVENTS.YOU_NOT_GAVE_USER_ID_FOR_CONNECTION
            )
        )
    }
}

export {
    onConnection,
    userIdMiddleware
};