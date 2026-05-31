
import React from 'react';
import { GoIcon, PythonIcon, JavaIcon, NetIcon, FlutterIcon, AngularIcon, NextjsIcon, SvelteIcon, VueIcon } from './icons/Icons';

export const TechIcons: React.FC = () => {
    return (
        <div className="mt-4 flex items-center space-x-4 overflow-x-auto pb-2">
            <GoIcon className="w-7 h-7 flex-shrink-0"/>
            <PythonIcon className="w-7 h-7 flex-shrink-0"/>
            <JavaIcon className="w-7 h-7 flex-shrink-0"/>
            <NetIcon className="w-7 h-7 flex-shrink-0"/>
            <FlutterIcon className="w-7 h-7 flex-shrink-0"/>
            <AngularIcon className="w-7 h-7 flex-shrink-0"/>
            <NextjsIcon className="w-7 h-7 flex-shrink-0"/>
            <SvelteIcon className="w-7 h-7 flex-shrink-0"/>
            <VueIcon className="w-7 h-7 flex-shrink-0"/>
            <button className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
