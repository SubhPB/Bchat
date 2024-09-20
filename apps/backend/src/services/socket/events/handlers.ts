/**
 * Byimaan
 */

import { Message } from "@prisma/client";

import { Socket, Server as IoServer } from "socket.io";
import { CLIENT_EVENTS } from ".";

export type ConversationBaseProps = {
    conversationId: string
};

export type ConversationUserBaseProps = ConversationBaseProps & {
    userId: string
}

export type ConversationParticipantBaseProps = ConversationBaseProps & {
    participantId: string
}

export type HandleMessageProps =  {
    conversationId ?: string
    message: Omit<Message, "updatedAt" | "deletedBy" >,
}

export type UserTypingProps = ConversationUserBaseProps & ConversationParticipantBaseProps

export type IsUserOnlineProps = {
    userId: string;
}

/** ------------ Events to send everybody in the room ------------ */

const handleSendMessageToConversation = (socket: Socket, props:HandleMessageProps) => {
    const conversationId = props?.conversationId ?? props.message.conversationId;
    if (typeof conversationId === 'string') {
        /** not broadcast send to all participant including sender according to the frontend logic*/
        socket.to(conversationId).emit(CLIENT_EVENTS.RECEIVE_MESSAGE_FROM_CONVERSATION, props);
    };
};


/** ------------ Events to broadcast ------------ */

const handleUserIsTypingInConversation = (socket: Socket, props: UserTypingProps) => {
    if (typeof props.conversationId === 'string') {
        socket.broadcast.to(props.conversationId).emit (CLIENT_EVENTS.SOMEONE_IS_TYPING_IN_CONVERSATION ,
            {
                ...props,
                // @ts-ignore
                userId: socket?.userId ?? props.userId
            }
        );
    };
};


const handleUserStoppedTypingInConversation = (socket: Socket, props: UserTypingProps) => {
    if (typeof props.conversationId === 'string') {
        socket.broadcast.to(props.conversationId).emit (CLIENT_EVENTS.SOMEONE_HAS_STOPPED_TYPING_IN_CONVERSATION , props);
    };
};


/** ------------ Events to send only to the user (socket) ------------ */

const handleDeleteMessageFromConversation = (socket: Socket, props: HandleMessageProps) => {
    const conversationId = props?.conversationId ?? props.message.conversationId;
    if (typeof conversationId === 'string') {
        /** not broadcast just send to all participant including sender according to the frontend logic*/
        socket.emit(CLIENT_EVENTS.YOU_HAVE_DELETED_A_MESSAGE_FROM_CONVERSATION, props);
    };
};

const handleJoinConversation = (socket: Socket, {conversationId}: ConversationBaseProps) => {
    if (typeof conversationId === 'string' && !socket.rooms.has(conversationId)) {
        socket.join(conversationId);
        socket.emit(CLIENT_EVENTS.YOU_HAVE_JOINED_CONVERSATION, {conversationId} )
    };
};

const handleJoinUserRoom = (socket: Socket, io: IoServer, {userId}: Omit<ConversationUserBaseProps, 'conversationId'>) => {
    /** userId is the name of the room */
    //@ts-ignore
    const isItUserItself = socket?.userId === userId, roomName = userId;
    const roomExists = io.sockets.adapter.rooms.has(roomName);

    /** This user himself can't intentionally join his own room. Upon socket connection this is backend's responsibilty to automatically join him in his own room */
    /** Outsiders can only join this room if this rrom exists */
    if (typeof userId === 'string' && !isItUserItself && !socket.rooms.has(roomName) && roomExists ) {
        socket.join(userId);
        socket.emit(CLIENT_EVENTS.YOU_HAVE_JOINED_USER_ROOM, {userId} );
        socket.emit(CLIENT_EVENTS.YOUR_REQUESTED_USER_IS_ONLINE, {userId} );
    } else {
        socket.emit(CLIENT_EVENTS.YOUR_REQUESTED_USER_IS_OFFLINE, {userId} );
    }
};

const handleIsUserOnline = (socket: Socket, io: IoServer, {userId}: IsUserOnlineProps) => {
    const roomIdAsUserId = userId;
    if (typeof roomIdAsUserId === 'string') {
        const room  = io.sockets.adapter.rooms.get(roomIdAsUserId);
        if (room) {
            socket.emit(CLIENT_EVENTS.YOUR_REQUESTED_USER_IS_ONLINE, {userId});
            //@ts-ignore
            const userNeedToJoinThisRoom = !room.has(socket.id) && roomIdAsUserId !== socket?.userId;
            if (userNeedToJoinThisRoom){
                socket.join(roomIdAsUserId);
                socket.emit(CLIENT_EVENTS.YOU_HAVE_JOINED_USER_ROOM, {userId});
            }
        } else {
            /** If no room is found, it means that the user is offline */
            socket.emit(CLIENT_EVENTS.YOUR_REQUESTED_USER_IS_OFFLINE, {userId});
        }
    } 
};


const handleLeaveUserRoom = (socket: Socket, {userId}: Omit<ConversationUserBaseProps, 'conversationId'>) => {
    
    const roomIdAsUserId = userId;
    //@ts-ignore
    const isItUserItself = socket?.userId === userId;

    if (typeof roomIdAsUserId === 'string' && socket.rooms.has(roomIdAsUserId) && !isItUserItself) {
        socket.leave(roomIdAsUserId);
        socket.emit(CLIENT_EVENTS.YOU_HAVE_LEFT_USER_ROOM, {userId} );
    }
};

const handleOnDisconnect = (socket: Socket) => {
    //@ts-ignore
    if (socket?.userId && typeof socket?.userId === 'string') {
        //@ts-ignore
        const userRoomId = socket?.userId as string;
        /** Let the other user know that the user is going to offline */
        socket.broadcast.to(userRoomId).emit(CLIENT_EVENTS.SOMEONE_IS_OFFLINE, {userId : userRoomId});
        socket.leave(userRoomId);
        /** Since the if main user has left his room, So at the client side we will implement a event of `LEAVE_USER_ROOM` so that room can get empty*/
        /** Just for consistency we  will still dispatch YOU_HAVE_TO_LEAVE_USER_ROOM*/
        socket.broadcast.to(userRoomId).emit(CLIENT_EVENTS.YOU_HAVE_TO_LEAVE_USER_ROOM, {userId : userRoomId});
    };
};

export const socketEventHandlers = {
    handleSendMessageToConversation,
    handleUserIsTypingInConversation,
    handleUserStoppedTypingInConversation,
    handleDeleteMessageFromConversation,
    handleJoinConversation,
    handleJoinUserRoom,
    handleIsUserOnline,
    handleLeaveUserRoom,
    handleOnDisconnect
};

