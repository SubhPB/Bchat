/**
 * Byimaan
 */

import { Message } from "@prisma/client";

import { Socket, Server as IoServer } from "socket.io";
import { CLIENT_EVENTS } from ".";

import { DataAfterConversationCreation } from "./type";

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
    message: Message,
}

export type UserTypingProps = ConversationUserBaseProps & ConversationParticipantBaseProps

export type IsUserOnlineProps = {
    userId: string;
}

const DebugLines = [ 41, 82]

/** ------------ Events to send everybody in the room ------------ */

const handleSendMessageToConversation = (socket: Socket, io: IoServer, props:HandleMessageProps) => {
    const conversationId = props?.conversationId ?? props.message.conversationId;
    if (typeof conversationId === 'string') {
        /** not broadcast send to all participant including sender according to the frontend logic*/
        //@ts-ignore
        io.in(conversationId).emit(CLIENT_EVENTS.RECEIVE_MESSAGE_FROM_CONVERSATION, props);
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
        /**
         * Suppose the other users in chat are not aware that this user who just joined is online if they are subscribed to user's personal room.
         * Let them know that they should join this user's room.
         * Dispatch  SOMEONE_S_USER_ROOM_SHOULD_BE_JOINED for the remaining users
         */


        socket.broadcast.to(conversationId).emit(
            CLIENT_EVENTS.SOMEONE_S_USER_ROOM_SHOULD_BE_JOINED, {
                //@ts-ignore
                userId: socket?.userId
            } 
        )
    };
};

const handleJoinUserRoom = (socket: Socket, io: IoServer, {userId}: Omit<ConversationUserBaseProps, 'conversationId'>) => {
    /** userId is the name of the room */
    //@ts-ignore
    const isItUserItself = socket?.userId === userId, roomName = userId;
    const roomExists = io.sockets.adapter.rooms.has(roomName);

    /** This user himself can't intentionally join his own room. Upon socket connection this is backend's responsibilty to automatically join him in his own room */
    /** Outsiders can only join this room if this room exists */
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
        /** Since the if main user has left his room, So at the client side we will implement a event of `LEAVE_USER_ROOM` so that room can get empty*/
        /** Just for consistency we  will still dispatch YOU_HAVE_TO_LEAVE_USER_ROOM*/
        socket.broadcast.to(userRoomId).emit(CLIENT_EVENTS.YOU_HAVE_TO_LEAVE_USER_ROOM, {userId : userRoomId});
        
        socket.leave(userRoomId);
    };
};

// continue from here... 
const handleNewConversationHasBeenCreated = (socket: Socket, io: IoServer, conversationData: DataAfterConversationCreation) =>{

    /**
     * Tasks:
     * [1] After conversation creation we need to let the participants know that they are been included in the conversation
     * [2] We would need to pass them that entire conversation which they can update their redux state
     */
    const {id, participants, messages} = conversationData;
    
    if (typeof id === 'string' && Array.isArray(participants)) {
        
        for(let i = 0; i < participants.length; i++){
            const participant = participants[i];
            
            if (participant){
                const {userId} = participant;

                // No corrupted data allowed.
                if (typeof userId !== 'string') break;

                const participantOwnIORoom = io.sockets.adapter.rooms.get(userId);
                const participantIsNotOnline = !participantOwnIORoom;

                // our concern is only those who are online
                if (participantIsNotOnline) continue;

                let participantSocket : Socket | null = null;
                
                // participantOwnIoRoom can include other users too who have joined original user's room.
                Array.from(participantOwnIORoom).find(
                    socketID => {
                        //@ts-ignore
                        const socket : Socket | null = io.sockets.sockets.get(socketID)?.(userId as string) ?? null;
                        if (socket){
                            participantSocket = socket;
                            return true
                        };
                        return false
                    }
                );

                if (participantSocket){
                    // Informing the user that they are included in conversation by sending them this event
                    socket.emit(
                        CLIENT_EVENTS.YOU_ARE_INCLUDED_IN_NEWLY_CREATED_CONVERSATION,
                        {conversationData}
                    )
                }
            }
            
        };
    }
}

export const socketEventHandlers = {
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
};

