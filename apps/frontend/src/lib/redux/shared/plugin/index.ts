/**
 * Byimaan
 * 
 * The purpose of the following feature :-
 *      This feature only works with the shared slice
*       This feature will help to plugin the custom logic in the shared slice.
*       e.g:
*           Suppose we made a shared slice by default it have only three actions fechingData, gotError, gotSuccess.
*           Now we are limited to only 3 actions to be used. But if we need to add custom actions along with default ones. 
*           Here this feature comes into play to solve our problem    
 */


import { CustomActions } from "./actions";

/**
 * 
 * Here is an example of how would an developer can plugin the actions in sharedSlice
 * 
 * const plugin = new SlicePlugin()
 * plugin.actionsRecord.register({...userDefinedActions});
 * const sharedSlice = new SharedSlice('user-defined-name', plugin)
 */

class SlicePlugin {
    public actionsRecord = new CustomActions();
    /** More plug-in functionalities could be added in the future */
};

export {SlicePlugin};