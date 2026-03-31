import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WindowState>) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  window,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  onUpdate,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    setIsDragging(true);
    onFocus(window.id);
  };

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);
    onUpdate(window.id, {
      position: {
        x: window.position.x + info.offset.x,
        y: window.position.y + info.offset.y,
      },
    });
  };

  const toggleMaximize = () => {
    onUpdate(window.id, { isMaximized: !window.isMaximized });
  };

  return (
    <motion.div
      ref={windowRef}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: window.isMinimized ? 0.1 : 1,
        opacity: window.isMinimized ? 0 : 1,
        x: window.isMaximized ? 0 : window.position.x,
        y: window.isMaximized ? 0 : window.position.y,
        width: window.isMaximized ? '100%' : window.size.width,
        height: window.isMaximized ? 'calc(100% - 64px)' : window.size.height,
        zIndex: window.zIndex,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`absolute flex flex-col rounded-2xl overflow-hidden border backdrop-blur-2xl bg-black/50 ${
        window.isMinimized ? 'pointer-events-none' : ''
      } ${isActive ? 'border-primary/50 ring-1 ring-primary/20 shadow-[0_30px_60px_rgba(0,0,0,0.6)]' : 'border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'}`}
      style={isActive ? { boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px var(--color-primary)' } : {}}
      onClick={() => onFocus(window.id)}
    >
      {/* Titlebar */}
      <motion.div
        drag={!window.isMaximized}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="h-12 flex items-center bg-white/5 border-b border-white/10 cursor-grab active:cursor-grabbing select-none relative"
      >
        <div className="flex items-center gap-2 px-4 absolute left-0">
          <button
            onClick={() => onClose(window.id)}
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 border border-[#e0443e] flex items-center justify-center group transition-colors"
          >
            <X size={8} className="opacity-0 group-hover:opacity-100 text-black/60" />
          </button>
          <button
            onClick={() => onMinimize(window.id)}
            className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 border border-[#dea123] flex items-center justify-center group transition-colors"
          >
            <Minus size={8} className="opacity-0 group-hover:opacity-100 text-black/60" />
          </button>
          <button
            onClick={toggleMaximize}
            className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 border border-[#1aab29] flex items-center justify-center group transition-colors"
          >
            <Maximize2 size={8} className="opacity-0 group-hover:opacity-100 text-black/60" />
          </button>
        </div>
        <span className="flex-1 text-xs font-semibold text-white/70 text-center truncate pointer-events-none">
          {window.title}
        </span>
      </motion.div>

      {/* Body */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </motion.div>
  );
};
