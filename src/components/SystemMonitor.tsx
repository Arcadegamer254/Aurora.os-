import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, MemoryStick } from 'lucide-react';

export const SystemMonitor: React.FC = () => {
  const [cpu, setCpu] = useState(0);
  const [ram, setRam] = useState(0);

  useEffect(() => {
    // Simulate fluctuating system metrics
    setCpu(Math.floor(Math.random() * 20) + 5);
    setRam(Math.floor(Math.random() * 15) + 35);
    
    const interval = setInterval(() => {
      setCpu(prev => Math.max(2, Math.min(100, prev + (Math.random() * 20 - 10))));
      setRam(prev => Math.max(20, Math.min(100, prev + (Math.random() * 10 - 5))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 h-full bg-black/40 text-white font-sans flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="p-2 bg-primary/20 text-primary rounded-lg">
          <Activity size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold">System Monitor</h3>
          <p className="text-xs text-white/50">Real-time resource tracking</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col gap-3 shadow-lg">
          <div className="flex items-center justify-between text-white/60">
            <span className="flex items-center gap-2 text-sm font-medium"><Cpu size={16} /> CPU Usage</span>
            <span className="text-xs">Aurora Core</span>
          </div>
          <div className="text-4xl font-light tracking-tight">{Math.round(cpu)}<span className="text-lg text-white/40 ml-1">%</span></div>
          <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-primary h-full transition-all duration-1000 ease-out" style={{ width: `${cpu}%` }} />
          </div>
        </div>
        
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col gap-3 shadow-lg">
          <div className="flex items-center justify-between text-white/60">
            <span className="flex items-center gap-2 text-sm font-medium"><MemoryStick size={16} /> Memory</span>
            <span className="text-xs">16 GB Total</span>
          </div>
          <div className="text-4xl font-light tracking-tight">{Math.round(ram)}<span className="text-lg text-white/40 ml-1">%</span></div>
          <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-purple-500 h-full transition-all duration-1000 ease-out" style={{ width: `${ram}%` }} />
          </div>
        </div>
      </div>
      
      <div className="mt-2 bg-white/5 p-5 rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-2 text-white/80 mb-4 font-medium">
          <HardDrive size={16} className="text-green-400" /> Storage (Virtual File System)
        </div>
        <div className="flex justify-between items-end mb-2">
          <div className="text-sm text-white/60">localStorage Quota</div>
          <div className="text-sm font-medium">~5 MB Max</div>
        </div>
        <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden mb-4">
          <div className="bg-green-500 h-full w-[2%]" />
        </div>
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary leading-relaxed">
          <strong>Note:</strong> The current VFS uses browser localStorage. Upgrading to IndexedDB is planned for Phase 3 to support large file uploads, images, and persistent media storage.
        </div>
      </div>
    </div>
  );
};
