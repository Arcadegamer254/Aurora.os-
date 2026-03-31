import React, { useState, useRef, useEffect } from 'react';
import { getFS, resolvePath, mkdir, touch } from '../services/vfs';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['AuroraOS Terminal v1.0.0', 'Type "help" for commands.']);
  const [input, setInput] = useState('');
  const [fs, setFs] = useState(getFS());
  const [currentPath, setCurrentPath] = useState('/');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const action = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = '';

    switch (action) {
      case 'help':
        output = 'Available commands: help, ls, mkdir <name>, touch <name>, clear, pwd';
        break;
      case 'ls':
        const node = resolvePath(fs, currentPath);
        if (node && node.type === 'dir' && node.children) {
          output = Object.keys(node.children).join('  ');
        }
        break;
      case 'mkdir':
        if (args[0]) {
          const newFs = mkdir(fs, `${currentPath}/${args[0]}`);
          setFs(newFs);
          output = `Directory "${args[0]}" created.`;
        } else {
          output = 'Usage: mkdir <name>';
        }
        break;
      case 'touch':
        if (args[0]) {
          const newFs = touch(fs, `${currentPath}/${args[0]}`);
          setFs(newFs);
          output = `File "${args[0]}" created.`;
        } else {
          output = 'Usage: touch <name>';
        }
        break;
      case 'pwd':
        output = currentPath;
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
        output = `Command not found: ${action}`;
    }

    setHistory(prev => [...prev, `> ${cmd}`, output]);
  };

  return (
    <div className="font-mono text-sm h-full flex flex-col bg-black/50 p-2 rounded overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-1">
        {history.map((line, i) => (
          <div key={i} className={line.startsWith('>') ? 'text-primary' : 'text-gray-300'}>
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center mt-2 border-t border-white/10 pt-2">
        <span className="text-primary mr-2">{currentPath} $</span>
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-white"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleCommand(input);
              setInput('');
            }
          }}
          autoFocus
        />
      </div>
    </div>
  );
};
