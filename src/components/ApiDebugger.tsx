import { useState } from 'react';
import { Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { hierarchicalApi } from '../services/hierarchicalApi';

const ApiDebugger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useThemeStore();

  const testApis = async () => {
    setIsLoading(true);
    setDebugInfo('Testing APIs...\n\n');
    
    try {
      // Test grades API
      setDebugInfo(prev => prev + '1. Testing /api/grade...\n');
      const grades = await hierarchicalApi.getGrades();
      setDebugInfo(prev => prev + `   Response: ${JSON.stringify(grades, null, 2)}\n\n`);
      
      if (grades.length > 0) {
        // Test subjects API with first grade
        const firstGradeId = grades[0].id;
        setDebugInfo(prev => prev + `2. Testing /api/subject/grade/${firstGradeId}...\n`);
        const subjects = await hierarchicalApi.getSubjectsByGrade(firstGradeId);
        setDebugInfo(prev => prev + `   Response: ${JSON.stringify(subjects, null, 2)}\n\n`);
        
        if (subjects.length > 0) {
          // Test chapters API with first subject
          const firstSubjectId = subjects[0].id;
          setDebugInfo(prev => prev + `3. Testing /api/chapter/subject/${firstSubjectId}/grade/${firstGradeId}...\n`);
          const chapters = await hierarchicalApi.getChaptersBySubjectAndGrade(firstSubjectId, firstGradeId);
          setDebugInfo(prev => prev + `   Response: ${JSON.stringify(chapters, null, 2)}\n\n`);
        }
      }
      
      setDebugInfo(prev => prev + 'API testing completed successfully!');
    } catch (error) {
      setDebugInfo(prev => prev + `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 p-3 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-lg border transition-colors z-50`}
        title="API Debugger"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 w-96 max-h-96 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-50`}>
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4" />
          <span className="font-medium text-sm">API Debugger</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-3">
        <button
          onClick={testApis}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
        >
          {isLoading ? 'Testing APIs...' : 'Test All APIs'}
        </button>
        
        {debugInfo && (
          <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs font-mono overflow-auto max-h-48">
            <pre className="whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDebugger;