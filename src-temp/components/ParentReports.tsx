import { useState } from 'react';
import { Mail, MessageCircle, Send, Clock, CheckCircle, FileText, Calendar } from 'lucide-react';

interface ParentReportsProps {
  isDarkMode: boolean;
}

const ParentReports = ({ isDarkMode }: ParentReportsProps) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [communicationMethod, setCommunicationMethod] = useState<'email' | 'whatsapp'>('email');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const students = [
    { id: 1, name: 'Emma Johnson', parent: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 234-567-8901' },
    { id: 2, name: 'Liam Chen', parent: 'Michael Chen', email: 'mchen@email.com', phone: '+1 234-567-8902' },
    { id: 3, name: 'Sophia Martinez', parent: 'Maria Martinez', email: 'maria.m@email.com', phone: '+1 234-567-8903' },
    { id: 4, name: 'Noah Williams', parent: 'David Williams', email: 'd.williams@email.com', phone: '+1 234-567-8904' },
    { id: 5, name: 'Olivia Brown', parent: 'Jennifer Brown', email: 'jbrown@email.com', phone: '+1 234-567-8905' }
  ];

  const templates = [
    {
      id: 1,
      name: 'Weekly Progress Update',
      subject: 'Your Child\'s Weekly Progress Report',
      content: 'Dear [Parent Name],\n\nI hope this message finds you well. I wanted to share [Student Name]\'s progress this week.\n\n**Highlights:**\n- Excellent participation in class discussions\n- Completed all homework assignments on time\n- Showed great improvement in [Subject]\n\n**Areas of Focus:**\n- Continue practicing [Topic]\n- Review concepts from [Chapter]\n\n**Upcoming:**\n- Quiz on [Date]\n- Project due [Date]\n\nPlease feel free to reach out if you have any questions.\n\nBest regards,\n[Your Name]'
    },
    {
      id: 2,
      name: 'Achievement Celebration',
      subject: 'Celebrating [Student Name]\'s Success!',
      content: 'Dear [Parent Name],\n\nI\'m excited to share some wonderful news about [Student Name]!\n\n[Student Name] has shown exceptional performance in [Subject/Activity]. Their dedication and hard work have truly paid off.\n\n**Recent Achievements:**\n- Scored [X]% on recent assessment\n- Demonstrated leadership in group projects\n- Helped classmates understand difficult concepts\n\nPlease join me in celebrating this achievement with [Student Name]!\n\nWarm regards,\n[Your Name]'
    },
    {
      id: 3,
      name: 'Support Needed',
      subject: 'Let\'s Work Together to Support [Student Name]',
      content: 'Dear [Parent Name],\n\nI hope you\'re doing well. I wanted to reach out regarding [Student Name]\'s recent performance.\n\nI\'ve noticed [Student Name] could benefit from additional support in [Subject/Area]. This is a normal part of the learning process, and with our combined effort, I\'m confident we can help.\n\n**Observations:**\n- [Specific observation 1]\n- [Specific observation 2]\n\n**Suggestions:**\n- [Recommendation 1]\n- [Recommendation 2]\n\nI\'d love to schedule a meeting to discuss how we can best support [Student Name] together.\n\nLooking forward to your thoughts,\n[Your Name]'
    }
  ];

  const recentReports = [
    {
      id: 1,
      student: 'Emma Johnson',
      parent: 'Sarah Johnson',
      date: new Date(Date.now() - 86400000),
      method: 'email',
      status: 'sent',
      type: 'Weekly Progress Update'
    },
    {
      id: 2,
      student: 'Liam Chen',
      parent: 'Michael Chen',
      date: new Date(Date.now() - 172800000),
      method: 'whatsapp',
      status: 'sent',
      type: 'Achievement Celebration'
    },
    {
      id: 3,
      student: 'Sophia Martinez',
      parent: 'Maria Martinez',
      date: new Date(Date.now() - 259200000),
      method: 'email',
      status: 'scheduled',
      type: 'Support Needed'
    }
  ];

  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputClass = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Create Parent Communication
          </h2>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - Parent: {student.parent}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Communication Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCommunicationMethod('email')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                    communicationMethod === 'email'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email</span>
                </button>
                <button
                  onClick={() => setCommunicationMethod('whatsapp')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                    communicationMethod === 'whatsapp'
                      ? 'bg-green-600 border-green-600 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">WhatsApp</span>
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Choose a template...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedTemplate && (
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {templates.find((t) => t.id === parseInt(selectedTemplate))?.subject}
                </h3>
                <div className={`text-sm whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {templates.find((t) => t.id === parseInt(selectedTemplate))?.content}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                disabled={!selectedStudent || !selectedTemplate}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Send Now
              </button>
              <button
                disabled={!selectedStudent || !selectedTemplate}
                className={`px-6 py-3 rounded-lg font-medium ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 disabled:bg-gray-200'} transition-colors disabled:cursor-not-allowed flex items-center gap-2`}
              >
                <Calendar className="w-5 h-5" />
                Schedule
              </button>
            </div>
          </div>
        </div>

        <div className={`${cardClass} rounded-2xl border shadow-lg overflow-hidden`}>
          <div className="p-6 border-b border-gray-200">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Communications
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {recentReports.map((report) => (
              <div key={report.id} className={`p-6 ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {report.student}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'sent'
                          ? isDarkMode
                            ? 'bg-green-900/50 text-green-300'
                            : 'bg-green-100 text-green-700'
                          : isDarkMode
                          ? 'bg-blue-900/50 text-blue-300'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {report.status === 'sent' ? 'Sent' : 'Scheduled'}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      To: {report.parent}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        {report.method === 'email' ? (
                          <Mail className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        ) : (
                          <MessageCircle className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                        )}
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {report.method === 'email' ? 'Email' : 'WhatsApp'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {report.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {report.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {report.status === 'sent' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Templates
          </h3>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id.toString())}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedTemplate === template.id.toString()
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                }`}
              >
                <div className="font-medium text-sm">{template.name}</div>
              </button>
            ))}
          </div>
          <button className={`w-full mt-4 px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors text-sm font-medium`}>
            + Create Custom Template
          </button>
        </div>

        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This Week
                </span>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  12
                </span>
              </div>
              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="h-2 rounded-full bg-blue-600" style={{ width: '60%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This Month
                </span>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  45
                </span>
              </div>
              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="h-2 rounded-full bg-green-600" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Tips
          </h3>
          <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Personalize templates with student-specific details</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Send updates regularly to keep parents engaged</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Always include specific examples and next steps</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Respond to parent inquiries within 24 hours</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParentReports;
