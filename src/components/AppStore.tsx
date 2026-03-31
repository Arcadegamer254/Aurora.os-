import React, { useState, useEffect } from 'react';
import { Download, Trash2, Globe, Search } from 'lucide-react';

export const AVAILABLE_WEB_APPS = [
  { id: 'vscode', name: 'VS Code Web', url: 'https://vscode.dev', icon: <Globe size={24} /> },
  { id: 'excalidraw', name: 'Excalidraw', url: 'https://excalidraw.com', icon: <Globe size={24} /> },
  { id: 'photopea', name: 'Photopea', url: 'https://www.photopea.com', icon: <Globe size={24} /> },
  { id: 'drawio', name: 'Draw.io', url: 'https://app.diagrams.net/', icon: <Globe size={24} /> },
  { id: 'github', name: 'GitHub', url: 'https://github.com', icon: <Globe size={24} /> },
  { id: 'wikipedia', name: 'Wikipedia', url: 'https://en.wikipedia.org', icon: <Globe size={24} /> },
];

export const AppStore: React.FC = () => {
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('aurora_installed_apps');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInstalledApps(parsed.map((app: any) => app.id));
      } catch (e) {}
    }

    const handleUpdate = () => {
      const updated = localStorage.getItem('aurora_installed_apps');
      if (updated) {
        try {
          const parsed = JSON.parse(updated);
          setInstalledApps(parsed.map((app: any) => app.id));
        } catch (e) {}
      } else {
        setInstalledApps([]);
      }
    };

    window.addEventListener('installed-apps-changed', handleUpdate);
    return () => window.removeEventListener('installed-apps-changed', handleUpdate);
  }, []);

  const handleInstall = (app: any) => {
    const appData = { id: app.id, name: app.name, url: app.url };
    window.dispatchEvent(new CustomEvent('install-app', { detail: appData }));
  };

  const handleUninstall = (appId: string) => {
    window.dispatchEvent(new CustomEvent('uninstall-app', { detail: appId }));
  };

  const filteredApps = AVAILABLE_WEB_APPS.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0f111a] text-white font-sans rounded-b-xl overflow-hidden">
      <div className="p-6 border-b border-white/10 bg-white/5">
        <h2 className="text-2xl font-bold mb-4">App Store</h2>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApps.map(app => {
            const isInstalled = installedApps.includes(app.id);
            
            return (
              <div key={app.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                    {app.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{app.name}</h3>
                    <p className="text-xs text-white/50">{app.url}</p>
                  </div>
                </div>
                
                {isInstalled ? (
                  <button
                    onClick={() => handleUninstall(app.id)}
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Uninstall
                  </button>
                ) : (
                  <button
                    onClick={() => handleInstall(app)}
                    className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <Download size={16} />
                    Install
                  </button>
                )}
              </div>
            );
          })}
          
          {filteredApps.length === 0 && (
            <div className="col-span-full text-center py-10 text-white/40">
              No apps found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
