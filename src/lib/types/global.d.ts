// Byimaan

import { User } from '@prisma/client';
import { Session } from 'inspector';
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        _user: null | Omit<User, 'password'>,
    };

    interface JWT {
        _user: null | Omit<User, 'password'>
    }
}