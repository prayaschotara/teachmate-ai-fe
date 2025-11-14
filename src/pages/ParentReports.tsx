import { useState } from 'react';
import { FileText, Send, Download, Eye, Calendar, Users } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

const ParentReports = () => {
  const { isDarkMode } = useThemeStore();
  const [reports] = useState([
    {
      id: 1,
      studentName: 'Alice Johnson',
      parentEmail: 'alice.parent@email.com',
      subject: 'Monthly Progress Report - Mathematics',
      status: 'Sent',
      sentDate: '2024-01-15',
      grade: 'Grade 9',
      overallScore: 92,
    },
    {
      id: 2,
      studentName: 'Bob Smith',
      parentEmail: 'bob.parent@email.com',
      subject: 'Quarterly Assessment Report',
      status: 'Draft',
      sentDate: null,
      grade: 'Grade 10',
      overallScore: 87,
    },
    {
      id: 3,
      studentName: 'Carol Davis',
      parentEmail: 'carol.parent@email.com',
      subject: 'Improvement Plan - Physics',
      status: 'Sent',
      sentDate: '2024-01-14',
      grade: 'Grade 9',
      overallScore: 78,
    },
  ]);

  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent': return isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700';
      case 'Draft': return isDarkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700';
      case 'Scheduled': return isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700';
      default: return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return isDarkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 80) return isDarkMode ? 'text-blue-400' : 'text-blue-600';
    if (score >= 70) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    return isDarkMode ? 'text-red-400' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Parent Reports
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Generate and send progress reports to keep parents informed about their children's academic performance.
          </p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg">
          <FileText className="w-5 h-5" />
          Generate Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Reports', value: '156', icon: FileText, color: 'blue' },
          { label: 'Sent This Month', value: '24', icon: Send, color: 'green' },
          { label: 'Scheduled', value: '8', icon: Calendar, color: 'yellow' },
          { label: 'Parent Contacts', value: '89', icon: Users, color: 'purple' },
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

      {/* Quick Actions */}
      <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Monthly Progress Report',
              description: 'Generate comprehensive monthly reports for all students',
              icon: Calendar,
              color: 'blue',
            },
            {
              title: 'Individual Report',
              description: 'Create a custom report for a specific student',
              icon: FileText,
              color: 'green',
            },
            {
              title: 'Bulk Send Reports',
              description: 'Send multiple reports to parents at once',
              icon: Send,
              color: 'purple',
            },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-xl border cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {action.title}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {action.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reports List */}
      <div className={`${cardClass} rounded-2xl border shadow-lg`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Reports
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {report.studentName}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {report.subject}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                      {report.grade}
                    </span>
                    <span className={`font-medium ${getScoreColor(report.overallScore)}`}>
                      Score: {report.overallScore}%
                    </span>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {report.parentEmail}
                    </span>
                    {report.sentDate && (
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Sent: {report.sentDate}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                    <Download className="w-4 h-4" />
                  </button>
                  {report.status === 'Draft' && (
                    <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-600 text-blue-400' : 'hover:bg-gray-100 text-blue-600'} transition-colors`}>
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentReports;