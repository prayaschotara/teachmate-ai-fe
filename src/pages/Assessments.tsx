import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import {
  useAssessments,
  useAssessmentStats,
  useCreateAssessment,
  useDeleteAssessment,
  type CreateAssessmentRequest,
} from '../services/assessmentApi';
import {
  getGrades,
  getSubjectsByGrade,
  getChaptersBySubjectAndGrade,
  type Grade,
  type Subject,
  type Chapter,
} from '../services/hierarchicalApi';
import toast from 'react-hot-toast';

const authStore = JSON.parse(localStorage.getItem('auth-storage') || '{}');
const TEACHER_ID = authStore.state.user.id


const Assessments = () => {
  const { isDarkMode } = useThemeStore();
  
  // API hooks
  const { data: assessments = [], isLoading: isLoadingAssessments, refetch: refetchAssessments } = useAssessments(TEACHER_ID);
  const { data: stats } = useAssessmentStats(TEACHER_ID);
  const createAssessmentMutation = useCreateAssessment();
  const deleteAssessmentMutation = useDeleteAssessment();

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form state for creating new assessment
  const [selectedGradeId, setSelectedGradeId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState("10");
  const [duration, setDuration] = useState("30");
  const [opensOn, setOpensOn] = useState("");
  const [dueDate, setDueDate] = useState("");

  // API data state
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Loading states
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Load grades on component mount
  useEffect(() => {
    loadGrades();
  }, []);

  // Disable page scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const loadGrades = async () => {
    setIsLoadingGrades(true);
    try {
      const gradesData = await getGrades();
      setGrades(gradesData);
    } catch (error) {
      console.error("Failed to load grades:", error);
      toast.error("Failed to load grades");
    } finally {
      setIsLoadingGrades(false);
    }
  };

  // Load subjects when grade is selected
  useEffect(() => {
    if (!selectedGradeId) {
      setSubjects([]);
      setSelectedSubjectId("");
      return;
    }

    const loadSubjects = async () => {
      setIsLoadingSubjects(true);
      try {
        const subjectsData = await getSubjectsByGrade(selectedGradeId);
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Failed to load subjects:", error);
        toast.error("Failed to load subjects for selected grade");
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
      setSelectedChapterId("");
      return;
    }

    const loadChapters = async () => {
      setIsLoadingChapters(true);
      try {
        const chaptersData = await getChaptersBySubjectAndGrade(
          selectedSubjectId,
          selectedGradeId
        );
        setChapters(chaptersData);
      } catch (error) {
        console.error("Failed to load chapters:", error);
        toast.error("Failed to load chapters for selected subject");
      } finally {
        setIsLoadingChapters(false);
      }
    };

    loadChapters();
  }, [selectedSubjectId, selectedGradeId]);

  // Helper function to safely format dates
  const formatDate = (dateValue: unknown): string => {
    try {
      if (typeof dateValue === 'string') {
        return new Date(dateValue).toLocaleDateString();
      } else if (dateValue && typeof dateValue === 'object' && '$date' in dateValue) {
        return new Date((dateValue as { $date: string }).$date).toLocaleDateString();
      } else {
        return new Date().toLocaleDateString();
      }
    } catch {
      return new Date().toLocaleDateString();
    }
  };

  const handleCreateAssessment = async () => {
    if (!selectedGradeId || !selectedSubjectId || !title.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate dates if provided
    if (opensOn && dueDate) {
      const opensOnDate = new Date(opensOn);
      const dueDateObj = new Date(dueDate);
      
      if (dueDateObj <= opensOnDate) {
        toast.error('Due date must be after opening date');
        return;
      }
    }

    setIsCreating(true);

    try {
      const selectedGrade = grades.find((g) => g.id === selectedGradeId);
      const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

      if (!selectedGrade || !selectedSubject) {
        throw new Error("Selected items not found");
      }

      const request: CreateAssessmentRequest = {
        title: title.trim(),
        subject_id: selectedSubjectId,
        grade_id: selectedGradeId,
        chapter_id: selectedChapterId || undefined,
        questions: parseInt(questions),
        duration: parseInt(duration),
        opens_on: opensOn || undefined,
        due_date: dueDate || undefined,
        teacher_id: TEACHER_ID,
      };

      await createAssessmentMutation.mutateAsync(request);

      // Close drawer and reset form
      setIsDrawerOpen(false);
      resetForm();

      // Refresh assessments
      refetchAssessments();

      toast.success("Assessment created successfully!");
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast.error("Failed to create assessment. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedGradeId("");
    setSelectedSubjectId("");
    setSelectedChapterId("");
    setTitle("");
    setQuestions("10");
    setDuration("30");
    setOpensOn("");
    setDueDate("");
    setSubjects([]);
    setChapters([]);
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (!confirm("Are you sure you want to delete this assessment?")) {
      return;
    }

    try {
      await deleteAssessmentMutation.mutateAsync(assessmentId);
      refetchAssessments();
      toast.success("Assessment deleted successfully!");
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error("Failed to delete assessment");
    }
  };

  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputClass = isDarkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

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
        {/* <button 
          onClick={() => setIsDrawerOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Assessment
        </button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Assessments', value: stats?.total?.toString() || '0', color: 'blue' },
          { label: 'Published', value: stats?.published?.toString() || '0', color: 'green' },
          { label: 'Drafts', value: stats?.drafts?.toString() || '0', color: 'yellow' },
          { label: 'This Month', value: stats?.thisMonth?.toString() || '0', color: 'purple' },
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
        
        {isLoadingAssessments ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : assessments.length === 0 ? (
          <div className="p-12 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-blue-100"} flex items-center justify-center`}>
              <ClipboardList className={`w-10 h-10 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              No Assessments Yet
            </h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
              Create your first assessment to get started.
            </p>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Your First Assessment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {assessments.map((assessment) => (
              <div key={assessment._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
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
                      {assessment.questions} questions • {assessment.duration} min • Created {formatDate(assessment.createdAt)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteAssessment(assessment._id)}
                      disabled={deleteAssessmentMutation.isPending}
                      className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-100 text-red-600'} transition-colors disabled:opacity-50`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Create Assessment Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden !mt-[-10px]">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={!isCreating ? () => setIsDrawerOpen(false) : undefined}
            style={{ cursor: isCreating ? 'not-allowed' : 'pointer' }}
          />
          <div className={`absolute right-0 top-0 h-full w-[500px] ${cardClass} shadow-2xl transform transition-transform duration-300 ease-in-out`}>
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Create New Assessment
                </h2>
                <button
                  onClick={!isCreating ? () => setIsDrawerOpen(false) : undefined}
                  disabled={isCreating}
                  className={`p-2 rounded-lg transition-colors ${isCreating
                      ? 'opacity-50 cursor-not-allowed'
                      : isDarkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-100'
                    }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {/* Assessment Title */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Assessment Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={isCreating}
                      placeholder="e.g., Mathematics Quiz - Quadratic Equations"
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {/* Grade Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Grade Level *
                    </label>
                    <select
                      value={selectedGradeId}
                      onChange={(e) => setSelectedGradeId(e.target.value)}
                      disabled={isLoadingGrades || isCreating}
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">
                        {isLoadingGrades ? "Loading grades..." : "Select grade..."}
                      </option>
                      {grades.map((grade) => (
                        <option key={grade.id} value={grade.id}>
                          {grade.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Subject *
                    </label>
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      disabled={!selectedGradeId || isLoadingSubjects || isCreating}
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">
                        {!selectedGradeId ? "Select grade first..." : isLoadingSubjects ? "Loading subjects..." : "Select subject..."}
                      </option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chapter Selection (Optional) */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Chapter (Optional)
                    </label>
                    <select
                      value={selectedChapterId}
                      onChange={(e) => setSelectedChapterId(e.target.value)}
                      disabled={!selectedSubjectId || isLoadingChapters || isCreating}
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">
                        {!selectedSubjectId ? "Select subject first..." : isLoadingChapters ? "Loading chapters..." : "Select chapter (optional)..."}
                      </option>
                      {chapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Number of Questions */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={questions}
                      onChange={(e) => setQuestions(e.target.value)}
                      disabled={isCreating}
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Duration (minutes)
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      disabled={isCreating}
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>

                  {/* Opens On (Optional) */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Opens On (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={opensOn}
                      onChange={(e) => setOpensOn(e.target.value)}
                      disabled={isCreating}
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {/* Due Date (Optional) */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Due Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      disabled={isCreating}
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCreateAssessment}
                  disabled={!selectedGradeId || !selectedSubjectId || !title.trim() || isCreating}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Assessment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessments;