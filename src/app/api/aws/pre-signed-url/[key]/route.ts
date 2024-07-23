// Byimaan

import { _console } from "@/utils/console";
import { NextResponse } from "next/server";
import { RedisApiEndpoint } from "@/utils/consts";
import { generatePreSignedUrlInstance } from "../../../../../../aws/S3/pre_signed_url/generate";

type ArgsTS = {
    params: {
        key: string
    }
}

export async function GET(req: Request, args: ArgsTS){
   
    const url = new URL(req.url);
    let key = args.params?.key || url.searchParams.get('key') || req.headers.get('key')

    if (!key){
        return new NextResponse("Bad request. 'Key' is missing", {status: 400})
    };

    // const MS = new MilliSeconds()
    try {
        key = encodeURIComponent(key)
        _console._log.doYellow("Endpoint :- ", `${RedisApiEndpoint}/${key}`)
        const cachedResponse = await fetch(`${RedisApiEndpoint}/${key}`);
        if (cachedResponse.ok){
            const signedUrl = await cachedResponse.json();
            return NextResponse.json(signedUrl)
        } else {
            const expiresIn = 2 * 60 * 60 // 2 hours
            const signedUrl = await generatePreSignedUrlInstance.GET(decodeURIComponent(key), expiresIn);
            if (signedUrl){
                // now let the redis know about it 
                await fetch(RedisApiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        key: key,
                        value: signedUrl,
                        ex: expiresIn
                    })
                });
                    
            };
            return NextResponse.json(signedUrl);
        }
    } catch (error) {
        _console._log.doRed(`${error instanceof Error ? `${error.name} \n ${error.message}` : "Server error"}`)
        _console._log.doYellow(error)
        return new NextResponse(`${error instanceof Error ? error.message : "Server error"}`, {status: 500})
    }
}