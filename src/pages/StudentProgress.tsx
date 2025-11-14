import { useState } from 'react';
import { TrendingUp, Users, Award, BookOpen } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

const StudentProgress = () => {
  const { isDarkMode } = useThemeStore();
  const [students] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      grade: 'Grade 9',
      overallScore: 92,
      subjects: {
        Mathematics: 95,
        Physics: 88,
        Chemistry: 91,
        Biology: 94,
      },
      trend: 'up',
      lastActivity: '2 hours ago',
    },
    {
      id: 2,
      name: 'Bob Smith',
      grade: 'Grade 10',
      overallScore: 87,
      subjects: {
        Mathematics: 85,
        Physics: 90,
        Chemistry: 84,
        Biology: 89,
      },
      trend: 'up',
      lastActivity: '1 day ago',
    },
    {
      id: 3,
      name: 'Carol Davis',
      grade: 'Grade 9',
      overallScore: 78,
      subjects: {
        Mathematics: 75,
        Physics: 82,
        Chemistry: 76,
        Biology: 79,
      },
      trend: 'down',
      lastActivity: '3 hours ago',
    },
  ]);

  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  const getScoreColor = (score: number) => {
    if (score >= 90) return isDarkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 80) return isDarkMode ? 'text-blue-400' : 'text-blue-600';
    if (score >= 70) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    return isDarkMode ? 'text-red-400' : 'text-red-600';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Student Progress
        </h1>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Track and analyze your students' academic performance and progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '156', icon: Users, color: 'blue' },
          { label: 'Average Score', value: '85.2%', icon: TrendingUp, color: 'green' },
          { label: 'Top Performers', value: '23', icon: Award, color: 'yellow' },
          { label: 'Active Courses', value: '12', icon: BookOpen, color: 'purple' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Performance Overview */}
      <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
        <h2 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Class Performance Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Mathematics', 'Physics', 'Chemistry', 'Biology'].map((subject) => {
            const avgScore = Math.floor(Math.random() * 20) + 75; // Mock data
            return (
              <div key={subject} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {subject}
                </h3>
                <div className={`text-2xl font-bold mb-2 ${getScoreColor(avgScore)}`}>
                  {avgScore}%
                </div>
                <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-2 rounded-full ${getProgressBarColor(avgScore)}`}
                    style={{ width: `${avgScore}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student List */}
      <div className={`${cardClass} rounded-2xl border shadow-lg`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Individual Student Progress
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {students.map((student) => (
            <div key={student.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white font-medium`}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {student.name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {student.grade} • Last active {student.lastActivity}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(student.overallScore)}`}>
                    {student.overallScore}%
                  </div>
                  <div className={`text-sm ${student.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {student.trend === 'up' ? '↗ Improving' : '↘ Declining'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(student.subjects).map(([subject, score]) => (
                  <div key={subject} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {subject}
                    </div>
                    <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                      {score}%
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-1 mt-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-1 rounded-full ${getProgressBarColor(score)}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;