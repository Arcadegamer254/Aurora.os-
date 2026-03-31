import React, { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import { getFS, readFile, writeFile } from '../services/vfs';

export const TextEditor: React.FC<{ filepath?: string }> = ({ filepath }) => {
  const [content, setContent] = useState('');
  const [path, setPath] = useState(filepath || '/home/user/Desktop/new_file.txt');
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (filepath) {
      const fs = getFS();
      const fileContent = readFile(fs, filepath);
      if (fileContent !== null) {
        setContent(fileContent);
        setSaved(true);
      }
    }
  }, [filepath]);

  const handleSave = () => {
    let fs = getFS();
    writeFile(fs, path, content);
    setSaved(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white font-sans">
      <div className="flex items-center gap-2 p-2 bg-[#2d2d2d] border-b border-black/50">
        <FileText size={16} className="text-primary ml-1" />
        <input
          type="text"
          value={path}
          onChange={e => setPath(e.target.value)}
          className="bg-[#3c3c3c] px-2 py-1 rounded text-sm flex-1 outline-none focus:ring-1 focus:ring-primary transition-shadow"
          placeholder="/path/to/file.txt"
        />
        <button
          onClick={handleSave}
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${saved ? 'bg-white/5 text-white/40 cursor-default' : 'bg-primary hover:bg-primary/80 text-white shadow-lg'}`}
          disabled={saved}
        >
          <Save size={14} /> {saved ? 'Saved' : 'Save'}
        </button>
      </div>
      <textarea
        value={content}
        onChange={e => { setContent(e.target.value); setSaved(false); }}
        className="flex-1 bg-transparent p-4 outline-none resize-none font-mono text-sm leading-relaxed"
        spellCheck={false}
        placeholder="Start typing..."
      />
    </div>
  );
};
