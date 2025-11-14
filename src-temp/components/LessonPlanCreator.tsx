import { useState } from 'react';
import { BookOpen, Sparkles, Download, Copy, Clock, Target, ListChecks } from 'lucide-react';

interface LessonPlanCreatorProps {
  isDarkMode: boolean;
}

const LessonPlanCreator = ({ isDarkMode }: LessonPlanCreatorProps) => {
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [topic, setTopic] = useState('');
  const [sessions, setSessions] = useState('1');
  const [objectives, setObjectives] = useState('');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
  const grades = ['Grade 8', 'Grade 9', 'Grade 10'];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedPlan({
        title: `${topic} - ${subject}`,
        grade,
        sessions: parseInt(sessions),
        sessionBreakdown: Array.from({ length: parseInt(sessions) }, (_, i) => ({
          session: i + 1,
          title: `Session ${i + 1}: ${topic} ${i === 0 ? 'Introduction' : i === parseInt(sessions) - 1 ? 'Assessment' : 'Practice'}`,
          duration: '45 minutes',
          objectives: [
            `Understand key concepts of ${topic}`,
            'Apply knowledge through practical examples',
            'Develop problem-solving skills'
          ],
          activities: [
            { time: '0-10 min', activity: 'Warm-up and review' },
            { time: '10-30 min', activity: 'Main teaching and demonstration' },
            { time: '30-40 min', activity: 'Guided practice' },
            { time: '40-45 min', activity: 'Summary and homework' }
          ],
          materials: ['Textbook', 'Worksheets', 'Digital resources', 'Lab equipment (if applicable)'],
          homework: `Practice problems on ${topic}`
        }))
      });
      setIsGenerating(false);
    }, 2000);
  };

  const cardClass = isDarkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const inputClass = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={`lg:col-span-1 ${cardClass} rounded-2xl border shadow-lg p-6 h-fit sticky top-24`}>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Plan Configuration
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select subject...</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Grade Level
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select grade...</option>
              {grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quadratic Equations"
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Number of Sessions
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={sessions}
              onChange={(e) => setSessions(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Learning Objectives
            </label>
            <textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="Enter key learning objectives..."
              rows={3}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Custom Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific requirements or notes..."
              rows={3}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!subject || !grade || !topic || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Lesson Plan
              </>
            )}
          </button>
        </div>
      </div>

      <div className="lg:col-span-2">
        {!generatedPlan ? (
          <div className={`${cardClass} rounded-2xl border shadow-lg p-12 text-center`}>
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center`}>
              <BookOpen className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready to Create a Lesson Plan?
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Fill in the details on the left and click "Generate Lesson Plan" to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {generatedPlan.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                      {generatedPlan.grade}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'}`}>
                      {generatedPlan.sessions} Session{generatedPlan.sessions > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}>
                    <Copy className="w-5 h-5" />
                  </button>
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {generatedPlan.sessionBreakdown.map((session: any, index: number) => (
              <div key={index} className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'} flex items-center justify-center text-white font-bold`}>
                    {session.session}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {session.title}
                    </h3>
                    <div className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Clock className="w-4 h-4" />
                      {session.duration}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className={`flex items-center gap-2 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Target className="w-4 h-4" />
                      <h4 className="font-medium">Learning Objectives</h4>
                    </div>
                    <ul className={`ml-6 space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {session.objectives.map((obj: string, i: number) => (
                        <li key={i} className="list-disc">{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className={`flex items-center gap-2 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <ListChecks className="w-4 h-4" />
                      <h4 className="font-medium">Activities Timeline</h4>
                    </div>
                    <div className="space-y-2">
                      {session.activities.map((act: any, i: number) => (
                        <div key={i} className={`flex gap-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} min-w-[80px]`}>
                            {act.time}
                          </span>
                          <span>{act.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium mb-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Materials Needed
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {session.materials.map((mat: string, i: number) => (
                            <span key={i} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Homework
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {session.homework}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlanCreator;
