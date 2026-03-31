import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Folder, Settings as SettingsIcon, Monitor, FileText, Calculator as CalculatorIcon, Globe, ShoppingBag } from 'lucide-react';
import { Window } from './components/Window';
import { Taskbar } from './components/Taskbar';
import { Terminal } from './components/Terminal';
import { Library } from './components/Library';
import { FileExplorer } from './components/FileExplorer';
import { TextEditor } from './components/TextEditor';
import { SystemMonitor } from './components/SystemMonitor';
import { Settings } from './components/Settings';
import { Calculator } from './components/Calculator';
import { Browser } from './components/Browser';
import { Desktop } from './components/Desktop';
import { AppStore } from './components/AppStore';
import { WebApp } from './components/WebApp';
import { AppConfig, WindowState } from './types';

const CORE_APPS: AppConfig[] = [
  { id: 'terminal', name: 'Terminal', icon: <TerminalIcon size={24} />, component: Terminal },
  { id: 'explorer', name: 'File Explorer', icon: <Folder size={24} />, component: FileExplorer },
  { id: 'editor', name: 'Text Editor', icon: <FileText size={24} />, component: TextEditor },
  { id: 'calculator', name: 'Calculator', icon: <CalculatorIcon size={24} />, component: Calculator },
  { id: 'browser', name: 'Browser', icon: <Globe size={24} />, component: Browser },
  { id: 'monitor', name: 'System Monitor', icon: <Monitor size={24} />, component: SystemMonitor },
  { id: 'library', name: 'julishalibrary.github.io', icon: <Folder size={24} />, component: Library },
  { id: 'appstore', name: 'App Store', icon: <ShoppingBag size={24} />, component: AppStore },
  { id: 'settings', name: 'Settings', icon: <SettingsIcon size={24} />, component: Settings },
];

