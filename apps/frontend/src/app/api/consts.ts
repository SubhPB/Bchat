/**
 * BYIMAAN
 */
const WHERE_IAM = "src/app/api";
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL!;

const SRC_APP_API = {
    address: WHERE_IAM,

    subRoutes: {
        auth: WHERE_IAM + "/auth",
        authentication: {
            address: WHERE_IAM + "/authentication",
            subRoutes: {
                login: {
                    address: WHERE_IAM + "/authentication" + "/login"
                },
                register: {
                    address: WHERE_IAM + "/authentication" + "/register",
                    minLengthOfPassword: 6,
                    minLenghOfUsername: 4
                },
                forgot_password: {
                    address: WHERE_IAM + "/authentication" + "/forgot_password",
                    token: {
                        /**
                         * This field is useful for the other api routes who wants to create a access_token and then sent to this route as recipient. 
                         */
                        expiresInSeconds: 10*60, // Ten minutes & means if any route e.g '/api/authentication/login' wants to create a access_token for this route then set its expiry according to the given value in seconds. 
                        expiresIn: `${10*60}s` // JWT format
                    },
                    subRoutes: {
                        access_token: {
                            address:  WHERE_IAM + "/authentication" + "/forgot_password" + "/access_token",
                            maxNumberoOfEmailsAllowedToSend: 2,
                            resetToken: {
                                /**
                                 * If need to create to reset_token then use the following info set the expiry of that reset_token
                                 */
                                expiresInSeconds : 3 * 60 * 60, // 3 hour
                                expiresIn: `${3 * 60 * 60}s`, //JWT format
                                expiresInUserFriendlyText: `${3} hours`
                            }
                        }
                    }
                } as const,
            }
        },
        bchat: {
            address: WHERE_IAM + "/bchat",
            subRoutes: {
                contact: {
                    address: WHERE_IAM + "/bchat" + "/contact",
                    minLengthOfContactName: 4
                }
            }
        }
    },
} as const;

const SRC_APP_API_EXTERNAL_AFFAIRS = {
    SRC_LIB_AUTH: {
        address: "src/lib/auth",
        token : {
            expiresInSeconds: 120, // 2 min & means if any route lies under WHERE_IAM wants to create an access_token for 'src/lib/auth' then its value to as given.
            expiresIn: `${120}s` // JWT friendly format
        }
    },
    SRC_APP_AUTHENTICATION__FORMS_LOGIN: {
        address: "src/app/authentication/_forms/login",
    },
    SRC_APP_AUTHENTICATION_FORGOT_PASSWORD: {
        address: "src/app/authentication/forgot_password",
        webPath: NEXT_PUBLIC_URL + "/authentication/forgot_password"
    }
} as const;

const SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD = SRC_APP_API.subRoutes.authentication.subRoutes.forgot_password;
const SRC_APP_API_AUTENTICATION_LOGIN = SRC_APP_API.subRoutes.authentication.subRoutes.login;
const SRC_APP_API_AUTENTICATION_REGISTER = SRC_APP_API.subRoutes.authentication.subRoutes.register
const SRC_APP_API_BCHAT = SRC_APP_API.subRoutes.bchat;

export {
    SRC_APP_API,
    SRC_APP_API_EXTERNAL_AFFAIRS,
    SRC_APP_API_AUTENTICATION_FORGOT_PASSWORD,
    SRC_APP_API_AUTENTICATION_LOGIN,
    SRC_APP_API_AUTENTICATION_REGISTER,
    SRC_APP_API_BCHAT 
};
