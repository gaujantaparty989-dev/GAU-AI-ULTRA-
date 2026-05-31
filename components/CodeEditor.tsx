import React, { useEffect, useState } from 'react';
import { CopyIcon, CheckIcon } from './icons/Icons';

// This is a global, so we declare it to satisfy TypeScript
declare const Prism: any;

interface CodeEditorProps {
  code: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);
  const placeholder = "Awaiting generated code...";
  const displayCode = code || placeholder;

  // Run Prism highlighting after the component mounts and when the code changes.
  useEffect(() => {
    if (typeof Prism !== 'undefined') {
      // Defer to allow React to render first
      const timer = setTimeout(() => Prism.highlightAll(), 0);
      return () => clearTimeout(timer);
    }
  }, [displayCode]);
  
  const handleCopy = () => {
    if (code) { // Only copy if there's actual code, not placeholder
      navigator.clipboard.writeText(code).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy code: ', err);
      });
    }
  };

  return (
    <div className="relative h-full">
      <button
        onClick={handleCopy}
        disabled={!code}
        className="absolute top-4 right-4 z-10 flex items-center px-3 py-1.5 bg-gray-700/80 text-gray-200 rounded-lg text-xs font-medium hover:bg-gray-600 transition-colors backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Copy code"
      >
        {isCopied ? (
          <>
            <CheckIcon className="w-4 h-4 mr-1.5" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <CopyIcon className="w-4 h-4 mr-1.5" />
            <span>Copy</span>
          </>
        )}
      </button>
      {/* The key prop forces a re-render of the <pre> element when the code changes.
          This prevents issues with Prism's DOM manipulation conflicting with React's virtual DOM. */}
      <pre key={displayCode} className="h-full overflow-auto !m-0 !p-0">
        <code className="language-html !block !p-6 !box-border h-full">
          {displayCode}
        </code>
      </pre>
    </div>
  );
};
