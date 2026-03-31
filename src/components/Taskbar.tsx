import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Folder, FileText } from 'lucide-react';
import { AppConfig, WindowState } from '../types';
import { getFS } from '../services/vfs';

interface TaskbarProps {
  apps: AppConfig[];
  windows: WindowState[];
  onLaunch: (appId: string, props?: any) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  apps,
  windows,
  onLaunch,
  onMinimize,
  onFocus,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{name: string, path: string, type: 'file'|'dir'}[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const fs = getFS();
    const results: {name: string, path: string, type: 'file'|'dir'}[] = [];
    
    const searchNode = (node: any, currentPath: string) => {
      if (node.type === 'dir' && node.children) {
        Object.entries(node.children).forEach(([name, child]: [string, any]) => {
          const childPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
          if (name.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push({ name, path: childPath, type: child.type });
          }
          if (child.type === 'dir') {
            searchNode(child, childPath);
          }
        });
      }
    };

    searchNode(fs, '');
    setSearchResults(results);
  }, [searchQuery]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[10000]">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      >
        {/* Search Button */}
        <div className="relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group relative ${isSearchOpen ? 'bg-primary/20' : 'bg-white/5 hover:bg-white/10 border border-transparent hover:scale-110'}`}
            style={isSearchOpen ? { boxShadow: '0 0 15px var(--color-primary)' } : {}}
          >
            <Search size={24} className={isSearchOpen ? 'text-primary' : 'text-white/80 group-hover:text-white'} />
          </button>

          {/* Search Popup */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-[calc(100%+16px)] left-0 w-80 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search files and folders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  {searchQuery.trim() === '' ? (
                    <div className="p-4 text-center text-white/40 text-sm">Type to search...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-white/40 text-sm">No results found</div>
                  ) : (
                    searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (result.type === 'file') onLaunch('editor', { filepath: result.path });
                          else onLaunch('explorer', { initialPath: result.path });
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 text-left transition-colors"
                      >
                        {result.type === 'dir' ? <Folder size={16} className="text-blue-400" /> : <FileText size={16} className="text-white/60" />}
                        <div className="flex-1 overflow-hidden">
                          <div className="text-sm text-white truncate">{result.name}</div>
                          <div className="text-xs text-white/40 truncate">{result.path}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-8 bg-white/10 mx-1" />

        {apps.map(app => {
          const isOpen = windows.some(w => w.appId === app.id);
          const activeWin = windows.find(w => w.appId === app.id && !w.isMinimized);

          return (
            <div key={app.id} className="relative group">
              <motion.button
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (isOpen && activeWin) {
                    onMinimize(activeWin.id);
                  } else if (isOpen) {
                    const win = windows.find(w => w.appId === app.id);
                    if (win) onFocus(win.id);
                  } else {
                    onLaunch(app.id);
                  }
                }}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  isOpen
                    ? 'bg-white/10 border border-white/20 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
              >
                <span className="text-2xl">{app.icon}</span>
              </motion.button>

              {/* Tooltip */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">
                {app.name}
              </div>

              {/* Active Indicator */}
              {isOpen && (
                <div 
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" 
                  style={{ boxShadow: '0 0 8px var(--color-primary)' }} 
                />
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
