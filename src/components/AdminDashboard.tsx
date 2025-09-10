import React from 'react';
import { useLocation } from 'react-router-dom';
import { OnboardingLinksTab } from './admin/DashboardTab';
import { ClientsTab } from './admin/ClientsTab';
import { SettingsTab } from './admin/SettingsTab';
import { CustomisationTab } from './admin/CustomisationTab';
import { ClientSettingsTab } from './client/ClientSettingsTab';

export function AdminDashboard() {
  console.log('AdminDashboard: Starting render');
  
  const location = useLocation();
  console.log('AdminDashboard: useLocation successful, pathname:', location.pathname);
  
  const getCurrentTab = () => {
    switch (location.pathname) {
      case '/admin/clients':
        return 'clients';
      case '/admin/settings':
        return 'settings';
      case '/admin/customisation':
        return 'customisation';
      case '/client/settings':
        return 'client-settings';
      default:
        return 'dashboard';
    }
  };

  const currentTab = getCurrentTab();
  console.log('AdminDashboard: Current tab:', currentTab);

  const renderTabContent = () => {
    console.log('AdminDashboard: Rendering tab content for:', currentTab);
    
    try {
      switch (currentTab) {
        case 'clients':
          console.log('AdminDashboard: Rendering ClientsTab');
          return <ClientsTab />;
        case 'settings':
          console.log('AdminDashboard: Rendering SettingsTab');
          return <SettingsTab />;
        case 'customisation':
          console.log('AdminDashboard: Rendering CustomisationTab');
          return <CustomisationTab />;
        case 'client-settings':
          console.log('AdminDashboard: Rendering ClientSettingsTab');
          return <ClientSettingsTab />;
        default:
          console.log('AdminDashboard: Rendering OnboardingLinksTab');
          return <OnboardingLinksTab />;
      }
    } catch (error) {
      console.error('AdminDashboard: Error in renderTabContent:', error);
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Error Loading Content</h2>
          <p className="text-red-600 mb-4">Error: {error instanceof Error ? error.message : String(error)}</p>
        </div>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderTabContent()}
    </div>
  );
}