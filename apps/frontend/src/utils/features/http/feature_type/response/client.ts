// Byimaan

import toast from 'react-hot-toast';

import { ToastData, UserFriendlyData } from '../types';

// Client means these feature will used by the  frontend or client side (react);
class Client {
    constructor (private response: Response){
        this.response = response
    };

    /** All the feature write here  */

    static useToast({message, position='top-center', type='ERROR'}: Partial<ToastData>){
        if (!message){
            return () => ''
        }
        try {
            const resToast = type === 'SUCCESS'? toast.success : toast.error;
            return () => resToast(message, { position });
        } catch {
            return () => toast.error("An internal server error happened to display the message");
        }
    }

};

export {Client}