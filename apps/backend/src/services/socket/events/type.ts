// Byimaan

import { Conversation, Message, Participant, User } from "@repo/db/src";


export type DataAfterConversationCreation = Conversation & {
    participants: (
        Participant & {
            user: Omit<User, 'password'>
        }
    )[];
    messages: Message[]
}