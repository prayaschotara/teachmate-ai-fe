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
import { ROUTES } from "../routes/routes.enum";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  const quickStats = [
    {
      title: "Active Lessons",
      value: "12",
      change: "+3 this week",
      color: "blue",
      icon: GraduationCap,
    },
    {
      title: "Assessments",
      value: "8",
      change: "2 pending review",
      color: "green",
      icon: ClipboardList,
    },
    {
      title: "Student Progress",
      value: "85%",
      change: "+5% improvement",
      color: "purple",
      icon: TrendingUp,
    },
    {
      title: "Content Items",
      value: "156",
      change: "+12 this month",
      color: "orange",
      icon: BookOpen,
    },
  ];

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

  const recentActivities = [
    {
      title: "Mathematics Quiz - Quadratic Equations",
      type: "Assessment",
      time: "2 hours ago",
      status: "completed",
    },
    {
      title: "Physics Lesson Plan - Newton's Laws",
      type: "Lesson Plan",
      time: "1 day ago",
      status: "draft",
    },
    {
      title: "Chemistry Lab Report Template",
      type: "Content",
      time: "2 days ago",
      status: "published",
    },
    {
      title: "Student Progress Review - Grade 10A",
      type: "Report",
      time: "3 days ago",
      status: "completed",
    },
  ];

  const upcomingTasks = [
    {
      title: "Review pending assessments",
      dueDate: "Today",
      priority: "high",
    },
    {
      title: "Prepare lesson plan for tomorrow",
      dueDate: "Tomorrow",
      priority: "medium",
    },
    {
      title: "Update student progress reports",
      dueDate: "This week",
      priority: "low",
    },
  ];

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
        {quickStats.map((stat, index) => {
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
        })}
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
            {recentActivities.map((activity, index) => (
              <div
                key={index}
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
            ))}
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
            {upcomingTasks.map((task, index) => (
              <div
                key={index}
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
            ))}
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
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  Lesson Plans Created
                </span>
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  7/10
                </span>
              </div>
              <div
                className={`w-full bg-gray-200 rounded-full h-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  Assessments Graded
                </span>
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  12/15
                </span>
              </div>
              <div
                className={`w-full bg-gray-200 rounded-full h-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  Parent Reports Sent
                </span>
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  8/12
                </span>
              </div>
              <div
                className={`w-full bg-gray-200 rounded-full h-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: "67%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
