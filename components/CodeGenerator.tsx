

import React from 'react';
import { AppState, AppMode } from '../types';
import { CodeEditor } from './CodeEditor';

const statusMessages: Record<AppMode, Record<AppState, string>> = {
  [AppMode.NORMAL]: {
    [AppState.GENERATING]: "AI is writing the code for your application...",
    [AppState.GENERATING_IMAGES]: "AI is generating unique images for your application...",
    [AppState.EDITING]: "AI is applying your requested changes...",
    [AppState.IDLE]: "Ready to generate.",
    [AppState.GENERATED]: "Generation complete.",
  },
  [AppMode.GOW]: {
    [AppState.GENERATING]: "गउ माता आपके लिए कोड लिख रही हैं...",
    [AppState.GENERATING_IMAGES]: "गउ माता आपकी वेबसाइट के लिए मज़ेदार छवियाँ बना रही हैं...",
    [AppState.EDITING]: "गउ माता आपके अनुरोधित परिवर्तन लागू कर रही हैं...",
    [AppState.IDLE]: "उत्पन्न करने के लिए तैयार।",
    [AppState.GENERATED]: "निर्माण सम्पन्न।",
  },
};

// Fix: Defined the props interface for the CodeGenerator component.
interface CodeGeneratorProps {
  code: string;
  appState: AppState;
  appMode: AppMode;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ code, appState, appMode }) => {
  const message = statusMessages[appMode][appState] || "Please wait...";

  return (
    <div className="bg-neutral-950 text-neutral-200 font-mono rounded-xl border border-neutral-900 overflow-hidden animate-fade-in flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-neutral-900 px-4 py-2 flex-shrink-0">
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Document Editor</p>
        <p className="text-[10px] text-neutral-400">output.html</p>
        <div></div>
      </div>
      <div className="flex-grow overflow-auto bg-neutral-950">
        <CodeEditor code={code} />
      </div>
      <div className="border-t border-neutral-900 px-4 py-2 text-[10px] text-neutral-500 uppercase tracking-wider text-center flex-shrink-0 bg-neutral-950">
        {message}
      </div>
    </div>
  );
};