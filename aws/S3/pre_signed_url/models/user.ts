// Byimaan

import { Session } from "next-auth";
import { generatePreSignedUrlInstance } from "../generate";
import { MilliSeconds } from "@/utils/time";

const MS = new MilliSeconds(Date.now());

async function GeneratePreSignedUrlForProfileImageAndReturnSession(session: Session){
    if (session && session?._user && session?._user.image){
        const image = session._user.image;

        let _session : Session = {...session}

        try {
            const getObjSignedurl = await generatePreSignedUrlInstance.GET(image, 2*60*60);
            _session = {
                ...session,
                preSignedURL: {
                    healthStatus: true,
                    expiresAt: MS.operation.incrementHours(Date.now(), 2),
                    imageUrl: getObjSignedurl
                }
            }
        } catch {
            _session = {
                ...session,
                preSignedURL: {
                    healthStatus: false,
                    expiresAt: Date.now(),
                    imageUrl: '<corrupted!>'
                }
            };

        };
        return _session
    } else {
        throw new Error(`[5xx Generate Profile Img SignedUrl] Invalid function call with incomplete sesion information`);
    }
};

export {GeneratePreSignedUrlForProfileImageAndReturnSession}