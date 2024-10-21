/** Byimaan */

import {Message, Conversation, Participant, User} from "@prisma/client";

export type ConversationBaseProps = {
    conversationId: string
};

export type ConversationUserBaseProps = ConversationBaseProps & {
    userId: string
}

export type ConversationUsersBaseProps = ConversationBaseProps & {
    userIds: string[]
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
};
export type DataAfterConversationCreation = Conversation & {
    participants: (
        Participant & {
            user: Omit<User, 'password'>
        }
    )[];
    messages: Message[]
}

export type YouAreIncludedInNewlyCreatedConversationProps = {
    conversationData: DataAfterConversationCreation
};

export type IHaveCreatedANewConversationProps = {
    conversationData: DataAfterConversationCreation
} ;
