import { GraduationCap, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (mode: boolean) => void;
}

const Header = ({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }: HeaderProps) => {
  const tabs = [
    { id: 'lesson-planning', label: 'Lesson Planning' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'student-progress', label: 'Student Progress' },
    { id: 'assistant-chat', label: 'Assistant Chat' },
    { id: 'parent-reports', label: 'Parent Reports' },
  ];

  return (
    <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'} border-b shadow-sm sticky top-0 z-50`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-cyan-400'} shadow-lg`}>
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                TeachMate AI
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your intelligent teaching companion
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-all duration-200`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-2 -mb-px scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? isDarkMode
                    ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                    : 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
