/**
 * Byimaan
 * 
 * This is sub part of Plugin class
 */

type ActionsObjectType<T={}> = {
    [K in keyof T]: T[K]
}

class CustomActions {

    public actions: ActionsObjectType = {}

    register <T> (actions: T){
        this.actions = actions as ActionsObjectType<T>
    }
};

export {CustomActions};