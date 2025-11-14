import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  TrendingUp,
  MessageCircle,
  FileText,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { ROUTES } from '../../routes/routes.enum';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Lesson Planning',
    path: ROUTES.LESSON_PLANNING,
    icon: Calendar,
  },
  {
    label: 'Assessments',
    path: ROUTES.ASSESSMENTS,
    icon: ClipboardList,
  },
  {
    label: 'Student Progress',
    path: ROUTES.STUDENT_PROGRESS,
    icon: TrendingUp,
  },
  {
    label: 'Assistant Chat',
    path: ROUTES.ASSISTANT_CHAT,
    icon: MessageCircle,
  },
  {
    label: 'Parent Reports',
    path: ROUTES.PARENT_REPORTS,
    icon: FileText,
  },
];

const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useThemeStore();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${
        open ? 'w-64' : 'w-16'
      } ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-r transition-all duration-300 ease-in-out z-40 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className={`flex items-center ${open ? 'justify-end' : 'justify-center'} p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
        >
          {open ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <div key={item.path} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } ${!open ? 'justify-center' : ''}`}
              >
                <Icon className={`w-5 h-5 ${!open ? 'mx-auto' : ''}`} />
                {open && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
              
              {/* Tooltip for collapsed state */}
              {!open && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;