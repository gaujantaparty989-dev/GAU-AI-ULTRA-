import React from 'react';

type IconProps = {
  className?: string;
};

export const GowHeadIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M85 30 C 85 55, 65 65, 50 65 C 35 65, 15 55, 15 30 C 15 5, 35 5, 50 5 C 65 5, 85 5, 85 30 Z" fill="#fff" stroke="#4a4a4a" strokeWidth="4"/>
    <path d="M40 45 C 45 55, 55 55, 60 45" fill="none" stroke="#4a4a4a" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="35" cy="30" r="5" fill="#4a4a4a"/>
    <circle cx="65" cy="30" r="5" fill="#4a4a4a"/>
    <path d="M20 15 Q 10 0, 30 5" fill="#4a4a4a"/>
    <path d="M80 15 Q 90 0, 70 5" fill="#4a4a4a"/>
    <ellipse cx="50" cy="65" rx="25" ry="10" fill="#FFC0CB" stroke="#4a4a4a" strokeWidth="4"/>
  </svg>
);


export const CowIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.8 8.01c0 4.4-3.4 8.6-7.5 8.6-3.1 0-5.8-2.3-6.9-5.3.3-1.5 1.5-3.2 3.1-4.6 2-1.8 4.2-2.7 6.3-2.7 1 0 1.9.2 2.7.5V8.01z" />
        <path d="M5.2 13.5c-.3 0-.6.2-.7.5l-.2 1.2c0 .3.2.5.5.5h.3c.3 0 .5-.2.5-.5v-1.2c0-.3-.2-.5-.4-.5zM7.6 13.2c-.3 0-.6.2-.7.5l-.2 1.2c0 .3.2.5.5.5h.3c.3 0 .5-.2.5-.5v-1.2c0-.3-.2-.5-.4-.5z" />
        <path d="M12.7 13.2c-.3 0-.6.2-.7.5l-.2 1.2c0 .3.2.5.5.5h.3c.3 0 .5-.2.5-.5v-1.2c0-.3-.2-.5-.4-.5z" />
        <path d="M15.1 13.5c-.3 0-.6.2-.7.5l-.2 1.2c0 .3.2.5.5.5h.3c.3 0 .5-.2.5-.5v-1.2c0-.3-.2-.5-.4-.5z" />
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M17.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
        <path d="M18.8 8h-2.5c-1.3 0-2.3-1.2-2.3-2.5V3" />
        <path d="M18.8 8c0-3-1.6-5.3-4-6.3" />
    </svg>
);

export const ChatBubbleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 008.775 22.5h6.45a8.25 8.25 0 008.25-8.25V8.25a8.25 8.25 0 00-8.25-8.25H8.25a8.25 8.25 0 00-8.25 8.25v6.45c0 2.454.992 4.706 2.615 6.36l.006.007.032.032.007.006a.75.75 0 00.998-.06zM12 10.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 11.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 11.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
    </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const UserProfileIcon: React.FC<IconProps> = ({ className }) => (
  <img src="https://picsum.photos/seed/user/32/32" alt="User profile" className={`rounded-full ${className}`} />
);

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);


export const MoreHorizontalIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
  </svg>
);

export const RadioButtonIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 00-1.635-1.634l-1.188-.648 1.188-.648a2.25 2.25 0 001.635-1.634l.648-1.188.648 1.188a2.25 2.25 0 001.635 1.634l1.188.648-1.188.648a2.25 2.25 0 00-1.635 1.634z" />
    </svg>
);


export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" />
    </svg>
  );

export const ToolsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const MicIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

export const PenIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const BulbIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a3 3 0 00-3-3 3 3 0 00-3 3.031M12 12.75a3 3 0 013-3 3 3 0 013 3.031m-6 0a3 3 0 00-3 3v2.25m6-2.25a3 3 0 013 3v2.25m0 0h-12m12 0a2.25 2.25 0 002.25-2.25v-2.25a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 13.5v2.25a2.25 2.25 0 002.25 2.25h15.001z" />
    </svg>
);

export const CompassIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 8.09l-2.12 5.64-5.64 2.12 2.12-5.64 5.64-2.12z" />
    </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const CodeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
);

export { GoIcon } from './GoIcon';
export { PythonIcon } from './PythonIcon';
export { JavaIcon } from './JavaIcon';
export { NetIcon } from './NetIcon';
export { FlutterIcon } from './FlutterIcon';
export { AngularIcon } from './AngularIcon';
export { NextjsIcon } from './NextjsIcon';
export { SvelteIcon } from './SvelteIcon';
export { VueIcon } from './VueIcon';