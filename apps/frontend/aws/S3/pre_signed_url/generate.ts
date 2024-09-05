/**
 * Byimaan
 * 
 * At the moment we need pre_signed_url only for PUT request
 */

import { s3Client } from "../client";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

type PUTArgs =  {
    keyName: string,
    expiresIn: number,
    contentType: string
}


interface GeneratePreSignedUrlTS {
    PUT:(args: PUTArgs) => Promise<string>
}

class GeneratePreSignedUrl implements GeneratePreSignedUrlTS {
    constructor (private bucketName: string){
        this.bucketName = bucketName
    };

    async PUT({keyName, expiresIn, contentType}: PUTArgs){

        const cmd = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: keyName,
            ContentType: contentType
        });
        const preSignedUrl = await getSignedUrl(s3Client, cmd, {expiresIn})

        return preSignedUrl;
    }
};

const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!;
const generatePreSignedUrlInstance = new GeneratePreSignedUrl(bucketName);

export {GeneratePreSignedUrl, generatePreSignedUrlInstance};