import { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Download, Copy, Clock, Target, ListChecks, AlertCircle } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { lessonPlanApi, type LessonPlanResponse } from '../services/lessonPlanApi';
import { hierarchicalApi, type Grade, type Subject, type Chapter } from '../services/hierarchicalApi';
import { mockApiResponse } from '../utils/testApiResponse';
import toast from 'react-hot-toast';

const LessonPlanning = () => {
  // Form state
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [sessions, setSessions] = useState('1');
  const [sessionDuration, setSessionDuration] = useState('45');
  const [objectives, setObjectives] = useState('');
  const [notes, setNotes] = useState('');
  
  // API data state
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  
  // UI state
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<LessonPlanResponse | null>(null);
  
  const { isDarkMode } = useThemeStore();

  // Load grades on component mount
  useEffect(() => {
    const loadGrades = async () => {
      setIsLoadingGrades(true);
      try {
        const gradesData = await hierarchicalApi.getGrades();
        
        setGrades(gradesData);
      } catch (error) {
        console.error('❌ DEBUG - Failed to load grades:', error);
        toast.error('Failed to load grades');
      } finally {
        setIsLoadingGrades(false);
      }
    };

    loadGrades();
  }, []);

  // Load subjects when grade is selected
  useEffect(() => {
    if (!selectedGradeId) {
      setSubjects([]);
      setSelectedSubjectId('');
      return;
    }

    const loadSubjects = async () => {
      setIsLoadingSubjects(true);
      try {
        const subjectsData = await hierarchicalApi.getSubjectsByGrade(selectedGradeId);
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Failed to load subjects:', error);
        toast.error('Failed to load subjects for selected grade');
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, [selectedGradeId]);

  // Load chapters when subject is selected
  useEffect(() => {
    if (!selectedSubjectId || !selectedGradeId) {
      setChapters([]);
      setSelectedChapterId('');
      return;
    }

    const loadChapters = async () => {
      setIsLoadingChapters(true);
      try {
        const chaptersData = await hierarchicalApi.getChaptersBySubjectAndGrade(selectedSubjectId, selectedGradeId);
        setChapters(chaptersData);
      } catch (error) {
        console.error('Failed to load chapters:', error);
        toast.error('Failed to load chapters for selected subject');
      } finally {
        setIsLoadingChapters(false);
      }
    };

    loadChapters();
  }, [selectedSubjectId, selectedGradeId]);

  // Reset dependent selections when parent changes
  const handleGradeChange = (gradeId: string) => {
    setSelectedGradeId(gradeId);
    setSelectedSubjectId('');
    setSelectedChapterId('');
    setSubjects([]);
    setChapters([]);
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedChapterId('');
    setChapters([]);
  };

  const handleGenerate = async () => {
    if (!selectedGradeId || !selectedSubjectId || !selectedChapterId) {
      toast.error('Please select grade, subject, and chapter');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Find the selected items for display names
      const selectedGrade = grades.find(g => g.id === selectedGradeId);
      const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
      const selectedChapter = chapters.find(c => c.id === selectedChapterId);

      if (!selectedGrade || !selectedSubject || !selectedChapter) {
        throw new Error('Selected items not found');
      }

      const request = {
        subject: selectedSubject.name,
        grade: selectedGrade.name,
        chapter: selectedChapter.name,
        sessions: parseInt(sessions),
        session_duration: parseInt(sessionDuration),
        // Include IDs for potential database saving
        subject_id: selectedSubjectId,
        grade_id: selectedGradeId,
        chapter_id: selectedChapterId,
      };

      // Use the new simplified endpoint
      const response = await lessonPlanApi.generateSimpleLessonPlan(request);
      
      if (response.success) {
        setGeneratedPlan(response);
        toast.success('Lesson plan generated successfully!');
      } else {
        throw new Error(response.message || 'Failed to generate lesson plan');
      }
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      let errorMessage = 'Failed to generate lesson plan. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Unable to connect to the lesson plan API. Using demo data for preview.';
          
          // Use mock data as fallback
          const mockResponse = {
            ...mockApiResponse,
            data: {
              ...mockApiResponse.data,
              session_details: mockApiResponse.data.session_details.slice(0, parseInt(sessions))
            }
          } as LessonPlanResponse;
          
          setGeneratedPlan(mockResponse);
          toast.success('Demo lesson plan generated (API offline)');
          return;
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    toast.success('Lesson plan copied to clipboard!');
  };

  const handleDownload = () => {
    toast.success('Lesson plan downloaded!');
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Plan Configuration
            </h2>
          </div>
        </div>

        {error && (
          <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-red-900/50 border-red-800' : 'bg-red-50 border-red-200'} border flex items-center gap-2`}>
            <AlertCircle className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
              {error}
            </span>
          </div>
        )}

        <div className="space-y-4">
          {/* Grade Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Grade Level
            </label>
            <div className="relative">
              <select
                value={selectedGradeId}
                onChange={(e) => handleGradeChange(e.target.value)}
                disabled={isLoadingGrades}
                className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoadingGrades ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {isLoadingGrades ? 'Loading grades...' : 'Select grade...'}
                </option>
                {(() => {
                  
                  if (!Array.isArray(grades)) {
                    console.error('❌ ERROR - grades is not an array in render!', grades);
                    return null;
                  }
                  
                  return grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ));
                })()}
              </select>
              {isLoadingGrades && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          {/* Subject Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Subject
            </label>
            <div className="relative">
              <select
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                disabled={!selectedGradeId || isLoadingSubjects}
                className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500 ${(!selectedGradeId || isLoadingSubjects) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {!selectedGradeId ? 'Select grade first...' : 
                   isLoadingSubjects ? 'Loading subjects...' : 
                   'Select subject...'}
                </option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {isLoadingSubjects && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          {/* Chapter Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Chapter
            </label>
            <div className="relative">
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                disabled={!selectedSubjectId || isLoadingChapters}
                className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500 ${(!selectedSubjectId || isLoadingChapters) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {!selectedSubjectId ? 'Select subject first...' : 
                   isLoadingChapters ? 'Loading chapters...' : 
                   'Select chapter...'}
                </option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.name}
                  </option>
                ))}
              </select>
              {isLoadingChapters && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Number of Sessions
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={sessions}
              onChange={(e) => setSessions(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Session Duration (minutes)
            </label>
            <select
              value={sessionDuration}
              onChange={(e) => setSessionDuration(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </select>
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
            disabled={!selectedGradeId || !selectedSubjectId || !selectedChapterId || isGenerating}
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
                    {chapters.find(c => c.id === selectedChapterId)?.name} - {subjects.find(s => s.id === selectedSubjectId)?.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                      {grades.find(g => g.id === selectedGradeId)?.name}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'}`}>
                      {generatedPlan.data.session_details.length} Session{generatedPlan.data.session_details.length > 1 ? 's' : ''}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                      {sessionDuration} min each
                    </span>
                  </div>
                  
                  {/* Overall Objectives */}
                  {generatedPlan.data.overall_objectives && generatedPlan.data.overall_objectives.length > 0 && (
                    <div className="mb-4">
                      <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Overall Learning Objectives
                      </h3>
                      <ul className={`list-disc list-inside space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {generatedPlan.data.overall_objectives.map((objective, i) => (
                          <li key={i}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {generatedPlan.data.prerequisites && generatedPlan.data.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Prerequisites
                      </h3>
                      <ul className={`list-disc list-inside space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {generatedPlan.data.prerequisites.map((prerequisite, i) => (
                          <li key={i}>{prerequisite}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleCopy}
                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleDownload}
                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {generatedPlan.data.session_details.map((session, index: number) => (
              <div key={index} className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'} flex items-center justify-center text-white font-bold`}>
                    {session.session_number}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Session {session.session_number}
                    </h3>
                    <div className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Clock className="w-4 h-4" />
                      {sessionDuration} minutes
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Topics Covered */}
                  {session.topics_covered && session.topics_covered.length > 0 && (
                    <div>
                      <div className={`flex items-center gap-2 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <BookOpen className="w-4 h-4" />
                        <h4 className="font-medium">Topics Covered</h4>
                      </div>
                      <ul className={`ml-6 space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {session.topics_covered.map((topic: string, i: number) => (
                          <li key={i} className="list-disc">{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Learning Objectives */}
                  {session.learning_objectives && session.learning_objectives.length > 0 && (
                    <div>
                      <div className={`flex items-center gap-2 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <Target className="w-4 h-4" />
                        <h4 className="font-medium">Learning Objectives</h4>
                      </div>
                      <ul className={`ml-6 space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {session.learning_objectives.map((obj: string, i: number) => (
                          <li key={i} className="list-disc">{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Teaching Flow */}
                  {session.teaching_flow && session.teaching_flow.length > 0 && (
                    <div>
                      <div className={`flex items-center gap-2 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <ListChecks className="w-4 h-4" />
                        <h4 className="font-medium">Teaching Flow</h4>
                      </div>
                      <div className="space-y-3">
                        {session.teaching_flow.map((flow, i: number) => (
                          <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className="flex items-start gap-3">
                              <span className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} min-w-[80px] text-sm`}>
                                {flow.time_slot}
                              </span>
                              <div className="flex-1">
                                <h5 className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {flow.activity}
                                </h5>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {flow.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Learning Outcomes */}
            {generatedPlan.data.learning_outcomes && generatedPlan.data.learning_outcomes.length > 0 && (
              <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Expected Learning Outcomes
                </h3>
                <ul className={`list-disc list-inside space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {generatedPlan.data.learning_outcomes.map((outcome, i) => (
                    <li key={i}>{outcome}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* API Response Info */}
            {generatedPlan.note && (
              <div className={`${cardClass} rounded-2xl border shadow-lg p-4`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong>Note:</strong> {generatedPlan.note}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlanning;