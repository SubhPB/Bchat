// Byimaan

import { _console } from "../console";
import { base64Decode, base64Encode } from "./base64En&Decode";


interface CodecTS {
    encodeProps : {colorCode: string, body: string, position: string}
};

interface FeedbackDataTS {
    body: {textColorCode: string, text: string}[];
    position: string;
    bgColorCode: string
}

class Codec {
    static encode({colorCode, body, position}: CodecTS['encodeProps']){
        // colorCode.<[ textColorCode-textBody : textColorCode-textBody: so on... ]>.position
        let feedback = colorCode + '.' + body + '.' + position;
        feedback = base64Encode(feedback);
        return encodeURIComponent(feedback)
        
    };
    static decode(feedback: string): FeedbackDataTS{
        /**
         * Tasks :- reverse enginering of encode
        */
       
       feedback = decodeURIComponent(feedback);
       feedback = base64Decode(feedback);
       
       const [bgColorCode, bodyInString, position] = feedback.split('.');
       
       let body: FeedbackDataTS['body'] = [];
       
       bodyInString.split(":").forEach(
           (bodyPart) => {
               const [textColorCode, text] = bodyPart.split("-");
               body.push({
                   textColorCode, 
                   text
                })
            }
        );
        
        return {
            bgColorCode,
            body,
            position
        }
        
    }
};

const toastPositions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
] as const;

class URLFeedback {
    private colorCode='#FFFFFF';
    private textColorCode='#330000'
    private body='';
    protected position='top-center';

    addColorCode(colorCode: string){
        this.colorCode = colorCode;
        return this
    };

    addText(text: string, textColor:string= this.textColorCode){
        if (this.body.at(-1) !== ':'){
            this.body += ':'
        }
        this.body = textColor + "-" + text;
        return this;
    };

    addTextColor(colorCode: string){
        this.textColorCode = colorCode
        return this
    }

    addPostion(position: string){
        if (position in toastPositions){
            this.position = position;
        }
        return this;
    };

    encode(){
        return Codec.encode({
            colorCode: this.colorCode,
            body: this.body,
            position: this.position
        });
    };

    static decode(feedback: string){
        try {
            return Codec.decode(feedback);
        } catch (error) {
            _console._log.doRed("Failed to decode the URLFeedback!");
            if (error instanceof Error){
                _console._log.doYellow(`[URLFeedback Decode Error]: \n ${error.message}`)
            };
            return null
        }
    };

};

export {toastPositions, URLFeedback};
