import { useState } from 'react';
import { FileQuestion, Sparkles, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AssessmentGeneratorProps {
  isDarkMode: boolean;
}

const AssessmentGenerator = ({ isDarkMode }: AssessmentGeneratorProps) => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQuestionCount] = useState('10');
  const [assessmentType, setAssessmentType] = useState('quiz');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssessment, setGeneratedAssessment] = useState<any>(null);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed'];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedAssessment({
        title: `${topic} ${assessmentType === 'quiz' ? 'Quiz' : 'Worksheet'}`,
        subject,
        difficulty,
        questions: Array.from({ length: parseInt(questionCount) }, (_, i) => ({
          number: i + 1,
          question: `Sample question ${i + 1} about ${topic}. This would be a properly formatted question based on the selected difficulty level.`,
          type: i % 3 === 0 ? 'multiple-choice' : i % 3 === 1 ? 'short-answer' : 'true-false',
          options: i % 3 === 0 ? ['Option A', 'Option B', 'Option C', 'Option D'] : null,
          answer: i % 3 === 0 ? 'Option B' : i % 3 === 1 ? 'Sample answer text' : 'True',
          points: difficulty === 'Hard' ? 5 : difficulty === 'Medium' ? 3 : 2,
          explanation: 'This is the explanation for why this is the correct answer.'
        }))
      });
      setIsGenerating(false);
    }, 2000);
  };

  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputClass = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={`lg:col-span-1 ${cardClass} rounded-2xl border shadow-lg p-6 h-fit sticky top-24`}>
        <div className="flex items-center gap-2 mb-6">
          <FileQuestion className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Assessment Setup
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Assessment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAssessmentType('quiz')}
                className={`py-2 px-4 rounded-lg border font-medium text-sm transition-all ${
                  assessmentType === 'quiz'
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Quiz
              </button>
              <button
                onClick={() => setAssessmentType('worksheet')}
                className={`py-2 px-4 rounded-lg border font-medium text-sm transition-all ${
                  assessmentType === 'worksheet'
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Worksheet
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="">Select subject...</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
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
              placeholder="e.g., Pythagorean Theorem"
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="">Select difficulty...</option>
              {difficulties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Number of Questions
            </label>
            <input
              type="number"
              min="5"
              max="50"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!subject || !topic || !difficulty || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Assessment
              </>
            )}
          </button>
        </div>
      </div>

      <div className="lg:col-span-2">
        {!generatedAssessment ? (
          <div className={`${cardClass} rounded-2xl border shadow-lg p-12 text-center`}>
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-purple-100'} flex items-center justify-center`}>
              <FileQuestion className={`w-10 h-10 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready to Create an Assessment?
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Configure your assessment on the left and click "Generate Assessment" to create questions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {generatedAssessment.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                      {generatedAssessment.subject}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      generatedAssessment.difficulty === 'Hard'
                        ? 'bg-red-100 text-red-700'
                        : generatedAssessment.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {generatedAssessment.difficulty}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                      {generatedAssessment.questions.length} Questions
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}>
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {generatedAssessment.questions.map((q: any, index: number) => (
              <div key={index} className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {q.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <p className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {q.question}
                      </p>
                      <span className={`ml-4 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                        {q.points} pts
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                        {q.type.replace('-', ' ')}
                      </span>
                    </div>

                    {q.options && (
                      <div className="space-y-2 mb-4">
                        {q.options.map((option: string, i: number) => (
                          <div
                            key={i}
                            className={`px-4 py-2 rounded-lg border ${
                              option === q.answer
                                ? isDarkMode
                                  ? 'bg-green-900/30 border-green-700'
                                  : 'bg-green-50 border-green-300'
                                : isDarkMode
                                ? 'bg-gray-700/50 border-gray-600'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {option === q.answer && (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {option}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {!q.options && (
                      <div className={`px-4 py-3 rounded-lg mb-4 ${isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-300'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                            Answer:
                          </span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} ml-6`}>
                          {q.answer}
                        </p>
                      </div>
                    )}

                    <div className={`px-4 py-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'}`}>
                      <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                        Explanation:
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Total Points: {generatedAssessment.questions.reduce((sum: number, q: any) => sum + q.points, 0)}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Export this assessment to share with students
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-colors">
                    Export as PDF
                  </button>
                  <button className={`font-medium px-6 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} transition-colors`}>
                    Export as CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentGenerator;
