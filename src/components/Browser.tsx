import React, { useState } from 'react';
import { Search, RotateCw, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

export const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [input, setInput] = useState('https://www.wikipedia.org');
  const [key, setKey] = useState(0);

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = input;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
    setInput(finalUrl);
  };

  return (
    <div className="flex flex-col h-full bg-white text-black font-sans rounded-b-xl overflow-hidden">
      {/* Browser Chrome */}
      <div className="flex items-center gap-3 p-2 bg-[#f3f3f3] border-b border-gray-300 shadow-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <button className="p-1.5 rounded-md hover:bg-black/5 transition-colors"><ChevronLeft size={18} /></button>
          <button className="p-1.5 rounded-md hover:bg-black/5 transition-colors"><ChevronRight size={18} /></button>
          <button className="p-1.5 rounded-md hover:bg-black/5 transition-colors" onClick={() => setKey(k => k + 1)}><RotateCw size={16} /></button>
        </div>
        
        <form onSubmit={handleGo} className="flex-1 flex items-center bg-white rounded-lg border border-gray-300 px-3 py-1.5 focus-within:ring-2 ring-primary/20 focus-within:border-primary transition-all shadow-inner">
          <Shield size={14} className="text-green-600 mr-2" />
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            className="flex-1 outline-none text-sm text-gray-800" 
            placeholder="Search or enter website name"
          />
          <Search size={14} className="text-gray-400 ml-2 cursor-pointer" onClick={handleGo} />
        </form>
      </div>
      
      {/* Webview Area */}
      <div className="flex-1 bg-white relative">
        <iframe 
          key={key} 
          src={url} 
          className="absolute inset-0 w-full h-full border-none bg-white" 
          sandbox="allow-same-origin allow-scripts allow-forms" 
          title="Browser"
        />
      </div>
    </div>
  );
};
