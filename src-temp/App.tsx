import { useState } from 'react';
import Header from './components/Header';
import LessonPlanCreator from './components/LessonPlanCreator';
import ContentLibrary from './components/ContentLibrary';
import AssessmentGenerator from './components/AssessmentGenerator';
import StudentProgress from './components/StudentProgress';
import AssistantChat from './components/AssistantChat';
import ParentReports from './components/ParentReports';

function App() {
  const [activeTab, setActiveTab] = useState('lesson-planning');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'lesson-planning':
        return <LessonPlanCreator isDarkMode={isDarkMode} />;
      case 'content-library':
        return <ContentLibrary isDarkMode={isDarkMode} />;
      case 'assessments':
        return <AssessmentGenerator isDarkMode={isDarkMode} />;
      case 'student-progress':
        return <StudentProgress isDarkMode={isDarkMode} />;
      case 'assistant-chat':
        return <AssistantChat isDarkMode={isDarkMode} />;
      case 'parent-reports':
        return <ParentReports isDarkMode={isDarkMode} />;
      default:
        return <LessonPlanCreator isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {renderActivePanel()}
      </main>

      <footer className={`mt-16 py-8 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white/60 backdrop-blur-sm text-gray-600'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap justify-between items-center">
            <div className="text-sm">
              © 2025 TeachMate AI. Empowering educators worldwide.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
