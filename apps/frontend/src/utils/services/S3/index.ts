/**
 * Byimaan
 */

const NEXT_PUBLIC_AWS_S3_REGION = process.env.NEXT_PUBLIC_AWS_S3_REGION;
const NEXT_PUBLIC_AWS_BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

class S3 {
    static getObjectUrl = (keyName: string) => {
        // console.log("DEBUG ", {
        //     PUBLIC_AWS_S3_REGION, PUBLIC_AWS_BUCKET_NAME
        // })
        return `https://s3.${NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${NEXT_PUBLIC_AWS_BUCKET_NAME}/${keyName}`
    }
};

export {S3};