// Byimaan
'use client';

import React from 'react';
import toast, { ToastPosition } from 'react-hot-toast';
import clsx from 'clsx';
import { URLFeedback } from '@/utils/urlFeedback';
import { useSearchParams } from 'next/navigation';

type PropsTS = {
    children: React.ReactNode
};

interface FeedbackDataTS {
    body: {textColorCode: string, text: string}[];
    position:ToastPosition;
    bgColorCode: string
};

const URLListenerContext = React.createContext<Function | null>(null)

function Feedback({feedback}: {feedback: FeedbackDataTS}){

    const calcFontSizeValue = (index: number) => {
        if (index < 5){
            return `${1 - index*0.05}rem`
        };
        return "0.75rem"
    };

    return (
        <div className={clsx(' px-4 py-2 space-y-1 text-center text-xl')}>
            {
                feedback.body.map(
                    (bodyPart, index) => (
                        <p className={clsx("w-full font-bold", index && 'font-semibold')} style={{fontSize: calcFontSizeValue(index), color: bodyPart.textColorCode}} key={index}>
                            {bodyPart.text}
                        </p>
                    )
                )
            }
        </div>
    )
}

function URLFeedbackListenser({children}: PropsTS) {

    const searchParams = useSearchParams();
    const allow = React.useRef(true)

    // do not prefer to use it unless required because this component was made just to listen to Url feedbacks
    const toastEncodedFeedback = (encodedString: string) => {
        const feedback = URLFeedback.decode(encodedString);
        feedback && toast(<Feedback feedback={feedback}/>, {
            position: feedback.position,
            style: {
                backgroundColor: feedback.bgColorCode
            }
        })
    };

    React.useEffect(
        () => {
            const feedbackParam = searchParams.get('feedback');
            if (feedbackParam && allow.current){
                toastEncodedFeedback(feedbackParam);
                allow.current = false
            };
        }, [searchParams, searchParams.get('feedback')]
    );

    return (
        <URLListenerContext.Provider value={toastEncodedFeedback}>
            {children}
        </URLListenerContext.Provider>
    )
};


const useFeedbackToast = () => {
    const context = React.useContext(URLListenerContext);
    if (!context){
        throw new Error("[URLListener Context Error] useFeedbackToast cannot be invoked outside the URLListener provider's scope")
    };
    return context;
} 
    

export default URLFeedbackListenser;
export {useFeedbackToast}