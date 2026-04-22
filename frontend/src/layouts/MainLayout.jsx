import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18181b] transition-colors duration-200">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className={`sidebar-transition min-h-screen flex flex-col ${sidebarCollapsed ? 'md:ml-[80px]' : 'ml-0 md:ml-[280px]'}`}>
        <TopBar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="p-6 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
