// Byimaan

import { User } from '@prisma/client';
import { Session } from 'inspector';
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        _user: null | Omit<User, 'password'>,
        preSignedURL ?: {
            expiresAt: number,
            imageUrl: string,
            healthStatus: boolean,
        }
    };

    interface JWT {
        _user: null | Omit<User, 'password'>
    }
}