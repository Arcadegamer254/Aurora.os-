import React from 'react';

export const WebApp: React.FC<{ url: string, title: string }> = ({ url, title }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-b-xl overflow-hidden">
      <iframe 
        src={url} 
        className="w-full h-full border-none bg-white" 
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups" 
        title={title}
      />
    </div>
  );
};
