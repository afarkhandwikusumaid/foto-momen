import React from 'react';
import { LayoutDashboard, Images, LogOut, Menu, User, Plus, Link2 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export default function AdminLayout({ children, activeTab, onTabChange, onLogout }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'templates_add', label: 'Tambah Template', icon: Plus },
    { id: 'templates_catalog', label: 'Katalog Template', icon: Images },
    { id: 'routes', label: 'Kelola Rute', icon: Link2 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon/fm-icon.png" alt="Foto Momen Icon" className="h-8 w-auto shrink-0 object-contain" />
            <img src="/fm-logo-text.png" alt="Foto Momen" className="h-5 w-auto object-contain" />
            <span className="ml-1 text-[10px] uppercase bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold">Admin</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <div className="text-xs font-bold text-slate-400 mb-4 px-2 uppercase tracking-wider">Menu Utama</div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-[#1d90ff]/10 text-[#1d90ff]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#1d90ff]' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-black text-slate-800 capitalize hidden sm:block">
              {activeTab === 'templates_add' 
                ? 'Tambah Template Baru' 
                : activeTab === 'templates_catalog' 
                ? 'Katalog Template' 
                : activeTab === 'routes'
                ? 'Kelola Rute Kolaborasi'
                : 'Dashboard Overview'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-800">Admin Utama</div>
              <div className="text-xs text-slate-500">admin@fotomomen.id</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-[#1d90ff]">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
}
