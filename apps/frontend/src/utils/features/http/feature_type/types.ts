// Byimaan

export const toastPositions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
] as const;

export const toastType = [
    "ERROR",
    "SUCCESS",
] as const;


// type HTTPResponse = {
//     /**
//      * For the future reference
//      */
// };



export type ToastData = {
    type: typeof toastType[number];
    position: typeof toastPositions[number];
    message: string
};

export type UserFriendlyData = { 
    toast: ToastData
};

export type ResponseBody = { 
    userFriendlyData: UserFriendlyData
};

