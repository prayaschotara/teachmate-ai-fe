import { useState } from 'react';
import { ClipboardList, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

const Assessments = () => {
  const { isDarkMode } = useThemeStore();
  const [assessments] = useState([
    {
      id: 1,
      title: 'Mathematics Quiz - Quadratic Equations',
      subject: 'Mathematics',
      grade: 'Grade 9',
      questions: 15,
      duration: '30 min',
      status: 'Published',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      title: 'Physics Test - Newton\'s Laws',
      subject: 'Physics',
      grade: 'Grade 10',
      questions: 20,
      duration: '45 min',
      status: 'Draft',
      createdAt: '2024-01-14',
    },
    {
      id: 3,
      title: 'Chemistry Lab Assessment',
      subject: 'Chemistry',
      grade: 'Grade 9',
      questions: 12,
      duration: '25 min',
      status: 'Published',
      createdAt: '2024-01-13',
    },
  ]);

  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700';
      case 'Draft': return isDarkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700';
      default: return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Assessments
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Create and manage quizzes, tests, and assignments for your students.
          </p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg">
          <Plus className="w-5 h-5" />
          Create Assessment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Assessments', value: '24', color: 'blue' },
          { label: 'Published', value: '18', color: 'green' },
          { label: 'Drafts', value: '6', color: 'yellow' },
          { label: 'This Month', value: '8', color: 'purple' },
        ].map((stat, index) => (
          <div key={index} className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
            <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Assessments List */}
      <div className={`${cardClass} rounded-2xl border shadow-lg`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ClipboardList className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Assessments
            </h2>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {assessment.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                      {assessment.subject}
                    </span>
                    <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                      {assessment.grade}
                    </span>
                    <span className={`px-2 py-1 rounded ${getStatusColor(assessment.status)}`}>
                      {assessment.status}
                    </span>
                  </div>
                  <div className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {assessment.questions} questions • {assessment.duration} • Created {assessment.createdAt}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-100 text-red-600'} transition-colors`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assessments;