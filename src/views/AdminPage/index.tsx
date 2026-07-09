import React, { useState, useEffect } from 'react';
import { getFrameTemplates } from '../../services/dbService';
import { supabase } from '../../config/supabase';
import Swal from 'sweetalert2';
import AdminLoginForm from './components/AdminLoginForm';
import AdminLayout from './layouts/AdminLayout';
import DashboardView from './views/DashboardView';
import TemplateCreatorView from './views/TemplateCreatorView';
import TemplateCatalogView from './views/TemplateCatalogView';
import CollaborationRoutesView from './views/CollaborationRoutesView';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [activeTab, _setActiveTab] = useState('dashboard');
  const [editingTemplateData, setEditingTemplateData] = useState<any>(null);

  const setActiveTab = (tab: string) => {
    _setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'templates_add_public', 'templates_add_private', 'templates_catalog_public', 'templates_catalog_private', 'routes'].includes(hash)) {
        _setActiveTab(hash);
      } else if (!hash) {
        _setActiveTab('dashboard');
      }
    };
    
    if (typeof window !== 'undefined') {
      handleHashChange();
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user && !session.user.is_anonymous) {
          setIsLoggedIn(true);
        }
      }
      setIsCheckingSession(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadTemplates();
    }
  }, [isLoggedIn]);

  const handleLogin = async (emailInput: string, passwordInput: string) => {
    if (!supabase) {
      Swal.fire({
        title: 'Konfigurasi Tidak Lengkap',
        text: 'Supabase tidak dikonfigurasi. Harap isi file .env.local.',
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    setIsLoggingIn(true);
    setLoginError(false);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput
      });
      if (error || !data.user) {
        setLoginError(true);
      } else {
        setIsLoggedIn(true);
      }
    } catch (err) {
      setLoginError(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  const loadTemplates = async () => {
    setIsLoading(true);
    const data = await getFrameTemplates({ includePrivate: true });
    setTemplates(data);
    setIsLoading(false);
  };

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-[#1d90ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLoginForm onLogin={handleLogin} loginError={loginError} isLoggingIn={isLoggingIn} />;
  }

  const handleEditRequest = (template: any) => {
    setEditingTemplateData(template);
    if (template.eventCode) {
      setActiveTab('templates_add_private');
    } else {
      setActiveTab('templates_add_public');
    }
  };

  const handleCreatorSuccess = async () => {
    await loadTemplates();
    const wasPrivate = editingTemplateData?.eventCode || activeTab === 'templates_add_private';
    setEditingTemplateData(null);
    if (wasPrivate) {
      setActiveTab('templates_catalog_private');
    } else {
      setActiveTab('templates_catalog_public');
    }
  };

  const handleCreatorCancel = () => {
    const wasPrivate = editingTemplateData?.eventCode || activeTab === 'templates_add_private';
    setEditingTemplateData(null);
    if (wasPrivate) {
      setActiveTab('templates_catalog_private');
    } else {
      setActiveTab('templates_catalog_public');
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView templates={templates} />;
      case 'templates_add_public':
        return (
          <TemplateCreatorView 
            isPrivate={false}
            initialData={editingTemplateData} 
            onSuccess={handleCreatorSuccess} 
            onCancel={handleCreatorCancel} 
          />
        );
      case 'templates_add_private':
        return (
          <TemplateCreatorView 
            isPrivate={true}
            initialData={editingTemplateData} 
            onSuccess={handleCreatorSuccess} 
            onCancel={handleCreatorCancel} 
          />
        );
      case 'templates_catalog_public':
        return (
          <TemplateCatalogView 
            isPrivate={false}
            templates={templates} 
            loadTemplates={loadTemplates} 
            isLoading={isLoading}
            onEditRequest={handleEditRequest}
          />
        );
      case 'templates_catalog_private':
        return (
          <TemplateCatalogView 
            isPrivate={true}
            templates={templates} 
            loadTemplates={loadTemplates} 
            isLoading={isLoading}
            onEditRequest={handleEditRequest}
          />
        );
      case 'routes':
        return <CollaborationRoutesView />;
      default:
        return <DashboardView templates={templates} />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout}>
      {renderActiveView()}
    </AdminLayout>
  );
}
