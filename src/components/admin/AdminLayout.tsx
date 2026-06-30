import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { TabType } from './AdminPanel';

interface AdminLayoutProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout: () => void;
  onBackToHome: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({ 
  activeTab, setActiveTab, onLogout, onBackToHome, children 
}: AdminLayoutProps) {
  
  return (
    <div className="w-full min-h-screen bg-[#f4f5f7] flex animate-fade-in">
      
      {/* Sidebar (Desktop Only) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        
        {/* Top Header */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onBackToHome={onBackToHome}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

      </div>
      
    </div>
  );
}
