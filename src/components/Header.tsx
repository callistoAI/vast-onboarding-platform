import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { HorizontalNav } from './HorizontalNav';

export function Header() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 min-h-[64px]">
      <div className="px-6">
        <div className="flex justify-between items-center h-16 min-w-0">
          {/* Left side - Logo */}
          <div className="flex items-center ml-8 flex-shrink-0">
            <button
              onClick={handleHome}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
              title="Home"
            >
              <img 
                src="/vast-logo.png" 
                alt="Vast Logo" 
                className="w-8 h-8 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-lime-500 flex items-center justify-center hidden">
                <span className="text-white font-bold text-sm">V</span>
              </div>
            </button>
          </div>

          {/* Center - Navigation */}
          <div className="flex-1 flex justify-center min-w-0">
            <div className="flex items-center">
              <HorizontalNav />
            </div>
          </div>

          {/* Right side - Account */}
          <div className="flex items-center space-x-4 mr-8 flex-shrink-0">
            {profile && (
              <>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {profile.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-48">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}