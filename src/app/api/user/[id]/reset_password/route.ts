// Byimaan

import {CreateEmailResponseSuccess} from "resend"

import { _console } from "@/utils/console";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { ResetPasswordActions } from "@/server/actions/resetPassword";


type ArgsTS = {
    params: {
        id: string
    }
}

/**
 * 
 */

export async function POST(_req: Request, args: ArgsTS){

    let email = decodeURIComponent(args.params.id);

    if (!email || !email.includes("@") || !email.includes('.')){
        return NextResponse.json({
            "feedback" : "The given email is not valid."
        }, {status: 400})
    };

    let userWithTokenDetail : undefined | Prisma.PromiseReturnType<typeof ResetPasswordActions.userIsEligibleToHaveToken>;

    try {
        // check user eligiblity
        userWithTokenDetail = await ResetPasswordActions.userIsEligibleToHaveToken(email);
        _console._log.doGreen("Test passed: User is eligible to request token.")

    } catch (error) {
        let feedback = `${email} is not eligible to request password change`
        if (error instanceof Error){
            feedback = error.message
        }
        return NextResponse.json({
            "feedback": feedback
        }, {
            status: 403
        })
    };

    // here are totally sure that userWithTokensDetail contains some value
    // now is the time to generate token and register that into db

    let tokenDetails : undefined | Prisma.PromiseReturnType<typeof ResetPasswordActions.generateResetToken>

    try {
        tokenDetails = await ResetPasswordActions.generateResetToken(userWithTokenDetail.id);
        _console._log.doGreen("Test Passed: A token has been generated for the user to reset password")
    } catch {
        return NextResponse.json({
            "feedback": "Oops! Due to an internal server error your request has been failed. Please try again later"
        }, {
            status: 500
        })
    };

    let sentEmailData : null | CreateEmailResponseSuccess = null;
    // here now we have token and the next task is to send the email.
    try {
        let urlHref = process.env.NEXT_PUBLIC_URL!;
        if (!urlHref){
            throw new Error("Public url of application is not configured in the environment variables.")
        };
        urlHref += `/auth/reset_password?token=${encodeURIComponent(tokenDetails.token)}&email=${encodeURIComponent(email)}`
        sentEmailData = await ResetPasswordActions.sendResetPasswordEmail({
            name: userWithTokenDetail.name,
            email: userWithTokenDetail.email,
            urlHref: urlHref,
        })
        _console._log.doGreen("Test passed, An email has been sent to the user ")
    } catch {
        return NextResponse.json({
            "feedback": `Oops! Email is not sent to ${userWithTokenDetail.email} Due to an internal server error. We are failed to deliver email to you. Please try again later`
        }, {
            status: 500
        })
    };

    return NextResponse.json({
        "feedback": `An email rquired to update your password has been sent to ${userWithTokenDetail.email}. Make sure to update your password before it gets expired.`
    }, {
        status: 202
    })
};
