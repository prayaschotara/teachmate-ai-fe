import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Clock,
  Target,
  ListChecks,
  X,
  ChevronDown,
  ChevronRight,
  FileText,
  Calendar,
  CheckCircle,
  FileCheck,
} from "lucide-react";
import { useThemeStore } from "../stores/themeStore";
import {
  generateLessonPlan,
  getLessonPlans,
  markSessionComplete,
  createSessionAssessment,
  type LessonPlan,
  type LessonPlanRequest,
  type SessionDetail,
  getIdString,
} from "../services/lessonPlanApi";
import {
  getGrades,
  getSubjectsByGrade,
  getChaptersBySubjectAndGrade,
  type Grade,
  type Subject,
  type Chapter,
} from "../services/hierarchicalApi";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";

const authStore = JSON.parse(localStorage.getItem('auth-storage') || '{}');
const TEACHER_ID = authStore.state.user.id

const LessonPlanning = () => {
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

  // State for lesson plans
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [selectedSession, setSelectedSession] = useState<SessionDetail | null>(null);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form state for generating new plan
  const [selectedGradeId, setSelectedGradeId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [sessions, setSessions] = useState("3");
  const [sessionDuration, setSessionDuration] = useState("45");

  // API data state
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Loading states
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completingSession, setCompletingSession] = useState<number | null>(null);
  const [creatingAssessment, setCreatingAssessment] = useState<number | null>(null);

  // Session modal state
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set());

  // Assessment modal state
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedSessionForAssessment, setSelectedSessionForAssessment] = useState<number | null>(null);
  const [assessmentConfig, setAssessmentConfig] = useState({
    opens_on: '',
    due_date: '',
    duration: 60,
    class_id: ''
  });

  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();

  // Load lesson plans on component mount
  useEffect(() => {
    loadLessonPlans();
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

  const loadLessonPlans = async () => {
    setIsLoadingPlans(true);
    try {
      const plans = await getLessonPlans(TEACHER_ID);
      setLessonPlans(Array.isArray(plans) ? plans : []);
    } catch (error) {
      console.error("Failed to load lesson plans:", error);
      toast.error("Failed to load lesson plans");
      setLessonPlans([]); // Ensure we always have an array
    } finally {
      setIsLoadingPlans(false);
    }
  };

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

  const handleGeneratePlan = async () => {
    if (!selectedGradeId || !selectedSubjectId || !selectedChapterId) {
      toast.error("Please select grade, subject, and chapter");
      return;
    }

    setIsGenerating(true);

    try {
      const selectedGrade = grades.find((g) => g.id === selectedGradeId);
      const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
      const selectedChapter = chapters.find((c) => c.id === selectedChapterId);

      if (!selectedGrade || !selectedSubject || !selectedChapter) {
        throw new Error("Selected items not found");
      }

      const request: LessonPlanRequest = {
        subject_name: selectedSubject.name,
        grade_name: selectedGrade.name,
        topic: selectedChapter.name,
        sessions: parseInt(sessions),
        session_duration: parseInt(sessionDuration),
        chapter_number: selectedChapter.chapter_number || 101,
        subject_id: selectedSubjectId,
        teacher_id: TEACHER_ID,
        grade_id: selectedGradeId,
        chapter_id: selectedChapterId,
      };

      const newPlan = await generateLessonPlan(request);

      // Close drawer and reset form first
      setIsDrawerOpen(false);
      resetForm();

      // Reload lesson plans from server to ensure consistency
      try {
        await loadLessonPlans();
      } catch (refreshError) {
        console.warn("Failed to refresh lesson plans:", refreshError);
        // If refresh fails, at least add the new plan to local state
        const normalizedPlan = {
          ...newPlan,
          createdAt: newPlan.createdAt || { $date: new Date().toISOString() },
          updatedAt: newPlan.updatedAt || { $date: new Date().toISOString() },
          _id: newPlan._id || { $oid: Date.now().toString() }
        };
        setLessonPlans(prev => [normalizedPlan, ...prev]);
      }

      toast.success("Lesson plan generated successfully!");
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      toast.error("Failed to generate lesson plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setSelectedGradeId("");
    setSelectedSubjectId("");
    setSelectedChapterId("");
    setSessions("3");
    setSessionDuration("45");
    setSubjects([]);
    setChapters([]);
  };

  const handleSessionClick = (session: SessionDetail) => {
    setSelectedSession(session);
  };

  const toggleResourceExpansion = (key: string) => {
    const newExpanded = new Set(expandedResources);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedResources(newExpanded);
  };

  const handleMarkSessionComplete = async (sessionNumber: number) => {
    if (!selectedPlan) return;

    setCompletingSession(sessionNumber);
    try {
      console.log("session", selectedPlan)
      await markSessionComplete(getIdString(selectedPlan._id), sessionNumber);
      
      // Update the local state to reflect the completion
      setSelectedPlan(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          session_details: prev.session_details.map(session => 
            session.session_number === sessionNumber 
              ? { ...session, is_completed: true, completed_at: new Date().toISOString() }
              : session
          )
        };
      });

      // Also update the lesson plans list
      setLessonPlans(prev => prev.map(plan => 
        plan._id === selectedPlan._id
          ? {
              ...plan,
              session_details: plan.session_details.map(session => 
                session.session_number === sessionNumber 
                  ? { ...session, is_completed: true, completed_at: new Date().toISOString() }
                  : session
              )
            }
          : plan
      ));

      toast.success(`Session ${sessionNumber} marked as complete!`);
    } catch (error) {
      console.error('Error marking session complete:', error);
      toast.error('Failed to mark session as complete');
    } finally {
      setCompletingSession(null);
    }
  };

  const handleOpenAssessmentModal = (sessionNumber: number) => {
    setSelectedSessionForAssessment(sessionNumber);
    // Set default dates
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Set default class_id to first class if available
    const defaultClassId = user?.classes && user.classes.length > 0 ? user.classes[0]._id : '';
    
    setAssessmentConfig({
      opens_on: tomorrow.toISOString().slice(0, 16),
      due_date: nextWeek.toISOString().slice(0, 16),
      duration: 60,
      class_id: defaultClassId
    });
    setShowAssessmentModal(true);
  };

  const handleCreateAssessment = async () => {
    if (!selectedPlan || selectedSessionForAssessment === null) return;

    // Validate required fields
    if (!assessmentConfig.class_id) {
      toast.error('Please select a class');
      return;
    }

    // Validate dates
    const opensOn = new Date(assessmentConfig.opens_on);
    const dueDate = new Date(assessmentConfig.due_date);
    
    if (dueDate <= opensOn) {
      toast.error('Due date must be after opening date');
      return;
    }

    setCreatingAssessment(selectedSessionForAssessment);
    try {
      const config = {
        opens_on: new Date(assessmentConfig.opens_on).toISOString(),
        due_date: new Date(assessmentConfig.due_date).toISOString(),
        duration: assessmentConfig.duration,
        class_id: assessmentConfig.class_id
      };

      const result = await createSessionAssessment(
        getIdString(selectedPlan._id), 
        selectedSessionForAssessment,
        config
      );
      
      if (result.success) {
        // Update the local state to reflect the assessment creation
        setSelectedPlan(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            session_details: prev.session_details.map(session => 
              session.session_number === selectedSessionForAssessment 
                ? { ...session, has_assessment: true, assessment_id: result.assessment_id }
                : session
            )
          };
        });

        // Also update the lesson plans list
        setLessonPlans(prev => prev.map(plan => 
          plan._id === selectedPlan._id
            ? {
                ...plan,
                session_details: plan.session_details.map(session => 
                  session.session_number === selectedSessionForAssessment 
                    ? { ...session, has_assessment: true, assessment_id: result.assessment_id }
                    : session
                )
              }
            : plan
        ));

        toast.success(`Assessment created for Session ${selectedSessionForAssessment}!`);
        if (result.assessment_id) {
          toast.success(`Assessment ID: ${result.assessment_id}`);
        }
        setShowAssessmentModal(false);
        setSelectedSessionForAssessment(null);
      } else {
        toast.error(result.message || 'Failed to create assessment');
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast.error('Failed to create assessment');
    } finally {
      setCreatingAssessment(null);
    }
  };

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Helper function to check if URL is a YouTube video
  const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const cardClass = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const inputClass = isDarkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

  return (
    <div className="relative">
      {/* Header with Create Plan Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Lesson Planning
          </h1>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Generate and manage your lesson plans
          </p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Generate Plan
        </button>
      </div>

      {/* Main Content */}
      {selectedPlan ? (
        // Plan Details View
        <div className="space-y-6">
          {/* Back Button - Above Header */}
          <button
            onClick={() => setSelectedPlan(null)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/20" : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"}`}
          >
            ← Back to Plans
          </button>

          {/* Plan Header */}
          <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {selectedPlan.chapter_name} - {selectedPlan.subject_name}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700"}`}>
                    Grade {selectedPlan.grade_name}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
                    {selectedPlan.total_sessions} Sessions
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-700"}`}>
                    {selectedPlan.session_duration} min each
                  </span>
                </div>

                {/* Overall Objectives */}
                {selectedPlan.overall_objectives && selectedPlan.overall_objectives.length > 0 && (
                  <div className="mb-4">
                    <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Overall Learning Objectives
                    </h3>
                    <ul className={`list-disc list-inside space-y-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {selectedPlan.overall_objectives.map((objective, i) => (
                        <li key={i}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Session Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedPlan.session_details.map((session, index) => (
              <div
                key={index}
                className={`${cardClass} rounded-xl border shadow-lg p-4 transition-all duration-200 ${
                  session.is_completed 
                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700' 
                    : ''
                }`}
              >
                {/* Session Header */}
                <div 
                  onClick={() => handleSessionClick(session)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full ${
                      session.is_completed 
                        ? "bg-gradient-to-br from-green-600 to-green-700" 
                        : isDarkMode 
                        ? "bg-gradient-to-br from-blue-600 to-cyan-600" 
                        : "bg-gradient-to-br from-blue-500 to-cyan-500"
                    } flex items-center justify-center text-white font-bold text-sm relative`}>
                      {session.is_completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        session.session_number
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          Session {session.session_number}
                        </h3>
                        {session.is_completed && (
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        <Clock className="w-3 h-3" />
                        {selectedPlan.session_duration} minutes
                        {session.completed_at && (
                          <span className="ml-2">
                            • Completed: {new Date(session.completed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Topics Preview */}
                  {session.topics_covered && session.topics_covered.length > 0 && (
                    <div className="mb-3">
                      <h4 className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Topics
                      </h4>
                      <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} line-clamp-2`}>
                        {session.topics_covered.slice(0, 2).join(", ")}
                        {session.topics_covered.length > 2 && "..."}
                      </p>
                    </div>
                  )}

                  {/* Objectives Preview */}
                  {session.learning_objectives && session.learning_objectives.length > 0 && (
                    <div className="mb-3">
                      <h4 className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Objectives
                      </h4>
                      <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} line-clamp-2`}>
                        {session.learning_objectives[0]}
                        {session.learning_objectives.length > 1 && "..."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {!session.is_completed ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkSessionComplete(session.session_number);
                      }}
                      disabled={completingSession === session.session_number}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        completingSession === session.session_number
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isDarkMode
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      {completingSession === session.session_number ? (
                        <>
                          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                          Completing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Mark Complete
                        </>
                      )}
                    </button>
                  ) : session.has_assessment ? (
                    <div className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FileCheck className="w-3 h-3" />
                      Assessment Created
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAssessmentModal(session.session_number);
                      }}
                      disabled={creatingAssessment === session.session_number}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        creatingAssessment === session.session_number
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isDarkMode
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      }`}
                    >
                      {creatingAssessment === session.session_number ? (
                        <>
                          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-3 h-3" />
                          Generate Assessment
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Plans List View
        <div>
          {isLoadingPlans ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : lessonPlans.length === 0 ? (
            <div className={`${cardClass} rounded-2xl border shadow-lg p-12 text-center`}>
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-blue-100"} flex items-center justify-center`}>
                <BookOpen className={`w-10 h-10 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                No Lesson Plans Yet
              </h3>
              <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
                Generate your first lesson plan to get started.
              </p>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Generate Your First Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessonPlans.map((plan) => (
                <div
                  key={getIdString(plan._id)}
                  onClick={() => setSelectedPlan(plan)}
                  className={`${cardClass} rounded-xl border shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105`}
                >
                  <div className="mb-4">
                    <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {plan.chapter_name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-3`}>
                      {plan.subject_name} • Grade {plan.grade_name}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${isDarkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700"}`}>
                        {plan.total_sessions} Sessions
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${isDarkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
                        {plan.session_duration} min
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <div className={`flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        <Calendar className="w-3 h-3" />
                        {formatDate(plan.createdAt)}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${plan.status === 'Draft' ? (isDarkMode ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-100 text-yellow-700") : (isDarkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700")}`}>
                      {plan.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Generate Plan Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={!isGenerating ? () => setIsDrawerOpen(false) : undefined}
            style={{ cursor: isGenerating ? 'not-allowed' : 'pointer' }}
          />
          <div className={`absolute right-0 top-0 h-full w-[500px] ${cardClass} shadow-2xl transform transition-transform duration-300 ease-in-out`}>
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Generate New Plan
                </h2>
                <button
                  onClick={!isGenerating ? () => setIsDrawerOpen(false) : undefined}
                  disabled={isGenerating}
                  className={`p-2 rounded-lg transition-colors ${isGenerating
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
                  {/* Grade Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Grade Level
                    </label>
                    <select
                      value={selectedGradeId}
                      onChange={(e) => setSelectedGradeId(e.target.value)}
                      disabled={isLoadingGrades || isGenerating}
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
                      Subject
                    </label>
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      disabled={!selectedGradeId || isLoadingSubjects || isGenerating}
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

                  {/* Chapter Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Chapter
                    </label>
                    <select
                      value={selectedChapterId}
                      onChange={(e) => setSelectedChapterId(e.target.value)}
                      disabled={!selectedSubjectId || isLoadingChapters || isGenerating}
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">
                        {!selectedSubjectId ? "Select subject first..." : isLoadingChapters ? "Loading chapters..." : "Select chapter..."}
                      </option>
                      {chapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sessions */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Number of Sessions
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={sessions}
                      onChange={(e) => setSessions(e.target.value)}
                      disabled={isGenerating}
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {/* Session Duration */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Session Duration (minutes)
                    </label>
                    <select
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(e.target.value)}
                      disabled={isGenerating}
                      className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleGeneratePlan}
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
                      <Plus className="w-5 h-5" />
                      Generate Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedSession(null)} />
            <div className={`relative ${cardClass} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Session {selectedSession.session_number} Details
                  </h2>
                  <div className={`flex items-center gap-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <Clock className="w-4 h-4" />
                    {selectedPlan?.session_duration} minutes
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Topics Covered */}
                  {selectedSession.topics_covered && selectedSession.topics_covered.length > 0 && (
                    <div>
                      <div className={`flex items-center gap-2 mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <BookOpen className="w-5 h-5" />
                        <h3 className="font-semibold">Topics Covered</h3>
                      </div>
                      <ul className={`ml-7 space-y-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {selectedSession.topics_covered.map((topic, i) => (
                          <li key={i} className="list-disc">{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Learning Objectives */}
                  {selectedSession.learning_objectives && selectedSession.learning_objectives.length > 0 && (
                    <div>
                      <div className={`flex items-center gap-2 mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <Target className="w-5 h-5" />
                        <h3 className="font-semibold">Learning Objectives</h3>
                      </div>
                      <ul className={`ml-7 space-y-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {selectedSession.learning_objectives.map((obj, i) => (
                          <li key={i} className="list-disc">{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Teaching Flow */}
                  {selectedSession.teaching_flow && selectedSession.teaching_flow.length > 0 && (
                    <div>
                      <div className={`flex items-center gap-2 mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <ListChecks className="w-5 h-5" />
                        <h3 className="font-semibold">Teaching Flow</h3>
                      </div>
                      <div className="space-y-3">
                        {selectedSession.teaching_flow.map((flow, i) => (
                          <div key={i} className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                            <div className="flex items-start gap-3">
                              <span className={`font-medium ${isDarkMode ? "text-blue-400" : "text-blue-600"} min-w-[80px] text-sm`}>
                                {flow.time_slot}
                              </span>
                              <div className="flex-1">
                                <h4 className={`font-medium text-sm mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {flow.activity}
                                </h4>
                                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  {flow.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources Section */}
                  <div>
                    <div className={`flex items-center gap-2 mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <FileText className="w-5 h-5" />
                      <h3 className="font-semibold">Resources</h3>
                    </div>

                    {selectedSession.resources && ((selectedSession.resources.videos?.length ?? 0) > 0 || (selectedSession.resources.simulations?.length ?? 0) > 0) ? (
                      <div className="space-y-4">
                        {/* Videos Section */}
                        {selectedSession.resources.videos && selectedSession.resources.videos.length > 0 && (
                          <div>
                            <h4 className={`font-medium text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              📹 Videos ({selectedSession.resources.videos.length})
                            </h4>
                            <div className="space-y-2">
                              {selectedSession.resources.videos.map((video, i) => (
                                <div key={i} className={`border rounded-lg ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                                  <button
                                    onClick={() => toggleResourceExpansion(`video-${i}`)}
                                    className={`w-full flex items-center justify-between p-3 text-left ${isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"} transition-colors`}
                                  >
                                    <div className="flex-1">
                                      <span className={`font-medium text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                        {video.title}
                                      </span>
                                      <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} mt-1`}>
                                        {video.source} • {video.duration}
                                      </div>
                                    </div>
                                    {expandedResources.has(`video-${i}`) ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </button>
                                  {expandedResources.has(`video-${i}`) && (
                                    <div className={`p-3 border-t ${isDarkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}>
                                      <div className="space-y-3">
                                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                          <strong>Topic:</strong> {video.topic}
                                        </p>
                                        
                                        {/* YouTube Iframe or External Link */}
                                        {isYouTubeUrl(video.url) ? (
                                          <div className="space-y-2">
                                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                              <iframe
                                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.url)}?rel=0&modestbranding=1`}
                                                title={video.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                              />
                                            </div>
                                            <a
                                              href={video.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"} transition-colors`}
                                            >
                                              🔗 Open on YouTube
                                            </a>
                                          </div>
                                        ) : (
                                          <a
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded ${isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-100 hover:bg-blue-200 text-blue-700"} transition-colors`}
                                          >
                                            🎥 Watch Video
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Simulations Section */}
                        {selectedSession.resources.simulations && selectedSession.resources.simulations.length > 0 && (
                          <div>
                            <h4 className={`font-medium text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              🧪 Simulations ({selectedSession.resources.simulations.length})
                            </h4>
                            <div className="space-y-2">
                              {selectedSession.resources.simulations.map((simulation, i) => (
                                <div key={i} className={`border rounded-lg ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                                  <button
                                    onClick={() => toggleResourceExpansion(`simulation-${i}`)}
                                    className={`w-full flex items-center justify-between p-3 text-left ${isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"} transition-colors`}
                                  >
                                    <div className="flex-1">
                                      <span className={`font-medium text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                        {simulation.title}
                                      </span>
                                      <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} mt-1`}>
                                        {simulation.type}
                                      </div>
                                    </div>
                                    {expandedResources.has(`simulation-${i}`) ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </button>
                                  {expandedResources.has(`simulation-${i}`) && (
                                    <div className={`p-3 border-t ${isDarkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}>
                                      <div className="space-y-2">
                                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                          <strong>Topic:</strong> {simulation.topic}
                                        </p>
                                        <a
                                          href={simulation.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded ${isDarkMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-100 hover:bg-green-200 text-green-700"} transition-colors`}
                                        >
                                          🚀 Open Simulation
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700/30" : "bg-gray-50"} text-center`}>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          No resources available for this session yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Configuration Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => !creatingAssessment && setShowAssessmentModal(false)} />
            <div className={`relative ${cardClass} rounded-2xl shadow-2xl max-w-md w-full`}>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Create Assessment
                  </h2>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Session {selectedSessionForAssessment}
                  </p>
                </div>
                <button
                  onClick={() => !creatingAssessment && setShowAssessmentModal(false)}
                  disabled={creatingAssessment !== null}
                  className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors ${creatingAssessment !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {/* Opens On */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Opens On
                  </label>
                  <input
                    type="datetime-local"
                    value={assessmentConfig.opens_on}
                    onChange={(e) => setAssessmentConfig({ ...assessmentConfig, opens_on: e.target.value })}
                    disabled={creatingAssessment !== null}
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={assessmentConfig.due_date}
                    onChange={(e) => setAssessmentConfig({ ...assessmentConfig, due_date: e.target.value })}
                    disabled={creatingAssessment !== null}
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={assessmentConfig.duration}
                    onChange={(e) => setAssessmentConfig({ ...assessmentConfig, duration: parseInt(e.target.value) || 60 })}
                    disabled={creatingAssessment !== null}
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {/* Class Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Class *
                  </label>
                  <select
                    value={assessmentConfig.class_id}
                    onChange={(e) => setAssessmentConfig({ ...assessmentConfig, class_id: e.target.value })}
                    disabled={creatingAssessment !== null}
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select class...</option>
                    {user?.classes?.map((classItem) => (
                      <option key={classItem._id} value={classItem._id}>
                        {classItem.class_name} - {classItem.grade_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowAssessmentModal(false)}
                  disabled={creatingAssessment !== null}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  } ${creatingAssessment !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAssessment}
                  disabled={creatingAssessment !== null || !assessmentConfig.opens_on || !assessmentConfig.due_date || !assessmentConfig.class_id}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {creatingAssessment !== null ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-5 h-5" />
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

export default LessonPlanning;