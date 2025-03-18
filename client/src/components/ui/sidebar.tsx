import { Link, useLocation } from "wouter";
import { type User } from "@shared/schema";
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  BarChart3, 
  UserCog,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export function Sidebar({ isOpen, onClose, currentUser }: SidebarProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  console.log(currentUser.role);
  
  
  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="mr-3 text-lg" /> 
    },
    { 
      name: 'Inventory', 
      path: '/inventory', 
      icon: <Store className="mr-3 text-lg" /> 
    },
    { 
      name: 'Sales', 
      path: '/sales', 
      icon: <ShoppingCart className="mr-3 text-lg" /> 
    },
    { 
      name: 'Reports', 
      path: '/reports', 
      icon: <BarChart3 className="mr-3 text-lg" /> 
    },
    { 
      name: 'User Management', 
      path: '/users', 
      icon: <UserCog className="mr-3 text-lg" />,
      role: 'admin'
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="mr-3 text-lg" />,
      role: 'admin'
    },
  ];

  return (
    <aside 
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-full md:w-64 md:flex md:flex-col md:fixed md:inset-y-0 transform transition-transform duration-300 ease-in-out z-10", 
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary dark:text-white">ShopManager</h2>
            <button 
              onClick={onClose} 
              className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <p className="font-medium dark:text-white">{currentUser.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems
            .filter(item => !item.role || (item.role === 'admin' && currentUser.role === 'admin'))
            .map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg group",
                  isActive(item.path) 
                    ? "bg-primary/10 text-primary dark:text-white" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button 
            onClick={() => logoutMutation.mutate()}
            className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 focus:outline-none"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}