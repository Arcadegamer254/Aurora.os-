import React from 'react';

export const Library: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-b-xl overflow-hidden">
      <iframe 
        src="https://julishalibrary.github.io/" 
        className="w-full h-full border-none bg-white" 
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups" 
        title="julishalibrary.github.io"
      />
    </div>
  );
};
