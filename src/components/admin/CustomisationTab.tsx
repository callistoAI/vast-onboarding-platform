import React, { useState, useEffect } from 'react';
import { Palette, Upload, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function CustomisationTab() {
  const [brandColors, setBrandColors] = useState({
    primary: '#10b981',
    secondary: '#3b82f6',
    accent: '#8b5cf6',
    background: '#f9fafb',
    text: '#111827'
  });
  const [logoUrl, setLogoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('ClientHub');
  const [primaryColor, setPrimaryColor] = useState('#22c55e');
  const [secondaryColor, setSecondaryColor] = useState('#3b82f6');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .limit(1);

      if (error) throw error;
      
              if (data && data.length > 0) {
          const settingsData = data[0];
          const colors = settingsData.brand_colors as Record<string, string>;
          setBrandColors({
            primary: colors?.primary || '#10b981',
            secondary: colors?.secondary || '#3b82f6',
            accent: colors?.accent || '#8b5cf6',
            background: colors?.background || '#f9fafb',
            text: colors?.text || '#111827'
          });
          setTitle(settingsData.title || 'ClientHub');
          setLogoUrl(settingsData.logo_url || '');
        }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      // setLoading(false); // This line was removed from the new_code, so it's removed here.
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const settingsData = {
        title,
        brand_colors: brandColors,
        logo_url: logoUrl || null,
      };

      const { error } = await supabase
        .from('admin_settings')
        .upsert(settingsData);
      
      if (error) throw error;

      alert('Settings saved successfully!');
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };



  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Placeholder for file upload
      alert('Logo upload will be implemented with file storage. For now, please use a URL.');
    }
  };

  // The loading state and its return block were removed from the new_code, so they are removed here.

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Brand Customisation</h1>
        <p className="text-gray-600 mt-1">Customize your platform's appearance and branding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customization Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Brand Settings</h3>
            </div>
            <p className="text-gray-600 text-sm mt-1">Configure your platform's visual identity</p>
          </div>
          <div className="p-6 space-y-8">
            {/* Platform Title */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                {/* Type icon was removed from imports, so it's removed here. */}
                <label className="block text-sm font-medium text-gray-900">
                  Platform Title
                </label>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
                placeholder="ClientHub"
              />
              <p className="text-xs text-gray-500 mt-2">This will appear in the header and client-facing pages</p>
            </div>

            {/* Color Settings */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Primary Color
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-14 h-12 border border-gray-300 rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm font-mono transition-colors"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Used for buttons and accents</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Secondary Color
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-14 h-12 border border-gray-300 rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm font-mono transition-colors"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Used for gradients and highlights</p>
                </div>
              </div>
            </div>

            {/* Logo Settings */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                {/* Image icon was removed from imports, so it's removed here. */}
                <label className="block text-sm font-medium text-gray-900">
                  Logo
                </label>
              </div>
              <div className="space-y-4">
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors"
                  placeholder="https://example.com/logo.png"
                />
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Logo</span>
                  </label>
                  <p className="text-xs text-gray-500 font-medium">Or enter URL above</p>
                </div>
                <p className="text-xs text-gray-500">Recommended size: 200x200px or larger, PNG/JPG format</p>
              </div>
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl disabled:opacity-50 transition-all duration-200 font-medium shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              {/* Eye icon was removed from imports, so it's removed here. */}
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            </div>
            <p className="text-gray-600 text-sm mt-1">See how your changes will look</p>
          </div>
          <div className="p-6">
            {/* Preview Header */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-4">Client Onboarding Header:</p>
              <div 
                className="rounded-xl p-8 text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="Logo" 
                      className="w-12 h-12 rounded-xl object-cover shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      {title.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold">{title}</h2>
                </div>
                <p className="text-white text-opacity-90">
                  Please authorize access to your platforms to continue
                </p>
              </div>
            </div>

            {/* Preview Button */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-4">Primary Button:</p>
              <button 
                className="px-6 py-3 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: primaryColor }}
              >
                Connect Platform
              </button>
            </div>

            {/* Color Swatches */}
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Title:</span>
                <span className="font-semibold text-gray-900">{title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Primary Color:</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-5 h-5 rounded-md border shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <span className="font-mono text-xs font-semibold">{primaryColor}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Secondary Color:</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-5 h-5 rounded-md border shadow-sm"
                    style={{ backgroundColor: secondaryColor }}
                  ></div>
                  <span className="font-mono text-xs font-semibold">{secondaryColor}</span>
                </div>
              </div>
              {logoUrl && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Logo URL:</span>
                  <span className="text-xs text-gray-500 truncate max-w-32 font-medium">{logoUrl}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}