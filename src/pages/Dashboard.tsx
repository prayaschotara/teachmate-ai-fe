import {
  TrendingUp,
  ClipboardList,
  BookOpen,
  MessageCircle,
  Plus,
  ArrowRight,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../stores/themeStore";
import { useAuthStore } from "../stores/authStore";
import { ROUTES } from "../routes/routes.enum";
import { useDashboardStats, useRecentActivities, useUpcomingTasks } from "../services/dashboardApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();

  // Fetch real data using React Query
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useDashboardStats(user?.id || null);
  const { data: recentActivities, isLoading: activitiesLoading } = useRecentActivities(user?.id || null);
  const { data: upcomingTasks, isLoading: tasksLoading } = useUpcomingTasks(user?.id || null);

  // Generate quick stats from real data
  const quickStats = dashboardStats ? [
    {
      title: "Active Lessons",
      value: dashboardStats.activeLessons.toString(),
      change: `${dashboardStats.weeklyProgress.lessonPlansCreated} created this week`,
      color: "blue",
      icon: GraduationCap,
    },
    {
      title: "Assessments",
      value: dashboardStats.totalAssessments.toString(),
      change: `${dashboardStats.pendingAssessments} pending review`,
      color: "green",
      icon: ClipboardList,
    },
    {
      title: "Student Progress",
      value: `${dashboardStats.averageStudentProgress}%`,
      change: "Average performance",
      color: "purple",
      icon: TrendingUp,
    },
    {
      title: "Content Items",
      value: dashboardStats.contentItems.toString(),
      change: "Total resources",
      color: "orange",
      icon: BookOpen,
    },
  ] : [];

  const quickActions = [
    {
      title: "Create Lesson Plan",
      description: "Generate AI-powered lesson plans",
      icon: Calendar,
      color: "blue",
      route: ROUTES.LESSON_PLANNING,
    },
    {
      title: "Browse Content",
      description: "Explore teaching resources",
      icon: BookOpen,
      color: "green",
      route: ROUTES.CONTENT_LIBRARY,
    },
    {
      title: "Create Assessment",
      description: "Design tests and quizzes",
      icon: ClipboardList,
      color: "purple",
      route: ROUTES.ASSESSMENTS,
    },
    {
      title: "Chat with AI",
      description: "Get teaching assistance",
      icon: MessageCircle,
      color: "orange",
      route: ROUTES.ASSISTANT_CHAT,
    },
  ];

  // Use real data or fallback to empty arrays
  const activities = recentActivities || [];
  const tasks = upcomingTasks || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return isDarkMode
          ? "bg-green-900/50 text-green-300"
          : "bg-green-100 text-green-700";
      case "draft":
        return isDarkMode
          ? "bg-yellow-900/50 text-yellow-300"
          : "bg-yellow-100 text-yellow-700";
      case "published":
        return isDarkMode
          ? "bg-blue-900/50 text-blue-300"
          : "bg-blue-100 text-blue-700";
      default:
        return isDarkMode
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return isDarkMode
          ? "bg-red-900/50 text-red-300"
          : "bg-red-100 text-red-700";
      case "medium":
        return isDarkMode
          ? "bg-yellow-900/50 text-yellow-300"
          : "bg-yellow-100 text-yellow-700";
      case "low":
        return isDarkMode
          ? "bg-green-900/50 text-green-300"
          : "bg-green-100 text-green-700";
      default:
        return isDarkMode
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-700";
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: isDarkMode
        ? "from-blue-600 to-cyan-600"
        : "from-blue-500 to-cyan-500",
      green: isDarkMode
        ? "from-green-600 to-emerald-600"
        : "from-green-500 to-emerald-500",
      purple: isDarkMode
        ? "from-purple-600 to-pink-600"
        : "from-purple-500 to-pink-500",
      orange: isDarkMode
        ? "from-orange-600 to-red-600"
        : "from-orange-500 to-red-500",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const cardClass = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome back, Teacher! 👋
        </h1>
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Here's what's happening with your classes today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`${cardClass} rounded-2xl border shadow-lg p-6 animate-pulse`}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-300 mr-4"></div>
                <div>
                  <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          ))
        ) : statsError ? (
          <div className={`${cardClass} rounded-2xl border shadow-lg p-6 col-span-full text-center`}>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Failed to load dashboard statistics
            </p>
          </div>
        ) : (
          quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${cardClass} rounded-2xl border shadow-lg p-6`}
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses(
                      stat.color
                    )} flex items-center justify-center mr-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div
                      className={`text-2xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {stat.title}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-xs font-medium ${
                    stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "green"
                      ? "text-green-600"
                      : stat.color === "purple"
                      ? "text-purple-600"
                      : "text-orange-600"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Quick Actions
            </h2>
            <button
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              } transition-colors`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(action.route)}
                  className={`${cardClass} border rounded-xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getColorClasses(
                      action.color
                    )} flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3
                    className={`font-medium mb-1 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {action.title}
                  </h3>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {action.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Recent Activities
            </h2>
            <button
              onClick={() => navigate(ROUTES.LESSON_PLANNING)}
              className={`flex items-center gap-1 text-sm font-medium ${
                isDarkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              } transition-colors`}
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {activitiesLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={`p-3 border ${isDarkMode ? "border-gray-700" : "border-gray-200"} rounded-lg animate-pulse`}>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-300 rounded w-12"></div>
                  </div>
                </div>
              ))
            ) : activities.length === 0 ? (
              <div className="text-center py-4">
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  No recent activities
                </p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div
                  key={activity._id || index}
                  className={`flex items-center justify-between p-3 border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } rounded-lg`}
                >
                  <div className="flex-1">
                    <h3
                      className={`font-medium text-sm mb-1 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {activity.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {activity.type}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {activity.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <h2
            className={`text-lg font-semibold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Upcoming Tasks
          </h2>
          <div className="space-y-3">
            {tasksLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={`p-3 border ${isDarkMode ? "border-gray-700" : "border-gray-200"} rounded-lg animate-pulse`}>
                  <div className="flex justify-between">
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded w-12"></div>
                  </div>
                </div>
              ))
            ) : tasks.length === 0 ? (
              <div className="text-center py-4">
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  No upcoming tasks
                </p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={task._id || index}
                  className={`flex items-center justify-between p-3 border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } rounded-lg`}
                >
                  <div>
                    <h3
                      className={`font-medium text-sm mb-1 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Due: {task.dueDate}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <h2
            className={`text-lg font-semibold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            This Week's Progress
          </h2>
          <div className="space-y-4">
            {statsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex justify-between text-sm mb-2">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="h-4 bg-gray-300 rounded w-12"></div>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div className="bg-gray-400 h-2 rounded-full w-1/2"></div>
                  </div>
                </div>
              ))
            ) : dashboardStats ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      Lesson Plans Created
                    </span>
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {dashboardStats.weeklyProgress.lessonPlansCreated}/{dashboardStats.weeklyProgress.totalLessonPlansTarget}
                    </span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((dashboardStats.weeklyProgress.lessonPlansCreated / dashboardStats.weeklyProgress.totalLessonPlansTarget) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      Assessments Graded
                    </span>
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {dashboardStats.weeklyProgress.assessmentsGraded}/{dashboardStats.weeklyProgress.totalAssessmentsToGrade}
                    </span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ 
                        width: `${dashboardStats.weeklyProgress.totalAssessmentsToGrade > 0 ? Math.min((dashboardStats.weeklyProgress.assessmentsGraded / dashboardStats.weeklyProgress.totalAssessmentsToGrade) * 100, 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      Parent Reports Sent
                    </span>
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {dashboardStats.weeklyProgress.parentReportsSent}/{dashboardStats.weeklyProgress.totalParentReports}
                    </span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ 
                        width: `${dashboardStats.weeklyProgress.totalParentReports > 0 ? Math.min((dashboardStats.weeklyProgress.parentReportsSent / dashboardStats.weeklyProgress.totalParentReports) * 100, 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  No progress data available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