export default function App() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [zIndex, setZIndex] = useState(100);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [wallpaper, setWallpaper] = useState(localStorage.getItem('aurora_wallpaper') || 'default');
  const [installedApps, setInstalledApps] = useState<any[]>(() => {
    const saved = localStorage.getItem('aurora_installed_apps');
    return saved ? JSON.parse(saved) : [];
  });

  const allApps = useMemo(() => {
    const webApps: AppConfig[] = installedApps.map(app => ({
      id: app.id,
      name: app.name,
      icon: <Globe size={24} />,
      component: () => <WebApp url={app.url} title={app.name} />
    }));
    return [...CORE_APPS, ...webApps];
  }, [installedApps]);

  useEffect(() => {
    // Initialize theme from local storage
    const savedColor = localStorage.getItem('aurora_theme_color') || '#3b82f6';
    const savedFont = localStorage.getItem('aurora_theme_font') || '"DM Sans", sans-serif';
    
    document.documentElement.style.setProperty('--theme-color', savedColor);
    document.documentElement.style.setProperty('--font-sans', savedFont);

    const handleWallpaper = (e: any) => setWallpaper(e.detail || localStorage.getItem('aurora_wallpaper') || 'default');
    const handleThemeColor = (e: any) => document.documentElement.style.setProperty('--theme-color', e.detail);
    const handleThemeFont = (e: any) => document.documentElement.style.setProperty('--font-sans', e.detail);

    const handleInstall = (e: any) => {
      const app = e.detail;
      setInstalledApps(prev => {
        if (prev.find(a => a.id === app.id)) return prev;
        const next = [...prev, app];
        localStorage.setItem('aurora_installed_apps', JSON.stringify(next));
        window.dispatchEvent(new Event('installed-apps-changed'));
        return next;
      });
    };

    const handleUninstall = (e: any) => {
      const appId = e.detail;
      setInstalledApps(prev => {
        const next = prev.filter(a => a.id !== appId);
        localStorage.setItem('aurora_installed_apps', JSON.stringify(next));
        window.dispatchEvent(new Event('installed-apps-changed'));
        return next;
      });
      setWindows(prev => prev.filter(w => w.appId !== appId));
    };

    window.addEventListener('wallpaper-changed', handleWallpaper);
    window.addEventListener('theme-color-changed', handleThemeColor);
    window.addEventListener('theme-font-changed', handleThemeFont);
    window.addEventListener('install-app', handleInstall);
    window.addEventListener('uninstall-app', handleUninstall);
    
    return () => {
      window.removeEventListener('wallpaper-changed', handleWallpaper);
      window.removeEventListener('theme-color-changed', handleThemeColor);
      window.removeEventListener('theme-font-changed', handleThemeFont);
      window.removeEventListener('install-app', handleInstall);
      window.removeEventListener('uninstall-app', handleUninstall);
    };
  }, []);

  const launchApp = useCallback((appId: string, appProps?: any) => {
    const app = allApps.find(a => a.id === appId);
    if (!app) return;

    // Check if app is already open (unless it's the editor, allow multiple editors)
    const existing = windows.find(w => w.appId === appId);
    if (existing && appId !== 'editor') {
      focusWindow(existing.id);
      return;
    }

    const newWin: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      appId,
      title: appProps?.filepath ? `${app.name} - ${appProps.filepath.split('/').pop()}` : app.name,
      zIndex: zIndex + 1,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 600, height: 400 },
      props: appProps,
    };

    setWindows(prev => [...prev, newWin]);
    setZIndex(prev => prev + 1);
  }, [windows, zIndex, allApps]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: zIndex + 1, isMinimized: false } : w
    ));
    setZIndex(prev => prev + 1);
  }, [zIndex]);

  const updateWindow = useCallback((id: string, updates: Partial<WindowState>) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
  }, []);

  // Initial launch
  useEffect(() => {
    launchApp('terminal');
  }, []);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-[#08090f] font-sans text-white select-none"
      style={wallpaper !== 'default' ? {
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
      onClick={() => setContextMenu(null)}
    >
      {/* Desktop Background */}
      {wallpaper === 'default' && (
        <>
          <div className="absolute inset-0 bg-radial-[circle_at_50%_50%] from-[#1a1c2c] to-[#08090f] -z-10" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
        </>
      )}

      {/* Desktop Icons */}
      <Desktop onLaunchApp={launchApp} installedApps={installedApps} />

      {/* Window Layer */}
      <div className="relative w-full h-full p-4 pointer-events-none">
        <AnimatePresence>
          {windows.map(win => {
            const app = allApps.find(a => a.id === win.appId);
            if (!app) return null;
            const AppComponent = app.component;
            const isActive = win.zIndex === Math.max(...windows.map(w => w.zIndex));

            return (
              <div key={win.id} className="pointer-events-auto">
                <Window
                  window={win}
                  isActive={isActive}
                  onClose={closeWindow}
                  onMinimize={minimizeWindow}
                  onFocus={focusWindow}
                  onUpdate={updateWindow}
                >
                  <AppComponent winId={win.id} onLaunchApp={launchApp} {...win.props} />
                </Window>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Taskbar */}
      <Taskbar
        apps={allApps}
        windows={windows}
        onLaunch={launchApp}
        onMinimize={minimizeWindow}
        onFocus={focusWindow}
      />

      {contextMenu && (
        <div
          className="absolute z-[99999] bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg py-1 min-w-[160px] shadow-2xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-primary/20 hover:text-primary transition-colors flex items-center gap-2" onClick={() => launchApp('terminal')}><TerminalIcon size={14} /> Terminal</button>
          <button className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-primary/20 hover:text-primary transition-colors flex items-center gap-2" onClick={() => launchApp('explorer')}><Folder size={14} /> File Explorer</button>
          <button className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-primary/20 hover:text-primary transition-colors flex items-center gap-2" onClick={() => launchApp('appstore')}><ShoppingBag size={14} /> App Store</button>
          <div className="h-px bg-white/10 my-1 mx-2" />
          <button className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-primary/20 hover:text-primary transition-colors flex items-center gap-2" onClick={() => launchApp('monitor')}><Monitor size={14} /> System Monitor</button>
          <button className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-primary/20 hover:text-primary transition-colors flex items-center gap-2" onClick={() => launchApp('settings')}><SettingsIcon size={14} /> Settings</button>
        </div>
      )}
    </div>
  );
}
