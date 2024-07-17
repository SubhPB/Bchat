// Byimaan

import { _console } from "@/utils/console";
import { s3Client } from "../client";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'

type PutARGS =  {
    keyName: string,
    expiresIn: number,
    contentType: string
}

interface GeneratePreSignedUrlTS {
    PUT:(args: PutARGS) => Promise<string>
}

class GeneratePreSignedUrl implements GeneratePreSignedUrlTS {
    constructor(private bucketName: string){
        this.bucketName = bucketName
    };

    async GET(KeyName: string, expiresIn: number = 60 * 60 * 2 ){
        // default expiresIn set to 2 hours

        try{
            const cmd = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: KeyName
            });
    
            const getUrl = await getSignedUrl(s3Client, cmd, {expiresIn: expiresIn});
            _console._log.doRed("##### Attention <GET Signed Url> #####");
            _console._log.doGreen(getUrl)
            return getUrl;
        } catch (error) {
            _console._log.doRed(`[FAILED AWS<PRE_SIGNED_URL<GET>>]: operation has failed to get the pre-signed-url `);
            if (error instanceof Error){
                _console._log.doYellow(`[${error.name}]: ${error.message}`)
            }
            throw error;
        };
    }

    async PUT({keyName, contentType, expiresIn}: PutARGS) {
        
        try{
            const cmd = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: keyName,
                ContentType: contentType
            });
            const uploadUrl = await getSignedUrl(s3Client, cmd, {expiresIn: expiresIn});
            _console._log.doRed("##### Attention <Signed Url> #####");
            _console._log.doGreen(uploadUrl)
            return uploadUrl;

        } catch (error) {
            _console._log.doRed(`[FAILED AWS<PRE_SIGNED_URL<PUT>>]: operation has failed to get the pre-signed-url `);
            if (error instanceof Error){
                _console._log.doYellow(`[${error.name}]: ${error.message}`)
            }
            throw error;
        };
    }
};

const generatePreSignedUrlInstance = new GeneratePreSignedUrl(process.env.AWS_BUCKET_NAME!);
export {GeneratePreSignedUrl, generatePreSignedUrlInstance};