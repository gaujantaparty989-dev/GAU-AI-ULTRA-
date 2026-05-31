
import React from 'react';

export const SvelteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FF3E00" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zM8.5 7L5 12l3.5 5h2L7 12l3.5-5h-2zm7 0L12 12l3.5 5h2L14 12l3.5-5h-2z" />
  </svg>
);
