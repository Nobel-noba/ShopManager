import { useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/ui/sidebar';
import { Menu, Bell } from 'lucide-react';
import { User } from '@shared/schema';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  
  // In a real app, this would be a session check or user fetch
  // For now, we'll use the admin user from our storage
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/users'],
    select: (users) => users[0] // Just take the first user (admin)
  });
  
  // Update page title based on location
  useEffect(() => {
    const path = location === '/' ? '/dashboard' : location;
    const title = path.substring(1).split('-').map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    setPageTitle(title);
  }, [location]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 md:hidden py-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="mr-2 text-gray-600 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-primary">ShopManager</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="text-gray-600 focus:outline-none">
              <Bell className="h-5 w-5" />
            </button>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
            {currentUser?.name?.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </header>
      
      {/* Sidebar Navigation */}
      {currentUser && (
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          currentUser={currentUser}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Desktop Header */}
        <header className="bg-white border-b border-gray-200 hidden md:flex items-center justify-between py-4 px-6">
          <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="text-gray-600 focus:outline-none">
                <Bell className="h-5 w-5" />
              </button>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </div>
            {currentUser && (
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
        </header>
        
        {children}
      </main>
    </div>
  );
}
