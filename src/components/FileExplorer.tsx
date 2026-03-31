import React, { useState, useMemo } from 'react';
import { Search, Folder, File, ChevronRight, ChevronLeft } from 'lucide-react';
import { getFS, resolvePath, searchVFS, SearchResult } from '../services/vfs';
import { VFSNode } from '../types';

export const FileExplorer: React.FC<{ onLaunchApp?: (id: string, props?: any) => void }> = ({ onLaunchApp }) => {
  const [fs, setFs] = useState(getFS());
  const [currentPath, setCurrentPath] = useState('/');
  const [searchQuery, setSearchQuery] = useState('');

  const currentNode = useMemo(() => resolvePath(fs, currentPath), [fs, currentPath]);

  const searchResults = useMemo(() => {
    return searchVFS(fs, searchQuery);
  }, [fs, searchQuery]);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSearchQuery('');
  };

  const goBack = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(p => p);
    parts.pop();
    setCurrentPath('/' + parts.join('/'));
  };

  return (
    <div className="flex flex-col h-full bg-black/20 text-white/90 font-sans">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-white/5">
        <button
          onClick={goBack}
          disabled={currentPath === '/'}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            placeholder="Search files and folders..."
            className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Path Breadcrumbs */}
      <div className="px-4 py-2 text-xs text-white/40 border-b border-white/5 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
        <span className="hover:text-white cursor-pointer" onClick={() => navigateTo('/')}>root</span>
        {currentPath.split('/').filter(p => p).map((part, i, arr) => (
          <React.Fragment key={i}>
            <ChevronRight size={12} />
            <span 
              className="hover:text-white cursor-pointer"
              onClick={() => navigateTo('/' + arr.slice(0, i + 1).join('/'))}
            >
              {part}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-2">
        {searchQuery ? (
          <div className="space-y-1">
            <h4 className="px-2 py-1 text-[10px] uppercase tracking-wider text-white/30 font-bold">Search Results</h4>
            {searchResults.length > 0 ? (
              searchResults.map((result, i) => (
                <FileItem 
                  key={i} 
                  node={result.node} 
                  path={result.path} 
                  onClick={() => result.node.type === 'dir' ? navigateTo(result.path) : (onLaunchApp ? onLaunchApp('editor', { filepath: result.path }) : null)}
                  showPath
                />
              ))
            ) : (
              <div className="p-8 text-center text-white/30 text-sm italic">No results found for "{searchQuery}"</div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
            {currentNode?.children && Object.entries(currentNode.children).map(([name, node]) => (
              <FileItem 
                key={name} 
                node={node as VFSNode} 
                path={`${currentPath === '/' ? '' : currentPath}/${name}`}
                onClick={() => (node as VFSNode).type === 'dir' ? navigateTo(`${currentPath === '/' ? '' : currentPath}/${name}`) : (onLaunchApp ? onLaunchApp('editor', { filepath: `${currentPath === '/' ? '' : currentPath}/${name}` }) : null)}
              />
            ))}
            {(!currentNode?.children || Object.keys(currentNode.children).length === 0) && (
              <div className="col-span-full p-8 text-center text-white/20 text-sm italic">This folder is empty</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface FileItemProps {
  node: VFSNode;
  path: string;
  onClick: () => void;
  showPath?: boolean;
}

const FileItem: React.FC<FileItemProps> = ({ node, path, onClick, showPath }) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-all"
    >
      <div className={`p-2 rounded-lg ${node.type === 'dir' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-white/60'}`}>
        {node.type === 'dir' ? <Folder size={20} /> : <File size={20} />}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium truncate group-hover:text-white">{node.name}</span>
        {showPath && <span className="text-[10px] text-white/30 truncate">{path}</span>}
      </div>
    </div>
  );
};
