import React, { useState, useEffect } from 'react';
import { getFrameTemplates } from '../../services/dbService';
import { supabase } from '../../config/supabase';

import Swal from 'sweetalert2';

import AdminLoginForm from './components/AdminLoginForm';
import AdminLayout from './layouts/AdminLayout';

import DashboardView from './views/DashboardView';
import TemplateCreatorView from './views/TemplateCreatorView';
import TemplateCatalogView from './views/TemplateCatalogView';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingTemplateData, setEditingTemplateData] = useState<any>(null);

  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
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
    const data = await getFrameTemplates();
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
    setActiveTab('templates_add');
  };

  const handleCreatorSuccess = async () => {
    await loadTemplates();
    setEditingTemplateData(null);
    setActiveTab('templates_catalog');
  };

  const handleCreatorCancel = () => {
    setEditingTemplateData(null);
    setActiveTab('templates_catalog');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView templates={templates} />;
      case 'templates_add':
        return (
          <TemplateCreatorView 
            initialData={editingTemplateData} 
            onSuccess={handleCreatorSuccess} 
            onCancel={handleCreatorCancel} 
          />
        );
      case 'templates_catalog':
        return (
          <TemplateCatalogView 
            templates={templates} 
            loadTemplates={loadTemplates} 
            isLoading={isLoading}
            onEditRequest={handleEditRequest}
          />
        );
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
