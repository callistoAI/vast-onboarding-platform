import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link, Settings, UserCheck, Palette } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  path: string;
  adminOnly?: boolean;
  clientOnly?: boolean;
}

const navItems: NavItem[] = [
  { icon: Link, label: 'Links', path: '/dashboard' },
  { icon: UserCheck, label: 'Clients', path: '/admin/clients', adminOnly: true },
  { icon: Palette, label: 'Customisation', path: '/admin/customisation', adminOnly: true },
  { icon: Settings, label: 'Settings', path: '/admin/settings', adminOnly: true },
  { icon: Settings, label: 'Settings', path: '/client/settings', clientOnly: true },
];

export function HorizontalNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const filteredNavItems = navItems.filter(item => 
    (!item.adminOnly || profile?.role === 'admin') &&
    (!item.clientOnly || profile?.role === 'client')
  );

  return (
    <nav className="flex space-x-8">
      {filteredNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <div
            key={item.path}
            className="relative"
          >
            <button
              onClick={() => navigate(item.path)}
              className={`px-6 py-3 text-sm font-medium transition-all duration-200 relative ${
                isActive
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {item.label}
            </button>
            {/* Active indicator line */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"></div>
            )}
            {/* Hover indicator line */}
            {!isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
            )}
          </div>
        );
      })}
    </nav>
  );
}