import React, { useState } from 'react';
import { Monitor, Palette, Info, Type, Paintbrush, Layout, Settings as SettingsIcon } from 'lucide-react';

export const Settings: React.FC = () => {
  const [wallpaper, setWallpaper] = useState(localStorage.getItem('aurora_wallpaper') || 'default');
  const [themeColor, setThemeColor] = useState(localStorage.getItem('aurora_theme_color') || '#3b82f6');
  const [themeFont, setThemeFont] = useState(localStorage.getItem('aurora_theme_font') || '"DM Sans", sans-serif');
  const [activeTab, setActiveTab] = useState('personalization');

  const changeWallpaper = (url: string) => {
    setWallpaper(url);
    localStorage.setItem('aurora_wallpaper', url);
    window.dispatchEvent(new CustomEvent('wallpaper-changed', { detail: url }));
  };

  const changeThemeColor = (color: string) => {
    setThemeColor(color);
    localStorage.setItem('aurora_theme_color', color);
    window.dispatchEvent(new CustomEvent('theme-color-changed', { detail: color }));
  };

  const changeThemeFont = (font: string) => {
    setThemeFont(font);
    localStorage.setItem('aurora_theme_font', font);
    window.dispatchEvent(new CustomEvent('theme-font-changed', { detail: font }));
  };

  const wallpapers = [
    { id: 'default', name: 'Aurora Default', url: 'default' },
    { id: 'mountains', name: 'Neon Mountains', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
    { id: 'abstract', name: 'Abstract Fluid', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop' },
    { id: 'space', name: 'Deep Space', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop' },
    { id: 'landscape', name: 'Minimal Landscape', url: 'https://images.unsplash.com/photo-1506744626753-eba7bc3613bb?q=80&w=2000&auto=format&fit=crop' },
    { id: 'cyberpunk', name: 'Cyberpunk City', url: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2000&auto=format&fit=crop' }
  ];

  const colors = [
    { id: 'blue', value: '#3b82f6', name: 'Ocean Blue' },
    { id: 'purple', value: '#8b5cf6', name: 'Amethyst' },
    { id: 'pink', value: '#ec4899', name: 'Rose' },
    { id: 'red', value: '#ef4444', name: 'Crimson' },
    { id: 'orange', value: '#f97316', name: 'Sunset' },
    { id: 'green', value: '#10b981', name: 'Emerald' },
    { id: 'teal', value: '#14b8a6', name: 'Teal' },
    { id: 'slate', value: '#64748b', name: 'Slate' },
  ];

  const fonts = [
    { id: 'dm-sans', value: '"DM Sans", sans-serif', name: 'DM Sans (Default)' },
    { id: 'inter', value: '"Inter", sans-serif', name: 'Inter' },
    { id: 'space-grotesk', value: '"Space Grotesk", sans-serif', name: 'Space Grotesk' },
    { id: 'playfair', value: '"Playfair Display", serif', name: 'Playfair Display' },
    { id: 'mono', value: '"JetBrains Mono", monospace', name: 'JetBrains Mono' },
  ];

  return (
    <div className="flex h-full bg-black/40 text-white font-sans backdrop-blur-2xl">
      {/* Sidebar */}
      <div className="w-56 bg-black/20 border-r border-white/10 p-4 flex flex-col gap-2">
        <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
          <SettingsIcon size={14} /> Settings
        </div>
        <button 
          onClick={() => setActiveTab('personalization')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === 'personalization' ? 'bg-primary/20 text-primary font-medium' : 'hover:bg-white/10 text-white/70'}`}
        >
          <Layout size={18} /> Personalization
        </button>
        <button 
          onClick={() => setActiveTab('themes')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === 'themes' ? 'bg-primary/20 text-primary font-medium' : 'hover:bg-white/10 text-white/70'}`}
        >
          <Paintbrush size={18} /> Themes
        </button>
        <button 
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === 'system' ? 'bg-primary/20 text-primary font-medium' : 'hover:bg-white/10 text-white/70'}`}
        >
          <Monitor size={18} /> System
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === 'about' ? 'bg-primary/20 text-primary font-medium' : 'hover:bg-white/10 text-white/70'}`}
        >
          <Info size={18} /> About
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'personalization' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold mb-1">Personalization</h2>
              <p className="text-white/50 text-sm mb-6">Customize the look and feel of AuroraOS.</p>
            </div>
            
            <section>
              <h3 className="text-lg font-medium mb-4 text-white/90">Desktop Background</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {wallpapers.map(wp => (
                  <div 
                    key={wp.id} 
                    onClick={() => changeWallpaper(wp.url)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all group relative ${wallpaper === wp.url ? 'border-blue-500 scale-[1.02] shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-white/10 hover:border-white/30'}`}
                  >
                    {wp.url === 'default' ? (
                      <div className="aspect-video bg-radial-[circle_at_50%_50%] from-[#1a1c2c] to-[#08090f]" />
                    ) : (
                      <img src={wp.url} alt={wp.name} className="aspect-video w-full object-cover" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="text-xs font-medium text-white drop-shadow-md">{wp.name}</div>
                    </div>
                    {wallpaper === wp.url && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'themes' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold mb-1">Themes</h2>
              <p className="text-white/50 text-sm mb-6">Customize colors and typography.</p>
            </div>
            
            <section>
              <h3 className="text-lg font-medium mb-4 text-white/90 flex items-center gap-2"><Palette size={18} /> Accent Color</h3>
              <div className="flex flex-wrap gap-4">
                {colors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => changeThemeColor(color.value)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${themeColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-black/40' : ''}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {themeColor === color.value && <div className="w-3 h-3 bg-white rounded-full shadow-sm" />}
                  </button>
                ))}
              </div>
            </section>

            <section className="pt-4">
              <h3 className="text-lg font-medium mb-4 text-white/90 flex items-center gap-2"><Type size={18} /> System Font</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fonts.map(font => (
                  <button
                    key={font.id}
                    onClick={() => changeThemeFont(font.value)}
                    className={`p-4 rounded-xl border text-left transition-all ${themeFont === font.value ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                    style={{ 
                      fontFamily: font.value,
                      boxShadow: themeFont === font.value ? '0 0 15px var(--color-primary)' : 'none'
                    }}
                  >
                    <div className="text-lg mb-1">{font.name}</div>
                    <div className="text-xs text-white/50 font-sans">The quick brown fox jumps over the lazy dog.</div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold mb-1">System</h2>
              <p className="text-white/50 text-sm mb-6">Device and OS information.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-white/60">OS Version</span>
                <span className="font-medium">AuroraOS 2.0 (Build 2026)</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-white/60">Kernel</span>
                <span className="font-medium">WebCore React 19</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Display</span>
                <span className="font-medium">{window.innerWidth} x {window.innerHeight}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center mb-4">
              <span className="text-5xl">🌌</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">AuroraOS</h2>
            <p className="text-white/50 text-center max-w-sm">
              A highly advanced, web-based operating system interface featuring a virtual file system, window management, and glassmorphic design.
            </p>
            <div className="mt-8 text-xs text-white/30">
              © 2026 Aurora Systems. All rights reserved.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
