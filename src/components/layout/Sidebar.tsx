import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Home,
  ShoppingCart,
  Package,
  MapPin,
  Star,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Plus,
  ClipboardList,
  Gift,
  ArrowLeftRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const buyerMenuItems = [
  { icon: Home, label: 'Home', path: '/buyer' },
  { icon: ShoppingCart, label: 'Buy Items', path: '/buyer/items' },
  { icon: MapPin, label: 'My Rentals', path: '/buyer/rentals' },
  { icon: Star, label: 'My Activity', path: '/buyer/activity' },
  { icon: Bell, label: 'Notifications', path: '/buyer/notifications' },
  { icon: Settings, label: 'Settings', path: '/buyer/settings' },
  { icon: HelpCircle, label: 'Help / Support', path: '/buyer/help' },
];

const sellerMenuItems = [
  { icon: Home, label: 'Home', path: '/seller' },
  { icon: Plus, label: 'Add New Item', path: '/seller/add-item' },
  { icon: Package, label: 'My Listings', path: '/seller/listings' },
  { icon: ClipboardList, label: 'Manage Requests', path: '/seller/requests' },
  { icon: Bell, label: 'Notifications', path: '/seller/notifications' },
  { icon: Settings, label: 'Settings', path: '/seller/settings' },
  { icon: HelpCircle, label: 'Help / Support', path: '/seller/help' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, logout, setUserRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const menuItems = user?.role === 'seller' ? sellerMenuItems : buyerMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleSwitchRole = () => {
    const newRole = user?.role === 'buyer' ? 'seller' : 'buyer';
    setUserRole(newRole);
    toast({
      title: "Role switched",
      description: `You are now in ${newRole} mode.`,
    });
    navigate(`/${newRole}`);
    onToggle();
  };

  return (
    <>
      {/* Header with toggle */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-sidebar border-b border-sidebar-border z-50 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        
        <div className="flex items-center gap-3 ml-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">U</span>
          </div>
          <span className="text-sidebar-foreground font-semibold text-lg">
            UniSwap
          </span>
        </div>

        {/* Right side - Switch Role & User info */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwitchRole}
            className="text-xs sm:text-sm h-8 px-2 sm:px-3"
          >
            <ArrowLeftRight className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">
              Switch to {user?.role === 'buyer' ? 'Seller' : 'Buyer'}
            </span>
          </Button>
          
          <button
            onClick={() => {
              navigate('/profile');
              if (isOpen) onToggle();
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sidebar-foreground font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-sidebar-foreground">
              {user?.name}
            </span>
          </button>
        </div>
      </header>

      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 pt-14"
          onClick={onToggle}
        />
      )}

      {/* Dropdown Menu - Only visible when open */}
      {isOpen && (
        <aside
          className="fixed left-0 top-14 w-64 bg-sidebar z-50 shadow-xl border-r border-sidebar-border animate-slide-in max-h-[calc(100vh-3.5rem)] overflow-y-auto"
        >
          {/* Menu items */}
          <nav className="py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onToggle}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                        isActive && "bg-sidebar-primary text-sidebar-primary-foreground"
                      )
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User section with logout */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sidebar-foreground font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>
      )}
    </>
  );
};
