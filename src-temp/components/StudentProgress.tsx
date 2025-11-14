import { TrendingUp, TrendingDown, Award, AlertCircle, Users, BarChart3 } from 'lucide-react';

interface StudentProgressProps {
  isDarkMode: boolean;
}

const StudentProgress = ({ isDarkMode }: StudentProgressProps) => {
  const students = [
    {
      id: 1,
      name: 'Emma Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      overallScore: 92,
      recentScore: 95,
      trend: 'up',
      status: 'advanced',
      strengths: ['Problem Solving', 'Analysis'],
      improvements: ['Speed', 'Detail']
    },
    {
      id: 2,
      name: 'Liam Chen',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
      overallScore: 78,
      recentScore: 82,
      trend: 'up',
      status: 'on-track',
      strengths: ['Creativity', 'Communication'],
      improvements: ['Math Skills', 'Focus']
    },
    {
      id: 3,
      name: 'Sophia Martinez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      overallScore: 65,
      recentScore: 58,
      trend: 'down',
      status: 'needs-support',
      strengths: ['Effort', 'Attendance'],
      improvements: ['Comprehension', 'Practice']
    },
    {
      id: 4,
      name: 'Noah Williams',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      overallScore: 88,
      recentScore: 89,
      trend: 'up',
      status: 'advanced',
      strengths: ['Logic', 'Speed'],
      improvements: ['Writing', 'Detail']
    },
    {
      id: 5,
      name: 'Olivia Brown',
      avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100',
      overallScore: 75,
      recentScore: 75,
      trend: 'stable',
      status: 'on-track',
      strengths: ['Consistency', 'Organization'],
      improvements: ['Confidence', 'Participation']
    }
  ];

  const classStats = {
    average: 79.6,
    highScore: 95,
    lowScore: 58,
    passingRate: 85
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'advanced':
        return {
          bg: isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700',
          label: 'Advanced'
        };
      case 'on-track':
        return {
          bg: isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700',
          label: 'On Track'
        };
      case 'needs-support':
        return {
          bg: isDarkMode ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700',
          label: 'Needs Support'
        };
      default:
        return {
          bg: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700',
          label: 'Unknown'
        };
    }
  };

  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-2">
            <Users className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {students.length}
            </span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Students</p>
        </div>

        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {classStats.average}%
            </span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Class Average</p>
        </div>

        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-2">
            <Award className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {classStats.highScore}%
            </span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Highest Score</p>
        </div>

        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {classStats.passingRate}%
            </span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Passing Rate</p>
        </div>
      </div>

      <div className={`${cardClass} rounded-2xl border shadow-lg overflow-hidden`}>
        <div className="p-6 border-b border-gray-200">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Student Performance Overview
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Student
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Overall Score
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Recent Score
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Trend
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Strengths
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Areas to Improve
                </th>
              </tr>
            </thead>
            <tbody className={`${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
              {students.map((student) => {
                const statusBadge = getStatusBadge(student.status);
                return (
                  <tr key={student.id} className={`${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              student.overallScore >= 85
                                ? 'bg-green-500'
                                : student.overallScore >= 70
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${student.overallScore}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {student.overallScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {student.recentScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.trend === 'up' ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">Up</span>
                        </div>
                      ) : student.trend === 'down' ? (
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-sm font-medium">Down</span>
                        </div>
                      ) : (
                        <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="text-sm font-medium">Stable</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.strengths.map((strength, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-xs ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.improvements.map((improvement, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-xs ${isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`}
                          >
                            {improvement}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Attention Required
          </h3>
        </div>
        <div className="space-y-3">
          {students
            .filter((s) => s.status === 'needs-support')
            .map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-lg border ${isDarkMode ? 'bg-amber-900/20 border-amber-700/50' : 'bg-amber-50 border-amber-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {student.name}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                        Recent performance decline - Consider one-on-one support
                      </p>
                    </div>
                  </div>
                  <button className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Schedule Meeting
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
