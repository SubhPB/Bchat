/**
 * Byimaan
 * 
 * In this server action we will create a pre_signed_url which will allow user to upload profile image at S3
 */

'use server';

import { generatePreSignedUrlInstance } from "../../../../../aws/S3/pre_signed_url/generate";

/** Folder hierarchy logic --> public/app/[model_name]/[model_object_id]/[model_object_keyName].(jpeg | any-file-type)*/
const S3_UPLOAD_ROOT_FOLDER_PATH = 'public/app/user'
const SIGNED_URL_EXPIRES_IN_SECS = 2 * 60;

type Props = {
    contentType: string,
    userId: string,
    fileName ?: string
}


/** 
 * This will be uploaded at S3 --> public/app/user/[userId]/[fileName]
 * It will following this structure of --> public/app/{model_name}/{model_object_id}/{model_object_keyName}.(jpeg or any-file-type)
 */
export async function generatePUTPreSignedUrlForProfileImgUpload ({contentType, userId, fileName='image'}:Props){
    if (!fileName.includes('.')) {
        const fileType = contentType.split('/')[1];
        fileName = `${fileName}.${fileType}`;
    }
    const keyName = S3_UPLOAD_ROOT_FOLDER_PATH + `/${userId}/${fileName}`;
    const signedUrl = await generatePreSignedUrlInstance.PUT({keyName, expiresIn: SIGNED_URL_EXPIRES_IN_SECS, contentType})
    return {signedUrl, keyName}
}