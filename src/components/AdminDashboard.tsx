import React from 'react';
import { useLocation } from 'react-router-dom';
import { OnboardingLinksTab } from './admin/DashboardTab';
import { ClientsTab } from './admin/ClientsTab';
import { SettingsTab } from './admin/SettingsTab';
import { CustomisationTab } from './admin/CustomisationTab';
import { ClientSettingsTab } from './client/ClientSettingsTab';

export function AdminDashboard() {
  const location = useLocation();
  
  console.log('AdminDashboard render:', {
    pathname: location.pathname
  });
  
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
  console.log('Current tab:', currentTab);

  const renderTabContent = () => {
    switch (currentTab) {
      case 'clients':
        return <ClientsTab />;
      case 'settings':
        return <SettingsTab />;
      case 'customisation':
        return <CustomisationTab />;
      case 'client-settings':
        return <ClientSettingsTab />;
      default:
        return <OnboardingLinksTab />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderTabContent()}
    </div>
  );
}