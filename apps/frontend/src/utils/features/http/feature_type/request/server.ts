// Byimaan

// Server means these features will be used by the server side (nextjs backend)


import { toastType, toastPositions, UserFriendlyData } from "../types";

class Server {
    
    constructor (private request: Request){
        this.request = request;
    };

    /** All the features here */
    getUserFriendlyObject(){
        return new UserFriendlyObject()
    };
    
};


type AddToastObjectTS = {
    message: string;
    type ?: (typeof toastType[number]);
    position ?: (typeof toastPositions[number])
};

class UserFriendlyObject {
    private object : {
        [key: string] : {}
    } = {} as Partial<UserFriendlyData>;

    addToastObject({message, type='ERROR', position='top-center'} : AddToastObjectTS){
        this.object['toast'] = {
            type, 
            message,
            position
        } as Required<AddToastObjectTS>;
        return this
    };

    create(){
        return this.object as Partial<UserFriendlyData>
    }
}

export {Server}