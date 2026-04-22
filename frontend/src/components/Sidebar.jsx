import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiChevronDown, FiChevronRight, FiSearch, FiSettings } from 'react-icons/fi';
import { menuTree } from '../config/menuConfig';

export default function Sidebar({ collapsed }) {
  const [openGroups, setOpenGroups] = useState(['Dashboard']);
  const location = useLocation();

  const toggleGroup = (label) => {
    setOpenGroups(prev => 
      prev.includes(label) ? [] : [label]
    );
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen z-40 sidebar-transition flex flex-col
        bg-white dark:bg-[#1e1e24] 
        border-r border-gray-200 dark:border-[#2a2a30]
        ${collapsed ? 'w-20' : 'w-[280px]'}`}
    >
      {/* Brand Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800 overflow-hidden shrink-0">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/20">
          <span className="text-lg font-bold">🏥</span>
        </div>
        {!collapsed && (
          <div className="ml-3 animate-unt-fade">
            <h1 className="text-base font-bold tracking-tight text-gray-900 dark:text-white leading-tight">Nova Farma</h1>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">Apotek Digital</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto mt-4 px-3 space-y-0.5">
        {!collapsed && (
          <div className="px-3 mb-5 relative">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg py-2 pl-9 pr-4 text-xs font-medium text-gray-600 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all"
            />
          </div>
        )}

        {menuTree.map((item) => {
          const Icon = item.icon;
          const isParent = item.type === 'parent';
          const isOpen = openGroups.includes(item.label);
          const hasActiveChild = isParent 
            ? item.children?.some(child =>
                location.pathname === child.path ||
                location.pathname.startsWith(child.path + '/')
              )
            : location.pathname === item.path;

          if (!isParent) {
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center px-3 py-2.5 rounded-lg transition-all group ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <Icon size={20} className={collapsed ? 'mx-auto' : 'mr-3'} />
                {!collapsed && (
                  <>
                    <span className="text-sm font-semibold flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 text-[10px] bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter border border-primary-100 dark:border-primary-800">{item.badge}</span>
                    )}
                  </>
                )}
              </NavLink>
            );
          }

          return (
            <div key={item.id} className="mb-0.5">
              <button
                onClick={() => !collapsed && toggleGroup(item.label)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all group ${
                  hasActiveChild 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={20} className={collapsed ? 'mx-auto' : 'mr-3'} />
                {!collapsed && (
                  <>
                    <span className="text-sm font-semibold flex-1 text-left">{item.label}</span>
                    <span className="ml-2 transition-transform duration-300">
                      {isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                    </span>
                  </>
                )}
              </button>

              {!collapsed && isOpen && item.children && (
                <div className="mt-1 ml-4 border-l border-gray-200 dark:border-gray-800 space-y-0.5 pl-4 animate-unt-fade">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.id}
                      to={child.path}
                      end
                      className={({ isActive }) => 
                        `flex items-center px-4 py-2 rounded-lg text-sm transition-all relative ${
                          isActive 
                            ? 'text-primary-700 dark:text-primary-400 font-bold bg-primary-50/50 dark:bg-primary-900/10' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 font-medium'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {child.label}
                          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-600 rounded-full -ml-4" />}
                          {child.badge && (
                            <span className="ml-auto text-[10px] bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter border border-primary-100 dark:border-primary-800">{child.badge}</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
           <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-sm">
                U
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">User Account</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">Administrator</p>
              </div>
              <FiSettings className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white transition-colors" />
           </div>
        </div>
      )}
    </aside>
  );
}
