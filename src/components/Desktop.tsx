import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { File, Folder, Globe, Trash2 } from 'lucide-react';
import { getFS, resolvePath } from '../services/vfs';

export const Desktop: React.FC<{ onLaunchApp: (id: string, props?: any) => void, installedApps: any[] }> = ({ onLaunchApp, installedApps }) => {
  const [fs, setFs] = useState(getFS());
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, appId: string } | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>(() => {
    const saved = localStorage.getItem('aurora_desktop_positions');
    return saved ? JSON.parse(saved) : {};
  });

  const desktopNode = resolvePath(fs, '/home/user/Desktop');

  useEffect(() => {
    const handleStorage = () => setFs(getFS());
    window.addEventListener('vfs-updated', handleStorage);
    return () => window.removeEventListener('vfs-updated', handleStorage);
  }, []);

  const handleDragEnd = (name: string, info: any) => {
    const newPos = {
      x: (positions[name]?.x || 0) + info.offset.x,
      y: (positions[name]?.y || 0) + info.offset.y
    };
    const updated = { ...positions, [name]: newPos };
    setPositions(updated);
    localStorage.setItem('aurora_desktop_positions', JSON.stringify(updated));
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" onClick={() => setContextMenu(null)} onContextMenu={(e) => {
      if (e.target === e.currentTarget) {
        setContextMenu(null);
      }
    }}>
      {desktopNode?.children && Object.entries(desktopNode.children).map(([name, node], index) => {
        const defaultX = 20;
        const defaultY = 20 + (index * 100);
        const pos = positions[name] || { x: defaultX, y: defaultY };

        return (
          <motion.div
            key={name}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => handleDragEnd(name, info)}
            initial={pos}
            animate={pos}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (node.type === 'file') onLaunchApp('editor', { filepath: `/home/user/Desktop/${name}` });
              else if (node.type === 'dir') onLaunchApp('explorer', { initialPath: `/home/user/Desktop/${name}` });
            }}
            className="absolute flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-primary/20 hover:border-primary/30 border border-transparent cursor-pointer w-24 group transition-colors"
          >
            <div className={`p-3 rounded-xl ${node.type === 'dir' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/80'} shadow-lg backdrop-blur-md border border-white/10 group-hover:scale-105 transition-transform`}>
              {node.type === 'dir' ? <Folder size={32} /> : <File size={32} />}
            </div>
            <span className="text-xs text-white text-center drop-shadow-md line-clamp-2 break-words font-medium px-1 rounded group-hover:bg-primary/40" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
              {name}
            </span>
          </motion.div>
        );
      })}

      {installedApps.map((app, index) => {
        const offsetIndex = (desktopNode?.children ? Object.keys(desktopNode.children).length : 0) + index;
        const defaultX = 20;
        const defaultY = 20 + (offsetIndex * 100);
        const pos = positions[`app_${app.id}`] || { x: defaultX, y: defaultY };

        return (
          <motion.div
            key={`app_${app.id}`}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => handleDragEnd(`app_${app.id}`, info)}
            initial={pos}
            animate={pos}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onLaunchApp(app.id);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setContextMenu({ x: e.clientX, y: e.clientY, appId: app.id });
            }}
            className="absolute flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-primary/20 hover:border-primary/30 border border-transparent cursor-pointer w-24 group transition-colors"
          >
            <div className="p-3 rounded-xl bg-primary/20 text-primary shadow-lg backdrop-blur-md border border-white/10 group-hover:scale-105 transition-transform">
              <Globe size={32} />
            </div>
            <span className="text-xs text-white text-center drop-shadow-md line-clamp-2 break-words font-medium px-1 rounded group-hover:bg-primary/40" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
              {app.name}
            </span>
          </motion.div>
        );
      })}

      {contextMenu && (
        <div
          className="absolute z-[99999] bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg py-1 min-w-[160px] shadow-2xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button 
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2" 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('uninstall-app', { detail: contextMenu.appId }));
              setContextMenu(null);
            }}
          >
            <Trash2 size={14} /> Uninstall
          </button>
        </div>
      )}
    </div>
  );
};
