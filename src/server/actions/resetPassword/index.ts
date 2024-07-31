// Byimaan

import { db } from "@/lib/db"
import {UUID} from "@/utils/urlFeedback/base64En&Decode"
import {Resend} from "resend"

import PasswordReset from "@/components/email-templates/PasswordReset";
import { hashPassword } from "@/utils/bcrypt";
import { _console } from "@/utils/console";

/**
 * Here is the plan after user clicks on `forgot password` at '/auth/?type=signin'
 * - The values we have : <user>@email
 *  Make a query in db to check whether user have have less then 3 active tokens 
 *      [a] If user have 3 active tokens then refuse the user saying that we are not able to process the request till a specfic time
 *      [b] else (we are now able to generate token):
 *          [b.1] generate token and update in database
 *          [b.2] now send the email with token --> user will link to '/auth/reset_password' by its own
 * 
 * 
 *  So for all these purposes what are the server sctions we need?
 *      1. 
 */

class ResetPasswordActions {

    static async userIsEligibleToHaveToken(email: string){
        try {
            const user = await db.user.findUnique({
                where: {
                    email
                },
                include: {
                    passwordTokens: true
                }
            });

            if (user){
                const activeTokens = user.passwordTokens.filter(
                    token => token.expiresAt.getDate() > Date.now()
                );

                if (activeTokens.length > 3){
                    // not eligible 
                    throw new Error(`Failed!. ${email} is not eligible to request password change and already have ${activeTokens.length} active tokens`)
                };
                
                // Test passed
                return user // <-- userWithAllTokens
            }

        } catch {
            // just continue
        }
        throw new Error(`${email} is not eligible to request password change`)
    };

    static async generateResetToken(userId: string, expiresInHowManyHours = 3){
        
        try {
            const token = UUID.generate();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + expiresInHowManyHours)

            const registerTokeninDB = await db.resetPasswordToken.create({
                data: {
                    userId,
                    token: token,
                    expiresAt: expiresAt
                }
            });

            return registerTokeninDB

        } catch {
            // just continue...
        }

        throw new Error("[5xx] Failed to generate passwrod reset token")
    };

    static async sendResetPasswordEmail({name, email, subject, urlHref}: {name : string, email: string, subject ?: string, urlHref: string}){

        const resendKey = process.env.RESEND_API_KEY!;

        name = name ? name : email.split('@')[0];
        subject = subject ? subject : "[BChat] Password reset request."

        try {
            const resend = new Resend(resendKey);
            const {data, error} = await resend.emails.send({
                from: "BChat <NoReply.bchat@byimaan.ca>",
                to: [
                    `${email}`
                ],
                subject: subject,
                react: PasswordReset({name, href: urlHref, expiresInText: "3 hours",})
            });

            if (error){
                console.log(`[Failed to send email to ${email}] \n`, error.message);
                throw error
            }
            return data
        } catch {
            // just continue
        }

        throw new Error("[Email Failed] The operation to send reset passwrod email got failed")

    };

    static async updateNewPasswordinDB(userId: string, newPassword: string){
        
        try {
            if (newPassword.length < 6){
                throw new Error("New Password is too short.")
            };
            const hashedPassword = await hashPassword(newPassword)
            const updatedUser = await db.user.update({
                where: {
                    id: userId
                }, data: {
                    password: hashedPassword,
                }
            });

            const {password, ...user} = updatedUser;

            return user
        } catch (error) {
            throw error
        };
    };

    static async getTokenAndUserDetails(token: string) {

        return await db.resetPasswordToken.findUnique({
            where: {
                token: token,
            },
            include: {
                user: true
            }
        });
    }
};


export {ResetPasswordActions}
