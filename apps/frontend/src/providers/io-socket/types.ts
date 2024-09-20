/** Byimaan */

import {Message} from "@prisma/client";

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