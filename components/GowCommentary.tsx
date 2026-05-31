import React, { useState, useEffect } from 'react';
import { GowHeadIcon } from './icons/Icons';

const comments = [
    "वाह! क्या आइडिया है! ये तो दूध-धार होगा!",
    "इसे और मज़ेदार बना सकते हैं...",
    "मेरे खुर टाइप करने के लिए तैयार हैं!",
    "चलो कुछ तूफानी करते हैं!",
    "यह वेबसाइट तो मक्खन जैसी बनेगी!",
    "एकदम legen-dairy आइडिया है!",
];

export const GowCommentary: React.FC = () => {
    const [comment, setComment] = useState(comments[0]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Appear after a short delay
        const appearTimeout = setTimeout(() => setIsVisible(true), 500);

        // Cycle through comments
        const commentInterval = setInterval(() => {
            const currentIndex = comments.indexOf(comment);
            const nextIndex = (currentIndex + 1) % comments.length;
            setComment(comments[nextIndex]);
        }, 5000);

        return () => {
            clearTimeout(appearTimeout);
            clearInterval(commentInterval);
        };
    }, [comment]);

    return (
        <div 
            className={`fixed bottom-5 right-5 flex items-end space-x-2 z-20 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ maxWidth: '250px' }}
        >
            <div className="bg-white rounded-xl rounded-br-none border-2 border-gray-400 p-3 shadow-lg relative">
                <p className="text-gray-800 text-sm font-medium">{comment}</p>
                <div className="absolute bottom-0 right-[-10px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[15px] border-t-white" style={{ filter: 'drop-shadow(1px 1px 0 #a0a0a0)' }}></div>
                <div className="absolute bottom-0 right-[-13px] w-0 h-0 border-l-[12px] border-l-transparent border-t-[18px] border-t-gray-400 -z-10"></div>
            </div>
            <GowHeadIcon className="w-24 h-auto flex-shrink-0" />
        </div>
    );
};
